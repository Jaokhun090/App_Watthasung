const fs = require('fs');

async function main() {
  const osmData = JSON.parse(fs.readFileSync('./scratch/osm_roads.json'));
  const { places } = await import('../src/data/places.js');

  // Find tight bounding box of temple landmarks & grounds
  // Focus on the core area of Wat Tha Sung
  const minLat = 15.3262; // South boundary (just below Sala 12 Rai & Ubosot)
  const maxLat = 15.3358; // North boundary (above Somdej Park & Wang Matcha)
  const minLon = 100.0670; // West boundary (Lan 25 Rai)
  const maxLon = 100.0768; // East boundary (past Sakae Krang River)

  const svgW = 1200;
  const svgH = 850;
  const pad = 40;

  function toSvg(lat, lon) {
    const x = pad + ((lon - minLon) / (maxLon - minLon)) * (svgW - pad * 2);
    const y = pad + ((maxLat - lat) / (maxLat - minLat)) * (svgH - pad * 2);
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  }

  console.log('=== SVG COORDINATES FOR ALL 39 PLACES ===');
  const projectedPlaces = places.map(p => {
    const pt = toSvg(p.gps.lat, p.gps.lng);
    return { id: p.id, name: p.name, shortName: p.shortName, x: pt.x, y: pt.y, zone: p.zone, highlight: p.highlight };
  });
  console.log(JSON.stringify(projectedPlaces, null, 2));

  console.log('\n=== SVG ROADS ===');
  const roads = [];
  osmData.elements.filter(e => e.tags?.highway).forEach(w => {
    // filter points in bbox with slight margin
    const pts = w.geometry.filter(pt => 
      pt.lat >= minLat - 0.002 && pt.lat <= maxLat + 0.002 &&
      pt.lon >= minLon - 0.002 && pt.lon <= maxLon + 0.002
    );
    if (pts.length >= 2) {
      const svgPts = pts.map(pt => toSvg(pt.lat, pt.lon));
      const pathD = 'M ' + svgPts.map(p => `${p.x},${p.y}`).join(' L ');
      roads.push({
        id: w.id,
        ref: w.tags.ref || '',
        name: w.tags.name || '',
        type: w.tags.highway,
        d: pathD
      });
    }
  });

  console.log(`Total road segments projected: ${roads.length}`);
  fs.writeFileSync('./scratch/projected_roads.json', JSON.stringify({ places: projectedPlaces, roads }, null, 2));
  console.log('Saved to ./scratch/projected_roads.json');
}

main().catch(console.error);
