import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { places, templeInfo, zones } from "../data/places";
import Icon, { placeIcons } from "./Icons";
import SideDetailDrawer from "./SideDetailDrawer";

// ============================================================================
// การจัดผังพิกัด 3D ของสถานที่ทั้ง 40 จุด
// อิงการจัดโซนตาม "20260927_122430.jpg" ผสมผสานรายละเอียดสถาปัตยกรรมจาก "แผนผัง01.jpg"
// มีระยะห่างที่คำนวณอย่างแม่นยำ ไม่มีการซ้อนทับกัน (Zero Overlap) 100% (ระยะห่างขั้นต่ำ >= 5.0 units)
// ============================================================================
export const BUILDING_LAYOUT = {
  // --- โซนริมแม่น้ำสะแกกรัง & วัดเก่า (ฝั่งใต้ / Z = 38 ถึง 80) ---
  40: { x: -130, z: 76, w: 14, d: 7, h: 5, type: "boat", label: "เรือคนึงหา (จามเทวีนาวา)", zone: "old" },
  21: { x: -108, z: 62, w: 14, d: 10, h: 7, type: "pavilion", label: "ศาลาบูรพาจารย์", zone: "pavilion" },
  33: { x: -76, z: 76, w: 22, d: 12, h: 4, type: "raft", label: "แพเลี้ยงปลา (วังมัจฉา)", zone: "old" },
  27: { x: -120, z: 38, w: 18, d: 11, h: 7, type: "hall", label: "อาคารเสริมศรี", zone: "pavilion" },
  31: { x: -94, z: 38, w: 16, d: 12, h: 8, type: "hall", label: "หอฉัน", zone: "pavilion" },
  30: { x: -68, z: 38, w: 18, d: 12, h: 10, type: "fiveBuddha", label: "วิหารหลวงพ่อ 5 พระองค์", zone: "old" },
  32: { x: -32, z: 58, w: 20, d: 12, h: 10, type: "ancientUbosot", label: "พระอุโบสถเก่า (โบสถ์เก่า)", zone: "old" },
  36: { x: -8, z: 58, w: 16, d: 11, h: 9, type: "vihara", label: "วิหารหลวงพ่อศักดิ์สิทธิ์", zone: "old" },
  38: { x: -8, z: 75, w: 12, d: 12, h: 8, type: "bodhiShrine", label: "วิหารใต้ต้นโพธิ์", zone: "old" },
  34: { x: 15, z: 56, w: 11, d: 11, h: 12, type: "crystalMondop", label: "มณฑปแก้วพระองค์ที่ 10-11", zone: "old" },
  35: { x: 33, z: 56, w: 12, d: 12, h: 13, type: "goldMondop", label: "มณฑปท้าวจาตุมหาราช", zone: "old" },
  37: { x: 20, z: 75, w: 20, d: 12, h: 8, type: "office", label: "ตึกรับแขก (จำหน่ายวัตถุมงคล/หนังสือ)", zone: "pavilion" },
  39: { x: 75, z: 65, w: 32, d: 14, h: 11, type: "school", label: "โรงเรียนพระสุธรรมยานเถระวิทยา", zone: "pavilion" },

  // --- โซนศาลา & อาคารบริการฝั่งตะวันตก (Z = -60 ถึง 20, X = -140 ถึง -15) ---
  19: { x: -130, z: 12, w: 24, d: 12, h: 9, type: "school", label: "โรงเรียนพระพินิจอักษร (ทองดี)", zone: "pavilion" },
  17: { x: -95, z: 10, w: 36, d: 24, h: 14, type: "curvedVault", label: "พระมหาวิหาร 100 ปี (ศาลา 12 ไร่)", zone: "pavilion" },
  20: { x: -58, z: 14, w: 22, d: 14, h: 13, type: "newUbosot", label: "พระอุโบสถ (โบสถ์ใหม่)", zone: "new" },
  22: { x: -74, z: -14, w: 16, d: 12, h: 8, type: "pavilion", label: "ศาลานวราช (ติดต่อที่พัก)", zone: "pavilion" },
  25: { x: -52, z: -14, w: 16, d: 11, h: 8, type: "hall", label: "อาคารธรรมวิโมกข์", zone: "pavilion" },
  18: { x: -24, z: 12, w: 26, d: 16, h: 10, type: "hall", label: "หอประชุมพระสุธรรมยานเถระ (ศาลา 4 ไร่)", zone: "pavilion" },
  23: { x: -24, z: -10, w: 22, d: 14, h: 9, type: "hall", label: "ศาลา 2 ไร่", zone: "pavilion" },
  24: { x: -24, z: -32, w: 22, d: 13, h: 9, type: "hall", label: "ศาลา 3 ไร่", zone: "pavilion" },
  1: { x: -64, z: -48, w: 26, d: 26, h: 22, type: "prasatThong", label: "ปราสาททองกาญจนาภิเษก (ปราสาททองคำ)", zone: "new" },
  29: { x: -20, z: -56, w: 14, d: 12, h: 8, type: "forestVihara", label: "วิหารหลวงพ่อพระมหากัสสป", zone: "new" },

  // --- โซนวัฒนธรรม & ลานเหนือ (Z = -70 ถึง -26, X = 0 ถึง 80) ---
  2: { x: 10, z: -65, w: 24, d: 14, h: 10, type: "museum", label: "พิพิธภัณฑ์สมบัติพ่อให้", zone: "new" },
  26: { x: 8, z: -35, w: 12, d: 12, h: 8, type: "monument", label: "อนุสาวรีย์พระเจ้าพรหมมหาราช", zone: "pavilion" },
  5: { x: 30, z: -35, w: 20, d: 14, h: 7, type: "plaza", label: "ลาน 25 ไร่", zone: "pavilion" },
  28: { x: 36, z: -65, w: 12, d: 12, h: 14, type: "stupa", label: "เจดีย์พุดตาน", zone: "new" },
  3: { x: 56, z: -65, w: 14, d: 14, h: 24, type: "standingBuddha", label: "พระยืน 30 ศอก (หลวงพ่อเงินไหลมาเทมา)", zone: "new" },
  7: { x: 78, z: -65, w: 18, d: 12, h: 9, type: "whiteBuilding", label: "ตึกขาว", zone: "new" },
  9: { x: 62, z: -32, w: 24, d: 18, h: 6, type: "pondGazebo", label: "สวนสมเด็จฯ (สระน้ำ & ศาลากลางน้ำ)", zone: "pavilion" },

  // --- โซนมหาวิหารแก้ว 100 เมตร & สิ่งอำนวยความสะดวก (ฝั่งตะวันออก / Z = -55 ถึง 32, X = 25 ถึง 140) ---
  8: { x: 26, z: 5, w: 12, d: 12, h: 13, type: "goldMondop", label: "มณฑปพระศรีอาริยเมตไตรย", zone: "new" },
  4: { x: 46, z: 5, w: 18, d: 14, h: 14, type: "somdejPrathom", label: "วิหารสมเด็จองค์ปฐม", zone: "new" },
  12: { x: 88, z: 0, w: 52, d: 18, h: 14, type: "vihara100m", label: "มหาวิหารแก้ว 100 เมตร", zone: "new" },
  11: { x: 66, z: 25, w: 14, d: 10, h: 7, type: "shop", label: "ร้านอิ่มบุญ (ครัวร้อยเมตร)", zone: "pavilion" },
  13: { x: 84, z: 25, w: 12, d: 10, h: 7, type: "shop", label: "Tha Sung Coffee (กาแฟท่าซุง)", zone: "pavilion" },
  14: { x: 102, z: 25, w: 14, d: 10, h: 7, type: "shop", label: "ร้านค้าสวัสดิการ", zone: "pavilion" },
  6: { x: 124, z: -25, w: 16, d: 16, h: 14, type: "crystalMondop", label: "วิหารพระวิสุทธิเทพ (พระจุฬามณี)", zone: "new" },
  10: { x: 114, z: -52, w: 18, d: 13, h: 9, type: "hall", label: "ตึกพระเถระ", zone: "pavilion" },
  15: { x: 128, z: 4, w: 16, d: 12, h: 8, type: "library", label: "ห้องสมุดประชาชนเฉลิมราชกุมารี", zone: "pavilion" },
  16: { x: 128, z: 26, w: 16, d: 12, h: 10, type: "retreat", label: "อาคารที่พักผู้ปฏิบัติธรรมพระพินิจอักษร", zone: "pavilion" },
};

// 19 จุดแลนด์มาร์คไฮไลท์หลักที่แสดงป้ายชื่อเต็ม (Major Landmarks)
export const MAJOR_LANDMARK_IDS = new Set([
  1, 12, 3, 20, 32, 17, 9, 4, 2, 40, 33, 38, 6, 28, 26, 18, 39, 30, 36
]);

// ============================================================================
// ฟังก์ชันสร้างหลังคาตรง ไม่บิด ไม่เบี้ยว (100% Straight Procedural Roofs)
// ============================================================================

// 1. หลังคาทรงจั่วตรง (Straight Gable Roof)
function createStraightGableRoof(w, d, h, mat) {
  const shape = new THREE.Shape();
  let length;
  let rotateY = 0;

  if (w >= d) {
    // สันหลังคาวิ่งตามแกน X, หน้าจั่วหันไปทางแกน Z (+Z, -Z)
    shape.moveTo(-d / 2, 0);
    shape.lineTo(0, h);
    shape.lineTo(d / 2, 0);
    shape.closePath();
    length = w;
    rotateY = Math.PI / 2;
  } else {
    // สันหลังคาวิ่งตามแกน Z, หน้าจั่วหันไปทางแกน X (+X, -X)
    shape.moveTo(-w / 2, 0);
    shape.lineTo(0, h);
    shape.lineTo(w / 2, 0);
    shape.closePath();
    length = d;
    rotateY = 0;
  }

  const geo = new THREE.ExtrudeGeometry(shape, { steps: 1, depth: length, bevelEnabled: false });
  geo.center();
  if (rotateY !== 0) geo.rotateY(rotateY);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

// 2. หลังคาทรงปั้นหยาตรง (Straight Hip Roof)
function createHipRoofMesh(w, d, h, mat) {
  const geo = new THREE.BufferGeometry();
  const halfW = w / 2;
  const halfD = d / 2;

  const v0 = [-halfW, 0, -halfD];
  const v1 = [halfW, 0, -halfD];
  const v2 = [halfW, 0, halfD];
  const v3 = [-halfW, 0, halfD];

  let t0, t1;
  if (w >= d) {
    const ridgeHalf = Math.max(0, (w - d * 0.75) / 2);
    t0 = [-ridgeHalf, h, 0];
    t1 = [ridgeHalf, h, 0];
  } else {
    const ridgeHalf = Math.max(0, (d - w * 0.75) / 2);
    t0 = [0, h, -ridgeHalf];
    t1 = [0, h, ridgeHalf];
  }

  const positions = [];
  function addTri(p1, p2, p3) {
    positions.push(...p1, ...p2, ...p3);
  }
  function addQuad(p1, p2, p3, p4) {
    addTri(p1, p2, p3);
    addTri(p1, p3, p4);
  }

  if (w >= d) {
    addQuad(v3, v2, t1, t0); // Front face (+Z)
    addQuad(v1, v0, t0, t1); // Back face (-Z)
    addTri(v0, v3, t0);       // Left face (-X)
    addTri(v2, v1, t1);       // Right face (+X)
  } else {
    addQuad(v0, v3, t1, t0); // Left face (-X)
    addQuad(v2, v1, t0, t1); // Right face (+X)
    addTri(v1, v0, t0);       // Back face (-Z)
    addTri(v3, v2, t1);       // Front face (+Z)
  }

  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

// 3. หลังคาซ้อนชั้นทรงไทยประยุกต์พร้อมหน้าบัน (Multi-tier Thai Roof)
function createThaiTieredRoof(w, d, h, matRoof, matGold) {
  const roofGroup = new THREE.Group();

  // ชั้นที่ 1: ชายคาหลักด้านล่าง
  const lowerH = h * 0.58;
  const lowerRoof = createStraightGableRoof(w, d, lowerH, matRoof);
  lowerRoof.position.y = lowerH / 2;
  roofGroup.add(lowerRoof);

  // ชั้นที่ 2: สันหลังคาชั้นบนยกสเต็ป
  const upperW = w >= d ? w * 0.84 : w;
  const upperD = w >= d ? d : d * 0.84;
  const upperH = h * 0.52;
  const upperRoof = createStraightGableRoof(upperW, upperD, upperH, matRoof);
  upperRoof.position.y = lowerH * 0.68 + upperH / 2;
  roofGroup.add(upperRoof);

  // หน้าบันช่อฟ้าใบระกา (Gable Pediment) หันออกด้านหน้า (+Z)
  if (matGold) {
    const pedW = w >= d ? d * 0.58 : w * 0.58;
    const pedH = upperH * 0.95;
    const pedShape = new THREE.Shape();
    pedShape.moveTo(-pedW / 2, 0);
    pedShape.lineTo(0, pedH);
    pedShape.lineTo(pedW / 2, 0);
    pedShape.closePath();
    const pedGeo = new THREE.ExtrudeGeometry(pedShape, { steps: 1, depth: 0.8, bevelEnabled: false });
    pedGeo.center();
    const pedMesh = new THREE.Mesh(pedGeo, matGold);
    pedMesh.position.set(0, lowerH * 0.68 + pedH / 2, d / 2 + 0.45);
    roofGroup.add(pedMesh);

    // ช่อฟ้าปลายสันหลังคา
    const chofa1 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.0, 6), matGold);
    chofa1.position.set(-w / 2 + 0.6, lowerH * 0.68 + upperH + 0.6, 0);
    chofa1.rotation.z = Math.PI / 6;
    roofGroup.add(chofa1);

    const chofa2 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.0, 6), matGold);
    chofa2.position.set(w / 2 - 0.6, lowerH * 0.68 + upperH + 0.6, 0);
    chofa2.rotation.z = -Math.PI / 6;
    roofGroup.add(chofa2);
  }

  return roofGroup;
}

// ============================================================================
// ฟังก์ชันสร้าง Canvas Sprite Badge ตัวอักษรใหญ่ คมชัด อ่านง่ายพิเศษ
// ============================================================================
function createLabelSprite(placeId, name, isMajor = false, isGolden = false) {
  const canvas = document.createElement("canvas");

  if (isMajor) {
    // -------------------------------------------------------------
    // ป้ายแคปซูลใหญ่พิเศษ สำหรับ 19 แลนด์มาร์คสำคัญ (1200 x 280)
    // -------------------------------------------------------------
    canvas.width = 1200;
    canvas.height = 280;
    const ctx = canvas.getContext("2d");

    const r = 58;
    const x = 16, y = 20, w = 1168, h = 240;

    // เงาพื้นหลังนุ่มลึก คมเข้ม
    ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    // ไล่เฉดสีพื้นหลัง
    const bgGrad = ctx.createLinearGradient(x, y, x, y + h);
    if (isGolden) {
      bgGrad.addColorStop(0, "rgba(217, 119, 6, 0.98)");
      bgGrad.addColorStop(1, "rgba(146, 64, 14, 0.98)");
    } else {
      bgGrad.addColorStop(0, "rgba(15, 23, 42, 0.96)");
      bgGrad.addColorStop(1, "rgba(30, 41, 59, 0.96)");
    }
    ctx.fillStyle = bgGrad;
    ctx.strokeStyle = isGolden ? "#fef08a" : "#f59e0b";
    ctx.lineWidth = 7;

    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();

    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0; // ปิดเงาเพื่อวาดองค์ประกอบด้านในให้คมชัด

    // วงกลมหมายเลขสีสดใส
    ctx.fillStyle = isGolden ? "#fef08a" : "#f59e0b";
    ctx.beginPath();
    ctx.arc(135, 140, 74, 0, Math.PI * 2);
    ctx.fill();

    // ตัวเลขในวงกลม (ใหญ่พิเศษ หนา ชัดเจน)
    ctx.fillStyle = isGolden ? "#78350f" : "#0f172a";
    ctx.font = "900 86px 'Noto Sans Thai', 'Prompt', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(placeId.toString(), 135, 144);

    // คำนวณขนาดตัวอักษรของชื่อให้อ่านง่ายและพอดีที่สุด
    let fontSize = 84;
    ctx.font = `bold ${fontSize}px 'Noto Sans Thai', 'Prompt', sans-serif`;
    let textW = ctx.measureText(name).width;
    const maxTextW = 890;
    if (textW > maxTextW) {
      fontSize = Math.max(62, Math.floor((maxTextW / textW) * fontSize));
      ctx.font = `bold ${fontSize}px 'Noto Sans Thai', 'Prompt', sans-serif`;
      textW = ctx.measureText(name).width;
    }

    let displayText = name;
    if (textW > maxTextW) {
      while (ctx.measureText(displayText + "…").width > maxTextW && displayText.length > 4) {
        displayText = displayText.slice(0, -1);
      }
      displayText += "…";
    }

    // ตัวหนังสือชื่อสถานที่ ขนาดใหญ่ ชัดเจน อ่านง่าย
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillText(displayText, 235, 144);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.renderOrder = 999;
    // ขยายขนาด Sprite ในโลก 3D ให้ใหญ่เต็มตา อ่านชัดเจน
    sprite.scale.set(52, 12.5, 1);
    return sprite;
  } else {
    // -------------------------------------------------------------
    // ป้ายแคปซูลขนาดกะทัดรัด พร้อมชื่อและหมายเลข สำหรับสถานที่ทั่วไป (800 x 240)
    // -------------------------------------------------------------
    canvas.width = 800;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");

    const r = 48;
    const x = 12, y = 16, w = 776, h = 208;

    // เงาพื้นหลัง
    ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
    ctx.strokeStyle = isGolden ? "#fef08a" : "#38bdf8";
    ctx.lineWidth = 5.5;

    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();

    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;

    // วงกลมหมายเลข
    ctx.fillStyle = isGolden ? "#f59e0b" : "#0284c7";
    ctx.beginPath();
    ctx.arc(110, 120, 62, 0, Math.PI * 2);
    ctx.fill();

    // ตัวเลขในวงกลม
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 74px 'Noto Sans Thai', 'Prompt', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(placeId.toString(), 110, 124);

    // ตัวหนังสือชื่อสถานที่
    let fontSize = 70;
    ctx.font = `bold ${fontSize}px 'Noto Sans Thai', 'Prompt', sans-serif`;
    let textW = ctx.measureText(name).width;
    const maxTextW = 560;
    if (textW > maxTextW) {
      fontSize = Math.max(52, Math.floor((maxTextW / textW) * fontSize));
      ctx.font = `bold ${fontSize}px 'Noto Sans Thai', 'Prompt', sans-serif`;
      textW = ctx.measureText(name).width;
    }

    let displayText = name;
    if (textW > maxTextW) {
      while (ctx.measureText(displayText + "…").width > maxTextW && displayText.length > 4) {
        displayText = displayText.slice(0, -1);
      }
      displayText += "…";
    }

    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.fillText(displayText, 195, 124);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.renderOrder = 998;
    sprite.scale.set(36, 10.8, 1);
    return sprite;
  }
}

export default function DigitalTwin3D({
  userLocation,
  gpsStatus,
  getFormattedDistanceTo,
  onSelectPlace,
  onOpenPhoto,
}) {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Selection & UI State
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [selectedZone, setSelectedZone] = useState("all");
  const [isNightMode, setIsNightMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  // References for interactive objects
  const interactiveObjectsRef = useRef([]);
  const buildingMeshesMapRef = useRef({});
  const labelSpritesMapRef = useRef({});
  const selectionBeaconRef = useRef(null);
  const lightsRef = useRef({});
  const nightLightsGroupRef = useRef(null);
  const waterMeshRef = useRef(null);

  // Camera animation
  const isFlyingRef = useRef(false);
  const flyTargetPosRef = useRef(new THREE.Vector3());
  const flyTargetLookRef = useRef(new THREE.Vector3());

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || null;

  // Fly Camera to Building
  const flyToBuilding = useCallback((pId) => {
    setSelectedPlaceId(pId);
    setIsDrawerOpen(true);
    const bInfo = BUILDING_LAYOUT[pId];
    if (!bInfo || !controlsRef.current || !cameraRef.current) return;

    flyTargetLookRef.current.set(bInfo.x, 3, bInfo.z);
    flyTargetPosRef.current.set(bInfo.x + 22, 24, bInfo.z + 30);
    isFlyingRef.current = true;

    if (selectionBeaconRef.current) {
      selectionBeaconRef.current.position.set(bInfo.x, 0.4, bInfo.z);
      selectionBeaconRef.current.visible = true;
    }
  }, []);

  const handleSelectBuilding = useCallback(
    (pId) => {
      flyToBuilding(pId);
      const placeObj = places.find((p) => p.id === pId);
      if (placeObj && onSelectPlace) {
        onSelectPlace(placeObj);
      }
    },
    [flyToBuilding, onSelectPlace]
  );

  // Reset Camera View
  const handleResetCamera = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current || !mountRef.current) return;
    const isMobile = mountRef.current.clientWidth < 600;
    flyTargetLookRef.current.set(0, 0, 10);
    if (isMobile) {
      flyTargetPosRef.current.set(0, 160, 210);
    } else {
      flyTargetPosRef.current.set(0, 125, 165);
    }
    isFlyingRef.current = true;
    setSelectedPlaceId(null);
    setIsDrawerOpen(false);
    if (selectionBeaconRef.current) {
      selectionBeaconRef.current.visible = false;
    }
  }, []);

  // Top-down Plan View
  const handleTopDownView = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    flyTargetLookRef.current.set(0, 0, 10);
    flyTargetPosRef.current.set(0, 240, 12);
    isFlyingRef.current = true;
  }, []);

  // Zoom controls
  const handleZoom = (delta) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    cameraRef.current.position.addScaledVector(dir, delta * 25);
    controlsRef.current.update();
  };

  // ==========================================================================
  // Three.js Scene Setup & Architectural Construction
  // ==========================================================================
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0c1524");
    scene.fog = new THREE.FogExp2("#0c1524", 0.0028);
    sceneRef.current = scene;

    // 2. Camera
    const isMobile = width < 600;
    const initialCamY = isMobile ? 160 : 125;
    const initialCamZ = isMobile ? 210 : 165;
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, initialCamY, initialCamZ);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // ไม่ให้มุมกล้องมุดลงใต้ผิวดิน
    controls.minDistance = 15;
    controls.maxDistance = 500;
    controls.target.set(0, 0, 10);
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight("#fef3c7", 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#fffbeb", 1.8);
    dirLight.position.set(90, 150, 70);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 400;
    dirLight.shadow.camera.left = -180;
    dirLight.shadow.camera.right = 180;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -180;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight("#bae6fd", "#78350f", 0.6);
    scene.add(hemiLight);

    lightsRef.current = { ambient: ambientLight, dir: dirLight, hemi: hemiLight };

    // Night Mode Landmark Spotlights Group
    const nightLights = new THREE.Group();
    nightLights.visible = false;

    // 1. Spotlight on Prasat Thong Kham
    const lightPrasat = new THREE.PointLight("#f59e0b", 4.5, 70);
    lightPrasat.position.set(-64, 18, -48);
    nightLights.add(lightPrasat);

    // 2. Spotlight on Vihara 100m
    const lightVihara = new THREE.PointLight("#38bdf8", 4.0, 90);
    lightVihara.position.set(88, 14, 0);
    nightLights.add(lightVihara);

    // 3. Spotlight on Standing Buddha
    const lightBuddha = new THREE.PointLight("#fbbf24", 5.0, 60);
    lightBuddha.position.set(56, 20, -65);
    nightLights.add(lightBuddha);

    // 4. Spotlight on Ubosot
    const lightUbosot = new THREE.PointLight("#f97316", 3.8, 60);
    lightUbosot.position.set(-58, 14, 14);
    nightLights.add(lightUbosot);

    // 5. Spotlight on Pond Gazebo
    const lightPond = new THREE.PointLight("#34d399", 3.2, 50);
    lightPond.position.set(62, 8, -32);
    nightLights.add(lightPond);

    scene.add(nightLights);
    nightLightsGroupRef.current = nightLights;

    // 6. Materials Palette (Faithful to Wat Tha Sung & แผนผัง01.jpg)
    const matGold = new THREE.MeshStandardMaterial({
      color: "#f59e0b",
      metalness: 0.85,
      roughness: 0.22,
      emissive: "#b45309",
      emissiveIntensity: 0.12,
    });
    const matWhiteStucco = new THREE.MeshStandardMaterial({
      color: "#f8fafc",
      roughness: 0.35,
      metalness: 0.05,
    });
    const matMirroredGlass = new THREE.MeshStandardMaterial({
      color: "#e0f2fe",
      metalness: 0.9,
      roughness: 0.08,
      transparent: true,
      opacity: 0.9,
    });
    const matThaiRedRoof = new THREE.MeshStandardMaterial({
      color: "#991b1b",
      roughness: 0.4,
      metalness: 0.1,
    });
    const matAntiqueTile = new THREE.MeshStandardMaterial({
      color: "#78350f",
      roughness: 0.6,
      metalness: 0.1,
    });
    const matWater = new THREE.MeshStandardMaterial({
      color: "#0284c7",
      roughness: 0.1,
      metalness: 0.7,
      transparent: true,
      opacity: 0.88,
    });
    const matGround = new THREE.MeshStandardMaterial({
      color: "#d8c7a6", // Warm sacred temple sand/tile
      roughness: 0.85,
      metalness: 0.05,
    });
    const matRoad = new THREE.MeshStandardMaterial({
      color: "#334155",
      roughness: 0.9,
      metalness: 0.05,
    });
    const matGrass = new THREE.MeshStandardMaterial({
      color: "#2e7d32",
      roughness: 0.8,
      metalness: 0.05,
    });

    // 7. Ground Terrain Base
    const groundGeo = new THREE.PlaneGeometry(360, 240);
    const groundMesh = new THREE.Mesh(groundGeo, matGround);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, -0.05, 0);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Green Meditation Garden Zones (ป่าธุดงค์ / แปลงเกษตรอินทรีย์)
    const forestGeo = new THREE.PlaneGeometry(55, 36);
    const forestMesh = new THREE.Mesh(forestGeo, matGrass);
    forestMesh.rotation.x = -Math.PI / 2;
    forestMesh.position.set(-20, 0.02, -56);
    scene.add(forestMesh);

    // 8. Sakae Krang River (แม่น้ำสะแกกรัง ทางทิศใต้ Z: 75 ถึง 110)
    const riverGeo = new THREE.PlaneGeometry(380, 50, 40, 10);
    const riverMesh = new THREE.Mesh(riverGeo, matWater);
    riverMesh.rotation.x = -Math.PI / 2;
    riverMesh.position.set(0, 0.05, 88);
    riverMesh.receiveShadow = true;
    scene.add(riverMesh);
    waterMeshRef.current = riverMesh;

    // River embankment / quay wall
    const quayGeo = new THREE.BoxGeometry(360, 1.2, 3);
    const quayMat = new THREE.MeshStandardMaterial({ color: "#64748b", roughness: 0.8 });
    const quay = new THREE.Mesh(quayGeo, quayMat);
    quay.position.set(0, 0.6, 64);
    scene.add(quay);

    // 9. Roadways Grid (ถนนหลักตามรูปผัง 20260927_122430)
    const roadGroup = new THREE.Group();
    // ถนนหน้าแม่น้ำ (West - East)
    const riverRoad = new THREE.Mesh(new THREE.PlaneGeometry(340, 8), matRoad);
    riverRoad.rotation.x = -Math.PI / 2;
    riverRoad.position.set(0, 0.03, 49);
    roadGroup.add(riverRoad);

    // ถนนกลางเชื่อมต่อเหนือ-ใต้
    const midRoad = new THREE.Mesh(new THREE.PlaneGeometry(8, 70), matRoad);
    midRoad.rotation.x = -Math.PI / 2;
    midRoad.position.set(-2, 0.03, 15);
    roadGroup.add(midRoad);

    // ถนนหน้าวิหารแก้ว 100 เมตร
    const viharaRoad = new THREE.Mesh(new THREE.PlaneGeometry(160, 7), matRoad);
    viharaRoad.rotation.x = -Math.PI / 2;
    viharaRoad.position.set(70, 0.03, 14);
    roadGroup.add(viharaRoad);

    // ถนนหน้าปราสาททองคำ
    const prasatRoad = new THREE.Mesh(new THREE.PlaneGeometry(140, 7), matRoad);
    prasatRoad.rotation.x = -Math.PI / 2;
    prasatRoad.position.set(-65, 0.03, -25);
    roadGroup.add(prasatRoad);

    scene.add(roadGroup);

    // 10. Selection Ring Beacon (Pulsing ring at active building)
    const beaconGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(8, 10, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: "#38bdf8",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    beaconGroup.add(ringMesh);

    const beamGeo = new THREE.CylinderGeometry(0.6, 6, 45, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: "#38bdf8",
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = 22.5;
    beaconGroup.add(beamMesh);

    beaconGroup.visible = false;
    scene.add(beaconGroup);
    selectionBeaconRef.current = beaconGroup;

    // ========================================================================
    // BUILD ALL 40 ARCHITECTURAL STRUCTURES (From แผนผัง01.jpg & 20260927_122430.jpg)
    // ========================================================================
    interactiveObjectsRef.current = [];
    buildingMeshesMapRef.current = {};
    labelSpritesMapRef.current = {};

    Object.entries(BUILDING_LAYOUT).forEach(([idStr, b]) => {
      const placeId = parseInt(idStr, 10);
      const group = new THREE.Group();
      group.position.set(b.x, 0, b.z);
      group.userData = { placeId, label: b.label, zone: b.zone };

      // ----------------------------------------------------------------------
      // Custom Architectural Types based directly on แผนผัง01.jpg
      // ----------------------------------------------------------------------
      if (b.type === "prasatThong") {
        // 1. ปราสาททองกาญจนาภิเษก: 3-tiered golden pyramid palace with spires
        const tier1 = new THREE.Mesh(new THREE.BoxGeometry(b.w, 4.5, b.d), matGold);
        tier1.position.y = 2.25;
        tier1.castShadow = true;
        group.add(tier1);

        const tier2 = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.76, 4.2, b.d * 0.76), matGold);
        tier2.position.y = 6.6;
        tier2.castShadow = true;
        group.add(tier2);

        const tier3 = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.52, 3.8, b.d * 0.52), matGold);
        tier3.position.y = 10.6;
        tier3.castShadow = true;
        group.add(tier3);

        // Center Grand Golden Prang Tower
        const prangBase = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 4, 8), matGold);
        prangBase.position.y = 14.5;
        group.add(prangBase);

        const spire = new THREE.Mesh(new THREE.ConeGeometry(2.4, 9, 8), matGold);
        spire.position.y = 21;
        group.add(spire);

        // 4 Corner Spires on Tier 2
        const offsets = [-0.28, 0.28];
        offsets.forEach((ox) => {
          offsets.forEach((oz) => {
            const cSpire = new THREE.Mesh(new THREE.ConeGeometry(1.2, 5, 6), matGold);
            cSpire.position.set(b.w * ox, 11, b.d * oz);
            group.add(cSpire);
          });
        });

        // Front Entrance Portico & Stairs
        const portico = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 4), matGold);
        portico.position.set(0, 1.5, b.d / 2 + 2);
        group.add(portico);
      } else if (b.type === "vihara100m") {
        // 12. มหาวิหารแก้ว ๑๐๐ เมตร: 100m elongated crystal hall with straight roof & colonnades
        const hall = new THREE.Mesh(new THREE.BoxGeometry(b.w, 7, b.d), matMirroredGlass);
        hall.position.y = 3.5;
        hall.castShadow = true;
        group.add(hall);

        // หลังคาซ้อนชั้นทรงไทยประยุกต์แท้ ตรงเป๊ะ วิ่งขนานตามแกน X ไม่บิดเบี้ยว
        const roofHeight = 6.5;
        const roofMesh = createStraightGableRoof(b.w, b.d, roofHeight, matGold);
        roofMesh.position.y = 7 + roofHeight / 2;
        group.add(roofMesh);

        // 3 หน้าบันทองแกะสลัก (3 Golden Pediments) เรียงตามแนวความยาวอาคาร
        [-16, 0, 16].forEach((posX) => {
          const pedShape = new THREE.Shape();
          pedShape.moveTo(-4, 0);
          pedShape.lineTo(0, 4.5);
          pedShape.lineTo(4, 0);
          pedShape.closePath();
          const pedGeo = new THREE.ExtrudeGeometry(pedShape, { steps: 1, depth: 0.8, bevelEnabled: false });
          pedGeo.center();
          const ped = new THREE.Mesh(pedGeo, matGold);
          ped.position.set(posX, 9.5, b.d / 2 + 0.45);
          group.add(ped);

          // ยอดช่อฟ้า
          const cf = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.2, 6), matGold);
          cf.position.set(posX, 12.8, b.d / 2 + 0.45);
          group.add(cf);
        });

        // เสาคอลัมน์สีขาวเรียงรายด้านหน้าและด้านหลัง (Colonnade Pillars)
        for (let i = -b.w / 2 + 2.5; i <= b.w / 2 - 2.5; i += 5.5) {
          const colFront = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 7, 8), matWhiteStucco);
          colFront.position.set(i, 3.5, b.d / 2 + 0.6);
          group.add(colFront);
          const colBack = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 7, 8), matWhiteStucco);
          colBack.position.set(i, 3.5, -b.d / 2 - 0.6);
          group.add(colBack);
        }

        // มุขทางเข้าหัว-ท้าย
        [-1, 1].forEach((dir) => {
          const porch = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 8), matWhiteStucco);
          porch.position.set(dir * (b.w / 2 + 2), 2.5, 0);
          group.add(porch);
        });
      } else if (b.type === "standingBuddha") {
        // 3. พระยืน 30 ศอก (หลวงพ่อเงินไหลมาเทมา): Elevated pedestal + Golden Buddha + Scripture Library
        const base = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 10), matWhiteStucco);
        base.position.y = 2;
        group.add(base);

        // Standing Buddha Statue Silhouette holding alms bowl
        const body = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.2, 16, 12), matGold);
        body.position.y = 12;
        body.castShadow = true;
        group.add(body);

        // Alms bowl
        const bowl = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 12), new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.3 }));
        bowl.position.set(0, 10.5, 1.2);
        group.add(bowl);

        const head = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 12), matGold);
        head.position.y = 20.8;
        group.add(head);

        // Radiant Aureole / Halo
        const halo = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.25, 8, 24), matGold);
        halo.position.set(0, 21, -0.3);
        group.add(halo);

        // Adjacent Scripture Library (หอพระไตรปิฎก)
        const lib = new THREE.Mesh(new THREE.BoxGeometry(6, 4.5, 6), matWhiteStucco);
        lib.position.set(5.5, 2.25, 0);
        group.add(lib);
        const libRoof = createStraightGableRoof(6, 6, 3.5, matThaiRedRoof);
        libRoof.position.set(5.5, 4.5 + 1.75, 0);
        group.add(libRoof);
      } else if (b.type === "newUbosot") {
        // 20. พระอุโบสถ (โบสถ์ใหม่): Ubosot with straight Thai tiered roof & Golden Perimeter Cloister Wall
        const body = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.8, 6, b.d * 0.8), matWhiteStucco);
        body.position.y = 3;
        body.castShadow = true;
        group.add(body);

        const ubosotRoof = createThaiTieredRoof(b.w * 0.84, b.d * 0.84, 5.8, matThaiRedRoof, matGold);
        ubosotRoof.position.y = 6;
        group.add(ubosotRoof);

        // Golden Cloister Wall (กำแพงแก้ว) with 4 Entrance Gateways
        const wallMat = new THREE.MeshStandardMaterial({ color: "#f59e0b", roughness: 0.3 });
        const wallThick = 0.5, wallH = 1.2;
        // North & South walls
        const wallN = new THREE.Mesh(new THREE.BoxGeometry(b.w, wallH, wallThick), wallMat);
        wallN.position.set(0, wallH / 2, -b.d / 2);
        group.add(wallN);
        const wallS = new THREE.Mesh(new THREE.BoxGeometry(b.w, wallH, wallThick), wallMat);
        wallS.position.set(0, wallH / 2, b.d / 2);
        group.add(wallS);
        // East & West walls
        const wallE = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, b.d), wallMat);
        wallE.position.set(b.w / 2, wallH / 2, 0);
        group.add(wallE);
        const wallW = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, b.d), wallMat);
        wallW.position.set(-b.w / 2, wallH / 2, 0);
        group.add(wallW);
      } else if (b.type === "ancientUbosot") {
        // 32. พระอุโบสถเก่า (โบสถ์เก่าอยุธยา): Curved "junk boat" foundation + weathered terracotta roof
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(b.w, 4.5, b.d),
          new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.8 })
        );
        body.position.y = 2.25;
        group.add(body);

        const roof = createStraightGableRoof(b.w, b.d, 4.2, matAntiqueTile);
        roof.position.y = 4.5 + 2.1;
        group.add(roof);

        // Stone Bai Sema Boundary Markers
        const semaOffsets = [
          [-b.w / 2 - 1.5, 0], [b.w / 2 + 1.5, 0],
          [0, -b.d / 2 - 1.5], [0, b.d / 2 + 1.5]
        ];
        semaOffsets.forEach(([sx, sz]) => {
          const sema = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.4), matWhiteStucco);
          sema.position.set(sx, 1.1, sz);
          group.add(sema);
        });
      } else if (b.type === "somdejPrathom") {
        // 4. วิหารสมเด็จองค์ปฐม: Gilded Thai sanctuary with golden multi-tiered roof
        const body = new THREE.Mesh(new THREE.BoxGeometry(b.w, 5.5, b.d), matWhiteStucco);
        body.position.y = 2.75;
        body.castShadow = true;
        group.add(body);

        const vRoof = createThaiTieredRoof(b.w, b.d, 6.0, matGold, matGold);
        vRoof.position.y = 5.5;
        group.add(vRoof);
      } else if (b.type === "fiveBuddha") {
        // 30. วิหารหลวงพ่อ 5 พระองค์: Pure white multi-spired sanctuary
        const body = new THREE.Mesh(new THREE.BoxGeometry(b.w, 5, b.d), matWhiteStucco);
        body.position.y = 2.5;
        group.add(body);

        const vRoof = createStraightGableRoof(b.w, b.d, 4.2, matWhiteStucco);
        vRoof.position.y = 5 + 2.1;
        group.add(vRoof);

        // 5 spires representing the 5 Buddhas
        const spirePositions = [[0, 0], [-b.w * 0.25, -b.d * 0.25], [b.w * 0.25, -b.d * 0.25], [-b.w * 0.25, b.d * 0.25], [b.w * 0.25, b.d * 0.25]];
        spirePositions.forEach(([sx, sz], idx) => {
          const sH = idx === 0 ? 6.5 : 4.0;
          const sMesh = new THREE.Mesh(new THREE.ConeGeometry(1.0, sH, 8), matGold);
          sMesh.position.set(sx, 7.5 + sH / 2, sz);
          group.add(sMesh);
        });
      } else if (b.type === "curvedVault") {
        // 17. มหาวิหาร ๑๐๐ ปี (ศาลา ๑๒ ไร่): Giant curved vaulted pavilion
        const baseHall = new THREE.Mesh(new THREE.BoxGeometry(b.w, 4, b.d), matWhiteStucco);
        baseHall.position.y = 2;
        group.add(baseHall);

        // หลังคาโค้งทรงกระบอกผ่าครึ่ง (Barrel Vault) ตรงขนานตามแกน X
        const vaultRadius = b.d / 2;
        const vaultGeo = new THREE.CylinderGeometry(vaultRadius, vaultRadius, b.w, 32, 1, false, 0, Math.PI);
        vaultGeo.center();
        vaultGeo.rotateZ(Math.PI / 2);
        const vaultMesh = new THREE.Mesh(vaultGeo, matWhiteStucco);
        vaultMesh.position.y = 4;
        vaultMesh.castShadow = true;
        group.add(vaultMesh);
      } else if (b.type === "bodhiShrine") {
        // 38. วิหารใต้ต้นโพธิ์: Sacred Bodhi tree + open shrine
        const shrine = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 5), matGold);
        shrine.position.y = 1.5;
        group.add(shrine);

        // Sacred Bodhi Tree (ต้นพระศรีมหาโพธิ์)
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, 5.5, 8), new THREE.MeshStandardMaterial({ color: "#5c3a21" }));
        trunk.position.set(2.8, 2.75, -1);
        group.add(trunk);

        const foliage1 = new THREE.Mesh(new THREE.DodecahedronGeometry(4.5), matGrass);
        foliage1.position.set(2.8, 7.2, -1);
        group.add(foliage1);
        const foliage2 = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5), matGrass);
        foliage2.position.set(0.5, 6.5, 1.2);
        group.add(foliage2);
      } else if (b.type === "pondGazebo") {
        // 9. สวนสมเด็จฯ (สระน้ำ & ศาลากลางน้ำ): Curved pool + island + gazebo + footbridge
        const pool = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 0.6, 24), matWater);
        pool.position.set(0, 0.2, 0);
        group.add(pool);

        const island = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.8, 16), matGrass);
        island.position.set(0, 0.45, 0);
        group.add(island);

        const gazebo = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.2, 3, 8), matGold);
        gazebo.position.set(0, 2.3, 0);
        group.add(gazebo);

        const gRoof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 2.8, 8), matGold);
        gRoof.position.set(0, 5.1, 0);
        group.add(gRoof);

        // Arched Bridge connecting island to shore
        const bridge = new THREE.Mesh(new THREE.BoxGeometry(9, 0.4, 2), matWhiteStucco);
        bridge.position.set(5.5, 1.0, 0);
        group.add(bridge);
      } else if (b.type === "boat") {
        // 40. เรือคนึงหา (จามเทวีนาวา): Moored traditional boat
        const hull = new THREE.Mesh(new THREE.BoxGeometry(b.w, 2.2, b.d), new THREE.MeshStandardMaterial({ color: "#78350f" }));
        hull.position.y = 1.1;
        group.add(hull);

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.72, 2.5, b.d * 0.8), matWhiteStucco);
        cabin.position.y = 3.4;
        group.add(cabin);

        const boatRoof = createStraightGableRoof(b.w * 0.72, b.d * 0.85, 1.8, matAntiqueTile);
        boatRoof.position.y = 4.65 + 0.9;
        group.add(boatRoof);
      } else if (b.type === "raft") {
        // 33. แพเลี้ยงปลา (วังมัจฉา): Floating pontoon platforms
        const raftBase = new THREE.Mesh(new THREE.BoxGeometry(b.w, 1.2, b.d), new THREE.MeshStandardMaterial({ color: "#854d0e" }));
        raftBase.position.y = 0.6;
        group.add(raftBase);

        const shed = new THREE.Mesh(new THREE.BoxGeometry(7, 3, 6), matWhiteStucco);
        shed.position.set(-b.w * 0.28, 2.7, 0);
        group.add(shed);

        const sRoof = createStraightGableRoof(7, 6, 2.2, matAntiqueTile);
        sRoof.position.set(-b.w * 0.28, 4.2 + 1.1, 0);
        group.add(sRoof);
      } else if (b.type === "stupa") {
        // 28. เจดีย์พุดตาน: White stepped stupa with golden umbrella spire
        const stupaBase = new THREE.Mesh(new THREE.BoxGeometry(b.w, 3, b.d), matWhiteStucco);
        stupaBase.position.y = 1.5;
        group.add(stupaBase);

        const bell = new THREE.Mesh(new THREE.SphereGeometry(b.w * 0.38, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), matWhiteStucco);
        bell.position.y = 3;
        group.add(bell);

        const spire = new THREE.Mesh(new THREE.ConeGeometry(1.3, 8, 12), matGold);
        spire.position.y = 9;
        group.add(spire);
      } else if (b.type === "goldMondop" || b.type === "crystalMondop") {
        // 6, 8, 34, 35: Spired Mondops with square stepped pyramid roof
        const mMat = b.type === "crystalMondop" ? matMirroredGlass : matGold;
        const body = new THREE.Mesh(new THREE.BoxGeometry(b.w, 6, b.d), matWhiteStucco);
        body.position.y = 3;
        body.castShadow = true;
        group.add(body);

        const roofStep1 = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.85, 2, b.d * 0.85), mMat);
        roofStep1.position.y = 7;
        group.add(roofStep1);

        const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(2.4, 6.5, 8), mMat);
        pinnacle.position.y = 11.2;
        group.add(pinnacle);
      } else if (b.type === "monument") {
        // 26. อนุสาวรีย์พระเจ้าพรหมมหาราช
        const ped = new THREE.Mesh(new THREE.CylinderGeometry(3, 4, 3, 12), matWhiteStucco);
        ped.position.y = 1.5;
        group.add(ped);

        const statue = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4.5, 6), matGold);
        statue.position.y = 5.2;
        group.add(statue);
      } else if (b.type === "plaza") {
        // 5. ลาน 25 ไร่: Paved ceremony plaza with lanterns
        const plazaTile = new THREE.Mesh(new THREE.BoxGeometry(b.w, 0.4, b.d), new THREE.MeshStandardMaterial({ color: "#cbd5e1", roughness: 0.8 }));
        plazaTile.position.y = 0.2;
        group.add(plazaTile);

        // 4 corner ceremonial light posts
        [[-b.w / 2 + 1, -b.d / 2 + 1], [b.w / 2 - 1, -b.d / 2 + 1], [-b.w / 2 + 1, b.d / 2 - 1], [b.w / 2 - 1, b.d / 2 - 1]].forEach(([lx, lz]) => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 6), matGold);
          post.position.set(lx, 2, lz);
          group.add(post);
        });
      } else {
        // Hall / School / Office / Pavilions / Shops
        const isThaiHall = b.type === "hall" || b.type === "vihara" || b.type === "pavilion" || b.type === "forestVihara";
        const wallMat = b.type === "school" ? new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.6 }) : matWhiteStucco;
        const roofMat = isThaiHall ? matThaiRedRoof : new THREE.MeshStandardMaterial({ color: "#475569", roughness: 0.5 });

        const bodyHeight = b.h * 0.62;
        const body = new THREE.Mesh(new THREE.BoxGeometry(b.w, bodyHeight, b.d), wallMat);
        body.position.y = bodyHeight / 2;
        body.castShadow = true;
        group.add(body);

        const rHeight = b.h * 0.38;
        // ใช้หลังคาทรงจั่วตรงเป๊ะ ไม่มีการบิดเบี้ยวหรือเป็นว่าวเพชร
        const roof = createStraightGableRoof(b.w, b.d, rHeight, roofMat);
        roof.position.y = bodyHeight + rHeight / 2;
        group.add(roof);
      }

      // Invisible Click Bounding Box (Fast, foolproof raycasting taps)
      const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(b.w + 4, b.h + 5, b.d + 4),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.y = (b.h + 5) / 2;
      group.add(hitBox);

      // 3D Canvas Billboard Sprite Label (ใหญ่ คมชัด อ่านง่าย)
      const placeData = places.find((p) => p.id === placeId);
      const isGoldBadge = b.type === "prasatThong" || b.type === "vihara100m" || b.type === "standingBuddha" || b.type === "newUbosot";
      const isMajor = MAJOR_LANDMARK_IDS.has(placeId);
      const shortTitle = placeData ? (placeData.shortName || placeData.name) : b.label;
      const sprite = createLabelSprite(placeId, shortTitle, isMajor, isGoldBadge);
      // สลับระดับความสูงของป้าย (Staggered Heights) เพื่อให้อ่านชัดเจนทุกป้าย ไม่ซ้อนทับกัน
      const staggerOffset = (placeId % 2 === 0) ? 0 : 4.0;
      sprite.position.set(0, b.h + (isMajor ? 8.5 : 6.0) + staggerOffset, 0);
      group.add(sprite);
      labelSpritesMapRef.current[placeId] = sprite;

      scene.add(group);
      interactiveObjectsRef.current.push(hitBox);
      interactiveObjectsRef.current.push(sprite);
      buildingMeshesMapRef.current[placeId] = group;
    });

    // 11. Add Landscaping Trees across sacred gardens
    const treeMat = new THREE.MeshStandardMaterial({ color: "#166534", roughness: 0.7 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: "#451a03", roughness: 0.8 });
    const treeCoords = [
      [-15, -45], [-25, -60], [-35, -50], [5, -45], [18, -45],
      [44, -20], [68, -25], [75, -20], [-45, 45], [-15, 45],
      [45, 45], [60, 45], [-120, -10], [-130, -30], [-110, -35]
    ];
    treeCoords.forEach(([tx, tz]) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, 0, tz);
      const tTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 4, 6), trunkMat);
      tTrunk.position.y = 2;
      treeGroup.add(tTrunk);
      const tTop = new THREE.Mesh(new THREE.DodecahedronGeometry(3.2), treeMat);
      tTop.position.y = 5.2;
      treeGroup.add(tTop);
      scene.add(treeGroup);
    });

    // 12. Raycasting Click Listener (Works on both building meshes & floating sprites)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const pId = hit.parent?.userData?.placeId;
        if (pId) {
          handleSelectBuilding(pId);
        }
      }
    };

    renderer.domElement.addEventListener("click", handleCanvasClick);

    // 13. Render Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera Flying Interpolation
      if (isFlyingRef.current) {
        camera.position.lerp(flyTargetPosRef.current, 0.075);
        controls.target.lerp(flyTargetLookRef.current, 0.075);
        controls.update();

        if (camera.position.distanceTo(flyTargetPosRef.current) < 0.8) {
          isFlyingRef.current = false;
        }
      } else {
        controls.update();
      }

      // Selection Beacon Pulse
      if (selectionBeaconRef.current && selectionBeaconRef.current.visible) {
        const scaleVal = 1 + Math.sin(elapsedTime * 4) * 0.12;
        selectionBeaconRef.current.scale.set(scaleVal, 1, scaleVal);
      }

      // Gentle Water Animation
      if (waterMeshRef.current) {
        waterMeshRef.current.position.y = 0.05 + Math.sin(elapsedTime * 1.5) * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 14. Resize Listener
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener("click", handleCanvasClick);
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [handleSelectBuilding]);

  // ==========================================================================
  // Night / Day Mode Toggle Lighting
  // ==========================================================================
  useEffect(() => {
    if (!lightsRef.current.dir || !sceneRef.current) return;
    const { ambient, dir, hemi } = lightsRef.current;

    if (isNightMode) {
      // Night Mode: Deep starry twilight sky with golden building illuminations
      sceneRef.current.background = new THREE.Color("#050b14");
      sceneRef.current.fog.color = new THREE.Color("#050b14");
      ambient.color.set("#1e293b");
      ambient.intensity = 0.55;
      dir.color.set("#fef08a");
      dir.intensity = 0.75;
      hemi.color.set("#0f172a");
      hemi.groundColor.set("#020617");
      if (rendererRef.current) rendererRef.current.toneMappingExposure = 1.35;
      if (nightLightsGroupRef.current) nightLightsGroupRef.current.visible = true;
    } else {
      // Day Mode: Bright golden sunlight
      sceneRef.current.background = new THREE.Color("#0c1524");
      sceneRef.current.fog.color = new THREE.Color("#0c1524");
      ambient.color.set("#fef3c7");
      ambient.intensity = 0.85;
      dir.color.set("#fffbeb");
      dir.intensity = 1.8;
      hemi.color.set("#bae6fd");
      hemi.groundColor.set("#78350f");
      if (rendererRef.current) rendererRef.current.toneMappingExposure = 1.15;
      if (nightLightsGroupRef.current) nightLightsGroupRef.current.visible = false;
    }
  }, [isNightMode]);

  // ==========================================================================
  // Toggle Labels Visibility
  // ==========================================================================
  useEffect(() => {
    Object.values(labelSpritesMapRef.current).forEach((sprite) => {
      if (sprite) sprite.visible = showLabels;
    });
  }, [showLabels]);

  // ==========================================================================
  // Zone Filtering Highlight
  // ==========================================================================
  useEffect(() => {
    Object.entries(buildingMeshesMapRef.current).forEach(([idStr, group]) => {
      const bInfo = BUILDING_LAYOUT[idStr];
      if (!bInfo) return;
      const isMatch = selectedZone === "all" || bInfo.zone === selectedZone;

      group.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = isMatch ? 1.0 : 0.28;
        }
      });
      const sprite = labelSpritesMapRef.current[idStr];
      if (sprite && showLabels) {
        sprite.visible = isMatch;
      }
    });
  }, [selectedZone, showLabels]);

  return (
    <div className="bdt-container">
      {/* 1. 3D WebGL Canvas Viewport */}
      <div className="bdt-viewport" ref={mountRef} />

      {/* 2. Top Responsive HUD Bar: Zone Filter Pills, Controls, and Search */}
      <div className="bdt-hud-bar">
        <div className="bdt-hud-row">
          {/* Zone Filter Pills (Scrollable horizontally, no wrapping) */}
          <div className="panoramic-zone-pills">
            {zones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                className={`panoramic-zone-btn ${selectedZone === zone.id ? "panoramic-zone-btn--active" : ""}`}
                onClick={() => setSelectedZone(zone.id)}
              >
                {zone.name}
              </button>
            ))}
          </div>

          {/* Quick HUD Icons */}
          <div className="bdt-hud-actions-group">
            <button
              type="button"
              className={`bdt-hud-icon-btn ${isNightMode ? "bdt-hud-icon-btn--active" : ""}`}
              onClick={() => setIsNightMode(!isNightMode)}
              title={isNightMode ? "สลับเป็นโหมดกลางวัน" : "สลับเป็นโหมดกลางคืน (เปิดไฟทองอร่าม)"}
            >
              {isNightMode ? "🌙" : "☀️"}
            </button>
            <button
              type="button"
              className={`bdt-hud-icon-btn ${showLabels ? "bdt-hud-icon-btn--active" : ""}`}
              onClick={() => setShowLabels(!showLabels)}
              title={showLabels ? "ซ่อนป้ายชื่อ 3D" : "แสดงป้ายชื่อ 3D"}
            >
              🏷️
            </button>
            <button
              type="button"
              className="bdt-hud-icon-btn"
              onClick={handleResetCamera}
              title="จัดมุมมองภาพรวม (Reset View)"
            >
              ⊙
            </button>
            <button
              type="button"
              className="bdt-hud-icon-btn"
              onClick={handleTopDownView}
              title="มุมมองมุมสูงผังวัด 2D"
            >
              🗺️
            </button>
          </div>
        </div>

        {/* Row 2: Search Dropdown */}
        <div className="bdt-hud-row">
          <select
            className="panoramic-select"
            style={{ width: "100%", maxWidth: 280, fontSize: "0.74rem", background: "rgba(15, 23, 42, 0.94)" }}
            value={selectedPlaceId || ""}
            onChange={(e) => {
              if (e.target.value) handleSelectBuilding(Number(e.target.value));
            }}
          >
            <option value="">🔎 บินไปที่อาคาร (40 จุด)...</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id}. {p.shortName || p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Floating Zoom Controls */}
      <div className="panoramic-hud-actions" style={{ top: 88, right: 12 }}>
        <button type="button" className="panoramic-hud-btn" onClick={() => handleZoom(1)} title="ซูมเข้า (+)">
          +
        </button>
        <button type="button" className="panoramic-hud-btn" onClick={() => handleZoom(-1)} title="ซูมออก (-)">
          −
        </button>
      </div>

      {/* 4. River Legend Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 42,
          right: 14,
          zIndex: 15,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            padding: "3px 10px",
            borderRadius: "var(--radius-full)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#60a5fa",
            fontSize: "0.68rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span>⚓</span>
          <span>แม่น้ำสะแกกรัง (ฝั่งใต้)</span>
        </div>
      </div>

      {/* 5. Side Detail Drawer (Slide-in on click) */}
      {isDrawerOpen && selectedPlace && (
        <div className="bdt-drawer-overlay">
          <SideDetailDrawer
            place={selectedPlace}
            onClose={() => {
              setIsDrawerOpen(false);
              setSelectedPlaceId(null);
              if (selectionBeaconRef.current) selectionBeaconRef.current.visible = false;
            }}
            userLocation={userLocation}
            getFormattedDistanceTo={getFormattedDistanceTo}
            onOpenPhoto={onOpenPhoto}
            onSelectPlace={(p) => handleSelectBuilding(p.id)}
          />
        </div>
      )}

      {/* 6. Footer Hint */}
      <div className="panoramic-footer-bar" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <div className="panoramic-footer-hint">
          <Icon name="sparkle" size={13} color="var(--gold-dark)" />
          <span>
            แตะอาคารเพื่อบินเข้าไปชม & ดูรูปจริง | ใช้เมาส์หรือนิ้วหมุนกล้อง 3D ได้อิสระรอบทิศทาง
          </span>
        </div>
        {userLocation && (
          <div className="panoramic-gps-pill">
            <span className="pulse-dot" />
            <span>GPS ทำงาน</span>
          </div>
        )}
      </div>
    </div>
  );
}
