// One-shot: optimise animated GIFs in public/sheesh-memes/ in place.
// Two-pass approach: first pass (128 colours, moderate lossy), second pass
// on files still > 1 MB (64 colours, aggressive lossy). Animation preserved.
//
// Run: node scripts/optimize-sheesh-memes.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'sheesh-memes');

function fmt(b) {
  if (b >= 1024 * 1024) return (b / 1024 / 1024).toFixed(2) + ' MB';
  if (b >= 1024) return (b / 1024).toFixed(1) + ' KB';
  return b + ' B';
}

async function optimise(file, colours, interFrame, interPalette) {
  const full = path.join(DIR, file);
  const before = fs.statSync(full).size;
  const buf = fs.readFileSync(full);
  const meta = await sharp(buf, { animated: true }).metadata();

  const optimized = await sharp(buf, { animated: true })
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
    console.log(
      `  ${file.padEnd(22)} ${fmt(before).padStart(10)} -> ${fmt(optimized.length).padStart(10)}  (-${saved}%, ${meta.pages || 1} frames)`
    );
    return { before, after: optimized.length };
  }
  console.log(`  ${file.padEnd(22)} ${fmt(before).padStart(10)}  (kept original, ${meta.pages || 1} frames)`);
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

  console.log(`\n=== Pass 1: 128 colours, moderate lossy (${files.length} GIFs) ===\n`);
  let totalBefore = 0, totalAfter = 0;
  for (const f of files) {
    const r = await optimise(f, 128, 16, 8);
    totalBefore += r.before;
    totalAfter += r.after;
  }
  console.log(`\nPass 1 total: ${fmt(totalBefore)} -> ${fmt(totalAfter)}  (-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)\n`);

  const bigFiles = files.filter((f) => fs.statSync(path.join(DIR, f)).size > 1 * 1024 * 1024);
  if (bigFiles.length) {
    console.log(`=== Pass 2: 64 colours, aggressive lossy (${bigFiles.length} files > 1 MB) ===\n`);
    let p2b = 0, p2a = 0;
    for (const f of bigFiles) {
      const r = await optimise(f, 64, 28, 16);
      p2b += r.before;
      p2a += r.after;
    }
    console.log(`\nPass 2 total: ${fmt(p2b)} -> ${fmt(p2a)}  (-${(((p2b - p2a) / p2b) * 100).toFixed(1)}%)`);
  }

  const finalTotal = files.reduce((s, f) => s + fs.statSync(path.join(DIR, f)).size, 0);
  const grandSaved = totalBefore - finalTotal;
  console.log(`\nFinal: ${fmt(totalBefore)} -> ${fmt(finalTotal)}  (-${((grandSaved / totalBefore) * 100).toFixed(1)}%, saved ${fmt(grandSaved)})`);
}

main().catch((err) => { console.error(err); process.exit(1); });
