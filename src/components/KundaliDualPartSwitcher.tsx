import React from 'react';
import { Compass, Layers, Crown, Sparkles, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Language } from '../types/astrology';

interface KundaliDualPartSwitcherProps {
  activePart: 'part1' | 'part2';
  onSelectPart: (part: 'part1' | 'part2') => void;
  language: Language;
  isPart2Unlocked?: boolean;
  onOpenPaywall?: (moduleId: string) => void;
}

export const KundaliDualPartSwitcher: React.FC<KundaliDualPartSwitcherProps> = ({
  activePart,
  onSelectPart,
  language,
  isPart2Unlocked = false,
  onOpenPaywall,
}) => {
  const handlePart2Click = () => {
    if (!isPart2Unlocked && onOpenPaywall) {
      onOpenPaywall('jagannatha');
    }
    onSelectPart('part2');
  };

  return (
    <div className="w-full bg-slate-950/90 border-2 border-emerald-500/40 rounded-3xl p-3 sm:p-4 shadow-2xl mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-400 animate-bounce" />
          <span className="text-sm sm:text-base font-black text-amber-200 uppercase tracking-wider">
            {language === 'hi'
              ? 'वैदिक कुंडली दो प्रमुख भाग प्रणाली (2-Part System)'
              : 'Vedic Kundali 2-Part Navigation System'}
          </span>
        </div>
        <span className="text-xs sm:text-sm text-emerald-300 font-extrabold hidden sm:inline bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
          {language === 'hi'
            ? 'भाग १: साधारण कुंडली (मुफ़्त) • भाग २: जगन्नाथ होरा (विस्तार से वर्णन)'
            : 'Part 1: Basic Kundali (Free) • Part 2: Jagannath Hora (Detailed)'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* ======================================================== */}
        {/* PART 1: FREE JANAM KUNDALI                                */}
        {/* ======================================================== */}
        <button
          type="button"
          onClick={() => onSelectPart('part1')}
          className={`relative p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer border-2 ${
            activePart === 'part1'
              ? 'bg-gradient-to-r from-emerald-950 via-[#062c23] to-slate-950 border-emerald-400 shadow-xl shadow-emerald-950/80 ring-2 ring-emerald-400/40'
              : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  activePart === 'part1'
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                    : 'bg-slate-800 text-emerald-400'
                }`}
              >
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-xl md:text-2xl font-black text-white tracking-wide">
                    {language === 'hi' ? '🌟 भाग १: जन्म कुंडली' : '🌟 Part 1: Janam Kundali'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-300 font-bold mt-0.5">
                  {language === 'hi'
                    ? 'लग्न, चंद्र राशि, नवग्रह स्थिति व विंशोत्तरी महादशा'
                    : 'Lagna, Moon Sign, Planetary Houses & Dasha'}
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shrink-0">
              100% FREE
            </span>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">
              {language === 'hi'
                ? 'निःशुल्क वैदिक कुंडली बायोडाटा व सामान्य चक्र'
                : 'Free Vedic Horoscope Bio-Data & D1 Chart'}
            </span>
            {activePart === 'part1' && (
              <span className="text-emerald-400 font-black flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'वर्तमान में सक्रिय' : 'Active'}</span>
              </span>
            )}
          </div>
        </button>

        {/* ======================================================== */}
        {/* PART 2: JAGANNATHA HORA KUNDALI (PAID / DETAILED DOSSIER) */}
        {/* ======================================================== */}
        <button
          type="button"
          onClick={handlePart2Click}
          className={`relative p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer border-2 ${
            activePart === 'part2'
              ? 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/80 border-amber-400 shadow-xl shadow-amber-950/80 ring-2 ring-amber-400/50'
              : 'bg-slate-900/80 hover:bg-slate-900 border-amber-500/40 hover:border-amber-400/80'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md relative ${
                  activePart === 'part2'
                    ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                }`}
              >
                <Layers className="w-7 h-7" />
                <Crown className="w-5 h-5 text-amber-300 drop-shadow-md absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-xl md:text-2xl font-black text-amber-300 tracking-wide flex items-center gap-1.5">
                    <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 shrink-0 inline-block animate-pulse" />
                    <span>{language === 'hi' ? 'भाग २: जगन्नाथ होरा कुंडली' : 'Part 2: Jagannath Hora Kundali'}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-200/90 font-bold mt-0.5">
                  {language === 'hi'
                    ? '१०-पृष्ठ सम्पूर्ण सूक्ष्म विश्लेषण (विस्तार से वर्णन)'
                    : '10-Page Master In-Depth Dossier (Swiss Ephemeris)'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-1">
              {isPart2Unlocked ? (
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
                  UNLOCKED ✓
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 shadow-md flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>PAID</span>
                  <Crown className="w-4 h-4 text-slate-950 shrink-0" />
                </span>
              )}
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span className="text-amber-300/90 font-medium truncate">
              {language === 'hi'
                ? 'D1-D60 षोडशवर्ग, आत्मकारक (AK), आरूढ़ पद, षड्बल व स्विस एफिमेरिस'
                : 'D1-D60 Vargas, Atmakaraka (AK), Arudha Padas & Shadbala'}
            </span>
            <span className="text-amber-400 font-black flex items-center gap-1 shrink-0 ml-2">
              <span>{activePart === 'part2' ? (language === 'hi' ? 'खुला है' : 'Open') : (language === 'hi' ? 'देखें' : 'View')}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
