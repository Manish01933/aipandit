import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Megaphone, ExternalLink, ShieldCheck, Flame } from 'lucide-react';
import {
  AdminPromotionalBanner,
  getStoredPromotionalBanner,
  BannerAnimationStyle,
} from '../utils/accessManager';
import { Language } from '../types/astrology';

interface PromotionalBannerProps {
  language: Language;
  onNavigateTab?: (tab: string) => void;
  onOpenPaywall?: (options?: { reason?: string }) => void;
  onOpenAdminPortal?: () => void;
  isAdminUnlocked?: boolean;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  language,
  onNavigateTab,
  onOpenPaywall,
  onOpenAdminPortal,
  isAdminUnlocked,
}) => {
  const [banner, setBanner] = useState<AdminPromotionalBanner>(getStoredPromotionalBanner());
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AdminPromotionalBanner>;
      if (customEvent.detail) {
        setBanner(customEvent.detail);
      } else {
        setBanner(getStoredPromotionalBanner());
      }
      setIsDismissed(false);
    };

    window.addEventListener('astrodost_banner_updated', handleUpdate);
    return () => {
      window.removeEventListener('astrodost_banner_updated', handleUpdate);
    };
  }, []);

  const handleAction = () => {
    if (banner.actionType === 'pro_modal') {
      if (onOpenPaywall) onOpenPaywall({ reason: banner.title });
    } else if (banner.actionType === 'url' || banner.actionType === 'whatsapp') {
      if (banner.actionTarget) {
        let url = banner.actionTarget;
        if (banner.actionType === 'whatsapp' && !url.startsWith('http')) {
          url = `https://wa.me/${url.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('AstroDost AI - नमस्कार!')}`;
        }
        window.open(url, '_blank');
      }
    } else {
      // tab
      if (onNavigateTab && banner.actionTarget) {
        onNavigateTab(banner.actionTarget);
      }
    }
  };

  // If user previously dismissed, provide a discrete 1-click restore pill so banner is never lost
  if (isDismissed) {
    return (
      <div className="w-full flex justify-end my-2">
        <button
          type="button"
          onClick={() => setIsDismissed(false)}
          className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'hi' ? 'विशेष वैदिक बैनर देखें 👁️' : 'Show Vedic Banner 👁️'}</span>
        </button>
      </div>
    );
  }

  // Guaranteed fallback image URL so an image is NEVER blank
  const safeImageUrl = (banner.imageUrl && typeof banner.imageUrl === 'string' && banner.imageUrl.trim() !== '')
    ? banner.imageUrl
    : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400&auto=format&fit=crop';

  // Compute container classes based on the selected animation style
  const getAnimationContainerClass = (style: BannerAnimationStyle): string => {
    switch (style) {
      case 'gold_aura':
        return 'ring-2 ring-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.35)]';
      case 'pulse_glow':
        return 'ring-2 ring-emerald-400/80 animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.35)]';
      case 'neon_border':
        return 'animate-neon-glow border-2 border-emerald-400';
      case 'floating_wave':
        return 'animate-float-wave ring-2 ring-amber-400/60 shadow-2xl';
      case 'cosmic_sparkle':
        return 'ring-2 ring-indigo-400/80 shadow-[0_0_30px_rgba(99,102,241,0.4)]';
      case 'marquee_flow':
        return 'ring-2 ring-amber-400/60';
      case 'luxury_static':
      default:
        return 'border border-amber-500/40 shadow-xl';
    }
  };

  return (
    <div className="relative w-full my-4 sm:my-6 space-y-4 sm:space-y-5 transition-all duration-300">
      {/* Outer Rotating Conic Halo for 'gold_aura' style */}
      {banner.animationStyle === 'gold_aura' && (
        <div className="absolute -inset-[3px] rounded-[26px] sm:rounded-[32px] overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#d4af37,#f59e0b,#fef08a,#ffffff,#d4af37,#b45309,#fbbf24)] animate-spin-slow opacity-85" />
        </div>
      )}

      {/* =========================================================================
          WINDOW 1: FULL BANNER IMAGE WINDOW (Top - Pristine & Unobstructed)
      ========================================================================= */}
      <div
        className={`relative z-10 w-full rounded-[24px] sm:rounded-[30px] overflow-hidden bg-slate-950 text-white shadow-2xl cursor-pointer group ${getAnimationContainerClass(
          banner.animationStyle
        )}`}
        onClick={handleAction}
      >
        {/* Shimmer sweep effect for 'marquee_flow' style */}
        {banner.animationStyle === 'marquee_flow' && (
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 animate-banner-shimmer" />
          </div>
        )}

        {/* Clean, Full-Width Banner Image - Responsive aspect ratio for mobile viewports */}
        <div className="w-full flex items-center justify-center bg-slate-950 overflow-hidden max-h-[180px] sm:max-h-[260px] md:max-h-[380px] aspect-[16/8] sm:aspect-[21/9]">
          <img
            src={safeImageUrl}
            alt={banner.title || 'AstroDost AI Banner'}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1400&auto=format&fit=crop';
            }}
            className="w-full h-full object-cover sm:object-contain transform transition-transform duration-700 group-hover:scale-[1.01]"
          />
        </div>

        {/* Top-Right Quick Controls: Admin Edit & Dismiss */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          {isAdminUnlocked && onOpenAdminPortal && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAdminPortal();
              }}
              className="text-xs font-bold text-amber-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-amber-500/50 px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-lg transition-all hover:scale-105"
              title="एडमिन में बैनर बदलें"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'बैनर बदलें' : 'Edit Banner'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="p-1.5 rounded-full bg-black/70 hover:bg-black/95 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/20 backdrop-blur-md shadow-lg"
            title={language === 'hi' ? 'बंद करें' : 'Dismiss'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          WINDOW 2: SPECIAL PROMO WINDOW (Separate Window Below - "Niche Alag Se")
      ========================================================================= */}
      {banner.displayMode !== 'full_image' && (
        <div className="relative z-10 w-full rounded-2xl sm:rounded-[24px] bg-gradient-to-r from-[#021c16] via-[#04281f] to-[#021c16] border-2 border-amber-500/50 p-5 sm:p-6 md:p-7 shadow-xl shadow-emerald-950/40 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all">
          {/* Left Side: Special Promo Badge, Title & Description */}
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {banner.badgeText && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md">
                  <Flame className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                  <span>{banner.badgeText}</span>
                </span>
              )}
              <span className="text-[10px] text-amber-300 font-bold px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                {language === 'hi' ? '✨ विशेष वैदिक AI परामर्श एवं राजयोग' : '✨ Special Vedic AI Guidance & Raj Yog'}
              </span>
              {banner.animationStyle === 'cosmic_sparkle' && (
                <span className="flex items-center text-amber-300 text-xs">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-sm">
              {banner.title}
            </h3>

            {banner.subtitle && (
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
                {banner.subtitle}
              </p>
            )}
          </div>

          {/* Right Side: Primary Consultation CTA Button */}
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end pt-1 md:pt-0">
            <button
              type="button"
              onClick={handleAction}
              className="w-full md:w-auto px-6 sm:px-8 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/50"
            >
              <span>{banner.actionText || (language === 'hi' ? 'AI ज्योतिषी से पूछें ➔' : 'Ask AI Astrologer ➔')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
