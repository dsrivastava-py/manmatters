export type ShedAmount = 'a-bit-more' | 'clearly-more' | 'clumps-or-patches';
export type Irritation = 'none' | 'mild' | 'severe';

export interface RedFlags {
  swelling: boolean;
  dizziness: boolean;
  chest: boolean;
  severeIrritation: boolean;
}

export const NO_FLAGS: RedFlags = {
  swelling: false,
  dizziness: false,
  chest: false,
  severeIrritation: false,
};

export interface ShedInput {
  week: number;
  amount: ShedAmount;
  irritation: Irritation;
  flags?: Partial<RedFlags>;
}

export type ShedOutcome =
  | 'doctor-now'
  | 'see-doctor-soon'
  | 'commonly-reported'
  | 'unusual-for-week';

/** Weeks in which more shedding is commonly reported. */
export const COMMON_SHED_WEEKS = { from: 2, to: 8 };
/** Beyond this week, clearly more shedding is worth a doctor visit. */
export const SHED_CONCERN_AFTER_WEEK = 8;
export const SHED_UNUSUAL_AFTER_WEEK = 12;

export function hasRedFlag(input: Pick<ShedInput, 'irritation' | 'flags'>): boolean {
  const f = input.flags ?? {};
  return (
    input.irritation === 'severe' ||
    !!f.swelling ||
    !!f.dizziness ||
    !!f.chest ||
    !!f.severeIrritation
  );
}

export function shedCheck(input: ShedInput): ShedOutcome {
  // Red flags always override everything else.
  if (hasRedFlag(input)) return 'doctor-now';

  const { week, amount } = input;
  if (amount === 'clumps-or-patches') return 'see-doctor-soon';
  if (week > SHED_UNUSUAL_AFTER_WEEK) return 'unusual-for-week';
  if (week > SHED_CONCERN_AFTER_WEEK) {
    // Weeks 9-12: a bit more is still plausible, clearly more deserves a doctor.
    return amount === 'clearly-more' ? 'see-doctor-soon' : 'commonly-reported';
  }
  // Weeks 1-8 without flags: more shedding is commonly reported.
  return 'commonly-reported';
}

/** Days until a calm re-check after a commonly reported result. */
export const SHED_RECHECK_DAYS = 14;

/**
 * The "Kab tak?" answer for a shed check result.
 * - now: stop and get medical help now
 * - consult: do not wait it out, talk to a doctor this week
 * - settles: commonly reported to ease off by weeks {from} to {to}; check again in SHED_RECHECK_DAYS
 * - watch: past the usual shed window, a bit more is still plausible; check again in SHED_RECHECK_DAYS
 */
export type ShedNext =
  | { kind: 'now' }
  | { kind: 'consult' }
  | { kind: 'settles'; from: number; to: number; recheckDays: number }
  | { kind: 'watch'; recheckDays: number };

/** settleRange is the shed-settling phase, passed in from phases.ts. */
export function shedNext(outcome: ShedOutcome, week: number, settleRange: { from: number; to: number }): ShedNext {
  if (outcome === 'doctor-now') return { kind: 'now' };
  if (outcome !== 'commonly-reported') return { kind: 'consult' };
  const w = Math.max(1, Math.floor(week));
  if (w <= settleRange.to) {
    return { kind: 'settles', from: Math.max(w, settleRange.from), to: settleRange.to, recheckDays: SHED_RECHECK_DAYS };
  }
  return { kind: 'watch', recheckDays: SHED_RECHECK_DAYS };
}
