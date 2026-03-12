const sharp = require("sharp");
const path = require("path");

const inputPath = path.join(__dirname, "../public/photos/icon-172.png");
const outputPath = path.join(__dirname, "../public/photos/icon-172-padded.png");

sharp(inputPath)
  .resize(172, 172)
  .extend({
    top: 17,
    bottom: 17,
    left: 17,
    right: 17,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .toFile(outputPath)
  .then(() => {
    console.log("Image with 10% padding created successfully!");
    console.log("Output:", outputPath);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
