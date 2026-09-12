// Run after generate-brand.py: node scripts/render-brand.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readdir } from 'node:fs/promises';
const root = fileURLToPath(new URL('../', import.meta.url));
const render = (source, output, width) => sharp(path.join(root, source), { density: 192 }).resize({ width }).png().toFile(path.join(root, output));
const brandSources = (await readdir(path.join(root, 'public/brand'))).filter(name => name.endsWith('.svg'));
await Promise.all([
  render('public/favicon.svg', 'public/favicon.png', 64),
  render('public/brand/rightrefer-app-icon.svg', 'public/apple-touch-icon.png', 180),
  render('public/og-image.svg', 'public/og-image.png', 1200),
  render('public/rightrefer-logo.svg', 'public/rightrefer-logo.png', 256),
  ...brandSources.flatMap(name => {
    const width = /mark-|app-icon/.test(name) ? 1024 : 2048;
    return [
      render(`public/brand/${name}`, `public/brand/${name.replace('.svg', '.png')}`, width),
      sharp(path.join(root, 'public/brand', name), { density: 192 }).resize({ width }).webp({ lossless: true }).toFile(path.join(root, 'public/brand', name.replace('.svg', '.webp'))),
    ];
  }),
  render('docs/brand/rightrefer-identity.svg', 'docs/brand/rightrefer-identity.png', 1440),
  render('docs/brand/louize-size-proof.svg', 'docs/brand/louize-size-proof.png', 600),
]);
await sharp(path.join(root, 'public/rightrefer-logo.svg'), { density: 192 }).resize(256).webp({ lossless: true }).toFile(path.join(root, 'public/rightrefer-logo.webp'));
console.log('Rendered RightRefer PNG exports.');
