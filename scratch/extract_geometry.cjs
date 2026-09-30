const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./scratch/osm_roads.json'));

const bBox = {
  south: 15.3260,
  north: 15.3355,
  west: 100.0675,
  east: 100.0760
};

console.log('=== HIGHWAY 3265 POINTS ===');
const hwyPts = [];
data.elements.filter(e => e.tags?.ref === '3265').forEach(w => {
  w.geometry.forEach(pt => {
    if (pt.lat >= bBox.south && pt.lat <= bBox.north && pt.lon >= bBox.west && pt.lon <= bBox.east) {
      hwyPts.push(pt);
      console.log(`3265: lat: ${pt.lat}, lon: ${pt.lon}`);
    }
  });
});

console.log('=== RIVER (แม่น้ำสะแกกรัง) POINTS ===');
const riverPts = [];
data.elements.filter(e => e.tags?.waterway === 'river').forEach(w => {
  w.geometry.forEach(pt => {
    if (pt.lat >= bBox.south && pt.lat <= bBox.north && pt.lon >= bBox.west && pt.lon <= bBox.east) {
      riverPts.push(pt);
      console.log(`River: lat: ${pt.lat}, lon: ${pt.lon}`);
    }
  });
});

console.log('=== INTERNAL ROADS ===');
data.elements.filter(e => e.tags?.highway && e.tags?.ref !== '3265').forEach(w => {
  const inPts = w.geometry.filter(pt => pt.lat >= bBox.south && pt.lat <= bBox.north && pt.lon >= bBox.west && pt.lon <= bBox.east);
  if (inPts.length > 0) {
    console.log(`Way ${w.id} (${w.tags.name || 'unnamed'} - ${w.tags.highway}) points: ${inPts.length}`);
    inPts.forEach((pt, i) => {
      console.log(`  pt[${i}]: lat: ${pt.lat}, lon: ${pt.lon}`);
    });
  }
});
