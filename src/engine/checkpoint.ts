export type Answer = 'yes' | 'no' | 'unsure';

export type CheckpointQuestionId =
  | 'lessShedding'
  | 'fillIn'
  | 'thicker'
  | 'consistentUse'
  | 'photoBetter'
  | 'newThinning';

export const CHECKPOINT_WEEKS = [12, 24] as const;
export type CheckpointWeek = (typeof CHECKPOINT_WEEKS)[number];

export type CheckpointAnswers = Record<CheckpointQuestionId, Answer>;

/**
 * Every outcome is a clear verdict with one next action.
 * - on-track: the signs expected by this checkpoint are there
 * - early-signs: a partial positive (for example less shedding, no visible fill-in yet)
 * - not-responding: no positive sign after consistent use, or new thinning at week 24
 * - fix-routine: the routine was not followed on most days, so the check cannot judge it yet
 * - too-early: before week 12 nothing is expected to be judged
 * - need-better-look: most signs were "Not sure", so photos need to be retaken fairly
 */
export type CheckpointResult =
  | 'on-track'
  | 'early-signs'
  | 'not-responding'
  | 'fix-routine'
  | 'too-early'
  | 'need-better-look';

export const CHECKPOINT_RESULTS: readonly CheckpointResult[] = [
  'on-track',
  'early-signs',
  'not-responding',
  'fix-routine',
  'too-early',
  'need-better-look',
];

/** Signs that are about what the user sees. consistentUse and newThinning are handled separately. */
export const SIGNS = ['lessShedding', 'fillIn', 'thicker', 'photoBetter'] as const;
export type SignId = (typeof SIGNS)[number];
/** Visible change signs (what counts at week 24, a bonus at week 12). */
export const VISIBLE_SIGNS = ['fillIn', 'thicker', 'photoBetter'] as const;

/* ---- Thresholds. Clinical sign-off needed before real use (see README, CONTENT REVIEW). ---- */
export const FIRST_CHECKPOINT_WEEK = CHECKPOINT_WEEKS[0];
export const SECOND_CHECKPOINT_WEEK = CHECKPOINT_WEEKS[1];
/** "Need a better look" when at least this many of the 4 signs are "Not sure" (most of them). */
export const NEED_LOOK_MIN_UNSURE = 3;
/** Conservative "not responding": zero "yes" signs, and at most this many "Not sure". */
export const NOT_RESPONDING_MAX_YES = 0;
export const NOT_RESPONDING_MAX_UNSURE = 1;
/** Week 24: this many visible signs (fill-in, thicker, photo better) means on track. */
export const ON_TRACK_MIN_VISIBLE_W24 = 2;
/** Week 12: on track needs less shedding plus at least this many visible signs (the bonus). */
export const ON_TRACK_MIN_VISIBLE_W12 = 1;
/** Weeks until the next self-check after fixing the routine. */
export const FIX_ROUTINE_RECHECK_WEEKS = 8;
/** Weeks until the next self-check after a partial positive at week 24 or later. */
export const PARTIAL_RECHECK_WEEKS_W24 = 8;
/** Weeks until the next self-check when on track at week 24 or later (maintenance). */
export const MAINTENANCE_RECHECK_WEEKS = 12;

export type ReasonCode =
  | 'too-early'
  | 'low-adherence'
  | 'mostly-unsure'
  | 'w12-shed-and-visible'
  | 'w12-shed-only'
  | 'w12-visible-only'
  | 'w12-new-thinning'
  | 'w24-visible'
  | 'w24-partial'
  | 'w24-new-thinning'
  | 'no-positive';

/** How a single answer counted towards the verdict, for the "why this result" breakdown. */
export type SignRole = 'main' | 'bonus' | 'routine' | 'warning';
export type SignEffect = 'positive' | 'negative' | 'neutral';
export interface SignBreakdown {
  id: CheckpointQuestionId;
  answer: Answer;
  role: SignRole;
  effect: SignEffect;
}

export interface CheckpointOutcome {
  result: CheckpointResult;
  reason: ReasonCode;
  /** which checkpoint rules were used, null before week 12 */
  stage: CheckpointWeek | null;
  /** journey week of the next self-check, null when the next step is a consult or a retake now */
  nextWeek: number | null;
  /** 'primary' = the main action is a doctor; 'secondary' = offered as an option; 'none' = not shown */
  consult: 'primary' | 'secondary' | 'none';
  /** "yes" signs, in question order */
  yes: SignId[];
  breakdown: SignBreakdown[];
}

export function isCheckpointWeek(week: number): boolean {
  return (CHECKPOINT_WEEKS as readonly number[]).includes(week);
}

/** The checkpoint a check at this week belongs to, or null before week 12. */
export function checkpointForWeek(week: number | null): CheckpointWeek | null {
  if (week === null || week < FIRST_CHECKPOINT_WEEK) return null;
  return week >= SECOND_CHECKPOINT_WEEK ? SECOND_CHECKPOINT_WEEK : FIRST_CHECKPOINT_WEEK;
}

function breakdownFor(a: CheckpointAnswers, stage: CheckpointWeek | null): SignBreakdown[] {
  const effectOf = (ans: Answer, goodWhen: Answer): SignEffect =>
    ans === 'unsure' ? 'neutral' : ans === goodWhen ? 'positive' : 'negative';
  const rows: SignBreakdown[] = SIGNS.map((id) => ({
    id,
    answer: a[id],
    // At week 12 the main sign is less shedding and visible change is a bonus.
    // At week 24 visible change is what counts; less shedding is a supporting sign.
    role: stage === SECOND_CHECKPOINT_WEEK ? (id === 'lessShedding' ? 'bonus' : 'main') : id === 'lessShedding' ? 'main' : 'bonus',
    // A bonus sign that is "no" at week 12 is not held against the user: it is commonly not visible yet.
    effect:
      stage !== SECOND_CHECKPOINT_WEEK && id !== 'lessShedding' && a[id] === 'no' ? 'neutral' : effectOf(a[id], 'yes'),
  }));
  rows.push({ id: 'consistentUse', answer: a.consistentUse, role: 'routine', effect: a.consistentUse === 'no' ? 'negative' : a.consistentUse === 'yes' ? 'positive' : 'neutral' });
  rows.push({ id: 'newThinning', answer: a.newThinning, role: 'warning', effect: a.newThinning === 'yes' ? 'negative' : a.newThinning === 'no' ? 'positive' : 'neutral' });
  return rows;
}

/**
 * Week-aware checkpoint scoring. Rules are applied in this order:
 * 1. Before week 12: too-early (no verdict).
 * 2. Routine not followed on most days: fix-routine (recheck in FIX_ROUTINE_RECHECK_WEEKS, consult offered).
 * 3. At least NEED_LOOK_MIN_UNSURE of the 4 signs "Not sure": need-better-look.
 * 4. Week 12 rules (weeks 12 to 23):
 *    less shedding + at least one visible sign, no new thinning -> on-track (next: week 24)
 *    less shedding or a visible sign -> early-signs (next: week 24; consult offered if new thinning)
 * 5. Week 24 rules (week 24 onwards):
 *    new thinning -> not-responding (consult)
 *    at least ON_TRACK_MIN_VISIBLE_W24 visible signs -> on-track
 *    one visible sign or less shedding -> early-signs (recheck in PARTIAL_RECHECK_WEEKS_W24, consult offered)
 * 6. No "yes" at all: not-responding when at most NOT_RESPONDING_MAX_UNSURE "Not sure",
 *    otherwise need-better-look.
 * When week is not given, week 12 rules apply.
 */
export function scoreCheckpoint(a: CheckpointAnswers, week?: number | null): CheckpointOutcome {
  const w = week === undefined || week === null ? FIRST_CHECKPOINT_WEEK : Math.max(1, Math.floor(week));
  const stage = checkpointForWeek(w);
  const yes = SIGNS.filter((s) => a[s] === 'yes');
  const unsure = SIGNS.filter((s) => a[s] === 'unsure').length;
  const visible = VISIBLE_SIGNS.filter((s) => a[s] === 'yes').length;
  const lessShed = a.lessShedding === 'yes';
  const thinning = a.newThinning === 'yes';
  const breakdown = breakdownFor(a, stage);
  const out = (
    result: CheckpointResult,
    reason: ReasonCode,
    nextWeek: number | null,
    consult: CheckpointOutcome['consult'],
  ): CheckpointOutcome => ({ result, reason, stage, nextWeek, consult, yes, breakdown });

  if (stage === null) return out('too-early', 'too-early', FIRST_CHECKPOINT_WEEK, 'none');
  if (a.consistentUse === 'no') return out('fix-routine', 'low-adherence', w + FIX_ROUTINE_RECHECK_WEEKS, 'secondary');
  if (unsure >= NEED_LOOK_MIN_UNSURE) return out('need-better-look', 'mostly-unsure', null, 'none');

  if (stage === FIRST_CHECKPOINT_WEEK) {
    if (lessShed || visible > 0) {
      if (thinning) return out('early-signs', 'w12-new-thinning', SECOND_CHECKPOINT_WEEK, 'secondary');
      if (lessShed && visible >= ON_TRACK_MIN_VISIBLE_W12) return out('on-track', 'w12-shed-and-visible', SECOND_CHECKPOINT_WEEK, 'none');
      return out('early-signs', lessShed ? 'w12-shed-only' : 'w12-visible-only', SECOND_CHECKPOINT_WEEK, 'none');
    }
  } else {
    if (thinning) return out('not-responding', 'w24-new-thinning', null, 'primary');
    if (visible >= ON_TRACK_MIN_VISIBLE_W24) return out('on-track', 'w24-visible', w + MAINTENANCE_RECHECK_WEEKS, 'none');
    if (visible > 0 || lessShed) return out('early-signs', 'w24-partial', w + PARTIAL_RECHECK_WEEKS_W24, 'secondary');
  }

  if (yes.length <= NOT_RESPONDING_MAX_YES && unsure <= NOT_RESPONDING_MAX_UNSURE) {
    return out('not-responding', 'no-positive', null, 'primary');
  }
  return out('need-better-look', 'mostly-unsure', null, 'none');
}
