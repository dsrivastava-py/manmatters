import { JOURNEY, PHASES, getPhase, journeyIndex, nextMilestone, weekStartISO } from '../engine/phases';
import type { JourneyStep } from '../engine/phases';
import { isCheckpointWeek } from '../engine/checkpoint';
import { fill, todayISO, useApp } from '../state/AppState';
import type { Content } from '../content';
import { daysUntil, formatDate, whenPhrase } from '../lib/when';
import { CardHead, Icon } from '../components/NavIcon';
import { Maintenance } from './Maintenance';

function stepWeeks(t: Content, s: JourneyStep): string {
  const j = t.ui.journey;
  if (s.to === null) return fill(j.weekFrom, { n: s.from });
  if (s.from === s.to) return fill(j.weekOne, { n: s.from });
  return fill(j.weekRange, { from: s.from, to: s.to });
}

export function YourWeek({ go }: { go: (r: string) => void }) {
  const { t, week, data } = useApp();
  if (week === null || !data.startDate) return null;
  const start = data.startDate;
  const today = todayISO();
  const locale = t.ui.when.dateLocale;
  const phaseId = getPhase(week);
  const phase = t.phases[phaseId];
  const w = t.ui.week;
  const j = t.ui.journey;
  const here = journeyIndex(week);
  const next = nextMilestone(week);
  const nextDate = next ? weekStartISO(start, next.week) : null;
  const nextLine =
    next && nextDate
      ? fill(w.nextLine, {
          name: j.steps[next.step.id],
          date: formatDate(nextDate, locale),
          when: whenPhrase(t, daysUntil(nextDate, today)),
        })
      : w.beyondTimeline;

  return (
    <div className="week-grid">
      <div className="week-main stack">
        <section className="card hero" aria-labelledby="week-hero">
          <p className="eyebrow">{w.phaseLabel}</p>
          <h1 id="week-hero" className="hero-week">
            {w.label} <span data-testid="week-number">{week}</span>
          </h1>
          <p className="phase-name">{phase.title}</p>
          {isCheckpointWeek(week) ? (
            <button type="button" className="kabtak kabtak-btn" onClick={() => go('checkpoint')}>
              <span className="kabtak-label">{t.ui.kabTakLabel}</span>
              <span>{w.checkpointToday}</span>
              <Icon name="arrow" size={18} />
            </button>
          ) : (
            <p className="kabtak" data-testid="next-milestone">
              <span className="kabtak-label">{t.ui.kabTakLabel}</span>
              <span>{nextLine}</span>
            </p>
          )}
        </section>

        <section className="card" aria-labelledby="journey-title">
          <CardHead icon="route" title={j.title} id="journey-title" />
          <ol className="journey" aria-label={w.timelineLabel}>
            {JOURNEY.map((s, i) => {
              const state = i < here ? 'done' : i === here ? 'current' : 'todo';
              const isNext = next?.step.id === s.id;
              const date = s.id === 'start' ? start : weekStartISO(start, s.from);
              return (
                <li
                  key={s.id}
                  className={`j-step j-${state} ${s.checkpoint ? 'j-cp' : ''} ${isNext ? 'j-next' : ''}`}
                  aria-current={state === 'current' ? 'step' : undefined}
                >
                  <span className="j-dot" aria-hidden="true">{state === 'done' && <Icon name="check" size={12} />}</span>
                  <span className="j-body">
                    <span className="j-title">
                      {j.steps[s.id]}
                      {state === 'current' && <span className="j-here">{j.youAreHere}</span>}
                    </span>
                    <span className="j-meta">
                      {s.id === 'start' ? fill(j.startedOn, { date: formatDate(start, locale) }) : stepWeeks(t, s)}
                      {isNext && (
                        <>
                          {' · '}
                          <strong>{formatDate(date, locale)}</strong>
                          {' · '}
                          {whenPhrase(t, daysUntil(date, today))}
                        </>
                      )}
                    </span>
                    {state === 'current' && s.id === 'shed-window' && <span className="j-note">{w.spikeShed}</span>}
                    {state === 'current' && s.id === 'early-signs' && <span className="j-note">{w.spikeDoubt}</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <div className="week-side stack">
        <div className="fab-wrap no-print">
          <button type="button" className="btn btn-accent btn-block fab" onClick={() => go('shed')} aria-label={w.shedCta} aria-describedby="fab-hint">
            <Icon name="shed" size={20} />
            <span className="fab-text">
              <span>{w.shedCta}</span>
              <span className="fab-hint" id="fab-hint">{w.shedCtaHint}</span>
            </span>
          </button>
        </div>

        <section className="card" aria-labelledby="common-title">
          <CardHead icon="info" title={w.commonlyTitle} id="common-title" />
          <p>{phase.body}</p>
          <p className="muted small">{t.app.commonlyReportedNote}</p>
        </section>

        <section className="card" aria-labelledby="do-title">
          <CardHead icon="check" title={w.doNowTitle} id="do-title" />
          <ul className="bullets">{w.doNow.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>
        <section className="card" aria-labelledby="watch-title">
          <CardHead icon="eye" title={w.watchTitle} id="watch-title" />
          <ul className="bullets">{w.watch.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>

        {PHASES.find((p) => p.id === 'maintenance')!.from <= week && <Maintenance />}

        <div className="actions no-print">
          <button type="button" className="btn btn-secondary" onClick={() => go('share')}>
            <Icon name="share" size={18} /> {t.ui.share.open}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => go('doctor')}>
            <Icon name="doc" size={18} /> {t.ui.doctor.open}
          </button>
        </div>
      </div>
    </div>
  );
}
