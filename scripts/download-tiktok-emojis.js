/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');

const SLUGS = [
  'smile', 'happy', 'angry', 'cry', 'embarrassed', 'surprised', 'wronged', 'shout',
  'flushed', 'yummy', 'complacent', 'drool', 'scream', 'weep', 'speechless', 'funnyface',
  'laughwithtears', 'wicked', 'facewithrollingeyes', 'sulk', 'thinking', 'lovely',
  'greedy', 'wow', 'hehe', 'joyful', 'slap', 'tears', 'stun', 'cute', 'blink', 'disdain',
  'astonish', 'rage', 'cool', 'excited', 'proud', 'smileface', 'evil', 'angel', 'laugh',
  'pride', 'nap', 'loveface', 'awkward', 'shock',
];

const CDN = 'https://em-content.zobj.net/content/2020/07/27';
const OUT_DIR = path.join(__dirname, '..', 'public', 'tiktok-emojis');

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8',
  Referer: 'https://emojipedia.org/',
};

async function downloadOne(slug, force = false) {
  const dest = path.join(OUT_DIR, `${slug}.png`);
  if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    return { slug, status: 'skipped', size: fs.statSync(dest).size };
  }
  const url = `${CDN}/${slug}.png`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    return { slug, status: 'failed', code: res.status };
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return { slug, status: 'downloaded', size: buf.length };
}

async function main() {
  const force = process.argv.includes('--force');
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Downloading ${SLUGS.length} TikTok emojis to ${OUT_DIR}`);
  let total = 0;
  const failed = [];

  for (const slug of SLUGS) {
    const r = await downloadOne(slug, force);
    if (r.status === 'downloaded') {
      total += r.size;
      console.log(`  + ${slug.padEnd(24)} ${(r.size / 1024).toFixed(1)} KB`);
    } else if (r.status === 'skipped') {
      total += r.size;
      console.log(`  = ${slug.padEnd(24)} skipped (already ${(r.size / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`  ! ${slug.padEnd(24)} FAILED (HTTP ${r.code})`);
      failed.push(slug);
    }
  }

  console.log('');
  console.log(`Done. Total ${(total / 1024).toFixed(1)} KB across ${SLUGS.length - failed.length}/${SLUGS.length} files.`);
  if (failed.length) {
    console.log(`Failed: ${failed.join(', ')}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
