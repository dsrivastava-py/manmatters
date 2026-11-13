import { describe, it, expect } from 'vitest';
import { scoreCheckpoint, checkpointForWeek, isCheckpointWeek, type CheckpointAnswers } from '../engine/checkpoint';

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
  it('all "Not sure" is unclear, not not-responding', () => {
    const r = scoreCheckpoint({ ...base, lessShedding: 'unsure', fillIn: 'unsure', thicker: 'unsure', photoBetter: 'unsure' });
    expect(r.result).toBe('unclear');
    expect(r.consult).toBe(false);
  });
  it('two unsure signs cannot be called not-responding', () => {
    const r = scoreCheckpoint({ ...base, lessShedding: 'unsure', fillIn: 'unsure' });
    expect(r.result).toBe('unclear');
  });
  it('one unsure sign with the rest negative is still not-responding', () => {
    const r = scoreCheckpoint({ ...base, lessShedding: 'unsure' });
    expect(r.result).toBe('not-responding');
  });
  it('early peek before week 12 never says not-responding or consults', () => {
    const r = scoreCheckpoint({ ...base, consistentUse: 'no' }, 3);
    expect(r.result).toBe('unclear');
    expect(r.consult).toBe(false);
    expect(r.fixRoutineFirst).toBe(false);
  });
  it('week 12 and later keep not-responding', () => {
    expect(scoreCheckpoint(base, 12).result).toBe('not-responding');
  });
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
