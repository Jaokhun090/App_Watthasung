import { useState, useRef } from "react";
import { places } from "../data/places";
import Icon from "./Icons";

// ============================================================================
// พิกัดสถานที่ทั้ง 39 จุด ตรงตามภาพแผนผังลายเส้นและหมายเลขที่ผู้ใช้กำหนด 100%
// (ทิศเหนืออยู่ด้านบน, แม่น้ำสะแกกรังแถบสีน้ำเงินทางขวา, ถ.3265 ตัดเฉียงผ่ากลาง)
// ============================================================================
export const SATELLITE_LOCATIONS = [
  // --- 1. กลุ่มด้านบน (ทิศเหนือ): สวนสมเด็จฯ, ตึกพระเถระ, ร้านค้าสวัสดิการ & อิ่มบุญ ---
  { id: 39, x: 555, y: 55,  icon: "stupa",       color: "#64748b" }, // 39. ตึกพระเถระ (ยอดสามแยกบนสุด)
  { id: 38, x: 515, y: 95,  icon: "lotus",       color: "#10b981" }, // 38. สวนสมเด็จฯ (ใต้ 39)
  { id: 28, x: 705, y: 115, icon: "utensils",    color: "#ea580c" }, // 28. ร้านค้าสวัสดิการ
  { id: 26, x: 685, y: 145, icon: "utensils",    color: "#ea580c" }, // 26. ร้านอิ่มบุญ (ครัวร้อยเมตร)
  { id:  1, x: 605, y: 165, icon: "crystal",     color: "#38bdf8" }, // 1. วิหารแก้ว 100 เมตร

  // --- 2. กลุ่มทิศตะวันตกเฉียงเหนือ (ลูปสมเด็จองค์ปฐม, พระยืน, หลวงพ่อกัสสป) ---
  { id: 11, x: 314, y: 155, icon: "stupa",       color: "#94a3b8" }, // 11. เจดีย์พุดตาน
  { id:  3, x: 360, y: 160, icon: "mondop",      color: "#f59e0b" }, // 3. วิหารสมเด็จองค์ปฐม
  { id:  4, x: 316, y: 198, icon: "coinFlow",    color: "#eab308" }, // 4. พระยืน 30 ศอก (หลวงพ่อเงินไหลมาเทมา)
  { id: 32, x: 310, y: 260, icon: "museum",      color: "#94a3b8" }, // 32. พิพิธภัณฑ์สมบัติพ่อให้
  { id:  9, x: 405, y: 215, icon: "lotusSun",    color: "#38bdf8" }, // 9. มณฑปพระศรีอาริยเมตไตรย
  { id: 15, x: 250, y: 325, icon: "pray",        color: "#0284c7" }, // 15. วิหารหลวงพ่อพระมหากัสสป (ริมโค้งนอก)

  // --- 3. กลุ่มริมถนน 3265 ทิศตะวันออกเฉียงเหนือ (อาคารบริการ & ปูชนียสถาน) ---
  { id: 21, x: 730, y: 230, icon: "meditation",  color: "#b45309" }, // 21. อาคารที่พักผู้ปฏิบัติธรรมพระพินิจอักษร
  { id: 37, x: 735, y: 260, icon: "scripture",   color: "#d97706" }, // 37. ห้องสมุดประชาชนเฉลิมราชกุมารี
  { id: 10, x: 665, y: 290, icon: "pray",        color: "#eab308" }, // 10. วิหารพระวิสุทธิเทพ (พระจุฬามณี)
  { id: 33, x: 675, y: 330, icon: "stupa",       color: "#ca8a04" }, // 33. อนุสาวรีย์พระเจ้าพรหมมหาราช

  // --- 4. อาคารเดี่ยวฝั่งตะวันออก ถ.3265 ---
  { id: 36, x: 795, y: 370, icon: "scripture",   color: "#b45309" }, // 36. โรงเรียนพระสุธรรมยานเถระวิทยา

  // --- 5. กลุ่มใจกลาง & ตะวันตก (ปราสาททองคำ, ลาน 25 ไร่, ตึกขาว) ---
  { id:  2, x: 330, y: 425, icon: "palace",      color: "#d4a843" }, // 2. ปราสาททองกาญจนาภิเษก (ปราสาททองคำ)
  { id: 31, x: 400, y: 355, icon: "scripture",   color: "#b45309" }, // 31. ลาน 25 ไร่
  { id: 34, x: 470, y: 365, icon: "stupa",       color: "#94a3b8" }, // 34. ตึกขาว

  // --- 6. กลุ่มศาลาด้านล่าง & พระอุโบสถใหม่ (ทิศใต้ฝั่งวัดใหม่) ---
  // แถวบนถนนสายใต้ (ซ้ายไปขวา: 17, 18, 19)
  { id: 17, x: 395, y: 458, icon: "house",       color: "#78350f" }, // 17. หอประชุมพระสุธรรมยานเถระ (โรงทานศาลา 4 ไร่)
  { id: 18, x: 438, y: 462, icon: "scripture",   color: "#92400e" }, // 18. ศาลา 2 ไร่
  { id: 19, x: 480, y: 472, icon: "scripture",   color: "#b45309" }, // 19. ศาลา 3 ไร่
  // แถวล่างถนนสายใต้ (16, 23, 20, 5)
  { id: 16, x: 398, y: 528, icon: "scripture",   color: "#991b1b" }, // 16. พระมหาวิหาร100ปี พระราชพรหมยาน (ศาลา 12 ไร่)
  { id: 23, x: 470, y: 535, icon: "scripture",   color: "#16a34a" }, // 23. อาคารธรรมวิโมกข์
  { id: 20, x: 530, y: 548, icon: "scripture",   color: "#78350f" }, // 20. ศาลานวราช (ติดต่อที่พัก)
  { id:  5, x: 500, y: 570, icon: "navTemple",   color: "#d4a843" }, // 5. พระอุโบสถ (โบสถ์ใหม่)

  // --- 7. กลุ่มฝั่งวัดเก่า & ริมแม่น้ำสะแกกรัง (ทิศตะวันออกเฉียงใต้) ---
  { id: 14, x: 655, y: 495, icon: "fourKings",   color: "#f59e0b" }, // 14. มณฑปท้าวจาตุมหาราช
  { id: 13, x: 635, y: 525, icon: "mondop",      color: "#0284c7" }, // 13. มณฑปแก้วพระองค์ที่ 10 และ 11
  { id: 29, x: 690, y: 528, icon: "house",       color: "#64748b" }, // 29. ตึกรับแขก (จำหน่ายหนังสือ/วัตถุมงคล)
  { id: 27, x: 610, y: 545, icon: "utensils",    color: "#78350f" }, // 27. Tha Sung Coffee (กาแฟท่าซุง)
  { id:  6, x: 650, y: 560, icon: "oldTemple",   color: "#78350f" }, // 6. พระอุโบสถเก่า
  { id:  8, x: 680, y: 565, icon: "oldTemple",   color: "#b91c1c" }, // 8. วิหารหลวงพ่อศักดิ์สิทธิ์
  { id:  7, x: 585, y: 595, icon: "fiveBuddhas", color: "#94a3b8" }, // 7. วิหารหลวงพ่อ 5 พระองค์
  { id: 22, x: 650, y: 595, icon: "scripture",   color: "#b45309" }, // 22. ศาลาบูรพาจารย์
  { id: 12, x: 690, y: 595, icon: "tenthBuddha", color: "#f59e0b" }, // 12. วิหารพระองค์ที่ 10 และ 11 ใต้ต้นโพธิ์
  { id: 24, x: 585, y: 645, icon: "house",       color: "#eab308" }, // 24. อาคารเสริมศรี
  { id: 25, x: 615, y: 620, icon: "utensils",    color: "#b45309" }, // 25. หอฉัน
  { id: 35, x: 650, y: 658, icon: "fish",        color: "#0369a1" }, // 35. เรือคนึงหา (จามเทวีนาวา)
  { id: 30, x: 695, y: 645, icon: "fish",        color: "#2563eb" }, // 30. แพเลี้ยงปลา (วังมัจฉา - ตัวเลขสีน้ำเงินริมน้ำ)
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
          <span>ผังวัดท่าซุงตามแนวถนนจริง (ครบทั้ง 39 จุด)</span>
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
          viewBox="0 0 1200 720"
          className="master-map-svg"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          <defs>
            {/* Dark background theme matching satellite map context */}
            <linearGradient id="mapBgGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="riverBlueGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>

            <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity="0.4" />
            </filter>

            <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.4" />
            </filter>

            <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#38bdf8" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* 1. Base Dark Ground Canvas */}
          <rect x="0" y="0" width="1200" height="720" fill="url(#mapBgGrad)" />

          {/* 2. Sakae Krang River (แม่น้ำสะแกกรัง - แถบสีน้ำเงินทางขวาตามภาพผังผู้ใช้) */}
          <path
            d="M 1040,0 L 1200,0 L 1200,720 L 630,720 L 730,550 L 860,350 L 980,150 Z"
            fill="url(#riverBlueGrad)"
            stroke="#0284c7"
            strokeWidth="3"
          />
          {/* ป้ายชื่อแม่น้ำสะแกกรัง */}
          <text
            x="960"
            y="320"
            fill="#e0f2fe"
            fontSize="14"
            fontWeight="800"
            letterSpacing="3"
            transform="rotate(52, 960, 320)"
            opacity="0.85"
          >
            แม่น้ำสะแกกรัง ~ วังมัจฉา
          </text>

          {/* =============================================================== */}
          {/* 3. โครงข่ายถนนสีขาว (WHITE ROAD NETWORK ตรงตามภาพวาดของผู้ใช้ 100%) */}
          {/* =============================================================== */}

          {/* 3.1 ทล. 3265 (ถนนท่าซุง) - เส้นสีขาวหนาตัดเฉียงผ่ากลาง แล้วหักขึ้นเหนือ */}
          <path
            d="M 480,720 L 790,230 L 790,0"
            fill="none"
            stroke="#ffffff"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#roadGlow)"
          />
          {/* เส้นกลางถนน 3265 */}
          <path
            d="M 480,720 L 790,230 L 790,0"
            fill="none"
            stroke="#334155"
            strokeWidth="2"
            strokeDasharray="10,12"
          />
          <text x="805" y="40" fill="#94a3b8" fontSize="11" fontWeight="700">↑ ไป อ.เมืองอุทัยธานี</text>
          <text x="400" y="705" fill="#94a3b8" fontSize="11" fontWeight="700">↓ ไป อ.มโนรมย์ / ชัยนาท</text>
          <text x="710" y="340" fill="#0f172a" fontSize="10" fontWeight="800" transform="rotate(-57, 710, 340)">
            ทล. 3265 (ถนนท่าซุง)
          </text>

          {/* 3.2 วงรอบถนนฝั่งทิศเหนือและตะวันตก (North & West Loop) */}
          {/* เชื่อมจาก ถ.3265 ผ่าน 28, 26 ไปยัง 38, 39 */}
          <path
            d="M 790,115 L 705,115 L 550,110 L 540,55"
            fill="none"
            stroke="#ffffff"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* ลูปนอกฝั่งตะวันตก (จากยอด 39 ผ่านยอดโค้งลงมายัง 15 และ 2) */}
          <path
            d="M 540,55 L 490,25 L 370,40 L 255,45 L 230,115 L 155,195 L 265,240 L 225,335 L 310,390"
            fill="none"
            stroke="#ffffff"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* ทางเชื่อมด้านใน (จาก 38 โค้งลงมา ผ่าน 9 ไปเชื่อมต่อกับ 11, 3, 4, 32) */}
          <path
            d="M 540,110 L 490,190 L 340,195 L 310,390"
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3.3 ถนนแกนกลาง (Spine Road ระหว่างตึกขาวกับ ถ.3265) */}
          <path
            d="M 605,240 L 505,215 L 505,400 L 630,455"
            fill="none"
            stroke="#ffffff"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3.4 ทางแยกสเปอร์ ริม ถ.3265 (ไปยัง 10, 33 และ 21, 37) */}
          <path
            d="M 740,240 L 785,240"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 670,310 L 725,335"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* 3.5 ถนนสายใต้ฝั่งวัดใหม่ (ผ่าน 2, 17, 18, 19, 16, 23, 20, 5) */}
          {/* ทางออกไปทิศตะวันตกเฉียงใต้ */}
          <path
            d="M 310,390 L 320,470 L 95,390"
            fill="none"
            stroke="#ffffff"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* ถนนสายใต้ตัดขวาง (17, 18, 19) และโค้งลงสู่ ถ.3265 (16, 23, 20, 5) */}
          <path
            d="M 320,470 L 400,480 L 450,485 L 555,520 L 560,550 L 520,580 L 550,600"
            fill="none"
            stroke="#ffffff"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3.6 ถนนฝั่งวัดเก่า (East of Highway 3265) */}
          {/* ทางแยกจาก ถ.3265 เข้าสู่วัดเก่า */}
          <path
            d="M 590,565 L 660,580 L 660,510"
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* ซอยกลางฝั่งวัดเก่า (เชื่อม 27, 6, 8, 22, 12) */}
          <path
            d="M 660,580 L 660,600 L 705,600"
            fill="none"
            stroke="#ffffff"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* ซอยล่างฝั่งวัดเก่า (เชื่อม 24, 25, 35 ลงสู่ 30 วังมัจฉาริมน้ำ) */}
          <path
            d="M 660,580 L 620,630 L 650,650 L 700,645"
            fill="none"
            stroke="#ffffff"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 4. เข็มทิศบอกทิศเหนือจริง (Compass) */}
          <g transform="translate(65, 65)">
            <circle cx="0" cy="0" r="26" fill="rgba(30,41,59,0.85)" stroke="#d4a843" strokeWidth="1.8" filter="url(#mapShadow)" />
            <polygon points="0,-20 5,-4 0,0 -5,-4" fill="#ef4444" />
            <polygon points="0,20 5,4 0,0 -5,4" fill="#94a3b8" />
            <text x="0" y="-8" fill="#ef4444" fontSize="11" fontWeight="900" textAnchor="middle">N</text>
            <text x="0" y="16" fill="#94a3b8" fontSize="9" fontWeight="700" textAnchor="middle">S</text>
            <text x="15" y="4" fill="#94a3b8" fontSize="8" fontWeight="700" textAnchor="middle">E</text>
            <text x="-15" y="4" fill="#94a3b8" fontSize="8" fontWeight="700" textAnchor="middle">W</text>
          </g>

          {/* =============================================================== */}
          {/* 5. หมุดและหมายเลขทั้ง 39 จุด ตรงตามรูปวาดของผู้ใช้ 100%             */}
          {/* =============================================================== */}
          {SATELLITE_LOCATIONS.map((loc) => {
            const p = places.find((item) => item.id === loc.id);
            if (!p) return null;
            const isSelected = selectedPlace?.id === loc.id;
            const isHighlight = p.highlight;
            const isWaterPin = loc.id === 30; // 30 วังมัจฉา (ผู้ใช้วาดเป็นตัวเลขสีน้ำเงิน)

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
                    r="22"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeDasharray="4,4"
                    filter="url(#pinGlow)"
                  />
                )}

                {/* Building / Node Background Pill */}
                <rect
                  x="-18"
                  y="-14"
                  width="36"
                  height="28"
                  rx="6"
                  fill={
                    isSelected
                      ? "#0284c7"
                      : isHighlight
                      ? "#fef08a"
                      : isWaterPin
                      ? "#1e3a8a"
                      : "rgba(15, 23, 42, 0.92)"
                  }
                  stroke={
                    isSelected
                      ? "#38bdf8"
                      : isHighlight
                      ? "#d4a843"
                      : isWaterPin
                      ? "#38bdf8"
                      : "#ffffff"
                  }
                  strokeWidth={isSelected ? "2.5" : "1.8"}
                  filter="url(#mapShadow)"
                />

                {/* Number Display (ตัวเลขตรงตามภาพผังผู้ใช้ พร้อมขีดเส้นใต้) */}
                <text
                  x="0"
                  y="4"
                  fill={
                    isSelected
                      ? "#ffffff"
                      : isHighlight
                      ? "#78350f"
                      : isWaterPin
                      ? "#60a5fa"
                      : "#ffffff"
                  }
                  fontSize="13"
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="'Prompt', 'Inter', sans-serif"
                >
                  {loc.id}
                </text>
                {/* เส้นขีดใต้ตัวเลขตามที่ผู้ใช้วาด */}
                <line
                  x1="-10"
                  y1="7"
                  x2="10"
                  y2="7"
                  stroke={
                    isSelected
                      ? "#ffffff"
                      : isHighlight
                      ? "#b45309"
                      : isWaterPin
                      ? "#60a5fa"
                      : "#ffffff"
                  }
                  strokeWidth="1.5"
                />

                {/* Short Name Badge */}
                <rect
                  x="-42"
                  y="18"
                  width="84"
                  height="16"
                  rx="4"
                  fill={isSelected ? "#0284c7" : "rgba(30, 41, 59, 0.94)"}
                  stroke={isSelected ? "#38bdf8" : "rgba(255,255,255,0.25)"}
                  strokeWidth="0.8"
                />
                <text
                  x="0"
                  y="29.5"
                  fill={isSelected ? "#ffffff" : isHighlight ? "#fef08a" : "#f8fafc"}
                  fontSize="8"
                  fontWeight={isSelected || isHighlight ? "700" : "600"}
                  textAnchor="middle"
                  fontFamily="'Prompt', 'Inter', sans-serif"
                >
                  {p.shortName || p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="master-map-footer-hint">
        <span>💡 แตะที่หมายเลขหรือชื่ออาคารเพื่อดูข้อมูล ประวัติ และนำทางไปยังจุดนั้น</span>
      </div>
    </div>
  );
}
