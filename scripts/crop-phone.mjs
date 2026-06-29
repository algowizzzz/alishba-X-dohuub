// Find the phone bounding box in each landing-page screenshot
// and emit cropped PNG + WebP into portal landing assets.

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'c:/Users/user/Desktop/dohubb-clone/landing-page/assets';
const OUT_PNG = 'c:/Users/user/Desktop/dohubb-clone/dohuub_claude/doohub-app/apps/portal/public/landing/assets';
// Mapping: (source filename) -> (dest base name without extension, title)
const MAP = [
  { src: 'image.png',          base: 'splash',     title: 'Splash' },
  { src: 'image copy.png',     base: 'welcome',    title: 'Welcome' },
  { src: 'image copy 2.png',   base: 'home',       title: 'Home Screen' },
  { src: 'image copy 3.png',   base: 'cleaning',   title: 'Cleaning Services' },
  { src: 'image copy 4.png',   base: 'vendor',     title: 'Vendor Profile' },
  { src: 'image copy 5.png',   base: 'groceries',  title: 'Groceries & Food' },
  { src: 'image copy 6.png',   base: 'food',       title: 'Food Delivery' },
  { src: 'image copy 7.png',   base: 'beauty',     title: 'Beauty Products' },
  { src: 'image copy 8.png',   base: 'rentals',    title: 'Rental Properties' },
  { src: 'image copy 9.png',   base: 'caregiving', title: 'Caregiving Services' },
  { src: 'image copy 10.png',  base: 'ai',         title: 'AI Assistant' },
  { src: 'image copy 11.png',  base: 'profile',    title: 'Profile' },
  { src: 'image copy 12.png',  base: 'rewards',    title: 'Rewards Wallet' },
];

// Detect phone bounds by scanning a horizontal band in the middle of the image.
// Phone bezel is very dark, background is very light.
async function detectBounds(filepath) {
  const img = sharp(filepath);
  const { width, height } = await img.metadata();
  const { data, info } = await img
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const ch = info.channels; // 3 (RGB)
  const W = info.width, H = info.height;

  const isDark = (r, g, b) => (r + g + b) / 3 < 80; // very dark pixel
  // Limit search to the central vertical band to avoid browser chrome/taskbar.
  const yStart = Math.floor(H * 0.10);
  const yEnd   = Math.floor(H * 0.90);

  // Find topmost dark pixel in central horizontal band (x: 35%..65%)
  const xCenterStart = Math.floor(W * 0.35);
  const xCenterEnd   = Math.floor(W * 0.65);
  let top = -1;
  for (let y = yStart; y < yEnd && top < 0; y++) {
    for (let x = xCenterStart; x < xCenterEnd; x++) {
      const i = (y * W + x) * ch;
      if (isDark(data[i], data[i+1], data[i+2])) { top = y; break; }
    }
  }
  // bottom
  let bottom = -1;
  for (let y = yEnd - 1; y >= yStart && bottom < 0; y--) {
    for (let x = xCenterStart; x < xCenterEnd; x++) {
      const i = (y * W + x) * ch;
      if (isDark(data[i], data[i+1], data[i+2])) { bottom = y; break; }
    }
  }
  // left: scan within vertical band of [top..bottom]
  let left = -1;
  for (let x = 0; x < W && left < 0; x++) {
    for (let y = top; y <= bottom; y++) {
      const i = (y * W + x) * ch;
      if (isDark(data[i], data[i+1], data[i+2])) { left = x; break; }
    }
  }
  let right = -1;
  for (let x = W - 1; x >= 0 && right < 0; x--) {
    for (let y = top; y <= bottom; y++) {
      const i = (y * W + x) * ch;
      if (isDark(data[i], data[i+1], data[i+2])) { right = x; break; }
    }
  }
  return { width, height, left, right, top, bottom };
}

const bounds = [];
for (const m of MAP) {
  const p = path.join(SRC, m.src);
  if (!fs.existsSync(p)) { console.error('MISSING', m.src); continue; }
  const b = await detectBounds(p);
  bounds.push({ ...m, ...b });
  console.log(m.src, '→', `L${b.left} R${b.right} T${b.top} B${b.bottom}  (W=${b.right-b.left} H=${b.bottom-b.top})`);
}

// Common crop box: use union → tight phone region. Add a small horizontal pad.
const PAD_X = 14;
const PAD_Y = 12;
const minLeft   = Math.min(...bounds.map(b => b.left));
const maxRight  = Math.max(...bounds.map(b => b.right));
const minTop    = Math.min(...bounds.map(b => b.top));
const maxBottom = Math.max(...bounds.map(b => b.bottom));
const cropX = Math.max(0, minLeft - PAD_X);
const cropY = Math.max(0, minTop - PAD_Y);
const cropW = Math.min(1920, maxRight + PAD_X) - cropX;
const cropH = Math.min(1080, maxBottom + PAD_Y) - cropY;
console.log('\nCROP', { cropX, cropY, cropW, cropH });

fs.mkdirSync(OUT_PNG, { recursive: true });
for (const m of MAP) {
  const inPath  = path.join(SRC, m.src);
  const outPng  = path.join(OUT_PNG, `${m.base}.png`);
  const outWebp = path.join(OUT_PNG, `${m.base}.webp`);
  await sharp(inPath)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .toFile(outPng);
  await sharp(outPng).webp({ quality: 88 }).toFile(outWebp);
  console.log('wrote', path.basename(outPng), '+', path.basename(outWebp));
}
console.log('\nDONE');
