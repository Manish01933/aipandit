import React, { useState, useRef, useMemo } from 'react';
import { BirthDetails, Language, MatchmakingResult } from '../types/astrology';
import { calculateMatchmaking } from '../utils/vedicCalculations';
import {
  HeartHandshake,
  Sparkles,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Award,
  Calendar,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleMapsPlacePicker } from './GoogleMapsPlacePicker';
import { VoiceConsultationPlayer } from './VoiceConsultationPlayer';

const MONTHS_LIST = [
  { value: '01', nameHi: '01 - जनवरी', nameEn: '01 - Jan' },
  { value: '02', nameHi: '02 - फ़रवरी', nameEn: '02 - Feb' },
  { value: '03', nameHi: '03 - मार्च', nameEn: '03 - Mar' },
  { value: '04', nameHi: '04 - अप्रैल', nameEn: '04 - Apr' },
  { value: '05', nameHi: '05 - मई', nameEn: '05 - May' },
  { value: '06', nameHi: '06 - जून', nameEn: '06 - Jun' },
  { value: '07', nameHi: '07 - जुलाई', nameEn: '07 - Jul' },
  { value: '08', nameHi: '08 - अगस्त', nameEn: '08 - Aug' },
  { value: '09', nameHi: '09 - सितम्बर', nameEn: '09 - Sep' },
  { value: '10', nameHi: '10 - अक्टूबर', nameEn: '10 - Oct' },
  { value: '11', nameHi: '11 - नवम्बर', nameEn: '11 - Nov' },
  { value: '12', nameHi: '12 - दिसम्बर', nameEn: '12 - Dec' },
];

const DAYS_LIST = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const YEARS_LIST = Array.from({ length: 2026 - 1940 + 1 }, (_, i) => String(2026 - i));

interface MatchmakingViewProps {
  language: Language;
}

export const MatchmakingView: React.FC<MatchmakingViewProps> = ({ language }) => {
  const initialGroom: BirthDetails = {
    name: language === 'hi' ? 'रोहन शर्मा' : 'Rohan Sharma',
    gender: 'male',
    dob: '1995-08-20',
    tob: '09:15',
    place: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 5.5,
  };

  const initialBride: BirthDetails = {
    name: language === 'hi' ? 'प्रिया वर्मा' : 'Priya Verma',
    gender: 'female',
    dob: '1997-11-12',
    tob: '14:30',
    place: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 5.5,
  };

  const [groom, setGroom] = useState<BirthDetails>(initialGroom);
  const [bride, setBride] = useState<BirthDetails>(initialBride);
  const [matchResult, setMatchResult] = useState<MatchmakingResult | null>(() => {
    return calculateMatchmaking(initialGroom, initialBride);
  });
  const [isMatchFeedback, setIsMatchFeedback] = useState(false);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMatchReport, setAiMatchReport] = useState<string | null>(null);
  const [isAiFeedback, setIsAiFeedback] = useState(false);

  const handleCalculateMatch = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    const safeGroom = {
      ...groom,
      name: groom.name?.trim() || (language === 'hi' ? 'वर (Groom)' : 'Groom'),
      place: groom.place?.trim() || 'New Delhi, India',
    };
    const safeBride = {
      ...bride,
      name: bride.name?.trim() || (language === 'hi' ? 'वधू (Bride)' : 'Bride'),
      place: bride.place?.trim() || 'New Delhi, India',
    };
    setGroom(safeGroom);
    setBride(safeBride);
    const result = calculateMatchmaking(safeGroom, safeBride);
    setMatchResult(result);
    setAiMatchReport(null);
    setIsMatchFeedback(true);
    setTimeout(() => setIsMatchFeedback(false), 2500);

    if (result.totalPoints >= 21) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // silent fail
      }
    }

    setTimeout(() => {
      document.getElementById('matchmaking-result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const fetchAIMarriageForecast = async () => {
    if (!matchResult) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/matchmaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchResult, language }),
      });
      const data = await res.json();
      setAiMatchReport(data.report || 'Forecast generated.');
      setIsAiFeedback(true);
      setTimeout(() => setIsAiFeedback(false), 3000);
    } catch (err) {
      console.error('Failed to get AI match forecast', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            {language === 'hi' ? 'वैदिक अष्टकूट 36 गुण मिलान' : 'Vedic Ashtakoot 36-Guna Kundali Milan'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'hi' ? 'विवाह गुण मिलान एवं दांपत्य सुख' : 'Marriage Compatibility & Kundali Matching'}
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            {language === 'hi'
              ? 'वर-वधू की जन्म कुंडली का 8 कूटों (वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट, नाड़ी) में मिलान, मांगलिक विचार एवं AI दांपत्य फलकथन।'
              : 'Detailed 36-point marital accord analysis across spiritual temperament, longevity, intimacy, family prosperity, progeny vitality, and Manglik checks.'}
          </p>
        </div>
      </div>

      {/* Input Forms (Groom & Bride) */}
      <form onSubmit={handleCalculateMatch} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Groom Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-blue-500/20 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🤵</span>
            <h3 className="text-base font-bold text-blue-300">
              {language === 'hi' ? 'वर का विवरण (Groom Details)' : 'Groom Details'}
            </h3>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'वर का नाम' : 'Groom Name'}
              </label>
              <input
                type="text"
                value={groom.name}
                onChange={(e) => setGroom({ ...groom, name: e.target.value })}
                placeholder={language === 'hi' ? 'उदा. रोहन शर्मा' : 'e.g. Rohan Sharma'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
                </label>
                <input
                  type="date"
                  required
                  value={groom.dob}
                  onChange={(e) => setGroom({ ...groom, dob: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'hi' ? 'जन्म समय' : 'Time of Birth'}
                </label>
                <input
                  type="time"
                  required
                  value={groom.tob}
                  onChange={(e) => setGroom({ ...groom, tob: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'जन्म स्थान (गूगल मैप्स / GPS)' : 'Birth Place (Google Maps / GPS)'}
              </label>
              <GoogleMapsPlacePicker
                initialPlace={groom.place}
                initialLat={groom.latitude}
                initialLon={groom.longitude}
                initialTz={groom.timezone}
                language={language}
                onSelectPlace={(picked) => {
                  setGroom((prev) => ({
                    ...prev,
                    place: picked.name,
                    latitude: picked.latitude,
                    longitude: picked.longitude,
                    timezone: picked.timezone,
                  }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Bride Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-rose-500/20 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">👰</span>
            <h3 className="text-base font-bold text-rose-300">
              {language === 'hi' ? 'वधू का विवरण (Bride Details)' : 'Bride Details'}
            </h3>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'वधू का नाम' : 'Bride Name'}
              </label>
              <input
                type="text"
                value={bride.name}
                onChange={(e) => setBride({ ...bride, name: e.target.value })}
                placeholder={language === 'hi' ? 'उदा. प्रिया वर्मा' : 'e.g. Priya Verma'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
                </label>
                <input
                  type="date"
                  required
                  value={bride.dob}
                  onChange={(e) => setBride({ ...bride, dob: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'hi' ? 'जन्म समय' : 'Time of Birth'}
                </label>
                <input
                  type="time"
                  required
                  value={bride.tob}
                  onChange={(e) => setBride({ ...bride, tob: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'जन्म स्थान (गूगल मैप्स / GPS)' : 'Birth Place (Google Maps / GPS)'}
              </label>
              <GoogleMapsPlacePicker
                initialPlace={bride.place}
                initialLat={bride.latitude}
                initialLon={bride.longitude}
                initialTz={bride.timezone}
                language={language}
                onSelectPlace={(picked) => {
                  setBride((prev) => ({
                    ...prev,
                    place: picked.name,
                    latitude: picked.latitude,
                    longitude: picked.longitude,
                    timezone: picked.timezone,
                  }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="lg:col-span-2">
          <button
            id="calculate-matchmaking-btn"
            type="submit"
            onClick={handleCalculateMatch}
            className={`w-full font-extrabold py-3.5 px-6 rounded-xl text-base shadow-xl flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-98 ${
              isMatchFeedback
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/40 ring-4 ring-emerald-400/50 scale-[1.01]'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:opacity-95 text-white hover:scale-[1.01]'
            }`}
          >
            {isMatchFeedback ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white animate-pulse" />
                <span className="font-extrabold">{language === 'hi' ? '✓ 36 गुण मिलान पूर्ण!' : '✓ 36-Gun Match Calculated!'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{language === 'hi' ? '36 गुण मिलान एवं फलकथन देखें' : 'Calculate 36-Gun Compatibility Match'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Matchmaking Output */}
      {!matchResult ? (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-2xl">
            💍
          </div>
          <h4 className="text-base font-bold text-white">
            {language === 'hi' ? 'वर एवं वधू का जन्म विवरण दर्ज करें' : 'Enter Boy & Girl Birth Details'}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {language === 'hi'
              ? 'दोनों का नाम, जन्म तिथि, समय एवं स्थान भरकर "36 गुण मिलान देखें" पर क्लिक करें। अष्टकूट (वर्ण, वश्य, तारा, योनि, ग्रहमैत्री, गण, भकूट, नाड़ी) की प्रामाणिक गणना तुरंत प्राप्त होगी।'
              : 'Fill in the names, birth dates, times, and places above, then click "Calculate 36-Gun Compatibility Match" to generate the full Ashtakoot compatibility scorecard.'}
          </p>
        </div>
      ) : (
        <div id="matchmaking-result-section" className="space-y-6">
          {/* Main Score Summary Banner */}
          <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Circular Score Visual */}
              <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-slate-950 border-4 border-amber-500/40 shadow-inner">
                <div className="text-center">
                  <span className="text-3xl font-black text-amber-300">{matchResult.totalPoints}</span>
                  <span className="text-xs text-slate-400 block font-semibold">/ 36 Gunas</span>
                </div>
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  {language === 'hi' ? 'वैदिक गुण मिलान परिणाम' : 'Match Verdict'}
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  {language === 'hi' ? matchResult.recommendationHindi : `${matchResult.recommendation} Match (${matchResult.percentage}%)`}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  {matchResult.totalPoints >= 18
                    ? language === 'hi'
                      ? '18 से अधिक गुण प्राप्त होने पर विवाह शुभ माना जाता है। दांपत्य जीवन में अनुकूलता रहेगी।'
                      : 'Scoring 18+ points is traditionally considered suitable and auspicious for marriage.'
                    : language === 'hi'
                    ? 'गुण 18 से कम हैं। विद्वान ज्योतिषी से परामर्श व उपाय अपेक्षित हैं।'
                    : 'Score is under 18 points. Consultation for remedy mitigation is suggested.'}
                </p>
              </div>
            </div>

            {/* Quick Manglik & Nadi Flags */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  {language === 'hi' ? 'नाड़ी दोष' : 'Nadi Dosha'}
                </span>
                <span className={`font-bold ${matchResult.nadiDosha ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {matchResult.nadiDosha ? 'Nadi Dosha Present' : 'Zero Nadi Dosha (Safe)'}
                </span>
              </div>

              <div className="bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  {language === 'hi' ? 'मांगलिक सामंजस्य' : 'Manglik Accord'}
                </span>
                <span className="font-bold text-amber-300">
                  {matchResult.manglikCheck.groomManglik === matchResult.manglikCheck.brideManglik
                    ? 'Balanced / Cancelled'
                    : 'Partial Check'}
                </span>
              </div>
            </div>
          </div>

          {/* 8 Gunas Breakdown Table */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-base font-bold text-amber-300 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              {language === 'hi' ? 'अष्टकूट 8 गुण विस्तृत तालिका' : 'Ashtakoot Guna Detailed Scorecard'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'कूट (Guna)' : 'Guna'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'क्षेत्र (Domain)' : 'Domain'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'वर (Groom)' : 'Groom'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'वधू (Bride)' : 'Bride'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'अधिकतम अंक' : 'Max Pts'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'प्राप्त अंक' : 'Obtained'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'मूल्यांकन' : 'Evaluation'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {matchResult.gunas.map((guna) => (
                    <tr key={guna.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-amber-300">{guna.name}</td>
                      <td className="py-3 px-3 text-slate-400">
                        {language === 'hi' ? guna.areaHindi : guna.area}
                      </td>
                      <td className="py-3 px-3">{guna.groomValue}</td>
                      <td className="py-3 px-3">{guna.brideValue}</td>
                      <td className="py-3 px-3 font-mono">{guna.maxPoints}</td>
                      <td className="py-3 px-3 font-bold font-mono text-amber-200">
                        {guna.obtainedPoints}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            guna.obtainedPoints === guna.maxPoints
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : guna.obtainedPoints > 0
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {guna.obtainedPoints === guna.maxPoints ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : guna.obtainedPoints > 0 ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {guna.obtainedPoints}/{guna.maxPoints}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Deep Marriage Consultation Trigger */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                id="btn-ai-match-forecast"
                type="button"
                onClick={fetchAIMarriageForecast}
                disabled={isAiLoading}
                className={`w-full font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${
                  isAiFeedback
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white ring-4 ring-emerald-400/50 scale-[1.01]'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:opacity-90 text-white'
                }`}
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {language === 'hi' ? 'AI दांपत्य विश्लेषण तैयार हो रहा है...' : 'Generating Deep Astrological Marriage Forecast...'}
                  </>
                ) : isAiFeedback ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white animate-pulse" />
                    <span>{language === 'hi' ? '✓ AI दांपत्य परामर्श तैयार!' : '✓ AI Marital Harmony Forecast Ready!'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {language === 'hi' ? 'AI दांपत्य सुख एवं वैवाहिक परामर्श प्राप्त करें' : 'Generate Full AI Marriage Compatibility Report'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Match Forecast Card */}
          {aiMatchReport && (
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 rounded-2xl border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-lg mb-4">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {language === 'hi' ? 'आचार्य एस्ट्रोदोस्त AI वैवाहिक परामर्श रिपोर्ट' : 'Acharya AstroDost AI Marital Harmony Forecast'}
              </div>
              <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {aiMatchReport}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
