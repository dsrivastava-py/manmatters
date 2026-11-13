// Builds the PWA icons from the official Man Matters logo (public/brand/logo.png):
// original proportions and colours, never recoloured or stretched, on white with clear space.
// Needs Playwright (not a project dependency): run from a folder that has it installed, e.g.
//   NODE_PATH=<dir>/node_modules node scripts/make-icons.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire(process.env.NODE_PATH ? process.env.NODE_PATH + '/' : import.meta.url);
const { chromium } = require('playwright');

const logo = 'data:image/png;base64,' + readFileSync('public/brand/logo.png').toString('base64');
// Logo width as a share of the icon. Maskable stays inside the 80% safe zone.
const ICONS = [
  ['icon-192.png', 192, 0.7],
  ['icon-512.png', 512, 0.7],
  ['icon-maskable-512.png', 512, 0.58],
  ['apple-touch-icon.png', 180, 0.7],
];
mkdirSync('public/icons', { recursive: true });
const b = await chromium.launch();
for (const [name, size, share] of ICONS) {
  const p = await b.newPage({ viewport: { width: size, height: size } });
  await p.setContent(
    `<body style="margin:0;background:#fff;display:grid;place-items:center;height:100vh"><img id=i src="${logo}" style="width:${share * 100}%;height:auto"></body>`,
  );
  await p.waitForFunction(() => document.getElementById('i').complete);
  writeFileSync(`public/icons/${name}`, await p.screenshot({ type: 'png' }));
  await p.close();
}
await b.close();
console.log('icons written');
