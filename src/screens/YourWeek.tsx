import { PHASES, getPhase } from '../engine/phases';
import { CHECKPOINT_WEEKS } from '../engine/checkpoint';
import { fill, useApp } from '../state/AppState';
import { Maintenance } from './Maintenance';

const TIMELINE_WEEKS = 24;
const SPIKES = [
  { week: 3, key: 'spikeShed' as const },
  { week: 10, key: 'spikeDoubt' as const },
];

export function YourWeek({ go }: { go: (r: string) => void }) {
  const { t, week } = useApp();
  if (week === null) return null;
  const phaseId = getPhase(week);
  const phase = t.phases[phaseId];
  const w = t.ui.week;
  const pct = Math.min(week, TIMELINE_WEEKS) / TIMELINE_WEEKS;
  const nextCp = CHECKPOINT_WEEKS.find((c) => c > week);
  const onCp = (CHECKPOINT_WEEKS as readonly number[]).includes(week);
  const pos = (n: number) => `${(n / TIMELINE_WEEKS) * 100}%`;

  return (
    <div className="stack">
      <section className="card hero" aria-labelledby="week-hero">
        <p className="eyebrow">{w.phaseLabel}</p>
        <h1 id="week-hero" className="hero-week">
          {w.label} <span data-testid="week-number">{week}</span>
        </h1>
        <p className="phase-name">{phase.title}</p>

        <div
          className="timeline"
          role="img"
          aria-label={`${w.timelineLabel}: ${w.label} ${week}`}
        >
          <div className="track">
            <div className="fill" style={{ width: `${pct * 100}%` }} />
            {SPIKES.map((s) => (
              <span key={s.key} className="mark spike" style={{ left: pos(s.week) }} title={w[s.key]} />
            ))}
            {CHECKPOINT_WEEKS.map((c) => (
              <span key={c} className="mark cp" style={{ left: pos(c) }} title={`${w.checkpointMark} ${c}`} />
            ))}
            <span className="you" style={{ left: pos(Math.min(week, TIMELINE_WEEKS)) }} />
          </div>
        </div>
        <ul className="legend">
          <li><span className="dot spike" /> {w.spikeShed}</li>
          <li><span className="dot spike" /> {w.spikeDoubt}</li>
          <li><span className="dot cp" /> {w.checkpointMark} 12, 24</li>
        </ul>

        {onCp ? (
          <button type="button" className="notice notice-btn" onClick={() => go('checkpoint')}>
            {w.checkpointToday}
          </button>
        ) : nextCp ? (
          <p className="notice">
            {fill(w.nextCheckpoint, { n: nextCp === 12 ? 1 : 2, weeks: nextCp - week })}
          </p>
        ) : (
          <p className="notice">{w.beyondTimeline}</p>
        )}
      </section>

      <section className="card" aria-labelledby="common-title">
        <h2 id="common-title">{w.commonlyTitle}</h2>
        <p>{phase.body}</p>
        <p className="muted">{t.app.commonlyReportedNote}</p>
      </section>

      <div className="two-col">
        <section className="card" aria-labelledby="do-title">
          <h2 id="do-title">{w.doNowTitle}</h2>
          <ul className="bullets">{w.doNow.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>
        <section className="card" aria-labelledby="watch-title">
          <h2 id="watch-title">{w.watchTitle}</h2>
          <ul className="bullets">{w.watch.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>
      </div>

      {PHASES.find((p) => p.id === 'maintenance')!.from <= week && <Maintenance />}

      <div className="actions no-print">
        <button type="button" className="btn btn-secondary" onClick={() => go('share')}>{t.ui.share.open}</button>
        <button type="button" className="btn btn-secondary" onClick={() => go('doctor')}>{t.ui.doctor.open}</button>
      </div>

      <div className="sticky-cta">
        <button type="button" className="btn btn-accent btn-block" onClick={() => go('shed')}>
          {w.shedCta}
        </button>
      </div>
    </div>
  );
}
