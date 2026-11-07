import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Language } from '../types/astrology';
import {
  calculateAnkJyotish,
  AnkJyotishFullReport,
  VEDIC_NUMBER_PROFILES,
  CHALDEAN_MAP,
  PYTHAGOREAN_MAP,
  VOWELS,
  reduceToSingleDigit,
} from '../utils/ankJyotishCalculations';
import {
  Hash,
  Sparkles,
  User,
  Calendar,
  Award,
  Compass,
  CheckCircle2,
  HeartHandshake,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Layers,
  BookOpen,
  Volume2,
  RefreshCw,
  Zap,
  Target,
  Grid,
  Info,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Flame,
  Feather,
  Sun,
  Moon,
  Home,
  Car,
  Clock,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AssetNumerologyTab } from './numerology/AssetNumerologyTab';
import { DriverConductor81Tab } from './numerology/DriverConductor81Tab';
import { DashaTimelineTab } from './numerology/DashaTimelineTab';
import { DualMatchmakingTab } from './numerology/DualMatchmakingTab';

const MONTHS_LIST = [
  { value: '01', nameHi: '01 - जनवरी (Jan)', nameEn: '01 - Jan' },
  { value: '02', nameHi: '02 - फ़रवरी (Feb)', nameEn: '02 - Feb' },
  { value: '03', nameHi: '03 - मार्च (Mar)', nameEn: '03 - Mar' },
  { value: '04', nameHi: '04 - अप्रैल (Apr)', nameEn: '04 - Apr' },
  { value: '05', nameHi: '05 - मई (May)', nameEn: '05 - May' },
  { value: '06', nameHi: '06 - जून (Jun)', nameEn: '06 - Jun' },
  { value: '07', nameHi: '07 - जुलाई (Jul)', nameEn: '07 - Jul' },
  { value: '08', nameHi: '08 - अगस्त (Aug)', nameEn: '08 - Aug' },
  { value: '09', nameHi: '09 - सितम्बर (Sep)', nameEn: '09 - Sep' },
  { value: '10', nameHi: '10 - अक्टूबर (Oct)', nameEn: '10 - Oct' },
  { value: '11', nameHi: '11 - नवम्बर (Nov)', nameEn: '11 - Nov' },
  { value: '12', nameHi: '12 - दिसम्बर (Dec)', nameEn: '12 - Dec' },
];

const DAYS_LIST = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const YEARS_LIST = Array.from({ length: 2026 - 1940 + 1 }, (_, i) => String(2026 - i));

interface NumerologyViewProps {
  language: Language;
}

export const NumerologyView: React.FC<NumerologyViewProps> = ({ language }) => {
  const [name, setName] = useState('Aarav Sharma');
  const [dob, setDob] = useState('1998-05-15');
  const [isCalculatedFeedback, setIsCalculatedFeedback] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [datePickerMode, setDatePickerMode] = useState<'dropdowns' | 'calendar'>('dropdowns');

  const [dobYear, dobMonth, dobDay] = useMemo(() => {
    const parts = (dob || '1998-05-15').split('-');
    return [parts[0] || '1998', parts[1] || '05', parts[2] || '15'];
  }, [dob]);

  const liveMulank = useMemo(() => {
    const dayNum = parseInt(dobDay, 10);
    return isNaN(dayNum) ? 6 : reduceToSingleDigit(dayNum);
  }, [dobDay]);

  const liveBhagyank = useMemo(() => {
    const dayNum = parseInt(dobDay, 10) || 15;
    const monthNum = parseInt(dobMonth, 10) || 5;
    const yearNum = parseInt(dobYear, 10) || 1998;
    return reduceToSingleDigit(dayNum + monthNum + yearNum);
  }, [dobDay, dobMonth, dobYear]);

  const handleDaySelect = (day: string) => {
    const newDob = `${dobYear}-${dobMonth}-${day}`;
    setDob(newDob);
  };

  const handleMonthSelect = (month: string) => {
    const newDob = `${dobYear}-${month}-${dobDay}`;
    setDob(newDob);
  };

  const handleYearSelect = (year: string) => {
    const newDob = `${year}-${dobMonth}-${dobDay}`;
    setDob(newDob);
  };

  const handleOpenNativeCalendar = () => {
    if (dateInputRef.current) {
      if (typeof (dateInputRef.current as any).showPicker === 'function') {
        try {
          (dateInputRef.current as any).showPicker();
          return;
        } catch {}
      }
      dateInputRef.current.focus();
      dateInputRef.current.click();
    }
  };
  const [activeSubTab, setActiveSubTab] = useState<
    | 'core'
    | 'combos81'
    | 'assets'
    | 'dasha'
    | 'dualMatch'
    | 'personalYear'
    | 'compatibility'
    | 'nameCorrection'
    | 'luckyAttributes'
    | 'remedies'
    | 'faq'
  >('core');

  // Interactive Partner Number Checker in Compatibility Tab
  const [selectedPartnerNumber, setSelectedPartnerNumber] = useState<number>(1);

  // Interactive Name Spelling Analyzer in Name Correction Tab
  const [testName, setTestName] = useState('Aarav Sharma');

  // Chant Counter State for Beej Mantra
  const [chantCount, setChantCount] = useState<number>(0);

  const [report, setReport] = useState<AnkJyotishFullReport>(() =>
    calculateAnkJyotish('Aarav Sharma', '1998-05-15')
  );

  const handleCalculate = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const effectiveName = name.trim() || 'Aarav Sharma';
    const effectiveDob = dob || '1998-05-15';
    setName(effectiveName);
    setDob(effectiveDob);
    const newReport = calculateAnkJyotish(effectiveName, effectiveDob);
    setReport(newReport);
    setTestName(effectiveName);
    setChantCount(0);
    setIsCalculatedFeedback(true);
    setTimeout(() => setIsCalculatedFeedback(false), 2500);

    setTimeout(() => {
      document.getElementById('ank-jyotish-results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  // Real-time calculation for Test Name Spelling
  const calculateTestNameDetails = (tName: string) => {
    const clean = tName.trim().toUpperCase();
    let cSum = 0;
    let pSum = 0;
    const letters: { char: string; cVal: number; pVal: number; isVowel: boolean }[] = [];

    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      if (/[A-Z]/.test(char)) {
        const cVal = CHALDEAN_MAP[char] || 0;
        const pVal = PYTHAGOREAN_MAP[char] || 0;
        const isVow = VOWELS.has(char);
        letters.push({ char, cVal, pVal, isVowel: isVow });
        cSum += cVal;
        pSum += pVal;
      }
    }
    const cRoot = reduceToSingleDigit(cSum || 1);
    const pRoot = reduceToSingleDigit(pSum || 1);
    return { cSum, cRoot, pSum, pRoot, letters };
  };

  const testNameData = calculateTestNameDetails(testName || name);

  // Sub-navigation tabs
  const subTabs = [
    { id: 'core', label: language === 'hi' ? 'मुख्य 5 अंक व फलादेश' : 'Core 5 Numbers & Profile', icon: Compass },
    { id: 'combos81', label: language === 'hi' ? '81 मूलांक-भाग्यांक कुंडली' : '81 Driver-Conductor Matrix', icon: Layers },
    { id: 'assets', label: language === 'hi' ? 'मकान, 4-वाहन, 2-वाहन व मोबाइल' : 'House, Vehicle & Asset Numbers', icon: Home },
    { id: 'dasha', label: language === 'hi' ? 'वैदिक अंक महादशा कालचक्र' : 'Ank Dasha & Lifelong Cycles', icon: Clock },
    { id: 'dualMatch', label: language === 'hi' ? '6-स्तरीय दांपत्य/पार्टनर मिलान' : '6-Layer Dual Matchmaking', icon: Users },
    { id: 'personalYear', label: language === 'hi' ? 'व्यक्तिगत वर्ष व भविष्यफल' : 'Personal Year & 9-Yr Cycle', icon: TrendingUp },
    { id: 'compatibility', label: language === 'hi' ? '1-9 अंक अनुकूलता मैट्रिक्स' : '1-9 Compatibility Matrix', icon: HeartHandshake },
    { id: 'nameCorrection', label: language === 'hi' ? 'नाम शुद्धि व विश्लेषक' : 'Name Spelling Optimizer', icon: Feather },
    { id: 'luckyAttributes', label: language === 'hi' ? 'शुभ तत्व व नवग्रह यंत्र' : 'Lucky Elements & Yantras', icon: Sparkles },
    { id: 'remedies', label: language === 'hi' ? 'वैदिक उपाय, मंत्र व 108 जप' : 'Vedic Remedies & Mantras', icon: Award },
    { id: 'faq', label: language === 'hi' ? 'अंक ज्योतिष ज्ञान कोष' : 'Numerology Guide & FAQ', icon: BookOpen },
  ];

  const currentPartnerCompat = report.compatibilityList.find((c) => c.targetNumber === selectedPartnerNumber) || report.compatibilityList[0];

  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const currentTabIndex = subTabs.findIndex((t) => t.id === activeSubTab);

  const scrollToTab = (index: number) => {
    if (tabsScrollRef.current) {
      const tabElements = tabsScrollRef.current.querySelectorAll('button[data-subtab]');
      if (tabElements[index]) {
        tabElements[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  const handlePrevTab = () => {
    const prevIndex = (currentTabIndex - 1 + subTabs.length) % subTabs.length;
    const prevTab = subTabs[prevIndex];
    setActiveSubTab(prevTab.id as any);
    scrollToTab(prevIndex);
  };

  const handleNextTab = () => {
    const nextIndex = (currentTabIndex + 1) % subTabs.length;
    const nextTab = subTabs[nextIndex];
    setActiveSubTab(nextTab.id as any);
    scrollToTab(nextIndex);
  };

  useEffect(() => {
    scrollToTab(currentTabIndex);
  }, [activeSubTab]);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Hash className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रामाणिक वैदिक एवं काल्डियन अंक ज्योतिष' : 'Authentic Vedic & Chaldean Numerology System'}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black border border-amber-300 shadow-md animate-paid-blink">
              PAID ⭐ PREMIUM
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {language === 'hi' ? 'अंक ज्योतिष (Vedic Numerology & Destiny Science)' : 'Vedic Numerology & Ank Jyotish Portal'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            {language === 'hi'
              ? 'जन्म तिथि और नामांक के आधार पर अपने मूलांक, भाग्यांक, नामांक, हृदयांक, व्यक्तिगत वर्ष, जीवन के 4 शिखर (Pinnacles), 1-9 अंक अनुकूलता, नाम शुद्धि एवं नवग्रह यंत्रों का संपूर्ण शास्त्रीय विश्लेषण।'
              : 'Discover your Root Driver (Mulank), Life Path Destiny (Bhagyank), Chaldean Name Vibration, Soul Urge, Personal Year cycles, 4 Life Pinnacles, Compatibility Matrix, Name Spelling Optimization, and planetary Yantras.'}
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name (Official / Spoken)'}</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                placeholder="e.g. Aarav Sharma"
              />
            </div>

            {/* Date of Birth Picker Mode Switcher */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'hi' ? 'जन्म तिथि चयन (Date of Birth):' : 'Date of Birth:'}</span>
                </label>
                <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setDatePickerMode('dropdowns')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      datePickerMode === 'dropdowns'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'hi' ? '🔢 दिन/माह/वर्ष' : '🔢 Day/Mo/Yr'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDatePickerMode('calendar');
                      setTimeout(handleOpenNativeCalendar, 100);
                    }}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      datePickerMode === 'calendar'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'hi' ? '📅 कैलेंडर' : '📅 Calendar'}
                  </button>
                </div>
              </div>

              {/* Mode 1: Fast Dropdowns for Day, Month, Year */}
              {datePickerMode === 'dropdowns' ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">{language === 'hi' ? 'दिन (Day)' : 'Day'}</span>
                    <select
                      value={dobDay}
                      onChange={(e) => handleDaySelect(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-bold cursor-pointer"
                    >
                      {DAYS_LIST.map((d) => (
                        <option key={d} value={d} className="bg-slate-900 text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">{language === 'hi' ? 'माह (Month)' : 'Month'}</span>
                    <select
                      value={dobMonth}
                      onChange={(e) => handleMonthSelect(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-bold cursor-pointer truncate"
                    >
                      {MONTHS_LIST.map((m) => (
                        <option key={m.value} value={m.value} className="bg-slate-900 text-white">
                          {language === 'hi' ? m.nameHi : m.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">{language === 'hi' ? 'वर्ष (Year)' : 'Year'}</span>
                    <select
                      value={dobYear}
                      onChange={(e) => handleYearSelect(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-bold cursor-pointer"
                    >
                      {YEARS_LIST.map((y) => (
                        <option key={y} value={y} className="bg-slate-900 text-white">
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                /* Mode 2: Native Date Input with explicit calendar button and click triggers */
                <div className="relative flex items-center">
                  <input
                    ref={dateInputRef}
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    onClick={handleOpenNativeCalendar}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-28 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleOpenNativeCalendar}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'कैलेंडर खोलें' : 'Open'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Year Shortcuts & Live Calculation Preview Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            {/* Quick Year Jump Chips */}
            <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
              <span className="text-slate-400 font-medium">{language === 'hi' ? 'त्वरित वर्ष:' : 'Quick Year:'}</span>
              {['1980', '1985', '1990', '1995', '1998', '2000', '2005'].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleYearSelect(yr)}
                  className={`px-2 py-0.5 rounded-md font-mono border transition-all cursor-pointer ${
                    dobYear === yr
                      ? 'bg-amber-500/30 text-amber-300 border-amber-400 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            {/* Live Mulank / Bhagyank Preview Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs">
              <span className="text-slate-300">
                {language === 'hi' ? 'चयनित:' : 'Selected:'} <strong className="text-white font-mono">{dobDay}/{dobMonth}/{dobYear}</strong>
              </span>
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-amber-300 font-bold">
                {language === 'hi' ? `मूलांक: ${liveMulank}` : `Mulank: ${liveMulank}`}
              </span>
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-emerald-300 font-bold">
                {language === 'hi' ? `भाग्यांक: ${liveBhagyank}` : `Bhagyank: ${liveBhagyank}`}
              </span>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            id="btn-calculate-ank-jyotish"
            type="submit"
            onClick={handleCalculate}
            className={`w-full font-bold py-3 px-4 rounded-xl text-sm shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              isCalculatedFeedback
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/40 ring-4 ring-emerald-400/50 scale-[1.01]'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 hover:scale-[1.01]'
            }`}
          >
            {isCalculatedFeedback ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white animate-pulse" />
                <span className="font-extrabold text-base">{language === 'hi' ? '✓ अंकफल व कुंडली गणना संपन्न!' : '✓ Calculated Successfully!'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span className="text-base font-extrabold">{language === 'hi' ? '✨ अंक ज्योतिष विश्लेषण करें (Calculate Now)' : '✨ Analyze Vedic Numerology (Calculate Now)'}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div id="ank-jyotish-results-section" className="space-y-6">
        {/* Core 5 Numbers Cards Trio & Archetypes Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* 1. Mulank */}
          <div className="bg-slate-900/90 rounded-2xl border border-amber-500/40 p-4 shadow-xl text-center relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Day {report.birthDay}
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-2xl font-black flex items-center justify-center mx-auto mb-2 shadow-lg shadow-amber-500/20">
                {report.mulank}
              </div>
              <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider block">
                {language === 'hi' ? 'मूलांक (Driver Number)' : 'Mulank (Driver / Psychic)'}
              </span>
              <p className="text-xs font-bold text-white mt-1">
                {language === 'hi' ? report.mulankProfile.planetHindi : report.mulankProfile.planet}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
              {language === 'hi' ? 'स्वभाव, आंतरिक शक्ति व नेतृत्व' : 'Inner temperament & core identity'}
            </p>
          </div>

          {/* 2. Bhagyank */}
          <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/40 p-4 shadow-xl text-center relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Sum {report.bhagyankCompound}
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-2xl font-black flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                {report.bhagyank}
              </div>
              <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider block">
                {language === 'hi' ? 'भाग्यांक (Destiny Number)' : 'Bhagyank (Destiny Path)'}
              </span>
              <p className="text-xs font-bold text-white mt-1">
                {language === 'hi' ? report.bhagyankProfile.planetHindi : report.bhagyankProfile.planet}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
              {language === 'hi' ? 'जीवन का उद्देश्य व 35 वर्ष बाद प्रभाव' : 'Karma, destiny & career pinnacle'}
            </p>
          </div>

          {/* 3. Namank Chaldean */}
          <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/40 p-4 shadow-xl text-center relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Sum {report.namankChaldeanCompound}
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-2xl font-black flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                {report.namankChaldean}
              </div>
              <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider block">
                {language === 'hi' ? 'नामांक (काल्डियन पद्धति)' : 'Namank (Chaldean)'}
              </span>
              <p className="text-xs font-bold text-white mt-1">
                {language === 'hi' ? report.namankProfile.planetHindi : report.namankProfile.planet}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
              {language === 'hi' ? 'सामाजिक प्रतिष्ठा व व्यापारिक आकर्षण' : 'Social aura & commercial vibration'}
            </p>
          </div>

          {/* 4. Soul Urge (Atmakarak) */}
          <div className="bg-slate-900/90 rounded-2xl border border-rose-500/40 p-4 shadow-xl text-center relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Vowels
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400 text-rose-300 text-2xl font-black flex items-center justify-center mx-auto mb-2 shadow-lg shadow-rose-500/20">
                {report.soulUrgeNumber}
              </div>
              <span className="text-[11px] uppercase font-bold text-rose-400 tracking-wider block">
                {language === 'hi' ? 'हृदयांक (Soul Urge)' : 'Soul Urge (Atmakarak)'}
              </span>
              <p className="text-xs font-bold text-white mt-1">
                {language === 'hi' ? 'आंतरिक अभिलाषा' : "Heart's Deep Desire"}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
              {language === 'hi' ? 'आत्मा की गुप्त इच्छा व प्रेरणा' : 'Secret spiritual longing & soul driver'}
            </p>
          </div>

          {/* 5. Personality Number */}
          <div className="bg-slate-900/90 rounded-2xl border border-cyan-500/40 p-4 shadow-xl text-center relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Consonants
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 text-2xl font-black flex items-center justify-center mx-auto mb-2 shadow-lg shadow-cyan-500/20">
                {report.personalityNumber}
              </div>
              <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider block">
                {language === 'hi' ? 'व्यक्तित्व अंक (Outer Aura)' : 'Personality Number'}
              </span>
              <p className="text-xs font-bold text-white mt-1">
                {language === 'hi' ? 'बाह्य प्रभाव व छवि' : 'Outer Perception'}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
              {language === 'hi' ? 'संसार आपको किस रूप में देखता है' : 'How the world perceives your aura'}
            </p>
          </div>
        </div>

        {/* Animated Reverse & Forward Sub-Heading Navigator Controller */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-3 sm:p-4 shadow-2xl relative overflow-hidden">
          {/* Subtle animated background glow accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-400/10 to-emerald-500/5 animate-pulse pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Reverse / Previous Sub-heading Button with Animated Pulsing Highlight */}
            <motion.button
              type="button"
              onClick={handlePrevTab}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-slate-900 border-2 border-amber-400/80 hover:border-amber-300 text-amber-300 hover:text-white shadow-lg shadow-amber-500/25 cursor-pointer group transition-all"
            >
              <motion.div
                animate={{ x: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0"
              >
                <ChevronLeft className="w-5 h-5 stroke-[3]" />
              </motion.div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 block leading-tight">
                  {language === 'hi' ? '◀ पिछला खंड (Reverse)' : '◀ Previous Sub-Heading'}
                </span>
                <span className="text-xs font-black text-slate-100 group-hover:text-amber-200 line-clamp-1">
                  {subTabs[(currentTabIndex - 1 + subTabs.length) % subTabs.length].label}
                </span>
              </div>
            </motion.button>

            {/* Current Active Sub-Heading Center Indicator (Off-White Highlighted) */}
            <div className="flex flex-col items-center text-center px-2 py-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-amber-500/40 text-[11px] font-bold text-amber-300 shadow-inner mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300">
                  {language === 'hi' ? 'सक्रिय उप-विषय' : 'Active Sub-Heading'}:
                </span>
                <span className="font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                  {currentTabIndex + 1} / {subTabs.length}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-[#f8fafc] tracking-wide flex items-center gap-2 drop-shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>{subTabs[currentTabIndex].label}</span>
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              </h3>
            </div>

            {/* Forward / Next Sub-heading Button with Animated Pulsing Highlight */}
            <motion.button
              type="button"
              onClick={handleNextTab}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-l from-amber-500/20 to-slate-900 border-2 border-amber-400/80 hover:border-amber-300 text-amber-300 hover:text-white shadow-lg shadow-amber-500/25 cursor-pointer group transition-all"
            >
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 block leading-tight">
                  {language === 'hi' ? 'अगला खंड (Forward) ▶' : 'Next Sub-Heading ▶'}
                </span>
                <span className="text-xs font-black text-slate-100 group-hover:text-amber-200 line-clamp-1">
                  {subTabs[(currentTabIndex + 1) % subTabs.length].label}
                </span>
              </div>
              <motion.div
                animate={{ x: [3, -3, 3] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0"
              >
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Sub Navigation Bar with Quick Scroll & High-Contrast Off-White Tabs */}
        <div className="relative">
          {/* Left quick scroll button */}
          <button
            type="button"
            onClick={handlePrevTab}
            className="hidden sm:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-300 items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title={language === 'hi' ? 'पिछला (Reverse)' : 'Previous'}
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Tab buttons */}
          <div
            ref={tabsScrollRef}
            className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 shadow-xl flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth"
          >
            {subTabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  data-subtab={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveSubTab(tab.id as any);
                    scrollToTab(idx);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#f8fafc] text-[#090d16] font-black shadow-xl shadow-amber-400/20 ring-2 ring-amber-400 scale-[1.02]'
                      : 'bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-slate-950 stroke-[2.5]' : 'text-amber-400'
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right quick scroll button */}
          <button
            type="button"
            onClick={handleNextTab}
            className="hidden sm:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-300 items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title={language === 'hi' ? 'अगला (Forward)' : 'Next'}
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Sub-Tab 1: Core 5 Numbers & Archetype Profile */}
        {activeSubTab === 'core' && (
          <div className="space-y-6">
            {/* Educational Info Card */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'अंक ज्योतिष का रहस्य एवं महत्व' : 'The Science of Vedic Numbers & Drivers'}
                </span>
              </div>
              <p className="leading-relaxed">
                {language === 'hi'
                  ? 'अंक ज्योतिष में 1 से 9 तक के अंक नवग्रहों (सूर्य, चन्द्र, गुरु, राहु, बुध, शुक्र, केतु, शनि एवं मंगल) की तरंगीय ऊर्जा का प्रतिनिधित्व करते हैं। आपका मूलांक (Driver) आपके स्वभाव का संचालन करता है, जबकि भाग्यांक (Conductor) आपके जीवन के अंतिम गंतव्य व कर्मक्षेत्र को आकार देता है।'
                  : 'In Vedic Numerology, numbers 1 through 9 correspond to cosmic planetary frequencies. Your Mulank (Psychic/Driver) determines internal temperament and instinctive reactions, while your Bhagyank (Destiny) activates life lessons and career pinnacles, especially after the age of 35.'}
              </p>
            </div>

            {/* In-Depth Profile Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mulank Deep Analysis */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    {language === 'hi' ? `मूलांक ${report.mulank} - स्वभाव व फलादेश` : `Mulank ${report.mulank} - Core Archetype`}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold">{report.mulankProfile.element}</span>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed">
                  {language === 'hi' ? report.mulankProfile.summaryHindi : report.mulankProfile.summary}
                </p>

                {/* Nature */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold block mb-1">
                    {language === 'hi' ? 'प्रकृति एवं स्वभाव शैली:' : 'Core Temperament & Nature:'}
                  </span>
                  <p className="text-slate-200">{language === 'hi' ? report.mulankProfile.natureHindi : report.mulankProfile.nature}</p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl text-xs space-y-2">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {language === 'hi' ? 'प्रमुख सामर्थ्य व गुण' : 'Key Core Strengths'}
                    </span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {(language === 'hi' ? report.mulankProfile.strengthsHindi : report.mulankProfile.strengths).map((s, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-black">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl text-xs space-y-2">
                    <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {language === 'hi' ? 'सावधानियां व कमजोरियां' : 'Cautions & Vulnerabilities'}
                    </span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {(language === 'hi' ? report.mulankProfile.weaknessesHindi : report.mulankProfile.weaknesses).map((w, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="text-rose-400 font-black">•</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Career Prospects */}
                <div className="pt-2">
                  <span className="text-xs uppercase font-bold text-slate-400 block mb-2">
                    {language === 'hi' ? 'सर्वोत्तम करियर व व्यवसाय क्षेत्र:' : 'Top Suitable Career & Industry Pathways:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(language === 'hi' ? report.mulankProfile.careerProspectsHindi : report.mulankProfile.careerProspects).map((c, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-medium"
                      >
                        💼 {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bhagyank & Compound Numbers */}
              <div className="space-y-6">
                {/* Bhagyank Destiny Card */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      {language === 'hi' ? `भाग्यांक ${report.bhagyank} - कर्म व जीवन लक्ष्य` : `Bhagyank ${report.bhagyank} - Destiny Karma`}
                    </span>
                    <span className="text-xs text-indigo-400 font-semibold">{report.bhagyankProfile.planet}</span>
                  </div>

                  <p className="text-slate-200 text-sm leading-relaxed">
                    {language === 'hi' ? report.bhagyankProfile.summaryHindi : report.bhagyankProfile.summary}
                  </p>

                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl text-xs space-y-1.5">
                    <span className="text-emerald-300 font-bold block">
                      {language === 'hi' ? '🌟 35 वर्ष के बाद की दिशा:' : '🌟 Life Pinnacle After Age 35:'}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {language === 'hi'
                        ? `भाग्यांक ${report.bhagyank} का प्रभाव 35 वर्ष की आयु के बाद प्रबल हो जाता है। यह आपको ${report.bhagyankProfile.natureHindi} की ओर अग्रसर करता है।`
                        : `Your Bhagyank ${report.bhagyank} takes dominant command of career achievements and societal impact in the second half of life.`}
                    </p>
                  </div>
                </div>

                {/* Compound Birth Number Meaning */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
                  <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {language === 'hi' ? `संयुक्त जन्म अंक ${report.mulankCompound} का प्रभाव` : `Compound Birth Day ${report.mulankCompound} Vibration`}
                  </span>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-300">
                        {language === 'hi' ? report.mulankCompoundMeaning.titleHindi : report.mulankCompoundMeaning.title}
                      </span>
                      {report.mulankCompoundMeaning.isKarmicOrMaster && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                          {language === 'hi' ? 'विशेष कार्मिक / मास्टर अंक' : 'Karmic / Master Vibration'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {language === 'hi' ? report.mulankCompoundMeaning.vibrationHindi : report.mulankCompoundMeaning.vibration}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab: 81 Driver-Conductor Combinations Matrix */}
        {activeSubTab === 'combos81' && (
          <DriverConductor81Tab
            language={language}
            userMulank={report.mulank}
            userBhagyank={report.bhagyank}
          />
        )}

        {/* Sub-Tab: House, Vehicle (4-Wheeler & 2-Wheeler), Mobile & Business Numerology */}
        {activeSubTab === 'assets' && (
          <AssetNumerologyTab
            language={language}
            userMulank={report.mulank}
            userBhagyank={report.bhagyank}
          />
        )}

        {/* Sub-Tab: Vedic Ank Dasha & Lifelong Planetary Progression Timeline */}
        {activeSubTab === 'dasha' && (
          <DashaTimelineTab
            language={language}
            dob={dob}
            userMulank={report.mulank}
            userBhagyank={report.bhagyank}
          />
        )}

        {/* Sub-Tab: 6-Layer Dual Person Matchmaking Engine */}
        {activeSubTab === 'dualMatch' && (
          <DualMatchmakingTab
            language={language}
            primaryName={name}
            primaryDob={dob}
          />
        )}

        {/* Sub-Tab 2: Personal Year & 9-Year Cycle Forecast */}
        {activeSubTab === 'personalYear' && (
          <div className="space-y-6">
            {/* Educational Info Card */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'व्यक्तिगत वर्ष (Personal Year) का सिद्धांत' : 'Understanding the 9-Year Evolutionary Cycle'}
                </span>
              </div>
              <p className="leading-relaxed">
                {language === 'hi'
                  ? 'अंक ज्योतिष में मानव जीवन 9-वर्षीय तरंग चक्रों में विभाजित होता है। प्रत्येक वर्ष (Personal Year 1 से 9) का एक विशिष्ट ब्रह्मांडीय उद्देश्य होता है—वर्ष 1 नई शुरुआत का बीजारोपण करता है, वर्ष 5 बड़ा बदलाव लाता है, वर्ष 8 आर्थिक फसल (Harvest) प्रदान करता है, और वर्ष 9 पूर्णता व पुरानी बाधाओं से मुक्ति दिलाता है।'
                  : 'Every person experiences an unbroken 9-year cycle of growth and evolution. Personal Year 1 marks planting new seeds, Year 5 triggers major pivots and travel, Year 8 brings financial peak authority and harvest, and Year 9 clears outdated karma for the next cycle.'}
              </p>
            </div>

            {/* Current & Next Personal Year Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Personal Year */}
              <div className="bg-slate-900/90 rounded-2xl border border-amber-500/40 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {language === 'hi'
                      ? `वर्तमान व्यक्तिगत वर्ष ${report.personalYearCurrent.year} (अंक ${report.personalYearCurrent.personalYearNumber})`
                      : `Current Personal Year ${report.personalYearCurrent.year} (Number ${report.personalYearCurrent.personalYearNumber})`}
                  </span>
                  <span className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 font-black text-lg flex items-center justify-center border border-amber-400">
                    {report.personalYearCurrent.personalYearNumber}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xs text-amber-400 font-bold block mb-1">
                    {language === 'hi' ? 'वर्ष का केंद्रीय विषय (Theme):' : 'Core Theme for the Year:'}
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {language === 'hi' ? report.personalYearCurrent.themeHindi : report.personalYearCurrent.theme}
                  </p>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed">
                  {language === 'hi' ? report.personalYearCurrent.overviewHindi : report.personalYearCurrent.overview}
                </p>

                {/* Career & Finance */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl text-xs space-y-1">
                  <span className="text-emerald-300 font-bold block">
                    {language === 'hi' ? '💼 करियर व आर्थिक मार्गदर्शन:' : '💼 Career & Financial Strategy:'}
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {language === 'hi' ? report.personalYearCurrent.careerFinanceHindi : report.personalYearCurrent.careerFinance}
                  </p>
                </div>

                {/* Dos and Donts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl text-xs space-y-1.5">
                    <span className="text-emerald-400 font-bold uppercase text-[10px] block">
                      {language === 'hi' ? '✓ क्या करें (DOs):' : '✓ What To Do (DOs):'}
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {(language === 'hi' ? report.personalYearCurrent.dosHindi : report.personalYearCurrent.dos).map((d, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-emerald-400">•</span> <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl text-xs space-y-1.5">
                    <span className="text-rose-400 font-bold uppercase text-[10px] block">
                      {language === 'hi' ? '✗ क्या न करें (DONTs):' : '✗ What To Avoid (DONTs):'}
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {(language === 'hi' ? report.personalYearCurrent.dontsHindi : report.personalYearCurrent.donts).map((d, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-rose-400">•</span> <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Next Personal Year Preview & Monthly Cycle */}
              <div className="space-y-6">
                {/* Next Year Preview */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {language === 'hi'
                        ? `आगामी वर्ष ${report.personalYearNext.year} (अंक ${report.personalYearNext.personalYearNumber})`
                        : `Next Personal Year ${report.personalYearNext.year} (Number ${report.personalYearNext.personalYearNumber})`}
                    </span>
                    <span className="w-9 h-9 rounded-full bg-slate-800 text-slate-200 font-black text-lg flex items-center justify-center border border-slate-700">
                      {report.personalYearNext.personalYearNumber}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold block mb-1">
                      {language === 'hi' ? 'आने वाले वर्ष का मुख्य विषय:' : 'Upcoming Year Core Theme:'}
                    </span>
                    <p className="text-sm font-semibold text-amber-300">
                      {language === 'hi' ? report.personalYearNext.themeHindi : report.personalYearNext.theme}
                    </p>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    {language === 'hi' ? report.personalYearNext.overviewHindi : report.personalYearNext.overview}
                  </p>
                </div>

                {/* Personal Month & Day Energy */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
                  <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {language === 'hi' ? 'दैनिक एवं मासिक ऊर्जा चक्र' : 'Personal Month & Day Vibration'}
                  </span>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        {language === 'hi' ? 'वर्तमान पर्सनल मंथ' : 'Current Personal Month'}
                      </span>
                      <span className="text-2xl font-black text-amber-400 block">{report.personalMonthNumber}</span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {language === 'hi' ? 'इस माह का मुख्य फोकस' : 'Monthly Focus Energy'}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        {language === 'hi' ? 'आज का पर्सनल डे' : 'Today Personal Day'}
                      </span>
                      <span className="text-2xl font-black text-emerald-400 block">{report.personalDayNumber}</span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {language === 'hi' ? 'आज का दैनिक कंपन' : 'Daily Vibration'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Pinnacles & 4 Challenges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* 4 Pinnacles */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'जीवन के 4 मुख्य शिखर (4 Life Pinnacles)' : 'The 4 Major Life Pinnacles'}
                </span>
                <p className="text-xs text-slate-400">
                  {language === 'hi'
                    ? 'जीवन के चार प्रमुख कालखंड और उनके प्रेरक अंक:'
                    : 'The four developmental epochs that guide your major achievements:'}
                </p>

                <div className="space-y-2.5">
                  {report.pinnacles.map((pin) => (
                    <div key={pin.pinnacle} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-300">
                            {language === 'hi' ? `शिखर ${pin.pinnacle}:` : `Pinnacle ${pin.pinnacle}:`}
                          </span>
                          <span className="text-[11px] text-slate-400">{language === 'hi' ? pin.ageRangeHindi : pin.ageRange}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{language === 'hi' ? pin.themeHindi : pin.theme}</p>
                      </div>
                      <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 font-black text-base flex items-center justify-center border border-amber-500/30">
                        {pin.number}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Challenges */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'जीवन की 4 प्रमुख चुनौतियां (4 Challenges)' : 'The 4 Karmic Life Challenges'}
                </span>
                <p className="text-xs text-slate-400">
                  {language === 'hi'
                    ? 'आत्म-विकास के लिए पार की जाने वाली प्रमुख परीक्षाएं:'
                    : 'The core karmic lessons you are meant to master for evolution:'}
                </p>

                <div className="space-y-2.5">
                  {report.challenges.map((ch) => (
                    <div key={ch.challenge} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5 pr-2">
                        <span className="text-xs font-bold text-rose-300 block">
                          {language === 'hi' ? `चुनौती ${ch.challenge} (अंक ${ch.number}):` : `Challenge ${ch.challenge} (Num ${ch.number}):`}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{language === 'hi' ? ch.lessonHindi : ch.lesson}</p>
                      </div>
                      <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 font-black text-base flex items-center justify-center border border-rose-500/30 shrink-0">
                        {ch.number}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab 3: Number Compatibility Matrix */}
        {activeSubTab === 'compatibility' && (
          <div className="space-y-6">
            {/* Educational Info Card */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'अंक अनुकूलता व मित्रता का वैदिक नियम' : 'Vedic Planetary Resonance & Compatibility'}
                </span>
              </div>
              <p className="leading-relaxed">
                {language === 'hi'
                  ? 'वैदिक अंक ज्योतिष में ग्रह-मैत्री के सिद्धांतों के आधार पर मित्र (Friendly), सम (Neutral) और शत्रु (Challenging) अंकों का निर्धारण होता है। जैसे सूर्य (1) और मंगल (9) परम मित्र हैं, जबकि सूर्य (1) और शनि (8) का संबंध कर्मप्रधान व सतर्कता योग्य माना जाता है।'
                  : 'Number compatibility is derived from planetary friendship (Mitra), neutrality (Sama), and enmity (Shatru). Harmonious pairings amplify natural fortunes and mutual understanding in love, marriage, business partnerships, and friendships.'}
              </p>
            </div>

            {/* Interactive Partner Number Checker */}
            <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  {language === 'hi'
                    ? `आपके मूलांक ${report.mulank} के साथ साथी अंक का मिलान`
                    : `Interactive Partner Match with Your Mulank ${report.mulank}`}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {language === 'hi' ? 'साथी का मूलांक चुनें (1 से 9):' : 'Select Partner Number (1-9):'}
                </span>
              </div>

              {/* Number Selector Pills */}
              <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                  const isSelected = selectedPartnerNumber === num;
                  const item = report.compatibilityList.find((c) => c.targetNumber === num);
                  const isFriendly = item?.relationType === 'Friendly';
                  const isChallenging = item?.relationType === 'Challenging';

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedPartnerNumber(num)}
                      className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/50 scale-105 shadow-lg'
                          : isFriendly
                          ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                          : isChallenging
                          ? 'bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/50'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-base">{num}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Match Outcome Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-slate-400 block">
                      {language === 'hi' ? 'संबंध का प्रकार:' : 'Relationship Classification:'}
                    </span>
                    <span
                      className={`text-base font-extrabold ${
                        currentPartnerCompat.relationType === 'Friendly'
                          ? 'text-emerald-400'
                          : currentPartnerCompat.relationType === 'Challenging'
                          ? 'text-rose-400'
                          : 'text-amber-300'
                      }`}
                    >
                      {language === 'hi' ? currentPartnerCompat.relationTypeHindi : currentPartnerCompat.relationType}
                    </span>
                  </div>

                  {/* 3 Dimension Scores */}
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="text-center">
                      <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'प्रेम / विवाह' : 'Love'}</span>
                      <span className="text-amber-400 text-sm">{currentPartnerCompat.loveScore}%</span>
                    </div>
                    <div className="text-center">
                      <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'व्यापार' : 'Business'}</span>
                      <span className="text-indigo-400 text-sm">{currentPartnerCompat.businessScore}%</span>
                    </div>
                    <div className="text-center">
                      <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'मित्रता' : 'Friends'}</span>
                      <span className="text-emerald-400 text-sm">{currentPartnerCompat.friendshipScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Practical Advice */}
                <p className="text-slate-200 text-xs leading-relaxed">
                  <span className="text-amber-400 font-bold">{language === 'hi' ? 'सलाह व फलादेश: ' : 'Vedic Guidance: '}</span>
                  {language === 'hi' ? currentPartnerCompat.adviceHindi : currentPartnerCompat.advice}
                </p>
              </div>
            </div>

            {/* Complete 1-9 Compatibility Table */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
              <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5" />
                {language === 'hi' ? `मूलांक ${report.mulank} की 1 से 9 अंकों के साथ संपूर्ण अनुकूलता सारणी` : `Full 1-9 Compatibility Spectrum for Number ${report.mulank}`}
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">{language === 'hi' ? 'अंक' : 'Target'}</th>
                      <th className="p-3">{language === 'hi' ? 'ग्रह' : 'Planet'}</th>
                      <th className="p-3">{language === 'hi' ? 'संबंध' : 'Relation'}</th>
                      <th className="p-3 text-center">{language === 'hi' ? 'प्रेम' : 'Love'}</th>
                      <th className="p-3 text-center">{language === 'hi' ? 'व्यापार' : 'Business'}</th>
                      <th className="p-3">{language === 'hi' ? 'संक्षिप्त फलादेश' : 'Advice'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {report.compatibilityList.map((c) => {
                      const pProfile = VEDIC_NUMBER_PROFILES[c.targetNumber];
                      return (
                        <tr key={c.targetNumber} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-black text-amber-300 text-sm">
                            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                              {c.targetNumber}
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-white">
                            {language === 'hi' ? pProfile.planetHindi : pProfile.planet}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.relationType === 'Friendly'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : c.relationType === 'Challenging'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {language === 'hi' ? c.relationTypeHindi : c.relationType}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-200">{c.loveScore}%</td>
                          <td className="p-3 text-center font-bold text-slate-200">{c.businessScore}%</td>
                          <td className="p-3 text-[11px] text-slate-300 max-w-xs leading-relaxed">
                            {language === 'hi' ? c.adviceHindi : c.advice}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab 4: Interactive Name Spelling Optimizer */}
        {activeSubTab === 'nameCorrection' && (
          <div className="space-y-6">
            {/* Educational Info Card */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'काल्डियन नाम शुद्धि (Name Correction) का वैज्ञानिक रहस्य' : 'The Science of Chaldean Name Correction'}
                </span>
              </div>
              <p className="leading-relaxed">
                {language === 'hi'
                  ? 'काल्डियन अंक पद्धति में प्रत्येक अक्षर (A, B, C...) की एक विशिष्ट ध्वनि तरंग (Vibration) होती है। यदि आपके नाम का कुल योग (Compound Name Number) आपके मूलांक व भाग्यांक से मेल खाता है, तो यह चुंबक की तरह सफलता को आकर्षित करता है। स्पेलिंग में एक या दो अक्षर बदलकर नाम को 1, 5 अथवा 6 के शुभ योग पर लाया जा सकता है।'
                  : 'In Chaldean Numerology, sound frequencies of spoken and written letters combine to create an electromagnetic resonance. Aligning your Name Number (Namank) to resonate with your Mulank and Bhagyank removes friction and acts as a cosmic catalyst for fame, wealth, and effortless recognition.'}
              </p>
            </div>

            {/* Live Name Spelling Tester */}
            <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-6 shadow-xl space-y-5">
              <div>
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'रियल-टाइम नाम स्पेलिंग विश्लेषक' : 'Real-Time Name Spelling Optimizer'}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'hi'
                    ? 'नीचे स्पेलिंग में बदलाव करके देखें कि उसका काल्डियन व पाइथागोरियन मान कैसे बदलता है:'
                    : 'Modify the spelling below to test new variations against your birth chart:'}
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-4 py-3 text-base text-amber-300 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30 tracking-wide"
                  placeholder="Type name spelling to test (e.g. Aarrav Sharma)"
                />
              </div>

              {/* Letter-by-Letter Matrix */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">
                  {language === 'hi' ? 'अक्षर-दर-अक्षर काल्डियन मान विश्लेषण:' : 'Letter-by-Letter Chaldean Value Breakdown:'}
                </span>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {testNameData.letters.map((item, idx) => (
                    <div
                      key={idx}
                      className={`px-2.5 py-1.5 rounded-lg border text-center min-w-[36px] ${
                        item.isVowel
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                          : 'bg-slate-900 border-slate-700 text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-black block">{item.char}</span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold block">{item.cVal}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>
                    {language === 'hi' ? 'गुलाबी रंग = स्वर (Vowels)' : 'Rose = Vowels (Soul Urge)'} |{' '}
                    {language === 'hi' ? 'स्लेटी रंग = व्यंजन (Consonants)' : 'Grey = Consonants'}
                  </span>
                  <span className="font-mono text-amber-300 font-bold">
                    {language === 'hi' ? `कुल काल्डियन योग: ${testNameData.cSum} ➔ ${testNameData.cRoot}` : `Total Chaldean Sum: ${testNameData.cSum} ➔ ${testNameData.cRoot}`}
                  </span>
                </div>
              </div>

              {/* Harmony Evaluation Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold">{language === 'hi' ? 'काल्डियन पद्धति (Chaldean):' : 'Chaldean Root Vibration:'}</span>
                    <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center text-xs border border-emerald-500/40">
                      {testNameData.cRoot}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {language === 'hi' ? `संयुक्त मान ${testNameData.cSum} से मूल अंक ${testNameData.cRoot} बनता है।` : `Compound ${testNameData.cSum} reduces to primary vibration ${testNameData.cRoot}.`}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold">{language === 'hi' ? 'पाइथागोरियन पद्धति (Pythagorean):' : 'Pythagorean Vibration:'}</span>
                    <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center text-xs border border-emerald-500/40">
                      {testNameData.pRoot}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {language === 'hi' ? `पश्चिमी पाइथागोरियन योग ${testNameData.pSum} ➔ ${testNameData.pRoot} बनता है।` : `Western system sum ${testNameData.pSum} reduces to root ${testNameData.pRoot}.`}
                  </p>
                </div>
              </div>

              {/* Personalized Name Advice */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'hi' ? 'नाम अनुकूलता मूल्यांकन' : 'Name Harmony Assessment'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/40">
                    {report.nameHarmonyScore}% {language === 'hi' ? report.nameHarmonyStatusHindi : report.nameHarmonyStatus}
                  </span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {language === 'hi' ? report.nameCorrectionAdviceHindi : report.nameCorrectionAdvice}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab 5: Lucky Matrix & Planetary Yantras */}
        {activeSubTab === 'luckyAttributes' && (
          <div className="space-y-6">
            {/* Educational Info Card */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'नवग्रह यंत्र एवं शुभ तत्वों का महत्व' : 'Planetary Magic Square Yantras & Lucky Attributes'}
                </span>
              </div>
              <p className="leading-relaxed">
                {language === 'hi'
                  ? 'वैदिक परंपरा में नवग्रह यंत्र 3x3 का एक पवित्र जादुई वर्ग (Magic Square) होते हैं, जिसकी प्रत्येक पंक्ति व स्तंभ का योग ग्रह की विशिष्ट संख्या बनाता है। अपने मूलांक के शुभ दिन, रंग, रत्न एवं दिशा का उपयोग करने से नकारात्मक ऊर्जा नष्ट होती है और भाग्य प्रबल होता है।'
                  : 'Vedic planetary yantras are sacred geometric 3x3 magic squares where every row, column, and diagonal sums to the divine numerical constant of that planet. Aligning with your lucky gemstones, colors, directions, and days aligns your bio-energy with cosmic harmony.'}
              </p>
            </div>

            {/* Lucky Attributes Full Table */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
              <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'hi' ? `मूलांक ${report.mulank} के संपूर्ण शुभ तत्व` : `Auspicious Vedic Attributes for Number ${report.mulank}`}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {/* Lucky Dates */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'hi' ? '📅 शुभ तिथियां (Lucky Dates):' : '📅 Auspicious Dates:'}
                  </span>
                  <p className="text-sm font-black text-amber-300">
                    {report.mulankProfile.luckyDates.join(', ')}
                  </p>
                </div>

                {/* Lucky Days */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'hi' ? '☀️ शुभ वार (Lucky Days):' : '☀️ Auspicious Days:'}
                  </span>
                  <p className="text-sm font-black text-white">
                    {(language === 'hi' ? report.mulankProfile.luckyDaysHindi : report.mulankProfile.luckyDays).join(', ')}
                  </p>
                </div>

                {/* Auspicious Direction */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'hi' ? '🧭 शुभ दिशा (Auspicious Direction):' : '🧭 Lucky Direction:'}
                  </span>
                  <p className="text-sm font-black text-emerald-400">
                    {language === 'hi' ? report.mulankProfile.auspiciousDirectionHindi : report.mulankProfile.auspiciousDirection}
                  </p>
                </div>

                {/* Lucky Colors */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'hi' ? '🎨 शुभ रंग (Lucky Colors):' : '🎨 Lucky Colors:'}
                  </span>
                  <p className="text-sm font-semibold text-amber-300">
                    {(language === 'hi' ? report.mulankProfile.luckyColorsHindi : report.mulankProfile.luckyColors).join(', ')}
                  </p>
                </div>

                {/* Avoid Colors */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-400 block">
                    {language === 'hi' ? '🚫 वर्जित रंग (Avoid Colors):' : '🚫 Avoid Colors:'}
                  </span>
                  <p className="text-sm font-semibold text-rose-300">
                    {(language === 'hi' ? report.mulankProfile.avoidColorsHindi : report.mulankProfile.avoidColors).join(', ')}
                  </p>
                </div>

                {/* Lucky Gemstone */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'hi' ? '💎 भाग्य रत्न (Lucky Gemstones):' : '💎 Primary Gemstones:'}
                  </span>
                  <p className="text-sm font-black text-amber-400">
                    {(language === 'hi' ? report.mulankProfile.luckyGemsHindi : report.mulankProfile.luckyGems).join(', ')}
                  </p>
                </div>

                {/* Lucky Rudraksha */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'hi' ? '📿 शुभ रुद्राक्ष (Rudraksha):' : '📿 Sacred Rudraksha:'}
                  </span>
                  <p className="text-sm font-semibold text-amber-300">
                    {language === 'hi' ? report.mulankProfile.luckyRudrakshaHindi : report.mulankProfile.luckyRudraksha}
                  </p>
                </div>

                {/* Lucky Metal */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'hi' ? '🪙 शुभ धातु (Lucky Metal):' : '🪙 Lucky Metal:'}
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {language === 'hi' ? report.mulankProfile.luckyMetalHindi : report.mulankProfile.luckyMetal}
                  </p>
                </div>

                {/* Ruling Deity */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'hi' ? '🕉️ इष्ट देव / देवी (Ruling Deity):' : '🕉️ Ruling Deity:'}
                  </span>
                  <p className="text-sm font-semibold text-amber-300">
                    {language === 'hi' ? report.mulankProfile.deityHindi : report.mulankProfile.deity}
                  </p>
                </div>
              </div>
            </div>

            {/* Planetary 3x3 Magic Square Yantra */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Grid className="w-3.5 h-3.5" />
                  {language === 'hi'
                    ? `${report.mulankProfile.planetHindi} का पवित्र वैदिक 3x3 यंत्र`
                    : `Sacred 3x3 Magic Square Yantra for ${report.mulankProfile.planet}`}
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {language === 'hi' ? 'प्रत्येक पंक्ति का योग समरूप' : 'Constant Magic Sum in all Directions'}
                </span>
              </div>

              {/* Yantra Visual */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-4 rounded-2xl border-2 border-amber-500/40 aspect-square max-w-[280px] mx-auto shadow-2xl">
                {report.mulankProfile.yantraGrid.map((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className="rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col items-center justify-center p-2 text-center shadow-inner hover:bg-amber-500/20 transition-all"
                    >
                      <span className="text-2xl font-black text-amber-300 font-mono">{val}</span>
                    </div>
                  ))
                )}
              </div>
              <p className="text-center text-[11px] text-slate-400 max-w-md mx-auto">
                {language === 'hi'
                  ? 'इस पवित्र यंत्र को भोजपत्र या तांबे के पत्र पर अंकित कर पूजा स्थल में स्थापित करना अत्यंत शुभकारी होता है।'
                  : 'Establish this numerical yantra etched on copper or inscribed on Bhojpatra in your sanctum sanctorum.'}
              </p>
            </div>
          </div>
        )}

        {/* Sub-Tab 6: Vedic Remedies & Mantras */}
        {activeSubTab === 'remedies' && (
          <div className="space-y-6">
            {/* Educational Info Card */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'वैदिक मंत्र एवं कर्म-सुधार के उपाय' : 'Vedic Beej Mantras, Charity & Lifestyle Remedies'}
                </span>
              </div>
              <p className="leading-relaxed">
                {language === 'hi'
                  ? 'वैदिक अंक ज्योतिष में उपाय केवल अनुष्ठान नहीं हैं, बल्कि यह ग्रह से संबंधित ध्वनियों (Beej Mantra), सेवा व दान (Charity), व्रत एवं आचरण शुद्धि का समन्वय हैं। प्रतिदिन मंत्र जाप करने से मन शांत होता है और सकारात्मक ऊर्जा का संचार होता है।'
                  : 'Vedic numerological remedies combine sound therapy (Beej Mantras), altruistic charity (Daan), fasting protocols, and behavioral adjustments to harmonize challenging planetary frequencies.'}
              </p>
            </div>

            {/* Beej Mantra Chanting Tool */}
            <div className="bg-slate-900/90 rounded-2xl border border-amber-500/40 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'दैनिक वैदिक बीज मंत्र (108 बार जाप)' : 'Daily Vedic Beej Mantra Practice (108 Chants)'}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {chantCount} / 108
                </span>
              </div>

              {/* Mantra Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 text-center space-y-2">
                <span className="text-xl sm:text-2xl font-black text-amber-300 tracking-wide font-serif">
                  {report.mulankProfile.beejMantra}
                </span>
                <p className="text-xs text-slate-400 font-mono">
                  ({report.mulankProfile.beejMantraMeaning})
                </p>
                <p className="text-[11px] text-slate-300 max-w-xl mx-auto pt-1">
                  {language === 'hi' ? report.mulankProfile.beejMantraMeaningHindi : 'Chant with focused devotional presence during morning hours.'}
                </p>
              </div>

              {/* Gayatri Mantra */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-1">
                <span className="text-xs uppercase font-bold text-slate-400 block">
                  {language === 'hi' ? 'वैदिक गायत्री मंत्र:' : 'Vedic Gayatri Mantra:'}
                </span>
                <p className="text-sm font-bold text-white font-serif">{report.mulankProfile.gayatriMantra}</p>
              </div>

              {/* Interactive Counter Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setChantCount((prev) => Math.min(108, prev + 1))}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'hi' ? '+1 जाप करें' : '+1 Chant Count'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChantCount(0)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
                </button>
              </div>
            </div>

            {/* Daan & Fasting Guidelines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Daan (Charity Items) */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'शुभ दान सामग्री (Recommended Daan):' : 'Charity & Donation Items:'}
                </span>
                <p className="text-xs text-slate-400">
                  {language === 'hi' ? 'इन वस्तुओं का दान करने से ग्रह के अशुभ प्रभाव दूर होते हैं:' : 'Distribute these items to the needy on your lucky day:'}
                </p>

                <div className="space-y-1.5 pt-1">
                  {(language === 'hi' ? report.mulankProfile.daanItemsHindi : report.mulankProfile.daanItems).map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasting Protocol */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'व्रत एवं संकल्प नियम (Fasting Protocol):' : 'Fasting & Vrat Guidelines:'}
                </span>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs text-amber-400 font-bold block">
                    {language === 'hi' ? 'शुभ व्रत दिवस:' : 'Designated Fasting Day:'}
                  </span>
                  <p className="text-sm font-extrabold text-white">
                    {language === 'hi' ? report.mulankProfile.fastingDayHindi : report.mulankProfile.fastingDay}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {language === 'hi'
                      ? 'व्रत के दिन तामसिक भोजन (प्याज, लहसुन, मांसाहार) व क्रोध का पूर्ण त्याग करें। फलाहार ग्रहण करें और संध्या के समय इष्ट देव की आरती करें।'
                      : 'Maintain sattvic nutrition, avoid anger, practice truthfulness, and conclude fasting after evening prayer.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab 7: Numerology Guide & FAQ */}
        {activeSubTab === 'faq' && (
          <div className="space-y-6">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'अंक ज्योतिष ज्ञान कोष एवं अक्सर पूछे जाने वाले प्रश्न' : 'Vedic Numerology Knowledge Base & FAQ'}
                </span>
              </div>
              <p className="leading-relaxed">
                {language === 'hi'
                  ? 'अंक ज्योतिष केवल भाग्य जानने का साधन नहीं है, बल्कि यह आत्म-सुधार और जीवन में सही समय पर सही निर्णय लेने का एक सटीक विज्ञान है।'
                  : 'Numerology is an empowering metaphysical science designed to illuminate soul tendencies, time cycles, and harmonious lifestyle alignments.'}
              </p>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {[
                {
                  qHi: '1. मूलांक और भाग्यांक में क्या अंतर है?',
                  qEn: '1. What is the difference between Mulank (Psychic) and Bhagyank (Destiny)?',
                  aHi: 'मूलांक आपकी केवल जन्म तारीख (जैसे 15 तारीख = 1+5 = 6) से निकलता है और यह आपके आंतरिक स्वभाव व आदतों को दर्शाता है। जबकि भाग्यांक पूरी जन्म तिथि (तारीख + माह + वर्ष) का योग होता है और यह आपके जीवन के अंतिम गंतव्य व 35 वर्ष के बाद के करियर को नियंत्रित करता है।',
                  aEn: 'Mulank comes solely from your birth day (e.g. 15th = 6) representing inner temperament and personality. Bhagyank is the total sum of Day + Month + Year representing destiny karma and career pinnacle after age 35.',
                },
                {
                  qHi: '2. काल्डियन (Chaldean) और पाइथागोरियन (Pythagorean) पद्धति में क्या फर्क है?',
                  qEn: '2. What is the difference between Chaldean and Pythagorean systems?',
                  aHi: 'काल्डियन पद्धति अति-प्राचीन है और यह अक्षरों के ध्वनि-कंपन (Sound Frequencies) पर आधारित है। इसमें अंक 9 को पवित्र मानकर अक्षरों में शामिल नहीं किया जाता। पाइथागोरियन पद्धति 1 से 9 तक क्रमानुसार वर्णमाला पर आधारित है। भारत और कीरो अंक ज्योतिष में काल्डियन पद्धति को सबसे सटीक माना जाता है।',
                  aEn: 'Chaldean numerology is based on occult sound vibration where number 9 is considered sacred and not assigned to individual letters. Pythagorean assigns letters sequentially 1 through 9. Chaldean is revered as the most accurate for name analysis.',
                },
                {
                  qHi: '3. क्या नाम की स्पेलिंग बदलने से भाग्य बदलता है?',
                  qEn: '3. Does changing name spelling really alter destiny?',
                  aHi: 'हाँ, नाम की स्पेलिंग बदलने से आपके नाम की ध्वनि तरंग (Sound Vibration) बदल जाती है। जब आपका नामांक आपके मूलांक और भाग्यांक के मित्र अंक (जैसे 1, 5, 6) पर आ जाता है, तो यह जीवन में आने वाली अनावश्यक बाधाओं को कम कर देता है और नए अवसर आकर्षित करता है।',
                  aEn: 'Yes, spelling adjustments alter the vibrational frequency of how your name is spoken and written. Aligning your Namank with friendly root numbers removes friction and magnetizes opportunities.',
                },
                {
                  qHi: '4. अंक ज्योतिष और लो शू ग्रिड में क्या अंतर है?',
                  qEn: '4. How is Ank Jyotish distinct from Lo Shu Grid?',
                  aHi: 'अंक ज्योतिष (Vedic Numerology) ग्रहों के आधिपत्य, मूलांक, भाग्यांक, नामांक, व्यक्तिगत वर्ष और दशाओं पर आधारित है। जबकि लो शू ग्रिड (Lo Shu Grid) 3x3 की चीनी वास्तु व फेंगशुई ग्रिड है जो जन्म तिथि के अंकों से 5 तत्वों (जल, अग्नि, काष्ठ, पृथ्वी, धातु) और 8 योगों (राज योग, विचार तल, इच्छा तल आदि) का विश्लेषण करती है। दोनों प्रणालियाँ एक-दूसरे की पूरक हैं और इस पोर्टल पर दोनों का अलग-अलग संपूर्ण विश्लेषण उपलब्ध है।',
                  aEn: 'Ank Jyotish focuses on Vedic planetary rulerships, Mulank/Bhagyank karma, name vibrations, and Personal Year cycles. Lo Shu Grid is a 3x3 elemental grid assessing Chinese Feng Shui planes (Mind, Soul, Body) and Raj Yogas. Both are distinct, complementary, and independently available on this portal.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{language === 'hi' ? faq.qHi : faq.qEn}</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {language === 'hi' ? faq.aHi : faq.aEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
