import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Save,
  Trash2,
  Eye,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Flame,
  Layers,
  Wand2,
  Smartphone,
  Monitor,
} from 'lucide-react';
import {
  AdminPromotionalBanner,
  BannerAnimationStyle,
  DEFAULT_PROMOTIONAL_BANNER,
  getStoredPromotionalBanner,
  savePromotionalBanner,
} from '../../utils/accessManager';
import { Language } from '../../types/astrology';

interface AdminBannerManagerProps {
  language: Language;
  onNavigateTab?: (tab: string) => void;
}

const PRESET_BANNER_IMAGES = [
  {
    id: 'mandala_gold',
    name: 'वैदिक स्वर्ण नक्षत्र (Cosmic Gold)',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'temple_lights',
    name: 'मंदिर दीप व महाआरती (Sacred Lights)',
    url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'celestial_nebula',
    name: 'नवग्रह आकाशगंगा (Cosmic Planets)',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'rudraksha_om',
    name: 'रुद्राक्ष व ॐ ध्यान (Vedic Spiritual)',
    url: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=1400&auto=format&fit=crop',
  },
];

const ANIMATION_STYLE_OPTIONS: {
  id: BannerAnimationStyle;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  icon: string;
}[] = [
  {
    id: 'gold_aura',
    titleHi: '✨ स्वर्ण आभामंडल (Gold Aura Shimmer)',
    titleEn: 'Gold Aura Shimmer',
    descHi: 'घूर्णन करती स्वर्णिम प्रकाश चक्र की आभा',
    descEn: 'Continuous rotating golden conic halo',
    icon: '🌟',
  },
  {
    id: 'pulse_glow',
    titleHi: '💫 पल्स व फ्लोट (Pulse & Float)',
    titleEn: 'Pulse & Float',
    descHi: 'तालबद्ध धीमी चमक व सांस लेती ऊर्जा',
    descEn: 'Rhythmic breathing glow with soft expansion',
    icon: '✨',
  },
  {
    id: 'neon_border',
    titleHi: '⚡ नियॉन बॉर्डर (Neon Laser Glow)',
    titleEn: 'Neon Laser Glow',
    descHi: 'पन्ना व स्वर्ण रंग की चमकदार लेज़र बॉर्डर',
    descEn: 'Emerald & amber dual pulsating laser glow',
    icon: '⚡',
  },
  {
    id: 'marquee_flow',
    titleHi: '📜 टिकर प्रवाह (Marquee Light Sweep)',
    titleEn: 'Marquee Light Sweep',
    descHi: 'बैनर के ऊपर निरंतर प्रवाहित प्रकाश किरण',
    descEn: 'Continuous shimmer sweep traversing the banner',
    icon: '🌊',
  },
  {
    id: 'cosmic_sparkle',
    titleHi: '🌌 नक्षत्र स्पार्कल (Cosmic Sparkles)',
    titleEn: 'Cosmic Sparkles',
    descHi: 'कोनों पर चमकते नक्षत्र व दिव्य स्पार्कल',
    descEn: 'Floating celestial sparkles on corners',
    icon: '🔮',
  },
  {
    id: 'floating_wave',
    titleHi: '🛸 फ्लोटिंग तरंग (Floating Wave)',
    titleEn: 'Floating Wave',
    descHi: 'हवा में तैरने जैसा सौम्य फ्लोट प्रभाव',
    descEn: 'Gentle hovering vertical wave motion',
    icon: '🛸',
  },
  {
    id: 'luxury_static',
    titleHi: '💎 क्लासिक शांत (Clean Static Luxury)',
    titleEn: 'Clean Static Luxury',
    descHi: 'बिना गति का शांत, उच्च स्तरीय राजसी स्वर्ण बॉर्डर',
    descEn: 'Elegant stationary high-contrast gold border',
    icon: '👑',
  },
];

export const AdminBannerManager: React.FC<AdminBannerManagerProps> = ({ language, onNavigateTab }) => {
  const [banner, setBanner] = useState<AdminPromotionalBanner>(getStoredPromotionalBanner());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize / normalize uploaded image using an offscreen canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        // Normalize large photos to max 1400px width to ensure fast storage and crisp display
        const maxW = 1400;
        const scale = img.width > maxW ? maxW / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          setBanner((prev) => ({
            ...prev,
            imageUrl: compressed,
            isActive: true,
            updatedAt: new Date().toISOString(),
          }));
        } else {
          setBanner((prev) => ({
            ...prev,
            imageUrl: dataUrl,
            isActive: true,
            updatedAt: new Date().toISOString(),
          }));
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = savePromotionalBanner({ ...banner, isActive: true });
    setBanner(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDefault = () => {
    if (window.confirm(language === 'hi' ? 'क्या आप डिफ़ॉल्ट वैदिक बैनर रीसेट करना चाहते हैं?' : 'Reset to default banner?')) {
      const resetBanner = { ...DEFAULT_PROMOTIONAL_BANNER, id: 'banner_' + Date.now(), updatedAt: new Date().toISOString() };
      const saved = savePromotionalBanner(resetBanner);
      setBanner(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDeleteBanner = () => {
    if (window.confirm(language === 'hi' ? 'क्या आप बैनर को वेबऐप से हटाना और डिलीट करना चाहते हैं?' : 'Delete and remove banner from webapp?')) {
      const deactivated = { ...banner, imageUrl: '', isActive: false, updatedAt: new Date().toISOString() };
      savePromotionalBanner(deactivated);
      setBanner(deactivated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Status Bar */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
            🪧
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-amber-300">
                {language === 'hi' ? 'विंडो 1: प्रचार बैनर क्रिएटर व वेबऐप प्रमोशन' : 'Window 1: Promotional Banner Builder & WebApp Promo'}
              </h3>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  banner.isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {banner.isActive ? (language === 'hi' ? '🟢 लाइव ऑन वेबऐप' : 'LIVE ON WEBAPP') : (language === 'hi' ? '⚪ बंद' : 'INACTIVE')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'अपनी पसंद का कोई भी बैनर फोटो अपलोड करें, एनिमेशन स्टाइल चुनें व तुरंत वेबऐप पर प्रमोट करें।'
                : 'Upload any banner photo (auto-adjusts to any size), pick animation style, and promote on webapp.'}
            </p>
          </div>
        </div>

        {/* Live Toggle & Save Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const nextState = !banner.isActive;
              setBanner((prev) => ({ ...prev, isActive: nextState }));
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              banner.isActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>{banner.isActive ? (language === 'hi' ? 'लाइव है (Active)' : 'Active') : (language === 'hi' ? 'सक्रिय करें (Turn ON)' : 'Turn ON')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'बैनर सहेजें व लाइव करें' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            {language === 'hi'
              ? 'बैनर सफलतापूर्वक अपडेट हो गया है और वेबऐप पर लाइव प्रदर्शित हो रहा है!'
              : 'Promotional Banner successfully saved and now active on the webapp!'}
          </span>
        </div>
      )}

      {/* Main 2-Column Layout: Controls & Live Auto-Adjust Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Animation Options (7 Cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          {/* Section A: Banner Image Upload & Auto-Adjust Engine */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'बैनर फोटो अपलोड (Auto-Adjust Any Size)' : 'Banner Image (Auto-Adjust Any Size)'}</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {language === 'hi' ? 'ऑटो-फिट: किसी भी साइज का फोटो फिट होगा' : 'Auto-adjusts any aspect ratio'}
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Upload Area / Drag & Drop Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-amber-500/50 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 p-4 rounded-xl text-center flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/20 group-hover:bg-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'hi' ? 'कंप्यूटर या मोबाइल से अपलोड करें' : 'Upload from Device'}
                  </span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WebP (किसी भी अनुपात में)</span>
                </div>
              </button>

              {/* Paste Direct URL */}
              <div className="flex flex-col justify-between space-y-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-300">{language === 'hi' ? 'या इमेज URL दर्ज करें:' : 'Or paste Image URL:'}</span>
                <input
                  type="url"
                  value={banner.imageUrl.startsWith('data:') ? '' : banner.imageUrl}
                  onChange={(e) => setBanner((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[9px] text-slate-500">Unsplash, PostImage या कोई भी वेब इमेज</span>
              </div>
            </div>

            {/* Curated Preset Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400">{language === 'hi' ? 'या रेडीमेड वैदिक आर्ट चुनें:' : 'Or pick Vedic preset artwork:'}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_BANNER_IMAGES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setBanner((prev) => ({ ...prev, imageUrl: preset.url }))}
                    className="relative group rounded-lg overflow-hidden border border-slate-700 hover:border-amber-400 text-left h-12 cursor-pointer transition-all"
                  >
                    <img src={preset.url} alt="" className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition-transform" />
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[9px] font-bold text-white text-center px-1">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Currently Uploaded Image Thumbnail & Quick Remove */}
            {banner.imageUrl && (
              <div className="relative rounded-xl border border-amber-500/40 p-2.5 bg-slate-900/90 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={banner.imageUrl} alt="Uploaded Banner" className="w-16 h-12 rounded-lg object-cover border border-slate-700 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-amber-300 block truncate">
                      {language === 'hi' ? 'वर्तमान बैनर फोटो सक्रिय है' : 'Current Banner Image Active'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Auto-Adjusts to any device screen
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBanner((prev) => ({ ...prev, imageUrl: '' }))}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'फोटो हटाएं' : 'Remove Photo'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Section A2: Banner Display Mode (Full Image vs Split Card) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'बैनर स्टाइल मोड (Display Mode):' : 'Banner Display Mode:'}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setBanner((prev) => ({ ...prev, displayMode: 'separate_promo' }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  banner.displayMode === 'separate_promo' || (!banner.displayMode && banner.displayMode !== 'full_image' && banner.displayMode !== 'hero_overlay')
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪟</span>
                  <span className="text-xs font-bold block">
                    {language === 'hi' ? 'अलग विंडो: ऊपर बैनर + नीचे प्रोमो' : 'Banner Top + Promo Below'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {language === 'hi'
                    ? 'ऊपर पूरा बैनर फोटो और नीचे अलग से स्पेशल प्रोमो विंडो (अनुशंसित)'
                    : 'Full banner photo on top and separate special promo window directly beneath (Recommended)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBanner((prev) => ({ ...prev, displayMode: 'full_image' }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  banner.displayMode === 'full_image'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🖼️</span>
                  <span className="text-xs font-bold block">
                    {language === 'hi' ? 'केवल पूर्ण चित्र बैनर (Full Image Only)' : 'Full Image Only'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {language === 'hi' ? 'बिना अतिरिक्त टेक्स्ट केवल अपलोड किया हुआ पोस्टर दिखेगा' : 'Display standalone banner graphic without promo window'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBanner((prev) => ({ ...prev, displayMode: 'hero_overlay' }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  banner.displayMode === 'hero_overlay'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌟</span>
                  <span className="text-xs font-bold block">
                    {language === 'hi' ? 'बैनर के ऊपर टेक्स्ट (Hero Overlay)' : 'Overlay on Top'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {language === 'hi' ? 'बैनर फोटो के ऊपर ही टेक्स्ट व बटन' : 'Text and button overlaid on top of the banner image'}
                </span>
              </button>
            </div>
          </div>

          {/* Section B: Animated Style Selection (Placed right with Upload & Save) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'एनिमेटेड स्टाइल चुनें (Animated Style Options)' : 'Choose Animated Style'}</span>
              </label>
              <span className="text-[10px] text-amber-300 font-mono">
                Active: {ANIMATION_STYLE_OPTIONS.find((s) => s.id === banner.animationStyle)?.titleEn}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
              {ANIMATION_STYLE_OPTIONS.map((style) => {
                const isSelected = banner.animationStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setBanner((prev) => ({ ...prev, animationStyle: style.id }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg shrink-0 mt-0.5">{style.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300 font-black' : 'text-slate-200'}`}>
                          {language === 'hi' ? style.titleHi : style.titleEn}
                        </h4>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-sm" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {language === 'hi' ? style.descHi : style.descEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section C: Text, Headline & Call to Action (CTA) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              {language === 'hi' ? 'बैनर का टेक्स्ट, शीर्षक व एक्शन बटन' : 'Banner Text & Call-To-Action'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">{language === 'hi' ? 'बैनर मुख्य शीर्षक (Title):' : 'Headline Title:'}</label>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) => setBanner((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="✨ विशेष वैदिक AI ज्योतिषी परामर्श..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">{language === 'hi' ? 'बैज टेक्स्ट (Badge):' : 'Badge Tag:'}</label>
                <input
                  type="text"
                  value={banner.badgeText}
                  onChange={(e) => setBanner((prev) => ({ ...prev, badgeText: e.target.value }))}
                  placeholder="SPECIAL OFFER 🌟"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium">{language === 'hi' ? 'उप-शीर्षक / विवरण (Subtitle):' : 'Subtitle / Description:'}</label>
              <textarea
                rows={2}
                value={banner.subtitle}
                onChange={(e) => setBanner((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="आज ही अपनी विस्तृत जन्मकुंडली, करियर, विवाह व जीवन समस्याओं का सटीक समाधान पाएं..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">{language === 'hi' ? 'बटन टेक्स्ट (Button Text):' : 'Button Label:'}</label>
                <input
                  type="text"
                  value={banner.actionText}
                  onChange={(e) => setBanner((prev) => ({ ...prev, actionText: e.target.value }))}
                  placeholder="AI ज्योतिषी से पूछें ➔"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">{language === 'hi' ? 'क्लिक करने पर क्या खुले?' : 'Target Destination:'}</label>
                <select
                  value={banner.actionTarget}
                  onChange={(e) => {
                    const val = e.target.value;
                    let type: AdminPromotionalBanner['actionType'] = 'tab';
                    if (val === 'pro_modal') type = 'pro_modal';
                    else if (val.startsWith('http')) type = 'url';
                    else if (val.startsWith('wa:')) type = 'whatsapp';
                    setBanner((prev) => ({ ...prev, actionTarget: val, actionType: type }));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="chat">🕉️ AI ज्योतिषी चैट (AI Chat Tab)</option>
                  <option value="free-kundali">📜 फ्री जन्म कुंडली (Free Kundali Tab)</option>
                  <option value="horoscope">☀️ दैनिक राशिफल (Daily Horoscope)</option>
                  <option value="matchmaking">❤️ गुण मिलान (Matchmaking)</option>
                  <option value="pro_modal">👑 प्रो-प्लान भुगतान विंडो (Pro Plan Paywall)</option>
                  <option value="remedies">🪔 रत्न व वैदिक उपाय (Remedies)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons: Save, Reset & Delete */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-xs text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                title="डिफ़ॉल्ट रीसेट करें"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'डिफ़ॉल्ट रीसेट' : 'Reset'}</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteBanner}
                className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/60 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                title="बैनर डिलीट करें"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'बैनर हटाएं' : 'Deactivate'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'hi' ? '💾 बैनर सहेजें व लाइव करें' : '💾 Save & Promote'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Auto-Adjust Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                {language === 'hi' ? 'लाइव प्रीव्यू (Auto-Adjust Preview)' : 'Live Real-time Preview'}
              </h4>
            </div>

            {/* Desktop vs Mobile Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
              <button
                type="button"
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded flex items-center gap-1 cursor-pointer ${
                  previewMode === 'desktop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded flex items-center gap-1 cursor-pointer ${
                  previewMode === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Preview Canvas Box */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-2xl border border-amber-500/30 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
            <div className={`w-full transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-[320px]' : 'max-w-full'}`}>
              <div className="w-full space-y-3">
                {/* PREVIEW: WINDOW 1 - Full Banner Image Window */}
                <div
                  className={`relative z-10 w-full rounded-2xl overflow-hidden bg-slate-950 text-white ${
                    banner.animationStyle === 'neon_border'
                      ? 'animate-neon-glow border-2 border-emerald-400'
                      : banner.animationStyle === 'pulse_glow'
                      ? 'ring-2 ring-emerald-400/80 animate-pulse'
                      : banner.animationStyle === 'floating_wave'
                      ? 'animate-float-wave ring-2 ring-amber-400/70'
                      : 'border border-amber-500/40'
                  }`}
                >
                  {/* Outer Rotating Conic Halo if gold_aura is chosen */}
                  {banner.animationStyle === 'gold_aura' && (
                    <div className="absolute -inset-[2px] rounded-2xl overflow-hidden pointer-events-none z-0">
                      <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#d4af37,#f59e0b,#fef08a,#ffffff,#d4af37,#b45309,#fbbf24)] animate-spin-slow opacity-85" />
                    </div>
                  )}

                  <div className="relative z-10 w-full flex items-center justify-center bg-slate-950 max-h-[220px] overflow-hidden">
                    <img
                      src={banner.imageUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400&auto=format&fit=crop'}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1400&auto=format&fit=crop';
                      }}
                      className="w-full h-auto max-h-[220px] object-cover sm:object-contain"
                    />
                  </div>
                </div>

                {/* PREVIEW: WINDOW 2 - Special Promo Window Below (Separate Window) */}
                {banner.displayMode !== 'full_image' && (
                  <div className="relative z-10 w-full rounded-xl bg-gradient-to-r from-[#021c16] via-[#04281f] to-[#021c16] border border-amber-500/50 p-3.5 sm:p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                    <div className="space-y-1 max-w-sm">
                      <div className="flex items-center gap-1.5">
                        {banner.badgeText && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow">
                            {banner.badgeText}
                          </span>
                        )}
                        <span className="text-[9px] text-amber-300 font-bold">
                          ✨ विशेष वैदिक AI ज्योतिष परामर्श
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                        {banner.title || 'शीर्षक यहाँ दिखेगा'}
                      </h4>
                      {banner.subtitle && (
                        <p className="text-[10px] sm:text-[11px] text-emerald-100/80 line-clamp-1 leading-relaxed">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 w-full sm:w-auto">
                      <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 w-full sm:w-auto">
                        <span>{banner.actionText || 'AI ज्योतिषी से पूछें ➔'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-3 space-y-2">
              <span className="text-[10px] text-slate-400 block">
                {language === 'hi'
                  ? '✨ यह बैनर वेबऐप के मुख्य पृष्ठ पर इसी एनिमेशन व ऑटो-एडजस्ट स्टाइल में दिखाई देगा।'
                  : '✨ This banner is displayed live with the selected animation style on the webapp.'}
              </span>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('free-kundali')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 text-[11px] font-bold transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{language === 'hi' ? 'वेबऐप के फ्रंट पेज पर जाएं' : 'View on WebApp Front Page'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

