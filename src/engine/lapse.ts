export type LapseOutcome = 'short-gap' | 'lapse-reset-expectations' | 'long-gap-consult';

export const SHORT_GAP_MAX_DAYS = 3;
export const LAPSE_MAX_DAYS = 28;

export interface LapseInput {
  daysSkipped: number;
  weeksSinceStart: number;
}

export function lapseCheck({ daysSkipped, weeksSinceStart }: LapseInput): LapseOutcome {
  const d = Math.max(0, Math.floor(daysSkipped));
  if (d <= SHORT_GAP_MAX_DAYS) return 'short-gap';
  // Early in the journey, a long gap is mostly a restart of expectations.
  if (d > LAPSE_MAX_DAYS || (weeksSinceStart >= 12 && d > 14)) return 'long-gap-consult';
  return 'lapse-reset-expectations';
}

/**
 * How many weeks the timeline commonly moves later after a gap.
 * Short gaps make little difference; longer gaps move it by about the length of the gap.
 */
export function lapseShiftWeeks(daysSkipped: number): number {
  const d = Math.max(0, Math.floor(daysSkipped));
  if (d <= SHORT_GAP_MAX_DAYS) return 0;
  return Math.ceil(d / 7);
}
