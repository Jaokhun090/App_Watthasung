import { useState, useRef } from "react";
import { places } from "../data/places";
import Icon from "./Icons";

// ============================================================================
// พิกัดสถานที่ทั้ง 39 จุด อิงตามแนวถนนและภาพถ่ายดาวเทียม Google Maps 100%
// (ทิศเหนืออยู่ด้านบน, แม่น้ำสะแกกรังอยู่ทางขวา, ถนน 3265 ผ่ากลางเฉียง)
// ============================================================================
const SATELLITE_LOCATIONS = [
  // --- ฝั่งวัดใหม่: กลุ่มวิหารแก้ว 100 เมตร (ทิศตะวันออกเฉียงเหนือ ริม ทล.3265) ---
  { id: 14, x: 709.9, y: 150.8, icon: "utensils", color: "#ea580c" }, // ร้านค้าสวัสดิการ
  { id: 11, x: 725.0, y: 183.5, icon: "utensils", color: "#ea580c" }, // ร้านอิ่มบุญ (ครัวร้อยเมตร)
  { id: 12, x: 663.7, y: 265.0, icon: "crystal", color: "#38bdf8" }, // มหาวิหารแก้ว 100 เมตร
  { id:  6, x: 706.4, y: 365.8, icon: "pray", color: "#eab308" }, // วิหารพระวิสุทธิเทพ (พระจุฬามณี)
  { id: 26, x: 708.8, y: 402.5, icon: "stupa", color: "#ca8a04" }, // อนุสาวรีย์พระเจ้าพรหมมหาราช
  { id: 16, x: 733.4, y: 337.6, icon: "meditation", color: "#b45309" }, // อาคารที่พักผู้ปฏิบัติธรรมพระพินิจอักษร
  { id: 15, x: 776.1, y: 355.9, icon: "scripture", color: "#d97706" }, // ห้องสมุดประชาชนเฉลิมราชกุมารี
  { id: 39, x: 867.6, y: 473.7, icon: "scripture", color: "#b45309" }, // โรงเรียนพระสุธรรมยานเถระวิทยา

  // --- ฝั่งวัดใหม่: สวนสมเด็จฯ & พระยืน 30 ศอก (ทิศเหนือ) ---
  { id:  9, x: 507.1, y: 124.9, icon: "lotus", color: "#10b981" }, // สวนสมเด็จฯ (สระน้ำ & ศาลากลางน้ำ)
  { id: 10, x: 552.3, y: 153.6, icon: "stupa", color: "#64748b" }, // ตึกพระเถระ
  { id:  4, x: 311.4, y: 218.0, icon: "mondop", color: "#f59e0b" }, // วิหารสมเด็จองค์ปฐม
  { id: 28, x: 263.9, y: 224.8, icon: "stupa", color: "#94a3b8" }, // เจดีย์พุดตาน
  { id:  3, x: 251.9, y: 258.7, icon: "coinFlow", color: "#eab308" }, // พระยืน 30 ศอก (หลวงพ่อเงินไหลมาเทมา)
  { id:  8, x: 340.1, y: 259.8, icon: "lotusSun", color: "#38bdf8" }, // มณฑปพระศรีอาริยเมตไตรย
  { id:  2, x: 246.4, y: 334.2, icon: "museum", color: "#94a3b8" }, // พิพิธภัณฑ์สมบัติพ่อให้
  { id: 29, x: 189.8, y: 401.2, icon: "stupa", color: "#0284c7" }, // วิหารหลวงพ่อพระมหากัสสป

  // --- ฝั่งวัดใหม่: กลุ่มปราสาททองคำ & ตึกขาว (ศูนย์กลาง) ---
  { id:  7, x: 454.0, y: 418.0, icon: "stupa", color: "#94a3b8" }, // ตึกขาว
  { id:  5, x: 373.1, y: 427.3, icon: "scripture", color: "#b45309" }, // ลาน 25 ไร่
  { id:  1, x: 295.2, y: 533.8, icon: "palace", color: "#d4a843" }, // ปราสาททองกาญจนาภิเษก (ปราสาททองคำ)
  { id: 23, x: 398.6, y: 544.2, icon: "scripture", color: "#92400e" }, // ศาลา 2 ไร่
  { id: 24, x: 471.2, y: 556.1, icon: "scripture", color: "#b45309" }, // ศาลา 3 ไร่
  { id: 18, x: 358.5, y: 590.2, icon: "house", color: "#78350f" }, // หอประชุมพระสุธรรมยานเถระ (ศาลา 4 ไร่)

  // --- ฝั่งวัดใหม่: กลุ่มศาลาปฏิบัติธรรม & พระอุโบสถใหม่ (ทิศใต้) ---
  { id: 17, x: 401.7, y: 696.9, icon: "scripture", color: "#991b1b" }, // พระมหาวิหาร 100 ปี (ศาลา 12 ไร่)
  { id: 25, x: 467.0, y: 656.1, icon: "lotus", color: "#16a34a" }, // อาคารธรรมวิโมกข์
  { id: 20, x: 494.3, y: 688.4, icon: "navTemple", color: "#d4a843" }, // พระอุโบสถ (โบสถ์ใหม่)
  { id: 22, x: 518.0, y: 685.0, icon: "scripture", color: "#78350f" }, // ศาลานวราช (ติดต่อที่พัก)

  // --- ฝั่งวัดเก่า & ริมแม่น้ำสะแกกรัง (ฝั่งตะวันออก / ใต้) ---
  { id: 37, x: 578.0, y: 675.0, icon: "house", color: "#64748b" }, // ตึกรับแขก (จำหน่ายวัตถุมงคล/หนังสือ)
  { id: 35, x: 635.0, y: 655.0, icon: "fourKings", color: "#f59e0b" }, // มณฑปท้าวจาตุมหาราช
  { id: 34, x: 605.0, y: 680.0, icon: "crystal", color: "#0284c7" }, // มณฑปแก้วพระองค์ที่ 10-11
  { id: 36, x: 650.0, y: 690.0, icon: "oldTemple", color: "#b91c1c" }, // วิหารหลวงพ่อศักดิ์สิทธิ์
  { id: 32, x: 685.0, y: 705.0, icon: "oldTemple", color: "#78350f" }, // พระอุโบสถเก่า (โบสถ์เก่า)
  { id: 13, x: 600.0, y: 720.0, icon: "scripture", color: "#78350f" }, // Tha Sung Coffee (กาแฟท่าซุง)
  { id: 21, x: 645.0, y: 735.0, icon: "scripture", color: "#b45309" }, // ศาลาบูรพาจารย์
  { id: 38, x: 685.0, y: 745.0, icon: "tenthBuddha", color: "#f59e0b" }, // วิหารใต้ต้นโพธิ์
  { id: 30, x: 585.0, y: 765.0, icon: "fiveBuddhas", color: "#94a3b8" }, // วิหารหลวงพ่อ 5 พระองค์
  { id: 31, x: 625.0, y: 775.0, icon: "utensils", color: "#b45309" }, // หอฉัน
  { id: 27, x: 585.0, y: 810.0, icon: "pray", color: "#eab308" }, // อาคารเสริมศรี
  { id: 33, x: 695.0, y: 785.0, icon: "fish", color: "#0284c7" }, // แพเลี้ยงปลา (วังมัจฉา)
  { id: 40, x: 695.0, y: 825.0, icon: "fish", color: "#0369a1" }, // เรือคนึงหา (จามเทวีนาวา)
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
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
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

            <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
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
            d="M 130,270 C 130,120 220,95 380,95 C 530,95 620,135 600,210 C 580,260 480,270 380,270 C 240,270 130,280 130,270 Z"
            fill="url(#gardenGrad)"
            stroke="#86efac"
            strokeWidth="2"
          />
          {/* สวนป่าไผ่รอบวิหารกัสสป & ลานรอบปราสาททอง */}
          <path
            d="M 135,320 Q 220,290 260,335 Q 250,430 155,430 Q 115,385 135,320 Z"
            fill="url(#gardenGrad)"
            opacity="0.8"
          />

          {/* 3. สระน้ำสวนสมเด็จฯ รูปเกือกม้า (ตามภาพดาวเทียม Google Maps) */}
          <path
            d="M 260,165 C 300,140 420,130 480,145 C 495,155 485,185 450,190 C 390,200 310,195 270,185 C 255,175 255,168 260,165 Z"
            fill="url(#pondGrad)"
            stroke="#0284c7"
            strokeWidth="2"
          />
          {/* ศาลากลางน้ำในสวนสมเด็จฯ */}
          <circle cx="380" cy="160" r="10" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
          <line x1="380" y1="170" x2="380" y2="190" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />

          {/* 4. Sakae Krang River (แม่น้ำสะแกกรัง ทางทิศตะวันออก ขนาน ถ.3265 ตามภาพดาวเทียม Google Maps) */}
          <path
            d="M 630,850 L 670,780 L 735,680 L 800,560 L 885,420 L 960,280 L 1010,140 L 1040,0 L 1200,0 L 1200,850 Z"
            fill="url(#riverGrad)"
            stroke="#0284c7"
            strokeWidth="2"
          />
          {/* ลอนคลื่นน้ำในแม่น้ำ */}
          <path d="M 1060,100 Q 1080,115 1100,100" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M 980,260 Q 1000,275 1020,260" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M 870,480 Q 890,495 910,480" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M 760,700 Q 780,715 800,700" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

          {/* ป้ายชื่อแม่น้ำสะแกกรัง */}
          <text
            x="960"
            y="350"
            fill="#ffffff"
            fontSize="14"
            fontWeight="800"
            letterSpacing="3"
            transform="rotate(52, 960, 350)"
          >
            แม่น้ำสะแกกรัง ~ วังมัจฉา
          </text>

          {/* ท่าเทียบเรือ & วังมัจฉา (ทุ่นแพปลาลอยน้ำ) */}
          <rect x="695" y="765" width="40" height="35" rx="6" fill="#f97316" stroke="#c2410c" strokeWidth="2" filter="url(#mapShadow)" />
          {/* ลำเรือคนึงหา (จามเทวีนาวา) จอดเทียบข้างแพ */}
          <polygon points="695,810 725,810 720,835 700,835" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />

          {/* =============================================================== */}
          {/* โครงข่ายถนนจริง (REAL ROAD NETWORK FROM GOOGLE MAPS 100%)       */}
          {/* =============================================================== */}

          {/* 5.1 ถนนสายหลัก ทล. 3265 (ถนนท่าซุง) - เส้นฐานสีเข้มตัดเฉียง 45 องศา */}
          <path
            d="M 428,850 L 475,780 L 538,680 L 618,540 L 686,400 L 736,280 L 790,140 L 800,0"
            fill="none"
            stroke="#1e293b"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* เส้นประสีขาวแบ่งเลน ถ.3265 */}
          <path
            d="M 428,850 L 475,780 L 538,680 L 618,540 L 686,400 L 736,280 L 790,140 L 800,0"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="10,12"
          />

          {/* ป้ายบอกทางบนถนน 3265 */}
          <text x="815" y="30" fill="#334155" fontSize="11" fontWeight="700">↑ ไป อ.เมืองอุทัยธานี</text>
          <text x="380" y="835" fill="#334155" fontSize="11" fontWeight="700">↓ ไป อ.มโนรมย์ / ชัยนาท</text>
          <text x="700" y="360" fill="#f8fafc" fontSize="11" fontWeight="700" transform="rotate(-56, 700, 360)">
            ทล. 3265 (ถนนท่าซุง)
          </text>

          {/* 5.2 ถนนเชื่อมเข้าวิหารแก้ว 100 เมตร (แยกจาก ถ.3265 เข้าสู่วัดใหม่) */}
          <path
            d="M 790,155 L 750,175 L 700,195 L 640,205 L 590,205"
            fill="none"
            stroke="#334155"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 790,155 L 750,175 L 700,195 L 640,205 L 590,205"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="1.5"
            strokeDasharray="6,8"
          />

          {/* 5.3 ถ.วัดท่าซุง - วนรอบสวนสมเด็จฯ ฝั่งเหนือ */}
          <path
            d="M 590,205 L 565,175 L 525,140 L 450,135 L 350,138 L 250,145 L 180,175 L 150,215 L 145,270"
            fill="none"
            stroke="#475569"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5.4 ถ.วัดท่าซุง - แนวทางเดินระหว่างสวนสมเด็จฯ กับตึกขาว */}
          <path
            d="M 590,205 L 535,240 L 480,255 L 420,260 L 370,265 L 320,265 L 280,265"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5.5 ถนนเลียบตึกขาวฝั่งตะวันออก (Spine East) */}
          <path
            d="M 590,205 L 560,280 L 538,380 L 538,480 L 538,570 L 545,610"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5.6 ถนนระหว่างตึกขาวกับปราสาททองคำ (Spine West) */}
          <path
            d="M 370,265 L 355,330 L 345,420 L 345,520 L 345,600"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5.7 ถนนรอบปราสาททองกาญจนาภิเษก & ที่จอดรถฝั่งตะวันตก */}
          <path
            d="M 345,520 L 300,470 L 240,480 L 220,520 L 230,570 L 280,600 L 345,600"
            fill="none"
            stroke="#475569"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 220,520 L 165,530"
            fill="none"
            stroke="#475569"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* 5.8 ถนนเลียบทิศตะวันตก (ผ่านวิหารกัสสป & ลานจอดรถด้านนอก) */}
          <path
            d="M 145,270 L 150,360 L 160,470 L 165,560 L 185,680 L 200,800 L 210,850"
            fill="none"
            stroke="#475569"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5.9 ถนนเชื่อมสายใต้ (จาก ถ.3265 ข้ามไปยังปราสาททองคำ & ศาลา 2 ไร่) */}
          <path
            d="M 580,580 L 545,610 L 480,615 L 410,615 L 345,600 L 280,600 L 185,600"
            fill="none"
            stroke="#334155"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 580,580 L 545,610 L 480,615 L 410,615 L 345,600 L 280,600 L 185,600"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="1.5"
            strokeDasharray="6,8"
          />

          {/* 5.10 ทางเข้าหน้าพระอุโบสถใหม่ และถนนเลียบศาลา 12 ไร่ */}
          <path
            d="M 538,680 L 490,680"
            fill="none"
            stroke="#475569"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 480,615 L 460,660 L 450,740 L 440,820"
            fill="none"
            stroke="#475569"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5.11 ถนนสายหลักฝั่งวัดเก่า (จากประตู ถ.3265 ลงสู่วังมัจฉา & ริมแม่น้ำ) */}
          <path
            d="M 538,680 L 580,690 L 630,700 L 680,720 L 715,760"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 618,540 L 670,570 L 730,620 L 745,700 L 715,760"
            fill="none"
            stroke="#475569"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 630,700 L 650,750 L 690,770 L 715,760"
            fill="none"
            stroke="#475569"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5.12 ทางเดินเลียบแม่น้ำสะแกกรังฝั่งวัดเก่า */}
          <path
            d="M 745,640 L 740,720 L 715,780 L 680,840"
            fill="none"
            stroke="#475569"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 6. แปลนสถาปัตยกรรมอาคารสำคัญ (Architectural Footprints) */}
          {/* วิหารแก้ว 100 เมตร (วางเฉียงแนว NW-SE ตามภาพดาวเทียม Google Maps) */}
          <g transform="translate(664, 265) rotate(-34)">
            <rect x="-55" y="-18" width="110" height="36" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" filter="url(#mapShadow)" />
            <line x1="-48" y1="0" x2="48" y2="0" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
          </g>

          {/* ปราสาททองกาญจนาภิเษก (กำแพงลานสี่เหลี่ยม 3 ชั้น) */}
          <g transform="translate(295, 534)">
            <rect x="-32" y="-32" width="64" height="64" rx="4" fill="#fef3c7" stroke="#d4a843" strokeWidth="2" filter="url(#mapShadow)" />
            <rect x="-22" y="-22" width="44" height="44" fill="#fde68a" stroke="#d4a843" strokeWidth="1.5" />
            <rect x="-12" y="-12" width="24" height="24" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
          </g>

          {/* ตึกขาววัดท่าซุง (อาคารใหญ่หลังคาโซลาร์เซลล์ มีลานกลาง) */}
          <g transform="translate(454, 418)">
            <rect x="-75" y="-140" width="150" height="280" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" filter="url(#mapShadow)" />
            <rect x="-40" y="-30" width="80" height="60" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="-60" y1="-100" x2="-20" y2="-100" stroke="#94a3b8" strokeWidth="1" />
            <line x1="20" y1="-100" x2="60" y2="-100" stroke="#94a3b8" strokeWidth="1" />
            <line x1="-60" y1="100" x2="-20" y2="100" stroke="#94a3b8" strokeWidth="1" />
            <line x1="20" y1="100" x2="60" y2="100" stroke="#94a3b8" strokeWidth="1" />
          </g>

          {/* ศาลา 2 ไร่ (ทางใต้ของตึกขาว) */}
          <g transform="translate(399, 544)">
            <rect x="-35" y="-18" width="70" height="36" rx="3" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" filter="url(#mapShadow)" />
          </g>

          {/* พระมหาวิหาร 100 ปี พระราชพรหมยาน (ศาลา 12 ไร่ โครงหลังคาโค้งใหญ่) */}
          <g transform="translate(402, 697)">
            <rect x="-45" y="-70" width="90" height="140" rx="16" fill="#f1f5f9" stroke="#64748b" strokeWidth="2.5" filter="url(#mapShadow)" />
            <line x1="0" y1="-60" x2="0" y2="60" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
          </g>

          {/* พระอุโบสถใหม่ พร้อมแนวกำแพงแก้ว (หันหน้าเข้าหา ถ.3265) */}
          <g transform="translate(494, 688)">
            <rect x="-28" y="-36" width="56" height="72" rx="3" fill="#fef3c7" stroke="#d4a843" strokeWidth="2" strokeDasharray="4,3" />
            <rect x="-16" y="-20" width="32" height="40" rx="2" fill="url(#goldRoofGrad)" stroke="#b45309" strokeWidth="2" filter="url(#mapShadow)" />
          </g>

          {/* โรงเรียนพระสุธรรมยานเถระวิทยา (ฝั่งตะวันออก ถ.3265) */}
          <g transform="translate(868, 474)">
            <rect x="-40" y="-30" width="80" height="60" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" filter="url(#mapShadow)" />
            <rect x="-20" y="-15" width="40" height="30" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          </g>

          {/* พระอุโบสถเก่า & วิหารหลวงพ่อศักดิ์สิทธิ์ฝั่งวัดเดิม */}
          <g transform="translate(685, 705)">
            <rect x="-22" y="-15" width="44" height="30" rx="3" fill="#fffbeb" stroke="#b45309" strokeWidth="1.5" filter="url(#mapShadow)" />
          </g>
          <g transform="translate(650, 690)">
            <rect x="-18" y="-14" width="36" height="28" rx="2" fill="#fff7ed" stroke="#b45309" strokeWidth="1.5" filter="url(#mapShadow)" />
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
                transform={`translate(${loc.x}, ${loc.y})`}
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
