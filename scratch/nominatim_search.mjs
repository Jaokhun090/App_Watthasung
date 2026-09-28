import https from 'https';

const queries = [
  'วิหารหลวงพ่อศักดิ์สิทธิ์ วัดท่าซุง',
  'วิหารหลวงพ่อ 5 พระองค์ วัดท่าซุง',
  'โบสถ์เก่า วัดท่าซุง',
  'แพเลี้ยงปลา วัดท่าซุง',
  'วังมัจฉา วัดท่าซุง',
  'ตึกรับแขก วัดท่าซุง',
  'โรงเรียนพระสุธรรมยานเถระวิทยา',
  'มณฑปท้าวมหาราช วัดท่าซุง',
  'หอฉัน วัดท่าซุง'
];

async function search(q) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(q);
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'WatThaSungTesting/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ q, results: json });
        } catch {
          resolve({ q, results: [] });
        }
      });
    }).on('error', () => resolve({ q, results: [] }));
  });
}

async function main() {
  for (const q of queries) {
    const res = await search(q);
    console.log(q, res.results.length ? res.results[0].lat + ', ' + res.results[0].lon : 'NOT FOUND');
    await new Promise(r => setTimeout(r, 1000));
  }
}

main();
