import React, { useState, useEffect } from 'react';
import { Megaphone, ChevronRight, ChevronLeft, Bell, X, Sparkles, ExternalLink, Calendar, Trash2 } from 'lucide-react';
import {
  AdminAnnouncementInfo,
  getStoredAnnouncements,
  deleteAnnouncement,
} from '../utils/accessManager';
import { Language } from '../types/astrology';

interface AnnouncementBarProps {
  language: Language;
  onNavigateTab?: (tab: string) => void;
  onOpenAdminPortal?: () => void;
  isAdminUnlocked?: boolean;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  language,
  onNavigateTab,
  onOpenAdminPortal,
  isAdminUnlocked,
}) => {
  const [announcements, setAnnouncements] = useState<AdminAnnouncementInfo[]>(getStoredAnnouncements());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AdminAnnouncementInfo[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setAnnouncements(customEvent.detail);
      } else {
        setAnnouncements(getStoredAnnouncements());
      }
    };

    window.addEventListener('astrodost_announcements_updated', handleUpdate);
    return () => {
      window.removeEventListener('astrodost_announcements_updated', handleUpdate);
    };
  }, []);

  const activeList = announcements.filter((a) => a.isActive);

  // Auto-cycle announcements every 6.5 seconds
  useEffect(() => {
    if (activeList.length <= 1 || isPaused || isModalOpen) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeList.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeList.length, isPaused, isModalOpen]);

  if (activeList.length === 0) {
    return null;
  }

  const current = activeList[currentIndex] || activeList[0];

  const getBadgeStyle = (color: AdminAnnouncementInfo['badgeColor']) => {
    switch (color) {
      case 'amber':
        return 'bg-amber-400 text-slate-950';
      case 'emerald':
        return 'bg-emerald-400 text-slate-950';
      case 'rose':
        return 'bg-rose-500 text-white';
      case 'indigo':
        return 'bg-indigo-500 text-white';
      case 'sky':
        return 'bg-sky-400 text-slate-950';
      default:
        return 'bg-amber-400 text-slate-950';
    }
  };

  const handleAnnouncementClick = (item: AdminAnnouncementInfo) => {
    if (item.actionTab && onNavigateTab) {
      onNavigateTab(item.actionTab);
    } else if (item.linkUrl) {
      window.open(item.linkUrl, '_blank');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteAnnouncement(id);
    setAnnouncements(updated);
  };

  return (
    <>
      {/* Top Strip Marquee / Notification Bar */}
      <div
        className="w-full bg-[#021f18] text-slate-100 border-b border-emerald-800/60 text-xs sm:text-sm py-2 px-3 sm:px-6 flex items-center justify-between gap-3 shadow-sm select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-1">
          {/* Announcement Icon */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs">
              📢
            </span>
            <span className="hidden md:inline font-black text-[11px] tracking-wider text-amber-300 uppercase">
              {language === 'hi' ? 'ताज़ा सूचना:' : 'Updates:'}
            </span>
          </div>

          {/* Current Notice */}
          <div
            className="flex items-center gap-2 truncate cursor-pointer hover:text-amber-200 transition-colors"
            onClick={() => handleAnnouncementClick(current)}
          >
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${getBadgeStyle(
                current.badgeColor
              )}`}
            >
              {language === 'hi' ? current.categoryLabelHi : current.categoryLabelEn}
            </span>
            <span className="font-bold text-white truncate">{current.title}</span>
            <span className="text-slate-300 text-xs hidden lg:inline truncate">— {current.message}</span>
          </div>
        </div>

        {/* Controls and "View All" */}
        <div className="flex items-center gap-2 shrink-0">
          {activeList.length > 1 && (
            <div className="flex items-center gap-0.5 text-slate-400">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + activeList.length) % activeList.length)}
                className="p-1 hover:text-white rounded hover:bg-emerald-900/60 cursor-pointer"
                title="Previous"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-amber-300/80 px-1">
                {currentIndex + 1}/{activeList.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % activeList.length)}
                className="p-1 hover:text-white rounded hover:bg-emerald-900/60 cursor-pointer"
                title="Next"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            {language === 'hi' ? 'सभी सूचनाएं' : 'View All'} ({activeList.length})
          </button>
        </div>
      </div>

      {/* Announcements Full-Detail Modal / Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-auto flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-lg">
                  📢
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-300">
                    {language === 'hi' ? 'महत्वपूर्ण सूचनाएं एवं ज्योतिषीय अपडेट्स' : 'Important Notices & Astrological Bulletins'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'hi'
                      ? 'AstroDost AI द्वारा जारी ताज़ा घोषणाएं, मुहूर्त व ऑफर्स'
                      : 'Official updates, auspicious timings and offers'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of active announcements */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-800">
              {activeList.map((item, idx) => (
                <div key={item.id} className={`${idx !== 0 ? 'pt-3.5' : ''} space-y-2`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getBadgeStyle(
                          item.badgeColor
                        )}`}
                      >
                        {language === 'hi' ? item.categoryLabelHi : item.categoryLabelEn}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white">{item.title}</h4>
                    </div>

                    {isAdminUnlocked && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="text-xs text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/40 transition-colors shrink-0"
                        title="हटाएं (Del)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    {(item.actionTab || item.linkUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          handleAnnouncementClick(item);
                        }}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{item.actionText || (language === 'hi' ? 'आगे बढ़ें ➔' : 'Proceed ➔')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-slate-950 p-3 sm:p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{activeList.length} {language === 'hi' ? 'सूचनाएं सक्रिय हैं' : 'Active notices'}</span>
              {isAdminUnlocked && onOpenAdminPortal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    onOpenAdminPortal();
                  }}
                  className="text-amber-400 hover:underline font-bold text-xs"
                >
                  {language === 'hi' ? '+ नई सूचना जोड़ें / Del करें' : 'Manage Notices (Add/Del)'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
