const fs = require('fs');
const path = require('path');

// Simple SVG icon template
const createIcon = (size) => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4C6EF5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7950F2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#gradient)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">AI</text>
</svg>`;
  return svg;
};

// Generate icons
const sizes = [192, 512];
sizes.forEach((size) => {
  const svg = createIcon(size);
  const outputPath = path.join(__dirname, '..', 'public', `icon-${size}.svg`);
  fs.writeFileSync(outputPath, svg);
  console.log(`Generated icon-${size}.svg`);
});

console.log('Icon generation complete!');
