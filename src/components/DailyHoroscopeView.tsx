import React, { useState } from 'react';
import { DailyHoroscope, Language, ZodiacSign } from '../types/astrology';
import { getDailyHoroscope, ZODIAC_SIGNS } from '../utils/vedicCalculations';
import { VoiceConsultationPlayer } from './VoiceConsultationPlayer';
import {
  Sparkles,
  Heart,
  Briefcase,
  DollarSign,
  Activity,
  Star,
  Volume2,
  ArrowRight,
  Shield,
  Clock,
  Compass,
} from 'lucide-react';

interface DailyHoroscopeViewProps {
  language: Language;
}

interface ZodiacMeta {
  sign: ZodiacSign;
  signHi: string;
  glyph: string;
  dateRange: string;
  bgGrad: string;
  accentColor: string;
}

const ZODIAC_METAS: ZodiacMeta[] = [
  { sign: 'Aries', signHi: 'मेष', glyph: '♈', dateRange: '21 Mar – 19 Apr', bgGrad: 'bg-red-600', accentColor: 'border-red-500' },
  { sign: 'Taurus', signHi: 'वृषभ', glyph: '♉', dateRange: '20 Apr – 20 May', bgGrad: 'bg-emerald-600', accentColor: 'border-emerald-500' },
  { sign: 'Gemini', signHi: 'मिथुन', glyph: '♊', dateRange: '21 May – 20 Jun', bgGrad: 'bg-amber-600', accentColor: 'border-amber-500' },
  { sign: 'Cancer', signHi: 'कर्क', glyph: '♋', dateRange: '21 Jun – 22 Jul', bgGrad: 'bg-cyan-600', accentColor: 'border-cyan-500' },
  { sign: 'Leo', signHi: 'सिंह', glyph: '♌', dateRange: '23 Jul – 22 Aug', bgGrad: 'bg-yellow-600', accentColor: 'border-yellow-500' },
  { sign: 'Virgo', signHi: 'कन्या', glyph: '♍', dateRange: '23 Aug – 22 Sep', bgGrad: 'bg-lime-600', accentColor: 'border-lime-500' },
  { sign: 'Libra', signHi: 'तुला', glyph: '♎', dateRange: '23 Sep – 22 Oct', bgGrad: 'bg-pink-600', accentColor: 'border-pink-500' },
  { sign: 'Scorpio', signHi: 'वृश्चिक', glyph: '♏', dateRange: '23 Oct – 21 Nov', bgGrad: 'bg-purple-600', accentColor: 'border-purple-500' },
  { sign: 'Sagittarius', signHi: 'धनु', glyph: '♐', dateRange: '22 Nov – 21 Dec', bgGrad: 'bg-blue-600', accentColor: 'border-blue-500' },
  { sign: 'Capricorn', signHi: 'मकर', glyph: '♑', dateRange: '22 Dec – 19 Jan', bgGrad: 'bg-orange-600', accentColor: 'border-orange-500' },
  { sign: 'Aquarius', signHi: 'कुंभ', glyph: '♒', dateRange: '20 Jan – 18 Feb', bgGrad: 'bg-teal-600', accentColor: 'border-teal-500' },
  { sign: 'Pisces', signHi: 'मीन', glyph: '♓', dateRange: '19 Feb – 20 Mar', bgGrad: 'bg-violet-600', accentColor: 'border-violet-500' },
];

export const DailyHoroscopeView: React.FC<DailyHoroscopeViewProps> = ({ language }) => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('Aries');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const horoscope: DailyHoroscope = getDailyHoroscope(selectedSign);

  const playMantraAudio = (mantraText: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(mantraText);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectZodiac = (sign: ZodiacSign) => {
    setSelectedSign(sign);
    const el = document.getElementById('selected-horoscope-reading');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Banner Matching Screenshot */}
      <div className="bg-gradient-to-r from-[#032018] via-[#052b21] to-[#031c16] border border-amber-500/30 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl text-left space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <span className="text-amber-400">☀️</span>
              <span>{language === 'hi' ? 'दैनिक ग्रह गोचर एवं राशि भविष्यफल' : 'Daily Planetary Transits & Vedic Forecast'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'hi' ? 'आज का संपूर्ण राशिफल (12 राशियां)' : 'Complete Daily Horoscope (12 Signs)'}
            </h1>

            <p className="text-emerald-200/90 text-xs sm:text-sm leading-relaxed">
              {language === 'hi'
                ? 'अपनी राशि का चयन करें और प्रेम, करियर, स्वास्थ्य, धन, शुभ रंग एवं आज के प्रभावशाली मंत्र की जानकारी प्राप्त करें।'
                : 'Select your Zodiac sign to uncover planetary influences across career, love, wealth, health, and auspicious daily timings.'}
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-amber-300 font-serif italic">
              <span>“ग्रह संकेत देते हैं, निर्णय आपको लेना हैं”</span>
              <span className="not-italic text-emerald-400 font-sans text-[11px] font-bold">— AstroDost AI</span>
            </div>
          </div>

          {/* Right Celestial Om Mandala Vector */}
          <div className="shrink-0 w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center opacity-90">
            <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <circle cx="100" cy="100" r="92" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="100" cy="100" r="76" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
              {/* Rays */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="100"
                  y1="10"
                  x2="100"
                  y2="30"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  transform={`rotate(${deg} 100 100)`}
                  opacity="0.5"
                />
              ))}
              <circle cx="100" cy="100" r="32" fill="#031f18" stroke="#f59e0b" strokeWidth="2" />
              <text
                x="100"
                y="108"
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="24"
                fontWeight="bold"
                fontFamily="serif"
                className="select-none"
              >
                ॐ
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* 2. 12 Zodiac Cards in 4x3 Grid Matching Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ZODIAC_METAS.map((item) => {
          const isSelected = selectedSign === item.sign;
          return (
            <div
              key={item.sign}
              id={`zodiac-card-${item.sign.toLowerCase()}`}
              onClick={() => handleSelectZodiac(item.sign)}
              className={`rounded-2xl p-3 sm:p-3.5 border transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-sm ${
                isSelected
                  ? 'bg-[#0e352b] border-amber-400 ring-2 ring-amber-400/40 shadow-md text-white scale-[1.01]'
                  : 'bg-[#08261f] hover:bg-[#0c3127] border-emerald-800/60 hover:border-amber-400/50 text-white'
              }`}
            >
              {/* Left Circle Icon */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${item.bgGrad} flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0`}
                >
                  {item.glyph}
                </div>

                {/* Name & Dates */}
                <div className="text-left leading-tight">
                  <div className="text-[11px] sm:text-xs text-emerald-300 font-medium">
                    {item.sign}
                  </div>
                  <div className="text-sm sm:text-base font-black text-white">
                    {item.signHi}
                  </div>
                  <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5 whitespace-nowrap">
                    {item.dateRange}
                  </div>
                </div>
              </div>

              {/* Right Circle Arrow Button */}
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400 text-slate-950'
                    : 'border-amber-500/50 text-amber-300 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. 5 Category Cards Row Matching Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {[
          { id: 'love', icon: '❤️', label: 'प्रेम जीवन', sub: 'आज कैसा रहेगा?', color: 'text-rose-500' },
          { id: 'career', icon: '💼', label: 'करियर', sub: 'नई संभावनाएं', color: 'text-amber-500' },
          { id: 'health', icon: '🌿', label: 'स्वास्थ्य', sub: 'ऊर्जा और पसर्श', color: 'text-emerald-500' },
          { id: 'wealth', icon: '💰', label: 'धन व समृद्धि', sub: 'आर्थिक स्थिति', color: 'text-amber-500' },
          { id: 'lucky', icon: '⭐', label: 'शुभ रंग व अंक', sub: 'आज का लकी नंबर', color: 'text-amber-400' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className={`p-3 rounded-2xl border transition-all text-left flex items-center gap-2.5 cursor-pointer shadow-xs ${
              activeCategory === cat.id
                ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 ring-2 ring-emerald-300/40'
                : 'bg-white hover:bg-emerald-50/50 border-emerald-200/80 text-slate-800'
            }`}
          >
            <span className="text-xl shrink-0">{cat.icon}</span>
            <div className="leading-tight">
              <div className="font-bold text-xs sm:text-sm text-slate-900">{cat.label}</div>
              <div className="text-[10px] text-slate-500 font-medium">{cat.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* 4. Meditating Yogi Sunset Quote Banner Matching Screenshot */}
      <div className="bg-gradient-to-r from-[#8be3bf]/40 via-[#d1fae5] to-[#fef08a]/30 border border-emerald-300/60 rounded-2xl p-4 sm:p-5 flex items-center justify-between relative overflow-hidden shadow-xs">
        <div className="flex items-center gap-3 text-slate-900 font-serif">
          <span className="text-3xl text-emerald-700 font-bold select-none">“</span>
          <div>
            <p className="text-sm sm:text-base font-bold tracking-wide">
              {language === 'hi' ? '“तारे वही हैं, बस नजरिया बदलो”' : '“The stars are the same, only your perspective changes”'}
            </p>
            <p className="text-xs text-emerald-800 font-sans font-semibold mt-0.5">— AstroDost AI</p>
          </div>
        </div>

        {/* Meditating silhouette SVG */}
        <div className="shrink-0 w-24 h-16 sm:w-32 sm:h-18 flex items-center justify-end opacity-85">
          <svg viewBox="0 0 160 80" className="w-full h-full">
            {/* Sunrise backdrop */}
            <circle cx="80" cy="50" r="30" fill="#fef08a" opacity="0.6" />
            <path d="M 0 70 Q 40 40 80 55 T 160 70 L 160 80 L 0 80 Z" fill="#042a20" opacity="0.75" />
            {/* Meditating silhouette */}
            <g transform="translate(68, 25)" fill="#031c15">
              <circle cx="12" cy="7" r="4.5" />
              <path d="M 8 13 C 8 13, 16 13, 16 13 C 18 16, 20 22, 23 25 C 21 26, 3 26, 1 25 C 4 22, 6 16, 8 13 Z" />
            </g>
          </svg>
        </div>
      </div>

      {/* 🔊 Audio Player for Horoscope */}
      <VoiceConsultationPlayer
        textToSpeak={language === 'hi' ? horoscope.summaryHindi : horoscope.summary}
        language={language}
        title={language === 'hi' ? `🕉️ ${horoscope.signHindi} दैनिक राशिफल वाणी` : `🕉️ ${horoscope.sign} Daily Audio Guidance`}
      />

      {/* 5. In-Depth Reading for Selected Zodiac Sign */}
      <div
        id="selected-horoscope-reading"
        className="bg-[#041f19] rounded-2xl border border-emerald-800/80 p-5 sm:p-7 shadow-xl text-white space-y-6"
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl text-slate-950 font-bold shadow-lg">
              {ZODIAC_METAS.find((m) => m.sign === horoscope.sign)?.glyph || '♈'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {horoscope.sign} <span className="text-amber-300 font-bold">({horoscope.signHindi})</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900 text-emerald-200 border border-emerald-600/50">
                  {horoscope.element} Element
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                {language === 'hi' ? 'राशि स्वामी:' : 'Ruling Planet:'}{' '}
                <span className="text-amber-300 font-semibold">{horoscope.rulingPlanet}</span> • {horoscope.date}
              </p>
            </div>
          </div>

          {/* Cosmic Power Rating */}
          <div className="bg-[#02130f] px-3.5 py-2 rounded-xl border border-emerald-800 flex items-center gap-2 self-start sm:self-auto">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div>
              <span className="text-[10px] text-emerald-300 uppercase font-semibold">
                {language === 'hi' ? 'दैनिक ऊर्जा' : 'Cosmic Power'}
              </span>
              <p className="text-xs sm:text-sm font-bold text-amber-300">
                {horoscope.ratings.overall} / 5 Stars
              </p>
            </div>
          </div>
        </div>

        {/* Prediction Summary */}
        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400 mb-2">
            {language === 'hi' ? 'आज का भविष्यफल एवं मार्गदर्शन' : 'Today’s Planetary Forecast'}
          </h4>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed bg-[#021410] p-4 rounded-xl border border-emerald-900/60">
            {language === 'hi' ? horoscope.summaryHindi : horoscope.summary}
          </p>
        </div>

        {/* 4 Spheres Ratings (Love, Career, Wealth, Health) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-[#021410] p-3.5 rounded-xl border border-emerald-900/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <Heart className="w-3.5 h-3.5 fill-rose-400/30" />
                {language === 'hi' ? 'प्रेम' : 'Love'}
              </span>
              <span className="font-mono text-emerald-200">{horoscope.ratings.love}/5</span>
            </div>
            <div className="w-full bg-emerald-950 rounded-full h-1.5">
              <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: `${(horoscope.ratings.love / 5) * 100}%` }} />
            </div>
          </div>

          <div className="bg-[#021410] p-3.5 rounded-xl border border-emerald-900/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                <Briefcase className="w-3.5 h-3.5" />
                {language === 'hi' ? 'करियर' : 'Career'}
              </span>
              <span className="font-mono text-emerald-200">{horoscope.ratings.career}/5</span>
            </div>
            <div className="w-full bg-emerald-950 rounded-full h-1.5">
              <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${(horoscope.ratings.career / 5) * 100}%` }} />
            </div>
          </div>

          <div className="bg-[#021410] p-3.5 rounded-xl border border-emerald-900/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                {language === 'hi' ? 'धन' : 'Wealth'}
              </span>
              <span className="font-mono text-emerald-200">{horoscope.ratings.wealth}/5</span>
            </div>
            <div className="w-full bg-emerald-950 rounded-full h-1.5">
              <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${(horoscope.ratings.wealth / 5) * 100}%` }} />
            </div>
          </div>

          <div className="bg-[#021410] p-3.5 rounded-xl border border-emerald-900/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Activity className="w-3.5 h-3.5" />
                {language === 'hi' ? 'स्वास्थ्य' : 'Health'}
              </span>
              <span className="font-mono text-emerald-200">{horoscope.ratings.health}/5</span>
            </div>
            <div className="w-full bg-emerald-950 rounded-full h-1.5">
              <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${(horoscope.ratings.health / 5) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Lucky Matrix (Lucky Number, Color, Time, Direction) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-[#021410] p-3 rounded-xl border border-emerald-900/60 text-left">
            <span className="text-[11px] text-emerald-300/80 font-medium">
              {language === 'hi' ? 'भाग्यशाली अंक' : 'Lucky Number'}
            </span>
            <p className="text-lg font-black text-amber-300 mt-0.5">{horoscope.luckyNumber}</p>
          </div>

          <div className="bg-[#021410] p-3 rounded-xl border border-emerald-900/60 text-left">
            <span className="text-[11px] text-emerald-300/80 font-medium">
              {language === 'hi' ? 'शुभ रंग' : 'Lucky Color'}
            </span>
            <p className="text-sm font-bold text-amber-300 mt-0.5">
              {language === 'hi' ? horoscope.luckyColorHindi : horoscope.luckyColor}
            </p>
          </div>

          <div className="bg-[#021410] p-3 rounded-xl border border-emerald-900/60 text-left">
            <span className="text-[11px] text-emerald-300/80 font-medium">
              {language === 'hi' ? 'शुभ समय' : 'Auspicious Time'}
            </span>
            <p className="text-xs font-mono font-bold text-amber-300 mt-1">{horoscope.luckyTime}</p>
          </div>

          <div className="bg-[#021410] p-3 rounded-xl border border-emerald-900/60 text-left">
            <span className="text-[11px] text-emerald-300/80 font-medium">
              {language === 'hi' ? 'अनुकूल दिशा' : 'Lucky Direction'}
            </span>
            <p className="text-sm font-bold text-amber-300 mt-0.5">{horoscope.auspiciousDirection}</p>
          </div>
        </div>

        {/* Vedic Mantra Recitation Player */}
        <div className="bg-gradient-to-r from-amber-500/15 via-[#021813] to-amber-500/15 p-4 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 text-lg">
              🕉️
            </div>
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                {language === 'hi' ? 'दैनिक कल्याणकारी मंत्र' : 'Today’s Auspicious Mantra'}
              </span>
              <p className="text-sm font-bold text-white font-serif">
                {language === 'hi' ? horoscope.mantraHindi : horoscope.mantra}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => playMantraAudio(horoscope.mantra)}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>{language === 'hi' ? 'मंत्र सुनें' : 'Listen Mantra'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

