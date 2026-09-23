// Custom SVG Icon Components — Minimal, Temple-toned
// Colors: Gold (#D4A843), Brown (#5C3A1E), Dark Brown (#3D1F00), Saffron (#E87A00)

const icons = {
  // ===== สถานที่ 16 จุด =====
  crystal: (
    <g>
      <polygon points="12,2 20,9 17,22 7,22 4,9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="2" x2="7" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <line x1="12" y1="2" x2="17" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </g>
  ),
  palace: (
    <g>
      <path d="M12 2L14 6H10L12 2Z" fill="currentColor"/>
      <rect x="9" y="6" width="6" height="3" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="7" y="9" width="10" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="5" y="13" width="14" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="4" y="17" width="16" height="3" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="6" x2="12" y2="9" stroke="currentColor" strokeWidth="1"/>
    </g>
  ),
  pray: (
    <g>
      <path d="M12 3C12 3 8 8 8 12C8 15 10 17 12 21" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 3C12 3 16 8 16 12C16 15 14 17 12 21" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </g>
  ),
  mondop: (
    <g>
      <path d="M12 3L15 8H9L12 3Z" fill="currentColor" opacity="0.8"/>
      <rect x="7" y="8" width="10" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="13" width="4" height="5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="7" y1="18" x2="17" y2="18" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="5" y="18" width="14" height="3" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  lotusSun: (
    <g>
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const r1 = 6, r2 = 9;
        const rad = a * Math.PI / 180;
        return <line key={i} x1={12+r1*Math.cos(rad)} y1={12+r1*Math.sin(rad)} x2={12+r2*Math.cos(rad)} y2={12+r2*Math.sin(rad)} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>;
      })}
    </g>
  ),
  scripture: (
    <g>
      <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 6C4 6 8 8 12 6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <path d="M12 6C12 6 16 8 20 6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <line x1="7" y1="10" x2="10" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <line x1="14" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7" y1="13" x2="10" y2="13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <line x1="14" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </g>
  ),
  stupa: (
    <g>
      <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="12" cy="6" rx="2" ry="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 10Q12 6 16 10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="8" y="10" width="8" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="6" y="15" width="12" height="3" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="5" y="18" width="14" height="3" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  oldTemple: (
    <g>
      <path d="M12 3L20 9H4L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="4" y="9" width="16" height="2" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="7" y1="11" x2="7" y2="19" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="11" y1="11" x2="11" y2="19" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="13" y1="11" x2="13" y2="19" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="17" y1="11" x2="17" y2="19" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="19" width="18" height="2" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  lotus: (
    <g>
      <path d="M12 20C12 20 12 14 12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 11C10 7 6 5 4 6C6 8 8 11 12 11Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1"/>
      <path d="M12 11C14 7 18 5 20 6C18 8 16 11 12 11Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1"/>
      <path d="M12 8C11 5 9 3 7 3C8 5 10 8 12 8Z" fill="currentColor" opacity="0.5" stroke="currentColor" strokeWidth="1"/>
      <path d="M12 8C13 5 15 3 17 3C16 5 14 8 12 8Z" fill="currentColor" opacity="0.5" stroke="currentColor" strokeWidth="1"/>
      <path d="M12 6C12 4 12 2 12 2C12 2 12 4 12 6Z" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
    </g>
  ),
  footprint: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      {[0,90,180,270].map((a,i) => {
        const rad = a * Math.PI / 180;
        return <circle key={i} cx={12+6*Math.cos(rad)} cy={12+6*Math.sin(rad)} r="1.2" fill="currentColor"/>;
      })}
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </g>
  ),
  fish: (
    <g>
      <path d="M3 12C3 12 7 6 14 8C16 4 20 6 21 8C22 10 21 14 19 15C18 18 14 19 12 16C7 18 3 12 3 12Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="17" cy="10" r="1" fill="currentColor"/>
      <path d="M2 12L5 9L5 15L2 12Z" fill="currentColor" opacity="0.4"/>
    </g>
  ),

  // ===== Bottom Navigation =====
  navTemple: (
    <g>
      <path d="M12 3L20 10H4L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <rect x="6" y="10" width="12" height="10" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="10" y="14" width="4" height="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  navMap: (
    <g>
      <path d="M3 5L9 3V19L3 21V5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 3L15 5V21L9 19V3Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M15 5L21 3V19L15 21V5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </g>
  ),
  navRoute: (
    <g>
      <circle cx="6" cy="19" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="18" cy="5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 16.5C6 12 10 12 12 12C14 12 18 12 18 7.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  navDharma: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const rad = a * Math.PI / 180;
        return <line key={i} x1={12+3*Math.cos(rad)} y1={12+3*Math.sin(rad)} x2={12+9*Math.cos(rad)} y2={12+9*Math.sin(rad)} stroke="currentColor" strokeWidth="1.2"/>;
      })}
    </g>
  ),
  navInfo: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="7.5" r="1.2" fill="currentColor"/>
    </g>
  ),

  // ===== UI Icons =====
  shirt: (
    <g>
      <path d="M8 3L4 6V10L7 9V21H17V9L20 10V6L16 3H14L12 5L10 3H8Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </g>
  ),
  pants: (
    <g>
      <path d="M6 3H18V10L15 21H13L12 12L11 21H9L6 10V3Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </g>
  ),
  shoe: (
    <g>
      <path d="M3 16H21V19C21 20 20 21 19 21H5C4 21 3 20 3 19V16Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 16V10C5 8 7 6 9 6H11C13 6 14 8 14 10V12H19C20 12 21 14 21 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </g>
  ),
  colorTone: (
    <g>
      <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.7"/>
      <circle cx="16" cy="8" r="3" fill="currentColor" opacity="0.5"/>
      <circle cx="12" cy="15" r="3" fill="currentColor" opacity="0.3"/>
    </g>
  ),
  utensils: (
    <g>
      <path d="M7 3V11C7 13 9 14 9 14V21" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 3V11C11 13 9 14 9 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="3" x2="9" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 3V9C17 11 16 12 15 12H17V21" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
  coffee: (
    <g>
      <rect x="4" y="6" width="13" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M17 9H19C20 9 21 10 21 11.5C21 13 20 14 19 14H17" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="3" y1="20" x2="18" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 4V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M11" y1="3" x2="11" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M14 4V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </g>
  ),
  house: (
    <g>
      <path d="M3 11L12 4L21 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="5" y="11" width="14" height="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="15" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    </g>
  ),
  phone: (
    <g>
      <path d="M5 4C5 3 6 2 7 2H17C18 2 19 3 19 4V20C19 21 18 22 17 22H7C6 22 5 21 5 20V4Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="10" y1="19" x2="14" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  globe: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="currentColor" strokeWidth="1"/>
      <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1"/>
      <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="1"/>
    </g>
  ),
  play: (
    <g>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <polygon points="10,8 10,16 16,12" fill="currentColor"/>
    </g>
  ),
  social: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 3C10 7 10 9 10 12C10 15 10 17 12 21" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7 6H17" stroke="currentColor" strokeWidth="1"/>
      <path d="M5 12H19" stroke="currentColor" strokeWidth="1"/>
      <path d="M7 18H17" stroke="currentColor" strokeWidth="1"/>
    </g>
  ),
  clock: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="12" x2="16" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </g>
  ),
  pin: (
    <g>
      <path d="M12 2C8 2 5 5 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5 16 2 12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  meditation: (
    <g>
      <circle cx="12" cy="5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 11L12 13L16 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 19C7 16 9 14 12 14C15 14 17 16 17 19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 21H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  sparkle: (
    <g>
      <path d="M12 2L14 9L21 7L16 12L21 17L14 15L12 22L10 15L3 17L8 12L3 7L10 9L12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </g>
  ),
  quiet: (
    <g>
      <circle cx="12" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="13" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <line x1="10" y1="6" x2="10" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="14" y1="6" x2="14" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 9.5Q12 11 15 9.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    </g>
  ),
  noEntry: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  camera: (
    <g>
      <rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="14" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 7L9 4H15L16 7" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  clean: (
    <g>
      <path d="M8 3H16L17 7H7L8 3Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="6" y="7" width="12" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="10" y1="10" x2="10" y2="18" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="14" y1="10" x2="14" y2="18" stroke="currentColor" strokeWidth="1.2"/>
    </g>
  ),
  meal: (
    <g>
      <circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1"/>
      <path d="M12 5V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M9 6V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M15 6V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </g>
  ),
  dressCode: (
    <g>
      <path d="M8 2L4 5V9L7 8V20H17V8L20 9V5L16 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 2C8 2 10 4 12 4C14 4 16 2 16 2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </g>
  ),
  check: (
    <g>
      <path d="M5 12L10 17L19 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
  arrowRight: (
    <g>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 7L19 12L14 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
  // ===== สถานที่ใหม่ 5 จุด =====
  coinFlow: (
    <g>
      <circle cx="12" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="12" y="13" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">฿</text>
      <path d="M8 18L10 16L12 18L14 16L16 18" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 21L9 19L11 21L13 19L15 21L17 19" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </g>
  ),
  fourKings: (
    <g>
      <rect x="3" y="8" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 3L15 8H9L12 3Z" fill="currentColor" opacity="0.6"/>
      <line x1="8" y1="8" x2="8" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="16" y1="8" x2="16" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <circle cx="6" cy="14" r="1.5" fill="currentColor" opacity="0.5"/>
      <circle cx="12" cy="14" r="1.5" fill="currentColor" opacity="0.5"/>
      <circle cx="18" cy="14" r="1.5" fill="currentColor" opacity="0.5"/>
      <circle cx="9" cy="14" r="1.5" fill="currentColor" opacity="0.5"/>
    </g>
  ),
  museum: (
    <g>
      <path d="M4 10L12 4L20 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="4" y="10" width="16" height="2" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="7" y1="12" x2="7" y2="18" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="12" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="17" y1="12" x2="17" y2="18" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="18" width="18" height="3" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  tenthBuddha: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold">10</text>
    </g>
  ),
  fiveBuddhas: (
    <g>
      <circle cx="12" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="5" cy="13" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="19" cy="13" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="20" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="17" cy="20" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="12" y1="9" x2="5" y2="13" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      <line x1="12" y1="9" x2="19" y2="13" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      <line x1="5" y1="15.5" x2="7" y2="17.5" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      <line x1="19" y1="15.5" x2="17" y2="17.5" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
    </g>
  ),
  gallery: (
    <g>
      <rect x="3" y="5" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="7" y="7" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="11" r="2" fill="currentColor" opacity="0.4"/>
      <path d="M7 17L11 13L14 16L17 14L21 17" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
  quote: (
    <g>
      <path d="M4 12C4 8 7 5 10 5V8C8 8 7 10 7 12H10V19H4V12Z" fill="currentColor" opacity="0.6"/>
      <path d="M14 12C14 8 17 5 20 5V8C18 8 17 10 17 12H20V19H14V12Z" fill="currentColor" opacity="0.6"/>
    </g>
  ),
};

export default function Icon({ name, size = 24, color, className = "", style = {} }) {
  const svgContent = icons[name];
  if (!svgContent) return <span>{name}</span>;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={`icon ${className}`}
      style={{ color: color || "currentColor", flexShrink: 0, ...style }}
    >
      {svgContent}
    </svg>
  );
}

// Icon name mapping for data files
export const placeIcons = {
  1: "crystal",
  2: "palace",
  3: "pray",
  4: "mondop",
  5: "lotusSun",
  6: "scripture",
  7: "stupa",
  8: "oldTemple",
  9: "lotus",
  10: "footprint",
  11: "fish",
  12: "coinFlow",
  13: "fourKings",
  14: "museum",
  15: "tenthBuddha",
  16: "fiveBuddhas",
};

export const navIcons = {
  home: "navTemple",
  map: "navMap",
  tour: "navRoute",
  dharma: "navDharma",
  info: "navInfo",
};
