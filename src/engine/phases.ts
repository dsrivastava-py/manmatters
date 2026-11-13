export type PhaseId =
  | 'settling-in'
  | 'shed-settling'
  | 'early-signs'
  | 'checkpoint-1'
  | 'building'
  | 'checkpoint-2'
  | 'maintenance';

export interface PhaseDef {
  id: PhaseId;
  /** first week (inclusive) */
  from: number;
  /** last week (inclusive); null means open ended */
  to: number | null;
}

/** Phase boundaries are config data. Must be sorted and contiguous. */
export const PHASES: readonly PhaseDef[] = [
  { id: 'settling-in', from: 1, to: 4 },
  { id: 'shed-settling', from: 5, to: 8 },
  { id: 'early-signs', from: 9, to: 11 },
  { id: 'checkpoint-1', from: 12, to: 12 },
  { id: 'building', from: 13, to: 23 },
  { id: 'checkpoint-2', from: 24, to: 24 },
  { id: 'maintenance', from: 25, to: null },
];

export const MAX_PAST_DAYS = 365 * 3;

export function getPhase(weekNumber: number): PhaseId {
  const w = Math.max(1, Math.floor(weekNumber));
  for (const p of PHASES) {
    if (w >= p.from && (p.to === null || w <= p.to)) return p.id;
  }
  return 'maintenance';
}

export type DateErrorCode = 'invalid' | 'future' | 'too-old';

export class DateError extends Error {
  code: DateErrorCode;
  constructor(code: DateErrorCode) {
    super(`Invalid start date: ${code}`);
    this.name = 'DateError';
    this.code = code;
  }
}

/** Parse YYYY-MM-DD (or a Date, using its local calendar fields) to a UTC day number. */
function toDayNumber(d: string | Date): number {
  let y: number;
  let m: number;
  let day: number;
  if (typeof d === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
    if (!match) throw new DateError('invalid');
    y = Number(match[1]);
    m = Number(match[2]);
    day = Number(match[3]);
  } else {
    if (Number.isNaN(d.getTime())) throw new DateError('invalid');
    y = d.getFullYear();
    m = d.getMonth() + 1;
    day = d.getDate();
  }
  const ms = Date.UTC(y, m - 1, day);
  const check = new Date(ms);
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== day) {
    throw new DateError('invalid');
  }
  return Math.round(ms / 86_400_000);
}

/** Whole calendar days from start to today. Uses calendar fields only, so DST cannot shift it. */
export function daysSince(start: string | Date, today: string | Date = new Date()): number {
  const diff = toDayNumber(today) - toDayNumber(start);
  if (diff < 0) throw new DateError('future');
  if (diff > MAX_PAST_DAYS) throw new DateError('too-old');
  return diff;
}

/** Week 1 covers days 0-6 since the start date. */
export function weekFromStartDate(start: string | Date, today: string | Date = new Date()): number {
  return Math.floor(daysSince(start, today) / 7) + 1;
}

export function phaseRange(id: PhaseId): { from: number; to: number | null } {
  const p = PHASES.find((x) => x.id === id)!;
  return { from: p.from, to: p.to };
}

/* ---------- Journey timeline ("Kab tak?") ---------- */

export type JourneyId =
  | 'start'
  | 'shed-window'
  | 'settling'
  | 'early-signs'
  | 'checkpoint-1'
  | 'visible-change'
  | 'checkpoint-2'
  | 'maintenance';

export interface JourneyStep {
  id: JourneyId;
  /** first week (inclusive). Week 0 means the start date itself. */
  from: number;
  /** last week (inclusive); null means open ended */
  to: number | null;
  /** the PHASES entry this step reuses, null for the start marker */
  phase: PhaseId | null;
  /** a checkpoint (a moment to self-check), not a window */
  checkpoint: boolean;
}

/** Built from PHASES so there is one source of truth for week boundaries. */
export const JOURNEY: readonly JourneyStep[] = [
  { id: 'start', from: 0, to: 0, phase: null, checkpoint: false },
  { id: 'shed-window', ...phaseRange('settling-in'), phase: 'settling-in', checkpoint: false },
  { id: 'settling', ...phaseRange('shed-settling'), phase: 'shed-settling', checkpoint: false },
  { id: 'early-signs', ...phaseRange('early-signs'), phase: 'early-signs', checkpoint: false },
  { id: 'checkpoint-1', ...phaseRange('checkpoint-1'), phase: 'checkpoint-1', checkpoint: true },
  { id: 'visible-change', ...phaseRange('building'), phase: 'building', checkpoint: false },
  { id: 'checkpoint-2', ...phaseRange('checkpoint-2'), phase: 'checkpoint-2', checkpoint: true },
  { id: 'maintenance', ...phaseRange('maintenance'), phase: 'maintenance', checkpoint: false },
];

/** Index in JOURNEY of the step the user is in now (never the start marker). */
export function journeyIndex(weekNumber: number): number {
  const phase = getPhase(weekNumber);
  return JOURNEY.findIndex((s) => s.phase === phase);
}

/** The next step after the current one, with the week it begins. Null once in maintenance. */
export function nextMilestone(weekNumber: number): { step: JourneyStep; week: number; weeksAway: number } | null {
  const i = journeyIndex(weekNumber);
  const next = JOURNEY[i + 1];
  if (!next) return null;
  const w = Math.max(1, Math.floor(weekNumber));
  return { step: next, week: next.from, weeksAway: next.from - w };
}

/* ---------- Calendar helpers ---------- */

function fromDayNumber(n: number): string {
  const d = new Date(n * 86_400_000);
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${d.getUTCFullYear()}-${m}-${day}`;
}

/** YYYY-MM-DD plus a number of days, calendar based (DST safe). */
export function addDaysISO(iso: string, days: number): string {
  return fromDayNumber(toDayNumber(iso) + Math.round(days));
}

/** First calendar day of a journey week. Week 1 starts on the start date. */
export function weekStartISO(startISO: string, weekNumber: number): string {
  return addDaysISO(startISO, (Math.max(1, Math.floor(weekNumber)) - 1) * 7);
}
