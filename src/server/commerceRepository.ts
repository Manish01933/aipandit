import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AppThemeConfig, DEFAULT_THEME, THEME_PRESETS } from '../types/theme';
import {
  CouponRule,
  CouponRedemptionRecord,
  CouponValidationResult,
  AdminAuditEvent,
  PlanCatalogItem,
  VerifiedEntitlement,
  TransactionRecord,
  PresetQuestion,
  GrantedUserRecord,
} from '../types/commerce';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '.data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultValue;
  }
}

function writeJsonFile<T>(filename: string, data: T): boolean {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const tempPath = filePath + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// ==========================================
// 1. GLOBAL THEME REPOSITORY
// ==========================================

export function getServerTheme(): AppThemeConfig {
  return readJsonFile<AppThemeConfig>('theme_settings.json', DEFAULT_THEME);
}

export function saveServerTheme(newTheme: Partial<AppThemeConfig>): { success: boolean; theme: AppThemeConfig; error?: string } {
  try {
    const current = getServerTheme();
    // Validate minimal theme structure
    if (!newTheme.colors || typeof newTheme.colors !== 'object') {
      return { success: false, theme: current, error: 'Invalid theme colors object' };
    }

    const updated: AppThemeConfig = {
      ...current,
      ...newTheme,
      colors: {
        ...current.colors,
        ...newTheme.colors,
      },
      version: (current.version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };

    const ok = writeJsonFile('theme_settings.json', updated);
    if (!ok) return { success: false, theme: current, error: 'Failed to write theme to storage' };
    return { success: true, theme: updated };
  } catch (e: any) {
    return { success: false, theme: getServerTheme(), error: e?.message || 'Theme save exception' };
  }
}

// ==========================================
// 2. TRUSTED PLAN CATALOG REPOSITORY
// ==========================================

export const INITIAL_PLAN_CATALOG: PlanCatalogItem[] = [
  // THE 3 OFFICIAL TIERS (PHASE 1 SPECIFICATION)
  {
    id: 'plan_kundli_explorer',
    nameHi: 'कुंडली एक्सप्लोरर (15 मिनट AI परामर्श)',
    nameEn: 'Kundli Explorer (15 Min Consultation)',
    descriptionHi: '15 मिनट लाइव AI ज्योतिषी परामर्श + 1 व्यक्ति की संपूर्ण जन्म कुंडली (वेब एनालिसिस)',
    descriptionEn: '15 Minutes Live AI Astrologer Consultation + Full web Kundli analysis for 1 birth profile',
    price: 299,
    originalPrice: 499,
    billingType: 'one_time',
    durationDays: 0, // permanent for this profile
    includedModules: ['jagannatha'],
    featuresHi: [
      '15 मिनट लाइव AI ज्योतिषी परामर्श (Live Consultation)',
      '1 व्यक्ति की संपूर्ण जन्म कुंडली (वेब एनालिसिस)',
      '5 पूर्वनिर्धारित AI ज्योतिष प्रश्न विकल्प',
      'विंशोत्तरी महादशा, वर्ग चार्ट व ग्रह स्थिति विश्लेषण',
      'PDF रिपोर्ट अलग से या अपग्रेड द्वारा उपलब्ध'
    ],
    featuresEn: [
      '15 Minutes Live AI Astrologer Consultation',
      'Full web Kundli analysis for 1 birth profile',
      '5 predefined AI astrology question presets',
      'Vimshottari Dasha, Varga charts & planet analysis',
      'PDF report separate or via upgrade'
    ],
    planCategory: 'profile_specific',
    defaultQuestionCredits: 5,
    defaultPdfCredits: 0,
    allocatedMinutes: 15,
    badge: '15 MIN ⏱️',
    couponEligible: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'plan_kundli_report',
    nameHi: 'कुंडली रिपोर्ट (35 मिनट AI परामर्श)',
    nameEn: 'Kundli Report (35 Min Consultation)',
    descriptionHi: '35 मिनट विस्तृत AI परामर्श + 1 संपूर्ण डाउनलोड योग्य 25-पृष्ठ PDF रिपोर्ट + एक्सप्लोरर',
    descriptionEn: '35 Minutes Detailed AI Consultation + 1 full downloadable 25-page PDF report + Explorer',
    price: 499,
    originalPrice: 999,
    billingType: 'one_time',
    durationDays: 0, // permanent for this profile
    includedModules: ['jagannatha'],
    featuresHi: [
      '35 मिनट विस्तृत AI ज्योतिषी परामर्श (28% बचत)',
      '1 संपूर्ण डाउनलोड योग्य 25-पृष्ठ PDF कुंडली रिपोर्ट',
      'कुंडली एक्सप्लोरर के समस्त फीचर्स शामिल',
      '5 पूर्वनिर्धारित AI ज्योतिष प्रश्न क्रेडिट',
      'उसी व्यक्ति की PDF रिपोर्ट पुनः निःशुल्क डाउनलोड करें'
    ],
    featuresEn: [
      '35 Minutes Detailed AI Astrologer Consultation (28% savings)',
      '1 complete downloadable 25-page PDF Kundli report',
      'All features included in Kundli Explorer plan',
      '5 predefined AI astrology question credits',
      'Free re-downloads of the purchased report anytime'
    ],
    planCategory: 'profile_specific',
    defaultQuestionCredits: 5,
    defaultPdfCredits: 1,
    allocatedMinutes: 35,
    badge: '35 MIN ⭐ POPULAR',
    isPopular: true,
    couponEligible: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'plan_astrodost_vip',
    nameHi: 'एस्ट्रोदोस्त वीआईपी (120 मिनट / 2 घंटे)',
    nameEn: 'AstroDost VIP (120 Min / 2 Hours)',
    descriptionHi: '120 मिनट (2 घंटे) वीआईपी AI परामर्श + प्रति माह 2 नई PDF रिपोर्ट्स + लो शू व अंक ज्योतिष',
    descriptionEn: '120 Minutes (2 Hours) VIP AI Consultation + 2 PDF reports per billing cycle + Lo Shu Grid & Ank Jyotish',
    price: 999,
    originalPrice: 1999,
    billingType: 'recurring',
    durationDays: 30, // 30 days per billing cycle
    includedModules: ['jagannatha', 'loshu', 'numerology', '*'],
    featuresHi: [
      '120 मिनट (2 घंटे) वीआईपी AI परामर्श (58% महाबचत)',
      'सत्र विभाजन (Multi-Session Split) – सुविधानुसार कभी भी उपयोग करें',
      'असीमित व्यक्तिगत AI चैट विंग',
      'प्रति बिलिंग अवधि (महीने) 2 नई प्रीमियम PDF रिपोर्ट क्रेडिट',
      'पूर्व में जनरेट की गई PDF बिना क्रेडिट कटे पुनः डाउनलोड',
      'विस्तृत लो शू ग्रिड महायोग व 81 अंक ज्योतिष विश्लेषण'
    ],
    featuresEn: [
      '120 Minutes (2 Hours) VIP AI Consultation (58% mega savings)',
      'Multi-session split – flexible usage across multiple sittings',
      'Unrestricted personal AI chat window enabled',
      '2 new premium PDF report credits per billing period',
      'Free repeat downloads of previously generated PDFs',
      'Expanded web-based Lo Shu Grid & Ank Jyotish analysis'
    ],
    planCategory: 'account_vip',
    defaultQuestionCredits: -1, // unlimited
    defaultPdfCredits: 2,
    allocatedMinutes: 120,
    badge: '120 MIN (2 HRS) 👑',
    couponEligible: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  // Standalone individual products (Workstream 3 requirements)
  {
    id: 'prod_swiss_ephemeris',
    nameHi: 'स्विस एफिमेरिस (जेहोरा) कम्प्लीट',
    nameEn: 'Swiss Ephemeris Kundali Complete',
    descriptionHi: 'सूक्ष्म ग्रह अंश, वर्ग कुंडलियां (D1-D60), विंशोत्तरी महादशा, अष्टकवर्ग व षड्बल',
    descriptionEn: 'Full planetary degrees, divisional varga charts (D1-D60), dasha hierarchy & shadbala',
    price: 799,
    originalPrice: 1499,
    billingType: 'one_time',
    durationDays: 0, // permanent one-time purchase
    includedModules: ['jagannatha'],
    featuresHi: ['D1 से D60 वर्ग चार्ट', 'विंशोत्तरी महादशा व अंतर्दशा', 'षड्बल व भाव बल', 'अष्टकवर्ग चक्र'],
    featuresEn: ['D1 to D60 Varga Charts', 'Vimshottari Dasha Hierarchy', 'Shadbala Strengths', 'Ashtakavarga Points'],
    couponEligible: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_loshu_grid',
    nameHi: 'लो शू ग्रिड महायोग कम्प्लीट',
    nameEn: 'Lo Shu Grid Complete',
    descriptionHi: '3x3 अंक चक्र, 8 महायोग विश्लेषण, मिसिंग नंबर प्रभाव व अचूक वैदिक उपाय',
    descriptionEn: '3x3 Magic Square, 8 Planes of Fortune, missing numbers & crystal remedies',
    price: 499,
    originalPrice: 999,
    billingType: 'one_time',
    durationDays: 0,
    includedModules: ['loshu'],
    featuresHi: ['8 राजयोग व महायोग', 'मिसिंग नंबर विश्लेषण', 'कस्टम रेमेडीज', 'लो शू ग्रिड PDF'],
    featuresEn: ['8 Planes Analysis', 'Missing Numbers Check', 'Elemental Remedies', 'Lo Shu Report PDF'],
    couponEligible: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'prod_ank_jyotish',
    nameHi: 'अंक ज्योतिष कम्प्लीट',
    nameEn: 'Ank Jyotish Complete',
    descriptionHi: '81 ड्राइवर-कंडक्टर योग, दशा टाइमलाइन, वाहन व नेम न्यूमेरोलॉजी कम्पैटिबिलिटी',
    descriptionEn: '81 Driver-Conductor combinations, life dasha timeline, vehicle & name numerology',
    price: 299,
    originalPrice: 599,
    billingType: 'one_time',
    durationDays: 0,
    includedModules: ['numerology'],
    featuresHi: ['81 ड्राइवर-कंडक्टर कॉम्बिनेशन', 'वार्षिक अंक दशा', 'नेम व मोबाइल न्यूमेरोलॉजी', 'वाहन नंबर मिलान'],
    featuresEn: ['81 Driver-Conductor Combos', 'Annual Dasha Forecast', 'Name & Mobile Numerology', 'Vehicle Number Analysis'],
    couponEligible: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  // 3-in-1 Combo Subscriptions
  {
    id: '1_month',
    nameHi: '3-इन-1 प्रो मासिक प्लान (1 Month)',
    nameEn: '3-in-1 Pro Plan (1 Month All-Inclusive)',
    descriptionHi: '30 दिन के लिए तीनों सर्विसेज (स्विस एफिमेरिस + लो शू ग्रिड + अंक ज्योतिष) का असीमित एक्सेस',
    descriptionEn: '30 days all-inclusive access to Swiss Ephemeris, Lo Shu Grid and Ank Jyotish',
    price: 999,
    originalPrice: 1499,
    billingType: 'recurring',
    durationDays: 30,
    includedModules: ['jagannatha', 'loshu', 'numerology'],
    featuresHi: ['तीनों सर्विसेज शामिल', 'असीमित कुंडलियां', 'लाइव AI ज्योतिषी प्रश्न', '30 दिन की वैधता'],
    featuresEn: ['All 3 Services Included', 'Unlimited Kundali charts', 'AI Astrologer consults', '30 Days validity'],
    badge: 'STARTER',
    couponEligible: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '3_months',
    nameHi: '3-इन-1 प्रो त्रैमासिक प्लान (3 Months)',
    nameEn: '3-in-1 Pro Plan (3 Months Popular)',
    descriptionHi: '90 दिन की निरंतर ज्योतिषीय गणना, गोचर व उपाय',
    descriptionEn: '90 days comprehensive astrology, transit updates & remedies',
    price: 1999,
    originalPrice: 2999,
    billingType: 'recurring',
    durationDays: 90,
    includedModules: ['jagannatha', 'loshu', 'numerology'],
    featuresHi: ['तीनों सर्विसेज शामिल', 'सर्वाधिक लोकप्रिय', '90 दिन की वैधता', 'सर्वश्रेष्ठ बचत'],
    featuresEn: ['All 3 Services Included', 'Most Popular Choice', '90 Days validity', 'High Value'],
    badge: 'POPULAR ⭐',
    isPopular: true,
    couponEligible: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '6_months',
    nameHi: '3-इन-1 प्रो अर्धवार्षिक प्लान (6 Months)',
    nameEn: '3-in-1 Pro Plan (6 Months Semi-Annual)',
    descriptionHi: '180 दिन का अर्धवार्षिक संपूर्ण कुंडली व अंक ज्योतिष पैकेज',
    descriptionEn: '180 days semi-annual predictive & remedial suite',
    price: 3999,
    originalPrice: 5999,
    billingType: 'recurring',
    durationDays: 180,
    includedModules: ['jagannatha', 'loshu', 'numerology'],
    featuresHi: ['तीनों सर्विसेज शामिल', '180 दिन की वैधता', 'सभी नई अपडेट्स मुफ्त', 'VIP प्राथमिकता सपोर्ट'],
    featuresEn: ['All 3 Services Included', '180 Days validity', 'Free feature updates', 'VIP priority support'],
    badge: 'BEST VALUE 💎',
    couponEligible: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'lifetime',
    nameHi: 'आजीवन VIP असीमित प्लान (Lifetime Access)',
    nameEn: 'Lifetime VIP All-Access Plan',
    descriptionHi: 'आजीवन असीमित एक्सेस — कभी कोई नवीनीकरण शुल्क नहीं',
    descriptionEn: 'Permanent unlimited VIP access to every current and future feature',
    price: 9999,
    originalPrice: 19999,
    billingType: 'one_time',
    durationDays: 0, // permanent
    includedModules: ['*'],
    featuresHi: ['आजीवन असीमित एक्सेस', 'कोई नवीनीकरण शुल्क नहीं', 'समस्त प्रीमियम सुविधाएं अनलॉक', 'वीआईपी दर्जा'],
    featuresEn: ['Permanent Unlimited Access', 'Never Pay Again', 'All Premium Modules Unlocked', 'VIP Status'],
    badge: 'LIFETIME VIP 👑',
    couponEligible: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export function getServerPlans(): PlanCatalogItem[] {
  return readJsonFile<PlanCatalogItem[]>('plan_catalog.json', INITIAL_PLAN_CATALOG);
}

export function saveServerPlans(plans: PlanCatalogItem[]): boolean {
  return writeJsonFile('plan_catalog.json', plans);
}

export function findPlanById(planId: string): PlanCatalogItem | undefined {
  const plans = getServerPlans();
  return plans.find((p) => p.id === planId && p.isActive);
}

// ==========================================
// 3. COUPON AND VIP ENGINE REPOSITORY
// ==========================================

export const INITIAL_COUPON_RULES: CouponRule[] = [
  {
    id: 'c_freevip',
    code: 'FREEVIP',
    titleHi: '100% फ्री VIP पास (Universal Free Pass)',
    titleEn: '100% Free VIP All-Access Pass',
    descriptionHi: 'समस्त प्रीमियम मॉड्यूल का 100% नि:शुल्क अनलॉकिंग कूपन',
    descriptionEn: 'Instantly grants 100% free access to all modules without payment',
    discountType: 'free_access',
    discountValue: 100,
    isActive: true,
    isConfigured: true,
    isMasterCode: true,
    requiresAdminRole: false,
    eligiblePlans: ['*'],
    eligibleModules: ['*'],
    minPurchaseAmount: 0,
    startDate: '2026-01-01T00:00:00.000Z',
    expiryDate: null,
    maxTotalUses: 10000,
    currentTotalUses: 0,
    maxUsesPerUser: 1,
    canCombine: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'c_gurugift',
    code: 'GURUGIFT',
    titleHi: 'गुरु कृपा विशेष भेंट (100% Free Gift)',
    titleEn: 'Guru Gift (100% Free Access)',
    descriptionHi: 'आचार्य जी की विशेष आध्यात्मिक कृपा द्वारा निःशुल्क प्रवेश',
    descriptionEn: 'Acharya divine gift providing 100% waiver on all packages',
    discountType: 'free_access',
    discountValue: 100,
    isActive: true,
    isConfigured: true,
    isMasterCode: true,
    requiresAdminRole: false,
    eligiblePlans: ['*'],
    eligibleModules: ['*'],
    minPurchaseAmount: 0,
    startDate: '2026-01-01T00:00:00.000Z',
    expiryDate: null,
    maxTotalUses: 5000,
    currentTotalUses: 0,
    maxUsesPerUser: 1,
    canCombine: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'c_astro100',
    code: 'ASTRO100',
    titleHi: 'एस्ट्रो 100% डिस्काउंट (Full Waiver)',
    titleEn: 'Astro 100% Discount Code',
    descriptionHi: 'प्रमोशनल कूपन जो चेकआउट राशि शून्य कर देता है',
    descriptionEn: 'Special coupon waiving 100% of the checkout cost',
    discountType: 'percentage',
    discountValue: 100,
    isActive: true,
    isConfigured: true,
    isMasterCode: true,
    requiresAdminRole: false,
    eligiblePlans: ['*'],
    eligibleModules: ['*'],
    minPurchaseAmount: 0,
    startDate: '2026-01-01T00:00:00.000Z',
    expiryDate: null,
    maxTotalUses: 5000,
    currentTotalUses: 0,
    maxUsesPerUser: 1,
    canCombine: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'c_adminvip',
    code: 'ADMINVIP',
    titleHi: 'एडमिन वीआईपी मास्टर कोड (Admin Only)',
    titleEn: 'Administrator Secret VIP Code',
    descriptionHi: 'केवल अधिकृत एडमिन पिन वाले उपयोगकर्ताओं के लिए सुरक्षित वीआईपी कोड',
    descriptionEn: 'Protected VIP code restricted strictly to authorized administrators',
    discountType: 'free_access',
    discountValue: 100,
    isActive: true,
    isConfigured: true,
    isMasterCode: true,
    requiresAdminRole: true,
    eligiblePlans: ['*'],
    eligibleModules: ['*'],
    minPurchaseAmount: 0,
    startDate: '2026-01-01T00:00:00.000Z',
    expiryDate: null,
    maxTotalUses: 1000,
    currentTotalUses: 0,
    maxUsesPerUser: 10,
    canCombine: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'c_omshanti',
    code: 'OMSHANTI',
    titleHi: 'ॐ शांति शुभ कूपन (₹500 Discount)',
    titleEn: 'Om Shanti Auspicious Discount (₹500 Off)',
    descriptionHi: 'किसी भी प्लान पर ₹500 की सीधी छूट (न्यूनतम ₹799 पर लागू)',
    descriptionEn: 'Flat ₹500 off on any subscription or product above ₹799',
    discountType: 'fixed_amount',
    discountValue: 500,
    isActive: true,
    isConfigured: true,
    isMasterCode: true,
    requiresAdminRole: false,
    eligiblePlans: ['*'],
    eligibleModules: ['*'],
    minPurchaseAmount: 799,
    startDate: '2026-01-01T00:00:00.000Z',
    expiryDate: null,
    maxTotalUses: 5000,
    currentTotalUses: 0,
    maxUsesPerUser: 1,
    canCombine: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export function getServerCoupons(): CouponRule[] {
  return readJsonFile<CouponRule[]>('coupons.json', INITIAL_COUPON_RULES);
}

export function saveServerCoupons(coupons: CouponRule[]): boolean {
  return writeJsonFile('coupons.json', coupons);
}

export function getServerRedemptions(): CouponRedemptionRecord[] {
  return readJsonFile<CouponRedemptionRecord[]>('coupon_redemptions.json', []);
}

export function saveServerRedemption(rec: CouponRedemptionRecord): boolean {
  const current = getServerRedemptions();
  // Check if already exists to prevent duplicate insertion
  const existingIdx = current.findIndex((r) => r.id === rec.id);
  if (existingIdx >= 0) {
    current[existingIdx] = rec;
  } else {
    current.unshift(rec);
  }
  return writeJsonFile('coupon_redemptions.json', current);
}

export function getServerAuditLogs(): AdminAuditEvent[] {
  return readJsonFile<AdminAuditEvent[]>('admin_audit_logs.json', []);
}

export function saveServerAuditEvent(event: AdminAuditEvent): boolean {
  const current = getServerAuditLogs();
  current.unshift(event);
  return writeJsonFile('admin_audit_logs.json', current);
}

// Revoke an individual redemption and its associated entitlement
export function revokeServerRedemption({
  redemptionId,
  revokedBy = 'Master Admin',
  revokeReason = 'Admin manual revocation',
}: {
  redemptionId: string;
  revokedBy?: string;
  revokeReason?: string;
}): { success: boolean; message: string; redemption?: CouponRedemptionRecord } {
  const redemptions = getServerRedemptions();
  const rIdx = redemptions.findIndex((r) => r.id === redemptionId);
  if (rIdx === -1) {
    return { success: false, message: 'Redemption record not found' };
  }

  const now = new Date().toISOString();
  const redemption = redemptions[rIdx];
  redemption.status = 'revoked';
  redemption.revokedAt = now;
  redemption.revokedBy = revokedBy;
  redemption.revokeReason = revokeReason;
  writeJsonFile('coupon_redemptions.json', redemptions);

  // Deactivate the entitlement
  const entitlements = getServerEntitlements();
  const eIdx = entitlements.findIndex(
    (e) => e.id === redemption.entitlementId || (e.userId === redemption.userId && e.planId === redemption.planId)
  );
  if (eIdx >= 0) {
    entitlements[eIdx].isActive = false;
    (entitlements[eIdx] as any).revokedAt = now;
    (entitlements[eIdx] as any).revokedBy = revokedBy;
    (entitlements[eIdx] as any).revokeReason = revokeReason;
    saveServerEntitlementsDirect(entitlements);
  }

  // Audit log
  saveServerAuditEvent({
    id: `AUDIT-${Date.now().toString(36).toUpperCase()}`,
    action: 'revoke_redemption',
    performedBy: revokedBy,
    targetId: redemptionId,
    targetType: 'redemption',
    details: {
      couponCode: redemption.couponCode,
      userId: redemption.userId,
      customerName: redemption.customerName,
      planId: redemption.planId,
      revokeReason,
      entitlementId: redemption.entitlementId,
    },
    timestamp: now,
  });

  return {
    success: true,
    message: `Redemption for ${redemption.customerName || redemption.userId} revoked successfully.`,
    redemption,
  };
}

// Revoke a coupon completely
export function revokeServerCoupon({
  couponId,
  revokedBy = 'Master Admin',
  revokeReason = 'Admin revocation',
}: {
  couponId: string;
  revokedBy?: string;
  revokeReason?: string;
}): { success: boolean; message: string; coupon?: CouponRule } {
  const coupons = getServerCoupons();
  const idx = coupons.findIndex((c) => c.id === couponId || c.code.toUpperCase() === couponId.toUpperCase());
  if (idx === -1) {
    return { success: false, message: 'Coupon not found' };
  }

  const now = new Date().toISOString();
  coupons[idx].isActive = false;
  coupons[idx].revokedAt = now;
  coupons[idx].revokedBy = revokedBy;
  coupons[idx].revokeReason = revokeReason;
  coupons[idx].updatedAt = now;
  saveServerCoupons(coupons);

  saveServerAuditEvent({
    id: `AUDIT-${Date.now().toString(36).toUpperCase()}`,
    action: 'revoke_coupon',
    performedBy: revokedBy,
    targetId: coupons[idx].id,
    targetType: 'coupon',
    details: {
      code: coupons[idx].code,
      revokeReason,
    },
    timestamp: now,
  });

  return { success: true, message: `Coupon "${coupons[idx].code}" revoked successfully.`, coupon: coupons[idx] };
}

// Server-side Coupon Validator
export function validateCouponOnServer({
  code,
  planId,
  userId = 'guest_user',
  customerEmail,
  customerPhone,
  isAdmin = false,
}: {
  code: string;
  planId: string;
  userId: string;
  customerEmail?: string;
  customerPhone?: string;
  isAdmin?: boolean;
}): CouponValidationResult {
  const cleanCode = (code || '').trim().toUpperCase();
  const plan = findPlanById(planId);

  if (!plan) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      finalPrice: 0,
      originalPrice: 0,
      isFreeAccess: false,
      message: 'अमान्य प्लान या प्रोडक्ट (Plan not found or inactive)',
    };
  }

  const originalPrice = plan.price;

  if (!cleanCode) {
    return {
      isValid: false,
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: 'कोई कूपन कोड दर्ज नहीं किया गया',
    };
  }

  const allCoupons = getServerCoupons();
  const rule = allCoupons.find((c) => c.code.toUpperCase() === cleanCode);

  if (!rule) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: `अमान्य कूपन कोड "${cleanCode}"। कृपया सही कोड दर्ज करें।`,
    };
  }

  if (!rule.isConfigured) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: `कूपन "${cleanCode}" अभी एडमिन द्वारा कॉन्फ़िगर नहीं किया गया है।`,
    };
  }

  if (!rule.isActive || rule.revokedAt) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: `कूपन "${cleanCode}" निष्क्रिय या निरस्त (Inactive / Revoked) कर दिया गया है।`,
    };
  }

  // Check admin role requirement
  if (rule.requiresAdminRole && !isAdmin) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: `कूपन "${cleanCode}" केवल अधिकृत एडमिन के लिए आरक्षित है।`,
    };
  }

  // Check user restriction list if configured
  if (
    rule.userRestrictionMode === 'selected_users' ||
    (rule.allowedUsers && Array.isArray(rule.allowedUsers) && rule.allowedUsers.length > 0)
  ) {
    const allowed = (rule.allowedUsers || []).map((u) => u.trim().toLowerCase());
    const userMatch =
      (userId && allowed.includes(userId.trim().toLowerCase())) ||
      (customerEmail && allowed.includes(customerEmail.trim().toLowerCase())) ||
      (customerPhone && allowed.includes(customerPhone.trim().toLowerCase())) ||
      (rule.targetCustomerEmail && customerEmail && rule.targetCustomerEmail.toLowerCase() === customerEmail.toLowerCase());

    if (!userMatch && !isAdmin) {
      return {
        isValid: false,
        code: cleanCode,
        discountType: rule.discountType,
        discountValue: rule.discountValue,
        discountAmount: 0,
        finalPrice: originalPrice,
        originalPrice,
        isFreeAccess: false,
        message: `यह कूपन कोड केवल विशिष्ट अधिकृत खातों के लिए आरक्षित है।`,
      };
    }
  }

  // Check start date & expiry
  const now = new Date();
  if (rule.startDate && new Date(rule.startDate) > now) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: `कूपन "${cleanCode}" अभी प्रारंभ नहीं हुआ है।`,
    };
  }

  if (rule.expiryDate && new Date(rule.expiryDate) < now) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: `कूपन "${cleanCode}" की वैधता समाप्त (Expired) हो चुकी है।`,
    };
  }

  // Check eligible plans
  if (!rule.eligiblePlans.includes('*') && !rule.eligiblePlans.includes(plan.id)) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: `यह कूपन चयनित प्लान (${plan.nameHi}) पर लागू नहीं है।`,
    };
  }

  // Check minimum purchase amount
  if (rule.minPurchaseAmount > 0 && originalPrice < rule.minPurchaseAmount) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: `यह कूपन न्यूनतम ₹${rule.minPurchaseAmount} की खरीद पर ही लागू हो सकता है।`,
    };
  }

  // Check total usage limits
  if (rule.maxTotalUses > 0 && (rule.currentTotalUses || 0) >= rule.maxTotalUses) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: `कूपन "${cleanCode}" की कुल उपयोग सीमा समाप्त (Fully Redeemed) हो चुकी है।`,
    };
  }

  // Check user redemption count from active redemptions
  const allRedemptions = getServerRedemptions();
  const userRedemptions = allRedemptions.filter(
    (r) =>
      r.couponCode === cleanCode &&
      r.status !== 'revoked' &&
      (r.userId === userId ||
        (customerEmail && r.customerEmail?.toLowerCase() === customerEmail.toLowerCase()) ||
        (customerPhone && r.customerPhone === customerPhone))
  );

  if (rule.maxUsesPerUser > 0 && userRedemptions.length >= rule.maxUsesPerUser && !isAdmin) {
    return {
      isValid: false,
      code: cleanCode,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
      isFreeAccess: false,
      message: `आप पहले ही इस कूपन कोड का अधिकतम उपयोग कर चुके हैं (${rule.maxUsesPerUser} बार स्वीकृत)।`,
    };
  }

  // Calculate discount
  let discountAmount = 0;
  if (rule.discountType === 'free_access' || (rule.discountType === 'percentage' && rule.discountValue >= 100)) {
    discountAmount = originalPrice;
  } else if (rule.discountType === 'percentage') {
    discountAmount = Math.round((originalPrice * rule.discountValue) / 100);
    if (rule.maxDiscountAmount && rule.maxDiscountAmount > 0) {
      discountAmount = Math.min(discountAmount, rule.maxDiscountAmount);
    }
  } else if (rule.discountType === 'fixed_amount') {
    discountAmount = Math.min(rule.discountValue, originalPrice);
  }

  discountAmount = Math.max(0, Math.min(discountAmount, originalPrice));
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const isFreeAccess = finalPrice === 0 || rule.discountType === 'free_access' || (rule.discountType === 'percentage' && rule.discountValue >= 100);

  // Compute granted duration & expected expiry
  const grantedDurationDays =
    rule.overrideDurationDays !== undefined && rule.overrideDurationDays !== null
      ? rule.overrideDurationDays
      : plan.durationDays;

  const expiresAt =
    grantedDurationDays === 0
      ? null
      : new Date(Date.now() + grantedDurationDays * 86400000).toISOString();

  const durationLabel =
    grantedDurationDays === 0
      ? 'आजीवन (Lifetime)'
      : `${grantedDurationDays} दिन (${grantedDurationDays} Days)`;

  return {
    isValid: true,
    code: cleanCode,
    discountType: rule.discountType,
    discountValue: rule.discountValue,
    discountAmount,
    finalPrice,
    originalPrice,
    isFreeAccess,
    grantedDurationDays,
    expiresAt,
    message: isFreeAccess
      ? `🎉 बधाई! कूपन "${cleanCode}" स्वीकृत — 100% नि:शुल्क अनलॉकिंग उपलब्ध [अवधि: ${durationLabel}]!`
      : `✓ कूपन "${cleanCode}" लागू: ₹${discountAmount} की छूट (देय राशि: ₹${finalPrice})`,
    couponRule: rule,
  };
}

// Atomic increment of coupon usage
export function recordCouponUsageAtomic(couponId: string): boolean {
  const coupons = getServerCoupons();
  const idx = coupons.findIndex((c) => c.id === couponId || c.code.toUpperCase() === couponId.toUpperCase());
  if (idx === -1) return false;
  coupons[idx].currentTotalUses = (coupons[idx].currentTotalUses || 0) + 1;
  coupons[idx].updatedAt = new Date().toISOString();
  return saveServerCoupons(coupons);
}

// ==========================================
// 4. TRANSACTIONS & ENTITLEMENTS REPOSITORY
// ==========================================

export function getServerTransactions(): TransactionRecord[] {
  return readJsonFile<TransactionRecord[]>('transactions.json', []);
}

export function saveServerTransaction(tx: TransactionRecord): boolean {
  const current = getServerTransactions();
  const existingIdx = current.findIndex((t) => t.id === tx.id || (tx.orderId && t.orderId === tx.orderId));
  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...tx };
  } else {
    current.unshift(tx);
  }
  return writeJsonFile('transactions.json', current);
}

export function getServerEntitlements(): VerifiedEntitlement[] {
  return readJsonFile<VerifiedEntitlement[]>('entitlements.json', []);
}

export function saveServerEntitlement(ent: VerifiedEntitlement): boolean {
  const current = getServerEntitlements();
  const existingIdx = current.findIndex((e) => {
    if (e.userId !== ent.userId || e.planId !== ent.planId) return false;
    if (ent.profileId) {
      return e.profileId === ent.profileId;
    }
    return !e.profileId;
  });
  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...ent };
  } else {
    current.unshift(ent);
  }
  return writeJsonFile('entitlements.json', current);
}

export function verifyUserEntitlementOnServer(userId: string, moduleId: string): boolean {
  if (!userId) return false;
  const entitlements = getServerEntitlements().filter((e) => e.userId === userId && e.isActive);
  const now = Date.now();

  for (const ent of entitlements) {
    if (ent.expiresAt) {
      if (new Date(ent.expiresAt).getTime() < now) {
        continue; // Expired
      }
    }
    if (ent.unlockedModules.includes('*') || ent.unlockedModules.includes(moduleId)) {
      return true;
    }
  }
  return false;
}

// ==========================================
// 5. PRESET ASTROLOGY QUESTIONS REPOSITORY
// ==========================================

export const INITIAL_PRESET_QUESTIONS: PresetQuestion[] = [
  {
    id: 'pq_career',
    questionHi: 'मेरी कुंडली के अनुसार करियर, नौकरी या व्यापार में उन्नति और सफलता का सबसे उत्तम समय कब है?',
    questionEn: 'According to my birth chart, when is the best planetary period for career promotion, job or business success?',
    category: 'career',
    isActive: true,
    order: 1,
  },
  {
    id: 'pq_marriage',
    questionHi: 'मेरे विवाह, जीवनसाथी के लक्षण, स्वभाव और वैवाहिक सुख के विषय में कुंडली क्या संकेत देती है?',
    questionEn: 'What does my Kundli reveal about the auspicious timing of marriage, spouse traits and marital harmony?',
    category: 'marriage',
    isActive: true,
    order: 2,
  },
  {
    id: 'pq_wealth',
    questionHi: 'मेरी कुंडली में धन संचय, वित्तीय स्थिरता, कर्ज मुक्ति और आर्थिक समृद्धि के क्या योग हैं?',
    questionEn: 'What are the planetary combinations in my chart for wealth accumulation, financial stability and prosperity?',
    category: 'wealth',
    isActive: true,
    order: 3,
  },
  {
    id: 'pq_future_5years',
    questionHi: 'आने वाले 5 सालों में आपका भविष्य कैसा रहेगा? (करियर, वित्त, स्वास्थ्य और पारिवारिक जीवन का वर्ष-वार फलादेश)',
    questionEn: 'How will your life & future unfold over the next 5 years? (Year-by-year Vedic forecast for Career, Wealth, Health & Family)',
    category: 'future',
    isActive: true,
    order: 4,
  },
  {
    id: 'pq_past_present_future',
    questionHi: 'भूत, वर्तमान और भविष्य का संपूर्ण विश्लेषण (विगत वर्षों की प्रमुख घटनाएं, वर्तमान स्थिति और आगामी समय का सटीक फलादेश)',
    questionEn: 'Deep Past, Present & Future Astrological Timeline Analysis (Past milestone years, current situation, and upcoming turning points)',
    category: 'timeline',
    isActive: true,
    order: 5,
  },
  {
    id: 'pq_remedies',
    questionHi: 'मेरी कुंडली में कौन से ग्रह कमजोर या पीड़ित हैं और उनके लिए सबसे सरल, सात्विक व अचूक वैदिक उपाय क्या हैं?',
    questionEn: 'Which planets are weak or afflicted in my chart, and what are the most effective Vedic remedies and mantras?',
    category: 'remedies',
    isActive: true,
    order: 6,
  },
  {
    id: 'pq_dosha',
    questionHi: 'क्या मेरी कुंडली में मांगलिक, कालसर्प, पितृ दोष या शनि साढ़ेसाती का प्रभाव है और इसका निवारण कैसे करें?',
    questionEn: 'Does my Kundli have Manglik, Kaal Sarp, Pitra Dosha or Saturn Sade Sati influences, and how to mitigate them?',
    category: 'dosha',
    isActive: true,
    order: 7,
  },
];

export function getServerPresetQuestions(): PresetQuestion[] {
  return readJsonFile<PresetQuestion[]>('preset_questions.json', INITIAL_PRESET_QUESTIONS);
}

export function saveServerPresetQuestions(questions: PresetQuestion[]): boolean {
  return writeJsonFile('preset_questions.json', questions);
}

// ==========================================
// 6. PER-PROFILE CREDIT & ENTITLEMENT TRACKING
// ==========================================

export function getUserActiveVipEntitlement(userId: string): VerifiedEntitlement | null {
  if (!userId) return null;
  const now = Date.now();

  // If master admin or admin superuser, always return permanent lifetime VIP entitlement
  if (
    userId === 'admin_master' ||
    userId === 'admin' ||
    userId === 'superuser' ||
    userId.startsWith('admin_') ||
    userId === 'manish98886@gmail.com' ||
    userId === 'manish' ||
    userId === 'default_user'
  ) {
    return {
      id: 'ENT-ADMIN-VIP',
      userId,
      clientName: 'Master Admin (AstroDost)',
      planId: 'plan_astrodost_vip',
      planName: 'AstroDost VIP (Master Admin Lifetime)',
      billingType: 'recurring',
      unlockedModules: ['*'],
      grantedAt: new Date().toISOString(),
      expiresAt: null, // permanent lifetime
      isActive: true,
      questionCreditsRemaining: 99999,
      pdfCreditsRemaining: 9999,
      canFreeTextChat: true,
      downloadedReportProfileIds: [],
    };
  }

  const ents = getServerEntitlements().filter(
    (e) =>
      (e.userId === userId || e.userId === `usr_${userId}` || (e.clientEmail && e.clientEmail.toLowerCase() === userId.toLowerCase())) &&
      e.isActive &&
      (e.planId === 'plan_astrodost_vip' || e.planId === '1_month' || e.planId === 'lifetime')
  );

  for (const ent of ents) {
    if (ent.expiresAt && new Date(ent.expiresAt).getTime() < now) {
      continue;
    }
    return ent;
  }

  // Also check granted users list
  const grantedList = getServerGrantedUsers().filter((g) => g.status === 'active' && g.planId === 'plan_astrodost_vip');
  for (const g of grantedList) {
    if (g.expiresAt && new Date(g.expiresAt).getTime() < now) continue;
    if (
      g.recipientEmailOrPhone?.toLowerCase() === userId.toLowerCase() ||
      g.token?.toLowerCase() === userId.toLowerCase() ||
      g.passCode?.toLowerCase() === userId.toLowerCase() ||
      userId.includes(g.token)
    ) {
      return {
        id: `ENT-GRANT-${g.id}`,
        userId,
        clientName: g.recipientName,
        planId: 'plan_astrodost_vip',
        planName: 'AstroDost VIP (Admin Gift Pass)',
        billingType: 'recurring',
        unlockedModules: ['*'],
        grantedAt: g.grantedAt,
        expiresAt: g.expiresAt,
        isActive: true,
        questionCreditsRemaining: 9999,
        pdfCreditsRemaining: 9999,
        canFreeTextChat: true,
        downloadedReportProfileIds: [],
      };
    }
  }

  return null;
}

export function getProfileEntitlement(userId: string, profileId: string): VerifiedEntitlement | null {
  if (!userId) return null;
  const now = Date.now();

  // If master admin or admin superuser, always return full entitlement
  if (userId === 'admin_master' || userId === 'admin' || userId === 'superuser' || userId.startsWith('admin_')) {
    return {
      id: 'ENT-ADMIN-PROFILE',
      userId,
      profileId: profileId || 'admin_profile',
      clientName: 'Master Admin',
      planId: 'plan_astrodost_vip',
      planName: 'AstroDost VIP (Master Admin)',
      billingType: 'recurring',
      unlockedModules: ['*'],
      grantedAt: new Date().toISOString(),
      expiresAt: null,
      isActive: true,
      questionCreditsRemaining: 9999,
      pdfCreditsRemaining: 9999,
      canFreeTextChat: true,
      downloadedReportProfileIds: [],
    };
  }

  const ents = getServerEntitlements().filter(
    (e) => (e.userId === userId || e.userId === `usr_${userId}`) && e.isActive && (e.profileId === profileId || !e.profileId)
  );
  if (ents.length > 0) {
    return ents[0];
  }

  // Check granted users
  const granted = getServerGrantedUsers().find(
    (g) =>
      g.status === 'active' &&
      (g.recipientEmailOrPhone?.toLowerCase() === userId.toLowerCase() ||
        g.token?.toLowerCase() === userId.toLowerCase() ||
        userId.includes(g.token))
  );
  if (granted) {
    if (!granted.expiresAt || new Date(granted.expiresAt).getTime() >= now) {
      const isReport = granted.planId === 'plan_kundli_report';
      const isVip = granted.planId === 'plan_astrodost_vip';
      return {
        id: `ENT-GRANT-${granted.id}`,
        userId,
        profileId,
        clientName: granted.recipientName,
        planId: granted.planId,
        planName: granted.planName,
        billingType: isVip ? 'recurring' : 'one_time',
        unlockedModules: isVip ? ['*'] : ['jagannatha'],
        grantedAt: granted.grantedAt,
        expiresAt: granted.expiresAt,
        isActive: true,
        questionCreditsRemaining: isVip ? 9999 : 5,
        pdfCreditsRemaining: isVip ? 9999 : isReport ? 1 : 0,
        canFreeTextChat: isVip,
        downloadedReportProfileIds: [],
      };
    }
  }

  return null;
}

export function consumeProfileQuestionCredit(
  userId: string,
  profileId: string,
  questionText: string
): { success: boolean; remainingCredits: number; message: string; isVipUnlimited?: boolean } {
  // Check if user has active VIP subscription
  const vip = getUserActiveVipEntitlement(userId);
  if (vip) {
    return {
      success: true,
      remainingCredits: 9999,
      message: 'VIP असीमित चैट सक्रिय',
      isVipUnlimited: true,
    };
  }

  const all = getServerEntitlements();
  const entIndex = all.findIndex(
    (e) => e.userId === userId && e.isActive && e.profileId === profileId
  );

  if (entIndex === -1) {
    return {
      success: false,
      remainingCredits: 0,
      message: 'इस प्रोफाइल के लिए कोई सक्रिय प्लान नहीं मिला। कृपया कुंडली एक्सप्लोरर (₹299) या वीआईपी लें।',
    };
  }

  const ent = all[entIndex];
  const currentCredits = typeof ent.questionCreditsRemaining === 'number' ? ent.questionCreditsRemaining : 5;

  if (currentCredits <= 0) {
    return {
      success: false,
      remainingCredits: 0,
      message: 'इस प्रोफाइल के सभी 5 प्रश्न क्रेडिट समाप्त हो चुके हैं। और प्रश्न पूछने हेतु VIP में अपग्रेड करें।',
    };
  }

  // Deduct 1 credit
  const newCredits = currentCredits - 1;
  const log = ent.questionsAskedLog || [];
  log.push({ question: questionText, askedAt: new Date().toISOString() });

  all[entIndex] = {
    ...ent,
    questionCreditsRemaining: newCredits,
    questionsAskedLog: log,
  };

  saveServerEntitlementsDirect(all);

  return {
    success: true,
    remainingCredits: newCredits,
    message: `✓ प्रश्न दर्ज किया गया। शेष क्रेडिट: ${newCredits}/5`,
  };
}

export function saveServerEntitlementsDirect(ents: VerifiedEntitlement[]): boolean {
  return writeJsonFile('entitlements.json', ents);
}

export function canDownloadProfilePdf(
  userId: string,
  profileId: string
): { canDownload: boolean; isRepeatFree: boolean; remainingPdfCredits: number; reason: string } {
  // 1. VIP Subscription check
  const vip = getUserActiveVipEntitlement(userId);
  if (vip) {
    const downloadedList = vip.downloadedReportProfileIds || [];
    if (downloadedList.includes(profileId)) {
      return {
        canDownload: true,
        isRepeatFree: true,
        remainingPdfCredits: vip.pdfCreditsRemaining ?? 2,
        reason: 'पूर्व में डाउनलोड की गई VIP रिपोर्ट (निःशुल्क पुनः डाउनलोड)',
      };
    }
    const rem = vip.pdfCreditsRemaining ?? 2;
    if (rem > 0) {
      return {
        canDownload: true,
        isRepeatFree: false,
        remainingPdfCredits: rem,
        reason: `VIP कोटा उपलब्ध (${rem}/2 क्रेडिट शेष)`,
      };
    }
    return {
      canDownload: false,
      isRepeatFree: false,
      remainingPdfCredits: 0,
      reason: 'इस बिलिंग चक्र के 2 VIP PDF क्रेडिट समाप्त हो चुके हैं।',
    };
  }

  // 2. Profile-specific Plan B check
  const ent = getProfileEntitlement(userId, profileId);
  if (!ent) {
    return {
      canDownload: false,
      isRepeatFree: false,
      remainingPdfCredits: 0,
      reason: 'इस प्रोफाइल के लिए कोई पेड PDF प्लान सक्रिय नहीं है।',
    };
  }

  if (ent.planId === 'plan_kundli_explorer') {
    return {
      canDownload: false,
      isRepeatFree: false,
      remainingPdfCredits: 0,
      reason: 'कुंडली एक्सप्लोरर (₹299) में PDF डाउनलोड शामिल नहीं है। कृपया ₹499 प्लान में अपग्रेड करें।',
    };
  }

  if (ent.planId === 'plan_kundli_report') {
    const downloadedList = ent.downloadedReportProfileIds || [];
    if (downloadedList.includes(profileId)) {
      return {
        canDownload: true,
        isRepeatFree: true,
        remainingPdfCredits: ent.pdfCreditsRemaining ?? 0,
        reason: 'खरीदी गई कुंडली रिपोर्ट (निःशुल्क पुनः डाउनलोड)',
      };
    }
    const rem = ent.pdfCreditsRemaining ?? 1;
    if (rem > 0) {
      return {
        canDownload: true,
        isRepeatFree: false,
        remainingPdfCredits: rem,
        reason: '1 संपूर्ण PDF रिपोर्ट क्रेडिट उपलब्ध',
      };
    }
    return {
      canDownload: false,
      isRepeatFree: false,
      remainingPdfCredits: 0,
      reason: 'इस प्रोफाइल का 1 PDF रिपोर्ट क्रेडिट पहले ही उपयोग किया जा चुका है।',
    };
  }

  return {
    canDownload: false,
    isRepeatFree: false,
    remainingPdfCredits: 0,
    reason: 'PDF डाउनलोड के लिए उपयुक्त प्लान आवश्यक है।',
  };
}

export function consumeProfilePdfCredit(
  userId: string,
  profileId: string
): { success: boolean; isRepeatFree: boolean; remainingPdfCredits: number; message: string } {
  const check = canDownloadProfilePdf(userId, profileId);
  if (!check.canDownload) {
    return {
      success: false,
      isRepeatFree: false,
      remainingPdfCredits: check.remainingPdfCredits,
      message: check.reason,
    };
  }

  if (check.isRepeatFree) {
    return {
      success: true,
      isRepeatFree: true,
      remainingPdfCredits: check.remainingPdfCredits,
      message: '✓ पूर्व में खरीदी गई रिपोर्ट — पुनः डाउनलोड निःशुल्क!',
    };
  }

  const all = getServerEntitlements();

  // Check VIP first
  const vip = getUserActiveVipEntitlement(userId);
  if (vip) {
    const vipIdx = all.findIndex((e) => e.id === vip.id);
    if (vipIdx >= 0) {
      const current = all[vipIdx];
      const rem = Math.max(0, (current.pdfCreditsRemaining ?? 2) - 1);
      const downloaded = current.downloadedReportProfileIds || [];
      if (!downloaded.includes(profileId)) {
        downloaded.push(profileId);
      }
      all[vipIdx] = {
        ...current,
        pdfCreditsRemaining: rem,
        downloadedReportProfileIds: downloaded,
      };
      saveServerEntitlementsDirect(all);
      return {
        success: true,
        isRepeatFree: false,
        remainingPdfCredits: rem,
        message: `✓ 1 VIP PDF क्रेडिट काटा गया। शेष: ${rem}/2`,
      };
    }
  }

  // Profile-specific
  const entIdx = all.findIndex(
    (e) => e.userId === userId && e.isActive && e.profileId === profileId
  );
  if (entIdx >= 0) {
    const current = all[entIdx];
    const rem = Math.max(0, (current.pdfCreditsRemaining ?? 1) - 1);
    const downloaded = current.downloadedReportProfileIds || [];
    if (!downloaded.includes(profileId)) {
      downloaded.push(profileId);
    }
    all[entIdx] = {
      ...current,
      pdfCreditsRemaining: rem,
      downloadedReportProfileIds: downloaded,
    };
    saveServerEntitlementsDirect(all);
    return {
      success: true,
      isRepeatFree: false,
      remainingPdfCredits: rem,
      message: '✓ 1 PDF रिपोर्ट क्रेडिट उपयोग हुआ। अब आप इसे कभी भी दोबारा मुफ्त डाउनलोड कर सकते हैं!',
    };
  }

  return {
    success: false,
    isRepeatFree: false,
    remainingPdfCredits: 0,
    message: 'क्रेडिट काटा नहीं जा सका।',
  };
}

// ==========================================
// 7. VIP SUBSCRIPTION LIFECYCLE MANAGEMENT
// ==========================================

export function getUserVipSubscriptionDetails(userId: string): {
  isVip: boolean;
  status: 'active' | 'cancelled_at_period_end' | 'expired' | 'none';
  entitlement: VerifiedEntitlement | null;
  expiresAt: string | null;
  daysRemaining: number;
  autoRenew: boolean;
  pdfCreditsRemaining: number;
  canFreeTextChat: boolean;
} {
  if (!userId) {
    return {
      isVip: false,
      status: 'none',
      entitlement: null,
      expiresAt: null,
      daysRemaining: 0,
      autoRenew: false,
      pdfCreditsRemaining: 0,
      canFreeTextChat: false,
    };
  }

  const all = getServerEntitlements();
  const now = Date.now();
  const vipList = all.filter(
    (e) =>
      e.userId === userId &&
      (e.planId === 'plan_astrodost_vip' || e.planId === '1_month' || e.planId === 'lifetime')
  );

  if (vipList.length === 0) {
    return {
      isVip: false,
      status: 'none',
      entitlement: null,
      expiresAt: null,
      daysRemaining: 0,
      autoRenew: false,
      pdfCreditsRemaining: 0,
      canFreeTextChat: false,
    };
  }

  // Pick the most recent VIP entitlement
  const vip = vipList[0];
  const expTime = vip.expiresAt ? new Date(vip.expiresAt).getTime() : null;
  const isExpired = expTime !== null && expTime < now;
  const daysRemaining = expTime ? Math.max(0, Math.ceil((expTime - now) / 86400000)) : 999;

  let status: 'active' | 'cancelled_at_period_end' | 'expired' | 'none' = 'active';
  if (isExpired) {
    status = 'expired';
  } else if (vip.cancellationPending || vip.autoRenew === false) {
    status = 'cancelled_at_period_end';
  }

  const isVipActive = !isExpired && vip.isActive;

  return {
    isVip: isVipActive,
    status,
    entitlement: vip,
    expiresAt: vip.expiresAt,
    daysRemaining,
    autoRenew: vip.autoRenew !== false,
    pdfCreditsRemaining: vip.pdfCreditsRemaining ?? 2,
    canFreeTextChat: isVipActive,
  };
}

export function cancelUserVipSubscription(userId: string): {
  success: boolean;
  message: string;
  entitlement: VerifiedEntitlement | null;
  expiresAt: string | null;
} {
  const all = getServerEntitlements();
  const vipIdx = all.findIndex(
    (e) =>
      e.userId === userId &&
      e.isActive &&
      (e.planId === 'plan_astrodost_vip' || e.planId === '1_month' || e.planId === 'lifetime')
  );

  if (vipIdx === -1) {
    return {
      success: false,
      message: 'कोई सक्रिय VIP सदस्यता नहीं मिली।',
      entitlement: null,
      expiresAt: null,
    };
  }

  const vip = all[vipIdx];
  const updated: VerifiedEntitlement = {
    ...vip,
    autoRenew: false,
    cancellationPending: true,
    cancelledAt: new Date().toISOString(),
  };

  all[vipIdx] = updated;
  saveServerEntitlementsDirect(all);

  const formattedDate = vip.expiresAt ? new Date(vip.expiresAt).toLocaleDateString() : 'वर्तमान चक्र के अंत';

  return {
    success: true,
    message: `✓ सदस्यता स्वतः-नवीनीकरण रद्द कर दिया गया है। आपकी VIP सुविधाएं ${formattedDate} तक पूर्णतः सक्रिय रहेंगी।`,
    entitlement: updated,
    expiresAt: vip.expiresAt,
  };
}

export function renewUserVipSubscription(
  userId: string,
  durationDays = 30
): {
  success: boolean;
  message: string;
  entitlement: VerifiedEntitlement;
} {
  const all = getServerEntitlements();
  const now = new Date();
  const vipIdx = all.findIndex(
    (e) =>
      e.userId === userId &&
      (e.planId === 'plan_astrodost_vip' || e.planId === '1_month' || e.planId === 'lifetime')
  );

  let vip: VerifiedEntitlement;
  if (vipIdx >= 0) {
    vip = all[vipIdx];
    const currentExp = vip.expiresAt ? new Date(vip.expiresAt).getTime() : 0;
    const baseTime = currentExp > now.getTime() ? currentExp : now.getTime();
    const newExpiresAt = new Date(baseTime + durationDays * 86400000).toISOString();

    const updated: VerifiedEntitlement = {
      ...vip,
      isActive: true,
      autoRenew: true,
      cancellationPending: false,
      expiresAt: newExpiresAt,
      pdfCreditsRemaining: (vip.pdfCreditsRemaining || 0) + 2, // 2 fresh PDF credits for the new billing cycle
      billingCycleNumber: (vip.billingCycleNumber || 1) + 1,
    };
    all[vipIdx] = updated;
    saveServerEntitlementsDirect(all);
    vip = updated;
  } else {
    // New VIP entitlement
    const newExpiresAt = new Date(now.getTime() + durationDays * 86400000).toISOString();
    vip = {
      id: `ENT-VIP-${Date.now().toString(36).toUpperCase()}`,
      userId,
      clientName: 'VIP Member',
      planId: 'plan_astrodost_vip',
      planName: 'AstroDost VIP',
      billingType: 'recurring',
      unlockedModules: ['jagannatha', 'loshu', 'numerology', '*'],
      grantedAt: now.toISOString(),
      expiresAt: newExpiresAt,
      isActive: true,
      autoRenew: true,
      cancellationPending: false,
      questionCreditsRemaining: 9999,
      pdfCreditsRemaining: 2,
      downloadedReportProfileIds: [],
      canFreeTextChat: true,
      billingCycleNumber: 1,
    };
    all.unshift(vip);
    saveServerEntitlementsDirect(all);
  }

  // Record renewal transaction
  saveServerTransaction({
    id: `TX-RENEW-${Date.now().toString(36).toUpperCase()}`,
    userId,
    clientName: vip.clientName,
    planId: 'plan_astrodost_vip',
    planTitle: 'AstroDost VIP (Monthly Renewal)',
    amount: 999,
    originalAmount: 999,
    discountAmount: 0,
    paymentMethod: 'razorpay',
    status: 'captured',
    isVerified: true,
    createdAt: now.toISOString(),
    verifiedAt: now.toISOString(),
  });

  return {
    success: true,
    message: '✓ एस्ट्रोदोस्त VIP सदस्यता 30 दिनों के लिए नवीनीकृत की गई। 2 नए PDF रिपोर्ट क्रेडिट जोड़े गए।',
    entitlement: vip,
  };
}

// ==========================================
// 8. ADMIN FREE PROJECT GRANT & SUPERUSER VIP
// ==========================================

export function getServerGrantedUsers(): GrantedUserRecord[] {
  return readJsonFile<GrantedUserRecord[]>('granted_users.json', []);
}

export function saveServerGrantedUsers(records: GrantedUserRecord[]): boolean {
  return writeJsonFile('granted_users.json', records);
}

export function grantUserAccessByAdmin(params: {
  recipientName: string;
  recipientEmailOrPhone?: string;
  planId: string;
  durationDays?: number;
  notes?: string;
  baseUrl?: string;
}): {
  success: boolean;
  grantedUser: GrantedUserRecord;
  shareableLink: string;
  whatsappMessage: string;
} {
  const {
    recipientName = 'सम्मानित मित्र',
    recipientEmailOrPhone = '',
    planId = 'plan_astrodost_vip',
    durationDays = 0,
    notes = 'एडमिन द्वारा 100% मुफ़्त एक्सेस उपहार',
    baseUrl = 'https://astrodost.ai',
  } = params;

  const now = new Date();
  const token = 'VIP-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  const passCode = 'GIFT-' + Math.floor(1000 + Math.random() * 9000);
  const id = `GU-${Date.now().toString(36).toUpperCase()}`;

  let expiresAt: string | null = null;
  if (durationDays > 0) {
    const expDate = new Date(now.getTime() + durationDays * 86400000);
    expiresAt = expDate.toISOString();
  }

  const plan = findPlanById(planId) || {
    id: planId,
    nameHi:
      planId === 'plan_kundli_explorer'
        ? 'कुंडली एक्सप्लोरर'
        : planId === 'plan_kundli_report'
        ? 'कुंडली रिपोर्ट'
        : 'एस्ट्रोदोस्त VIP Pro',
    nameEn:
      planId === 'plan_kundli_explorer'
        ? 'Kundli Explorer'
        : planId === 'plan_kundli_report'
        ? 'Kundli Report'
        : 'AstroDost VIP',
  };

  const clientParam = encodeURIComponent(recipientName.trim());
  const cleanBaseUrl = (baseUrl || 'https://astrodost.ai').replace(/\/$/, '');
  const shareableLink = `${cleanBaseUrl}?free_pass=1&vip=free&plan=${planId}&token=${token}&code=${passCode}&client=${clientParam}`;

  const record: GrantedUserRecord = {
    id,
    recipientName: recipientName.trim(),
    recipientEmailOrPhone: recipientEmailOrPhone.trim(),
    planId,
    planName: (plan as any).nameHi || plan.nameEn,
    durationDays,
    grantedAt: now.toISOString(),
    expiresAt,
    passCode,
    token,
    shareableLink,
    status: 'active',
    notes,
    grantedBy: 'Master Admin',
  };

  const all = getServerGrantedUsers();
  all.unshift(record);
  saveServerGrantedUsers(all);

  // Also create immediate verified server entitlement
  const isVip = planId === 'plan_astrodost_vip' || planId === 'lifetime';
  const isReport = planId === 'plan_kundli_report';

  const userIdsToSeed = [token];
  if (recipientEmailOrPhone.trim()) {
    userIdsToSeed.push(recipientEmailOrPhone.trim());
  }

  const allEnts = getServerEntitlements();
  for (const uid of userIdsToSeed) {
    const newEnt: VerifiedEntitlement = {
      id: `ENT-GRANT-${token}-${Date.now().toString(36).toUpperCase()}`,
      userId: uid,
      clientName: recipientName.trim(),
      clientEmail: recipientEmailOrPhone.includes('@') ? recipientEmailOrPhone : undefined,
      clientPhone: !recipientEmailOrPhone.includes('@') && recipientEmailOrPhone ? recipientEmailOrPhone : undefined,
      planId,
      planName: (plan as any).nameHi || plan.nameEn,
      billingType: isVip ? 'recurring' : 'one_time',
      unlockedModules: isVip ? ['*'] : ['jagannatha'],
      grantedAt: now.toISOString(),
      expiresAt,
      isActive: true,
      questionCreditsRemaining: isVip ? 9999 : 5,
      pdfCreditsRemaining: isVip ? 9999 : isReport ? 1 : 0,
      downloadedReportProfileIds: [],
      canFreeTextChat: isVip,
      couponCodeUsed: passCode,
    };
    allEnts.unshift(newEnt);
  }
  saveServerEntitlementsDirect(allEnts);

  // WhatsApp formatted message in friendly Hindi
  const planLabel = isVip
    ? '✨ AstroDost VIP All-Access (असीमित AI ज्योतिष चैट, कुंडली, लो शू ग्रिड व अंक ज्योतिष)'
    : isReport
    ? '📜 AstroDost कुंडली रिपोर्ट (25-पृष्ठ प्रीमियम PDF रिपोर्ट + 5 AI प्रश्न)'
    : '🌟 AstroDost कुंडली एक्सप्लोरर (वेब कुंडली एनालिसिस + 5 AI प्रश्न)';

  const validityLabel = durationDays === 0 ? 'आजीवन (Lifetime)' : `${durationDays} दिनों के लिए`;

  const whatsappMessage =
    `🙏 नमस्ते ${recipientName || 'जी'}!\n\n` +
    `🎉 AstroDost एडमिन की ओर से आपके लिए *${planLabel}* 100% मुफ़्त अनलॉक कर दिया गया है!\n\n` +
    `👑 वैधता: *${validityLabel}*\n` +
    `🔑 आपका पास कोड: *${passCode}*\n\n` +
    `👉 *अपना मुफ़्त एक्सेस तुरंत शुरू करने के लिए यहाँ क्लिक करें:*\n${shareableLink}\n\n` +
    `(यह लिंक आपके लिए पूरी तरह मुफ़्त है, कोई चार्ज नहीं लगेगा!)`;

  return {
    success: true,
    grantedUser: record,
    shareableLink,
    whatsappMessage,
  };
}

export function revokeServerGrantedUser(id: string): { success: boolean; message: string } {
  const all = getServerGrantedUsers();
  const idx = all.findIndex((g) => g.id === id);
  if (idx === -1) {
    return { success: false, message: 'Granted user not found' };
  }
  all[idx].status = 'revoked';
  saveServerGrantedUsers(all);
  return { success: true, message: 'एक्सेस सफलतापूर्वक रद्द कर दिया गया।' };
}

export function activateAdminSelfVip(userId: string = 'admin_master'): {
  success: boolean;
  message: string;
  entitlement: VerifiedEntitlement;
} {
  const now = new Date();
  const targetIds = ['admin_master', 'admin', 'default_user'];
  if (userId && !targetIds.includes(userId)) {
    targetIds.push(userId);
  }

  const all = getServerEntitlements();
  let masterEnt: VerifiedEntitlement | null = null;

  for (const tid of targetIds) {
    const existingIdx = all.findIndex((e) => e.userId === tid);
    const ent: VerifiedEntitlement = {
      id: `ENT-ADMIN-${tid}`,
      userId: tid,
      clientName: 'Master Admin',
      planId: 'plan_astrodost_vip',
      planName: 'AstroDost VIP (Master Admin)',
      billingType: 'recurring',
      unlockedModules: ['*'],
      grantedAt: now.toISOString(),
      expiresAt: null, // Lifetime
      isActive: true,
      autoRenew: true,
      questionCreditsRemaining: 9999,
      pdfCreditsRemaining: 9999,
      canFreeTextChat: true,
      downloadedReportProfileIds: [],
    };

    if (existingIdx >= 0) {
      all[existingIdx] = ent;
    } else {
      all.unshift(ent);
    }

    if (!masterEnt) masterEnt = ent;
  }

  saveServerEntitlementsDirect(all);

  return {
    success: true,
    message: '👑 मास्टर एडमिन VIP Pro सफलतापूर्वक आजीवन सक्रिय कर दिया गया! अब आपके लिए सभी फीचर्स 100% मुफ़्त हैं।',
    entitlement: masterEnt!,
  };
}

export function syncFreePassForUser(params: {
  token: string;
  planId?: string;
  clientName?: string;
  targetUserId: string;
}): { success: boolean; entitlement: VerifiedEntitlement } {
  const { token, planId = 'plan_astrodost_vip', clientName = 'VIP Member', targetUserId } = params;
  const now = new Date();

  // Find granted user record
  const granted = getServerGrantedUsers().find(
    (g) =>
      g.status === 'active' &&
      (g.token.toUpperCase() === token.toUpperCase() || g.passCode.toUpperCase() === token.toUpperCase())
  );

  const effectivePlanId = granted ? granted.planId : planId;
  const effectiveName = granted ? granted.recipientName : clientName;
  const effectiveExpiresAt = granted ? granted.expiresAt : null;

  const isVip = effectivePlanId === 'plan_astrodost_vip' || effectivePlanId === 'lifetime';
  const isReport = effectivePlanId === 'plan_kundli_report';

  const all = getServerEntitlements();
  const existingIdx = all.findIndex((e) => e.userId === targetUserId);

  const ent: VerifiedEntitlement = {
    id: `ENT-SYNC-${Date.now().toString(36).toUpperCase()}`,
    userId: targetUserId,
    clientName: effectiveName,
    planId: effectivePlanId,
    planName: isVip
      ? 'AstroDost VIP (Gift Pass)'
      : isReport
      ? 'Kundli Report (Gift Pass)'
      : 'Kundli Explorer (Gift Pass)',
    billingType: isVip ? 'recurring' : 'one_time',
    unlockedModules: isVip ? ['*'] : ['jagannatha'],
    grantedAt: now.toISOString(),
    expiresAt: effectiveExpiresAt,
    isActive: true,
    questionCreditsRemaining: isVip ? 9999 : 5,
    pdfCreditsRemaining: isVip ? 9999 : isReport ? 1 : 0,
    downloadedReportProfileIds: [],
    canFreeTextChat: isVip,
    couponCodeUsed: token,
  };

  if (existingIdx >= 0) {
    all[existingIdx] = ent;
  } else {
    all.unshift(ent);
  }

  saveServerEntitlementsDirect(all);

  return { success: true, entitlement: ent };
}

// ==========================================
// 14. PRODUCTION DATABASE BACKUP & RESTORE REPOSITORY
// ==========================================

const BACKUP_DIR = path.join(DATA_DIR, 'backups');

export function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

export function createDatabaseBackup(reason = 'manual_snapshot'): {
  success: boolean;
  backupId: string;
  timestamp: string;
  files: string[];
  totalSizeBytes: number;
  error?: string;
} {
  try {
    ensureDataDir();
    ensureBackupDir();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `bkp_${timestamp}_${Math.random().toString(36).slice(2, 6)}`;
    const targetDir = path.join(BACKUP_DIR, backupId);
    fs.mkdirSync(targetDir, { recursive: true });

    const sourceFiles = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
    let totalSizeBytes = 0;
    const copiedFiles: string[] = [];

    for (const file of sourceFiles) {
      const srcPath = path.join(DATA_DIR, file);
      const destPath = path.join(targetDir, file);
      const stat = fs.statSync(srcPath);
      if (stat.isFile()) {
        fs.copyFileSync(srcPath, destPath);
        totalSizeBytes += stat.size;
        copiedFiles.push(file);
      }
    }

    const manifest = {
      backupId,
      createdAt: new Date().toISOString(),
      reason,
      files: copiedFiles,
      totalSizeBytes,
    };
    fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

    return {
      success: true,
      backupId,
      timestamp: manifest.createdAt,
      files: copiedFiles,
      totalSizeBytes,
    };
  } catch (err: any) {
    console.error('Database backup failed:', err);
    return {
      success: false,
      backupId: '',
      timestamp: new Date().toISOString(),
      files: [],
      totalSizeBytes: 0,
      error: err?.message || 'Backup failed',
    };
  }
}

export function listDatabaseBackups(): Array<{
  backupId: string;
  createdAt: string;
  reason: string;
  filesCount: number;
  totalSizeBytes: number;
}> {
  ensureBackupDir();
  try {
    const entries = fs.readdirSync(BACKUP_DIR, { withFileTypes: true });
    const backups: any[] = [];
    for (const ent of entries) {
      if (ent.isDirectory()) {
        const manifestPath = path.join(BACKUP_DIR, ent.name, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
          try {
            const data = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            backups.push({
              backupId: data.backupId || ent.name,
              createdAt: data.createdAt || '',
              reason: data.reason || 'snapshot',
              filesCount: data.files?.length || 0,
              totalSizeBytes: data.totalSizeBytes || 0,
            });
          } catch {
            // ignore bad manifest
          }
        }
      }
    }
    return backups.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    console.error('Failed to list backups:', err);
    return [];
  }
}

export function restoreDatabaseBackup(backupId: string): {
  success: boolean;
  message: string;
  restoredFiles: string[];
  error?: string;
} {
  ensureBackupDir();
  try {
    const safeBackupId = path.basename(backupId);
    const sourceDir = path.join(BACKUP_DIR, safeBackupId);
    if (!fs.existsSync(sourceDir)) {
      return { success: false, message: 'Backup not found', restoredFiles: [], error: 'Backup not found' };
    }

    const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith('.json') && f !== 'manifest.json');
    const restored: string[] = [];

    // First create a rollback pre-restore safety snapshot
    createDatabaseBackup(`pre_restore_${safeBackupId}`);

    for (const file of files) {
      const srcPath = path.join(sourceDir, file);
      const destPath = path.join(DATA_DIR, file);
      fs.copyFileSync(srcPath, destPath);
      restored.push(file);
    }

    return {
      success: true,
      message: `Successfully restored ${restored.length} files from backup ${safeBackupId}`,
      restoredFiles: restored,
    };
  } catch (err: any) {
    console.error('Database restore failed:', err);
    return {
      success: false,
      message: 'Database restore operation failed',
      restoredFiles: [],
      error: err?.message,
    };
  }
}

export function getDatabaseIntegrityStatus(): {
  isHealthy: boolean;
  dataDirExists: boolean;
  fileCount: number;
  totalStorageBytes: number;
  tables: Record<string, { recordCount: number; sizeBytes: number; lastModified: string }>;
  backupCount: number;
} {
  ensureDataDir();
  ensureBackupDir();
  const tables: Record<string, { recordCount: number; sizeBytes: number; lastModified: string }> = {};
  let totalBytes = 0;
  let fileCount = 0;

  try {
    const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
    fileCount = files.length;

    for (const file of files) {
      const filePath = path.join(DATA_DIR, file);
      const stat = fs.statSync(filePath);
      totalBytes += stat.size;
      let recordCount = 0;
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        recordCount = Array.isArray(content) ? content.length : Object.keys(content).length;
      } catch {
        recordCount = 0;
      }
      tables[file] = {
        recordCount,
        sizeBytes: stat.size,
        lastModified: stat.mtime.toISOString(),
      };
    }

    const backups = listDatabaseBackups();

    return {
      isHealthy: fileCount > 0,
      dataDirExists: true,
      fileCount,
      totalStorageBytes: totalBytes,
      tables,
      backupCount: backups.length,
    };
  } catch (err) {
    return {
      isHealthy: false,
      dataDirExists: false,
      fileCount: 0,
      totalStorageBytes: 0,
      tables: {},
      backupCount: 0,
    };
  }
}

// 15. CUSTOMER DATA ISOLATION ENFORCER
export function getCustomerIsolatedRecords(targetUserId: string): {
  userId: string;
  transactions: TransactionRecord[];
  entitlements: VerifiedEntitlement[];
  redemptions: CouponRedemptionRecord[];
} {
  if (!targetUserId || typeof targetUserId !== 'string') {
    return { userId: '', transactions: [], entitlements: [], redemptions: [] };
  }

  const cleanUserId = targetUserId.trim();
  const txs = getServerTransactions().filter((t) => t.userId === cleanUserId);
  const ents = getServerEntitlements().filter((e) => e.userId === cleanUserId);
  const reds = getServerRedemptions().filter((r) => r.userId === cleanUserId);

  return {
    userId: cleanUserId,
    transactions: txs,
    entitlements: ents,
    redemptions: reds,
  };
}
