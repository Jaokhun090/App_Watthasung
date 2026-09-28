const https = require('https');

const query = `
[out:json][timeout:25];
(
  node(15.323,100.068,15.337,100.077);
  way(15.323,100.068,15.337,100.077);
);
out center tags;
`;

const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
const req = https.get(url, { headers: { 'User-Agent': 'WatthasungApp/1.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const withNames = json.elements.filter(e => e.tags && (e.tags.name || e.tags['name:th']));
      console.log('Total named elements:', withNames.length);
      withNames.forEach(e => {
        const lat = e.lat || e.center?.lat;
        const lon = e.lon || e.center?.lon;
        console.log(`${e.tags.name || e.tags['name:th']} | ${lat}, ${lon} | type: ${e.tags.amenity || e.tags.building || e.tags.tourism || ''}`);
      });
    } catch(err) {
      console.error(err.message);
    }
  });
});
req.on('error', e => console.error(e.message));
