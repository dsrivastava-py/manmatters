import { describe, it, expect } from 'vitest';
import { shedCheck, type ShedAmount, type Irritation } from '../engine/shedCheck';

const amounts: ShedAmount[] = ['a-bit-more', 'clearly-more', 'clumps-or-patches'];
const irritations: Irritation[] = ['none', 'mild', 'severe'];

describe('shedCheck', () => {
  it('any red flag always returns doctor-now', () => {
    const flags = ['swelling', 'dizziness', 'chest', 'severeIrritation'] as const;
    for (const week of [1, 3, 8, 12, 30, 100]) {
      for (const amount of amounts) {
        for (const irritation of irritations) {
          for (const f of flags) {
            expect(shedCheck({ week, amount, irritation, flags: { [f]: true } })).toBe('doctor-now');
          }
        }
      }
    }
  });
  it('severe irritation alone returns doctor-now', () => {
    for (const week of [1, 10, 40]) {
      for (const amount of amounts) {
        expect(shedCheck({ week, amount, irritation: 'severe' })).toBe('doctor-now');
      }
    }
  });
  const cases: [number, ShedAmount, string][] = [
    [3, 'a-bit-more', 'commonly-reported'],
    [6, 'clearly-more', 'commonly-reported'],
    [8, 'clearly-more', 'commonly-reported'],
    [9, 'a-bit-more', 'commonly-reported'],
    [10, 'clearly-more', 'see-doctor-soon'],
    [12, 'clearly-more', 'see-doctor-soon'],
    [13, 'a-bit-more', 'unusual-for-week'],
    [20, 'clearly-more', 'unusual-for-week'],
    [3, 'clumps-or-patches', 'see-doctor-soon'],
    [20, 'clumps-or-patches', 'see-doctor-soon'],
  ];
  it.each(cases)('week %i, %s -> %s', (week, amount, expected) => {
    expect(shedCheck({ week, amount, irritation: 'mild' })).toBe(expected);
  });
});
