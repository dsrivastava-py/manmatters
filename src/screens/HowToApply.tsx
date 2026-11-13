import { fill, useApp } from '../state/AppState';

export function HowToApply() {
  const { t, data, patch } = useApp();
  const h = t.howToApply;
  const items = [t.ui.apply.first, ...h.steps];
  const done = items.filter((_, i) => data.routineTicks[`step-${i}`]).length;
  return (
    <section className="card narrow" aria-labelledby="apply-title">
      <h1 id="apply-title">{h.title}</h1>
      <p className="lead">{h.intro}</p>
      <p className="muted" aria-live="polite">{fill(t.ui.apply.progress, { done, total: items.length })}</p>
      <ul className="checklist">
        {items.map((item, i) => {
          const key = `step-${i}`;
          const on = !!data.routineTicks[key];
          return (
            <li key={key}>
              <label className={`tap-card ${on ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(e) => patch({ routineTicks: { ...data.routineTicks, [key]: e.target.checked } })}
                />
                <span>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="muted">{h.labelNote}</p>
    </section>
  );
}
