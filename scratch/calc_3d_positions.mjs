import fs from 'fs';

const places = JSON.parse(fs.readFileSync('scratch/generated_places.json', 'utf-8'));

// Reference center:
// Near Maha Vihara Kaew & Central crossroads
const centerLat = 15.3310;
const centerLng = 100.0720;

// Three.js coordinate mapping:
// X-axis: East (+) / West (-) (Longitude)
// Z-axis: South (+) / North (-) (-Latitude)
const positions = {};

places.forEach(p => {
  const dx = (p.gps.lng - centerLng) * 1000 * 22; // ~22 units per 0.001 deg
  const dz = -(p.gps.lat - centerLat) * 1000 * 22;
  positions[p.id] = {
    x: Math.round(dx * 10) / 10,
    z: Math.round(dz * 10) / 10,
    label: p.shortName,
    height: p.id === 1 ? 16 : p.id === 3 ? 18 : p.id === 12 ? 14 : p.id === 4 ? 13 : p.id === 36 ? 12 : 8,
    highlight: p.highlight || false
  };
});

console.log('BUILDING_POSITIONS =', JSON.stringify(positions, null, 2));
