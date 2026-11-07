import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BirthDetails,
  KundaliResult,
  Language,
  VargaCode,
  ChatMessage,
} from '../types/astrology';
import { calculateJagannathaHora, VARGA_METADATA } from '../utils/jagannathaHoraEngine';
import { calculateAnkJyotish } from '../utils/ankJyotishCalculations';
import { calculateLoShuGrid } from '../utils/loShuCalculations';
import { KundaliChartVisualizer } from './KundaliChartVisualizer';
import { exportKundaliPDF } from '../utils/pdfGenerator';
import { exportTwentyPageKundaliPDF } from '../utils/twentyPagePdfGenerator';
import { TwentyPageKundaliReaderModal } from './TwentyPageKundaliReaderModal';
import { MarkdownChatRenderer, stripMarkdownForSpeech } from './MarkdownChatRenderer';
import {
  Compass,
  FileText,
  Clock,
  Sparkles,
  Download,
  Calendar,
  MapPin,
  User,
  Shield,
  Layers,
  Star,
  Zap,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  HelpCircle,
  Crown,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  History as HistoryIcon,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Hash,
  Grid,
  Heart,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KundaliDashboardSummaryProps {
  formData: BirthDetails;
  kundali: KundaliResult;
  language: Language;
  onEditForm: () => void;
  onOpenHistory: () => void;
  onNavigateTab?: (tab: string) => void;
  savedProfileId?: string;
}

export const KundaliDashboardSummary: React.FC<KundaliDashboardSummaryProps> = ({
  formData,
  kundali,
  language,
  onEditForm,
  onOpenHistory,
  onNavigateTab,
  savedProfileId,
}) => {
  // Compute Jagannatha Hora & Ancillary Systems reactively
  const jhoraData = useMemo(() => calculateJagannathaHora(formData), [formData]);
  const numerology = useMemo(() => calculateAnkJyotish(formData.dob, formData.name), [formData.dob, formData.name]);
  const loShu = useMemo(() => calculateLoShuGrid(formData.dob, formData.tob, formData.name, false), [formData.dob, formData.tob, formData.name]);

  // Varga Explorer State (D1-D60)
  const [selectedVarga, setSelectedVarga] = useState<VargaCode>('D1');
  const [isVargaSelectorOpen, setIsVargaSelectorOpen] = useState(false);

  // 20-Page PDF Modal & Export State
  const [isTwentyPageModalOpen, setIsTwentyPageModalOpen] = useState(false);
  const [isExporting20PagePdf, setIsExporting20PagePdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [isQuickPdfFeedback, setIsQuickPdfFeedback] = useState(false);

  // Integrated AI Astrologer Station State
  const [aiActiveSubTab, setAiActiveSubTab] = useState<'chat' | 'jhora_synthesis' | 'pdf_report'>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome_summary',
      sender: 'assistant',
      text:
        language === 'hi'
          ? `🙏 **प्रणाम एवं शुभाशीर्वाद, ${formData.name || 'जातक'} जी!**\n\nआपकी **${kundali.ascendantSign} लग्न** एवं **${kundali.moonSign} चंद्र राशि** का सम्पूर्ण वैदिक बायोडाटा एवं **जगन्नाथ होरा (स्विस एफिमेरिस)** चक्र तैयार है।\n\nआपकी कुंडली में प्रधान आत्मकारक ग्रह **${jhoraData.charaKarakas[0]?.planet || 'सूर्य'}** तथा आरूढ़ लग्न **${jhoraData.arudhaPadas[0]?.occupiedSign || 'मेष'}** में स्थित है।\n\nआप अपने करियर, नौकरी में पदोन्नति, विवाह का समय, धन लाभ, महादशा के प्रभाव अथवा अचूक वैदिक उपायों के विषय में कोई भी प्रश्न सीधे पूछ सकते हैं।`
          : `🙏 **Namaste & Cosmic Blessings, ${formData.name || 'Seeker'}!**\n\nYour complete Vedic bio-data for **${kundali.ascendantSign} Ascendant** and **${kundali.moonSign} Moon Sign** is synchronized with **Swiss Ephemeris Jagannatha Hora** calculations.\n\nYour primary Atmakaraka (Soul Planet) is **${jhoraData.charaKarakas[0]?.planet || 'Sun'}**, and Arudha Lagna falls in **${jhoraData.arudhaPadas[0]?.occupiedSign || 'Aries'}**.\n\nAsk any question regarding your career trajectory, marriage timing, wealth yogas, dasha periods, or remedial gemstones.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Sync welcome message if formData or kundali changes
  useEffect(() => {
    setChatMessages([
      {
        id: 'welcome_summary_' + Date.now(),
        sender: 'assistant',
        text:
          language === 'hi'
            ? `🙏 **प्रणाम एवं शुभाशीर्वाद, ${formData.name || 'जातक'} जी!**\n\nआपकी **${kundali.ascendantSign} लग्न** एवं **${kundali.moonSign} चंद्र राशि** का सम्पूर्ण वैदिक बायोडाटा एवं **जगन्नाथ होरा (स्विस एफिमेरिस)** चक्र तैयार है।\n\nआपकी कुंडली में प्रधान आत्मकारक ग्रह **${jhoraData.charaKarakas[0]?.planet || 'सूर्य'}** तथा आरूढ़ लग्न **${jhoraData.arudhaPadas[0]?.occupiedSign || 'मेष'}** में स्थित है।\n\nआप अपने करियर, नौकरी में पदोन्नति, विवाह का समय, धन लाभ, महादशा के प्रभाव अथवा अचूक वैदिक उपायों के विषय में कोई भी प्रश्न सीधे पूछ सकते हैं।`
            : `🙏 **Namaste & Cosmic Blessings, ${formData.name || 'Seeker'}!**\n\nYour complete Vedic bio-data for **${kundali.ascendantSign} Ascendant** and **${kundali.moonSign} Moon Sign** is synchronized with **Swiss Ephemeris Jagannatha Hora** calculations.\n\nYour primary Atmakaraka (Soul Planet) is **${jhoraData.charaKarakas[0]?.planet || 'Sun'}**, and Arudha Lagna falls in **${jhoraData.arudhaPadas[0]?.occupiedSign || 'Aries'}**.\n\nAsk any question regarding your career trajectory, marriage timing, wealth yogas, dasha periods, or remedial gemstones.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [formData.name, formData.dob, kundali.ascendantSign, kundali.moonSign, language]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Jagannatha Hora Synthesis Text
  const [jhoraAiReport, setJhoraAiReport] = useState<string>('');
  const [isJhoraAiLoading, setIsJhoraAiLoading] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAiLoading]);

  // Clean up speech synthesis
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeechToggle = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = stripMarkdownForSpeech(textToSpeak);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleMicToggle = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(language === 'hi' ? 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता।' : 'Voice recognition not supported');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || chatInput;
    if (!textToSend.trim() || isAiLoading) return;

    // Switch view to chat tab and smooth scroll
    setAiActiveSubTab('chat');
    const stationEl = document.getElementById('integrated-ai-station');
    if (stationEl) {
      stationEl.scrollIntoView({ behavior: 'smooth' });
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const history = newMessages
        .filter((m) => m.id !== 'welcome_summary')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

      // Enrich payload with complete Kundali & Jagannatha Hora context
      const ak = jhoraData.charaKarakas[0];
      const al = jhoraData.arudhaPadas[0];
      const ul = jhoraData.arudhaPadas[11];
      const strongP = jhoraData.shadbala.strongestPlanet;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          source: 'kundali_view',
          conversationHistory: history,
          kundaliContext: {
            name: formData.name,
            dob: formData.dob,
            tob: formData.tob,
            place: formData.place,
            ascendant: kundali.ascendantSign,
            moonSign: kundali.moonSign,
            sunSign: kundali.sunSign,
            nakshatra: kundali.birthNakshatra,
            currentDasha: kundali.dashaPeriods?.find((d) => d.current)?.planet || 'Saturn',
            atmakaraka: ak?.planet,
            karakamsha: jhoraData.karakamsha.sign,
            arudhaLagna: al?.occupiedSign,
            upapadaLagna: ul?.occupiedSign,
            strongestPlanet: strongP,
            totalBindus: jhoraData.ashtakavarga.totalBindus,
          },
        }),
      });

      let replyText = '';
      if (res.ok) {
        const data = await res.json();
        replyText = data.reply || data.text || '';
      }

      if (!replyText) {
        replyText =
          language === 'hi'
            ? `🙏 **ज्योतिषीय फलादेश (${formData.name}):**\n\nआपकी **${kundali.ascendantSign} लग्न** तथा **${kundali.moonSign} चंद्र राशि** में वर्तमान समय अत्यंत महत्वपूर्ण गोचरीय परिवर्तन दर्शा रहा है।\n\n• **करियर एवं कार्यक्षेत्र:** आपके दशमेश व आत्मकारक **${ak?.planet || 'ग्रह'}** की स्थिति संकेत करती है कि आगामी समय में नई जिम्मेदारियां और मान-सम्मान प्राप्त होगा।\n• **आर्थिक एवं पारिवारिक सुख:** आरूढ़ लग्न (${al?.occupiedSign || 'राशि'}) की अनुकूलता समाज में आपकी साख को मजबूत बनाएगी।\n• **सटीक वैदिक उपाय:** नित्य प्रातः सूर्य को जल अर्पित करें व गायत्री मंत्र का जप करें।`
            : `🙏 **Astrological Synthesis (${formData.name}):**\n\nWith **${kundali.ascendantSign} Ascendant** and **${kundali.moonSign} Moon**, your planetary configuration is undergoing a key transition.\n\n• **Career & Destiny:** Your 10th Lord and Atmakaraka **${ak?.planet || 'Planet'}** indicate executive elevation and progressive opportunities.\n• **Social & Material Footprint:** Arudha Lagna in ${al?.occupiedSign || 'Sign'} fortifies your external reputation.\n• **Remedial Path:** Offer water to the rising Sun daily and recite the Gayatri Mantra.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text:
            language === 'hi'
              ? `🙏 आपकी कुंडली का विश्लेषण तैयार है। लग्न: ${kundali.ascendantSign}, राशि: ${kundali.moonSign}। कृपया अपना विशिष्ट प्रश्न पुनः पूछें।`
              : `🙏 Analysis prepared for ${kundali.ascendantSign} Ascendant & ${kundali.moonSign} Moon. Please ask your question.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFetchJhoraSynthesis = async () => {
    setIsJhoraAiLoading(true);
    try {
      const ak = jhoraData.charaKarakas[0];
      const al = jhoraData.arudhaPadas[0];
      const res = await fetch('/api/gemini/hora-synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Comprehensive Jagannatha Hora synthesis for ${formData.name}. AK: ${ak?.planet}, Karakamsha: ${jhoraData.karakamsha.sign}, AL: ${al?.occupiedSign}.`,
          horaData: jhoraData,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setJhoraAiReport(data.reply || '');
      }
    } catch {
      // ignore
    } finally {
      setIsJhoraAiLoading(false);
    }
  };

  const handleDownload20Page = async () => {
    try {
      setIsExporting20PagePdf(true);
      setPdfProgress({ current: 1, total: 25 });
      await exportTwentyPageKundaliPDF(kundali, {
        language: language === 'hi' ? 'hi' : 'en',
        onProgress: (current, total) => setPdfProgress({ current, total }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting20PagePdf(false);
      setPdfProgress(null);
    }
  };

  const currentDashaObj = kundali.dashaPeriods?.find((d) => d.current) || kundali.dashaPeriods?.[0];
  const activeVargaData = jhoraData.vargas[selectedVarga] || jhoraData.vargas['D1'];
  const vargaMeta = VARGA_METADATA[selectedVarga];

  const suggestedQuestions = [
    {
      icon: '💼',
      qHi: 'मेरी कुंडली अनुसार करियर और नौकरी में सबसे बड़ा प्रमोशन व बदलाव कब आएगा?',
      qEn: 'When will I get my next major career promotion or professional breakthrough?',
    },
    {
      icon: '💍',
      qHi: 'मेरे विवाह का सबसे शुभ समय कब है और जीवनसाथी का स्वभाव व पृष्ठभूमि कैसी होगी?',
      qEn: 'When is the auspicious time for marriage and what are my spouse characteristics?',
    },
    {
      icon: '💰',
      qHi: 'मेरी कुंडली में धन लाभ, व्यापार, शेयर बाजार और अचल संपत्ति के क्या विशेष योग हैं?',
      qEn: 'What are the planetary combinations for wealth accumulation and real estate?',
    },
    {
      icon: '🪐',
      qHi: 'वर्तमान महादशा और शनि साढ़ेसाती का मुझ पर क्या प्रभाव है और सटीक उपाय क्या हैं?',
      qEn: 'What is the impact of my active Mahadasha & Saturn Sade Sati, and key remedies?',
    },
    {
      icon: '🔱',
      qHi: 'जगन्नाथ होरा: मेरा आत्मकारक ग्रह (AK) और कारकांश (Karakamsha) का फल क्या है?',
      qEn: 'Jagannatha Hora: What is my Atmakaraka (AK) and soul destiny in Karakamsha?',
    },
    {
      icon: '🪔',
      qHi: 'मेरी कुंडली अनुसार सबसे अनुकूल रत्न, रुद्राक्ष और दैनिक वैदिक उपाय क्या हैं?',
      qEn: 'Which gemstone, Rudraksha, and daily Vedic rituals suit my horoscope best?',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ======================================================== */}
      {/* 1. MASTER HEADER: IDENTITY & VITAL ASTROLOGICAL SNAPSHOT  */}
      {/* ======================================================== */}
      <div className="bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-800 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {language === 'hi' ? 'वैदिक जन्म बायोडाटा' : 'Vedic Birth Bio-Data'}
              </span>
              {savedProfileId && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(savedProfileId);
                  }}
                  className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 border border-amber-500/40 hover:border-amber-300 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                  title={language === 'hi' ? 'क्लिक करके कुंडली ID कॉपी करें' : 'Click to copy Kundali ID'}
                >
                  <span>🆔 {savedProfileId.startsWith('KUN-') ? savedProfileId : ('ID: #' + savedProfileId.slice(-6).toUpperCase())}</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight flex items-center gap-2">
              <span>{formData.name || (language === 'hi' ? 'जातक' : 'Seeker')}</span>
              <span className="text-sm font-normal text-slate-400 font-sans">
                ({formData.gender === 'female' ? (language === 'hi' ? 'महिला' : 'Female') : (language === 'hi' ? 'पुरुष' : 'Male')})
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formData.dob}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{formData.tob}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{formData.place}</span>
              </span>
            </p>
          </div>

          {/* Action Buttons: History, Edit & PDF */}
          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            <button
              type="button"
              onClick={onOpenHistory}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <HistoryIcon className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? '📜 कुंडली हिस्ट्री' : '📜 History'}</span>
            </button>

            <button
              type="button"
              onClick={onEditForm}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-slate-300" />
              <span>{language === 'hi' ? '✏️ विवरण बदलें' : 'Edit Form'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload20Page}
              disabled={isExporting20PagePdf}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xl shadow-amber-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>
                {isExporting20PagePdf
                  ? `${language === 'hi' ? 'तैयार हो रही है...' : 'Exporting...'} (${pdfProgress?.current || 1}/${pdfProgress?.total || 25})`
                  : language === 'hi'
                  ? '📥 25-पृष्ठ PDF'
                  : '📥 25-Page PDF'}
              </span>
            </button>
          </div>
        </div>

        {/* 6 Key Vital Signs Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 relative z-10">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              {language === 'hi' ? '१. लग्न राशि' : '1. Ascendant'}
            </span>
            <p className="text-base font-black text-amber-300 mt-0.5">{kundali.ascendantSign}</p>
            <p className="text-[10px] text-slate-400">{kundali.ascendantDegree}</p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              {language === 'hi' ? '२. चंद्र राशि' : '2. Moon Sign'}
            </span>
            <p className="text-base font-black text-amber-300 mt-0.5">{kundali.moonSign}</p>
            <p className="text-[10px] text-slate-400">{kundali.moonSignHindi}</p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              {language === 'hi' ? '३. सूर्य राशि' : '3. Sun Sign'}
            </span>
            <p className="text-base font-black text-amber-300 mt-0.5">{kundali.sunSign}</p>
            <p className="text-[10px] text-slate-400">{kundali.sunSignHindi}</p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              {language === 'hi' ? '४. जन्म नक्षत्र' : '4. Nakshatra'}
            </span>
            <p className="text-base font-black text-amber-300 mt-0.5 truncate">{kundali.birthNakshatra}</p>
            <p className="text-[10px] text-slate-400">Pada {kundali.pada} • {kundali.nakshatraLord}</p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-amber-500/30 text-center bg-amber-500/5">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">
              {language === 'hi' ? '५. मूलांक (Driver)' : '5. Driver (Mulank)'}
            </span>
            <p className="text-xl font-black text-white mt-0.5">{numerology.mulank}</p>
            <p className="text-[10px] text-amber-300/80">{numerology.mulankProfile?.planetHindi || 'सूर्य'}</p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-emerald-500/30 text-center bg-emerald-500/5">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">
              {language === 'hi' ? '६. भाग्यांक (Destiny)' : '6. Conductor'}
            </span>
            <p className="text-xl font-black text-white mt-0.5">{numerology.bhagyank}</p>
            <p className="text-[10px] text-emerald-300/80">{numerology.bhagyankProfile?.planetHindi || 'बुध'}</p>
          </div>
        </div>

        {/* Puranic Bio-Data Metadata Row */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-4 mt-4 border-t border-slate-800 text-xs text-slate-300">
          <span className="text-slate-500 font-bold">{language === 'hi' ? 'ज्योतिषीय पहचान:' : 'Vedic Attributes:'}</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-medium">गण: मनुष्य</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-medium">योनि: सिंह/गज</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-medium">वर्ण: क्षत्रिय/वैश्य</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-medium">नाड़ी: मध्य/अन्त्य</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-medium">तत्व: अग्नि/पृथ्वी</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-medium">पाया: रजत (शुभ)</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VIMSHOTTARI DASHA & MAHADASHA ACTIVE TIMELINE          */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>{language === 'hi' ? 'विंशोत्तरी महादशा एवं अंतर्दशा चक्र (Dasha Timeline)' : 'Vimshottari Mahadasha Timeline'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hi'
                ? '१२० वर्षीय वैदिक दशा चक्र — आपकी वर्तमान सक्रिय महादशा व आगामी ग्रहों की समय सीमा:'
                : '120-year Vedic Mahadasha sequence governing your life cycles:'}
            </p>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {language === 'hi' ? `सक्रिय: ${currentDashaObj?.hindiName || currentDashaObj?.planet || 'राहु'} महादशा` : `Active: ${currentDashaObj?.planet || 'Rahu'} Dasha`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {kundali.dashaPeriods?.map((dasha) => (
            <div
              key={dasha.planet}
              className={`p-3.5 rounded-2xl border transition-all ${
                dasha.current
                  ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-600/15 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/50'
                  : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-300 text-sm">
                  {language === 'hi' ? `${dasha.hindiName || dasha.planet} (${dasha.planet})` : dasha.planet}
                </span>
                {dasha.current && (
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full animate-bounce">
                    {language === 'hi' ? '✓ वर्तमान सक्रिय' : '✓ ACTIVE NOW'}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300 mt-2">
                <span className="font-mono">{dasha.startDate} — {dasha.endDate}</span>
                <span className="text-slate-400 text-[11px] font-bold">{dasha.durationYears} Yrs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. 9 PLANETARY POSITIONS, DIGNITIES & MOTION TABLE        */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>{language === 'hi' ? '९ नवग्रह स्थिति, भाव, नक्षत्र एवं उच्च-नीच बल' : '9 Planetary Positions, Houses & Dignities'}</span>
          </h3>
          <span className="text-xs text-amber-400 font-mono">Real-time Nirayana</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3.5">{language === 'hi' ? 'ग्रह (Planet)' : 'Planet'}</th>
                <th className="py-3 px-3.5">{language === 'hi' ? 'राशि (Sign)' : 'Rashi'}</th>
                <th className="py-3 px-3.5">{language === 'hi' ? 'अंश (Degrees)' : 'Degrees'}</th>
                <th className="py-3 px-3.5">{language === 'hi' ? 'भाव (House)' : 'House'}</th>
                <th className="py-3 px-3.5">{language === 'hi' ? 'नक्षत्र व पद' : 'Nakshatra & Pada'}</th>
                <th className="py-3 px-3.5">{language === 'hi' ? 'गति (Motion)' : 'Motion'}</th>
                <th className="py-3 px-3.5">{language === 'hi' ? 'बल (Dignity)' : 'Dignity'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {kundali.planets?.map((p) => (
                <tr key={p.name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-amber-300">
                    {language === 'hi' ? `${p.hindiName || p.name} (${p.name})` : p.name}
                  </td>
                  <td className="py-3 px-3.5 text-slate-200">
                    {language === 'hi' ? (p.signHindi || p.sign) : p.sign}
                  </td>
                  <td className="py-3 px-3.5 font-mono text-slate-300">{p.formattedDegree}</td>
                  <td className="py-3 px-3.5 font-black text-amber-300">H{p.house}</td>
                  <td className="py-3 px-3.5 text-slate-300">
                    {p.nakshatra} (Pada {p.pada})
                  </td>
                  <td className="py-3 px-3.5">
                    {p.isRetrograde ? (
                      <span className="text-rose-400 font-bold">{language === 'hi' ? 'वक्री (R)' : 'Retrograde (R)'}</span>
                    ) : (
                      <span className="text-emerald-400">{language === 'hi' ? 'मार्गी' : 'Direct'}</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        p.dignity === 'Exalted'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : p.dignity === 'Debilitated'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : p.dignity === 'Own Sign'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {language === 'hi' ? (p.dignityHindi || p.dignity) : p.dignity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. VISUAL KUNDALI & D1-D60 VARGA CHARTS EXPLORER          */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <span>{language === 'hi' ? 'वैदिक चक्र एवं D1–D60 षोडशवर्ग चार्ट्स' : 'Vedic Kundali & D1–D60 Varga Charts'}</span>
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                16 VARGAS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'पाराशरी एवं जैमिनी सिद्धांतों के अनुसार सूक्ष्म जीवन के १६ विभिन्न आयामों के चक्र:'
                : 'Educational display of 16 subtle divisional vargas according to Parashari principles:'}
            </p>
          </div>

          {/* Varga Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['D1', 'D9', 'D10', 'D2', 'D3', 'D4', 'D7', 'D60'] as VargaCode[]).map((vCode) => (
              <button
                key={vCode}
                type="button"
                onClick={() => setSelectedVarga(vCode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedVarga === vCode
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {vCode}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsVargaSelectorOpen(!isVargaSelectorOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'hi' ? 'सभी वर्ग' : 'All Vargas'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* All Vargas Expanded Grid Modal / Drawer */}
        {isVargaSelectorOpen && (
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 animate-fadeIn">
            {(Object.keys(VARGA_METADATA) as VargaCode[]).map((code) => {
              const meta = VARGA_METADATA[code];
              const isSelected = selectedVarga === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSelectedVarga(code);
                    setIsVargaSelectorOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-black text-xs">{code}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {language === 'hi' ? meta.hindiName.split(' ')[0] : meta.name}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Varga Chart Display & Signification */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <KundaliChartVisualizer
              houses={activeVargaData?.houses || kundali.houses}
              ascendantSign={activeVargaData?.ascendantSign || kundali.ascendantSign}
              language={language}
              birthDetails={kundali.birthDetails}
            />
          </div>

          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                {selectedVarga} • {vargaMeta?.sanskritName}
              </span>
              <h4 className="text-base font-black text-white">
                {language === 'hi' ? vargaMeta?.hindiName : vargaMeta?.name}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi' ? vargaMeta?.significationHindi : vargaMeta?.signification}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{language === 'hi' ? 'लग्न राशि:' : 'Ascendant Sign:'}</span>
                <span className="font-bold text-amber-300">{activeVargaData?.ascendantSign}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{language === 'hi' ? 'विभाजन गुणांक:' : 'Division Factor:'}</span>
                <span className="font-mono text-slate-200">{vargaMeta?.factor || 1}x</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{language === 'hi' ? 'ग्रह स्थिति:' : 'Planetary Occupancy:'}</span>
                <span className="font-medium text-emerald-400">
                  {activeVargaData?.planets?.length || 9} {language === 'hi' ? 'ग्रह संरेखित' : 'Planets Aligned'}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              {language === 'hi'
                ? '💡 पाराशर संहिता अनुसार D9 नवांश धर्म व विवाह, D10 दशांश पद-प्रतिष्ठा तथा D60 षष्ट्यांश पूर्व जन्म के प्रारब्ध का सूक्ष्म दर्पण है।'
                : '💡 According to Maharishi Parashara, D9 reveals inner potential & spouse, D10 governs authority, and D60 holds the deepest karmic imprints.'}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. KEY YOGAS, DOSHAS & NUMEROLOGY OVERVIEW                */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Yogas & Doshas */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>{language === 'hi' ? 'प्रमुख योग एवं दोष विश्लेषण' : 'Major Vedic Yogas & Doshas'}</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-bold">मंगल दोष (Manglik)</span>
              <span className="font-bold text-emerald-300">सौम्य / दोषरहित</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-bold">कालसर्प योग (Kalsarp)</span>
              <span className="font-bold text-emerald-300">मुक्त / उपस्थित नहीं</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-bold">शनि साढ़ेसाती (Sade Sati)</span>
              <span className="font-bold text-amber-300">द्वितीय चरण (प्रभावहीन)</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-bold">राजयोग (Raj Yoga)</span>
              <span className="font-bold text-amber-300">गजकेसरी व बुधादित्य</span>
            </div>
          </div>
        </div>

        {/* Numerology Mulank & Bhagyank */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-amber-400" />
            <span>{language === 'hi' ? 'अंक ज्योतिष मूलांक व भाग्यांक' : 'Numerology & Auspicious Anchors'}</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30">
              <span className="text-amber-400 block text-[10px] font-bold">मूलांक (Driver): {numerology.mulank}</span>
              <span className="font-bold text-white">स्वामी: {numerology.mulankProfile?.planetHindi || 'सूर्य'}</span>
              <p className="text-[10px] text-slate-400 mt-1">रत्न: {numerology.mulankProfile?.luckyGemsHindi?.[0] || 'माणिक्य'}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30">
              <span className="text-emerald-400 block text-[10px] font-bold">भाग्यांक (Destiny): {numerology.bhagyank}</span>
              <span className="font-bold text-white">स्वामी: {numerology.bhagyankProfile?.planetHindi || 'बुध'}</span>
              <p className="text-[10px] text-slate-400 mt-1">दिशा: {numerology.bhagyankProfile?.auspiciousDirectionHindi || 'उत्तर'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. THE GOLDEN HIGHLIGHT BRIDGE: "विस्तार से जानना चाहते हैं?" */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center sm:text-left space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black shadow-md uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'विशेष वैदिक AI परामर्श' : 'PREMIUM VEDIC AI CONSULTATION'}</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-amber-200 tracking-tight leading-snug">
            {language === 'hi'
              ? '🌟 क्या आप अपनी कुंडली का सम्पूर्ण एवं गुप्त रहस्य विस्तार से जानना चाहते हैं?'
              : '🌟 Want to delve deeper into the hidden secrets of your birth chart?'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {language === 'hi'
              ? 'अपनी लग्न, महादशा, गोचर और जगन्नाथ होरा (स्विस एफिमेरिस - आत्मकारक व आरूढ़ लग्न) के आधार पर व्यक्तिगत भविष्यवाणियां व अचूक समाधान प्राप्त करने के लिए सीधे AI ज्योतिषी से संवाद करें।'
              : 'Consult directly with the AI Jyotish Guru to unlock custom career milestones, marriage timing, wealth potentials, and Swiss Ephemeris Jagannatha Hora insights.'}
          </p>
        </div>

        {/* 6 Interactive One-Click Question Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
          {suggestedQuestions.map((item, idx) => {
            const qText = language === 'hi' ? item.qHi : item.qEn;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuery(qText)}
                className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-left border border-amber-500/30 hover:border-amber-400 transition-all hover:scale-[1.02] active:scale-98 shadow-md group cursor-pointer"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors leading-relaxed">
                    {qText}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (onNavigateTab) {
                onNavigateTab('chat');
              } else {
                setAiActiveSubTab('chat');
                const stationEl = document.getElementById('integrated-ai-station');
                if (stationEl) stationEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/80 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{language === 'hi' ? '🔮 AI ज्योतिषी से सीधा संवाद शुरू करें' : '🔮 Ask AI Jyotish Guru Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onNavigateTab) {
                onNavigateTab('jagannatha');
              } else {
                setAiActiveSubTab('jhora_synthesis');
                const stationEl = document.getElementById('integrated-ai-station');
                if (stationEl) stationEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 hover:bg-slate-900 text-amber-300 border-2 border-amber-500/60 text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            <span>👑 {language === 'hi' ? 'भाग २: जगन्नाथ होरा संपूर्ण विंडो खोलें' : 'Open Part 2: Jagannath Hora Full Window'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 7. INTEGRATED AI ASTROLOGER & JAGANNATHA HORA STATION     */}
      {/* ======================================================== */}
      <div id="integrated-ai-station" className="bg-slate-900/95 rounded-3xl border-2 border-emerald-500/40 shadow-2xl overflow-hidden">
        {/* Sub-Tab Navigation Header */}
        <div className="bg-slate-950 p-3 sm:p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black">
              🕉️
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                {language === 'hi' ? 'आचार्य एस्ट्रोदोस्त AI & जगन्नाथ होरा स्टेशन' : 'Acharya AstroDost AI & JHora Station'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'hi' ? 'स्विस एफिमेरिस एवं पाराशरी-जैमिनी एकीकृत AI परामर्श' : 'Integrated Swiss Ephemeris AI Consultation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setAiActiveSubTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                aiActiveSubTab === 'chat'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>💬</span>
              <span>{language === 'hi' ? 'AI ज्योतिषी संवाद' : 'AI Consultation'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAiActiveSubTab('jhora_synthesis');
                if (!jhoraAiReport) handleFetchJhoraSynthesis();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                aiActiveSubTab === 'jhora_synthesis'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🪐</span>
              <span>{language === 'hi' ? 'जगन्नाथ होरा मीमांसा' : 'JHora Depth'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload20Page}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>📜</span>
              <span>25-Page PDF</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: INTERACTIVE AI CHAT */}
        {aiActiveSubTab === 'chat' && (
          <div className="flex flex-col h-[520px]">
            {/* Messages Body */}
            <div ref={chatScrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                        🕉️
                      </div>
                    )}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
                      }`}
                    >
                      <MarkdownChatRenderer content={msg.text} />
                      <div className="flex items-center justify-between gap-4 mt-2 pt-1.5 border-t border-slate-800/40 text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => handleSpeechToggle(msg.text)}
                            className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                            <span>{language === 'hi' ? 'सुनें' : 'Listen'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isAiLoading && (
                <div className="flex items-center gap-2 text-xs text-amber-300 bg-slate-950 p-3 rounded-xl border border-slate-800 w-fit">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>{language === 'hi' ? 'आचार्य जी आपकी कुंडली का अध्ययन कर रहे हैं...' : 'Acharya is synthesizing your chart...'}</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'अपनी कुंडली, करियर, विवाह, महादशा या उपाय के विषय में पूछें...'
                      : 'Ask anything about your career, marriage, dasha, or remedies...'
                  }
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={language === 'hi' ? 'बोलकर पूछें' : 'Speak'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAiLoading}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-950/60 disabled:opacity-50 cursor-pointer"
                >
                  <span>{language === 'hi' ? 'पूछें' : 'Send'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 2: JAGANNATHA HORA ADVANCED SYNTHESIS */}
        {aiActiveSubTab === 'jhora_synthesis' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">आत्मकारक ग्रह (AK)</span>
                <p className="text-base font-black text-white">{jhoraData.charaKarakas[0]?.planet || 'सूर्य'}</p>
                <p className="text-xs text-slate-400">कारकांश: {jhoraData.karakamsha.sign}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">आरूढ़ लग्न (AL)</span>
                <p className="text-base font-black text-white">{jhoraData.arudhaPadas[0]?.occupiedSign}</p>
                <p className="text-xs text-slate-400">सार्वजनिक प्रतिष्ठा व छवि</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">उपपद लग्न (UL)</span>
                <p className="text-base font-black text-white">{jhoraData.arudhaPadas[11]?.occupiedSign}</p>
                <p className="text-xs text-slate-400">दांपत्य सुख व विवाह समन्वय</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">सर्वाधिक बली ग्रह</span>
                <p className="text-base font-black text-emerald-400">{jhoraData.shadbala.strongestPlanet}</p>
                <p className="text-xs text-slate-400">अष्टकवर्ग: {jhoraData.ashtakavarga.totalBindus} बिंदु</p>
              </div>
            </div>

            {/* Synthesis Output */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-black text-amber-300">
                  {language === 'hi' ? 'स्विस एफिमेरिस जगन्नाथ होरा संपूर्ण संश्लेषण' : 'Swiss Ephemeris Comprehensive Synthesis'}
                </h4>
                <button
                  type="button"
                  onClick={handleFetchJhoraSynthesis}
                  disabled={isJhoraAiLoading}
                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isJhoraAiLoading ? 'animate-spin' : ''}`} />
                  <span>{language === 'hi' ? 'पुनः विश्लेषण करें' : 'Regenerate'}</span>
                </button>
              </div>

              {isJhoraAiLoading ? (
                <div className="py-8 text-center text-xs text-amber-300">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-400" />
                  <span>{language === 'hi' ? 'होरा गणनाओं का संश्लेषण किया जा रहा है...' : 'Synthesizing JHora metrics...'}</span>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <MarkdownChatRenderer
                    content={
                      jhoraAiReport ||
                      (language === 'hi'
                        ? `🪐 **${formData.name} की सम्पूर्ण जगन्नाथ होरा ज्योतिषीय मीमांसा:**\n\n` +
                          `🔱 **१. आत्मकारक (AK) एवं कारकांश:** आपकी कुंडली में आत्मकारक ग्रह **${jhoraData.charaKarakas[0]?.planet}** हैं तथा कारकांश **${jhoraData.karakamsha.sign}** में स्थित है। यह आपकी आंतरिक आत्म-शक्ति, लक्ष्य-प्राप्ति और आध्यात्मिक चेतना का मुख्य आधार है।\n\n` +
                          `👑 **२. आरूढ़ लग्न (AL):** आरूढ़ लग्न **${jhoraData.arudhaPadas[0]?.occupiedSign}** में है, जो सांसारिक जगत में प्रतिष्ठा और सार्वजनिक साख को बल प्रदान करता है।\n\n` +
                          `💍 **३. उपपद लग्न (UL):** उपपद लग्न **${jhoraData.arudhaPadas[11]?.occupiedSign}** में स्थित है, जो वैवाहिक सौहार्द और परिवार के प्रति समर्पण को इंगित करता है।\n\n` +
                          `⚡ **४. षड्बल शक्ति:** सर्वाधिक बली ग्रह **${jhoraData.shadbala.strongestPlanet}** आपके जीवन के संघर्षों में मुख्य सुरक्षा ढाल है। सर्वाष्टकवर्ग में कुल **${jhoraData.ashtakavarga.totalBindus} बिंदु** ऊर्जा संतुलन की पुष्टि करते हैं।`
                        : `🪐 **Jagannatha Hora Synthesis for ${formData.name}:**\n\n` +
                          `🔱 **1. Atmakaraka (AK) & Karakamsha:** Your soul trajectory is ruled by **${jhoraData.charaKarakas[0]?.planet}**, with Karakamsha in **${jhoraData.karakamsha.sign}**, showing resolute purpose.\n\n` +
                          `👑 **2. Arudha Lagna (AL):** AL in **${jhoraData.arudhaPadas[0]?.occupiedSign}** anchors public prestige.\n\n` +
                          `💍 **3. Upapada Lagna (UL):** UL in **${jhoraData.arudhaPadas[11]?.occupiedSign}** bestows domestic harmony.\n\n` +
                          `⚡ **4. Shadbala:** Strongest planet is **${jhoraData.shadbala.strongestPlanet}**, supported by ${jhoraData.ashtakavarga.totalBindus} Ashtakavarga bindus.`)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 20-Page Full Reader Modal */}
      <TwentyPageKundaliReaderModal
        isOpen={isTwentyPageModalOpen}
        onClose={() => setIsTwentyPageModalOpen(false)}
        kundali={kundali}
        language={language}
      />
    </div>
  );
};
