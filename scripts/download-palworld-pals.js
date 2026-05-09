/* eslint-disable no-console */
/**
 * Downloads Pal portrait images for the Palworld Breeding Calculator.
 *
 * Strategy:
 *   1. Use the Palworld Fandom MediaWiki API to resolve each Pal's portrait
 *      filename (`Special:FilePath` is rate-limited / 403 for hot-linking,
 *      but the API returns the canonical CDN URL on `static.wikia.nocookie.net`).
 *   2. Fetch the underlying PNG/webp directly from the wiki CDN.
 *   3. Optimise via sharp to a 200x200 PNG with 256-colour palette
 *      quantisation (15-50 KB per file), the same approach we use for the
 *      Peppa Pig / KPop wallpaper galleries to keep LCP fast.
 *
 * Run: `node scripts/download-palworld-pals.js`
 * Force re-download: `node scripts/download-palworld-pals.js --force`
 */

const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const palsModulePath = path.join(__dirname, '..', 'src', 'data', 'palworld-pals.js');
const PALS = (() => {
  const src = fs.readFileSync(palsModulePath, 'utf8');
  const re = /P\(\s*'([^']+)'\s*,\s*'([^']+)'/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({ slug: m[1], name: m[2] });
  }
  return out;
})();

const OUT_DIR = path.join(__dirname, '..', 'public', 'palworld-pals');
const API_URL = 'https://palworld.fandom.com/api.php';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8',
};

// Pals whose Fandom wiki filename does not match `[Name]_menu.png`. Keys
// are slugs from src/data/palworld-pals.js, values are explicit filenames
// to try first (without the `File:` prefix).
const FILENAME_OVERRIDES = {};

function toWikiName(name) {
  return name.replace(/\s+/g, '_');
}

function buildFilenameCandidates(pal) {
  const wikiName = toWikiName(pal.name);
  const candidates = [
    `${wikiName}_menu.png`,
    `${wikiName}_menu2.png`,
    `${wikiName}.png`,
    `${wikiName}_icon.png`,
    `${wikiName}_Icon.png`,
  ];
  if (FILENAME_OVERRIDES[pal.slug]) {
    candidates.unshift(FILENAME_OVERRIDES[pal.slug]);
  }
  return candidates;
}

async function resolveImageUrl(pal) {
  const candidates = buildFilenameCandidates(pal);
  const titles = candidates.map((c) => `File:${c}`).join('|');
  const url = `${API_URL}?action=query&prop=imageinfo&iiprop=url|size&titles=${encodeURIComponent(titles)}&format=json&origin=*`;
  let res;
  try {
    res = await fetch(url, { headers: HEADERS });
  } catch (err) {
    return null;
  }
  if (!res.ok) return null;
  let json;
  try {
    json = await res.json();
  } catch {
    return null;
  }
  const pages = json?.query?.pages || {};
  // Walk the candidates in priority order so we get _menu.png first.
  // Map normalized -> original.
  const normalized = {};
  for (const n of json?.query?.normalized || []) {
    normalized[n.to] = n.from;
  }
  // Build map of title -> imageinfo.url
  const titleToUrl = {};
  for (const k of Object.keys(pages)) {
    const p = pages[k];
    if (p.missing !== undefined) continue;
    if (Array.isArray(p.imageinfo) && p.imageinfo[0]?.url) {
      const t = p.title;
      titleToUrl[t] = p.imageinfo[0].url;
    }
  }
  // Find first candidate (in priority order) that resolved.
  for (const c of candidates) {
    const original = `File:${c}`;
    // The API may have normalized "_" to " " in the title.
    const normalizedTitle = original.replace(/_/g, ' ');
    if (titleToUrl[original]) return titleToUrl[original];
    if (titleToUrl[normalizedTitle]) return titleToUrl[normalizedTitle];
  }
  return null;
}

async function downloadImage(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) return null;
  return buf;
}

async function optimizeBuffer(buf) {
  return sharp(buf)
    .resize(200, 200, { fit: 'cover', position: 'centre' })
    .png({
      palette: true,
      colors: 256,
      quality: 90,
      compressionLevel: 9,
      effort: 10,
    })
    .toBuffer();
}

async function processPal(pal, { force }) {
  const dest = path.join(OUT_DIR, `${pal.slug}.png`);
  if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 1024) {
    return { pal, status: 'skipped', size: fs.statSync(dest).size };
  }

  const imageUrl = await resolveImageUrl(pal);
  if (!imageUrl) {
    return { pal, status: 'no-resolve' };
  }
  const buf = await downloadImage(imageUrl);
  if (!buf) {
    return { pal, status: 'download-failed', source: imageUrl };
  }
  let optimized;
  try {
    optimized = await optimizeBuffer(buf);
  } catch (err) {
    return { pal, status: 'optimize-failed', error: err.message };
  }
  fs.writeFileSync(dest, optimized);
  return { pal, status: 'downloaded', size: optimized.length, source: imageUrl };
}

async function main() {
  const force = process.argv.includes('--force');
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Resolving + downloading ${PALS.length} Palworld portraits to ${OUT_DIR}`);
  let totalBytes = 0;
  const failed = [];

  for (let i = 0; i < PALS.length; i++) {
    const pal = PALS[i];
    const r = await processPal(pal, { force });
    if (r.status === 'downloaded') {
      totalBytes += r.size;
      console.log(`  + ${pal.slug.padEnd(28)} ${(r.size / 1024).toFixed(1)} KB`);
    } else if (r.status === 'skipped') {
      totalBytes += r.size;
      console.log(`  = ${pal.slug.padEnd(28)} skipped (${(r.size / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`  ! ${pal.slug.padEnd(28)} ${r.status}${r.error ? ` (${r.error})` : ''}`);
      failed.push(pal.slug);
    }
    // Respect Fandom's API: small delay between requests.
    await new Promise((res) => setTimeout(res, 80));
  }

  console.log('');
  console.log(
    `Done. ${(totalBytes / 1024).toFixed(0)} KB total across ${PALS.length - failed.length}/${PALS.length} pals.`
  );
  if (failed.length) {
    console.log('Failed slugs (will need manual review):');
    console.log('  ' + failed.join(', '));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
