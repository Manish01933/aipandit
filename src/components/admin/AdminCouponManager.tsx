import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertCircle,
  Lock,
  Unlock,
  Calendar,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Save,
  Clock,
  Send,
  Search,
  Filter,
  ShieldAlert,
  Users,
  Eye,
  RefreshCw,
  Ban,
  Activity,
  History as HistoryIcon,
  FileText,
  Crown,
} from 'lucide-react';
import {
  CouponRule,
  DiscountType,
  CouponDurationOption,
  CouponUserRestrictionMode,
  CouponRedemptionRecord,
  AdminAuditEvent,
} from '../../types/commerce';
import { Language } from '../../types/astrology';
import {
  fetchAdminCouponsApi,
  saveAdminCouponApi,
  revokeAdminCouponApi,
  fetchAdminRedemptionsApi,
  revokeAdminRedemptionApi,
  fetchAdminAuditLogsApi,
} from '../../utils/accessManager';

interface AdminCouponManagerProps {
  language: Language;
}

const AVAILABLE_PLANS = [
  { id: '*', nameHi: 'समस्त प्लान व प्रोडक्ट्स (All Plans)', nameEn: 'All Plans & Products (*)' },
  { id: 'plan_astrodost_vip', nameHi: 'एस्ट्रोदोस्त वीआईपी (₹999 - 120 मिनट / 2 घंटे)', nameEn: 'AstroDost VIP (₹999 - 120 Min / 2 Hrs)' },
  { id: 'plan_kundli_report', nameHi: 'कुंडली रिपोर्ट (₹499 - 35 मिनट परामर्श + 25-Page PDF)', nameEn: 'Kundli Report (₹499 - 35 Min + PDF)' },
  { id: 'plan_kundli_explorer', nameHi: 'कुंडली एक्सप्लोरर (₹299 - 15 मिनट परामर्श)', nameEn: 'Kundli Explorer (₹299 - 15 Min Consultation)' },
  { id: 'prod_swiss_ephemeris', nameHi: 'स्विस एफिमेरिस कम्प्लीट (₹799)', nameEn: 'Swiss Ephemeris Complete (₹799)' },
  { id: 'prod_loshu_grid', nameHi: 'लो शू ग्रिड महायोग (₹499)', nameEn: 'Lo Shu Grid Complete (₹499)' },
  { id: 'prod_ank_jyotish', nameHi: 'अंक ज्योतिष कम्प्लीट (₹299)', nameEn: 'Ank Jyotish Complete (₹299)' },
];

export const AdminCouponManager: React.FC<AdminCouponManagerProps> = ({ language }) => {
  const [activeSubTab, setActiveSubTab] = useState<'coupons' | 'redemptions' | 'audit_logs'>('coupons');
  const [coupons, setCoupons] = useState<CouponRule[]>([]);
  const [redemptions, setRedemptions] = useState<CouponRedemptionRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired' | 'exhausted'>('all');

  // Modal states
  const [editingCoupon, setEditingCoupon] = useState<Partial<CouponRule> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Revoke Modal state (for coupon or redemption)
  const [revokingTarget, setRevokingTarget] = useState<{
    type: 'coupon' | 'redemption';
    id: string;
    title: string;
  } | null>(null);
  const [revokeReasonInput, setRevokeReasonInput] = useState('');
  const [isRevoking, setIsRevoking] = useState(false);

  // Custom duration input for modal
  const [customDaysInput, setCustomDaysInput] = useState<number>(30);
  const [allowedUsersInput, setAllowedUsersInput] = useState<string>('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedCoupons, fetchedRedemptions, fetchedLogs] = await Promise.all([
        fetchAdminCouponsApi(),
        fetchAdminRedemptionsApi(),
        fetchAdminAuditLogsApi(),
      ]);
      setCoupons(fetchedCoupons);
      setRedemptions(fetchedRedemptions);
      setAuditLogs(fetchedLogs);
    } catch (err) {
      console.warn('Failed to load admin coupon data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleToggleActive = async (coupon: CouponRule) => {
    try {
      const updated = {
        ...coupon,
        isActive: !coupon.isActive,
        // If reactivating a revoked coupon, clear revokedAt
        revokedAt: coupon.isActive ? coupon.revokedAt : null,
      };
      const res = await saveAdminCouponApi(updated);
      if (res.success && res.coupons) {
        setCoupons(res.coupons);
        setStatusMessage({
          type: 'success',
          text: updated.isActive
            ? `✓ कूपन "${coupon.code}" सक्रिय कर दिया गया है!`
            : `✓ कूपन "${coupon.code}" निष्क्रिय (Deactivated) कर दिया गया है!`,
        });
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      console.error('Failed to toggle coupon status:', err);
    }
  };

  const handleOpenCreate = () => {
    setCustomDaysInput(30);
    setAllowedUsersInput('');
    setEditingCoupon({
      id: `c_${Date.now().toString(36)}`,
      code: 'ASTROFREE100',
      titleHi: '100% फ्री वीआईपी एक्सेस (100% Free VIP Access)',
      titleEn: '100% Free VIP All-Access Pass',
      discountType: 'free_access',
      discountValue: 100,
      isActive: true,
      isConfigured: true,
      eligiblePlans: ['*'],
      eligibleModules: ['*'],
      minPurchaseAmount: 0,
      startDate: new Date().toISOString().slice(0, 10),
      expiryDate: null,
      maxTotalUses: 100,
      maxUsesPerUser: 1,
      durationOption: '30_days',
      overrideDurationDays: 30,
      allowLifetime: true,
      userRestrictionMode: 'anyone',
      allowedUsers: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon: CouponRule) => {
    const durOpt = coupon.durationOption || (coupon.overrideDurationDays === 0 ? 'lifetime' : coupon.overrideDurationDays ? 'custom' : 'default');
    setCustomDaysInput(coupon.overrideDurationDays && coupon.overrideDurationDays > 0 ? coupon.overrideDurationDays : 30);
    setAllowedUsersInput((coupon.allowedUsers || []).join('\n'));
    setEditingCoupon({
      ...coupon,
      durationOption: durOpt,
    });
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon || !editingCoupon.code) return;

    const cleanCode = editingCoupon.code.trim().toUpperCase();

    // Resolve duration
    let overrideDurationDays: number | null = null;
    const dur = editingCoupon.durationOption || 'default';
    if (dur === 'lifetime') {
      overrideDurationDays = 0;
    } else if (dur === '7_days') {
      overrideDurationDays = 7;
    } else if (dur === '30_days') {
      overrideDurationDays = 30;
    } else if (dur === '90_days') {
      overrideDurationDays = 90;
    } else if (dur === '365_days') {
      overrideDurationDays = 365;
    } else if (dur === 'custom') {
      overrideDurationDays = Math.max(1, Number(customDaysInput) || 30);
    } else {
      overrideDurationDays = null; // Plan default
    }

    // Resolve allowed users list
    const parsedUsers = allowedUsersInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter(Boolean);

    const updatedCoupon: Partial<CouponRule> = {
      ...editingCoupon,
      code: cleanCode,
      overrideDurationDays,
      allowedUsers: parsedUsers,
      discountValue:
        editingCoupon.discountType === 'free_access'
          ? 100
          : Number(editingCoupon.discountValue) || 0,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await saveAdminCouponApi(updatedCoupon);
      if (res.success && res.coupons) {
        setCoupons(res.coupons);
        setIsModalOpen(false);
        setEditingCoupon(null);
        setStatusMessage({
          type: 'success',
          text: language === 'hi' ? `🎉 कूपन "${cleanCode}" सफलतापूर्वक सहेजा गया!` : `Coupon "${cleanCode}" successfully saved!`,
        });
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to save coupon' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Error saving coupon' });
    }
  };

  // Confirm Revocation action
  const handleExecuteRevoke = async () => {
    if (!revokingTarget) return;
    setIsRevoking(true);
    try {
      if (revokingTarget.type === 'coupon') {
        const res = await revokeAdminCouponApi(revokingTarget.id, revokeReasonInput || 'Admin revocation');
        if (res.success) {
          setStatusMessage({ type: 'success', text: `✓ कूपन "${revokingTarget.title}" निरस्त कर दिया गया!` });
        }
      } else {
        const res = await revokeAdminRedemptionApi(revokingTarget.id, revokeReasonInput || 'Admin manual revocation');
        if (res.success) {
          setStatusMessage({ type: 'success', text: `✓ यूजर का एक्सेस निरस्त (Access Revoked) कर दिया गया!` });
        }
      }
      setRevokingTarget(null);
      setRevokeReasonInput('');
      await loadData();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Revocation failed' });
    } finally {
      setIsRevoking(false);
    }
  };

  // Filtered coupons
  const now = new Date();
  const filteredCoupons = coupons.filter((c) => {
    const isCodeMatch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.titleHi && c.titleHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.titleEn && c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!isCodeMatch) return false;

    const isExpired = c.expiryDate && new Date(c.expiryDate) < now;
    const isExhausted = c.maxTotalUses > 0 && (c.currentTotalUses || 0) >= c.maxTotalUses;

    if (statusFilter === 'active') return c.isActive && !isExpired && !isExhausted && !c.revokedAt;
    if (statusFilter === 'inactive') return !c.isActive || Boolean(c.revokedAt);
    if (statusFilter === 'expired') return isExpired;
    if (statusFilter === 'exhausted') return isExhausted;

    return true;
  });

  // Calculate high-level metrics
  const activeCount = coupons.filter((c) => c.isActive && (!c.expiryDate || new Date(c.expiryDate) >= now) && (!c.maxTotalUses || c.currentTotalUses < c.maxTotalUses) && !c.revokedAt).length;
  const totalRedemptionsCount = redemptions.length;
  const freeRedemptionsCount = redemptions.filter((r) => r.isFreeAccess).length;

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {language === 'hi' ? 'कूपन प्रबंधन प्रणाली (Coupon Management System)' : 'Coupon Management System'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'hi'
              ? '100% फ्री एक्सेस कोड्स, अवधि सीमाएं (7/30/90/365/आजीवन), प्लान पात्रता, और यूजर रेडेंपशन नियंत्रण।'
              : '100% free passes, custom durations (7/30/90/365/lifetime), plan eligibility, and user redemption control.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? '+ नया कूपन बनाएं' : '+ Create Coupon'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-slate-400 font-medium">कुल कूपन (Total)</div>
          <div className="text-xl font-black font-mono text-white mt-1">{coupons.length}</div>
        </div>
        <div className="bg-slate-950 border border-emerald-900/50 p-3.5 rounded-xl">
          <div className="text-[11px] text-emerald-400 font-medium">सक्रिय कूपन (Active)</div>
          <div className="text-xl font-black font-mono text-emerald-300 mt-1">{activeCount}</div>
        </div>
        <div className="bg-slate-950 border border-amber-900/50 p-3.5 rounded-xl">
          <div className="text-[11px] text-amber-400 font-medium">कुल उपयोग (Redemptions)</div>
          <div className="text-xl font-black font-mono text-amber-300 mt-1">{totalRedemptionsCount}</div>
        </div>
        <div className="bg-slate-950 border border-teal-900/50 p-3.5 rounded-xl">
          <div className="text-[11px] text-teal-400 font-medium">100% फ्री दिए गए (Free Passes)</div>
          <div className="text-xl font-black font-mono text-teal-300 mt-1">{freeRedemptionsCount}</div>
        </div>
      </div>

      {/* SUB-TABS: COUPONS LIST / REDEMPTIONS HISTORY / AUDIT LOGS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('coupons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'coupons'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/50'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'कूपन सूची व सेटिंग्स' : 'All Coupons & Rules'}</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full text-slate-300">
            {filteredCoupons.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('redemptions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'redemptions'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/50'
          }`}
        >
          <HistoryIcon className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'रेडेंपशन इतिहास व रद्दीकरण' : 'Redemptions & Revocation'}</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full text-slate-300">
            {redemptions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('audit_logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'audit_logs'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'एडमिन ऑडिट लॉग्स' : 'Audit Logs'}</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full text-slate-300">
            {auditLogs.length}
          </span>
        </button>
      </div>

      {/* VIEW 1: COUPONS LIST */}
      {activeSubTab === 'coupons' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hi' ? 'कोड या शीर्षक खोजें...' : 'Search coupon code or title...'}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { id: 'all', labelHi: 'सभी', labelEn: 'All' },
                  { id: 'active', labelHi: 'सक्रिय', labelEn: 'Active' },
                  { id: 'inactive', labelHi: 'निष्क्रिय', labelEn: 'Inactive' },
                  { id: 'expired', labelHi: 'समाप्त', labelEn: 'Expired' },
                  { id: 'exhausted', labelHi: 'पूर्ण उपयोग', labelEn: 'Fully Used' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-transparent'
                  }`}
                >
                  {language === 'hi' ? f.labelHi : f.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Coupons Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredCoupons.map((c) => {
              const isCopied = copiedCode === c.code;
              const isExpired = c.expiryDate && new Date(c.expiryDate) < now;
              const isExhausted = c.maxTotalUses > 0 && (c.currentTotalUses || 0) >= c.maxTotalUses;
              const isRevoked = Boolean(c.revokedAt);

              // Status badge determination
              let statusBadge = (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE
                </span>
              );

              if (isRevoked) {
                statusBadge = (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Ban className="w-2.5 h-2.5" /> REVOKED
                  </span>
                );
              } else if (!c.isActive) {
                statusBadge = (
                  <span className="text-[10px] bg-slate-700/50 text-slate-300 border border-slate-600 px-2 py-0.5 rounded-full font-bold">
                    DEACTIVATED
                  </span>
                );
              } else if (isExpired) {
                statusBadge = (
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded-full font-bold">
                    EXPIRED
                  </span>
                );
              } else if (isExhausted) {
                statusBadge = (
                  <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded-full font-bold">
                    FULLY REDEEMED
                  </span>
                );
              }

              // Duration label
              let durationLabel = 'प्लान के अनुसार (Plan Default)';
              if (c.overrideDurationDays === 0) durationLabel = '♾️ आजीवन (Lifetime Access)';
              else if (c.overrideDurationDays && c.overrideDurationDays > 0)
                durationLabel = `⏱️ ${c.overrideDurationDays} दिन (${c.overrideDurationDays} Days)`;

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3.5 ${
                    c.isActive && !isExpired && !isExhausted && !isRevoked
                      ? 'bg-slate-950 border-slate-800 shadow-md hover:border-slate-700'
                      : 'bg-slate-950/60 border-slate-900 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-black text-amber-300 bg-slate-900 border border-amber-500/40 px-2.5 py-0.5 rounded-lg select-all">
                          {c.code}
                        </span>
                        {statusBadge}
                        {c.discountType === 'free_access' && (
                          <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full font-black">
                            🎁 100% FREE
                          </span>
                        )}
                        {c.requiresAdminRole && (
                          <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold border border-rose-500/30 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> ADMIN ONLY
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white pt-0.5">
                        {language === 'hi' ? c.titleHi : c.titleEn}
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(c.code)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs cursor-pointer"
                        title="Copy promo code"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs cursor-pointer"
                        title="Edit coupon rules"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(c)}
                        className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                          c.isActive ? 'text-emerald-400 hover:bg-emerald-950/50' : 'text-slate-500 hover:bg-slate-900'
                        }`}
                        title={c.isActive ? 'Deactivate coupon' : 'Activate coupon'}
                      >
                        {c.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRevokingTarget({
                            type: 'coupon',
                            id: c.id,
                            title: c.code,
                          })
                        }
                        className="p-1.5 bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 rounded-lg text-xs cursor-pointer"
                        title="Revoke Coupon"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Summary Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-2.5 rounded-xl border border-slate-900">
                    <div>
                      <span className="text-slate-400 block text-[10px]">छूट (Discount):</span>
                      <span className="font-bold text-amber-300">
                        {c.discountType === 'free_access'
                          ? '100% नि:शुल्क (Free Access)'
                          : c.discountType === 'percentage'
                          ? `${c.discountValue}% छूट`
                          : `₹${c.discountValue} Flat Off`}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">दी जाने वाली अवधि (Duration):</span>
                      <span className="font-semibold text-slate-200">{durationLabel}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">कुल उपयोग (Usage):</span>
                      <span className="font-semibold text-slate-300 font-mono">
                        {c.currentTotalUses || 0} / {c.maxTotalUses > 0 ? c.maxTotalUses : '∞ असीमित'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">पात्र प्लान्स (Eligible Plans):</span>
                      <span className="font-semibold text-slate-300 truncate block">
                        {c.eligiblePlans.includes('*') ? 'समस्त प्लान (*)' : c.eligiblePlans.join(', ')}
                      </span>
                    </div>

                    {c.expiryDate && (
                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[10px]">वैधता समाप्ति (Expires):</span>
                        <span className={`font-semibold ${isExpired ? 'text-rose-400' : 'text-amber-300'}`}>
                          {new Date(c.expiryDate).toLocaleDateString()} {new Date(c.expiryDate).toLocaleTimeString()}
                        </span>
                      </div>
                    )}

                    {c.userRestrictionMode === 'selected_users' && c.allowedUsers && c.allowedUsers.length > 0 && (
                      <div className="col-span-2 text-[10px] text-teal-300 bg-teal-950/40 p-1.5 rounded border border-teal-900/50">
                        🔒 केवल {c.allowedUsers.length} निर्दिष्ट उपयोगकर्ताओं के लिए अधिकृत
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredCoupons.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                कोई कूपन नहीं मिला। कृपया नया कूपन बनाएं या फिल्टर बदलें।
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: REDEMPTION HISTORY & REVOCATION */}
      {activeSubTab === 'redemptions' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {language === 'hi' ? 'कूपन उपयोग व रेडेंपशन इतिहास:' : 'Redemption History & Entitlement Status:'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  यहाँ प्रत्येक ग्राहक द्वारा रिडीम किए गए कूपन, अवधि, और एडमिन द्वारा तत्काल रद्दीकरण (Revocation) की सुविधा है।
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                {redemptions.length} रेडेंपशन
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-[10px] uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">कूपन कोड</th>
                    <th className="p-3">ग्राहक / यूजर विवरण</th>
                    <th className="p-3">प्लान</th>
                    <th className="p-3">अनलॉक अवधि / समाप्ति</th>
                    <th className="p-3">तारीख</th>
                    <th className="p-3">स्थिति</th>
                    <th className="p-3 text-right">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {redemptions.map((r) => {
                    const isRevoked = r.status === 'revoked';
                    return (
                      <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-amber-300">
                          {r.couponCode}
                          {r.isFreeAccess && (
                            <span className="block text-[9px] text-teal-400 font-sans font-bold">100% FREE</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-white">{r.customerName || 'Seeker'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {r.customerEmail || r.customerPhone || r.userId}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="bg-slate-900 px-2 py-0.5 rounded text-[11px] text-slate-300 border border-slate-800">
                            {r.planName || r.planId}
                          </span>
                        </td>
                        <td className="p-3">
                          {r.expiresAt ? (
                            <span className="text-[11px] text-amber-300">
                              {new Date(r.expiresAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-[11px] text-emerald-400 font-bold">♾️ आजीवन (Lifetime)</span>
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-slate-400">
                          {new Date(r.redeemedAt).toLocaleDateString()} {new Date(r.redeemedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3">
                          {isRevoked ? (
                            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                              रद्द (Revoked)
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                              सक्रिय (Active)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {!isRevoked ? (
                            <button
                              type="button"
                              onClick={() =>
                                setRevokingTarget({
                                  type: 'redemption',
                                  id: r.id,
                                  title: `${r.customerName || r.userId} (${r.couponCode})`,
                                })
                              }
                              className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg text-[10px] font-bold border border-rose-900/50 transition-all cursor-pointer"
                            >
                              रद्द करें (Revoke)
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">रद्द किया जा चुका</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {redemptions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                        अभी तक किसी कूपन का उपयोग नहीं किया गया है।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: AUDIT LOGS */}
      {activeSubTab === 'audit_logs' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>एडमिन सुरक्षा व ऑडिट इवेंट्स (Audit Trail):</span>
            </h4>
            <span className="text-xs text-slate-400">{auditLogs.length} रिकॉर्ड्स</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 font-mono">
                    {log.action.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-400">लक्षित (Target):</span> {log.targetType} • <span className="font-mono text-white">{log.targetId}</span>
                </div>
                {log.details && (
                  <pre className="text-[10px] text-slate-400 bg-slate-950 p-2 rounded overflow-x-auto font-mono">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}

            {auditLogs.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                कोई ऑडिट इवेंट दर्ज नहीं है।
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT COUPON MODAL */}
      {isModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-white space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-amber-300">
                  {editingCoupon.id && editingCoupon.code
                    ? `कूपन संपादित करें: ${editingCoupon.code}`
                    : 'नया कूपन बनाएं (Create New Coupon)'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              {/* Row 1: Code and Discount Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    कूपन कोड (Promo Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCoupon.code || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. ASTROFREE100"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    छूट का प्रकार (Discount Type) *
                  </label>
                  <select
                    value={editingCoupon.discountType || 'free_access'}
                    onChange={(e) => {
                      const val = e.target.value as DiscountType;
                      setEditingCoupon({
                        ...editingCoupon,
                        discountType: val,
                        discountValue: val === 'free_access' ? 100 : editingCoupon.discountValue,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    <option value="free_access">🎁 100% फ्री एक्सेस (100% Free Access - ₹0)</option>
                    <option value="percentage">प्रतिशत छूट (% Percentage Off)</option>
                    <option value="fixed_amount">निश्चित राशि छूट (Flat ₹ Off)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Discount Value & Duration Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    छूट का मान (Discount Value: % या ₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={editingCoupon.discountType === 'percentage' ? 100 : 10000}
                    value={editingCoupon.discountType === 'free_access' ? 100 : (editingCoupon.discountValue ?? 100)}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })}
                    disabled={editingCoupon.discountType === 'free_access'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold disabled:opacity-50"
                  />
                  {editingCoupon.discountType === 'free_access' && (
                    <span className="text-[10px] text-teal-400 mt-1 block">
                      ✓ 100% फ्री होने पर देय राशि स्वतः ₹0 हो जाएगी (बिना कार्ड/पेमेंट के)।
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    अनलॉक एक्सेस अवधि (Access Duration) *
                  </label>
                  <select
                    value={editingCoupon.durationOption || '30_days'}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        durationOption: e.target.value as CouponDurationOption,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-semibold"
                  >
                    <option value="default">प्लान की डिफ़ॉल्ट अवधि (Use Plan Default)</option>
                    <option value="7_days">7 दिन का एक्सेस (7 Days)</option>
                    <option value="30_days">30 दिन का एक्सेस (30 Days)</option>
                    <option value="90_days">90 दिन का एक्सेस (90 Days / 3 Months)</option>
                    <option value="365_days">365 दिन का एक्सेस (365 Days / 1 Year)</option>
                    <option value="custom">कस्टम अवधि दिन (Custom Days)</option>
                    <option value="lifetime">♾️ आजीवन स्थायी एक्सेस (Lifetime Access)</option>
                  </select>

                  {editingCoupon.durationOption === 'custom' && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">दिन दर्ज करें:</span>
                      <input
                        type="number"
                        min="1"
                        value={customDaysInput}
                        onChange={(e) => setCustomDaysInput(Number(e.target.value))}
                        className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Eligible Membership Plans */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="text-[11px] text-slate-300 font-bold block">
                  पात्र मेम्बरशिप प्लान्स (Eligible Membership Plans) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {AVAILABLE_PLANS.map((p) => {
                    const isChecked = editingCoupon.eligiblePlans?.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let updatedPlans = editingCoupon.eligiblePlans || ['*'];
                            if (p.id === '*') {
                              updatedPlans = e.target.checked ? ['*'] : [];
                            } else {
                              if (e.target.checked) {
                                updatedPlans = updatedPlans.filter((x) => x !== '*').concat(p.id);
                              } else {
                                updatedPlans = updatedPlans.filter((x) => x !== p.id);
                              }
                            }
                            setEditingCoupon({ ...editingCoupon, eligiblePlans: updatedPlans });
                          }}
                          className="rounded bg-slate-900 border-slate-700 text-amber-500"
                        />
                        <span>{language === 'hi' ? p.nameHi : p.nameEn}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: User Restrictions (Anyone vs Selected Users) */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="text-[11px] text-slate-300 font-bold block">
                  उपयोगकर्ता पात्रता प्रतिबंध (User Restriction)
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                    <input
                      type="radio"
                      name="userRestrictionMode"
                      value="anyone"
                      checked={editingCoupon.userRestrictionMode !== 'selected_users'}
                      onChange={() => setEditingCoupon({ ...editingCoupon, userRestrictionMode: 'anyone' })}
                      className="text-amber-500"
                    />
                    <span>सार्वजनिक — जिसे कोड प्राप्त हो (Anyone with code)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                    <input
                      type="radio"
                      name="userRestrictionMode"
                      value="selected_users"
                      checked={editingCoupon.userRestrictionMode === 'selected_users'}
                      onChange={() => setEditingCoupon({ ...editingCoupon, userRestrictionMode: 'selected_users' })}
                      className="text-amber-500"
                    />
                    <span>केवल चुनिंदा उपयोगकर्ता (Restricted Users Only)</span>
                  </label>
                </div>

                {editingCoupon.userRestrictionMode === 'selected_users' && (
                  <div className="pt-2 space-y-1">
                    <label className="text-[10px] text-slate-400 block">
                      अधिकृत ईमेल, फोन नंबर, या यूजर आईडी (प्रति पंक्ति एक या कॉमा से अलग करें):
                    </label>
                    <textarea
                      rows={3}
                      value={allowedUsersInput}
                      onChange={(e) => setAllowedUsersInput(e.target.value)}
                      placeholder="user1@example.com&#10;9876543210&#10;user_12345"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Row 5: Usage Limits & Expiration Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    कुल अधिकतम उपयोग सीमा (Total Uses: 0 = असीमित)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingCoupon.maxTotalUses ?? 100}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, maxTotalUses: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    प्रति यूजर अधिकतम उपयोग सीमा (Per User Limit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingCoupon.maxUsesPerUser ?? 1}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, maxUsesPerUser: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Row 6: Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    प्रारंभ तारीख (Start Date)
                  </label>
                  <input
                    type="date"
                    value={editingCoupon.startDate ? editingCoupon.startDate.slice(0, 10) : ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, startDate: new Date(e.target.value).toISOString() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                    समाप्ति तारीख (Expiry Date - खाली = कभी नहीं)
                  </label>
                  <input
                    type="date"
                    value={editingCoupon.expiryDate ? editingCoupon.expiryDate.slice(0, 10) : ''}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        expiryDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Row 7: Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">शीर्षक हिंदी</label>
                  <input
                    type="text"
                    value={editingCoupon.titleHi || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, titleHi: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Title English</label>
                  <input
                    type="text"
                    value={editingCoupon.titleEn || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, titleEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCoupon.isActive ?? true}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                  />
                  <span className="text-[11px] text-slate-300 font-semibold">सक्रिय (Active immediately)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCoupon.requiresAdminRole ?? false}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, requiresAdminRole: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-rose-500"
                  />
                  <span className="text-[11px] text-slate-300">केवल एडमिन के लिए सीमित (Requires Admin Pin)</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-lg cursor-pointer"
                >
                  कूपन नियम सहेजें (Save Coupon)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVOKE REASON DIALOG MODAL */}
      {revokingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-slate-900 border border-rose-900/60 rounded-2xl max-w-md w-full p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold">
                {revokingTarget.type === 'coupon' ? 'कूपन निरस्त (Revoke Coupon) करें' : 'रेडेंपशन व एक्सेस रद्द (Revoke Access) करें'}
              </h4>
            </div>

            <p className="text-xs text-slate-300">
              आप <span className="font-mono text-amber-300 font-bold">"{revokingTarget.title}"</span> को निरस्त करने जा रहे हैं।
              {revokingTarget.type === 'coupon'
                ? ' इसके बाद इस कूपन का कोई नया उपयोग नहीं हो सकेगा।'
                : ' संबंधित उपयोगकर्ता का मेम्बरशिप एक्सेस तुरंत प्रभाव से समाप्त हो जाएगा।'}
            </p>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold block">रद्दीकरण का कारण (Reason for Revocation) *</label>
              <textarea
                rows={2}
                value={revokeReasonInput}
                onChange={(e) => setRevokeReasonInput(e.target.value)}
                placeholder="उदा. नीति उल्लंघन, परीक्षण अवधि समाप्ति, या एडमिन अनुरोध..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRevokingTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
              >
                कैंसल
              </button>
              <button
                type="button"
                disabled={isRevoking}
                onClick={handleExecuteRevoke}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isRevoking ? 'निरस्त हो रहा है...' : 'पुष्टि करें व निरस्त करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
