const https = require('https');
const fs = require('fs');

const query = `[out:json][timeout:30];
(
  way["highway"](15.324,100.066,15.337,100.077);
  way["waterway"](15.324,100.066,15.337,100.077);
  relation["waterway"](15.324,100.066,15.337,100.077);
);
out geom;
`;

const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
console.log('Fetching OSM roads and waterways...');
https.get(url, { headers: { 'User-Agent': 'WatthasungMap/1.0' } }, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Total elements:', json.elements.length);
      json.elements.forEach((e, idx) => {
        console.log(`Way #${idx} id:${e.id} name:${e.tags?.name || e.tags?.ref || 'unnamed'} type:${e.tags?.highway || e.tags?.waterway} points:${e.geometry?.length}`);
      });
      fs.writeFileSync('./scratch/osm_roads.json', data);
      console.log('Saved to ./scratch/osm_roads.json');
    } catch(err) {
      console.error('Error parsing:', err.message);
    }
  });
}).on('error', err => console.error('Request error:', err.message));
