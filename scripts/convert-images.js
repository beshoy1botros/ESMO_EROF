/**
 * Image Conversion Script
 * Converts images to WebP format for better performance
 * 
 * Requirements:
 * npm install sharp
 * 
 * Usage:
 * node scripts/convert-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = path.join(__dirname, '../public/photos');
const QUALITY = 80;

// Supported input formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];

async function convertImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const basename = path.basename(filePath, ext);
  const outputPath = path.join(PHOTOS_DIR, `${basename}.webp`);

  try {
    await sharp(filePath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);
    
    // Get size comparison
    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ Converted: ${basename}.webp (${savings}% smaller)`);
  } catch (error) {
    console.error(`✗ Error converting ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🖼️  Starting image conversion to WebP...\n');
  
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error('Photos directory not found!');
    process.exit(1);
  }

  const files = fs.readdirSync(PHOTOS_DIR);
  const imagesToConvert = files.filter(file => 
    SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase())
  );

  if (imagesToConvert.length === 0) {
    console.log('No images to convert!');
    return;
  }

  console.log(`Found ${imagesToConvert.length} images to convert.\n`);

  for (const file of imagesToConvert) {
    await convertImage(path.join(PHOTOS_DIR, file));
  }

  console.log('\n✅ Conversion complete!');
  console.log('\nNext steps:');
  console.log('1. Update image references in your code to use .webp files');
  console.log('2. Or add a fallback mechanism for browsers that don\'t support WebP');
}

main();
