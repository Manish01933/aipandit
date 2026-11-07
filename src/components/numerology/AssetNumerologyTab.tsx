import React, { useState } from 'react';
import { Language } from '../../types/astrology';
import {
  analyzeHouseNumber,
  analyzeVehicleNumber,
  analyzeMobileNumber,
  analyzeBusinessName,
  HouseNumberResult,
  VehicleNumberResult,
  MobileNumberResult,
  BusinessNameResult,
} from '../../utils/ankAssetCalculations';
import {
  Home,
  Car,
  Bike,
  Smartphone,
  Briefcase,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Info,
  CheckCircle2,
  Zap,
  Award,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AssetNumerologyTabProps {
  language: Language;
  userMulank: number;
  userBhagyank: number;
}

export const AssetNumerologyTab: React.FC<AssetNumerologyTabProps> = ({
  language,
  userMulank,
  userBhagyank,
}) => {
  const [activeAssetType, setActiveAssetType] = useState<
    'house' | 'car' | 'bike' | 'mobile' | 'business'
  >('house');

  // Input states
  const [houseInput, setHouseInput] = useState('Flat 402, Block B');
  const [carInput, setCarInput] = useState('DL 01 AB 1234');
  const [bikeInput, setBikeInput] = useState('MH 12 PA 5678');
  const [mobileInput, setMobileInput] = useState('9876543210');
  const [businessInput, setBusinessInput] = useState('AstroDost Technologies');

  // Results calculation
  const houseResult = analyzeHouseNumber(houseInput, userMulank, userBhagyank);
  const carResult = analyzeVehicleNumber(carInput, '4wheeler', userMulank);
  const bikeResult = analyzeVehicleNumber(bikeInput, '2wheeler', userMulank);
  const mobileResult = analyzeMobileNumber(mobileInput, userMulank);
  const businessResult = analyzeBusinessName(businessInput, userMulank, userBhagyank);

  const assetCategories = [
    { id: 'house', label: language === 'hi' ? 'गृह / मकान / फ्लैट अंक' : 'House / Flat Number', icon: Home },
    { id: 'car', label: language === 'hi' ? '4-पहिया वाहन (कार/SUV)' : '4-Wheeler (Car / SUV)', icon: Car },
    { id: 'bike', label: language === 'hi' ? '2-पहिया वाहन (बाइक/स्कूटर)' : '2-Wheeler (Bike / Scooter)', icon: Bike },
    { id: 'mobile', label: language === 'hi' ? 'मोबाइल नंबर अंक ज्योतिष' : 'Mobile Number Power', icon: Smartphone },
    { id: 'business', label: language === 'hi' ? 'व्यापार / दुकान / ब्रांड नाम' : 'Business / Brand Name', icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      {/* Educational Header Badge */}
      <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {language === 'hi'
              ? 'भौतिक संपदा एवं व्यावहारिक अंक ज्योतिष (Asset & Commercial Numerology)'
              : 'Practical Asset & Asset Vibration Engine'}
          </span>
        </div>
        <p className="leading-relaxed">
          {language === 'hi'
            ? 'आपके दैनिक जीवन में उपयोग होने वाले भौतिक तत्व—जैसे आपका मकान नंबर, चार-पहिया व दो-पहिया वाहन, मोबाइल नंबर एवं व्यापारिक ब्रांड—विशिष्ट ग्रहीय तरंगें (Vibrations) छोड़ते हैं। यदि ये अंक आपके मूलांक और भाग्यांक से मेल खाते हैं, तो जीवन में दुर्घटनाओं से सुरक्षा, व्यापारिक धन-आकर्षण और गृह शांति कई गुना बढ़ जाती है।'
            : 'Every physical asset you own—your house flat number, 4-wheeler car, 2-wheeler motorcycle, mobile number, and company name—operates at a distinct numerical wavelength. When harmonized with your Driver (Mulank) and Destiny (Bhagyank), these assets act as protective shields and financial multipliers.'}
        </p>
      </div>

      {/* Asset Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {assetCategories.map((item) => {
          const Icon = item.icon;
          const isSelected = activeAssetType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveAssetType(item.id as any)}
              className={`p-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/40 shadow-lg scale-102'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-center">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. HOUSE / FLAT NUMBER ANALYZER */}
      {activeAssetType === 'house' && (
        <div className="bg-slate-900/90 rounded-2xl border border-amber-500/40 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              {language === 'hi' ? 'मकान / फ्लैट नंबर वास्तु एवं अंक विश्लेषण' : 'House / Flat Numerology & Vastu Resonance'}
            </span>
            <span className="text-xs text-slate-400">
              {language === 'hi' ? `आपका मूलांक: ${userMulank} | भाग्यांक: ${userBhagyank}` : `Your Driver: ${userMulank} | Destiny: ${userBhagyank}`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'घर / फ्लैट / प्लॉट नंबर दर्ज करें:' : 'Enter House / Flat / Villa / Plot Number:'}
              </label>
              <input
                type="text"
                value={houseInput}
                onChange={(e) => setHouseInput(e.target.value)}
                placeholder="e.g. Flat 402, B-12, House 7"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">
                {language === 'hi' ? 'कुल योग & मूल अंक' : 'Compound & Root'}
              </span>
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <span className="text-xs text-amber-400 font-mono">Sum: {houseResult.compoundSum}</span>
                <span className="text-base font-black text-white px-2.5 py-0.5 bg-amber-500/20 border border-amber-400 rounded-lg">
                  {houseResult.rootNumber}
                </span>
              </div>
            </div>
          </div>

          {/* House Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Vibe & Planetary Ruler */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {language === 'hi' ? 'ग्रह स्वामी व तत्व' : 'Ruling Planet & Element'}
              </span>
              <p className="text-sm font-black text-white">
                {language === 'hi' ? houseResult.planetHi : houseResult.planetEn}
              </p>
              <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                {language === 'hi' ? houseResult.elementHi : houseResult.elementEn}
              </span>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                {language === 'hi' ? houseResult.vibeSummaryHi : houseResult.vibeSummaryEn}
              </p>
            </div>

            {/* Compatibility with Owner */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                {language === 'hi' ? 'आपके साथ अनुकूलता' : 'Compatibility with You'}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-black text-base">
                  {houseResult.compatibilityScore}%
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {houseResult.compatibilityScore >= 75
                      ? language === 'hi' ? '✓ अति-शुभ तालमेल' : '✓ Highly Harmonious'
                      : language === 'hi' ? '⚠ मध्यम तालमेल' : '⚠ Mixed Resonance'}
                  </span>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {language === 'hi' ? houseResult.compatibilityVerdictHi : houseResult.compatibilityVerdictEn}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {language === 'hi' ? 'सर्वश्रेष्ठ व्यवसाय / पेशा:' : 'Best Suited Occupations:'}
                </span>
                <p className="text-xs text-amber-300 font-medium">
                  {language === 'hi' ? houseResult.bestSuitedForHi : houseResult.bestSuitedForEn}
                </p>
              </div>
            </div>

            {/* Vastu & Numerology Remedy */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'hi' ? 'सुधारात्मक वैदिक उपाय' : 'Vedic Energy Harmonizer'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {language === 'hi' ? houseResult.correctionRemedyHi : houseResult.correctionRemedyEn}
              </p>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl text-xs space-y-1.5">
              <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {language === 'hi' ? 'इस मकान में रहने के लाभ (Pros)' : 'Positive Energies of this Home'}
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {(language === 'hi' ? houseResult.prosHi : houseResult.prosEn).map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-emerald-400">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl text-xs space-y-1.5">
              <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {language === 'hi' ? 'सावधानियां (Points of Caution)' : 'Vulnerabilities to Watch'}
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {(language === 'hi' ? houseResult.consHi : houseResult.consEn).map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-rose-400">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. 4-WHEELER VEHICLE NUMBER ANALYZER */}
      {activeAssetType === 'car' && (
        <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/40 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5" />
              {language === 'hi' ? 'चार-पहिया वाहन (कार / SUV) नंबर विश्लेषण' : '4-Wheeler (Car / SUV) Numerology & Safety Index'}
            </span>
            <span className="text-xs text-slate-400">
              {language === 'hi' ? 'अक्षरों व अंकों का संपूर्ण काल्डियन योग' : 'Full Alphanumeric Chaldean Resonance'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'वाहन रजिस्ट्रेशन नंबर दर्ज करें:' : 'Enter Complete Vehicle Number Plate:'}
              </label>
              <input
                type="text"
                value={carInput}
                onChange={(e) => setCarInput(e.target.value)}
                placeholder="e.g. DL 01 AB 1234, MH 02 CD 9999"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 uppercase"
              />
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">
                {language === 'hi' ? 'कुल अक्षर+अंक योग' : 'Total Compound & Root'}
              </span>
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <span className="text-xs text-emerald-400 font-mono">Sum: {carResult.totalAlphanumericCompound}</span>
                <span className="text-base font-black text-white px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400 rounded-lg">
                  {carResult.totalAlphanumericRoot}
                </span>
              </div>
            </div>
          </div>

          {/* Car Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Safety Score */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                {language === 'hi' ? 'सुरक्षा एवं यात्रा सुरक्षा स्कोर' : 'Road Safety & Protection Index'}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-black text-base">
                  {carResult.safetyScore}%
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'hi' ? carResult.planetHi : carResult.planetEn}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'hi' ? carResult.breakdownPropensityHi : carResult.breakdownPropensityEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Prestige & Road Aura */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {language === 'hi' ? 'प्रतिष्ठा व यात्रा भाग्य' : 'Prestige & Travel Aura'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {language === 'hi' ? carResult.prestigeAndLuckHi : carResult.prestigeAndLuckEn}
              </p>
              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {language === 'hi' ? 'अनुकूल वाहन रंग:' : 'Lucky Vehicle Colors:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {(language === 'hi' ? carResult.recommendedVehicleColorsHi : carResult.recommendedVehicleColorsEn).map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Remedy */}
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'hi' ? 'वाहन सुरक्षा उपाय' : 'Car Protective Remedy'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi' ? carResult.vehicleRemedyHi : carResult.vehicleRemedyEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. 2-WHEELER VEHICLE NUMBER ANALYZER */}
      {activeAssetType === 'bike' && (
        <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/40 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5" />
              {language === 'hi' ? 'दो-पहिया वाहन (बाइक / स्कूटर) सुरक्षा व माइलेज विश्लेषण' : '2-Wheeler (Bike / Scooter) Agility & Safety Analysis'}
            </span>
            <span className="text-xs text-slate-400">
              {language === 'hi' ? 'दैनिक आवागमन सुरक्षा' : 'Daily Commute Resonance'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'बाइक / स्कूटर नंबर दर्ज करें:' : 'Enter 2-Wheeler Registration Number:'}
              </label>
              <input
                type="text"
                value={bikeInput}
                onChange={(e) => setBikeInput(e.target.value)}
                placeholder="e.g. MH 12 PA 5678, UP 32 AB 4321"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 uppercase"
              />
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">
                {language === 'hi' ? 'कुल योग & मूल अंक' : 'Compound & Root'}
              </span>
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <span className="text-xs text-emerald-400 font-mono">Sum: {bikeResult.totalAlphanumericCompound}</span>
                <span className="text-base font-black text-white px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400 rounded-lg">
                  {bikeResult.totalAlphanumericRoot}
                </span>
              </div>
            </div>
          </div>

          {/* Bike Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                {language === 'hi' ? 'राइडिंग सुरक्षा स्कोर' : 'Riding Safety Score'}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-black text-base">
                  {bikeResult.safetyScore}%
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'hi' ? bikeResult.planetHi : bikeResult.planetEn}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'hi' ? bikeResult.breakdownPropensityHi : bikeResult.breakdownPropensityEn}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {language === 'hi' ? 'गति, माइलेज व स्वभाव' : 'Speed, Agility & Vibe'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {language === 'hi' ? bikeResult.prestigeAndLuckHi : bikeResult.prestigeAndLuckEn}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'hi' ? 'सुरक्षा रक्षा सूत्र व उपाय' : '2-Wheeler Shield Remedy'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi' ? bikeResult.vehicleRemedyHi : bikeResult.vehicleRemedyEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. MOBILE NUMBER POWER ANALYZER */}
      {activeAssetType === 'mobile' && (
        <div className="bg-slate-900/90 rounded-2xl border border-rose-500/40 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              {language === 'hi' ? 'मोबाइल नंबर धन-आकर्षण व व्यापारिक विश्लेषण' : 'Mobile Number Wealth & Magnetic Resonance Engine'}
            </span>
            <span className="text-xs text-slate-400">
              {language === 'hi' ? '10-अंकीय सूक्ष्म योग' : '10-Digit Quantum Breakdown'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'अपना 10-अंकीय मोबाइल नंबर दर्ज करें:' : 'Enter 10-Digit Mobile Number:'}
              </label>
              <input
                type="tel"
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">
                {language === 'hi' ? 'मोबाइल कुल योग' : 'Compound & Root'}
              </span>
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <span className="text-xs text-rose-400 font-mono">Sum: {mobileResult.compoundSum}</span>
                <span className="text-base font-black text-white px-2.5 py-0.5 bg-rose-500/20 border border-rose-400 rounded-lg">
                  {mobileResult.rootNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {language === 'hi' ? 'धन-आकर्षण सूचकांक (Wealth Index)' : 'Wealth & Prosperity Index'}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-black text-base">
                  {mobileResult.wealthIndex}%
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'hi' ? mobileResult.luckRatingHi : mobileResult.luckRatingEn}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'hi' ? mobileResult.planetHi : mobileResult.planetEn}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                {language === 'hi' ? 'उपयुक्त कार्य / पेशा' : 'Best Suitable Usage'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {language === 'hi' ? mobileResult.businessSuitabilityHi : mobileResult.businessSuitabilityEn}
              </p>
              {mobileResult.isEndingWithZero && (
                <div className="p-2 rounded bg-rose-950/40 border border-rose-500/40 text-[10px] text-rose-300">
                  {language === 'hi'
                    ? '⚠ नंबर के अंत में 0 है: यह संचित धन के अचानक व्यय का संकेत दे सकता है।'
                    : '⚠ Ends with Zero: May cause periodic sudden cash leaks.'}
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'hi' ? 'फोन वॉलपेपर व ऊर्जा उपाय' : 'Mobile Energy Alignment'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi' ? mobileResult.remedyHi : mobileResult.remedyEn}
              </p>
            </div>
          </div>

          {/* Key Combinations */}
          {mobileResult.keyCombinationsFound.length > 0 && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                {language === 'hi' ? 'नंबर में पाए गए विशिष्ट अंक संयोजन:' : 'Special Numerical Pairs Detected in Phone:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mobileResult.keyCombinationsFound.map((k, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border text-xs ${
                      k.type === 'positive'
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                        : 'bg-rose-950/20 border-rose-500/30 text-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-amber-300 mb-0.5">{k.combo}</span>
                    <p className="text-[11px] text-slate-300">{language === 'hi' ? k.effectHi : k.effectEn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. BUSINESS & BRAND NAME NUMEROLOGY */}
      {activeAssetType === 'business' && (
        <div className="bg-slate-900/90 rounded-2xl border border-amber-500/40 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <span className="bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase inline-flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              {language === 'hi' ? 'व्यापारिक नाम / दुकान / ब्रांड अंक शुद्धि' : 'Business, Shop & Brand Name Commercial Optimizer'}
            </span>
            <span className="text-xs text-slate-400">
              {language === 'hi' ? 'काल्डियन व पाइथागोरस विधि' : 'Chaldean Wealth Alignment'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'hi' ? 'कंपनी / दुकान / ब्रांड का नाम लिखें:' : 'Enter Company / Shop / Product Brand Name:'}
              </label>
              <input
                type="text"
                value={businessInput}
                onChange={(e) => setBusinessInput(e.target.value)}
                placeholder="e.g. Reliance, AstroDost, Tata"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">
                {language === 'hi' ? 'काल्डियन नामांक' : 'Chaldean Root'}
              </span>
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <span className="text-xs text-amber-400 font-mono">Sum: {businessResult.chaldeanSum}</span>
                <span className="text-base font-black text-white px-2.5 py-0.5 bg-amber-500/20 border border-amber-400 rounded-lg">
                  {businessResult.chaldeanRoot}
                </span>
              </div>
            </div>
          </div>

          {/* Business Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {language === 'hi' ? 'व्यापारिक आकर्षण स्कोर' : 'Commercial Magnetism'}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-black text-base">
                  {businessResult.commercialMagnetismScore}%
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'hi' ? businessResult.planetHi : businessResult.planetEn}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'hi' ? businessResult.commercialVerdictHi : businessResult.commercialVerdictEn}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                {language === 'hi' ? 'उद्योग व मार्केट तालमेल' : 'Industry & Market Alignment'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {language === 'hi' ? businessResult.industryAlignmentHi : businessResult.industryAlignmentEn}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'hi' ? 'स्पेलिंग व ब्रांडिंग सुझाव' : 'Optimization Recommendation'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi' ? businessResult.enhancementSuggestionHi : businessResult.enhancementSuggestionEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
