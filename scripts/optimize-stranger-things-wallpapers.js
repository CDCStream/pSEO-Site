/**
 * One-shot script: optimize public/stranger-things-wallpapers/*.png
 * in place using palette-quantised PNG. Same approach as the Peppa Pig
 * and KPop Demon Hunters gallery optimisers — adaptive 256-colour
 * palette via libimagequant gives a 3-5x size reduction on stylised /
 * 80s-cinematic stills with limited colour count, which is the
 * SEO-health-score lever (Core Web Vitals LCP) for an image-heavy
 * gallery page.
 *
 * Run: node scripts/optimize-stranger-things-wallpapers.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'stranger-things-wallpapers');

async function main() {
  const files = fs
    .readdirSync(DIR)
    .filter((f) => /^stranger-things-wallpaper\d+\.png$/i.test(f))
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
        `${f.padEnd(42)} ${(before / 1024).toFixed(0).padStart(5)} KB -> ${(optimized.length / 1024).toFixed(0).padStart(5)} KB  (${(100 - (optimized.length / before) * 100).toFixed(0)}% smaller)`
      );
    } else {
      totalAfter += before;
      console.log(`${f.padEnd(42)} unchanged (already optimal)`);
    }
  }

  console.log('-----------------------------------------------------');
  console.log(`Total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB  (${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}% saved)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
