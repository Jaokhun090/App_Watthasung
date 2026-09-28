import https from 'https';

function getGoogleMapsCoords(query) {
  return new Promise((resolve) => {
    const url = 'https://www.google.com/maps/search/' + encodeURIComponent(query);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8'
      }
    }, (res) => {
      // Check redirection header first
      if (res.headers.location) {
        const match = res.headers.location.match(/@([0-9.]+),([0-9.]+)/);
        if (match) {
          resolve({ lat: parseFloat(match[1]), lng: parseFloat(match[2]), via: 'location' });
          return;
        }
      }
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        // Look for coordinates in APP_INITIALIZATION_STATE or meta tags
        const match = html.match(/@([0-9.]+),([0-9.]+)/) ||
                      html.match(/null,null,([0-9.]{7,}),([0-9.]{7,})/) ||
                      html.match(/\[([0-9.]+),([0-9.]+),1[5-9]\]/);
        if (match) {
          resolve({ lat: parseFloat(match[1]), lng: parseFloat(match[2]), via: 'html' });
        } else {
          // Look for ;15.33...,100.07...
          const m2 = html.match(/15\.[0-9]{4,},100\.[0-9]{4,}/);
          if (m2) {
            const [lat, lng] = m2[0].split(',').map(parseFloat);
            resolve({ lat, lng, via: 'regex' });
          } else {
            resolve(null);
          }
        }
      });
    }).on('error', () => resolve(null));
  });
}

const list = [
  'วิหารหลวงพ่อศักดิ์สิทธิ์ วัดท่าซุง',
  'วิหารหลวงพ่อ 5 พระองค์ วัดท่าซุง',
  'โบสถ์เก่า วัดท่าซุง',
  'แพเลี้ยงปลา วัดท่าซุง',
  'ตึกรับแขก วัดท่าซุง',
  'โรงเรียนพระสุธรรมยานเถระวิทยา',
  'มณฑปท้าวจาตุมหาราช วัดท่าซุง',
  'หอฉัน วัดท่าซุง',
  'มณฑปแก้วพระองค์ที่ 10 และ 11 วัดท่าซุง',
  'วิหารพระองค์ที่ 10 และ 11 ใต้ต้นโพธิ์ วัดท่าซุง',
  'วิหารพระวิสุทธิเทพ วัดท่าซุง',
  'วิหารหลวงพ่อพระมหากัสสป วัดท่าซุง',
  'ศาลาบูรพาจารย์ วัดท่าซุง',
  'หอประชุมพระสุธรรมยานเถระ วัดท่าซุง',
  'อนุสาวรีย์พระเจ้าพรหมมหาราช วัดท่าซุง',
  'อาคารธรรมวิโมกข์ วัดท่าซุง',
  'อาคารเสริมศรี วัดท่าซุง',
  'เจดีย์พุดตาน วัดท่าซุง',
  'เรือคนึงหา วัดท่าซุง',
  'Tha Sung Coffee กาแฟท่าซุง',
  'ร้านอิ่มบุญ ครัวร้อยเมตร วัดท่าซุง'
];

async function run() {
  for (const item of list) {
    const res = await getGoogleMapsCoords(item);
    console.log(item, '=>', res);
    await new Promise(r => setTimeout(r, 600));
  }
}

run();
