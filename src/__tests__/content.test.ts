import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { en } from '../content/en';
import { hinglish } from '../content/hinglish';

function shape(v: unknown): unknown {
  if (typeof v === 'string') return 'string';
  if (Array.isArray(v)) return v.map(shape);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.keys(v).sort().map((k) => [k, shape((v as Record<string, unknown>)[k])]));
  }
  return typeof v;
}

function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
}

describe('content', () => {
  it('en and hinglish have identical key trees', () => {
    expect(shape(hinglish)).toEqual(shape(en));
  });
  for (const [name, c] of [['en', en], ['hinglish', hinglish]] as const) {
    const all = strings(c);
    it(`${name}: no empty strings`, () => all.forEach((s) => expect(s.trim().length).toBeGreaterThan(0)));
    it(`${name}: no Devanagari`, () => all.forEach((s) => expect(s).not.toMatch(/[\u0900-\u097F]/)));
    it(`${name}: no em dash`, () => all.forEach((s) => expect(s).not.toMatch(/\u2014/)));
    it(`${name}: no dosing patterns`, () => {
      const dose = /\d+(\.\d+)?\s*(mg|ml|mcg|%|percent|times\s+a\s+day|x\s*daily|drops|pumps|sprays)/i;
      all.forEach((s) => expect(s).not.toMatch(dose));
    });
    it(`${name}: every red flag says stop and consult a doctor`, () => {
      const re = name === 'en' ? /stop.*consult a doctor/i : /band karein.*doctor se milein/i;
      for (const k of ['swelling', 'dizziness', 'chest', 'severeIrritation'] as const) {
        expect(c.redFlags[k]).toMatch(re);
      }
      expect(c.shedCheck.outcomes['doctor-now'].body).toMatch(re);
    });
    it(`${name}: howToApply defers to label or doctor`, () => {
      expect(c.howToApply.intro).toMatch(/label/i);
      expect(c.howToApply.intro).toMatch(/doctor/i);
    });
  }
});

describe('external links', () => {
  function walk(dir: string, out: string[] = []): string[] {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) {
        if (f !== '__tests__') walk(p, out);
      } else if (/\.(ts|tsx)$/.test(f)) out.push(p);
    }
    return out;
  }
  it('CONSULT_URL and CONSENT_URL are hard-coded only in config.ts', () => {
    const src = join(process.cwd(), 'src');
    for (const file of walk(src)) {
      if (file.endsWith('config.ts')) continue;
      const text = readFileSync(file, 'utf8');
      expect(text, file).not.toContain('hair-form-assessment');
      expect(text, file).not.toContain('terms-and-conditions');
    }
  });
});
