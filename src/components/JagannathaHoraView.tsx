import React, { useState, useEffect, useMemo } from 'react';
import {
  BirthDetails,
  Language,
  VargaCode,
  VedicPlanet,
  JagannathaHoraData,
} from '../types/astrology';
import { calculateJagannathaHora } from '../utils/jagannathaHoraEngine';
import { generateKundali } from '../utils/vedicCalculations';
import { lookupCityCoordinates } from '../utils/citiesDatabase';
import { GoogleMapsPlacePicker } from './GoogleMapsPlacePicker';
import { generateTenPageJagannathaHoraReport } from '../utils/tenPageJagannathaHoraEngine';
import { TenPageJagannathaHoraViewer } from './TenPageJagannathaHoraViewer';
import {
  Sparkles,
  Compass,
  Crown,
  Layers,
  BarChart3,
  Grid3X3,
  Activity,
  Calendar,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Info,
  RotateCcw,
  Zap,
  Globe,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KundaliDualPartSwitcher } from './KundaliDualPartSwitcher';
import { AccessState, isModuleUnlocked } from '../utils/accessManager';

interface JagannathaHoraViewProps {
  language: Language;
  onNavigateToPart1?: () => void;
  onOpenPaywall?: (moduleId: string) => void;
  accessState?: AccessState;
}

const CITY_PRESETS = [
  { name: 'New Delhi, India', lat: 28.6139, lon: 77.209, tz: 5.5 },
  { name: 'Mumbai, India', lat: 19.076, lon: 72.8777, tz: 5.5 },
  { name: 'Varanasi, India', lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: 'Ujjain, India', lat: 23.1765, lon: 75.7885, tz: 5.5 },
  { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Kolkata, India', lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.006, tz: -5 },
];

export const JagannathaHoraView: React.FC<JagannathaHoraViewProps> = ({
  language,
  onNavigateToPart1,
  onOpenPaywall,
  accessState,
}) => {
  const isUnlocked = accessState ? isModuleUnlocked('jagannatha', accessState) : true;
  const defaultForm: BirthDetails = {
    name: language === 'hi' ? 'आरव शर्मा' : 'Aarav Sharma',
    gender: 'male',
    dob: '1998-05-15',
    tob: '10:30',
    place: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 5.5,
  };

  const [formData, setFormData] = useState<BirthDetails>(() => {
    try {
      const stored = localStorage.getItem('astrodost_saved_kundali');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.birthDetails) return parsed.birthDetails;
      }
    } catch {
      // ignore
    }
    return defaultForm;
  });

  const [activeTab, setActiveTab] = useState<
    | 'tenPageReport'
    | 'vargas'
    | 'karakas'
    | 'arudhas'
    | 'shadbala'
    | 'ashtakavarga'
    | 'avasthas'
    | 'dashas'
    | 'aiSynthesis'
  >('tenPageReport');

  const [selectedVarga, setSelectedVarga] = useState<VargaCode>('D9');
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [horaData, setHoraData] = useState<JagannathaHoraData>(() => calculateJagannathaHora(formData));

  const tenPageReport = useMemo(() => {
    return generateTenPageJagannathaHoraReport(formData, horaData);
  }, [formData, horaData]);
  const [expandedMaha, setExpandedMaha] = useState<string | null>(() => {
    try {
      const initial = calculateJagannathaHora(formData);
      return initial.hierarchicalDasha.find((m) => m.isCurrent)?.mahadasha || initial.hierarchicalDasha[0]?.mahadasha || null;
    } catch {
      return null;
    }
  });
  const [expandedAntar, setExpandedAntar] = useState<string | null>(() => {
    try {
      const initial = calculateJagannathaHora(formData);
      const curM = initial.hierarchicalDasha.find((m) => m.isCurrent) || initial.hierarchicalDasha[0];
      return curM?.antardashas.find((a) => a.isCurrent)?.antardasha || curM?.antardashas[0]?.antardasha || null;
    } catch {
      return null;
    }
  });
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCalculatedFeedback, setIsCalculatedFeedback] = useState(false);

  useEffect(() => {
    const handleSync = (e: any) => {
      const updatedKundali = e?.detail;
      if (updatedKundali?.birthDetails) {
        setFormData(updatedKundali.birthDetails);
      }
    };

    window.addEventListener('astrodost_kundali_updated', handleSync);
    return () => {
      window.removeEventListener('astrodost_kundali_updated', handleSync);
    };
  }, []);

  useEffect(() => {
    const data = calculateJagannathaHora(formData);
    setHoraData(data);
    if (data.hierarchicalDasha.length > 0) {
      const currentMaha = data.hierarchicalDasha.find((m) => m.isCurrent) || data.hierarchicalDasha[0];
      setExpandedMaha(currentMaha.mahadasha);
      const currentAntar = currentMaha.antardashas.find((a) => a.isCurrent) || currentMaha.antardashas[0];
      setExpandedAntar(currentAntar.antardasha);
    }
  }, [formData]);

  const handleCitySelect = (cityName: string) => {
    const selected = CITY_PRESETS.find((c) => c.name === cityName);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        place: selected.name,
        latitude: selected.lat,
        longitude: selected.lon,
        timezone: selected.tz,
      }));
    }
  };

  const handleRecalculate = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const effectiveName = formData.name.trim() || (language === 'hi' ? 'जातक' : 'Seeker');
    const placeStr = formData.place?.trim() || 'New Delhi, India';

    // Auto-resolve city coordinates
    const cityMatch = lookupCityCoordinates(placeStr);
    const resolvedLat = cityMatch ? cityMatch.lat : (typeof formData.latitude === 'number' && !isNaN(formData.latitude) ? formData.latitude : 28.6139);
    const resolvedLon = cityMatch ? cityMatch.lon : (typeof formData.longitude === 'number' && !isNaN(formData.longitude) ? formData.longitude : 77.209);
    const resolvedTz = cityMatch ? cityMatch.tz : (typeof formData.timezone === 'number' && !isNaN(formData.timezone) ? formData.timezone : 5.5);

    const safeSubmission = {
      ...formData,
      name: effectiveName,
      place: placeStr,
      latitude: resolvedLat,
      longitude: resolvedLon,
      timezone: resolvedTz,
    };
    setFormData(safeSubmission);
    const data = calculateJagannathaHora(safeSubmission);
    setHoraData(data);
    setIsCalculatedFeedback(true);
    setTimeout(() => setIsCalculatedFeedback(false), 2500);

    try {
      const kundaliRes = generateKundali(safeSubmission);
      localStorage.setItem('astrodost_saved_kundali', JSON.stringify(kundaliRes));
    } catch {
      // ignore
    }
  };

  const generateLocalHoraSynthesis = (data: JagannathaHoraData, lang: 'hi' | 'en') => {
    const ak = data.charaKarakas[0];
    const amk = data.charaKarakas[1];
    const al = data.arudhaPadas[0];
    const ul = data.arudhaPadas[11];
    const strongP = data.shadbala.strongestPlanet;
    const weakP = data.shadbala.weakestPlanet;
    const bindus = data.ashtakavarga.totalBindus;
    const name = data.birthDetails.name || (lang === 'hi' ? 'जातक' : 'Native');

    if (lang === 'hi') {
      return `🪐 **${name} की सम्पूर्ण जगन्नाथ होरा (स्विस एफिमेरिस) ज्योतिषीय मीमांसा:**\n\n` +
        `🔱 **१. आत्मकारक (AK) एवं कारकांश (आत्मा का गंतव्य):**\n` +
        `आपकी कुंडली में प्रधान आत्मकारक ग्रह **${ak?.planet || 'ग्रह'}** (${ak?.sign || 'राशि'}) हैं, तथा नवांश में कारकांश **${data.karakamsha.sign || 'राशि'}** में स्थित है। यह स्थिति जातक को उच्च आत्म-सम्मान, आध्यात्मिक जिज्ञासा और जीवन में एक विशेष लक्ष्य के प्रति अडिग निष्ठा प्रदान करती है।\n\n` +
        `👑 **२. आरूढ़ लग्न (AL) एवं प्रतिष्ठा (समाज में छवि):**\n` +
        `आरूढ़ लग्न **${al?.occupiedSign || 'राशि'}** में है, जो सांसारिक जगत में आपकी वास्तविक पहचान एवं सामाजिक स्थिति को दर्शाता है। अमात्यकारक **${amk?.planet || 'ग्रह'}** की स्थिति करियर व कार्यक्षेत्र में प्रभावशीलता और नेतृत्व क्षमता का संकेत देती है।\n\n` +
        `💍 **३. उपपद लग्न (UL) एवं वैवाहिक समन्वय:**\n` +
        `उपपद लग्न **${ul?.occupiedSign || 'राशि'}** में स्थित है। यह वैवाहिक संबंधों में सौहार्द, धैर्य एवं पारिवारिक दायित्वों के प्रति समर्पण को इंगित करता है।\n\n` +
        `⚡ **४. षड्बल एवं सर्वाष्टकवर्ग शक्ति:**\n` +
        `षड्बल में आपका सबसे शक्तिशाली ग्रह **${strongP}** है, जो जीवन के संघर्षों में आपका मुख्य रक्षा कवच है। सबसे कम बली ग्रह **${weakP}** है, जिसके अधिष्ठाता देव की आराधना शुभ रहेगी। सर्वाष्टकवर्ग में कुल **${bindus} बिंदु** जातक की वित्तीय सुदृढ़ता व ऊर्जा संतुलन की पुष्टि करते हैं।\n\n` +
        `🪔 **शुभ वैदिक उपाय:**\n` +
        `• नित्य प्रातः सूर्योदय के समय गायत्री मंत्र का 11 बार जप करें।\n` +
        `• अपने बली ग्रह (${strongP}) के अनुकूल आचरण करें व इष्टदेव को नमन करें।`;
    }

    return `🪐 **Jagannatha Hora Astrological Synthesis for ${name}:**\n\n` +
      `🔱 **1. Atmakaraka (AK) & Karakamsha (Soul's Trajectory):**\n` +
      `Your primary Atmakaraka is **${ak?.planet || 'Planet'}** in **${ak?.sign || 'Sign'}**, with Karakamsha positioned in **${data.karakamsha.sign || 'Sign'}**. This indicates a high spiritual constitution, clear purpose, and resilient willpower.\n\n` +
      `👑 **2. Arudha Lagna (AL) & Social Footprint:**\n` +
      `Arudha Lagna falls in **${al?.occupiedSign || 'Sign'}**, governing external reputation. With Amatyakaraka **${amk?.planet || 'Planet'}**, steady professional ascendancy and managerial dignity are highlighted.\n\n` +
      `💍 **3. Upapada Lagna (UL) & Matrimony:**\n` +
      `Upapada Lagna in **${ul?.occupiedSign || 'Sign'}** bestows marital depth, domestic stability, and mutual commitment.\n\n` +
      `⚡ **4. Shadbala & Ashtakavarga Potency:**\n` +
      `Strongest planet by Shadbala is **${strongP}** (your pillar of strength), while **${weakP}** benefits from remedial propitiation. Total Ashtakavarga bindus (${bindus}) signify robust vitality.\n\n` +
      `🪔 **Vedic Remedies:**\n` +
      `• Recite the Gayatri Mantra 11 times every morning.\n` +
      `• Honor your Ishta Devata and support your ruling planet (${strongP}).`;
  };

  const fetchAISynthesis = async () => {
    if (!horaData) return;
    setIsAiLoading(true);
    try {
      const query = `Provide a comprehensive Jagannatha Hora astrological synthesis for ${horaData.birthDetails.name || 'the native'}.
Atmakaraka: ${horaData.charaKarakas[0]?.planet} in ${horaData.charaKarakas[0]?.sign} (Karakamsha: ${horaData.karakamsha.sign}).
Arudha Lagna (AL): ${horaData.arudhaPadas[0]?.occupiedSign}, Upapada (UL): ${horaData.arudhaPadas[11]?.occupiedSign}.
Strongest Planet (Shadbala): ${horaData.shadbala.strongestPlanet}, Weakest: ${horaData.shadbala.weakestPlanet}.
Sarvashtakavarga Bindus: ${horaData.ashtakavarga.totalBindus} total.
Highlight: 1. Soul Destiny (Karakamsha), 2. Career & Reputation (Dashamsha & Rajya Pada), 3. Marriage & Upapada, 4. Shadbala & Gemstone Advice.`;

      let replyText = '';

      // Try dedicated hora-synthesis endpoint first
      try {
        const res = await fetch('/api/gemini/hora-synthesis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            message: query,
            horaData,
            language,
            source: 'jagannatha',
            isHoraSynthesis: true,
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          replyText = data.reply || data.analysis || data.text || '';
        } else {
          // If HTML error page or non-200, safely consume without throwing SyntaxError
          await res.text().catch(() => '');
        }
      } catch (callErr) {
        console.warn('Backend hora-synthesis call failed, using local Vedic calculation synthesis:', callErr);
      }

      // If remote AI unavailable or empty, fall back seamlessly to calculated Vedic synthesis
      if (!replyText) {
        replyText = generateLocalHoraSynthesis(horaData, language);
      }

      setAiReport(replyText);
    } catch (err) {
      console.error('AI Synthesis error', err);
      if (horaData) {
        setAiReport(generateLocalHoraSynthesis(horaData, language));
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentVargaData = horaData.vargas[selectedVarga] || horaData.vargas['D1'];

  // North Indian Chart House Polygons
  const northPolygons: Record<number, { polygon: string; cx: number; cy: number }> = {
    1: { polygon: '200,200 100,100 200,0 300,100', cx: 200, cy: 110 },
    2: { polygon: '0,0 200,0 100,100', cx: 100, cy: 50 },
    3: { polygon: '0,0 100,100 0,200', cx: 50, cy: 100 },
    4: { polygon: '0,200 100,100 200,200 100,300', cx: 110, cy: 200 },
    5: { polygon: '0,200 100,300 0,400', cx: 50, cy: 300 },
    6: { polygon: '0,400 100,300 200,400', cx: 100, cy: 350 },
    7: { polygon: '200,200 100,300 200,400 300,300', cx: 200, cy: 290 },
    8: { polygon: '200,400 300,300 400,400', cx: 300, cy: 350 },
    9: { polygon: '300,300 400,200 400,400', cx: 350, cy: 300 },
    10: { polygon: '200,200 300,100 400,200 300,300', cx: 290, cy: 200 },
    11: { polygon: '300,100 400,0 400,200', cx: 350, cy: 100 },
    12: { polygon: '200,0 400,0 300,100', cx: 300, cy: 50 },
  };

  const getShortPlanet = (p: string) => {
    switch (p) {
      case 'Sun': return 'Su (सू)';
      case 'Moon': return 'Mo (चं)';
      case 'Mars': return 'Ma (मं)';
      case 'Mercury': return 'Me (बु)';
      case 'Jupiter': return 'Ju (गु)';
      case 'Venus': return 'Ve (शु)';
      case 'Saturn': return 'Sa (श)';
      case 'Rahu': return 'Ra (रा)';
      case 'Ketu': return 'Ke (के)';
      case 'Ascendant': return 'Asc (लग्न)';
      default: return p.substring(0, 2);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🌟 Master 2-Part System Switcher: Part 1 (Free Kundali) & Part 2 (Jagannath Hora Paid) */}
      <KundaliDualPartSwitcher
        activePart="part2"
        onSelectPart={(part) => {
          if (part === 'part1' && onNavigateToPart1) {
            onNavigateToPart1();
          }
        }}
        language={language}
        isPart2Unlocked={isUnlocked}
        onOpenPaywall={onOpenPaywall}
      />

      {/* 👑 Paid Module Upgrade Notice if Locked */}
      {!isUnlocked && (
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-950 to-amber-600/20 border-2 border-amber-400 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-3xl sm:text-4xl shrink-0 shadow-lg ring-2 ring-amber-300">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  {language === 'hi'
                    ? 'जगन्नाथ होरा (स्विस एफिमेरिस) विशेष सशुल्क सेवा (PAID)'
                    : 'Jagannatha Hora (Swiss Ephemeris) Premium Paid Module'}
                </h3>
                <span className="px-2.5 py-1 rounded text-xs font-black bg-amber-400 text-slate-950 uppercase flex items-center gap-1 shadow">
                  PAID <Crown className="w-4 h-4 text-slate-950 shrink-0" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
                {language === 'hi'
                  ? 'सम्पूर्ण १०-पृष्ठीय रिपोर्ट, D1-D60 षोडशवर्ग, आत्मकारक (AK), आरूढ़ पद एवं AI होरा फलित अनलॉक करें।'
                  : 'Unlock 10-page master dossier, D1-D60 vargas, Atmakaraka (AK), Arudha padas & AI analysis.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenPaywall && onOpenPaywall('jagannatha')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300 shrink-0"
          >
            <Crown className="w-5 h-5 text-slate-950 shrink-0" />
            <span>{language === 'hi' ? 'अभी तुरंत अनलॉक करें' : 'Unlock Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 p-6 border border-amber-500/30 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-xl flex items-center justify-center relative">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
                ☸️
              </div>
              <Crown className="w-6 h-6 text-amber-300 absolute -top-2 -right-2 drop-shadow-md animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {language === 'hi' ? 'स्विस एफिमेरिस एवं जगन्नाथ होरा संपूर्ण चार्ट' : 'Swiss Ephemeris & Jagannatha Hora Full Chart'}
                </h1>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-slate-950 text-xs font-black border border-amber-300 shadow-md animate-paid-blink flex items-center gap-1">
                  PAID <Crown className="w-4 h-4 text-slate-950 shrink-0" /> PREMIUM
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                  Swiss Ephemeris + Lahiri
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                {language === 'hi'
                  ? 'षोडशवर्ग (D1-D60), जैमिनी चर कारक, आरूढ़ पद (AL/UL), षड्बल, अष्टकवर्ग, पुष्कर नवांश एवं त्रि-स्तरीय विंशोत्तरी दशा का वैज्ञानिक वैदिक विश्लेषण।'
                  : 'Master Parashari & Jaimini systems: Shodashvargas (D1 to D60), Chara Karakas, Arudha Padas, Shadbala 6-fold strengths, Ashtakavarga, and 3-level Vimshottari dasha tree.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('tenPageReport')}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl transition-all ${
                activeTab === 'tenPageReport'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'hi' ? '📖 सम्पूर्ण १०-पृष्ठीय विश्लेषण' : '📖 Complete 10-Page Dossier'}</span>
              <Crown className="w-5 h-5 text-amber-300 shrink-0 animate-pulse" />
            </button>
            <button
              type="button"
              onClick={fetchAISynthesis}
              disabled={isAiLoading}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
              {isAiLoading
                ? (language === 'hi' ? 'गणना जारी...' : 'Synthesizing...')
                : (language === 'hi' ? 'AI होरा फलित' : 'AI Hora Synthesis')}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Birth Details Form */}
      <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 sm:p-5 shadow-xl">
        <form onSubmit={handleRecalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <div className="lg:col-span-1">
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              {language === 'hi' ? 'जातक का नाम' : 'Native Name'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              {language === 'hi' ? 'जन्म तिथि' : 'Birth Date'}
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              {language === 'hi' ? 'जन्म समय' : 'Birth Time'}
            </label>
            <input
              type="time"
              value={formData.tob}
              onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              {language === 'hi' ? 'जन्म स्थान / गूगल मैप्स' : 'Birth Place / Google Maps'}
            </label>
            <GoogleMapsPlacePicker
              initialPlace={formData.place}
              initialLat={formData.latitude}
              initialLon={formData.longitude}
              initialTz={formData.timezone}
              language={language}
              onSelectPlace={(picked) => {
                setFormData((prev) => ({
                  ...prev,
                  place: picked.name,
                  latitude: picked.latitude,
                  longitude: picked.longitude,
                  timezone: picked.timezone,
                }));
              }}
            />
          </div>

          <div className="lg:col-span-1">
            <button
              type="submit"
              onClick={handleRecalculate}
              className={`w-full font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                isCalculatedFeedback
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white ring-2 ring-emerald-400 font-extrabold shadow-emerald-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isCalculatedFeedback ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>{language === 'hi' ? '✓ गणना सफल!' : '✓ Calculated!'}</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पुनर्गणना' : 'Calculate'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
        {[
          {
            id: 'tenPageReport',
            label: language === 'hi' ? '📖 सम्पूर्ण १०-पृष्ठीय विश्लेषण (10 Full Pages) 👑' : '📖 10-Page Master Dossier 👑',
            icon: BookOpen,
            isHighlighted: true,
          },
          { id: 'vargas', label: language === 'hi' ? 'षोडशवर्ग (D1-D60)' : 'Shodashvarga (D1-D60)', icon: Layers },
          { id: 'karakas', label: language === 'hi' ? 'चर कारक व कारकांश' : 'Chara Karakas (AK/DK)', icon: Crown },
          { id: 'arudhas', label: language === 'hi' ? 'आरूढ़ पद व विशेष लग्न' : 'Arudhas & Special Lagnas', icon: Compass },
          { id: 'shadbala', label: language === 'hi' ? 'षड्बल बल विश्लेषण' : 'Shadbala Strengths', icon: BarChart3 },
          { id: 'ashtakavarga', label: language === 'hi' ? 'अष्टकवर्ग चक्र (SAV)' : 'Ashtakavarga (SAV)', icon: Grid3X3 },
          { id: 'avasthas', label: language === 'hi' ? 'ग्रह अवस्थाएं व पुष्कर' : 'Avasthas & Pushkara', icon: Activity },
          { id: 'dashas', label: language === 'hi' ? 'त्रि-स्तरीय विंशोत्तरी दशा' : '3-Tier Vimshottari Tree', icon: Calendar },
          { id: 'aiSynthesis', label: language === 'hi' ? 'AI जगन्नाथ होरा फलित' : 'AI Hora Synthesis', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : tab.isHighlighted
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 hover:text-white hover:bg-amber-500/30 border border-amber-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 0. TEN-PAGE COMPREHENSIVE HOROSCOPE DOSSIER */}
      {activeTab === 'tenPageReport' && (
        <TenPageJagannathaHoraViewer report={tenPageReport} language={language} />
      )}

      {/* 1. VARGAS TAB */}
      {activeTab === 'vargas' && (
        <div className="space-y-6">
          {/* Varga Selector Chips */}
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                {language === 'hi' ? 'वर्ग चक्र चुनें (Select Varga Chart):' : 'Select Divisional Chart (D1 to D60):'}
              </span>

              {/* North / South Switcher */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setChartStyle('north')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    chartStyle === 'north' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'hi' ? 'उत्तर भारतीय (North)' : 'North'}
                </button>
                <button
                  type="button"
                  onClick={() => setChartStyle('south')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    chartStyle === 'south' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'hi' ? 'दक्षिण भारतीय (South)' : 'South'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {(Object.keys(horaData.vargas) as VargaCode[]).map((code) => {
                const vMeta = horaData.vargas[code];
                const isSelected = selectedVarga === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedVarga(code)}
                    className={`flex flex-col items-center text-center p-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-extrabold text-sm text-white">{code}</span>
                    <span className="text-[10px] truncate max-w-full text-slate-300">
                      {language === 'hi' ? vMeta.hindiName.split(' ')[0] : vMeta.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Varga Info & Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Chart SVG */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                    <span>☸️</span>
                    {language === 'hi' ? currentVargaData.hindiName : `${currentVargaData.name} (${currentVargaData.code})`}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'hi'
                      ? `लग्न राशि: ${currentVargaData.ascendantSignHindi} (${currentVargaData.ascendantSignNumber})`
                      : `Ascendant: ${currentVargaData.ascendantSign} (Sign ${currentVargaData.ascendantSignNumber})`}
                  </p>
                </div>
                <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-md text-[11px] font-mono text-amber-300">
                  Div 1/{currentVargaData.divisionFactor}
                </span>
              </div>

              {/* Diamond Chart (North Indian) */}
              {chartStyle === 'north' ? (
                <div className="w-full max-w-[380px] aspect-square relative bg-slate-950 rounded-xl border-2 border-amber-500/40 p-2 shadow-inner">
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    {/* Outline & lines */}
                    <rect x="0" y="0" width="400" height="400" fill="none" stroke="#b45309" strokeWidth="2" />
                    <line x1="0" y1="0" x2="400" y2="400" stroke="#b45309" strokeWidth="1.5" />
                    <line x1="0" y1="400" x2="400" y2="0" stroke="#b45309" strokeWidth="1.5" />
                    <line x1="200" y1="0" x2="0" y2="200" stroke="#b45309" strokeWidth="1.5" />
                    <line x1="0" y1="200" x2="200" y2="400" stroke="#b45309" strokeWidth="1.5" />
                    <line x1="200" y1="400" x2="400" y2="200" stroke="#b45309" strokeWidth="1.5" />
                    <line x1="400" y1="200" x2="200" y2="0" stroke="#b45309" strokeWidth="1.5" />

                    {/* House Contents */}
                    {currentVargaData.houses.map((house) => {
                      const pos = northPolygons[house.houseNumber];
                      if (!pos) return null;
                      return (
                        <g key={house.houseNumber}>
                          {/* Sign Number */}
                          <text
                            x={pos.cx}
                            y={pos.cy - 16}
                            textAnchor="middle"
                            fill="#f59e0b"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            {house.signNumber}
                          </text>

                          {/* Planets in House */}
                          {house.planets.map((p, pIdx) => (
                            <text
                              key={p.name}
                              x={pos.cx}
                              y={pos.cy + (pIdx * 11)}
                              textAnchor="middle"
                              fill={p.isVargottama ? '#10b981' : p.isPushkara ? '#38bdf8' : '#e2e8f0'}
                              fontSize="9.5"
                              fontWeight="600"
                            >
                              {getShortPlanet(p.name)}
                              {p.isVargottama && ' ★'}
                            </text>
                          ))}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                /* South Indian Square Chart */
                <div className="w-full max-w-[380px] aspect-square grid grid-cols-4 grid-rows-4 bg-slate-950 rounded-xl border-2 border-amber-500/40 p-1 shadow-inner gap-1">
                  {[
                    { signIdx: 11, sign: 'Pisces' },
                    { signIdx: 0, sign: 'Aries' },
                    { signIdx: 1, sign: 'Taurus' },
                    { signIdx: 2, sign: 'Gemini' },
                    { signIdx: 10, sign: 'Aquarius' },
                    { isCenter: true, colSpan: 2, rowSpan: 2 },
                    { signIdx: 3, sign: 'Cancer' },
                    { signIdx: 9, sign: 'Capricorn' },
                    { signIdx: 4, sign: 'Leo' },
                    { signIdx: 8, sign: 'Sagittarius' },
                    { signIdx: 7, sign: 'Scorpio' },
                    { signIdx: 6, sign: 'Libra' },
                    { signIdx: 5, sign: 'Virgo' },
                  ].map((cell, idx) => {
                    if (cell.isCenter) {
                      return (
                        <div
                          key="center"
                          className="col-span-2 row-span-2 bg-amber-950/20 border border-amber-500/20 rounded flex flex-col items-center justify-center p-2 text-center"
                        >
                          <span className="text-xs font-bold text-amber-300">{currentVargaData.code}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-full">
                            {language === 'hi' ? currentVargaData.hindiName.split(' ')[0] : currentVargaData.name}
                          </span>
                        </div>
                      );
                    }

                    const signNum = (cell.signIdx || 0) + 1;
                    const planetsInSign = currentVargaData.planets.filter((p) => p.signNumber === signNum);
                    const isAscSign = currentVargaData.ascendantSignNumber === signNum;

                    return (
                      <div
                        key={idx}
                        className={`bg-slate-900/80 border rounded p-1 flex flex-col justify-between relative overflow-hidden ${
                          isAscSign ? 'border-amber-400 bg-amber-500/10' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-amber-500 font-bold">{signNum}</span>
                          {isAscSign && <span className="text-amber-300 font-bold text-[8px]">ASC</span>}
                        </div>
                        <div className="space-y-0.5 my-auto">
                          {planetsInSign.map((p) => (
                            <div
                              key={p.name}
                              className={`text-[9px] font-semibold truncate ${
                                p.isVargottama ? 'text-emerald-400' : p.isPushkara ? 'text-sky-300' : 'text-slate-200'
                              }`}
                            >
                              {getShortPlanet(p.name)}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Varga Planetary Table & Significance */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'वर्ग चक्र का महत्व एवं फलित' : 'Signification & Vedic Purpose'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'hi' ? currentVargaData.significationHindi : currentVargaData.signification}
                </p>
              </div>

              {/* Planetary Placements in this Varga */}
              <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
                  {language === 'hi'
                    ? `${currentVargaData.code} में ग्रह स्थितियां (Planetary Positions)`
                    : `Planetary Positions in ${currentVargaData.code}`}
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-1.5 font-medium">{language === 'hi' ? 'ग्रह' : 'Planet'}</th>
                        <th className="py-1.5 font-medium">{language === 'hi' ? 'राशि' : 'Sign'}</th>
                        <th className="py-1.5 font-medium">{language === 'hi' ? 'भाव' : 'House'}</th>
                        <th className="py-1.5 font-medium">{language === 'hi' ? 'विशेष' : 'Special'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {currentVargaData.planets.map((p) => (
                        <tr key={p.name} className="hover:bg-slate-800/40">
                          <td className="py-1.5 font-semibold text-white">
                            {language === 'hi' ? p.hindiName : p.name}
                          </td>
                          <td className="py-1.5 text-amber-300">
                            {language === 'hi' ? p.signHindi : p.sign} ({p.signNumber})
                          </td>
                          <td className="py-1.5 text-slate-300">
                            H{p.house} ({p.house}th भाव)
                          </td>
                          <td className="py-1.5">
                            {p.isVargottama && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold mr-1">
                                Vargottama ★
                              </span>
                            )}
                            {p.isPushkara && (
                              <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-semibold">
                                Pushkara ✦
                              </span>
                            )}
                            {!p.isVargottama && !p.isPushkara && <span className="text-slate-500">-</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHARA KARAKAS & KARAKAMSHA TAB */}
      {activeTab === 'karakas' && (
        <div className="space-y-6">
          {/* Karakamsha Lagna Highlight */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">
                    {language === 'hi' ? 'कारकांश लग्न (Karakamsha Lagna): ' : 'Karakamsha Lagna: '}
                    <span className="text-amber-300">
                      {language === 'hi' ? horaData.karakamsha.signHindi : horaData.karakamsha.sign}
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  {language === 'hi'
                    ? `आत्मकारक (${horaData.karakamsha.atmakarakaPlanet}) नवांश चक्र में जिस राशि में स्थित होता है, उसे 'कारकांश लग्न' कहते हैं। यह जातक के जीवन का सर्वोच्च आध्यात्मिक ध्येय, आत्मा का स्वभाव और मोक्ष मार्ग प्रकट करता है।`
                    : `The sign occupied by the Atmakaraka (${horaData.karakamsha.atmakarakaPlanet}) in the Navamsha (D9) chart is Karakamsha. It reveals the soul's primal desire, divine path, and innate spiritual gifts.`}
                </p>
              </div>
              <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
                <span className="text-[10px] text-purple-300 block uppercase font-bold">Atmakaraka Planet</span>
                <span className="text-sm font-extrabold text-amber-300">
                  {horaData.karakamsha.atmakarakaPlanet}
                </span>
              </div>
            </div>
          </div>

          {/* 8 Chara Karakas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {horaData.charaKarakas.map((k, idx) => (
              <div
                key={k.code}
                className="bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                      {k.code} #{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{k.formattedDegree}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {language === 'hi' ? k.titleHindi : k.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <span>{language === 'hi' ? k.hindiName : k.planet}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{language === 'hi' ? k.signHindi : k.sign}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {language === 'hi' ? k.significationHindi : k.signification}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{language === 'hi' ? 'नवांश स्थिति:' : 'Navamsha:'}</span>
                  <span className="font-semibold text-amber-300">
                    {language === 'hi' ? k.karakamshaSignHindi : k.karakamshaSign}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ARUDHAS & SPECIAL LAGNAS TAB */}
      {activeTab === 'arudhas' && (
        <div className="space-y-6">
          {/* Special Lagnas Grid */}
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              {language === 'hi' ? 'विशेष लग्न (Special Lagnas in Jagannatha Hora)' : 'Special Lagnas (Hora, Ghati, Shree, Indu)'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {horaData.specialLagnas.map((sl) => (
                <div
                  key={sl.code}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                        {sl.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{sl.formattedDegree}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">
                      {language === 'hi' ? sl.hindiName : sl.name}
                    </h4>
                    <p className="text-xs font-semibold text-amber-400 mt-0.5">
                      {language === 'hi' ? sl.signHindi : sl.sign} (H{sl.houseFromLagna})
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-tight">
                    {language === 'hi' ? sl.descriptionHindi : sl.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* All 12 Arudha Padas */}
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              {language === 'hi' ? 'द्वादश आरूढ़ पद (12 Arudha Padas - AL, A2-A11, UL)' : '12 Bhava Arudha Padas (AL, A2-A11, UL)'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {horaData.arudhaPadas.map((ap) => (
                <div
                  key={ap.code}
                  className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/30 rounded-xl p-3.5 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                      {ap.code}
                    </span>
                    <span className="text-xs font-semibold text-amber-300">
                      {language === 'hi' ? ap.occupiedSignHindi : ap.occupiedSign} (H{ap.occupiedHouse})
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">
                    {language === 'hi' ? ap.hindiName : ap.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {language === 'hi' ? ap.significationHindi : ap.signification}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SHADBALA TAB */}
      {activeTab === 'shadbala' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                  {language === 'hi' ? 'सर्वोच्च बली ग्रह (Strongest Planet)' : 'Strongest Planet'}
                </span>
                <span className="text-xl font-black text-white mt-0.5 block">
                  {horaData.shadbala.strongestPlanet}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-lg">
                ★
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                  {language === 'hi' ? 'अल्प बली ग्रह (Weakest Planet - Remedy)' : 'Planet Requiring Strengthening'}
                </span>
                <span className="text-xl font-black text-white mt-0.5 block">
                  {horaData.shadbala.weakestPlanet}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 text-lg">
                ⚡
              </div>
            </div>
          </div>

          {/* Detailed Shadbala Table */}
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl overflow-x-auto">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {language === 'hi' ? 'षड्बल छह घटकों का विस्तृत विश्लेषण (6-Fold Strength Matrix)' : '6-Fold Shadbala Breakdown Table'}
            </h3>

            <table className="w-full text-xs text-left min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 font-medium">{language === 'hi' ? 'ग्रह' : 'Planet'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'स्थान' : 'Sthana'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'दिग्' : 'Dig'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'काल' : 'Kaala'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'चेष्टा' : 'Cheshta'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'नैसर्गिक' : 'Naisargika'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'दृग्' : 'Drik'}</th>
                  <th className="py-2 font-bold text-amber-300">{language === 'hi' ? 'कुल रूप' : 'Total Rupas'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'अनुपात' : 'Ratio %'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'रैंक व स्थिति' : 'Verdict'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {horaData.shadbala.planets.map((sp) => (
                  <tr key={sp.planet} className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-white">
                      {language === 'hi' ? sp.hindiName : sp.planet}
                    </td>
                    <td className="py-2.5 text-slate-300">{sp.sthanaBala}</td>
                    <td className="py-2.5 text-slate-300">{sp.digBala}</td>
                    <td className="py-2.5 text-slate-300">{sp.kaalaBala}</td>
                    <td className="py-2.5 text-slate-300">{sp.cheshtaBala}</td>
                    <td className="py-2.5 text-slate-300">{sp.naisargikaBala}</td>
                    <td className="py-2.5 text-slate-300">{sp.drikBala}</td>
                    <td className="py-2.5 font-bold text-amber-300 font-mono">{sp.totalRupas} R</td>
                    <td className="py-2.5 font-mono">
                      <span className={sp.ratio >= 110 ? 'text-emerald-400' : sp.ratio >= 95 ? 'text-amber-300' : 'text-rose-400'}>
                        {sp.ratio}%
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sp.verdict === 'Very Strong' || sp.verdict === 'Strong'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : sp.verdict === 'Moderate'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        #{sp.rank} {language === 'hi' ? sp.verdictHindi : sp.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ASHTAKAVARGA TAB */}
      {activeTab === 'ashtakavarga' && (
        <div className="space-y-6">
          {/* Sarvashtakavarga (SAV) 12 Signs Matrix */}
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  {language === 'hi' ? 'सर्वाष्टकवर्ग रेखांक चक्र (Sarvashtakavarga 12 Bhavas)' : 'Sarvashtakavarga (SAV) 12 Signs Grid'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'hi'
                    ? `कुल बिंदु: ${horaData.ashtakavarga.totalBindus} | 28+ बिंदु शुभ एवं बली माने जाते हैं`
                    : `Total SAV Bindus: ${horaData.ashtakavarga.totalBindus} | 28+ Bindus represent auspicious strength`}
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold">
                {language === 'hi' ? horaData.ashtakavarga.samudayaStrengthHindi : horaData.ashtakavarga.samudayaStrength}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {horaData.ashtakavarga.signBindus.map((sb) => {
                const isVeryStrong = sb.bindus >= 32;
                const isStrong = sb.bindus >= 28 && sb.bindus < 32;
                const isAvg = sb.bindus >= 25 && sb.bindus < 28;

                return (
                  <div
                    key={sb.signNumber}
                    className={`rounded-xl p-3 text-center border flex flex-col justify-between ${
                      isVeryStrong
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : isStrong
                        ? 'bg-sky-950/40 border-sky-500/40 text-sky-300'
                        : isAvg
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold opacity-80">
                      H{sb.houseFromLagna} ({sb.sign.substring(0, 3)})
                    </span>
                    <span className="text-xl font-black my-1 font-mono">{sb.bindus}</span>
                    <span className="text-[9px] uppercase font-semibold">
                      {language === 'hi' ? (isVeryStrong ? 'अति शुभ' : isStrong ? 'शुभ' : isAvg ? 'मध्यम' : 'अल्प') : sb.strength}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bhinnashtakavarga (BAV) Table */}
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl overflow-x-auto">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-3">
              {language === 'hi' ? 'भिन्नाष्टकवर्ग एवं शोध्य पिण्ड (Bhinnashtakavarga & Shodhya Pinda)' : 'Bhinnashtakavarga (BAV) Table'}
            </h3>

            <table className="w-full text-xs text-left min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 font-medium">{language === 'hi' ? 'ग्रह' : 'Planet'}</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => (
                    <th key={s} className="py-2 text-center font-medium">
                      S{s}
                    </th>
                  ))}
                  <th className="py-2 font-bold text-amber-300 text-center">{language === 'hi' ? 'योग' : 'Total'}</th>
                  <th className="py-2 font-medium text-center">{language === 'hi' ? 'शोध्य पिण्ड' : 'Shodhya Pinda'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {horaData.ashtakavarga.planetaryTables.map((pt) => (
                  <tr key={pt.planet} className="hover:bg-slate-800/40">
                    <td className="py-2 font-bold text-white">
                      {language === 'hi' ? pt.hindiName : pt.planet}
                    </td>
                    {pt.bindus.map((b, idx) => (
                      <td key={idx} className="py-2 text-center text-slate-300 font-mono">
                        {b}
                      </td>
                    ))}
                    <td className="py-2 text-center font-bold text-amber-300 font-mono">
                      {pt.totalBindus}
                    </td>
                    <td className="py-2 text-center font-mono text-emerald-400 font-bold">
                      {pt.shodhyaPinda}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. AVASTHAS & PUSHKARA TAB */}
      {activeTab === 'avasthas' && (
        <div className="space-y-6">
          {/* Pushkara Navamsha Highlight */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              {language === 'hi' ? 'पुष्कर नवांश स्थिति (Pushkara Navamsha Blessings)' : 'Pushkara Navamsha Planets'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-3">
              {language === 'hi'
                ? 'पुष्कर नवांश अत्यंत शुभ आत्मिक ऊर्जा क्षेत्र है। इसमें स्थित ग्रह जातक को जीवन के घोर संकटों में भी पुनः प्रतिष्ठित होने की दिव्य शक्ति प्रदान करते हैं।'
                : 'Pushkara Navamsha is the supreme healing zone in Vedic astrology. Planets placed here bestow resilience, purity of karma, and miraculous elevation.'}
            </p>

            {horaData.pushkaraPlanets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {horaData.pushkaraPlanets.map((pp) => (
                  <div
                    key={pp.planet}
                    className="bg-slate-950/80 border border-sky-500/40 rounded-xl p-3 flex items-start gap-3"
                  >
                    <span className="text-lg">✦</span>
                    <div>
                      <span className="text-xs font-bold text-sky-300">
                        {pp.planet} ({pp.degree})
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {language === 'hi' ? pp.benefitHindi : pp.benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                {language === 'hi' ? 'कोई ग्रह सीधे पुष्कर नवांश में नहीं है।' : 'No planets in exact Pushkara Navamsha zones.'}
              </p>
            )}
          </div>

          {/* Avasthas Table */}
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl overflow-x-auto">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {language === 'hi' ? 'ग्रह अवस्थाएं (Baladi, Jagradadi & Deeptadi Avasthas)' : 'Planetary Avasthas & Consciousness States'}
            </h3>

            <table className="w-full text-xs text-left min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 font-medium">{language === 'hi' ? 'ग्रह' : 'Planet'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'बाल्यादि अवस्था' : 'Baladi Avastha'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'जाग्रतादि चेतना' : 'Jagradadi (Awake)'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'दीप्तादि स्वरूप' : 'Deeptadi State'}</th>
                  <th className="py-2 font-medium">{language === 'hi' ? 'विशेष योग' : 'Special Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {horaData.avasthas.map((av) => (
                  <tr key={av.planet} className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-white">
                      {language === 'hi' ? av.hindiName : av.planet}
                    </td>
                    <td className="py-2.5 text-amber-300">
                      {language === 'hi' ? av.baladiHindi : av.baladi}
                    </td>
                    <td className="py-2.5 text-slate-300">
                      {language === 'hi' ? av.jagradadiHindi : av.jagradadi}
                    </td>
                    <td className="py-2.5 text-slate-200">
                      {language === 'hi' ? av.deeptadiHindi : av.deeptadi}
                    </td>
                    <td className="py-2.5">
                      {av.isCombust && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-semibold mr-1">
                          Combust (अस्त)
                        </span>
                      )}
                      {av.isVargottama && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold mr-1">
                          Vargottama ★
                        </span>
                      )}
                      {av.isPushkaraNavamsha && (
                        <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-semibold">
                          Pushkara ✦
                        </span>
                      )}
                      {!av.isCombust && !av.isVargottama && !av.isPushkaraNavamsha && (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. DASHAS TAB */}
      {activeTab === 'dashas' && (
        <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {language === 'hi' ? 'त्रि-स्तरीय विंशोत्तरी दशा वृक्ष (Mahadasha > Antardasha > Pratyantardasha)' : '3-Tier Vimshottari Dasha Hierarchy'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'सटीक तिथि सहित महादशा, अंतर्दशा एवं प्रत्यंतर्दशा की विस्तृत गणना'
                  : 'Nested timeline down to exact sub-periods with real-time active markers'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {horaData.hierarchicalDasha.map((maha) => {
              const isMahaOpen = expandedMaha === maha.mahadasha;
              return (
                <div
                  key={maha.mahadasha}
                  className={`border rounded-xl transition-all ${
                    maha.isCurrent
                      ? 'border-amber-500/60 bg-amber-950/20'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedMaha(isMahaOpen ? null : maha.mahadasha)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isMahaOpen ? (
                        <ChevronDown className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {language === 'hi' ? `${maha.mahadashaHindi} महादशा` : `${maha.mahadasha} Mahadasha`}
                          </span>
                          {maha.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold animate-pulse border border-emerald-500/40">
                              {language === 'hi' ? 'वर्तमान सक्रिय' : 'ACTIVE NOW'}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {maha.startDate} → {maha.endDate} ({maha.durationYears} {language === 'hi' ? 'वर्ष' : 'Years'})
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Antardashas */}
                  {isMahaOpen && (
                    <div className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-800/80">
                      {maha.antardashas.map((antar) => {
                        const isAntarOpen = expandedAntar === antar.antardasha;
                        return (
                          <div
                            key={antar.antardasha}
                            className={`border rounded-lg p-2.5 transition-all ${
                              antar.isCurrent
                                ? 'border-amber-500/40 bg-amber-500/10'
                                : 'border-slate-800/60 bg-slate-900/60'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedAntar(isAntarOpen ? null : antar.antardasha)}
                              className="w-full flex items-center justify-between text-left"
                            >
                              <div className="flex items-center gap-2">
                                {isAntarOpen ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-amber-300" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                )}
                                <span className="text-xs font-semibold text-slate-200">
                                  {language === 'hi' ? `${antar.antardashaHindi} अंतर्दशा` : `${antar.antardasha} Antardasha`}
                                </span>
                                {antar.isCurrent && (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300 text-[9px] font-bold">
                                    Active
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {antar.startDate} → {antar.endDate}
                              </span>
                            </button>

                            {/* Pratyantardashas */}
                            {isAntarOpen && (
                              <div className="mt-2 pt-2 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {antar.pratyantardashas.map((praty) => (
                                  <div
                                    key={praty.pratyantardasha}
                                    className={`p-2 rounded border text-[11px] ${
                                      praty.isCurrent
                                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                                        : 'bg-slate-950/80 border-slate-800/80 text-slate-400'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>
                                        {language === 'hi' ? praty.pratyantardashaHindi : praty.pratyantardasha}
                                      </span>
                                      {praty.isCurrent && <span className="text-emerald-400 text-[9px]">● Current</span>}
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                                      {praty.startDate} → {praty.endDate}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. AI SYNTHESIS TAB */}
      {activeTab === 'aiSynthesis' && (
        <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {language === 'hi' ? 'AI जगन्नाथ होरा फलित एवं मार्गदर्शन' : 'AI Jagannatha Hora Synthesis'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'कारकांश, आरूढ़ पद, षड्बल एवं दशा के समन्वय पर आधारित उच्च-स्तरीय वैदिक विश्लेषण'
                  : 'Comprehensive AI synthesis based on Karakamsha, Arudha Padas, Shadbala, and active Dashas.'}
              </p>
            </div>
            <button
              type="button"
              onClick={fetchAISynthesis}
              disabled={isAiLoading}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
              {isAiLoading ? (language === 'hi' ? 'विश्लेषण जारी...' : 'Analyzing...') : (language === 'hi' ? 'ताज़ा करें' : 'Refresh')}
            </button>
          </div>

          {aiReport ? (
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 bg-slate-950/80 p-5 rounded-xl border border-slate-800 whitespace-pre-line">
              {aiReport}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-2xl">
                ☸️
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'AI जगन्नाथ होरा फलित तैयार करने के लिए ऊपर दिए गए "AI होरा फलित" बटन पर क्लिक करें।'
                  : 'Click "AI Hora Synthesis" to generate a master synthesis of all Jaimini & Parashari parameters.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
