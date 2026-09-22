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

// ===== Bottom Navigation =====
function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "home", icon: "🏛️", label: "สถานที่" },
    { id: "map", icon: "🗺️", label: "แผนที่" },
    { id: "tour", icon: "🛕", label: "เส้นทาง" },
    { id: "dharma", icon: "📿", label: "ธรรมะ" },
    { id: "info", icon: "ℹ️", label: "ข้อมูล" },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? "nav-item--active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-item__icon">{tab.icon}</span>
          <span className="nav-item__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ===== Place Card Component =====
function PlaceCard({ place }) {
  const [expanded, setExpanded] = useState(false);
  const status = getOpenStatus(place.openingHours);

  const formatHours = (hours) => {
    if (!hours) return null;
    if (hours.allDay)
      return (
        <div className="place-card__hours">
          <strong>⏰ เวลาเปิด:</strong> {hours.allDay.open} - {hours.allDay.close} น.
        </div>
      );
    return (
      <div className="place-card__hours">
        <strong>⏰ เวลาเปิด:</strong>
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
            <span style={{ fontSize: "0.72rem", color: "var(--gray)" }}>📝 {hours.note}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={`place-card ${place.highlight ? "place-card--highlight" : ""} ${expanded ? "place-card--expanded" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="place-card__header">
        <div className="place-card__emoji">{place.emoji}</div>
        <div className="place-card__info">
          <div className="place-card__name">{place.name}</div>
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
        {place.tips && <p className="place-card__tip">💡 {place.tips}</p>}
        <div className="place-card__actions">
          <a
            href={getGoogleMapsUrl(place.gps.lat, place.gps.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
            onClick={(e) => e.stopPropagation()}
          >
            📍 นำทาง
          </a>
        </div>
      </div>
    </div>
  );
}

// ===== HOME PAGE =====
function HomePage() {
  const [, setTick] = useState(0);
  // Update every minute for real-time status
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
            <div className="status-hero__title">💎 มหาวิหารแก้ว 100 เมตร</div>
            <span className={`status-hero__badge ${isOpen ? "status-hero__badge--open" : "status-hero__badge--closed"}`}>
              {isOpen ? "🟢 เปิดอยู่" : "🔴 ปิดอยู่"}
            </span>
          </div>
        </div>
        {viharaStatus.countdown && (
          <div className="status-hero__countdown">
            ⏱️ {isOpen ? `ปิดอีก ${viharaStatus.countdown}` : `เปิดอีก ${viharaStatus.countdown}`}
          </div>
        )}
        {viharaStatus.session && (
          <div className="status-hero__session">{viharaStatus.session}</div>
        )}
        {!viharaStatus.countdown && !isOpen && (
          <div className="status-hero__countdown">📅 เปิดพรุ่งนี้ รอบเช้า 09:00 น.</div>
        )}
      </div>

      {/* Dress Code Alert */}
      <div className="dress-alert">
        <div className="dress-alert__icon">{dressCode.emoji}</div>
        <div>
          <div className="dress-alert__title">⚠️ {dressCode.title}</div>
          <ul className="dress-alert__rules">
            {dressCode.rules.map((rule, i) => (
              <li key={i}>
                {rule.icon} {rule.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* สถานที่แบ่งตามโซน */}
      {zones.map((zone) => (
        <div key={zone.id}>
          <div className="zone-header">
            <span className="zone-header__emoji">{zone.emoji}</span>
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
      <h1 className="page__title">🗺️ แผนที่ & การเดินทาง</h1>

      {/* Navigate to temple button */}
      <div className="map-card">
        <div className="map-card__illustration">🏛️</div>
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
          📍 นำทางไปวัดท่าซุง
        </a>
      </div>

      {/* All places with navigation */}
      <h2 className="page__section-title">📍 จุดท่องเที่ยวทั้งหมด</h2>
      <div className="map-places">
        {places.map((place) => (
          <div key={place.id} className="map-place">
            <span className="map-place__emoji">{place.emoji}</span>
            <span className="map-place__name">{place.shortName}</span>
            <a
              href={getGoogleMapsUrl(place.gps.lat, place.gps.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="map-place__nav"
            >
              นำทาง →
            </a>
          </div>
        ))}
      </div>

      {/* Travel Info */}
      <h2 className="page__section-title">🚗 วิธีเดินทาง</h2>

      <div className="travel-card">
        <div className="travel-card__title">🚗 รถส่วนตัว</div>
        <div className="travel-card__desc">
          เดินทางมายัง จ.อุทัยธานี มีป้ายบอกทางชัดเจน พื้นที่จอดรถกว้างขวาง
        </div>
      </div>

      <div className="travel-card">
        <div className="travel-card__title">🚌 รถสาธารณะ</div>
        <div className="travel-card__desc">
          นั่งรถตู้/รถโดยสารมาลงที่ บขส.อุทัยธานี ต่อรถมอเตอร์ไซค์รับจ้างหรือสามล้อเข้าวัด
          (ห่างจากตัวเมืองประมาณ 7 กม.)
        </div>
      </div>

      <div className="travel-card">
        <div className="travel-card__title">🚂 รถรางในวัด</div>
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
      <h1 className="page__title">🛕 เส้นทางแนะนำ</h1>
      <p style={{ fontSize: "0.82rem", color: "var(--brown)", marginBottom: "var(--space-lg)" }}>
        เส้นทางท่องเที่ยววัดท่าซุงแบบจัดเต็ม ใช้เวลาประมาณ <strong>3 ชั่วโมง</strong>
      </p>

      {walkingTour.map((step) => {
        const place = step.placeId ? places.find((p) => p.id === step.placeId) : null;
        return (
          <div key={step.step} className="tour-step">
            <div className="tour-step__number">{step.step}</div>
            <div className="tour-step__content">
              <div className="tour-step__header">
                <div className="tour-step__name">
                  {place ? `${place.emoji} ${place.shortName}` : `${step.emoji} ${step.name}`}
                </div>
                <span className="tour-step__time">{step.time}</span>
              </div>
              <div className="tour-step__duration">⏱️ {step.duration}</div>
              <div className="tour-step__tip">💡 {step.tip}</div>
              {place && (
                <a
                  href={getGoogleMapsUrl(place.gps.lat, place.gps.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                  style={{ marginTop: "var(--space-sm)", fontSize: "0.72rem" }}
                >
                  📍 นำทาง
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
      <h1 className="page__title">📿 ธรรมะ & ประวัติ</h1>

      {/* Monk Bio */}
      <div className="monk-card">
        <div className="monk-card__emoji">🙏</div>
        <div className="monk-card__name">{monkHistory.name}</div>
        <div className="monk-card__title">{monkHistory.fullTitle}</div>

        <div style={{ textAlign: "left", margin: "var(--space-md) 0" }}>
          <div className="monk-card__fact">
            <strong>🎂 เกิด</strong> <span>{monkHistory.born}</span>
          </div>
          <div className="monk-card__fact">
            <strong>📍 ภูมิลำเนา</strong> <span>{monkHistory.birthPlace}</span>
          </div>
          <div className="monk-card__fact">
            <strong>👨‍🏫 อาจารย์</strong> <span>{monkHistory.teacher}</span>
          </div>
          <div className="monk-card__fact">
            <strong>⭐ เชี่ยวชาญ</strong> <span>{monkHistory.expertise}</span>
          </div>
          <div className="monk-card__fact">
            <strong>🕯️ มรณภาพ</strong> <span>{monkHistory.passed}</span>
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
      <h2 className="page__section-title">🪷 พระคาถาเงินล้าน</h2>

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

        <div className="prayer-box__disclaimer">⚠️ {prayer.disclaimer}</div>
      </div>

      {/* How to chant */}
      <h2 className="page__section-title">📖 วิธีสวด</h2>
      {prayer.howToChant.map((opt, i) => (
        <div key={i} className="chant-option">
          <span className="chant-option__count">{opt.count}</span>
          <span className="chant-option__desc">{opt.desc}</span>
        </div>
      ))}

      <div className="info-group" style={{ marginTop: "var(--space-md)" }}>
        <div className="info-group__title">🙏 หลักปฏิบัติ</div>
        {prayer.principles.map((p, i) => (
          <div key={i} className="info-item">
            <span className="info-item__icon">✅</span>
            <div className="info-item__content">
              <span className="info-item__label">{p}</span>
            </div>
          </div>
        ))}
      </div>

      {/* มโนมยิทธิ */}
      <h2 className="page__section-title">🧘 {manomaiyiddhi.name}</h2>
      <div className="info-group">
        <p style={{ fontSize: "0.82rem", color: "var(--brown)", lineHeight: 1.7, marginBottom: "var(--space-md)" }}>
          {manomaiyiddhi.description}
        </p>
        <div className="info-group__title">📋 สิ่งที่ต้องเตรียม</div>
        {manomaiyiddhi.requirements.map((req, i) => (
          <div key={i} className="info-item">
            <span className="info-item__icon">•</span>
            <div className="info-item__content">
              <span className="info-item__value">{req}</span>
            </div>
          </div>
        ))}
        <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: "var(--space-sm)" }}>
          ⏱️ ใช้เวลาฝึก: {manomaiyiddhi.duration}
        </div>
      </div>

      {/* คำสอน */}
      <h2 className="page__section-title">💬 คำสอนหลวงพ่อฤาษีลิงดำ</h2>
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
  // Google Forms URL - ผู้ใช้ต้องเปลี่ยน URL นี้
  const googleFormsUrl = null; // ← เปลี่ยนเป็น URL ของ Google Forms ที่สร้างขึ้น

  return (
    <div className="page">
      <h1 className="page__title">ℹ️ ข้อมูลปฏิบัติ</h1>

      {/* ตารางเวลา */}
      <div className="info-group">
        <div className="info-group__title">⏰ ตารางเวลาเข้าชม</div>
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
          📝 เสาร์-อาทิตย์ วิหารสมเด็จฯ และ พระศรีอาริยฯ เปิดต่อเนื่อง 09:00-16:00
        </div>
      </div>

      {/* กฎระเบียบ */}
      <div className="info-group">
        <div className="info-group__title">📋 กฎและข้อปฏิบัติ</div>
        {templeRules.map((rule, i) => (
          <div key={i} className="info-item">
            <span className="info-item__icon">{rule.icon}</span>
            <div className="info-item__content">
              <span className="info-item__label">{rule.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ร้านอาหาร */}
      <h2 className="page__section-title">🍽️ ร้านอาหารใกล้วัด</h2>
      {restaurants.map((r, i) => (
        <div key={i} className="venue-card">
          <span className="venue-card__emoji">{r.emoji}</span>
          <div className="venue-card__info">
            <div className="venue-card__name">{r.name}</div>
            <div className="venue-card__highlight">{r.highlight}</div>
            <div className="venue-card__desc">{r.note}</div>
          </div>
        </div>
      ))}

      {/* ที่พัก */}
      <h2 className="page__section-title">🏨 ที่พักใกล้วัด</h2>
      {accommodations.map((a, i) => (
        <div key={i} className="venue-card">
          <span className="venue-card__emoji">🏠</span>
          <div className="venue-card__info">
            <div className="venue-card__name">{a.name}</div>
            <div className="venue-card__highlight">📍 {a.distance}</div>
            <div className="venue-card__desc">{a.note}</div>
          </div>
        </div>
      ))}

      {/* ช่องทางติดต่อ */}
      <h2 className="page__section-title">📞 ติดต่อวัดท่าซุง</h2>
      <div className="info-group">
        <div className="info-item">
          <span className="info-item__icon">📞</span>
          <div className="info-item__content">
            <span className="info-item__label">ตึกรับแขก (ทั่วไป)</span>
            <a href={getTelUrl(templeInfo.phone.general)} className="info-item__link">{templeInfo.phone.general}</a>
          </div>
        </div>
        <div className="info-item">
          <span className="info-item__icon">🧘</span>
          <div className="info-item__content">
            <span className="info-item__label">ที่พักปฏิบัติธรรม</span>
            <a href={getTelUrl(templeInfo.phone.retreat)} className="info-item__link">{templeInfo.phone.retreat}</a>
          </div>
        </div>
        <div className="info-item">
          <span className="info-item__icon">🍱</span>
          <div className="info-item__content">
            <span className="info-item__label">ถวายภัตตาหารเพล</span>
            <a href={getTelUrl(templeInfo.phone.meal)} className="info-item__link">{templeInfo.phone.meal}</a>
          </div>
        </div>
        <div className="info-item">
          <span className="info-item__icon">🌐</span>
          <div className="info-item__content">
            <span className="info-item__label">เว็บไซต์</span>
            <a href={templeInfo.website} target="_blank" rel="noopener noreferrer" className="info-item__link">
              watthasung.com
            </a>
          </div>
        </div>
        <div className="info-item">
          <span className="info-item__icon">📘</span>
          <div className="info-item__content">
            <span className="info-item__label">Facebook Page</span>
            <a href={templeInfo.facebook} target="_blank" rel="noopener noreferrer" className="info-item__link">
              Watthasung.com
            </a>
          </div>
        </div>
        <div className="info-item">
          <span className="info-item__icon">▶️</span>
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
        <div className="form-embed__header">📝 แบบสอบถามความพึงพอใจ</div>
        {googleFormsUrl ? (
          <iframe src={googleFormsUrl} title="แบบสอบถาม" />
        ) : (
          <div className="form-embed__placeholder">
            <p>📋 ยังไม่ได้ใส่ลิงก์ Google Forms</p>
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
        <div className="header__icon">🏛️</div>
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
