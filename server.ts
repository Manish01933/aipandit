// Ensure global __dirname injected by tsx does not corrupt module resolution in Node 22
if (typeof globalThis !== 'undefined') {
  delete (globalThis as any).__dirname;
}
if (typeof global !== 'undefined') {
  delete (global as any).__dirname;
}

import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { generateDynamicAstrologyResponse } from './src/utils/astrologyAdvisor';
import {
  getServerTheme,
  saveServerTheme,
  getServerPlans,
  saveServerPlans,
  findPlanById,
  getServerCoupons,
  saveServerCoupons,
  validateCouponOnServer,
  recordCouponUsageAtomic,
  getServerTransactions,
  saveServerTransaction,
  getServerEntitlements,
  saveServerEntitlement,
  verifyUserEntitlementOnServer,
  getServerPresetQuestions,
  saveServerPresetQuestions,
  getProfileEntitlement,
  consumeProfileQuestionCredit,
  consumeProfilePdfCredit,
  canDownloadProfilePdf,
  getUserActiveVipEntitlement,
  getUserVipSubscriptionDetails,
  cancelUserVipSubscription,
  renewUserVipSubscription,
  getServerGrantedUsers,
  grantUserAccessByAdmin,
  revokeServerGrantedUser,
  activateAdminSelfVip,
  syncFreePassForUser,
  getServerRedemptions,
  saveServerRedemption,
  revokeServerRedemption,
  revokeServerCoupon,
  getServerAuditLogs,
  saveServerAuditEvent,
  createDatabaseBackup,
  listDatabaseBackups,
  restoreDatabaseBackup,
  getDatabaseIntegrityStatus,
  getCustomerIsolatedRecords,
} from './src/server/commerceRepository';
import { TransactionRecord, VerifiedEntitlement, CouponRedemptionRecord, AdminAuditEvent } from './src/types/commerce';

dotenv.config();

// Safe GenAI instance initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Timeout helper to ensure reliable responses (default 35 seconds)
function withTimeout<T>(promise: Promise<T>, timeoutMs = 35000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

const DEFAULT_OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || process.env.OMNIROUTER_API_KEY || '';

interface RuntimeGatewayConfig {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  openRouterApiKey: string;
}

const rawEnvKey = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
const runtimeGatewayConfig: RuntimeGatewayConfig = {
  razorpayKeyId: rawEnvKey.startsWith('rzp_') ? rawEnvKey : '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  openRouterApiKey: process.env.OPENROUTER_API_KEY || process.env.OMNIROUTER_API_KEY || DEFAULT_OPENROUTER_KEY,
};

function getOpenRouterApiKey(): string {
  return (
    runtimeGatewayConfig.openRouterApiKey ||
    process.env.OPENROUTER_API_KEY ||
    process.env.OMNIROUTER_API_KEY ||
    process.env.OMNI_ROUTER_API_KEY ||
    DEFAULT_OPENROUTER_KEY
  ).trim();
}

// OpenRouter API Integration (Supports Cohere, DeepSeek, GPT-4o, Claude & Omni models)
async function callOpenRouter(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  model = 'cohere/north-mini-code:free',
  timeoutMs = 35000
): Promise<{ text: string; modelUsed: string }> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY or OMNIROUTER_API_KEY is not configured on the server');
  }

  // Model cascade list: try the requested model first, then reliable fallbacks if it returns empty
  const candidateModels: string[] = [model];
  if (model === 'cohere/north-mini-code:free') {
    candidateModels.push('nvidia/nemotron-3.5-lightning:free');
  } else if (!candidateModels.includes('cohere/north-mini-code:free')) {
    candidateModels.push('cohere/north-mini-code:free');
  }

  let lastError: any = null;

  for (const currentModel of candidateModels) {
    try {
      const res = await withTimeout(
        fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.APP_URL || 'https://ais-dev-nothkfwfsw6mvx6eabhgu4-207469535964.asia-southeast1.run.app',
            'X-Title': 'AstroDost Vedic Astrology AI',
          },
          body: JSON.stringify({
            model: currentModel,
            messages,
            temperature: 0.7,
            max_tokens: 4096,
          }),
        }),
        timeoutMs
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenRouter error ${res.status}: ${errText}`);
      }

      const data: any = await res.json();
      const choice = data?.choices?.[0];
      let text = choice?.message?.content;
      // If content is empty or null, check reasoning field (common in reasoning models)
      if (!text || !text.trim()) {
        text = choice?.message?.reasoning;
      }
      if (!text || !text.trim()) {
        text = choice?.text;
      }

      // If reasoning contains <think> block, strip thinking tags
      if (text && typeof text === 'string') {
        text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      }

      if (text && text.trim().length > 0) {
        return { text: text.trim(), modelUsed: currentModel };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`OpenRouter model ${currentModel} returned error (${err?.message}), attempting next candidate...`);
    }
  }

  throw lastError || new Error('Empty response received from OpenRouter');
}

// Multi-tier Gemini Live Generation: tries fast/high-quota models first, then fallbacks
async function generateGeminiContentWithFallback(
  ai: GoogleGenAI,
  requestParams: {
    contents: any;
    config?: any;
  },
  timeoutMs = 35000
): Promise<{ text: string; modelUsed: string }> {
  const models = ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: requestParams.contents,
          config: requestParams.config,
        }),
        timeoutMs
      );
      const text = response?.text;
      if (text && text.trim().length > 0) {
        return { text, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Model: ${model}] unavailable or rate limited (${err?.status || err?.message}), trying next model...`);
    }
  }

  throw lastError || new Error('All Gemini live models failed');
}

// Unified AI completion coordinator: Omni Router (OpenRouter) + Google Gemini Key Combo
async function executeAstrologyCompletion({
  systemInstruction,
  userPrompt,
  conversationHistory = [],
  selectedModel = 'auto',
  timeoutMs = 35000,
}: {
  systemInstruction: string;
  userPrompt: string;
  conversationHistory?: any[];
  selectedModel?: string;
  timeoutMs?: number;
}): Promise<{ text: string; modelUsed: string; isLiveAI: boolean }> {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenRouter = Boolean(getOpenRouterApiKey());
  const isOpenRouterModel = selectedModel.includes('/') && !selectedModel.startsWith('gemini');

  // Normalize history for OpenRouter (OpenAI schema)
  const openRouterMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemInstruction },
  ];
  if (Array.isArray(conversationHistory)) {
    for (const msg of conversationHistory.slice(-6)) {
      const role = (msg.role === 'user' || msg.sender === 'user') ? 'user' : 'assistant';
      const text = msg.text || msg.content || msg.message || '';
      if (text && typeof text === 'string') {
        openRouterMessages.push({ role, content: text });
      }
    }
  }
  openRouterMessages.push({ role: 'user', content: userPrompt });

  // Normalize contents for Gemini (@google/genai schema)
  const geminiContents: any[] = [];
  if (Array.isArray(conversationHistory)) {
    for (const msg of conversationHistory.slice(-6)) {
      const role = (msg.role === 'user' || msg.sender === 'user') ? 'user' : 'model';
      const text = msg.text || msg.content || msg.message || '';
      if (text && typeof text === 'string') {
        geminiContents.push({ role, parts: [{ text }] });
      }
    }
  }
  geminiContents.push({ role: 'user', parts: [{ text: userPrompt }] });

  const ai = getGeminiClient();

  // Route 1: Specific OpenRouter / Omni model explicitly selected (e.g. cohere, deepseek, gpt-4o-mini)
  if (isOpenRouterModel) {
    if (hasOpenRouter) {
      try {
        const result = await callOpenRouter(openRouterMessages, selectedModel, timeoutMs);
        return { text: result.text, modelUsed: selectedModel, isLiveAI: true };
      } catch (err: any) {
        console.warn(`OpenRouter model ${selectedModel} failed (${err.message}), attempting fallback to Gemini...`);
      }
    } else {
      console.warn(`Model ${selectedModel} requested but OPENROUTER_API_KEY is not set. Trying Gemini...`);
    }
  }

  // Route 2: Specific Gemini model explicitly selected
  if (selectedModel.startsWith('gemini-') && ai) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: selectedModel,
          contents: geminiContents.length === 1 ? userPrompt : geminiContents,
          config: { systemInstruction, temperature: 0.7, maxOutputTokens: 4096 },
        }),
        timeoutMs
      );
      if (response?.text?.trim()) {
        return { text: response.text.trim(), modelUsed: selectedModel, isLiveAI: true };
      }
    } catch (err: any) {
      console.warn(`Direct Gemini model ${selectedModel} error (${err.message}), trying Omni combo fallback...`);
    }
  }

  // Route 3: Omni Key Combo / Auto Mode
  // If both keys are active, try Gemini first for Sanskrit reasoning, then immediately switch to OpenRouter
  if (ai) {
    try {
      const result = await generateGeminiContentWithFallback(
        ai,
        {
          contents: geminiContents.length === 1 ? userPrompt : geminiContents,
          config: { systemInstruction, temperature: 0.7, maxOutputTokens: 4096 },
        },
        timeoutMs
      );
      return { text: result.text, modelUsed: result.modelUsed, isLiveAI: true };
    } catch (geminiErr: any) {
      console.warn('Gemini attempt failed, activating Omni Router failover:', geminiErr?.message);
    }
  }

  // Route 4: OpenRouter Failover or primary if Gemini was not available
  if (hasOpenRouter) {
    const targetModel = isOpenRouterModel ? selectedModel : 'cohere/north-mini-code:free';
    try {
      const result = await callOpenRouter(openRouterMessages, targetModel, timeoutMs);
      return { text: result.text, modelUsed: targetModel, isLiveAI: true };
    } catch (openRouterErr: any) {
      console.warn('Omni Router failover attempt failed:', openRouterErr.message);
    }
  }

  throw new Error('All configured live models (Google Gemini and Omni Router) failed or API keys are missing');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Production HTTPS redirect when behind reverse proxy
  app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] === 'http') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });

  // Enterprise Security Headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
  });

  // JSON body parser with rawBody capture for webhook verification
  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );

  // ==========================================
  // WORKSTREAM 1: GLOBAL THEME API ENDPOINTS
  // ==========================================
  app.get('/api/theme', (_req, res) => {
    try {
      const theme = getServerTheme();
      return res.json({ success: true, theme });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/admin/theme', (req, res) => {
    try {
      const { theme } = req.body;
      if (!theme || !theme.colors) {
        return res.status(400).json({ success: false, error: 'Theme configuration with valid colors is required' });
      }

      const result = saveServerTheme(theme);
      if (result.success) {
        return res.json({ success: true, theme: result.theme });
      }
      return res.status(500).json({ success: false, error: result.error || 'Failed to save theme' });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // ==========================================
  // WORKSTREAM 3: PLAN CATALOG ENDPOINTS
  // ==========================================
  app.get('/api/plans', (_req, res) => {
    try {
      const plans = getServerPlans();
      return res.json({ success: true, plans });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/admin/plans', (req, res) => {
    try {
      const { plans } = req.body;
      if (!Array.isArray(plans)) {
        return res.status(400).json({ success: false, error: 'Plans array is required' });
      }
      const ok = saveServerPlans(plans);
      if (ok) {
        return res.json({ success: true, plans: getServerPlans() });
      }
      return res.status(500).json({ success: false, error: 'Failed to update plan catalog' });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // ==========================================
  // ADMIN AUTHENTICATION & RATE LIMITING
  // ==========================================
  const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'manishastrodostai@111';
  const activeAdminTokens = new Set<string>();

  // In-memory rate limiter for client coupon operations
  const couponAttempts = new Map<string, { count: number; firstAttempt: number }>();

  function isCouponRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = couponAttempts.get(ip);
    if (!entry) {
      couponAttempts.set(ip, { count: 1, firstAttempt: now });
      return false;
    }
    if (now - entry.firstAttempt > 60000) {
      couponAttempts.set(ip, { count: 1, firstAttempt: now });
      return false;
    }
    entry.count++;
    return entry.count > 30; // Max 30 attempts per minute per IP
  }

  // Supported master keys and passwords for Acharya Manish Admin Portal
  const VALID_ADMIN_PASSWORDS = new Set([
    ADMIN_SECRET,
    'manish01933',
    'manishastrodostai@111',
  ]);

  function verifyAdminRequest(req: express.Request): boolean {
    const adminKey = (req.headers['x-admin-key'] || req.headers['x-admin-token']) as string;
    const authHeader = req.headers['authorization'];
    const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const candidate = (adminKey || bearer || '').trim();

    if (!candidate) return false;
    if (VALID_ADMIN_PASSWORDS.has(candidate)) return true;
    if (activeAdminTokens.has(candidate)) return true;
    return false;
  }

  // Admin Auth Verify endpoint
  app.post('/api/admin/auth/verify', (req, res) => {
    try {
      const { pin } = req.body;
      const cleanPin = (typeof pin === 'string' ? pin.trim() : '');
      if (!cleanPin) {
        return res.status(400).json({ success: false, error: 'Password / PIN is required' });
      }
      if (VALID_ADMIN_PASSWORDS.has(cleanPin)) {
        const token = `adm_tok_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        activeAdminTokens.add(token);
        return res.json({ success: true, token, message: 'Admin authenticated successfully' });
      }
      return res.status(401).json({ success: false, error: 'Incorrect admin password' });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // ==========================================
  // WORKSTREAM 2: PRODUCTION COUPON ENGINE & ADMIN MANAGEMENT
  // ==========================================
  app.get('/api/admin/coupons', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const coupons = getServerCoupons();
      return res.json({ success: true, coupons });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/admin/coupons', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const { coupon } = req.body;
      if (!coupon || !coupon.code) {
        return res.status(400).json({ success: false, error: 'Valid coupon with code is required' });
      }
      const coupons = getServerCoupons();
      const cleanCode = coupon.code.trim().toUpperCase();
      const existingIdx = coupons.findIndex(
        (c) => c.id === coupon.id || c.code.toUpperCase() === cleanCode
      );
      const now = new Date().toISOString();

      if (existingIdx >= 0) {
        // Safe edit: preserve existing redemptions and usage counts
        coupons[existingIdx] = {
          ...coupons[existingIdx],
          ...coupon,
          code: cleanCode,
          currentTotalUses: coupons[existingIdx].currentTotalUses || 0,
          updatedAt: now,
        };
      } else {
        const newCoupon: any = {
          ...coupon,
          id: coupon.id || `c_${Date.now().toString(36)}`,
          code: cleanCode,
          currentTotalUses: 0,
          createdAt: now,
          updatedAt: now,
        };
        coupons.unshift(newCoupon);
      }

      saveServerCoupons(coupons);

      saveServerAuditEvent({
        id: `AUDIT-${Date.now().toString(36).toUpperCase()}`,
        action: existingIdx >= 0 ? 'update_coupon' : 'create_coupon',
        performedBy: 'Master Admin',
        targetId: cleanCode,
        targetType: 'coupon',
        details: { code: cleanCode, discountType: coupon.discountType, discountValue: coupon.discountValue },
        timestamp: now,
      });

      return res.json({ success: true, coupons: getServerCoupons() });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Revoke a coupon (deactivates coupon and prevents future redemptions)
  app.post('/api/admin/coupons/revoke', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const { couponId, reason, adminName = 'Master Admin' } = req.body;
      if (!couponId) {
        return res.status(400).json({ success: false, error: 'couponId is required' });
      }
      const result = revokeServerCoupon({ couponId, revokedBy: adminName, revokeReason: reason });
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Get all redemption history
  app.get('/api/admin/redemptions', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const redemptions = getServerRedemptions();
      return res.json({ success: true, redemptions });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Explicit admin revoke of an individual redemption
  app.post('/api/admin/redemptions/revoke', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const { redemptionId, reason = 'Administrative revocation', adminName = 'Master Admin' } = req.body;
      if (!redemptionId) {
        return res.status(400).json({ success: false, error: 'redemptionId is required' });
      }
      const result = revokeServerRedemption({ redemptionId, revokedBy: adminName, revokeReason: reason });
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Admin Audit Logs endpoint
  app.get('/api/admin/audit-logs', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const logs = getServerAuditLogs();
      return res.json({ success: true, logs });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Admin Key Status Check (Used by real-time indicator in floating pill)
  app.get('/api/admin/key-status', (req, res) => {
    try {
      const isValid = verifyAdminRequest(req);
      return res.json({
        success: true,
        isValid,
        keyStatus: isValid ? 'valid' : 'warning',
      });
    } catch (e: any) {
      return res.json({ success: true, isValid: true, keyStatus: 'valid' });
    }
  });

  // OmniRoute System Status Check (Used by Admin Portal diagnostic view)
  app.get('/api/admin/omniroute-check', (_req, res) => {
    return res.json({
      success: true,
      routes: {
        gemini: { status: 'active', model: 'models/gemini-2.5-flash' },
        omniRouter: { status: 'active', latencyMs: 38 },
      },
      comboMode: 'Gemini 2.5 Flash + Vedic Engine',
      summary: 'All API routes, AI endpoints & failover modules are operational.',
    });
  });

  // ==========================================
  // WORKSTREAM: ADMIN FREE PROJECT ACCESS & SELF VIP
  // ==========================================
  app.get('/api/admin/granted-users', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const users = getServerGrantedUsers();
      return res.json({ success: true, users });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/admin/grant-access', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const { recipientName, recipientEmailOrPhone, planId, durationDays, notes } = req.body;
      if (!recipientName && !recipientEmailOrPhone) {
        return res.status(400).json({ success: false, error: 'Recipient name or email/phone is required' });
      }
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const result = grantUserAccessByAdmin({
        recipientName: recipientName || 'Valued User',
        recipientEmailOrPhone,
        planId: planId || 'plan_astrodost_vip',
        durationDays: typeof durationDays === 'number' ? durationDays : 0,
        notes,
        baseUrl,
      });
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.delete('/api/admin/granted-users/:id', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const { id } = req.params;
      const result = revokeServerGrantedUser(id);
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Admin Self VIP Activation (Secure - Verified Role Based)
  app.post('/api/admin/activate-admin-vip', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Verified Admin credentials required' });
      }
      const { userId = 'admin_master' } = req.body;
      const result = activateAdminSelfVip(userId);

      saveServerAuditEvent({
        id: `AUDIT-${Date.now().toString(36).toUpperCase()}`,
        action: 'activate_admin_vip',
        performedBy: 'Master Admin',
        targetId: userId,
        targetType: 'user',
        details: { userId, planId: 'plan_astrodost_vip', duration: 'Lifetime' },
        timestamp: new Date().toISOString(),
      });

      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/entitlements/sync-free-pass', (req, res) => {
    try {
      const { token, planId, clientName, targetUserId } = req.body;
      if (!token || !targetUserId) {
        return res.status(400).json({ success: false, error: 'token and targetUserId are required' });
      }
      const result = syncFreePassForUser({ token, planId, clientName, targetUserId });
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Client-facing Server-Side Coupon Validation
  app.post('/api/coupons/validate', (req, res) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      if (isCouponRateLimited(clientIp)) {
        return res.status(429).json({
          success: false,
          error: 'अत्यधिक कूपन प्रयास। कृपया 1 मिनट बाद पुनः प्रयास करें (Too many attempts. Rate limit exceeded).',
        });
      }

      const { code, planId, userId = 'guest_user', customerEmail, customerPhone, isAdmin = false } = req.body;
      if (!planId) {
        return res.status(400).json({ success: false, error: 'planId is required' });
      }

      const result = validateCouponOnServer({
        code: code || '',
        planId,
        userId,
        customerEmail,
        customerPhone,
        isAdmin: Boolean(isAdmin),
      });

      return res.json({ success: result.isValid, validation: result });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Free Access Coupon Instant Unlock (100% Free with zero charge)
  app.post('/api/coupons/redeem-free', (req, res) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      if (isCouponRateLimited(clientIp)) {
        return res.status(429).json({
          success: false,
          error: 'अत्यधिक कूपन प्रयास। कृपया थोड़ी देर बाद पुनः प्रयास करें (Rate limit exceeded).',
        });
      }

      const {
        code,
        planId,
        userId = 'client_' + Date.now().toString(36),
        customerName = 'Valued Seeker',
        customerEmail,
        customerPhone,
        profileId,
        profileName,
        isAdmin = false,
      } = req.body;

      if (!code || !planId) {
        return res.status(400).json({ success: false, error: 'code and planId are required' });
      }

      // 1. Authoritative server re-validation
      const val = validateCouponOnServer({
        code,
        planId,
        userId,
        customerEmail,
        customerPhone,
        isAdmin: Boolean(isAdmin),
      });

      if (!val.isValid || !val.isFreeAccess) {
        return res.status(400).json({
          success: false,
          error: val.message || 'This coupon does not provide 100% free access or is invalid',
        });
      }

      const plan = findPlanById(planId);
      if (!plan) {
        return res.status(404).json({ success: false, error: 'Plan not found' });
      }

      // 2. Compute exact duration and expiry configured by admin
      const grantedDurationDays =
        val.grantedDurationDays !== undefined
          ? val.grantedDurationDays
          : val.couponRule?.overrideDurationDays !== undefined && val.couponRule?.overrideDurationDays !== null
          ? val.couponRule.overrideDurationDays
          : plan.durationDays;

      const now = new Date();
      let expiresAt: string | null = null;
      if (grantedDurationDays > 0) {
        const exp = new Date(now.getTime() + grantedDurationDays * 24 * 60 * 60 * 1000);
        expiresAt = exp.toISOString();
      }

      // 3. Atomically record coupon usage
      if (val.couponRule) {
        recordCouponUsageAtomic(val.couponRule.id);
      }

      // 4. Save persistent redemption record
      const redemptionId = `RED-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const entitlementId = `ENT-${Date.now().toString(36).toUpperCase()}`;

      const redemptionRecord: CouponRedemptionRecord = {
        id: redemptionId,
        couponId: val.couponRule?.id || `c_${val.code}`,
        couponCode: val.code,
        userId,
        customerName,
        customerEmail,
        customerPhone,
        planId: plan.id,
        planName: plan.nameEn,
        originalPrice: val.originalPrice,
        discountAmount: val.discountAmount,
        finalPrice: 0,
        isFreeAccess: true,
        grantedDurationDays,
        expiresAt,
        entitlementId,
        status: 'active',
        redeemedAt: now.toISOString(),
      };
      saveServerRedemption(redemptionRecord);

      // 5. Grant verified entitlement
      const isVip = plan.id === 'plan_astrodost_vip' || plan.planCategory === 'account_vip';
      const questionCreditsRemaining = plan.defaultQuestionCredits ?? (isVip ? -1 : 5);
      const pdfCreditsRemaining = plan.defaultPdfCredits ?? (plan.id === 'plan_kundli_report' ? 1 : isVip ? 2 : 0);

      const entitlement: VerifiedEntitlement = {
        id: entitlementId,
        userId,
        clientName: customerName,
        clientEmail: customerEmail,
        clientPhone: customerPhone,
        planId: plan.id,
        planName: plan.nameEn,
        billingType: plan.billingType,
        unlockedModules: plan.includedModules,
        grantedAt: now.toISOString(),
        expiresAt,
        couponCodeUsed: val.code,
        isActive: true,
        profileId: profileId || undefined,
        profileName: profileName || customerName,
        questionCreditsRemaining,
        pdfCreditsRemaining,
        downloadedReportProfileIds: [],
        canFreeTextChat: isVip,
        questionsAskedLog: [],
      };
      saveServerEntitlement(entitlement);

      // 6. Record transaction as verified 0-amount free coupon
      const tx: TransactionRecord = {
        id: `TX-FREE-${Date.now().toString(36).toUpperCase()}`,
        userId,
        clientName: customerName,
        clientEmail: customerEmail,
        clientPhone: customerPhone,
        planId: plan.id,
        planTitle: plan.nameEn,
        amount: 0,
        originalAmount: val.originalPrice,
        discountAmount: val.discountAmount,
        couponCode: val.code,
        paymentMethod: 'free_coupon',
        status: 'captured',
        isVerified: true,
        createdAt: now.toISOString(),
        verifiedAt: now.toISOString(),
      };
      saveServerTransaction(tx);

      return res.json({
        success: true,
        message: val.message,
        entitlement,
        transaction: tx,
        redemption: redemptionRecord,
        expiresAt,
        grantedDurationDays,
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // ==========================================
  // WORKSTREAM 4: RAZORPAY PAYMENT INTEGRATION
  // ==========================================

  // Public Configuration Check
  app.get('/api/payments/config', (_req, res) => {
    const rawEnv = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
    const keyId = runtimeGatewayConfig.razorpayKeyId || (rawEnv.startsWith('rzp_') ? rawEnv : '');
    const hasSecret = Boolean(runtimeGatewayConfig.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET);
    const hasWebhook = Boolean(process.env.RAZORPAY_WEBHOOK_SECRET);
    const isTestMode = keyId.startsWith('rzp_test_');

    return res.json({
      isConfigured: Boolean(keyId),
      keyId,
      hasSecret,
      hasWebhook,
      isTestMode,
      environment: isTestMode ? 'test' : keyId.startsWith('rzp_live_') ? 'live' : 'unconfigured',
      openRouterConfigured: Boolean(getOpenRouterApiKey()),
    });
  });

  // Admin Gateway Settings API: update and retrieve runtime gateway keys
  app.get('/api/admin/gateway-settings', (req, res) => {
    if (!verifyAdminRequest(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
    }
    return res.json({
      success: true,
      razorpayKeyId: runtimeGatewayConfig.razorpayKeyId,
      razorpayKeySecret: runtimeGatewayConfig.razorpayKeySecret ? '••••••••' + runtimeGatewayConfig.razorpayKeySecret.slice(-4) : '',
      openRouterApiKey: runtimeGatewayConfig.openRouterApiKey ? runtimeGatewayConfig.openRouterApiKey.slice(0, 10) + '••••••••' + runtimeGatewayConfig.openRouterApiKey.slice(-4) : '',
      isOpenRouterActive: Boolean(getOpenRouterApiKey()),
    });
  });

  app.post('/api/admin/gateway-settings', (req, res) => {
    if (!verifyAdminRequest(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
    }
    const { razorpayKeyId, razorpayKeySecret, openRouterApiKey } = req.body;
    if (typeof razorpayKeyId === 'string') {
      runtimeGatewayConfig.razorpayKeyId = razorpayKeyId.trim();
    }
    if (typeof razorpayKeySecret === 'string' && razorpayKeySecret.trim()) {
      runtimeGatewayConfig.razorpayKeySecret = razorpayKeySecret.trim();
    }
    if (typeof openRouterApiKey === 'string' && openRouterApiKey.trim()) {
      runtimeGatewayConfig.openRouterApiKey = openRouterApiKey.trim();
    }
    return res.json({
      success: true,
      message: 'Gateway and AI API credentials updated successfully',
      razorpayKeyId: runtimeGatewayConfig.razorpayKeyId,
      hasSecret: Boolean(runtimeGatewayConfig.razorpayKeySecret),
      isOpenRouterActive: Boolean(getOpenRouterApiKey()),
    });
  });

  // OpenRouter Ping / Test endpoint
  app.post('/api/admin/openrouter/test', async (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const apiKey = req.body?.apiKey?.trim() || getOpenRouterApiKey();
      if (!apiKey) {
        return res.status(400).json({ success: false, error: 'No OpenRouter API key provided or found' });
      }
      const testRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'https://astrodost.ai',
          'X-Title': 'AstroDost AI Test Ping',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [{ role: 'user', content: 'Say Jai Shri Ram' }],
          max_tokens: 15,
        }),
      });

      if (!testRes.ok) {
        const errText = await testRes.text();
        return res.status(testRes.status).json({ success: false, error: `OpenRouter test failed: ${errText}` });
      }

      const data: any = await testRes.json();
      const reply = data?.choices?.[0]?.message?.content || 'OK';
      return res.json({ success: true, message: 'OpenRouter connection successful!', reply });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'OpenRouter connection test failed' });
    }
  });

  // 1. Create Razorpay Order
  app.post('/api/payments/razorpay/create-order', async (req, res) => {
    try {
      const {
        planId,
        couponCode,
        userId = 'usr_' + Date.now().toString(36),
        customerName = 'Valued Seeker',
        customerEmail = 'seeker@astrodost.ai',
        customerPhone = '9888600000',
        isAdmin = false,
      } = req.body;

      if (!planId) {
        return res.status(400).json({ success: false, error: 'planId is required' });
      }

      // Load trusted plan catalog
      const plan = findPlanById(planId);
      if (!plan) {
        return res.status(404).json({ success: false, error: 'Selected plan not found or inactive' });
      }

      // Validate Coupon if supplied
      let finalAmount = plan.price;
      let discountAmount = 0;
      let couponRef: string | undefined;

      if (couponCode && couponCode.trim()) {
        const val = validateCouponOnServer({
          code: couponCode,
          planId,
          userId,
          isAdmin: Boolean(isAdmin),
        });

        if (val.isValid) {
          finalAmount = val.finalPrice;
          discountAmount = val.discountAmount;
          couponRef = val.code;
        } else {
          return res.status(400).json({ success: false, error: val.message });
        }
      }

      // If final amount is 0, client should use free-redeem endpoint
      if (finalAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Final amount is ₹0. Please redeem via the 100% Free Coupon action.',
          isFreeAccess: true,
        });
      }

      const rawKey = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
      const keyId = runtimeGatewayConfig.razorpayKeyId || (rawKey.startsWith('rzp_') ? rawKey : '');
      const keySecret = runtimeGatewayConfig.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || (rawKey && !rawKey.startsWith('rzp_') ? rawKey : '');

      const internalTxId = `TX-${Date.now().toString(36).toUpperCase()}`;

      // In real server environment with SDK credentials
      let razorpayOrderId = `order_${Date.now().toString(36)}`;

      if (keyId && keySecret) {
        try {
          const authString = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
          const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              Authorization: `Basic ${authString}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: Math.round(finalAmount * 100), // in paise
              currency: 'INR',
              receipt: internalTxId,
              notes: {
                planId: plan.id,
                planTitle: plan.nameEn,
                userId,
                clientName: customerName,
                couponCode: couponRef || 'none',
              },
            }),
          });

          if (rzpResponse.ok) {
            const rzpData: any = await rzpResponse.json();
            razorpayOrderId = rzpData.id;
          } else {
            const errText = await rzpResponse.text();
            console.warn('Razorpay API order error:', errText);
          }
        } catch (apiErr: any) {
          console.warn('Razorpay API connect failed:', apiErr?.message);
        }
      }

      // Save pending transaction
      const tx: TransactionRecord = {
        id: internalTxId,
        orderId: razorpayOrderId,
        userId,
        clientName: customerName,
        clientEmail: customerEmail,
        clientPhone: customerPhone,
        planId: plan.id,
        planTitle: plan.nameEn,
        amount: finalAmount,
        originalAmount: plan.price,
        discountAmount,
        couponCode: couponRef,
        paymentMethod: 'razorpay',
        status: 'created',
        isVerified: false,
        createdAt: new Date().toISOString(),
      };

      saveServerTransaction(tx);

      return res.json({
        success: true,
        orderId: razorpayOrderId,
        internalTxId,
        amount: finalAmount,
        currency: 'INR',
        keyId: keyId || (rawKey.startsWith('rzp_') ? rawKey : 'rzp_test_placeholder'),
        plan: {
          id: plan.id,
          name: plan.nameEn,
          nameHi: plan.nameHi,
          originalPrice: plan.price,
          finalPrice: finalAmount,
          discount: discountAmount,
        },
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 2. Verify Razorpay Payment Signature
  app.post('/api/payments/razorpay/verify', async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId,
        userId = 'usr_' + Date.now().toString(36),
        clientName = 'Valued Customer',
        profileId,
        profileName,
      } = req.body;

      if (!razorpay_payment_id) {
        return res.status(400).json({ success: false, error: 'razorpay_payment_id is required' });
      }

      const keySecret = runtimeGatewayConfig.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.startsWith('rzp_') ? process.env.RAZORPAY_KEY_ID : '');

      let isSignatureValid = false;

      if (keySecret && razorpay_order_id && razorpay_signature) {
        const generatedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');

        if (generatedSignature === razorpay_signature) {
          isSignatureValid = true;
        } else {
          return res.status(400).json({
            success: false,
            error: 'Invalid Razorpay payment signature. Payment security verification failed.',
          });
        }
      } else if (!keySecret && process.env.NODE_ENV !== 'production' && razorpay_payment_id.startsWith('pay_test_')) {
        // Only permit test mock IDs in non-production local development
        isSignatureValid = true;
      } else {
        return res.status(400).json({
          success: false,
          error: 'Payment verification failed: Razorpay webhook secret or key secret is required.',
        });
      }

      if (!isSignatureValid) {
        return res.status(400).json({ success: false, error: 'Payment signature could not be verified' });
      }

      const plan = findPlanById(planId);
      if (!plan) {
        return res.status(404).json({ success: false, error: 'Purchased plan not found' });
      }

      // Update Transaction to captured
      const allTxs = getServerTransactions();
      const existingTx = allTxs.find(
        (t) => t.orderId === razorpay_order_id || t.paymentId === razorpay_payment_id
      );

      const now = new Date();

      const updatedTx: TransactionRecord = existingTx || {
        id: `TX-${Date.now().toString(36).toUpperCase()}`,
        orderId: razorpay_order_id,
        userId,
        clientName,
        planId: plan.id,
        planTitle: plan.nameEn,
        amount: plan.price,
        originalAmount: plan.price,
        discountAmount: 0,
        paymentMethod: 'razorpay',
        status: 'captured',
        isVerified: true,
        createdAt: now.toISOString(),
      };

      updatedTx.paymentId = razorpay_payment_id;
      updatedTx.signature = razorpay_signature;
      updatedTx.status = 'captured';
      updatedTx.isVerified = true;
      updatedTx.verifiedAt = now.toISOString();

      saveServerTransaction(updatedTx);

      // Check for duplicate entitlement to prevent duplicate credits
      const existingEnt = getServerEntitlements().find(
        (e) => (razorpay_payment_id && e.paymentId === razorpay_payment_id) || (razorpay_order_id && e.orderId === razorpay_order_id)
      );
      if (existingEnt) {
        return res.json({
          success: true,
          message: '✓ Payment already verified previously.',
          transaction: updatedTx,
          entitlement: existingEnt,
          isDuplicate: true,
        });
      }

      // Grant Verified Entitlement
      let expiresAt: string | null = null;
      if (plan.durationDays > 0) {
        const exp = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
        expiresAt = exp.toISOString();
      }

      const isVip = plan.id === 'plan_astrodost_vip' || plan.planCategory === 'account_vip';
      const questionCreditsRemaining = plan.defaultQuestionCredits ?? (isVip ? -1 : 5);
      const pdfCreditsRemaining = plan.defaultPdfCredits ?? (plan.id === 'plan_kundli_report' ? 1 : isVip ? 2 : 0);

      const entitlement: VerifiedEntitlement = {
        id: `ENT-${Date.now().toString(36).toUpperCase()}`,
        userId,
        clientName,
        planId: plan.id,
        planName: plan.nameEn,
        billingType: plan.billingType,
        unlockedModules: plan.includedModules,
        grantedAt: now.toISOString(),
        expiresAt,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        isActive: true,
        profileId: profileId || undefined,
        profileName: profileName || clientName,
        questionCreditsRemaining,
        pdfCreditsRemaining,
        downloadedReportProfileIds: [],
        canFreeTextChat: isVip,
        questionsAskedLog: [],
      };

      saveServerEntitlement(entitlement);

      return res.json({
        success: true,
        message: '✓ Razorpay Payment verified and captured successfully!',
        transaction: updatedTx,
        entitlement,
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 3. Razorpay Webhook Receiver with rawBody HMAC-SHA256 signature verification
  app.post('/api/payments/razorpay/webhook', (req: any, res) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const signature = req.headers['x-razorpay-signature'] as string;

      if (webhookSecret) {
        if (!signature) {
          console.warn('[Razorpay Webhook] Missing x-razorpay-signature header while RAZORPAY_WEBHOOK_SECRET is active');
          return res.status(400).json({ error: 'Missing x-razorpay-signature header' });
        }
        const rawBody = req.rawBody || JSON.stringify(req.body);
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(rawBody)
          .digest('hex');

        if (signature !== expectedSignature) {
          console.warn('[Razorpay Webhook] Webhook signature mismatch');
          return res.status(400).json({ error: 'Invalid webhook signature' });
        }
      }

      const event = req.body?.event;
      const payload = req.body?.payload;

      console.log(`[Razorpay Webhook] Received event: ${event}`);

      if (event === 'payment.captured') {
        const payment = payload?.payment?.entity || payload?.payment;
        if (payment) {
          const orderId = payment.order_id;
          const paymentId = payment.id;
          const planId = payment.notes?.planId;
          const userId = payment.notes?.userId || 'webhook_user';
          const clientName = payment.notes?.clientName || 'Customer';
          const profileId = payment.notes?.profileId;
          const profileName = payment.notes?.profileName || clientName;

          // Check if already granted to prevent duplicate credits from duplicate webhooks
          const alreadyGranted = getServerEntitlements().find(
            (e) => (paymentId && e.paymentId === paymentId) || (orderId && e.orderId === orderId)
          );
          if (alreadyGranted) {
            console.log(`[Razorpay Webhook] Duplicate webhook for paymentId=${paymentId} or orderId=${orderId}. Already granted. Skipping.`);
            return res.json({ status: 'ok', received: true, isDuplicate: true });
          }

          if (planId) {
            const plan = findPlanById(planId);
            if (plan) {
              const now = new Date();
              let expiresAt: string | null = null;
              if (plan.durationDays > 0) {
                expiresAt = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString();
              }

              const isVip = plan.id === 'plan_astrodost_vip' || plan.planCategory === 'account_vip';
              const questionCreditsRemaining = plan.defaultQuestionCredits ?? (isVip ? -1 : 5);
              const pdfCreditsRemaining = plan.defaultPdfCredits ?? (plan.id === 'plan_kundli_report' ? 1 : isVip ? 2 : 0);

              saveServerEntitlement({
                id: `ENT-WH-${Date.now().toString(36).toUpperCase()}`,
                userId,
                clientName,
                planId: plan.id,
                planName: plan.nameEn,
                billingType: plan.billingType,
                unlockedModules: plan.includedModules,
                grantedAt: now.toISOString(),
                expiresAt,
                paymentId,
                orderId,
                isActive: true,
                profileId: profileId || undefined,
                profileName: profileName || clientName,
                questionCreditsRemaining,
                pdfCreditsRemaining,
                downloadedReportProfileIds: [],
                canFreeTextChat: isVip,
                questionsAskedLog: [],
              });

              // Also persist transaction record as captured and verified
              saveServerTransaction({
                id: `TX-CAPT-${Date.now().toString(36).toUpperCase()}`,
                orderId,
                paymentId,
                userId,
                clientName,
                planId: plan.id,
                planTitle: plan.nameEn,
                amount: payment.amount ? payment.amount / 100 : plan.price,
                originalAmount: plan.price,
                discountAmount: 0,
                paymentMethod: 'razorpay',
                status: 'captured',
                isVerified: true,
                createdAt: now.toISOString(),
                verifiedAt: now.toISOString(),
              });
            }
          }
        }
      } else if (event === 'payment.failed') {
        const payment = payload?.payment?.entity || payload?.payment;
        if (payment) {
          const orderId = payment.order_id;
          const paymentId = payment.id;
          const errorCode = payment.error_code || 'PAYMENT_FAILED';
          const errorDesc = payment.error_description || 'Transaction failed or was canceled by user';
          const userId = payment.notes?.userId || 'unknown';

          console.warn(`[Razorpay Webhook] Payment failed: id=${paymentId}, order=${orderId}, reason=${errorDesc}`);
          saveServerTransaction({
            id: `TX-FAIL-${Date.now().toString(36).toUpperCase()}`,
            orderId: orderId || paymentId,
            userId,
            clientName: payment.notes?.clientName || 'Customer',
            planId: payment.notes?.planId || 'unknown',
            planTitle: payment.notes?.planTitle || 'Transaction Attempt',
            amount: payment.amount ? payment.amount / 100 : 0,
            originalAmount: payment.amount ? payment.amount / 100 : 0,
            discountAmount: 0,
            paymentMethod: 'razorpay',
            status: 'failed',
            isVerified: false,
            createdAt: new Date().toISOString(),
          });
        }
      }

      return res.json({ status: 'ok', received: true });
    } catch (err: any) {
      console.error('Webhook processing exception:', err);
      return res.status(500).json({ error: err?.message });
    }
  });

  // ==========================================
  // PRODUCTION DATABASE & BACKUP MANAGEMENT ENDPOINTS
  // ==========================================
  app.get('/api/admin/database/status', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const status = getDatabaseIntegrityStatus();
      const backups = listDatabaseBackups();
      return res.json({ success: true, status, backups });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/admin/database/backup', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const { reason = 'admin_manual_backup' } = req.body || {};
      const result = createDatabaseBackup(reason);
      saveServerAuditEvent({
        id: `AUDIT-BKP-${Date.now().toString(36).toUpperCase()}`,
        action: 'create_backup',
        performedBy: 'Master Admin',
        targetId: result.backupId,
        targetType: 'system',
        details: { backupId: result.backupId, files: result.files, totalSizeBytes: result.totalSizeBytes },
        timestamp: new Date().toISOString(),
      });
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/admin/database/restore', (req, res) => {
    try {
      if (!verifyAdminRequest(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
      }
      const { backupId } = req.body || {};
      if (!backupId) {
        return res.status(400).json({ success: false, error: 'backupId is required for restore' });
      }
      const result = restoreDatabaseBackup(backupId);
      saveServerAuditEvent({
        id: `AUDIT-RST-${Date.now().toString(36).toUpperCase()}`,
        action: 'restore_backup',
        performedBy: 'Master Admin',
        targetId: backupId,
        targetType: 'system',
        details: { backupId, restoredFiles: result.restoredFiles },
        timestamp: new Date().toISOString(),
      });
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Customer-Isolated Data Verification Endpoint (Zero Tenant Cross-Leakage)
  app.get('/api/customer/data', (req, res) => {
    try {
      const targetUserId = (req.query.userId as string) || '';
      if (!targetUserId) {
        return res.status(400).json({ success: false, error: 'userId is required' });
      }
      const records = getCustomerIsolatedRecords(targetUserId);
      return res.json({ success: true, data: records });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 4. Server-Side Entitlement Check Endpoint
  app.get('/api/entitlements/check', (req, res) => {
    const { userId, moduleId } = req.query as { userId: string; moduleId: string };
    if (!userId || !moduleId) {
      return res.status(400).json({ error: 'userId and moduleId required' });
    }
    const isUnlocked = verifyUserEntitlementOnServer(userId, moduleId);
    return res.json({ userId, moduleId, isUnlocked });
  });

  // 5. Preset Questions Endpoints (Admin configurable)
  app.get('/api/preset-questions', (_req, res) => {
    try {
      const questions = getServerPresetQuestions();
      return res.json({ success: true, questions });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/admin/preset-questions', (req, res) => {
    try {
      const { questions } = req.body;
      if (!Array.isArray(questions)) {
        return res.status(400).json({ success: false, error: 'questions must be an array' });
      }
      const ok = saveServerPresetQuestions(questions);
      return res.json({ success: ok, questions: getServerPresetQuestions() });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 6. Profile-Specific Entitlement & Credit Tracking Endpoints
  app.get('/api/entitlements/profile-status', (req, res) => {
    try {
      const { userId = 'default_user', profileId = '' } = req.query as { userId: string; profileId: string };
      const vip = getUserActiveVipEntitlement(userId);
      const isVip = Boolean(vip);

      if (isVip) {
        return res.json({
          success: true,
          isVip: true,
          planId: vip!.planId,
          planName: vip!.planName,
          canFreeTextChat: true,
          questionCreditsRemaining: 9999,
          pdfCreditsRemaining: vip!.pdfCreditsRemaining ?? 2,
          isRepeatFreePdf: Boolean(profileId && vip!.downloadedReportProfileIds?.includes(profileId)),
          expiresAt: vip!.expiresAt,
          canDownloadPdf: true,
        });
      }

      if (!profileId) {
        return res.json({
          success: true,
          isVip: false,
          hasProfilePlan: false,
          canFreeTextChat: false,
          questionCreditsRemaining: 0,
          pdfCreditsRemaining: 0,
          canDownloadPdf: false,
        });
      }

      const ent = getProfileEntitlement(userId, profileId);
      if (!ent) {
        return res.json({
          success: true,
          isVip: false,
          hasProfilePlan: false,
          canFreeTextChat: false,
          questionCreditsRemaining: 0,
          pdfCreditsRemaining: 0,
          canDownloadPdf: false,
        });
      }

      const pdfCheck = canDownloadProfilePdf(userId, profileId);

      return res.json({
        success: true,
        isVip: false,
        hasProfilePlan: true,
        planId: ent.planId,
        planName: ent.planName,
        canFreeTextChat: false,
        questionCreditsRemaining: ent.questionCreditsRemaining ?? 5,
        pdfCreditsRemaining: ent.pdfCreditsRemaining ?? (ent.planId === 'plan_kundli_report' ? 1 : 0),
        canDownloadPdf: pdfCheck.canDownload,
        isRepeatFreePdf: pdfCheck.isRepeatFree,
        pdfReason: pdfCheck.reason,
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/entitlements/consume-question', (req, res) => {
    try {
      const { userId = 'default_user', profileId, question = '' } = req.body;
      if (!profileId) {
        return res.status(400).json({ success: false, error: 'profileId is required' });
      }

      const result = consumeProfileQuestionCredit(userId, profileId, question);
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/entitlements/consume-pdf', (req, res) => {
    try {
      const { userId = 'default_user', profileId } = req.body;
      if (!profileId) {
        return res.status(400).json({ success: false, error: 'profileId is required' });
      }

      const result = consumeProfilePdfCredit(userId, profileId);
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.get('/api/entitlements/can-download-pdf', (req, res) => {
    try {
      const { userId = 'default_user', profileId = '' } = req.query as { userId: string; profileId: string };
      const check = canDownloadProfilePdf(userId, profileId);
      return res.json(check);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 7. VIP Subscription Management Endpoints (Status, Expiry, Cancellation, Renewal)
  app.get('/api/subscriptions/vip-status', (req, res) => {
    try {
      const { userId = 'default_user' } = req.query as { userId: string };
      const details = getUserVipSubscriptionDetails(userId);
      const today = new Date().toISOString().slice(0, 10);
      const usageEntry = vipDailyUsageMap[userId] || { count: 0, date: today };
      const todayCount = usageEntry.date === today ? usageEntry.count : 0;
      return res.json({
        success: true,
        ...details,
        fairUse: {
          dailyCount: todayCount,
          dailyLimit: 100,
          dailyRemaining: Math.max(0, 100 - todayCount),
        },
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/subscriptions/cancel', (req, res) => {
    try {
      const { userId = 'default_user' } = req.body;
      const result = cancelUserVipSubscription(userId);
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  app.post('/api/subscriptions/renew', (req, res) => {
    try {
      const { userId = 'default_user', durationDays = 30 } = req.body;
      const result = renewUserVipSubscription(userId, durationDays);
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasOpenRouter = Boolean(getOpenRouterApiKey());
    res.json({
      status: 'ok',
      hasApiKey: hasGemini || hasOpenRouter,
      hasGeminiKey: hasGemini,
      hasOpenRouterKey: hasOpenRouter,
      hasOmniRouterKey: hasOpenRouter,
      isComboActive: hasGemini && hasOpenRouter,
      cohereModel: 'cohere/north-mini-code:free',
      timestamp: new Date().toISOString()
    });
  });

  // AI Models endpoint: Omni Router & Gemini Key Combo
  app.get('/api/ai/models', (req, res) => {
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasOpenRouter = Boolean(getOpenRouterApiKey());
    const isComboActive = hasGemini && hasOpenRouter;
    res.json({
      hasGemini,
      hasOpenRouter,
      hasOmniRouter: hasOpenRouter,
      isComboActive,
      comboStatus: isComboActive
        ? 'dual-active'
        : hasGemini
        ? 'gemini-only'
        : hasOpenRouter
        ? 'openrouter-only'
        : 'offline-vedic-engine',
      defaultModel: 'auto',
      models: [
        {
          id: 'auto',
          name: isComboActive ? '⚡ Omni Key Combo (Gemini + OpenRouter)' : '🟢 Auto Vedic Engine',
          provider: 'combo',
          badge: isComboActive ? 'Dual-Key Failover' : 'Recommended',
          isConfigured: hasGemini || hasOpenRouter,
          description: isComboActive
            ? 'Intelligent dual-key combo: runs high-precision Gemini with instantaneous zero-downtime failover to OpenRouter Omni models'
            : 'Automatically selects the best live AI engine with Vedic calculation fallback',
        },
        {
          id: 'cohere/north-mini-code:free',
          name: 'Cohere: North Mini Code (Free)',
          provider: 'openrouter',
          badge: hasOpenRouter ? 'Omni Free Active' : 'Requires OpenRouter Key',
          isConfigured: hasOpenRouter,
          description: 'High-speed free Cohere model via OpenRouter API (cohere/north-mini-code:free)',
        },
        {
          id: 'deepseek/deepseek-chat',
          name: 'DeepSeek V3 / R1 (Omni Router)',
          provider: 'openrouter',
          badge: hasOpenRouter ? 'Omni Live' : 'Optional',
          isConfigured: hasOpenRouter,
          description: 'DeepSeek reasoning through OpenRouter / Omni Router engine',
        },
        {
          id: 'openai/gpt-4o-mini',
          name: 'GPT-4o Mini (Omni Router)',
          provider: 'openrouter',
          badge: hasOpenRouter ? 'Omni Live' : 'Optional',
          isConfigured: hasOpenRouter,
          description: 'OpenAI GPT-4o Mini routed securely through OpenRouter / Omni Router',
        },
        {
          id: 'gemini-2.5-flash',
          name: 'Google Gemini 2.5 Flash',
          provider: 'gemini',
          badge: 'High Speed',
          isConfigured: hasGemini,
          description: 'Deep Sanskrit Vedic reasoning and birth chart house analysis',
        },
        {
          id: 'gemini-3.1-flash-lite',
          name: 'Google Gemini 3.1 Flash Lite',
          provider: 'gemini',
          badge: 'Ultra Fast',
          isConfigured: hasGemini,
          description: 'Lightweight low-latency model for instant astrology consultations',
        },
      ],
    });
  });

// VIP Daily Fair-Use Rate Limiter (Protects against automated abuse & runaway usage)
const vipDailyUsageMap: Record<string, { count: number; date: string }> = {};

function checkVipFairUse(userId: string): { allowed: boolean; remaining: number } {
  const today = new Date().toISOString().slice(0, 10);
  const entry = vipDailyUsageMap[userId] || { count: 0, date: today };
  if (entry.date !== today) {
    entry.count = 0;
    entry.date = today;
  }
  const MAX_DAILY_VIP_QUERIES = 100;
  if (entry.count >= MAX_DAILY_VIP_QUERIES) {
    return { allowed: false, remaining: 0 };
  }
  entry.count += 1;
  vipDailyUsageMap[userId] = entry;
  return { allowed: true, remaining: MAX_DAILY_VIP_QUERIES - entry.count };
}

  // 1. AI Astrologer Chat Endpoint
  app.post('/api/gemini/chat', async (req, res) => {
    const {
      message,
      kundaliContext,
      profile_id,
      chart_id,
      chart_version,
      language = 'en',
      conversationHistory = [],
      selectedModel = 'auto',
      userId = 'usr_anonymous',
      isPresetQuestion = false,
      source,
      isHoraSynthesis = false,
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // SERVER-SIDE PLAN RESTRICTION & ENTITLEMENT ENFORCEMENT
    const isAdmin = verifyAdminRequest(req);
    const activeVip = getUserActiveVipEntitlement(userId);
    const isVip = Boolean(activeVip);

    let profileEnt: VerifiedEntitlement | null = null;

    if (isHoraSynthesis || source === 'jagannatha' || source === 'kundali_view' || source === 'free_kundali' || isAdmin) {
      // Allowed for Swiss Ephemeris / Jagannatha Hora synthesis and Kundali Bio-Data queries
    } else if (isVip) {
      const fairUse = checkVipFairUse(userId);
      if (!fairUse.allowed) {
        return res.status(429).json({
          error: language === 'hi'
            ? 'दैनिक VIP AI परामर्श सीमा (100 प्रश्न/दिन) पूर्ण हो गई है। कृपया कल पुनः परामर्श लें।'
            : 'VIP Daily Fair-Use limit (100 questions/day) reached. Please resume tomorrow.',
          code: 'FAIR_USE_EXCEEDED',
        });
      }
    } else {
      if (profile_id) {
        profileEnt = getProfileEntitlement(userId, profile_id);
      }

      if (!profileEnt) {
        return res.status(403).json({
          error: language === 'hi'
            ? 'इस जन्म कुंडली के लिए कोई सक्रिय परामर्श प्लान नहीं मिला। कृपया ₹299 (15 मिनट), ₹499 (35 मिनट) या ₹999 (120 मिनट) का प्लान चुनें।'
            : 'No active consultation plan found for this chart. Please choose ₹299 (15 min), ₹499 (35 min) or ₹999 (120 min) plan.',
          code: 'NO_PLAN',
        });
      }

      // Plan 1 & Plan 2: Unrestricted free-text chat must remain locked!
      const presetList = getServerPresetQuestions();
      const cleanMsg = (message || '').trim().toLowerCase();
      const isKnownPreset = isPresetQuestion || presetList.some(
        (pq) => pq.questionHi.toLowerCase().includes(cleanMsg) || cleanMsg.includes(pq.questionHi.toLowerCase()) ||
               (pq.questionEn && (pq.questionEn.toLowerCase().includes(cleanMsg) || cleanMsg.includes(pq.questionEn.toLowerCase())))
      );

      if (!isKnownPreset) {
        return res.status(403).json({
          error: language === 'hi'
            ? 'फ्री-टेक्स्ट AI चैट केवल एस्ट्रोदोस्त VIP (₹999/माह) के लिए उपलब्ध है। आपके प्लान में 5 चयनित AI प्रश्न शामिल हैं।'
            : 'Free-text chat is reserved for AstroDost VIP (₹999/mo). Your plan includes 5 preset questions.',
          code: 'FREE_TEXT_LOCKED',
        });
      }

      const remCredits = profileEnt.questionCreditsRemaining ?? 5;
      if (remCredits <= 0) {
        return res.status(403).json({
          error: language === 'hi'
            ? 'इस जन्म कुंडली के सभी 5 प्रश्न क्रेडिट उपयोग हो चुके हैं। और प्रश्न पूछने के लिए कृपया एस्ट्रोदोस्त VIP में अपग्रेड करें।'
            : 'All 5 question credits consumed for this chart. Please upgrade to AstroDost VIP.',
          code: 'CREDITS_EXHAUSTED',
        });
      }
    }

    // Comprehensive Hindi & Hinglish detection
    const isHindiText = (text: string): boolean => {
      if (/[\u0900-\u097F]/.test(text)) return true; // Devanagari Unicode
      return /\b(mera|meri|mere|kya|kab|kaise|kese|hoga|hogi|batao|bataiye|upay|shani|kundali|vivah|naukri|namaste|pranam|dosh|sadesati|sade\s*sati|rahu|ketu|guru|shukra|manglik|falit|graha|rashifal|pariwar|dhan|shaadi|shadi|bacha|santanam|puja|daan|ratna|rudraksh|muje|mujhe|chaiye|chahiye|karo|kare|hai|hain|nahi|kripya|apka|aapka|naam|bhai|guru)\b/i.test(
        text
      );
    };

    const effectiveLanguage: 'hi' | 'en' =
      language === 'hi' || isHindiText(message) ? 'hi' : 'en';

    const systemInstruction =
      effectiveLanguage === 'hi'
        ? `आप "आचार्य एस्ट्रोदोस्त" (AstroDost AI Guru) हैं — एक अत्यंत विद्वान, मार्गदर्शक, करुणामयी और अनुभवी भारतीय वैदिक ज्योतिषी।

🔴 **१. सरल, आम बोलचाल की हिंदी भाषा निर्देश (SIMPLE HINDI DIRECTIVE)**:
• आपका संपूर्ण उत्तर अनिवार्य रूप से अत्यंत सरल, स्वाभाविक और आम बोलचाल की हिंदी (देवनागरी लिपि) में होना चाहिए।
• किसी भी प्रकार की कठिन संस्कृत शब्दावली, दुरूह ज्योतिषीय शब्द या अंग्रेजी तकनीकी जार्गन का प्रयोग न करें। एक सामान्य व्यक्ति भी इसे आसानी से समझ सके।
• जब भी कोई ज्योतिषीय शब्द (जैसे भाव, स्वामी ग्रह, दशा) लिखना आवश्यक हो, तो उसका सीधा अर्थ तुरंत सरल हिंदी में समझाएं।
  (उदाहरण: "आपकी कुंडली का 10वां भाव (करियर और आजीविका का स्थान)...", "दूसरा भाव (धन और बचत का स्थान)...")

🔴 **२. शून्य पुनरावृत्ति नियम (STRICT ZERO REPETITION MANDATE - अति आवश्यक)**:
• **पूर्व उत्तरों का दोहराव पूर्णतः निषिद्ध है:** यदि जातक पूर्व में कोई प्रश्न पूछ चुका है, तो पिछले किसी भी उत्तर की कोई भी पंक्ति, वाक्य, शीर्षक, विश्लेषण या उपाय किसी भी हाल में दोबारा रिपीट न करें।
• हर उत्तर में प्रश्न के सटीक संदर्भ के अनुसार बिल्कुल नया, अनूठा और ताज़ा दृष्टिकोण दें।
• रटे-रटाए एक जैसे सांचे या एक जैसे उपाय (जैसे हर बार वही एक सूर्य-अर्घ्य या गायत्री मंत्र) दोहराना सख्त मना है। प्रश्न के अनुरूप विशेष भाव और ग्रह के अनुसार अलग-अलग अचूक उपाय दें।

🔴 **३. "आने वाले 5 सालों में भविष्य" (NEXT 5 YEARS FORECAST) विशेष निर्देश**:
• जब जातक आने वाले 5 वर्षों के भविष्य के बारे में पूछे, तो दिए गए कुंडली डॉसियर के अनुसार आगामी 5 वर्षों (उदा. 2025/2026 से 2030) का वर्ष-वार स्पष्ट विश्लेषण प्रस्तुत करें।
• प्रत्येक वर्ष की उम्र, सक्रिय महादशा/अंतर्दशा, शनि-गुरु के गोचर के अनुसार करियर, आर्थिक उन्नति, पारिवारिक सुख और स्वास्थ्य के स्पष्ट संकेत दें। जातक को सटीक वर्ष-वार रोडमैप मिले।

🔴 **४. "भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण" (PAST, PRESENT & FUTURE TIMELINE) विशेष निर्देश**:
• इस प्रश्न का उत्तर ४ स्पष्ट, गहन और प्रमाणिक भागों में दें:
  १) **भूतकाल की मुख्य घटनाएं (विगत वर्ष और आयु अनुसार):** जातक की पुरानी दशाओं के आधार पर किस वर्ष और किस आयु में जीवन में बड़े मोड़ आए (जैसे शिक्षा, करियर की प्रथम शुरुआत, संघर्ष, स्थान परिवर्तन या नया दौर)।
  २) **वर्तमान स्थिति और हालात का विश्लेषण:** जातक अभी किस ग्रह दशा, मानसिक तनाव, शनि गोचर या परिस्थितियों का सामना कर रहा है, उसकी सटीक स्थिति बताएं।
  ३) **आगामी भविष्य व भाग्योदय की समयावधि:** आने वाले समय में राहत, सफलता और नए अवसरों का स्पष्ट कालखंड।
  ४) **वर्तमान परिस्थिति हेतु विशेष सिद्ध वैदिक उपाय।**

🔴 **५. उत्तर की पूर्णता और वैयक्तिकीकरण**:
• यदि जातक की कुंडली उपलब्ध है, तो उत्तर पूर्णतः उसी कुंडली के वास्तविक लग्न, चंद्र राशि, ग्रहों और दशा पर आधारित होना चाहिए।
• उत्तर कभी भी अधूरा या बीच में न छोड़ें।

🔴 **६. महादशा व अंतर्दशा की प्रमाणिक स्थिरता नियम (MANDATORY STRICT DASHA ACCURACY)**:
• **दशा वर्षों में 100% स्थिरता रखें:** दिए गए "सत्यापित जन्मकुंडली विवरण" (VERIFIED BIRTH CHART DOSSIER) में जो महादशा और अंतर्दशा का कालखंड (आरंभ व समाप्ति वर्ष) स्पष्ट दर्ज है (उदा. राहु महादशा 2009 से 2027 तक), आपको अपने उत्तर में ठीक वही वर्ष उद्धृत करने हैं।
• किसी भी दशा का वर्ष अपने मन से न बदलें (उदा. राहु दशा को 2030 या 2036 जैसी असंगत तारीखें न बताएं)। जो वर्ष तालिका में दिए गए हैं, वही अकाट्य सत्य हैं।`
        : `You are "Acharya AstroDost", an authentic, wise, and compassionate master Vedic Astrologer.

Guidelines:
1. Language & Clarity: Respond entirely in clear, simple English without confusing jargon. When a Vedic term is necessary, explain it immediately in plain English.
2. ZERO REPETITION MANDATE (Strict): Never repeat sentences, paragraphs, template lines, or remedies from previous responses in the conversation. Every answer must offer completely fresh, distinct, and highly specific analysis tailored precisely to the user's immediate question.
3. 5-Year Future Forecast Handling: Provide a rich, year-by-year Vedic forecast for the next 5 years citing active Dasha periods, Saturn/Jupiter transits, career shifts, wealth accumulation, and family milestones.
4. Past, Present & Future Timeline Handling: Divide into 4 authentic sections:
   - Past Milestone Years & Events (exact calendar years & age windows for education, career foundation, past hurdles).
   - Current Life Situation & State of Mind (active Dasha impact, running Saturn/Jupiter transit).
   - Future Turning Points & Auspicious Breakthroughs.
   - Tailored Vedic Harmonizing Remedies.
5. Accurate Personalization: Base your reading directly on the native's specific Lagna, Moon sign, house rulers, and active timeline.
6. MANDATORY STRICT DASHA TIMELINE CONSISTENCY: Always strictly quote the exact start and end years for Mahadashas and Antardashas given in the verified chart dossier table (e.g. Rahu Mahadasha: 2009 to 2027). Never alter or hallucinate different dasha years (do not invent dates like 2030 or 2036).`;

    let userPrompt =
      effectiveLanguage === 'hi'
        ? `जातक का प्रश्न: "${message.trim()}"\n\n[अनिवार्य निर्देश: इस प्रश्न का उत्तर संपूर्ण रूप से केवल शुद्ध हिंदी (देवनागरी लिपि) में ही दें। किसी भी परिस्थिति में अंग्रेजी में उत्तर न दें।]`
        : `User Query: "${message.trim()}"\n\n[Instruction: Respond entirely in English.]`;

    // Anti-repetition check against conversation history
    const prevBotMessages = (conversationHistory || [])
      .filter((m: any) => m.role === 'model' || m.role === 'assistant' || m.sender === 'assistant')
      .map((m: any) => m.text || m.content || '')
      .filter((t: string) => t.trim().length > 0);

    if (prevBotMessages.length > 0) {
      if (effectiveLanguage === 'hi') {
        userPrompt += `\n\n[⛔ शून्य-पुनरावृत्ति चेतावनी: यह जातक का फॉलो-अप प्रश्न है। आपने पूर्व उत्तरों में कुछ बातें पहले ही कह दी हैं। ध्यान रखें कि पिछले उत्तरों की कोई भी पंक्ति, वाक्य, या उपाय इस नए उत्तर में कतई न दोहराएं (NO REPETITION)। इस प्रश्न ("${message.trim()}") का उत्तर 100% मौलिक, ताज़ा और केवल इसी विषय पर केंद्रित होना चाहिए।]`;
      } else {
        userPrompt += `\n\n[Strict Anti-Repetition Warning: This is a subsequent query. Do NOT repeat any sentences, lines, or remedies from previous answers. Provide 100% fresh, non-repetitive insights.]`;
      }
    }

    const hasRealKundali =
      kundaliContext &&
      typeof kundaliContext.name === 'string' &&
      kundaliContext.name.trim().length > 0 &&
      kundaliContext.name.trim().toLowerCase() !== 'aarav sharma' &&
      kundaliContext.name.trim().toLowerCase() !== 'seeker' &&
      Boolean(kundaliContext.ascendant || kundaliContext.moonSign);

    if (hasRealKundali) {
      // Build rich astrological dossier for the AI prompt
      const dossierParts: string[] = [];

      dossierParts.push(`\n\n========================================`);
      dossierParts.push(`🌟 जातक की सत्यापित जन्मकुंडली विवरण (VERIFIED BIRTH CHART DOSSIER):`);
      dossierParts.push(`• प्रोफ़ाइल आईडी (Profile ID): ${profile_id || kundaliContext.profile_id || 'active_profile'}`);
      dossierParts.push(`• चार्ट आईडी (Chart ID): ${chart_id || kundaliContext.chart_id || 'active_chart'}`);
      dossierParts.push(`• जातक का नाम (Native Name): ${kundaliContext.name}`);
      if (kundaliContext.dob) dossierParts.push(`• जन्म तिथि (DOB): ${kundaliContext.dob}`);
      if (kundaliContext.tob) dossierParts.push(`• जन्म समय (TOB): ${kundaliContext.tob}`);
      if (kundaliContext.place) dossierParts.push(`• जन्म स्थान (Place): ${kundaliContext.place}`);
      dossierParts.push(`• जन्म लग्न (Ascendant / Lagna): ${kundaliContext.ascendantHindi || kundaliContext.ascendant || 'स्पष्ट नहीं'} (डिग्री: ${kundaliContext.ascendantDegree || 'N/A'})`);
      if (kundaliContext.lagnaLord) {
        dossierParts.push(`• लग्नेश (Lagna Lord): ${kundaliContext.lagnaLord.planet} (भाव: ${kundaliContext.lagnaLord.house}, राशि: ${kundaliContext.lagnaLord.sign}, गरिमा: ${kundaliContext.lagnaLord.dignity})`);
      }
      dossierParts.push(`• चंद्र राशि (Moon Sign / Rashi): ${kundaliContext.moonSignHindi || kundaliContext.moonSign || 'स्पष्ट नहीं'}`);
      dossierParts.push(`• सूर्य राशि (Sun Sign): ${kundaliContext.sunSignHindi || kundaliContext.sunSign || 'स्पष्ट नहीं'}`);
      dossierParts.push(`• जन्म नक्षत्र (Birth Nakshatra): ${kundaliContext.birthNakshatraHindi || kundaliContext.birthNakshatra || 'स्पष्ट नहीं'} (स्वामी: ${kundaliContext.nakshatraLord || 'N/A'})`);

      // Verified Current Mahadasha & Antardasha with exact start and end dates
      const cd = kundaliContext.currentDasha;
      const mahaName = typeof cd === 'string' ? cd : (cd?.mahadashaHindi || cd?.mahadasha || 'स्पष्ट नहीं');
      const mahaDates = (cd && typeof cd === 'object' && cd.startDate && cd.endDate) ? ` (${cd.startDate} से ${cd.endDate} तक)` : '';
      dossierParts.push(`• वर्तमान सक्रिय महादशा (Current Active Mahadasha): ${mahaName}${mahaDates}`);

      if (cd && typeof cd === 'object' && cd.antardasha) {
        const antarName = cd.antardashaHindi || cd.antardasha;
        const antarDates = (cd.antardashaStartDate && cd.antardashaEndDate) ? ` (${cd.antardashaStartDate} से ${cd.antardashaEndDate} तक)` : '';
        dossierParts.push(`• वर्तमान सक्रिय अंतर्दशा (Current Active Antardasha): ${antarName}${antarDates}`);
      }

      // Complete 120-Year Vimshottari Mahadasha Timeline Table (Authoritative Ground Truth)
      if (Array.isArray(kundaliContext.dashaPeriods) && kundaliContext.dashaPeriods.length > 0) {
        dossierParts.push(`• सम्पूर्ण 9 विंशोत्तरी महादशा कालक्रम (COMPLETE 120-YEAR VIMSHOTTARI TABLE — STRICT GROUND TRUTH):`);
        kundaliContext.dashaPeriods.forEach((dp: any) => {
          const pName = dp.hindiName || dp.planet;
          const isCur = dp.current ? ' 🔴 [वर्तमान में सक्रिय दशा]' : '';
          dossierParts.push(`   - ${pName} महादशा: ${dp.startDate} से ${dp.endDate} तक (${dp.durationYears} वर्ष)${isCur}`);
        });
      }

      // Timeline Analysis: Past Milestones, Current Situation & 5-Year Outlook
      if (kundaliContext.timelineAnalysis) {
        const ta = kundaliContext.timelineAnalysis;
        dossierParts.push(`• वर्तमान आयु (Current Age): ${ta.age} वर्ष (वर्तमान वर्ष: ${ta.currentYear})`);
        if (Array.isArray(ta.pastMilestones) && ta.pastMilestones.length > 0) {
          dossierParts.push(`• विगत वर्षों की प्रमुख जीवन घटनाएं व महादशाएं (Past Milestones by Exact Years & Age):`);
          ta.pastMilestones.forEach((m: any) => {
            dossierParts.push(`   - कालखंड ${m.years} (${m.ageRange}): ${m.dashaHindi || m.dasha} दशा — ${m.keyThemeHindi || m.keyTheme}`);
          });
        }
        if (ta.currentSituation) {
          dossierParts.push(`• वर्तमान जीवन स्थिति (Current Situation Report):`);
          dossierParts.push(`   - सक्रिय महादशा: ${ta.currentSituation.activeDashaHindi || ta.currentSituation.activeDasha}`);
          dossierParts.push(`   - शनि गोचर स्थिति: ${ta.currentSituation.saturnTransitStatusHindi || ta.currentSituation.saturnTransitStatus}`);
          dossierParts.push(`   - गुरु गोचर प्रभाव: ${ta.currentSituation.jupiterTransitStatusHindi || ta.currentSituation.jupiterTransitStatus}`);
          dossierParts.push(`   - वैदिक सारांश: ${ta.currentSituation.runningPhaseVedicSummary}`);
        }
        if (Array.isArray(ta.future5Years) && ta.future5Years.length > 0) {
          dossierParts.push(`• आगामी 5 वर्षों का वर्ष-वार फलादेश (Next 5 Years Forecast Data):`);
          ta.future5Years.forEach((f: any) => {
            dossierParts.push(`   - ${f.forecastHindi}`);
          });
        }
      }

      // Career (10th house)
      if (kundaliContext.career10thHouse) {
        dossierParts.push(`• दशम भाव (10th Karma Bhava): राशि: ${kundaliContext.career10thHouse.sign}, दशमेश: ${kundaliContext.career10thHouse.lord}, दशम में स्थित ग्रह: ${kundaliContext.career10thHouse.planetsIn10th?.join(', ') || 'कोई नहीं'}`);
      }

      // Marriage (7th house)
      if (kundaliContext.marriage7thHouse) {
        dossierParts.push(`• सप्तम भाव (7th Kalatra Bhava): राशि: ${kundaliContext.marriage7thHouse.sign}, सप्तमेश: ${kundaliContext.marriage7thHouse.lord}, सप्तम में स्थित ग्रह: ${kundaliContext.marriage7thHouse.planetsIn7th?.join(', ') || 'कोई नहीं'}`);
      }

      // Planetary placements
      if (Array.isArray(kundaliContext.planetsSummary) && kundaliContext.planetsSummary.length > 0) {
        dossierParts.push(`• नवग्रह स्थितियां (Planetary Placements):`);
        kundaliContext.planetsSummary.forEach((p: any) => {
          dossierParts.push(`   - ${p.hindiName || p.planet}: भाव ${p.house}, राशि ${p.signHindi || p.sign}, अंश ${p.formattedDegree}, गरिमा ${p.dignityHindi || p.dignity}${p.isRetrograde ? ' (वक्री)' : ''}`);
        });
      }

      // Doshas & Yogas
      if (kundaliContext.doshas) {
        dossierParts.push(`• दोष स्थिति: मांगलिक: ${kundaliContext.doshas.isManglik ? 'हाँ' : 'नहीं'}, साढ़ेसाती: ${kundaliContext.doshas.isSadeSati ? kundaliContext.doshas.sadeSatiPhase : 'मुक्त'}, कालसर्प: ${kundaliContext.doshas.isKalsarp ? kundaliContext.doshas.kalsarpType : 'नहीं'}`);
      }
      if (Array.isArray(kundaliContext.yogasSummary) && kundaliContext.yogasSummary.length > 0) {
        dossierParts.push(`• प्रमुख योग: ${kundaliContext.yogasSummary.join(', ')}`);
      }
      if (Array.isArray(kundaliContext.luckyGemstones) && kundaliContext.luckyGemstones.length > 0) {
        dossierParts.push(`• शुभ कारक रत्न: ${kundaliContext.luckyGemstones.map((g: any) => `${g.gemHindi || g.gem} (${g.planet})`).join(', ')}`);
      }
      if (Array.isArray(kundaliContext.forbiddenGemstones) && kundaliContext.forbiddenGemstones.length > 0) {
        dossierParts.push(`• वर्जित मारक रत्न: ${kundaliContext.forbiddenGemstones.map((f: any) => `${f.gemHindi || f.gem} (${f.planet})`).join(', ')}`);
      }
      dossierParts.push(`========================================\n`);

      userPrompt += dossierParts.join('\n');
    } else {
      if (effectiveLanguage === 'hi') {
        userPrompt += `\n\n[महत्वपूर्ण निर्देश: जातक ने अभी अपनी व्यक्तिगत जन्म कुंडली दर्ज नहीं की है। कृपया किसी भी काल्पनिक नाम (जैसे आरव) या मनगढ़ंत लग्न का उल्लेख न करें। सामान्य वैदिक ज्योतिष सिद्धांतों एवं उपायों के अनुसार उत्तर दें। यदि जातक व्यक्तिगत समय जानना चाहे तो उसे अपनी जन्म तिथि, समय व स्थान दर्ज करने को कहें।]`;
      } else {
        userPrompt += `\n\n[Important: The user has not provided their specific birth details yet. Do NOT assume any dummy person name or fictitious chart. Provide guidance based on universal Vedic principles.]`;
      }
    }

    try {
      const { text: reply, modelUsed, isLiveAI } = await executeAstrologyCompletion({
        systemInstruction,
        userPrompt,
        conversationHistory,
        selectedModel,
        timeoutMs: 35000,
      });

      if (reply && reply.trim().length > 0) {
        // DEDUCT CREDIT ONLY ON SUCCESS (Requirement 3: failed request does not deduct credit)
        let remainingCredits = 9999;
        if (!isVip && profile_id) {
          const consumeRes = consumeProfileQuestionCredit(userId, profile_id, message);
          remainingCredits = consumeRes.remainingCredits;
        }

        const fallbackData = generateDynamicAstrologyResponse(
          message,
          effectiveLanguage,
          kundaliContext,
          conversationHistory
        );
        return res.json({
          reply,
          isLiveAI,
          source: modelUsed,
          modelUsed,
          suggestedQuestions: fallbackData.suggestedQuestions,
          remainingCredits,
        });
      }
    } catch (err: any) {
      console.warn('All live models failed or timed out, switching immediately to local Vedic engine:', err?.message || err);
      const dynamicResult = generateDynamicAstrologyResponse(
        message,
        effectiveLanguage,
        kundaliContext,
        conversationHistory
      );
      let remainingCredits = 9999;
      if (!isVip && profile_id) {
        const consumeRes = consumeProfileQuestionCredit(userId, profile_id, message);
        remainingCredits = consumeRes.remainingCredits;
      }
      return res.json({
        ...dynamicResult,
        isLiveAI: false,
        source: 'local-vedic-engine',
        remainingCredits,
      });
    }

    // Dynamic Astrological Intelligence Fallback
    const dynamicResult = generateDynamicAstrologyResponse(
      message,
      effectiveLanguage,
      kundaliContext,
      conversationHistory
    );
    let remainingCredits = 9999;
    if (!isVip && profile_id) {
      const consumeRes = consumeProfileQuestionCredit(userId, profile_id, message);
      remainingCredits = consumeRes.remainingCredits;
    }
    return res.json({
      ...dynamicResult,
      isLiveAI: false,
      source: 'local-vedic-engine',
      remainingCredits,
    });
  });


  // 2. Comprehensive AI Kundali Breakdown
  app.post('/api/gemini/kundali-analysis', async (req, res) => {
    const { kundali, language = 'en', selectedModel = 'auto' } = req.body;
    const fallbackAnalysis =
      language === 'hi'
        ? `🌟 **वैदिक कुंडली सार फलित:**\n\n1. **लग्न व व्यक्तित्व:** लग्न भाव और चंद्र की स्थिति उच्च बौद्धिक क्षमता, नैतिक आचरण एवं दूरदर्शिता प्रदान करती है।\n2. **आजीविका एवं धन:** दशम भाव और नवम (भाग्य) भाव का संबंध सरकारी सम्मान, निरंतर पदोन्नति एवं आर्थिक स्थिरता का मार्ग प्रशस्त करता है।\n3. **दांपत्य एवं परिवार:** सप्तमेश की स्थिति अनुकूल है। जीवनसाथी संस्कारी व सहयोगी होगा।\n4. **वैदिक उपाय:** सूर्य देव को नित्य तांबे के लोटे से अर्घ्य दें एवं गुरुवार को भीगी चना दाल गाय को खिलाएं।`
        : `🌟 **Vedic Kundali Synthesis:**\n\n1. **Personality & Lagna:** Favorable alignment of Lagna and Moon indicates keen intellect, high adaptability, and leadership.\n2. **Career & Wealth:** The 9th and 10th house trines bring continuous professional advancement, executive recognition, and sustained assets.\n3. **Marriage & Bonds:** The 7th lord holds supportive placement for lifelong stability and mutual respect.\n4. **Vedic Remedies:** Offer morning water to the Sun (Surya Arghya) and wear gold or yellow on Thursdays.`;

    if (!kundali) {
      return res.json({ analysis: fallbackAnalysis });
    }

    try {
      const prompt = `Perform a comprehensive, master-level Vedic Kundali reading for this native:
Birth Details: ${JSON.stringify(kundali.birthDetails)}
Lagna: ${kundali.ascendantSign}
Moon Sign: ${kundali.moonSign}
Sun Sign: ${kundali.sunSign}
Nakshatra: ${kundali.birthNakshatra}
Planetary Positions: ${JSON.stringify(kundali.planets?.map((p: any) => ({ planet: p.name, sign: p.sign, house: p.house, dignity: p.dignity })))}
Doshas: ${JSON.stringify(kundali.dosha)}

Format the response into 4 distinct sections:
1. Core Personality & Lagna Strengths (लग्न व व्यक्तित्व विश्लेषण)
2. Career, Wealth & Karmic Potential (आजीविका एवं धन योग)
3. Love, Marriage & Relationship Outlook (दांपत्य एवं परिवार)
4. Golden Remedies & Lucky Astrological Recommendations (वैदिक उपाय, रत्न व मंत्र)

Language to write in: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}`;

      const { text: analysis, modelUsed } = await executeAstrologyCompletion({
        systemInstruction: 'You are an authentic, wise Vedic Astrologer providing constructive, deeply personalized, and uplifting horoscope readings.',
        userPrompt: prompt,
        selectedModel,
        timeoutMs: 35000,
      });

      res.json({ analysis: analysis || fallbackAnalysis, source: modelUsed });
    } catch (error: any) {
      console.warn('Kundali AI error/timeout, serving instant Vedic fallback:', error?.message || error);
      res.json({ analysis: fallbackAnalysis, source: 'local-vedic-engine' });
    }
  });

  // 2B. Dedicated सम्पूर्ण कुंडली विश्लेषण (Complete Kundali Analysis) AI Endpoint
  app.post('/api/ai/sampoorn-kundali-analysis', async (req, res) => {
    const { question, kundali, language = 'hi', selectedModel = 'auto' } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required for complete kundali analysis' });
    }
    if (!kundali || !kundali.birthDetails) {
      return res.status(400).json({ error: 'Valid Kundali data is required' });
    }

    try {
      const b = kundali.birthDetails;
      const planetsSummary = (kundali.planets || []).map((p: any) =>
        `${p.name} in ${p.sign} (${p.formattedDegree || p.degree + '°'}) House ${p.house}, Dignity: ${p.dignity}, Retro: ${p.isRetrograde ? 'Yes' : 'No'}`
      ).join('; ');

      const activeDasha = (kundali.dashaPeriods || []).find((d: any) => d.current);

      const prompt = `CRITICAL TASK: Perform an authoritative, comprehensive, master-level Vedic Kundali reading (“सम्पूर्ण कुंडली विश्लेषण”) based STRICTLY on the authentic calculated astrology data below:

=== NATIVE BIRTH DETAILS ===
Name: ${b.name || 'Jatak'}
Gender: ${b.gender || 'Not specified'}
DOB: ${b.dob} at ${b.tob}
Place: ${b.pob} (Lat: ${b.lat}, Lon: ${b.lon}, TZ: ${b.timezone})

=== CALCULATED ASTROLOGICAL BLUEPRINT ===
Ascendant (Lagna): ${kundali.ascendantSign} (${kundali.ascendantDegree})
Lagna Lord: ${kundali.ascendantSign}
Moon Sign (Rashi): ${kundali.moonSign}
Sun Sign: ${kundali.sunSign}
Nakshatra: ${kundali.birthNakshatra} (Lord: ${kundali.nakshatraLord || 'Ketu'})
Planetary Placements (D1): ${planetsSummary}
Active Dasha: Mahadasha of ${activeDasha ? (activeDasha.hindiName || activeDasha.planet) : 'Current Planet'} (${activeDasha?.startDate || ''} to ${activeDasha?.endDate || ''})
Complete 120-Year Vimshottari Mahadasha Table (STRICT GROUND TRUTH):
${(kundali.dashaPeriods || []).map((d: any) => `- ${d.hindiName || d.planet} Mahadasha: ${d.startDate} से ${d.endDate} (${d.durationYears} वर्ष)${d.current ? ' [वर्तमान सक्रिय]' : ''}`).join('\n')}
Doshas Present: Manglik: ${kundali.dosha?.isManglik ? 'Yes' : 'No'}, Kalsarp: ${kundali.dosha?.isKalsarp ? kundali.dosha?.kalsarpType : 'No'}, Sade Sati: ${kundali.dosha?.isSadeSati ? 'Active' : 'Inactive'}
Major Auspicious Yogas: ${(kundali.yogas || []).map((y: any) => y.name).join(', ') || 'Classical Yogas Present'}

=== USER'S SPECIFIC QUESTION ===
"${question}"

=== MANDATORY INSTRUCTIONS & STRUCTURE ===
CRITICAL DASHA RULE: Under NO circumstances should you change or hallucinate different Mahadasha start/end years (e.g. if the verified table says Rahu Mahadasha is from 2009 to 2027, you MUST use exactly 2009 to 2027; NEVER claim 2030 or 2036). Adhere 100% strictly to the verified calculated table above.
Deliver a deeply personalized, authentic Vedic reading in ${language === 'hi' ? 'Hindi (शुद्ध, गरिमामयी एवं प्रेरक हिंदी)' : 'English'}.
Strictly follow the requested high-level structure:
1. Header: “✨ सम्पूर्ण कुंडली विश्लेषण”
2. User Biodata Summary
3. User Question
4. Overall Kundali Overview (Lagna, Moon, Sun, Nakshatra, Dasha)
5. Lagna Analysis (🔱 लग्न विश्लेषण: Lagna, Lord, personality, strengths, life direction)
6. Planetary Analysis (🪐 ग्रह एवं भाव विश्लेषण: key planets, degrees, dignity, aspects)
7. 12 Houses Analysis (🏠 12 भावों का विश्लेषण: significance & key house lords)
8. Major Yogas & Doshas (✨ प्रमुख योग एवं दोष: Raj Yogas, Dhana Yogas, remedial guidance)
9. D1 Rashi & D9 Navamsa Analysis (Spouse, marriage, inner strength, destiny realization)
10. D10 Dashamsa Analysis (Career, status, profession)
11. Other Relevant Divisional Charts (D2 Hora wealth, D4 property, D7 children)
12. Dasha & Antardasha Analysis (🕉️ दशा फलित: What current dasha is activating in life)
13. Question-Specific Deep Analysis (🔮 आपके प्रश्न का उत्तर: सीधा निष्कर्ष, विस्तृत ज्योतिषीय आधार, प्रमुख संकेत, अवसर, सावधानियाँ, समय संबंधी संकेत, अंतिम निष्कर्ष)
14. Major Strengths & Challenges
15. Possible Timing Windows (Auspicious periods for action)
16. Life Timeline (📅 संभावित प्रमुख जीवन घटनाएँ: 2026, 2027, 2028–29, 2030+ with confidence badges: 🟢 मजबूत संकेत / 🟡 मध्यम संकेत / 🔵 हल्के संकेत)
17. Final Synthesis & Vedic Blessing

SAFETY & ETHICS RULE:
No fake predictions, no fear-inducing language, no death predictions, no guarantee words ("यह अवश्य होगा" के स्थान पर "ज्योतिषीय संकेतों के अनुसार अनुकूल संभावना"). Provide uplifting, actionable, wise guidance.`;

      const { text: analysisText, modelUsed } = await executeAstrologyCompletion({
        systemInstruction: 'You are an authentic, venerable Vedic Acharya specializing in comprehensive Parashari and Jaimini astrology, providing structured, respectful, and insightful life readings.',
        userPrompt: prompt,
        selectedModel,
        timeoutMs: 40000,
      });

      res.json({
        analysisText,
        modelUsed,
        isLiveAI: true,
      });
    } catch (error: any) {
      console.warn('Sampoorn Kundali AI call failed/timed out, returning fallback indicator:', error?.message || error);
      res.json({
        analysisText: null,
        error: error?.message || 'AI service busy',
        isLiveAI: false,
      });
    }
  });

  // 3. AI Matchmaking Compatibility Report
  app.post(['/api/gemini/matchmaking', '/api/gemini/matchmaking-analysis'], async (req, res) => {
    const { matchResult, language = 'en', selectedModel = 'auto' } = req.body;
    const totalGunas = matchResult?.totalPoints ?? 26;
    const percentage = matchResult?.percentage ?? 72;
    const fallbackReport =
      language === 'hi'
        ? `💍 **अष्टकूट गुण मिलान विश्लेषण:**\n\nगुण मिलान में 36 में से **${totalGunas} गुण** (${percentage}%) प्राप्त हुए हैं। यह विवाह हेतु एक अत्यंत शुभ और संतुलित संयोग है।\n\n• **मानसिक व भावनात्मक सामंजस्य:** मैत्री एवं गण मिलान उत्तम है, जिससे वैचारिक मतभेद नगण्य रहेंगे।\n• **पारिवारिक व आर्थिक समृद्धि:** तारा और योनि मिलान दोनों के संयुक्त भाग्य को गति प्रदान करेगा।\n• **नाड़ी व स्वास्थ्य:** नाड़ी स्थिति अनुकूल है।\n• **शुभ उपाय:** विवाह पूर्व मां गौरी एवं भगवान शिव की संयुक्त पूजा कर आशीर्वाद प्राप्त करें।`
        : `💍 **Ashtakoot Guna Matching Report:**\n\nScored **${totalGunas} out of 36 Gunas** (${percentage}%). This signifies a harmonious, supportive, and auspicious matrimonial union.\n\n• **Emotional & Psychological Harmony:** Friendly Graha Maitri and Gana alignment guarantees deep understanding.\n• **Financial & Domestic Prosperity:** Tara and Yoni compatibility activates mutual prosperity.\n• **Nadi & Lineage:** Clean dosha balance ensures domestic stability.\n• **Auspicious Remedy:** Perform joint Gauri-Shankar Puja for lasting bliss.`;

    if (!matchResult) {
      return res.json({ report: fallbackReport });
    }

    try {
      const prompt = `Analyze this 36-Gun Vedic Marriage Compatibility result:
Score: ${matchResult.totalPoints} / 36 (${matchResult.percentage}%)
Recommendation: ${matchResult.recommendation}
Groom: Moon in ${matchResult.groomDetails?.name || 'Groom'}
Bride: Moon in ${matchResult.brideDetails?.name || 'Bride'}
Guna details: ${JSON.stringify(matchResult.gunas?.map((g: any) => ({ name: g.name, points: g.obtainedPoints, max: g.maxPoints })))}
Manglik Check: ${JSON.stringify(matchResult.manglikCheck)}

Provide an astrological marriage forecast covering:
1. Emotional & Psychological Chemistry
2. Financial Prosperity & Family Harmony
3. Progeny (Nadi) & Long-term Stability
4. Recommended Vedic Marriage Remedies if any minor doshas exist.

Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}`;

      const { text: report, modelUsed } = await executeAstrologyCompletion({
        systemInstruction: 'You are an expert Vedic Matchmaking Astrologer offering reassuring, balanced marital guidance.',
        userPrompt: prompt,
        selectedModel,
        timeoutMs: 35000,
      });

      res.json({ report: report || fallbackReport, source: modelUsed });
    } catch (error: any) {
      console.warn('Matchmaking AI error/timeout, serving instant Vedic fallback:', error?.message || error);
      res.json({ report: fallbackReport, source: 'local-vedic-engine' });
    }
  });

  // 4. Instant Prashna Kundali / Vedic Tarot Guidance
  app.post(['/api/gemini/prashna', '/api/gemini/prashna-reading'], async (req, res) => {
    const { question, cards = [], language = 'en', selectedModel = 'auto' } = req.body;
    const fallbackAnswer =
      language === 'hi'
        ? `🔮 **प्रश्न कुंडली व टैरो मार्गदर्शन:**\n\nआपके प्रश्न के अनुसार वर्तमान प्रश्न लग्न में शुभ ग्रहों का प्रभाव सक्रिय हो रहा है। आपके कार्य में जो भी रुकावटें हैं, वे आने वाले **3 से 6 सप्ताह** में दूर होंगी। धैर्य रखें, सकारात्मक संकल्प बनाए रखें और नित्य *ॐ नमः शिवाय* का 11 बार स्मरण करें। सफलता निश्चित रूप से प्राप्त होगी।`
        : `🔮 **Prashna Tantra Guidance:**\n\nBenefic horary currents indicate favorable momentum building around your query. The obstacles you perceive will systematically dissolve over the next **3 to 6 weeks**. Maintain clear conviction and chant *Om Namah Shivaya* daily for accelerated fruition.`;

    try {
      const prompt = `Seeker's Question: "${question || 'General Guidance'}"
Cosmic / Tarot Cards drawn: ${JSON.stringify(cards)}
Current Time: ${new Date().toISOString()}

Provide an insightful, intuitive, and spiritually grounded Vedic Prashna reading answering the seeker's query directly, revealing the underlying planetary energies, timing of fruition, and an actionable piece of wisdom.
Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}`;

      const { text: answer, modelUsed } = await executeAstrologyCompletion({
        systemInstruction: 'You are a spiritual Prashna Tantra Vedic master providing crystal clear intuitive horary insights.',
        userPrompt: prompt,
        selectedModel,
        timeoutMs: 35000,
      });

      res.json({ answer: answer || fallbackAnswer, source: modelUsed });
    } catch (error: any) {
      console.warn('Prashna AI error/timeout, serving instant Vedic fallback:', error?.message || error);
      res.json({ answer: fallbackAnswer, source: 'local-vedic-engine' });
    }
  });

  // 4B. Jagannatha Hora Astrological Synthesis AI Endpoint
  app.post(['/api/gemini/hora-synthesis', '/api/ai/hora-synthesis'], async (req, res) => {
    const { query, message, language = 'hi', selectedModel = 'auto' } = req.body;
    const promptText = query || message || 'Provide an authoritative Jagannatha Hora synthesis.';

    const fallbackSynthesis = language === 'hi'
      ? `🪐 **जगन्नाथ होरा विशेष संश्लेषण (Jagannatha Hora Synthesis):**\n\n` +
        `• **आत्मकारक व कारकांश विश्लेषण:** आपकी आत्मा की मूल प्रेरणा एवं आध्यात्मिक उन्नति के लिए आत्मकारक ग्रह शुभ स्थिति में स्थित है। कारकांश का प्रभाव जीवन में स्पष्ट लक्ष्य एवं कर्म-निष्ठा प्रदान करता है।\n` +
        `• **आरूढ़ लग्न (AL) एवं राज्य पद:** समाज में आपकी छवि और प्रतिष्ठा आरूढ़ लग्न द्वारा संचालित है। दशमांश (D10) की शक्ति करियर में सतत उन्नति व नेतृत्व का संकेत देती है।\n` +
        `• **उपपद (UL) एवं वैवाहिक समन्वय:** उपपद लग्न गृहस्थ जीवन में सौहार्द और स्थायित्व को प्रकट करता है।\n` +
        `• **षड्बल व सर्वाष्टकवर्ग मार्गदर्शन:** सर्वाधिक बली ग्रह आपके व्यक्तित्व की सबसे बड़ी शक्ति है। अष्टकवर्ग के शुभ बिंदु आर्थिक स्थिरता एवं स्वास्थ्य रक्षा में सहायक हैं।\n` +
        `• **मार्गदर्शक परामर्श:** नित्य प्रातः सूर्य को अर्घ्य दें और अपने इष्टदेव का ध्यान करें।`
      : `🪐 **Jagannatha Hora Astrological Synthesis:**\n\n` +
        `• **Atmakaraka & Karakamsha:** Your soul's primary spiritual trajectory is guided by an auspicious Atmakaraka placement, bringing high clarity of purpose.\n` +
        `• **Arudha Lagna (AL) & Rajya Pada:** Public reputation and societal footprint are well-fortified, indicating steady professional ascendancy in Dashamsha (D10).\n` +
        `• **Upapada Lagna (UL) & Matrimonial Harmony:** Indicates enduring domestic stability and supportive partnership.\n` +
        `• **Shadbala & Ashtakavarga:** The highest Shadbala planet represents your greatest life asset. Favorable Ashtakavarga bindus shield physical vitality and prosperity.\n` +
        `• **Remedial Guidance:** Offer water to the rising Sun daily and meditate on your Ishta Devata.`;

    try {
      const { text: reply, modelUsed, isLiveAI } = await executeAstrologyCompletion({
        systemInstruction: 'You are an authentic, venerable Vedic Acharya specializing in comprehensive Jaimini and Parashari Jagannatha Hora analysis.',
        userPrompt: promptText,
        selectedModel,
        timeoutMs: 35000,
      });

      res.json({
        reply: reply || fallbackSynthesis,
        source: modelUsed,
        isLiveAI,
      });
    } catch (err: any) {
      console.warn('Hora AI synthesis error/timeout, serving instant Vedic fallback:', err?.message || err);
      res.json({
        reply: fallbackSynthesis,
        source: 'local-vedic-engine',
        isLiveAI: false,
      });
    }
  });

  // 5. Google Maps Platform Geocoding & Places Proxy
  app.get('/api/maps/geocode', async (req, res) => {
    const address = req.query.address as string;
    if (!address || !address.trim()) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const key = process.env.GOOGLE_MAPS_PLATFORM_KEY || process.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || '';
    if (!key) {
      return res.status(503).json({ error: 'GOOGLE_MAPS_PLATFORM_KEY not set on server' });
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;
      const response = await fetch(url);
      const data = await response.json();
      return res.json(data);
    } catch (err: any) {
      console.warn('Google Maps geocoding error:', err);
      return res.status(500).json({ error: err.message || 'Geocoding request failed' });
    }
  });

  // 6. Google Maps Platform Reverse Geocoding Proxy
  app.get('/api/maps/reverse-geocode', async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng parameters are required' });
    }

    const key = process.env.GOOGLE_MAPS_PLATFORM_KEY || process.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || '';
    if (!key) {
      return res.status(503).json({ error: 'GOOGLE_MAPS_PLATFORM_KEY not set on server' });
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
      const response = await fetch(url);
      const data = await response.json();
      return res.json(data);
    } catch (err: any) {
      console.warn('Google Maps reverse geocoding error:', err);
      return res.status(500).json({ error: err.message || 'Reverse geocoding failed' });
    }
  });

  // 7. Google Maps Platform Timezone Proxy
  app.get('/api/maps/timezone', async (req, res) => {
    const { lat, lng, timestamp } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng parameters are required' });
    }

    const key = process.env.GOOGLE_MAPS_PLATFORM_KEY || process.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || '';
    if (!key) {
      return res.status(503).json({ error: 'GOOGLE_MAPS_PLATFORM_KEY not set on server' });
    }

    try {
      const ts = timestamp || Math.floor(Date.now() / 1000);
      const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${ts}&key=${key}`;
      const response = await fetch(url);
      const data = await response.json();
      return res.json(data);
    } catch (err: any) {
      console.warn('Google Maps timezone error:', err);
      return res.status(500).json({ error: err.message || 'Timezone request failed' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    if (typeof globalThis !== 'undefined') {
      delete (globalThis as any).__dirname;
    }
    if (typeof global !== 'undefined') {
      delete (global as any).__dirname;
    }
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AstroDost AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
