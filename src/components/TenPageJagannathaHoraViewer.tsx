import React, { useState, useRef } from 'react';
import {
  TenPageHoraReport,
  TenPageHoraPage,
  TenPageHoraSection,
} from '../utils/tenPageJagannathaHoraEngine';
import { Language } from '../types/astrology';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  Download,
  ScrollText,
  Layers,
  Crown,
  Compass,
  BarChart3,
  Grid3X3,
  Activity,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Maximize2,
  Eye,
  Star,
  Award,
} from 'lucide-react';

interface TenPageJagannathaHoraViewerProps {
  report: TenPageHoraReport;
  language: Language;
}

const PAGE_ICONS: Record<number, any> = {
  1: FileText,
  2: Layers,
  3: Grid3X3,
  4: Crown,
  5: Compass,
  6: BarChart3,
  7: Activity,
  8: Star,
  9: Calendar,
  10: Award,
};

export const TenPageJagannathaHoraViewer: React.FC<TenPageJagannathaHoraViewerProps> = ({
  report,
  language,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0); // 0 to 9
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const printContainerRef = useRef<HTMLDivElement>(null);

  const totalPages = report.pages.length;
  const currentPage: TenPageHoraPage = report.pages[currentPageIndex] || report.pages[0];

  const handlePrint = () => {
    window.print();
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const goToPage = (idx: number) => {
    setCurrentPageIndex(idx);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const renderSection = (sec: TenPageHoraSection, sIdx: number) => {
    const heading = language === 'hi' ? sec.headingHi : sec.headingEn;
    const subheading = language === 'hi' ? sec.subheadingHi : sec.subheadingEn;
    const content = language === 'hi' ? sec.contentHi : sec.contentEn;
    const bullets = language === 'hi' ? sec.bulletPointsHi : sec.bulletPointsEn;

    return (
      <div
        key={sIdx}
        className="bg-slate-900/70 border border-amber-500/20 rounded-xl p-4 sm:p-5 shadow-md hover:border-amber-500/40 transition-all space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {heading}
            </h4>
            {subheading && (
              <p className="text-xs text-slate-400 mt-0.5">{subheading}</p>
            )}
          </div>
          {sec.highlightBadge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-200 border border-amber-500/40">
              {sec.highlightBadge}
            </span>
          )}
          {sec.metricBadge && (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-950 text-emerald-300 border border-emerald-500/40">
              {sec.metricBadge.label}: {sec.metricBadge.value}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line text-justify">
          {content}
        </p>

        {bullets && bullets.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {bullets.map((b, bIdx) => (
              <li key={bIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 font-bold shrink-0">✦</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {sec.tableData && (
          <div className="overflow-x-auto mt-3 rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-amber-300 border-b border-slate-800">
                  {sec.tableData.headers.map((h, hIdx) => (
                    <th key={hIdx} className="px-3 py-2 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {sec.tableData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-slate-200">
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderSinglePageContent = (page: TenPageHoraPage) => {
    const Icon = PAGE_ICONS[page.pageNumber] || BookOpen;
    const title = language === 'hi' ? page.titleHi : page.titleEn;
    const subtitle = language === 'hi' ? page.subtitleHi : page.subtitleEn;
    const takeaway = language === 'hi' ? page.keyTakeawayHi : page.keyTakeawayEn;

    return (
      <div
        id={`hora-report-page-${page.pageNumber}`}
        className="hora-print-sheet bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-amber-500/30 rounded-2xl p-4 sm:p-7 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Page Header */}
        <div className="relative border-b-2 border-amber-500/40 pb-4 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                    {language === 'hi' ? `पृष्ठ ${page.pageNumber} / ${totalPages}` : `Page ${page.pageNumber} of ${totalPages}`}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30">
                    {page.badge}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {title}
                </h3>
                <p className="text-xs text-amber-200/80 mt-0.5">{subtitle}</p>
              </div>
            </div>

            {/* Native quick stamp */}
            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4 self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end bg-slate-950/60 p-2 sm:p-0 rounded-lg">
              <span className="text-xs font-bold text-amber-300">{report.nativeName}</span>
              <span className="text-[10px] text-slate-400">{report.birthSummary}</span>
              <span className="text-[10px] text-emerald-400 font-mono">Swiss Ephemeris • Nirayana Lahiri</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4 relative">
          {page.sections.map((section, sIdx) => renderSection(section, sIdx))}
        </div>

        {/* Summary Table if present */}
        {page.summaryTable && (
          <div className="mt-5 rounded-xl border border-amber-500/30 overflow-hidden bg-slate-950/80 shadow-md">
            <div className="bg-amber-500/20 px-4 py-2 border-b border-amber-500/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h5 className="text-xs font-bold text-amber-200">
                {language === 'hi' ? 'विशेष वर्ग / कारक सांख्यिकी सारणी' : 'Divisional / Karaka Statistical Matrix'}
              </h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-900/90 text-amber-300 border-b border-slate-800">
                    {page.summaryTable.headers.map((h, i) => (
                      <th key={i} className="px-3 py-2 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {page.summaryTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/30">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 text-slate-200">{String(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Key Takeaway Box */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-emerald-500/15 border border-amber-500/40 shadow-inner flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {language === 'hi' ? 'महत्वपूर्ण निष्कर्ष एवं फलित सारांश' : 'Crucial Synthesis & Vedic Takeaway'}
            </h5>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
              {takeaway}
            </p>
          </div>
        </div>

        {/* Page Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>{report.nativeName} • {language === 'hi' ? 'जगन्नाथ होरा १०-पृष्ठीय सम्पूर्ण विश्लेषण' : 'Jagannatha Hora 10-Page Master Report'}</span>
          <span className="font-bold text-amber-400">
            {language === 'hi' ? `पृष्ठ ${page.pageNumber} / ${totalPages}` : `Page ${page.pageNumber} of ${totalPages}`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" ref={printContainerRef}>
      {/* Top Header Card */}
      <div className="no-print bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 p-0.5 shadow-xl shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-300">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  {language === 'hi' ? 'जगन्नाथ होरा सम्पूर्ण १०-पृष्ठीय महा-विश्लेषण' : 'Jagannatha Hora Complete 10-Page Master Dossier'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px]">
                  10 PAGES
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
                {language === 'hi'
                  ? 'महर्षि पराशर एवं महर्षि जैमिनी के सिद्धांतों पर आधारित संपूर्ण वैदिक, खगोलीय, षोडशवर्ग, षड्बल, अष्टकवर्ग व विंशोत्तरी विश्लेषण।'
                  : 'Exhaustive 10-page master analysis covering Ephemeris, D1-D60 Shodashvargas, Karakas, Arudhas, Shadbala, SAV, Avasthas, and 120-year Dasha tree.'}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'single'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'एक पृष्ठ' : 'Single Page'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सभी १० पृष्ठ' : 'All 10 Pages'}</span>
              </button>
            </div>

            {/* Print / Download Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्रिंट / PDF डाउनलोड (१० पृष्ठ)' : 'Print / Download PDF (10 Pages)'}</span>
            </button>
          </div>
        </div>

        {/* 10 Pages Tab Strip */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {report.pages.map((p, idx) => {
            const isSelected = viewMode === 'single' && currentPageIndex === idx;
            const Icon = PAGE_ICONS[p.pageNumber] || FileText;
            return (
              <button
                key={p.pageNumber}
                type="button"
                onClick={() => {
                  setViewMode('single');
                  goToPage(idx);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-105'
                    : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
                title={p.titleHi}
              >
                <Icon className="w-3 h-3" />
                <span>{language === 'hi' ? `पृष्ठ ${p.pageNumber}` : `Page ${p.pageNumber}`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Single Page View Controls */}
      {viewMode === 'single' && (
        <div className="no-print flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'पिछला पृष्ठ' : 'Previous'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {language === 'hi' ? 'वर्तमान पृष्ठ:' : 'Current Page:'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
              {currentPageIndex + 1} / {totalPages}
            </span>
            <span className="text-xs font-bold text-amber-300 hidden sm:inline">
              {language === 'hi' ? currentPage.titleHi : currentPage.titleEn}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-xs font-semibold text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
          >
            <span>{language === 'hi' ? 'अगला पृष्ठ' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === 'single' ? (
        <div>{renderSinglePageContent(currentPage)}</div>
      ) : (
        <div className="space-y-8">
          {report.pages.map((page) => (
            <div key={page.pageNumber} className="print-page-break">
              {renderSinglePageContent(page)}
            </div>
          ))}
        </div>
      )}

      {/* Bottom Page Navigation (Single view only) */}
      {viewMode === 'single' && (
        <div className="no-print flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'पिछला पृष्ठ' : 'Previous Page'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            {report.pages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                  currentPageIndex === i
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-xs font-bold text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
          >
            <span>{language === 'hi' ? 'अगला पृष्ठ' : 'Next Page'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Print CSS injection for crisp multi-page printing */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .hora-print-sheet {
            page-break-after: always;
            break-after: page;
            background: #ffffff !important;
            color: #111827 !important;
            border: 1px solid #d1d5db !important;
            box-shadow: none !important;
            padding: 24px !important;
            margin-bottom: 24px !important;
          }
          .hora-print-sheet * {
            color: #111827 !important;
            border-color: #e5e7eb !important;
          }
          .hora-print-sheet h3,
          .hora-print-sheet h4,
          .hora-print-sheet h5 {
            color: #b45309 !important;
          }
          .print-page-break {
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>
    </div>
  );
};
