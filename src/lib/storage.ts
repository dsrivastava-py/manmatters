import { STORAGE_KEY, STORAGE_VERSION } from '../config';
import { CHECKPOINT_RESULTS, scoreCheckpoint } from '../engine/checkpoint';
import type { CheckpointAnswers, CheckpointResult } from '../engine/checkpoint';
import type { ShedOutcome } from '../engine/shedCheck';

import type { Lang } from '../content/types';
export type { Lang };

export interface StoredCheckpoint {
  week: 12 | 24;
  date: string; // YYYY-MM-DD
  result: CheckpointResult;
  answers: CheckpointAnswers;
}

export interface StoredShedCheck {
  date: string;
  week: number;
  outcome: ShedOutcome;
}

export interface AppData {
  version: number;
  startDate: string | null;
  language: Lang;
  checkpoints: StoredCheckpoint[];
  lastShedCheck: StoredShedCheck | null;
  onboardingSeen: boolean;
  routineTicks: Record<string, boolean>;
}

export function defaultData(): AppData {
  return {
    version: STORAGE_VERSION,
    startDate: null,
    language: 'en',
    checkpoints: [],
    lastShedCheck: null,
    onboardingSeen: false,
    routineTicks: {},
  };
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ANSWERS = ['yes', 'no', 'unsure'];
const Q_IDS = ['lessShedding', 'fillIn', 'thicker', 'consistentUse', 'photoBetter', 'newThinning'];
/** Results saved before the week-aware checkpoint. They are re-scored from the saved answers on load. */
const LEGACY_RESULTS = ['responding', 'unclear'];
const RESULTS: readonly string[] = [...CHECKPOINT_RESULTS, ...LEGACY_RESULTS];
const OUTCOMES = ['doctor-now', 'see-doctor-soon', 'commonly-reported', 'unusual-for-week'];

function validCheckpoint(c: unknown): c is StoredCheckpoint {
  if (!isObj(c)) return false;
  if (c.week !== 12 && c.week !== 24) return false;
  if (typeof c.date !== 'string' || !DATE_RE.test(c.date)) return false;
  if (typeof c.result !== 'string' || !RESULTS.includes(c.result)) return false;
  if (!isObj(c.answers)) return false;
  const answers = c.answers;
  return Q_IDS.every((q) => typeof answers[q] === 'string' && ANSWERS.includes(answers[q] as string));
}

function validShed(s: unknown): s is StoredShedCheck {
  return (
    isObj(s) &&
    typeof s.date === 'string' &&
    DATE_RE.test(s.date) &&
    typeof s.week === 'number' &&
    typeof s.outcome === 'string' &&
    OUTCOMES.includes(s.outcome)
  );
}

/** Returns validated data, or null if the shape is wrong. */
export function validate(raw: unknown): AppData | null {
  if (!isObj(raw) || raw.version !== STORAGE_VERSION) return null;
  if (raw.startDate !== null && (typeof raw.startDate !== 'string' || !DATE_RE.test(raw.startDate))) return null;
  if (raw.language !== 'en' && raw.language !== 'hinglish') return null;
  if (!Array.isArray(raw.checkpoints) || !raw.checkpoints.every(validCheckpoint)) return null;
  if (raw.lastShedCheck !== null && !validShed(raw.lastShedCheck)) return null;
  if (typeof raw.onboardingSeen !== 'boolean') return null;
  if (!isObj(raw.routineTicks) || !Object.values(raw.routineTicks).every((v) => typeof v === 'boolean')) return null;
  const data = raw as unknown as AppData;
  return {
    ...data,
    checkpoints: data.checkpoints.map((c) =>
      LEGACY_RESULTS.includes(c.result) ? { ...c, result: scoreCheckpoint(c.answers, c.week).result } : c,
    ),
  };
}

let memory: AppData | null = null;
let persistFailed = false;

function store(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function loadData(): AppData {
  if (persistFailed && memory) return memory;
  const s = store();
  if (s) {
    try {
      const text = s.getItem(STORAGE_KEY);
      if (text !== null) {
        const ok = validate(JSON.parse(text));
        if (ok) return ok;
        // Corrupt or outdated: reset safely.
        try {
          s.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        return defaultData();
      }
    } catch {
      try {
        s.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      return defaultData();
    }
  }
  return memory ?? defaultData();
}

export function saveData(data: AppData): void {
  memory = data;
  const s = store();
  if (!s) return;
  try {
    s.setItem(STORAGE_KEY, JSON.stringify(data));
    persistFailed = false;
  } catch {
    persistFailed = true;
    // Quota or privacy mode: keep working from memory.
  }
}

export function updateData(patch: Partial<AppData>): AppData {
  const next = { ...loadData(), ...patch, version: STORAGE_VERSION };
  saveData(next);
  return next;
}

/** "Clear all my data": wipes storage and memory. */
export function clearAllData(): AppData {
  memory = null;
  persistFailed = false;
  const s = store();
  try {
    s?.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return defaultData();
}
