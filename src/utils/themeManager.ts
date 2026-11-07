import { AppThemeConfig, DEFAULT_THEME, THEME_PRESETS } from '../types/theme';

const STORAGE_KEY = 'astrodost_global_theme';

export function getLocalStoredTheme(): AppThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.colors) {
        return { ...DEFAULT_THEME, ...parsed };
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_THEME;
}

export function saveLocalStoredTheme(theme: AppThemeConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // ignore
  }
}

export const FONT_FAMILY_MAP: Record<string, string> = {
  noto_devanagari: "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  rozha_one: "'Rozha One', 'Noto Sans Devanagari', serif",
  poppins: "'Poppins', 'Noto Sans Devanagari', sans-serif",
  outfit: "'Outfit', 'Noto Sans Devanagari', sans-serif",
  cinzel: "'Cinzel', 'Noto Sans Devanagari', serif",
  yatra_one: "'Yatra One', 'Noto Sans Devanagari', cursive",
  kalam: "'Kalam', 'Noto Sans Devanagari', cursive",
  playfair: "'Playfair Display', 'Noto Sans Devanagari', serif",
  system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

/**
 * Injects CSS custom properties into :root dynamically so all components,
 * cards, modals, borders, headers, buttons and text adopt the theme instantaneously.
 */
export function applyThemeToDOM(theme: AppThemeConfig): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const c = theme.colors;

  // Primary palette
  root.style.setProperty('--theme-primary', c.primary);
  root.style.setProperty('--theme-primary-hover', c.primaryHover);
  root.style.setProperty('--theme-secondary', c.secondary);

  // Accent & Gold
  root.style.setProperty('--theme-accent-gold', c.accentGold);
  root.style.setProperty('--theme-accent-gold-hover', c.accentGoldHover);

  // Background & Cards
  root.style.setProperty('--theme-background', c.background);
  root.style.setProperty('--theme-card-bg', c.cardBg);
  root.style.setProperty('--theme-card-bg-muted', c.cardBgMuted);

  // Typography & Borders
  root.style.setProperty('--theme-text-main', c.textMain);
  root.style.setProperty('--theme-text-muted', c.textMuted);
  root.style.setProperty('--theme-border', c.border);

  // Dynamic Typography Font & Colors
  const fontCss = FONT_FAMILY_MAP[theme.fontFamily] || FONT_FAMILY_MAP.noto_devanagari;
  root.style.setProperty('--theme-font-family', fontCss);
  document.body.style.fontFamily = fontCss;

  const headingColor = c.headingText || theme.headingColor || c.accentGold || '#f59e0b';
  root.style.setProperty('--theme-heading-text', headingColor);

  const accentTextColor = c.accentText || c.accentGold || '#fbbf24';
  root.style.setProperty('--theme-accent-text', accentTextColor);

  // Header & Navigation
  root.style.setProperty('--theme-header-bg', c.headerBg);
  root.style.setProperty('--theme-header-text', c.headerText);

  // Dark/Light classes and theme-color meta tag
  if (c.isDark) {
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
  } else {
    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
  }

  // Update browser mobile status bar meta tag
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', c.headerBg || c.primary);
  }

  // Set body background and text
  document.body.style.backgroundColor = c.background;
  document.body.style.color = c.textMain;

  // Dispatch custom event for reactive components
  window.dispatchEvent(new CustomEvent('astrodost_theme_applied', { detail: theme }));
}

/**
 * Fetches the master theme from the server (/api/theme).
 * If server is available, syncs local storage and applies to DOM.
 * If server is offline, gracefully uses safe local or default theme.
 */
export async function syncThemeFromServer(): Promise<AppThemeConfig> {
  try {
    const res = await fetch('/api/theme');
    if (res.ok) {
      const data = await res.json();
      if (data && data.theme && data.theme.colors) {
        saveLocalStoredTheme(data.theme);
        applyThemeToDOM(data.theme);
        return data.theme;
      }
    }
  } catch (err) {
    console.warn('Theme server sync offline, using local theme:', err);
  }

  const local = getLocalStoredTheme();
  applyThemeToDOM(local);
  return local;
}

/**
 * Persists theme both to the server (/api/admin/theme) and to local storage.
 * Requires admin authentication header if configured.
 */
export async function persistThemeToServer(
  theme: AppThemeConfig,
  adminPin?: string
): Promise<{ success: boolean; theme?: AppThemeConfig; error?: string }> {
  try {
    const res = await fetch('/api/admin/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminPin ? { 'x-admin-pin': adminPin } : {}),
      },
      body: JSON.stringify({ theme }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      saveLocalStoredTheme(data.theme);
      applyThemeToDOM(data.theme);
      return { success: true, theme: data.theme };
    }
    return { success: false, error: data.error || 'Failed to persist theme on server' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error saving theme' };
  }
}
