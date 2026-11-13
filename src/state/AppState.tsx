import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { clearAllData, loadData, updateData } from '../lib/storage';
import type { AppData } from '../lib/storage';
import { getContent } from '../content';
import type { Content, Lang } from '../content';
import { weekFromStartDate } from '../engine/phases';
import { applyTheme, readThemePref, resolveTheme, writeThemePref } from '../lib/theme';
import type { Theme, ThemePref } from '../lib/theme';

export function todayISO(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return todayISO(d);
}

interface Ctx {
  data: AppData;
  t: Content;
  lang: Lang;
  week: number | null;
  setLang: (l: Lang) => void;
  setStartDate: (iso: string) => void;
  patch: (p: Partial<AppData>) => void;
  clearAll: () => void;
  themePref: ThemePref;
  theme: Theme;
  setThemePref: (p: ThemePref) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());

  const patch = useCallback((p: Partial<AppData>) => setData(updateData(p)), []);
  const setLang = useCallback((language: Lang) => patch({ language }), [patch]);
  const setStartDate = useCallback((startDate: string) => patch({ startDate, onboardingSeen: true }), [patch]);
  const [themePref, setPref] = useState<ThemePref>(() => readThemePref());
  const [theme, setTheme] = useState<Theme>(() => resolveTheme(readThemePref()));
  const setThemePref = useCallback((p: ThemePref) => {
    writeThemePref(p);
    setPref(p);
  }, []);
  const clearAll = useCallback(() => {
    setData(clearAllData());
    setThemePref('system');
  }, [setThemePref]);

  useEffect(() => {
    const update = () => setTheme(resolveTheme(themePref));
    update();
    if (themePref !== 'system') return;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    mq?.addEventListener?.('change', update);
    return () => mq?.removeEventListener?.('change', update);
  }, [themePref]);

  useEffect(() => applyTheme(theme), [theme]);

  useEffect(() => {
    document.documentElement.lang = data.language === 'en' ? 'en' : 'hi-Latn';
  }, [data.language]);

  const week = useMemo(() => {
    if (!data.startDate) return null;
    try {
      return weekFromStartDate(data.startDate);
    } catch {
      return null;
    }
  }, [data.startDate]);

  const value: Ctx = {
    data,
    t: getContent(data.language),
    lang: data.language,
    week,
    setLang,
    setStartDate,
    patch,
    clearAll,
    themePref,
    theme,
    setThemePref,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
}

export const fill = (tpl: string, vars: Record<string, string | number>): string =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
