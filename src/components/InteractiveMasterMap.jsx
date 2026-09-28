import { useState, useRef } from "react";
import { places } from "../data/places";
import Icon, { placeIcons } from "./Icons";

// พิกัดและการจัดวางของสถานที่ทั้ง 40 จุดตามป้ายผังวัดจริง (Img/20260927_122430.jpg)
const SIGNBOARD_LOCATIONS = [
  // แถวบน (ฝั่งวัดใหม่ - วิหารหลัก)
  { id: 1, x: 470, y: 155, icon: "palace", color: "#d4a843" },
  { id: 2, x: 585, y: 155, icon: "museum", color: "#94a3b8" },
  { id: 3, x: 675, y: 145, icon: "coinFlow", color: "#eab308" },
  { id: 4, x: 765, y: 165, icon: "mondop", color: "#f59e0b" },
  { id: 8, x: 715, y: 255, icon: "lotusSun", color: "#38bdf8" },
  { id: 9, x: 805, y: 255, icon: "lotus", color: "#10b981" },
  { id: 10, x: 915, y: 280, icon: "stupa", color: "#64748b" },

  // แถวกลาง (มหาวิหารแก้ว & ศาลา)
  { id: 5, x: 590, y: 235, icon: "scripture", color: "#b45309" },
  { id: 6, x: 675, y: 235, icon: "pray", color: "#eab308" },
  { id: 7, x: 590, y: 295, icon: "stupa", color: "#94a3b8" },
  { id: 11, x: 630, y: 360, icon: "fish", color: "#0284c7" },
  { id: 12, x: 790, y: 350, icon: "crystal", color: "#38bdf8" },
  { id: 13, x: 960, y: 350, icon: "scripture", color: "#78350f" },
  { id: 14, x: 900, y: 410, icon: "utensils", color: "#ea580c" },
  { id: 15, x: 730, y: 430, icon: "scripture", color: "#d97706" },
  { id: 16, x: 820, y: 430, icon: "meditation", color: "#b45309" },

  // ฝั่งซ้าย (ฝั่งวัดเดิม & ศาลาปฏิบัติธรรม)
  { id: 17, x: 300, y: 275, icon: "scripture", color: "#991b1b" },
  { id: 18, x: 300, y: 330, icon: "house", color: "#78350f" },
  { id: 19, x: 200, y: 395, icon: "scripture", color: "#475569" },
  { id: 20, x: 300, y: 415, icon: "navTemple", color: "#d4a843" },
  { id: 21, x: 375, y: 365, icon: "scripture", color: "#b45309" },
  { id: 22, x: 375, y: 415, icon: "scripture", color: "#78350f" },
  { id: 23, x: 430, y: 295, icon: "scripture", color: "#92400e" },
  { id: 24, x: 465, y: 340, icon: "scripture", color: "#b45309" },

  // โซนสวนป่าไผ่ & อนุสาวรีย์
  { id: 25, x: 475, y: 415, icon: "lotus", color: "#16a34a" },
  { id: 26, x: 565, y: 410, icon: "stupa", color: "#ca8a04" },
  { id: 27, x: 565, y: 460, icon: "pray", color: "#eab308" },
  { id: 28, x: 645, y: 450, icon: "stupa", color: "#94a3b8" },
  { id: 29, x: 605, y: 490, icon: "stupa", color: "#0284c7" },
  { id: 39, x: 650, y: 535, icon: "scripture", color: "#b45309" },

  // โซนริมแม่น้ำสะแกกรัง & วัดเก่า
  { id: 30, x: 380, y: 475, icon: "fiveBuddhas", color: "#94a3b8" },
  { id: 31, x: 340, y: 555, icon: "utensils", color: "#b45309" },
  { id: 32, x: 420, y: 565, icon: "oldTemple", color: "#78350f" },
  { id: 33, x: 330, y: 625, icon: "fish", color: "#0284c7" },
  { id: 34, x: 450, y: 505, icon: "mondop", color: "#e2e8f0" },
  { id: 35, x: 530, y: 505, icon: "fourKings", color: "#f59e0b" },
  { id: 36, x: 480, y: 560, icon: "oldTemple", color: "#b91c1c" },
  { id: 37, x: 560, y: 555, icon: "house", color: "#64748b" },
  { id: 38, x: 510, y: 605, icon: "tenthBuddha", color: "#f59e0b" },
  { id: 40, x: 260, y: 645, icon: "fish", color: "#0369a1" },
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
          <span>ผังวัดท่าซุง ยินดีต้อนรับ ({places.length} จุด)</span>
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
          viewBox="0 0 1150 720"
          className="master-map-svg"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="groundGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dfcaad" />
              <stop offset="100%" stopColor="#cfb594" />
            </linearGradient>

            <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.25" />
            </filter>

            <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* 1. Base Temple Territory Island Shape (ตามป้ายจริง) */}
          <path
            d="M 120,400 
               Q 180,260 300,240 
               L 420,180 
               Q 480,100 620,100 
               L 750,110 
               Q 880,120 950,220 
               L 1060,340 
               Q 1100,420 1020,480 
               L 920,530 
               Q 820,560 760,560 
               L 660,600 
               Q 520,620 400,620 
               L 280,590 
               Q 180,560 120,400 Z"
            fill="url(#groundGrad)"
            stroke="#927252"
            strokeWidth="3"
            filter="url(#mapShadow)"
          />

          {/* 2. Green Hill behind Prasat Thong Kham (ทิศตะวันตกเฉียงเหนือ) */}
          <path
            d="M 330,240 Q 400,140 480,140 L 490,200 Z"
            fill="#65a30d"
            opacity="0.85"
          />
          {/* Green tree clusters */}
          <circle cx="360" cy="180" r="14" fill="#3f6212" />
          <circle cx="390" cy="170" r="16" fill="#4d7c0f" />
          <circle cx="420" cy="180" r="15" fill="#3f6212" />

          {/* 3. Sakae Krang River (แม่น้ำสะแกกรัง ด้านล่าง) */}
          <path
            d="M 240,650 
               C 350,670 480,680 620,650 
               C 760,620 900,600 1060,560 
               L 1060,690 
               C 850,710 650,710 400,700 
               L 240,690 Z"
            fill="url(#riverGrad)"
            stroke="#0284c7"
            strokeWidth="2"
          />
          <text x="520" y="682" fill="#ffffff" fontSize="13" fontWeight="700" letterSpacing="2">
            แม่น้ำสะแกกรัง ~ วังมัจฉา
          </text>

          {/* 4. Ponds (สระน้ำ) */}
          {/* สระน้ำตึกกลางน้ำ (Place 11) */}
          <rect x="610" y="345" width="60" height="40" rx="10" fill="#67e8f9" stroke="#0284c7" strokeWidth="2" />
          {/* สระน้ำสวนสมเด็จ (Place 9) */}
          <path d="M 780,240 Q 820,220 860,250 Q 840,280 800,270 Z" fill="#67e8f9" stroke="#0284c7" strokeWidth="1.5" />

          {/* 5. Main Road Network (โครงข่ายถนนลาดยางสีเข้ม) */}
          {/* ถนนสายหลักล่าง */}
          <path
            d="M 180,480 
               L 360,490 
               L 420,530 
               L 560,530 
               L 720,500 
               L 920,490 
               L 1060,470"
            fill="none"
            stroke="#334155"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* เส้นปะกึ่งกลางถนน */}
          <path
            d="M 180,480 L 360,490 L 420,530 L 560,530 L 720,500 L 920,490 L 1060,470"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="6,8"
          />

          {/* ถนนเลี้ยวขึ้นฝั่งวัดใหม่ */}
          <path
            d="M 420,530 L 420,240 L 820,240"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinejoin="round"
          />
          <path
            d="M 420,530 L 420,240 L 820,240"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="6,8"
          />

          {/* ถนนแยกไปปราสาททองคำ */}
          <path
            d="M 420,240 L 420,180 L 720,180"
            fill="none"
            stroke="#334155"
            strokeWidth="10"
            strokeLinejoin="round"
          />

          {/* ลูกศรบอกทิศทางบนถนน */}
          <text x="140" y="475" fill="#1e293b" fontSize="12" fontWeight="700">← ไป มโนรมย์</text>
          <text x="1000" y="455" fill="#1e293b" fontSize="12" fontWeight="700">ไป อุทัยธานี →</text>

          {/* 6. Illustrated Building Badges & Pins for all 40 places */}
          {SIGNBOARD_LOCATIONS.map((loc) => {
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

                {/* Building Base / Pavilion Representation */}
                <rect
                  x="-16"
                  y="-14"
                  width="32"
                  height="28"
                  rx="6"
                  fill={isSelected ? "#1e293b" : isHighlight ? "#fef3c7" : "#ffffff"}
                  stroke={isSelected ? "#2563eb" : isHighlight ? "#d4a843" : "#cbd5e1"}
                  strokeWidth={isSelected ? "2.5" : "1.8"}
                  filter="url(#mapShadow)"
                />

                {/* Number Badge (ป้ายตัวเลขสีทองตรงตามป้ายวัด) */}
                <circle
                  cx="12"
                  cy="-12"
                  r="10"
                  fill={isHighlight ? "#d4a843" : "#475569"}
                  stroke="#ffffff"
                  strokeWidth="1.8"
                />
                <text
                  x="12"
                  y="-8.5"
                  fill="#ffffff"
                  fontSize="9.5"
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
                  {loc.id === 1 ? "🏰" : loc.id === 12 ? "✨" : loc.id === 3 ? "🙏" : loc.id === 33 ? "🐟" : loc.id === 25 ? "🎋" : "🏛️"}
                </text>

                {/* Place Name Label */}
                <rect
                  x="-45"
                  y="17"
                  width="90"
                  height="16"
                  rx="3"
                  fill={isSelected ? "#2563eb" : "rgba(255,255,255,0.92)"}
                  stroke={isSelected ? "#1d4ed8" : "rgba(0,0,0,0.12)"}
                  strokeWidth="0.8"
                />
                <text
                  x="0"
                  y="29"
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
