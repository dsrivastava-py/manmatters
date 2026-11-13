import { useApp } from '../state/AppState';

export function Maintenance() {
  const { t } = useApp();
  const m = t.maintenance;
  return (
    <section className="card accent-card" aria-labelledby="maint-title">
      <h2 id="maint-title">{m.title}</h2>
      <p>{m.body}</p>
      <p className="plain">{t.ui.week.maintenanceHonest}</p>
      <ul className="bullets">
        {m.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </section>
  );
}
