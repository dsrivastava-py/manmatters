import { useEffect, useMemo, useRef, useState } from 'react';
import { CONSULT_URL } from '../config';
import { getPhase } from '../engine/phases';
import { canvasToBlob, drawShareCard, shareOrDownload } from '../lib/shareCard';
import type { ShareCardModel } from '../lib/shareCard';
import { useApp } from '../state/AppState';

export function ShareCard({ go }: { go: (r: string) => void }) {
  const { t, week, data } = useApp();
  const s = t.ui.share;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('');
  const [canDraw, setCanDraw] = useState(true);

  const model: ShareCardModel | null = useMemo(() => {
    if (week === null) return null;
    const shed = data.lastShedCheck;
    const cps = [12, 24].map((w) => {
      const found = [...data.checkpoints].reverse().find((c) => c.week === w);
      return `${t.ui.checkpoint.weekLabel} ${w}: ${found ? t.checkpoint.results[found.result].title : s.notDone}`;
    });
    return {
      title: s.cardTitle,
      weekText: `${t.ui.week.label} ${week}`,
      phase: t.phases[getPhase(week)].title,
      lastShedLabel: s.lastShed,
      lastShed: shed ? `${t.shedCheck.outcomes[shed.outcome].title} (${t.ui.week.label} ${shed.week})` : s.noShed,
      checkpointsLabel: s.checkpoints,
      checkpointLines: cps,
      consultLine: s.consultLine,
      consultHost: new URL(CONSULT_URL).host,
      conceptTag: s.conceptTag,
    };
  }, [week, data.lastShedCheck, data.checkpoints, t, s]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !model) return;
    try {
      drawShareCard(c, model);
      setCanDraw(true);
    } catch {
      setCanDraw(false);
    }
  }, [model]);

  const run = async () => {
    const c = canvasRef.current;
    if (!c || !model) return;
    try {
      const blob = await canvasToBlob(c);
      const r = await shareOrDownload(blob, s.shareText);
      setStatus(r === 'shared' ? s.shared : r === 'downloaded' ? s.downloaded : '');
    } catch {
      setStatus(s.failed);
    }
  };

  if (!model) return null;
  const canShareFiles = typeof navigator !== 'undefined' && typeof navigator.canShare === 'function';

  return (
    <div className="stack">
      <section className="card" aria-labelledby="share-title">
        <h1 id="share-title">{s.title}</h1>
        <p className="lead">{s.lead}</p>
        <canvas ref={canvasRef} className="share-canvas" role="img" aria-label={s.previewAlt} />
        <p className="muted">{s.noPersonal}</p>
        <button type="button" className="btn btn-primary btn-block" onClick={run} disabled={!canDraw}>
          {canShareFiles ? s.share : s.download}
        </button>
        <p className="muted" role="status" aria-live="polite">{status}</p>
        <button type="button" className="btn btn-secondary btn-block" onClick={() => go('week')}>
          {t.ui.doctor.back}
        </button>
      </section>
    </div>
  );
}

