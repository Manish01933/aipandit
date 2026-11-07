import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Layers,
  CheckCircle2,
  Printer,
  Calendar,
  User,
  MapPin,
  Clock,
  Compass,
  Award,
  ShieldCheck,
  Zap,
  Globe,
} from 'lucide-react';
import { KundaliResult, Language } from '../types/astrology';
import {
  generateTwentyPageKundaliReport,
  TwentyPageKundaliReport,
  TwentyPageReportPage,
} from '../utils/twentyPageKundaliEngine';
import { exportTwentyPageKundaliPDF } from '../utils/twentyPagePdfGenerator';
import { checkCanDownloadClientPdf, consumeClientPdfCredit } from '../utils/entitlementManager';
import { getActiveProfile } from '../utils/birthProfileManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  kundali: KundaliResult;
  language?: Language;
}

export const TwentyPageKundaliReaderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  kundali,
  language = 'hi',
}) => {
  const [reportLang, setReportLang] = useState<'hi' | 'en'>(language === 'hi' ? 'hi' : 'en');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'paged' | 'continuous'>('paged');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);
  const [report, setReport] = useState<TwentyPageKundaliReport | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const isHindi = reportLang === 'hi';

  useEffect(() => {
    if (isOpen && kundali) {
      const generated = generateTwentyPageKundaliReport(kundali);
      setReport(generated);
    }
  }, [isOpen, kundali]);

  useEffect(() => {
    setReportLang(language === 'hi' ? 'hi' : 'en');
  }, [language]);

  if (!isOpen || !report) return null;

  const totalPages = report.pages.length;
  const currentPage = report.pages[currentPageIndex];

  const handleDownloadPDF = async () => {
    try {
      const active = getActiveProfile();
      const profileId = active?.profile_id || kundali?.birthDetails?.name || 'profile_active';
      const check = await checkCanDownloadClientPdf(profileId);

      if (!check.canDownload) {
        const msg = reportLang === 'hi'
          ? (check.reason || '25-पृष्ठीय सम्पूर्ण PDF रिपोर्ट डाउनलोड करने के लिए कृपया "कुंडली रिपोर्ट (₹499)" अथवा "एस्ट्रोदोस्त VIP (₹999/माह)" चुनें।')
          : (check.reason || 'PDF download requires the "Kundli Report (₹499)" or "AstroDost VIP (₹999/mo)" plan.');
        setDownloadNotice(msg);
        setTimeout(() => setDownloadNotice(null), 8000);
        window.dispatchEvent(
          new CustomEvent('astrodost_open_paywall', { detail: { moduleId: 'plan_kundli_report' } })
        );
        return;
      }

      // Allowed! Record credit deduction or repeat download
      await consumeClientPdfCredit(profileId);

      setIsExporting(true);
      setExportProgress({ current: 1, total: totalPages });
      await exportTwentyPageKundaliPDF(kundali, {
        language: reportLang,
        onProgress: (current, total) => {
          setExportProgress({ current, total });
        },
      });
    } catch (err) {
      console.error('Failed to export 25-page PDF', err);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getPageShortTitle = (pageNo: number) => {
    const titlesHi = [
      '1. आमुख',
      '2. जन्म विवरण',
      '3. सारांश',
      '4. ग्रह स्थिति',
      '5. लग्न व स्वभाव',
      '6. चंद्र व मन',
      '7. सूर्य व आत्मबल',
      '8. भाव 1-4',
      '9. भाव 5-8',
      '10. भाव 9-12',
      '11. करियर व कर्म',
      '12. धन व आय',
      '13. विवाह व दांपत्य',
      '14. विद्या व बुद्धि',
      '15. स्वास्थ्य',
      '16. राजयोग',
      '17. दोष परीक्षण',
      '18. विंशोत्तरी दशा',
      '19. गोचर व साढ़ेसाती',
      '20. वर्ग कुंडलियां',
      '21. वैदिक उपाय',
      '22. 10-वर्ष योजना',
      '23. शक्तियां/रोडमैप',
      '24. शब्दावली',
      '25. सत्यापन',
    ];
    return isHindi ? titlesHi[pageNo - 1] || `P${pageNo}` : `Page ${pageNo}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#031a15] border border-amber-500/40 w-full max-w-6xl max-h-[96vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Top Master Header */}
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 px-4 sm:px-6 py-3.5 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shrink-0">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-300">
                  {isHindi
                    ? 'सम्पूर्ण जन्मकुंडली लेखा-जोखा (25-पृष्ठीय महापत्रिका)'
                    : 'Complete Kundali Life Report (25-Page Vedic Mahapatrika)'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-400 text-slate-950 tracking-wider uppercase">
                  {totalPages} PAGES
                </span>
              </div>
              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-x-2">
                <span>👤 {report.nativeName}</span>
                <span>•</span>
                <span>📅 {report.birthSummary}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Language Toggle */}
            <div className="flex bg-slate-900 border border-emerald-800/60 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setReportLang('hi')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  reportLang === 'hi'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setReportLang('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  reportLang === 'en'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex bg-slate-900 border border-emerald-800/60 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('paged')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'paged'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {isHindi ? '📄 पृष्ठ-दर-पृष्ठ' : '📄 Paged'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('continuous')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'continuous'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {isHindi ? `📜 संपूर्ण ${totalPages} पृष्ठ` : `📜 All ${totalPages}`}
              </button>
            </div>

            {/* Print / Save as PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title={isHindi ? 'ब्राउज़र से सीधे प्रिंट या PDF सेव करें' : 'Print directly or Save as PDF via browser'}
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isHindi ? 'प्रिंट' : 'Print'}</span>
            </button>

            {/* Direct 25-Page HD PDF Download Action Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-3.5 h-3.5 text-slate-950 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>
                {isExporting
                  ? exportProgress
                    ? `${isHindi ? 'तैयार:' : 'Page'} ${exportProgress.current}/${exportProgress.total}`
                    : isHindi
                    ? 'PDF तैयार हो रही है...'
                    : 'Generating PDF...'
                  : isHindi
                  ? '25-पृष्ठ PDF'
                  : '25-Page PDF'}
              </span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar (Visible during PDF Export) */}
        {isExporting && exportProgress && (
          <div className="bg-amber-950/40 border-b border-amber-500/40 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>
                {isHindi
                  ? `उच्च-गुणवत्ता 25-पृष्ठीय PDF तैयार की जा रही है: पृष्ठ ${exportProgress.current} / ${exportProgress.total}...`
                  : `Rendering high-resolution 25-page PDF: Page ${exportProgress.current} of ${exportProgress.total}...`}
              </span>
            </div>
            <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-amber-500/30">
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${(exportProgress.current / exportProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Download Restriction Notice Banner */}
        {downloadNotice && (
          <div className="bg-gradient-to-r from-amber-950 via-rose-950 to-slate-950 border-b border-amber-500/50 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-base">🔒</span>
              <span className="font-medium font-devanagari">{downloadNotice}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('astrodost_open_paywall', { detail: { moduleId: 'plan_kundli_report' } })
                  );
                }}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-[11px] shadow-sm cursor-pointer transition-all"
              >
                {isHindi ? 'प्लान अनलॉक करें' : 'Unlock Plan'}
              </button>
              <button
                type="button"
                onClick={() => setDownloadNotice(null)}
                className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Chapter Index Quick Navigation Strip */}
        <div className="bg-slate-950/90 px-4 sm:px-6 py-2 border-b border-emerald-950 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {report.pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                type="button"
                onClick={() => {
                  setCurrentPageIndex(idx);
                  if (viewMode === 'continuous') {
                    const el = document.getElementById(`report-page-${p.pageNumber}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                  currentPageIndex === idx
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {getPageShortTitle(p.pageNumber)}
              </button>
            ))}
          </div>
        </div>

        {/* Reader Body Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {viewMode === 'paged' ? (
            // ================= PAGE-BY-PAGE VIEW =================
            <RenderSinglePage page={currentPage} isHindi={isHindi} totalPages={totalPages} />
          ) : (
            // ================= CONTINUOUS ALL PAGES VIEW =================
            <div className="space-y-8 report-print-container">
              {report.pages.map((pg) => (
                <div key={pg.pageNumber} id={`report-page-${pg.pageNumber}`} className="report-print-page">
                  <RenderSinglePage page={pg} isHindi={isHindi} totalPages={totalPages} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer / Navigation Controls */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>
              {isHindi ? 'वर्तमान पृष्ठ:' : 'Current Page:'}{' '}
              <strong className="text-amber-400">{currentPageIndex + 1}</strong> / {totalPages}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">
              {isHindi ? currentPage.titleHi : currentPage.titleEn}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isHindi ? 'पिछला पृष्ठ' : 'Previous'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPageIndex === totalPages - 1}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-800 cursor-pointer"
            >
              <span>{isHindi ? 'अगला पृष्ठ' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50 ml-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isHindi ? '25-पृष्ठ PDF डाउनलोड' : 'Download 25-Page PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Helper Component to Render 1 Page in Authentic Vedic Parchment Style
const RenderSinglePage: React.FC<{
  page: TwentyPageReportPage;
  isHindi: boolean;
  totalPages: number;
}> = ({ page, isHindi, totalPages }) => {
  return (
    <div className="bg-[#05221b] border-2 border-amber-500/30 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6 relative overflow-hidden font-devanagari">
      {/* Ornamental Corner Symbols */}
      <div className="absolute top-2 left-3 text-amber-500/30 text-lg font-serif">✦</div>
      <div className="absolute top-2 right-3 text-amber-500/30 text-lg font-serif">✦</div>

      {/* Page Header */}
      <div className="border-b border-amber-500/30 pb-4 text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black">
          <span>🕉️</span>
          <span>
            {isHindi ? `पृष्ठ ${page.pageNumber} / ${totalPages}` : `PAGE ${page.pageNumber} OF ${totalPages}`}
          </span>
          <span>•</span>
          <span>{isHindi ? page.titleHi : page.titleEn}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-amber-200 mt-2">
          {isHindi ? page.titleHi : page.titleEn}
        </h3>
        <p className="text-xs text-slate-300">
          {isHindi ? page.subtitleHi : page.subtitleEn}
        </p>
      </div>

      {/* Page Sections */}
      <div className="space-y-6">
        {page.sections.map((sec, sIdx) => (
          <div
            key={sIdx}
            className="bg-slate-950/70 border border-emerald-900/60 rounded-xl p-4 sm:p-5 space-y-3 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/40 pb-2">
              <h4 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                <span className="text-amber-400">✦</span>
                <span>{isHindi ? sec.headingHi : sec.headingEn}</span>
              </h4>
              {sec.highlightBadge && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {sec.highlightBadge}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify">
              {isHindi ? sec.contentHi : sec.contentEn}
            </p>

            {/* Render Table Data with word-wrapping and no clipping */}
            {sec.tableData && (
              <div className="overflow-x-auto rounded-lg border border-emerald-900/80 mt-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900/90 text-amber-300 border-b border-emerald-900/80">
                    <tr>
                      {sec.tableData.headers.map((h, hIdx) => (
                        <th key={hIdx} className="px-3 py-2 font-bold break-words min-w-[80px]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/60 bg-slate-950/50">
                    {sec.tableData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-3 py-2 text-slate-200 break-words leading-relaxed ${
                              cIdx === 0 ? 'font-bold text-amber-200' : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Render Bullet Points if Present */}
            {((isHindi ? sec.bulletPointsHi : sec.bulletPointsEn) || []).length > 0 && (
              <ul className="space-y-1.5 pt-2">
                {(isHindi ? sec.bulletPointsHi : sec.bulletPointsEn)?.map((bp, bIdx) => (
                  <li
                    key={bIdx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed"
                  >
                    <span className="text-amber-400 mt-1 shrink-0">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Page Footer Seal */}
      <div className="border-t border-amber-500/20 pt-3 flex flex-wrap items-center justify-between text-[11px] text-emerald-400/80">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>AstroDost AI ISO 9001 Parashari Vedic Standards</span>
        </span>
        <span className="text-amber-400 font-bold">
          {isHindi ? `पृष्ठ ${page.pageNumber} / ${totalPages}` : `Page ${page.pageNumber} of ${totalPages}`}
        </span>
      </div>
    </div>
  );
};
