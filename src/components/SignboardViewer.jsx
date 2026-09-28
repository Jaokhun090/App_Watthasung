import { useState } from "react";
import { templeInfo } from "../data/places";
import Icon from "./Icons";

export default function SignboardViewer({ onOpenLightbox }) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.4, 3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.4, 1));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="signboard-viewer">
      <div className="signboard-viewer__header">
        <div>
          <div className="signboard-viewer__title">
            <Icon name="gallery" size={16} color="var(--gold-dark)" />
            ภาพถ่ายป้ายผังวัดทางการ (39 จุด)
          </div>
          <div className="signboard-viewer__subtitle">
            ถ่ายจากป้ายผังวัดจริง สามารถซูมดูรายละเอียดได้
          </div>
        </div>

        <div className="signboard-viewer__controls">
          <button
            type="button"
            className="signboard-btn"
            onClick={handleZoomIn}
            title="ซูมเข้า"
          >
            +
          </button>
          <button
            type="button"
            className="signboard-btn"
            onClick={handleZoomOut}
            title="ซูมออก"
          >
            -
          </button>
          <button
            type="button"
            className="signboard-btn"
            onClick={handleResetZoom}
            title="รีเซ็ตขนาด"
          >
            ↺
          </button>
          <button
            type="button"
            className="btn btn--primary"
            style={{ fontSize: "0.7rem", padding: "4px 8px" }}
            onClick={onOpenLightbox}
          >
            <Icon name="gallery" size={12} /> ขยายเต็มจอ
          </button>
        </div>
      </div>

      <div className="signboard-viewer__viewport">
        <img
          src={templeInfo.mapSignboardImg}
          alt="ผังวัดท่าซุง"
          className="signboard-viewer__img"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
          onClick={onOpenLightbox}
        />
        <div className="signboard-viewer__hint">
          แตะที่ภาพเพื่อเปิดดูขนาดเต็มจอความละเอียดสูง
        </div>
      </div>
    </div>
  );
}
