import fs from 'fs';
import path from 'path';

const imgDir = path.resolve('Img');

function getPhotosForFolder(folderName) {
  const folderPath = path.join(imgDir, folderName);
  if (!fs.existsSync(folderPath)) return [];
  const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  return files.map(f => `/Img/${encodeURIComponent(folderName)}/${encodeURIComponent(f)}`);
}

// 29 Active Places mapped to the exact folder names in Img
const activePlacesConfig = [
  {
    id: 1,
    folder: "ปราสาททองกาญจนาภิเษก (ปราสาททองคำ)",
    zone: "new",
    category: "highlight",
    highlight: true,
    lat: 15.329376018112319,
    lng: 100.06931802853471,
    openingHours: { allDay: { open: "08:00", close: "16:00" } },
    tips: "เปิดตั้งแต่ 08:00 น. แนะนำให้มาจุดนี้เป็นจุดแรกก่อนวิหารแก้วเปิด",
    description: "ปราสาท 3 ชั้น ตกแต่งด้วยลวดลายไทยปิดทองคำเปลวและกระจกอย่างประณีต สร้างขึ้นเพื่อถวายเป็นพระราชกุศลในวาระที่ในหลวงรัชกาลที่ 9 ทรงครองราชย์ครบ 50 ปี"
  },
  {
    id: 2,
    folder: "พิพิธภัณฑ์สมบัติพ่อให้",
    zone: "new",
    category: "museum",
    highlight: true,
    lat: 15.331315178361331,
    lng: 100.0689571785189,
    openingHours: { allDay: { open: "09:00", close: "16:00" } },
    tips: "อาคารสวยงามโอ่อ่า จัดแสดงพระพุทธรูป พระเครื่อง และของใช้ล้ำค่าของหลวงพ่อฤาษีลิงดำและหลวงพ่อปาน",
    description: "อาคารสถาปัตยกรรมสุโขทัยประยุกต์ จัดแสดงพระพุทธรูป พระเครื่อง วัตถุมงคลล้ำค่า และของใช้ของหลวงพ่อฤาษีลิงดำและหลวงพ่อปาน"
  },
  {
    id: 3,
    folder: "พระยืน 30 ศอก (หลวงพ่อเงินไหลมาเทมา)",
    zone: "new",
    category: "buddha",
    highlight: true,
    lat: 15.33218859674792,
    lng: 100.06914476029037,
    openingHours: null,
    tips: "ผู้ศรัทธานิยมมากราบไหว้ขอพรโชคลาภการเงิน พร้อมสวดพระคาถาเงินล้าน",
    description: "พระพุทธรูปปางอุ้มบาตรประทับยืนสีทองอร่าม สูง 30 ศอก สร้างขึ้นเพื่อเป็นสัญลักษณ์แห่งความคล่องตัวในลาภสักการะ การเงิน และหน้าที่การงาน"
  },
  {
    id: 4,
    folder: "วิหารสมเด็จองค์ปฐม",
    zone: "new",
    category: "highlight",
    highlight: true,
    lat: 15.332439790276979,
    lng: 100.06964298699376,
    openingHours: {
      morning: { open: "09:00", close: "10:30" },
      afternoon: { open: "13:00", close: "16:00" },
      note: "เสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์ เปิด 09:00-16:00 น."
    },
    tips: "กราบขอพรสมเด็จองค์ปฐมเพื่อความเป็นสิริมงคลสูงสุดในชีวิต",
    description: "สถานที่ประดิษฐานพระสมเด็จองค์ปฐม พระพุทธเจ้าพระองค์แรก พระพุทธลักษณะงดงามวิจิตร ศูนย์รวมจิตใจของศิษยานุศิษย์สายวัดท่าซุง"
  },
  {
    id: 5,
    folder: "ลาน 25 ไร่",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    lat: 15.330420128417968,
    lng: 100.0701856946274,
    openingHours: null,
    tips: "ใช้จัดพิธีสำคัญ งานบุญประจำปี และลานจอดรถรองรับผู้แสวงบุญ",
    description: "ลานอเนกประสงค์และพื้นที่ประกอบกิจกรรมงานบุญขนาดใหญ่ของวัดท่าซุง รองรับผู้มาปฏิบัติธรรมได้จำนวนมาก"
  },
  {
    id: 7,
    folder: "ตึกขาว",
    zone: "pavilion",
    category: "building",
    highlight: false,
    lat: 15.33051839941299,
    lng: 100.07101713714478,
    openingHours: null,
    tips: null,
    description: "อาคารตึกขาวสำหรับการบริหารงานสงฆ์และการต้อนรับคณะศรัทธา"
  },
  {
    id: 8,
    folder: "มณฑปพระศรีอาริยเมตไตรย",
    zone: "new",
    category: "vihara",
    highlight: false,
    lat: 15.332046931531451,
    lng: 100.06996332344809,
    openingHours: {
      morning: { open: "09:00", close: "10:30" },
      afternoon: { open: "13:00", close: "16:00" },
      note: "เสาร์-อาทิตย์ เปิดต่อเนื่อง 09:00-16:00 น."
    },
    tips: "กราบไหว้ขอพรพระศรีอาริยเมตไตรย พระพุทธเจ้าในอนาคต",
    description: "มณฑปประดิษฐานพระศรีอาริยเมตไตรย พระพุทธเจ้าในอนาคตกาลแห่งภัทรกัป ตกแต่งด้วยลวดลายประณีต"
  },
  {
    id: 9,
    folder: "สวนสมเด็จฯ",
    zone: "new",
    category: "garden",
    highlight: false,
    lat: 15.333374917830827,
    lng: 100.07175844104083,
    openingHours: null,
    tips: "บรรยากาศร่มรื่น เหมาะสำหรับการนั่งพักผ่อนสงบจิตใจ",
    description: "สวนหย่อมและภูมิทัศน์ร่มรื่น ประดิษฐานรูปปั้นและพระพุทธรูป สำหรับเดินพักผ่อนและทำสมาธิ"
  },
  {
    id: 10,
    folder: "ตึกพระเถระ",
    zone: "pavilion",
    category: "building",
    highlight: false,
    lat: 15.333949251970875,
    lng: 100.07246080408117,
    openingHours: null,
    tips: null,
    description: "อาคารรับรองและกุฏิที่พำนักของพระเถรานุเถระที่เดินทางมาเยือนวัดท่าซุง"
  },
  {
    id: 12,
    folder: "วิหารแก้ว 100 เมตร",
    zone: "new",
    category: "highlight",
    highlight: true,
    lat: 15.332416129080686,
    lng: 100.072513066472,
    openingHours: {
      morning: { open: "09:00", close: "11:30" },
      afternoon: { open: "14:00", close: "16:00" },
      note: "11:30-14:00 สงวนสำหรับผู้มาเจริญพระกรรมฐาน"
    },
    tips: "ไฮไลต์สำคัญ! สรีระสังขารหลวงพ่อไม่เน่าเปื่อยในโลงแก้ว ต้องถอดรองเท้าและแต่งกายสุภาพ",
    description: "ไฮไลต์สำคัญที่สุดของวัด ตกแต่งด้วยโมเสกแก้วสีขาวระยิบระยับทั้งภายในและภายนอก ประดิษฐานพระพุทธชินราชจำลอง และโลงแก้วบรรจุสรีระสังขารที่ไม่เน่าเปื่อยของหลวงพ่อฤาษีลิงดำ"
  },
  {
    id: 14,
    folder: "ร้านค้าสวัสดิการ",
    zone: "pavilion",
    category: "facility",
    highlight: false,
    lat: 15.33304896338545,
    lng: 100.07384697212439,
    openingHours: { allDay: { open: "08:00", close: "17:00" } },
    tips: "มีน้ำดื่ม อาหารว่าง และสินค้าที่ระลึกของวัด",
    description: "จุดจำหน่ายอาหาร เครื่องดื่ม ขนม น้ำดื่ม และของที่ระลึกสำหรับผู้มาเยือนวัดท่าซุง"
  },
  {
    id: 15,
    folder: "ห้องสมุดประชาชนเฉลิมราชกุมารี",
    zone: "pavilion",
    category: "facility",
    highlight: false,
    lat: 15.33117031546957,
    lng: 100.07429634345739,
    openingHours: { allDay: { open: "08:30", close: "16:30" } },
    tips: null,
    description: "อาคารห้องสมุดประชาชนเฉลิมราชกุมารีฯ รวบรวมหนังสือพระไตรปิฎก ธรรมะ ประวัติศาสตร์ และความรู้ทั่วไป"
  },
  {
    id: 16,
    folder: "อาคารที่พักผู้ปฏิบัติธรรมพระพินิจอักษร",
    zone: "pavilion",
    category: "retreat",
    highlight: false,
    lat: 15.331304695601231,
    lng: 100.07396798705324,
    openingHours: null,
    tips: "ติดต่อสำนักงานวัดล่วงหน้าหากต้องการเข้าพักปฏิบัติธรรม",
    description: "อาคารที่พักสำหรับผู้มาปฏิบัติธรรม รักษาศีล และเจริญพระกรรมฐาน"
  },
  {
    id: 17,
    folder: "พระมหาวิหาร100ปี พระราชพรหมยาน (ศาลา 12 ไร่)",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    lat: 15.327797764473573,
    lng: 100.0702932934395,
    openingHours: null,
    tips: null,
    description: "มหาวิหารขนาดใหญ่ 12 ไร่ สร้างขึ้นในวาระชาตกาล 100 ปี พระราชพรหมยาน รองรับการจัดกิจกรรมงานบุญและการอบรมพระกรรมฐาน"
  },
  {
    id: 19,
    folder: "โรงเรียนพระพินิจอักษร (ทองดี)",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    lat: 15.327498986050607,
    lng: 100.07096015524046,
    openingHours: null,
    tips: null,
    description: "อาคารการศึกษาอนุสรณ์พระพินิจอักษร (ทองดี) ต้นราชวงศ์จักรี มีคุณค่าและความสำคัญทางประวัติศาสตร์"
  },
  {
    id: 20,
    folder: "พระอุโบสถ",
    zone: "old",
    category: "temple",
    highlight: false,
    lat: 15.327888594011979,
    lng: 100.07124274985728,
    openingHours: null,
    tips: null,
    description: "พระอุโบสถสถานที่ทำสังฆกรรมของพระภิกษุสงฆ์วัดท่าซุง"
  },
  {
    id: 22,
    folder: "ศาลานวราช (ติดต่อที่พัก)",
    zone: "pavilion",
    category: "retreat",
    highlight: false,
    lat: 15.327860573789454,
    lng: 100.07186750111678,
    openingHours: { allDay: { open: "08:30", close: "17:00" } },
    tips: "จุดติดต่อประสานงานเรื่องที่พักปฏิบัติธรรม",
    description: "ศาลานวราช ศูนย์ติดต่อสอบถามและลงทะเบียนสำหรับผู้มาเข้าพักปฏิบัติธรรมและบวชเนกขัมมะ"
  },
  {
    id: 23,
    folder: "ศาลา 2 ไร่",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    lat: 15.32928370148598,
    lng: 100.07036608602283,
    openingHours: null,
    tips: null,
    description: "ศาลาอเนกประสงค์ขนาด 2 ไร่ สำหรับการรวมกลุ่มบำเพ็ญกุศลและกิจกรรมสงฆ์"
  },
  {
    id: 24,
    folder: "ศาลา 3 ไร่",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    lat: 15.329175030730923,
    lng: 100.07109833169615,
    openingHours: null,
    tips: null,
    description: "ศาลาปฏิบัติธรรมและรับรองคณะผู้แสวงบุญขนาด 3 ไร่"
  },
  {
    id: 30,
    folder: "วิหารหลวงพ่อ 5 พระองค์",
    zone: "old",
    category: "vihara",
    highlight: true,
    lat: 15.33410,
    lng: 100.07375,
    openingHours: null,
    tips: "เป็นจุดยอดนิยมในการกราบไหว้ขอพรและบนบานศาลกล่าวที่ศักดิ์สิทธิ์มาก",
    description: "ประดิษฐานรูปหล่อพระอริยสงฆ์ 5 พระองค์: สมเด็จพระสัมมาสัมพุทธเจ้า, หลวงปู่ใหญ่, หลวงปู่ศุข วัดปากคลองมะขามเฒ่า, หลวงปู่ปาน วัดบางนมโค, และหลวงพ่อฤาษีลิงดำ"
  },
  {
    id: 31,
    folder: "หอฉัน",
    zone: "old",
    category: "building",
    highlight: false,
    lat: 15.33435,
    lng: 100.07355,
    openingHours: null,
    tips: null,
    description: "โรงฉันภัตตาหารสำหรับพระภิกษุสามเณรของวัดท่าซุง"
  },
  {
    id: 32,
    folder: "พระอุโบสถเก่า",
    zone: "old",
    category: "temple",
    highlight: true,
    lat: 15.33375,
    lng: 100.07410,
    openingHours: null,
    tips: "ชมจิตรกรรมฝาผนังโบราณสมัยอยุธยาอันทรงคุณค่า",
    description: "โบสถ์เก่าดั้งเดิมตั้งแต่สมัยอยุธยา มีจิตรกรรมฝาผนังโบราณฝีมือช่างพื้นบ้าน ทรงคุณค่าทางประวัติศาสตร์และโบราณคดี"
  },
  {
    id: 33,
    folder: "แพเลี้ยงปลา (วังมัจฉา)",
    zone: "old",
    category: "highlight",
    highlight: true,
    lat: 15.33475,
    lng: 100.07480,
    openingHours: null,
    tips: "ซื้ออาหารปลาได้ที่ร้านค้าหน้าแพ ทำบุญปล่อยปลา บรรยากาศริมแม่น้ำสะแกกรังเย็นสบาย",
    description: "แพปลาริมแม่น้ำสะแกกรัง เขตอภัยทานที่มีฝูงปลาอาศัยอยู่อย่างหนาแน่น สามารถซื้ออาหารปลาทำทานปล่อยชีวิตสัตว์น้ำ บรรยากาศริมน้ำร่มรื่น"
  },
  {
    id: 34,
    folder: "มณฑปแก้วพระองค์ที่ 10 และ 11",
    zone: "old",
    category: "vihara",
    highlight: false,
    lat: 15.33305,
    lng: 100.07445,
    openingHours: null,
    tips: null,
    description: "มณฑปแก้วประดับกระจกวิจิตร ประดิษฐานพระองค์ที่ 10 และ 11 ตามนิมิตธรรมของหลวงพ่อฤาษีลิงดำ"
  },
  {
    id: 35,
    folder: "มณฑปท้าวจาตุมหาราช",
    zone: "old",
    category: "monument",
    highlight: false,
    lat: 15.33275,
    lng: 100.07465,
    openingHours: null,
    tips: "กราบไหว้ขอพรการปกปักรักษาคุ้มครองให้แคล้วคลาดปลอดภัย",
    description: "มณฑปประดิษฐานรูปปั้นท้าวจาตุมหาราชทั้ง 4 พระองค์ผู้ปกปักรักษา 4 ทิศ บนสวรรค์ชั้นจาตุมหาราชิกา"
  },
  {
    id: 36,
    folder: "วิหารหลวงพ่อศักดิ์สิทธิ์",
    zone: "old",
    category: "highlight",
    highlight: true,
    lat: 15.33355,
    lng: 100.07420,
    openingHours: null,
    tips: "กราบขอพรหลวงพ่อศักดิ์สิทธิ์ พระพุทธรูปคู่วัดท่าซุงแต่ดั้งเดิม",
    description: "ประดิษฐานหลวงพ่อศักดิ์สิทธิ์ พระพุทธรูปปูนปั้นโบราณคู่วัดท่าซุงแต่ดั้งเดิม มีความศักดิ์สิทธิ์เป็นที่เคารพสักการะของชาวเมืองอุทัยธานี"
  },
  {
    id: 37,
    folder: "ตึกรับแขก (สถานที่จำหน่ายหนังสือ, คำสอน, วัตถุมงคล, ยาสมุนไพร)",
    zone: "old",
    category: "facility",
    highlight: false,
    lat: 15.33235,
    lng: 100.07485,
    openingHours: {
      morning: { open: "09:00", close: "10:30" },
      afternoon: { open: "12:00", close: "16:00" }
    },
    tips: "ศูนย์บูชาวัตถุมงคล หนังสือคำสอน และยาสมุนไพรของแท้จากวัดท่าซุง",
    description: "อาคารต้อนรับและจุดจำหน่ายหนังสือธรรมะ ซีดีคำสอน วัตถุมงคล และยาสมุนไพรตำรับวัดท่าซุง"
  },
  {
    id: 38,
    folder: "วิหารพระองค์ที่ 10 และ 11 ใต้ต้นโพธิ์",
    zone: "old",
    category: "vihara",
    highlight: false,
    lat: 15.33325,
    lng: 100.07435,
    openingHours: null,
    tips: "บรรยากาศสงบวิเวกใต้ร่มเงาต้นโพธิ์ใหญ่",
    description: "วิหารสงบวิเวกใต้ร่มเงาต้นพระศรีมหาโพธิ์ เกี่ยวเนื่องกับปริศนาธรรมและคำสอนของหลวงพ่อฤาษีลิงดำ"
  },
  {
    id: 39,
    folder: "โรงเรียนพระสุธรรมยานเถระวิทยา",
    zone: "pavilion",
    category: "facility",
    highlight: false,
    lat: 15.33182,
    lng: 100.07535,
    openingHours: null,
    tips: null,
    description: "โรงเรียนการกุศลของวัดในพระอุปถัมภ์ จัดการศึกษาแผนกสามัญและพระปริยัติธรรมแก่เยาวชน"
  }
];

const placesOutput = activePlacesConfig.map(p => {
  const photos = getPhotosForFolder(p.folder);
  return {
    id: p.id,
    name: p.folder,
    altName: "",
    shortName: p.folder.replace(/\s*\(.*?\)\s*/g, ''),
    zone: p.zone,
    category: p.category,
    highlight: p.highlight,
    description: p.description,
    openingHours: p.openingHours,
    gps: { lat: p.lat, lng: p.lng },
    tips: p.tips,
    photos: photos
  };
});

fs.writeFileSync('scratch/generated_places.json', JSON.stringify(placesOutput, null, 2), 'utf-8');
console.log('Successfully generated', placesOutput.length, 'places');
