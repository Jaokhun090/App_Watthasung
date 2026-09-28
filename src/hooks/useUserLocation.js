import { useState, useEffect, useRef, useCallback } from "react";
import { calculateDistance, formatDistance } from "../utils";
import { templeInfo } from "../data/places";

// จุดจำลองเดินเที่ยวในวัดท่าซุง สำหรับทดสอบตอนไม่ได้อยู่ที่วัดจริง
export const SIMULATED_STOPS = [
  { name: "จุดจอดรถหน้าปราสาททองคำ", lat: 15.3327, lng: 100.0721 },
  { name: "หน้าปราสาททองคำ", lat: 15.3328, lng: 100.0725 },
  { name: "หน้ามหาวิหารแก้ว 100 เมตร", lat: 15.3322, lng: 100.0724 },
  { name: "วิหารสมเด็จองค์ปฐม", lat: 15.3325, lng: 100.0728 },
  { name: "พระยืน 30 ศอก", lat: 15.3326, lng: 100.0726 },
  { name: "ริมแม่น้ำสะแกกรัง (วังมัจฉา)", lat: 15.3330, lng: 100.0760 },
  { name: "โบสถ์เก่า & หลวงพ่อศักดิ์สิทธิ์", lat: 15.3321, lng: 100.0762 },
];

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("idle"); // idle, locating, active, error, simulated
  const [errorMsg, setErrorMsg] = useState("");
  const [isSimulated, setIsSimulated] = useState(false);
  const [simIndex, setSimIndex] = useState(0);
  const watchIdRef = useRef(null);

  // เริ่มเปิดรับพิกัด GPS จริง
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatus("error");
      setErrorMsg("อุปกรณ์นี้ไม่รองรับระบบ GPS Geolocation");
      return;
    }

    setGpsStatus("locating");
    setErrorMsg("");
    setIsSimulated(false);

    // ล้าง watch เดิมถ้ามี
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        });
        setGpsStatus("active");
      },
      (err) => {
        let msg = "ไม่สามารถเข้าถึงตำแหน่งได้";
        if (err.code === 1) msg = "คุณปฏิเสธการอนุญาตให้เข้าถึงตำแหน่ง GPS";
        else if (err.code === 2) msg = "ไม่สามารถระบุตำแหน่งสัญญาณ GPS ได้ในขณะนี้";
        else if (err.code === 3) msg = "หมดเวลาการค้นหาตำแหน่ง GPS";
        setErrorMsg(msg);
        setGpsStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );
  }, []);

  // ปิดระบบ GPS
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setUserLocation(null);
    setGpsStatus("idle");
    setIsSimulated(false);
  }, []);

  // สลับเปิด/ปิด GPS
  const toggleTracking = useCallback(() => {
    if (gpsStatus === "active" || gpsStatus === "locating" || gpsStatus === "simulated") {
      stopTracking();
    } else {
      startTracking();
    }
  }, [gpsStatus, startTracking, stopTracking]);

  // โหมดจำลองเดินเที่ยวในวัด (สำหรับทดสอบ)
  const toggleSimulation = useCallback(() => {
    if (isSimulated) {
      stopTracking();
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsSimulated(true);
      setGpsStatus("simulated");
      const current = SIMULATED_STOPS[0];
      setUserLocation({
        lat: current.lat,
        lng: current.lng,
        accuracy: 10,
        heading: 45,
        speed: 1.2,
        timestamp: Date.now(),
      });
      setSimIndex(0);
    }
  }, [isSimulated, stopTracking]);

  // เปลี่ยนจุดจำลองถัดไป
  const nextSimulatedStep = useCallback(() => {
    if (!isSimulated) return;
    const nextIdx = (simIndex + 1) % SIMULATED_STOPS.length;
    setSimIndex(nextIdx);
    const pt = SIMULATED_STOPS[nextIdx];
    setUserLocation({
      lat: pt.lat,
      lng: pt.lng,
      accuracy: 8,
      heading: (nextIdx * 60) % 360,
      speed: 1.2,
      timestamp: Date.now(),
    });
  }, [isSimulated, simIndex]);

  // คำนวณระยะห่างไปยังสถานที่เป้าหมาย (เมตร)
  const getDistanceTo = useCallback(
    (targetLat, targetLng) => {
      if (!userLocation || !targetLat || !targetLng) return null;
      return calculateDistance(userLocation.lat, userLocation.lng, targetLat, targetLng);
    },
    [userLocation]
  );

  // คำนวณระยะห่างเป็นข้อความ เช่น "150 ม." หรือ "2.4 กม."
  const getFormattedDistanceTo = useCallback(
    (targetLat, targetLng) => {
      const dist = getDistanceTo(targetLat, targetLng);
      return formatDistance(dist);
    },
    [getDistanceTo]
  );

  // คำนวณระยะห่างไปยังศูนย์กลางวัดท่าซุง
  const distanceToTemple = getDistanceTo(templeInfo.gps.lat, templeInfo.gps.lng);
  const formattedDistanceToTemple = formatDistance(distanceToTemple);
  const isInsideTemple = distanceToTemple !== null && distanceToTemple <= 1500; // ภายในรัศมี 1.5 กม.

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    userLocation,
    gpsStatus,
    errorMsg,
    isTracking: gpsStatus === "active" || gpsStatus === "locating",
    isSimulated,
    simIndex,
    currentSimStop: isSimulated ? SIMULATED_STOPS[simIndex] : null,
    distanceToTemple,
    formattedDistanceToTemple,
    isInsideTemple,
    startTracking,
    stopTracking,
    toggleTracking,
    toggleSimulation,
    nextSimulatedStep,
    getDistanceTo,
    getFormattedDistanceTo,
  };
}
