// Generates the PWA icons (brand navy background, accent yellow "KT" monogram).
// Pure node (zlib only). Run: node scripts/make-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const NAVY = [0x14, 0x34, 0x61];
const YELLOW = [0xfd, 0xdc, 0x69];

// Segments in a 0..1 box (letters live inside the central ~58% so maskable crops are safe).
const S = 0.2;
const X0 = 0.5 - 0.26;
const W = 0.52;
const Y0 = 0.27;
const H = 0.34;
const p = (x, y) => [X0 + x * W, Y0 + y * H];
const SEGS = [
  // K
  [p(0.04, 0), p(0.04, 1)],
  [p(0.4, 0), p(0.04, 0.55)],
  [p(0.14, 0.42), p(0.42, 1)],
  // T
  [p(0.6, 0), p(0.96, 0)],
  [p(0.78, 0), p(0.78, 1)],
  // underline accent
  [[0.5 - 0.1, 0.74], [0.5 + 0.1, 0.74]],
];
const THICK = 0.04;

function dist(px, py, [[ax, ay], [bx, by]]) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function render(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const N = 3;
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let hit = 0;
      for (let sy = 0; sy < N; sy++)
        for (let sx = 0; sx < N; sx++) {
          const px = (x + (sx + 0.5) / N) / size;
          const py = (y + (sy + 0.5) / N) / size;
          if (SEGS.some((s) => dist(px, py, s) <= THICK)) hit++;
        }
      const a = hit / (N * N);
      const o = y * (size * 4 + 1) + 1 + x * 4;
      for (let c = 0; c < 3; c++) raw[o + c] = Math.round(NAVY[c] * (1 - a) + YELLOW[c] * a);
      raw[o + 3] = 255;
    }
  }
  return raw;
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};
function png(size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(render(size))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icons', { recursive: true });
for (const [name, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['icon-maskable-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  writeFileSync(`public/icons/${name}`, png(size));
}
console.log('icons written');
