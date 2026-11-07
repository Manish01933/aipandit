import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Sun,
  Moon,
  Calendar,
  MessageSquare,
  HeartHandshake,
  Compass,
  Hash,
  HelpCircle,
  ShieldAlert,
  Award,
  Layers,
  Grid,
  Shield,
  Key,
  Lock,
  Unlock,
  Crown,
  Menu,
  X,
  ChevronDown,
  FileText,
  History as HistoryIcon,
} from 'lucide-react';
import { Language } from '../types/astrology';
import { AccessState, isModuleUnlocked, getEffectiveSubscriptionPlans } from '../utils/accessManager';
import { PWAInstallButton } from './PWAInstallButton';
import { MuhuratAlertsBell } from './MuhuratAlertsBell';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  accessState: AccessState;
  onOpenAdminPortal: () => void;
  onOpenPaywall: (moduleId: string) => void;
  onOpenHistory?: () => void;
  savedProfilesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  accessState,
  onOpenAdminPortal,
  onOpenPaywall,
  onOpenHistory,
  savedProfilesCount = 0,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const isJHoraUnlocked = isModuleUnlocked('jagannatha', accessState);
  const isLoShuUnlocked = isModuleUnlocked('loshu', accessState);
  const isNumerologyUnlocked = isModuleUnlocked('numerology', accessState);

  const effectivePlans = getEffectiveSubscriptionPlans();
  const starterPlan = effectivePlans['plan_kundli_explorer'];
  const starterPrice = starterPlan?.price ?? 299;

  const tabs = [
    {
      id: 'free-kundali',
      label: language === 'hi' ? 'भाग १: जन्म कुंडली' : 'Part 1: Janam Kundali',
      icon: Compass,
      badge: '100% FREE',
      badgeType: 'free' as const,
    },
    {
      id: 'jagannatha',
      label: language === 'hi' ? 'भाग २: जगन्नाथ होरा' : 'Part 2: Jagannath Hora',
      icon: Layers,
      badge: isJHoraUnlocked ? 'UNLOCKED ✓' : 'PAID 👑',
      badgeType: isJHoraUnlocked ? ('unlocked' as const) : ('paid' as const),
      isPaidModule: true,
    },
    {
      id: 'sampoorn-report',
      label: language === 'hi' ? '📜 सम्पूर्ण कुंडली लेखा-जोखा' : '📜 Complete Life Report',
      icon: FileText,
      badge: '25 PAGES PDF',
      badgeType: 'free' as const,
    },
    { id: 'horoscope', label: language === 'hi' ? 'दैनिक राशिफल' : 'Daily Horoscope', icon: Sun },
    {
      id: 'loshu',
      label: language === 'hi' ? 'लो शू ग्रिड' : 'Lo Shu Grid',
      icon: Grid,
      badge: isLoShuUnlocked ? 'UNLOCKED ✓' : 'PAID ⭐',
      badgeType: isLoShuUnlocked ? ('unlocked' as const) : ('paid' as const),
      isPaidModule: true,
    },
    {
      id: 'numerology',
      label: language === 'hi' ? 'अंक ज्योतिष' : 'Numerology',
      icon: Hash,
      badge: isNumerologyUnlocked ? 'UNLOCKED ✓' : 'PAID ⭐',
      badgeType: isNumerologyUnlocked ? ('unlocked' as const) : ('paid' as const),
      isPaidModule: true,
    },
    { id: 'kundali', label: language === 'hi' ? 'विस्तृत जन्म पत्रिका' : 'Detailed Kundali', icon: Compass },
    { id: 'matchmaking', label: language === 'hi' ? 'गुण मिलान' : 'Matchmaking', icon: HeartHandshake },
    { id: 'gemstones', label: language === 'hi' ? 'रत्न व रुद्राक्ष' : 'Gems & Rudraksha', icon: Award },
    {
      id: 'chat',
      label: language === 'hi' ? 'AI ज्योतिषी से पूछें' : 'Ask AI Jyotish Guru',
      icon: MessageSquare,
      badge: 'AI Guru',
      badgeType: 'default' as const,
    },
    { id: 'panchang', label: language === 'hi' ? 'पंचांग व मुहूर्त' : 'Panchang & Muhurat', icon: Calendar },
    { id: 'prashna', label: language === 'hi' ? 'प्रश्न कुंडली / टैरो' : 'Prashna & Tarot', icon: HelpCircle },
    { id: 'remedies', label: language === 'hi' ? 'वैदिक उपाय व रत्न' : 'Remedies & Gems', icon: Award },
  ];

  const handleTabClick = (tabId: string, isPaid?: boolean) => {
    if (isPaid && !isModuleUnlocked(tabId, accessState)) {
      onOpenPaywall(tabId);
      setIsDrawerOpen(false);
      return;
    }
    setActiveTab(tabId);
    setIsDrawerOpen(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 shadow-lg">
      {/* 1. Main Top Bar - Dark Emerald Canvas Matching Screenshot */}
      <div className="bg-[#031c17] border-b border-emerald-900/60 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: ☰ 3 Lines Hamburger Menu Button + Logo Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* ☰ 3 Lines Hamburger Menu Button on Left Side */}
            <button
              id="header-menu-btn"
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl bg-[#082a23] hover:bg-[#0c362d] text-white border border-emerald-600/50 hover:border-emerald-400/80 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title={language === 'hi' ? 'वैदिक ज्योतिष मेनू खोलें (3 Lines)' : 'Open Vedic Menu'}
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            {/* Logo Brand */}
            <div
              id="brand-logo"
              onClick={() => setActiveTab('free-kundali')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none"
            >
              {/* Emerald Squircle with Gold Sparkle */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-[#022c22] p-0.5 shadow-md shadow-emerald-950/60 group-hover:scale-105 transition-transform duration-200 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#04241d] rounded-[13px] flex items-center justify-center">
                  <span className="text-xl text-amber-300 font-bold select-none filter drop-shadow">✦</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    AstroDost
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-teal-900/90 text-teal-300 border border-teal-500/50 shadow-xs uppercase tracking-wider">
                    AI
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-300/80 font-medium tracking-wide hidden xs:block">
                  {language === 'hi' ? 'वैदिक ज्योतिष एवं मार्गदर्शन' : 'Vedic Astrology & Guidance'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Controls: 🕉️ AI ज्योतिषी, 📜 History, 🌐 Language (Responsive & Overflow-Free) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* ✨ AI ज्योतिषी से पूछें (Ask AI Jyotish Guru) - Primary Highlight */}
            <button
              id="top-ai-jyotish-btn"
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`relative z-10 px-2.5 sm:px-3.5 py-1.5 rounded-full flex items-center gap-1 sm:gap-2 transition-all duration-200 active:scale-95 border border-[#d4af37]/80 cursor-pointer shadow-md shrink-0 ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black shadow-amber-400/40'
                  : 'bg-gradient-to-r from-[#8a532d] via-[#a36838] to-[#8a532d] text-[#ffdf00] hover:brightness-110'
              }`}
              title={language === 'hi' ? 'AI ज्योतिषी से पूछें' : 'Ask AI Jyotish Guru'}
            >
              <span className="text-xs sm:text-sm filter drop-shadow">🕉️</span>
              <span className="text-xs sm:text-sm font-black tracking-wide text-[#ffdf00] select-none whitespace-nowrap">
                {language === 'hi' ? (
                  <>
                    <span className="hidden xs:inline">AI ज्योतिषी</span>
                    <span className="xs:hidden">AI गुरु</span>
                  </>
                ) : (
                  <>
                    <span className="hidden xs:inline">Ask AI</span>
                    <span className="xs:hidden">AI Guru</span>
                  </>
                )}
              </span>
              <Sparkles className="w-3 h-3 text-[#ffdf00] animate-bounce shrink-0 hidden xs:inline" />
            </button>

            {/* Starter / Pro Plan Button (Hidden on tiny screens < 360px to prevent overflow) */}
            <button
              id="header-pro-plan-btn"
              type="button"
              onClick={() => onOpenPaywall('plan_kundli_explorer')}
              className="hidden xxs:flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/90 via-amber-900/60 to-amber-950/90 hover:from-amber-900/90 text-amber-300 border border-amber-500/70 shadow-xs transition-all cursor-pointer text-xs font-bold shrink-0"
              title={language === 'hi' ? `शुरुआती प्लान (₹${starterPrice})` : `Starter Plan (₹${starterPrice})`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-extrabold text-amber-200 text-xs">₹{starterPrice}</span>
            </button>

            {/* 📜 Kundali History Button */}
            <button
              id="header-history-btn"
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/50 shadow-xs transition-all cursor-pointer text-xs font-bold shrink-0"
              title={language === 'hi' ? '📜 सहेजी गई कुंडली हिस्ट्री' : '📜 Saved History'}
            >
              <HistoryIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden md:inline font-bold">
                {language === 'hi' ? 'हिस्ट्री' : 'History'}
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {savedProfilesCount}
              </span>
            </button>

            {/* 🔔 Daily Muhurat Alerts (Hidden on < sm) */}
            <div className="hidden sm:block">
              <MuhuratAlertsBell language={language} />
            </div>

            {/* 🔑 Admin Button (Hidden on < sm, accessible via Hamburger Drawer) */}
            <button
              id="header-admin-key-btn"
              type="button"
              onClick={() => {
                onOpenAdminPortal();
                try {
                  window.dispatchEvent(new CustomEvent('astrodost_open_admin_portal'));
                } catch {}
              }}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                accessState.isAdminUnlocked
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60'
                  : 'bg-amber-950/60 text-amber-300 border border-amber-500/60'
              }`}
              title={language === 'hi' ? '🔑 एडमिन पोर्टल' : '🔑 Admin Portal'}
            >
              <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold text-[11px] hidden md:inline">
                {accessState.isAdminUnlocked ? 'एडमिन 👑' : 'एडमिन'}
              </span>
            </button>

            {/* Language Selector Pill with Dropdown */}
            <div className="relative shrink-0">
              <button
                id="header-language-toggle-btn"
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-[#082a23] hover:bg-[#0c362d] text-white border border-emerald-600/40 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="tracking-wide text-xs">{language === 'hi' ? 'HI' : 'EN'}</span>
                <ChevronDown className="w-3 h-3 text-emerald-400" />
              </button>

              {/* Language Dropdown Menu */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#041f19] border border-emerald-500/40 rounded-xl shadow-2xl py-1 z-50 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('hi');
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-800/40 ${
                      language === 'hi' ? 'text-amber-300 font-bold bg-emerald-900/30' : 'text-white'
                    }`}
                  >
                    <span>🇮🇳 हिंदी</span>
                    {language === 'hi' && <span>✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-800/40 ${
                      language === 'en' ? 'text-amber-300 font-bold bg-emerald-900/30' : 'text-white'
                    }`}
                  >
                    <span>🇬🇧 English</span>
                    {language === 'en' && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Ticker Notice Bar - Soft Cream / Light Warm Canvas Matching Screenshot */}
      <div className="bg-[#fefce8] border-b border-amber-200/90 px-4 py-1.5 text-xs text-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto whitespace-nowrap">
          {/* Auspicious Yoga on Left */}
          <div className="flex items-center gap-2">
            <span className="text-amber-600 text-base leading-none">🔆</span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              {language === 'hi' ? 'आज का शुभ योग: सर्वार्थ सिद्धि योग' : "Today's Auspicious Yoga: Sarvartha Siddhi Yoga"}
            </span>
          </div>

          {/* Rahu Kaal on Right */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 text-rose-700 font-bold px-3 py-0.5 rounded-lg text-xs shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{language === 'hi' ? 'राहुकाल: 04:30 PM - 06:00 PM' : 'Rahu Kaal: 04:30 PM - 06:00 PM'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Desktop Horizontal Navigation Tabs */}
      <nav aria-label="Main Desktop Navigation" className="hidden lg:block bg-[#021814] border-b border-emerald-900/60 px-4 py-1.5 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isPartTab = tab.id === 'free-kundali' || tab.id === 'jagannatha';
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id, tab.isPaidModule)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${
                    isPartTab
                      ? `text-xs sm:text-sm md:text-base font-black border ${
                          isActive
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-1 ring-amber-300'
                            : 'bg-emerald-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                        }`
                      : isActive
                      ? 'bg-emerald-600 text-white shadow-sm text-xs font-bold'
                      : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/50 text-xs font-bold'
                  }`}
                >
                  <Icon className={`shrink-0 ${isPartTab ? 'w-4 h-4 text-amber-400' : isActive ? 'w-3.5 h-3.5 text-amber-300' : 'w-3.5 h-3.5 text-emerald-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[8px] px-1.5 py-0.2 rounded font-black uppercase ${
                        tab.badgeType === 'paid'
                          ? 'bg-amber-400 text-slate-950'
                          : tab.badgeType === 'unlocked'
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
              title={language === 'hi' ? 'सहेजी गई कुंडली हिस्ट्री' : 'Saved Kundali History'}
            >
              <HistoryIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'कुंडली हिस्ट्री' : 'History'} ({savedProfilesCount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenAdminPortal();
                try {
                  window.dispatchEvent(new CustomEvent('astrodost_open_admin_portal'));
                } catch {}
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors cursor-pointer shrink-0 hover:scale-105 active:scale-95"
              title="Admin Portal (Key)"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? '🔑 एडमिन' : '🔑 Admin'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Slide-Over Navigation Drawer (Mobile Menu) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-full max-w-xs sm:max-w-sm bg-[#041c17] text-white h-full shadow-2xl z-10 flex flex-col border-r border-emerald-500/30 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-emerald-900/80 flex items-center justify-between bg-[#031511]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-amber-300 font-bold">
                    ✦
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base">AstroDost AI</h3>
                    <p className="text-[10px] text-emerald-300">
                      {language === 'hi' ? 'संपूर्ण वैदिक ज्योतिष मेनू' : 'Complete Vedic Menu'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation List */}
              <div className="flex-1 p-4 space-y-1.5">
                {/* Featured: AI ज्योतिषी से पूछें Top Highlight in Drawer */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('chat');
                    setIsDrawerOpen(false);
                  }}
                  className="w-full relative group p-[2px] rounded-2xl overflow-hidden shadow-lg shadow-amber-950/50 animate-gold-aura-glow text-left cursor-pointer mb-2.5 block"
                >
                  <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#d4af37,#f59e0b,#fef08a,#ffffff,#d4af37,#b45309,#fbbf24)] animate-spin-slow opacity-95 pointer-events-none" />
                  <div className="relative z-10 bg-gradient-to-r from-[#9c6a46] via-[#b58055] to-[#9c6a46] p-3 rounded-[14px] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🕉️</span>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-[#ffdf00] flex items-center gap-1.5">
                          {language === 'hi' ? 'AI ज्योतिषी से पूछें' : 'Ask AI Jyotish Guru'}
                          <Sparkles className="w-3.5 h-3.5 text-[#ffdf00] animate-bounce" />
                        </div>
                        <div className="text-[10px] text-amber-200/90 font-medium">
                          {language === 'hi' ? '24x7 तत्काल सटीक वैदिक मार्गदर्शन' : '24x7 Instant Authentic Vedic Answers'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                      AI Guru
                    </span>
                  </div>
                </button>

                {/* Kundali History Drawer Item */}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenHistory) onOpenHistory();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer mb-3 shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <HistoryIcon className="w-4 h-4 text-amber-400" />
                    <span>{language === 'hi' ? '📜 कुंडली हिस्ट्री (सहेजे बायोडाटा)' : '📜 Kundali History (Saved IDs)'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                    {savedProfilesCount}
                  </span>
                </button>

                <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-black px-2 pb-1">
                  {language === 'hi' ? 'प्रमुख सेवाएं व गणनाएं' : 'Key Services'}
                </div>

                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isPartTab = tab.id === 'free-kundali' || tab.id === 'jagannatha';
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabClick(tab.id, tab.isPaidModule)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                        isPartTab
                          ? `text-sm sm:text-base font-black border-2 ${
                              isActive
                                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300'
                                : 'bg-emerald-950 text-amber-300 border-amber-500/50 hover:bg-amber-500/20'
                            }`
                          : isActive
                          ? 'bg-emerald-600 text-white shadow-md text-xs font-bold'
                          : 'text-emerald-100 hover:bg-emerald-900/60 text-xs font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`shrink-0 ${isPartTab ? 'w-5 h-5 text-amber-400' : 'w-4 h-4 text-amber-400'}`} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                            tab.badgeType === 'paid'
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-emerald-800 text-emerald-200'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="pt-4 border-t border-emerald-900/80 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAdminPortal();
                      try {
                        window.dispatchEvent(new CustomEvent('astrodost_open_admin_portal'));
                      } catch {}
                      setIsDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer active:scale-95 transition-all"
                  >
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>{language === 'hi' ? '🔑 एडमिन पोर्टल (Admin Key)' : '🔑 Admin Portal (Admin Key)'}</span>
                  </button>

                  <div className="pt-2">
                    <PWAInstallButton language={language} variant="header" />
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-emerald-900/80 bg-[#021410] text-center text-[10px] text-emerald-400">
                © {new Date().getFullYear()} AstroDost AI • Vedic Astrology
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};


