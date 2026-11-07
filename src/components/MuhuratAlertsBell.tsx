import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Sun,
  Moon,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronDown,
} from 'lucide-react';
import { Language } from '../types/astrology';

interface MuhuratAlertsBellProps {
  language: Language;
}

export const MuhuratAlertsBell: React.FC<MuhuratAlertsBellProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permissionState, setPermissionState] = useState<string>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission);
      setIsSubscribed(Notification.permission === 'granted');
    }
  }, []);

  const handleToggleSubscribe = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert(language === 'hi' ? 'यह ब्राउज़र पुश नोटिफिकेशन को सपोर्ट नहीं करता।' : 'Browser does not support notifications.');
      return;
    }

    if (Notification.permission === 'granted') {
      // Toggle off locally
      setIsSubscribed(!isSubscribed);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      if (permission === 'granted') {
        setIsSubscribed(true);
        new Notification('🕉️ AstroDost AI - दैनिक पंचांग एवं शुभ मुहूर्त', {
          body: 'अभिजीत मुहूर्त एवं दैनिक शुभ चौघड़िया सूचनाएं सक्रिय कर दी गई हैं।',
          icon: '/favicon.ico',
        });
      }
    } catch (err) {
      console.warn('Error requesting notification permission', err);
    }
  };

  // Calculate current Choghadiya based on hour
  const now = new Date();
  const hours = now.getHours();
  const isDay = hours >= 6 && hours < 18;

  const currentChoghadiya = isDay
    ? hours < 8
      ? { nameHi: 'शुभ (Shubh)', type: 'good', textHi: 'कार्य शुभारंभ हेतु उत्तम' }
      : hours < 10
      ? { nameHi: 'रोग (Rog)', type: 'bad', textHi: 'सावधानी बरतें' }
      : hours < 12
      ? { nameHi: 'उद्वेग (Udveg)', type: 'bad', textHi: 'महत्वपूर्ण निर्णय टालें' }
      : hours < 14
      ? { nameHi: 'चर (Char)', type: 'neutral', textHi: 'यात्रा व सामान्य कार्य' }
      : hours < 16
      ? { nameHi: 'लाभ (Labh)', type: 'good', textHi: 'व्यापार व धन लाभ' }
      : { nameHi: 'अमृत (Amrit)', type: 'best', textHi: 'सर्वकार्य सिद्धि हेतु सर्वोत्तम' }
    : { nameHi: 'शुभ (Shubh)', type: 'good', textHi: 'रात्रिकालीन मांगलिक कार्य' };

  return (
    <div className="relative">
      {/* Header Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
        title="शुभ मुहूर्त एवं दैनिक अलर्ट्स"
      >
        {isSubscribed ? (
          <BellRing className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
        ) : (
          <Bell className="w-3.5 h-3.5 text-amber-300" />
        )}
        <span className="hidden sm:inline">
          {language === 'hi' ? currentChoghadiya.nameHi : 'Muhurat'}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl p-4 text-slate-100 z-50 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-black text-white">
                {language === 'hi' ? 'आज का चौघड़िया व शुभ मुहूर्त' : 'Today’s Muhurat & Panchang'}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current Choghadiya Badge */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                {language === 'hi' ? 'वर्तमान चौघड़िया मुहूर्त:' : 'Current Choghadiya:'}
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  currentChoghadiya.type === 'best' || currentChoghadiya.type === 'good'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {currentChoghadiya.nameHi}
              </span>
            </div>
            <p className="text-xs text-white font-bold">{currentChoghadiya.textHi}</p>
          </div>

          {/* Timings List */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <Sun className="w-3 h-3 text-emerald-400" />
                <span>{language === 'hi' ? 'अभिजीत मुहूर्त (अति शुभ):' : 'Abhijit Muhurat:'}</span>
              </span>
              <span className="font-mono text-white font-bold">11:45 AM - 12:35 PM</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>{language === 'hi' ? 'राहुकाल (त्याज्य समय):' : 'Rahukal (Avoid):'}</span>
              </span>
              <span className="font-mono text-rose-300 font-bold">04:30 PM - 06:00 PM</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-amber-300 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{language === 'hi' ? 'गोधूलि वेला:' : 'Godhuli Muhurat:'}</span>
              </span>
              <span className="font-mono text-white font-bold">06:20 PM - 06:45 PM</span>
            </div>
          </div>

          {/* Subscribe Toggle */}
          <div className="border-t border-slate-800 pt-2.5">
            <button
              type="button"
              onClick={handleToggleSubscribe}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isSubscribed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>
                {isSubscribed
                  ? (language === 'hi' ? '✓ दैनिक अलर्ट्स सक्रिय हैं' : '✓ Daily Alerts Active')
                  : (language === 'hi' ? '🔔 दैनिक शुभ मुहूर्त सूचनाएं चालू करें' : '🔔 Enable Daily Muhurat Alerts')}
              </span>
            </button>
            <span className="text-[10px] text-slate-400 text-center block mt-1">
              {language === 'hi' ? 'अभिजीत मुहूर्त व राहुकाल का समय पर अलर्ट प्राप्त करें।' : 'Get timely alerts for Rahukal and Auspicious timings.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
