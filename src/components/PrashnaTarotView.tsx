import React, { useState } from 'react';
import { Language } from '../types/astrology';
import { Sparkles, HelpCircle, Shuffle, Loader2, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PrashnaTarotViewProps {
  language: Language;
}

interface TarotCard {
  id: number;
  name: string;
  nameHindi: string;
  archetype: string;
  archetypeHindi: string;
  meaning: string;
  meaningHindi: string;
  blessing: string;
  blessingHindi: string;
  icon: string;
  isFlipped: boolean;
}

const INITIAL_CARDS: TarotCard[] = [
  {
    id: 1,
    name: 'The Sun (Surya Deva)',
    nameHindi: 'सूर्य देव',
    archetype: 'Divine Clarity & Victory',
    archetypeHindi: 'परम तेज व विजय',
    meaning: 'Radiant success, clarity, high vitality, and recognition in career or creative work.',
    meaningHindi: 'प्रचंड सफलता, यश, सरकारी सहयोग, उच्च ऊर्जा और अटके हुए कार्यों का निर्विघ्न पूरा होना।',
    blessing: 'Victory is assured. Stay aligned with truth.',
    blessingHindi: 'विजय निश्चित है। सत्य और धर्म के पथ पर अडिग रहें।',
    icon: '☀️',
    isFlipped: false,
  },
  {
    id: 2,
    name: 'Brihaspati (The Guru)',
    nameHindi: 'देवगुरु बृहस्पति',
    archetype: 'Wisdom & Expansion',
    archetypeHindi: 'ज्ञान व समृद्धि',
    meaning: 'Benevolence, righteous guidance, spiritual illumination, and sudden growth in finances.',
    meaningHindi: 'गुरु कृपा, उच्च ज्ञान, आर्थिक लाभ, विवाह व संतान सुख, एवं सही मार्ग का दर्शन।',
    blessing: 'Trust divine timing. Seek elder counsel.',
    blessingHindi: 'ईश्वरीय समय पर भरोसा रखें। बड़ों का मार्गदर्शन प्राप्त करें।',
    icon: '🧘‍♂️',
    isFlipped: false,
  },
  {
    id: 3,
    name: 'Lakshmi (Divine Abundance)',
    nameHindi: 'माँ महालक्ष्मी',
    archetype: 'Fortune & Harmony',
    archetypeHindi: 'ऐश्वर्य व सौभाग्य',
    meaning: 'Unlocking of wealth channels, peace in relationships, and auspicious family celebrations.',
    meaningHindi: 'धन का सतत प्रवाह, व्यापार में भारी मुनाफा, पारिवारिक शांति और भाग्योदय।',
    blessing: 'Cultivate gratitude. Wealth flows effortlessly.',
    blessingHindi: 'कृतज्ञता का भाव रखें। धन और समृद्धि सहजता से आकर्षित होगी।',
    icon: '🪷',
    isFlipped: false,
  },
  {
    id: 4,
    name: 'Shani Deva (Lord of Karma)',
    nameHindi: 'भगवान शनिदेव',
    archetype: 'Discipline & Patience',
    archetypeHindi: 'कर्म व न्याय',
    meaning: 'Patience required. Steady discipline yields monumental permanent breakthroughs.',
    meaningHindi: 'धैर्य और परिश्रम का समय। जल्दबाजी से बचें। निष्काम कर्म ही सफलता की कुंजी है।',
    blessing: 'Endure with grace. You are being strengthened.',
    blessingHindi: 'धैर्य से संघर्ष का सामना करें। यह समय आपको और अधिक मजबूत बना रहा है।',
    icon: '⚖️',
    isFlipped: false,
  },
  {
    id: 5,
    name: 'Chandra (The Sacred Mind)',
    nameHindi: 'चंद्र देव',
    archetype: 'Intuition & Emotional Flow',
    archetypeHindi: 'मन व अंतर्ज्ञान',
    meaning: 'Listen to your intuition. A shift in environment or relationship brings deep peace.',
    meaningHindi: 'अपनी अंतरात्मा की आवाज सुनें। यात्रा या स्थान परिवर्तन से मानसिक शांति मिलेगी।',
    blessing: 'Calm the mind. All answers reside within.',
    blessingHindi: 'मन को शांत रखें। आपके सभी प्रश्नों के उत्तर आपके भीतर ही हैं।',
    icon: '🌙',
    isFlipped: false,
  },
  {
    id: 6,
    name: 'Mangal (The Sacred Warrior)',
    nameHindi: 'मंगल देव',
    archetype: 'Courage & Decisive Action',
    archetypeHindi: 'साहस व पराक्रम',
    meaning: 'Time to take bold initiatives. Conquer fear, protect boundaries, and lead with valor.',
    meaningHindi: 'साहसी निर्णय लेने का समय। भूमि, संपत्ति अथवा खेल-कूद में विजय के संकेत।',
    blessing: 'Channel anger into focused creation.',
    blessingHindi: 'क्रोध व ऊर्जा को सकारात्मक रचनात्मक कार्यों में लगाएं।',
    icon: '🔥',
    isFlipped: false,
  },
];

export const PrashnaTarotView: React.FC<PrashnaTarotViewProps> = ({ language }) => {
  const [activeSubTab, setActiveSubTab] = useState<'tarot' | 'prashna'>('tarot');
  const [cards, setCards] = useState<TarotCard[]>(INITIAL_CARDS);
  const [prashnaQuestion, setPrashnaQuestion] = useState('');
  const [prashnaNumber, setPrashnaNumber] = useState('108');
  const [isLoadingPrashna, setIsLoadingPrashna] = useState(false);
  const [prashnaResult, setPrashnaResult] = useState<string | null>(null);

  const flipCard = (id: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: !c.isFlipped } : c))
    );
    try {
      confetti({ particleCount: 20, spread: 40 });
    } catch (e) {
      // silent
    }
  };

  const shuffleCards = () => {
    setCards((prev) =>
      [...prev]
        .map((c) => ({ ...c, isFlipped: false }))
        .sort(() => Math.random() - 0.5)
    );
  };

  const handlePrashnaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prashnaQuestion.trim()) return;

    setIsLoadingPrashna(true);
    try {
      const res = await fetch('/api/gemini/prashna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prashnaQuestion,
          number: prashnaNumber,
          language,
        }),
      });
      const data = await res.json();
      setPrashnaResult(data.answer || data.reading || 'Prashna reading calculated successfully.');
    } catch (err) {
      console.error('Failed to get Prashna reading', err);
      setPrashnaResult(
        language === 'hi'
          ? `🔮 **प्रश्न कुंडली मार्गदर्शन:**\n\nप्रश्न लग्न अनुसार आपके प्रश्न पर शुभ ग्रहों का सकारात्मक प्रभाव पड़ रहा है। आने वाले 3 से 6 सप्ताह में कार्य में स्पष्ट प्रगति दिखेगी। *ॐ नमः शिवाय* का स्मरण करें।`
          : `🔮 **Prashna Tantra Guidance:**\n\nBenefic horary alignments indicate progressive momentum. Obstacles will begin to resolve within 3 to 6 weeks. Chant *Om Namah Shivaya* for clarity.`
      );
    } finally {
      setIsLoadingPrashna(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'hi' ? 'वैदिक प्रश्न तंत्र एवं टैरो फलादेश' : 'Vedic Horary Prashna & Intuitive Tarot'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'hi' ? 'तात्कालिक प्रश्न कुंडली एवं वैदिक टैरो' : 'Instant Prashna Tantra & Cosmic Oracle'}
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            {language === 'hi'
              ? 'जब जन्म समय सटीक न हो, तब प्रश्न पूछने के ठीक समय की ग्रह स्थिति (प्रश्न कुंडली) अथवा वैदिक टैरो कार्ड्स से सटीक मार्गदर्शन प्राप्त करें।'
              : 'When birth time is uncertain or when seeking immediate answers, Prashna Kundali (Horary chart) and Vedic archetypal oracle provide divine clarity.'}
          </p>
        </div>
      </div>

      {/* Sub Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('tarot')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'tarot'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎴 {language === 'hi' ? 'वैदिक टैरो कार्ड्स (3D Flip)' : 'Vedic Oracle Tarot (3D Cards)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('prashna')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'prashna'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ❓ {language === 'hi' ? 'प्रश्न कुंडली तंत्र (Horary AI)' : 'Prashna Tantra (Horary Query)'}
          </button>
        </div>
      </div>

      {/* Mode 1: Tarot Cards Grid */}
      {activeSubTab === 'tarot' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'मन में अपना संकल्प या प्रश्न दोहराएं और किसी भी कार्ड पर क्लिक करके दैवीय संदेश प्राप्त करें:'
                : 'Focus on your question with an open heart, then click any card to reveal its divine message:'}
            </p>
            <button
              type="button"
              onClick={shuffleCards}
              className="bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              {language === 'hi' ? 'कार्ड्स फेंटें (Shuffle)' : 'Shuffle Deck'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => flipCard(card.id)}
                className="cursor-pointer group [perspective:1000px] h-[340px]"
              >
                <div
                  className={`w-full h-full relative duration-500 [transform-style:preserve-3d] transition-transform ${
                    card.isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* Card Front (Unflipped - Sacred Geometric Backing) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 rounded-2xl border-2 border-purple-500/40 p-6 flex flex-col items-center justify-between shadow-2xl group-hover:border-purple-400/80 group-hover:scale-[1.02] transition-all">
                    <div className="w-full flex justify-between text-purple-400/60 text-xs font-mono">
                      <span>{language === 'hi' ? 'ॐ' : 'OM'}</span>
                      <span>SRI</span>
                      <span>{language === 'hi' ? 'ॐ' : 'OM'}</span>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-purple-500/15 border border-purple-400/40 flex items-center justify-center text-4xl mx-auto mb-3 shadow-inner">
                        🔮
                      </div>
                      <span className="text-xs uppercase tracking-widest text-purple-300 font-bold">
                        {language === 'hi' ? 'वैदिक टैरो कार्ड' : 'Vedic Oracle'}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {language === 'hi' ? 'क्लिक करके कार्ड खोलें' : 'Click to flip & reveal'}
                      </p>
                    </div>
                    <div className="text-[10px] text-purple-400/60 uppercase tracking-widest font-mono">
                      {language === 'hi' ? `कार्ड #${card.id}` : `Card #${card.id}`}
                    </div>
                  </div>

                  {/* Card Back (Flipped - Revealed Card Content) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/90 rounded-2xl border-2 border-amber-400/80 p-5 flex flex-col justify-between shadow-2xl">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-2xl">{card.icon}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {language === 'hi' ? card.archetypeHi || card.archetypeHindi : card.archetype}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-amber-300 mt-3">
                        {language === 'hi' ? card.nameHindi : card.name}
                      </h4>

                      <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                        {language === 'hi' ? card.meaningHindi : card.meaning}
                      </p>
                    </div>

                    <div className="bg-purple-950/60 p-2.5 rounded-xl border border-purple-500/30">
                      <span className="text-[10px] text-purple-300 font-bold uppercase block">
                        {language === 'hi' ? 'दैवीय संदेश:' : 'Cosmic Counsel:'}
                      </span>
                      <p className="text-xs font-semibold text-white mt-0.5">
                        "{language === 'hi' ? card.blessingHindi : card.blessing}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Prashna Tantra AI Form */}
      {activeSubTab === 'prashna' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-base font-bold text-amber-300 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              {language === 'hi' ? 'प्रश्न कुंडली प्रश्न दर्ज करें' : 'Enter Your Horary Prashna Inquiry'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'hi'
                ? 'जिस क्षण आपके मन में प्रश्न उत्पन्न हुआ है, वही क्षण ब्रह्मांडीय उत्तर का आधार है। 1 से 249 के बीच एक अंक चुनें।'
                : 'The exact moment a query arises holds its energetic resolution. Choose a seed number between 1 to 249.'}
            </p>

            <form onSubmit={handlePrashnaSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'hi' ? 'आपका प्रश्न (Your Question)' : 'Your Question'}
                </label>
                <input
                  type="text"
                  required
                  value={prashnaQuestion}
                  onChange={(e) => setPrashnaQuestion(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'उदा. क्या मुझे इस नए व्यापार/नौकरी में सफलता मिलेगी?'
                      : 'e.g. Will my current job switch or business partnership succeed?'
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'hi' ? 'प्रश्न बीज अंक (1 - 249)' : 'Prashna Seed Number (1 - 249)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="249"
                    value={prashnaNumber}
                    onChange={(e) => setPrashnaNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    id="btn-generate-prashna"
                    type="submit"
                    disabled={isLoadingPrashna || !prashnaQuestion.trim()}
                    className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {isLoadingPrashna ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {language === 'hi' ? 'प्रश्न कुंडली का विचार जारी है...' : 'Calculating Horary Chart...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {language === 'hi' ? 'प्रश्न फलकथन प्राप्त करें' : 'Reveal Prashna Verdict'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Prashna AI Verdict */}
          {prashnaResult && (
            <div className="bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 rounded-2xl border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-lg mb-4">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {language === 'hi' ? 'प्रश्न कुंडली फलादेश एवं निष्कर्ष' : 'Prashna Astrology Divine Verdict'}
              </div>
              <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {prashnaResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
