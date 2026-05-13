// Second optimisation pass for what-memes GIFs that are still > 1.5 MB.
// More aggressive lossy settings (fewer colours, higher inter-frame
// tolerance) to bring the worst offenders down further. Animation is
// preserved.

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'what-memes');
const THRESHOLD = 1.5 * 1024 * 1024;

function fmt(b) {
  if (b >= 1024 * 1024) return (b / 1024 / 1024).toFixed(2) + ' MB';
  if (b >= 1024) return (b / 1024).toFixed(1) + ' KB';
  return b + ' B';
}

async function main() {
  const files = fs.readdirSync(DIR).filter((f) => /\.gif$/i.test(f)).sort();
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const full = path.join(DIR, file);
    const before = fs.statSync(full).size;
    if (before < THRESHOLD) {
      console.log(`  ${file.padEnd(20)} ${fmt(before).padStart(10)}  (under threshold, skipped)`);
      totalBefore += before;
      totalAfter += before;
      continue;
    }
    totalBefore += before;

    try {
      const buf = fs.readFileSync(full);
      const meta = await sharp(buf, { animated: true }).metadata();

      const optimized = await sharp(buf, { animated: true })
        .gif({
          effort: 10,
          colours: 64,
          interFrameMaxError: 28,
          interPaletteMaxError: 16,
          loop: 0,
          dither: 1,
        })
        .toBuffer();

      if (optimized.length < before * 0.97) {
        fs.writeFileSync(full, optimized);
        totalAfter += optimized.length;
        const saved = (((before - optimized.length) / before) * 100).toFixed(1);
        console.log(`  ${file.padEnd(20)} ${fmt(before).padStart(10)} -> ${fmt(optimized.length).padStart(10)}  (-${saved}%, ${meta.width}w, ${meta.pages} frames)`);
      } else {
        totalAfter += before;
        console.log(`  ${file.padEnd(20)} ${fmt(before).padStart(10)}  (kept original)`);
      }
    } catch (err) {
      totalAfter += before;
      console.error(`  ${file.padEnd(20)} FAILED: ${err.message}`);
    }
  }

  const saved = totalBefore - totalAfter;
  const pct = ((saved / totalBefore) * 100).toFixed(1);
  console.log(`\nTotal: ${fmt(totalBefore)} -> ${fmt(totalAfter)}  (-${pct}%, saved ${fmt(saved)})`);
}

main().catch((err) => { console.error(err); process.exit(1); });
