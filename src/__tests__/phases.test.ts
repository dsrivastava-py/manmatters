import { describe, it, expect } from 'vitest';
import { getPhase, weekFromStartDate, daysSince, DateError } from '../engine/phases';

describe('getPhase', () => {
  const table: [number, string][] = [
    [1, 'settling-in'], [4, 'settling-in'],
    [5, 'shed-settling'], [8, 'shed-settling'],
    [9, 'early-signs'], [11, 'early-signs'],
    [12, 'checkpoint-1'],
    [13, 'building'], [23, 'building'],
    [24, 'checkpoint-2'],
    [25, 'maintenance'], [200, 'maintenance'],
  ];
  it.each(table)('week %i is %s', (w, p) => expect(getPhase(w)).toBe(p));
  it('treats week 0 or less as week 1', () => expect(getPhase(0)).toBe('settling-in'));
});

describe('date math', () => {
  it('same day is week 1', () => expect(weekFromStartDate('2025-03-01', '2025-03-01')).toBe(1));
  it('day 6 is week 1, day 7 is week 2', () => {
    expect(weekFromStartDate('2025-03-01', '2025-03-07')).toBe(1);
    expect(weekFromStartDate('2025-03-01', '2025-03-08')).toBe(2);
  });
  it('is stable across DST changes', () => {
    expect(daysSince('2025-03-01', '2025-04-01')).toBe(31);
    expect(daysSince('2025-10-20', '2025-11-10')).toBe(21);
    expect(weekFromStartDate('2025-03-08', '2025-03-15')).toBe(2);
  });
  it('accepts Date objects', () => {
    expect(weekFromStartDate(new Date(2025, 2, 1), new Date(2025, 2, 15))).toBe(3);
  });
  it('rejects future dates', () => {
    expect(() => weekFromStartDate('2025-03-10', '2025-03-09')).toThrow(DateError);
    try {
      weekFromStartDate('2025-03-10', '2025-03-09');
    } catch (e) {
      expect((e as DateError).code).toBe('future');
    }
  });
  it('rejects absurd past dates', () => {
    expect(() => weekFromStartDate('2015-01-01', '2025-01-01')).toThrow(DateError);
  });
  it('rejects invalid strings', () => {
    expect(() => weekFromStartDate('2025-02-30', '2025-03-01')).toThrow(DateError);
    expect(() => weekFromStartDate('nope', '2025-03-01')).toThrow(DateError);
  });
});
