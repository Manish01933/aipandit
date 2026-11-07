import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FreeJanamKundaliView } from './components/FreeJanamKundaliView';
import { DailyHoroscopeView } from './components/DailyHoroscopeView';
import { KundaliGeneratorView } from './components/KundaliGeneratorView';
import { JagannathaHoraView } from './components/JagannathaHoraView';
import { MatchmakingView } from './components/MatchmakingView';
import { AIAstrologerChatView } from './components/AIAstrologerChatView';
import { PanchangView } from './components/PanchangView';
import { NumerologyView } from './components/NumerologyView';
import { LoShuGridView } from './components/LoShuGridView';
import { PrashnaTarotView } from './components/PrashnaTarotView';
import { GemstoneRudrakshaView } from './components/GemstoneRudrakshaView';
import { MultiChannelDeliveryModal } from './components/MultiChannelDeliveryModal';
import { RemediesView } from './components/RemediesView';
import { SampoornKundaliReportView } from './components/SampoornKundaliReportView';
import { AdminPortalModal } from './components/AdminPortalModal';
import { PaymentPaywallModal } from './components/PaymentPaywallModal';
import { KundaliHistoryModal } from './components/KundaliHistoryModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { AnnouncementBar } from './components/AnnouncementBar';
import { PromotionalBanner } from './components/PromotionalBanner';
import { Language } from './types/astrology';
import {
  AccessState,
  initAccessFromUrl,
  isModuleUnlocked,
  getStoredAccessState,
} from './utils/accessManager';
import {
  getSavedProfiles,
  setActiveProfile,
  BirthProfileRecord,
} from './utils/birthProfileManager';
import { syncThemeFromServer } from './utils/themeManager';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('free-kundali');
  const [language, setLanguage] = useState<Language>('hi');
  const [accessState, setAccessState] = useState<AccessState>(getStoredAccessState());
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [savedProfilesCount, setSavedProfilesCount] = useState<number>(() => {
    try {
      return getSavedProfiles().length;
    } catch {
      return 0;
    }
  });
  const [paywallModal, setPaywallModal] = useState<{ isOpen: boolean; moduleId: string }>({
    isOpen: false,
    moduleId: 'jagannatha',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize theme from server/local on mount
  useEffect(() => {
    syncThemeFromServer();
  }, []);

  // Initialize and detect link parameters (?mode=admin, ?vip=free, ?client=...)
  useEffect(() => {
    const { state, newlyActivated, message } = initAccessFromUrl();
    setAccessState(state);

    if (newlyActivated && message) {
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 6000);
    }

    // If URL has ?mode=admin, ?admin=1, ?key=1, or #admin, automatically open Admin Portal!
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('mode') === 'admin' ||
        params.get('admin') === '1' ||
        params.get('role') === 'admin' ||
        params.get('key') === '1' ||
        params.get('key') === 'admin' ||
        window.location.hash === '#admin' ||
        window.location.hash === '#key'
      ) {
        setIsAdminModalOpen(true);
      }
    }

    const handleGlobalPaywall = (e: any) => {
      const target = e.detail?.moduleId || 'plan_kundli_report';
      setPaywallModal({ isOpen: true, moduleId: target });
    };

    const handleProfilesChange = () => {
      try {
        setSavedProfilesCount(getSavedProfiles().length);
      } catch {
        // ignore
      }
    };

    const handleNavigateTab = (e: any) => {
      const rawTab = typeof e.detail === 'string' ? e.detail : e.detail?.tab;
      if (rawTab) {
        if (rawTab === 'all-services') {
          setActiveTab('kundali');
        } else {
          setActiveTab(rawTab);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleOpenAdmin = () => setIsAdminModalOpen(true);
    const handleHashChange = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.hash === '#key' ||
        window.location.hash === '#portal'
      ) {
        setIsAdminModalOpen(true);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && e.key.toLowerCase() === 'a') ||
        (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a')
      ) {
        e.preventDefault();
        setIsAdminModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('astrodost_open_admin_portal', handleOpenAdmin);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    (window as any).openAdminPortal = () => setIsAdminModalOpen(true);

    window.addEventListener('astrodost_open_paywall', handleGlobalPaywall);

    const handleOpenDelivery = () => setIsDeliveryModalOpen(true);
    window.addEventListener('astrodost_open_delivery_modal', handleOpenDelivery);
    window.addEventListener('astrodost_profiles_changed', handleProfilesChange);
    window.addEventListener('astrodost_navigate_tab', handleNavigateTab);
    return () => {
      window.removeEventListener('astrodost_open_admin_portal', handleOpenAdmin);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('astrodost_open_paywall', handleGlobalPaywall);
      window.removeEventListener('astrodost_open_delivery_modal', handleOpenDelivery);
      window.removeEventListener('astrodost_profiles_changed', handleProfilesChange);
      window.removeEventListener('astrodost_navigate_tab', handleNavigateTab);
    };
  }, []);

  // Auto-scroll smooth down to Kundali form/content section whenever tab changes or Kundali option is clicked
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeContentEl = document.getElementById('active-tab-content') || document.getElementById('main-content-view');
      if (activeContentEl) {
        const rect = activeContentEl.getBoundingClientRect();
        const yOffset = -90; // preserve sticky header visibility
        const yPos = rect.top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, yPos), behavior: 'smooth' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleNavigateToPaid = (targetTab: string) => {
    if (isModuleUnlocked(targetTab, accessState)) {
      setActiveTab(targetTab);
    } else {
      setPaywallModal({ isOpen: true, moduleId: targetTab });
    }
  };

  const handleOpenPaywall = (moduleId: string) => {
    setPaywallModal({ isOpen: true, moduleId });
  };

  return (
    <div className="min-h-screen bg-[#eaf6ed] text-slate-900 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Real-time Ticker / Announcements Bar (Window 2: Add/Del Info) */}
      <AnnouncementBar
        language={language}
        onNavigateTab={(tab) => {
          if (tab === 'all-services') {
            setActiveTab('kundali');
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenAdminPortal={() => setIsAdminModalOpen(true)}
        isAdminUnlocked={accessState.isAdminUnlocked}
      />

      {/* Universal Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        accessState={accessState}
        onOpenAdminPortal={() => setIsAdminModalOpen(true)}
        onOpenPaywall={handleOpenPaywall}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        savedProfilesCount={savedProfilesCount}
      />

      {/* Floating Activation Toast / Welcome Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-emerald-500/30 border border-emerald-400/40 flex items-center gap-3 text-xs sm:text-sm font-bold"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0 animate-bounce" />
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-emerald-800 rounded-lg text-emerald-200"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Viewport */}
      <main id="main-content-view" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Top Promotional Banner (Admin Configurable - Auto-Adjust Any Size) */}
        <PromotionalBanner
          language={language}
          onNavigateTab={(tab) => {
            if (tab === 'all-services') {
              setActiveTab('kundali');
            } else {
              setActiveTab(tab);
            }
          }}
          onOpenPaywall={handleOpenPaywall}
          onOpenAdminPortal={() => setIsAdminModalOpen(true)}
          isAdminUnlocked={accessState.isAdminUnlocked}
        />

        <div id="active-tab-content">
          {activeTab === 'free-kundali' && (
            <FreeJanamKundaliView
              language={language}
              onNavigateToPaid={handleNavigateToPaid}
              onOpenAdminPortal={() => setIsAdminModalOpen(true)}
              isAdminUnlocked={accessState.isAdminUnlocked}
              isPart2Unlocked={isModuleUnlocked('jagannatha', accessState)}
              onOpenPaywall={handleOpenPaywall}
              onNavigateTab={(tab) => {
                if (tab === 'all-services') {
                  setActiveTab('kundali');
                } else {
                  setActiveTab(tab);
                }
              }}
            />
          )}
        {activeTab === 'sampoorn-report' && (
          <SampoornKundaliReportView
            language={language}
            onNavigateHome={() => setActiveTab('free-kundali')}
          />
        )}
        {activeTab === 'horoscope' && <DailyHoroscopeView language={language} />}
        {activeTab === 'kundali' && <KundaliGeneratorView language={language} />}
        {activeTab === 'jagannatha' && (
          <JagannathaHoraView
            language={language}
            onNavigateToPart1={() => setActiveTab('free-kundali')}
            onOpenPaywall={handleOpenPaywall}
            accessState={accessState}
          />
        )}
        {activeTab === 'matchmaking' && <MatchmakingView language={language} />}
        {activeTab === 'chat' && <AIAstrologerChatView language={language} setLanguage={setLanguage} />}
        {activeTab === 'panchang' && <PanchangView language={language} />}
        {activeTab === 'numerology' && <NumerologyView language={language} />}
        {activeTab === 'loshu' && <LoShuGridView language={language} />}
        {activeTab === 'prashna' && <PrashnaTarotView language={language} />}
        {activeTab === 'remedies' && <RemediesView language={language} />}
        {activeTab === 'gemstones' && <GemstoneRudrakshaView language={language} />}
        </div>
      </main>

      {/* 🚀 Multi-Channel 25-Page Kundali Delivery Modal */}
      <MultiChannelDeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        language={language}
        clientName={accessState.vipClientName || (language === "hi" ? "आदरणीय जातक" : "Valued Client")}
      />

      {/* Admin Control Panel Modal */}
      <ErrorBoundary fallbackTitle={language === 'hi' ? 'एडमिन पोर्टल में अस्थायी समस्या आई' : 'Admin Portal Error'}>
        <AdminPortalModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          accessState={accessState}
          setAccessState={setAccessState}
          language={language}
        />
      </ErrorBoundary>

      {/* Customer Payment & VIP Pass Paywall Modal */}
      <PaymentPaywallModal
        isOpen={paywallModal.isOpen}
        onClose={() => setPaywallModal({ isOpen: false, moduleId: 'jagannatha' })}
        targetModuleId={paywallModal.moduleId}
        accessState={accessState}
        setAccessState={setAccessState}
        language={language}
        onSuccessUnlock={() => {
          setIsDeliveryModalOpen(true);
          setActiveTab(paywallModal.moduleId);
          setToastMessage(
            language === 'hi'
              ? '🎉 भुगतान सफल! आपका प्लान तुरंत सक्रिय हो गया है — 25-पृष्ठ कुंडली व AI समय उपलब्ध है।'
              : '🎉 Payment Confirmed! Your plan is instantly activated with 25-Page Kundali & AI consultation.'
          );
          setTimeout(() => setToastMessage(null), 8000);
        }}
      />

      {/* 📜 Kundali History & Saved Records Modal (Global Access) */}
      <KundaliHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectProfile={(profile: BirthProfileRecord) => {
          setActiveProfile(profile.profile_id);
          window.dispatchEvent(new CustomEvent('astrodost_profile_changed', { detail: profile }));
          window.dispatchEvent(new CustomEvent('astrodost_kundali_updated', { detail: profile.chartData }));
          setActiveTab('free-kundali');
          setToastMessage(
            language === 'hi'
              ? `✨ ${profile.full_name} (${profile.profile_id.startsWith('KUN-') ? profile.profile_id : ('ID: #' + profile.profile_id.slice(-6).toUpperCase())}) की कुंडली लोड हो गई है!`
              : `✨ Loaded chart for ${profile.full_name} (${profile.profile_id.startsWith('KUN-') ? profile.profile_id : ('ID: #' + profile.profile_id.slice(-6).toUpperCase())})!`
          );
          setTimeout(() => setToastMessage(null), 4000);
        }}
        onNewKundali={() => {
          window.dispatchEvent(new CustomEvent('astrodost_new_kundali_requested'));
          setActiveTab('free-kundali');
        }}
        language={language}
      />


      {/* Deep Dark Footer Matching Screenshot Layout */}
      <footer className="bg-[#021813] border-t border-emerald-900/60 mt-16 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Column 1: Brand & Slogan */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('free-kundali')}>
                <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-amber-300 font-bold">
                  ✦
                </div>
                <div>
                  <div className="text-lg font-black text-white flex items-center gap-1.5">
                    <span>AstroDost</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-900 text-teal-300 border border-teal-500/50">
                      AI
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-300">
                    {language === 'hi' ? 'वैदिक ज्योतिष एवं मार्गदर्शन' : 'Vedic Astrology & Guidance'}
                  </p>
                </div>
              </div>
              <p className="text-emerald-300/80 text-xs leading-relaxed">
                {language === 'hi'
                  ? 'प्रामाणिक वैदिक ज्योतिष गणनाओं एवं आधुनिक AI शक्ति के साथ आपके जीवन का मार्गदर्शन।'
                  : 'Guiding your life path with authentic Vedic calculations and advanced AI insights.'}
              </p>
              <div className="text-xs text-amber-400 font-semibold tracking-wide">
                ज्ञान • मार्गदर्शन • बेहतर कल
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 tracking-wide">
                {language === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
              </h4>
              <ul className="space-y-2 text-emerald-200/80">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('free-kundali')}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'FREE जन्म कुंडली' : 'FREE Janam Kundali'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('horoscope')}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'दैनिक राशिफल' : 'Daily Horoscope'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('matchmaking')}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'गुण मिलान' : 'Matchmaking'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigateToPaid('jagannatha')}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'स्विस एफिमेरिस (जेहोरा)' : 'Swiss Ephemeris'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Help & Policies */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 tracking-wide">
                {language === 'hi' ? 'सहायता' : 'Help & Support'}
              </h4>
              <ul className="space-y-2 text-emerald-200/80">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'AI ज्योतिषी से सवाल पूछें' : 'Ask AI Astrologer'}
                  </button>
                </li>
                <li>
                  <span className="hover:text-amber-300 transition-colors cursor-pointer">
                    {language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
                  </span>
                </li>
                <li>
                  <span className="hover:text-amber-300 transition-colors cursor-pointer">
                    {language === 'hi' ? 'नियम एवं शर्तें (Terms)' : 'Terms of Service'}
                  </span>
                </li>
                <li>
                  <span className="hover:text-amber-300 transition-colors cursor-pointer">
                    {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQ'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Connect */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 tracking-wide">
                {language === 'hi' ? 'हमसे जुड़ें' : 'Connect With Us'}
              </h4>
              <div className="flex items-center gap-2.5 mb-4">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#052920] hover:bg-emerald-800 flex items-center justify-center text-rose-400 transition-colors"
                  title="YouTube"
                >
                  ▶
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#052920] hover:bg-emerald-800 flex items-center justify-center text-pink-400 transition-colors"
                  title="Instagram"
                >
                  📷
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#052920] hover:bg-emerald-800 flex items-center justify-center text-blue-400 transition-colors"
                  title="Facebook"
                >
                  f
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#052920] hover:bg-emerald-800 flex items-center justify-center text-emerald-400 transition-colors"
                  title="WhatsApp"
                >
                  💬
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#052920] hover:bg-emerald-800 flex items-center justify-center text-cyan-400 transition-colors"
                  title="Telegram"
                >
                  ✈
                </a>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {language === 'hi'
                  ? 'महर्षि पराशर एवं लहिड़ी अयनांश सिद्धांतों पर आधारित।'
                  : 'Based on Maharshi Parashara & Lahiri Ayanamsha principles.'}
              </p>
            </div>
          </div>

          {/* Bottom Divider & Copyright */}
          <div className="pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-emerald-400/80">
            <div>© {new Date().getFullYear()} AstroDost AI. सर्वाधिकार सुरक्षित.</div>
            <div className="text-amber-300/80 font-serif">
              ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Animated PWA Quick-Install Pill */}
      <PWAInstallButton language={language} variant="floating" />
    </div>
  );
}

