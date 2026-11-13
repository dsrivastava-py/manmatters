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

export function scoreCheckpoint(a: CheckpointAnswers): CheckpointOutcome {
  let score = 0;
  for (const q of POSITIVE) if (a[q] === 'yes') score += 1;
  if (a.newThinning === 'yes') score -= 1;
  const lowAdherence = a.consistentUse === 'no';

  let result: CheckpointResult;
  if (score >= RESPONDING_MIN_SCORE && a.newThinning !== 'yes') result = 'responding';
  else if (score <= NOT_RESPONDING_MAX_SCORE) result = 'not-responding';
  else result = 'unclear';

  const consult = result === 'not-responding' || (result === 'unclear' && lowAdherence);
  return { result, lowAdherence, consult, fixRoutineFirst: lowAdherence && result !== 'responding', score };
}
