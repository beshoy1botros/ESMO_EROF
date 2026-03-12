const sharp = require("sharp");
const path = require("path");

const inputPath = path.join(__dirname, "../public/photos/icon-172.png");
const outputPath = path.join(__dirname, "../public/photos/icon-172-padded.png");

sharp(inputPath)
  .resize(172, 172)
  .extend({
    top: 15,
    bottom: 15,
    left: 15,
    right: 15,
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
