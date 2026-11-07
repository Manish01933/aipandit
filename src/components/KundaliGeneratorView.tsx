import React, { useState } from 'react';
import {
  BirthDetails,
  KundaliResult,
  Language,
} from '../types/astrology';
import { generateKundali } from '../utils/vedicCalculations';
import { lookupCityCoordinates } from '../utils/citiesDatabase';
import { KundaliChartVisualizer } from './KundaliChartVisualizer';
import { GoogleMapsPlacePicker } from './GoogleMapsPlacePicker';
import { exportKundaliPDF } from '../utils/pdfGenerator';
import { checkCanDownloadClientPdf, consumeClientPdfCredit } from '../utils/entitlementManager';
import { getActiveProfile } from '../utils/birthProfileManager';
import { VedicDateTimePicker } from './VedicDateTimePicker';
import {
  Download,
  Sparkles,
  MapPin,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  Flame,
  AlertTriangle,
  FileText,
  Loader2,
  CheckCircle2,
  Layers,
  Globe,
} from 'lucide-react';
import { SampoornKundaliAnalysisView } from './SampoornKundaliAnalysisView';
import { saveOrUpdateProfile } from '../utils/birthProfileManager';

interface KundaliGeneratorViewProps {
  language: Language;
}

const CITY_PRESETS = [
  { name: 'New Delhi, India', lat: 28.6139, lon: 77.209, tz: 5.5 },
  { name: 'Mumbai, India', lat: 19.076, lon: 72.8777, tz: 5.5 },
  { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Kolkata, India', lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: 'Chennai, India', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: 'Hyderabad, India', lat: 17.385, lon: 78.4867, tz: 5.5 },
  { name: 'Varanasi, India', lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.006, tz: -5 },
  { name: 'San Francisco, USA', lat: 37.7749, lon: -122.4194, tz: -8 },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, tz: 4 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 8 },
];

export const KundaliGeneratorView: React.FC<KundaliGeneratorViewProps> = ({ language }) => {
  const getInitialState = (): { form: BirthDetails; result: KundaliResult } => {
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

    try {
      const stored = localStorage.getItem('astrodost_saved_kundali');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.birthDetails) {
          const freshResult = generateKundali(parsed.birthDetails);
          return {
            form: parsed.birthDetails,
            result: freshResult,
          };
        }
      }
    } catch {
      // ignore
    }

    // Default pre-calculated chart so user gets immediate visual data & interactive experience
    const initialResult = generateKundali(defaultForm);
    return {
      form: defaultForm,
      result: initialResult,
    };
  };

  const initialState = getInitialState();
  const [formData, setFormData] = useState<BirthDetails>(initialState.form);
  const [kundali, setKundali] = useState<KundaliResult | null>(initialState.result);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isCalculatedFeedback, setIsCalculatedFeedback] = useState(false);
  const [isPdfFeedback, setIsPdfFeedback] = useState(false);
  const [isAiFeedback, setIsAiFeedback] = useState(false);
  const [pdfNotice, setPdfNotice] = useState<string | null>(null);

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

  const handleGenerate = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    const effectiveName = formData.name?.trim() || (language === 'hi' ? 'जातक' : 'Seeker');
    const placeStr = formData.place?.trim() || 'New Delhi, India';

    // Auto-resolve known city coordinates if present
    const cityMatch = lookupCityCoordinates(placeStr);
    const resolvedLat = cityMatch ? cityMatch.lat : (typeof formData.latitude === 'number' && !isNaN(formData.latitude) ? formData.latitude : 28.6139);
    const resolvedLon = cityMatch ? cityMatch.lon : (typeof formData.longitude === 'number' && !isNaN(formData.longitude) ? formData.longitude : 77.209);
    const resolvedTz = cityMatch ? cityMatch.tz : (typeof formData.timezone === 'number' && !isNaN(formData.timezone) ? formData.timezone : 5.5);

    const safeSubmission: BirthDetails = {
      name: effectiveName,
      gender: formData.gender || 'male',
      dob: formData.dob || '1998-05-15',
      tob: formData.tob || '10:30',
      place: placeStr,
      latitude: resolvedLat,
      longitude: resolvedLon,
      timezone: resolvedTz,
    };

    setFormData(safeSubmission);
    const result = generateKundali(safeSubmission);
    setKundali(result);
    setAiReport(null);
    setIsCalculatedFeedback(true);
    setTimeout(() => setIsCalculatedFeedback(false), 2500);

    try {
      localStorage.setItem('astrodost_saved_kundali', JSON.stringify(result));
      saveOrUpdateProfile({
        birthDetails: safeSubmission,
        chartData: result,
      });
      window.dispatchEvent(new CustomEvent('astrodost_kundali_updated', { detail: result }));
      window.dispatchEvent(new CustomEvent('astrodost_profiles_changed'));
    } catch {
      // ignore
    }

    setTimeout(() => {
      const el = document.getElementById('kundali-results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handleDownloadPDF = async () => {
    if (!kundali) return;
    const active = getActiveProfile();
    const profileId = active?.profile_id || kundali.birthDetails?.name || 'profile_active';
    const check = await checkCanDownloadClientPdf(profileId);

    if (!check.canDownload) {
      const msg = language === 'hi'
        ? (check.reason || 'PDF रिपोर्ट डाउनलोड करने के लिए कृपया "कुंडली रिपोर्ट (₹499)" अथवा "एस्ट्रोदोस्त VIP (₹999/माह)" चुनें।')
        : (check.reason || 'PDF export requires the "Kundli Report (₹499)" or "AstroDost VIP (₹999/mo)" plan.');
      setPdfNotice(msg);
      setTimeout(() => setPdfNotice(null), 8000);
      window.dispatchEvent(
        new CustomEvent('astrodost_open_paywall', { detail: { moduleId: 'plan_kundli_report' } })
      );
      return;
    }

    await consumeClientPdfCredit(profileId);
    setIsPdfFeedback(true);
    setTimeout(() => setIsPdfFeedback(false), 2500);
    exportKundaliPDF(kundali);
  };

  const handleResetData = () => {
    localStorage.removeItem('astrodost_saved_kundali');
    const resetForm: BirthDetails = {
      name: '',
      gender: 'male',
      dob: '1998-01-01',
      tob: '12:00',
      place: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.209,
      timezone: 5.5,
    };
    setFormData(resetForm);
    const result = generateKundali(resetForm);
    setKundali(result);
    setAiReport(null);
    setIsCalculatedFeedback(false);
  };

  const fetchAIAnalysis = async () => {
    if (!kundali) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/kundali-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kundali, language }),
      });
      const data = await res.json();
      setAiReport(data.analysis || 'Analysis generated successfully.');
      setIsAiFeedback(true);
      setTimeout(() => setIsAiFeedback(false), 3000);
    } catch (err) {
      console.error('Failed to fetch AI analysis', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Introduction Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'hi' ? 'प्रामाणिक वैदिक ज्योतिष गणना' : 'Authentic Lahiri Nirayana Ephemeris'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'hi' ? 'वैदिक जन्म कुंडली एवं संपूर्ण फलकथन' : 'Vedic Janampatrika & Life Destiny Chart'}
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            {language === 'hi'
              ? 'जन्म समय, तिथि एवं स्थान के आधार पर सटीक लग्न कुंडली, 9 ग्रह स्थिति, 12 भाव, विंशोत्तरी महादशा, मांगलिक व कालसर्प दोष तथा निःशुल्क पीडीएफ डाउनलोड प्राप्त करें।'
              : 'Calculate precise Ascendant Lagna, planetary degrees, Bhavas, Vimshottari Mahadasha cycles, Doshas, and instant PDF Kundali reports powered by AI.'}
          </p>
        </div>
      </div>

      {/* Input Form & Birth Details */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-base font-bold text-amber-300 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-amber-400" />
          {language === 'hi' ? 'जातक जन्म विवरण दर्ज करें' : 'Enter Native Birth Details'}
        </h3>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder={language === 'hi' ? 'उदा. आरव शर्मा' : 'e.g. Aarav Sharma'}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'hi' ? 'लिंग (Gender)' : 'Gender'}
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="male">{language === 'hi' ? 'पुरुष (Male)' : 'Male'}</option>
              <option value="female">{language === 'hi' ? 'महिला (Female)' : 'Female'}</option>
              <option value="other">{language === 'hi' ? 'अन्य (Other)' : 'Other'}</option>
            </select>
          </div>

          {/* Date & Time of Birth (Interactive Selectors & Native Pickers) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <VedicDateTimePicker
              dob={formData.dob}
              tob={formData.tob}
              onDobChange={(newDob) => setFormData((prev) => ({ ...prev, dob: newDob }))}
              onTobChange={(newTob) => setFormData((prev) => ({ ...prev, tob: newTob }))}
              language={language}
              dobLabel={language === 'hi' ? 'जन्म तिथि (Date of Birth) *' : 'Date of Birth *'}
              tobLabel={language === 'hi' ? 'जन्म समय (Time of Birth) *' : 'Time of Birth *'}
            />
          </div>

          {/* Place / Google Maps Search */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              {language === 'hi' ? 'जन्म स्थान / गूगल मैप्स (Birth City / Google Maps)' : 'Birth Place (Google Maps Geocoding)'}
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

          {/* Submit & Reset Action */}
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
            <button
              id="generate-kundali-btn"
              type="submit"
              className={`relative flex-1 font-bold py-2.5 px-4 rounded-xl text-sm shadow-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                isCalculatedFeedback
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/40 ring-4 ring-emerald-400/50 scale-[1.02]'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 hover:scale-[1.02]'
              }`}
            >
              {isCalculatedFeedback ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white animate-pulse" />
                  <span className="font-extrabold">{language === 'hi' ? '✓ कुंडली तैयार!' : '✓ Calculated!'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'hi' ? 'कुंडली बनाएं' : 'Calculate Kundali'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleResetData}
              title="Clear form and saved chart"
              className="bg-slate-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/40 p-2.5 rounded-xl text-xs transition-all active:scale-90"
            >
              {language === 'hi' ? 'रीसेट' : 'Reset'}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Kundali Results */}
      {!kundali ? (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl">
            ✨
          </div>
          <h4 className="text-base font-bold text-white">
            {language === 'hi' ? 'कोई जन्म कुंडली डेटा लोड नहीं है' : 'No Kundali Loaded'}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {language === 'hi'
              ? 'कृपया ऊपर अपना सही नाम, जन्म तिथि, समय एवं स्थान दर्ज करके "कुंडली बनाएं" पर क्लिक करें। आपकी संपूर्ण जन्मपत्रिका तुरंत तैयार हो जाएगी।'
              : 'Please enter your name, date of birth, birth time, and location above and click "Calculate Kundali" to generate your full Vedic chart.'}
          </p>
        </div>
      ) : (
        <div id="kundali-results-section" className="space-y-6">
          {/* Active Calculation Details Badge */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                👤
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">
                    {language === 'hi' ? 'वर्तमान गणना जातक:' : 'Calculated Chart For:'}
                  </span>
                  <span className="text-sm font-bold text-amber-300">
                    {kundali.birthDetails.name || (language === 'hi' ? 'जातक' : 'Native')}
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                  <span>📅 <strong>{kundali.birthDetails.dob}</strong></span>
                  <span>⏰ <strong>{kundali.birthDetails.tob}</strong></span>
                  <span>📍 <strong>{kundali.birthDetails.place}</strong></span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                ✓ {language === 'hi' ? 'स्विस एफिमेरिस (लाहिड़ी अयनांश)' : 'Swiss Ephemeris (Lahiri)'}
              </span>
            </div>
          </div>

          {/* Key Astro Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                {language === 'hi' ? 'लग्न राशि' : 'Ascendant'}
              </span>
              <p className="text-base font-bold text-amber-300 mt-1">{kundali.ascendantSign}</p>
              <p className="text-[10px] text-slate-400">{kundali.ascendantDegree}</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                {language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}
              </span>
              <p className="text-base font-bold text-amber-300 mt-1">{kundali.moonSign}</p>
              <p className="text-[10px] text-slate-400">{kundali.moonSignHindi}</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                {language === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}
              </span>
              <p className="text-base font-bold text-amber-300 mt-1">{kundali.sunSign}</p>
              <p className="text-[10px] text-slate-400">{kundali.sunSignHindi}</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                {language === 'hi' ? 'जन्म नक्षत्र' : 'Nakshatra'}
              </span>
              <p className="text-base font-bold text-amber-300 mt-1">{kundali.birthNakshatra}</p>
              <p className="text-[10px] text-slate-400">Lord: {kundali.nakshatraLord}</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                {language === 'hi' ? 'मांगलिक स्थिति' : 'Manglik Status'}
              </span>
              <p
                className={`text-sm font-bold mt-1 ${
                  kundali.dosha.isManglik ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {kundali.dosha.isManglik ? (language === 'hi' ? 'मांगलिक दोष' : 'Manglik (75%)') : (language === 'hi' ? 'अनिंद्य (Non-Manglik)' : 'Non-Manglik')}
              </p>
              <p className="text-[10px] text-slate-400">{kundali.dosha.isManglik ? 'Remedies Apply' : 'Clean'}</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                {language === 'hi' ? 'पीडीएफ रिपोर्ट' : 'PDF Export'}
              </span>
              <button
                id="btn-download-kundali-pdf"
                type="button"
                onClick={handleDownloadPDF}
                className={`mt-1 text-xs font-bold py-1 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  isPdfFeedback
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 font-extrabold'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isPdfFeedback ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                    {language === 'hi' ? '✓ डाउनलोड...' : '✓ Downloading...'}
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    {language === 'hi' ? 'डाउनलोड' : 'Download'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PDF Restriction Notification */}
          {pdfNotice && (
            <div className="bg-gradient-to-r from-amber-950/90 to-slate-950 border border-amber-500/50 p-3 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-200 shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-base">🔒</span>
                <span className="font-medium font-devanagari">{pdfNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('astrodost_open_paywall', { detail: { moduleId: 'plan_kundli_report' } })
                  );
                }}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs shrink-0 cursor-pointer transition-all"
              >
                {language === 'hi' ? 'प्लान अनलॉक करें' : 'Unlock Plan'}
              </button>
            </div>
          )}

          {/* Visual Interactive Kundali Chart with Dynamic D1 to D60 Support */}
          <KundaliChartVisualizer
            houses={kundali.houses}
            ascendantSign={kundali.ascendantSign}
            language={language}
            birthDetails={kundali.birthDetails}
          />

          {/* Planetary Placements Table */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                {language === 'hi' ? 'ग्रह स्थिति एवं बल (Planetary Positions)' : 'Planetary Positions & Dignities'}
              </h3>
              <span className="text-xs text-slate-400 font-mono">Lahiri Ayanamsha (23° 51')</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'ग्रह (Planet)' : 'Planet'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'राशि (Sign)' : 'Rashi (Sign)'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'अंश' : 'Degrees'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'भाव' : 'House'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'नक्षत्र व पद' : 'Nakshatra & Pada'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'गति' : 'Motion'}</th>
                    <th className="py-2.5 px-3">{language === 'hi' ? 'बल (Dignity)' : 'Dignity'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {kundali.planets.map((planet) => (
                    <tr key={planet.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-amber-300">
                        {language === 'hi' ? (
                          <>
                            {planet.hindiName.split(' ')[0]}
                            <span className="text-slate-400 text-[11px] ml-1 font-normal">
                              ({planet.name})
                            </span>
                          </>
                        ) : (
                          planet.name
                        )}
                      </td>
                      <td className="py-2.5 px-3">{language === 'hi' ? planet.signHindi : planet.sign}</td>
                      <td className="py-2.5 px-3 font-mono">{planet.formattedDegree}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-200">H{planet.house}</td>
                      <td className="py-2.5 px-3">
                        {planet.nakshatra} <span className="text-slate-400">(Pada {planet.pada})</span>
                      </td>
                      <td className="py-2.5 px-3">
                        {planet.isRetrograde ? (
                          <span className="text-rose-400 font-bold">
                            {language === 'hi' ? 'वक्र (Vakri R)' : 'Vakri (R)'}
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            {language === 'hi' ? 'मार्गी (Direct)' : 'Direct'}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            planet.dignity === 'Exalted'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : planet.dignity === 'Debilitated'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : planet.dignity === 'Own'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {language === 'hi' ? planet.dignityHindi : planet.dignity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vimshottari Mahadasha Timeline */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-base font-bold text-amber-300 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              {language === 'hi' ? 'विंशोत्तरी महादशा चक्र (Vimshottari Dasha Timeline)' : 'Vimshottari Mahadasha Cycle (120 Years)'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'hi'
                ? 'जन्म नक्षत्र स्वामी के आधार पर 120 वर्षों का ग्रह दशा चक्र। वर्तमान सक्रिय दशा पर विशेष ध्यान दें।'
                : 'Planetary periods unfolding lifetime events. Pay keen attention to the active Mahadasha lord.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {kundali.dashaPeriods.map((dasha) => (
                <div
                  key={dasha.planet}
                  className={`p-3 rounded-xl border transition-all ${
                    dasha.current
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-sm">
                      {language === 'hi'
                        ? `${dasha.hindiName.split(' ')[0]} (${dasha.planet})`
                        : dasha.planet}
                    </span>
                    {dasha.current && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                        {language === 'hi' ? 'वर्तमान दशा' : 'ACTIVE NOW'}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-300 mt-2">
                    <span className="font-mono">{dasha.startDate} - {dasha.endDate}</span>
                    <span className="text-slate-400 text-[11px]">{dasha.durationYears} Years</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dosha & Vedic Yogas Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dosha Breakdown */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
              <h3 className="text-base font-bold text-amber-300 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {language === 'hi' ? 'दोष विश्लेषण एवं शांति उपाय' : 'Dosha Analysis & Vedic Remedies'}
              </h3>

              <div className="space-y-4 text-xs">
                {/* Manglik */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-200">
                      {language === 'hi' ? 'मांगलिक विचार (Manglik Dosha)' : 'Manglik Dosha Status'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        kundali.dosha.isManglik
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {kundali.dosha.isManglik ? 'Manglik Present' : 'Non-Manglik'}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {language === 'hi' ? kundali.dosha.manglikDescriptionHindi : kundali.dosha.manglikDescription}
                  </p>
                </div>

                {/* Kalsarp */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-200">
                      {language === 'hi' ? 'कालसर्प योग (Kalsarp Yoga)' : 'Kalsarp Yoga Status'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        kundali.dosha.isKalsarp
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {kundali.dosha.isKalsarp ? kundali.dosha.kalsarpType : 'No Kalsarp'}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {language === 'hi' ? kundali.dosha.kalsarpDescriptionHindi : kundali.dosha.kalsarpDescription}
                  </p>
                </div>

                {/* Sade Sati */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-200">
                      {language === 'hi' ? 'शनि साढ़ेसाती (Saturn Sade Sati)' : 'Saturn Sade Sati'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {kundali.dosha.isSadeSati ? kundali.dosha.sadeSatiPhase : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {language === 'hi' ? kundali.dosha.sadeSatiDescriptionHindi : kundali.dosha.sadeSatiDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Auspicious Vedic Yogas */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {language === 'hi' ? 'कुंडली के शुभ योग (Auspicious Vedic Yogas)' : 'Auspicious Vedic Yogas & Raj Yogas'}
                  </h3>
                  <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {kundali.yogas.length} {language === 'hi' ? 'शुभ योग उपस्थित' : 'Active Yogas'}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs max-h-[460px] overflow-y-auto pr-1">
                  {kundali.yogas.map((yoga, idx) => (
                    <div
                      key={yoga.id || `yoga-${idx}`}
                      className="bg-slate-950/85 p-3.5 rounded-xl border border-slate-800/90 hover:border-amber-500/40 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-amber-300 text-sm">
                            {language === 'hi' && yoga.nameHindi ? yoga.nameHindi : yoga.name}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {language === 'hi' && yoga.categoryLabelHindi ? yoga.categoryLabelHindi : yoga.categoryLabel}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border ${
                            yoga.strength === 'Exceptional'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {language === 'hi' && yoga.strengthHindi ? yoga.strengthHindi : yoga.strength}
                        </span>
                      </div>

                      {/* Formation / Planetary alignment */}
                      <div className="mt-2 text-[11px] text-amber-200/90 bg-slate-900/90 p-2 rounded-lg border border-slate-800 flex items-start gap-1.5">
                        <span className="text-slate-400 font-semibold shrink-0">
                          {language === 'hi' ? 'ग्रह स्थिति:' : 'Formation:'}
                        </span>
                        <span>{language === 'hi' && yoga.formationHindi ? yoga.formationHindi : yoga.formation}</span>
                      </div>

                      {/* Classical description */}
                      <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                        {language === 'hi' && yoga.descriptionHindi ? yoga.descriptionHindi : yoga.description}
                      </p>

                      {/* Life impact */}
                      <div className="mt-2 text-slate-100 font-medium bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/30 flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold shrink-0">
                          {language === 'hi' ? 'शुभ फल प्रभाव:' : 'Life Blessing:'}
                        </span>
                        <span className="text-emerald-200/95 leading-relaxed">
                          {language === 'hi' && yoga.impactHindi ? yoga.impactHindi : yoga.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Astrologer Reading Action */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  id="btn-ai-kundali-analysis"
                  type="button"
                  onClick={fetchAIAnalysis}
                  disabled={isAnalyzing}
                  className={`w-full font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${
                    isAiFeedback
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white ring-4 ring-emerald-400/50 scale-[1.01]'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:opacity-90 text-white'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {language === 'hi' ? 'AI ज्योतिषी विश्लेषण कर रहे हैं...' : 'Consulting AI Jyotish Guru...'}
                    </>
                  ) : isAiFeedback ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white animate-pulse" />
                      <span>{language === 'hi' ? '✓ AI फलकथन तैयार!' : '✓ AI Reading Generated!'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {language === 'hi' ? 'AI संपूर्ण कुंडली फलकथन प्राप्त करें' : 'Generate Full AI Kundali Reading'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Comprehensive Analysis Card (if generated) */}
          {aiReport && (
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 rounded-2xl border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-lg mb-4">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {language === 'hi' ? 'आचार्य एस्ट्रोदोस्त AI फलकथन एवं परामर्श' : 'Acharya AstroDost AI Comprehensive Astrological Guidance'}
              </div>
              <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {aiReport}
              </div>
            </div>
          )}

          {/* ✨ सम्पूर्ण कुंडली विश्लेषण (AI Experience) Feature */}
          {kundali && (
            <SampoornKundaliAnalysisView
              kundali={kundali}
              language={language}
              selectedModel="auto"
            />
          )}
        </div>
      )}
    </div>
  );
};
