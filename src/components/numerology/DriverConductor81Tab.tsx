import React, { useState } from 'react';
import { Language } from '../../types/astrology';
import {
  getDriverConductorProfile,
  DriverConductorCombo,
} from '../../utils/ankCombos81';
import {
  Sparkles,
  Compass,
  Award,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  HeartHandshake,
  Briefcase,
  Star,
  Layers,
  Info,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface DriverConductor81TabProps {
  language: Language;
  userMulank: number;
  userBhagyank: number;
}

export const DriverConductor81Tab: React.FC<DriverConductor81TabProps> = ({
  language,
  userMulank,
  userBhagyank,
}) => {
  // Explorer state
  const [selectedDriver, setSelectedDriver] = useState<number>(userMulank);
  const [selectedConductor, setSelectedConductor] = useState<number>(userBhagyank);

  const activeCombo: DriverConductorCombo = getDriverConductorProfile(
    selectedDriver,
    selectedConductor
  );
  const userPersonalCombo: DriverConductorCombo = getDriverConductorProfile(
    userMulank,
    userBhagyank
  );

  const isViewingOwn =
    selectedDriver === userMulank && selectedConductor === userBhagyank;

  return (
    <div className="space-y-6">
      {/* Educational Header Badge */}
      <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {language === 'hi'
              ? '81 मूलांक-भाग्यांक विशिष्ट कॉम्बिनेशन (81 Driver-Conductor Matrix)'
              : 'The 81 Driver-Conductor Karmic Blueprint Matrix'}
          </span>
        </div>
        <p className="leading-relaxed">
          {language === 'hi'
            ? 'अंक ज्योतिष में 1 से 9 मूलांक (Driver) और 1 से 9 भाग्यांक (Conductor) के कुल 81 विशिष्ट संयोजन बनते हैं। आपका मूलांक आपकी चेतना व आत्मबल का चालक है, जबकि भाग्यांक आपके कर्म व अंतिम गंतव्य का संचालक है। नीचे अपनी और किसी भी अन्य संयोजन की जन्मकुंडली का फलादेश देखें।'
            : 'Every human life is encoded within one of the 81 primary Driver-Conductor matrices. The Driver (Mulank) sets the core engine of desires and personality, while the Conductor (Bhagyank) orchestrates your karmic destiny and life pinnacles.'}
        </p>
      </div>

      {/* Interactive 81 Combinations Selector */}
      <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {language === 'hi' ? '81 कॉम्बिनेशन एक्सप्लोरर' : '81 Combinations Matrix Explorer'}
            </span>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'hi'
                ? 'किसी भी व्यक्ति के मूलांक व भाग्यांक का चयन करें:'
                : 'Select any Driver (Mulank) & Conductor (Bhagyank) pair to reveal blueprint:'}
            </p>
          </div>

          {!isViewingOwn && (
            <button
              type="button"
              onClick={() => {
                setSelectedDriver(userMulank);
                setSelectedConductor(userBhagyank);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>
                {language === 'hi'
                  ? `मेरा कॉम्बिनेशन (${userMulank}-${userBhagyank}) देखें`
                  : `View My Combo (${userMulank}-${userBhagyank})`}
              </span>
            </button>
          )}
        </div>

        {/* 2-Row Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Driver (Mulank) 1-9 */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              {language === 'hi' ? '1. मूलांक (Driver Number):' : '1. Select Driver (Mulank 1-9):'}
            </span>
            <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const isSelected = selectedDriver === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedDriver(num)}
                    className={`h-10 sm:h-11 rounded-xl flex items-center justify-center font-black text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/40 scale-105 shadow-lg'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conductor (Bhagyank) 1-9 */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              {language === 'hi' ? '2. भाग्यांक (Conductor Number):' : '2. Select Conductor (Bhagyank 1-9):'}
            </span>
            <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const isSelected = selectedConductor === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedConductor(num)}
                    className={`h-10 sm:h-11 rounded-xl flex items-center justify-center font-black text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-black ring-4 ring-emerald-400/40 scale-105 shadow-lg'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Combo Detailed Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-black text-2xl shadow-lg shadow-amber-500/20">
              {activeCombo.pairKey}
            </div>
            <div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                {language === 'hi'
                  ? `मूलांक ${selectedDriver} & भाग्यांक ${selectedConductor}`
                  : `Driver ${selectedDriver} & Conductor ${selectedConductor}`}
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-1">
                {language === 'hi' ? activeCombo.titleHi : activeCombo.titleEn}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < activeCombo.rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                activeCombo.category.includes('Super')
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : activeCombo.category.includes('Challenging')
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-teal-500/20 border-teal-500/40 text-teal-300'
              }`}
            >
              {language === 'hi' ? activeCombo.categoryHi : activeCombo.category}
            </span>
          </div>
        </div>

        {/* Life Path Overview */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'hi' ? 'जीवन यात्रा एवं मूल प्रकृति (Life Blueprint):' : 'Life Path & Core Temperament Overview:'}
          </span>
          <p className="text-slate-200 text-sm leading-relaxed">
            {language === 'hi' ? activeCombo.lifePathOverviewHi : activeCombo.lifePathOverviewEn}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Career & Industry Suitability */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              {language === 'hi' ? 'सर्वोत्तम करियर व व्यवसाय क्षेत्र' : 'Top Career & Industry Pathways'}
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(language === 'hi' ? activeCombo.careerProspectsHi : activeCombo.careerProspectsEn).map((c, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-medium"
                >
                  💼 {c}
                </span>
              ))}
            </div>
          </div>

          {/* Financial Trajectory */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {language === 'hi' ? 'आर्थिक समृद्धि व धनार्जन दिशा' : 'Financial Trajectory & Wealth Growth'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi' ? activeCombo.financialTrajectoryHi : activeCombo.financialTrajectoryEn}
            </p>
          </div>

          {/* Relationship & Marriage Dynamics */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              {language === 'hi' ? 'दांपत्य, प्रेम एवं साझेदारी तालमेल' : 'Relationship & Marital Dynamics'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi' ? activeCombo.relationshipDynamicsHi : activeCombo.relationshipDynamicsEn}
            </p>
          </div>

          {/* Health Alerts */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              {language === 'hi' ? 'स्वास्थ्य सावधानियां व अंग सतर्कता' : 'Health & Vitality Alerts'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi' ? activeCombo.healthAlertsHi : activeCombo.healthAlertsEn}
            </p>
          </div>
        </div>

        {/* Master Remedy & Lucky Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="sm:col-span-2 bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'hi' ? 'इस संयोजन का मुख्य महा-उपाय (Master Remedy):' : 'Master Harmonic Remedy:'}
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {language === 'hi' ? activeCombo.masterRemedyHi : activeCombo.masterRemedyEn}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'hi' ? 'शुभ रंग व रत्न:' : 'Lucky Colors & Gems:'}
            </span>
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-300">
                <strong className="text-amber-400">{language === 'hi' ? 'रंग: ' : 'Colors: '}</strong>
                {activeCombo.luckyColors.join(', ')}
              </p>
              <p className="text-slate-300">
                <strong className="text-emerald-400">{language === 'hi' ? 'रत्न: ' : 'Gems: '}</strong>
                {activeCombo.luckyGems.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
