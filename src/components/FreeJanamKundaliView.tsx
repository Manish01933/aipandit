import React, { useState, useEffect } from 'react';
import {
  BirthDetails,
  KundaliResult,
  Language,
} from '../types/astrology';
import { generateKundali } from '../utils/vedicCalculations';
import { lookupCityCoordinates } from '../utils/citiesDatabase';
import { GoogleMapsPlacePicker } from './GoogleMapsPlacePicker';
import { VedicDateTimePicker } from './VedicDateTimePicker';
import {
  saveOrUpdateProfile,
  getSavedProfiles,
  getActiveProfile,
  BirthProfileRecord,
} from '../utils/birthProfileManager';
import { KundaliDashboardSummary } from './KundaliDashboardSummary';
import { KundaliHistoryModal } from './KundaliHistoryModal';
import { KundaliDualPartSwitcher } from './KundaliDualPartSwitcher';
import {
  Sparkles,
  MapPin,
  Clock,
  Calendar,
  User,
  Shield,
  Zap,
  Heart,
  History as HistoryIcon,
  ArrowRight,
  PlusCircle,
  Eye,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface FreeJanamKundaliViewProps {
  language: Language;
  onNavigateToPaid?: (tab: string) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenAdminPortal?: () => void;
  isAdminUnlocked?: boolean;
  isPart2Unlocked?: boolean;
  onOpenPaywall?: (moduleId: string) => void;
}

const CITY_PRESETS = [
  { name: 'New Delhi, India', lat: 28.6139, lon: 77.209, tz: 5.5 },
  { name: 'Mumbai, India', lat: 19.076, lon: 72.8777, tz: 5.5 },
  { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Kolkata, India', lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: 'Chennai, India', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: 'Varanasi, India', lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: 'Ayodhya, India', lat: 26.7922, lon: 82.1998, tz: 5.5 },
  { name: 'Ujjain, India', lat: 23.1765, lon: 75.7885, tz: 5.5 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.006, tz: -5 },
];

export const FreeJanamKundaliView: React.FC<FreeJanamKundaliViewProps> = ({
  language,
  onNavigateToPaid,
  onNavigateTab,
  onOpenAdminPortal,
  isAdminUnlocked,
  isPart2Unlocked = false,
  onOpenPaywall,
}) => {
  const getInitialForm = (): BirthDetails => {
    try {
      const active = getActiveProfile();
      if (active && active.chartData?.birthDetails) {
        return active.chartData.birthDetails;
      }
      const stored = localStorage.getItem('astrodost_saved_kundali');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.birthDetails) {
          return parsed.birthDetails;
        }
      }
    } catch {
      // ignore
    }
    return {
      name: language === 'hi' ? 'आरव शर्मा' : 'Aarav Sharma',
      gender: 'male',
      dob: '1998-05-15',
      tob: '10:30',
      place: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.209,
      timezone: 5.5,
    };
  };

  const [formData, setFormData] = useState<BirthDetails>(getInitialForm);
  const [kundali, setKundali] = useState<KundaliResult>(() => generateKundali(getInitialForm()));
  const [savedProfilesCount, setSavedProfilesCount] = useState<number>(0);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Hierarchical view flow state: 'form' (Get Started) vs 'dashboard' (Summary & AI Station)
  const [viewMode, setViewMode] = useState<'form' | 'dashboard'>(() => {
    try {
      const stored = localStorage.getItem('astrodost_saved_kundali');
      const profiles = getSavedProfiles();
      return (stored || profiles.length > 0) ? 'dashboard' : 'form';
    } catch {
      return 'form';
    }
  });

  useEffect(() => {
    const refreshProfiles = () => {
      const profiles = getSavedProfiles();
      setSavedProfilesCount(profiles.length);
      const active = getActiveProfile();
      if (active) {
        setActiveProfileId(active.profile_id);
      }
    };
    refreshProfiles();

    const handleProfileChanged = (e: any) => {
      const p = e.detail as BirthProfileRecord;
      if (p) {
        handleSelectFromHistory(p);
      }
    };

    const handleNewKundaliReq = () => {
      handleNewKundaliForm();
    };

    const handleKundaliUpdated = (e: any) => {
      const k = e.detail as KundaliResult;
      if (k && k.birthDetails) {
        setFormData(k.birthDetails);
        setKundali(k);
        setViewMode('dashboard');
      }
    };

    window.addEventListener('astrodost_profiles_changed', refreshProfiles);
    window.addEventListener('astrodost_profile_changed', handleProfileChanged);
    window.addEventListener('astrodost_new_kundali_requested', handleNewKundaliReq);
    window.addEventListener('astrodost_kundali_updated', handleKundaliUpdated);

    return () => {
      window.removeEventListener('astrodost_profiles_changed', refreshProfiles);
      window.removeEventListener('astrodost_profile_changed', handleProfileChanged);
      window.removeEventListener('astrodost_new_kundali_requested', handleNewKundaliReq);
      window.removeEventListener('astrodost_kundali_updated', handleKundaliUpdated);
    };
  }, []);

  const handleGenerate = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    const effectiveName = formData.name?.trim() || (language === 'hi' ? 'जातक' : 'Seeker');
    const placeStr = formData.place?.trim() || 'New Delhi, India';

    // Prioritize exact coordinates
    const hasExplicitCoords =
      typeof formData.latitude === 'number' &&
      !isNaN(formData.latitude) &&
      typeof formData.longitude === 'number' &&
      !isNaN(formData.longitude);

    const cityMatch = !hasExplicitCoords ? lookupCityCoordinates(placeStr) : null;
    const resolvedLat = hasExplicitCoords ? formData.latitude : (cityMatch ? cityMatch.lat : 28.6139);
    const resolvedLon = hasExplicitCoords ? formData.longitude : (cityMatch ? cityMatch.lon : 77.209);
    const resolvedTz =
      hasExplicitCoords && typeof formData.timezone === 'number' && !isNaN(formData.timezone)
        ? formData.timezone
        : (cityMatch ? cityMatch.tz : 5.5);

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
    const kRes = generateKundali(safeSubmission);
    setKundali(kRes);

    // Persist into History
    try {
      localStorage.setItem('astrodost_saved_kundali', JSON.stringify(kRes));
      const { profile } = saveOrUpdateProfile({
        birthDetails: safeSubmission,
        chartData: kRes,
      });
      setActiveProfileId(profile.profile_id);
      setSavedProfilesCount(getSavedProfiles().length);
      window.dispatchEvent(new CustomEvent('astrodost_kundali_updated', { detail: kRes }));
      window.dispatchEvent(new CustomEvent('astrodost_profiles_changed'));
    } catch (err) {
      console.warn('Error saving to history profile:', err);
    }

    // Transition smoothly to personalized dashboard summary
    setViewMode('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromHistory = (profile: BirthProfileRecord) => {
    const details = profile.chartData?.birthDetails || {
      name: profile.full_name,
      gender: 'male',
      dob: profile.date_of_birth,
      tob: profile.exact_time_of_birth,
      place: profile.birthplace,
      latitude: profile.latitude,
      longitude: profile.longitude,
      timezone: profile.timezone,
    };

    setFormData(details);
    setKundali(profile.chartData || generateKundali(details));
    setActiveProfileId(profile.profile_id);
    setViewMode('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewKundaliForm = () => {
    setFormData({
      name: '',
      gender: 'male',
      dob: '1998-05-15',
      tob: '10:30',
      place: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.209,
      timezone: 5.5,
    });
    setViewMode('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* 🌟 Master 2-Part System Switcher: Part 1 (Free Kundali) & Part 2 (Jagannath Hora Paid) */}
      <KundaliDualPartSwitcher
        activePart="part1"
        onSelectPart={(part) => {
          if (part === 'part2') {
            if (onNavigateToPaid) {
              onNavigateToPaid('jagannatha');
            } else if (onNavigateTab) {
              onNavigateTab('jagannatha');
            }
          }
        }}
        language={language}
        isPart2Unlocked={isPart2Unlocked}
        onOpenPaywall={onOpenPaywall}
      />

      {/* ======================================================== */}
      {/* VIEW MODE A: PERSONALIZED KUNDALI DASHBOARD SUMMARY       */}
      {/* (Rashi, Lagna, Dasha, 9 Planets, D1-D60, AI Consultation) */}
      {/* ======================================================== */}
      {viewMode === 'dashboard' ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Quick Status Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-950 border border-emerald-500/40 rounded-2xl p-3 sm:p-4 text-xs shadow-md">
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {language === 'hi'
                  ? `✨ ${formData.name || 'जातक'} का सम्पूर्ण बायोडाटा एवं कुंडली सक्रिय है`
                  : `✨ Active Kundali Bio-Data for ${formData.name || 'Seeker'}`}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <HistoryIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'hi' ? `कुंडली हिस्ट्री (${savedProfilesCount})` : `History (${savedProfilesCount})`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleNewKundaliForm}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'नई कुंडली बनाएं' : 'New Kundali'}</span>
              </button>
            </div>
          </div>

          {/* Master Dashboard Summary */}
          <KundaliDashboardSummary
            key={`${formData.name}-${formData.dob}-${formData.tob}-${activeProfileId}-${kundali.ascendantSign}`}
            formData={formData}
            kundali={kundali}
            language={language}
            onEditForm={() => setViewMode('form')}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            onNavigateTab={onNavigateTab}
            savedProfileId={activeProfileId}
          />
        </div>
      ) : (
        /* ======================================================== */
        /* VIEW MODE B: 'GET STARTED' KUNDALI INPUT FORM (INITIAL)  */
        /* ======================================================== */
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
          {/* 4-Step Professional Workflow Indicator */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
              <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/60 text-amber-300 flex items-center justify-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                  1
                </span>
                <span>{language === 'hi' ? 'जन्म विवरण भरें' : '1. Enter Birth Data'}</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                <span>{language === 'hi' ? 'सम्पूर्ण बायोडाटा' : '2. Bio-Data & Charts'}</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                <span>{language === 'hi' ? 'विशेष हाईलाइट' : '3. AI Highlight'}</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                  4
                </span>
                <span>{language === 'hi' ? 'AI व होरा परामर्श' : '4. AI Jyotish & JHora'}</span>
              </div>
            </div>
          </div>

          {/* Master Form Card */}
          <div className="bg-[#031a15] rounded-[28px] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header with History Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-900/60 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-400/20 border border-amber-400/50 text-amber-300">
                    STEP 1 • GET STARTED
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    100% FREE
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {language === 'hi' ? 'जन्म कुंडली विवरण दर्ज करें' : 'Enter Birth Details for Kundali'}
                </h1>
                <p className="text-emerald-300/80 text-xs sm:text-sm mt-0.5">
                  {language === 'hi'
                    ? 'अपनी सही जन्म जानकारी दर्ज करें — तुरंत विस्तृत लग्न, राशि, महादशा व AI विश्लेषण पाएं।'
                    : 'Enter accurate birth details to instantly generate complete Lagna, Rashi, Dasha and AI synthesis.'}
                </p>
              </div>

              {/* History & Previous Kundali Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/50 font-bold text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <HistoryIcon className="w-4 h-4 text-amber-400" />
                  <span>
                    {language === 'hi' ? `कुंडली हिस्ट्री (${savedProfilesCount})` : `History (${savedProfilesCount})`}
                  </span>
                </button>

                {savedProfilesCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setViewMode('dashboard')}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-600/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    title={language === 'hi' ? 'पिछली कुंडली देखें' : 'View Last Kundali'}
                  >
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">{language === 'hi' ? 'पिछली कुंडली' : 'Last Chart'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Input Form Fields */}
            <form onSubmit={handleGenerate} className="mt-6 space-y-5 relative z-10">
              {/* Row 1: Name and Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                    {language === 'hi' ? 'पूरा नाम (Full Name) *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === 'hi' ? 'उदा. आरव शर्मा' : 'e.g. Aarav Sharma'}
                      className="w-full bg-[#02130f] border border-emerald-800/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-colors placeholder:text-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                    {language === 'hi' ? 'लिंग (Gender) *' : 'Gender *'}
                  </label>
                  <div className="relative">
                    <span className="text-sm absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">⚥</span>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full bg-[#02130f] border border-emerald-800/80 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-colors cursor-pointer appearance-none"
                    >
                      <option value="male" className="bg-[#031a15] text-white">
                        {language === 'hi' ? 'पुरुष (Male)' : 'Male'}
                      </option>
                      <option value="female" className="bg-[#031a15] text-white">
                        {language === 'hi' ? 'महिला (Female)' : 'Female'}
                      </option>
                      <option value="other" className="bg-[#031a15] text-white">
                        {language === 'hi' ? 'अन्य (Other)' : 'Other'}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Date & Time Picker */}
              <VedicDateTimePicker
                dob={formData.dob}
                tob={formData.tob}
                onDobChange={(newDob) => setFormData((prev) => ({ ...prev, dob: newDob }))}
                onTobChange={(newTob) => setFormData((prev) => ({ ...prev, tob: newTob }))}
                language={language}
                dobLabel={language === 'hi' ? 'जन्म तिथि (Date of Birth) *' : 'Date of Birth *'}
                tobLabel={language === 'hi' ? 'जन्म समय (Time of Birth) *' : 'Time of Birth *'}
              />

              {/* Row 3: Place of Birth + Google Maps Picker */}
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5 flex items-center justify-between">
                  <span>
                    {language === 'hi'
                      ? 'जन्म स्थान / गूगल मैप्स (सटीक अक्षांश व रेखांश हेतु) *'
                      : 'Birth Place / Google Maps (Precise Lat & Lon Coordinates) *'}
                  </span>
                  <span className="text-[10px] text-amber-400 font-normal">
                    {language === 'hi' ? 'सत्यापित निर्देशांक' : 'Verified Coordinates'}
                  </span>
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

                {/* City Preset Shortcuts */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[11px] text-emerald-300 font-semibold mr-1">
                    {language === 'hi' ? 'प्रमुख शहर:' : 'Popular Cities:'}
                  </span>
                  {CITY_PRESETS.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          place: city.name,
                          latitude: city.lat,
                          longitude: city.lon,
                          timezone: city.tz,
                        }));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-[11px] text-emerald-200 border border-emerald-800/80 transition-colors cursor-pointer"
                    >
                      {city.name.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-4 px-6 rounded-2xl text-base sm:text-lg shadow-xl shadow-amber-500/25 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
                  <span className="tracking-wide">
                    {language === 'hi'
                      ? '✨ जन्म कुंडली व सम्पूर्ण बायोडाटा बनाएं'
                      : '✨ Generate Kundali & Full Bio-Data'}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center font-bold text-sm ml-2 group-hover:translate-x-1 transition-transform">
                    ➔
                  </div>
                </button>
              </div>

              {/* Security Note */}
              <div className="text-center pt-1 text-xs text-emerald-400/80 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {language === 'hi'
                    ? 'आपकी जानकारी पूरी तरह सुरक्षित है और कुंडली इतिहास में सुरक्षित रहेगी'
                    : 'Your information is 100% private and automatically archived in Kundali History'}
                </span>
              </div>
            </form>
          </div>

          {/* Trust Pillars */}
          <div className="bg-[#dcf4e6] border border-emerald-300/80 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-emerald-200">
              <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-emerald-700">
                  <Shield className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {language === 'hi' ? 'सुरक्षित इतिहास' : 'Saved History'}
                  </h4>
                  <p className="text-[11px] text-emerald-900">
                    {language === 'hi' ? 'हर कुंडली ID के साथ सुरक्षित' : 'Every Kundali saved with ID'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-emerald-700">
                  <User className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {language === 'hi' ? 'वैदिक प्रामाणिक' : 'Authentic Vedic'}
                  </h4>
                  <p className="text-[11px] text-emerald-900">
                    {language === 'hi' ? 'पाराशर व जैमिनी सिद्धांत' : 'Parashari & Jaimini Rules'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-emerald-700">
                  <Zap className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {language === 'hi' ? 'त्वरित बायोडाटा' : 'Instant Bio-Data'}
                  </h4>
                  <p className="text-[11px] text-emerald-900">
                    {language === 'hi' ? 'लग्न, राशि व महादशा' : 'Lagna, Rashi & Dasha'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-emerald-700">
                  <Heart className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {language === 'hi' ? 'AI गुरु परामर्श' : 'AI Astrologer'}
                  </h4>
                  <p className="text-[11px] text-emerald-900">
                    {language === 'hi' ? 'सीधे प्रश्न पूछें' : 'Deep chart synthesis'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kundali History Drawer / Modal */}
      <KundaliHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSavedProfilesCount(getSavedProfiles().length);
        }}
        onSelectProfile={handleSelectFromHistory}
        onNewKundali={handleNewKundaliForm}
        language={language}
      />
    </div>
  );
};
