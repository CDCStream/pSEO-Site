// One-shot: optimise animated GIFs in public/airball-memes/ in place.
// Three-pass approach for the extra-heavy files in this set.
// Run: node scripts/optimize-airball-memes.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'airball-memes');
const MAX_WIDTH = 480;

function fmt(b) {
  if (b >= 1024 * 1024) return (b / 1024 / 1024).toFixed(2) + ' MB';
  if (b >= 1024) return (b / 1024).toFixed(1) + ' KB';
  return b + ' B';
}

async function optimise(file, colours, interFrame, interPalette, resize) {
  const full = path.join(DIR, file);
  const before = fs.statSync(full).size;
  const buf = fs.readFileSync(full);
  const meta = await sharp(buf, { animated: true }).metadata();

  const pipeline = sharp(buf, { animated: true });
  if (resize && meta.width && meta.width > MAX_WIDTH) {
    pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const optimized = await pipeline
    .gif({
      effort: 10,
      colours,
      interFrameMaxError: interFrame,
      interPaletteMaxError: interPalette,
      loop: 0,
      dither: 1,
    })
    .toBuffer();

  if (optimized.length < before * 0.97) {
    fs.writeFileSync(full, optimized);
    const saved = (((before - optimized.length) / before) * 100).toFixed(1);
    const w = resize && meta.width > MAX_WIDTH ? `${meta.width}->${MAX_WIDTH}w` : `${meta.width || '?'}w`;
    console.log(
      `  ${file.padEnd(22)} ${fmt(before).padStart(10)} -> ${fmt(optimized.length).padStart(10)}  (-${saved}%, ${meta.pages || 1}f, ${w})`
    );
    return { before, after: optimized.length };
  }
  console.log(`  ${file.padEnd(22)} ${fmt(before).padStart(10)}  (kept, ${meta.pages || 1}f)`);
  return { before, after: before };
}

async function main() {
  if (!fs.existsSync(DIR)) { console.error('Dir not found'); process.exit(1); }

  const files = fs.readdirSync(DIR)
    .filter((f) => /\.gif$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)?.[1] || '0', 10);
      const nb = parseInt(b.match(/(\d+)/)?.[1] || '0', 10);
      return na - nb;
    });

  const origTotal = files.reduce((s, f) => s + fs.statSync(path.join(DIR, f)).size, 0);
  console.log(`\nOriginal total: ${fmt(origTotal)} (${files.length} GIFs)\n`);

  console.log('=== Pass 1: resize to 480w + 128 colours ===\n');
  for (const f of files) {
    await optimise(f, 128, 16, 8, true);
  }
  let t1 = files.reduce((s, f) => s + fs.statSync(path.join(DIR, f)).size, 0);
  console.log(`\nAfter pass 1: ${fmt(t1)} (-${(((origTotal - t1) / origTotal) * 100).toFixed(1)}%)\n`);

  const big1 = files.filter((f) => fs.statSync(path.join(DIR, f)).size > 1.5 * 1024 * 1024);
  if (big1.length) {
    console.log(`=== Pass 2: 64 colours, aggressive (${big1.length} files > 1.5 MB) ===\n`);
    for (const f of big1) {
      await optimise(f, 64, 28, 16, false);
    }
    let t2 = files.reduce((s, f) => s + fs.statSync(path.join(DIR, f)).size, 0);
    console.log(`\nAfter pass 2: ${fmt(t2)} (-${(((origTotal - t2) / origTotal) * 100).toFixed(1)}%)\n`);
  }

  const big2 = files.filter((f) => fs.statSync(path.join(DIR, f)).size > 3 * 1024 * 1024);
  if (big2.length) {
    console.log(`=== Pass 3: 32 colours, max lossy (${big2.length} files > 3 MB) ===\n`);
    for (const f of big2) {
      await optimise(f, 32, 32, 24, false);
    }
  }

  const finalTotal = files.reduce((s, f) => s + fs.statSync(path.join(DIR, f)).size, 0);
  const grandSaved = origTotal - finalTotal;
  console.log(`\nFinal: ${fmt(origTotal)} -> ${fmt(finalTotal)}  (-${((grandSaved / origTotal) * 100).toFixed(1)}%, saved ${fmt(grandSaved)})`);
}

main().catch((err) => { console.error(err); process.exit(1); });
