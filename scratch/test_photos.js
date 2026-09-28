const fs = require('fs');
const path = require('path');

// Read existing places as base
const oldPlaces = JSON.parse(fs.readFileSync('scratch/generated_places.json', 'utf-8'));

// Extract numbered photos for each folder
const imgDir = 'Img';
const dirs = fs.readdirSync(imgDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
const folderPhotosMap = {};
dirs.forEach(d => {
  const files = fs.readdirSync(path.join(imgDir, d));
  const numbered = files.filter(f => /^\d{1,3}\.(jpg|jpeg|png|webp)$/i.test(f)).sort((a,b) => parseInt(a,10) - parseInt(b,10));
  folderPhotosMap[d] = numbered.map(f => `/Img/${encodeURIComponent(d)}/${f}`);
});

console.log('Total folder photos mapped:', Object.keys(folderPhotosMap).length);
