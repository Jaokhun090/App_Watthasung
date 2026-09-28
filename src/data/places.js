// ข้อมูลสถานที่ทั้งหมดในวัดท่าซุง (วัดจันทาราม) อุทัยธานี
// สถานที่ครบทั้ง 39 จุดตามแผนที่ป้ายผังวัดทางการ (Img/20260927_122430.jpg)

export const templeInfo = {
  name: "วัดจันทาราม (วัดท่าซุง)",
  shortName: "วัดท่าซุง",
  address: "ต.น้ำซึม อ.เมือง จ.อุทัยธานี",
  area: "510 ไร่",
  admission: "เข้าชมฟรี",
  gps: { lat: 15.332468, lng: 100.072631 }, // พิกัดหลักวัดท่าซุง
  mapSignboardImg: "/map-signboard.jpg", // รูปป้ายผังวัดจริง
  website: "https://watthasung.com",
  facebook: "https://www.facebook.com/Watthasung.com",
  youtube: "https://www.youtube.com/@Watjantaram.thasung",
  phone: {
    general: "056-502-506",
    retreat: "056-502-655",
    meal: "089-668-8673",
    monk: "063-294-6356",
  },
  history:
    'วัดท่าซุงเป็นวัดเก่าแก่ที่มีมาตั้งแต่สมัยอยุธยา ชื่อ "ท่าซุง" มาจากในอดีตที่แพซุงมักจะมาพักแวะที่หน้าวัดแห่งนี้ ต่อมาหลวงพ่อฤาษีลิงดำ (พระราชพรหมยาน) ได้ย้ายมาจำพรรษาในปี พ.ศ. 2511 เพื่อบูรณะวัดที่ทรุดโทรมให้กลับมางดงามวิจิตรตระการตา และเป็นศูนย์กลางการปฏิบัติพระกรรมฐานจนถึงปัจจุบัน',
  tram: "มีบริการรถราง ~10 บาท พาชมรอบวัดสะดวกสบาย",
  parking: "มีลานจอดรถกว้างขวาง ทั้งฝั่งวัดใหม่และฝั่งวัดเก่า",
};

export const zones = [
  { id: "all", name: "ทั้งหมด (39 จุด)", description: "สถานที่ทั้งหมดตามผังวัด" },
  { id: "new", name: "ฝั่งวัดใหม่", description: "บริเวณที่หลวงพ่อพัฒนาขึ้น มีวิหารและอาคารวิจิตรงดงาม" },
  { id: "old", name: "ฝั่งวัดเก่า & ริมน้ำ", description: "พื้นที่ดั้งเดิมสมัยอยุธยาและริมแม่น้ำสะแกกรัง" },
  { id: "pavilion", name: "ศาลา & อาคารปฏิบัติธรรม", description: "ศาลา ที่พักผู้ปฏิบัติธรรม และอาคารบริการ" },
];

export const places = [
  // ==========================================
  // แถวบน & วิหารสำคัญ (ฝั่งวัดใหม่)
  // ==========================================
  {
    id: 1,
    name: "ปราสาททองคำ",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ปราสาททองคำ",
    zone: "new",
    category: "highlight",
    highlight: true,
    description: "ปราสาท 3 ชั้น ตกแต่งด้วยลวดลายไทยปิดทองคำเปลวและกระจกอย่างประณีต สร้างขึ้นเพื่อถวายเป็นพระราชกุศลในวาระที่ในหลวงรัชกาลที่ 9 ทรงครองราชย์ครบ 50 ปี",
    openingHours: { allDay: { open: "08:00", close: "16:00" } },
    gps: { lat: 15.3328, lng: 100.0725 }, // <<-- แก้พิกัด GPS นำทางที่นี่ (ละติจูด, ลองจิจูด)
    tips: "เปิดตั้งแต่ 08:00 น. แนะนำให้มาจุดนี้เป็นจุดแรกก่อนวิหารแก้วเปิด",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/1/11/%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%B2%E0%B8%97%E0%B8%97%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B8%B3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Wat_Tha_Sung10.JPG",
    ],
  },
  {
    id: 2,
    name: "ตึกสมบัติพ่อให้",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ตึกสมบัติพ่อให้",
    zone: "new",
    category: "museum",
    highlight: true,
    description: "อาคารสถาปัตยกรรมสุโขทัยประยุกต์ จัดแสดงพระพุทธรูป พระเครื่อง วัตถุมงคลล้ำค่า และของใช้ของหลวงพ่อฤาษีลิงดำและหลวงพ่อปาน",
    openingHours: { allDay: { open: "09:00", close: "16:00" } },
    gps: { lat: 15.3332, lng: 100.0728 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "อาคารสวยงามโอ่อ่า เปิดให้เข้าชมอย่างเป็นทางการปี 2569",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/7/7f/7023_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%8B%E0%B8%B8%E0%B8%87.jpg",
    ],
  },
  {
    id: 3,
    name: "พระยืน 30 ศอก",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "พระยืน 30 ศอก",
    zone: "new",
    category: "buddha",
    highlight: true,
    description: "พระพุทธรูปปางอุ้มบาตรประทับยืนสีทองอร่าม สูง 30 ศอก สร้างขึ้นเพื่อเป็นสัญลักษณ์แห่งความคล่องตัวในลาภสักการะ การเงิน และหน้าที่การงาน",
    openingHours: null,
    gps: { lat: 15.3326, lng: 100.0726 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "ผู้ศรัทธานิยมมากราบไหว้ขอพรโชคลาภการเงิน พร้อมสวดพระคาถาเงินล้าน",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/f/fd/%282023%29_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A1_%28%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%8B%E0%B8%B8%E0%B8%87%29_%E0%B8%AD.%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87_%E0%B8%88.%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%B1%E0%B8%A2%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5_%282%29.jpg",
    ],
  },
  {
    id: 4,
    name: "วิหารสมเด็จองค์ปฐม",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "สมเด็จองค์ปฐม",
    zone: "new",
    category: "highlight",
    highlight: true,
    description: "สถานที่ประดิษฐานพระสมเด็จองค์ปฐม พระพุทธเจ้าพระองค์แรก พระพุทธลักษณะงดงามวิจิตร ศูนย์รวมจิตใจของศิษยานุศิษย์สายวัดท่าซุง",
    openingHours: {
      morning: { open: "09:00", close: "10:30" },
      afternoon: { open: "13:00", close: "16:00" },
      note: "เสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์ เปิด 09:00-16:00 น.",
    },
    gps: { lat: 15.3325, lng: 100.0728 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "กราบขอพรสมเด็จองค์ปฐมเพื่อความเป็นสิริมงคลสูงสุดในชีวิต",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/d/db/%E0%B8%A7%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%A1%E0%B9%80%E0%B8%94%E0%B8%88%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%9B%E0%B8%90%E0%B8%A1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f8/Wat_Tha_Sung06.JPG",
    ],
  },
  {
    id: 5,
    name: "ศาลา 24 ไร่",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ศาลา 24 ไร่",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    description: "ศาลาปฏิบัติธรรมและจัดงานบุญขนาดใหญ่ของวัด รองรับผู้มาปฏิบัติธรรมและพุทธศาสนิกชนได้หลายพันคน",
    openingHours: null,
    gps: { lat: 15.3320, lng: 100.0715 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "ใช้จัดพิธีสำคัญและงานบุญประจำปีของวัดท่าซุง",
    photos: [],
  },
  {
    id: 6,
    name: "พระยืน 8 ศอก",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "พระยืน 8 ศอก",
    zone: "new",
    category: "buddha",
    highlight: false,
    description: "พระพุทธรูปปางยืนปิดทองขนาด 8 ศอก ประดิษฐานกลางแจ้งอย่างสง่างาม",
    openingHours: null,
    gps: { lat: 15.3322, lng: 100.0723 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 7,
    name: "ตึกขาว",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ตึกขาว",
    zone: "pavilion",
    category: "building",
    highlight: false,
    description: "อาคารตึกขาวสำหรับการบริหารงานสงฆ์และการต้อนรับ",
    openingHours: null,
    gps: { lat: 15.3318, lng: 100.0725 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 8,
    name: "วิหารพระศรีอาริยเมตไตรย",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "พระศรีอาริยเมตไตรย",
    zone: "new",
    category: "vihara",
    highlight: false,
    description: "วิหารประดิษฐานพระศรีอาริยเมตไตรย พระพุทธเจ้าในอนาคตกาลแห่งภัทรกัป",
    openingHours: {
      morning: { open: "09:00", close: "10:30" },
      afternoon: { open: "13:00", close: "16:00" },
      note: "เสาร์-อาทิตย์ เปิดต่อเนื่อง 09:00-16:00 น.",
    },
    gps: { lat: 15.3326, lng: 100.0720 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/%282023%29_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A1_%28%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%8B%E0%B8%B8%E0%B8%87%29_%E0%B8%AD.%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87_%E0%B8%88.%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%B1%E0%B8%A2%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5_%2830%29.jpg",
    ],
  },
  {
    id: 9,
    name: "สวนสมเด็จฯ",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "สวนสมเด็จฯ",
    zone: "new",
    category: "garden",
    highlight: false,
    description: "สวนหย่อมและภูมิทัศน์ร่มรื่น ประดิษฐานรูปปั้นและพระพุทธรูป สำหรับเดินพักผ่อนและทำสมาธิ",
    openingHours: null,
    gps: { lat: 15.3329, lng: 100.0734 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "บรรยากาศร่มรื่น เหมาะสำหรับการนั่งพักผ่อนสงบจิตใจ",
    photos: [],
  },
  {
    id: 10,
    name: "ตึกพระเถระ",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ตึกพระเถระ",
    zone: "pavilion",
    category: "building",
    highlight: false,
    description: "อาคารรับรองและกุฏิที่พำนักของพระเถรานุเถระที่เดินทางมาเยือนวัด",
    openingHours: null,
    gps: { lat: 15.3330, lng: 100.0738 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 11,
    name: "ตึกกลางน้ำ",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ตึกกลางน้ำ",
    zone: "new",
    category: "building",
    highlight: false,
    description: "อาคารที่สร้างอยู่กลางสระน้ำ บรรยากาศสงบเย็น เป็นเอกลักษณ์ทางสถาปัตยกรรมอีกจุดหนึ่ง",
    openingHours: null,
    gps: { lat: 15.3315, lng: 100.0722 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 12,
    name: "มหาวิหารแก้ว 100 เมตร",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "มหาวิหารแก้ว",
    zone: "new",
    category: "highlight",
    highlight: true,
    description: "ไฮไลต์สำคัญที่สุดของวัด ตกแต่งด้วยโมเสกแก้วสีขาวระยิบระยับทั้งภายในและภายนอก ประดิษฐานพระพุทธชินราชจำลอง และโลงแก้วบรรจุสรีระสังขารที่ไม่เน่าเปื่อยของหลวงพ่อฤาษีลิงดำ",
    openingHours: {
      morning: { open: "09:00", close: "11:30" },
      afternoon: { open: "14:00", close: "16:00" },
      note: "11:30-14:00 สงวนสำหรับผู้มาเจริญพระกรรมฐาน",
    },
    gps: { lat: 15.3330, lng: 100.0730 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "แนะนำให้ไปถึงก่อนรอบเปิด 10 นาทีเพื่อชมความงดงามได้อย่างเต็มที่ ต้องถอดรองเท้าและแต่งกายสุภาพ",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/8/86/%E0%B8%A7%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7_100_%E0%B9%80%E0%B8%A1%E0%B8%95%E0%B8%A3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/36/%E0%B8%A7%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/92/%E0%B8%9A%E0%B8%B8%E0%B8%A9%E0%B8%9A%E0%B8%81%E0%B9%83%E0%B8%99%E0%B8%A7%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/ae/Wat_Tha_Sung09.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/5/5b/Wat_Tha_Sung07.JPG",
    ],
  },
  {
    id: 13,
    name: "ศาลามิตรสรัทธา",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ศาลามิตรสรัทธา",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    description: "ศาลาต้อนรับและอำนวยความสะดวกแก่ผู้มาเยือนวัดท่าซุง",
    openingHours: null,
    gps: { lat: 15.3328, lng: 100.0744 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 14,
    name: "ร้านค้าสวัสดิการ",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ร้านค้าสวัสดิการ",
    zone: "pavilion",
    category: "facility",
    highlight: false,
    description: "จุดจำหน่ายอาหาร เครื่องดื่ม ขนม น้ำดื่ม และของที่ระลึกสำหรับผู้มาเยือนวัด",
    openingHours: { allDay: { open: "08:00", close: "17:00" } },
    gps: { lat: 15.3325, lng: 100.0742 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "มีน้ำดื่ม อาหารว่าง และสินค้าที่ระลึกของวัด",
    photos: [],
  },
  {
    id: 15,
    name: "ห้องสมุดประชาชนเฉลิมราชกุมารีฯ",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ห้องสมุดประชาชนฯ",
    zone: "pavilion",
    category: "facility",
    highlight: false,
    description: "อาคารห้องสมุดประชาชนเฉลิมราชกุมารีฯ รวบรวมหนังสือพระไตรปิฎก ธรรมะ ประวัติศาสตร์ และความรู้ทั่วไป",
    openingHours: { allDay: { open: "08:30", close: "16:30" } },
    gps: { lat: 15.3321, lng: 100.0736 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 16,
    name: "ที่พักปฏิบัติธรรมพระพินิจอักษร",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ที่พักพระพินิจอักษร",
    zone: "pavilion",
    category: "retreat",
    highlight: false,
    description: "อาคารที่พักสำหรับผู้มาปฏิบัติธรรม รักษาศีล และเจริญพระกรรมฐาน",
    openingHours: null,
    gps: { lat: 15.3319, lng: 100.0740 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "ติดต่อสำนักงานวัดล่วงหน้าหากต้องการเข้าพักปฏิบัติธรรม",
    photos: [],
  },

  // ==========================================
  // ฝั่งซ้าย (ศาลา & อาคารปฏิบัติธรรม)
  // ==========================================
  {
    id: 17,
    name: "ศาลา 12 ไร่",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ศาลา 12 ไร่",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    description: "ศาลาอเนกประสงค์ขนาดใหญ่ ใช้ประกอบกิจกรรมสงฆ์ งานบุญ และการรวมกลุ่มของผู้ปฏิบัติธรรม",
    openingHours: null,
    gps: { lat: 15.3315, lng: 100.0700 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 18,
    name: "ที่พักผู้ปฏิบัติธรรมชาย",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ที่พักปฏิบัติธรรมชาย",
    zone: "pavilion",
    category: "retreat",
    highlight: false,
    description: "เรือนพักสำหรับอุบาสกและโยมผู้ชายที่เดินทางมาร่วมบวชเนกขัมมะและเจริญสมาธิภาวนา",
    openingHours: null,
    gps: { lat: 15.3312, lng: 100.0702 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 19,
    name: "ศาลาพระพินิจอักษร ทองดี",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ศาลาพระพินิจอักษร",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    description: "ศาลาอนุสรณ์พระพินิจอักษร (ทองดี) ต้นตระกูลแห่งราชวงศ์จักรี มีความสำคัญทางประวัติศาสตร์",
    openingHours: null,
    gps: { lat: 15.3308, lng: 100.0698 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 20,
    name: "โบสถ์",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "โบสถ์",
    zone: "old",
    category: "temple",
    highlight: false,
    description: "อุโบสถสถานที่ทำสังฆกรรมของพระภิกษุสงฆ์วัดท่าซุง",
    openingHours: null,
    gps: { lat: 15.3310, lng: 100.0708 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 21,
    name: "ศาลาธรรมสถิต",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ศาลาธรรมสถิต",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    description: "ศาลาสำหรับการสดับตรับฟังพระธรรมเทศนาและบำเพ็ญภาวนา",
    openingHours: null,
    gps: { lat: 15.3312, lng: 100.0710 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 22,
    name: "ศาลา นวราช",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ศาลา นวราช",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    description: "ศาลาบำเพ็ญกุศลและกิจกรรมทางพระพุทธศาสนา",
    openingHours: null,
    gps: { lat: 15.3309, lng: 100.0712 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 23,
    name: "ศาลา 2.4 ไร่",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ศาลา 2.4 ไร่",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    description: "ศาลาอเนกประสงค์ขนาด 2.4 ไร่ สำหรับกิจกรรมสาธารณกุศล",
    openingHours: null,
    gps: { lat: 15.3317, lng: 100.0711 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 24,
    name: "ศาลา 3 ไร่",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ศาลา 3 ไร่",
    zone: "pavilion",
    category: "pavilion",
    highlight: false,
    description: "ศาลาปฏิบัติธรรมและรับรองคณะผู้แสวงบุญขนาด 3 ไร่",
    openingHours: null,
    gps: { lat: 15.3314, lng: 100.0716 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },

  // ==========================================
  // บริเวณใจกลาง & สวนธรรมชาติ
  // ==========================================
  {
    id: 25,
    name: "สวนป่าไผ่",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "สวนป่าไผ่",
    zone: "new",
    category: "garden",
    highlight: false,
    description: "สวนไผ่ร่มรื่น เงียบสงบ เป็นธรรมชาติ เหมาะสำหรับการเดินจงกรมและพักผ่อนจิตใจ",
    openingHours: null,
    gps: { lat: 15.3310, lng: 100.0718 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 26,
    name: "อนุสาวรีย์พระเจ้าพรหมมหาราช",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "อนุสาวรีย์พระเจ้าพรหม",
    zone: "new",
    category: "monument",
    highlight: false,
    description: "อนุสาวรีย์พระเจ้าพรหมมหาราช กษัตริย์ผู้ทรงกอบกู้แผ่นดินในตำนานประวัติศาสตร์ไทย",
    openingHours: null,
    gps: { lat: 15.3313, lng: 100.0721 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "จุดกราบไหว้รำลึกถึงบูรพกษัตริย์ไทย",
    photos: [],
  },
  {
    id: 27,
    name: "พระนอน 8 ศอก",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "พระนอน 8 ศอก",
    zone: "new",
    category: "buddha",
    highlight: false,
    description: "พระพุทธรูปปางไสยาสน์ (พระนอน) ขนาด 8 ศอก พระพักตร์อิ่มเอิบเปี่ยมด้วยเมตตาธรรม",
    openingHours: null,
    gps: { lat: 15.3308, lng: 100.0724 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 28,
    name: "พระจุฬามณี",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "พระจุฬามณี",
    zone: "new",
    category: "vihara",
    highlight: false,
    description: "อาคารจำลองพระจุฬามณีเจดีย์สถานบนสวรรค์ชั้นดาวดึงส์ ตามมโนมยิทธินิมิต",
    openingHours: null,
    gps: { lat: 15.3309, lng: 100.0727 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 29,
    name: "กรมหลวงชุมพร",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ศาลกรมหลวงชุมพร",
    zone: "new",
    category: "monument",
    highlight: false,
    description: "ศาลประดิษฐานพระรูปพลเรือเอกพระเจ้าบรมวงศ์เธอ กรมหลวงชุมพรเขตอุดมศักดิ์ (เสด็จเตี่ย)",
    openingHours: null,
    gps: { lat: 15.3306, lng: 100.0726 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "ผู้ศรัทธานิยมมากราบไหว้ขอพรความแคล้วคลาดและหน้าที่การงาน",
    photos: [],
  },

  // ==========================================
  // ฝั่งวัดเก่า & ริมน้ำสะแกกรัง (แถวล่าง)
  // ==========================================
  {
    id: 30,
    name: "วิหารหลวงพ่อ 5 พระองค์",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "หลวงพ่อ 5 พระองค์",
    zone: "old",
    category: "vihara",
    highlight: true,
    description: "ประดิษฐานรูปหล่อพระอริยสงฆ์ 5 พระองค์: 1) สมเด็จพระสัมมาสัมพุทธเจ้า 2) หลวงปู่ใหญ่ 3) หลวงปู่ศุข วัดปากคลองมะขามเฒ่า 4) หลวงปู่ปาน วัดบางนมโค 5) หลวงพ่อฤาษีลิงดำ",
    openingHours: null,
    gps: { lat: 15.3325, lng: 100.0730 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "เป็นจุดยอดนิยมในการกราบไหว้ขอพรและบนบานศาลกล่าวที่ศักดิ์สิทธิ์มาก",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/8/85/%282023%29_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A1_%28%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%8B%E0%B8%B8%E0%B8%87%29_%E0%B8%AD.%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87_%E0%B8%88.%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%B1%E0%B8%A2%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5_%2814%29.jpg",
    ],
  },
  {
    id: 31,
    name: "หอฉัน",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "หอฉัน",
    zone: "old",
    category: "building",
    highlight: false,
    description: "โรงฉันภัตตาหารสำหรับพระภิกษุสามเณรของวัดท่าซุง",
    openingHours: null,
    gps: { lat: 15.3303, lng: 100.0712 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 32,
    name: "ศาลาเก่า",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ศาลาเก่า",
    zone: "old",
    category: "pavilion",
    highlight: false,
    description: "ศาลาการเปรียญดั้งเดิมตั้งแต่ยุคก่อนการบูรณะวัดท่าซุง ทรงคุณค่าทางประวัติศาสตร์",
    openingHours: null,
    gps: { lat: 15.3301, lng: 100.0716 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 33,
    name: "วังมัจฉา",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "วังมัจฉา",
    zone: "old",
    category: "highlight",
    highlight: true,
    description: "แพปลาริมแม่น้ำสะแกกรัง เขตอภัยทานที่มีฝูงปลาอาศัยอยู่อย่างหนาแน่น สามารถซื้อขนมปังหรืออาหารปลาทำทานปล่อยชีวิตสัตว์น้ำ บรรยากาศริมน้ำร่มรื่น",
    openingHours: null,
    gps: { lat: 15.3345, lng: 100.0745 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "ซื้ออาหารปลาได้ที่ร้านค้าหน้าแพ ทำบุญปล่อยปลา บรรยากาศริมแม่น้ำเย็นสบาย",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/a/aa/Wat_Tha_Sung01.JPG",
    ],
  },
  {
    id: 34,
    name: "มณฑปแก้ว",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "มณฑปแก้ว",
    zone: "old",
    category: "vihara",
    highlight: false,
    description: "มณฑปแก้วตกแต่งด้วยลวดลายกระจกประณีต",
    openingHours: null,
    gps: { lat: 15.3304, lng: 100.0718 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 35,
    name: "มณฑปท้าวมหาราช",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "มณฑปท้าวมหาราช",
    zone: "old",
    category: "monument",
    highlight: false,
    description: "มณฑปประดิษฐานรูปปั้นท้าวจตุโลกบาลทั้ง 4 พระองค์ผู้ปกปักรักษา 4 ทิศ บนสวรรค์ชั้นจาตุมหาราชิกา",
    openingHours: null,
    gps: { lat: 15.3324, lng: 100.0724 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "กราบไหว้ขอพรการปกปักรักษาคุ้มครองให้แคล้วคลาดปลอดภัย",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/%282023%29_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A1_%28%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%8B%E0%B8%B8%E0%B8%87%29_%E0%B8%AD.%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87_%E0%B8%88.%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%B1%E0%B8%A2%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5_%283%29.jpg",
    ],
  },
  {
    id: 36,
    name: "วิหารหลวงพ่อศักดิ์สิทธิ์ และ โบสถ์เก่า",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "วิหารหลวงพ่อศักดิ์สิทธิ์",
    zone: "old",
    category: "highlight",
    highlight: true,
    description: "ประดิษฐานหลวงพ่อศักดิ์สิทธิ์ (หลวงพ่อใหญ่) พระพุทธรูปคู่วัดท่าซุงแต่ดั้งเดิม และโบสถ์เก่าสมัยอยุธยาที่มีภาพจิตรกรรมฝาผนังโบราณฝีมือช่างพื้นบ้าน",
    openingHours: null,
    gps: { lat: 15.3340, lng: 100.0740 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: "ชมจิตรกรรมฝาผนังโบราณสมัยอยุธยา และกราบขอพรหลวงพ่อศักดิ์สิทธิ์",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/5/58/Wat_Tha_Sung05.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/2/27/Wat_Tha_Sung04.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/c/c9/%282023%29_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A1_%28%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%8B%E0%B8%B8%E0%B8%87%29_%E0%B8%AD.%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87_%E0%B8%88.%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%B1%E0%B8%A2%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5_%281%29.jpg",
    ],
  },
  {
    id: 37,
    name: "ตึกรับแขก",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "ตึกรับแขก",
    zone: "old",
    category: "building",
    highlight: false,
    description: "อาคารรับรองแขกและคณะศรัทธาที่มาเยือนฝั่งวัดเก่า",
    openingHours: null,
    gps: { lat: 15.3338, lng: 100.0736 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
  {
    id: 38,
    name: "วิหารพระองค์ที่ 10 และ 11",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "วิหารพระองค์ที่ 10 และ 11",
    zone: "old",
    category: "vihara",
    highlight: false,
    description: "วิหารที่เกี่ยวเนื่องกับปริศนาธรรมและคำทำนายที่หลวงพ่อฤาษีลิงดำเคยกล่าวไว้ มีความสงบวิเวกสำหรับการเจริญจิตตภาวนา",
    openingHours: null,
    gps: { lat: 15.3323, lng: 100.0721 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/0/08/%282023%29_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A1_%28%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B8%8B%E0%B8%B8%E0%B8%87%29_%E0%B8%AD.%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87_%E0%B8%88.%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%B1%E0%B8%A2%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5_%2811%29.jpg",
    ],
  },
  {
    id: 39,
    name: "โรงเรียนพระสุธรรมยานเถระวิทยา",
    altName: "", // ใส่ชื่อเรียกทั่วไปที่นี่ (ถ้ามี)
    shortName: "โรงเรียนพระสุธรรมยานฯ",
    zone: "pavilion",
    category: "facility",
    highlight: false,
    description: "โรงเรียนการกุศลของวัดในพระอุปถัมภ์ จัดการศึกษาแผนกสามัญและพระปริยัติธรรมแก่เยาวชน",
    openingHours: null,
    gps: { lat: 15.3305, lng: 100.0732 }, // <<-- แก้พิกัด GPS นำทางที่นี่
    tips: null,
    photos: [],
  },
];

// เส้นทางแนะนำ Walking Tour
export const walkingTour = [
  {
    step: 1,
    placeId: 1,
    duration: "30 นาที",
    time: "08:30",
    tip: "ปราสาททองคำเปิดตั้งแต่ 08:00 → แวะชมความวิจิตรสีทองอร่ามก่อนเลย",
  },
  {
    step: 2,
    placeId: 12,
    duration: "45 นาที",
    time: "09:00",
    tip: "ไฮไลต์สำคัญ! สรีระสังขารหลวงพ่อไม่เน่าเปื่อยในโลงแก้ว ณ มหาวิหารแก้ว 100 เมตร",
  },
  {
    step: 3,
    placeId: 4,
    duration: "30 นาที",
    time: "10:00",
    tip: "กราบไหว้ขอพรสมเด็จองค์ปฐม พระพุทธเจ้าองค์แรก",
  },
  {
    step: 4,
    placeId: 3,
    duration: "20 นาที",
    time: "10:35",
    tip: "กราบพระยืน 30 ศอก ขอพรโชคลาภการเงินและความคล่องตัว",
  },
  {
    step: 5,
    placeId: 2,
    duration: "30 นาที",
    time: "11:00",
    tip: "ชมตึกสมบัติพ่อให้ สถาปัตยกรรมสุโขทัยประยุกต์และวัตถุมงคลล้ำค่า",
  },
  {
    step: 6,
    placeId: null,
    name: "พักเที่ยง — ร้านศาลาโค้ก",
    duration: "45 นาที",
    time: "11:45",
    tip: "ปลาแรดแม่น้ำสะแกกรังทอดกระเทียม ยำผักบุ้งกรอบ อาหารขึ้นชื่อเมืองอุทัยฯ",
  },
  {
    step: 7,
    placeId: 36,
    duration: "35 นาที",
    time: "14:00",
    tip: "กราบหลวงพ่อศักดิ์สิทธิ์ และชมจิตรกรรมฝาผนังโบราณสมัยอยุธยา",
  },
  {
    step: 8,
    placeId: 33,
    duration: "25 นาที",
    time: "14:40",
    tip: "ให้อาหารปลา ทำบุญปล่อยปลา สูดอากาศบริสุทธิ์ริมแม่น้ำสะแกกรัง",
  },
];

// กฎและข้อปฏิบัติในวัด
export const templeRules = [
  {
    title: "การแต่งกายสุภาพ",
    icon: "dressCode",
    description: "เสื้อมีแขน กางเกง/กระโปรงยาวคลุมเข่า ไม่สวมเสื้อกล้าม สายเดี่ยว หรือกางเกงขาสั้น",
  },
  {
    title: "ถอดรองเท้าก่อนเข้า",
    icon: "shoe",
    description: "ต้องถอดรองเท้าก่อนเข้าวิหารและมณฑปทุกแห่ง มีชั้นวางรองเท้าบริการหน้าทางเข้า",
  },
  {
    title: "รักษาความสงบ",
    icon: "quiet",
    description: "งดส่งเสียงดัง ปิดเสียงโทรศัพท์มือถือ เพื่อไม่รบกวนผู้ที่มาเจริญพระกรรมฐาน",
  },
  {
    title: "ห้ามสูบบุหรี่",
    icon: "noEntry",
    description: "ห้ามสูบบุหรี่และสิ่งเสพติดทุกชนิดภายในบริเวณวัดโดยเด็ดขาด",
  },
  {
    title: "การถ่ายภาพ",
    icon: "camera",
    description: "ถ่ายภาพเป็นที่ระลึกได้ตามความเหมาะสม สำรวมกิริยา และไม่รบกวนผู้อื่น",
  },
  {
    title: "รักษาความสะอาด",
    icon: "clean",
    description: "ทิ้งขยะในที่ที่จัดไว้ ช่วยกันดูแลความสะอาดของวัด",
  },
];

// ข้อกำหนดการแต่งกาย
export const dressCode = {
  dos: [
    "เสื้อมีแขน ไม่เว้า ไม่บาง ไม่รัดรูป",
    "กางเกงขายาว หรือกระโปรงยาวคลุมเข่า",
    "สวมชุดขาวหรือชุดสุภาพเรียบร้อย (สวมชุดไทยได้)",
    "รองเท้าที่ถอดใส่ง่าย เพราะต้องถอดก่อนเข้าวิหาร",
  ],
  donts: [
    "เสื้อกล้าม เสื้อแขนกุด เสื้อสายเดี่ยว เสื้อเอวลอย",
    "กางเกงขาสั้น กระโปรงสั้นเหนือเข่า",
    "กางเกงขาด แฟชั่นรัดรูป",
    "สวมหมวก แว่นตาดำ ภายในวิหาร",
  ],
};

// ร้านอาหารใกล้เคียง
export const restaurants = [
  {
    name: "ร้านศาลาโค้ก",
    desc: "อาหารไทย-พื้นบ้าน ปลาแม่น้ำสะแกกรังสดใหม่ ยำผักบุ้งกรอบ แกงป่าปลาคัง",
    distance: "~300 เมตร จากวัด",
    recommend: "ปลาแรดทอดน้ำปลา, ต้มยำปลาคัง",
    rating: "4.5",
  },
  {
    name: "ร้านพรหมท่าซุง",
    desc: "อาหารตามสั่งและก๋วยเตี๋ยว รสชาติอร่อย ราคาประหยัด สะดวกรวดเร็ว",
    distance: "~500 เมตร จากวัด",
    recommend: "ก๋วยเตี๋ยวต้มยำโบราณ, ข้าวกะเพราเป็ด",
    rating: "4.3",
  },
  {
    name: "ครัวทับทิมสยาม",
    desc: "ร้านอาหารริมแม่น้ำสะแกกรัง บรรยากาศดี รับลมเย็น วิวสวย",
    distance: "~1.5 กม. จากวัด",
    recommend: "ทอดมันปลากราย, ต้มยำปลากดคัง",
    rating: "4.4",
  },
];

// ที่พักใกล้เคียง
export const accommodations = [
  {
    name: "สุนันท์ บ้านพักริมคลอง",
    desc: "รีสอร์ตริมน้ำ บรรยากาศเงียบสงบ ใกล้วัดท่าซุง สะอาด ปลอดภัย",
    distance: "~1 กม. จากวัด",
    price: "600 - 1,200 บาท/คืน",
  },
  {
    name: "ท่าซุง ริเวอร์ไซด์ โฮมสเตย์",
    desc: "โฮมสเตย์ริมแม่น้ำสะแกกรัง สัมผัสวิถีชีวิตชาวแพ ใกล้ชิดธรรมชาติ",
    distance: "~800 เมตร จากวัด",
    price: "800 - 1,500 บาท/คืน",
  },
  {
    name: "โรงแรมในตัวเมืองอุทัยธานี",
    desc: "มีหลากหลายระดับ ตั้งแต่บูทีคโฮเทลไปจนถึงโรงแรมมาตรฐาน",
    distance: "~7 กม. จากวัด",
    price: "500 - 2,500 บาท/คืน",
  },
];
