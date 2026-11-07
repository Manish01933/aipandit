import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Sparkles, Check, ChevronDown } from 'lucide-react';
import { Language } from '../types/astrology';

interface VedicDateTimePickerProps {
  dob: string; // YYYY-MM-DD
  tob: string; // HH:MM (24-hr)
  onDobChange: (newDob: string) => void;
  onTobChange: (newTob: string) => void;
  language: Language;
  isTimeUnknown?: boolean;
  onTimeUnknownChange?: (isUnknown: boolean) => void;
  dobLabel?: string;
  tobLabel?: string;
  dobError?: string;
  tobError?: string;
  className?: string;
}

const MONTHS_HI = [
  { val: 1, name: '01 - जनवरी (Jan)' },
  { val: 2, name: '02 - फ़रवरी (Feb)' },
  { val: 3, name: '03 - मार्च (Mar)' },
  { val: 4, name: '04 - अप्रैल (Apr)' },
  { val: 5, name: '05 - मई (May)' },
  { val: 6, name: '06 - जून (Jun)' },
  { val: 7, name: '07 - जुलाई (Jul)' },
  { val: 8, name: '08 - अगस्त (Aug)' },
  { val: 9, name: '09 - सितंबर (Sep)' },
  { val: 10, name: '10 - अक्टूबर (Oct)' },
  { val: 11, name: '11 - नवंबर (Nov)' },
  { val: 12, name: '12 - दिसंबर (Dec)' },
];

const MONTHS_EN = [
  { val: 1, name: '01 - January' },
  { val: 2, name: '02 - February' },
  { val: 3, name: '03 - March' },
  { val: 4, name: '04 - April' },
  { val: 5, name: '05 - May' },
  { val: 6, name: '06 - June' },
  { val: 7, name: '07 - July' },
  { val: 8, name: '08 - August' },
  { val: 9, name: '09 - September' },
  { val: 10, name: '10 - October' },
  { val: 11, name: '11 - November' },
  { val: 12, name: '12 - December' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS_LIST: number[] = [];
for (let y = CURRENT_YEAR; y >= 1920; y--) {
  YEARS_LIST.push(y);
}

export const VedicDateTimePicker: React.FC<VedicDateTimePickerProps> = ({
  dob,
  tob,
  onDobChange,
  onTobChange,
  language,
  isTimeUnknown = false,
  onTimeUnknownChange,
  dobLabel,
  tobLabel,
  dobError,
  tobError,
  className = '',
}) => {
  const isHindi = language === 'hi';

  // Parse DOB into Year, Month, Day
  const parseDob = (dateStr: string) => {
    const parts = (dateStr || '1995-05-15').split('-');
    const y = parseInt(parts[0]) || 1995;
    const m = parseInt(parts[1]) || 5;
    const d = parseInt(parts[2]) || 15;
    return { year: y, month: m, day: d };
  };

  // Parse TOB into 12-hour components
  const parseTob = (timeStr: string) => {
    const parts = (timeStr || '10:30').split(':');
    let h24 = parseInt(parts[0]);
    if (isNaN(h24)) h24 = 10;
    let min = parseInt(parts[1]);
    if (isNaN(min)) min = 30;

    let period: 'AM' | 'PM' = 'AM';
    let h12 = h24;

    if (h24 === 0) {
      h12 = 12;
      period = 'AM';
    } else if (h24 === 12) {
      h12 = 12;
      period = 'PM';
    } else if (h24 > 12) {
      h12 = h24 - 12;
      period = 'PM';
    } else {
      period = 'AM';
    }

    return { hour12: h12, minute: min, period };
  };

  const [dateComponents, setDateComponents] = useState(parseDob(dob));
  const [timeComponents, setTimeComponents] = useState(parseTob(tob));

  // Sync internal state with props
  useEffect(() => {
    setDateComponents(parseDob(dob));
  }, [dob]);

  useEffect(() => {
    setTimeComponents(parseTob(tob));
  }, [tob]);

  // Handle direct text/calendar input change
  const handleDirectDateChange = (val: string) => {
    if (!val) return;
    onDobChange(val);
    setDateComponents(parseDob(val));
  };

  // Handle direct text/time input change
  const handleDirectTimeChange = (val: string) => {
    if (!val) return;
    onTobChange(val);
    setTimeComponents(parseTob(val));
  };

  // Update DOB from dropdowns
  const handleDateChange = (newY: number, newM: number, newD: number) => {
    const maxDays = new Date(newY, newM, 0).getDate();
    const safeDay = Math.min(newD, maxDays);
    setDateComponents({ year: newY, month: newM, day: safeDay });
    const formatted = `${newY}-${String(newM).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
    onDobChange(formatted);
  };

  // Update TOB from dropdowns
  const handleTimeChange = (newH12: number, newMin: number, newPeriod: 'AM' | 'PM') => {
    setTimeComponents({ hour12: newH12, minute: newMin, period: newPeriod });
    let h24 = newH12;
    if (newPeriod === 'AM') {
      h24 = newH12 === 12 ? 0 : newH12;
    } else {
      h24 = newH12 === 12 ? 12 : newH12 + 12;
    }
    const formatted = `${String(h24).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`;
    onTobChange(formatted);
  };

  const months = isHindi ? MONTHS_HI : MONTHS_EN;
  const daysInCurrentMonth = new Date(dateComponents.year, dateComponents.month, 0).getDate();
  const daysList = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  // Quick Time Presets
  const timePresets = [
    { label: isHindi ? '🌅 06:00 प्रातः' : '🌅 06:00 AM', h: 6, m: 0, p: 'AM' as const },
    { label: isHindi ? '☀️ 09:30 सुबह' : '☀️ 09:30 AM', h: 9, m: 30, p: 'AM' as const },
    { label: isHindi ? '🕛 12:00 दोपहर' : '🕛 12:00 PM', h: 12, m: 0, p: 'PM' as const },
    { label: isHindi ? '☕ 04:30 शाम' : '☕ 04:30 PM', h: 4, m: 30, p: 'PM' as const },
    { label: isHindi ? '🌆 07:00 संध्या' : '🌆 07:00 PM', h: 7, m: 0, p: 'PM' as const },
    { label: isHindi ? '🌙 09:30 रात्रि' : '🌙 09:30 PM', h: 9, m: 30, p: 'PM' as const },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. DATE OF BIRTH CONTAINER */}
      <div className="bg-slate-950/90 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/60 pb-2.5">
          <label className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{dobLabel || (isHindi ? 'जन्म तिथि (Date of Birth) *' : 'Date of Birth *')}</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              {isHindi ? 'चयनित:' : 'Selected:'}
            </span>
            <span className="text-xs text-amber-300 font-mono font-bold bg-amber-400/15 px-2.5 py-0.5 rounded-lg border border-amber-400/40">
              {dob}
            </span>
          </div>
        </div>

        {/* PRIMARY DIRECT DATE PICKER / INPUT (Fully visible, direct tap/click/typing) */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-emerald-300 flex items-center justify-between">
            <span>{isHindi ? '📅 सीधा कैलेंडर इनपुट (Direct Date Input / Calendar):' : '📅 Direct Date Input / Calendar:'}</span>
            <span className="text-[10px] text-slate-400">{isHindi ? 'क्लिक करके तारीख चुनें या बदलें' : 'Click to pick or edit date'}</span>
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => handleDirectDateChange(e.target.value)}
            className="w-full bg-[#02130f] border-2 border-emerald-700/80 hover:border-amber-400 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm sm:text-base text-white font-bold outline-none transition-all cursor-pointer [color-scheme:dark]"
          />
        </div>

        {/* SECONDARY: 3 Dropdowns (Day, Month, Year) */}
        <div className="pt-1">
          <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
            {isHindi ? 'या अलग-अलग ड्रॉपडाउन से बदलें:' : 'Or adjust via individual dropdowns:'}
          </span>
          <div className="grid grid-cols-3 gap-2">
            {/* Day */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">
                {isHindi ? 'दिन (Day)' : 'Day'}
              </span>
              <select
                value={dateComponents.day}
                onChange={(e) =>
                  handleDateChange(dateComponents.year, dateComponents.month, parseInt(e.target.value))
                }
                className="w-full bg-[#02130f] border border-emerald-800 rounded-xl px-2.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-bold cursor-pointer"
              >
                {daysList.map((d) => (
                  <option key={d} value={d} className="bg-[#031a15] text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">
                {isHindi ? 'महीना (Month)' : 'Month'}
              </span>
              <select
                value={dateComponents.month}
                onChange={(e) =>
                  handleDateChange(dateComponents.year, parseInt(e.target.value), dateComponents.day)
                }
                className="w-full bg-[#02130f] border border-emerald-800 rounded-xl px-2 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-bold cursor-pointer"
              >
                {months.map((m) => (
                  <option key={m.val} value={m.val} className="bg-[#031a15] text-white">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">
                {isHindi ? 'वर्ष (Year)' : 'Year'}
              </span>
              <select
                value={dateComponents.year}
                onChange={(e) =>
                  handleDateChange(parseInt(e.target.value), dateComponents.month, dateComponents.day)
                }
                className="w-full bg-[#02130f] border border-emerald-800 rounded-xl px-2 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-bold cursor-pointer font-mono"
              >
                {YEARS_LIST.map((yr) => (
                  <option key={yr} value={yr} className="bg-[#031a15] text-white">
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Decade Jump */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
          <span className="text-[10px]">{isHindi ? 'त्वरित वर्ष:' : 'Quick Year:'}</span>
          {[1980, 1985, 1990, 1995, 2000, 2005, 2010, 2020].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => handleDateChange(yr, dateComponents.month, dateComponents.day)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                dateComponents.year === yr
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {dobError && <p className="text-[11px] text-rose-400 font-semibold">{dobError}</p>}
      </div>

      {/* 2. TIME OF BIRTH CONTAINER */}
      <div className="bg-slate-950/90 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/60 pb-2.5">
          <label className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{tobLabel || (isHindi ? 'जन्म समय (Time of Birth) *' : 'Time of Birth *')}</span>
          </label>

          <div className="flex items-center gap-3">
            {onTimeUnknownChange && (
              <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                <input
                  type="checkbox"
                  checked={isTimeUnknown}
                  onChange={(e) => onTimeUnknownChange(e.target.checked)}
                  className="rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
                <span className="font-semibold">{isHindi ? 'समय अज्ञात (Approx 12:00)' : 'Time Unknown'}</span>
              </label>
            )}
            <span className="text-xs text-amber-300 font-mono font-bold bg-amber-400/15 px-2.5 py-0.5 rounded-lg border border-amber-400/40">
              {tob} ({timeComponents.hour12}:{String(timeComponents.minute).padStart(2, '0')} {timeComponents.period})
            </span>
          </div>
        </div>

        {/* PRIMARY DIRECT TIME INPUT (Fully visible, direct tap/clock/typing) */}
        <div className={`space-y-1 ${isTimeUnknown ? 'opacity-40 pointer-events-none' : ''}`}>
          <label className="text-[11px] font-bold text-emerald-300 flex items-center justify-between">
            <span>{isHindi ? '⏰ सीधा समय इनपुट (Direct Time Input / Clock):' : '⏰ Direct Time Input / Clock:'}</span>
            <span className="text-[10px] text-slate-400">{isHindi ? '24-घंटे या घड़ी से बदलें' : '24-Hour or Clock Picker'}</span>
          </label>
          <input
            type="time"
            value={tob}
            onChange={(e) => handleDirectTimeChange(e.target.value)}
            disabled={isTimeUnknown}
            className="w-full bg-[#02130f] border-2 border-emerald-700/80 hover:border-amber-400 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm sm:text-base text-white font-bold outline-none transition-all cursor-pointer [color-scheme:dark]"
          />
        </div>

        {/* SECONDARY: 12-Hour Dropdowns (Hour, Minute, AM/PM) */}
        <div className={`pt-1 ${isTimeUnknown ? 'opacity-40 pointer-events-none' : ''}`}>
          <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
            {isHindi ? 'या 12-घंटे प्रारूप (घंटा / मिनट / AM-PM) से बदलें:' : 'Or adjust via 12-hour components (Hour / Minute / AM-PM):'}
          </span>
          <div className="grid grid-cols-3 gap-2">
            {/* Hour (1-12) */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">
                {isHindi ? 'घंटा (1-12)' : 'Hour (1-12)'}
              </span>
              <select
                value={timeComponents.hour12}
                onChange={(e) =>
                  handleTimeChange(parseInt(e.target.value), timeComponents.minute, timeComponents.period)
                }
                className="w-full bg-[#02130f] border border-emerald-800 rounded-xl px-2.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-bold cursor-pointer font-mono"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h} className="bg-[#031a15] text-white">
                    {String(h).padStart(2, '0')} {isHindi ? 'बजे' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Minute (0-59) */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">
                {isHindi ? 'मिनट (00-59)' : 'Minute (00-59)'}
              </span>
              <select
                value={timeComponents.minute}
                onChange={(e) =>
                  handleTimeChange(timeComponents.hour12, parseInt(e.target.value), timeComponents.period)
                }
                className="w-full bg-[#02130f] border border-emerald-800 rounded-xl px-2.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-bold cursor-pointer font-mono"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m} className="bg-[#031a15] text-white">
                    {String(m).padStart(2, '0')} {isHindi ? 'मिनट' : 'm'}
                  </option>
                ))}
              </select>
            </div>

            {/* AM / PM Toggle */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">
                {isHindi ? 'पहर (AM / PM)' : 'Period (AM / PM)'}
              </span>
              <div className="grid grid-cols-2 gap-1 h-[38px]">
                <button
                  type="button"
                  onClick={() => handleTimeChange(timeComponents.hour12, timeComponents.minute, 'AM')}
                  className={`rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    timeComponents.period === 'AM'
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-[#02130f] text-slate-300 border-emerald-800 hover:border-emerald-600'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeChange(timeComponents.hour12, timeComponents.minute, 'PM')}
                  className={`rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    timeComponents.period === 'PM'
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-[#02130f] text-slate-300 border-emerald-800 hover:border-emerald-600'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Time Presets */}
        <div className={`flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400 ${isTimeUnknown ? 'opacity-40 pointer-events-none' : ''}`}>
          <span className="text-[10px]">{isHindi ? 'त्वरित पहर:' : 'Presets:'}</span>
          {timePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleTimeChange(preset.h, preset.m, preset.p)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-800 hover:border-amber-400/50 transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {tobError && <p className="text-[11px] text-rose-400 font-semibold">{tobError}</p>}
      </div>
    </div>
  );
};
