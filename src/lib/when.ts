import type { Content } from '../content';
import { fill } from '../state/AppState';

/** "12 Mar 2026" style, built from calendar fields so time zones cannot shift it. */
export function formatDate(iso: string, locale: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  try {
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(Date.UTC(y, m - 1, d)),
    );
  } catch {
    return iso;
  }
}

/** "today", "this week", "in 1 week", "in N weeks" from a number of days away. */
export function whenPhrase(t: Content, daysAway: number): string {
  const w = t.ui.when;
  if (daysAway <= 0) return w.today;
  if (daysAway < 7) return w.thisWeek;
  const n = Math.round(daysAway / 7);
  return n === 1 ? w.inOne : fill(w.inN, { n });
}

/** Whole days from today to a YYYY-MM-DD date (negative if in the past). */
export function daysUntil(iso: string, todayIso: string): number {
  const utc = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((utc(iso) - utc(todayIso)) / 86_400_000);
}
