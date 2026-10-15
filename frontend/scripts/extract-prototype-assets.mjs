/**
 * One-off helper: pulls the embedded base64 assets out of the reference
 * prototype (../estepink.html) so the project can run without manually
 * collecting files. Real production assets can later replace them in
 * assets-src/ (images) and public/video/ (video).
 *
 *   npm run assets:extract && npm run assets:optimize
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const htmlPath = process.argv[2] ?? path.resolve(root, 'dot', 'estepink(1).html');
const srcDir = path.join(root, 'assets-src');
const videoDir = path.join(root, 'public', 'video');

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'video/mp4': 'mp4' };
/** prototype key -> output base name */
const NAMES = {
  hero: 'hero',
  poster: 'poster',
  logo: 'logo',
  ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => [`i${i + 1}`, `g${i + 1}`])),
};

const html = await readFile(htmlPath, 'utf8');
await mkdir(srcDir, { recursive: true });
await mkdir(videoDir, { recursive: true });

const entry = /"(\w+)":\s*"data:([\w/+.-]+);base64,([A-Za-z0-9+/=]+)"/g;
let count = 0;
for (const [, key, mime, b64] of html.matchAll(entry)) {
  const name = NAMES[key];
  if (!name) continue;
  const file = path.join(srcDir, `${name}.${EXT[mime] ?? 'bin'}`);
  await writeFile(file, Buffer.from(b64, 'base64'));
  count++;
  console.log('image', path.relative(root, file));
}

const vid = /window\.VID\s*=\s*'data:video\/mp4;base64,([A-Za-z0-9+/=]+)'/.exec(html);
if (vid) {
  const file = path.join(videoDir, 'promo.mp4');
  await writeFile(file, Buffer.from(vid[1], 'base64'));
  console.log('video', path.relative(root, file));
}
console.log(`done: ${count} images${vid ? ' + video' : ''}`);
