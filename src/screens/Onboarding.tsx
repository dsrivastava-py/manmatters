import { useState } from 'react';
import { DateError, daysSince } from '../engine/phases';
import { isoDaysAgo, todayISO, useApp } from '../state/AppState';
import { Icon } from '../components/NavIcon';

const FEATURE_ICONS = ['info', 'calendar', 'checkpoint'];

export function Onboarding({ onDone, initial, showFeatures }: { onDone?: () => void; initial?: string; showFeatures?: boolean }) {
  const { t, setStartDate } = useApp();
  const o = t.ui.onboarding;
  const [value, setValue] = useState(initial ?? '');
  const [error, setError] = useState('');

  const submit = (iso: string) => {
    if (!iso) {
      setError(o.errors.empty);
      return;
    }
    try {
      daysSince(iso, todayISO());
    } catch (e) {
      if (e instanceof DateError) {
        setError(e.code === 'future' ? o.errors.future : e.code === 'too-old' ? o.errors.tooOld : o.errors.invalid);
        return;
      }
      throw e;
    }
    setError('');
    setStartDate(iso);
    onDone?.();
  };

  const chips: [string, number][] = [
    [o.chips.today, 0],
    [o.chips.weekAgo, 7],
    [o.chips.monthAgo, 30],
    [o.chips.threeMonthsAgo, 90],
  ];

  const card = (
    <section className={`card onboarding ${showFeatures ? 'onboarding-hero' : ''}`} aria-labelledby={showFeatures ? 'ob-title' : undefined}>
      {showFeatures && (
        <>
          <p className="eyebrow">{t.app.tagline}</p>
          <h1 id="ob-title">{o.title}</h1>
          <p className="lead">{o.lead}</p>
        </>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        noValidate
      >
        <label htmlFor="start-date" className="label">
          {o.dateLabel}
        </label>
        <input
          id="start-date"
          type="date"
          value={value}
          max={todayISO()}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'start-error' : undefined}
        />
        <div className="chips" role="group" aria-label={o.chipsLabel}>
          {chips.map(([label, days]) => (
            <button
              type="button"
              key={label}
              className="chip"
              onClick={() => {
                const iso = isoDaysAgo(days);
                setValue(iso);
                submit(iso);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p id="start-error" className="error" role="alert">
          {error}
        </p>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          {o.start}
        </button>
        <button
          type="button"
          className="btn btn-link btn-block"
          onClick={() => submit(todayISO())}
        >
          {o.notStarted}
        </button>
      </form>
    </section>
  );

  if (!showFeatures) return card;
  return (
    <div className="onboarding-wrap">
      {card}
      <ul className="features" aria-label={t.app.tagline}>
        {t.app.features.map((f, i) => (
          <li key={f.title} className="feature">
            <span className="feature-ico" aria-hidden="true"><Icon name={FEATURE_ICONS[i] ?? 'info'} size={20} /></span>
            <span>
              <strong>{f.title}</strong>
              <span className="feature-body">{f.body}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
