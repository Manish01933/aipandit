import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Download,
  BookOpen,
  Sparkles,
  Layers,
  History as HistoryIcon,
  Trash2,
  Compass,
  ArrowRight,
  ShieldCheck,
  Globe,
  Award,
  User,
  X,
  Search,
} from 'lucide-react';
import { Language, BirthDetails, KundaliResult } from '../types/astrology';
import { generateKundali } from '../utils/vedicCalculations';
import {
  generateTwentyPageKundaliReport,
  saveLifeReport,
  getSavedLifeReports,
  deleteSavedLifeReport,
  SavedKundaliLifeReport,
} from '../utils/twentyPageKundaliEngine';
import { exportTwentyPageKundaliPDF } from '../utils/twentyPagePdfGenerator';
import { TwentyPageKundaliReaderModal } from './TwentyPageKundaliReaderModal';
import { KNOWN_CITIES, lookupCityCoordinates } from '../utils/citiesDatabase';
import { GoogleMapsPlacePicker } from './GoogleMapsPlacePicker';
import { VedicDateTimePicker } from './VedicDateTimePicker';
import { saveOrUpdateProfile } from '../utils/birthProfileManager';

interface Props {
  language: Language;
  onNavigateHome?: () => void;
  initialBirthDetails?: Partial<BirthDetails>;
}

export const SampoornKundaliReportView: React.FC<Props> = ({
  language,
  onNavigateHome,
  initialBirthDetails,
}) => {
  const isHindi = language === 'hi';

  // 9 Required fields
  const [fullName, setFullName] = useState(initialBirthDetails?.name || '');
  const [dob, setDob] = useState(initialBirthDetails?.dob || '1995-05-15');
  const [tob, setTob] = useState(initialBirthDetails?.tob || '10:30');
  const [city, setCity] = useState(initialBirthDetails?.place?.split(',')[0] || 'New Delhi');
  const [stateName, setStateName] = useState('Delhi');
  const [country, setCountry] = useState('India');
  const [latitude, setLatitude] = useState(
    typeof initialBirthDetails?.latitude === 'number' ? initialBirthDetails.latitude : 28.6139
  );
  const [longitude, setLongitude] = useState(
    typeof initialBirthDetails?.longitude === 'number' ? initialBirthDetails.longitude : 77.209
  );
  const [timezone, setTimezone] = useState(
    typeof initialBirthDetails?.timezone === 'number' ? initialBirthDetails.timezone : 5.5
  );

  const [gender, setGender] = useState<'male' | 'female' | 'other'>(
    initialBirthDetails?.gender || 'male'
  );
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [isLocationVerified, setIsLocationVerified] = useState(true);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Generated Result State
  const [activeKundali, setActiveKundali] = useState<KundaliResult | null>(null);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);

  // Past Reports Modal State
  const [isPastReportsOpen, setIsPastReportsOpen] = useState(false);
  const [pastReports, setPastReports] = useState<SavedKundaliLifeReport[]>([]);

  // Load past reports on mount
  useEffect(() => {
    setPastReports(getSavedLifeReports());
  }, []);

  // Update coordinates whenever city is chosen or updated
  const handleSelectCityPreset = (cityName: string) => {
    const coords = lookupCityCoordinates(cityName);
    if (coords) {
      setCity(coords.name);
      if (coords.state) setStateName(coords.state);
      setCountry(coords.country);
      setLatitude(coords.lat);
      setLongitude(coords.lon);
      setTimezone(coords.tz);
      setIsLocationVerified(true);
      setVerificationFeedback(
        isHindi
          ? `✓ स्थान सत्यापित: ${coords.name}, ${coords.state || coords.country} (${coords.lat.toFixed(4)}° N, ${coords.lon.toFixed(4)}° E)`
          : `✓ Location verified: ${coords.name}, ${coords.state || coords.country} (${coords.lat.toFixed(4)}° N, ${coords.lon.toFixed(4)}° E)`
      );
    }
  };

  // Button 1: [ जन्म विवरण सत्यापित करें ]
  const handleVerifyDetails = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = isHindi ? 'कृपया जातक का पूरा नाम दर्ज करें' : 'Please enter full name';
    }
    if (!dob) {
      errors.dob = isHindi ? 'कृपया जन्म तिथि दर्ज करें' : 'Please enter date of birth';
    }
    if (!tob && !isTimeUnknown) {
      errors.tob = isHindi ? 'कृपया सटीक जन्म समय दर्ज करें' : 'Please enter exact birth time';
    }
    if (!city.trim()) {
      errors.city = isHindi ? 'कृपया जन्म शहर दर्ज करें' : 'Please enter birth city';
    }
    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      errors.latitude = isHindi ? 'अमान्य अक्षांश (-90 से +90)' : 'Invalid latitude (-90 to +90)';
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      errors.longitude = isHindi ? 'अमान्य देशांतर (-180 से +180)' : 'Invalid longitude (-180 to +180)';
    }
    if (isNaN(timezone) || timezone < -12 || timezone > 14) {
      errors.timezone = isHindi ? 'अमान्य समय क्षेत्र (-12 से +14)' : 'Invalid timezone (-12 to +14)';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLocationVerified(true);
      setVerificationFeedback(
        isHindi
          ? `✓ सभी 9 जन्म विवरण सफलतापूर्वक सत्यापित! निर्देशांक: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (UTC +${timezone})`
          : `✓ All 9 birth parameters verified! Coordinates: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (UTC +${timezone})`
      );
      return true;
    } else {
      setVerificationFeedback(null);
      return false;
    }
  };

  // Button 2: [ मेरी कुंडली तैयार करें ]
  const handleGenerateCompleteReport = () => {
    const isValid = handleVerifyDetails();
    if (!isValid) return;

    setIsGenerating(true);
    setTimeout(() => {
      try {
        const fullPlace = `${city.trim()}${stateName ? `, ${stateName.trim()}` : ''}, ${country.trim()}`;
        const birthData: BirthDetails = {
          name: fullName.trim(),
          gender,
          dob,
          tob: isTimeUnknown ? '12:00' : tob,
          place: fullPlace,
          latitude,
          longitude,
          timezone,
        };

        const calculated = generateKundali(birthData);
        setActiveKundali(calculated);

        // Register in birth profile manager
        saveOrUpdateProfile({
          birthDetails: birthData,
          chartData: calculated,
        });

        // Save report into localStorage history
        saveLifeReport(calculated, {
          city: city.trim(),
          state: stateName.trim(),
          country: country.trim(),
        });
        setPastReports(getSavedLifeReports());

        // Automatically open the 25-page reader modal
        setIsReaderModalOpen(true);
      } catch (err) {
        console.error('Error generating Kundali report', err);
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  // Direct PDF Download Handler
  const handleDownload25PagePDF = async (targetKundali: KundaliResult) => {
    try {
      setIsDownloadingPdf(true);
      setPdfProgress({ current: 1, total: 25 });
      await exportTwentyPageKundaliPDF(targetKundali, {
        language: isHindi ? 'hi' : 'en',
        onProgress: (current, total) => {
          setPdfProgress({ current, total });
        },
      });
    } catch (err) {
      console.error('Failed to export 25-page PDF', err);
    } finally {
      setIsDownloadingPdf(false);
      setPdfProgress(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Page Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#031d16] to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-900/60 pb-6 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shrink-0">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-amber-400 text-slate-950 tracking-wider uppercase">
                  25 PAGES VEDIC REPORT
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  SWISS EPHEMERIS
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-amber-200 mt-1 tracking-tight">
                {isHindi ? 'सम्पूर्ण जन्मकुंडली लेखा-जोखा' : 'Complete Kundali Life Report'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPastReportsOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <HistoryIcon className="w-4 h-4 text-amber-400" />
              <span>{isHindi ? 'पुरानी रिपोर्ट देखें' : 'View Previous Reports'}</span>
              {pastReports.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  {pastReports.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {isHindi
            ? 'अपनी जन्मकुंडली, ग्रहों, भावों, योगों, दशाओं, करियर, विवाह, धन, स्वास्थ्य और जीवन के विभिन्न पहलुओं का विस्तृत वैदिक विश्लेषण प्राप्त करें। यह 25-पृष्ठीय प्रामाणिक महापत्रिका महर्षि पराशर के बृहत्पाराशर होराशास्त्र सिद्धांतों एवं खगोलीय शुद्धता पर आधारित है।'
            : 'Obtain an exhaustive 25-page authentic Vedic life report analyzing your ascendant, planets, 12 houses, auspicious yogas, doshas, 120-year Vimshottari dasha, transits, career, marriage, finances, and personalized remedies.'}
        </p>

        {/* 25-Page Feature Highlights Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-6 border-t border-emerald-900/40 text-xs">
          <div className="bg-slate-900/60 border border-emerald-900/60 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-amber-400 font-bold">✓</span>
            <span className="text-slate-200">25 पूर्ण पृष्ठ विश्लेषण</span>
          </div>
          <div className="bg-slate-900/60 border border-emerald-900/60 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-amber-400 font-bold">✓</span>
            <span className="text-slate-200">D1 से D12 वर्ग चक्र</span>
          </div>
          <div className="bg-slate-900/60 border border-emerald-900/60 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-amber-400 font-bold">✓</span>
            <span className="text-slate-200">120-वर्ष महादशा चक्र</span>
          </div>
          <div className="bg-slate-900/60 border border-emerald-900/60 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-amber-400 font-bold">✓</span>
            <span className="text-slate-200">1-क्लिक PDF डाउनलोड</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: BIRTH DETAILS FORM (9 REQUIRED FIELDS) */}
      <div className="bg-[#031a15] rounded-3xl border border-emerald-900/80 p-6 sm:p-8 shadow-2xl text-white space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">✍️</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-200">
                {isHindi ? 'जातक जन्म विवरण फॉर्म (9 आवश्यक क्षेत्र)' : 'Native Birth Details Form (9 Required Fields)'}
              </h2>
              <p className="text-xs text-slate-400">
                {isHindi
                  ? 'सटीक खगोलीय गणना के लिए कृपया सत्यापित विवरण दर्ज करें।'
                  : 'Please enter verified coordinates and birth particulars for accurate ephemeris calculations.'}
              </p>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-semibold hidden sm:inline">
            * सभी 9 फ़ील्ड अनिवार्य हैं
          </span>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>1. {isHindi ? 'पूरा नाम (Full Name)' : 'Full Name'}</span>
              <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isHindi ? 'उदा. अमित कुमार' : 'e.g. Amit Kumar'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/80 focus:border-amber-400 text-white text-sm outline-none transition-all"
            />
            {formErrors.fullName && (
              <p className="text-[11px] text-rose-400">{formErrors.fullName}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>लिंग (Gender)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    gender === g
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-950/80 text-slate-300 border-emerald-900/60 hover:border-emerald-700'
                  }`}
                >
                  {g === 'male' ? (isHindi ? 'पुरुष' : 'Male') : g === 'female' ? (isHindi ? 'स्त्री' : 'Female') : (isHindi ? 'अन्य' : 'Other')}
                </button>
              ))}
            </div>
          </div>

          {/* 2 & 3. Date of Birth and Time of Birth (with full interactive selectors & native pickers) */}
          <div className="sm:col-span-2 lg:col-span-3">
            <VedicDateTimePicker
              dob={dob}
              tob={tob}
              onDobChange={(newDob) => setDob(newDob)}
              onTobChange={(newTob) => setTob(newTob)}
              language={language}
              isTimeUnknown={isTimeUnknown}
              onTimeUnknownChange={(unknown) => setIsTimeUnknown(unknown)}
              dobLabel={isHindi ? '2. जन्म तिथि (Date of Birth) *' : '2. Date of Birth *'}
              tobLabel={isHindi ? '3. सटीक जन्म समय (Exact Time of Birth) *' : '3. Exact Time of Birth *'}
              dobError={formErrors.dob}
              tobError={formErrors.tob}
            />
          </div>

          {/* 4. Birth City */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>4. {isHindi ? 'जन्म शहर (Birth City)' : 'Birth City'}</span>
              <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setIsLocationVerified(false);
              }}
              placeholder={isHindi ? 'उदा. नई दिल्ली, जयपुर, मुंबई' : 'e.g. New Delhi, Jaipur, Mumbai'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/80 focus:border-amber-400 text-white text-sm outline-none transition-all"
            />
            {formErrors.city && (
              <p className="text-[11px] text-rose-400">{formErrors.city}</p>
            )}
          </div>

          {/* 5. Birth State */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>5. {isHindi ? 'जन्म राज्य (Birth State)' : 'Birth State'}</span>
              <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              placeholder={isHindi ? 'उदा. पंजाब, राजस्थान, उत्तर प्रदेश' : 'e.g. Punjab, Rajasthan, UP'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/80 focus:border-amber-400 text-white text-sm outline-none transition-all"
            />
          </div>

          {/* 6. Birth Country */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>6. {isHindi ? 'जन्म देश (Birth Country)' : 'Birth Country'}</span>
              <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="India"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/80 focus:border-amber-400 text-white text-sm outline-none transition-all"
            />
          </div>

          {/* 7. Latitude */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>7. {isHindi ? 'अक्षांश (Latitude °N)' : 'Latitude (°N)'}</span>
              <span className="text-amber-400">*</span>
            </label>
            <input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/80 focus:border-amber-400 text-white text-sm outline-none transition-all font-mono"
            />
            {formErrors.latitude && (
              <p className="text-[11px] text-rose-400">{formErrors.latitude}</p>
            )}
          </div>

          {/* 8. Longitude */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>8. {isHindi ? 'देशांतर (Longitude °E)' : 'Longitude (°E)'}</span>
              <span className="text-amber-400">*</span>
            </label>
            <input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/80 focus:border-amber-400 text-white text-sm outline-none transition-all font-mono"
            />
            {formErrors.longitude && (
              <p className="text-[11px] text-rose-400">{formErrors.longitude}</p>
            )}
          </div>

          {/* 9. Time Zone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>9. {isHindi ? 'समय क्षेत्र (Time Zone Offset)' : 'Time Zone Offset'}</span>
              <span className="text-amber-400">*</span>
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/80 focus:border-amber-400 text-white text-sm outline-none transition-all"
            >
              <option value={5.5}>UTC +5:30 (India Standard Time - IST)</option>
              <option value={5.75}>UTC +5:45 (Nepal Standard Time - NPT)</option>
              <option value={6}>UTC +6:00 (Bangladesh - BST)</option>
              <option value={5}>UTC +5:00 (Pakistan - PKT)</option>
              <option value={4}>UTC +4:00 (Dubai / UAE - GST)</option>
              <option value={0}>UTC +0:00 (London / GMT / WET)</option>
              <option value={1}>UTC +1:00 (Central Europe - CET)</option>
              <option value={-5}>UTC -5:00 (US Eastern - EST)</option>
              <option value={-6}>UTC -6:00 (US Central - CST)</option>
              <option value={-8}>UTC -8:00 (US Pacific - PST)</option>
              <option value={8}>UTC +8:00 (Singapore / HK / Perth)</option>
              <option value={10}>UTC +10:00 (Sydney / Melbourne - AEST)</option>
            </select>
            {formErrors.timezone && (
              <p className="text-[11px] text-rose-400">{formErrors.timezone}</p>
            )}
          </div>
        </div>

        {/* Quick City Presets Toolbar */}
        <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {isHindi ? 'त्वरित प्रमुख शहर चयन (सत्यापित निर्देशांक):' : 'Quick City Coordinates Presets:'}
            </span>
            <span className="text-[11px] text-slate-400">
              {isHindi ? 'क्लिक करते ही Lat/Lon स्वतः भर जाएंगे' : 'Click to auto-populate exact lat/lon'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              'New Delhi',
              'Varanasi',
              'Ujjain',
              'Haridwar',
              'Ayodhya',
              'Jaipur',
              'Mumbai',
              'Bengaluru',
              'Kolkata',
              'Chandigarh',
              'Fazilka',
              'Ludhiana',
              'Amritsar',
              'Kathmandu',
              'London',
              'New York',
              'Dubai',
            ].map((cName) => (
              <button
                key={cName}
                type="button"
                onClick={() => handleSelectCityPreset(cName)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  city.toLowerCase().includes(cName.toLowerCase())
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cName}
              </button>
            ))}
          </div>
        </div>

        {/* Accuracy Notices and Warnings */}
        {isTimeUnknown && (
          <div className="bg-amber-950/50 border border-amber-500/50 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">
                {isHindi ? '⚠️ जन्म समय सटीकता सूचना (Accuracy Advisory)' : '⚠️ Birth Time Precision Notice'}
              </p>
              <p className="mt-0.5 leading-relaxed">
                {isHindi
                  ? 'जन्म समय अज्ञात होने पर दोपहर 12:00 बजे को मानक मानकर ग्रहों और भावों की गणना की जाएगी। कृपया ध्यान दें कि 15 मिनट के अंतर से नवमांश चक्र और लग्न के अंशों में सूक्ष्म अंतर आ सकता है।'
                  : 'Approximate time default (12:00 Noon) will calculate broad planetary signs, but Lagna degrees and D9 Navamsha require exact birth time for pinpoint precision.'}
              </p>
            </div>
          </div>
        )}

        {/* Verification Feedback Banner */}
        {verificationFeedback && (
          <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{verificationFeedback}</span>
          </div>
        )}

        {/* ACTION BUTTONS: [ जन्म विवरण सत्यापित करें ] & [ मेरी कुंडली तैयार करें ] */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-emerald-900/60">
          <button
            type="button"
            onClick={handleVerifyDetails}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/50 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer hover:border-emerald-400"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? 'जन्म विवरण सत्यापित करें' : 'Verify Birth Details'}</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateCompleteReport}
            disabled={isGenerating}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-amber-950/50 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
            <span>
              {isGenerating
                ? isHindi
                  ? 'कुंडली गणना हो रही है...'
                  : 'Computing Kundali...'
                : isHindi
                ? 'मेरी सम्पूर्ण कुंडली रिपोर्ट बनाएं'
                : 'Generate Complete Kundali Report'}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>

      {/* RECENTLY GENERATED SUMMARY CARD (IF ACTIVE KUNDALI EXISTS) */}
      {activeKundali && (
        <div className="bg-gradient-to-r from-slate-950 via-[#031d16] to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌟</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-amber-200">
                  {isHindi ? 'सम्पूर्ण जन्मकुंडली रिपोर्ट तैयार है!' : 'Complete Kundali Life Report is Ready!'}
                </h3>
                <p className="text-xs text-slate-300">
                  {fullName} • {dob} • {tob} • {city} ({activeKundali.ascendantSign} Lagna, {activeKundali.moonSign} Rashi)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsReaderModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{isHindi ? '25-पृष्ठ रिपोर्ट पढ़ें (Interactive Reader)' : 'Read 25-Page Report'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload25PagePDF(activeKundali)}
                disabled={isDownloadingPdf}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-50"
              >
                <Download className={`w-4 h-4 ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
                <span>
                  {isDownloadingPdf
                    ? pdfProgress
                      ? `${isHindi ? 'PDF तैयार हो रही है' : 'Generating'} (${pdfProgress.current}/${pdfProgress.total})...`
                      : 'Generating...'
                    : isHindi
                    ? '25-Page PDF डाउनलोड करें'
                    : 'Download 25-Page PDF'}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/80 rounded-xl p-3 border border-emerald-900/60">
              <div className="text-slate-400">लग्न (Ascendant)</div>
              <div className="text-sm font-black text-amber-300 mt-0.5">{activeKundali.ascendantSign}</div>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-3 border border-emerald-900/60">
              <div className="text-slate-400">चंद्र राशि (Moon Sign)</div>
              <div className="text-sm font-black text-amber-300 mt-0.5">{activeKundali.moonSign}</div>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-3 border border-emerald-900/60">
              <div className="text-slate-400">जन्म नक्षत्र (Nakshatra)</div>
              <div className="text-sm font-black text-amber-300 mt-0.5">{activeKundali.birthNakshatra}</div>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-3 border border-emerald-900/60">
              <div className="text-slate-400">कुल रिपोर्ट पृष्ठ (Pages)</div>
              <div className="text-sm font-black text-emerald-400 mt-0.5">25 Pages Complete</div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: 25-PAGE READER MODAL */}
      {activeKundali && (
        <TwentyPageKundaliReaderModal
          isOpen={isReaderModalOpen}
          onClose={() => setIsReaderModalOpen(false)}
          kundali={activeKundali}
          language={language}
        />
      )}

      {/* MODAL 2: PAST REPORTS DRAWER / MODAL [ पुरानी रिपोर्ट देखें ] */}
      {isPastReportsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#031a15] border border-amber-500/40 w-full max-w-3xl rounded-3xl shadow-2xl p-6 text-white space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 text-xl font-black">
                  📜
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-200">
                    {isHindi ? 'पुरानी जन्मकुंडली रिपोर्ट सूची' : 'Previously Generated Life Reports'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isHindi
                      ? 'आपके द्वारा पूर्व में बनाई गई 25-पृष्ठीय सम्पूर्ण जीवन पत्रिकाएं'
                      : 'Saved 25-page complete life reports stored in your session'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPastReportsOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pastReports.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <span className="text-4xl">📭</span>
                <p className="text-sm font-bold text-slate-300">
                  {isHindi ? 'अभी तक कोई पुरानी रिपोर्ट नहीं है।' : 'No saved reports found yet.'}
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {isHindi
                    ? 'ऊपर दिए गए फॉर्म में जन्म विवरण भरकर "मेरी सम्पूर्ण कुंडली रिपोर्ट बनाएं" पर क्लिक करें।'
                    : 'Fill your birth particulars and click "Generate Complete Kundali Report" to create your first report.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {pastReports.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 hover:border-amber-500/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-300 text-sm sm:text-base">
                          {item.birthDetails.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {item.summary.ascendantSign} Lagna
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          {item.summary.moonSign} Rashi
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-2">
                        <span>📅 {item.birthDetails.dob} ({item.birthDetails.tob})</span>
                        <span>•</span>
                        <span>📍 {item.birthDetails.place}</span>
                        <span>•</span>
                        <span className="text-slate-400">{item.createdAt}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveKundali(item.kundali);
                          setIsPastReportsOpen(false);
                          setIsReaderModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'पढ़ें' : 'Read'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload25PagePDF(item.kundali)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = deleteSavedLifeReport(item.id);
                          setPastReports(updated);
                        }}
                        className="p-1.5 rounded-xl hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title={isHindi ? 'हटाएं' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
