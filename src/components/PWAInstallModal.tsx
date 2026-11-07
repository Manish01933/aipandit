import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types/astrology';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onNativeInstall: () => Promise<'accepted' | 'dismissed' | 'unsupported'>;
  isInstallable: boolean;
  isIOS: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  language,
  onNativeInstall,
  isInstallable,
  isIOS,
}) => {
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTriggerInstall = async () => {
    setInstalling(true);
    const result = await onNativeInstall();
    setInstalling(false);
    if (result === 'accepted') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        {/* Modal Backdrop animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Content Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md bg-[#ffffff] rounded-3xl shadow-2xl border-2 border-emerald-500/30 overflow-hidden text-slate-900"
        >
          {/* Top Decorative Header with Animated Gradient & Stars */}
          <div className="relative bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white p-6 pb-7 overflow-hidden">
            {/* Ambient Shimmer Beam */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent" />
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl" />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-emerald-100 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center">
                  <div className="w-full h-full bg-[#064e3b] rounded-[14px] flex items-center justify-center border border-amber-300/40">
                    <Smartphone className="w-7 h-7 text-amber-300 animate-pulse" />
                  </div>
                </div>
                {/* Ping ring */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-white"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white tracking-tight">
                    {language === 'hi' ? 'फोन में इंस्टॉल करें' : 'Install AstroDost App'}
                  </h3>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    PWA
                  </span>
                </div>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                  {language === 'hi'
                    ? 'बिना Play Store के सीधे होम स्क्रीन पर'
                    : '1-Click Direct Home Screen Installation'}
                </p>
              </div>
            </div>
          </div>

          {/* Body Features */}
          <div className="p-6 space-y-4">
            {/* Perks Pills Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                <Zap className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                <div className="text-[11px] font-black text-emerald-950">
                  {language === 'hi' ? '10x सुपरफ़ास्ट' : '10x Faster'}
                </div>
                <div className="text-[9px] text-emerald-800">
                  {language === 'hi' ? 'नो लैग' : 'Instant Open'}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <div className="text-[11px] font-black text-emerald-950">
                  {language === 'hi' ? 'फुल स्क्रीन' : 'Full Screen'}
                </div>
                <div className="text-[9px] text-emerald-800">
                  {language === 'hi' ? 'असली ऐप जैसी' : 'Native UI'}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 mx-auto mb-1" />
                <div className="text-[11px] font-black text-emerald-950">
                  {language === 'hi' ? '100% सुरक्षित' : 'Zero Storage'}
                </div>
                <div className="text-[9px] text-emerald-800">
                  {language === 'hi' ? 'सिर्फ <2MB' : 'Lightweight'}
                </div>
              </div>
            </div>

            {/* Platform Specific Instructions */}
            {isInstallable ? (
              /* Direct 1-Tap Browser Prompt Available */
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-3">
                <p className="text-xs text-emerald-950 font-semibold">
                  {language === 'hi'
                    ? 'आपका ब्राउज़र सीधे 1-क्लिक इंस्टॉलेशन के लिए तैयार है!'
                    : 'Your browser is ready for instant 1-tap installation!'}
                </p>

                <button
                  type="button"
                  onClick={handleTriggerInstall}
                  disabled={installing}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>
                    {installing
                      ? (language === 'hi' ? 'प्रतीक्षा करें...' : 'Installing...')
                      : (language === 'hi' ? '📲 अभी फ़ोन में जोड़ें (Install Now)' : '📲 Add to Phone (Install Now)')}
                  </span>
                </button>
              </div>
            ) : isIOS ? (
              /* iOS Safari 2-Step Instructions */
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-3 text-slate-800">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span>
                    {language === 'hi'
                      ? '🍏 iPhone / iPad (Safari) के लिए आसान 2 स्टेप्स:'
                      : '🍏 2 Easy Steps for iPhone / iPad (Safari):'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-amber-200 shadow-xs">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {language === 'hi' ? 'नीचे सफारी में ' : 'In Safari bottom bar, tap '}
                        <span className="inline-flex items-center gap-1 font-black bg-slate-100 px-1.5 py-0.5 rounded text-blue-600">
                          <Share2 className="w-3.5 h-3.5" /> Share
                        </span>
                        {language === 'hi' ? ' बटन दबाएँ' : ' button'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-amber-200 shadow-xs">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {language === 'hi' ? 'सूची में नीचे स्क्रॉल करके ' : 'Scroll down & select '}
                        <span className="inline-flex items-center gap-1 font-black bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">
                          <PlusSquare className="w-3.5 h-3.5 text-emerald-600" /> Add to Home Screen
                        </span>
                        {language === 'hi' ? ' पर टैप करें' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Android Chrome or Desktop Browser Instructions */
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3 text-slate-800">
                <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>
                    {language === 'hi'
                      ? '📱 Android / Chrome में इंस्टॉल करने का तरीका:'
                      : '📱 How to install in Android Chrome:'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-200 shadow-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </div>
                    <p className="text-slate-800 font-medium">
                      {language === 'hi'
                        ? 'ब्राउज़र के ऊपर दाईं ओर 3-डॉट्स (⋮) मेनू पर टैप करें।'
                        : 'Tap the 3-dots (⋮) menu at the top right of Chrome.'}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-200 shadow-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </div>
                    <p className="text-slate-800 font-medium">
                      {language === 'hi' ? '"' : 'Select "'}
                      <strong className="text-emerald-900">
                        {language === 'hi' ? 'ऐप इंस्टॉल करें / Install App' : 'Install App / Add to Home screen'}
                      </strong>
                      {language === 'hi' ? '" चुनें और "Install" दबाएँ।' : '" and tap Install.'}
                    </p>
                  </div>
                </div>

                {/* If in preview iframe, provide direct link copy */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full py-2 px-3 bg-white hover:bg-emerald-100/60 border border-emerald-300 text-emerald-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{language === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{language === 'hi' ? 'ऐप लिंक कॉपी करें (Chrome में खोलें)' : 'Copy App Link (Open in Chrome)'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Note */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {language === 'hi'
                  ? 'यह ऐप बिना इंटरनेट के भी मूलभूत कुंडलियाँ दिखा सकती है'
                  : 'Works seamlessly like a real native mobile app'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
