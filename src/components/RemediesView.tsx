import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types/astrology';
import {
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  Sliders,
  Radio,
  Music,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RemediesViewProps {
  language: Language;
}

interface MantraOption {
  id: string;
  name: string;
  nameHindi: string;
  deity: string;
  deityHindi: string;
  textHindi: string;
  textEnglish: string;
  sanskritAudioText: string;
  frequency: number; // Harmonic frequency in Hz
  benefits: string;
  benefitsHindi: string;
}

const MANTRAS: MantraOption[] = [
  {
    id: 'om_shanti',
    name: 'Universal Omkar & Peace Mantra',
    nameHindi: 'ॐ महाध्वनि एवं शांति मंत्र',
    deity: 'Cosmic Brahman / Shiva',
    deityHindi: 'परब्रह्म / भगवान शिव',
    textHindi: 'ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः। वनस्पतयः शान्तिर्विश्वेदेवाः शान्तिर्ब्रह्म शान्तिः सर्वं शान्तिः शान्तिरेव शान्तिः सा मा शान्तिरेधि॥ ॐ शान्तिः शान्तिः शान्तिः॥',
    textEnglish: 'Om Dyauh Shantir Antariksham Shantih, Prithivi Shantir Aapah Shantih, Oshadhayah Shantih, Vanaspatayah Shantih, Vishvedevah Shantih, Brahma Shantih, Sarvam Shantih, Shantireva Shantih, Saa Maa Shantiredhi. Om Shantih Shantih Shantih.',
    sanskritAudioText: 'ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः वनस्पतयः शान्तिर्विश्वेदेवाः शान्तिर्ब्रह्म शान्तिः सर्वं शान्तिः शान्तिरेव शान्तिः ॐ शान्तिः शान्तिः शान्तिः',
    frequency: 432,
    benefits: 'Profound mental silence, cosmic harmony, anxiety reduction, and aura expansion.',
    benefitsHindi: 'मानसिक शांति, तनाव व अनिद्रा से मुक्ति, नकारात्मक ऊर्जा का शमन और आत्मबल।',
  },
  {
    id: 'gayatri',
    name: 'Gayatri Maha Mantra',
    nameHindi: 'गायत्री महामंत्र (सूर्य व मेधा शक्ति)',
    deity: 'Savitr / Sun God',
    deityHindi: 'सविता देव (सूर्य देव)',
    textHindi: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    textEnglish: 'Om Bhur Bhuva Swaha, Tat Savitur Varenyam, Bhargo Devasya Dheemahi, Dhiyo Yo Nah Prachodayat.',
    sanskritAudioText: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
    frequency: 528,
    benefits: 'Intellectual brilliance, spiritual aura, inner peace, and solar vitality.',
    benefitsHindi: 'प्रखर बुद्धि, विद्या प्राप्ति, तेजस्विता, एकाग्रता और संपूर्ण नकारात्मकता का नाश।',
  },
  {
    id: 'mrityunjaya',
    name: 'Maha Mrityunjaya Mantra',
    nameHindi: 'महामृत्युंजय मंत्र (आरोग्य व दीर्घायु)',
    deity: 'Lord Shiva',
    deityHindi: 'भगवान शिव (महादेव)',
    textHindi: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥',
    textEnglish: 'Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat.',
    sanskritAudioText: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्',
    frequency: 136.1,
    benefits: 'Protection against illness, longevity, overcoming fears, and accidental hazards.',
    benefitsHindi: 'दीर्घायु, असाध्य रोगों व भय से मुक्ति, अकाल मृत्यु निवारण एवं दिव्य सुरक्षा कवच।',
  },
  {
    id: 'ganesh',
    name: 'Ganesh Beej Mantra',
    nameHindi: 'श्री गणेश सिद्धि मंत्र (विघ्नहर्ता)',
    deity: 'Lord Ganesha',
    deityHindi: 'भगवान श्री गणेश',
    textHindi: 'ॐ गं गणपतये नमः। वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    textEnglish: 'Om Gam Ganapataye Namaha. Vakratunda Mahakaya Suryakoti Samaprabha, Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada.',
    sanskritAudioText: 'ॐ गं गणपतये नमः वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा',
    frequency: 396,
    benefits: 'Removal of all life obstacles, success in business, exams, and new ventures.',
    benefitsHindi: 'समस्त कार्यों में सफलता, व्यापारिक लाभ, विघ्न बाधाओं का अंत व सुख-समृद्धि।',
  },
  {
    id: 'lakshmi',
    name: 'Mahalakshmi Wealth Mantra',
    nameHindi: 'महालक्ष्मी धनदायक मंत्र (श्री समृद्धि)',
    deity: 'Goddess Lakshmi',
    deityHindi: 'मां महालक्ष्मी',
    textHindi: 'ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्माकं दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ॥',
    textEnglish: 'Om Shreem Hreem Kleem Tribhuvana Mahalakshmyai Asmakam Daridrya Nashaya Prachura Dhana Dehi Dehi Kleem Hreem Shreem Om.',
    sanskritAudioText: 'ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्माकं दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ',
    frequency: 639,
    benefits: 'Financial abundance, debt relief, business growth, and family prosperity.',
    benefitsHindi: 'स्थिर धन आगमन, ऋण से मुक्ति, व्यापार व ऐश्वर्य में सतत वृद्धि।',
  },
  {
    id: 'shani',
    name: 'Shani Shanti & Gayatri Mantra',
    nameHindi: 'शनि शांति एवं वैदिक मंत्र (साढ़ेसाती निवारण)',
    deity: 'Lord Shani Dev',
    deityHindi: 'न्यायाधीश शनिदेव',
    textHindi: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः॥ ॐ नीलांजन समाभासं रविपुत्रं यमाग्रजम्। छायामार्तण्ड सम्भूतं तं नमामि शनैश्चरम्॥',
    textEnglish: 'Om Praam Preem Proum Sah Shanaishcharaya Namaha. Om Nilanjana Samabhasam Raviputram Yamagrajam, Chhayamartanda Sambhutam Tam Namami Shanaishcharam.',
    sanskritAudioText: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः ॐ नीलांजन समाभासं रविपुत्रं यमाग्रजम् छायामार्तण्ड सम्भूतं तं नमामि शनैश्चरम्',
    frequency: 288,
    benefits: 'Relief from Sade Sati and Dhaiya, removal of career delays, and justice blessings.',
    benefitsHindi: 'शनि साढ़ेसाती, ढैय्या व महादशा कष्टों की शांति, कार्य विलंब से राहत व कर्म शुद्धि।',
  },
];

const GEMSTONES = [
  {
    planet: 'Sun',
    planetHi: 'सूर्य',
    stone: 'Ruby',
    stoneHi: 'माणिक्य',
    metal: 'Gold / Copper',
    metalHi: 'स्वर्ण / तांबा',
    finger: 'Ring Finger',
    fingerHi: 'अनामिका',
    benefits: 'Leadership, authority, government success, vitality.',
    benefitsHi: 'नेतृत्व क्षमता, मान-सम्मान, सरकारी सफलता व तेजस्विता।',
  },
  {
    planet: 'Moon',
    planetHi: 'चन्द्र',
    stone: 'Pearl',
    stoneHi: 'मोती',
    metal: 'Silver',
    metalHi: 'चांदी',
    finger: 'Little Finger',
    fingerHi: 'कनिष्ठिका',
    benefits: 'Mental tranquility, emotional balance, motherly warmth.',
    benefitsHi: 'मानसिक शांति, भावनात्मक संतुलन व मन की एकाग्रता।',
  },
  {
    planet: 'Mars',
    planetHi: 'मंगल',
    stone: 'Red Coral',
    stoneHi: 'मूंगा',
    metal: 'Gold / Copper',
    metalHi: 'स्वर्ण / तांबा',
    finger: 'Ring Finger',
    fingerHi: 'अनामिका',
    benefits: 'Courage, real estate success, blood circulation, vitality.',
    benefitsHi: 'साहस, भूमि-भवन लाभ, रक्त संचार व पराक्रम।',
  },
  {
    planet: 'Mercury',
    planetHi: 'बुध',
    stone: 'Emerald',
    stoneHi: 'पन्ना',
    metal: 'Gold / Bronze',
    metalHi: 'स्वर्ण / कांसा',
    finger: 'Little Finger',
    fingerHi: 'कनिष्ठिका',
    benefits: 'Intelligence, trading profits, communication mastery.',
    benefitsHi: 'तीव्र बुद्धि, व्यापारिक लाभ, वाकपटुता व शिक्षा।',
  },
  {
    planet: 'Jupiter',
    planetHi: 'गुरु',
    stone: 'Yellow Sapphire',
    stoneHi: 'पुखराज',
    metal: 'Gold',
    metalHi: 'स्वर्ण',
    finger: 'Index Finger',
    fingerHi: 'तर्जनी',
    benefits: 'Supreme wisdom, marriage, wealth, progeny blessings.',
    benefitsHi: 'सर्वोच्च ज्ञान, विवाह योग, धन वृद्धि व संतान सुख।',
  },
  {
    planet: 'Venus',
    planetHi: 'शुक्र',
    stone: 'Diamond / Opal',
    stoneHi: 'हीरा / ओपल',
    metal: 'Platinum / Silver',
    metalHi: 'प्लेटिनम / चांदी',
    finger: 'Middle / Little',
    fingerHi: 'मध्यमा / कनिष्ठिका',
    benefits: 'Luxury, creative arts, romance, marital bliss.',
    benefitsHi: 'ऐश्वर्य, कलात्मक सफलता, वैवाहिक सुख व आकर्षण।',
  },
  {
    planet: 'Saturn',
    planetHi: 'शनि',
    stone: 'Blue Sapphire',
    stoneHi: 'नीलम',
    metal: 'Silver / Iron',
    metalHi: 'चांदी / पंचधातु',
    finger: 'Middle Finger',
    fingerHi: 'मध्यमा',
    benefits: 'Massive windfall, discipline, protection from enemies.',
    benefitsHi: 'स्थाई संपत्ति, अनुशासन, शत्रु बाधा से सुरक्षा।',
  },
  {
    planet: 'Rahu',
    planetHi: 'राहु',
    stone: 'Hessonite Garnet',
    stoneHi: 'गोमेद',
    metal: 'Silver / Ashtadhatu',
    metalHi: 'चांदी / अष्टधातु',
    finger: 'Middle Finger',
    fingerHi: 'मध्यमा',
    benefits: 'Sudden fortunes, protection from illusions, tech success.',
    benefitsHi: 'अचानक धन लाभ, भ्रम निवारण व तकनीकी सफलता।',
  },
  {
    planet: 'Ketu',
    planetHi: 'केतु',
    stone: "Cat's Eye",
    stoneHi: 'लहसुनिया',
    metal: 'Silver / Gold',
    metalHi: 'चांदी / स्वर्ण',
    finger: 'Middle / Ring',
    fingerHi: 'मध्यमा / अनामिका',
    benefits: 'Spiritual liberation, protection from hidden enemies.',
    benefitsHi: 'आध्यात्मिक उन्नति, मोक्ष व गुप्त शत्रुओं से रक्षा।',
  },
];

export const RemediesView: React.FC<RemediesViewProps> = ({ language }) => {
  const [selectedMantra, setSelectedMantra] = useState<MantraOption>(MANTRAS[0]);
  const [japaCount, setJapaCount] = useState(0);
  const [totalMalas, setTotalMalas] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDroneActive, setIsDroneActive] = useState(false);
  const [selectedRepetitions, setSelectedRepetitions] = useState<number>(11);
  const [currentChantLoop, setCurrentChantLoop] = useState<number>(0);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);

  // Audio Context and Synth Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneNodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);
  const chantLoopTimerRef = useRef<any>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const stopAllAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (droneNodesRef.current) {
      try {
        droneNodesRef.current.gain.gain.linearRampToValueAtTime(0.001, (audioCtxRef.current?.currentTime || 0) + 0.5);
        setTimeout(() => {
          droneNodesRef.current?.osc1.stop();
          droneNodesRef.current?.osc2.stop();
          droneNodesRef.current = null;
        }, 500);
      } catch {
        droneNodesRef.current = null;
      }
    }
    if (chantLoopTimerRef.current) {
      clearTimeout(chantLoopTimerRef.current);
      chantLoopTimerRef.current = null;
    }
    setIsPlayingAudio(false);
    setIsDroneActive(false);
    setCurrentChantLoop(0);
  };

  // Play Sacred Temple Bell / Click chime via Web Audio API
  const playSacredChime = (freq: number = 528) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // ignore
    }
  };

  // Toggle 432Hz Harmonic Tanpura / Omkar Drone
  const toggleOmkarDrone = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (isDroneActive) {
        if (droneNodesRef.current) {
          droneNodesRef.current.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          setTimeout(() => {
            droneNodesRef.current?.osc1.stop();
            droneNodesRef.current?.osc2.stop();
            droneNodesRef.current = null;
          }, 500);
        }
        setIsDroneActive(false);
      } else {
        const baseFreq = selectedMantra.frequency || 432;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime); // Fundamental

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime); // Fifth harmonic (Pa)

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        droneNodesRef.current = { osc1, osc2, gain };
        setIsDroneActive(true);
      }
    } catch (err) {
      console.error('Audio drone error', err);
    }
  };

  // Play Mantra with pure Sanskrit Vedic Speech Synthesis
  const playMantraChant = (mantra: MantraOption, remainingReps: number = 1) => {
    if (!('speechSynthesis' in window)) {
      setAudioNotice(language === 'hi' ? 'आपके ब्राउज़र में ऑडियो सिंथेसाइज़र समर्थित नहीं है।' : 'Speech synthesis not supported.');
      setTimeout(() => setAudioNotice(null), 4000);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);
    setCurrentChantLoop((prev) => (remainingReps === selectedRepetitions ? 1 : prev + 1));

    // Play initial bell chime
    playSacredChime(mantra.frequency);

    const utterance = new SpeechSynthesisUtterance(mantra.sanskritAudioText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.82; // Serene, meditative cadence
    utterance.pitch = 0.95; // Deep resonance

    // Try to find a high-quality Hindi/Indian voice if available
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onend = () => {
      if (remainingReps > 1) {
        chantLoopTimerRef.current = setTimeout(() => {
          playMantraChant(mantra, remainingReps - 1);
        }, 1200);
      } else {
        setIsPlayingAudio(false);
        setCurrentChantLoop(0);
      }
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setCurrentChantLoop(0);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (isPlayingAudio) {
      stopAllAudio();
    } else {
      playMantraChant(selectedMantra, selectedRepetitions);
    }
  };

  const incrementJapa = () => {
    playSacredChime(selectedMantra.frequency);
    if (japaCount + 1 === 108) {
      setJapaCount(0);
      setTotalMalas((prev) => prev + 1);
      try {
        confetti({ particleCount: 70, spread: 80 });
      } catch (e) {}
    } else {
      setJapaCount((prev) => prev + 1);
    }
  };

  const resetJapa = () => {
    setJapaCount(0);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            {language === 'hi' ? 'वैदिक शांति उपाय एवं 108 जप माला' : 'Vedic Remedies, Gemstones & 108 Japa Mala'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'hi' ? 'ग्रह शांति उपाय, रत्न परामर्श एवं मंत्र साधना' : 'Sacred Remedies, Gemstones & Mantra Sadhana'}
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            {language === 'hi'
              ? 'अशुभ ग्रहों की शांति, 108 गुरिया डिजिटल जप माला काउंटर, 432Hz वैदिक ध्वनि तरंगें, नौ ग्रहों के रत्न, रुद्राक्ष एवं वैदिक मंत्रों का प्रत्यक्ष अनुभव।'
              : 'Pacify afflicted planets through 108-bead Japa Mala counter, 432Hz harmonic sound generator, certified gemstones, and potent Vedic sound frequencies.'}
          </p>
        </div>
      </div>

      {/* Advanced Vedic Mantra Acoustic Player */}
      <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-400" />
              {language === 'hi' ? 'वैदिक मंत्र ऑडियो एवं 432Hz साधना प्लेयर' : 'Vedic Mantra Audio & 432Hz Acoustic Player'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'शुद्ध संस्कृत उच्चारण, मंदिर की घंटी ध्वनि और 432Hz तानपुरा तरंगों के साथ मंत्र श्रवण व जप करें।'
                : 'Listen to pure Sanskrit chants with acoustic temple bell chimes and 432Hz Tanpura harmonic resonance.'}
            </p>
          </div>

          {/* Mantra Selector */}
          <select
            value={selectedMantra.id}
            onChange={(e) => {
              stopAllAudio();
              const m = MANTRAS.find((x) => x.id === e.target.value);
              if (m) setSelectedMantra(m);
            }}
            className="bg-slate-950 border border-slate-700 text-amber-300 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 font-semibold"
          >
            {MANTRAS.map((m) => (
              <option key={m.id} value={m.id}>
                {language === 'hi' ? m.nameHindi : m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mantra Card & Audio Visualizer */}
        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 relative overflow-hidden shadow-inner text-center space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>🕉️</span>
              {language === 'hi'
                ? `इष्ट देव: ${selectedMantra.deityHindi}`
                : `Presiding Deity: ${selectedMantra.deity}`}
            </span>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
              Resonance: {selectedMantra.frequency} Hz
            </span>
          </div>

          {/* Sacred Sanskrit Shloka */}
          <div className="py-2">
            <p className="text-lg sm:text-xl font-extrabold text-amber-200 font-serif leading-relaxed tracking-wide">
              {selectedMantra.textHindi}
            </p>
            <p className="text-xs sm:text-sm text-slate-400 italic mt-2 max-w-2xl mx-auto">
              "{selectedMantra.textEnglish}"
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60 text-xs text-slate-300">
            <span className="text-amber-300 font-bold">
              {language === 'hi' ? '✨ आध्यात्मिक व भौतिक लाभ: ' : '✨ Spiritual Benefits: '}
            </span>
            {language === 'hi' ? selectedMantra.benefitsHindi : selectedMantra.benefits}
          </div>

          {/* Audio Player Controller Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {/* Chanting Repetitions Dropdown */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
              <span className="text-[11px] text-slate-400">{language === 'hi' ? 'जप संख्या:' : 'Chants:'}</span>
              <select
                disabled={isPlayingAudio}
                value={selectedRepetitions}
                onChange={(e) => setSelectedRepetitions(Number(e.target.value))}
                className="bg-transparent text-amber-300 text-xs font-bold focus:outline-none"
              >
                <option value={1}>1 {language === 'hi' ? 'बार' : 'time'}</option>
                <option value={3}>3 {language === 'hi' ? 'बार' : 'times'}</option>
                <option value={11}>11 {language === 'hi' ? 'बार' : 'times'}</option>
                <option value={21}>21 {language === 'hi' ? 'बार' : 'times'}</option>
                <option value={108}>108 {language === 'hi' ? 'बार (महा जप)' : 'times (Full Mala)'}</option>
              </select>
            </div>

            {/* Main Play / Stop Button */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                isPlayingAudio
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>
                    {language === 'hi'
                      ? `रोकें (जप ${currentChantLoop}/${selectedRepetitions})`
                      : `Stop (Chant ${currentChantLoop}/${selectedRepetitions})`}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{language === 'hi' ? 'मंत्र उच्चारण सुनें (Listen)' : 'Play Sacred Chant'}</span>
                </>
              )}
            </button>

            {/* 432Hz Omkar Drone Toggle */}
            <button
              type="button"
              onClick={toggleOmkarDrone}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isDroneActive
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle 432Hz Tanpura Drone"
            >
              <Radio className={`w-3.5 h-3.5 ${isDroneActive ? 'animate-spin' : ''}`} />
              <span>
                {language === 'hi'
                  ? isDroneActive
                    ? 'तानपुरा ॐ चालू'
                    : '432Hz ॐ तानपुरा'
                  : isDroneActive
                  ? '432Hz Om Drone Active'
                  : 'Play 432Hz Drone'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 108 Beads Interactive Japa Mala Counter */}
      <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <span>📿</span>
              {language === 'hi' ? 'डिजिटल 108 गुरिया जप माला' : 'Interactive 108-Bead Japa Mala Counter'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'स्क्रीन पर टैप करके जप करें। प्रत्येक गुरिया पर 528Hz दिव्य घंटी ध्वनि का अनुभव करें।'
                : 'Click or tap the sacred bead to count your mantra chants with 528Hz acoustic vibration.'}
            </p>
          </div>
        </div>

        {/* Japa Bead Interactive Controller */}
        <div className="flex flex-col items-center justify-center py-4">
          <button
            id="japa-mala-bead-btn"
            type="button"
            onClick={incrementJapa}
            className="group relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 p-1.5 shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all select-none cursor-pointer"
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center border-4 border-amber-500/40">
              <span className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">
                {japaCount}
              </span>
              <span className="text-[11px] text-slate-400 uppercase font-bold mt-1">
                / 108 {language === 'hi' ? 'गुरिया' : 'Beads'}
              </span>
              <span className="text-[10px] text-amber-400/80 font-medium mt-1 group-hover:text-amber-300">
                {language === 'hi' ? 'जप हेतु दबाएं' : 'TAP TO CHANT'}
              </span>
            </div>
          </button>

          {/* Progress Bar & Mala Count */}
          <div className="w-full max-w-xs mt-6 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{language === 'hi' ? 'वर्तमान माला प्रगति:' : 'Mala Progress:'}</span>
              <span className="font-mono text-amber-300 font-bold">{Math.round((japaCount / 108) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2 rounded-full transition-all duration-150"
                style={{ width: `${(japaCount / 108) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-300 font-bold">
                {language === 'hi' ? 'पूर्ण की गई मालाएं:' : 'Completed Malas:'}{' '}
                <span className="text-amber-400 text-sm font-black">{totalMalas}</span>
              </span>

              <button
                type="button"
                onClick={resetJapa}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                {language === 'hi' ? 'रीसेट' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navagraha Gemstone Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-base font-bold text-amber-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          {language === 'hi' ? 'नवग्रह रत्न एवं धारण विधि' : 'Navagraha Certified Gemstones & Wearing Guide'}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {language === 'hi'
            ? 'कुंडली में जो ग्रह कारक और शुभ हैं, उनका रत्न धारण करके उनके शुभ प्रभाव में अपार वृद्धि की जाती है।'
            : 'Gemstones amplify benefic planetary rays. Only wear stones for functional Yogakaraka planets.'}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{language === 'hi' ? 'ग्रह' : 'Planet'}</th>
                <th className="py-2.5 px-3">{language === 'hi' ? 'रत्न' : 'Gemstone'}</th>
                <th className="py-2.5 px-3">{language === 'hi' ? 'धातु' : 'Metal'}</th>
                <th className="py-2.5 px-3">{language === 'hi' ? 'अंगुली' : 'Finger'}</th>
                <th className="py-2.5 px-3">{language === 'hi' ? 'शुभ प्रभाव व लाभ' : 'Benefic Domains'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {GEMSTONES.map((gem) => (
                <tr key={gem.planet} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-amber-300">
                    {language === 'hi' ? gem.planetHi : gem.planet}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white">
                    {language === 'hi' ? gem.stoneHi : gem.stone}
                  </td>
                  <td className="py-2.5 px-3">
                    {language === 'hi' ? gem.metalHi : gem.metal}
                  </td>
                  <td className="py-2.5 px-3">
                    {language === 'hi' ? gem.fingerHi : gem.finger}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {language === 'hi' ? gem.benefitsHi : gem.benefits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
