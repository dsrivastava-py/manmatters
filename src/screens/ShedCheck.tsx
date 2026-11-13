import { useState } from 'react';
import { NO_FLAGS, hasRedFlag, shedCheck } from '../engine/shedCheck';
import type { Irritation, RedFlags, ShedAmount, ShedOutcome } from '../engine/shedCheck';
import { ConsultCta } from '../components/Cta';
import { EMERGENCY_NUMBER } from '../config';
import { fill, todayISO, useApp } from '../state/AppState';

const AMOUNTS: ShedAmount[] = ['a-bit-more', 'clearly-more', 'clumps-or-patches'];
const IRRITATIONS: Irritation[] = ['none', 'mild', 'severe'];
const FLAG_KEYS = ['swelling', 'dizziness', 'chest', 'severeIrritation'] as const;

export function ShedCheck() {
  const { t, week: current, patch } = useApp();
  const s = t.shedCheck;
  const wz = t.ui.wizard;
  const [step, setStep] = useState(1);
  const [weekText, setWeekText] = useState(String(current ?? 1));
  const [amount, setAmount] = useState<ShedAmount | null>(null);
  const [irritation, setIrritation] = useState<Irritation>('none');
  const [flags, setFlags] = useState<RedFlags>(NO_FLAGS);
  const [outcome, setOutcome] = useState<ShedOutcome | null>(null);

  const weekNum = Math.max(1, Math.min(156, Math.floor(Number(weekText)) || 1));

  const finish = () => {
    if (!amount) return;
    const o = shedCheck({ week: weekNum, amount, irritation, flags });
    setOutcome(o);
    patch({ lastShedCheck: { date: todayISO(), week: weekNum, outcome: o } });
  };

  const reset = () => {
    setStep(1);
    setAmount(null);
    setIrritation('none');
    setFlags(NO_FLAGS);
    setOutcome(null);
  };

  if (outcome) {
    const res = s.outcomes[outcome];
    const urgent = outcome === 'doctor-now';
    const emergency = urgent && (flags.chest || flags.swelling);
    return (
      <div className="stack">
        <section
          className={`card result result-${outcome}`}
          aria-live="polite"
          role="status"
          data-testid={`result-${outcome}`}
        >
          <h1>{res.title}</h1>
          <p>{res.body}</p>
          {urgent && (
            <div className="redflag-box">
              <h2>{t.redFlags.title}</h2>
              <ul className="bullets">
                {FLAG_KEYS.filter((k) => flags[k] || (k === 'severeIrritation' && irritation === 'severe')).map((k) => (
                  <li key={k}>{t.redFlags[k]}</li>
                ))}
              </ul>
            </div>
          )}
          {emergency && (
            <div className="redflag-box" role="alert">
              <h2>{t.redFlags.emergencyTitle}</h2>
              <p>{t.redFlags.emergencyBody}</p>
              <a className="btn btn-danger" href={`tel:${EMERGENCY_NUMBER}`} data-testid="emergency-call">
                {t.redFlags.emergencyCall}
              </a>
            </div>
          )}
          {(urgent || outcome === 'see-doctor-soon' || outcome === 'unusual-for-week') && (
            <ConsultCta label={emergency ? t.links.consultNotUrgent : t.links.consult} urgent={urgent && !emergency} />
          )}
          <p className="muted">{wz.saved}</p>
        </section>
        <button type="button" className="btn btn-secondary" onClick={reset}>
          {wz.startOver}
        </button>
      </div>
    );
  }

  const canNext = step === 1 ? weekText !== '' : step === 2 ? amount !== null : true;

  return (
    <section className="card wizard" aria-labelledby="shed-title">
      <p className="eyebrow">{fill(wz.step, { a: step, b: 3 })}</p>
      <div className="dots" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`pdot ${n <= step ? 'on' : ''}`} />
        ))}
      </div>
      <h1 id="shed-title">{s.title}</h1>

      <div className="step" key={step}>
        {step === 1 && (
          <>
            <label htmlFor="shed-week" className="label">{s.weekQuestion}</label>
            <input
              id="shed-week"
              type="number"
              inputMode="numeric"
              min={1}
              max={156}
              value={weekText}
              onChange={(e) => setWeekText(e.target.value)}
            />
            <p className="muted">{wz.weekHint}</p>
          </>
        )}
        {step === 2 && (
          <fieldset>
            <legend className="label">{s.amountQuestion}</legend>
            {AMOUNTS.map((a) => (
              <label key={a} className={`tap-card ${amount === a ? 'selected' : ''}`}>
                <input type="radio" name="amount" checked={amount === a} onChange={() => setAmount(a)} />
                <span>{s.amountOptions[a]}</span>
              </label>
            ))}
          </fieldset>
        )}
        {step === 3 && (
          <>
            <fieldset>
              <legend className="label">{s.irritationQuestion}</legend>
              {IRRITATIONS.map((i) => (
                <label key={i} className={`tap-card ${irritation === i ? 'selected' : ''}`}>
                  <input type="radio" name="irritation" checked={irritation === i} onChange={() => setIrritation(i)} />
                  <span>{s.irritationOptions[i]}</span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend className="label">{s.flagsQuestion}</legend>
              {FLAG_KEYS.map((k) => (
                <label key={k} className={`tap-card ${flags[k] ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={flags[k]}
                    onChange={(e) => setFlags({ ...flags, [k]: e.target.checked })}
                  />
                  <span>{s.flags[k]}</span>
                </label>
              ))}
            </fieldset>
            {hasRedFlag({ irritation, flags }) && (
              <div className="error" role="alert">
                {FLAG_KEYS.filter((k) => flags[k] || (k === 'severeIrritation' && irritation === 'severe')).map((k) => (
                  <p key={k}>{t.redFlags[k]}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="actions">
        {step > 1 && (
          <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
            {wz.back}
          </button>
        )}
        {step < 3 ? (
          <button type="button" className="btn btn-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>
            {wz.next}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={finish}>
            {wz.seeResult}
          </button>
        )}
      </div>
    </section>
  );
}
