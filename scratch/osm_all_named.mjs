import https from 'https';

const query = `
[out:json][timeout:25];
(
  node(15.324,100.068,15.336,100.076);
  way(15.324,100.068,15.336,100.076);
);
out center tags;
`;

const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
https.get(url, { headers: { 'User-Agent': 'WatThaSungSurvey/1.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const allNamed = json.elements.filter(e => e.tags && Object.keys(e.tags).some(k => k.includes('name')));
      console.log('Found named elements:', allNamed.length);
      for (const e of allNamed) {
        const lat = e.lat || e.center?.lat;
        const lon = e.lon || e.center?.lon;
        console.log(`- ${e.tags.name || e.tags['name:th']} (${e.tags['name:en'] || ''}) -> ${lat}, ${lon}`);
      }
    } catch(err) {
      console.error(err.message);
    }
  });
}).on('error', e => console.error(e.message));
