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
import Icon, { placeIcons, navIcons } from "./components/Icons";

// ===== Bottom Navigation =====
function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "home", iconName: "navTemple", label: "สถานที่" },
    { id: "map", iconName: "navMap", label: "แผนที่" },
    { id: "tour", iconName: "navRoute", label: "เส้นทาง" },
    { id: "dharma", iconName: "navDharma", label: "ธรรมะ" },
    { id: "info", iconName: "navInfo", label: "ข้อมูล" },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          type="button"
          className={`nav-item ${activeTab === tab.id ? "nav-item--active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-item__icon">
            <Icon name={tab.iconName} size={22} />
          </span>
          <span className="nav-item__label">{tab.label}</span>
        </button>
      ))}
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
      }
      if (e.key === "ArrowRight") {
        setIdx((i) => (i + 1) % photos.length);
        setImgLoaded(false);
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
function PlaceCard({ place }) {
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
          <strong><Icon name="clock" size={13} style={{verticalAlign:"middle",marginRight:4}}/> เวลาเปิด:</strong> {hours.allDay.open} - {hours.allDay.close} น.
        </div>
      );
    return (
      <div className="place-card__hours">
        <strong><Icon name="clock" size={13} style={{verticalAlign:"middle",marginRight:4}}/> เวลาเปิด:</strong>
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
          <div className="place-card__name">{place.name}</div>
          {place.altName && (
            <div className="place-card__altname">
              <span className="place-card__altname-badge">ชื่อเรียกทั่วไป</span>
              <span>{place.altName}</span>
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
        <span className="place-card__chevron">▼</span>
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
        placeName={place.shortName}
        onClose={() => setShowGallery(false)}
      />
    )}
    </>
  );
}

// ===== HOME PAGE =====
function HomePage() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const viharaKaew = places.find((p) => p.id === 1);
  const viharaStatus = getOpenStatus(viharaKaew.openingHours);
  const isOpen = viharaStatus.isOpen;

  return (
    <div className="page">
      {/* Status Hero - มหาวิหารแก้ว */}
      <div className="status-hero">
        <div className="status-hero__header">
          <div className={`status-hero__dot ${isOpen ? "status-hero__dot--open" : "status-hero__dot--closed"}`} />
          <div>
            <div className="status-hero__title">
              <Icon name="crystal" size={20} color="var(--brown-deep)" style={{verticalAlign:"middle",marginRight:4}} />
              มหาวิหารแก้ว 100 เมตร
            </div>
            <span className={`status-hero__badge ${isOpen ? "status-hero__badge--open" : "status-hero__badge--closed"}`}>
              {isOpen ? "เปิดอยู่" : "ปิดอยู่"}
            </span>
          </div>
        </div>
        {viharaStatus.countdown && (
          <div className="status-hero__countdown">
            <Icon name="clock" size={14} style={{verticalAlign:"middle",marginRight:4}} />
            {isOpen ? `ปิดอีก ${viharaStatus.countdown}` : `เปิดอีก ${viharaStatus.countdown}`}
          </div>
        )}
        {viharaStatus.session && (
          <div className="status-hero__session">{viharaStatus.session}</div>
        )}
        {!viharaStatus.countdown && !isOpen && (
          <div className="status-hero__countdown">เปิดพรุ่งนี้ รอบเช้า 09:00 น.</div>
        )}
      </div>

      {/* Dress Code Alert */}
      <div className="dress-alert">
        <div className="dress-alert__icon">
          <Icon name="dressCode" size={28} color="var(--saffron)" />
        </div>
        <div>
          <div className="dress-alert__title">การแต่งกาย</div>
          <ul className="dress-alert__rules">
            <li><Icon name="shirt" size={13} color="var(--brown)" style={{verticalAlign:"middle",marginRight:4}}/> เสื้อมีแขน ปิดไหล่ ไม่รัดรูป</li>
            <li><Icon name="pants" size={13} color="var(--brown)" style={{verticalAlign:"middle",marginRight:4}}/> กางเกง/กระโปรง ยาวคลุมเข่า</li>
            <li><Icon name="shoe" size={13} color="var(--brown)" style={{verticalAlign:"middle",marginRight:4}}/> รองเท้าถอดใส่ง่าย (ต้องถอดก่อนเข้าวิหาร)</li>
            <li><Icon name="colorTone" size={13} color="var(--brown)" style={{verticalAlign:"middle",marginRight:4}}/> โทนสีสุภาพ สวมชุดไทยได้</li>
          </ul>
        </div>
      </div>

      {/* สถานที่แบ่งตามโซน */}
      {zones.map((zone) => (
        <div key={zone.id}>
          <div className="zone-header">
            <span className="zone-header__emoji">
              <Icon name={zone.id === "new" ? "sparkle" : "oldTemple"} size={20} color="var(--gold-dark)" />
            </span>
            <div>
              <div className="zone-header__title">{zone.name}</div>
              <div className="zone-header__desc">{zone.description}</div>
            </div>
          </div>
          {places
            .filter((p) => p.zone === zone.id)
            .map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
        </div>
      ))}
    </div>
  );
}

// ===== MAP PAGE =====
function MapPage() {
  return (
    <div className="page">
      <h1 className="page__title">
        <Icon name="navMap" size={22} color="var(--gold-dark)" /> แผนที่ & การเดินทาง
      </h1>

      <div className="map-card">
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
          <Icon name="pin" size={16} /> นำทางไปวัดท่าซุง
        </a>
      </div>

      <h2 className="page__section-title">
        <Icon name="pin" size={18} color="var(--gold-dark)" /> จุดท่องเที่ยวทั้งหมด
      </h2>
      <div className="map-places">
        {places.map((place) => (
          <div key={place.id} className="map-place">
            <span className="map-place__emoji">
              <Icon name={placeIcons[place.id]} size={20} color="var(--gold-dark)" />
            </span>
            <span className="map-place__name">{place.shortName}</span>
            <a
              href={getGoogleMapsUrl(place.gps.lat, place.gps.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="map-place__nav"
            >
              นำทาง <Icon name="arrowRight" size={12} />
            </a>
          </div>
        ))}
      </div>

      <h2 className="page__section-title">
        <Icon name="navRoute" size={18} color="var(--gold-dark)" /> วิธีเดินทาง
      </h2>

      <div className="travel-card">
        <div className="travel-card__title"><Icon name="navRoute" size={16} color="var(--saffron)" /> รถส่วนตัว</div>
        <div className="travel-card__desc">
          เดินทางมายัง จ.อุทัยธานี มีป้ายบอกทางชัดเจน พื้นที่จอดรถกว้างขวาง
        </div>
      </div>

      <div className="travel-card">
        <div className="travel-card__title"><Icon name="navRoute" size={16} color="var(--saffron)" /> รถสาธารณะ</div>
        <div className="travel-card__desc">
          นั่งรถตู้/รถโดยสารมาลงที่ บขส.อุทัยธานี ต่อรถมอเตอร์ไซค์รับจ้างหรือสามล้อเข้าวัด
          (ห่างจากตัวเมืองประมาณ 7 กม.)
        </div>
      </div>

      <div className="travel-card">
        <div className="travel-card__title"><Icon name="navRoute" size={16} color="var(--saffron)" /> รถรางในวัด</div>
        <div className="travel-card__desc">
          มีบริการรถรางนำชมรอบวัด ค่าบริการประมาณ 10 บาท ช่วยประหยัดแรงเพราะวัดกว้างมาก!
        </div>
      </div>
    </div>
  );
}

// ===== TOUR PAGE =====
function TourPage() {
  return (
    <div className="page">
      <h1 className="page__title">
        <Icon name="navRoute" size={22} color="var(--gold-dark)" /> เส้นทางแนะนำ
      </h1>
      <p style={{ fontSize: "0.82rem", color: "var(--brown)", marginBottom: "var(--space-lg)" }}>
        เส้นทางท่องเที่ยววัดท่าซุงแบบจัดเต็ม ใช้เวลาประมาณ <strong>3 ชั่วโมง</strong>
      </p>

      {walkingTour.map((step) => {
        const place = step.placeId ? places.find((p) => p.id === step.placeId) : null;
        const iconName = place ? placeIcons[place.id] : "utensils";
        return (
          <div key={step.step} className="tour-step">
            <div className="tour-step__number">{step.step}</div>
            <div className="tour-step__content">
              <div className="tour-step__header">
                <div className="tour-step__name">
                  <Icon name={iconName} size={16} color="var(--gold-dark)" style={{verticalAlign:"middle",marginRight:4}}/> 
                  {place ? place.shortName : step.name}
                </div>
                <span className="tour-step__time">{step.time}</span>
              </div>
              <div className="tour-step__duration">
                <Icon name="clock" size={12} style={{verticalAlign:"middle",marginRight:3}}/> {step.duration}
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
                  <Icon name="pin" size={12} /> นำทาง
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== DHARMA PAGE =====
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
            <strong><Icon name="pin" size={12} style={{verticalAlign:"middle"}}/> ภูมิลำเนา</strong> <span>{monkHistory.birthPlace}</span>
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

      {/* Prayer - คาถาเงินล้าน */}
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

      {/* How to chant */}
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
          <Icon name="clock" size={12} style={{verticalAlign:"middle",marginRight:3}}/> ใช้เวลาฝึก: {manomaiyiddhi.duration}
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

// ===== INFO PAGE =====
function InfoPage() {
  const googleFormsUrl = null; // ← เปลี่ยนเป็น URL ของ Google Forms ที่สร้างขึ้น

  return (
    <div className="page">
      <h1 className="page__title">
        <Icon name="navInfo" size={22} color="var(--gold-dark)" /> ข้อมูลปฏิบัติ
      </h1>

      {/* ตารางเวลา */}
      <div className="info-group">
        <div className="info-group__title">
          <Icon name="clock" size={16} color="var(--gold-dark)" /> ตารางเวลาเข้าชม
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
              <td><strong>วิหารแก้ว</strong></td>
              <td>09:00-11:30</td>
              <td>14:00-16:00</td>
            </tr>
            <tr>
              <td><strong>ปราสาททองคำ</strong></td>
              <td colSpan="2" style={{ textAlign: "center" }}>08:00-16:00</td>
            </tr>
            <tr>
              <td><strong>วิหารสมเด็จฯ</strong></td>
              <td>09:00-10:30</td>
              <td>13:00-16:00</td>
            </tr>
            <tr>
              <td><strong>พระศรีอาริยฯ</strong></td>
              <td>09:00-10:30</td>
              <td>13:00-16:00</td>
            </tr>
          </tbody>
        </table>
        <div style={{ fontSize: "0.7rem", color: "var(--gray)", marginTop: "var(--space-sm)" }}>
          เสาร์-อาทิตย์ วิหารสมเด็จฯ และ พระศรีอาริยฯ เปิดต่อเนื่อง 09:00-16:00
        </div>
      </div>

      {/* กฎระเบียบ */}
      <div className="info-group">
        <div className="info-group__title">
          <Icon name="scripture" size={16} color="var(--gold-dark)" /> กฎและข้อปฏิบัติ
        </div>
        {templeRules.map((rule, i) => {
          const ruleIconMap = { "🤫": "quiet", "🚫": "noEntry", "📸": "camera", "🥿": "shoe", "🗑️": "clean" };
          return (
            <div key={i} className="info-item">
              <span className="info-item__icon">
                <Icon name={ruleIconMap[rule.icon] || "check"} size={16} color="var(--brown)" />
              </span>
              <div className="info-item__content">
                <span className="info-item__label">{rule.text}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ร้านอาหาร */}
      <h2 className="page__section-title">
        <Icon name="utensils" size={18} color="var(--gold-dark)" /> ร้านอาหารใกล้วัด
      </h2>
      {restaurants.map((r, i) => {
        const rIconMap = { "🍛": "utensils", "🐟": "fish", "☕": "coffee" };
        return (
          <div key={i} className="venue-card">
            <span className="venue-card__emoji">
              <Icon name={rIconMap[r.emoji] || "utensils"} size={24} color="var(--saffron)" />
            </span>
            <div className="venue-card__info">
              <div className="venue-card__name">{r.name}</div>
              <div className="venue-card__highlight">{r.highlight}</div>
              <div className="venue-card__desc">{r.note}</div>
            </div>
          </div>
        );
      })}

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
            <div className="venue-card__highlight"><Icon name="pin" size={11} style={{verticalAlign:"middle"}}/> {a.distance}</div>
            <div className="venue-card__desc">{a.note}</div>
          </div>
        </div>
      ))}

      {/* ช่องทางติดต่อ */}
      <h2 className="page__section-title">
        <Icon name="phone" size={18} color="var(--gold-dark)" /> ติดต่อวัดท่าซุง
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
            <span className="info-item__label">เว็บไซต์</span>
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
            <p>ยังไม่ได้ใส่ลิงก์ Google Forms</p>
            <p style={{ marginTop: "var(--space-sm)" }}>
              แก้ไขที่ไฟล์ <code>src/App.jsx</code> ในฟังก์ชัน <code>InfoPage</code>
              <br />
              เปลี่ยน <code>googleFormsUrl</code> เป็น URL ของ Google Forms ที่สร้างขึ้น
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

  const renderPage = () => {
    switch (activeTab) {
      case "home": return <HomePage />;
      case "map": return <MapPage />;
      case "tour": return <TourPage />;
      case "dharma": return <DharmaPage />;
      case "info": return <InfoPage />;
      default: return <HomePage />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "home": return "สถานที่ท่องเที่ยว";
      case "map": return "แผนที่ & การเดินทาง";
      case "tour": return "เส้นทางแนะนำ";
      case "dharma": return "ธรรมะ & ประวัติ";
      case "info": return "ข้อมูลปฏิบัติ";
      default: return "วัดท่าซุง";
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
          <div className="header__subtitle">วัดท่าซุง (วัดจันทาราม) จ.อุทัยธานี</div>
        </div>
      </header>

      <main key={activeTab}>{renderPage()}</main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
