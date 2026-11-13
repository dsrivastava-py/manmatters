import { describe, it, expect } from 'vitest';
import { scoreCheckpoint, isCheckpointWeek, type CheckpointAnswers } from '../engine/checkpoint';

const base: CheckpointAnswers = {
  lessShedding: 'no', fillIn: 'no', thicker: 'no', consistentUse: 'yes', photoBetter: 'no', newThinning: 'no',
};

describe('scoreCheckpoint', () => {
  it('responding', () => {
    const r = scoreCheckpoint({ ...base, lessShedding: 'yes', fillIn: 'yes', thicker: 'yes' });
    expect(r.result).toBe('responding');
    expect(r.consult).toBe(false);
  });
  it('new thinning blocks responding', () => {
    const r = scoreCheckpoint({ ...base, lessShedding: 'yes', fillIn: 'yes', thicker: 'yes', newThinning: 'yes' });
    expect(r.result).toBe('unclear');
  });
  it('unclear with good adherence does not force consult', () => {
    const r = scoreCheckpoint({ ...base, lessShedding: 'yes', thicker: 'yes' });
    expect(r.result).toBe('unclear');
    expect(r.consult).toBe(false);
    expect(r.fixRoutineFirst).toBe(false);
  });
  it('unclear with low adherence routes to consult and fix routine', () => {
    const r = scoreCheckpoint({ ...base, lessShedding: 'yes', thicker: 'yes', consistentUse: 'no' });
    expect(r.result).toBe('unclear');
    expect(r.lowAdherence).toBe(true);
    expect(r.consult).toBe(true);
    expect(r.fixRoutineFirst).toBe(true);
  });
  it('not-responding routes to consult', () => {
    const r = scoreCheckpoint(base);
    expect(r.result).toBe('not-responding');
    expect(r.consult).toBe(true);
  });
  it('unsure answers do not score', () => {
    const r = scoreCheckpoint({ ...base, lessShedding: 'unsure', fillIn: 'unsure', thicker: 'unsure', photoBetter: 'unsure' });
    expect(r.result).toBe('not-responding');
  });
  it('knows checkpoint weeks', () => {
    expect(isCheckpointWeek(12)).toBe(true);
    expect(isCheckpointWeek(24)).toBe(true);
    expect(isCheckpointWeek(13)).toBe(false);
  });
});
