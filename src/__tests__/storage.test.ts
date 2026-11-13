import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STORAGE_KEY } from '../config';
import { loadData, saveData, updateData, clearAllData, defaultData } from '../lib/storage';

beforeEach(() => {
  vi.restoreAllMocks();
  clearAllData();
  localStorage.clear();
});

describe('storage', () => {
  it('round trips', () => {
    saveData({ ...defaultData(), startDate: '2025-01-01', language: 'hinglish', onboardingSeen: true, routineTicks: { a: true } });
    const d = loadData();
    expect(d.startDate).toBe('2025-01-01');
    expect(d.language).toBe('hinglish');
    expect(d.routineTicks).toEqual({ a: true });
  });
  it('resets on corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadData()).toEqual(defaultData());
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
  it('resets on wrong schema', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, startDate: 5 }));
    expect(loadData()).toEqual(defaultData());
  });
  it('resets on unknown version', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultData(), version: 99 }));
    expect(loadData()).toEqual(defaultData());
  });
  it('falls back to memory when quota is exceeded', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    expect(() => updateData({ startDate: '2025-02-02' })).not.toThrow();
    expect(loadData().startDate).toBe('2025-02-02');
  });
  it('clearAllData wipes everything', () => {
    saveData({ ...defaultData(), startDate: '2025-01-01' });
    clearAllData();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(loadData()).toEqual(defaultData());
  });
});

describe('legacy checkpoint results', () => {
  it('re-scores old "responding" and "unclear" results from the saved answers', () => {
    const answers = { lessShedding: 'yes', fillIn: 'no', thicker: 'no', consistentUse: 'yes', photoBetter: 'no', newThinning: 'no' };
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...defaultData(),
        checkpoints: [
          { week: 12, date: '2025-01-01', result: 'unclear', answers },
          { week: 24, date: '2025-04-01', result: 'responding', answers: { ...answers, fillIn: 'yes', thicker: 'yes' } },
          { week: 24, date: '2025-04-02', result: 'not-responding', answers },
        ],
      }),
    );
    expect(loadData().checkpoints.map((c) => c.result)).toEqual(['early-signs', 'on-track', 'not-responding']);
  });
  it('still rejects unknown result strings', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultData(), checkpoints: [{ week: 12, date: '2025-01-01', result: 'maybe', answers: {} }] }));
    expect(loadData()).toEqual(defaultData());
  });
});
