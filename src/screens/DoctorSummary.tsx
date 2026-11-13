import { useApp } from '../state/AppState';

const QUESTIONS = ['lessShedding', 'fillIn', 'thicker', 'consistentUse', 'photoBetter', 'newThinning'] as const;

export function DoctorSummary({ go }: { go: (r: string) => void }) {
  const { t, week, data } = useApp();
  const d = t.ui.doctor;
  const c = t.checkpoint;
  const latest = data.checkpoints.length ? data.checkpoints[data.checkpoints.length - 1] : null;
  const shed = data.lastShedCheck;

  return (
    <div className="stack">
      <article className="card doctor-sheet" aria-labelledby="doc-title">
        <h1 id="doc-title">{d.title}</h1>
        <dl className="facts">
          <div><dt>{d.startDate}</dt><dd>{data.startDate}</dd></div>
          <div><dt>{d.weeksElapsed}</dt><dd>{week}</dd></div>
          <div>
            <dt>{d.lastShed}</dt>
            <dd>{shed ? `${t.shedCheck.outcomes[shed.outcome].title} (${shed.date}, ${t.ui.week.label} ${shed.week})` : d.noShed}</dd>
          </div>
          <div>
            <dt>{d.adherence}</dt>
            <dd>{latest ? c.answers[latest.answers.consistentUse] : d.none}</dd>
          </div>
        </dl>
        <h2>{d.checkpointsTitle}</h2>
        {data.checkpoints.length === 0 ? (
          <p>{d.none}</p>
        ) : (
          data.checkpoints.map((cp, i) => (
            <section key={`${cp.date}-${i}`} className="cp-block">
              <h3>
                {t.ui.checkpoint.weekLabel} {cp.week}: {c.results[cp.result].title} ({d.dateLabel} {cp.date})
              </h3>
              <ul className="bullets">
                {QUESTIONS.map((q) => (
                  <li key={q}>{c.questions[q]} <strong>{c.answers[cp.answers[q]]}</strong></li>
                ))}
              </ul>
            </section>
          ))
        )}
        <p className="muted doctor-disclaimer">{d.disclaimer}</p>
      </article>
      <div className="no-print actions">
        <button type="button" className="btn btn-secondary" onClick={() => go('checkpoint')}>{d.back}</button>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>{d.print}</button>
      </div>
    </div>
  );
}
