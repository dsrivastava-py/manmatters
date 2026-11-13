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
