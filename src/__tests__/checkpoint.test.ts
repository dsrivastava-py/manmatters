import { describe, it, expect } from 'vitest';
import {
  scoreCheckpoint,
  checkpointForWeek,
  isCheckpointWeek,
  FIX_ROUTINE_RECHECK_WEEKS,
  MAINTENANCE_RECHECK_WEEKS,
  PARTIAL_RECHECK_WEEKS_W24,
  type CheckpointAnswers,
} from '../engine/checkpoint';

const base: CheckpointAnswers = {
  lessShedding: 'no', fillIn: 'no', thicker: 'no', consistentUse: 'yes', photoBetter: 'no', newThinning: 'no',
};
const a = (p: Partial<CheckpointAnswers>): CheckpointAnswers => ({ ...base, ...p });

describe('too early (before week 12)', () => {
  it.each([1, 5, 11])('week %i is too-early whatever the answers, with checkpoint 1 next', (w) => {
    for (const ans of [base, a({ lessShedding: 'yes', fillIn: 'yes' }), a({ consistentUse: 'no' })]) {
      const r = scoreCheckpoint(ans, w);
      expect(r.result).toBe('too-early');
      expect(r.nextWeek).toBe(12);
      expect(r.consult).toBe('none');
      expect(r.stage).toBeNull();
    }
  });
});

describe('week 12 checkpoint', () => {
  it('less shedding plus a visible sign is on track, next is week 24', () => {
    const r = scoreCheckpoint(a({ lessShedding: 'yes', fillIn: 'yes' }), 12);
    expect(r.result).toBe('on-track');
    expect(r.reason).toBe('w12-shed-and-visible');
    expect(r.nextWeek).toBe(24);
    expect(r.consult).toBe('none');
  });
  it('less shedding alone is a clear positive: early signs, not unclear', () => {
    const r = scoreCheckpoint(a({ lessShedding: 'yes' }), 12);
    expect(r.result).toBe('early-signs');
    expect(r.reason).toBe('w12-shed-only');
    expect(r.nextWeek).toBe(24);
    expect(r.yes).toEqual(['lessShedding']);
  });
  it('a visible sign without less shedding is early signs', () => {
    const r = scoreCheckpoint(a({ photoBetter: 'yes' }), 12);
    expect(r.result).toBe('early-signs');
    expect(r.reason).toBe('w12-visible-only');
  });
  it('new thinning blocks on track and offers a consult', () => {
    const r = scoreCheckpoint(a({ lessShedding: 'yes', fillIn: 'yes', thicker: 'yes', newThinning: 'yes' }), 12);
    expect(r.result).toBe('early-signs');
    expect(r.reason).toBe('w12-new-thinning');
    expect(r.consult).toBe('secondary');
  });
  it('no positive sign after consistent use is not responding with a consult', () => {
    const r = scoreCheckpoint(base, 12);
    expect(r.result).toBe('not-responding');
    expect(r.consult).toBe('primary');
    expect(r.nextWeek).toBeNull();
  });
  it('new thinning with no positives is not responding', () => {
    expect(scoreCheckpoint(a({ newThinning: 'yes' }), 12).result).toBe('not-responding');
  });
  it('one "Not sure" with the rest negative is still not responding (conservative but clear)', () => {
    expect(scoreCheckpoint(a({ lessShedding: 'unsure' }), 12).result).toBe('not-responding');
  });
  it('two "Not sure" and no yes is need-better-look, never not-responding', () => {
    expect(scoreCheckpoint(a({ lessShedding: 'unsure', fillIn: 'unsure' }), 12).result).toBe('need-better-look');
  });
  it('mostly "Not sure" is need-better-look', () => {
    const r = scoreCheckpoint(a({ lessShedding: 'unsure', fillIn: 'unsure', thicker: 'unsure', photoBetter: 'yes' }), 12);
    expect(r.result).toBe('need-better-look');
    expect(r.consult).toBe('none');
  });
  it('routine not followed is fix-routine, recheck later, consult offered', () => {
    const r = scoreCheckpoint(a({ lessShedding: 'yes', consistentUse: 'no' }), 12);
    expect(r.result).toBe('fix-routine');
    expect(r.nextWeek).toBe(12 + FIX_ROUTINE_RECHECK_WEEKS);
    expect(r.consult).toBe('secondary');
  });
  it('a late week 12 check (week 18) still uses week 12 rules and points to week 24', () => {
    const r = scoreCheckpoint(a({ lessShedding: 'yes' }), 18);
    expect(r.stage).toBe(12);
    expect(r.nextWeek).toBe(24);
  });
  it('defaults to week 12 rules when no week is given', () => {
    expect(scoreCheckpoint(a({ lessShedding: 'yes' })).result).toBe('early-signs');
  });
  it('breakdown marks less shedding as the main sign and visible signs as a bonus that is not held against you', () => {
    const r = scoreCheckpoint(a({ lessShedding: 'yes' }), 12);
    const by = Object.fromEntries(r.breakdown.map((b) => [b.id, b]));
    expect(by.lessShedding).toMatchObject({ role: 'main', effect: 'positive' });
    expect(by.fillIn).toMatchObject({ role: 'bonus', effect: 'neutral' });
    expect(by.consistentUse).toMatchObject({ role: 'routine', effect: 'positive' });
    expect(by.newThinning).toMatchObject({ role: 'warning', effect: 'positive' });
    expect(r.breakdown).toHaveLength(6);
  });
});

describe('week 24 checkpoint', () => {
  it('two visible signs is on track, next self-check later', () => {
    const r = scoreCheckpoint(a({ fillIn: 'yes', photoBetter: 'yes' }), 24);
    expect(r.result).toBe('on-track');
    expect(r.reason).toBe('w24-visible');
    expect(r.nextWeek).toBe(24 + MAINTENANCE_RECHECK_WEEKS);
  });
  it('less shedding alone is not enough for on track at week 24', () => {
    const r = scoreCheckpoint(a({ lessShedding: 'yes' }), 24);
    expect(r.result).toBe('early-signs');
    expect(r.reason).toBe('w24-partial');
    expect(r.nextWeek).toBe(24 + PARTIAL_RECHECK_WEEKS_W24);
    expect(r.consult).toBe('secondary');
  });
  it('one visible sign is early signs', () => {
    expect(scoreCheckpoint(a({ thicker: 'yes' }), 24).result).toBe('early-signs');
  });
  it('new thinning pushes to a consult even with visible signs', () => {
    const r = scoreCheckpoint(a({ fillIn: 'yes', thicker: 'yes', photoBetter: 'yes', newThinning: 'yes' }), 24);
    expect(r.result).toBe('not-responding');
    expect(r.reason).toBe('w24-new-thinning');
    expect(r.consult).toBe('primary');
  });
  it('no positive sign is not responding', () => {
    expect(scoreCheckpoint(base, 24).result).toBe('not-responding');
  });
  it('routine not followed is fix-routine', () => {
    expect(scoreCheckpoint(a({ consistentUse: 'no' }), 24).result).toBe('fix-routine');
  });
  it('all "Not sure" is need-better-look', () => {
    const r = scoreCheckpoint(a({ lessShedding: 'unsure', fillIn: 'unsure', thicker: 'unsure', photoBetter: 'unsure' }), 24);
    expect(r.result).toBe('need-better-look');
  });
  it('visible signs are the main signs at week 24', () => {
    const r = scoreCheckpoint(a({ fillIn: 'no' }), 24);
    const by = Object.fromEntries(r.breakdown.map((b) => [b.id, b]));
    expect(by.fillIn).toMatchObject({ role: 'main', effect: 'negative' });
    expect(by.lessShedding.role).toBe('bonus');
  });
  it('week 40 uses week 24 rules', () => {
    expect(scoreCheckpoint(a({ fillIn: 'yes', thicker: 'yes' }), 40).stage).toBe(24);
  });
});

describe('no "unclear" outcome', () => {
  it('every combination at weeks 12 and 24 gives one of the clear verdicts', () => {
    const vals = ['yes', 'no', 'unsure'] as const;
    const seen = new Set<string>();
    for (const w of [12, 24])
      for (const l of vals) for (const f of vals) for (const t of vals) for (const c of vals) for (const p of vals) for (const n of vals) {
        const r = scoreCheckpoint({ lessShedding: l, fillIn: f, thicker: t, consistentUse: c, photoBetter: p, newThinning: n }, w);
        seen.add(r.result);
        expect(['on-track', 'early-signs', 'not-responding', 'fix-routine', 'need-better-look']).toContain(r.result);
      }
    expect(seen.size).toBe(5);
  });
});

describe('checkpoint weeks', () => {
  it('maps weeks to stored checkpoints', () => {
    expect(checkpointForWeek(3)).toBeNull();
    expect(checkpointForWeek(null)).toBeNull();
    expect(checkpointForWeek(11)).toBeNull();
    expect(checkpointForWeek(12)).toBe(12);
    expect(checkpointForWeek(20)).toBe(12);
    expect(checkpointForWeek(24)).toBe(24);
  });
  it('knows checkpoint weeks', () => {
    expect(isCheckpointWeek(12)).toBe(true);
    expect(isCheckpointWeek(24)).toBe(true);
    expect(isCheckpointWeek(13)).toBe(false);
  });
});
