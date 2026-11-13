export type Answer = 'yes' | 'no' | 'unsure';

export type CheckpointQuestionId =
  | 'lessShedding'
  | 'fillIn'
  | 'thicker'
  | 'consistentUse'
  | 'photoBetter'
  | 'newThinning';

export const CHECKPOINT_WEEKS = [12, 24] as const;

export type CheckpointAnswers = Record<CheckpointQuestionId, Answer>;

export type CheckpointResult = 'responding' | 'unclear' | 'not-responding';

export interface CheckpointOutcome {
  result: CheckpointResult;
  /** true when the user used the routine on fewer than ~80% of days */
  lowAdherence: boolean;
  /** true when the guidance should point to a doctor consult */
  consult: boolean;
  /** true when fixing the routine first is recommended (no blame) */
  fixRoutineFirst: boolean;
  score: number;
}

/** Questions where "yes" is a positive sign. */
const POSITIVE: CheckpointQuestionId[] = ['lessShedding', 'fillIn', 'thicker', 'photoBetter'];

export const RESPONDING_MIN_SCORE = 3;
export const NOT_RESPONDING_MAX_SCORE = 1;

export function isCheckpointWeek(week: number): boolean {
  return (CHECKPOINT_WEEKS as readonly number[]).includes(week);
}

/** Earliest week at which a check counts as a real checkpoint. */
export const FIRST_CHECKPOINT_WEEK = CHECKPOINT_WEEKS[0];

/** The checkpoint a check at this week belongs to, or null for an early peek. */
export function checkpointForWeek(week: number | null): 12 | 24 | null {
  if (week === null || week < FIRST_CHECKPOINT_WEEK) return null;
  return week >= CHECKPOINT_WEEKS[1] ? 24 : 12;
}

export function scoreCheckpoint(a: CheckpointAnswers, week?: number | null): CheckpointOutcome {
  let score = 0;
  let unsure = 0;
  for (const q of POSITIVE) {
    if (a[q] === 'yes') score += 1;
    else if (a[q] === 'unsure') unsure += 1;
  }
  if (a.newThinning === 'yes') score -= 1;
  const lowAdherence = a.consistentUse === 'no';

  let result: CheckpointResult;
  if (score >= RESPONDING_MIN_SCORE && a.newThinning !== 'yes') result = 'responding';
  // "Not sure" is neutral: with half or more of the signs unsure we cannot call it negative.
  else if (score <= NOT_RESPONDING_MAX_SCORE && unsure < 2) result = 'not-responding';
  else result = 'unclear';

  // Before week 12 nothing is expected yet, so an early peek never says "not responding" or prompts a consult.
  if (week !== undefined && week !== null && week < FIRST_CHECKPOINT_WEEK && result === 'not-responding') result = 'unclear';
  const early = week !== undefined && week !== null && week < FIRST_CHECKPOINT_WEEK;
  const consult = !early && (result === 'not-responding' || (result === 'unclear' && lowAdherence));
  return { result, lowAdherence, consult, fixRoutineFirst: !early && lowAdherence && result !== 'responding', score };
}
