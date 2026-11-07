import React, { useState, useEffect } from 'react';
import {
  Palette,
  Check,
  RotateCcw,
  Sparkles,
  Save,
  Sun,
  Moon,
  Eye,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Layers,
  Type,
  Paintbrush,
} from 'lucide-react';
import { AppThemeConfig, THEME_PRESETS, DEFAULT_THEME, ThemeColors, SupportedFontFamily } from '../../types/theme';
import {
  getLocalStoredTheme,
  applyThemeToDOM,
  persistThemeToServer,
  FONT_FAMILY_MAP,
} from '../../utils/themeManager';
import { Language } from '../../types/astrology';

interface AdminThemeManagerProps {
  language: Language;
  adminPin?: string;
}

interface FontOption {
  id: SupportedFontFamily;
  nameHi: string;
  nameEn: string;
  categoryHi: string;
  categoryEn: string;
  sampleHindi: string;
  sampleEn: string;
  fontFamilyCss: string;
}

const AVAILABLE_FONTS: FontOption[] = [
  {
    id: 'noto_devanagari',
    nameHi: 'नोतो सांस देवनागरी (डिफ़ॉल्ट)',
    nameEn: 'Noto Sans Devanagari (Default)',
    categoryHi: 'सर्वश्रेष्ठ स्पष्ट एवं प्रामाणिक',
    categoryEn: 'Highly Readable & Standard',
    sampleHindi: 'ॐ श्री गणेशाय नमः | प्रामाणिक वैदिक फलित',
    sampleEn: 'Authentic Vedic Astrology & Kundali',
    fontFamilyCss: "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  },
  {
    id: 'rozha_one',
    nameHi: 'रोज़्हा वन (शाही हेडिंग्स)',
    nameEn: 'Rozha One (Vedic Royal)',
    categoryHi: 'पारंपरिक व भव्य शास्त्रीय आभा',
    categoryEn: 'Traditional Classical Grandeur',
    sampleHindi: 'श्री जगन्नाथ होरा एवं महादशा चक्र',
    sampleEn: 'Jagannatha Hora & Planetary Cycles',
    fontFamilyCss: "'Rozha One', 'Noto Sans Devanagari', serif",
  },
  {
    id: 'poppins',
    nameHi: 'पॉपिन्स (आधुनिक व स्वच्छ)',
    nameEn: 'Poppins (Modern Clean)',
    categoryHi: 'आधुनिक मोबाइल ऐप्स की पहली पसंद',
    categoryEn: 'Contemporary & Elegant',
    sampleHindi: 'दैनिक राशिफल एवं अंक ज्योतिष विश्लेषण',
    sampleEn: 'Daily Horoscope & Chaldean Numerology',
    fontFamilyCss: "'Poppins', 'Noto Sans Devanagari', sans-serif",
  },
  {
    id: 'outfit',
    nameHi: 'आउटफ़िट (लक्जरी मिनिमल)',
    nameEn: 'Outfit (Luxury Minimal)',
    categoryHi: 'प्रीमियम टेक व शार्प टाइपोग्राफी',
    categoryEn: 'Premium Tech & Sharp Aesthetic',
    sampleHindi: 'AI ज्योतिषी एवं लो शू ग्रिड मास्टर',
    sampleEn: 'Vedic AI Consultation & Lo Shu Grid',
    fontFamilyCss: "'Outfit', 'Noto Sans Devanagari', sans-serif",
  },
  {
    id: 'cinzel',
    nameHi: 'सिंज़ेल (राजसी स्वर्णिम)',
    nameEn: 'Cinzel (Imperial Golden)',
    categoryHi: 'रॉयल व एस्ट्रो-इंपीरियल स्टाइल',
    categoryEn: 'Regal Roman & Astro-Imperial',
    sampleHindi: 'राजयोग एवं नवग्रह शांति विधान',
    sampleEn: 'Vedic Raj Yoga & Planetary Peace',
    fontFamilyCss: "'Cinzel', 'Noto Sans Devanagari', serif",
  },
  {
    id: 'yatra_one',
    nameHi: 'यात्रा वन (प्राचीन देववाणी)',
    nameEn: 'Yatra One (Sacred Pilgrimage)',
    categoryHi: 'प्राचीन मंदिर व संस्कृत ग्रंथ आभा',
    categoryEn: 'Sacred Temple Inscription Style',
    sampleHindi: 'महामृत्युंजय मंत्र एवं चौघड़िया पंचांग',
    sampleEn: 'Mahamrityunjaya Mantra & Choghadiya',
    fontFamilyCss: "'Yatra One', 'Noto Sans Devanagari', cursive",
  },
  {
    id: 'kalam',
    nameHi: 'कलम (हस्तलिखित ज्योतिष डायरी)',
    nameEn: 'Kalam (Astrologer Handwritten)',
    categoryHi: 'आचार्य की हस्तलिखित कुंडली जैसा भाव',
    categoryEn: 'Personal Gurukul Diary Feel',
    sampleHindi: 'आचार्य मनीष जी द्वारा कुंडली विश्लेषण',
    sampleEn: 'Handcrafted Vedic Consultations',
    fontFamilyCss: "'Kalam', 'Noto Sans Devanagari', cursive",
  },
  {
    id: 'playfair',
    nameHi: 'प्लेफेयर डिस्प्ले (शाही विंटेज)',
    nameEn: 'Playfair Display (Editorial Luxury)',
    categoryHi: 'लक्जरी गोल्ड मैगज़ीन व हेडिंग्स',
    categoryEn: 'Luxury Editorial Gold Heading',
    sampleHindi: 'सम्पूर्ण २५-पेज जगन्नाथ होरा महाकुंडली',
    sampleEn: 'Complete 25-Page Master Kundli Report',
    fontFamilyCss: "'Playfair Display', 'Noto Sans Devanagari', serif",
  },
];

interface TextColorCombo {
  id: string;
  nameHi: string;
  nameEn: string;
  heading: string;
  text: string;
  accent: string;
}

const TEXT_COLOR_COMBOS: TextColorCombo[] = [
  {
    id: 'divine_gold',
    nameHi: '🌟 दिव्य स्वर्णिम (Divine Gold)',
    nameEn: 'Divine Gold (Royal)',
    heading: '#fbbf24',
    text: '#f8fafc',
    accent: '#f59e0b',
  },
  {
    id: 'moonlight_silver',
    nameHi: '🌙 चंद्र कांति (Moonlight White)',
    nameEn: 'Moonlight White',
    heading: '#ffffff',
    text: '#e2e8f0',
    accent: '#38bdf8',
  },
  {
    id: 'surya_amber',
    nameHi: '☀️ सूर्य प्रभा (Surya Amber)',
    nameEn: 'Surya Amber',
    heading: '#f59e0b',
    text: '#fef3c7',
    accent: '#ef4444',
  },
  {
    id: 'emerald_glow',
    nameHi: '🌿 पन्ना हरित (Vedic Emerald)',
    nameEn: 'Vedic Emerald Glow',
    heading: '#34d399',
    text: '#ecfdf5',
    accent: '#10b981',
  },
  {
    id: 'saffron_kesariya',
    nameHi: '🚩 केसरिया रुद्राक्ष (Saffron Kesariya)',
    nameEn: 'Saffron Kesariya',
    heading: '#fb923c',
    text: '#fff7ed',
    accent: '#f97316',
  },
  {
    id: 'cosmic_violet',
    nameHi: '🔮 नीलम रहस्य (Cosmic Violet)',
    nameEn: 'Cosmic Violet Mystique',
    heading: '#c084fc',
    text: '#f3e8ff',
    accent: '#a855f7',
  },
];

export const AdminThemeManager: React.FC<AdminThemeManagerProps> = ({
  language,
  adminPin,
}) => {
  const [currentTheme, setCurrentTheme] = useState<AppThemeConfig>(() => getLocalStoredTheme());
  const [selectedPresetId, setSelectedPresetId] = useState<string>(currentTheme.id || 'vedic_emerald');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Load theme on mount
  useEffect(() => {
    const t = getLocalStoredTheme();
    setCurrentTheme(t);
    setSelectedPresetId(t.id || 'vedic_emerald');
  }, []);

  const handleSelectPreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;
    setSelectedPresetId(presetKey);
    setCurrentTheme(preset);
    // Instant live preview
    applyThemeToDOM(preset);
    setSaveStatus({
      type: null,
      message:
        language === 'hi'
          ? 'लाइव प्रीव्यू सक्रिय। पूरे ऐप में स्थायी रूप से लागू करने के लिए "ग्लोबल थीम सेव करें" पर क्लिक करें।'
          : 'Live preview active. Click "Save Theme Globally" to persist across all users & devices.',
    });
  };

  const handleFontChange = (fontKey: SupportedFontFamily) => {
    const updated: AppThemeConfig = {
      ...currentTheme,
      fontFamily: fontKey,
      updatedAt: new Date().toISOString(),
    };
    setCurrentTheme(updated);
    applyThemeToDOM(updated);
    setSaveStatus({
      type: null,
      message:
        language === 'hi'
          ? `✓ फॉन्ट स्टाइल लाइव लागू हुआ! पूरे ऐप में स्थायी करने हेतु "ग्लोबल थीम सेव करें" दबाएं।`
          : `✓ Font style live preview applied! Click "Save Theme Globally" to persist.`,
    });
  };

  const handleTextColorPreset = (heading: string, text: string, accent: string) => {
    const updated: AppThemeConfig = {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        headingText: heading,
        textMain: text,
        accentGold: accent,
        accentText: accent,
      },
      updatedAt: new Date().toISOString(),
    };
    setCurrentTheme(updated);
    applyThemeToDOM(updated);
    setSaveStatus({
      type: null,
      message:
        language === 'hi'
          ? '✓ टेक्स्ट रंग संयोजन लाइव लागू हुआ। स्थायी करने हेतु "ग्लोबल थीम सेव करें" दबाएं।'
          : '✓ Text color combination applied. Click "Save Theme Globally" to persist.',
    });
  };

  const handleColorChange = (key: keyof ThemeColors, value: any) => {
    const updated: AppThemeConfig = {
      ...currentTheme,
      id: 'custom_theme',
      nameEn: 'Custom Admin Theme',
      nameHi: 'कस्टम एडमिन थीम',
      colors: {
        ...currentTheme.colors,
        [key]: value,
      },
    };
    setCurrentTheme(updated);
    setSelectedPresetId('custom_theme');
    applyThemeToDOM(updated);
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });

    try {
      const res = await persistThemeToServer(currentTheme, adminPin);
      if (res.success && res.theme) {
        setCurrentTheme(res.theme);
        setSaveStatus({
          type: 'success',
          message:
            language === 'hi'
              ? '🎉 वैश्विक फॉन्ट एवं थीम सफलतापूर्वक डेटाबेस में सेव हुई! सभी यूज़र्स के इंस्टॉल किए गए वेबऐप व पेजों पर लागू हो गई है।'
              : '🎉 Global font & theme successfully saved in database! Applied across all users, installed PWAs and devices.',
        });
      } else {
        setSaveStatus({
          type: 'error',
          message: res.error || (language === 'hi' ? 'थीम सेव करने में विफल।' : 'Failed to save theme.'),
        });
      }
    } catch (err: any) {
      setSaveStatus({
        type: 'error',
        message: err?.message || 'Error communicating with server.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToSaved = () => {
    const saved = getLocalStoredTheme();
    setCurrentTheme(saved);
    setSelectedPresetId(saved.id || 'vedic_emerald');
    applyThemeToDOM(saved);
    setSaveStatus({
      type: null,
      message: language === 'hi' ? 'पूर्व सेव की गई थीम रीसेट हो गई।' : 'Reverted to last saved theme.',
    });
  };

  const handleRestoreDefault = () => {
    setCurrentTheme(DEFAULT_THEME);
    setSelectedPresetId('vedic_emerald');
    applyThemeToDOM(DEFAULT_THEME);
    setSaveStatus({
      type: null,
      message:
        language === 'hi'
          ? 'डिफ़ॉल्ट वैदिक पन्ना थीम व नोतो देवनागरी फॉन्ट प्रीव्यू में आ गया है। स्थायी करने के लिए सेव करें।'
          : 'Default Vedic Emerald & Noto Sans Devanagari previewed. Click Save to persist globally.',
    });
  };

  const currentFontCss = FONT_FAMILY_MAP[currentTheme.fontFamily] || FONT_FAMILY_MAP.noto_devanagari;
  const currentHeadingColor = currentTheme.colors.headingText || currentTheme.colors.accentGold || '#fbbf24';
  const currentBodyTextColor = currentTheme.colors.textMain || '#f8fafc';
  const currentAccentTextColor = currentTheme.colors.accentText || currentTheme.colors.accentGold || '#f59e0b';

  return (
    <div className="space-y-6">
      {/* Header and Live Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {language === 'hi'
                ? 'वैश्विक थीम, फॉन्ट व रंग प्रबंधन (Global Theme, Font & Colors)'
                : 'Global Web-App Theme, Font & Color Manager'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'hi'
              ? 'यहाँ से चुनी गई थीम, फॉन्ट स्टाइल और टेक्स्ट के रंग पूरे वेबऐप (हेडर, जन्मकुंडली, अंक ज्योतिष, AI परामर्श व मोबाइल ऐप) पर तुरंत लाइव लागू होते हैं।'
              : 'Fonts, themes and colored text chosen here are applied instantly app-wide and can be saved globally.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleResetToSaved}
            className="px-3 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'रीसेट' : 'Revert'}</span>
          </button>
          <button
            type="button"
            onClick={handleRestoreDefault}
            className="px-3 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{language === 'hi' ? 'डिफ़ॉल्ट रीस्टोर' : 'Restore Default'}</span>
          </button>
          <button
            type="button"
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? (language === 'hi' ? 'सेव हो रहा है...' : 'Saving...') : language === 'hi' ? 'ग्लोबल थीम सेव करें' : 'Save Theme Globally'}</span>
          </button>
        </div>
      </div>

      {/* Save Status Banner */}
      {saveStatus.message && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
            saveStatus.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : saveStatus.type === 'error'
              ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
              : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: FONT FAMILY SELECTION (फॉन्ट स्टाइल विकल्प) */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'hi' ? '🔤 फॉन्ट स्टाइल चुनें (Text Font Family)' : '🔤 Select Typography & Font Family'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {language === 'hi'
                  ? 'अपनी पसंद के फॉन्ट पर क्लिक करें। पूरे वेबऐप का टेक्स्ट तुरंत उसी फॉन्ट में बदल जाएगा।'
                  : 'Click on any font to preview. Entire web-app typography will adopt it instantly.'}
              </p>
            </div>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-300 font-mono font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
            {currentTheme.fontFamily || 'noto_devanagari'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AVAILABLE_FONTS.map((font) => {
            const isSelected = currentTheme.fontFamily === font.id;
            return (
              <div
                key={font.id}
                onClick={() => handleFontChange(font.id)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-950/20 ring-2 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">
                      {language === 'hi' ? font.nameHi : font.nameEn}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-amber-300/80 block mb-2 font-medium">
                    {language === 'hi' ? font.categoryHi : font.categoryEn}
                  </span>
                </div>

                {/* Live Font Sample Preview */}
                <div
                  className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-center mt-1"
                  style={{ fontFamily: font.fontFamilyCss }}
                >
                  <p className="text-sm font-bold text-amber-200 truncate">
                    {font.sampleHindi}
                  </p>
                  <p className="text-[11px] text-slate-300 truncate mt-0.5">
                    {font.sampleEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: TEXT & HEADING COLORS (रंग-बिरंगे टेक्स्ट ऑप्शन्स) */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Paintbrush className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'hi' ? '🎨 टेक्स्ट एवं हेडिंग के रंग (Text & Heading Colors)' : '🎨 Text & Heading Color Styling'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {language === 'hi'
                  ? 'शीर्षक (Headings), मुख्य पाठ (Body Text) व हाइलाइट्स के रंग आसानी से बदलें या रेडीमेड वैदिक पैलेट चुनें।'
                  : 'Customize heading, body text and accent colors with one tap or fine-tune with color pickers.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Color Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            {language === 'hi' ? '✨ तैयार वैदिक टेक्स्ट रंग संयोजन (Quick Text Palettes):' : '✨ Quick Text Color Combos:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {TEXT_COLOR_COMBOS.map((combo) => (
              <button
                key={combo.id}
                type="button"
                onClick={() => handleTextColorPreset(combo.heading, combo.text, combo.accent)}
                className="p-2.5 rounded-xl border border-slate-800 hover:border-amber-400 bg-slate-950 hover:bg-slate-900 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: combo.heading }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: combo.text }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: combo.accent }} />
                </div>
                <span className="text-[11px] font-bold text-slate-200 block truncate group-hover:text-amber-300">
                  {language === 'hi' ? combo.nameHi.split('(')[0] : combo.nameEn}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Color Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Heading Text Color */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center justify-between">
              <span>{language === 'hi' ? 'हेडिंग / शीर्षक का रंग' : 'Heading Text Color'}</span>
              <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: currentHeadingColor }} />
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="color"
                value={currentHeadingColor}
                onChange={(e) => handleColorChange('headingText', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={currentHeadingColor}
                onChange={(e) => handleColorChange('headingText', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-white"
                placeholder="#fbbf24"
              />
            </div>
          </div>

          {/* Body Text Color */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center justify-between">
              <span>{language === 'hi' ? 'मुख्य पैराग्राफ / विवरण रंग' : 'Body Text Color'}</span>
              <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: currentBodyTextColor }} />
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="color"
                value={currentBodyTextColor}
                onChange={(e) => handleColorChange('textMain', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={currentBodyTextColor}
                onChange={(e) => handleColorChange('textMain', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-white"
                placeholder="#f8fafc"
              />
            </div>
          </div>

          {/* Accent Gold / Highlight Color */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <label className="text-xs font-bold text-slate-200 block mb-1 flex items-center justify-between">
              <span>{language === 'hi' ? 'हाइलाइट / एक्सेंट गोल्ड रंग' : 'Accent / Highlight Color'}</span>
              <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: currentAccentTextColor }} />
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="color"
                value={currentAccentTextColor}
                onChange={(e) => {
                  handleColorChange('accentGold', e.target.value);
                  handleColorChange('accentText', e.target.value);
                }}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={currentAccentTextColor}
                onChange={(e) => {
                  handleColorChange('accentGold', e.target.value);
                  handleColorChange('accentText', e.target.value);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-white"
                placeholder="#f59e0b"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: THEME PRESETS (वैदिक थीम थीम्स) */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? 'वैदिक व एस्ट्रो सम्पूर्ण थीम प्रीसेट्स' : 'AstroDost Full Theme Presets'}</span>
          </h4>
          <button
            type="button"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isCustomizing ? (language === 'hi' ? 'कस्टम बैकग्राउंड कलर्स छिपाएं' : 'Hide Custom Palette') : language === 'hi' ? 'बारीक बैकग्राउंड रंग कस्टमाइज़ करें' : 'Customize Background Colors'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(THEME_PRESETS).map(([key, preset]) => {
            const isSelected = selectedPresetId === key;
            const c = preset.colors;
            return (
              <div
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-slate-900 shadow-xl shadow-amber-950/20 ring-2 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">
                      {language === 'hi' ? preset.nameHi : preset.nameEn}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                    {language === 'hi' ? preset.descriptionHi : preset.descriptionEn}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-5 h-5 rounded-md border border-black/30 shadow-sm"
                      style={{ backgroundColor: c.primary }}
                      title="Primary Brand"
                    />
                    <span
                      className="w-5 h-5 rounded-md border border-black/30 shadow-sm"
                      style={{ backgroundColor: c.accentGold }}
                      title="Accent Gold"
                    />
                    <span
                      className="w-5 h-5 rounded-md border border-black/30 shadow-sm"
                      style={{ backgroundColor: c.background }}
                      title="App Background"
                    />
                    <span
                      className="w-5 h-5 rounded-md border border-black/30 shadow-sm"
                      style={{ backgroundColor: c.cardBg }}
                      title="Card Background"
                    />
                    <span
                      className="w-5 h-5 rounded-md border border-black/30 shadow-sm"
                      style={{ backgroundColor: c.border }}
                      title="Border Color"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Fine-Tuning Palette */}
      {isCustomizing && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'विस्तृत बैकग्राउंड व कार्ड रंग' : 'Background & Card Palette'}</span>
            </h4>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={currentTheme.colors.isDark}
                onChange={(e) => handleColorChange('isDark', e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-amber-500"
              />
              <span>{language === 'hi' ? 'डार्क मोड स्टाइल' : 'Dark Mode Base'}</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5">
                <input
                  type="color"
                  value={currentTheme.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-slate-300">{currentTheme.colors.primary}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                App Page Background
              </label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5">
                <input
                  type="color"
                  value={currentTheme.colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-slate-300">{currentTheme.colors.background}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Header Background
              </label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5">
                <input
                  type="color"
                  value={currentTheme.colors.headerBg}
                  onChange={(e) => handleColorChange('headerBg', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-slate-300">{currentTheme.colors.headerBg}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Card Background
              </label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5">
                <input
                  type="color"
                  value={currentTheme.colors.cardBg}
                  onChange={(e) => handleColorChange('cardBg', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-slate-300">{currentTheme.colors.cardBg}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Card Border Color
              </label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5">
                <input
                  type="color"
                  value={currentTheme.colors.border}
                  onChange={(e) => handleColorChange('border', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-slate-300">{currentTheme.colors.border}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: LIVE PREVIEW SANDBOX (लाइव इंटरफ़ेस पूर्वावलोकन) */}
      {/* ======================================================== */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hi' ? '👀 लाइव फॉन्ट व रंग पूर्वावलोकन (Live Typography & Color Sandbox):' : '👀 Live Typography & Color Sandbox:'}</span>
          </h4>
          <span className="text-[11px] text-amber-300/80 font-mono">
            Font: {currentTheme.fontFamily}
          </span>
        </div>

        <div
          className="p-5 sm:p-6 rounded-2xl border transition-all space-y-4 shadow-xl"
          style={{
            backgroundColor: currentTheme.colors.cardBg,
            borderColor: currentTheme.colors.border,
            fontFamily: currentFontCss,
          }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🕉️</span>
              <div>
                <h2 className="text-lg sm:text-xl font-black leading-tight" style={{ color: currentHeadingColor }}>
                  {language === 'hi' ? 'आचार्य एस्ट्रोदोस्त AI & जगन्नाथ होरा' : 'Acharya AstroDost AI & Jagannatha Hora'}
                </h2>
                <p className="text-xs opacity-75" style={{ color: currentBodyTextColor }}>
                  {language === 'hi' ? 'वैदिक ज्योतिष, अंक ज्योतिष एवं लो शू ग्रिड शोध केंद्र' : 'Vedic Astrology, Numerology & Lo Shu Grid Portal'}
                </p>
              </div>
            </div>
            <span
              className="text-xs font-black px-3 py-1 rounded-full shadow-md"
              style={{
                backgroundColor: currentAccentTextColor,
                color: '#0f172a',
              }}
            >
              ⭐ LIVE PREVIEW
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: currentHeadingColor }}>
              {language === 'hi' ? '🌟 आपकी जन्म कुंडली एवं मूलांक का संपूर्ण रहस्य' : '🌟 Complete Secret of Your Birth Horoscope & Mulank'}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: currentBodyTextColor }}>
              {language === 'hi'
                ? 'यह कार्ड प्रदर्शित करता है कि वास्तविक जन्म कुंडली, दैनिक राशिफल, अंक ज्योतिष और AI ज्योतिषी इंटरफ़ेस पर आपके द्वारा चुना गया फॉन्ट और रंग कैसे दिखाई देंगे। यह पूरी तरह स्पष्ट, पठनीय और आकर्षक है।'
                : 'This card demonstrates exactly how your chosen font family, heading color, body text color and accent badges appear across all horoscope readings, numerology calculators and AI consultations.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 pt-2 flex-wrap">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
              style={{ backgroundColor: currentTheme.colors.primary }}
            >
              {language === 'hi' ? 'मुख्य एक्शन बटन' : 'Primary Action Button'}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              style={{
                backgroundColor: currentAccentTextColor,
                color: '#0f172a',
              }}
            >
              {language === 'hi' ? 'गोल्डन एक्सेंट बटन' : 'Gold Accent Action'}
            </button>
            <span className="text-xs px-2.5 py-1 rounded-lg border" style={{ borderColor: currentTheme.colors.border, color: currentBodyTextColor }}>
              {language === 'hi' ? 'चयनित फॉन्ट:' : 'Font:'} <strong style={{ color: currentHeadingColor }}>{currentTheme.fontFamily}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
