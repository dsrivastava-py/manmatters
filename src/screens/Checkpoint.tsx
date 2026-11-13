import { useState } from 'react';
import { FIRST_CHECKPOINT_WEEK, SECOND_CHECKPOINT_WEEK, checkpointForWeek, scoreCheckpoint } from '../engine/checkpoint';
import type { Answer, CheckpointAnswers, CheckpointOutcome, CheckpointQuestionId } from '../engine/checkpoint';
import { getPhase, weekStartISO } from '../engine/phases';
import { ConsultCta } from '../components/Cta';
import { ReviewNote } from '../components/Reviewed';
import { CardHead, Icon } from '../components/NavIcon';
import { fill, todayISO, useApp } from '../state/AppState';
import { daysUntil, formatDate, whenPhrase } from '../lib/when';

const QUESTIONS: CheckpointQuestionId[] = ['lessShedding', 'fillIn', 'thicker', 'consistentUse', 'photoBetter', 'newThinning'];
const ANSWERS: Answer[] = ['yes', 'no', 'unsure'];

export function Checkpoint() {
  const { t, week, data, patch } = useApp();
  const c = t.checkpoint;
  const u = t.ui.checkpoint;
  const [phase, setPhase] = useState<'intro' | 'questions' | 'result'>('intro');
  const [answers, setAnswers] = useState<Partial<CheckpointAnswers>>({});
  const [outcome, setOutcome] = useState<CheckpointOutcome | null>(null);
  const [error, setError] = useState('');

  if (week === null || !data.startDate) return null;
  const start = data.startDate;
  const today = todayISO();
  const locale = t.ui.when.dateLocale;
  const complete = QUESTIONS.every((q) => answers[q]);

  /** Fills {label}, {date} and {when} for a journey week. */
  const nextVars = (nextWeek: number) => {
    const iso = weekStartISO(start, nextWeek);
    const label =
      nextWeek === FIRST_CHECKPOINT_WEEK ? fill(u.nextCheck, { n: 1 }) : nextWeek === SECOND_CHECKPOINT_WEEK ? fill(u.nextCheck, { n: 2 }) : u.selfCheck;
    return { label, date: formatDate(iso, locale), when: whenPhrase(t, daysUntil(iso, today)) };
  };

  const submit = () => {
    if (!complete) {
      setError(u.needAll);
      return;
    }
    const full = answers as CheckpointAnswers;
    const o = scoreCheckpoint(full, week);
    setOutcome(o);
    setPhase('result');
    const cpWeek = checkpointForWeek(week);
    if (cpWeek !== null) {
      patch({
        checkpoints: [...data.checkpoints, { week: cpWeek, date: todayISO(), result: o.result, answers: full }],
      });
    }
  };

  const retake = () => {
    setAnswers({});
    setOutcome(null);
    setError('');
    setPhase('questions');
  };

  const history = (
    <section className="card" aria-labelledby="hist-title">
      <CardHead icon="calendar" title={u.historyTitle} id="hist-title" />
      {data.checkpoints.length === 0 ? (
        <p className="muted">{u.noHistory}</p>
      ) : (
        <ul className="history">
          {[...data.checkpoints].reverse().map((h, i) => (
            <li key={`${h.date}-${i}`}>
              <span className={`tag tag-${h.result}`}>{c.results[h.result].title}</span>
              <span className="muted small">
                {u.weekLabel} {h.week} · {formatDate(h.date, locale)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  const protocol = (
    <ol className="steps">
      {c.protocol.map((p) => <li key={p}>{p}</li>)}
    </ol>
  );

  // Before week 12: a clear "too early" card, with the date of checkpoint 1, instead of a pseudo verdict.
  if (checkpointForWeek(week) === null) {
    const res = c.results['too-early'];
    return (
      <div className="stack narrow">
        <section className="card result result-too-early" data-testid="result-too-early" aria-labelledby="cp-title">
          <p className="eyebrow">{c.title}</p>
          <h1 id="cp-title">{res.title}</h1>
          <p className="lead">{fill(c.reasons['too-early'], { week })}</p>
          <p>{res.body}</p>
          <p className="kabtak">
            <span className="kabtak-label">{t.ui.kabTakLabel}</span>
            <span>{fill(res.kabTak, nextVars(FIRST_CHECKPOINT_WEEK))}</span>
          </p>
          <div className="sub">
            <h2>{fill(u.tooEarlyNormal, { week })}</h2>
            <p>{t.phases[getPhase(week)].body}</p>
          </div>
          <div className="do-now">
            <span className="do-now-label"><Icon name="camera" size={18} /> {u.baselineTitle}</span>
            <p>{res.action}</p>
            {protocol}
            <p className="muted small">{c.noUploads}</p>
          </div>
          <ReviewNote />
        </section>
        {history}
      </div>
    );
  }

  if (phase === 'result' && outcome) {
    const r = outcome.result;
    const res = c.results[r];
    const yesNames = outcome.yes.map((s) => c.signNames[s]).join(', ');
    return (
      <div className="stack narrow">
        <section className={`card result result-${r}`} aria-live="polite" role="status" data-testid={`result-${r}`}>
          <p className="eyebrow">
            {c.title} · {t.ui.week.label} {week}
          </p>
          <h1>{res.title}</h1>
          <p className="lead" data-testid="reason">{fill(c.reasons[outcome.reason], { yes: yesNames, week })}</p>
          <p>{res.body}</p>
          <div className="do-now">
            <span className="do-now-label">{t.ui.doNowLabel}</span>
            <p>{res.action}</p>
            {r === 'need-better-look' && (
              <>
                <h2 className="h-sm">{u.lookTitle}</h2>
                <ol className="steps">{c.lookSteps.map((s) => <li key={s}>{s}</li>)}</ol>
                <button type="button" className="btn btn-primary" onClick={retake}>{u.retakeLook}</button>
              </>
            )}
          </div>
          <p className="kabtak" data-testid="kabtak">
            <span className="kabtak-label">{t.ui.kabTakLabel}</span>
            <span>{outcome.nextWeek === null ? res.kabTak : fill(res.kabTak, nextVars(outcome.nextWeek))}</span>
          </p>
          {outcome.consult !== 'none' && <ConsultCta label={c.consultCta} secondary={outcome.consult === 'secondary'} />}

          <details className="why" open>
            <summary>{u.whyTitle}</summary>
            <ul className="why-list">
              {outcome.breakdown.map((b) => (
                <li key={b.id} className={`why-${b.effect}`}>
                  <span className="why-sign">
                    <strong>{c.signNames[b.id]}</strong>
                    <span className="why-role">{c.roles[b.role]}</span>
                  </span>
                  <span className="why-ans">{c.answers[b.answer]}</span>
                  <span className="why-effect">{c.effects[b.effect]}</span>
                </li>
              ))}
            </ul>
          </details>
          <ReviewNote />
        </section>

        <details className="card summary-details">
          <summary>{c.doctorSummaryTitle}</summary>
          <ul className="bullets">
            {QUESTIONS.map((q) => (
              <li key={q}>
                {c.questions[q]} <strong>{c.answers[(answers as CheckpointAnswers)[q]]}</strong>
              </li>
            ))}
          </ul>
        </details>
        {r !== 'need-better-look' && (
          <button type="button" className="btn btn-secondary" onClick={retake}>
            {u.retake}
          </button>
        )}
        {history}
      </div>
    );
  }

  return (
    <div className="stack narrow">
      <section className="card" aria-labelledby="cp-title">
        <p className="eyebrow">{t.ui.week.label} {week}</p>
        <h1 id="cp-title">{c.title}</h1>
        <p className="lead">{u.intro}</p>
        <div className="sub">
          <h2 className="h-sm">{c.protocolTitle}</h2>
          {protocol}
          <p className="muted small">{c.noUploads}</p>
        </div>

        {phase === 'intro' ? (
          <button type="button" className="btn btn-primary btn-block btn-lg" onClick={() => setPhase('questions')}>
            {u.start}
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <h2>{u.questionsTitle}</h2>
            {QUESTIONS.map((q) => (
              <fieldset key={q} className="q">
                <legend>{c.questions[q]}</legend>
                <div className="seg">
                  {ANSWERS.map((a) => (
                    <label key={a} className={`seg-opt ${answers[q] === a ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name={q}
                        checked={answers[q] === a}
                        onChange={() => {
                          setAnswers({ ...answers, [q]: a });
                          setError('');
                        }}
                      />
                      <span>{c.answers[a]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <p className="error" role="alert">{error}</p>
            <button type="submit" className="btn btn-primary btn-block btn-lg">{u.submit}</button>
          </form>
        )}
      </section>
      {history}
    </div>
  );
}
