import { THEME_COLORS, THEME_KEY } from '../config';

export type ThemePref = 'light' | 'dark' | 'system';
export type Theme = 'light' | 'dark';

export function readThemePref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function writeThemePref(p: ThemePref): void {
  try {
    if (p === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, p);
  } catch {
    /* private mode: the choice still applies for this session */
  }
}

export function systemTheme(): Theme {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(p: ThemePref): Theme {
  return p === 'system' ? systemTheme() : p;
}

/** Sets data-theme on <html> and the browser UI colour. Mirrors the inline script in index.html. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    m.content = THEME_COLORS[theme];
  });
}
