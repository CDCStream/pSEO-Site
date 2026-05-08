/**
 * One-shot script: optimize public/peppa-pig-house-wallpapers/*.png in place.
 *
 * Strategy: cartoon art with a small effective color count compresses
 * massively when re-encoded as a palette PNG. Sharp's `palette: true` +
 * `colors: 256` runs adaptive Wu/Median-cut quantization on libimagequant,
 * which is what `pngquant` uses too. Visually indistinguishable from the
 * source for Peppa-Pig-style flat-shaded illustrations, typically 5-10x
 * smaller. Dimensions are preserved (816 x 1456 is already a good 9:16
 * phone-wallpaper resolution, no point upscaling).
 *
 * Run: node scripts/optimize-peppa-pig-house-wallpapers.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'peppa-pig-house-wallpapers');

async function main() {
  const files = fs
    .readdirSync(DIR)
    .filter((f) => /^peppa-pig-house-wallpaper\d+\.png$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)[1], 10);
      const nb = parseInt(b.match(/(\d+)/)[1], 10);
      return na - nb;
    });

  let totalBefore = 0;
  let totalAfter = 0;

  for (const f of files) {
    const full = path.join(DIR, f);
    const before = fs.statSync(full).size;
    totalBefore += before;

    const optimized = await sharp(full)
      .png({
        palette: true,
        colors: 256,
        quality: 90,
        compressionLevel: 9,
        effort: 10,
        dither: 1,
      })
      .toBuffer();

    if (optimized.length < before) {
      fs.writeFileSync(full, optimized);
      totalAfter += optimized.length;
      console.log(
        `${f.padEnd(40)} ${(before / 1024).toFixed(0).padStart(5)} KB -> ${(optimized.length / 1024).toFixed(0).padStart(5)} KB  (${(100 - (optimized.length / before) * 100).toFixed(0)}% smaller)`
      );
    } else {
      totalAfter += before;
      console.log(`${f.padEnd(40)} unchanged (already optimal)`);
    }
  }

  console.log('-----------------------------------------------------');
  console.log(`Total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB  (${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}% saved)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
