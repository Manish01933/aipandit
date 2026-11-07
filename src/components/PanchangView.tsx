import React, { useState } from 'react';
import { Language, PanchangData } from '../types/astrology';
import { calculateDailyPanchang, PANCHANG_CITY_PRESETS } from '../utils/vedicCalculations';
import { Calendar, Sun, Moon, Clock, ShieldAlert, Sparkles, CheckCircle2, MapPin, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface PanchangViewProps {
  language: Language;
}

const POPULAR_CITIES = [
  'New Delhi, India',
  'Varanasi, India (Kashi)',
  'Ujjain, India (Mahakal)',
  'Mumbai, India',
  'Bengaluru, India',
  'Kolkata, India',
  'Jaipur, India',
  'Haridwar, India',
  'Ayodhya, India',
  'London, UK',
  'New York, USA',
];

export const PanchangView: React.FC<PanchangViewProps> = ({ language }) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [city, setCity] = useState('New Delhi, India');

  const panchang: PanchangData = calculateDailyPanchang(selectedDate, city);

  const changeDateByDays = (delta: number) => {
    const d = new Date(selectedDate + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + delta);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const setToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const dateObj = new Date(selectedDate + 'T12:00:00Z');
  const weekdayEnglish = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const weekdayHindiMap: Record<string, string> = {
    Sunday: 'रविवार (Ravivar)',
    Monday: 'सोमवार (Somvar)',
    Tuesday: 'मंगलवार (Mangalvar)',
    Wednesday: 'बुधवार (Budhvar)',
    Thursday: 'गुरुवार (Guruvar)',
    Friday: 'शुक्रवार (Shukravar)',
    Saturday: 'शनिवार (Shanivar)',
  };
  const weekdayDisplay = language === 'hi' ? weekdayHindiMap[weekdayEnglish] || weekdayEnglish : weekdayEnglish;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'hi' ? 'सटीक खगोलीय वैदिक पंचांग एवं राहुकाल' : 'Astronomically Accurate Vedic Panchang & Rahu Kaal'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'hi' ? 'दैनिक पंचांग, राहुकाल एवं चौघड़िया मुहूर्त' : 'Daily Panchang, Rahu Kaal & Choghadiya Muhurats'}
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            {language === 'hi'
              ? 'स्थान-विशेष के सूर्योदय एवं सूर्यास्त के आधार पर यामार्ध नियम (8 भाग) द्वारा राहुकाल, यमगण्ड, गुलिक काल, 5 अंग व चौघड़िया की प्रामाणिक गणना।'
              : 'Computed dynamically from exact local sunrise and sunset using classical 8-part Vedic day divisions (Yamardha system).'}
          </p>
        </div>
      </div>

      {/* Date & Location Filter Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Date Picker & Navigation */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => changeDateByDays(-1)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
              title={language === 'hi' ? 'पिछला दिन' : 'Previous Day'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-700">
              <Calendar className="w-4 h-4 text-amber-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => changeDateByDays(1)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
              title={language === 'hi' ? 'अगला दिन' : 'Next Day'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={setToday}
              className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
            >
              {language === 'hi' ? 'आज (Today)' : 'Today'}
            </button>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-700">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-white focus:outline-none cursor-pointer max-w-[220px]"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date Label */}
          <div className="text-right">
            <span className="text-xs sm:text-sm text-amber-300 font-bold block">
              {weekdayDisplay}
            </span>
            <span className="text-[11px] text-slate-400">
              {dateObj.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Sun & Moon Cycle */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {language === 'hi' ? 'सूर्योदय (Sunrise)' : 'Sunrise'}
            </span>
            <p className="text-sm font-bold text-white font-mono">{panchang.sunrise}</p>
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {language === 'hi' ? 'सूर्यास्त (Sunset)' : 'Sunset'}
            </span>
            <p className="text-sm font-bold text-white font-mono">{panchang.sunset}</p>
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {language === 'hi' ? 'चन्द्रोदय (Moonrise)' : 'Moonrise'}
            </span>
            <p className="text-sm font-bold text-white font-mono">{panchang.moonrise}</p>
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {language === 'hi' ? 'चन्द्रास्त (Moonset)' : 'Moonset'}
            </span>
            <p className="text-sm font-bold text-white font-mono">{panchang.moonset}</p>
          </div>
        </div>
      </div>

      {/* 5 Core Limbs (Pancha-Anga) Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left 5 Limbs */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <h3 className="text-base font-bold text-amber-300 mb-4 flex items-center gap-2">
            <span>🪔</span>
            {language === 'hi' ? 'पंचांग के 5 अंग (Core Elements)' : 'The 5 Vedic Limbs (Panchang)'}
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">1. Tithi (तिथि)</span>
                <p className="text-sm font-bold text-amber-300 mt-0.5">
                  {language === 'hi' ? panchang.tithiHindi : panchang.tithi}
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Till {panchang.tithiEndTime}</span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">2. Nakshatra (नक्षत्र)</span>
                <p className="text-sm font-bold text-amber-300 mt-0.5">
                  {language === 'hi' ? panchang.nakshatraHindi : panchang.nakshatra}
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Till {panchang.nakshatraEndTime}</span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">3. Yoga (योग)</span>
                <p className="text-sm font-bold text-amber-300 mt-0.5">
                  {language === 'hi' ? panchang.yogaHindi : panchang.yoga}
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">Active</span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">4. Karana (करण)</span>
                <p className="text-sm font-bold text-amber-300 mt-0.5">
                  {language === 'hi' ? panchang.karanaHindi : panchang.karana}
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">First Half</span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-semibold">5. Vaar (दिन / वार)</span>
                <p className="text-sm font-bold text-amber-300 mt-0.5">
                  {weekdayDisplay}
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Solar Day</span>
            </div>
          </div>
        </div>

        {/* Right Timings: Auspicious Muhurats & Inauspicious Periods */}
        <div className="space-y-4">
          {/* Auspicious Muhurat Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/20 p-6 shadow-xl">
            <h3 className="text-base font-bold text-emerald-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {language === 'hi' ? 'शुभ मुहूर्त (Auspicious Timings)' : 'Auspicious Timings & Muhurats'}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-slate-200">
                  {language === 'hi' ? 'अभिजीत मुहूर्त (Abhijit Muhurat)' : 'Abhijit Muhurat'}
                </span>
                <span className="font-mono text-emerald-400 font-bold">{panchang.abhijitMuhurat}</span>
              </div>

              {panchang.shubhMuhurat.map((m, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                  <span className="font-medium text-slate-300">{m.split(':')[0]}</span>
                  <span className="font-mono text-emerald-300 font-semibold">{m.split(':').slice(1).join(':')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inauspicious Timings Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-rose-500/20 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                {language === 'hi' ? 'अशुभ समय (राहुकाल / यमगण्ड)' : 'Inauspicious Intervals (Rahu Kaal)'}
              </h3>
              <span className="text-[10px] text-rose-400/80 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 font-medium">
                {language === 'hi' ? 'नया कार्य वर्जित' : 'Avoid New Tasks'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-rose-500/30 flex justify-between items-center">
                <div>
                  <span className="font-bold text-rose-300 block text-xs">
                    {language === 'hi' ? 'राहुकाल (Rahu Kaal)' : 'Rahu Kaal'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {language === 'hi' ? `${weekdayDisplay} का निर्धारित यामार्ध` : `${weekdayEnglish}'s Solar Slot`}
                  </span>
                </div>
                <span className="font-mono text-rose-400 font-extrabold text-sm">{panchang.rahuKaal}</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="font-medium text-slate-300">
                  {language === 'hi' ? 'यमगण्ड (Yamaganda)' : 'Yamaganda'}
                </span>
                <span className="font-mono text-slate-400">{panchang.yamaganda}</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="font-medium text-slate-300">
                  {language === 'hi' ? 'गुलिक काल (Gulika Kaal)' : 'Gulika Kaal'}
                </span>
                <span className="font-mono text-slate-400">{panchang.gulikaKaal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Choghadiya Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-base font-bold text-amber-300 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          {language === 'hi' ? 'दैनिक दिन का चौघड़िया (Day Choghadiya Timings)' : 'Daytime Choghadiya Muhurat Table'}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {language === 'hi'
            ? 'अमृत, शुभ व लाभ चौघड़िया नए कार्य, व्यापार और यात्रा हेतु सर्वश्रेष्ठ माने जाते हैं।'
            : 'Amrit, Shubh, and Labh Choghadiya slots are highly recommended for new ventures, deal signings, and travels.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {panchang.choghadiyaDay.map((chog, i) => {
            const isGood = chog.type === 'Amrit' || chog.type === 'Shubh' || chog.type === 'Labh';
            const isNeutral = chog.type === 'Char';

            return (
              <div
                key={i}
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  isGood
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : isNeutral
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{chog.name.split(' ')[0]}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isGood ? 'bg-emerald-500 text-slate-950' : isNeutral ? 'bg-amber-500 text-slate-950' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {chog.type}
                  </span>
                </div>
                <p className="text-xs font-mono font-semibold text-slate-300 mt-2">{chog.time}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
