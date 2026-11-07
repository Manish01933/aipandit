import React, { useState } from 'react';
import { Language } from '../../types/astrology';
import {
  calculateAnkJyotish,
  AnkJyotishFullReport,
} from '../../utils/ankJyotishCalculations';
import {
  HeartHandshake,
  User,
  Calendar,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Info,
  CheckCircle2,
  Briefcase,
  Users,
  Award,
} from 'lucide-react';

interface DualMatchmakingTabProps {
  language: Language;
  primaryName: string;
  primaryDob: string;
}

export const DualMatchmakingTab: React.FC<DualMatchmakingTabProps> = ({
  language,
  primaryName,
  primaryDob,
}) => {
  const [name1, setName1] = useState(primaryName || 'Aarav Sharma');
  const [dob1, setDob1] = useState(primaryDob || '1998-05-15');
  const [name2, setName2] = useState('Pooja Patel');
  const [dob2, setDob2] = useState('2000-08-24');

  const p1Report: AnkJyotishFullReport = calculateAnkJyotish(name1, dob1);
  const p2Report: AnkJyotishFullReport = calculateAnkJyotish(name2, dob2);

  // 6-Layer Compatibility Calculation
  const calculateLayerScore = (numA: number, numB: number, weight: number) => {
    // Friendly pairs
    const FRIENDLY_MATRIX: Record<number, number[]> = {
      1: [1, 2, 3, 5, 9],
      2: [1, 2, 3, 5],
      3: [1, 2, 3, 5, 7, 9],
      4: [1, 5, 6, 7],
      5: [1, 2, 3, 5, 6],
      6: [4, 5, 6, 7, 8],
      7: [1, 3, 4, 5, 6],
      8: [3, 5, 6, 7],
      9: [1, 3, 5, 9],
    };

    const OPPOSING_MATRIX: Record<number, number[]> = {
      1: [8],
      2: [8, 9],
      3: [6],
      4: [8, 9],
      5: [],
      6: [3],
      7: [9],
      8: [1, 2, 4],
      9: [2, 4, 7, 8],
    };

    if (numA === numB) return weight;
    if (FRIENDLY_MATRIX[numA]?.includes(numB)) return weight * 0.9;
    if (OPPOSING_MATRIX[numA]?.includes(numB)) return weight * 0.4;
    return weight * 0.7; // Neutral
  };

  const scoreDriver = calculateLayerScore(p1Report.mulank, p2Report.mulank, 25);
  const scoreDestiny = calculateLayerScore(p1Report.bhagyank, p2Report.bhagyank, 25);
  const scoreName = calculateLayerScore(p1Report.namankChaldean, p2Report.namankChaldean, 15);
  const scoreSoulUrge = calculateLayerScore(p1Report.soulUrgeNumber, p2Report.soulUrgeNumber, 15);
  const scorePersonality = calculateLayerScore(p1Report.personalityNumber, p2Report.personalityNumber, 10);
  const scorePersonalYear = calculateLayerScore(p1Report.personalYearCurrent.personalYearNumber, p2Report.personalYearCurrent.personalYearNumber, 10);

  const totalScore = Math.round(scoreDriver + scoreDestiny + scoreName + scoreSoulUrge + scorePersonality + scorePersonalYear);

  return (
    <div className="space-y-6">
      {/* Educational Header Badge */}
      <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {language === 'hi'
              ? 'विस्तृत दांपत्य एवं व्यावसायिक अंक मिलान (6-Layer Matchmaking Engine)'
              : '6-Layer Deep Numerology Matchmaking & Compatibility Engine'}
          </span>
        </div>
        <p className="leading-relaxed">
          {language === 'hi'
            ? 'यह प्रणाली केवल एक अंक पर निर्भर न रहकर 6 अलग-अलग स्तरों पर गहन मिलान करती है—मूलांक (मन व अहंकार का तालमेल), भाग्यांक (कर्म व जीवन लक्ष्य), नामांक (सामाजिक छवि), हृदयांक (आंतरिक भावनात्मक इच्छाएं), व्यक्तित्व अंक और व्यक्तिगत वर्ष चक्र।'
            : 'Instead of looking at a single number, this holistic engine evaluates relationship harmony across 6 dimensions: Driver (Ego & Temperament), Destiny (Life Mission & Karma), Name Vibration (Social Synergy), Soul Urge (Deep Emotional Core), Personality (Outer Impression), and Personal Year cycles.'}
        </p>
      </div>

      {/* Dual Input Form */}
      <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Person 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {language === 'hi' ? 'प्रथम व्यक्ति विवरण (Person 1):' : 'Primary Person 1 Details:'}
            </span>
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{language === 'hi' ? 'नाम:' : 'Name:'}</label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{language === 'hi' ? 'जन्म तिथि:' : 'Date of Birth:'}</label>
                <input
                  type="date"
                  value={dob1}
                  onChange={(e) => setDob1(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Quick Profile Pill */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800">
              <span>Mulank: <strong className="text-amber-400">{p1Report.mulank}</strong></span>
              <span>Bhagyank: <strong className="text-indigo-400">{p1Report.bhagyank}</strong></span>
              <span>Namank: <strong className="text-emerald-400">{p1Report.namankChaldean}</strong></span>
            </div>
          </div>

          {/* Person 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {language === 'hi' ? 'द्वितीय व्यक्ति विवरण (Person 2):' : 'Partner / Person 2 Details:'}
            </span>
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{language === 'hi' ? 'नाम:' : 'Name:'}</label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{language === 'hi' ? 'जन्म तिथि:' : 'Date of Birth:'}</label>
                <input
                  type="date"
                  value={dob2}
                  onChange={(e) => setDob2(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Quick Profile Pill */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800">
              <span>Mulank: <strong className="text-amber-400">{p2Report.mulank}</strong></span>
              <span>Bhagyank: <strong className="text-indigo-400">{p2Report.bhagyank}</strong></span>
              <span>Namank: <strong className="text-emerald-400">{p2Report.namankChaldean}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Score & Breakdown */}
      <div className="bg-slate-900/90 rounded-2xl border border-amber-500/40 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Score Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              {language === 'hi' ? 'कुल अंक मिलान अनुकूलता स्कोर' : 'Overall Compatibility Index'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              {totalScore >= 80
                ? language === 'hi' ? 'अति-उत्तम एवं शुभ संबंध योग' : 'Exceptional & Highly Harmonious Alliance'
                : totalScore >= 65
                ? language === 'hi' ? 'अनुकूल एवं प्रगतिशील संबंध' : 'Good & Constructive Compatibility'
                : language === 'hi' ? 'सामान्य तालमेल - समझदारी आवश्यक' : 'Mixed Compatibility - Requires Mutual Compromise'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border-2 border-amber-400 flex flex-col items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
              <span className="text-2xl font-black">{totalScore}%</span>
              <span className="text-[10px] text-slate-300 uppercase font-bold">Match</span>
            </div>
          </div>
        </div>

        {/* 6-Layer Progress Bars */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? '6-स्तरीय अनुकूलता विश्लेषण:' : '6-Layer Dimensional Breakdown:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">{language === 'hi' ? '1. मूलांक तालमेल (Ego/Mind):' : '1. Driver (Mulank) Sync:'}</span>
                <span className="text-amber-400 font-bold">{Math.round((scoreDriver / 25) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${(scoreDriver / 25) * 100}%` }} />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">{language === 'hi' ? '2. भाग्यांक तालमेल (Destiny/Karma):' : '2. Destiny (Bhagyank) Sync:'}</span>
                <span className="text-teal-400 font-bold">{Math.round((scoreDestiny / 25) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${(scoreDestiny / 25) * 100}%` }} />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">{language === 'hi' ? '3. नामांक कंपन (Name Aura):' : '3. Name Vibration Sync:'}</span>
                <span className="text-emerald-400 font-bold">{Math.round((scoreName / 15) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${(scoreName / 15) * 100}%` }} />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">{language === 'hi' ? '4. हृदयांक (Soul Urge):' : '4. Soul Urge Sync:'}</span>
                <span className="text-rose-400 font-bold">{Math.round((scoreSoulUrge / 15) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: `${(scoreSoulUrge / 15) * 100}%` }} />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">{language === 'hi' ? '5. बाह्य व्यक्तित्व:' : '5. Outer Personality:'}</span>
                <span className="text-cyan-400 font-bold">{Math.round((scorePersonality / 10) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: `${(scorePersonality / 10) * 100}%` }} />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">{language === 'hi' ? '6. व्यक्तिगत वर्ष चक्र:' : '6. Personal Year Timing:'}</span>
                <span className="text-amber-300 font-bold">{Math.round((scorePersonalYear / 10) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5">
                <div className="bg-amber-300 h-1.5 rounded-full" style={{ width: `${(scorePersonalYear / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Practical Life Verdicts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Marriage */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              {language === 'hi' ? 'विवाह व दांपत्य सुख' : 'Marriage & Romance'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {totalScore >= 75
                ? language === 'hi'
                  ? 'अत्यंत सामंजस्यपूर्ण और प्रेमपूर्ण दांपत्य जीवन। भावनात्मक व मानसिक तालमेल बहुत मजबूत रहेगा।'
                  : 'Deep emotional empathy, romantic loyalty, and lasting family harmony.'
                : language === 'hi'
                ? 'अच्छा वैवाहिक जीवन, हालांकि मतभेदों से बचने के लिए बातचीत खुली रखें।'
                : 'Favorable bond; prioritize open communication during stress.'}
            </p>
          </div>

          {/* Business */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              {language === 'hi' ? 'व्यापारिक साझेदारी' : 'Business Partnership'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {totalScore >= 70
                ? language === 'hi'
                  ? 'व्यापार में धन लाभ और संयुक्त निर्णयों में सफलता। दोनों एक-दूसरे की कमजोरियों को पूरा करेंगे।'
                  : 'Highly lucrative commercial synergy; ideal complementary skillset for enterprise growth.'
                : language === 'hi'
                ? 'व्यापारिक साझेदारी में सभी शर्तों और वित्तीय दायित्वों को लिखित रूप में रखें।'
                : 'Keep contractual agreements well-documented to ensure seamless collaboration.'}
            </p>
          </div>

          {/* Friendship */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {language === 'hi' ? 'मित्रता व सामाजिक संबंध' : 'Friendship & Social Bond'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'सच्ची और दीर्घकालीन मित्रता। कठिन समय में एक-दूसरे के मजबूत सहयोगी बनेंगे।'
                : 'Authentic lifelong camaraderie and mutual encouragement across all life phases.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
