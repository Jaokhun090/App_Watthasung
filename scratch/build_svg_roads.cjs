const fs = require('fs');

const osmData = JSON.parse(fs.readFileSync('./scratch/osm_roads.json'));

const minLat = 15.3260;
const maxLat = 15.3355;
const minLon = 100.0670;
const maxLon = 100.0765;

const svgW = 1200;
const svgH = 850;
const padX = 60;
const padY = 50;

function toSvg(lat, lon) {
  const x = padX + ((lon - minLon) / (maxLon - minLon)) * (svgW - padX * 2);
  const y = padY + ((maxLat - lat) / (maxLat - minLat)) * (svgH - padY * 2);
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

function wayToPath(way) {
  const pts = way.geometry.map(pt => toSvg(pt.lat, pt.lon));
  return 'M ' + pts.map(p => `${p.x},${p.y}`).join(' L ');
}

// 1. Highway 3265
const hwyWays = osmData.elements.filter(e => e.tags?.ref === '3265');
console.log('Highway 3265:');
hwyWays.forEach(w => {
  console.log(`  <path d="${wayToPath(w)}" />`);
});

// 2. Temple roads
const mainRoadWays = osmData.elements.filter(e => [61960494, 551418982, 551418178, 1159413936, 1159413937, 520352523, 520352526].includes(e.id));
console.log('\nTemple Main Roads:');
mainRoadWays.forEach(w => {
  console.log(`  <!-- Way ${w.id} -->`);
  console.log(`  <path d="${wayToPath(w)}" />`);
});

// 3. Somdej Park Lake Walking Track
const parkPaths = osmData.elements.filter(e => [1425745450, 1425745457, 1425745449].includes(e.id));
console.log('\nPark lake promenade:');
parkPaths.forEach(w => {
  console.log(`  <!-- Park path ${w.id} -->`);
  console.log(`  <path d="${wayToPath(w)}" />`);
});

// 4. Sakae Krang River
const riverWays = osmData.elements.filter(e => e.tags?.waterway === 'river');
console.log('\nSakae Krang River:');
riverWays.forEach(w => {
  console.log(`  <!-- River ${w.id} -->`);
  console.log(`  <path d="${wayToPath(w)}" />`);
});
