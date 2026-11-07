import React, { useState } from 'react';
import { Smartphone, Download, Sparkles, ArrowDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';
import { Language } from '../types/astrology';

interface PWAInstallButtonProps {
  language: Language;
  variant?: 'header' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language,
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFloatingDismissed, setIsFloatingDismissed] = useState(false);

  // If already running inside an installed standalone PWA, suppress the prompt
  if (isInstalled) {
    return null;
  }

  const handleActionClick = async () => {
    // If the browser provides a direct native prompt, launch it
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        return;
      }
    }
    // Otherwise, open the interactive modal guide with 1-click directions
    setIsModalOpen(true);
  };

  const handleNativeInstall = async () => {
    const outcome = await install();
    if (outcome === 'accepted') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
    return outcome;
  };

  // 1. Header Variant: Compact, sleek, with rotating lighting beam & animated badge
  if (variant === 'header') {
    return (
      <>
        <div className="relative group select-none">
          {/* Animated Glow Halo */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-500 rounded-xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />

          <button
            id="pwa-header-install-btn"
            type="button"
            onClick={handleActionClick}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black shadow-md shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/50"
            title={language === 'hi' ? 'फ़ोन में ऐप इंस्टॉल करें' : 'Install App to Phone'}
          >
            {/* Download Phone Icon with Bouncing Arrow */}
            <div className="relative flex items-center justify-center">
              <Smartphone className="w-3.5 h-3.5 text-amber-300" />
              <motion.div
                animate={{ y: [-1, 2, -1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="absolute -bottom-1 -right-1"
              >
                <Download className="w-2.5 h-2.5 text-white" />
              </motion.div>
            </div>

            <span className="tracking-wide">
              {language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}
            </span>

            {/* Pulsing Tag */}
            <span className="relative flex h-2 w-2 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
          </button>
        </div>

        <PWAInstallModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          language={language}
          onNativeInstall={handleNativeInstall}
          isInstallable={isInstallable}
          isIOS={isIOS}
        />
      </>
    );
  }

  // 2. Floating Pill Variant: Visible on Mobile and Desktop with high-energy animated beam
  if (isFloatingDismissed) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-5 left-4 sm:left-6 z-40 select-none">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative group"
        >
          {/* Dynamic Ambient Pulsing Aura */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-2xl blur-sm"
          />

          {/* Card Container */}
          <div className="relative flex items-center gap-2 bg-emerald-100 text-slate-900 pl-3.5 pr-2 py-2 rounded-2xl shadow-xl shadow-emerald-950/20 border-2 border-emerald-400">
            {/* Install Button Action */}
            <button
              id="pwa-floating-install-btn"
              type="button"
              onClick={handleActionClick}
              className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 transition-opacity"
            >
              {/* Phone Icon with Pulsing Badge */}
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <Smartphone className="w-4 h-4 animate-bounce" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="text-xs font-black text-black tracking-tight">
                    {language === 'hi' ? '📲 फ़ोन में इंस्टॉल करें' : '📲 Install to Phone'}
                  </span>
                  <span className="text-[9px] bg-emerald-700 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                    1-Tap
                  </span>
                </div>
                <p className="text-[10px] text-slate-800 font-medium">
                  {language === 'hi' ? 'तेज़, सुरक्षित व बिना ब्राउज़र' : 'Fast, Offline & Native'}
                </p>
              </div>
            </button>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setIsFloatingDismissed(true)}
              className="p-1 rounded-lg text-slate-700 hover:text-black hover:bg-emerald-200 transition-colors ml-1 cursor-pointer"
              title={language === 'hi' ? 'बंद करें' : 'Dismiss'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
        onNativeInstall={handleNativeInstall}
        isInstallable={isInstallable}
        isIOS={isIOS}
      />
    </>
  );
};
