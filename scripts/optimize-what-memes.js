// One-shot script: optimize the animated GIFs in public/what-memes/
// in place by resizing to a max width of 600px and re-encoding with
// sharp's animated-GIF pipeline. Animation is preserved.
//
// Run: node scripts/optimize-what-memes.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'what-memes');
const MAX_WIDTH = 600;

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return bytes + ' B';
}

async function main() {
  if (!fs.existsSync(DIR)) {
    console.error(`Directory not found: ${DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(DIR)
    .filter((f) => /\.gif$/i.test(f))
    .sort((a, b) => {
      // numeric-aware sort: what-meme1.gif, what-meme2.gif, ...
      const na = parseInt(a.match(/(\d+)/)?.[1] || '0', 10);
      const nb = parseInt(b.match(/(\d+)/)?.[1] || '0', 10);
      return na - nb;
    });

  if (!files.length) {
    console.log('No GIFs found.');
    return;
  }

  console.log(`Optimising ${files.length} GIF(s) in ${DIR}\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const full = path.join(DIR, file);
    const before = fs.statSync(full).size;
    totalBefore += before;

    try {
      // Read the file into a buffer first; on Windows + OneDrive, opening
      // the file directly via libvips sometimes hits transient lock errors.
      const inputBuf = fs.readFileSync(full);
      const meta = await sharp(inputBuf, { animated: true }).metadata();
      const origWidth = meta.width;
      const pageHeight = meta.pageHeight || meta.height;
      const targetWidth = origWidth && origWidth > MAX_WIDTH ? MAX_WIDTH : origWidth;

      // Re-encode the animated GIF, optionally resizing if wider than target.
      // For GIFs that are already small enough, lossy palette + inter-frame
      // tolerances are what actually shrink the file.
      const pipeline = sharp(inputBuf, { animated: true });
      if (origWidth && origWidth > MAX_WIDTH) {
        pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }

      const optimized = await pipeline
        .gif({
          effort: 10,
          colours: 128,
          interFrameMaxError: 16,
          interPaletteMaxError: 8,
          loop: 0,
          dither: 1,
        })
        .toBuffer();

      // Only overwrite if the optimised buffer is meaningfully smaller.
      if (optimized.length < before * 0.98) {
        fs.writeFileSync(full, optimized);
        const after = optimized.length;
        totalAfter += after;
        const saved = (((before - after) / before) * 100).toFixed(1);
        console.log(
          `  ${file.padEnd(20)} ${fmt(before).padStart(10)} -> ${fmt(after).padStart(10)}  (-${saved}%, ${origWidth}w -> ${targetWidth}w, ${meta.pages || 1} frames)`
        );
      } else {
        totalAfter += before;
        console.log(
          `  ${file.padEnd(20)} ${fmt(before).padStart(10)}  (kept original, optimisation did not help)`
        );
      }
    } catch (err) {
      totalAfter += before;
      console.error(`  ${file.padEnd(20)} FAILED: ${err.message}`);
    }
  }

  const savedBytes = totalBefore - totalAfter;
  const savedPct = ((savedBytes / totalBefore) * 100).toFixed(1);
  console.log(`\nTotal: ${fmt(totalBefore)} -> ${fmt(totalAfter)}  (-${savedPct}%, saved ${fmt(savedBytes)})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
