import https from 'https';

function checkUrl(q) {
  const url = 'https://www.google.com/maps/search/' + encodeURIComponent(q);
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    }
  }, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Location:', res.headers.location);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/@15\.[0-9]+,100\.[0-9]+/g);
      console.log('Matches in body:', match);
      const m2 = data.match(/15\.[0-9]{5,},100\.[0-9]{5,}/g);
      console.log('Matches m2:', m2 ? m2.slice(0, 5) : null);
    });
  });
}

checkUrl('วิหารหลวงพ่อศักดิ์สิทธิ์ วัดท่าซุง');
