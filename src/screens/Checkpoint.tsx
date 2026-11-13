import { useState } from 'react';
import { isCheckpointWeek, scoreCheckpoint } from '../engine/checkpoint';
import type { Answer, CheckpointAnswers, CheckpointOutcome, CheckpointQuestionId } from '../engine/checkpoint';
import { ConsultCta } from '../components/Cta';
import { todayISO, useApp } from '../state/AppState';

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

  const early = week !== null && !isCheckpointWeek(week);
  const complete = QUESTIONS.every((q) => answers[q]);

  const submit = () => {
    if (!complete) {
      setError(u.needAll);
      return;
    }
    const full = answers as CheckpointAnswers;
    const o = scoreCheckpoint(full);
    setOutcome(o);
    setPhase('result');
    const cpWeek: 12 | 24 = (week ?? 12) >= 18 ? 24 : 12;
    patch({
      checkpoints: [...data.checkpoints, { week: cpWeek, date: todayISO(), result: o.result, answers: full }],
    });
  };

  const history = (
    <section className="card" aria-labelledby="hist-title">
      <h2 id="hist-title">{u.historyTitle}</h2>
      {data.checkpoints.length === 0 ? (
        <p className="muted">{u.noHistory}</p>
      ) : (
        <ul className="history">
          {[...data.checkpoints].reverse().map((h, i) => (
            <li key={`${h.date}-${i}`}>
              <strong>{u.weekLabel} {h.week}</strong> <span className="muted">{h.date}</span>
              <br />
              {c.results[h.result].title}
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  if (phase === 'result' && outcome) {
    const res = c.results[outcome.result];
    return (
      <div className="stack">
        <section className={`card result result-${outcome.result}`} aria-live="polite" role="status" data-testid={`result-${outcome.result}`}>
          <h1>{res.title}</h1>
          <p>{res.body}</p>
          {outcome.lowAdherence && <p>{c.lowAdherence}</p>}
          {outcome.consult && <ConsultCta label={c.consultCta} />}
          <h2>{c.doctorSummaryTitle}</h2>
          <ul className="bullets">
            {QUESTIONS.map((q) => (
              <li key={q}>
                {c.questions[q]} <strong>{c.answers[(answers as CheckpointAnswers)[q]]}</strong>
              </li>
            ))}
          </ul>
        </section>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setAnswers({});
            setOutcome(null);
            setPhase('intro');
          }}
        >
          {u.retake}
        </button>
        {history}
      </div>
    );
  }

  return (
    <div className="stack">
      <section className="card" aria-labelledby="cp-title">
        <h1 id="cp-title">{c.title}</h1>
        <p className="lead">{u.intro}</p>
        {early && <p className="notice">{u.earlyNote}</p>}
        <h2>{c.protocolTitle}</h2>
        <ol className="steps">
          {c.protocol.map((p) => <li key={p}>{p}</li>)}
        </ol>
        <p className="muted">{c.noUploads}</p>

        {phase === 'intro' ? (
          <button type="button" className="btn btn-primary btn-block" onClick={() => setPhase('questions')}>
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
            <button type="submit" className="btn btn-primary btn-block">{u.submit}</button>
          </form>
        )}
      </section>
      {history}
    </div>
  );
}
