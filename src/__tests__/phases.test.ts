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

import { JOURNEY, PHASES, addDaysISO, journeyIndex, nextMilestone, phaseRange, weekStartISO } from '../engine/phases';

describe('journey', () => {
  it('has the eight steps in order and reuses phase boundaries', () => {
    expect(JOURNEY.map((s) => s.id)).toEqual([
      'start', 'shed-window', 'settling', 'early-signs', 'checkpoint-1', 'visible-change', 'checkpoint-2', 'maintenance',
    ]);
    for (const s of JOURNEY.slice(1)) {
      const p = PHASES.find((x) => x.id === s.phase)!;
      expect([s.from, s.to]).toEqual([p.from, p.to]);
    }
    expect(JOURNEY.filter((s) => s.checkpoint).map((s) => s.from)).toEqual([12, 24]);
  });
  it.each([
    [1, 'shed-window'], [4, 'shed-window'], [5, 'settling'], [10, 'early-signs'],
    [12, 'checkpoint-1'], [13, 'visible-change'], [24, 'checkpoint-2'], [30, 'maintenance'],
  ])('week %i is in %s', (w, id) => expect(JOURNEY[journeyIndex(w)].id).toBe(id));
  it('next milestone has the week it starts and how far away', () => {
    expect(nextMilestone(1)).toMatchObject({ week: 5, weeksAway: 4 });
    expect(nextMilestone(9)?.step.id).toBe('checkpoint-1');
    expect(nextMilestone(9)?.weeksAway).toBe(3);
    expect(nextMilestone(12)?.step.id).toBe('visible-change');
    expect(nextMilestone(20)).toMatchObject({ week: 24, weeksAway: 4 });
    expect(nextMilestone(25)).toBeNull();
  });
  it('phaseRange reads PHASES', () => expect(phaseRange('shed-settling')).toEqual({ from: 5, to: 8 }));
});

describe('calendar helpers', () => {
  it('adds days across months, years and DST', () => {
    expect(addDaysISO('2025-01-30', 3)).toBe('2025-02-02');
    expect(addDaysISO('2025-12-30', 5)).toBe('2026-01-04');
    expect(addDaysISO('2025-03-08', 7)).toBe('2025-03-15');
    expect(addDaysISO('2025-03-10', -10)).toBe('2025-02-28');
  });
  it('week N starts (N-1)*7 days after the start date', () => {
    expect(weekStartISO('2025-01-01', 1)).toBe('2025-01-01');
    expect(weekStartISO('2025-01-01', 12)).toBe('2025-03-19');
    expect(weekStartISO('2025-01-01', 24)).toBe('2025-06-11');
    // consistent with weekFromStartDate
    expect(weekFromStartDate('2025-01-01', weekStartISO('2025-01-01', 12))).toBe(12);
  });
});
