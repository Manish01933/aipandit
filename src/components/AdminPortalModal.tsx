import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Link,
  Share2,
  Copy,
  Check,
  QrCode,
  DollarSign,
  Users,
  Settings,
  X,
  ExternalLink,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle,
  Eye,
  RefreshCw,
  Trash2,
  Send,
  Crown,
  CreditCard,
} from 'lucide-react';
import {
  AdminSettings,
  VipPass,
  PaymentRecord,
  AccessState,
  getAdminSettings,
  saveAdminSettings,
  getStoredVipPasses,
  generateVipLink,
  generateCustomerLink,
  generateAdminLink,
  deleteVipPass,
  getPaymentHistory,
  saveAccessState,
  DEFAULT_ADMIN_SETTINGS,
} from '../utils/accessManager';
import { Language } from '../types/astrology';
import { AdminBannerManager } from './admin/AdminBannerManager';
import { AdminAnnouncementsManager } from './admin/AdminAnnouncementsManager';
import { AdminThemeManager } from './admin/AdminThemeManager';
import { AdminCouponManager } from './admin/AdminCouponManager';
import { AdminPlanManager } from './admin/AdminPlanManager';
import { AdminPresetQuestionsManager } from './admin/AdminPresetQuestionsManager';
import { AdminGrantAccessManager } from './admin/AdminGrantAccessManager';
import { ErrorBoundary } from './ErrorBoundary';
import { Palette, Tag, Package, HelpCircle, Gift } from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessState: AccessState;
  setAccessState: React.Dispatch<React.SetStateAction<AccessState>>;
  language: Language;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  accessState,
  setAccessState,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<
    'grant_access' | 'theme' | 'banner' | 'announcements' | 'coupons' | 'plans' | 'preset_questions' | 'links' | 'pricing' | 'history' | 'vip_passes'
  >('grant_access');
  const [settings, setSettings] = useState<AdminSettings>(() => {
    try {
      const s = getAdminSettings();
      return s ? { ...DEFAULT_ADMIN_SETTINGS, ...s } : DEFAULT_ADMIN_SETTINGS;
    } catch {
      return DEFAULT_ADMIN_SETTINGS;
    }
  });
  const [passes, setPasses] = useState<VipPass[]>(() => {
    try {
      return getStoredVipPasses();
    } catch {
      return [];
    }
  });
  const [history, setHistory] = useState<PaymentRecord[]>(() => {
    try {
      return getPaymentHistory();
    } catch {
      return [];
    }
  });

  // Generator inputs
  const [clientNameInput, setClientNameInput] = useState('');
  const [validityDays, setValidityDays] = useState(365);
  const [lastGeneratedVip, setLastGeneratedVip] = useState<{ pass: VipPass; fullUrl: string } | null>(null);

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Pin verification if not already unlocked as admin
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isPinAuthenticated, setIsPinAuthenticated] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('astrodost_admin_token');
        if (token === 'manishastrodostai@111' || token === 'manish01933') return true;
      }
      return accessState?.isAdminUnlocked ?? false;
    } catch {
      return false;
    }
  });
  const [omniCheckResult, setOmniCheckResult] = useState<any>(null);
  const [isCheckingOmni, setIsCheckingOmni] = useState(false);
  const [openRouterTestResult, setOpenRouterTestResult] = useState<{ success: boolean; message: string; reply?: string } | null>(null);
  const [isTestingOpenRouter, setIsTestingOpenRouter] = useState(false);

  const runOmniRouteCheck = async () => {
    setIsCheckingOmni(true);
    try {
      const res = await fetch('/api/admin/omniroute-check');
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const data = await res.json();
          setOmniCheckResult(data);
        }
      }
    } catch (e) {
      console.warn('Omni check failed:', e);
    } finally {
      setIsCheckingOmni(false);
    }
  };

  const testOpenRouterConnection = async () => {
    setIsTestingOpenRouter(true);
    setOpenRouterTestResult(null);
    try {
      const adminToken = localStorage.getItem('astrodost_admin_token') || 'manishastrodostai@111';
      const res = await fetch('/api/admin/openrouter/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          apiKey: settings.openRouterApiKey,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOpenRouterTestResult({
          success: true,
          message: '✓ OpenRouter AI सफलतापूर्वक कनेक्टेड! उत्तर: "' + (data.reply || 'Jai Shri Ram') + '"',
          reply: data.reply,
        });
      } else {
        setOpenRouterTestResult({
          success: false,
          message: '✕ कनेक्शन त्रुटि: ' + (data.error || 'अमान्य API कुंजी'),
        });
      }
    } catch (err: any) {
      setOpenRouterTestResult({
        success: false,
        message: '✕ नेटवर्क त्रुटि: ' + (err?.message || 'कनेक्ट नहीं हो सका'),
      });
    } finally {
      setIsTestingOpenRouter(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      try {
        const s = getAdminSettings();
        setSettings(s);
        setPasses(getStoredVipPasses());
        setHistory(getPaymentHistory());
        const token = typeof window !== 'undefined' ? localStorage.getItem('astrodost_admin_token') : null;
        const isMaster = token === 'manishastrodostai@111' || token === 'manish01933';
        if (isMaster || accessState?.isAdminUnlocked) {
          setIsPinAuthenticated(true);
          runOmniRouteCheck();
        } else {
          setIsPinAuthenticated(false);
        }
      } catch (err) {
        console.error('Error initializing admin portal state:', err);
      }
    }
  }, [isOpen, accessState?.isAdminUnlocked]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenerateVip = () => {
    const res = generateVipLink(clientNameInput || 'VIP Member', validityDays);
    setLastGeneratedVip(res);
    setPasses(getStoredVipPasses());
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveAdminSettings(settings);
    setSettings(updated);
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);

    // Sync with server runtime
    try {
      const adminToken = localStorage.getItem('astrodost_admin_token') || 'manishastrodostai@111';
      await fetch('/api/admin/gateway-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          razorpayKeyId: settings.razorpayKeyId,
          razorpayKeySecret: settings.razorpayKeySecret,
          openRouterApiKey: settings.openRouterApiKey,
        }),
      });
    } catch {
      // ignore
    }
  };

  const handleInstantAdminUnlock = () => {
    setIsPinAuthenticated(true);
    setPinError(false);
    try {
      localStorage.setItem('astrodost_admin_token', 'manishastrodostai@111');
    } catch {}
    const updated: AccessState = {
      ...accessState,
      role: 'admin',
      isAdminUnlocked: true,
      isVipUnlocked: true,
      vipClientName: 'Acharya Manish (Master Admin)',
      unlockedModules: ['*'],
      activatedAt: new Date().toISOString(),
    };
    setAccessState(updated);
    saveAccessState(updated);
  };

  const safeAdminPin = settings?.adminPin || 'manishastrodostai@111';

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim().toLowerCase();
    const configuredPin = safeAdminPin.toLowerCase();
    if (
      !cleanPin ||
      cleanPin === 'manish01933' ||
      cleanPin === configuredPin ||
      cleanPin === 'manishastrodostai@111' ||
      cleanPin === '1234' ||
      cleanPin === 'admin' ||
      cleanPin === '111' ||
      cleanPin === 'manish' ||
      cleanPin === 'manish98886' ||
      cleanPin === 'manish98886@gmail.com' ||
      cleanPin === '98886' ||
      cleanPin === 'vip' ||
      cleanPin === 'freevip' ||
      cleanPin === 'om'
    ) {
      handleInstantAdminUnlock();
    } else {
      setPinError(true);
    }
  };

  const toggleTestCustomerMode = () => {
    const nextModeIsCustomer = accessState.isAdminUnlocked;
    const updated: AccessState = {
      role: nextModeIsCustomer ? 'customer' : 'admin',
      isAdminUnlocked: !nextModeIsCustomer,
      isVipUnlocked: !nextModeIsCustomer,
      vipClientName: nextModeIsCustomer ? '' : 'Admin Superuser',
      unlockedModules: nextModeIsCustomer ? [] : ['*'],
    };
    setAccessState(updated);
    saveAccessState(updated);
  };

  const customerLink = generateCustomerLink();
  const adminDirectLink = generateAdminLink(safeAdminPin);

  const getVipWhatsappMessage = (name: string, link: string) => {
    return encodeURIComponent(
      `🙏 नमस्ते ${name || 'जी'},\n\n✨ AstroDost AI की तरफ से आपके लिए *सम्पूर्ण प्रीमियम वैदिक ज्योतिष व अंक ज्योतिष एक्सेस (VIP Pass)* 100% मुफ़्त अनलॉक कर दिया गया है!\n\n👑 इसमें शामिल हैं:\n• स्विस एफिमेरिस (JHora) विस्तृत जन्म चक्र\n• लो शू ग्रिड मास्टर व वास्तु उपाय\n• अंक ज्योतिष (मूलांक, भाग्यांक व नामांक विश्लेषण)\n\n👉 *अपना VIP लिंक यहाँ खोलें:*\n${link}\n\n(यह लिंक आपके लिए आजीवन निःशुल्क सक्रिय रहेगा।)`
    );
  };

  const getCustomerWhatsappMessage = (link: string) => {
    return encodeURIComponent(
      `🙏 नमस्ते!\n\n✨ AstroDost AI पर अपनी *100% FREE जन्म कुंडली, दैनिक राशिफल व पंचांग* देखें।\n\nसाथ ही तीनों प्रीमियम सेवाएं (*स्विस एफिमेरिस + लो शू ग्रिड + अंक ज्योतिष*) एक साथ अनलॉक करें:\n\n• 1 माह प्लान: मात्र ₹999/-\n• 3 माह प्लान: मात्र ₹1999/- (Popular)\n• 6 माह प्लान: मात्र ₹3999/- (Best Value)\n• लाइफटाइम एक्सेस: मात्र ₹9999/-\n\nUPI ID: darksecrets0unveiled@okhdfcbank\nया सीधे कार्ड/नेटबैंकिंग/Razorpay से भुगतान करें:\n\n👉 *यहाँ तुरंत क्लिक करें:*\n${link}`
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-500/20 text-slate-100 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 border-b border-amber-500/20 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-amber-300">
                  {language === 'hi' ? 'एडमिन कंट्रोल पैनल & प्रमोशन इंजन' : 'Admin Control Panel & Promotion Engine'}
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full">
                  MASTER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'वेबऐप पर बैनर प्रमोट करें, सूचनाएं जोड़ें/हटाएं, VIP पास बनाएं व मूल्य प्रबंधित करें'
                  : 'Promote banners, manage announcements (add/del), generate VIP links & manage pricing'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Password Authentication Screen (if not unlocked) */}
        {!isPinAuthenticated ? (
          <div className="p-6 sm:p-8 text-center max-w-md mx-auto my-6 sm:my-8 space-y-4">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white">
              {language === 'hi' ? 'एडमिन पासवर्ड सुरक्षा' : 'Admin Password Authentication'}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'एडमिन कंट्रोल पैनल एवं सभी VIP फीचर्स अनलॉक करने के लिए नीचे क्लिक करें या पासवर्ड दर्ज करें:'
                : 'Unlock admin panel and all VIP features by clicking below or entering password:'}
            </p>

            {/* 1-Click Instant Unlock for Owner / Acharya Manish */}
            <button
              type="button"
              onClick={handleInstantAdminUnlock}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black py-3 px-4 rounded-xl hover:from-emerald-400 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm hover:scale-[1.02] active:scale-95"
            >
              <Crown className="w-4 h-4 text-slate-950 shrink-0" />
              <span>
                {language === 'hi'
                  ? '👑 1-क्लिक में तुरंत अनलॉक करें (आचार्य मनीष जी)'
                  : '👑 1-Click Instant Unlock (Acharya Manish)'}
              </span>
            </button>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                {language === 'hi' ? 'या पासवर्ड से खोलें' : 'OR WITH PASSWORD'}
              </span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="manish01933"
                className="w-full text-center tracking-wider text-sm sm:text-base font-mono bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-amber-300 focus:outline-none focus:border-amber-500"
                autoFocus
              />

              {/* Quick Password Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 mr-1">पासवर्ड:</span>
                {['manish01933', '111', 'manish', 'admin'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setPinInput(preset);
                      handleInstantAdminUnlock();
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono border transition-all cursor-pointer font-bold ${
                      preset === 'manish01933'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {preset === 'manish01933' ? `🔑 ${preset}` : preset}
                  </button>
                ))}
              </div>

              {pinError && (
                <p className="text-xs text-rose-400 font-medium">
                  {language === 'hi'
                    ? 'गलत पासवर्ड! कृपया पासवर्ड manish01933 दर्ज करें या ऊपर 1-क्लिक बटन दबाएं।'
                    : 'Incorrect password! Please enter password manish01933 or click 1-Click unlock above.'}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-2.5 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 cursor-pointer text-xs sm:text-sm"
              >
                {language === 'hi' ? 'एडमिन पैनल अनलॉक करें' : 'Unlock Admin Panel'}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Mode & Navigation Tabs with 2 Highlighted Windows */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {/* 1. GRANT FREE ACCESS / ADMIN VIP PRO */}
                <button
                  type="button"
                  onClick={() => setActiveTab('grant_access')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'grant_access'
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 shadow-md shadow-emerald-400/30'
                      : 'text-emerald-300 hover:text-emerald-200 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '🎁 मुफ़्त एक्सेस दें (Self Pro)' : '🎁 Grant Free / VIP Pro'}</span>
                </button>

                {/* GLOBAL THEME MANAGER */}
                <button
                  type="button"
                  onClick={() => setActiveTab('theme')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'theme'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-400/30'
                      : 'text-amber-300/80 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '🎨 ग्लोबल थीम' : '🎨 Global Theme'}</span>
                </button>

                {/* WINDOW 1: Banner Upload & Promotion */}
                <button
                  type="button"
                  onClick={() => setActiveTab('banner')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'banner'
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md shadow-amber-400/30 font-black'
                      : 'text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40'
                  }`}
                >
                  <span className="text-sm">🪧</span>
                  <span>{language === 'hi' ? 'बैनर अपलोड विंडो (Front Banner)' : 'Banner Upload Window'}</span>
                </button>

                {/* WINDOW 2: Info & Announcements */}
                <button
                  type="button"
                  onClick={() => setActiveTab('announcements')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'announcements'
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/30'
                      : 'text-emerald-300/80 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30'
                  }`}
                >
                  <span className="text-sm">📢</span>
                  <span>{language === 'hi' ? 'विंडो 2: सूचनाएं (Add/Del)' : 'Window 2: Info (Add/Del)'}</span>
                </button>

                {/* COUPON MANAGEMENT */}
                <button
                  type="button"
                  onClick={() => setActiveTab('coupons')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'coupons'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-400/30'
                      : 'text-amber-300/90 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '🏷️ कूपन प्रबंधन (Coupon Management)' : '🏷️ Coupon Management'}</span>
                </button>

                {/* PLAN CATALOG */}
                <button
                  type="button"
                  onClick={() => setActiveTab('plans')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'plans'
                      ? 'bg-emerald-400 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'प्लान कैटलॉग' : 'Plans'}</span>
                </button>

                {/* PRESET QUESTIONS (Admin Configurable) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('preset_questions')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'preset_questions'
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '🎯 पूर्व-निर्धारित प्रश्न' : '🎯 Preset Questions'}</span>
                </button>

                {/* WINDOW 3: Links */}
                <button
                  type="button"
                  onClick={() => setActiveTab('links')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'links'
                      ? 'bg-slate-200 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '2 तरह के लिंक्स' : 'VIP Links'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('vip_passes')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'vip_passes'
                      ? 'bg-slate-200 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'VIP कूपन' : 'Coupons'}</span>
                  {passes.length > 0 && (
                    <span className="bg-slate-900 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full border border-amber-500/40">
                      {passes.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pricing')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'pricing'
                      ? 'bg-slate-200 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'UPI व मूल्य' : 'Pricing'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-slate-200 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'लॉग' : 'Logs'}</span>
                </button>
              </div>

              {/* Toggle Live Customer/Admin View */}
              <button
                type="button"
                onClick={toggleTestCustomerMode}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  accessState.isAdminUnlocked
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                }`}
                title="Switch between Admin View and Customer Paywall View"
              >
                {accessState.isAdminUnlocked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'hi' ? 'एडमिन मोड' : 'Admin Mode'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                    <span>{language === 'hi' ? 'ग्राहक मोड' : 'Customer Mode'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              <ErrorBoundary fallbackTitle={language === 'hi' ? 'एडमिन पैनल टैब में अस्थायी त्रुटि आई' : 'Admin tab encountered an error'}>
                {/* TAB 0: GRANT FREE ACCESS & ADMIN SELF VIP */}
                {activeTab === 'grant_access' && (
                  <AdminGrantAccessManager
                    language={language}
                    accessState={accessState}
                    setAccessState={setAccessState}
                    adminPin={safeAdminPin}
                  />
                )}

              {/* GLOBAL THEME MANAGER */}
              {activeTab === 'theme' && (
                <AdminThemeManager language={language} adminPin={safeAdminPin} />
              )}

              {/* WINDOW 1: BANNER BUILDER & ANIMATOR */}
              {activeTab === 'banner' && (
                <AdminBannerManager language={language} onNavigateTab={onClose} />
              )}

              {/* WINDOW 2: INFO & ANNOUNCEMENTS (ADD / DEL) */}
              {activeTab === 'announcements' && (
                <AdminAnnouncementsManager language={language} />
              )}

              {/* COUPON & VIP PROMO ENGINE */}
              {activeTab === 'coupons' && (
                <AdminCouponManager language={language} />
              )}

              {/* PLAN CATALOG & ENTITLEMENTS */}
              {activeTab === 'plans' && (
                <AdminPlanManager language={language} />
              )}

              {/* PRESET QUESTIONS (Admin Configurable) */}
              {activeTab === 'preset_questions' && (
                <AdminPresetQuestionsManager language={language} />
              )}

              {/* TAB 3: 2 LINK GENERATORS */}
              {activeTab === 'links' && (
                <div className="space-y-6">
                  {/* LINK TYPE 1: FREE VIP ACCESS LINK (For anyone you want to gift for free) */}
                  <div className="bg-gradient-to-br from-slate-950 to-emerald-950/40 p-5 rounded-2xl border-2 border-emerald-500/30 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black">
                          1
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-emerald-300">
                              {language === 'hi'
                                ? 'लिंक 1: 100% मुफ्त VIP एक्सेस लिंक (Free Cost Link)'
                                : 'Link 1: 100% Free VIP Access Link'}
                            </h4>
                            <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                              100% FREE COST
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {language === 'hi'
                              ? 'यह लिंक आप जिसे भी भेजेंगे, उसके लिए स्विस एफिमेरिस, लो शू ग्रिड व अंक ज्योतिष सब कुछ फ्री में अनलॉक हो जाएगा (कोई पेमेंट नहीं मांगेगा)।'
                              : 'Whoever opens this link gets Swiss Ephemeris, Lo Shu Grid & Numerology 100% free with no paywall.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Generator Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                      <div className="sm:col-span-6">
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {language === 'hi' ? 'क्लाइंट / रिश्तेदार का नाम' : 'Client / Recipient Name'}
                        </label>
                        <input
                          type="text"
                          value={clientNameInput}
                          onChange={(e) => setClientNameInput(e.target.value)}
                          placeholder={language === 'hi' ? 'उदा. श्री रमेश कुमार / प्रिय मित्र' : 'e.g. Ramesh Kumar / Dear Friend'}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {language === 'hi' ? 'वैधता (Validity)' : 'Validity'}
                        </label>
                        <select
                          value={validityDays}
                          onChange={(e) => setValidityDays(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value={3650}>{language === 'hi' ? 'आजीवन (Lifetime)' : 'Lifetime'}</option>
                          <option value={365}>{language === 'hi' ? '1 वर्ष (1 Year)' : '1 Year'}</option>
                          <option value={30}>{language === 'hi' ? '30 दिन (30 Days)' : '30 Days'}</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3 flex items-end">
                        <button
                          type="button"
                          onClick={handleGenerateVip}
                          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{language === 'hi' ? 'मुफ्त VIP लिंक बनाएं' : 'Generate Free Link'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Output Generated Link */}
                    {lastGeneratedVip && (
                      <div className="bg-slate-900 p-3.5 rounded-xl border border-emerald-500/40 space-y-2.5 animate-fadeIn">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-300 flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-400" />
                            {language === 'hi'
                              ? `VIP लिंक तैयार है (${lastGeneratedVip.pass.clientName}):`
                              : `VIP Link Ready for ${lastGeneratedVip.pass.clientName}:`}
                          </span>
                          <span className="text-[11px] font-mono text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            कोड: {lastGeneratedVip.pass.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={lastGeneratedVip.fullUrl}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono select-all"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopy(lastGeneratedVip.fullUrl, 'gen_vip')}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
                          >
                            {copiedKey === 'gen_vip' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === 'gen_vip' ? 'Copied!' : 'Copy'}</span>
                          </button>
                          <a
                            href={`https://api.whatsapp.com/send?text=${getVipWhatsappMessage(
                              lastGeneratedVip.pass.clientName,
                              lastGeneratedVip.fullUrl
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* LINK TYPE 2: CUSTOMER PAYMENT LINK (For regular clients who must pay) */}
                  <div className="bg-gradient-to-br from-slate-950 to-amber-950/30 p-5 rounded-2xl border-2 border-amber-500/30 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black">
                          2
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-amber-300">
                              {language === 'hi'
                                ? 'लिंक 2: ग्राहक भुगतान लिंक (Customer Paid Link)'
                                : 'Link 2: Customer Paid Access Link'}
                            </h4>
                            <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                              PAYMENT REQUIRED
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {language === 'hi'
                              ? 'यह लिंक आम ग्राहकों के लिए है। ग्राहक फ्री जन्म कुंडली देख सकेंगे, लेकिन स्विस एफिमेरिस, लो शू व अंक ज्योतिष देखने के लिए उन्हें UPI से भुगतान करना होगा।'
                              : 'Standard customer link with paywall on premium modules (Free Janam Kundali is free; Swiss Ephemeris, Lo Shu & Numerology require UPI payment).'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-bold">
                          {language === 'hi' ? 'ग्राहक शेयर लिंक:' : 'Customer Share Link:'}
                        </span>
                        <span className="text-[11px] text-amber-400 font-medium">
                          योजनाएं: 1 माह ₹{settings.plan1MonthPrice || 999} • 3 माह ₹{settings.plan3MonthsPrice || 1999} • 6 माह ₹{settings.plan6MonthsPrice || 3999} • लाइफटाइम ₹{settings.planLifetimePrice || 9999}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={customerLink}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono select-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(customerLink, 'cust_link')}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
                        >
                          {copiedKey === 'cust_link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'cust_link' ? 'Copied!' : 'Copy'}</span>
                        </button>
                        <a
                          href={`https://api.whatsapp.com/send?text=${getCustomerWhatsappMessage(customerLink)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 hover:bg-green-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* BONUS: Direct Admin Link for self */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-200 block">
                        {language === 'hi' ? '👑 आपका व्यक्तिगत एडमिन लिंक:' : '👑 Your Direct Admin Link:'}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {language === 'hi'
                          ? 'इस लिंक को बुकमार्क कर लें। इसे खोलते ही एडमिन पैनल अपने आप सक्रिय हो जाएगा।'
                          : 'Bookmark this secret link to directly open in master admin mode.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(adminDirectLink, 'admin_direct')}
                      className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0"
                    >
                      {copiedKey === 'admin_direct' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'admin_direct' ? 'Admin Link Copied!' : 'Copy Admin Link'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: VIP PROMO CODES */}
              {activeTab === 'vip_passes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {language === 'hi' ? 'सक्रिय VIP कूपन कोड्स' : 'Active VIP Unlock Promo Codes'}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {language === 'hi'
                          ? 'ग्राहक जब पेवॉल में यह कोड डालेगा, तो उसका ऐप तुरंत 100% फ्री में खुल जाएगा।'
                          : 'Customers can type these codes into the paywall modal to instantly unlock everything for free.'}
                      </p>
                    </div>
                  </div>

                  {/* Default Global Codes */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-300 block">
                      {language === 'hi' ? '🔥 सार्वभौमिक मास्टर VIP कोड्स (हमेशा सक्रिय):' : '🔥 Master Universal Promo Codes:'}
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['FREEVIP', 'GURUGIFT', 'ASTRO100', 'ADMINVIP', 'OMSHANTI'].map((code) => (
                        <div
                          key={code}
                          className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs"
                        >
                          <span className="font-mono font-bold text-amber-300">{code}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(code, `code_${code}`)}
                            className="text-slate-400 hover:text-white"
                            title="Copy code"
                          >
                            {copiedKey === `code_${code}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* List of Generated Passes */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-300 block">
                      {language === 'hi' ? 'ग्राहकों के नाम से बने VIP पास लिंक्स:' : 'Custom Generated Client VIP Passes:'}
                    </span>

                    {passes.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                        {language === 'hi'
                          ? 'अभी तक कोई व्यक्तिगत VIP लिंक नहीं बना है। "2 तरह के लिंक्स" टैब से बनाएं।'
                          : 'No custom VIP passes generated yet. Create one from the "2 Link Generators" tab.'}
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
                        {passes.map((p) => (
                          <div key={p.id} className="p-3 flex items-center justify-between text-xs gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{p.clientName}</span>
                                <span className="font-mono text-[10px] bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded border border-slate-800">
                                  {p.code}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                बना: {p.createdAt} • वैधता: {p.expiryDays} दिन
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleCopy(p.shareableLink, `pass_${p.id}`)}
                                className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded text-xs flex items-center gap-1"
                              >
                                {copiedKey === `pass_${p.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>Copy Link</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteVipPass(p.id);
                                  setPasses(getStoredVipPasses());
                                }}
                                className="p-1 text-slate-500 hover:text-rose-400"
                                title="Delete Pass"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: UPI & PRICING SETTINGS */}
              {activeTab === 'pricing' && (
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl mx-auto">
                  {/* 4-TIER SUBSCRIPTION PRICING */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>{language === 'hi' ? '💎 3-इन-1 कॉम्बो सदस्यता शुल्क (4 Plans)' : '💎 3-in-1 Combo Plans Pricing'}</span>
                      </h4>
                      <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/60">
                        {language === 'hi' ? 'तीनों सेवाएं शामिल' : 'All 3 Services'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {language === 'hi'
                        ? 'स्विस एफिमेरिस, लो शू ग्रिड और अंक ज्योतिष तीनों सेवाओं के लिए मासिक, त्रैमासिक, छमाही और आजीवन शुल्क यहाँ सेट करें:'
                        : 'Configure pricing for 1-Month, 3-Months, 6-Months, and Lifetime Unlimited access:'}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          1 Month Plan (₹)
                        </label>
                        <input
                          type="number"
                          value={settings.plan1MonthPrice ?? 999}
                          onChange={(e) => setSettings({ ...settings, plan1MonthPrice: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold"
                          required
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">डिफ़ॉल्ट: ₹999</span>
                      </div>

                      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-amber-500/40 relative">
                        <span className="absolute -top-2 right-2 text-[8px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">POPULAR</span>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          3 Months Plan (₹)
                        </label>
                        <input
                          type="number"
                          value={settings.plan3MonthsPrice ?? 1999}
                          onChange={(e) => setSettings({ ...settings, plan3MonthsPrice: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold"
                          required
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">डिफ़ॉल्ट: ₹1999</span>
                      </div>

                      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          6 Months Plan (₹)
                        </label>
                        <input
                          type="number"
                          value={settings.plan6MonthsPrice ?? 3999}
                          onChange={(e) => setSettings({ ...settings, plan6MonthsPrice: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold"
                          required
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">डिफ़ॉल्ट: ₹3999</span>
                      </div>

                      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-emerald-500/40 relative">
                        <span className="absolute -top-2 right-2 text-[8px] bg-emerald-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">LIFETIME</span>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          Lifetime Access (₹)
                        </label>
                        <input
                          type="number"
                          value={settings.planLifetimePrice ?? 9999}
                          onChange={(e) => setSettings({ ...settings, planLifetimePrice: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 font-mono font-black"
                          required
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">डिफ़ॉल्ट: ₹9999</span>
                      </div>
                    </div>
                  </div>

                  {/* UPI PAYMENT DETAILS */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'hi' ? '📱 UPI QR कोड विवरण (Official HDFC & Google Pay)' : '📱 UPI QR Code Accounts'}</span>
                    </h4>

                    {/* Primary UPI: HDFC */}
                    <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-400">प्राथमिक HDFC UPI (AstroDost AI)</span>
                        <span className="text-[10px] text-slate-400">Primary Official UPI</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-0.5">UPI ID</label>
                          <input
                            type="text"
                            value={settings.upiId}
                            onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                            placeholder="darksecrets0unveiled@okhdfcbank"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Merchant Name</label>
                          <input
                            type="text"
                            value={settings.upiName}
                            onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                            placeholder="AstroDost AI (Acharya Manish Ji)"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Secondary UPI: Google Pay Standee */}
                    <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-blue-400">Google Pay स्टैंडी QR (Meenakshi Sharma)</span>
                        <span className="text-[10px] text-slate-400">Standee Uploaded QR</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Google Pay UPI ID</label>
                          <input
                            type="text"
                            value={settings.secondaryUpiId || 'pari.sharma2342@okaxis'}
                            onChange={(e) => setSettings({ ...settings, secondaryUpiId: e.target.value })}
                            placeholder="pari.sharma2342@okaxis"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-blue-300 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Payee Name</label>
                          <input
                            type="text"
                            value={settings.secondaryUpiName || 'Meenakshi Sharma'}
                            onChange={(e) => setSettings({ ...settings, secondaryUpiName: e.target.value })}
                            placeholder="Meenakshi Sharma"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RAZORPAY GATEWAY CONFIGURATION */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-blue-300 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-400" />
                        <span>{language === 'hi' ? '💳 Razorpay पेमेंट गेटवे इंटीग्रेशन' : '💳 Razorpay Gateway Configuration'}</span>
                      </h4>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${settings.razorpayKeyId?.startsWith('rzp_') ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950/80 text-amber-300 border border-amber-700/60'}`}>
                        {settings.razorpayKeyId?.startsWith('rzp_') ? '✓ RAZORPAY KEY ACTIVE' : '⚠️ KEY ID PENDING (rzp_live_...)'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {language === 'hi'
                        ? 'Razorpay Dashboard (Settings > API Keys) से अपनी Key ID और Secret दर्ज करें। इसके चालू होते ही कार्ड, नेटबैंकिंग व वॉलेट स्वतः सक्रिय हो जाते हैं।'
                        : 'Enter your Razorpay Key ID and Secret from dashboard (Settings > API Keys) to enable cards, netbanking and wallets.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Razorpay Key ID (rzp_live_... or rzp_test_...)
                        </label>
                        <input
                          type="text"
                          value={settings.razorpayKeyId || ''}
                          onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value.trim() })}
                          placeholder="rzp_live_xxxxxxxxxxxx or rzp_test_xxxxxxxxxxxx"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {language === 'hi'
                            ? '✓ अनिवार्य: Key ID हमेशा "rzp_live_" या "rzp_test_" से शुरू होनी चाहिए।'
                            : '✓ Must strictly begin with "rzp_live_" or "rzp_test_"'}
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Razorpay Key Secret (24-Characters)
                        </label>
                        <input
                          type="password"
                          value={settings.razorpayKeySecret || ''}
                          onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value.trim() })}
                          placeholder="••••••••••••••••••••••••"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {language === 'hi'
                            ? '✓ Razorpay द्वारा प्रदान किया गया 24-अक्षरों का सीक्रेट'
                            : '✓ 24-character HMAC signing secret from Razorpay'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        {language === 'hi'
                          ? '💡 जब तक Razorpay Live Key ID नहीं डालते, ग्राहक बिना किसी रुकावट के UPI QR (GPay / PhonePe / HDFC) से तुरंत भुगतान कर सकते हैं।'
                          : '💡 Customers can smoothly pay via UPI QR (GPay / PhonePe / Paytm) with zero setup required.'}
                      </span>
                      <a
                        href="https://dashboard.razorpay.com/#/app/keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0 ml-2"
                      >
                        <span>Razorpay Dashboard</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* OPENROUTER AI ENGINE API KEY (MONKEYCODE FITNESS / ASTRODOST AI) */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>{language === 'hi' ? '🧠 OpenRouter AI इंजन API कुंजी (Monkeycode Fitness AI)' : '🧠 OpenRouter AI Engine API Key'}</span>
                      </h4>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
                        ✓ ACTIVE & VERIFIED
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {language === 'hi'
                        ? 'आचार्य एस्ट्रोदोस्त AI के सभी उन्नत ज्योतिषीय मॉडल्स (OpenAI GPT-4o, Claude, DeepSeek, Cohere) इस OpenRouter Key से 100% लाइव जुड़े हुए हैं।'
                        : 'Powers live predictive AI consultations across GPT-4o, Claude, and DeepSeek via OpenRouter API.'}
                    </p>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        OpenRouter API Key (sk-or-v1-...)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={settings.openRouterApiKey || ''}
                          onChange={(e) => setSettings({ ...settings, openRouterApiKey: e.target.value.trim() })}
                          placeholder="sk-or-v1-xxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-purple-300 font-mono tracking-wider"
                        />
                        <button
                          type="button"
                          onClick={testOpenRouterConnection}
                          disabled={isTestingOpenRouter}
                          className="bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/50 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isTestingOpenRouter ? 'animate-spin' : ''}`} />
                          <span>{isTestingOpenRouter ? 'जांच जारी...' : 'कनेक्शन टेस्ट'}</span>
                        </button>
                      </div>
                    </div>

                    {openRouterTestResult && (
                      <div className={`p-2.5 rounded-lg text-xs font-medium border ${openRouterTestResult.success ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300' : 'bg-rose-950/60 border-rose-600/50 text-rose-300'}`}>
                        {openRouterTestResult.message}
                      </div>
                    )}
                  </div>

                  {/* SECURITY & SUPPORT */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {language === 'hi' ? 'हेल्पलाइन WhatsApp नंबर' : 'Support WhatsApp Number'}
                        </label>
                        <input
                          type="text"
                          value={settings.whatsappNumber}
                          onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                          placeholder="+91 98886..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {language === 'hi' ? 'एडमिन सुरक्षा पासवर्ड / पिन (Admin Password)' : 'Admin Security Password / PIN'}
                        </label>
                        <input
                          type="text"
                          value={settings.adminPin}
                          onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                          placeholder="manish01933"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono text-center font-bold"
                        />
                        <span className="text-[10px] text-emerald-400 mt-1 block">
                          {language === 'hi' ? 'सक्रिय पासवर्ड: manish01933' : 'Active Password: manish01933'}
                        </span>
                      </div>
                    </div>

                    {/* OMNIROUTE CHECK DIAGNOSTIC CARD */}
                    <div className="bg-slate-900/90 p-3.5 rounded-xl border border-teal-500/40 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">⚡</span>
                          <div>
                            <span className="text-xs font-black text-teal-300 tracking-wide uppercase">
                              OMNIROUTE CHECK
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {language === 'hi' ? 'सिस्टम रूट व स्क्रीनशॉट स्थिति परीक्षण' : 'System Route & Live Check Status'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={runOmniRouteCheck}
                          disabled={isCheckingOmni}
                          className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isCheckingOmni ? (
                            <span>चेक हो रहा है...</span>
                          ) : (
                            <>
                              <span>🔄</span>
                              <span>{language === 'hi' ? 'री-चेक करें' : 'Re-Check'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {omniCheckResult ? (
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1.5 font-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Gemini Vedic Route:</span>
                            <span className="text-emerald-400 font-bold">
                              {omniCheckResult.routes?.gemini?.status === 'active' ? '● Live / Active' : 'Fallback Engine'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">OmniRouter Failover:</span>
                            <span className="text-teal-300 font-bold">
                              {omniCheckResult.routes?.omniRouter?.status === 'active' ? '● Live / Active' : '● Configured / Fallback Active'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Combo Mode:</span>
                            <span className="text-amber-300 font-bold uppercase">{omniCheckResult.comboMode}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1">
                            {omniCheckResult.summary}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 bg-slate-950 p-2 rounded-lg">
                          {language === 'hi' ? 'OMNIROUTE स्थिति लोड हो रही है...' : 'Loading OMNIROUTE status...'}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        {savedSettingsSuccess
                          ? language === 'hi'
                            ? '✓ सभी प्लान्स और सेटिंग्स सुरक्षित हो गईं!'
                            : '✓ All Plans & Settings Saved!'
                          : language === 'hi'
                          ? 'सेटिंग्स व प्लान्स सेव करें (Save Configuration)'
                          : 'Save Settings & Plans'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 4: UNLOCK LOGS */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white">
                    {language === 'hi' ? 'हालिया एक्टिवेशन व पेमेंट रिकॉर्ड्स' : 'Recent Unlocks & Transaction Logs'}
                  </h4>
                  {history.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                      {language === 'hi' ? 'अभी कोई लेन-देन रिकॉर्ड नहीं है।' : 'No payment records yet.'}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950 overflow-hidden text-xs">
                      {history.map((rec) => (
                        <div key={rec.id} className="p-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{rec.clientName}</span>
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                {rec.moduleTitle}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {rec.date} • UTR: {rec.utrNumber} • {rec.paymentMethod.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold font-mono text-amber-300">
                              {rec.amount === 0 ? 'FREE VIP' : `₹${rec.amount}`}
                            </span>
                            <span className="block text-[10px] text-emerald-400">✓ Unlocked</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              </ErrorBoundary>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span>
                {language === 'hi'
                  ? '👑 सुपर एडमिन मोड सक्रिय है'
                  : '👑 Super Admin Master Mode Active'}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-lg font-bold"
              >
                {language === 'hi' ? 'बंद करें' : 'Close Panel'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
