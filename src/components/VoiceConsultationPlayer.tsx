import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Headphones,
} from 'lucide-react';
import { Language } from '../types/astrology';

interface VoiceConsultationPlayerProps {
  textToSpeak: string;
  language: Language;
  title?: string;
  compact?: boolean;
}

export const VoiceConsultationPlayer: React.FC<VoiceConsultationPlayerProps> = ({
  textToSpeak,
  language,
  title,
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setHasSpeechSupport(false);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanTextForSpeech = (raw: string) => {
    return raw
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleTogglePlay = () => {
    if (!hasSpeechSupport) return;
    const synth = window.speechSynthesis;

    if (isPlaying && !isPaused) {
      synth.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      synth.resume();
      setIsPaused(false);
      return;
    }

    synth.cancel();

    const cleaned = cleanTextForSpeech(textToSpeak);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utteranceRef.current = utterance;

    const voices = synth.getVoices();
    const hindiVoice = voices.find(
      (v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.lang === 'hi-IN'
    );
    const indianVoice = voices.find((v) => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'));

    if (language === 'hi' && hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else if (indianVoice) {
      utterance.voice = indianVoice;
      utterance.lang = 'en-IN';
    }

    utterance.rate = speed;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    synth.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleCycleSpeed = () => {
    const nextSpeed = speed === 1 ? 1.15 : speed === 1.15 ? 0.85 : 1;
    setSpeed(nextSpeed);
    if (isPlaying && utteranceRef.current) {
      handleStop();
      setTimeout(handleTogglePlay, 100);
    }
  };

  if (!hasSpeechSupport) return null;

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl px-2.5 py-1 text-xs">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200 cursor-pointer"
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'रोकें' : 'Pause'}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? '🔊 आवाज सुनें' : '🔊 Listen Voice'}</span>
            </>
          )}
        </button>

        {isPlaying && (
          <div className="flex items-center gap-0.5 ml-1">
            <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
            <span className="w-1 h-4 bg-amber-300 animate-bounce rounded-full" />
            <span className="w-1 h-2 bg-amber-500 animate-pulse rounded-full" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-bold shadow-md">
          <Headphones className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-white">
              {title || (language === 'hi' ? 'वैदिक AI ध्वनि परामर्श (Voice Audio)' : 'Vedic AI Voice Audio Guidance')}
            </h4>
            {isPlaying && (
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.2 rounded-full animate-pulse">
                SPEAKING
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {language === 'hi'
              ? 'आचार्य एस्ट्रोदोस्त AI द्वारा उच्चारित स्पष्ट हिंदी वाणी में सुनें।'
              : 'Listen to the astrological forecast in clear natural voice.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {isPlaying && !isPaused && (
          <div className="flex items-center gap-0.5 px-2">
            <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
            <span className="w-1 h-5 bg-amber-300 animate-bounce rounded-full" />
            <span className="w-1 h-4 bg-emerald-400 animate-pulse rounded-full" />
            <span className="w-1 h-6 bg-amber-200 animate-bounce rounded-full" />
            <span className="w-1 h-3 bg-teal-400 animate-pulse rounded-full" />
          </div>
        )}

        <button
          type="button"
          onClick={handleCycleSpeed}
          className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold cursor-pointer"
          title="Speed"
        >
          {speed}x
        </button>

        <button
          type="button"
          onClick={handleTogglePlay}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'रोकें' : 'Pause'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? (language === 'hi' ? 'जारी रखें' : 'Resume') : (language === 'hi' ? '🔊 बोलकर सुनाएं' : '🔊 Listen')}</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
            title="Stop"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
