const sharp = require("sharp");
const path = require("path");

const inputPath = path.join(__dirname, "../public/photos/icon-172.png");
const outputPath = path.join(__dirname, "../public/photos/icon-172-padded.png");

sharp(inputPath)
  .resize(172, 172)
  .extend({
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .toFile(outputPath)
  .then(() => {
    console.log("Image with padding created successfully (192x192)!");
    console.log("Output:", outputPath);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
