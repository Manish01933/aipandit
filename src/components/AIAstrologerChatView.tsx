import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language, BirthDetails } from '../types/astrology';
import { generateKundali } from '../utils/vedicCalculations';
import { generateDynamicAstrologyResponse } from '../utils/astrologyAdvisor';
import {
  BirthProfileRecord,
  getSavedProfiles,
  getActiveProfile,
  setActiveProfile,
  saveOrUpdateProfile,
  deleteProfile,
  buildCompleteAstrologyContext,
} from '../utils/birthProfileManager';
import { VedicDateTimePicker } from './VedicDateTimePicker';
import { GoogleMapsPlacePicker } from './GoogleMapsPlacePicker';
import { MarkdownChatRenderer, stripMarkdownForSpeech } from './MarkdownChatRenderer';
import {
  getPresetQuestions,
  getClientProfileStatus,
  consumeClientQuestionCredit,
  getOrCreateUserId,
  ProfileStatusResult,
  DEFAULT_PRESET_QUESTIONS,
} from '../utils/entitlementManager';
import { PresetQuestion } from '../types/commerce';
import { getStoredAccessState, getAdminAuthHeaders } from '../utils/accessManager';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  User,
  RotateCcw,
  PlusCircle,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  ChevronDown,
  Layers,
  ArrowRightLeft,
  RefreshCw,
  Crown,
  Lock,
  Unlock,
  HelpCircle,
  Check,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface AIAstrologerChatViewProps {
  language: Language;
  setLanguage?: (lang: Language) => void;
}

export const AIAstrologerChatView: React.FC<AIAstrologerChatViewProps> = ({ language, setLanguage }) => {
  const getWelcomeMessage = (lang: Language, kundaliName?: string, lagna?: string, moon?: string): ChatMessage => ({
    id: 'welcome',
    sender: 'assistant',
    text:
      lang === 'hi'
        ? kundaliName
          ? `🙏 **प्रणाम एवं सप्रेम शुभाशीर्वाद, ${kundaliName} जी!**\n\nमैं **"आचार्य एस्ट्रोदोस्त"** हूँ, आपका व्यक्तिगत वैदिक AI ज्योतिषी। आपकी **${lagna || ''} लग्न व ${moon || ''} राशि** कुंडली सक्रिय है। आप मुझसे अपने करियर, पदोन्नति, सरकारी नौकरी, विवाह योग, दांपत्य जीवन, धन लाभ, वर्तमान महादशा, साढ़ेसाती अथवा शुभ रत्न व सटीक वैदिक उपायों के बारे में पूछ सकते हैं।\n\nबताइए, आज आप किस विषय में ग्रह मार्गदर्शन चाहते हैं?`
          : `🙏 **प्रणाम एवं सप्रेम शुभाशीर्वाद!**\n\nमैं **"आचार्य एस्ट्रोदोस्त"** हूँ, आपका वैदिक AI ज्योतिषी।\n\n*(वर्तमान में कोई पूर्व जन्म विवरण लिंक नहीं है — सामान्य वैदिक परामर्श सक्रिय है। यदि आप अपने व्यक्तिगत ग्रह-दशा अनुसार सटीक समय जानना चाहते हैं, तो ऊपर **"अपनी जन्म जानकारी जोड़ें"** बटन से अपना विवरण दर्ज कर सकते हैं।)*\n\nबताइए, आज आप किस विषय में ग्रह मार्गदर्शन चाहते हैं?`
        : kundaliName
        ? `🙏 **Namaste & Divine Cosmic Blessings, ${kundaliName}!**\n\nI am **"Acharya AstroDost"**, your Vedic AI Astrologer. Your **${lagna || ''} Ascendant & ${moon || ''} Moon** birth chart is active. You may ask about your career, promotions, marriage timing, wealth yogas, Mahadasha cycles, Saturn Sade Sati, or auspicious gemstones.\n\nHow may the stars illuminate your path today?`
        : `🙏 **Namaste & Divine Cosmic Blessings!**\n\nI am **"Acharya AstroDost"**, your Vedic AI Astrologer.\n\n*(No previous birth details are linked — General Vedic Consultation is active. For personalized timing, you can click **"Link My Birth Details"** above at any time.)*\n\nWhat guidance do the stars hold for you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedQuestions: [
      lang === 'hi' ? 'मेरी कुंडली में सरकारी नौकरी या प्रमोशन के क्या योग हैं?' : 'When will I get a government or executive promotion?',
      lang === 'hi' ? 'मेरे विवाह और जीवनसाथी के क्या लक्षण होंगे?' : 'When is the auspicious time for my marriage and spouse traits?',
      lang === 'hi' ? 'शनि साढ़ेसाती और ढैया के सरल व अचूक उपाय बताएं' : 'What are the best Vedic remedies for Saturn Sade Sati?',
      lang === 'hi' ? 'मेरे लिए कौन सा भाग्यशाली रत्न और रुद्राक्ष शुभ है?' : 'Which gemstone and Rudraksha suit my destiny best?',
    ],
  });

  // Profile Management State
  const [savedProfiles, setSavedProfiles] = useState<BirthProfileRecord[]>([]);
  const [activeProfileState, setActiveProfileState] = useState<BirthProfileRecord | null>(null);
  const [savedKundali, setSavedKundali] = useState<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [getWelcomeMessage(language)]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [modelStatus, setModelStatus] = useState<{
    hasGemini: boolean;
    hasOpenRouter: boolean;
    hasOmniRouter?: boolean;
    isComboActive?: boolean;
    comboStatus?: string;
    models: Array<{
      id: string;
      name: string;
      provider: string;
      badge: string;
      isConfigured?: boolean;
      description?: string;
    }>;
  } | null>(null);

  // Entitlement & Preset Questions State (Phase 1 & 2 Requirements)
  const [presetQuestions, setPresetQuestions] = useState<PresetQuestion[]>(DEFAULT_PRESET_QUESTIONS);
  const [profileStatus, setProfileStatus] = useState<ProfileStatusResult | null>(null);
  const [creditFeedback, setCreditFeedback] = useState<string | null>(null);
  const [isQuestionsExpanded, setIsQuestionsExpanded] = useState<boolean>(true);

  // Fetch AI models status on mount
  useEffect(() => {
    fetch('/api/ai/models')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.models) {
          setModelStatus(data);
          // Preserve 'auto' as default for seamless Gemini + OpenRouter failover combo
        }
      })
      .catch((err) => console.warn('Could not fetch AI models:', err));
  }, []);

  const refreshEntitlements = async (profileId?: string) => {
    try {
      const [qs, status] = await Promise.all([
        getPresetQuestions(),
        getClientProfileStatus(profileId),
      ]);
      setPresetQuestions(qs);
      setProfileStatus(status);
    } catch {
      // fallback
    }
  };

  // Profile Form state for adding/updating user details
  const [profileForm, setProfileForm] = useState<BirthDetails>({
    name: '',
    gender: 'male',
    dob: '1998-01-01',
    tob: '12:00',
    place: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 5.5,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial load of profiles and synchronization
  const refreshProfilesList = () => {
    const list = getSavedProfiles();
    setSavedProfiles(list);
    const active = getActiveProfile();
    setActiveProfileState(active);
    if (active && active.chartData) {
      setSavedKundali(active.chartData);
      setProfileForm({
        name: active.full_name,
        gender: active.chartData.birthDetails?.gender || 'male',
        dob: active.date_of_birth,
        tob: active.exact_time_of_birth,
        place: active.birthplace,
        latitude: active.latitude,
        longitude: active.longitude,
        timezone: active.timezone,
      });
      refreshEntitlements(active.profile_id);
    } else {
      setSavedKundali(null);
      refreshEntitlements(undefined);
    }
  };

  useEffect(() => {
    refreshProfilesList();

    const handleCustomUpdate = () => {
      refreshProfilesList();
    };

    window.addEventListener('astrodost_kundali_updated', handleCustomUpdate);
    window.addEventListener('astrodost_access_updated', handleCustomUpdate);
    return () => {
      window.removeEventListener('astrodost_kundali_updated', handleCustomUpdate);
      window.removeEventListener('astrodost_access_updated', handleCustomUpdate);
    };
  }, []);

  // Update initial welcome message when active profile or language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.id === 'welcome') {
        return [
          getWelcomeMessage(
            language,
            activeProfileState?.full_name || savedKundali?.birthDetails?.name,
            activeProfileState?.chartData?.ascendantSign || savedKundali?.ascendantSign,
            activeProfileState?.chartData?.moonSign || savedKundali?.moonSign
          ),
        ];
      }
      return prev;
    });
  }, [language, activeProfileState, savedKundali]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      // Ensure webapp page auto-scrolls down to the newly added AI Jyotish response so user sees it immediately
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        const targetElement = (lastMsg ? document.getElementById(`msg-${lastMsg.id}`) : null) || messagesEndRef.current;
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          if (rect.bottom > window.innerHeight || rect.top < 80) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 150);
    }
  }, [messages, isLoading]);

  // Profile Switcher Handler
  const handleSelectActiveProfile = (profileId: string) => {
    const target = setActiveProfile(profileId);
    if (!target) return;

    setActiveProfileState(target);
    setSavedKundali(target.chartData);
    setShowProfileSwitcher(false);

    setProfileForm({
      name: target.full_name,
      gender: target.chartData.birthDetails?.gender || 'male',
      dob: target.date_of_birth,
      tob: target.exact_time_of_birth,
      place: target.birthplace,
      latitude: target.latitude,
      longitude: target.longitude,
      timezone: target.timezone,
    });

    refreshEntitlements(target.profile_id);

    // Notify user in chat about active chart change
    const switchNoticeMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'assistant',
      text:
        language === 'hi'
          ? `🔄 **सक्रिय जन्म कुंडली बदली गई:** **${target.full_name}** (${target.chartData.ascendantSign} लग्न, ${target.chartData.moonSign} चंद्र राशि, ${target.chartData.birthNakshatra} नक्षत्र)।\n\nअब आपके सभी प्रश्नों का ज्योतिषीय उत्तर **${target.full_name} जी की इस सत्यापित कुंडली** के अनुसार प्रदान किया जाएगा।`
          : `🔄 **Active Birth Chart Switched:** **${target.full_name}** (${target.chartData.ascendantSign} Ascendant, ${target.chartData.moonSign} Moon, ${target.chartData.birthNakshatra} Nakshatra).\n\nAll subsequent questions will now be answered according to **${target.full_name}'s verified chart**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, switchNoticeMsg]);
  };

  const handleOpenNewProfileModal = () => {
    setEditingProfileId(null);
    setProfileForm({
      name: '',
      gender: 'male',
      dob: '1998-01-01',
      tob: '12:00',
      place: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.209,
      timezone: 5.5,
    });
    setShowProfileModal(true);
    setShowProfileSwitcher(false);
  };

  const handleOpenEditCurrentProfile = () => {
    if (activeProfileState) {
      setEditingProfileId(activeProfileState.profile_id);
      setProfileForm({
        name: activeProfileState.full_name,
        gender: activeProfileState.chartData.birthDetails?.gender || 'male',
        dob: activeProfileState.date_of_birth,
        tob: activeProfileState.exact_time_of_birth,
        place: activeProfileState.birthplace,
        latitude: activeProfileState.latitude,
        longitude: activeProfileState.longitude,
        timezone: activeProfileState.timezone,
      });
    }
    setShowProfileModal(true);
    setShowProfileSwitcher(false);
  };

  const handleDeleteProfileItem = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProfile(profileId);
    refreshProfilesList();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;

    const { profile, chart } = saveOrUpdateProfile({
      profile_id: editingProfileId || undefined,
      birthDetails: profileForm,
    });

    refreshProfilesList();
    setShowProfileModal(false);

    try {
      window.dispatchEvent(new CustomEvent('astrodost_kundali_updated', { detail: chart }));
      window.dispatchEvent(new CustomEvent('astrodost_profile_changed', { detail: profile }));
      window.dispatchEvent(new CustomEvent('astrodost_profiles_changed'));
    } catch {
      // ignore
    }

    // Notify user in chat
    const saveNotice: ChatMessage = {
      id: Date.now().toString(),
      sender: 'assistant',
      text:
        language === 'hi'
          ? `✅ **जन्म कुंडली सफलतापूर्वक सहेजी व लिंक की गई:** **${profile.full_name}** (${chart.ascendantSign} लग्न, ${chart.moonSign} राशि)। आप अपनी कुंडली अनुसार सीधा प्रश्न पूछ सकते हैं।`
          : `✅ **Birth Chart Successfully Saved & Linked:** **${profile.full_name}** (${chart.ascendantSign} Ascendant, ${chart.moonSign} Moon). You can now ask chart-specific questions directly.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, saveNotice]);
  };

  const handleAskPresetQuestion = async (q: PresetQuestion) => {
    const questionText = language === 'hi' ? q.questionHi : q.questionEn || q.questionHi;

    const access = getStoredAccessState();
    const adminTok = typeof window !== 'undefined' ? localStorage.getItem('astrodost_admin_token') : null;
    const isAdmin = access.isAdminUnlocked || access.isVipUnlocked || adminTok === 'manishastrodostai@111' || Boolean(adminTok);

    // Check if user has active plan (VIP or profile plan)
    if (!isAdmin && !profileStatus?.isVip && !profileStatus?.hasProfilePlan) {
      window.dispatchEvent(
        new CustomEvent('astrodost_open_paywall', { detail: { moduleId: 'plan_kundli_explorer' } })
      );
      return;
    }

    if (!isAdmin && !profileStatus?.isVip) {
      const credits = profileStatus?.questionCreditsRemaining ?? 0;
      if (credits <= 0) {
        setCreditFeedback(
          language === 'hi'
            ? '⚠️ इस जन्म कुंडली के सभी 5 प्रश्न क्रेडिट उपयोग हो चुके हैं। असीमित चैट के लिए VIP में अपग्रेड करें।'
            : '⚠️ All 5 question credits consumed for this chart. Upgrade to VIP for unlimited chat.'
        );
        setTimeout(() => setCreditFeedback(null), 5000);
        window.dispatchEvent(
          new CustomEvent('astrodost_open_paywall', { detail: { moduleId: 'plan_astrodost_vip' } })
        );
        return;
      }
    }

    // Now send question directly
    handleSend(questionText);
  };

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const access = getStoredAccessState();
    const adminTok = typeof window !== 'undefined' ? localStorage.getItem('astrodost_admin_token') : null;
    const isAdmin = access.isAdminUnlocked || access.isVipUnlocked || adminTok === 'manishastrodostai@111' || Boolean(adminTok);

    // If text was typed by user in free-text input (not a preset question), verify free-text privilege
    if (!isAdmin && !userText && !profileStatus?.canFreeTextChat) {
      window.dispatchEvent(
        new CustomEvent('astrodost_open_paywall', {
          detail: {
            moduleId: profileStatus?.hasProfilePlan ? 'plan_astrodost_vip' : 'plan_kundli_explorer',
          },
        })
      );
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build clean conversation history
      const history = updatedMessages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

      // Generate complete astrological chart context
      const fullContext = buildCompleteAstrologyContext(activeProfileState || savedKundali);

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
        body: JSON.stringify({
          message: textToSend,
          language,
          conversationHistory: history,
          kundaliContext: fullContext || undefined,
          profile_id: activeProfileState?.profile_id,
          chart_id: activeProfileState?.chart_id,
          chart_version: activeProfileState?.chart_version,
          selectedModel,
          userId: getOrCreateUserId(),
          isPresetQuestion: Boolean(userText),
          isAdmin,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.remainingCredits !== undefined) {
          setProfileStatus((prev) =>
            prev ? { ...prev, questionCreditsRemaining: data.remainingCredits } : null
          );
        }
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text:
            data.reply ||
            (language === 'hi'
              ? 'ग्रहों की शुभ दृष्टि आप पर बनी रहे। ॐ शांति।'
              : 'May the stars illuminate your path. Om Shanti.'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedQuestions: data.suggestedQuestions,
          modelUsed: data.source,
          isLiveAI: data.isLiveAI,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errData = await res.json().catch(() => null);
        if (res.status === 403 || res.status === 429) {
          const errMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: `⚠️ **${errData?.error || (language === 'hi' ? 'प्लान सीमा अथवा प्रतिबंध' : 'Plan Limit Restrained')}**\n\n${
              language === 'hi'
                ? 'कृपया आगे परामर्श जारी रखने हेतु अपनी योजना अपग्रेड करें।'
                : 'Please upgrade your plan to continue consulting the AI Jyotishi.'
            }`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, errMsg]);
          window.dispatchEvent(
            new CustomEvent('astrodost_open_paywall', {
              detail: {
                moduleId: profileStatus?.hasProfilePlan ? 'plan_astrodost_vip' : 'plan_kundli_explorer',
              },
            })
          );
          setIsLoading(false);
          return;
        }

        // Instant dynamic astrological fallback
        const fallback = generateDynamicAstrologyResponse(
          textToSend,
          language,
          fullContext || undefined,
          history
        );
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: fallback.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedQuestions: fallback.suggestedQuestions,
          modelUsed: 'local-vedic-engine',
          isLiveAI: false,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.warn('Network issue in AI Astrologer Chat, using local Vedic intelligence engine:', err);
      const fullContext = buildCompleteAstrologyContext(activeProfileState || savedKundali);
      const fallback = generateDynamicAstrologyResponse(
        textToSend,
        language,
        fullContext || undefined,
        []
      );
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: fallback.suggestedQuestions,
        modelUsed: 'local-vedic-engine',
        isLiveAI: false,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = stripMarkdownForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleRetryLast = () => {
    if (isLoading) return;
    const lastUser = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUser && lastUser.text) {
      handleSend(lastUser.text);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setCreditFeedback(
        language === 'hi'
          ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।'
          : 'Voice input is not supported in this browser.'
      );
      setTimeout(() => setCreditFeedback(null), 4000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setInput(speechResult);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleClearChat = () => {
    setMessages([
      getWelcomeMessage(
        language,
        activeProfileState?.full_name,
        activeProfileState?.chartData?.ascendantSign,
        activeProfileState?.chartData?.moonSign
      ),
    ]);
  };

  const switchLanguage = (newLang: Language) => {
    if (setLanguage) {
      setLanguage(newLang);
    }
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          getWelcomeMessage(
            newLang,
            activeProfileState?.full_name,
            activeProfileState?.chartData?.ascendantSign,
            activeProfileState?.chartData?.moonSign
          ),
        ];
      }
      return prev;
    });
  };

  const hasActiveProfile = Boolean(activeProfileState && activeProfileState.full_name);

  return (
    <div className="space-y-4">
      {/* Top Banner & Language Controls */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative p-[2px] rounded-2xl overflow-hidden shadow-xl shadow-emerald-500/20 shrink-0">
            <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#10b981,#34d399,#ffffff,#10b981)] animate-spin-slow opacity-90" />
            <div className="relative z-10 w-12 h-12 bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl border border-emerald-400/40">
              🧘‍♂️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-emerald-300 tracking-tight">
                {language === 'hi' ? 'आचार्य एस्ट्रोदोस्त AI ज्योतिषी' : 'Acharya AstroDost AI Jyotish Guru'}
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-300">
              {language === 'hi'
                ? 'वैदिक ज्योतिष, विंशोत्तरी दशा, रत्न एवं अचूक उपाय विशेषज्ञ • Cohere North Mini & Gemini'
                : 'Master Vedic Astrologer powered by Cohere North Mini & Gemini AI'}
            </p>
          </div>
        </div>

        {/* Right Controls: In-Chat Language Selector & Reset Chat */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Direct Language Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => switchLanguage('hi')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'hi'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇮🇳</span>
              <span>हिंदी</span>
            </button>
            <button
              type="button"
              onClick={() => switchLanguage('en')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌐</span>
              <span>English</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors"
            title="Reset Chat Messages"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'hi' ? 'नई चर्चा' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Model Selector - Simplified Auto Mode Default with Advanced Settings Toggle */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 px-4 shadow-md space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          {/* Main Primary Selector - Friendly Names */}
          <div className="flex items-center gap-2.5 text-xs flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'AI ज्योतिषी इंजन:' : 'AI Engine:'}</span>
            </span>

            {/* Default Friendly Label */}
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-3 py-1 rounded-lg font-medium text-xs shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold">
                {selectedModel === 'auto'
                  ? (language === 'hi' ? '⚡ एस्ट्रोदोस्त ऑटो इंजन (अनुशंसित)' : '⚡ AstroDost Auto Engine (Recommended)')
                  : selectedModel === 'cohere/north-mini-code:free'
                  ? '⭐ Cohere Vedic Engine'
                  : selectedModel === 'deepseek/deepseek-chat'
                  ? '🔮 DeepSeek Reasoning'
                  : selectedModel === 'gemini-2.5-flash'
                  ? '✨ Gemini Flash'
                  : '⚡ Gemini Lite'}
              </span>
            </div>

            {/* Advanced Settings Toggle Button */}
            <button
              type="button"
              onClick={() => setShowProfileSwitcher((prev) => !prev)} // toggle model menu
              className="text-[11px] text-amber-300 hover:text-amber-200 bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/40 hover:border-amber-400 flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>⚙️ {language === 'hi' ? 'उन्नत मॉडल सेटिंग्स' : 'Advanced Settings'}</span>
            </button>
          </div>

          {/* Connection Status Badge */}
          <div className="flex items-center gap-2 text-[11px] self-end sm:self-auto">
            {modelStatus?.isComboActive ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-300 bg-emerald-950/90 px-2.5 py-1 rounded-lg border border-emerald-600/60 font-medium text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'लाइव AI कनेक्शन सक्रिय' : 'Live AI Connected'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-600/50 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'वैदिक ज्ञान इंजन तैयार' : 'Vedic Intelligence Ready'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Advanced Model Picker Drawer (Expands only when user opens Advanced Settings) */}
        {showProfileSwitcher && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs animate-fadeIn">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              {language === 'hi' ? 'तकनीकी मॉडल चुनें:' : 'Select Specific Model:'}
            </span>
            <button
              type="button"
              onClick={() => { setSelectedModel('auto'); setShowProfileSwitcher(false); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                selectedModel === 'auto'
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ⚡ Auto (Omni Combo)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedModel('cohere/north-mini-code:free'); setShowProfileSwitcher(false); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                selectedModel === 'cohere/north-mini-code:free'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ⭐ Cohere
            </button>
            <button
              type="button"
              onClick={() => { setSelectedModel('deepseek/deepseek-chat'); setShowProfileSwitcher(false); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                selectedModel === 'deepseek/deepseek-chat'
                  ? 'bg-purple-600/30 text-purple-200 border-purple-500 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              🔮 DeepSeek
            </button>
            <button
              type="button"
              onClick={() => { setSelectedModel('gemini-2.5-flash'); setShowProfileSwitcher(false); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                selectedModel === 'gemini-2.5-flash'
                  ? 'bg-blue-600/30 text-blue-200 border-blue-500 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ✨ Gemini 2.5
            </button>
          </div>
        )}
      </div>

      {/* Birth Profile Onboarding & Active Kundali Status Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md relative">
        <div className="flex items-center gap-2.5 text-xs text-slate-300 flex-1">
          {hasActiveProfile ? (
            <>
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="leading-snug">
                <span className="font-semibold text-amber-300">
                  {language === 'hi' ? '✔️ जन्म विवरण कनेक्टेड:' : '✔️ Birth Profile Connected:'}{' '}
                </span>
                <span className="text-white font-bold">{activeProfileState?.full_name}</span>
                <span className="text-slate-300 ml-1.5 font-devanagari">
                  ({activeProfileState?.chartData.ascendantSign} लग्न, {activeProfileState?.chartData.moonSign} चंद्र राशि, {activeProfileState?.chartData.birthNakshatra} नक्षत्र)
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-amber-300 bg-amber-950/30 border border-amber-500/30 px-3 py-2 rounded-xl w-full">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span className="font-semibold text-xs sm:text-sm text-amber-200">
                {language === 'hi'
                  ? '✨ अपनी जन्म कुंडली लिंक करें — ग्रह-दशा अनुसार पाएँ 100% सटीक व्यक्तिगत भविष्यवाणी'
                  : '✨ Link Your Birth Details — Get 100% Personalized Vedic Insights & Dasha Timeline'}
              </span>
            </div>
          )}
        </div>

        {/* Profile Switcher Controls */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          {/* Saved Profiles Dropdown Selector */}
          {savedProfiles.length > 1 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                className="text-[11px] text-emerald-300 hover:text-emerald-200 bg-slate-950 px-3 py-1.5 rounded-lg border border-emerald-500/40 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
                <span>
                  {language === 'hi' ? 'कुंडली बदलें' : 'Switch Profile'} ({savedProfiles.length})
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showProfileSwitcher && (
                <div className="absolute right-0 top-full mt-1.5 w-72 bg-slate-950 border border-emerald-500/40 rounded-xl shadow-2xl z-40 p-2 space-y-1">
                  <div className="text-[10px] text-slate-400 px-2 py-1 uppercase font-bold border-b border-slate-800">
                    {language === 'hi' ? 'सहेजी गई जन्म कुंडलियां' : 'Saved Birth Profiles'}
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {savedProfiles.map((p) => {
                      const isActive = p.profile_id === activeProfileState?.profile_id;
                      return (
                        <div
                          key={p.profile_id}
                          onClick={() => handleSelectActiveProfile(p.profile_id)}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                            isActive
                              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
                              : 'hover:bg-slate-900 text-slate-300'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="font-bold flex items-center gap-1.5 truncate">
                              <span>👤</span>
                              <span>{p.full_name}</span>
                              {isActive && (
                                <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-1.5 rounded-full">
                                  {language === 'hi' ? 'सक्रिय' : 'Active'}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {p.chartData.ascendantSign} लग्न • {p.chartData.moonSign} राशि
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProfileItem(p.profile_id, e)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasActiveProfile ? (
            <>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('astrodost_navigate_tab', { detail: 'free-kundali' }));
                }}
                className="text-[11px] text-amber-300 hover:text-white bg-slate-950 px-2.5 py-1.5 rounded-lg border border-amber-500/50 flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                title={language === 'hi' ? 'सक्रिय कुंडली चक्र व संपूर्ण बायोडाटा देखें' : 'View Kundali Chart & Bio-Data'}
              >
                <span>📜</span>
                <span>{language === 'hi' ? 'कुंडली देखें' : 'View Chart'}</span>
              </button>
              <button
                type="button"
                onClick={handleOpenEditCurrentProfile}
                className="text-[11px] text-amber-400 hover:text-amber-300 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-1 transition-all"
              >
                <Edit3 className="w-3 h-3" />
                {language === 'hi' ? 'विवरण सुधारें' : 'Edit'}
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={handleOpenNewProfileModal}
            className="text-[11px] text-slate-200 hover:text-white bg-emerald-700/80 hover:bg-emerald-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-900/40"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
            {hasActiveProfile
              ? language === 'hi'
                ? '+ नई कुंडली'
                : '+ New Profile'
              : language === 'hi'
              ? 'अपनी जन्म जानकारी जोड़ें'
              : 'Link Birth Details'}
          </button>
        </div>
      </div>

      {/* 3-TIER PLAN & ENTITLEMENT STATUS BAR */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5 text-xs">
          {profileStatus?.isVip ? (
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow">
                👑
              </span>
              <div>
                <span className="text-sm">
                  {language === 'hi'
                    ? 'एस्ट्रोदोस्त VIP (₹999) • 120 मिनट (2 घंटे) AI परामर्श'
                    : 'AstroDost VIP (₹999) • 120 Min (2 Hrs) AI Consultation'}
                </span>
                <span className="text-[10px] text-emerald-400 block font-normal">
                  {language === 'hi'
                    ? '✓ 120 मिनट AI परामर्श (सत्र विभाजन) • असीमित व्यक्तिगत चैट • 2 मासिक PDF रिपोर्ट'
                    : '✓ 120 Min AI Consultation (Session Split) • Unrestricted Chat • 2 Monthly PDF Reports'}
                </span>
              </div>
            </div>
          ) : profileStatus?.hasProfilePlan ? (
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <span className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow">
                ⏱️
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{profileStatus.planName || 'कुंडली एक्सप्लोरर (15 मिनट)'}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full font-mono font-bold">
                    {profileStatus.questionCreditsRemaining} / 5 {language === 'hi' ? 'प्रश्न शेष' : 'Questions Left'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block font-normal">
                  {language === 'hi'
                    ? 'लाइव AI परामर्श सक्रिय • नीचे दिए गए 5 पूर्व-निर्धारित प्रश्नों में से चुनें'
                    : 'Live AI consultation active • Choose from 5 preset questions below'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-300 text-xs">
              <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                🔒
              </span>
              <div>
                <span className="font-bold text-slate-200">
                  {language === 'hi' ? 'AI परामर्श हेतु समय आवंटन पैक चुनें' : 'Select Consultation Time Plan'}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {language === 'hi'
                    ? '₹299 में 15 मिनट • ₹499 में 35 मिनट • ₹999 में 120 मिनट (2 घंटे)'
                    : '₹299 for 15 min • ₹499 for 35 min • ₹999 for 120 min (2 hours)'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {creditFeedback && (
            <span className="text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg animate-pulse font-medium">
              {creditFeedback}
            </span>
          )}
          {!profileStatus?.isVip && (
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('astrodost_open_paywall', {
                    detail: { moduleId: profileStatus?.hasProfilePlan ? 'plan_astrodost_vip' : 'plan_kundli_explorer' },
                  })
                );
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>
                {profileStatus?.hasProfilePlan
                  ? language === 'hi'
                    ? 'VIP में अपग्रेड (₹999)'
                    : 'Upgrade to VIP'
                  : language === 'hi'
                  ? 'प्लान अनलॉक करें'
                  : 'Unlock Plan'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px] sm:h-[680px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                id={`msg-${msg.id}`}
                className={`flex gap-3 max-w-[90%] sm:max-w-[85%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-md ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-emerald-900/60 border border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : '🧘‍♂️'}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1.5 flex-1 max-w-full">
                  <div
                    className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-lg ${
                      isUser
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-tr-none font-sans whitespace-pre-wrap'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none font-devanagari'
                    }`}
                  >
                    {isUser ? (
                      <div>{msg.text}</div>
                    ) : (
                      <MarkdownChatRenderer content={msg.text} />
                    )}
                  </div>

                  {/* Message Meta & Action Bar */}
                  <div
                    className={`flex flex-wrap items-center gap-2 text-[10px] text-slate-400 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <>
                        {msg.modelUsed && (
                          <>
                            <span>•</span>
                            <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                              {msg.isLiveAI ? '⚡ लाइव AI उत्तर' : '📖 वैदिक गणना'}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.text)}
                          className="hover:text-amber-400 flex items-center gap-1 transition-colors"
                          title="Read aloud"
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-3 h-3 text-rose-400" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                          <span>{isSpeaking ? 'रुकें' : 'सुनें'}</span>
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={handleRetryLast}
                          disabled={isLoading}
                          className="hover:text-amber-400 flex items-center gap-1 transition-colors disabled:opacity-40"
                          title={language === 'hi' ? 'पुनः प्रयास करें' : 'Retry response'}
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{language === 'hi' ? 'दोबारा पूछें' : 'Retry'}</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Suggested Follow-up Questions (Only on latest assistant message) */}
                  {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(q)}
                          className="text-[11px] bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 px-3 py-1.5 rounded-full transition-all text-left shadow-sm font-devanagari"
                        >
                          ✨ {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-sm shadow-md">
                🧘‍♂️
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 px-4 flex items-center gap-2 text-xs text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>
                  {language === 'hi'
                    ? 'आचार्य जी आपकी कुंडली व ग्रह गोचर का विश्लेषण कर रहे हैं...'
                    : 'Acharya AstroDost is evaluating your birth chart and transits...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* PRESET QUESTIONS ACCORDION / QUICK SELECTOR */}
        <div className="bg-slate-900/90 border-t border-slate-800/80 p-3 sm:p-4 space-y-2.5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎯</span>
              <span className="text-xs font-bold text-amber-300">
                {language === 'hi'
                  ? 'विशेष चयनित AI ज्योतिष प्रश्न (Preset Vedic Analysis):'
                  : 'Preset Vedic AI Astrology Analysis Questions:'}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  profileStatus?.isVip
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-500/40'
                    : (profileStatus?.questionCreditsRemaining ?? 0) > 0
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {profileStatus?.isVip
                  ? '👑 VIP असीमित'
                  : `${profileStatus?.questionCreditsRemaining ?? 0} प्रश्न शेष`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsQuestionsExpanded(!isQuestionsExpanded)}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <span>{isQuestionsExpanded ? (language === 'hi' ? 'छुपाएं' : 'Hide') : (language === 'hi' ? 'दिखाएं' : 'Show')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isQuestionsExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {isQuestionsExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {presetQuestions.filter((q) => q.isActive).map((q, idx) => {
                const isLocked = !profileStatus?.isVip && (!profileStatus?.hasProfilePlan || (profileStatus?.questionCreditsRemaining ?? 0) <= 0);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleAskPresetQuestion(q)}
                    disabled={isLoading}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                      isLocked
                        ? 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-amber-500/50 hover:bg-slate-900/60'
                        : 'bg-slate-950 hover:bg-emerald-950/40 border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-400/90 shrink-0 mt-0.5">
                        #{idx + 1}
                      </span>
                      <p className="text-[11px] font-medium leading-snug line-clamp-2 font-devanagari">
                        {language === 'hi' ? q.questionHi : q.questionEn || q.questionHi}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-900 text-[10px]">
                      <span className="text-slate-500 capitalize">{q.category || 'Vedic'}</span>
                      <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                        {isLocked ? <Lock className="w-3 h-3 text-amber-400" /> : <Sparkles className="w-3 h-3" />}
                        <span>{isLocked ? (language === 'hi' ? 'अनलॉक करें' : 'Unlock') : (language === 'hi' ? 'पूछें →' : 'Ask →')}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Input Bar or Locked Free-Text Notice */}
        {profileStatus?.canFreeTextChat ? (
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-300'
                }`}
                title={language === 'hi' ? 'बोलकर प्रश्न पूछें' : 'Voice Input'}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              {/* Query Input */}
              <input
                id="astro-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'हिंदी में पूछें: मेरा करियर, विवाह योग, सरकारी नौकरी, या कोई भी सवाल...'
                    : 'Ask in English: career, love, marriage timing, lucky gemstones, or remedies...'
                }
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500 font-devanagari"
              />

              {/* Send Button */}
              <button
                id="btn-send-astro-chat"
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'hi' ? 'भेजें' : 'Send'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">
                  {profileStatus?.hasProfilePlan
                    ? language === 'hi'
                      ? 'फ्री-टेक्स्ट AI चैट एस्ट्रोदोस्त VIP (₹999/माह) के लिए आरक्षित है।'
                      : 'Free-text chat is reserved for AstroDost VIP (₹999/mo).'
                    : language === 'hi'
                    ? 'AI ज्योतिषी से परामर्श के लिए प्लान चुनें।'
                    : 'Select a plan to start AI consultation.'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {profileStatus?.hasProfilePlan
                    ? language === 'hi'
                      ? 'आपके वर्तमान प्लान में ऊपर दिए गए 5 चयनित AI प्रश्न शामिल हैं। अपनी मर्जी का कोई भी कस्टम प्रश्न पूछने के लिए अपग्रेड करें।'
                      : 'Your plan includes the 5 preset questions above. Upgrade for open free-text questions.'
                    : language === 'hi'
                    ? '₹299 में 15 मिनट (Starter), ₹499 में 35 मिनट (Popular + PDF), या ₹999 में 120 मिनट (2 घंटे VIP चैट)।'
                    : '15 min (₹299 Starter), 35 min (₹499 Popular + PDF), or 120 min (₹999 VIP 2-hr chat).'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('astrodost_open_paywall', {
                    detail: { moduleId: profileStatus?.hasProfilePlan ? 'plan_astrodost_vip' : 'plan_kundli_explorer' },
                  })
                );
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>
                {profileStatus?.hasProfilePlan
                  ? language === 'hi'
                    ? '👑 एस्ट्रोदोस्त VIP में अपग्रेड करें (₹999/माह)'
                    : '👑 Upgrade to AstroDost VIP (₹999/mo)'
                  : language === 'hi'
                  ? '🔓 योजना चुनें और अनलॉक करें'
                  : '🔓 Choose Plan & Unlock'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Modal: Set / Edit User Birth Profile */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {editingProfileId
                    ? language === 'hi'
                      ? 'जन्म विवरण सुधारें'
                      : 'Edit Birth Details'
                    : language === 'hi'
                    ? 'नई जन्म कुंडली प्रोफ़ाइल जोड़ें'
                    : 'Add New Birth Profile'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {language === 'hi'
                ? 'यह विवरण आपकी प्रामाणिक वैदिक कुंडली की गणना कर AI ज्योतिषी से सीधे जोड़ेगा।'
                : 'This calculates your authentic Vedic birth chart and links it to the AI Astrologer.'}
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Full Name & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'hi' ? 'जातक का पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder={language === 'hi' ? 'उदा. रमेश कुमार' : 'e.g. Ramesh Kumar'}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'hi' ? 'लिंग (Gender) *' : 'Gender *'}
                  </label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        gender: e.target.value as 'male' | 'female' | 'other',
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="male">{language === 'hi' ? 'पुरुष (Male)' : 'Male'}</option>
                    <option value="female">{language === 'hi' ? 'महिला (Female)' : 'Female'}</option>
                    <option value="other">{language === 'hi' ? 'अन्य (Other)' : 'Other'}</option>
                  </select>
                </div>
              </div>

              {/* Vedic Date & Time Picker */}
              <VedicDateTimePicker
                dob={profileForm.dob}
                tob={profileForm.tob}
                onDobChange={(newDob) => setProfileForm((prev) => ({ ...prev, dob: newDob }))}
                onTobChange={(newTob) => setProfileForm((prev) => ({ ...prev, tob: newTob }))}
                language={language}
                dobLabel={language === 'hi' ? 'जन्म तिथि (DOB) *' : 'Date of Birth *'}
                tobLabel={language === 'hi' ? 'जन्म समय (TOB) *' : 'Time of Birth *'}
              />

              {/* Birth Place with Google Maps Place Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>{language === 'hi' ? 'जन्म स्थान / शहर (सत्यापित निर्देशांक) *' : 'Birth Place (Verified Coordinates) *'}</span>
                  <span className="text-[10px] text-amber-400 font-normal">
                    {language === 'hi' ? 'गूगल मैप्स व सटीक देशांतर' : 'Google Maps Geocoded'}
                  </span>
                </label>
                <GoogleMapsPlacePicker
                  initialPlace={profileForm.place}
                  initialLat={profileForm.latitude}
                  initialLon={profileForm.longitude}
                  initialTz={profileForm.timezone}
                  language={language}
                  onSelectPlace={(picked) => {
                    setProfileForm((prev) => ({
                      ...prev,
                      place: picked.name,
                      latitude: picked.latitude,
                      longitude: picked.longitude,
                      timezone: picked.timezone,
                    }));
                  }}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20"
                >
                  {language === 'hi' ? 'सहेजें व AI कुंडली लिंक करें' : 'Save & Link to AI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
