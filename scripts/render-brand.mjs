// Run after generate-brand.py: node scripts/render-brand.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readdir, copyFile } from 'node:fs/promises';
const root = fileURLToPath(new URL('../', import.meta.url));
const render = (source, output, width) => sharp(path.join(root, source), { density: 192 }).resize({ width }).png().toFile(path.join(root, output));
const brandRoot = 'public/brand_assets';
const brandSources = (await Promise.all(['logos', 'symbols', 'icons', 'social'].map(async folder =>
  (await readdir(path.join(root, brandRoot, folder))).filter(name => name.endsWith('.svg')).map(name => `${folder}/${name}`)
))).flat();
await Promise.all([
  render('public/favicon.svg', 'public/favicon.png', 64),
  render(`${brandRoot}/icons/rightrefer-app-icon.svg`, 'public/apple-touch-icon.png', 180),
  render('public/og-image.svg', 'public/og-image.png', 1200),
  render('public/rightrefer-logo.svg', 'public/rightrefer-logo.png', 256),
  ...brandSources.flatMap(name => {
    const width = name.startsWith('social/') ? 1200 : name.endsWith('favicon.svg') ? 64 : /mark-|app-icon/.test(name) ? 1024 : 2048;
    return [
      render(`${brandRoot}/${name}`, `${brandRoot}/${name.replace('.svg', '.png')}`, width),
      sharp(path.join(root, brandRoot, name), { density: 192 }).resize({ width }).webp({ lossless: true }).toFile(path.join(root, brandRoot, name.replace('.svg', '.webp'))),
    ];
  }),
  render('docs/brand/rightrefer-identity.svg', 'docs/brand/rightrefer-identity.png', 1440),
  render('docs/brand/louize-size-proof.svg', 'docs/brand/louize-size-proof.png', 600),
]);
await copyFile(path.join(root, 'public/apple-touch-icon.png'), path.join(root, brandRoot, 'icons/apple-touch-icon.png'));
await sharp(path.join(root, 'public/rightrefer-logo.svg'), { density: 192 }).resize(256).webp({ lossless: true }).toFile(path.join(root, 'public/rightrefer-logo.webp'));
console.log('Rendered RightRefer PNG exports.');
