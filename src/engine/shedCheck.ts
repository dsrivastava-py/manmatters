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
