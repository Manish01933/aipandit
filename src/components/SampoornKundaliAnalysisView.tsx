import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  HelpCircle,
  Clock,
  Compass,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Award,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Share2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  User,
  MapPin,
  Flame,
  Star,
  Activity,
  Zap,
} from 'lucide-react';
import { KundaliResult, Language } from '../types/astrology';
import {
  SampoornKundaliAnalysisReport,
  SampoornHouseItem,
  SampoornPlanetItem,
} from '../types/sampoornKundali';
import { generateVedicSampoornAnalysis } from '../utils/sampoornKundaliEngine';

interface Props {
  kundali: KundaliResult;
  language?: Language;
  selectedModel?: string;
  onAskAnother?: () => void;
  onOpenTwentyPageReport?: () => void;
}

const PRESET_QUESTIONS_HI = [
  'मेरा करियर कैसा रहेगा और अगले कुछ वर्षों में क्या बदलाव आएंगे?',
  'मेरा विवाह कब और कैसा होगा? जीवनसाथी का स्वभाव कैसा रहेगा?',
  'धन, संपत्ति और business के योग कैसे हैं?',
  'क्या मेरी कुंडली में विदेश जाने या वहां बसने के योग हैं?',
  'अगले 5 वर्षों में कौन से महत्वपूर्ण समय व उपलब्धियां आ सकती हैं?',
  'मेरी कुंडली की सबसे बड़ी strengths और मुख्य challenges क्या हैं?',
];

const PRESET_QUESTIONS_EN = [
  'How will my career unfold and what major shifts are ahead?',
  'When will I get married and what will my spouse be like?',
  'What are my prospects for wealth, finance and business enterprise?',
  'Are there foreign travel or overseas settlement indications in my chart?',
  'What key milestones and life events are likely over the next 5 years?',
  'What are the greatest innate strengths and key challenges in my kundali?',
];

const LOADING_STAGES = [
  { textHi: 'जन्म विवरण पढ़ा जा रहा है...', textEn: 'Reading birth biodata & coordinate markers...' },
  { textHi: 'ग्रह एवं 12 भावों का सूक्ष्म विश्लेषण...', textEn: 'Analyzing planets, dignities & 12 bhavas...' },
  { textHi: 'प्रमुख योगों एवं दोषों की पहचान...', textEn: 'Identifying auspicious yogas & mitigating doshas...' },
  { textHi: 'विभाजित कुंडलियों (D1, D9, D10, D2...) का अध्ययन...', textEn: 'Calculating divisional varga charts (D1, D9, D10, D2)...' },
  { textHi: 'विंशोत्तरी दशा एवं अंतर्दशा का अध्ययन...', textEn: 'Aligning Vimshottari Mahadasha & Antardasha timings...' },
  { textHi: 'प्रश्न के संदर्भ में ज्योतिषीय संकेतों का मिलान...', textEn: 'Cross-referencing astrological indicators for your query...' },
  { textHi: 'सम्पूर्ण निष्कर्ष एवं समय सारणी तैयार की जा रही है...', textEn: 'Synthesizing final holistic predictions & timeline...' },
];

export const SampoornKundaliAnalysisView: React.FC<Props> = ({
  kundali,
  language = 'hi',
  selectedModel = 'auto',
  onAskAnother,
  onOpenTwentyPageReport,
}) => {
  const isHindi = language === 'hi';
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  const [report, setReport] = useState<SampoornKundaliAnalysisReport | null>(null);
  const [activeTab, setActiveTab] = useState<'answer' | 'planets' | 'houses' | 'divisional' | 'timeline' | 'all'>('answer');
  const [expandedHouse, setExpandedHouse] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isQuestionValid = question.trim().length >= 4;

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle stage transitions during loading
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStageIndex(0);
      interval = setInterval(() => {
        setLoadingStageIndex((prev) => {
          if (prev < LOADING_STAGES.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleStartAnalysis = async (customQ?: string) => {
    const queryToUse = (customQ || question).trim();
    if (queryToUse.length < 4) return;

    setIsLoading(true);
    setLoadingStageIndex(0);

    // 1. Generate 100% authentic deterministic baseline report from calculated Kundali & Hora data
    const activeLang: Language = language === 'en' ? 'en' : 'hi';
    const baselineReport = generateVedicSampoornAnalysis(kundali, queryToUse, activeLang);

    try {
      // 2. Query AI endpoint for deep natural language synthesis
      const response = await fetch('/api/ai/sampoorn-kundali-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: queryToUse,
          kundali,
          language,
          selectedModel,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.analysisText && typeof data.analysisText === 'string') {
          baselineReport.fullMarkdownReport = data.analysisText;
          baselineReport.modelUsed = data.modelUsed || 'AI Vedic Model';
          baselineReport.isLiveAI = Boolean(data.isLiveAI);
        }
      }
    } catch (err) {
      console.warn('AI analysis call failed, using high-precision local Vedic engine:', err);
    } finally {
      // Minimum loading animation time for ceremonial polish
      setTimeout(() => {
        setReport(baselineReport);
        setIsLoading(false);
        setTimeout(() => {
          reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 2500);
    }
  };

  const handleCopyReport = () => {
    if (!report) return;
    const textToCopy = `✨ सम्पूर्ण कुंडली विश्लेषण — AstroDost ✨
जातक: ${report.birthDetails.name} | जन्म: ${report.birthDetails.dob} ${report.birthDetails.tob}
प्रश्न: "${report.userQuestion}"

🔮 उत्तर:
${report.questionAnalysis.directAnswer}

ज्योतिषीय आधार:
${report.questionAnalysis.astrologicalBasis}

प्रमुख संकेत:
${report.questionAnalysis.keyIndicators.join('\n')}

संभावित समयावधि:
${report.questionAnalysis.timingSignals}

अंतिम निष्कर्ष:
${report.questionAnalysis.finalConclusion}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleSpeech = () => {
    if (!report || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const narration = `${report.questionAnalysis.directAnswer}. ${report.questionAnalysis.finalConclusion}`;
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = isHindi ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const resetForAnotherQuestion = () => {
    setReport(null);
    setQuestion('');
    if (onAskAnother) onAskAnother();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  const presetQuestions = isHindi ? PRESET_QUESTIONS_HI : PRESET_QUESTIONS_EN;

  return (
    <div id="sampoorn-kundali-section" className="w-full mt-10 mb-12">
      {/* 1. Main Feature Entrance Card (Always visible once Kundali is generated) */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-2xl p-6 sm:p-8">
        {/* Glow ambient decoration */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Block */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium tracking-wide mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{isHindi ? 'विस्तृत वैदिक फलित' : 'Deep Vedic Kundali AI'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-2.5">
              <span>✨ {isHindi ? 'सम्पूर्ण कुंडली विश्लेषण' : 'Complete Kundali Analysis'}</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-1.5 max-w-3xl leading-relaxed">
              {isHindi
                ? '“अपनी कुंडली को गहराई से समझें — ग्रह, भाव, योग, दशा और प्रमुख जीवन संकेतों का विस्तृत AI विश्लेषण।”'
                : '“Understand your horoscope deeply — a comprehensive AI interpretation of planets, houses, yogas, dashas, and life signals.”'}
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {onOpenTwentyPageReport && (
              <button
                type="button"
                onClick={onOpenTwentyPageReport}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300"
              >
                <span>📜</span>
                <span>{isHindi ? '20+ पृष्ठीय महापत्रिका खोलें' : 'Open 20-Page Report'}</span>
              </button>
            )}

            {/* Locked Birth Data Pill */}
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-300">
              <User className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <div className="font-semibold text-slate-200">{kundali.birthDetails.name || 'Jatak'}</div>
                <div className="text-slate-400">
                  {kundali.birthDetails.dob} • {kundali.birthDetails.tob} • {kundali.ascendantSignHindi} लग्न
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-400 ml-auto" title="Birth data locked & verified" />
            </div>
          </div>
        </div>

        {/* 2. QUESTION-FIRST INPUT SECTION */}
        <div className="relative z-10 mt-6">
          <label htmlFor="user-question-input" className="block text-sm font-semibold text-amber-200 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              {isHindi ? 'अपना प्रश्न पूछें' : 'Ask Your Question'}
              <span className="text-xs font-normal text-rose-400">* {isHindi ? '(अनिवार्य)' : '(Required)'}</span>
            </span>
            <span className="text-xs text-slate-400 font-normal">
              {question.length}/300 {isHindi ? 'अक्षर' : 'chars'}
            </span>
          </label>

          <div className="relative">
            <textarea
              id="user-question-input"
              ref={inputRef}
              rows={3}
              maxLength={300}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              placeholder={
                isHindi
                  ? 'उदाहरण: मेरा करियर कैसा रहेगा और अगले कुछ वर्षों में कौन से महत्वपूर्ण बदलाव आ सकते हैं?'
                  : 'Example: How will my career unfold and what major shifts or promotions can I anticipate over the next few years?'
              }
              className={`w-full px-4 py-3.5 rounded-xl text-slate-100 placeholder-slate-500 bg-slate-900/90 border transition-all text-sm sm:text-base leading-relaxed resize-none focus:outline-none focus:ring-2 ${
                isQuestionValid
                  ? 'border-amber-500/60 focus:ring-amber-500/30'
                  : 'border-slate-700 focus:ring-slate-600'
              }`}
            />
          </div>

          {/* Quick Preset Questions Chips */}
          <div className="mt-3">
            <span className="text-xs font-medium text-slate-400 block mb-2">
              {isHindi ? '💡 त्वरित प्रश्न चुनें:' : '💡 Or pick a suggested question:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuestion(q)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-amber-500/15 text-slate-300 hover:text-amber-200 border border-slate-700 hover:border-amber-500/40 transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* 3. BUTTON STATE & HELPER */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <div>
              {!isQuestionValid ? (
                <p className="text-xs text-amber-300/80 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {isHindi
                    ? 'कृपया पहले अपना प्रश्न दर्ज करें — विश्लेषण बटन सक्रिय हो जाएगा।'
                    : 'Please enter your question first to activate the comprehensive analysis.'}
                </p>
              ) : (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {isHindi
                    ? 'प्रश्न तैयार है — 23 प्रमुख वैदिक आयामों में विश्लेषण किया जाएगा।'
                    : 'Question ready — analysis spans 23 Vedic dimensions & divisional charts.'}
                </p>
              )}
            </div>

            <button
              id="start-sampoorn-analysis-btn"
              type="button"
              disabled={!isQuestionValid || isLoading}
              onClick={() => handleStartAnalysis()}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isQuestionValid && !isLoading
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 cursor-pointer shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-0.5'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                  <span>{isHindi ? 'विश्लेषण तैयार हो रहा है...' : 'Generating Deep Analysis...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>✨ {isHindi ? 'सम्पूर्ण कुंडली विश्लेषण' : 'Analyze Complete Kundali'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4. ANIMATED PROFESSIONAL LOADING EXPERIENCE */}
        {isLoading && (
          <div className="relative z-10 mt-8 p-6 rounded-xl bg-slate-950/80 border border-amber-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Compass className="w-4 h-4 text-amber-400 animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-amber-200">
                  {isHindi ? 'आपकी कुंडली का गहन विश्लेषण तैयार किया जा रहा है…' : 'Synthesizing your profound horoscope report…'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isHindi ? 'प्रामाणिक वैदिक गणना इंजन एवं AI व्याख्या प्रणाली सक्रिय है' : 'Vedic planetary engine & AI interpretation active'}
                </p>
              </div>
            </div>

            {/* Stages Checklist */}
            <div className="space-y-2.5">
              {LOADING_STAGES.map((stage, idx) => {
                const isDone = idx < loadingStageIndex;
                const isCurrent = idx === loadingStageIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 text-xs sm:text-sm transition-all duration-300 ${
                      isDone
                        ? 'text-emerald-400 font-medium'
                        : isCurrent
                        ? 'text-amber-300 font-semibold'
                        : 'text-slate-600'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    <span>{isHindi ? stage.textHi : stage.textEn}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. ANALYSIS REPORT OUTPUT (Order strictly adhering to 23 sections) */}
      {report && (
        <div ref={reportRef} className="mt-8 space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-slate-200">
                {isHindi ? 'सक्रिय विश्लेषण रिपोर्ट' : 'Active Analysis Report'}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{report.timestamp}</span>
              {report.isLiveAI && (
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Live AI ({report.modelUsed || 'Vedic'})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSpeech}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                title={isSpeaking ? 'Stop listening' : 'Listen to summary'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isSpeaking ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'सुनें' : 'Listen')}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                title="Copy report"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी करें' : 'Copy')}</span>
              </button>

              <button
                type="button"
                onClick={resetForAnotherQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isHindi ? 'नया प्रश्न' : 'Ask Another'}</span>
              </button>
            </div>
          </div>

          {/* Section 2 & 3: Biodata Summary + User Question Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* User Biodata Summary */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                {isHindi ? 'जातक जन्म विवरण' : 'Native Biodata Summary'}
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">{isHindi ? 'नाम' : 'Name'}:</span>
                  <span className="font-semibold text-slate-200">{report.birthDetails.name || 'Jatak'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">{isHindi ? 'जन्म तिथि' : 'DOB'}:</span>
                  <span className="text-slate-200">{report.birthDetails.dob}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">{isHindi ? 'समय' : 'Time'}:</span>
                  <span className="text-slate-200">{report.birthDetails.tob}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">{isHindi ? 'स्थान' : 'Place'}:</span>
                  <span className="text-slate-200 truncate max-w-[160px]" title={report.birthDetails.pob}>
                    {report.birthDetails.pob}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isHindi ? 'अक्षांश/देशांतर' : 'Coordinates'}:</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {report.birthDetails.lat}°N, {report.birthDetails.lon}°E
                  </span>
                </div>
              </div>
            </div>

            {/* User Question Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    {report.questionAnalysis.categoryLabelHindi} ({report.questionAnalysis.categoryLabel})
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {report.questionAnalysis.confidenceLabel}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-2 leading-snug">
                  "{report.userQuestion}"
                </h3>
              </div>

              <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>{report.questionAnalysis.confidenceBasis}</span>
              </p>
            </div>
          </div>

          {/* Section 4: Overall Kundali Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[11px] text-slate-400 mb-1">{isHindi ? 'लग्न राशि' : 'Ascendant'}</div>
              <div className="text-sm sm:text-base font-bold text-amber-300">{kundali.ascendantSignHindi}</div>
              <div className="text-[11px] text-slate-500">{kundali.ascendantDegree}</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[11px] text-slate-400 mb-1">{isHindi ? 'चंद्र राशि' : 'Moon Sign'}</div>
              <div className="text-sm sm:text-base font-bold text-slate-200">{kundali.moonSignHindi}</div>
              <div className="text-[11px] text-slate-500">{kundali.moonSign}</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[11px] text-slate-400 mb-1">{isHindi ? 'सूर्य राशि' : 'Sun Sign'}</div>
              <div className="text-sm sm:text-base font-bold text-slate-200">{kundali.sunSignHindi}</div>
              <div className="text-[11px] text-slate-500">{kundali.sunSign}</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[11px] text-slate-400 mb-1">{isHindi ? 'जन्म नक्षत्र' : 'Nakshatra'}</div>
              <div className="text-sm sm:text-base font-bold text-teal-300">{kundali.birthNakshatra}</div>
              <div className="text-[11px] text-slate-500">स्वामी: {kundali.nakshatraLord || 'Ketu'}</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[11px] text-slate-400 mb-1">{isHindi ? 'सक्रिय महादशा' : 'Active Dasha'}</div>
              <div className="text-sm sm:text-base font-bold text-orange-300">
                {report.dashaAnalysis.mahadasha.planetHindi}
              </div>
              <div className="text-[11px] text-slate-500">{report.dashaAnalysis.mahadasha.planet}</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-[11px] text-slate-400 mb-1">{isHindi ? 'दोष स्थिति' : 'Dosha Status'}</div>
              <div className="text-sm sm:text-base font-bold text-slate-200">
                {kundali.dosha.isManglik ? (isHindi ? 'मांगलिक' : 'Manglik') : (isHindi ? 'निर्दोष' : 'Clean')}
              </div>
              <div className="text-[11px] text-slate-500">
                {kundali.yogas.length} {isHindi ? 'शुभ योग' : 'Yogas'}
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex border-b border-slate-800 overflow-x-auto gap-1 pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('answer')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'answer'
                  ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>🔮 {isHindi ? 'प्रश्न का उत्तर व निष्कर्ष' : 'Direct Answer & Remedies'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'timeline'
                  ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>📅 {isHindi ? 'जीवन घटनाक्रम (Timeline)' : 'Life Timeline'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('planets')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'planets'
                  ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>🪐 {isHindi ? 'लग्न व ग्रह विश्लेषण' : 'Lagna & Planets'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('houses')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'houses'
                  ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>🏠 {isHindi ? '12 भावों का अध्ययन' : '12 Houses Analysis'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('divisional')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'divisional'
                  ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>🔱 {isHindi ? 'विभाजित कुंडलियां (D1, D9, D10, D2)' : 'Divisional Charts'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 text-purple-400" />
              <span>📜 {isHindi ? 'सम्पूर्ण रिपोर्ट देखें' : 'View Full Report'}</span>
            </button>
          </div>

          {/* TAB CONTENT: 17. QUESTION-SPECIFIC DEEP ANALYSIS (Direct Answer First) */}
          {(activeTab === 'answer' || activeTab === 'all') && (
            <div className="space-y-6">
              {/* Main Answer Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                    {isHindi ? 'वैदिक समाधान' : 'Vedic Solution'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <span>🔮 {isHindi ? 'आपके प्रश्न का उत्तर' : 'Answer to Your Question'}</span>
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">"{report.userQuestion}"</p>
                </div>

                {/* सीधा निष्कर्ष */}
                <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl p-4 sm:p-5">
                  <h4 className="text-sm font-bold text-amber-300 mb-1.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {isHindi ? 'सीधा निष्कर्ष (Direct Conclusion)' : 'Direct Conclusion'}
                  </h4>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    {report.questionAnalysis.directAnswer}
                  </p>
                </div>

                {/* विस्तृत ज्योतिषीय आधार */}
                <div>
                  <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-teal-400" />
                    {isHindi ? 'विस्तृत ज्योतिषीय आधार (Astrological Foundations)' : 'Astrological Basis'}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    {report.questionAnalysis.astrologicalBasis}
                  </p>
                </div>

                {/* प्रमुख संकेत + अवसर + सावधानियाँ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* प्रमुख संकेत */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-sky-400" />
                      {isHindi ? 'प्रमुख संकेत' : 'Key Indicators'}
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {report.questionAnalysis.keyIndicators.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-sky-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* अवसर */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      {isHindi ? 'सकारात्मक अवसर' : 'Opportunities'}
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {report.questionAnalysis.opportunities.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* सावधानियाँ */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      {isHindi ? 'सावधानियाँ' : 'Precautions'}
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {report.questionAnalysis.precautions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* समय संबंधी संकेत */}
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1">
                      {isHindi ? 'समय संबंधी संकेत (Timing Signals)' : 'Timing Windows'}
                    </h4>
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                      {report.questionAnalysis.timingSignals}
                    </p>
                  </div>
                </div>

                {/* अंतिम निष्कर्ष */}
                <div className="border-t border-slate-800 pt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {isHindi ? 'अंतिम निष्कर्ष व वैदिक मार्गदर्शन' : 'Final Conclusion & Vedic Blessing'}
                  </h4>
                  <p className="text-slate-200 text-sm font-medium leading-relaxed">
                    {report.questionAnalysis.finalConclusion}
                  </p>
                </div>
              </div>

              {/* 11 & 14-16. Dasha Analysis Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span>🕉️ {isHindi ? 'दशा एवं अंतर्दशा विश्लेषण' : 'Dasha & Sub-Period Analysis'}</span>
                  </h3>
                  <span className="text-xs text-slate-400">विंशोत्तरी दशा चक्र</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">{isHindi ? 'सक्रिय महादशा' : 'Active Mahadasha'}</div>
                    <div className="text-base font-bold text-orange-300 mt-0.5">
                      {report.dashaAnalysis.mahadasha.planetHindi} ({report.dashaAnalysis.mahadasha.planet})
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      {report.dashaAnalysis.mahadasha.startDate} {isHindi ? 'से' : 'to'} {report.dashaAnalysis.mahadasha.endDate}
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {report.dashaAnalysis.mahadasha.mainThemes}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">{isHindi ? 'सक्रिय अंतर्दशा' : 'Active Antardasha'}</div>
                    <div className="text-base font-bold text-teal-300 mt-0.5">
                      {report.dashaAnalysis.antardasha.planetHindi} ({report.dashaAnalysis.antardasha.planet})
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      {report.dashaAnalysis.antardasha.startDate} {isHindi ? 'से' : 'to'} {report.dashaAnalysis.antardasha.endDate}
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {report.dashaAnalysis.antardasha.likelyThemes}
                    </p>
                  </div>
                </div>

                {/* "यह दशा आपके जीवन में क्या activate कर रही है?" */}
                <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent p-4 rounded-xl border border-orange-500/20">
                  <h4 className="text-xs font-bold text-orange-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-orange-400" />
                    {isHindi ? 'यह दशा आपके जीवन में क्या सक्रिय (Activate) कर रही है?' : 'What this Dasha is activating in your life'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {report.dashaAnalysis.whatItActivates}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 21. MAJOR LIFE EVENTS TIMELINE */}
          {(activeTab === 'timeline' || activeTab === 'all') && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-400" />
                    <span>📅 {isHindi ? 'संभावित प्रमुख जीवन घटनाएँ (Life Timeline)' : 'Probable Life Timeline'}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {isHindi
                      ? '“ज्योतिषीय संकेतों एवं दशा गोचर के आधार पर संभावित समयावधि”'
                      : '“Probable milestone windows based on planetary cycles & transits”'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🟢 मजबूत</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">🟡 मध्यम</span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">🔵 हल्के</span>
                </div>
              </div>

              {/* Visual Vertical Timeline */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-8">
                {report.lifeTimeline.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {/* Node Dot */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-500 group-hover:scale-125 transition-all shadow" />

                    <div className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-xl p-5 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                            {item.yearRange}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-100">{item.title}</h4>
                        </div>

                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                          {item.confidenceLabel}
                        </span>
                      </div>

                      <div className="text-xs text-teal-300/90 font-medium mb-2">{item.theme}</div>

                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg">
                          <Compass className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span>{item.astrologicalBasis}</span>
                        </div>

                        <div className="flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-lg text-emerald-300">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{item.guidance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timing Windows Callout */}
              <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="font-bold text-amber-300 uppercase tracking-wide">
                  {isHindi ? 'संभावित समय सीमाएँ (Possible Timing Windows):' : 'Possible Timing Windows:'}
                </div>
                {report.timingWindows.map((tw, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    <span>{tw}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: 5 & 6. LAGNA & PLANETARY ANALYSIS */}
          {(activeTab === 'planets' || activeTab === 'all') && (
            <div className="space-y-6">
              {/* 5. Lagna Analysis (🔱 लग्न विश्लेषण) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span>🔱 {isHindi ? 'लग्न विश्लेषण (Lagna Analysis)' : 'Ascendant Analysis'}</span>
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                    {report.lagnaAnalysis.lagnaSignHindi} ({report.lagnaAnalysis.degree})
                  </span>
                </div>

                <div className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <strong className="text-amber-300">{isHindi ? 'लग्नेश स्थिति:' : 'Lagna Lord Placement:'}</strong>{' '}
                  {report.lagnaAnalysis.lagnaLordPlacement}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Natural Strengths */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {isHindi ? 'प्राकृतिक शक्तियां (Natural Strengths)' : 'Natural Strengths'}
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {report.lagnaAnalysis.naturalStrengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Challenges */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      {isHindi ? 'संभावित चुनौतियाँ (Growth Areas)' : 'Challenges'}
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {report.lagnaAnalysis.challenges.map((ch, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{ch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                  <div>
                    <strong className="text-slate-200">{isHindi ? 'निर्णय शैली:' : 'Decision-Making Style:'}</strong>{' '}
                    {report.lagnaAnalysis.decisionMakingTendencies}
                  </div>
                  <div>
                    <strong className="text-slate-200">{isHindi ? 'जीवन की दिशा:' : 'Overall Direction:'}</strong>{' '}
                    {report.lagnaAnalysis.overallLifeDirection}
                  </div>
                </div>
              </div>

              {/* 6. Complete Planetary Analysis (🪐 ग्रह एवं भाव विश्लेषण) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span>🪐 {isHindi ? 'ग्रह एवं भाव विश्लेषण' : 'Planetary Placements & Dignities'}</span>
                  </h3>
                  <span className="text-xs text-slate-400">9 नवग्रह एवं लग्न</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {report.planetaryAnalysis.map((p, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                          <span>{p.hindiName} ({p.planet})</span>
                          {p.isRetrograde && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              वक्र
                            </span>
                          )}
                          {p.isCombust && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              अस्त
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-amber-300">{p.dignityHindi}</span>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                        <span>{p.signHindi} • {p.house}वां भाव</span>
                        <span className="font-mono text-slate-300">{p.degree}</span>
                      </div>

                      <div className="text-xs text-slate-400">
                        {isHindi ? 'नक्षत्र' : 'Nakshatra'}: <span className="text-slate-200">{p.nakshatra} (पद {p.pada})</span>
                      </div>

                      <p className="text-[11px] text-emerald-400/90 leading-relaxed bg-emerald-500/5 p-2 rounded">
                        ✓ {p.positiveInfluence}
                      </p>

                      <p className="text-[11px] text-slate-400 italic">
                        {p.relevanceToQuestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 7. 12 HOUSES ANALYSIS */}
          {(activeTab === 'houses' || activeTab === 'all') && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sky-400" />
                    <span>🏠 {isHindi ? '12 भावों का विस्तृत विश्लेषण' : '12 Bhavas Comprehensive Reading'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isHindi ? 'प्रत्येक भाव का अधिपति, स्थित ग्रह एवं जीवन क्षेत्र' : 'House significations, lords & occupants'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {report.housesAnalysis.map((house: SampoornHouseItem) => {
                  const isExpanded = expandedHouse === house.houseNumber;
                  return (
                    <div
                      key={house.houseNumber}
                      className={`border rounded-xl transition-all ${
                        house.isQuestionRelevant
                          ? 'border-amber-500/50 bg-amber-500/5'
                          : 'border-slate-800 bg-slate-950/60'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedHouse(isExpanded ? null : house.houseNumber)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center">
                            {house.houseNumber}
                          </span>
                          <div>
                            <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
                              <span>{house.houseNameHindi}</span>
                              {house.isQuestionRelevant && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                                  {isHindi ? 'प्रश्न संबंधी' : 'Query Relevant'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">
                              {house.signHindi} • भावेश: {house.houseLordHindi} ({house.lordPlacement})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 hidden sm:inline">
                            {house.occupyingPlanets.join(', ')}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 text-xs space-y-2">
                          <div className="text-slate-300">
                            <strong>{isHindi ? 'जीवन क्षेत्र:' : 'Areas:'}</strong> {house.relevantLifeAreas}
                          </div>
                          <div className="text-emerald-400">
                            <strong>{isHindi ? 'शुभ फल:' : 'Auspicious indications:'}</strong> {house.positiveIndications}
                          </div>
                          <div className="text-amber-400/90">
                            <strong>{isHindi ? 'सावधानी:' : 'Caution:'}</strong> {house.challenges}
                          </div>
                          <div className="text-slate-400">
                            <strong>{isHindi ? 'स्थित ग्रह:' : 'Occupants:'}</strong> {house.occupyingPlanets.join(', ')} |{' '}
                            <strong>{isHindi ? 'दृष्टियां:' : 'Aspects:'}</strong> {house.aspectingPlanets.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: 8-13. DIVISIONAL CHARTS & YOGAS/DOSHAS */}
          {(activeTab === 'divisional' || activeTab === 'all') && (
            <div className="space-y-6">
              {/* 8. Yogas & Doshas */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>✨ {isHindi ? 'प्रमुख योग एवं दोष विश्लेषण' : 'Major Yogas & Doshas'}</span>
                </h3>

                {/* Yogas */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
                    {isHindi ? 'सक्रिय शुभ योग' : 'Auspicious Classical Yogas'} ({report.yogasAnalysis.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.yogasAnalysis.map((y, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 text-sm">{y.nameHindi}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold">{y.strength}</span>
                        </div>
                        <p className="text-xs text-slate-300">{y.potentialResults}</p>
                        <p className="text-[11px] text-slate-400 italic">{y.activationPeriod}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doshas & Remedies */}
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2.5">
                    {isHindi ? 'दोष स्थिति एवं वैदिक निवारण उपाय' : 'Doshas & Remedial Guidance'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {report.doshasAnalysis.map((d, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="font-bold text-slate-200 text-xs">{d.nameHindi}</div>
                        <div className="text-xs font-semibold text-amber-400">{d.status}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{d.description}</p>
                        <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded mt-2">
                          <strong>{isHindi ? 'उपाय:' : 'Remedy:'}</strong> {d.remedy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 9-13. Divisional Charts (D1, D9, D10, D2, D7, D4, D3, D60) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>🔱 {isHindi ? 'विभाजित कुंडलियों का प्रामाणिक विश्लेषण' : 'Divisional Varga Charts'}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* D1 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-amber-300">{report.divisionalCharts.d1.name}</div>
                    <p className="text-xs text-slate-300">{report.divisionalCharts.d1.keyPlacements}</p>
                    <p className="text-xs text-slate-400">{report.divisionalCharts.d1.strengthsAndChallenges}</p>
                  </div>

                  {/* D9 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-teal-300">{report.divisionalCharts.d9.name}</div>
                    <p className="text-xs text-slate-300">{report.divisionalCharts.d9.keyPlacements}</p>
                    <p className="text-xs text-slate-400">{report.divisionalCharts.d9.relevanceToQuestion}</p>
                  </div>

                  {/* D10 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-sky-300">{report.divisionalCharts.d10.name}</div>
                    <p className="text-xs text-slate-300">{report.divisionalCharts.d10.keyPlacements}</p>
                    <p className="text-xs text-slate-400">{report.divisionalCharts.d10.relevanceToQuestion}</p>
                  </div>

                  {/* D2 Hora */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-orange-300">{report.divisionalCharts.d2Hora.name}</div>
                    <p className="text-xs text-slate-300">{report.divisionalCharts.d2Hora.keyPlacements}</p>
                    <p className="text-xs text-slate-400">{report.divisionalCharts.d2Hora.relevanceToQuestion}</p>
                  </div>
                </div>

                {/* Other divisional charts (D7, D4, D3, D60) */}
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {isHindi ? 'अन्य प्रासंगिक वर्ग चक्र' : 'Other Pertinent Divisional Charts'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {report.divisionalCharts.otherCharts.map((ch, idx) => (
                      <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs">
                        <div className="font-bold text-slate-200">{ch.hindiName}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{ch.strengthsAndChallenges}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 22. Final Summary Box */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8">
            <h4 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{isHindi ? 'सम्पूर्ण फलित निष्कर्ष एवं दैवीय शुभाशीर्वाद' : 'Holistic Synthesis & Vedic Blessings'}</span>
            </h4>
            <div className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {report.finalSummary}
            </div>
          </div>

          {/* 23. “एक और प्रश्न पूछें” SECTION (USES THE SAME LOADED KUNDALI DATA) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-100 flex items-center justify-center gap-2">
              <span>🔮 {isHindi ? 'एक और प्रश्न पूछें' : 'Ask Another Question'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {isHindi
                ? `जातक (${report.birthDetails.name}) की यही प्रामाणिक कुंडली सक्रिय रहेगी। आप अपने करियर, विवाह, धन या परिवार से जुड़ा कोई अन्य प्रश्न पूछ सकते हैं।`
                : `The same verified horoscope for ${report.birthDetails.name} remains locked. Inquire about any other life area without re-entering birth details.`}
            </p>
            <button
              type="button"
              onClick={resetForAnotherQuestion}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isHindi ? 'नया प्रश्न दर्ज करें' : 'Enter New Question'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
