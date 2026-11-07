export interface ThemeColors {
  primary: string;        // e.g. #047857 (emerald-700)
  primaryHover: string;   // e.g. #065f46 (emerald-800)
  secondary: string;      // e.g. #0f291e (deep forest)
  accentGold: string;     // e.g. #f59e0b (amber-500 gold)
  accentGoldHover: string;
  background: string;     // e.g. #eaf6ed (soft sage)
  cardBg: string;         // e.g. #ffffff (or #0f172a)
  cardBgMuted: string;    // e.g. #f1f8f3
  textMain: string;       // e.g. #0f291e
  textMuted: string;      // e.g. #4b5563
  headingText?: string;   // Custom heading color
  accentText?: string;    // Custom highlight accent color
  border: string;         // e.g. #a7f3d0
  headerBg: string;       // e.g. #064e3b
  headerText: string;     // e.g. #ffffff
  isDark: boolean;
}

export type SupportedFontFamily =
  | 'noto_devanagari'
  | 'rozha_one'
  | 'poppins'
  | 'outfit'
  | 'cinzel'
  | 'yatra_one'
  | 'kalam'
  | 'playfair'
  | 'system';

export interface AppThemeConfig {
  id: string;
  nameHi: string;
  nameEn: string;
  descriptionHi: string;
  descriptionEn: string;
  colors: ThemeColors;
  borderRadius: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fontFamily: SupportedFontFamily;
  headingColor?: string;
  version: number;
  updatedAt: string;
}

export const THEME_PRESETS: Record<string, AppThemeConfig> = {
  vedic_emerald: {
    id: 'vedic_emerald',
    nameHi: '🌿 वैदिक पन्ना (Emerald Classic - Default)',
    nameEn: 'Vedic Emerald Classic (Default)',
    descriptionHi: 'पारंपरिक सुखद हरा और स्वर्णिम ज्योतिषी आभा',
    descriptionEn: 'Traditional calming emerald green with auspicious golden accents',
    borderRadius: '2xl',
    fontFamily: 'noto_devanagari',
    version: 1,
    updatedAt: '2026-01-01T00:00:00.000Z',
    colors: {
      primary: '#047857',
      primaryHover: '#065f46',
      secondary: '#064e3b',
      accentGold: '#f59e0b',
      accentGoldHover: '#d97706',
      background: '#eaf6ed',
      cardBg: '#ffffff',
      cardBgMuted: '#f4fbf6',
      textMain: '#0f291e',
      textMuted: '#475569',
      border: '#a7f3d0',
      headerBg: '#064e3b',
      headerText: '#ffffff',
      isDark: false,
    },
  },
  royal_gold: {
    id: 'royal_gold',
    nameHi: '👑 राजसी स्वर्ण (Royal Golden Saffron)',
    nameEn: 'Royal Golden Saffron',
    descriptionHi: 'भव्य स्वर्णिम व केसरिया दिव्य राजयोग रंग',
    descriptionEn: 'Opulent saffron gold with deep imperial contrast',
    borderRadius: '2xl',
    fontFamily: 'noto_devanagari',
    version: 1,
    updatedAt: '2026-01-01T00:00:00.000Z',
    colors: {
      primary: '#b45309',
      primaryHover: '#92400e',
      secondary: '#78350f',
      accentGold: '#fbbf24',
      accentGoldHover: '#f59e0b',
      background: '#fef9ee',
      cardBg: '#ffffff',
      cardBgMuted: '#fffbeb',
      textMain: '#291b07',
      textMuted: '#713f12',
      border: '#fde68a',
      headerBg: '#451a03',
      headerText: '#fef3c7',
      isDark: false,
    },
  },
  cosmic_midnight: {
    id: 'cosmic_midnight',
    nameHi: '🌌 नवग्रह आकाशगंगा (Cosmic Midnight Dark)',
    nameEn: 'Cosmic Midnight Dark',
    descriptionHi: 'गहरा ब्रह्मांडीय अंतरिक्ष, चमकते नक्षत्र व सोने का तेज',
    descriptionEn: 'Deep celestial space blue with glowing nebula amber',
    borderRadius: '2xl',
    fontFamily: 'noto_devanagari',
    version: 1,
    updatedAt: '2026-01-01T00:00:00.000Z',
    colors: {
      primary: '#10b981',
      primaryHover: '#059669',
      secondary: '#0f172a',
      accentGold: '#fbbf24',
      accentGoldHover: '#f59e0b',
      background: '#090d16',
      cardBg: '#0f172a',
      cardBgMuted: '#1e293b',
      textMain: '#f1f5f9',
      textMuted: '#94a3b8',
      border: '#1e293b',
      headerBg: '#050b14',
      headerText: '#f8fafc',
      isDark: true,
    },
  },
  brahma_divine_saffron: {
    id: 'brahma_divine_saffron',
    nameHi: '🪔 दिव्य सिंदूरी व केसर (Divine Saffron Temple)',
    nameEn: 'Divine Saffron Temple',
    descriptionHi: 'पवित्र अग्नि, मंदिर दीप व मंगलकारी सिंदूरी ऊर्जा',
    descriptionEn: 'Sacred fire, temple diya and auspicious vermilion energies',
    borderRadius: '2xl',
    fontFamily: 'noto_devanagari',
    version: 1,
    updatedAt: '2026-01-01T00:00:00.000Z',
    colors: {
      primary: '#c2410c',
      primaryHover: '#9a3412',
      secondary: '#7c2d12',
      accentGold: '#eab308',
      accentGoldHover: '#ca8a04',
      background: '#fff7ed',
      cardBg: '#ffffff',
      cardBgMuted: '#ffedd5',
      textMain: '#431407',
      textMuted: '#9a3412',
      border: '#fed7aa',
      headerBg: '#431407',
      headerText: '#ffedd5',
      isDark: false,
    },
  },
  shani_amethyst: {
    id: 'shani_amethyst',
    nameHi: '🔮 नीलम व जामुनी रहस्य (Mystic Amethyst)',
    nameEn: 'Mystic Amethyst & Sapphire',
    descriptionHi: 'गहन चिंतन, ध्यान, रहस्यमयी ज्योतिषीय शक्ति',
    descriptionEn: 'Meditative violet sapphire for intuition and secret wisdom',
    borderRadius: '2xl',
    fontFamily: 'noto_devanagari',
    version: 1,
    updatedAt: '2026-01-01T00:00:00.000Z',
    colors: {
      primary: '#6d28d9',
      primaryHover: '#5b21b6',
      secondary: '#2e1065',
      accentGold: '#f59e0b',
      accentGoldHover: '#d97706',
      background: '#faf5ff',
      cardBg: '#ffffff',
      cardBgMuted: '#f3e8ff',
      textMain: '#1e1b4b',
      textMuted: '#581c87',
      border: '#e9d5ff',
      headerBg: '#2e1065',
      headerText: '#faf5ff',
      isDark: false,
    },
  },
};

export const DEFAULT_THEME = THEME_PRESETS.vedic_emerald;
