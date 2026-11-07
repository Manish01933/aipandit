import React, { useState, useEffect } from 'react';
import {
  X,
  History as HistoryIcon,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  CheckCircle2,
  Search,
  User,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileText,
  Copy,
  Check,
  Download,
  Loader2,
} from 'lucide-react';
import {
  BirthProfileRecord,
  getSavedProfiles,
  deleteProfile,
  getActiveProfile,
} from '../utils/birthProfileManager';
import { Language, BirthDetails } from '../types/astrology';
import { exportTwentyPageKundaliPDF } from '../utils/twentyPagePdfGenerator';
import { generateKundali } from '../utils/vedicCalculations';

interface KundaliHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (profile: BirthProfileRecord) => void;
  onNewKundali: () => void;
  language: Language;
}

export const KundaliHistoryModal: React.FC<KundaliHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectProfile,
  onNewKundali,
  language,
}) => {
  const [profiles, setProfiles] = useState<BirthProfileRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [downloadingProfileId, setDownloadingProfileId] = useState<string | null>(null);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);

  const handleDownload25PagePdf = async (e: React.MouseEvent, profile: BirthProfileRecord) => {
    e.stopPropagation();
    try {
      setDownloadingProfileId(profile.profile_id);
      setPdfProgress({ current: 1, total: 25 });

      const birthDetails: BirthDetails = {
        name: profile.full_name,
        gender: profile.gender,
        dob: profile.date_of_birth,
        tob: profile.exact_time_of_birth,
        place: profile.birthplace,
        latitude: profile.latitude,
        longitude: profile.longitude,
        timezone: profile.timezone,
      };

      const chartData = profile.chartData || generateKundali(birthDetails);

      await exportTwentyPageKundaliPDF(chartData, {
        language: language === 'hi' ? 'hi' : 'en',
        onProgress: (current, total) => setPdfProgress({ current, total }),
      });
    } catch (err) {
      console.error('Failed to export 25-page PDF from history:', err);
    } finally {
      setDownloadingProfileId(null);
      setPdfProgress(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setProfiles(getSavedProfiles());
      const active = getActiveProfile();
      setActiveProfileId(active?.profile_id || null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = profiles.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.full_name.toLowerCase().includes(q) ||
      p.birthplace.toLowerCase().includes(q) ||
      p.profile_id.toLowerCase().includes(q) ||
      (p.chartData?.ascendantSign && p.chartData.ascendantSign.toLowerCase().includes(q)) ||
      (p.chartData?.moonSign && p.chartData.moonSign.toLowerCase().includes(q))
    );
  });

  const handleDelete = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation();
    deleteProfile(profileId);
    setProfiles(getSavedProfiles());
  };

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-500/20 text-slate-100 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/25 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-900/40">
              <HistoryIcon className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  {language === 'hi' ? '📜 कुंडली इतिहास (Kundali History)' : '📜 Kundali History & Saved Records'}
                </h3>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold px-2 py-0.5 rounded-full">
                  {profiles.length} {language === 'hi' ? 'सहेजे बायोडाटा' : 'Saved'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'जिस किसी का भी बायोडाटा एक बार कुंडली में भरा गया है, वह यहाँ यूनिक आईडी के साथ सुरक्षित है। किसी भी आईडी पर क्लिक करके तुरंत लोड करें।'
                  : 'Every profile entered in Kundali is saved here with its unique ID. Click any profile to load.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNewKundali();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'hi' ? 'नई कुंडली' : 'New Kundali'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'नाम, जन्म स्थान या ID से खोजें...'
                  : 'Search by name, birthplace, or ID...'
              }
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {profiles.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                <HistoryIcon className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-base font-bold text-white">
                  {language === 'hi' ? 'अभी कोई इतिहास सहेजा नहीं गया है' : 'No Kundali history saved yet'}
                </h4>
                <p className="text-xs text-slate-400">
                  {language === 'hi'
                    ? 'जैसे ही आप पहली बार किसी का जन्म विवरण भरकर कुंडली बनाएंगे, वह स्वतः यहाँ आईडी के साथ सहेज लिया जाएगा।'
                    : 'As soon as you enter birth details and generate a chart, it will automatically be saved here with a unique ID.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNewKundali();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'hi' ? 'अपनी पहली कुंडली बनाएं' : 'Create First Kundali'}</span>
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              {language === 'hi' ? 'खोज के अनुसार कोई कुंडली नहीं मिली।' : 'No Kundali matches your search.'}
            </div>
          ) : (
            filtered.map((p) => {
              const asc = p.chartData?.ascendantSign || 'Aries';
              const moon = p.chartData?.moonSign || 'Taurus';
              const nakshatra = p.chartData?.birthNakshatra || '';

              return (
                <div
                  key={p.profile_id}
                  onClick={() => {
                    onSelectProfile(p);
                    onClose();
                  }}
                  className={`border rounded-2xl p-4 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    p.profile_id === activeProfileId
                      ? 'bg-slate-900/95 border-emerald-500/70 shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/60 hover:shadow-emerald-950/40'
                  }`}
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-amber-300 group-hover:text-amber-200 transition-colors truncate">
                        {p.full_name}
                      </span>
                      {p.profile_id === activeProfileId && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1 shadow-xs">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{language === 'hi' ? 'सक्रिय' : 'Active'}</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleCopyId(e, p.profile_id)}
                        className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        title={language === 'hi' ? 'ID कॉपी करें' : 'Copy ID'}
                      >
                        {copiedId === p.profile_id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">✓ Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-amber-400" />
                            <span>{p.profile_id.startsWith('KUN-') ? p.profile_id : ('ID: #' + p.profile_id.slice(-6).toUpperCase())}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{p.date_of_birth}</span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{p.exact_time_of_birth}</span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1 truncate max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{p.birthplace}</span>
                      </span>
                    </div>

                    {/* Astrological Snapshot Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {language === 'hi' ? `लग्न: ${asc}` : `Asc: ${asc}`}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {language === 'hi' ? `राशि: ${moon}` : `Rashi: ${moon}`}
                      </span>
                      {nakshatra && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {nakshatra}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 ml-auto hidden sm:inline">
                        {formatDate(p.calculation_timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* 📥 25-Page Kundali PDF Download Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDownload25PagePdf(e, p)}
                      disabled={downloadingProfileId === p.profile_id}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300 disabled:opacity-60"
                      title={language === 'hi' ? '२५-पृष्ठ सम्पूर्ण कुंडली PDF डाउनलोड करें' : 'Download 25-Page Complete Kundali PDF'}
                    >
                      {downloadingProfileId === p.profile_id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-slate-950" />
                      )}
                      <span>
                        {downloadingProfileId === p.profile_id
                          ? `${language === 'hi' ? 'तैयार...' : 'PDF...'} (${pdfProgress?.current || 1}/${pdfProgress?.total || 25})`
                          : language === 'hi'
                          ? '📥 25-पृष्ठ PDF'
                          : '📥 25-Page PDF'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectProfile(p);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-transform group-hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>{language === 'hi' ? 'लोड करें' : 'Load Chart'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, p.profile_id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl border border-transparent hover:border-rose-900/40 transition-colors cursor-pointer"
                      title={language === 'hi' ? 'हटाएं' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>
            {language === 'hi'
              ? '💡 जब भी कोई नई जन्म जानकारी भरेंगे, वह स्वतः सुरक्षित हो जाएगी।'
              : '💡 Every submitted birth chart is automatically archived here.'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
