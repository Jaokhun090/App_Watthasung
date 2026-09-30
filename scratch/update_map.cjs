const fs = require('fs');

// Generate exact 2D InteractiveMasterMap.jsx content with real OSM roads and coordinates
const mapCode = `import { useState, useRef } from "react";
import { places } from "../data/places";
import Icon from "./Icons";

// ============================================================================
// พิกัดสถานที่ทั้ง 39 จุด อิงตามแนวถนนจริงจาก Google Maps และ OpenStreetMap 100%
// (ทิศเหนืออยู่ด้านบน, แม่น้ำสะแกกรังอยู่ทางขวา, ถนน 3265 ผ่ากลางเฉียง)
// ============================================================================
const SATELLITE_LOCATIONS = [
  // --- ฝั่งวัดใหม่: กลุ่มวิหารแก้ว 100 เมตร (ตะวันออกเฉียงเหนือ) ---
  { id: 11, x: 625, y: 195, icon: "utensils", color: "#ea580c" },  // ร้านอิ่มบุญ (ครัวร้อยเมตร)
  { id: 13, x: 675, y: 195, icon: "scripture", color: "#78350f" }, // Tha Sung Coffee
  { id: 14, x: 720, y: 200, icon: "utensils", color: "#ea580c" },  // ร้านค้าสวัสดิการ
  { id: 12, x: 735, y: 245, icon: "crystal", color: "#38bdf8" },   // วิหารแก้ว 100 เมตร (เฉียง NW-SE)
  { id: 6,  x: 820, y: 295, icon: "pray", color: "#eab308" },      // วิหารพระวิสุทธิเทพ
  { id: 26, x: 865, y: 310, icon: "stupa", color: "#ca8a04" },     // อนุสาวรีย์พระเจ้าพรหมมหาราช
  { id: 15, x: 810, y: 360, icon: "scripture", color: "#d97706" }, // ห้องสมุดประชาชนเฉลิมราชกุมารี
  { id: 16, x: 755, y: 395, icon: "meditation", color: "#b45309" }, // อาคารที่พักผู้ปฏิบัติธรรมพระพินิจอักษร

  // --- ฝั่งวัดใหม่: สวนสมเด็จฯ & พระยืน 30 ศอก (ทิศเหนือ) ---
  { id: 9,  x: 400, y: 185, icon: "lotus", color: "#10b981" },     // สวนสมเด็จฯ (สระน้ำ & ศาลากลางน้ำ)
  { id: 3,  x: 350, y: 260, icon: "coinFlow", color: "#eab308" },  // พระยืน 30 ศอก (หลวงพ่อเงินไหลมาเทมา)
  { id: 4,  x: 415, y: 260, icon: "mondop", color: "#f59e0b" },    // วิหารสมเด็จองค์ปฐม
  { id: 8,  x: 475, y: 270, icon: "lotusSun", color: "#38bdf8" },  // มณฑปพระศรีอาริยเมตไตรย
  { id: 28, x: 365, y: 300, icon: "stupa", color: "#94a3b8" },     // เจดีย์พุดตาน
  { id: 2,  x: 420, y: 335, icon: "museum", color: "#94a3b8" },    // พิพิธภัณฑ์สมบัติพ่อให้
  { id: 29, x: 250, y: 310, icon: "stupa", color: "#0284c7" },     // วิหารหลวงพ่อพระมหากัสสป (ในสวนร่มรื่น)
  { id: 10, x: 535, y: 300, icon: "stupa", color: "#64748b" },     // ตึกพระเถระ

  // --- ฝั่งวัดใหม่: กลุ่มปราสาททองคำ & ตึกขาว (ศูนย์กลาง) ---
  { id: 1,  x: 215, y: 490, icon: "palace", color: "#d4a843" },    // ปราสาททองกาญจนาภิเษก (ปราสาททองคำ)
  { id: 7,  x: 400, y: 475, icon: "stupa", color: "#94a3b8" },     // ตึกขาววัดท่าซุง
  { id: 5,  x: 120, y: 460, icon: "scripture", color: "#b45309" }, // ลาน 25 ไร่

  // --- ฝั่งวัดใหม่: กลุ่มศาลาปฏิบัติธรรม & พระอุโบสถใหม่ (ทิศใต้) ---
  { id: 23, x: 295, y: 565, icon: "scripture", color: "#92400e" }, // ศาลา 2 ไร่
  { id: 18, x: 380, y: 575, icon: "house", color: "#78350f" },     // หอประชุมพระสุธรรมยานเถระ (ศาลา 4 ไร่)
  { id: 24, x: 300, y: 625, icon: "scripture", color: "#b45309" }, // ศาลา 3 ไร่
  { id: 21, x: 385, y: 635, icon: "scripture", color: "#b45309" }, // ศาลาบูรพาจารย์
  { id: 17, x: 285, y: 705, icon: "scripture", color: "#991b1b" }, // พระมหาวิหาร 100 ปี (ศาลา 12 ไร่)
  { id: 25, x: 475, y: 585, icon: "lotus", color: "#16a34a" },     // อาคารธรรมวิโมกข์
  { id: 20, x: 520, y: 645, icon: "navTemple", color: "#d4a843" }, // พระอุโบสถ (โบสถ์ใหม่)
  { id: 22, x: 590, y: 640, icon: "scripture", color: "#78350f" }, // ศาลานวราช (ติดต่อที่พัก)

  // --- ฝั่งวัดเก่า & ริมแม่น้ำสะแกกรัง (ฝั่งตะวันออก / ขวาของ ถ.3265) ---
  { id: 39, x: 995, y: 320, icon: "scripture", color: "#b45309" },  // โรงเรียนพระสุธรรมยานเถระวิทยา
  { id: 37, x: 965, y: 410, icon: "house", color: "#64748b" },      // ตึกรับแขก (จำหน่ายวัตถุมงคล/หนังสือ)
  { id: 34, x: 1010, y: 365, icon: "crystal", color: "#0284c7" },   // มณฑปแก้วพระองค์ที่ 10 และ 11
  { id: 35, x: 1055, y: 370, icon: "fourKings", color: "#f59e0b" }, // มณฑปท้าวจาตุมหาราช
  { id: 36, x: 1015, y: 415, icon: "oldTemple", color: "#b91c1c" }, // วิหารหลวงพ่อศักดิ์สิทธิ์
  { id: 32, x: 1045, y: 450, icon: "oldTemple", color: "#78350f" }, // พระอุโบสถเก่า (โบสถ์เก่า)
  { id: 38, x: 1090, y: 440, icon: "tenthBuddha", color: "#f59e0b" }, // วิหารพระองค์ที่ 10-11 ใต้ต้นโพธิ์
  { id: 30, x: 925, y: 485, icon: "fiveBuddhas", color: "#94a3b8" }, // วิหารหลวงพ่อ 5 พระองค์
  { id: 31, x: 990, y: 495, icon: "utensils", color: "#b45309" },   // หอฉัน
  { id: 27, x: 950, y: 565, icon: "pray", color: "#eab308" },       // อาคารเสริมศรี
  { id: 33, x: 1075, y: 515, icon: "fish", color: "#0284c7" },      // แพเลี้ยงปลา (วังมัจฉา)
  { id: 40, x: 1050, y: 580, icon: "fish", color: "#0369a1" },      // เรือคนึงหา (จามเทวีนาวา)
];

export default function InteractiveMasterMap({
  selectedPlace,
  onSelectPlace,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.3, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.3, 0.8));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onPointerDown = (e) => {
    setIsPanning(true);
    startPanRef.current = {
      x: (e.clientX || (e.touches && e.touches[0].clientX)) - pan.x,
      y: (e.clientY || (e.touches && e.touches[0].clientY)) - pan.y,
    };
  };

  const onPointerMove = (e) => {
    if (!isPanning) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    setPan({
      x: clientX - startPanRef.current.x,
      y: clientY - startPanRef.current.y,
    });
  };

  const onPointerUp = () => {
    setIsPanning(false);
  };

  return (
    <div className="master-map-container">
      {/* Top Controls HUD */}
      <div className="master-map-controls">
        <div className="master-map-title-badge">
          <Icon name="navMap" size={15} color="var(--gold-dark)" />
          <span>ผังวัดท่าซุงตามแนวถนนจริง Google Maps ({places.length} จุด)</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" className="master-map-hud-btn" onClick={handleZoomIn} title="ซูมเข้า">+</button>
          <button type="button" className="master-map-hud-btn" onClick={handleZoomOut} title="ซูมออก">-</button>
          <button type="button" className="master-map-hud-btn" onClick={handleReset} title="รีเซ็ตผัง">↺</button>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div
        className="master-map-viewport"
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        <svg
          viewBox="0 0 1200 850"
          className="master-map-svg"
          style={{
            transform: \`translate(\${pan.x}px, \${pan.y}px) scale(\${zoom})\`,
            transformOrigin: "center center",
          }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="groundGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f7f3ec" />
              <stop offset="50%" stopColor="#efe8dc" />
              <stop offset="100%" stopColor="#e5dcce" />
            </linearGradient>

            <linearGradient id="gardenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dcfce7" />
              <stop offset="100%" stopColor="#bbf7d0" />
            </linearGradient>

            <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="40%" stopColor="#0ea5e9" />
              <stop offset="80%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="pondGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <linearGradient id="goldRoofGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity="0.2" />
            </filter>

            <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* 1. Base Temple Territory Island Shape */}
          <rect x="0" y="0" width="1200" height="850" fill="url(#groundGrad)" />

          {/* 2. Green Garden Areas (สวนสมเด็จฯ และสวนป่าไผ่เวฬุวัน) */}
          {/* สวนสมเด็จฯ ทางทิศเหนือ */}
          <path
            d="M 180,224 C 180,140 250,130 380,130 C 510,130 580,140 580,210 C 580,260 510,270 380,265 C 250,260 180,260 180,224 Z"
            fill="url(#gardenGrad)"
            stroke="#86efac"
            strokeWidth="2"
          />
          {/* สวนป่าไผ่รอบวิหารกัสสป & ปราสาททอง */}
          <path
            d="M 160,280 Q 230,260 270,300 Q 260,370 170,370 Q 130,340 160,280 Z"
            fill="url(#gardenGrad)"
            opacity="0.8"
          />

          {/* 3. สระน้ำสวนสมเด็จฯ รูปเกือกม้า (ตามภาพดาวเทียม Google Maps) */}
          <path
            d="M 220,200 C 230,165 330,160 480,160 C 550,160 565,185 530,210 C 470,220 370,222 260,220 C 230,220 215,210 220,200 Z"
            fill="url(#pondGrad)"
            stroke="#0284c7"
            strokeWidth="2"
          />
          {/* ศาลากลางน้ำในสวนสมเด็จฯ */}
          <circle cx="400" cy="185" r="10" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
          <line x1="400" y1="195" x2="400" y2="220" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />

          {/* 4. Sakae Krang River (แม่น้ำสะแกกรัง ทางทิศตะวันออก ขวาของแผนที่) */}
          <path
            d="M 1200,0 
               L 1120,0 
               C 1140,150 1150,280 1130,420 
               C 1110,540 1060,650 960,760 
               L 880,850 
               L 1200,850 Z"
            fill="url(#riverGrad)"
            stroke="#0284c7"
            strokeWidth="2"
          />
          {/* ลอนคลื่นน้ำในแม่น้ำ */}
          <path d="M 1130,150 Q 1150,165 1170,150" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M 1120,320 Q 1140,335 1160,320" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M 1080,500 Q 1100,515 1120,500" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M 1020,680 Q 1040,695 1060,680" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

          {/* ป้ายชื่อแม่น้ำสะแกกรัง */}
          <text
            x="1150"
            y="430"
            fill="#ffffff"
            fontSize="14"
            fontWeight="800"
            letterSpacing="3"
            transform="rotate(82, 1150, 430)"
          >
            แม่น้ำสะแกกรัง ~ วังมัจฉา
          </text>

          {/* ท่าเทียบเรือ & วังมัจฉา (ทุ่นแพปลาลอยน้ำ) */}
          <rect x="1055" y="495" width="45" height="42" rx="6" fill="#f97316" stroke="#c2410c" strokeWidth="2" filter="url(#mapShadow)" />
          {/* ลำเรือคนึงหา (จามเทวีนาวา) จอดเทียบข้างแพ */}
          <polygon points="1035,565 1065,565 1060,595 1040,595" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />

          {/* =============================================================== */}
          {/* โครงข่ายถนนจริง (REAL ROAD NETWORK FROM GOOGLE MAPS / OSM)     */}
          {/* =============================================================== */}

          {/* 5.1 ถนนสายหลัก ทล. 3265 (ถนนท่าซุง) - เส้นฐานสีเข้ม */}
          <path
            d="M 918,-10 
               L 936,182 L 942,238 L 949,308 L 948,326 L 944,343 L 937,359 L 930,382 L 913,400 
               L 882,431 L 769,540 L 649,647 L 560,722 L 543,740 L 526,765 L 513,793 L 475,869"
            fill="none"
            stroke="#1e293b"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* เส้นประสีขาวแบ่งเลน ถ.3265 */}
          <path
            d="M 918,-10 
               L 936,182 L 942,238 L 949,308 L 948,326 L 944,343 L 937,359 L 930,382 L 913,400 
               L 882,431 L 769,540 L 649,647 L 560,722 L 543,740 L 526,765 L 513,793 L 475,869"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="8,10"
          />

          {/* ป้ายบอกทางบนถนน 3265 */}
          <text x="945" y="40" fill="#334155" fontSize="11" fontWeight="700">↑ ไป อ.เมืองอุทัยธานี</text>
          <text x="440" y="845" fill="#334155" fontSize="11" fontWeight="700">↓ ไป อ.มโนรมย์ / ชัยนาท</text>
          <text x="740" y="555" fill="#f8fafc" fontSize="10" fontWeight="700" transform="rotate(-44, 740, 555)">
            ทล. 3265 (ถนนท่าซุง)
          </text>

          {/* 5.2 ถนนเชื่อมเข้าวิหารแก้ว 100 เมตร (จาก ถ.3265 เข้าสู่วัดใหม่) */}
          <path
            d="M 942,238 L 879,230 L 769,229 L 660,229 L 631,229"
            fill="none"
            stroke="#334155"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 942,238 L 879,230 L 769,229 L 660,229 L 631,229"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="1.5"
            strokeDasharray="6,8"
          />

          {/* 5.3 ถ.วัดท่าซุง - สายใน (จาก 100 เมตร วนผ่านสมบัติพ่อให้ ลงสู่ลานปราสาททอง & ตึกขาว) */}
          <path
            d="M 631,229 
               L 598,234 L 578,241 L 562,248 L 550,256 L 542,272 L 537,301 L 524,312 
               L 469,314 L 433,315 L 381,315 L 345,315 L 335,320 L 331,328 L 330,361 
               L 330,424 L 325,464 L 320,472 L 313,479 L 292,480"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5.4 ถ.วัดท่าซุง - วนรอบสวนสมเด็จฯ ฝั่งเหนือ */}
          <path
            d="M 631,229 
               L 610,210 L 577,179 L 551,158 L 527,154 L 417,168 L 378,171 L 315,174 
               L 206,176 L 194,187 L 186,224 L 173,243 L 128,261 L 103,275 L 89,306 
               L 98,325 L 120,334 L 218,363 L 225,378 L 179,435 L 181,451 L 202,457 L 292,480"
            fill="none"
            stroke="#475569"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5.5 ทางเดินรอบสระน้ำสวนสมเด็จฯ (Park Promenade) */}
          <path
            d="M 362,199 L 412,189 L 475,179 L 521,160 L 546,162 L 567,179 L 549,204 L 517,219 L 439,219 L 362,229 L 279,234 L 201,238 L 186,224"
            fill="none"
            stroke="#86efac"
            strokeWidth="4"
            strokeDasharray="4,4"
          />

          {/* 5.6 ถนนเชื่อมจากลานปราสาททอง/ศาลา 2 ไร่ ไปยังพระอุโบสถใหม่ และ ถ.3265 */}
          <path
            d="M 248,559 L 296,573 L 369,585 L 439,592 L 549,598 L 649,647"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* ทางเชื่อมลงศาลา 12 ไร่ */}
          <path
            d="M 292,480 L 275,533 L 275,550 L 296,573 L 285,670 L 350,680"
            fill="none"
            stroke="#475569"
            strokeWidth="10"
            strokeLinejoin="round"
          />

          {/* 5.7 ถนนเลียบฝั่งวัดเก่า & ริมน้ำ (ซอยสะแกกรัง) */}
          <path
            d="M 942,238 L 990,265 L 1030,330 L 1040,430 L 1020,510 L 990,570 L 882,650 L 769,720"
            fill="none"
            stroke="#475569"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 6. แปลนสถาปัตยกรรมอาคารสำคัญ (Architectural Footprints) */}
          {/* วิหารแก้ว 100 เมตร (วางเฉียงแนว NW-SE ตามภาพดาวเทียม Google Maps) */}
          <g transform="translate(735, 245) rotate(-33)">
            <rect x="-55" y="-18" width="110" height="36" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" filter="url(#mapShadow)" />
            <line x1="-50" y1="0" x2="50" y2="0" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
          </g>

          {/* ปราสาททองกาญจนาภิเษก (กำแพงลานสี่เหลี่ยม 3 ชั้น) */}
          <g transform="translate(215, 490)">
            <rect x="-36" y="-36" width="72" height="72" rx="4" fill="#fef3c7" stroke="#d4a843" strokeWidth="2" filter="url(#mapShadow)" />
            <rect x="-24" y="-24" width="48" height="48" fill="#fde68a" stroke="#d4a843" strokeWidth="1.5" />
            <rect x="-14" y="-14" width="28" height="28" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
          </g>

          {/* ตึกขาววัดท่าซุง (อาคารใหญ่หลังคาโซลาร์เซลล์) */}
          <g transform="translate(400, 475)">
            <rect x="-32" y="-35" width="64" height="70" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" filter="url(#mapShadow)" />
            <line x1="-26" y1="-20" x2="26" y2="-20" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="-26" y1="-5" x2="26" y2="-5" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="-26" y1="10" x2="26" y2="10" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="-26" y1="25" x2="26" y2="25" stroke="#cbd5e1" strokeWidth="1.5" />
          </g>

          {/* พระมหาวิหาร 100 ปี พระราชพรหมยาน (ศาลา 12 ไร่ โครงหลังคาโค้งใหญ่) */}
          <g transform="translate(285, 705)">
            <rect x="-48" y="-34" width="96" height="68" rx="14" fill="#f1f5f9" stroke="#64748b" strokeWidth="2.5" filter="url(#mapShadow)" />
            <line x1="0" y1="-30" x2="0" y2="30" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3,3" />
          </g>

          {/* พระอุโบสถใหม่ พร้อมแนวกำแพงแก้ว (ติด ถ.3265) */}
          <g transform="translate(520, 645)">
            <rect x="-26" y="-20" width="52" height="40" rx="3" fill="#fef3c7" stroke="#d4a843" strokeWidth="2" strokeDasharray="4,3" />
            <rect x="-16" y="-12" width="32" height="24" rx="2" fill="url(#goldRoofGrad)" stroke="#b45309" strokeWidth="2" filter="url(#mapShadow)" />
          </g>

          {/* พระอุโบสถเก่า & วิหารหลวงพ่อศักดิ์สิทธิ์ฝั่งวัดเดิม */}
          <g transform="translate(1030, 430)">
            <rect x="-35" y="-25" width="70" height="50" rx="4" fill="#fffbeb" stroke="#b45309" strokeWidth="1.5" />
          </g>

          {/* 7. เข็มทิศบอกทิศเหนือจริง (Compass Rose) */}
          <g transform="translate(75, 75)">
            <circle cx="0" cy="0" r="28" fill="rgba(255,255,255,0.92)" stroke="#d4a843" strokeWidth="2" filter="url(#mapShadow)" />
            <polygon points="0,-22 6,-4 0,0 -6,-4" fill="#b91c1c" />
            <polygon points="0,22 6,4 0,0 -6,4" fill="#64748b" />
            <text x="0" y="-10" fill="#b91c1c" fontSize="12" fontWeight="900" textAnchor="middle">N</text>
            <text x="0" y="18" fill="#64748b" fontSize="10" fontWeight="700" textAnchor="middle">S</text>
            <text x="17" y="4" fill="#64748b" fontSize="9" fontWeight="700" textAnchor="middle">E</text>
            <text x="-17" y="4" fill="#64748b" fontSize="9" fontWeight="700" textAnchor="middle">W</text>
          </g>

          {/* 8. หมุดและป้ายสถานที่ทั้ง 39 จุด (Interactive Pins & Badges) */}
          {SATELLITE_LOCATIONS.map((loc) => {
            const p = places.find((item) => item.id === loc.id);
            if (!p) return null;
            const isSelected = selectedPlace?.id === loc.id;
            const isHighlight = p.highlight;

            return (
              <g
                key={loc.id}
                className="master-map-node"
                transform={\`translate(\${loc.x}, \${loc.y})\`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlace(p);
                }}
                style={{ cursor: "pointer" }}
              >
                {/* Selection Aura */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r="24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeDasharray="4,4"
                    filter="url(#pinGlow)"
                  />
                )}

                {/* Building Base Representation */}
                <rect
                  x="-15"
                  y="-13"
                  width="30"
                  height="26"
                  rx="6"
                  fill={isSelected ? "#1e293b" : isHighlight ? "#fef3c7" : "#ffffff"}
                  stroke={isSelected ? "#2563eb" : isHighlight ? "#d4a843" : "#cbd5e1"}
                  strokeWidth={isSelected ? "2.5" : "1.8"}
                  filter="url(#mapShadow)"
                />

                {/* Number Badge */}
                <circle
                  cx="11"
                  cy="-11"
                  r="9.5"
                  fill={isHighlight ? "#d4a843" : "#475569"}
                  stroke="#ffffff"
                  strokeWidth="1.6"
                />
                <text
                  x="11"
                  y="-7.5"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {loc.id}
                </text>

                {/* Center Icon Indicator */}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontSize="12"
                  fill={isSelected ? "#ffffff" : isHighlight ? "#b45309" : "#334155"}
                >
                  {loc.id === 1 ? "🏰" : loc.id === 12 ? "✨" : loc.id === 3 ? "🙏" : loc.id === 33 ? "🐟" : loc.id === 9 ? "🌳" : "🛕"}
                </text>

                {/* Place Name Label Pill */}
                <rect
                  x="-45"
                  y="16"
                  width="90"
                  height="16"
                  rx="4"
                  fill={isSelected ? "#2563eb" : "rgba(255,255,255,0.94)"}
                  stroke={isSelected ? "#1d4ed8" : "rgba(0,0,0,0.12)"}
                  strokeWidth="0.8"
                />
                <text
                  x="0"
                  y="28"
                  fill={isSelected ? "#ffffff" : "#1e293b"}
                  fontSize="8.5"
                  fontWeight={isSelected || isHighlight ? "700" : "600"}
                  textAnchor="middle"
                >
                  {p.shortName || p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="master-map-footer-hint">
        <span>💡 แตะที่อาคารหรือตัวเลขเพื่อดูข้อมูลและเปิดแผนที่นำทาง Google Maps</span>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('./src/components/InteractiveMasterMap.jsx', mapCode);
console.log('Updated src/components/InteractiveMasterMap.jsx with real OSM/Google Maps roads!');
