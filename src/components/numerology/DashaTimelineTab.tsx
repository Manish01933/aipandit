import React, { useState } from 'react';
import { Language } from '../../types/astrology';
import {
  calculateAnkDashaTimeline,
  AnkDashaCycle,
} from '../../utils/ankAssetCalculations';
import {
  TrendingUp,
  Clock,
  Sparkles,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Info,
  CheckCircle2,
  Zap,
  Award,
} from 'lucide-react';

interface DashaTimelineTabProps {
  language: Language;
  dob: string;
  userMulank: number;
  userBhagyank: number;
}

export const DashaTimelineTab: React.FC<DashaTimelineTabProps> = ({
  language,
  dob,
  userMulank,
  userBhagyank,
}) => {
  const dashaData = calculateAnkDashaTimeline(dob, userMulank, userBhagyank);
  const [selectedDasha, setSelectedDasha] = useState<AnkDashaCycle>(
    dashaData.currentDasha
  );

  return (
    <div className="space-y-6">
      {/* Educational Header Badge */}
      <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {language === 'hi'
              ? 'वैदिक अंक महादशा एवं अंतर्दशा जीवन कालचक्र (Ank Dasha System)'
              : 'Vedic Numerology Dasha & Planetary Progression Timeline'}
          </span>
        </div>
        <p className="leading-relaxed">
          {language === 'hi'
            ? 'जिस प्रकार वैदिक ज्योतिष में विंशोत्तरी महादशा जीवन के विभिन्न कालखंडों को नियंत्रित करती है, उसी प्रकार अंक ज्योतिष में जन्म से लेकर 90+ वर्षों तक 9 ग्रहों की अंक महादशाएं सक्रिय रहती हैं। आपकी वर्तमान महादशा और अंतर्दशा यह तय करती है कि इस समय आपको नौकरी में पदोन्नति, नया व्यवसाय, विवाह या निवेश में किस दिशा में आगे बढ़ना चाहिए।'
            : 'Just like Vimshottari Dasha in Vedic Astrology, Ank Jyotish governs your lifespan through sequential planetary dasha cycles calibrated to your Mulank driver. Your active dasha & antardasha pinpoint peak periods for career promotions, wealth accumulation, marriages, property purchases, and necessary precautions.'}
        </p>
      </div>

      {/* Current Active Dasha Spotlight Card */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold animate-pulse">
              ● {language === 'hi' ? 'वर्तमान में सक्रिय महादशा' : 'Currently Active Dasha'}
            </span>
            <span className="text-xs text-slate-400">
              {dashaData.currentDasha.startYear} - {dashaData.currentDasha.endYear} (Age {dashaData.currentDasha.startAge} to {dashaData.currentDasha.endAge})
            </span>
          </div>

          <span className="text-xs font-bold text-amber-400">
            {language === 'hi' ? 'अंक महादशा संख्या: ' : 'Active Dasha Number: '}
            <strong className="text-white text-base">{dashaData.currentDasha.dashaNumber}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold block">
              {language === 'hi' ? 'सक्रिय ग्रह स्वामी व विषय:' : 'Active Planetary Ruler & Focus:'}
            </span>
            <p className="text-base font-extrabold text-white">
              {language === 'hi' ? dashaData.currentDasha.planetHi : dashaData.currentDasha.planetEn}
            </p>
            <p className="text-xs text-amber-300 pt-0.5">
              {language === 'hi' ? dashaData.currentDasha.themeHi : dashaData.currentDasha.themeEn}
            </p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-indigo-400 font-bold block">
              {language === 'hi' ? '🌟 वर्तमान अंतर्दशा (Sub-Period):' : '🌟 Active Antardasha:'}
            </span>
            <p className="text-xs font-semibold text-slate-200">
              {language === 'hi'
                ? `अंक ${dashaData.currentAntardasha.number} (${dashaData.currentAntardasha.planetHi})`
                : `Number ${dashaData.currentAntardasha.number} (${dashaData.currentAntardasha.planetEn})`}
            </p>
            <p className="text-[11px] text-slate-300">
              {language === 'hi' ? dashaData.currentAntardasha.focusHi : dashaData.currentAntardasha.focusEn}
            </p>
          </div>
        </div>
      </div>

      {/* Lifelong Dasha Timeline Slider / Grid */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {language === 'hi' ? 'संपूर्ण जीवन महादशा क्रम (Age 0 to 90+)' : 'Lifelong Dasha Sequence Progression'}
          </span>
          <span className="text-xs text-slate-400">
            {language === 'hi' ? 'विवरण देखने के लिए किसी भी दशा पर क्लिक करें' : 'Click any dasha cycle to view details'}
          </span>
        </div>

        {/* Horizontal Dasha Nodes */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {dashaData.dashas.map((d) => {
            const isSelected = selectedDasha.dashaNumber === d.dashaNumber;
            const isCurrent = d.isCurrent;

            return (
              <button
                key={d.dashaNumber}
                type="button"
                onClick={() => setSelectedDasha(d)}
                className={`p-2.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-between border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/40 border-amber-400 scale-102 font-bold shadow-lg'
                    : isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] opacity-80 block">
                  {d.startYear} - {d.endYear}
                </span>
                <span className="text-lg font-black my-1">{d.dashaNumber}</span>
                <span className="text-[10px] uppercase truncate w-full font-semibold">
                  {language === 'hi' ? d.planetHi.split(' ')[0] : d.planetEn.split(' ')[0]}
                </span>
                <span className="text-[9px] opacity-70 block mt-0.5">Age {d.startAge}-{d.endAge}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Dasha In-Depth Details */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-bold">
                {language === 'hi'
                  ? `महादशा अंक ${selectedDasha.dashaNumber} (${selectedDasha.planetHi})`
                  : `Dasha Number ${selectedDasha.dashaNumber} (${selectedDasha.planetEn})`}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {language === 'hi' ? selectedDasha.themeHi : selectedDasha.themeEn}
              </h3>
            </div>

            <span className="text-xs text-slate-400">
              {language === 'hi'
                ? `वर्ष: ${selectedDasha.startYear} से ${selectedDasha.endYear} (आयु: ${selectedDasha.startAge} से ${selectedDasha.endAge} वर्ष)`
                : `Years: ${selectedDasha.startYear} - ${selectedDasha.endYear} (Age: ${selectedDasha.startAge} - ${selectedDasha.endAge})`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl text-xs space-y-1.5">
              <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {language === 'hi' ? 'इस महादशा के प्रमुख अवसर व लाभ:' : 'Key Opportunities & Breakthroughs:'}
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {(language === 'hi' ? selectedDasha.opportunitiesHi : selectedDasha.opportunitiesEn).map((o, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-400">•</span> {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl text-xs space-y-1.5">
              <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {language === 'hi' ? 'आवश्यक सावधानियां व ध्यान देने योग्य बातें:' : 'Key Precautions & Focus Areas:'}
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {(language === 'hi' ? selectedDasha.precautionsHi : selectedDasha.precautionsEn).map((p, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-rose-400">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
