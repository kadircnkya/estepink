/**
 * Converts source images in assets-src/ into optimized WebP files in
 * public/images/ and copies the logo into public/logo/.
 *
 *   hero.(jpg|png|webp)   -> public/images/hero.webp    (max 1800px wide)
 *   poster.*              -> public/images/poster.webp  (720x1280 cover)
 *   g1..g9.*              -> public/images/gN.webp      (800x1200 cover)
 *   logo.png              -> public/logo/logo.png       (max 760px wide, transparent)
 */
import { readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const srcDir = path.join(root, 'assets-src');
const imgOut = path.join(root, 'public', 'images');
const logoOut = path.join(root, 'public', 'logo');
await mkdir(imgOut, { recursive: true });
await mkdir(logoOut, { recursive: true });

const RULES = [
  { test: /^hero$/, resize: { width: 1800, withoutEnlargement: true }, quality: 80 },
  { test: /^poster$/, resize: { width: 720, height: 1280, fit: 'cover' }, quality: 80 },
  { test: /^g[1-9]$/, resize: { width: 800, height: 1200, fit: 'cover' }, quality: 78 },
];

const files = await readdir(srcDir);
for (const file of files) {
  const { name, ext } = path.parse(file);
  if (!/\.(jpe?g|png|webp)$/i.test(ext)) continue;
  const input = path.join(srcDir, file);

  if (name === 'logo') {
    const out = path.join(logoOut, 'logo.png');
    await sharp(input)
      .resize({ width: 760, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log('logo ->', path.relative(root, out));
    continue;
  }

  const rule = RULES.find((r) => r.test.test(name));
  if (!rule) continue;
  const out = path.join(imgOut, `${name}.webp`);
  const info = await sharp(input)
    .rotate()
    .resize(rule.resize)
    .webp({ quality: rule.quality, effort: 6 })
    .toFile(out);
  console.log(`${file} -> ${path.relative(root, out)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
}
