// Utility functions สำหรับ App วัดท่าซุง

/**
 * ตรวจสอบสถานะเปิด/ปิดจากเวลาปัจจุบัน
 * @param {Object} openingHours - ข้อมูลเวลาเปิด-ปิด
 * @returns {Object} { isOpen, currentSession, nextSession, countdown }
 */
export function getOpenStatus(openingHours) {
  if (!openingHours) return { isOpen: null, label: "เปิดตลอด", countdown: null };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  const sessions = [];

  if (openingHours.allDay) {
    sessions.push({
      name: "ตลอดวัน",
      open: parseTime(openingHours.allDay.open),
      close: parseTime(openingHours.allDay.close),
    });
  } else {
    if (openingHours.morning) {
      sessions.push({
        name: "รอบเช้า",
        open: parseTime(openingHours.morning.open),
        close: parseTime(openingHours.morning.close),
      });
    }
    if (openingHours.afternoon) {
      sessions.push({
        name: "รอบบ่าย",
        open: parseTime(openingHours.afternoon.open),
        close: parseTime(openingHours.afternoon.close),
      });
    }
  }

  // ถ้าเสาร์-อาทิตย์ และมี note ว่าเปิดต่อเนื่อง
  if (isWeekend && openingHours.note && openingHours.note.includes("เสาร์-อาทิตย์")) {
    const firstOpen = sessions[0]?.open || parseTime("09:00");
    const lastClose = sessions[sessions.length - 1]?.close || parseTime("16:00");
    sessions.length = 0;
    sessions.push({
      name: "เปิดต่อเนื่อง (วันหยุด)",
      open: firstOpen,
      close: lastClose,
    });
  }

  // หา session ปัจจุบัน
  for (const session of sessions) {
    if (currentMinutes >= session.open && currentMinutes < session.close) {
      const remaining = session.close - currentMinutes;
      return {
        isOpen: true,
        label: `เปิดอยู่`,
        session: session.name,
        countdown: formatCountdown(remaining),
        countdownMinutes: remaining,
      };
    }
  }

  // หา session ถัดไป
  for (const session of sessions) {
    if (currentMinutes < session.open) {
      const until = session.open - currentMinutes;
      return {
        isOpen: false,
        label: `ปิดอยู่`,
        session: session.name,
        nextOpen: formatTime(session.open),
        countdown: formatCountdown(until),
        countdownMinutes: until,
      };
    }
  }

  // ผ่านรอบสุดท้ายแล้ว
  return {
    isOpen: false,
    label: "ปิดแล้ววันนี้",
    session: null,
    nextOpen: sessions.length > 0 ? formatTime(sessions[0].open) : null,
    countdown: null,
  };
}

function parseTime(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function formatCountdown(minutes) {
  if (minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h} ชม. ${m} นาที`;
  return `${m} นาที`;
}

/**
 * สร้าง Google Maps Direction URL
 */
export function getGoogleMapsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * สร้าง Google Maps แสดงจุด
 */
export function getGoogleMapsPointUrl(lat, lng, name) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
}

/**
 * Format เบอร์โทรเป็น tel: link
 */
export function getTelUrl(phone) {
  return `tel:${phone.replace(/-/g, "")}`;
}
