import { describe, it, expect } from 'vitest';
import { lapseCheck } from '../engine/lapse';

describe('lapseCheck', () => {
  it.each([
    [0, 5, 'short-gap'],
    [3, 5, 'short-gap'],
    [4, 5, 'lapse-reset-expectations'],
    [28, 5, 'lapse-reset-expectations'],
    [29, 5, 'long-gap-consult'],
    [15, 14, 'long-gap-consult'],
    [14, 14, 'lapse-reset-expectations'],
  ])('%i days at week %i -> %s', (daysSkipped, weeksSinceStart, expected) => {
    expect(lapseCheck({ daysSkipped, weeksSinceStart })).toBe(expected);
  });
});

import { lapseShiftWeeks } from '../engine/lapse';

describe('lapseShiftWeeks', () => {
  it.each([[0, 0], [3, 0], [4, 1], [7, 1], [8, 2], [20, 3], [40, 6]])('%i days moves the timeline %i weeks', (d, w) => {
    expect(lapseShiftWeeks(d)).toBe(w);
  });
});
