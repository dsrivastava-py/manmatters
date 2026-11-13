import { useState } from 'react';
import { lapseCheck } from '../engine/lapse';
import type { LapseOutcome } from '../engine/lapse';
import { ConsultCta } from '../components/Cta';
import { useApp } from '../state/AppState';

export function Slipped() {
  const { t, week } = useApp();
  const l = t.lapse;
  const u = t.ui.slipped;
  const [days, setDays] = useState('');
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState<LapseOutcome | null>(null);

  const run = (value: string) => {
    const n = Number(value);
    if (value.trim() === '' || !Number.isFinite(n) || n < 0) {
      setError(u.invalid);
      return;
    }
    setError('');
    setOutcome(lapseCheck({ daysSkipped: n, weeksSinceStart: week ?? 1 }));
  };

  if (outcome) {
    const res = l.outcomes[outcome];
    return (
      <div className="stack">
        <section className={`card result result-${outcome}`} aria-live="polite" role="status" data-testid={`result-${outcome}`}>
          <h1>{res.title}</h1>
          <p>{res.body}</p>
          {outcome === 'long-gap-consult' && <ConsultCta label={t.links.consult} />}
        </section>
        <section className="card">
          <h2>{u.restartTitle}</h2>
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
    <section className="card" aria-labelledby="slip-title">
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
