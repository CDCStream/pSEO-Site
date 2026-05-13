const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'beach-wallpapers');

async function optimize() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} PNGs in beach-wallpapers`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const buf = fs.readFileSync(filePath);
    totalBefore += buf.length;

    const optimized = await sharp(buf)
      .resize({ width: 816, withoutEnlargement: true })
      .png({ palette: true, quality: 80, colors: 128, dither: 0.5 })
      .toBuffer();

    fs.writeFileSync(filePath, optimized);
    totalAfter += optimized.length;

    const reduction = ((1 - optimized.length / buf.length) * 100).toFixed(1);
    console.log(`  ${file}: ${(buf.length / 1024).toFixed(0)}KB -> ${(optimized.length / 1024).toFixed(0)}KB (-${reduction}%)`);
  }

  console.log(`\nTotal: ${(totalBefore / 1048576).toFixed(2)}MB -> ${(totalAfter / 1048576).toFixed(2)}MB (-${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`);
}

optimize().catch(console.error);
