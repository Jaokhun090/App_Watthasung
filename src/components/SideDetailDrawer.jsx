import { useState } from "react";
import { places, templeInfo } from "../data/places";
import { getOpenStatus, getGoogleMapsUrl } from "../utils";
import Icon, { placeIcons } from "./Icons";

export default function SideDetailDrawer({
  place,
  onClose,
  userLocation,
  getFormattedDistanceTo,
  onOpenPhoto,
  onSelectPlace,
}) {
  const [filterQuery, setFilterQuery] = useState("");
  const [showPlacesList, setShowPlacesList] = useState(false);

  // If no place is currently selected, show the building directory list
  const activePlace = place;

  const filteredPlaces = places.filter((p) => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.altName && p.altName.toLowerCase().includes(q)) ||
      p.id.toString().includes(q)
    );
  });

  return (
    <aside className="bdt-side-drawer" aria-label="ข้อมูลสถานที่ Digital Twin">
      {/* Drawer Header */}
      <div className="bdt-side-drawer__header">
        <div className="bdt-side-drawer__header-title">
          <span className="bdt-badge-icon">🏛️</span>
          <div>
            <div className="bdt-header-main">ข้อมูลสถานที่ดิจิทัล</div>
            <div className="bdt-header-sub">วัดจันทาราม (ท่าซุง) 39 จุด</div>
          </div>
        </div>

        <div className="bdt-side-drawer__header-actions">
          <button
            type="button"
            className={`bdt-toggle-list-btn ${showPlacesList ? "bdt-toggle-list-btn--active" : ""}`}
            onClick={() => setShowPlacesList(!showPlacesList)}
            title="สลับดูรายชื่อสถานที่ 1-39"
          >
            {showPlacesList ? "ดูข้อมูล ❯" : "☰ รายชื่อ 39 จุด"}
          </button>
          <button
            type="button"
            className="bdt-close-btn"
            onClick={onClose}
            aria-label="ปิดแถบข้อมูล"
            title="ปิดแถบข้อมูล"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="bdt-side-drawer__body">
        {showPlacesList ? (
          /* รายชื่ออาคารทั้ง 39 จุดให้เลือกคลิก */
          <div className="bdt-places-list">
            <div className="bdt-search-box">
              <Icon name="search" size={14} color="#64748b" />
              <input
                type="text"
                placeholder="ค้นหาชื่อหรือเลขจุด 1-39..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="bdt-search-input"
              />
              {filterQuery && (
                <button
                  type="button"
                  className="bdt-search-clear"
                  onClick={() => setFilterQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="bdt-places-scroll">
              {filteredPlaces.map((p) => {
                const isCurrent = activePlace?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`bdt-place-item ${isCurrent ? "bdt-place-item--selected" : ""}`}
                    onClick={() => {
                      if (onSelectPlace) onSelectPlace(p);
                      setShowPlacesList(false);
                    }}
                  >
                    <span className="bdt-place-item__num">{p.id}</span>
                    <div className="bdt-place-item__info">
                      <div className="bdt-place-item__name">{p.name}</div>
                      {p.altName && (
                        <div className="bdt-place-item__alt">{p.altName}</div>
                      )}
                    </div>
                    {p.highlight && <span className="bdt-place-item__star">★</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ) : activePlace ? (
          /* ข้อมูลสถานที่ที่เลือก */
          <div className="bdt-detail-content">
            {/* Top Place Banner / Badge */}
            <div className="bdt-place-hero">
              <div className="bdt-place-hero__num">#{activePlace.id}</div>
              <div className="bdt-place-hero__names">
                <h3 className="bdt-place-hero__title">{activePlace.name}</h3>
                {activePlace.altName && (
                  <div className="bdt-place-hero__alt">({activePlace.altName})</div>
                )}
              </div>
            </div>

            {/* Photo Thumbnail if available */}
            {activePlace.photos && activePlace.photos.length > 0 && (
              <div className="bdt-place-photo-card">
                <img
                  src={activePlace.photos[0]}
                  alt={activePlace.name}
                  className="bdt-place-photo"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {onOpenPhoto && (
                  <button
                    type="button"
                    className="bdt-photo-btn"
                    onClick={() => onOpenPhoto(activePlace.photos, activePlace.name)}
                  >
                    <Icon name="gallery" size={13} /> ดูรูปขนาดใหญ่ ({activePlace.photos.length})
                  </button>
                )}
              </div>
            )}

            {/* Badges Bar (Status, Distance, Zone) */}
            <div className="bdt-badges-row">
              {(() => {
                const status = getOpenStatus(activePlace.openingHours);
                return status.isOpen !== null ? (
                  <span
                    className={`bdt-badge ${
                      status.isOpen ? "bdt-badge--open" : "bdt-badge--closed"
                    }`}
                  >
                    <span className="bdt-status-dot" />
                    {status.label} {status.countdown && `(${status.countdown})`}
                  </span>
                ) : null;
              })()}

              {userLocation && getFormattedDistanceTo && (
                <span className="bdt-badge bdt-badge--distance">
                  <Icon name="pin" size={11} color="#2563eb" />
                  ห่าง {getFormattedDistanceTo(activePlace.gps.lat, activePlace.gps.lng)}
                </span>
              )}

              <span className="bdt-badge bdt-badge--zone">
                {activePlace.zone === "new"
                  ? "ฝั่งวัดใหม่"
                  : activePlace.zone === "old"
                  ? "ฝั่งวัดเก่า/ริมน้ำ"
                  : "ศาลา/ปฏิบัติธรรม"}
              </span>
            </div>

            {/* Hours Info */}
            <div className="bdt-info-box">
              <div className="bdt-info-row">
                <span className="bdt-info-label">
                  <Icon name="clock" size={13} color="var(--gold-dark)" /> เวลาเปิดให้เข้าชม:
                </span>
                <span className="bdt-info-val">
                  {activePlace.openingHours?.allDay
                    ? `${activePlace.openingHours.allDay.open} - ${activePlace.openingHours.allDay.close} น.`
                    : activePlace.openingHours?.morning
                    ? `${activePlace.openingHours.morning.open}-${activePlace.openingHours.morning.close} น. และ ${activePlace.openingHours.afternoon.open}-${activePlace.openingHours.afternoon.close} น.`
                    : "เข้าชมได้ตลอดเวลาทำการของวัด"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bdt-desc-section">
              <div className="bdt-section-title">คำบรรยาย & ความสำคัญ</div>
              <p className="bdt-desc-text">{activePlace.description}</p>
            </div>

            {/* Tips / Highlights */}
            {activePlace.tips && (
              <div className="bdt-tips-box">
                <div className="bdt-tips-title">
                  <Icon name="sparkle" size={13} color="#b45309" /> ข้อแนะนำการกราบไหว้:
                </div>
                <div className="bdt-tips-text">{activePlace.tips}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bdt-actions">
              <a
                href={getGoogleMapsUrl(activePlace.gps.lat, activePlace.gps.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="bdt-nav-btn"
              >
                <Icon name="pin" size={15} /> นำทางด้วย Google Maps
              </a>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="bdt-empty-state">
            <div className="bdt-empty-icon">📍</div>
            <div className="bdt-empty-title">แตะที่อาคารหรือหมุด 3D</div>
            <div className="bdt-empty-sub">
              คลิกที่ตัวอาคารหรือหมุดสีแดงบนแบบจำลองเพื่อดูข้อมูล หรือกดปุ่ม
              "รายชื่อ 39 จุด" ด้านบน
            </div>
            <button
              type="button"
              className="btn btn--primary"
              style={{ fontSize: "0.78rem", marginTop: 12 }}
              onClick={() => setShowPlacesList(true)}
            >
              เปิดดูรายชื่อสถานที่ทั้งหมด 39 จุด
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
