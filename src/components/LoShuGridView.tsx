import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types/astrology';
import {
  calculateLoShuGrid,
  LoShuResult,
  LO_SHU_NUMBERS_METADATA,
  LO_SHU_PLANES_DEF,
} from '../utils/loShuCalculations';
import {
  Grid,
  Sparkles,
  Calendar,
  Clock,
  User,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
  Layers,
  Compass,
  Info,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Flame,
  Award,
  BookOpen,
  TrendingUp,
  Droplets,
  TreePine,
  Mountain,
  CircleDot,
  Check,
  Zap,
  Heart,
  Briefcase,
  Star,
  Activity,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoShuGridViewProps {
  language: Language;
}

const MONTHS_EN = [
  'January (01)',
  'February (02)',
  'March (03)',
  'April (04)',
  'May (05)',
  'June (06)',
  'July (07)',
  'August (08)',
  'September (09)',
  'October (10)',
  'November (11)',
  'December (12)',
];

const MONTHS_HI = [
  'जनवरी (01)',
  'फ़रवरी (02)',
  'मार्च (03)',
  'अप्रैल (04)',
  'मई (05)',
  'जून (06)',
  'जुलाई (07)',
  'अगस्त (08)',
  'सितंबर (09)',
  'अक्टूबर (10)',
  'नवंबर (11)',
  'दिसंबर (12)',
];

const LO_SHU_ARTICLE_NUMBERS = [
  {
    number: 1,
    title: 'Number 1 — Self-expression and communication',
    titleHindi: 'अंक 1 — आत्म-अभिव्यक्ति एवं संवाद',
    description:
      'The number of voice and individuality. Present, it gives a clear sense of self and the confidence to speak your mind; missing, learning to express yourself and stand your ground is the lesson; repeated, the will is strong and can turn stubborn or self-centred.',
    descriptionHindi:
      'यह वाणी और व्यक्तित्व का सूचक अंक है। उपस्थित होने पर यह आत्म-सम्मान, स्वतंत्र सोच और आत्मविश्वास से अपनी बात रखने की क्षमता प्रदान करता है; अनुपस्थित होने पर जीवन का मुख्य सबक अपनी भावनाओं को खुलकर व्यक्त करना और आत्मविश्वास से अपनी जगह बनाना है; दोहराए जाने पर इच्छाशक्ति अत्यधिक प्रबल होती है और कभी-कभी हठ या स्वयं को ही सही मानने की प्रवृत्ति आ सकती है।',
  },
  {
    number: 2,
    title: 'Number 2 — Sensitivity and relationships',
    titleHindi: 'अंक 2 — संवेदनशीलता एवं संबंध',
    description:
      'The number of feeling and connection. Present, it brings empathy, intuition and an ease with people; missing, trusting your instincts and tending to relationships is the lesson; repeated, sensitivity runs deep and can tip into over-dependence.',
    descriptionHindi:
      'यह भावना और जुड़ाव का अंक है। उपस्थित होने पर यह गहरी सहानुभूति, सहज अंतर्ज्ञान (Intuition) और लोगों के साथ सौहार्दपूर्ण संबंध बनाने की कला देता है; अनुपस्थित होने पर अपने अंतर्मन की आवाज पर भरोसा करना और रिश्तों में संवेदनशीलता व धैर्य विकसित करना प्रमुख सीख है; दोहराए जाने पर संवेदनशीलता बहुत गहरी होती है जो कभी अति-निर्भरता में बदल सकती है।',
  },
  {
    number: 3,
    title: 'Number 3 — Imagination and creativity',
    titleHindi: 'अंक 3 — कल्पनाशीलता एवं रचनात्मकता',
    description:
      'The number of mind and imagination. Present, it brings creativity, enthusiasm and a lively curiosity; missing, trusting your creative voice and maintaining focus is the lesson; repeated, the imagination is rich but can scatter or create undue worry.',
    descriptionHindi:
      'यह बुद्धि और कल्पना का अंक है। उपस्थित होने पर यह प्रखर कल्पना, रचनात्मकता, उत्साह और ज्ञान प्राप्ति की गहरी जिज्ञासा देता है; अनुपस्थित होने पर अपनी रचनात्मक क्षमता पर विश्वास करना और मानसिक एकाग्रता बनाए रखना प्रमुख सीख है; दोहराए जाने पर कल्पनाशीलता बहुत समृद्ध होती है परंतु अत्यधिक विचारों से भटकाव या अनावश्यक चिंता हो सकती है।',
  },
  {
    number: 4,
    title: 'Number 4 — Order, patience and practicality',
    titleHindi: 'अंक 4 — अनुशासन, धैर्य एवं व्यावहारिकता',
    description:
      'The number of method and the hands. Present, it brings practicality, patience and a knack for getting things done; missing, building order and follow-through is the lesson; repeated, it gives great industry that can harden into rigidity or overwork.',
    descriptionHindi:
      'यह विधि और कर्मठता का अंक है। उपस्थित होने पर यह व्यावहारिकता, धैर्य और कार्यों को पूरा करने की कुशलता लाता है; अनुपस्थित होने पर व्यवस्था बनाना और निरंतरता बनाए रखना मुख्य सीख है; दोहराए जाने पर यह अथक परिश्रम देता है जो कभी-कभी कठोरता में बदल सकता है।',
  },
  {
    number: 5,
    title: 'Number 5 — Will, balance and adaptability',
    titleHindi: 'अंक 5 — इच्छाशक्ति, संतुलन एवं अनुकूलनशीलता',
    description:
      'The centre of the grid, the point of balance. Present, it gives drive, adaptability and a steady core; missing, finding balance and direction is the lesson; repeated, the will is powerful and can become headstrong or restless.',
    descriptionHindi:
      'ग्रिड का केंद्र, संतुलन का बिंदु। उपस्थित होने पर यह दृढ़ इच्छाशक्ति, अनुकूलनशीलता और आंतरिक संतुलन देता है; अनुपस्थित होने पर जीवन में संतुलन और दिशा खोजना मुख्य सबक है; दोहराए जाने पर इच्छाशक्ति अत्यधिक शक्तिशाली होती है जो कभी हठी या अशांत बना सकती है।',
  },
  {
    number: 6,
    title: 'Number 6 — Home, love and responsibility',
    titleHindi: 'अंक 6 — पारिवारिक प्रेम, गृह एवं उत्तरदायित्व',
    description:
      'The number of the heart and the home. Present, it brings warmth, care and a sense of responsibility for others; missing, the lesson is to open the heart and accept care as well as give it; repeated, devotion is strong and can slip into worry or control.',
    descriptionHindi:
      'यह हृदय और परिवार का अंक है। उपस्थित होने पर यह सौहार्द, देखभाल और दूसरों के प्रति जिम्मेदारी की भावना लाता है; अनुपस्थित होने पर दिल खोलना और स्नेह देने के साथ स्वीकार करना सीखना है; दोहराए जाने पर समर्पण प्रबल होता है जो चिंता या अत्यधिक नियंत्रण में बदल सकता है।',
  },
  {
    number: 7,
    title: 'Number 7 — Patience, spirituality and sacrifice',
    titleHindi: 'अंक 7 — धैर्य, आध्यात्मिकता एवं आंतरिक विकास',
    description:
      'The number of inner growth, often deepened through experience. Present, it brings reflection, patience and a spiritual streak; missing, the lesson is to seek meaning and learn through life’s tests; repeated, the inner life is rich but can turn withdrawn.',
    descriptionHindi:
      'यह आंतरिक विकास का अंक है जो अक्सर अनुभवों से परिपक्व होता है। उपस्थित होने पर यह आत्म-चिंतन, धैर्य और आध्यात्मिक झुकाव लाता है; अनुपस्थित होने पर जीवन की परीक्षाओं से सीख लेकर अर्थ खोजना सबक है; दोहराए जाने पर आंतरिक जीवन बहुत समृद्ध होता है परंतु व्यक्ति समाज से कट सकता है।',
  },
  {
    number: 8,
    title: 'Number 8 — Method, organisation and duty',
    titleHindi: 'अंक 8 — कार्यप्रणाली, संगठन एवं कर्तव्यनिष्ठा',
    description:
      'The number of structure and discipline. Present, it brings organisation, a sense of duty, hard work, and the patience to build over time; missing, learning systematic discipline and careful management is the lesson; repeated, the drive is immense but can turn rigid, materialistic, or restless.',
    descriptionHindi:
      'यह संरचना और अनुशासन का अंक है। उपस्थित होने पर यह संगठन, कर्तव्य की भावना, कड़ी मेहनत और धैर्य से निर्माण की क्षमता लाता है; अनुपस्थित होने पर व्यवस्थित अनुशासन और प्रबंधन सीखना सबक है; दोहराए जाने पर कर्मठता अपार होती है जो कठोरता या अशांति में बदल सकती है।',
  },
  {
    number: 9,
    title: 'Number 9 — Intellect, ambition and humanity',
    titleHindi: 'अंक 9 — बुद्धिमत्ता, महत्वाकांक्षा एवं मानवता',
    description:
      'The number of vision and the wider world. Present, it brings intellect, ambition and deep care for humanity; missing, discovering higher purpose, selflessness and empathy is the lesson; repeated, idealism runs very high and can slip into restlessness, impatience, or unrealistic expectations.',
    descriptionHindi:
      'यह दूरदर्शिता और व्यापक जगत का अंक है। उपस्थित होने पर यह बुद्धि, महत्वाकांक्षा और मानवता के प्रति गहरा समर्पण लाता है; अनुपस्थित होने पर उच्च उद्देश्य, निस्वार्थ भाव और सहानुभूति खोजना सबक है; दोहराए जाने पर आदर्शवाद बहुत तीव्र होता है जो अधीरता या अव्यावहारिक अपेक्षाओं में बदल सकता है।',
  },
];

export const LoShuGridView: React.FC<LoShuGridViewProps> = ({ language }) => {
  // Input states
  const [day, setDay] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(1995);
  const [time, setTime] = useState<string>('');
  const [name, setName] = useState<string>('');

  // Selected cell for inspector
  const [selectedCellNum, setSelectedCellNum] = useState<number | null>(null);

  // Active sub-tab
  const [activeTabSub, setActiveTabSub] = useState<'grid' | 'analysis' | 'completion' | 'remedies' | 'planes' | 'guide'>('grid');

  // Calculation results
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);
  const [result, setResult] = useState<LoShuResult>(() => {
    return calculateLoShuGrid('1995-01-01', undefined, undefined, false);
  });

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const dobString = `${year}-${formattedMonth}-${formattedDay}`;

    const res = calculateLoShuGrid(dobString, time || undefined, name || undefined, false);
    setResult(res);
    setHasCalculated(true);
    setSelectedCellNum(null);
  };

  const handleReset = () => {
    setDay(1);
    setMonth(1);
    setYear(1995);
    setTime('');
    setName('');
    const res = calculateLoShuGrid('1995-01-01', undefined, undefined, false);
    setResult(res);
    setSelectedCellNum(null);
  };

  const [gridPositions] = useState([
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ]);

  const subTabsLoShu = [
    { id: 'grid', label: language === 'hi' ? 'ग्रिड व अंक विवरण' : 'Grid & Numbers', icon: Grid },
    { id: 'analysis', label: language === 'hi' ? 'गणना का फलकथन' : 'Calculation Analysis', icon: Activity },
    { id: 'completion', label: language === 'hi' ? 'ग्रिड पूर्णता व राजयोग' : 'Complete Grid & Yogas', icon: Award },
    { id: 'remedies', label: language === 'hi' ? 'मिसिंग नंबर उपाय' : 'Missing Remedies', icon: Shield },
    { id: 'planes', label: language === 'hi' ? '8 ऊर्जा तल' : '8 Energy Planes', icon: Layers },
    { id: 'guide', label: language === 'hi' ? 'लो शू गाइड' : 'What is Lo Shu?', icon: BookOpen },
  ];

  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const currentTabIndex = subTabsLoShu.findIndex((t) => t.id === activeTabSub);

  const scrollToTab = (index: number) => {
    if (tabsScrollRef.current) {
      const tabElements = tabsScrollRef.current.querySelectorAll('button[data-subtab]');
      if (tabElements[index]) {
        tabElements[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  const handlePrevTab = () => {
    const prevIndex = (currentTabIndex - 1 + subTabsLoShu.length) % subTabsLoShu.length;
    const prevTab = subTabsLoShu[prevIndex];
    setActiveTabSub(prevTab.id as any);
    scrollToTab(prevIndex);
  };

  const handleNextTab = () => {
    const nextIndex = (currentTabIndex + 1) % subTabsLoShu.length;
    const nextTab = subTabsLoShu[nextIndex];
    setActiveTabSub(nextTab.id as any);
    scrollToTab(nextIndex);
  };

  useEffect(() => {
    scrollToTab(currentTabIndex);
  }, [activeTabSub]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Clean Minimalist Input Form (Matches Screenshot 1 Exactly) */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                  {language === 'hi' ? 'लो शू ग्रिड संपूर्ण विश्लेषण' : 'Lo Shu Grid Master Analysis'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black border border-amber-300 shadow-md animate-paid-blink">
                  PAID ⭐ PREMIUM
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'अपनी जन्म तिथि दर्ज करें और 8 ऊर्जा तल, 5 तत्व संतुलन एवं संपूर्ण राजयोग विश्लेषण जानें'
                  : 'Enter birth date to calculate 3x3 Magic Square, 8 Planes, 5-Element balance & Rajyogas'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'रीसेट (Reset)' : 'Reset'}</span>
          </button>
        </div>

        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Day */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {language === 'hi' ? 'दिन (Day)' : 'Day'}
              </label>
              <select
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d < 10 ? `0${d}` : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {language === 'hi' ? 'माह (Month)' : 'Month'}
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {(language === 'hi' ? MONTHS_HI : MONTHS_EN).map((mName, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {mName}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {language === 'hi' ? 'वर्ष (Year)' : 'Year'}
              </label>
              <input
                type="number"
                min="1900"
                max="2100"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10) || 1995)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                placeholder="1995"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{language === 'hi' ? 'लो शू ग्रिड बनाएँ' : 'Build my grid'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Main Results View */}
      {hasCalculated && (
        <div id="lo-shu-grid-results" className="space-y-8 animate-fadeIn">
          {/* Sub Navigation Bar with high-contrast off-white active state */}
          <div className="space-y-4 border-b border-slate-800 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg shadow-sm tracking-wide uppercase">
                  {language === 'hi' ? 'विश्लेषित जन्म तिथि' : 'ANALYZED BIRTH DATE'}
                </span>
                <span className="text-sm font-mono font-bold bg-slate-900 text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700">
                  {result.day < 10 ? `0${result.day}` : result.day}-
                  {result.month < 10 ? `0${result.month}` : result.month}-{result.year}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'प्रत्येक खंड की संपूर्ण व्याख्या नीचे उपलब्ध है' : 'Detailed guide available under each section'}</span>
              </div>
            </div>

            {/* Animated Reverse & Forward Sub-Heading Navigator Controller for Lo Shu Grid */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-3 sm:p-4 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-400/10 to-sky-500/5 animate-pulse pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Reverse / Previous Sub-heading Button */}
                <motion.button
                  type="button"
                  onClick={handlePrevTab}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-slate-900 border-2 border-amber-400/80 hover:border-amber-300 text-amber-300 hover:text-white shadow-lg shadow-amber-500/25 cursor-pointer group transition-all"
                >
                  <motion.div
                    animate={{ x: [-3, 3, -3] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                    className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[3]" />
                  </motion.div>
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 block leading-tight">
                      {language === 'hi' ? '◀ पिछला खंड (Reverse)' : '◀ Previous Sub-Heading'}
                    </span>
                    <span className="text-xs font-black text-slate-100 group-hover:text-amber-200 line-clamp-1">
                      {subTabsLoShu[(currentTabIndex - 1 + subTabsLoShu.length) % subTabsLoShu.length].label}
                    </span>
                  </div>
                </motion.button>

                {/* Current Active Sub-Heading Center Indicator (Off-White Highlighted) */}
                <div className="flex flex-col items-center text-center px-2 py-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-amber-500/40 text-[11px] font-bold text-amber-300 shadow-inner mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-slate-300">
                      {language === 'hi' ? 'सक्रिय उप-विषय' : 'Active Section'}:
                    </span>
                    <span className="font-mono font-black text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                      {currentTabIndex + 1} / {subTabsLoShu.length}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-[#f8fafc] tracking-wide flex items-center gap-2 drop-shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>{subTabsLoShu[currentTabIndex].label}</span>
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                  </h3>
                </div>

                {/* Forward / Next Sub-heading Button */}
                <motion.button
                  type="button"
                  onClick={handleNextTab}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-l from-amber-500/20 to-slate-900 border-2 border-amber-400/80 hover:border-amber-300 text-amber-300 hover:text-white shadow-lg shadow-amber-500/25 cursor-pointer group transition-all"
                >
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 block leading-tight">
                      {language === 'hi' ? 'अगला खंड (Forward) ▶' : 'Next Sub-Heading ▶'}
                    </span>
                    <span className="text-xs font-black text-slate-100 group-hover:text-amber-200 line-clamp-1">
                      {subTabsLoShu[(currentTabIndex + 1) % subTabsLoShu.length].label}
                    </span>
                  </div>
                  <motion.div
                    animate={{ x: [3, -3, 3] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                    className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Nav Tabs Bar - High Contrast Off-White with Bold Black Text when Active & Horizontal Quick Scroll */}
            <div className="relative">
              <button
                type="button"
                onClick={handlePrevTab}
                className="hidden sm:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-300 items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                title={language === 'hi' ? 'पिछला (Reverse)' : 'Previous'}
              >
                <ChevronLeft className="w-4 h-4 stroke-[3]" />
              </button>

              <div
                ref={tabsScrollRef}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800"
              >
                {subTabsLoShu.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeTabSub === tab.id;
                  return (
                    <button
                      key={tab.id}
                      data-subtab={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTabSub(tab.id as any);
                        scrollToTab(idx);
                      }}
                      className={`px-3 py-2.5 rounded-xl font-bold transition-all text-xs flex flex-col items-center justify-center gap-1 cursor-pointer text-center ${
                        isActive
                          ? 'bg-[#f8fafc] text-[#090d16] font-black shadow-lg shadow-white/10 ring-2 ring-amber-400 scale-[1.02]'
                          : 'bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-slate-950 stroke-[2.5]' : 'text-amber-400'
                        }`}
                      />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNextTab}
                className="hidden sm:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-300 items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                title={language === 'hi' ? 'अगला (Forward)' : 'Next'}
              >
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* TAB 1: Grid & Numbers (Matches user screenshots with clean structure) */}
          {activeTabSub === 'grid' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 3x3 Magic Square Box */}
                <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3 py-1 rounded-lg shadow-sm tracking-wide uppercase mb-2">
                      <Grid className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                      <span>{language === 'hi' ? '3×3 जादुई अंक चक्र' : '3X3 MAGIC SQUARE'}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      {language === 'hi' ? 'आपका व्यक्तिगत लो शू ग्रिड' : 'Your Personal Lo Shu Grid'}
                    </h2>
                  </div>

                  {/* Educational explanation for 3x3 Grid */}
                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{language === 'hi' ? 'लो शू ग्रिड क्या है?' : 'What is the Lo Shu Grid?'}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {language === 'hi'
                        ? 'यह 4000 वर्ष पुराना एक दिव्य जादुई वर्ग है जिसकी प्रत्येक पंक्ति, स्तंभ और विकर्ण का योग 15 होता है। आपकी जन्म तिथि के अंक इसमें स्वतः भर कर आपके जीवन के विभिन्न पहलुओं (मन, भावना, कर्म) का दर्पण प्रस्तुत करते हैं।'
                        : 'A 4,000-year-old ancient magic square where every row, column and diagonal adds up to 15. The numbers in your birth date fill fixed positions to reveal your cosmic blueprint.'}
                    </p>
                  </div>

                  {/* The Fixed Magic Square Grid */}
                  <div className="bg-[#0b0e14] p-3.5 sm:p-4 rounded-2xl border border-amber-500/20 aspect-square max-w-[340px] mx-auto shadow-inner flex flex-col justify-between">
                    {gridPositions.map((row, rIdx) => (
                      <div key={rIdx} className="grid grid-cols-3 gap-2.5 h-[31%]">
                        {row.map((num) => {
                          const count = result.counts[num] || 0;
                          const isPresent = count > 0;
                          const isSelected = selectedCellNum === num;

                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setSelectedCellNum(selectedCellNum === num ? null : num)}
                              className={`rounded-2xl border flex items-center justify-center text-center transition-all cursor-pointer relative group ${
                                isPresent
                                  ? 'bg-[#18130d] border-2 border-[#c99539] text-[#eebc55] shadow-md shadow-amber-950/40 hover:border-[#f5d07a]'
                                  : 'bg-[#10141e]/80 border border-slate-800 text-[#716450] hover:border-slate-700'
                              } ${isSelected ? 'ring-2 ring-amber-400 border-white' : ''}`}
                            >
                              <span
                                className={`text-2xl sm:text-3xl font-bold tracking-normal ${
                                  isPresent
                                    ? 'text-[#f3c565]'
                                    : 'text-[#6e6353]'
                                }`}
                              >
                                {isPresent ? Array(count).fill(num).join('') : num}
                              </span>

                              {count > 1 && (
                                <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-[#c99539] text-slate-950 px-1 py-0.2 rounded leading-none">
                                  {count}x
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Interactive Selected Cell Quick Inspector */}
                  {selectedCellNum !== null && (
                    <div className="mt-4 p-4 bg-slate-950/80 border border-amber-500/40 rounded-2xl text-xs space-y-2.5 animate-fadeIn shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-[#5e3e11] border border-[#8e5e1b] text-[#fcd34d] font-bold flex items-center justify-center text-xs">
                            {selectedCellNum}
                          </span>
                          <span className="font-bold text-amber-300">
                            {language === 'hi'
                              ? LO_SHU_NUMBERS_METADATA[selectedCellNum].titleHindi
                              : LO_SHU_NUMBERS_METADATA[selectedCellNum].title}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            result.counts[selectedCellNum] > 0
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {result.counts[selectedCellNum] > 0
                            ? language === 'hi'
                              ? `उपस्थित (${result.counts[selectedCellNum]} बार)`
                              : `Present (${result.counts[selectedCellNum]}x)`
                            : language === 'hi'
                            ? 'अनुपस्थित (Missing)'
                            : 'Missing'}
                        </span>
                      </div>

                      <div className="border-l-2 border-amber-400 pl-3 py-1 space-y-1 bg-amber-950/20 rounded-r-lg">
                        <p className="text-slate-200 text-xs leading-relaxed">
                          {language === 'hi'
                            ? LO_SHU_NUMBERS_METADATA[selectedCellNum].fullMeaningHindi
                            : LO_SHU_NUMBERS_METADATA[selectedCellNum].fullMeaning}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-1">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {language === 'hi' ? 'तत्व: ' : 'Element: '}
                          <strong className="text-slate-200">{language === 'hi' ? LO_SHU_NUMBERS_METADATA[selectedCellNum].elementHindi : LO_SHU_NUMBERS_METADATA[selectedCellNum].element}</strong>
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {language === 'hi' ? 'दिशा: ' : 'Direction: '}
                          <strong className="text-slate-200">{language === 'hi' ? LO_SHU_NUMBERS_METADATA[selectedCellNum].directionHindi : LO_SHU_NUMBERS_METADATA[selectedCellNum].direction}</strong>
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {language === 'hi' ? 'ग्रह: ' : 'Planet: '}
                          <strong className="text-slate-200">{language === 'hi' ? LO_SHU_NUMBERS_METADATA[selectedCellNum].planetHindi : LO_SHU_NUMBERS_METADATA[selectedCellNum].planet}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Clean Present, Repeated & Missing Breakdown */}
                <div className="lg:col-span-7 space-y-6">
                  {/* NUMBERS PRESENT Section */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                        <span>{language === 'hi' ? 'उपस्थित अंक (NUMBERS PRESENT)' : 'NUMBERS PRESENT'}</span>
                      </div>
                      
                      {/* Educational info card for Present Numbers */}
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                        <strong className="text-emerald-400 block mb-0.5 font-semibold">
                          {language === 'hi' ? '💡 उपस्थित अंक क्या दर्शाते हैं?' : '💡 What do Present Numbers mean?'}
                        </strong>
                        <p>
                          {language === 'hi'
                            ? 'ये अंक आपकी जन्मजात प्राकृतिक शक्तियां, स्वाभाविक प्रतिभाएं और वे गुण हैं जो आपको बिना किसी प्रयास के सहज प्राप्त हैं। ये आपके जीवन के सबसे मजबूत आधार स्तंभ हैं।'
                            : 'These numbers represent the innate traits, talents, and natural strengths you were born with. They are your core cosmic advantages in life.'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {result.presentNumbers.map((item) => {
                        const meta = LO_SHU_NUMBERS_METADATA[item.number];
                        const isExpanded = selectedCellNum === item.number;
                        return (
                          <div
                            key={item.number}
                            onClick={() => setSelectedCellNum(isExpanded ? null : item.number)}
                            className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                              isExpanded
                                ? 'bg-[#151b29] border-amber-500/50 shadow-lg shadow-amber-950/20'
                                : 'bg-[#0f131d]/90 hover:bg-[#151b29] border-slate-800/80'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-[#5e3e11] border border-[#8e5e1b] text-[#fcd34d] font-bold text-xs flex items-center justify-center shrink-0">
                                  {item.number}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-slate-200 hover:text-amber-200 transition-colors">
                                    {language === 'hi' ? item.titleHindi : item.title}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs text-amber-400/80 font-mono font-bold shrink-0">
                                {item.count > 1 ? `${item.count}x` : ''}
                              </span>
                            </div>

                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-2.5 animate-fadeIn pl-2">
                                <div className="border-l-2 border-amber-400 pl-3.5 py-1 space-y-1 bg-amber-950/15 rounded-r-lg">
                                  <p className="leading-relaxed text-slate-200">
                                    {language === 'hi' ? meta.fullMeaningHindi : meta.fullMeaning}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-1">
                                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                    {language === 'hi' ? meta.elementHindi : meta.element}
                                  </span>
                                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                    {language === 'hi' ? meta.directionHindi : meta.direction}
                                  </span>
                                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                    {language === 'hi' ? meta.planetHindi : meta.planet}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* REPEATED NUMBERS Section */}
                  {result.repeatedNumbers.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                          <span>{language === 'hi' ? 'दोहराए गए अंक (REPEATED NUMBERS)' : 'REPEATED NUMBERS'}</span>
                        </div>

                        {/* Educational info card for Repeated Numbers */}
                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                          <strong className="text-amber-300 block mb-0.5 font-semibold">
                            {language === 'hi' ? '💡 अंकों की पुनरावृत्ति (Repetition) का क्या अर्थ है?' : '💡 What does Number Repetition signify?'}
                          </strong>
                          <p>
                            {language === 'hi'
                              ? 'जब कोई अंक जन्म तिथि में 2 या अधिक बार आता है, तो उस अंक का तत्व व ऊर्जा अत्यधिक प्रबल हो जाती है। 2 बार आना आदर्श शक्ति देता है, जबकि 3 या अधिक बार आने पर उस ऊर्जा को संतुलित करने की आवश्यकता होती है।'
                              : 'When a number appears multiple times, its frequency is amplified. Twice is often a superpower, while 3+ times indicates an overwhelming energy that needs mindful grounding.'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {result.repeatedNumbers.map((item) => {
                          const meta = LO_SHU_NUMBERS_METADATA[item.number];
                          const isExpanded = selectedCellNum === item.number;
                          return (
                            <div
                              key={item.number}
                              onClick={() => setSelectedCellNum(isExpanded ? null : item.number)}
                              className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                                isExpanded
                                  ? 'bg-[#151b29] border-amber-500/50 shadow-lg shadow-amber-950/20'
                                  : 'bg-[#0f131d]/90 hover:bg-[#151b29] border-slate-800/80'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-[#5e3e11] border border-[#8e5e1b] text-[#fcd34d] font-bold text-xs flex items-center justify-center shrink-0">
                                    {item.number}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-slate-200 hover:text-amber-200 transition-colors">
                                      {language === 'hi' ? item.titleHindi : item.title}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {language === 'hi' ? item.intensityHindi : item.intensity}
                                </span>
                              </div>

                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-2.5 animate-fadeIn pl-2">
                                  <div className="border-l-2 border-amber-400 pl-3.5 py-1 space-y-1 bg-amber-950/15 rounded-r-lg">
                                    <p className="leading-relaxed text-slate-200">
                                      {language === 'hi' ? meta.fullMeaningHindi : meta.fullMeaning}
                                    </p>
                                  </div>
                                  <p className="text-amber-300/90 text-xs">
                                    <strong>{language === 'hi' ? 'दोहराव का प्रभाव: ' : 'Repetition impact: '}</strong>
                                    {language === 'hi' ? item.descriptionHindi : item.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* MISSING NUMBERS Section */}
                  {result.missingNumbers.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                          <span>{language === 'hi' ? 'अनुपस्थित अंक (MISSING NUMBERS)' : 'MISSING NUMBERS'}</span>
                        </div>

                        {/* Educational info card for Missing Numbers */}
                        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                          <strong className="text-rose-400 block mb-0.5 font-semibold">
                            {language === 'hi' ? '💡 अनुपस्थित (Missing) अंक क्या हैं?' : '💡 What are Missing Numbers?'}
                          </strong>
                          <p>
                            {language === 'hi'
                              ? 'ये अंक कोई दोष नहीं हैं, बल्कि आपके जीवन के "विकास के सबक (Growth Lessons)" हैं। रत्न, रुद्राक्ष, वास्तु और आचरण के उपायों द्वारा इन अंकों की ऊर्जा को 100% पूरा किया जा सकता है।'
                              : 'Missing numbers are not defects; they are your soul lessons and growth areas. Their missing vibrations can be harmonized using gemstones, Vastu alignments, and lifestyle practices.'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {result.missingNumbers.map((item) => {
                          const meta = LO_SHU_NUMBERS_METADATA[item.number];
                          const isExpanded = selectedCellNum === item.number;
                          return (
                            <div
                              key={item.number}
                              onClick={() => setSelectedCellNum(isExpanded ? null : item.number)}
                              className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                                isExpanded
                                  ? 'bg-[#151b29] border-rose-500/50 shadow-lg shadow-rose-950/20'
                                  : 'bg-[#0f131d]/90 hover:bg-[#151b29] border-slate-800/80'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-[#5e3e11] border border-[#8e5e1b] text-[#fcd34d] font-bold text-xs flex items-center justify-center shrink-0">
                                  {item.number}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-slate-200 hover:text-rose-200 transition-colors">
                                    {language === 'hi' ? item.titleHindi : item.title}
                                  </span>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-2.5 animate-fadeIn pl-2">
                                  <div className="border-l-2 border-amber-400 pl-3.5 py-1 space-y-1 bg-amber-950/15 rounded-r-lg">
                                    <p className="leading-relaxed text-slate-200">
                                      {language === 'hi' ? meta.fullMeaningHindi : meta.fullMeaning}
                                    </p>
                                  </div>
                                  <p className="text-rose-300/90 text-xs">
                                    <strong>{language === 'hi' ? 'जीवन का सबक: ' : 'Life Lesson: '}</strong>
                                    {language === 'hi' ? item.lessonHindi : item.lesson}
                                  </p>
                                  {item.remedies && (
                                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-300">
                                      <span className="font-bold text-amber-300 block">
                                        {language === 'hi' ? 'सरल उपाय:' : 'Quick Remedy:'}
                                      </span>
                                      <p>
                                        <strong className="text-slate-200">{language === 'hi' ? 'दैनिक अभ्यास: ' : 'Daily Practice: '}</strong>
                                        {language === 'hi' ? item.remediesHindi?.habit : item.remedies.habit}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Calculate Again Action Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full bg-[#161a25] hover:bg-[#1e2434] text-slate-300 hover:text-white font-medium py-3.5 px-4 rounded-2xl border border-slate-800/90 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-400" />
                      <span>{language === 'hi' ? 'पुनः गणना करें (Calculate Again)' : 'Calculate Again'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Calculation Analysis (User explanation of what calculation means) */}
          {activeTabSub === 'analysis' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Top Banner: Grid Vitality & Balance Meter */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase mb-2">
                      <Activity className="w-3.5 h-3.5 text-sky-600 stroke-[2.5]" />
                      <span>{language === 'hi' ? 'गणना का संपूर्ण फलकथन' : 'LO SHU DEEP CALCULATION ANALYSIS'}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {language === 'hi' ? 'आपकी जन्म तिथि और ग्रिड की शक्ति क्या कहती है?' : 'What Does Your Calculation Signify?'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                        {language === 'hi' ? 'ग्रिड संतुलन स्कोर' : 'Grid Balance Score'}
                      </span>
                      <span className="text-xl font-mono font-black text-amber-300">
                        {result.deepAnalysis.gridBalanceScore}%
                      </span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-950 shadow">
                      {language === 'hi' ? result.deepAnalysis.gridBalanceLevelHindi : result.deepAnalysis.gridBalanceLevel}
                    </span>
                  </div>
                </div>

                {/* Educational Info Card for Grid Balance Score */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{language === 'hi' ? 'ग्रिड संतुलन स्कोर क्या है और यह कैसे काम करता है?' : 'What is the Grid Balance Score & How it Works?'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {language === 'hi'
                      ? 'ग्रिड संतुलन स्कोर (0-100%) यह मापता है कि आपकी जन्म तिथि में मानसिक (Mind), भावनात्मक (Soul), और व्यावहारिक (Body) तलों तथा 5 प्राकृतिक तत्वों (जल, काष्ठ, अग्नि, पृथ्वी, धातु) के बीच कितना सामंजस्य है। 65% या उससे अधिक स्कोर जीवन में स्थिरता, सहज विकास और सफलता का संकेत देता है।'
                      : 'The Grid Balance Score evaluates the holistic equilibrium between your mental, emotional, practical planes and the 5 elemental energies. A score of 65%+ denotes harmonious life momentum and high adaptability.'}
                  </p>
                </div>

                {/* Mulank (Driver) & Bhagyank (Conductor) Cards with Off-White Highlight Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mulank (Driver) */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-xl flex items-center justify-center">
                          {result.mulank}
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-sm uppercase tracking-wider mb-1">
                            <Sparkles className="w-3 h-3 text-amber-600 stroke-[2.5]" />
                            <span>{language === 'hi' ? 'मूलांक (Driver / Root Number)' : 'DRIVER / MULANK NUMBER'}</span>
                          </div>
                          <h4 className="font-bold text-white text-base">
                            {language === 'hi' ? result.deepAnalysis.mulankInfo.titleHindi : result.deepAnalysis.mulankInfo.title}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Educational explanation for Mulank */}
                    <div className="bg-slate-900/95 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <strong className="text-amber-300 block font-semibold">
                        {language === 'hi' ? '📌 मूलांक क्या होता है?' : '📌 What is Mulank (Driver)?'}
                      </strong>
                      <p className="text-slate-300">
                        {language === 'hi'
                          ? 'मूलांक आपकी जन्म तिथि के दिन (1-31) का योग है। यह आपकी आंतरिक प्रकृति, सोच, व्यवहार और जन्मजात क्षमताओं का संचालक (ड्राइवर) है। आयु के 35 वर्ष तक इसका गहरा प्रभाव होता है।'
                          : 'Calculated from your day of birth (1-31), Mulank is your inner psychological engine. It governs your core disposition, subconscious reactions, and immediate personality.'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-1 text-xs leading-relaxed text-slate-300">
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
                        <strong className="text-amber-300 block mb-0.5">
                          {language === 'hi' ? 'मूल स्वभाव व व्यक्तित्व:' : 'Core Nature & Archetype:'}
                        </strong>
                        <p>{language === 'hi' ? result.deepAnalysis.mulankInfo.natureHindi : result.deepAnalysis.mulankInfo.nature}</p>
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
                        <strong className="text-emerald-400 block mb-0.5">
                          {language === 'hi' ? 'सफलता प्रदायक कार्यक्षेत्र (Careers):' : 'Favorable Career Fields:'}
                        </strong>
                        <p>{language === 'hi' ? result.deepAnalysis.mulankInfo.careerHindi : result.deepAnalysis.mulankInfo.career}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bhagyank (Conductor) */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400 text-sky-300 font-black text-xl flex items-center justify-center">
                          {result.bhagyank}
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-sm uppercase tracking-wider mb-1">
                            <Compass className="w-3 h-3 text-sky-600 stroke-[2.5]" />
                            <span>{language === 'hi' ? 'भाग्यांक (Destiny / Conductor)' : 'DESTINY / BHAGYANK NUMBER'}</span>
                          </div>
                          <h4 className="font-bold text-white text-base">
                            {language === 'hi' ? result.deepAnalysis.bhagyankInfo.titleHindi : result.deepAnalysis.bhagyankInfo.title}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Educational explanation for Bhagyank */}
                    <div className="bg-slate-900/95 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <strong className="text-sky-300 block font-semibold">
                        {language === 'hi' ? '📌 भाग्यांक क्या होता है?' : '📌 What is Bhagyank (Conductor)?'}
                      </strong>
                      <p className="text-slate-300">
                        {language === 'hi'
                          ? 'भाग्यांक आपकी पूरी जन्म तिथि (दिन + माह + वर्ष) का कुल योग है। यह आपकी जीवन यात्रा का जीपीएस (कंडक्टर) है जो 35 वर्ष की आयु के बाद आपके करियर, भाग्य और जीवन के अंतिम लक्ष्य को तय करता है।'
                          : 'Calculated from your entire birth date (Day + Month + Year), Bhagyank represents your destiny highway, career pinnacle, and soul mission especially prominent after age 35.'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-1 text-xs leading-relaxed text-slate-300">
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
                        <strong className="text-sky-300 block mb-0.5">
                          {language === 'hi' ? 'जीवन का भाग्य पथ (Destiny Path):' : 'Destiny Path & Journey:'}
                        </strong>
                        <p>{language === 'hi' ? result.deepAnalysis.bhagyankInfo.destinyPathHindi : result.deepAnalysis.bhagyankInfo.destinyPath}</p>
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
                        <strong className="text-indigo-300 block mb-0.5">
                          {language === 'hi' ? 'आत्मा का मुख्य उद्देश्य (Life Mission):' : 'Ultimate Life Mission:'}
                        </strong>
                        <p>{language === 'hi' ? result.deepAnalysis.bhagyankInfo.lifeMissionHindi : result.deepAnalysis.bhagyankInfo.lifeMission}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5 Elements Balance Meter */}
                <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                      <span>{language === 'hi' ? 'पंचतत्व संतुलन (5 ELEMENTS HARMONY)' : '5 ELEMENTS HARMONY (PANCHA MAHABHUTA)'}</span>
                    </div>

                    {/* Educational explanation for 5 elements */}
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                      <strong className="text-amber-300 block mb-0.5 font-semibold">
                        {language === 'hi' ? '💡 पंचतत्व क्या हैं और इनका संतुलन क्यों आवश्यक है?' : '💡 What are the 5 Elements and Why Harmony Matters?'}
                      </strong>
                      <p>
                        {language === 'hi'
                          ? 'वैदिक एवं फेंगशुई विज्ञान में ब्रह्मांड 5 तत्वों से बना है: जल (अंक 1 - बुद्धि व करियर), काष्ठ (अंक 3,4 - योजना व धन), अग्नि (अंक 9 - ख्याति व ऊर्जा), पृथ्वी (अंक 2,5,8 - स्थिरता व रिश्ते), और धातु (अंक 6,7 - सहायता व रचनात्मकता)। जब ये तत्व संतुलित होते हैं, तो जीवन में कभी रुकावट नहीं आती।'
                          : 'Nature is governed by 5 cosmic elements: Water (1 - Career), Wood (3,4 - Vision & Prosperity), Fire (9 - Fame & Drive), Earth (2,5,8 - Stability & Grounding), and Metal (6,7 - Mentors & Children). Balancing these creates holistic abundance.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {result.deepAnalysis.elementBreakdown.map((elem) => (
                      <div
                        key={elem.element}
                        className={`p-4 rounded-2xl border ${elem.colorClass} space-y-2 bg-slate-950/80`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">
                            {language === 'hi' ? elem.elementHindi : elem.element}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                            {elem.count} {language === 'hi' ? 'अंक' : 'nums'}
                          </span>
                        </div>

                        <span className="text-[10px] font-bold block">
                          {language === 'hi' ? elem.statusHindi : elem.status}
                        </span>

                        <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                          {language === 'hi' ? elem.meaningHindi : elem.meaning}
                        </p>

                        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-amber-300/90">
                          <strong>{language === 'hi' ? 'संतुलन टिप: ' : 'Balancing Tip: '}</strong>
                          {language === 'hi' ? elem.balancingTipHindi : elem.balancingTip}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Strengths & Growth Areas */}
                <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-950 font-black text-xs px-3 py-1 rounded-md shadow-sm uppercase tracking-wide">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      <span>{language === 'hi' ? 'आपकी जन्मजात शक्तियां (STRENGTHS)' : 'INNATE GRID STRENGTHS'}</span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      {language === 'hi'
                        ? 'ये वे शक्तियां हैं जो आपकी जन्म तिथि के मजबूत अंकों से स्वतः प्राप्त होती हैं:'
                        : 'Natural superpowers activated by your core birth chart numbers:'}
                    </p>

                    <ul className="space-y-2 text-xs text-slate-300">
                      {(language === 'hi' ? result.deepAnalysis.keyStrengthsHindi : result.deepAnalysis.keyStrengths).map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Growth Areas */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-950 font-black text-xs px-3 py-1 rounded-md shadow-sm uppercase tracking-wide">
                      <Lightbulb className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                      <span>{language === 'hi' ? 'विकास के मुख्य सबक (GROWTH LESSONS)' : 'CONSCIOUS GROWTH LESSONS'}</span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      {language === 'hi'
                        ? 'इन क्षेत्रों पर थोड़ा ध्यान देकर आप अपने जीवन में 100% सफलता पा सकते हैं:'
                        : 'Life lessons that, when mastered with awareness, unlock total abundance:'}
                    </p>

                    <ul className="space-y-2 text-xs text-slate-300">
                      {(language === 'hi' ? result.deepAnalysis.growthAreasHindi : result.deepAnalysis.growthAreas).map((area, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Complete Grid & Raj Yogas Plan */}
          {activeTabSub === 'completion' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase mb-2">
                    <Award className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                    <span>{language === 'hi' ? 'ग्रिड पूर्णता एवं राजयोग सक्रियण' : 'GRID COMPLETION & RAJ YOGA ACTIVATION'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {language === 'hi'
                      ? 'अपूर्ण ऊर्जा तलों व राजयोगों को कैसे पूर्ण करें?'
                      : 'How to Bridge Missing Numbers & Complete Energy Planes'}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    {language === 'hi'
                      ? 'लो शू ग्रिड में यदि किसी रेखा में 1 या 2 अंक गायब हैं, तो वास्तु उपाय, क्रिस्टल, रंग एवं आचरण द्वारा उस तल को सक्रिय कर पूरा फल प्राप्त किया जा सकता है।'
                      : 'By consciously applying specific gemstone vibrations, Vastu placements, and behavioral remedies, you can energize incomplete planes and manifest their full blessings.'}
                  </p>
                </div>

                {/* Educational Card on Raj Yogas & Plane Completion */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{language === 'hi' ? '💡 राजयोग और ऊर्जा तल को पूर्ण करना क्या होता है?' : '💡 What is a Raj Yoga & Why Complete Energy Planes?'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {language === 'hi'
                      ? 'लो शू ग्रिड में 8 विशेष ऊर्जा रेखाएं (Planes) होती हैं — जैसे 4-5-6 (गोल्डन राजयोग / सफलता रेखा) या 2-5-8 (प्रॉपर्टी / स्थिरता योग)। जब किसी तल में एक या दो अंक छूट जाते हैं, तो उस ऊर्जा का प्रवाह रुक जाता है। नीचे दी गई सक्रियण विधियों द्वारा अनुपस्थित अंकों के कंपन को जाग्रत करके ग्रिड को संपूर्ण बनाया जा सकता है।'
                      : 'The Lo Shu grid contains 8 powerful energy planes (such as 4-5-6 Golden Raj Yoga or 2-5-8 Earth Plane of Real Estate). When numbers are missing, that frequency is interrupted. By bridging missing numbers through specific remedies, you unlock the dormant superpower of that plane.'}
                  </p>
                </div>

                {/* Master Plan Cards */}
                <div className="space-y-4">
                  {result.deepAnalysis.masterBalancingPlan.length === 0 ? (
                    <div className="bg-emerald-950/30 border border-emerald-500/40 p-6 rounded-2xl text-center">
                      <Award className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                      <h4 className="font-bold text-emerald-300 text-base">
                        {language === 'hi' ? 'उत्कृष्ट! आपके सभी मुख्य ऊर्जा तल पूर्ण या सक्रिय हैं।' : 'Exceptional! Your primary energy lines are fully active.'}
                      </h4>
                    </div>
                  ) : (
                    result.deepAnalysis.masterBalancingPlan.map((plan) => (
                      <div
                        key={plan.planeId}
                        className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 font-bold flex items-center justify-center">
                              {plan.percentage}%
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-base">
                                {language === 'hi' ? plan.planeNameHindi : plan.planeName}
                              </h4>
                              <span className="text-xs text-rose-400 font-semibold">
                                {language === 'hi'
                                  ? `आवश्यक अंक: ${plan.missingNums.join(', ')}`
                                  : `Missing digits to complete: ${plan.missingNums.join(', ')}`}
                              </span>
                            </div>
                          </div>

                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-950 shadow">
                            {language === 'hi' ? 'सक्रियण योग्य (Actionable)' : 'Can Be Activated'}
                          </span>
                        </div>

                        {/* Action Steps */}
                        <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                          <div>
                            <strong className="text-amber-400 block mb-0.5">
                              {language === 'hi' ? '🎯 ग्रिड पूर्ण करने की विधि:' : '🎯 Bridge & Complete Action:'}
                            </strong>
                            <p className="text-slate-200 leading-relaxed">
                              {language === 'hi' ? plan.howToActivateHindi : plan.howToActivate}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-800 text-emerald-300">
                            <strong>{language === 'hi' ? '✨ पूर्ण होने पर मिलने वाला लाभ:' : '✨ Unlocked Life Gift:'} </strong>
                            <span>{language === 'hi' ? plan.unlockedRewardHindi : plan.unlockedReward}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Missing Number Full Remedies */}
          {activeTabSub === 'remedies' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                    <span>{language === 'hi' ? 'सम्पूर्ण उपाय मार्गदर्शिका' : 'COMPREHENSIVE REMEDIES GUIDE'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {language === 'hi'
                      ? 'आपकी जन्म तिथि के अनुसार अनुपस्थित अंकों के सटीक उपाय'
                      : 'Precise Remedies According to Your Missing Numbers'}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    {language === 'hi'
                      ? 'रत्न, क्रिस्टल, वास्तु वस्तुएं, रंग चिकित्सा, रुद्राक्ष, दैनिक आचरण एवं वैदिक मंत्रों द्वारा अनुपस्थित अंकों की ऊर्जा को 100% जाग्रत करें।'
                      : 'Elevate your missing number frequencies through authentic gemstones, Vastu alignments, color therapy, rudraksha bracelets, lifestyle habits, and Beej mantras.'}
                  </p>
                </div>

                {/* Educational Card on Remedies */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{language === 'hi' ? '💡 अंक ज्योतिष में उपाय (Remedies) कैसे कार्य करते हैं?' : '💡 How Numerological Remedies Work?'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {language === 'hi'
                      ? 'प्रत्येक अंक एक विशिष्ट ग्रह, दिशा, रंग और प्राकृतिक तत्व से जुड़ा होता है। जब कोई अंक ग्रिड में नहीं होता, तो उस तत्व की तरंगे कम हो जाती हैं। क्रिस्टल, सही वास्तु दिशा, रंग और बीज मंत्र उसी आवृत्ति (Frequency) को आकर्षित करके उस कमी को पूरी तरह संतुलित कर देते हैं।'
                      : 'Every number corresponds to a planetary vibration, directional energy, element, and color spectrum. When a number is missing, surrounding yourself with resonant crystals, directional alignments, and mantras bridges the missing frequency.'}
                  </p>
                </div>

                <div className="space-y-6">
                  {result.missingNumbers.length === 0 ? (
                    <div className="bg-emerald-950/30 border border-emerald-500/40 p-8 rounded-3xl text-center">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                      <h4 className="font-bold text-emerald-300 text-lg">
                        {language === 'hi' ? 'अद्भुत! आपकी जन्म तिथि में कोई भी अंक अनुपस्थित नहीं है।' : 'Exceptional! All numbers are present in your chart.'}
                      </h4>
                      <p className="text-slate-300 text-sm mt-1">
                        {language === 'hi'
                          ? 'आपकी जन्म तिथि में सभी 1 से 9 अंक संतुलित रूप से ऊर्जा प्रवाहित कर रहे हैं।'
                          : 'Your Lo Shu grid enjoys a balanced distribution across all planes.'}
                      </p>
                    </div>
                  ) : (
                    result.missingNumbers.map((m) => {
                      const meta = LO_SHU_NUMBERS_METADATA[m.number];
                      const ext = m.remediesExtended;
                      return (
                        <div
                          key={m.number}
                          className="bg-slate-950 p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 shadow-lg"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800/80 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xl flex items-center justify-center">
                                {m.number}
                              </div>
                              <div>
                                <h4 className="font-bold text-amber-300 text-lg">
                                  {language === 'hi' ? meta.missingTitleHindi : meta.missingTitle}
                                </h4>
                                <span className="text-xs text-slate-400">
                                  {language === 'hi'
                                    ? `स्वामी ग्रह: ${meta.planetHindi} • तत्व: ${meta.elementHindi} • शुभ दिशा: ${meta.directionHindi}`
                                    : `Ruler: ${meta.planet} • Element: ${meta.element} • Vastu Direction: ${meta.direction}`}
                                </span>
                              </div>
                            </div>

                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-950 shadow">
                              {language === 'hi' ? `अंक ${m.number} के 6 उपाय` : `6 Remedies for No. ${m.number}`}
                            </span>
                          </div>

                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            {language === 'hi' ? m.lessonHindi : m.lesson}
                          </p>

                          {/* Multi-Dimensional Remedial Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                            {/* 1. Crystals & Gemstones */}
                            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                                💎 {language === 'hi' ? 'रत्न एवं क्रिस्टल (Crystals)' : 'Crystals & Gemstones'}
                              </span>
                              <p className="text-slate-200">
                                {language === 'hi' ? ext.crystals.hi : ext.crystals.en}
                              </p>
                            </div>

                            {/* 2. Vastu Items & Direction */}
                            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                                🏡 {language === 'hi' ? 'वास्तु दिशा व वस्तुएं (Vastu)' : 'Vastu Items & Direction'}
                              </span>
                              <p className="text-slate-200">
                                {language === 'hi' ? ext.vastuItems.hi : ext.vastuItems.en}
                              </p>
                            </div>

                            {/* 3. Rudraksha & Bracelets */}
                            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                                📿 {language === 'hi' ? 'रुद्राक्ष एवं ऊर्जा ब्रेसलेट' : 'Rudraksha & Energy Bracelet'}
                              </span>
                              <p className="text-slate-200">
                                {language === 'hi' ? ext.rudrakshaBracelet.hi : ext.rudrakshaBracelet.en}
                              </p>
                            </div>

                            {/* 4. Color Therapy */}
                            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                🎨 {language === 'hi' ? 'रंग चिकित्सा (Color Therapy)' : 'Auspicious Colors'}
                              </span>
                              <p className="text-slate-200">
                                <strong className="text-emerald-300">{language === 'hi' ? 'शुभ: ' : 'Favorable: '}</strong>
                                {language === 'hi' ? ext.colors.hi : ext.colors.en}
                              </p>
                              <p className="text-slate-400 text-[10px]">
                                <strong className="text-rose-400">{language === 'hi' ? 'वर्जित: ' : 'Avoid: '}</strong>
                                {language === 'hi' ? ext.colors.avoidHi : ext.colors.avoid}
                              </p>
                            </div>

                            {/* 5. Daily Lifestyle & Karma */}
                            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                                🧘‍♂️ {language === 'hi' ? 'दैनिक आचरण व कर्म (Lifestyle)' : 'Daily Habit & Karma'}
                              </span>
                              <p className="text-slate-200">
                                {language === 'hi' ? ext.lifestyleActions.hi : ext.lifestyleActions.en}
                              </p>
                            </div>

                            {/* 6. Vedic Mantra & Affirmation */}
                            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block">
                                🕉️ {language === 'hi' ? 'बीज मंत्र एवं संकल्प' : 'Beej Mantra & Affirmation'}
                              </span>
                              <p className="text-amber-200 font-semibold font-mono text-[11px]">
                                {language === 'hi' ? ext.mantra.hi : ext.mantra.en}
                              </p>
                              <p className="text-slate-400 italic text-[10px]">
                                "{language === 'hi' ? ext.affirmation.hi : ext.affirmation.en}"
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 8 Energy Planes Tab */}
          {activeTabSub === 'planes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase mb-2">
                    <Grid className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                    <span>{language === 'hi' ? '8 ऊर्जा तल एवं राजयोग' : '8 ENERGY PLANES & RAJ YOGAS'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {language === 'hi' ? 'क्षैतिज, लंबवत एवं विकर्ण तलों का प्रभाव' : 'Horizontal, Vertical & Diagonal Alignments'}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    {language === 'hi'
                      ? 'जब किसी तल के तीनों अंक ग्रिड में उपस्थित होते हैं, तो वह योग 100% पूर्ण होकर जातक को विशेष सामर्थ्य प्रदान करता है।'
                      : 'When all 3 numbers of a line are present, the plane becomes 100% complete, granting exceptional gifts and life elevation.'}
                  </p>
                </div>

                {/* Educational Info Card for Energy Planes */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{language === 'hi' ? '💡 लो शू ग्रिड के 8 तल क्या हैं?' : '💡 What are the 8 Energy Planes in Lo Shu Grid?'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {language === 'hi'
                      ? 'लो शू ग्रिड में 3 क्षैतिज तल (मानसिक 4-9-2, भावनात्मक 3-5-7, व्यावहारिक 8-1-6), 3 लंबवत तल (योजना 4-3-8, इच्छाशक्ति 9-5-1, कर्म 2-7-6) और 2 विकर्ण राजयोग (गोल्डन योग 4-5-6, सिल्वर योग 2-5-8) होते हैं। ये रेखाएं जातक के जीवन के विभिन्न आयामों को शक्ति प्रदान करती हैं।'
                      : 'The 8 planes comprise 3 Horizontal (Mental 4-9-2, Emotional 3-5-7, Practical 8-1-6), 3 Vertical (Thought 4-3-8, Will 9-5-1, Action 2-7-6), and 2 Diagonals (Golden Raj Yoga 4-5-6, Silver Raj Yoga 2-5-8). Each full line channels focused cosmic power into your life.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.planes.map((plane) => (
                    <div
                      key={plane.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        plane.percentage === 100
                          ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-emerald-950/30 border-amber-400/60 shadow-lg shadow-amber-500/10'
                          : plane.percentage > 0
                          ? 'bg-slate-950/90 border-slate-800'
                          : 'bg-slate-950/50 border-slate-800/60 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                            {plane.percentage === 100 && <Award className="w-4 h-4 text-amber-400" />}
                            {language === 'hi' ? plane.nameHindi : plane.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {plane.numbers.map((n) => {
                              const isP = (result.counts[n] || 0) > 0;
                              return (
                                <span
                                  key={n}
                                  className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center border ${
                                    isP
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                                      : 'bg-slate-900 text-slate-600 border-slate-800'
                                  }`}
                                >
                                  {n}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                            plane.percentage === 100
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : plane.percentage > 0
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {language === 'hi' ? plane.statusHindi : plane.status}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                        <div
                          className={`h-full transition-all duration-500 ${
                            plane.percentage === 100
                              ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${plane.percentage}%` }}
                        />
                      </div>

                      <p className="text-slate-300 text-xs mt-3 leading-relaxed">
                        {language === 'hi' ? plane.significanceHindi : plane.significance}
                      </p>

                      <div className="mt-3 text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 text-amber-200/90">
                        <span className="font-semibold text-slate-400 block text-[10px] uppercase mb-0.5">
                          {language === 'hi' ? 'जीवन पर प्रभाव:' : 'Life Manifestation:'}
                        </span>
                        {language === 'hi' ? plane.impactHindi : plane.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Educational Guide Tab */}
          {activeTabSub === 'guide' && (
            <div className="space-y-8 animate-fadeIn">
              {/* What the Lo Shu grid is */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
                <div className="border-b border-slate-800 pb-4">
                  <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                    <span>{language === 'hi' ? 'शास्त्रीय पृष्ठभूमि' : 'HISTORICAL ORIGIN'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {language === 'hi' ? 'लो शू ग्रिड क्या है? (What the Lo Shu grid is)' : 'What the Lo Shu grid is'}
                  </h3>
                </div>

                <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                  <p>
                    {language === 'hi'
                      ? 'लो शू ग्रिड की उत्पत्ति प्राचीन चीनी जादुई वर्ग (Saturn Magic Square) से हुई है। इसमें 1 से 9 तक के अंकों को 3×3 के वर्ग में इस प्रकार व्यवस्थित किया गया है कि प्रत्येक पंक्ति (Row), स्तंभ (Column) और विकर्ण (Diagonal) का योग 15 आता है।'
                      : 'The Lo Shu grid comes from an ancient Chinese magic square, the Saturn square, in which the numbers 1 to 9 are arranged so that every row, column and diagonal adds up to fifteen.'}
                  </p>
                  <p>
                    {language === 'hi'
                      ? 'अंक ज्योतिष में इसी 3×3 वर्ग का उपयोग आपकी जन्म तिथि के मानचित्र के रूप में किया जाता है: जन्म तिथि के अंकों को ग्रिड में उनके निर्धारित स्थानों पर रखा जाता है, और बनने वाले पैटर्न को आपकी जन्मजात शक्तियों तथा उन गुणों के रूप में पढ़ा जाता है जिन्हें आपको विकसित करना है।'
                      : 'In numerology the same 3×3 square is used as a map of your birth date: the digits of your date of birth are dropped into their fixed places on the grid, and the resulting pattern is read as a picture of your strengths and the qualities you are here to develop.'}
                  </p>
                  <p>
                    {language === 'hi'
                      ? 'यह ग्रिड केवल जन्म तिथि के अंकों (दिन, माह एवं वर्ष) का उपयोग करता है — और इसमें शून्य (0) का कोई स्थान नहीं होता, इसलिए उन्हें छोड़ दिया जाता है। प्रत्येक स्थिति का एक पारंपरिक अर्थ होता है, जैसे अंक 1 में आत्म-अभिव्यक्ति से लेकर अंक 9 में महत्वाकांक्षा व मानवता तक, और केंद्र (5) में इच्छाशक्ति व संतुलन।'
                      : 'The grid uses only the digits of the date itself — day, month and year — and zeros carry no place in it, so they are simply skipped. Each position carries a traditional meaning, from self-expression in the 1 to ambition and humanity in the 9, with will and balance at the centre.'}
                  </p>
                  <p>
                    {language === 'hi'
                      ? 'जो अंक एक या अधिक बार आता है वह ऐसा गुण है जो आपमें स्वाभाविक रूप से विद्यमान है; जो अंक अनुपस्थित है उसे जीवन के एक सबक के रूप में देखा जाता है, और जो अंक दोहराया जाता है वह उस गुण की अत्यधिक प्रबलता को दर्शाता है।'
                      : 'A number that appears once or more is a quality you naturally carry; a number that is missing is read as a lesson to grow into, and a number that repeats is that quality strongly — sometimes excessively — present.'}
                  </p>
                </div>
              </div>

              {/* What each number means in the Lo Shu grid */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wide uppercase mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                    <span>{language === 'hi' ? 'अंकों की विस्तृत परिभाषा' : 'IN-DEPTH ARCHETYPES'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {language === 'hi'
                      ? 'लो शू ग्रिड में प्रत्येक अंक का क्या अर्थ है?'
                      : 'What each number means in the Lo Shu grid'}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    {language === 'hi'
                      ? 'प्रत्येक अंक के 3 स्वरूप: उपस्थित (Present), अनुपस्थित (Missing), एवं पुनरावृत्त (Repeated)।'
                      : 'Each position carries a traditional meaning across present, missing, and repeated states.'}
                  </p>
                </div>

                <div className="space-y-6">
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
                    const meta = LO_SHU_NUMBERS_METADATA[n];
                    return (
                      <div
                        key={n}
                        className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-all space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-base flex items-center justify-center">
                            {n}
                          </div>
                          <div>
                            <h4 className="font-bold text-amber-300 text-base">
                              {language === 'hi'
                                ? `अंक ${n} — ${meta.titleHindi}`
                                : `Number ${n} — ${meta.title}`}
                            </h4>
                            <span className="text-xs text-slate-400">
                              {language === 'hi'
                                ? `दिशा: ${meta.directionHindi} • तत्व: ${meta.elementHindi}`
                                : `Direction: ${meta.direction} • Element: ${meta.element}`}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs leading-relaxed pt-1">
                          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                            <span className="font-bold text-emerald-400 block mb-0.5">
                              {language === 'hi' ? '✓ उपस्थित होने पर (Present):' : '✓ Present in Grid:'}
                            </span>
                            <span className="text-slate-200">
                              {language === 'hi' ? meta.presentDescHindi : meta.presentDesc}
                            </span>
                          </div>

                          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                            <span className="font-bold text-rose-400 block mb-0.5">
                              {language === 'hi' ? '✗ अनुपस्थित होने पर (Missing / Lesson):' : '✗ Missing (Life Lesson):'}
                            </span>
                            <span className="text-slate-300">
                              {language === 'hi' ? meta.missingDescHindi : meta.missingDesc}
                            </span>
                          </div>

                          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                            <span className="font-bold text-amber-400 block mb-0.5">
                              {language === 'hi' ? '⚡ दोहराए जाने पर (Repeated / Strong):' : '⚡ Repeated (Intense Energy):'}
                            </span>
                            <span className="text-slate-300">
                              {language === 'hi' ? meta.repeatedDescHindi : meta.repeatedDesc}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default LoShuGridView;
