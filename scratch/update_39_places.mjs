import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const placesJsPath = path.resolve(__dirname, '../src/data/places.js');

// Import current places.js
const placesModule = await import('../src/data/places.js');
const { templeInfo, zones, places: rawPlaces, templeRules, dressCode, surroundingsNotice, restaurants, accommodations } = placesModule;

// Filter out ID 19
const filtered = rawPlaces.filter(p => p.id !== 19);

// Worship IDs in recommended order
const worshipIds = [12, 1, 4, 3, 20, 32, 30, 36, 8, 6, 28, 38, 34, 35, 29];
// Retreat IDs
const retreatIds = [17, 18, 23, 24, 22, 16, 21, 25, 27, 31];
// Shop IDs
const shopIds = [11, 13, 14, 37, 33];
// General IDs
const generalIds = [5, 2, 26, 7, 40, 39, 15, 9, 10];

const placesMap = new Map();
filtered.forEach(p => placesMap.set(p.id, { ...p }));

// Update ID 28 Chedi Phuttan
const p28 = placesMap.get(28);
if (p28) {
  p28.zone = "new";
  p28.description = "เจดีย์ทรงดอกพุดตานสีขาวบริสุทธิ์ ยอดฉัตรทองคำ ตั้งอยู่บริเวณฝั่งวัดใหม่ ใกล้ลาน ๒๕ ไร่และพระยืน ๓๐ ศอก เป็นปูชนียสถานที่สง่างาม";
  p28.tips = "ตั้งอยู่บริเวณฝั่งวัดใหม่ ใกล้พระยืน ๓๐ ศอก";
}

// Update ID 4 Somdej Ong Prathom (remove AI slop)
const p4 = placesMap.get(4);
if (p4) {
  p4.description = "วิหารประดิษฐานพระพุทธรูปสมเด็จองค์ปฐม พระประธานหน้าตัก ๔ ศอก หล่อด้วยโลหะผสมทองคำปิดทองคำแท้ทั้งองค์ พร้อมประดับซุ้มเรือนแก้วเพชร ภายในวิหารประดับลวดลายโมเสกกระจกแก้ววิจิตรบรรจง";
  p4.tips = "หลวงพ่อสอนว่าการกราบไหว้บูชาสมเด็จองค์ปฐม มีอานิสงส์คล่องตัวในสัมมาอาชีพ ป้องกันภยันตราย และสร้างบารมีตรงสู่พระนิพพาน";
}

// Update ID 12 Vihara 100m
const p12 = placesMap.get(12);
if (p12) {
  p12.description = "มหาวิหารสร้างด้วยสถาปัตยกรรมโมเสกกระจกแก้วตลอดความยาว ๑๐๐ เมตร เป็นที่ประดิษฐานพระสรีระสังขารหลวงพ่อพระราชพรหมยาน (หลวงพ่อฤาษีลิงดำ) ในโลงแก้ว และพระพุทธชินราชจำลอง เป็นศูนย์รวมจิตใจสำคัญที่สุดของวัดท่าซุง";
  p12.tips = "ไฮไลต์สำคัญที่สุดของวัดท่าซุง แนะนำให้มาก่อนเวลาเปิดรอบเช้า ๐๙:๐๐-๑๑:๔๕ น. หรือรอบบ่าย ๑๔:๐๐-๑๖:๐๐ น.";
}

// Assign category and highlight
worshipIds.forEach(id => {
  const p = placesMap.get(id);
  if (p) {
    p.category = "worship";
    p.highlight = true;
  }
});

retreatIds.forEach(id => {
  const p = placesMap.get(id);
  if (p) {
    p.category = "retreat";
    p.highlight = false;
  }
});

shopIds.forEach(id => {
  const p = placesMap.get(id);
  if (p) {
    p.category = "shop";
    p.highlight = false;
  }
});

generalIds.forEach(id => {
  const p = placesMap.get(id);
  if (p) {
    p.category = "general";
    p.highlight = false;
  }
});

// Build ordered list
const orderedPlaces = [];
worshipIds.forEach(id => {
  if (placesMap.has(id)) orderedPlaces.push(placesMap.get(id));
});
retreatIds.forEach(id => {
  if (placesMap.has(id)) orderedPlaces.push(placesMap.get(id));
});
shopIds.forEach(id => {
  if (placesMap.has(id)) orderedPlaces.push(placesMap.get(id));
});
generalIds.forEach(id => {
  if (placesMap.has(id)) orderedPlaces.push(placesMap.get(id));
});

console.log('Total ordered places:', orderedPlaces.length);

// 9-step walking tour
const newWalkingTour = [
  {
    step: 1,
    placeId: 1,
    duration: "30 นาที",
    time: "08:30",
    tip: "ปราสาททองคำเปิดตั้งแต่ 08:00 น. แวะชมความวิจิตรสีทองอร่ามก่อนเลย",
  },
  {
    step: 2,
    placeId: 12,
    duration: "45 นาที",
    time: "09:00",
    tip: "ไฮไลต์สำคัญ! สรีระสังขารหลวงพ่อไม่เน่าเปื่อยในโลงแก้ว ณ มหาวิหารแก้ว 100 เมตร (เปิดรอบเช้า 09:00-11:45 น.)",
  },
  {
    step: 3,
    placeId: 4,
    duration: "30 นาที",
    time: "10:00",
    tip: "กราบไหว้ขอพรสมเด็จองค์ปฐม พระพุทธเจ้าพระองค์แรก",
  },
  {
    step: 4,
    placeId: 3,
    duration: "20 นาที",
    time: "10:35",
    tip: "กราบพระยืน 30 ศอก ขอพรโชคลาภการเงินและความคล่องตัวด้วยพระคาถาเงินล้าน",
  },
  {
    step: 5,
    placeId: 2,
    duration: "30 นาที",
    time: "11:00",
    tip: "ชมพิพิธภัณฑ์สมบัติพ่อให้ อัฐบริขารและวัตถุมงคลล้ำค่า (เปิดทุกวัน 09:00-16:00 น. พักเที่ยง 12:00-13:00 น.)",
  },
  {
    step: 6,
    placeId: 11,
    name: "พักเที่ยง — ร้านอาหารและร้านค้าชุมชนรอบวัด",
    duration: "45 นาที",
    time: "11:45",
    tip: "แวะรับประทานอาหารกลางวัน ณ ร้านอิ่มบุญ (ครัวร้อยเมตร), กาแฟท่าซุง หรือร้านค้าชุมชนรอบวัดตามอัธยาศัย",
  },
  {
    step: 7,
    placeId: 30,
    duration: "25 นาที",
    time: "13:30",
    tip: "กราบสักการะพระพุทธเจ้า ๕ พระองค์แห่งภัทรกัปป์ ณ วิหารสีขาวบริสุทธิ์เพื่อความเป็นสิริมงคล",
  },
  {
    step: 8,
    placeId: 36,
    duration: "35 นาที",
    time: "14:00",
    tip: "กราบหลวงพ่อศักดิ์สิทธิ์ พระประธานโบราณคู่บารมีวัดท่าซุง และชมพระอุโบสถเก่าสมัยอยุธยา",
  },
  {
    step: 9,
    placeId: 33,
    duration: "25 นาที",
    time: "14:40",
    tip: "ให้อาหารปลา ทำบุญปล่อยปลา สูดอากาศบริสุทธิ์ริมแม่น้ำสะแกกรัง ณ แพเลี้ยงปลาวังมัจฉา",
  },
];

const newZones = [
  { id: "all", name: "ทั้งหมด", description: "สถานที่ทั้งหมด 39 จุดตามผังวัด" },
  { id: "new", name: "ฝั่งวัดใหม่", description: "วิหาร ปราสาททองคำ และปูชนียสถานวิจิตรงดงาม" },
  { id: "old", name: "ฝั่งวัดเก่า & ริมน้ำ", description: "โบสถ์เก่าสมัยอยุธยา หลวงพ่อศักดิ์สิทธิ์ และริมแม่น้ำสะแกกรัง" },
  { id: "pavilion", name: "ศาลา & อาคารบริการ", description: "ศาลาปฏิบัติธรรม โรงทาน ที่พัก และสิ่งอำนวยความสะดวก" },
];

const placeCategories = [
  { id: "worship", name: "สถานที่ไหว้ & ปูชนียสถาน", shortName: "สถานที่ไหว้", icon: "lotus", desc: "จุดกราบไหว้ขอพรและปูชนียสถานสำคัญ (แนะนำเรียงตามลำดับ)" },
  { id: "retreat", name: "อาคารพัก & ปฏิบัติธรรม", shortName: "ที่พัก/ปฏิบัติธรรม", icon: "meditation", desc: "ศาลาทำบุญ ถวายสังฆทาน ปฏิบัติพระกรรมฐาน และที่พักผู้ปฏิบัติธรรม" },
  { id: "shop", name: "ร้านอาหาร & ร้านค้า", shortName: "อาหาร/ของฝาก", icon: "utensils", desc: "ร้านอาหาร เครื่องดื่ม กาแฟ วัตถุมงคล และของที่ระลึก" },
  { id: "general", name: "สถานที่จิปาถะต่างๆ", shortName: "สถานที่ทั่วไป", icon: "navTemple", desc: "ลานจอดรถ พิพิธภัณฑ์ สวนหย่อม และอาคารบริการทั่วไป" },
];

// Write file content
let code = `// ข้อมูลสถานที่ทั้งหมดในวัดท่าซุง (วัดจันทาราม) อุทัยธานี ครบ 39 จุด
// สถานที่และรูปภาพอ้างอิงตรงตามโฟลเดอร์ภาพใน Img และพิกัดจริงบน Google Maps

export const templeInfo = ${JSON.stringify(templeInfo, null, 2)};

export const zones = ${JSON.stringify(newZones, null, 2)};

export const placeCategories = ${JSON.stringify(placeCategories, null, 2)};

export const places = ${JSON.stringify(orderedPlaces, null, 2)};

// 9 จุดแนะนำให้ไปให้ได้เมื่อมาถึงวัดท่าซุง
export const walkingTour = ${JSON.stringify(newWalkingTour, null, 2)};

export const templeRules = ${JSON.stringify(templeRules, null, 2)};

export const dressCode = ${JSON.stringify(dressCode, null, 2)};

export const surroundingsNotice = ${JSON.stringify(surroundingsNotice, null, 2)};

export const restaurants = ${JSON.stringify(restaurants, null, 2)};

export const accommodations = ${JSON.stringify(accommodations, null, 2)};
`;

fs.writeFileSync(placesJsPath, code, 'utf-8');
console.log('Successfully wrote updated places.js with 39 places!');
