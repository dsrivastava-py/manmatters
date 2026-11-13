// Client-side "My Week" card: drawn on a canvas, exported as PNG, shared via the
// Web Share API when files are supported, otherwise downloaded. No network use.

export interface ShareCardModel {
  title: string;
  weekText: string;
  phase: string;
  lastShedLabel: string;
  lastShed: string;
  checkpointsLabel: string;
  checkpointLines: string[];
  consultLine: string;
  consultHost: string;
  conceptTag: string;
}

export const CARD_SIZE = { width: 1080, height: 1350 };

const NAVY = '#143461';
const YELLOW = '#FDDC69';
const SURFACE = '#F2F7FC';
const FONT = 'Inter, system-ui, sans-serif';

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function drawShareCard(canvas: HTMLCanvasElement, m: ShareCardModel): void {
  const { width: W, height: H } = CARD_SIZE;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas-unavailable');
  const pad = 80;
  const inner = W - pad * 2;

  ctx.fillStyle = SURFACE;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, 360);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 360, W, 14);

  ctx.textBaseline = 'top';
  ctx.fillStyle = YELLOW;
  ctx.font = `600 38px ${FONT}`;
  ctx.fillText(m.title.toUpperCase(), pad, 80);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 150px ${FONT}`;
  ctx.fillText(m.weekText, pad, 140);

  let y = 430;
  ctx.fillStyle = NAVY;
  ctx.font = `700 56px ${FONT}`;
  for (const l of wrap(ctx, m.phase, inner)) {
    ctx.fillText(l, pad, y);
    y += 68;
  }

  y += 30;
  ctx.fillStyle = '#225396';
  ctx.font = `600 32px ${FONT}`;
  ctx.fillText(m.lastShedLabel.toUpperCase(), pad, y);
  y += 48;
  ctx.fillStyle = NAVY;
  ctx.font = `600 42px ${FONT}`;
  for (const l of wrap(ctx, m.lastShed, inner)) {
    ctx.fillText(l, pad, y);
    y += 54;
  }

  y += 30;
  ctx.fillStyle = '#225396';
  ctx.font = `600 32px ${FONT}`;
  ctx.fillText(m.checkpointsLabel.toUpperCase(), pad, y);
  y += 48;
  ctx.fillStyle = NAVY;
  ctx.font = `600 42px ${FONT}`;
  for (const cl of m.checkpointLines) {
    for (const l of wrap(ctx, cl, inner)) {
      ctx.fillText(l, pad, y);
      y += 54;
    }
  }

  // Footer block
  const fy = H - 270;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(pad, fy, inner, 150);
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 6;
  ctx.strokeRect(pad, fy, inner, 150);
  ctx.fillStyle = NAVY;
  ctx.font = `500 32px ${FONT}`;
  ctx.fillText(m.consultLine, pad + 24, fy + 28);
  ctx.font = `700 40px ${FONT}`;
  ctx.fillText(m.consultHost, pad + 24, fy + 82);
  ctx.fillStyle = '#666666';
  ctx.font = `500 26px ${FONT}`;
  let ty = H - 100;
  for (const l of wrap(ctx, m.conceptTag, inner)) {
    ctx.fillText(l, pad, ty);
    ty += 34;
  }
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png-failed'))), 'image/png');
  });
}

export type ShareResult = 'shared' | 'downloaded' | 'cancelled';

export interface ShareEnv {
  nav: Pick<Navigator, 'share'> & { canShare?: (d: ShareData) => boolean };
  download: (blob: Blob, filename: string) => void;
}

export function browserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Share the PNG with navigator.share when files are supported, else download it. */
export async function shareOrDownload(
  blob: Blob,
  text: string,
  env: ShareEnv = { nav: navigator, download: browserDownload },
  filename = 'kab-tak-my-week.png',
): Promise<ShareResult> {
  const file = new File([blob], filename, { type: 'image/png' });
  const data: ShareData = { files: [file], text };
  const can = typeof env.nav.share === 'function' && (env.nav.canShare ? env.nav.canShare(data) : false);
  if (can) {
    try {
      await env.nav.share(data);
      return 'shared';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
      // Any other failure: fall through to download.
    }
  }
  env.download(blob, filename);
  return 'downloaded';
}
