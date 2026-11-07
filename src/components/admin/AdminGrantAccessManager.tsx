import React, { useState, useEffect } from 'react';
import {
  Crown,
  Gift,
  Sparkles,
  Check,
  Copy,
  Send,
  Trash2,
  ExternalLink,
  Shield,
  UserCheck,
  Clock,
  Search,
  RefreshCw,
  AlertCircle,
  Unlock,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { Language } from '../../types/astrology';
import { getOrCreateUserId } from '../../utils/entitlementManager';
import {
  AccessState,
  saveAccessState,
  generateAdminLink,
  fetchGrantedUsersApi,
  grantUserAccessApi,
  revokeGrantedUserApi,
  activateAdminSelfVipApi,
  GrantedUserRecord,
} from '../../utils/accessManager';

interface AdminGrantAccessManagerProps {
  language: Language;
  accessState: AccessState;
  setAccessState: React.Dispatch<React.SetStateAction<AccessState>>;
  adminPin: string;
}

export const AdminGrantAccessManager: React.FC<AdminGrantAccessManagerProps> = ({
  language,
  accessState,
  setAccessState,
  adminPin,
}) => {
  // Self Admin VIP state
  const isSelfVipActive = accessState.isAdminUnlocked && accessState.isVipUnlocked;
  const [selfActionSuccess, setSelfActionSuccess] = useState<string | null>(null);

  // Granting form state
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<'plan_astrodost_vip' | 'plan_kundli_report' | 'plan_kundli_explorer'>(
    'plan_astrodost_vip'
  );
  const [durationDays, setDurationDays] = useState<number>(0); // 0 = Lifetime
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Last generated result
  const [lastGranted, setLastGranted] = useState<{
    record: GrantedUserRecord;
    shareableLink: string;
    whatsappMessage: string;
  } | null>(null);

  // Granted users management list
  const [grantedUsers, setGrantedUsers] = useState<GrantedUserRecord[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    loadGrantedUsers();
  }, []);

  const loadGrantedUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const users = await fetchGrantedUsersApi();
      setGrantedUsers(Array.isArray(users) ? users : []);
    } catch (e) {
      console.warn('Error loading granted users:', e);
      setGrantedUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // 1. One-click activate Free VIP for self (Admin)
  const handleActivateSelfVip = async () => {
    const updated: AccessState = {
      ...accessState,
      role: 'admin',
      isAdminUnlocked: true,
      isVipUnlocked: true,
      vipClientName: 'Master Admin',
      unlockedModules: ['*'],
      planId: 'plan_astrodost_vip',
      activatedAt: new Date().toISOString(),
    };
    setAccessState(updated);
    saveAccessState(updated);

    try {
      const uid = getOrCreateUserId();
      const res = await activateAdminSelfVipApi(uid);
      setSelfActionSuccess(res.message || '✓ VIP Pro आपके लिए आजीवन सक्रिय कर दिया गया!');
    } catch {
      setSelfActionSuccess('✓ VIP Pro आपके ब्राउज़र में सक्रिय हो गया!');
    }

    setTimeout(() => setSelfActionSuccess(null), 4000);
  };

  // Toggle self mode to test customer paywall
  const handleToggleCustomerTest = () => {
    const willBeCustomer = accessState.isAdminUnlocked;
    const updated: AccessState = {
      ...accessState,
      role: willBeCustomer ? 'customer' : 'admin',
      isAdminUnlocked: !willBeCustomer,
      isVipUnlocked: !willBeCustomer,
      vipClientName: willBeCustomer ? '' : 'Master Admin',
      unlockedModules: willBeCustomer ? [] : ['*'],
    };
    setAccessState(updated);
    saveAccessState(updated);
  };

  // 2. Grant free access to anyone
  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = recipientName.trim();
    const contact = recipientContact.trim();

    if (!name && !contact) {
      setFormError(
        language === 'hi'
          ? 'कृपया प्राप्तकर्ता का नाम या ईमेल/फोन दर्ज करें।'
          : 'Please enter recipient name or email/phone.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await grantUserAccessApi({
        recipientName: name || 'Valued User',
        recipientEmailOrPhone: contact,
        planId: selectedPlanId,
        durationDays,
        notes: notes.trim() || undefined,
      });

      if (res.success && res.grantedUser && res.shareableLink) {
        setLastGranted({
          record: res.grantedUser,
          shareableLink: res.shareableLink,
          whatsappMessage: res.whatsappMessage || '',
        });
        setRecipientName('');
        setRecipientContact('');
        setNotes('');
        loadGrantedUsers();
      } else {
        setFormError(res.error || 'Failed to grant access');
      }
    } catch (err: any) {
      setFormError(err?.message || 'Error granting access');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Revoke granted access
  const handleRevoke = async (id: string, name: string) => {
    const confirmMsg =
      language === 'hi'
        ? `क्या आप सचमुच ${name} का मुफ़्त एक्सेस रद्द करना चाहते हैं?`
        : `Are you sure you want to revoke free access for ${name}?`;
    if (!window.confirm(confirmMsg)) return;

    await revokeGrantedUserApi(id);
    loadGrantedUsers();
  };

  const adminLink = generateAdminLink(adminPin);

  const filteredUsers = Array.isArray(grantedUsers)
    ? grantedUsers.filter((u) => {
        if (!u) return false;
        const q = (searchQuery || '').trim().toLowerCase();
        if (!q) return true;
        const name = (u.recipientName || '').toLowerCase();
        const contact = (u.recipientEmailOrPhone || '').toLowerCase();
        const code = (u.passCode || '').toLowerCase();
        const plan = (u.planName || '').toLowerCase();
        return name.includes(q) || contact.includes(q) || code.includes(q) || plan.includes(q);
      })
    : [];

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* SECTION 1: ADMIN SELF VIP PRO (अपने लिए मुफ़्त इस्तेमाल) */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-br from-amber-950/60 via-slate-900 to-emerald-950/60 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-black text-amber-300">
                  {language === 'hi' ? '👑 एडमिन VIP Pro: आपका निजी आजीवन मुफ़्त एक्सेस' : '👑 Admin VIP Pro: Your Free Lifetime Access'}
                </h4>
                {isSelfVipActive ? (
                  <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Check className="w-3 h-3" />
                    {language === 'hi' ? 'सक्रिय (ACTIVE)' : 'ACTIVE'}
                  </span>
                ) : (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold px-2 py-0.5 rounded-full">
                    {language === 'hi' ? 'ग्राहक टेस्ट मोड' : 'CUSTOMER TEST MODE'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'hi'
                  ? 'एडमिन के रूप में आपको कभी भी कोई प्लान खरीदने की आवश्यकता नहीं है। 1-क्लिक में पूरा प्रोजेक्ट मुफ़्त इस्तेमाल करें।'
                  : 'As Admin, you never need to purchase any plan. Use the entire app 100% free with unlimited features.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {!isSelfVipActive ? (
              <button
                type="button"
                onClick={handleActivateSelfVip}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'hi' ? '⚡ मेरे लिए VIP Pro मुफ़्त चालू करें' : '⚡ Activate Free VIP For Me'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleToggleCustomerTest}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Test how paywalls appear to ordinary customers"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'ग्राहक व्यू टेस्ट करें' : 'Test Customer View'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleCopy(adminLink, 'admin_direct_link')}
              className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedKey === 'admin_direct_link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'admin_direct_link' ? 'Copied!' : language === 'hi' ? 'एडमिन लिंक कॉपी करें' : 'Copy Admin Link'}</span>
            </button>
          </div>
        </div>

        {selfActionSuccess && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{selfActionSuccess}</span>
          </div>
        )}

        {/* Feature entitlement pill list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3">
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-slate-400">कुंडली एनालिसिस</div>
            <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Check className="w-3.5 h-3.5" /> 100% मुफ़्त
            </div>
          </div>
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-slate-400">25-पेज PDF रिपोर्ट</div>
            <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Check className="w-3.5 h-3.5" /> असीमित डाउनलोड
            </div>
          </div>
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-slate-400">ओपन AI चैट</div>
            <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Check className="w-3.5 h-3.5" /> असीमित प्रश्न
            </div>
          </div>
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-slate-400">लो शू ग्रिड</div>
            <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Check className="w-3.5 h-3.5" /> फुल अनलॉक
            </div>
          </div>
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-slate-400">अंक ज्योतिष</div>
            <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Check className="w-3.5 h-3.5" /> फुल अनलॉक
            </div>
          </div>
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-slate-400">मासिक रिन्यूअल</div>
            <div className="text-xs font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
              👑 ₹0 (लाइफटाइम)
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: GRANT FREE ACCESS TO ANYONE (जिसे चाहें उसे दें) */}
      {/* ======================================================== */}
      <div className="bg-slate-950/90 border-2 border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-emerald-300">
                  {language === 'hi' ? '🎁 जिसे चाहें उसे मुफ़्त में प्रोजेक्ट / प्लान दें' : '🎁 Grant Free Plan to Anyone'}
                </h4>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  100% FREE GIFT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'अपने किसी भी क्लाइंट, दोस्त या रिश्तेदार को तीनों में से कोई भी प्लान 100% फ्री में दें। सिस्टम तुरंत शेयर करने योग्य लिंक बना देगा।'
                  : 'Gift any of the 3 plans completely free to clients, family, or friends. The system generates an instant shareable link.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleGrantAccess} className="space-y-4 pt-1">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {language === 'hi' ? 'प्राप्तकर्ता का नाम *' : 'Recipient Name *'}
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. श्री राहुल कुमार / प्रिय मित्र' : 'e.g. Rahul Kumar / Valued Friend'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {language === 'hi' ? 'ईमेल या मोबाइल नंबर (वैकल्पिक)' : 'Email or Phone (Optional)'}
              </label>
              <input
                type="text"
                value={recipientContact}
                onChange={(e) => setRecipientContact(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. rahul@gmail.com या 9876543210' : 'e.g. rahul@gmail.com or 9876543210'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Select which plan to gift for free */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              {language === 'hi' ? 'मुफ़्त में देने के लिए प्लान चुनें *' : 'Select Plan to Gift For Free *'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* PLAN 1 */}
              <div
                onClick={() => setSelectedPlanId('plan_kundli_explorer')}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                  selectedPlanId === 'plan_kundli_explorer'
                    ? 'bg-slate-900 border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    PLAN 1 (15 MIN)
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">₹299</span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1">कुंडली एक्सप्लोरर (15 मिनट AI)</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  15 मिनट लाइव AI परामर्श + 1 व्यक्ति की वेब कुंडली विश्लेषण
                </p>
                <div className="mt-2 text-[10px] font-black text-emerald-400">✓ मुफ़्त में दें (₹0)</div>
              </div>

              {/* PLAN 2 */}
              <div
                onClick={() => setSelectedPlanId('plan_kundli_report')}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                  selectedPlanId === 'plan_kundli_report'
                    ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    PLAN 2 (35 MIN + PDF)
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">₹499</span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1">कुंडली रिपोर्ट (35 मिनट AI + PDF)</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  35 मिनट विस्तृत AI परामर्श + 1 संपूर्ण 25-पृष्ठ PDF रिपोर्ट
                </p>
                <div className="mt-2 text-[10px] font-black text-emerald-400">✓ मुफ़्त में दें (₹0)</div>
              </div>

              {/* PLAN 3 */}
              <div
                onClick={() => setSelectedPlanId('plan_astrodost_vip')}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                  selectedPlanId === 'plan_astrodost_vip'
                    ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    PLAN 3 (120 MIN / 2 HRS)
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">₹999</span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1">एस्ट्रोदोस्त VIP (120 मिनट AI)</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  120 मिनट (2 घंटे) वीआईपी AI परामर्श + 2 PDF/माह + लो शू व अंक ज्योतिष
                </p>
                <div className="mt-2 text-[10px] font-black text-emerald-400">👑 सर्वश्रेष्ठ मुफ़्त पास (₹0)</div>
              </div>
            </div>
          </div>

          {/* Duration & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {language === 'hi' ? 'वैधता (Validity)' : 'Validity'}
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value={0}>{language === 'hi' ? '👑 आजीवन (Lifetime - कभी एक्सपायर नहीं)' : '👑 Lifetime'}</option>
                <option value={365}>{language === 'hi' ? '1 वर्ष (1 Year - 365 दिन)' : '1 Year'}</option>
                <option value={30}>{language === 'hi' ? '30 दिन (1 Month)' : '30 Days'}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {language === 'hi' ? 'टिप्पणी / संदेश (वैकल्पिक)' : 'Notes / Remarks (Optional)'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. मित्र को उपहार, स्पेशल क्लाइंट' : 'e.g. Gift for friend, client demo'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Gift className="w-4 h-4" />
            )}
            <span>
              {isSubmitting
                ? language === 'hi'
                  ? 'मुफ़्त एक्सेस सक्रिय किया जा रहा है...'
                  : 'Granting Free Access...'
                : language === 'hi'
                ? '🎁 तुरंत मुफ़्त एक्सेस सक्रिय करें व लिंक बनाएं'
                : '🎁 Grant Instant Free Access & Generate Link'}
            </span>
          </button>
        </form>

        {/* ======================================================== */}
        {/* OUTPUT BOX: LAST GENERATED GIFT LINK */}
        {/* ======================================================== */}
        {lastGranted && (
          <div className="mt-4 bg-gradient-to-br from-slate-900 to-emerald-950/60 border-2 border-emerald-500 rounded-2xl p-4 space-y-3 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                  ✓
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-black text-emerald-300">
                    {language === 'hi'
                      ? `मुफ़्त एक्सेस तैयार है (${lastGranted.record.recipientName})!`
                      : `Free Access Ready for ${lastGranted.record.recipientName}!`}
                  </h5>
                  <div className="text-[11px] text-slate-400">
                    प्लान: <span className="text-white font-bold">{lastGranted.record.planName}</span> • वैधता:{' '}
                    <span className="text-amber-300 font-bold">
                      {lastGranted.record.durationDays === 0 ? 'आजीवन (Lifetime)' : `${lastGranted.record.durationDays} दिन`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">पास कोड:</span>
                <span className="text-xs font-mono font-bold text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {lastGranted.record.passCode}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                {language === 'hi' ? 'शेयर करने योग्य 1-क्लिक मुफ़्त लिंक:' : 'Shareable 1-Click Free Link:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={lastGranted.shareableLink}
                  className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-mono text-emerald-200 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(lastGranted.shareableLink, 'last_gift_link')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedKey === 'last_gift_link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'last_gift_link' ? 'Copied!' : 'Copy'}</span>
                </button>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(lastGranted.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-lg shadow-green-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
              <p className="text-[11px] text-emerald-400/80">
                {language === 'hi'
                  ? '💡 इस लिंक को खोलते ही प्राप्तकर्ता के डिवाइस पर यह प्लान 100% मुफ़्त चालू हो जाएगा, कोई चार्ज या कार्ड नहीं मांगेगा।'
                  : '💡 Opening this link immediately activates this plan on recipient device for 100% free with no charge.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: GRANTED USERS LIST (मुफ़्त एक्सेस पाए हुए यूज़र्स) */}
      {/* ======================================================== */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm sm:text-base font-bold text-white">
              {language === 'hi' ? 'मुफ़्त एक्सेस पाए हुए यूज़र्स की सूची' : 'Granted Users List'}
            </h4>
            <span className="text-xs bg-slate-900 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-slate-800">
              {grantedUsers.length}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hi' ? 'नाम / फोन / कोड खोजें...' : 'Search name / phone / code...'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="button"
              onClick={loadGrantedUsers}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800/80 text-slate-400 text-xs">
            {searchQuery
              ? language === 'hi'
                ? 'कोई यूज़र नहीं मिला।'
                : 'No users found.'
              : language === 'hi'
              ? 'अभी तक किसी को मुफ़्त एक्सेस नहीं दिया गया है। ऊपर दिए गए फॉर्म से किसी को भी तुरंत मुफ़्त एक्सेस दें।'
              : 'No free access granted yet. Use the form above to grant access to anyone.'}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredUsers.map((u) => {
              const isRevoked = u.status === 'revoked';
              return (
                <div
                  key={u.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isRevoked
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          u.planId === 'plan_astrodost_vip'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : u.planId === 'plan_kundli_report'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {u.planId === 'plan_astrodost_vip' ? 'VIP' : u.planId === 'plan_kundli_report' ? 'PDF' : 'EXP'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{u.recipientName}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                              isRevoked
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {isRevoked ? 'REVOKED' : 'ACTIVE'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                          {u.recipientEmailOrPhone && (
                            <span>{u.recipientEmailOrPhone} • </span>
                          )}
                          <span className="text-slate-300 font-medium">{u.planName}</span>
                          <span>•</span>
                          <span className="text-amber-400">
                            {u.durationDays === 0 ? 'आजीवन (Lifetime)' : `${u.durationDays} दिन`}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">कोड: {u.passCode}</span>
                        </div>
                      </div>
                    </div>

                    {!isRevoked && (
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(u.shareableLink, `table_link_${u.id}`)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          {copiedKey === `table_link_${u.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `table_link_${u.id}` ? 'Copied' : 'लिंक'}</span>
                        </button>
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            `🙏 नमस्ते ${u.recipientName}!\n\nAstroDost की तरफ से आपके लिए ${u.planName} 100% मुफ़्त अनलॉक कर दिया गया है!\n\n👉 यहाँ क्लिक करके शुरू करें:\n${u.shareableLink}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 hover:bg-green-500 text-white px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRevoke(u.id, u.recipientName)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Revoke access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
