// convert-to-png.cjs — Convert all 5 SVG banners to PNG (1000x1000)
const sharp = require('sharp');
const path = require('path');

const banners = [
  { svg: 'banner-01-template.svg',   png: 'banner-01-template.png'   },
  { svg: 'banner-02-medical.svg',    png: 'banner-02-medical.png'    },
  { svg: 'banner-03-dashboard.svg',  png: 'banner-03-dashboard.png'  },
  { svg: 'banner-04-optimize.svg',   png: 'banner-04-optimize.png'   },
  { svg: 'banner-05-industry.svg',   png: 'banner-05-industry.png'   },
];

async function convertAll() {
  for (const { svg, png } of banners) {
    const inputPath = path.join(__dirname, svg);
    const outputPath = path.join(__dirname, png);
    try {
      await sharp(inputPath)
        .resize(1000, 1000, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
        .png({ quality: 95 })
        .toFile(outputPath);
      console.log(`✅ Converted: ${png}`);
    } catch (err) {
      console.error(`❌ Error converting ${svg}:`, err.message);
    }
  }
  console.log('\nAll done!');
}

convertAll();
