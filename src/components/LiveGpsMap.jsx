import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { places, zones, templeInfo } from "../data/places";
import { getOpenStatus, getGoogleMapsUrl } from "../utils";
import Icon, { placeIcons } from "./Icons";

// สไตล์และหมุดแบบกำหนดเองสำหรับ Leaflet
export default function LiveGpsMap({
  userLocation,
  gpsStatus,
  isSimulated,
  onToggleGps,
  onToggleSim,
  onNextSimStep,
  getFormattedDistanceTo,
  onSelectPlace,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const navLineRef = useRef(null);

  const [activeLayer, setActiveLayer] = useState("streets"); // 'streets' | 'satellite'
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [selectedZone, setSelectedZone] = useState("all");

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || null;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // สร้าง Leaflet Map instance
    const map = L.map(mapContainerRef.current, {
      center: [templeInfo.gps.lat, templeInfo.gps.lng],
      zoom: 17,
      maxZoom: 19,
      minZoom: 14,
      zoomControl: false, // ใส่ zoom control เองด้านขวา
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    // เลเยอร์แผนที่ถนน OpenStreetMap
    const streetLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }
    );

    // เลเยอร์แผนที่ดาวเทียม Esri World Imagery
    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        maxZoom: 19,
      }
    );

    streetLayer.addTo(map);
    map._streetLayer = streetLayer;
    map._satelliteLayer = satelliteLayer;

    // Layer group สำหรับหมุดทั้ง 39 จุด
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // สลับเลเยอร์แผนที่ (ดาวเทียม vs ถนน)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeLayer === "satellite") {
      if (map.hasLayer(map._streetLayer)) map.removeLayer(map._streetLayer);
      if (!map.hasLayer(map._satelliteLayer)) map.addLayer(map._satelliteLayer);
    } else {
      if (map.hasLayer(map._satelliteLayer)) map.removeLayer(map._satelliteLayer);
      if (!map.hasLayer(map._streetLayer)) map.addLayer(map._streetLayer);
    }
  }, [activeLayer]);

  // วาดหมุด 39 จุดตามโซนที่เลือก
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const filtered = places.filter(
      (p) => selectedZone === "all" || p.zone === selectedZone
    );

    filtered.forEach((place) => {
      const isSelected = place.id === selectedPlaceId;
      const isHighlight = place.highlight;

      // สร้าง HTML icon สำหรับหมุดวัด
      const iconHtml = `
        <div class="custom-map-pin ${isSelected ? "custom-map-pin--selected" : ""} ${isHighlight ? "custom-map-pin--highlight" : ""}">
          <div class="custom-map-pin__body">
            <span class="custom-map-pin__num">${place.id}</span>
          </div>
          <div class="custom-map-pin__label">${place.name}</div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([place.gps.lat, place.gps.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : isHighlight ? 500 : 100,
      });

      marker.on("click", () => {
        setSelectedPlaceId(place.id);
        map.panTo([place.gps.lat, place.gps.lng], { animate: true, duration: 0.5 });
      });

      markersLayer.addLayer(marker);
    });
  }, [selectedZone, selectedPlaceId]);

  // วาดตำแหน่งผู้ใช้ "คุณอยู่ที่นี่ (You are here)"
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // ถ้าไม่มีตำแหน่ง ให้ลบหมุดเดิม
    if (!userLocation) {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      if (accuracyCircleRef.current) {
        map.removeLayer(accuracyCircleRef.current);
        accuracyCircleRef.current = null;
      }
      if (navLineRef.current) {
        map.removeLayer(navLineRef.current);
        navLineRef.current = null;
      }
      return;
    }

    const userLatLng = [userLocation.lat, userLocation.lng];

    // สร้างไอคอนหมุดตำแหน่งผู้ใช้ (Blue Radar Pulse Dot)
    const userIconHtml = `
      <div class="user-location-marker">
        <div class="user-location-marker__pulse"></div>
        <div class="user-location-marker__dot"></div>
        <div class="user-location-marker__label">คุณอยู่ที่นี่</div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: "user-location-div-icon",
      html: userIconHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userLatLng);
      userMarkerRef.current.setIcon(userIcon);
    } else {
      userMarkerRef.current = L.marker(userLatLng, {
        icon: userIcon,
        zIndexOffset: 2000,
      }).addTo(map);
    }

    // วงกลมแสดงรัศมีความแม่นยำ (Accuracy Circle)
    if (userLocation.accuracy && userLocation.accuracy > 0) {
      const radius = Math.min(userLocation.accuracy, 100);
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setLatLng(userLatLng);
        accuracyCircleRef.current.setRadius(radius);
      } else {
        accuracyCircleRef.current = L.circle(userLatLng, {
          radius: radius,
          color: "#3b82f6",
          fillColor: "#60a5fa",
          fillOpacity: 0.15,
          weight: 1,
        }).addTo(map);
      }
    }

    // วาดเส้นประนำทางไปยังสถานที่ที่เลือก (ถ้าระบุ)
    if (selectedPlace) {
      const targetLatLng = [selectedPlace.gps.lat, selectedPlace.gps.lng];
      if (navLineRef.current) {
        navLineRef.current.setLatLngs([userLatLng, targetLatLng]);
      } else {
        navLineRef.current = L.polyline([userLatLng, targetLatLng], {
          color: "#d4a843",
          weight: 3,
          dashArray: "6, 8",
          opacity: 0.85,
        }).addTo(map);
      }
    } else if (navLineRef.current) {
      map.removeLayer(navLineRef.current);
      navLineRef.current = null;
    }
  }, [userLocation, selectedPlace]);

  // ซูมไปยังตำแหน่งผู้ใช้
  const handleCenterOnUser = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 18, { animate: true });
    } else {
      onToggleGps();
    }
  };

  // ซูมกลับไปศูนย์กลางวัดท่าซุง
  const handleCenterOnTemple = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView([templeInfo.gps.lat, templeInfo.gps.lng], 17, { animate: true });
    setSelectedPlaceId(null);
  };

  return (
    <div className="live-gps-map-container">
      {/* แถบตัวกรองโซนด้านบนแผนที่ */}
      <div className="live-map-zone-bar">
        {zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            className={`live-map-zone-pill ${selectedZone === zone.id ? "live-map-zone-pill--active" : ""}`}
            onClick={() => setSelectedZone(zone.id)}
          >
            {zone.name}
          </button>
        ))}
      </div>

      {/* หน้าต่างแผนที่ Leaflet */}
      <div ref={mapContainerRef} className="live-gps-map-viewport" />

      {/* ปุ่มควบคุมบนแผนที่ (HUD Controls) */}
      <div className="live-map-hud-top-left">
        <button
          type="button"
          className={`live-map-hud-btn ${activeLayer === "satellite" ? "live-map-hud-btn--active" : ""}`}
          onClick={() => setActiveLayer(activeLayer === "streets" ? "satellite" : "streets")}
          title="สลับแผนที่ถนน/ดาวเทียม"
        >
          <Icon name="globe" size={16} />
          <span>{activeLayer === "satellite" ? "ภาพดาวเทียม" : "แผนที่ถนน"}</span>
        </button>
      </div>

      <div className="live-map-hud-right">
        {/* ปุ่มค้นหาตำแหน่งฉัน */}
        <button
          type="button"
          className={`live-map-hud-circle-btn ${gpsStatus === "active" ? "live-map-hud-circle-btn--gps-active" : ""}`}
          onClick={handleCenterOnUser}
          title={userLocation ? "ไปยังตำแหน่งปัจจุบันของฉัน" : "เปิดค้นหาตำแหน่ง GPS"}
        >
          <Icon name="pin" size={18} color={userLocation ? "#2563eb" : "var(--brown-deep)"} />
        </button>

        {/* ปุ่มรีเซ็ตกลับวัดท่าซุง */}
        <button
          type="button"
          className="live-map-hud-circle-btn"
          onClick={handleCenterOnTemple}
          title="จัดมุมมองศูนย์กลางวัดท่าซุง"
        >
          <Icon name="navTemple" size={18} color="var(--gold-dark)" />
        </button>
      </div>

      {/* แถบสถานะ GPS & แถบทดสอบจำลองเดิน */}
      <div className="live-map-gps-banner">
        <div className="live-map-gps-status">
          <span
            className={`live-map-gps-indicator ${
              gpsStatus === "active"
                ? "live-map-gps-indicator--active"
                : gpsStatus === "simulated"
                ? "live-map-gps-indicator--simulated"
                : gpsStatus === "locating"
                ? "live-map-gps-indicator--locating"
                : "live-map-gps-indicator--idle"
            }`}
          />
          <div className="live-map-gps-text">
            {gpsStatus === "active" && (
              <>
                <strong>GPS ทำงาน:</strong> กำลังติดตามพิกัดของคุณแบบ Real-time
              </>
            )}
            {gpsStatus === "locating" && "กำลังค้นหาสัญญาณ GPS ดาวเทียม..."}
            {gpsStatus === "simulated" && (
              <>
                <strong>โหมดจำลอง:</strong> กำลังเดินทดสอบในวัดท่าซุง
              </>
            )}
            {gpsStatus === "idle" && "ยังไม่ได้เปิด GPS — แตะปุ่มด้านข้างเพื่อระบุตำแหน่งของคุณ"}
            {gpsStatus === "error" && "ไม่พบสัญญาณ GPS — คุณสามารถกดปุ่มจำลองเดินเพื่อทดสอบได้"}
          </div>
        </div>

        <div className="live-map-gps-actions">
          <button
            type="button"
            className="btn btn--secondary"
            style={{ fontSize: "0.7rem", padding: "4px 8px" }}
            onClick={onToggleGps}
          >
            {gpsStatus === "active" ? "ปิด GPS" : "📍 เปิดตำแหน่งฉัน"}
          </button>

          <button
            type="button"
            className={`btn ${isSimulated ? "btn--saffron" : "btn--secondary"}`}
            style={{ fontSize: "0.7rem", padding: "4px 8px" }}
            onClick={onToggleSim}
          >
            {isSimulated ? "ปิดจำลอง" : "🚶 ลองเดินจำลอง"}
          </button>

          {isSimulated && (
            <button
              type="button"
              className="btn btn--primary"
              style={{ fontSize: "0.7rem", padding: "4px 8px" }}
              onClick={onNextSimStep}
            >
              ก้าวต่อไป ❯
            </button>
          )}
        </div>
      </div>

      {/* ป็อปอัปข้อมูลสถานที่ด้านล่าง (Bottom Sheet Popup เมื่อกดเลือกจุด) */}
      {selectedPlace && (
        <div className="live-map-place-sheet">
          <div className="live-map-place-sheet__header">
            <div className="live-map-place-sheet__badge">{selectedPlace.id}</div>
            <div className="live-map-place-sheet__title-wrap">
              <div className="live-map-place-sheet__name">{selectedPlace.name}</div>
              {selectedPlace.altName && (
                <div className="live-map-place-sheet__altname">{selectedPlace.altName}</div>
              )}
            </div>
            <button
              type="button"
              className="live-map-place-sheet__close"
              onClick={() => setSelectedPlaceId(null)}
              aria-label="ปิด"
            >
              ✕
            </button>
          </div>

          <div className="live-map-place-sheet__body">
            {/* ระยะทางจากตำแหน่งปัจจุบัน */}
            {userLocation && (
              <div className="live-map-place-sheet__distance">
                <Icon name="pin" size={14} color="#2563eb" />
                <span>
                  ห่างจากคุณประมาณ{" "}
                  <strong>{getFormattedDistanceTo(selectedPlace.gps.lat, selectedPlace.gps.lng)}</strong>
                </span>
              </div>
            )}

            {/* สถานะเปิด-ปิด */}
            {(() => {
              const status = getOpenStatus(selectedPlace.openingHours);
              return status.isOpen !== null ? (
                <div style={{ fontSize: "0.75rem", marginBottom: 6 }}>
                  <span
                    className={`place-card__status ${
                      status.isOpen ? "place-card__status--open" : "place-card__status--closed"
                    }`}
                  >
                    {status.label} {status.countdown && `(${status.countdown})`}
                  </span>
                </div>
              ) : null;
            })()}

            <p className="live-map-place-sheet__desc">{selectedPlace.description}</p>

            <div className="live-map-place-sheet__actions">
              <a
                href={getGoogleMapsUrl(selectedPlace.gps.lat, selectedPlace.gps.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
                style={{ flex: 1, justifyContent: "center" }}
              >
                <Icon name="pin" size={14} /> นำทาง Google Maps
              </a>
              {onSelectPlace && (
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => onSelectPlace(selectedPlace)}
                >
                  ดูในการ์ด ❯
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
