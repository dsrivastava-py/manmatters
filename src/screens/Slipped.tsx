import { useState } from 'react';
import { lapseCheck, lapseShiftWeeks } from '../engine/lapse';
import { addDaysISO, nextMilestone, weekStartISO } from '../engine/phases';
import { daysUntil, formatDate, whenPhrase } from '../lib/when';
import type { LapseOutcome } from '../engine/lapse';
import { ConsultCta } from '../components/Cta';
import { CardHead } from '../components/NavIcon';
import { fill, todayISO, useApp } from '../state/AppState';

/** With no milestone left (maintenance), suggest a self-check this many weeks after the gap. */
const GENERIC_CHECK_WEEKS = 4;

export function Slipped() {
  const { t, week, data } = useApp();
  const l = t.lapse;
  const u = t.ui.slipped;
  const [days, setDays] = useState('');
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState<LapseOutcome | null>(null);
  const [skipped, setSkipped] = useState(0);

  const run = (value: string) => {
    const n = Number(value);
    if (value.trim() === '' || !Number.isFinite(n) || n < 0) {
      setError(u.invalid);
      return;
    }
    setError('');
    setSkipped(n);
    setOutcome(lapseCheck({ daysSkipped: n, weeksSinceStart: week ?? 1 }));
  };

  if (outcome) {
    const res = l.outcomes[outcome];
    const today = todayISO();
    const shift = outcome === 'short-gap' ? 0 : lapseShiftWeeks(skipped);
    const next = week !== null ? nextMilestone(week) : null;
    const iso =
      next && data.startDate
        ? weekStartISO(data.startDate, next.week + shift)
        : addDaysISO(today, (shift + GENERIC_CHECK_WEEKS) * 7);
    const vars = {
      milestone: next ? t.ui.journey.steps[next.step.id] : l.kabTak.nextCheckGeneric,
      date: formatDate(iso, t.ui.when.dateLocale),
      when: whenPhrase(t, daysUntil(iso, today)),
      shift,
    };
    const kabTak =
      outcome === 'long-gap-consult'
        ? l.kabTak['long-gap-consult']
        : outcome === 'short-gap'
          ? fill(l.kabTak['short-gap'], vars)
          : fill(shift === 1 ? l.kabTak['lapse-reset-one'] : l.kabTak['lapse-reset-expectations'], vars);
    return (
      <div className="stack narrow">
        <section className={`card result result-${outcome}`} aria-live="polite" role="status" data-testid={`result-${outcome}`}>
          <p className="eyebrow">{l.title}</p>
          <h1>{res.title}</h1>
          <p>{res.body}</p>
          <div className="do-now">
            <span className="do-now-label">{t.ui.doNowLabel}</span>
            <p>{l.actions[outcome]}</p>
          </div>
          <p className="kabtak" data-testid="kabtak">
            <span className="kabtak-label">{t.ui.kabTakLabel}</span>
            <span>{kabTak}</span>
          </p>
          {outcome === 'long-gap-consult' && <ConsultCta label={t.links.consult} />}
        </section>
        <section className="card">
          <CardHead icon="slipped" title={u.restartTitle} />
          <ul className="bullets">{u.restart.map((r) => <li key={r}>{r}</li>)}</ul>
          <p className="muted">{l.lapseVsPlateau}</p>
        </section>
        <button type="button" className="btn btn-secondary" onClick={() => setOutcome(null)}>
          {u.again}
        </button>
      </div>
    );
  }

  return (
    <section className="card narrow" aria-labelledby="slip-title">
      <h1 id="slip-title">{l.title}</h1>
      <p className="lead">{u.intro}</p>
      <p className="muted">{l.lapseVsPlateau}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(days);
        }}
        noValidate
      >
        <label htmlFor="skip-days" className="label">{l.question}</label>
        <input
          id="skip-days"
          type="number"
          inputMode="numeric"
          min={0}
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <div className="chips" role="group" aria-label={u.daysLabel}>
          {u.chips.map((c) => (
            <button
              type="button"
              key={c}
              className="chip"
              onClick={() => {
                setDays(c);
                run(c);
              }}
            >
              {c} {u.unit}
            </button>
          ))}
        </div>
        <p className="error" role="alert">{error}</p>
        <button type="submit" className="btn btn-primary btn-block">{u.check}</button>
      </form>
    </section>
  );
}
