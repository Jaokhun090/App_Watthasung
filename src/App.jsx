import { useState, useEffect } from "react";
import {
  places,
  zones,
  dressCode,
  walkingTour,
  templeInfo,
  templeRules,
  restaurants,
  accommodations,
} from "./data/places";
import { monkHistory, prayer, manomaiyiddhi, teachings } from "./data/dharma";
import { getOpenStatus, getGoogleMapsUrl, getTelUrl } from "./utils";
import Icon, { placeIcons } from "./components/Icons";
import { useUserLocation } from "./hooks/useUserLocation";
import DigitalTwin3D from "./components/DigitalTwin3D";
import InteractiveMasterMap from "./components/InteractiveMasterMap";
import SideDetailDrawer from "./components/SideDetailDrawer";

// ===== Bottom Navigation (4 Tabs: หน้าแรก, เที่ยวชม, ธรรมะ, ข้อมูล) =====
function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "home", iconName: "home", label: "หน้าแรก" },
    { id: "explore", iconName: "compass", label: "เที่ยวชม" },
    { id: "dharma", iconName: "navDharma", label: "ธรรมะ" },
    { id: "info", iconName: "navInfo", label: "ข้อมูล" },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            className={`nav-item ${isActive ? "nav-item--active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
          >
            <span className="nav-item__icon">
              <Icon name={tab.iconName} size={22} color={isActive ? "var(--brown-deep)" : "currentColor"} />
            </span>
            <span className="nav-item__label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ===== Photo Gallery Lightbox =====
function PhotoLightbox({ photos, placeName, onClose }) {
  const [idx, setIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setIdx((i) => (i - 1 + photos.length) % photos.length);
        setImgLoaded(false);
        setImgError(false);
      }
      if (e.key === "ArrowRight") {
        setIdx((i) => (i + 1) % photos.length);
        setImgLoaded(false);
        setImgError(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photos.length, onClose]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox__header">
          <div className="lightbox__title">
            <Icon name="gallery" size={16} color="var(--gold)" /> {placeName}
          </div>
          <button id="lightbox-close" type="button" className="lightbox__close" onClick={onClose} aria-label="ปิด">✕</button>
        </div>
        <div className="lightbox__img-wrap">
          {!imgLoaded && !imgError && (
            <div style={{ color: "var(--gold)", fontSize: "0.85rem" }}>กำลังโหลดรูปภาพ...</div>
          )}
          {imgError && (
            <div style={{ color: "var(--brown-light)", fontSize: "0.85rem", textAlign: "center", padding: 20 }}>
              <Icon name="camera" size={32} color="var(--gold)" />
              <div style={{ marginTop: 8 }}>ไม่สามารถโหลดภาพได้ในขณะนี้</div>
            </div>
          )}
          <img
            src={photos[idx]}
            alt={`${placeName} ${idx + 1}`}
            className="lightbox__img"
            referrerPolicy="no-referrer"
            style={{ display: imgLoaded ? "block" : "none" }}
            onLoad={() => { setImgLoaded(true); setImgError(false); }}
            onError={() => { setImgLoaded(false); setImgError(true); }}
          />
        </div>
        {photos.length > 1 && (
          <div className="lightbox__nav">
            <button
              id="lightbox-prev"
              type="button"
              className="lightbox__btn"
              onClick={() => {
                setIdx((i) => (i - 1 + photos.length) % photos.length);
                setImgLoaded(false);
                setImgError(false);
              }}
              title="รูปก่อนหน้า"
            >
              ‹
            </button>
            <span className="lightbox__counter">{idx + 1} / {photos.length}</span>
            <button
              id="lightbox-next"
              type="button"
              className="lightbox__btn"
              onClick={() => {
                setIdx((i) => (i + 1) % photos.length);
                setImgLoaded(false);
                setImgError(false);
              }}
              title="รูปถัดไป"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Place Card Component =====
function PlaceCard({ place, distanceFormatted }) {
  const [expanded, setExpanded] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const status = getOpenStatus(place.openingHours);
  const iconName = placeIcons[place.id] || "navTemple";
  const hasPhotos = place.photos && place.photos.length > 0;

  const formatHours = (hours) => {
    if (!hours) return null;
    if (hours.allDay)
      return (
        <div className="place-card__hours">
          <strong><Icon name="clock" size={13} style={{ verticalAlign: "middle", marginRight: 4 }} /> เวลาเปิด:</strong> {hours.allDay.open} - {hours.allDay.close} น.
        </div>
      );
    return (
      <div className="place-card__hours">
        <strong><Icon name="clock" size={13} style={{ verticalAlign: "middle", marginRight: 4 }} /> เวลาเปิด:</strong>
        <br />
        รอบเช้า: {hours.morning?.open} - {hours.morning?.close} น.
        {hours.afternoon && (
          <>
            <br />
            รอบบ่าย: {hours.afternoon.open} - {hours.afternoon.close} น.
          </>
        )}
        {hours.note && (
          <>
            <br />
            <span style={{ fontSize: "0.72rem", color: "var(--gray)" }}>{hours.note}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`place-card ${place.highlight ? "place-card--highlight" : ""} ${expanded ? "place-card--expanded" : ""}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="place-card__header">
          <div className="place-card__emoji">
            <Icon name={iconName} size={26} color="var(--gold-dark)" />
          </div>
          <div className="place-card__info">
            <div className="place-card__name">
              <span style={{ color: "var(--gold-dark)", marginRight: 5, fontSize: "0.85em", fontWeight: 700 }}>
                {place.id}.
              </span>
              {place.name}
            </div>

            {/* แสดงชื่อเรียกทั่วไปเฉพาะเมื่อมีข้อมูล และไม่เป็นค่าว่าง */}
            {place.altName && place.altName.trim() !== "" && (
              <div className="place-card__altname">
                <span className="place-card__altname-badge">ชื่อเรียกทั่วไป</span>
                <span>{place.altName}</span>
              </div>
            )}

            {/* แสดงระยะห่างจากตำแหน่งปัจจุบัน (GPS) */}
            {distanceFormatted && (
              <div className="place-card__distance">
                <Icon name="pin" size={12} color="#2563eb" />
                <span>ห่างจากคุณ {distanceFormatted}</span>
              </div>
            )}

            {status.isOpen !== null && (
              <span
                className={`place-card__status ${
                  status.isOpen ? "place-card__status--open" : "place-card__status--closed"
                }`}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: status.isOpen ? "var(--green)" : "var(--red)",
                    display: "inline-block",
                  }}
                />
                {status.label} {status.countdown && `(${status.countdown})`}
              </span>
            )}
            {status.isOpen === null && (
              <span className="place-card__status place-card__status--na">เปิดตลอด</span>
            )}
          </div>
          <span className="place-card__chevron">{expanded ? "▲" : "▼"}</span>
        </div>

        <div className="place-card__details">
          <p className="place-card__desc">{place.description}</p>
          {formatHours(place.openingHours)}
          {place.tips && <p className="place-card__tip">{place.tips}</p>}
          <div className="place-card__actions">
            <a
              href={getGoogleMapsUrl(place.gps.lat, place.gps.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="pin" size={14} /> นำทาง
            </a>
            {hasPhotos && (
              <button
                className="btn btn--secondary"
                onClick={(e) => { e.stopPropagation(); setShowGallery(true); }}
              >
                <Icon name="gallery" size={14} /> ดูรูป ({place.photos.length})
              </button>
            )}
          </div>
        </div>
      </div>
      {showGallery && (
        <PhotoLightbox
          photos={place.photos}
          placeName={place.name}
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
}

// ===== 1. HOME PAGE (หน้าแรก - ศูนย์รวมแนะนำทุกหัวข้อ พร้อมปุ่มกดดูทั้งหมด) =====
function HomePage({ onNavigate, locationService }) {
  const [, setTick] = useState(0);
  const [showMapLightbox, setShowMapLightbox] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // จุดไฮไลท์ มหาวิหารแก้ว 100 เมตร (id: 12)
  const viharaKaew = places.find((p) => p.id === 12) || places[0];
  const viharaStatus = getOpenStatus(viharaKaew.openingHours);
  const isOpen = viharaStatus.isOpen;

  // รายการสถานที่ไฮไลท์แนะนำสำหรับหน้า Home (5 จุดเด่น)
  const featuredPlaces = places.filter((p) => p.highlight).slice(0, 5);

  return (
    <div className="page">
      {/* Status Hero - มหาวิหารแก้ว 100 เมตร */}
      <div className="status-hero">
        <div className="status-hero__header">
          <div className={`status-hero__dot ${isOpen ? "status-hero__dot--open" : "status-hero__dot--closed"}`} />
          <div>
            <div className="status-hero__title">
              <Icon name="crystal" size={20} color="var(--brown-deep)" style={{ verticalAlign: "middle", marginRight: 4 }} />
              {viharaKaew.name}
            </div>
            <span className={`status-hero__badge ${isOpen ? "status-hero__badge--open" : "status-hero__badge--closed"}`}>
              {isOpen ? "เปิดอยู่" : "ปิดอยู่"}
            </span>
          </div>
        </div>

        {viharaStatus.countdown && (
          <div className="status-hero__countdown">
            <Icon name="clock" size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
            {isOpen ? `ปิดอีก ${viharaStatus.countdown}` : `เปิดอีก ${viharaStatus.countdown}`}
          </div>
        )}
        {viharaStatus.session && (
          <div className="status-hero__session">{viharaStatus.session}</div>
        )}
        {!viharaStatus.countdown && !isOpen && (
          <div className="status-hero__countdown">เปิดพรุ่งนี้ รอบเช้า 09:00 น.</div>
        )}

        {/* แถบแจ้งเตือนระยะห่าง GPS จากตัวผู้ใช้ */}
        {locationService.userLocation ? (
          <div style={{ marginTop: 10, fontSize: "0.75rem", color: "#1d4ed8", background: "#eff6ff", padding: "4px 10px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", display: "inline-block" }}></span>
            <span>
              {locationService.isInsideTemple
                ? "คุณกำลังอยู่ในบริเวณวัดท่าซุง"
                : `คุณอยู่ห่างจากวัดท่าซุง ~${locationService.formattedDistanceToTemple}`}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={locationService.toggleTracking}
            style={{ marginTop: 8, background: "none", border: "none", color: "var(--gold-dark)", fontSize: "0.75rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "underline" }}
          >
            <Icon name="pin" size={12} /> แตะเพื่อเปิด GPS ระบุตำแหน่งปัจจุบัน
          </button>
        )}
      </div>

      {/* ทางลัดเมนูด่วน 4 หัวข้อหลัก */}
      <div className="quick-shortcuts">
        <div className="shortcut-card" onClick={() => onNavigate("explore", "places")}>
          <div className="shortcut-card__icon">
            <Icon name="navTemple" size={20} />
          </div>
          <span className="shortcut-card__label">39 สถานที่</span>
        </div>

        <div className="shortcut-card" onClick={() => onNavigate("explore", "map")}>
          <div className="shortcut-card__icon">
            <Icon name="compass" size={20} />
          </div>
          <span className="shortcut-card__label">แผนที่ & 3D</span>
        </div>

        <div className="shortcut-card" onClick={() => onNavigate("explore", "tour")}>
          <div className="shortcut-card__icon">
            <Icon name="navRoute" size={20} />
          </div>
          <span className="shortcut-card__label">เส้นทาง 3 ชม.</span>
        </div>

        <div className="shortcut-card" onClick={() => onNavigate("dharma")}>
          <div className="shortcut-card__icon">
            <Icon name="navDharma" size={20} />
          </div>
          <span className="shortcut-card__label">คาถาเงินล้าน</span>
        </div>
      </div>

      {/* หมวดที่ 1: สถานที่ไฮไลท์แนะนำ */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__title">
            <Icon name="sparkle" size={18} color="var(--gold-dark)" />
            สถานที่ไฮไลท์แนะนำ
          </div>
          <button
            type="button"
            className="home-section__more-btn"
            onClick={() => onNavigate("explore", "places")}
          >
            ดูทั้งหมด 39 จุด <Icon name="arrowRight" size={12} />
          </button>
        </div>

        {featuredPlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            distanceFormatted={locationService.getFormattedDistanceTo(place.gps.lat, place.gps.lng)}
          />
        ))}

        <button
          type="button"
          className="btn btn--secondary"
          style={{ width: "100%", marginTop: "var(--space-xs)", justifyContent: "center" }}
          onClick={() => onNavigate("explore", "places")}
        >
          <Icon name="compass" size={16} /> ดูสถานที่ทั้งหมดตามผังวัด (39 จุด)
        </button>
      </section>

      {/* หมวดที่ 2: แผนที่ Live GPS & โมเดล 3D Digital Twin */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__title">
            <Icon name="navMap" size={18} color="var(--gold-dark)" />
            ผังวัดดิจิทัล & 3D Digital Twin
          </div>
          <button
            type="button"
            className="home-section__more-btn"
            onClick={() => onNavigate("explore", "map")}
          >
            เปิดแผนที่เต็ม <Icon name="arrowRight" size={12} />
          </button>
        </div>

        <div className="map-signboard-card" onClick={() => onNavigate("explore", "map")}>
          <div className="map-signboard-card__img-wrap">
            <img
              src={templeInfo.mapSignboardImg}
              alt="แผนที่ผังวัดท่าซุง"
              className="map-signboard-card__img"
              loading="lazy"
            />
            <div className="map-signboard-card__badge">
              <Icon name="navMap" size={14} color="#38bdf8" /> ผังวัดดิจิทัล & โมเดล 3D Twin
            </div>
            <div className="map-signboard-card__zoom-hint">
              <Icon name="navMap" size={13} /> แตะเพื่อเข้าสู่ระบบแผนที่
            </div>
          </div>
          <div className="map-signboard-card__footer">
            <div className="map-signboard-card__desc">
              เลือกดูได้ 2 รูปแบบ: ผังวัดดิจิทัล (วาดใหม่ตามป้ายจริง 39 จุด) และโมเดล 3D Digital Twin สไตล์สถาปัตยกรรม
            </div>
            <button
              type="button"
              className="btn btn--primary"
              style={{ fontSize: "0.72rem", padding: "6px 12px", flexShrink: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate("explore", "map");
              }}
            >
              เปิดดูผัง
            </button>
          </div>
        </div>
      </section>

      {/* หมวดที่ 3: เส้นทางท่องเที่ยวแนะนำ */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__title">
            <Icon name="navRoute" size={18} color="var(--gold-dark)" />
            เส้นทางแนะนำ 1 วัน (3 ชม.)
          </div>
          <button
            type="button"
            className="home-section__more-btn"
            onClick={() => onNavigate("explore", "tour")}
          >
            ดูเส้นทางเต็ม <Icon name="arrowRight" size={12} />
          </button>
        </div>

        <div className="tour-preview-card">
          <div className="tour-preview-list">
            {walkingTour.slice(0, 3).map((step) => {
              const place = places.find((p) => p.id === step.placeId);
              return (
                <div key={step.step} className="tour-preview-item">
                  <div className="tour-preview-badge">{step.step}</div>
                  <div className="tour-preview-name">{place ? place.name : step.name}</div>
                  <div className="tour-preview-time">{step.time} น.</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--brown)", borderTop: "1px dashed var(--cream-dark)", paddingTop: 8, marginTop: 4 }}>
            รวมทั้งหมด 8 จุดท่องเที่ยวสำคัญ พร้อมจุดพักรับประทานอาหารปลาแม่น้ำสะแกกรัง
          </div>
          <button
            type="button"
            className="btn btn--secondary"
            style={{ width: "100%", marginTop: "var(--space-sm)", justifyContent: "center", fontSize: "0.75rem" }}
            onClick={() => onNavigate("explore", "tour")}
          >
            <Icon name="navRoute" size={14} /> เปิดดูเส้นทางเดินชมทีละสเต็ป
          </button>
        </div>
      </section>

      {/* หมวดที่ 4: พระคาถาเงินล้าน & ธรรมะ */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__title">
            <Icon name="lotus" size={18} color="var(--gold-dark)" />
            พระคาถาเงินล้าน & ธรรมะ
          </div>
          <button
            type="button"
            className="home-section__more-btn"
            onClick={() => onNavigate("dharma")}
          >
            อ่านทั้งหมด <Icon name="arrowRight" size={12} />
          </button>
        </div>

        <div className="prayer-box" style={{ padding: "var(--space-md)" }}>
          <div className="prayer-box__title" style={{ fontSize: "1rem" }}>{prayer.name}</div>
          <div className="prayer-box__preamble" style={{ fontSize: "0.74rem" }}>{prayer.origin}</div>
          <div className="prayer-box__namo" style={{ fontSize: "0.8rem", padding: "8px 12px" }}>
            <strong>{prayer.preamble.title}</strong> (สวด 3 จบ)
          </div>
          <div className="prayer-box__verse" style={{ fontSize: "0.82rem", lineHeight: 1.8 }}>
            <div>{prayer.mainPrayer[0]}</div>
            <div>{prayer.mainPrayer[1]}</div>
            <div style={{ color: "var(--gray)", fontSize: "0.75rem", fontStyle: "italic", marginTop: 4 }}>...สวดต่อจนจบบท...</div>
          </div>
          <button
            type="button"
            className="btn btn--saffron"
            style={{ width: "100%", marginTop: "var(--space-sm)", justifyContent: "center", fontSize: "0.75rem" }}
            onClick={() => onNavigate("dharma")}
          >
            <Icon name="pray" size={14} /> สวดมนต์บทเต็ม & ดูวิธีสวด
          </button>
        </div>
      </section>

      {/* หมวดที่ 5: ข้อควรทราบสำหรับผู้มาเยือน */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__title">
            <Icon name="dressCode" size={18} color="var(--gold-dark)" />
            ข้อควรทราบสำหรับผู้มาเยือน
          </div>
          <button
            type="button"
            className="home-section__more-btn"
            onClick={() => onNavigate("info")}
          >
            ดูข้อมูลทั้งหมด <Icon name="arrowRight" size={12} />
          </button>
        </div>

        <div className="dress-alert">
          <div className="dress-alert__icon">
            <Icon name="dressCode" size={28} color="var(--saffron)" />
          </div>
          <div>
            <div className="dress-alert__title">การแต่งกายสุภาพ</div>
            <ul className="dress-alert__rules">
              <li><Icon name="shirt" size={13} color="var(--brown)" style={{ verticalAlign: "middle", marginRight: 4 }} /> เสื้อมีแขน ปิดไหล่ ไม่รัดรูป</li>
              <li><Icon name="pants" size={13} color="var(--brown)" style={{ verticalAlign: "middle", marginRight: 4 }} /> กางเกง/กระโปรง ยาวคลุมเข่า</li>
              <li><Icon name="shoe" size={13} color="var(--brown)" style={{ verticalAlign: "middle", marginRight: 4 }} /> ถอดรองเท้าก่อนเข้าวิหารทุกแห่ง</li>
            </ul>
          </div>
        </div>

        <div className="travel-card" style={{ marginTop: "var(--space-sm)" }}>
          <div className="travel-card__title">
            <Icon name="phone" size={16} color="var(--gold-dark)" /> ติดต่อสอบถามวัดท่าซุง
          </div>
          <div className="travel-card__desc">
            ตึกรับแขก: <a href={getTelUrl(templeInfo.phone.general)} style={{ color: "var(--gold-dark)", fontWeight: 600 }}>{templeInfo.phone.general}</a> | ที่พักปฏิบัติธรรม: <a href={getTelUrl(templeInfo.phone.retreat)} style={{ color: "var(--gold-dark)", fontWeight: 600 }}>{templeInfo.phone.retreat}</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ===== 2. EXPLORE PAGE (เที่ยวชม: รวม สถานที่ 39 จุด + แผนที่ผังวัด + เส้นทางแนะนำ) =====
function ExplorePage({
  subView,
  onSubViewChange,
  locationService,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");
  const [sortByNearest, setSortByNearest] = useState(false);
  const [mapMode, setMapMode] = useState("masterMap"); // 'masterMap' | 'digitalTwin'
  const [selectedPlaceForMap, setSelectedPlaceForMap] = useState(null);
  const [photoModal, setPhotoModal] = useState({ isOpen: false, photos: [], placeName: "" });

  // กรองและจัดเรียงสถานที่
  let filteredPlaces = places.filter((place) => {
    const matchesZone = selectedZone === "all" || place.zone === selectedZone;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesZone;
    const matchesName = place.name.toLowerCase().includes(q);
    const matchesAltName = (place.altName || "").toLowerCase().includes(q);
    const matchesDesc = (place.description || "").toLowerCase().includes(q);
    const matchesTips = (place.tips || "").toLowerCase().includes(q);
    return matchesZone && (matchesName || matchesAltName || matchesDesc || matchesTips);
  });

  // ถ้าเลือกเรียงตามจุดที่ใกล้ที่สุด
  if (sortByNearest && locationService.userLocation) {
    filteredPlaces = [...filteredPlaces].sort((a, b) => {
      const distA = locationService.getDistanceTo(a.gps.lat, a.gps.lng) ?? 999999999;
      const distB = locationService.getDistanceTo(b.gps.lat, b.gps.lng) ?? 999999999;
      return distA - distB;
    });
  }

  return (
    <div className="page">
      {/* เมนูแท็บย่อยด้านบน: สถานที่ (39 จุด) | แผนที่ผังวัด | เส้นทางแนะนำ */}
      <div className="explore-tabs">
        <button
          type="button"
          className={`explore-tab ${subView === "places" ? "explore-tab--active" : ""}`}
          onClick={() => onSubViewChange("places")}
        >
          <Icon name="navTemple" size={16} /> สถานที่ (39 จุด)
        </button>

        <button
          type="button"
          className={`explore-tab ${subView === "map" ? "explore-tab--active" : ""}`}
          onClick={() => onSubViewChange("map")}
        >
          <Icon name="navMap" size={16} /> แผนที่
        </button>

        <button
          type="button"
          className={`explore-tab ${subView === "tour" ? "explore-tab--active" : ""}`}
          onClick={() => onSubViewChange("tour")}
        >
          <Icon name="navRoute" size={16} /> เส้นทางแนะนำ
        </button>
      </div>

      {/* ===== แท็บย่อย 1: สถานที่ (39 จุด) ===== */}
      {subView === "places" && (
        <div>
          {/* แถบค้นหา */}
          <div className="search-bar">
            <span className="search-bar__icon-left">
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อสถานที่ หรือสิ่งที่สนใจ..."
              className="search-bar__input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-bar__clear"
                onClick={() => setSearchQuery("")}
                aria-label="ล้างคำค้นหา"
              >
                ✕
              </button>
            )}
          </div>

          {/* ป้ายกรองโซน */}
          <div className="zone-filter-scroll">
            {zones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                className={`zone-pill ${selectedZone === zone.id ? "zone-pill--active" : ""}`}
                onClick={() => setSelectedZone(zone.id)}
              >
                {zone.name}
              </button>
            ))}
          </div>

          {/* แถบจัดเรียงตามระยะใกล้-ไกล (Sort by Nearest) */}
          <div className="places-sort-bar">
            <span style={{ fontSize: "0.75rem", color: "var(--brown-light)" }}>
              พบ {filteredPlaces.length} สถานที่
            </span>
            <button
              type="button"
              className={`places-sort-btn ${sortByNearest ? "places-sort-btn--active" : ""}`}
              onClick={() => {
                if (!locationService.userLocation && !sortByNearest) {
                  locationService.startTracking();
                }
                setSortByNearest(!sortByNearest);
              }}
              title="เรียงตามระยะทางจากจุดที่คุณยืนอยู่"
            >
              <Icon name="pin" size={13} color={sortByNearest ? "#2563eb" : "var(--gold-dark)"} />
              <span>{sortByNearest ? "กำลังเรียงจุดใกล้สุด ✓" : "เรียงตามจุดใกล้ฉัน"}</span>
            </button>
          </div>

          {/* รายการการ์ดสถานที่ */}
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                distanceFormatted={locationService.getFormattedDistanceTo(place.gps.lat, place.gps.lng)}
              />
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--brown)" }}>
              <Icon name="search" size={36} color="var(--gold)" />
              <div style={{ marginTop: 12, fontWeight: 600 }}>ไม่พบสถานที่ที่ตรงกับคำค้นหา</div>
              <div style={{ fontSize: "0.78rem", color: "var(--gray)", marginTop: 4 }}>
                ลองพิมพ์คำอื่น หรือกดรีเซ็ตตัวกรองด้านบน
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== แท็บย่อย 2: แผนที่ (ผังวัดดิจิทัล + โมเดล 3D Digital Twin สไตล์ Bangkok Digital Twin) ===== */}
      {subView === "map" && (
        <div className="map-view-section">
          {/* สลับ 2 โหมด: ผังวัดดิจิทัล (วาดตามป้ายจริง) vs โมเดล 3D Digital Twin */}
          <div className="map-mode-selector">
            <button
              type="button"
              className={`map-mode-btn ${mapMode === "masterMap" ? "map-mode-btn--active" : ""}`}
              onClick={() => {
                setMapMode("masterMap");
                setSelectedPlaceForMap(null);
              }}
            >
              <Icon name="navMap" size={15} color={mapMode === "masterMap" ? "var(--gold-dark)" : "currentColor"} />
              <span>ผังวัดดิจิทัล (วาดตามป้ายจริง)</span>
            </button>

            <button
              type="button"
              className={`map-mode-btn ${mapMode === "digitalTwin" ? "map-mode-btn--active" : ""}`}
              onClick={() => {
                setMapMode("digitalTwin");
                setSelectedPlaceForMap(null);
              }}
            >
              <Icon name="sparkle" size={15} color={mapMode === "digitalTwin" ? "var(--gold-dark)" : "currentColor"} />
              <span>โมเดล 3D Digital Twin</span>
            </button>
          </div>

          {/* 1. โหมดผังวัดดิจิทัล (เวกเตอร์ดิจิทัลวาดใหม่ตามป้าย 20260927_122430.jpg) */}
          {mapMode === "masterMap" && (
            <div className="master-map-wrapper">
              <InteractiveMasterMap
                selectedPlace={selectedPlaceForMap}
                onSelectPlace={(p) => setSelectedPlaceForMap(p)}
              />
              {selectedPlaceForMap && (
                <div className="bdt-drawer-overlay">
                  <SideDetailDrawer
                    place={selectedPlaceForMap}
                    onClose={() => setSelectedPlaceForMap(null)}
                    userLocation={locationService.userLocation}
                    getFormattedDistanceTo={locationService.getFormattedDistanceTo}
                    onOpenPhoto={(photos, name) =>
                      setPhotoModal({ isOpen: true, photos, placeName: name })
                    }
                    onSelectPlace={(p) => setSelectedPlaceForMap(p)}
                  />
                </div>
              )}
            </div>
          )}

          {/* 2. โหมด 3D Digital Twin (สไตล์ Bangkok Digital Twin) */}
          {mapMode === "digitalTwin" && (
            <DigitalTwin3D
              userLocation={locationService.userLocation}
              gpsStatus={locationService.gpsStatus}
              getFormattedDistanceTo={locationService.getFormattedDistanceTo}
              onSelectPlace={(place) => setSelectedPlaceForMap(place)}
              onOpenPhoto={(photos, name) =>
                setPhotoModal({ isOpen: true, photos, placeName: name })
              }
            />
          )}

          {/* Photo Modal Lightbox */}
          {photoModal.isOpen && (
            <PhotoLightbox
              photos={photoModal.photos}
              placeName={photoModal.placeName}
              onClose={() => setPhotoModal({ isOpen: false, photos: [], placeName: "" })}
            />
          )}

          {/* ข้อมูลวัดและการนำทางหลักไปยังวัดท่าซุง */}
          <div className="map-card" style={{ marginTop: "var(--space-md)" }}>
            <div className="map-card__illustration">
              <Icon name="navTemple" size={56} color="var(--gold)" />
            </div>
            <div className="map-card__desc">
              <strong>{templeInfo.name}</strong>
              <br />
              {templeInfo.address}
              <br />
              พื้นที่ {templeInfo.area} | ค่าเข้าชม: {templeInfo.admission}
            </div>
            <a
              href={getGoogleMapsUrl(templeInfo.gps.lat, templeInfo.gps.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--saffron btn--large"
            >
              <Icon name="pin" size={16} /> นำทางไปวัดท่าซุง (Google Maps)
            </a>
          </div>

          {/* วิธีเดินทาง */}
          <h2 className="page__section-title">
            <Icon name="navRoute" size={18} color="var(--gold-dark)" /> วิธีเดินทางมาวัดท่าซุง
          </h2>

          <div className="travel-card">
            <div className="travel-card__title"><Icon name="navRoute" size={16} color="var(--saffron)" /> รถส่วนตัว</div>
            <div className="travel-card__desc">
              เดินทางมายัง จ.อุทัยธานี มีป้ายบอกทางชัดเจน พื้นที่จอดรถกว้างขวางทั้งฝั่งวัดใหม่และวัดเก่า
            </div>
          </div>

          <div className="travel-card">
            <div className="travel-card__title"><Icon name="navRoute" size={16} color="var(--saffron)" /> รถสาธารณะ</div>
            <div className="travel-card__desc">
              นั่งรถตู้/รถโดยสารมาลงที่ บขส.อุทัยธานี ต่อรถสองแถว มอเตอร์ไซค์รับจ้าง หรือสามล้อเข้าวัด (ห่างประมาณ 7 กม.)
            </div>
          </div>

          <div className="travel-card">
            <div className="travel-card__title"><Icon name="navRoute" size={16} color="var(--saffron)" /> รถรางในวัด</div>
            <div className="travel-card__desc">
              มีบริการรถรางนำชมรอบบริเวณวัด ค่าบริการประมาณ 10 บาท ช่วยประหยัดแรงเพราะพื้นที่วัดกว้างกว่า 510 ไร่
            </div>
          </div>
        </div>
      )}

      {/* ===== แท็บย่อย 3: เส้นทางแนะนำ ===== */}
      {subView === "tour" && (
        <div>
          <p style={{ fontSize: "0.82rem", color: "var(--brown)", marginBottom: "var(--space-md)", lineHeight: 1.6 }}>
            เส้นทางเดินชมวัดท่าซุงแบบจัดเต็ม ใช้เวลาประมาณ <strong>3 ชั่วโมง</strong> เรียงลำดับตามเวลาเปิดของแต่ละวิหาร
          </p>

          {walkingTour.map((step) => {
            const place = step.placeId ? places.find((p) => p.id === step.placeId) : null;
            const iconName = place ? (placeIcons[place.id] || "navTemple") : "utensils";
            const dist = place ? locationService.getFormattedDistanceTo(place.gps.lat, place.gps.lng) : null;

            return (
              <div key={step.step} className="tour-step">
                <div className="tour-step__number">{step.step}</div>
                <div className="tour-step__content">
                  <div className="tour-step__header">
                    <div className="tour-step__name">
                      <Icon name={iconName} size={16} color="var(--gold-dark)" style={{ verticalAlign: "middle", marginRight: 4 }} />
                      {place ? place.name : step.name}
                    </div>
                    <span className="tour-step__time">{step.time} น.</span>
                  </div>
                  <div className="tour-step__duration">
                    <Icon name="clock" size={12} style={{ verticalAlign: "middle", marginRight: 3 }} /> {step.duration}
                    {dist && (
                      <span style={{ marginLeft: 10, color: "#2563eb", fontWeight: 600 }}>
                        📍 ห่าง {dist}
                      </span>
                    )}
                  </div>
                  <div className="tour-step__tip">{step.tip}</div>
                  {place && (
                    <a
                      href={getGoogleMapsUrl(place.gps.lat, place.gps.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary"
                      style={{ marginTop: "var(--space-sm)", fontSize: "0.72rem" }}
                    >
                      <Icon name="pin" size={12} /> นำทางไปจุดนี้
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== 3. DHARMA PAGE (ธรรมะ & ประวัติ) =====
function DharmaPage() {
  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <div className="page">
      <h1 className="page__title">
        <Icon name="navDharma" size={22} color="var(--gold-dark)" /> ธรรมะ & ประวัติ
      </h1>

      {/* Monk Bio */}
      <div className="monk-card">
        {monkHistory.photo ? (
          <img
            src={monkHistory.photo}
            alt={monkHistory.name}
            className="monk-card__avatar"
            referrerPolicy="no-referrer"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="monk-card__emoji">
            <Icon name="pray" size={48} color="var(--gold)" />
          </div>
        )}
        <div className="monk-card__name">{monkHistory.name}</div>
        <div className="monk-card__title">{monkHistory.fullTitle}</div>

        <div style={{ textAlign: "left", margin: "var(--space-md) 0" }}>
          <div className="monk-card__fact">
            <strong>เกิด</strong> <span>{monkHistory.born}</span>
          </div>
          <div className="monk-card__fact">
            <strong><Icon name="pin" size={12} style={{ verticalAlign: "middle" }} /> ภูมิลำเนา</strong> <span>{monkHistory.birthPlace}</span>
          </div>
          <div className="monk-card__fact">
            <strong>อาจารย์</strong> <span>{monkHistory.teacher}</span>
          </div>
          <div className="monk-card__fact">
            <strong>เชี่ยวชาญ</strong> <span>{monkHistory.expertise}</span>
          </div>
          <div className="monk-card__fact">
            <strong>มรณภาพ</strong> <span>{monkHistory.passed}</span>
          </div>
        </div>

        <button
          className="btn btn--secondary"
          style={{ width: "100%", marginTop: "var(--space-sm)" }}
          onClick={() => setShowFullBio(!showFullBio)}
        >
          {showFullBio ? "ซ่อนประวัติ ▲" : "อ่านประวัติเต็ม ▼"}
        </button>

        {showFullBio && <p className="monk-card__bio" style={{ marginTop: "var(--space-md)" }}>{monkHistory.bio}</p>}
      </div>

      {/* พระคาถาเงินล้าน */}
      <h2 className="page__section-title">
        <Icon name="lotus" size={18} color="var(--gold-dark)" /> พระคาถาเงินล้าน
      </h2>

      <div className="prayer-box">
        <div className="prayer-box__title">{prayer.name}</div>
        <div className="prayer-box__preamble">{prayer.origin}</div>

        <div className="prayer-box__namo">
          <strong>{prayer.preamble.title}</strong>
          <br />
          {prayer.preamble.text}
          <br />
          (สวด 3 จบ)
        </div>

        <div className="prayer-box__verse">
          {prayer.mainPrayer.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        <div className="prayer-box__disclaimer">{prayer.disclaimer}</div>
      </div>

      {/* วิธีสวด */}
      <h2 className="page__section-title">
        <Icon name="scripture" size={18} color="var(--gold-dark)" /> วิธีสวด
      </h2>
      {prayer.howToChant.map((opt, i) => (
        <div key={i} className="chant-option">
          <span className="chant-option__count">{opt.count}</span>
          <span className="chant-option__desc">{opt.desc}</span>
        </div>
      ))}

      <div className="info-group" style={{ marginTop: "var(--space-md)" }}>
        <div className="info-group__title">
          <Icon name="check" size={16} color="var(--green)" /> หลักปฏิบัติ
        </div>
        {prayer.principles.map((p, i) => (
          <div key={i} className="info-item">
            <span className="info-item__icon"><Icon name="check" size={14} color="var(--green)" /></span>
            <div className="info-item__content">
              <span className="info-item__label">{p}</span>
            </div>
          </div>
        ))}
      </div>

      {/* มโนมยิทธิ */}
      <h2 className="page__section-title">
        <Icon name="meditation" size={18} color="var(--gold-dark)" /> {manomaiyiddhi.name}
      </h2>
      <div className="info-group">
        <p style={{ fontSize: "0.82rem", color: "var(--brown)", lineHeight: 1.7, marginBottom: "var(--space-md)" }}>
          {manomaiyiddhi.description}
        </p>
        <div className="info-group__title">สิ่งที่ต้องเตรียม</div>
        {manomaiyiddhi.requirements.map((req, i) => (
          <div key={i} className="info-item">
            <span className="info-item__icon">•</span>
            <div className="info-item__content">
              <span className="info-item__value">{req}</span>
            </div>
          </div>
        ))}
        <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: "var(--space-sm)" }}>
          <Icon name="clock" size={12} style={{ verticalAlign: "middle", marginRight: 3 }} /> ใช้เวลาฝึก: {manomaiyiddhi.duration}
        </div>
      </div>

      {/* คำสอน */}
      <h2 className="page__section-title">
        <Icon name="quote" size={18} color="var(--gold-dark)" /> คำสอนหลวงพ่อฤาษีลิงดำ
      </h2>
      {teachings.map((t) => (
        <div key={t.id} className="teaching-card">
          <div className="teaching-card__quote">{t.quote}</div>
          <div className="teaching-card__theme">— {t.theme}</div>
        </div>
      ))}
    </div>
  );
}

// ===== 4. INFO PAGE (ข้อมูลปฏิบัติ) =====
function InfoPage() {
  const googleFormsUrl = null; // ← เปลี่ยนเป็น URL ของ Google Forms ที่ต้องการ

  return (
    <div className="page">
      <h1 className="page__title">
        <Icon name="navInfo" size={22} color="var(--gold-dark)" /> ข้อมูลปฏิบัติ & การติดต่อ
      </h1>

      {/* ตารางเวลา */}
      <div className="info-group">
        <div className="info-group__title">
          <Icon name="clock" size={16} color="var(--gold-dark)" /> ตารางเวลาเข้าชมสถานที่สำคัญ
        </div>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>สถานที่</th>
              <th>รอบเช้า</th>
              <th>รอบบ่าย</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>วิหารแก้ว 100 เมตร</strong></td>
              <td>09:00-11:30</td>
              <td>14:00-16:00</td>
            </tr>
            <tr>
              <td><strong>ปราสาททองคำ</strong></td>
              <td colSpan="2" style={{ textAlign: "center" }}>08:00-16:00 (เปิดต่อเนื่อง)</td>
            </tr>
            <tr>
              <td><strong>วิหารสมเด็จองค์ปฐม</strong></td>
              <td>09:00-10:30</td>
              <td>13:00-16:00</td>
            </tr>
            <tr>
              <td><strong>ตึกสมบัติพ่อให้</strong></td>
              <td colSpan="2" style={{ textAlign: "center" }}>09:00-16:00</td>
            </tr>
          </tbody>
        </table>
        <div style={{ fontSize: "0.7rem", color: "var(--gray)", marginTop: "var(--space-sm)" }}>
          * เสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์ วิหารสมเด็จฯ เปิดต่อเนื่อง 09:00-16:00 น.
        </div>
      </div>

      {/* กฎระเบียบ */}
      <div className="info-group">
        <div className="info-group__title">
          <Icon name="scripture" size={16} color="var(--gold-dark)" /> กฎและข้อปฏิบัติในวัด
        </div>
        {templeRules.map((rule, i) => (
          <div key={i} className="info-item">
            <span className="info-item__icon">
              <Icon name={rule.icon || "check"} size={16} color="var(--brown)" />
            </span>
            <div className="info-item__content">
              <strong>{rule.title}:</strong>
              <span className="info-item__label" style={{ marginLeft: 6 }}>{rule.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ข้อกำหนดการแต่งกาย */}
      <div className="info-group">
        <div className="info-group__title">
          <Icon name="dressCode" size={16} color="var(--gold-dark)" /> ข้อกำหนดการแต่งกาย
        </div>
        <div style={{ marginBottom: "var(--space-sm)" }}>
          <strong style={{ color: "var(--green)", fontSize: "0.8rem" }}>✓ สิ่งที่ควรปฏิบัติ:</strong>
          <ul style={{ paddingLeft: 18, fontSize: "0.76rem", color: "var(--brown)", marginTop: 4, lineHeight: 1.6 }}>
            {dressCode.dos.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong style={{ color: "var(--red)", fontSize: "0.8rem" }}>✕ สิ่งที่ไม่ควรสวมใส่:</strong>
          <ul style={{ paddingLeft: 18, fontSize: "0.76rem", color: "var(--brown)", marginTop: 4, lineHeight: 1.6 }}>
            {dressCode.donts.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ร้านอาหาร */}
      <h2 className="page__section-title">
        <Icon name="utensils" size={18} color="var(--gold-dark)" /> ร้านอาหารแนะนำใกล้วัด
      </h2>
      {restaurants.map((r, i) => (
        <div key={i} className="venue-card">
          <span className="venue-card__emoji">
            <Icon name="utensils" size={24} color="var(--saffron)" />
          </span>
          <div className="venue-card__info">
            <div className="venue-card__name">{r.name}</div>
            <div className="venue-card__highlight"><Icon name="pin" size={11} style={{ verticalAlign: "middle" }} /> {r.distance} | แนะนำ: {r.recommend}</div>
            <div className="venue-card__desc">{r.desc}</div>
          </div>
        </div>
      ))}

      {/* ที่พัก */}
      <h2 className="page__section-title">
        <Icon name="house" size={18} color="var(--gold-dark)" /> ที่พักใกล้วัด
      </h2>
      {accommodations.map((a, i) => (
        <div key={i} className="venue-card">
          <span className="venue-card__emoji">
            <Icon name="house" size={24} color="var(--brown)" />
          </span>
          <div className="venue-card__info">
            <div className="venue-card__name">{a.name}</div>
            <div className="venue-card__highlight"><Icon name="pin" size={11} style={{ verticalAlign: "middle" }} /> {a.distance} | {a.price}</div>
            <div className="venue-card__desc">{a.desc}</div>
          </div>
        </div>
      ))}

      {/* ช่องทางติดต่อ */}
      <h2 className="page__section-title">
        <Icon name="phone" size={18} color="var(--gold-dark)" /> ช่องทางติดต่อวัดท่าซุง
      </h2>
      <div className="info-group">
        <div className="info-item">
          <span className="info-item__icon"><Icon name="phone" size={16} color="var(--brown)" /></span>
          <div className="info-item__content">
            <span className="info-item__label">ตึกรับแขก (ทั่วไป)</span>
            <a href={getTelUrl(templeInfo.phone.general)} className="info-item__link">{templeInfo.phone.general}</a>
          </div>
        </div>
        <div className="info-item">
          <span className="info-item__icon"><Icon name="meditation" size={16} color="var(--brown)" /></span>
          <div className="info-item__content">
            <span className="info-item__label">ที่พักปฏิบัติธรรม</span>
            <a href={getTelUrl(templeInfo.phone.retreat)} className="info-item__link">{templeInfo.phone.retreat}</a>
          </div>
        </div>
        <div className="info-item">
          <span className="info-item__icon"><Icon name="meal" size={16} color="var(--brown)" /></span>
          <div className="info-item__content">
            <span className="info-item__label">ถวายภัตตาหารเพล</span>
            <a href={getTelUrl(templeInfo.phone.meal)} className="info-item__link">{templeInfo.phone.meal}</a>
          </div>
        </div>
        <div className="info-item">
          <span className="info-item__icon"><Icon name="globe" size={16} color="var(--blue)" /></span>
          <div className="info-item__content">
            <span className="info-item__label">เว็บไซต์ทางการ</span>
            <a href={templeInfo.website} target="_blank" rel="noopener noreferrer" className="info-item__link">
              watthasung.com
            </a>
          </div>
        </div>
        <div className="info-item">
          <span className="info-item__icon"><Icon name="social" size={16} color="var(--blue)" /></span>
          <div className="info-item__content">
            <span className="info-item__label">Facebook Page</span>
            <a href={templeInfo.facebook} target="_blank" rel="noopener noreferrer" className="info-item__link">
              Watthasung.com
            </a>
          </div>
        </div>
        <div className="info-item">
          <span className="info-item__icon"><Icon name="play" size={16} color="var(--red)" /></span>
          <div className="info-item__content">
            <span className="info-item__label">YouTube</span>
            <a href={templeInfo.youtube} target="_blank" rel="noopener noreferrer" className="info-item__link">
              วัดท่าซุง official
            </a>
          </div>
        </div>
      </div>

      {/* แบบสอบถาม */}
      <div className="form-embed">
        <div className="form-embed__header">
          <Icon name="scripture" size={16} color="var(--brown-deep)" /> แบบสอบถามความพึงพอใจ
        </div>
        {googleFormsUrl ? (
          <iframe src={googleFormsUrl} title="แบบสอบถาม" />
        ) : (
          <div className="form-embed__placeholder">
            <p>ยังไม่ได้ระบุลิงก์ Google Forms</p>
            <p style={{ marginTop: "var(--space-sm)" }}>
              สามารถนำลิงก์ Google Forms มาใส่ได้ในไฟล์ <code>src/App.jsx</code> ที่ตัวแปร <code>googleFormsUrl</code> ในฟังก์ชัน <code>InfoPage</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== MAIN APP =====
function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [exploreSubView, setExploreSubView] = useState("places"); // "places", "map", "tour"
  const locationService = useUserLocation();

  // ฟังก์ชันนำทางจากหน้า Home หรือปุ่มต่างๆ ไปยังแท็บและหน้าย่อยที่ต้องการ
  const handleNavigate = (tab, subView = null) => {
    setActiveTab(tab);
    if (subView) {
      setExploreSubView(subView);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={handleNavigate} locationService={locationService} />;
      case "explore":
        return (
          <ExplorePage
            subView={exploreSubView}
            onSubViewChange={(sub) => setExploreSubView(sub)}
            locationService={locationService}
          />
        );
      case "dharma":
        return <DharmaPage />;
      case "info":
        return <InfoPage />;
      default:
        return <HomePage onNavigate={handleNavigate} locationService={locationService} />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "home":
        return "วัดท่าซุง (วัดจันทาราม)";
      case "explore":
        if (exploreSubView === "map") return "ผังวัดดิจิทัล & 3D Twin";
        if (exploreSubView === "tour") return "เส้นทางแนะนำ (3 ชม.)";
        return "เที่ยวชมสถานที่ (39 จุด)";
      case "dharma":
        return "ธรรมะ & ประวัติ";
      case "info":
        return "ข้อมูลปฏิบัติ & ติดต่อ";
      default:
        return "วัดท่าซุง";
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header__icon">
          <Icon name="navTemple" size={22} color="var(--gold-light)" />
        </div>
        <div>
          <div className="header__title">{getHeaderTitle()}</div>
          <div className="header__subtitle">ต.น้ำซึม อ.เมือง จ.อุทัยธานี</div>
        </div>
      </header>

      <main key={`${activeTab}-${exploreSubView}`}>{renderPage()}</main>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => handleNavigate(tab)} />
    </div>
  );
}

export default App;
