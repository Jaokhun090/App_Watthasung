import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { places, templeInfo } from "../data/places";
import Icon from "./Icons";
import SideDetailDrawer from "./SideDetailDrawer";

// ตำแหน่ง 3D บนผังจำลอง (X = ตะวันออก/แม่น้ำ, Z = เหนือ/ใต้, Y = ความสูง)
// ครอบคลุมจุดสำคัญตามพิกัดดาวเทียมจริงของวัดท่าซุง
const BUILDING_POSITIONS = {
  1: { x: -59, z: 35.7, label: "ปราสาททองคำ", height: 16, highlight: true },
  2: { x: -66.9, z: -6.9, label: "สมบัติพ่อให้", height: 10, highlight: true },
  3: { x: -62.8, z: -26.1, label: "พระยืน 30 ศอก", height: 18, highlight: true },
  4: { x: -51.9, z: -31.7, label: "สมเด็จองค์ปฐม", height: 14, highlight: true },
  5: { x: -39.9, z: 12.8, label: "ลาน 25 ไร่", height: 8 },
  6: { x: -60.5, z: -36.3, label: "วิหารพระวิสุทธิเทพ", height: 10, highlight: true },
  7: { x: -21.6, z: 10.6, label: "ตึกขาว", height: 8 },
  8: { x: -44.8, z: -23, label: "พระศรีอาริยเมตไตรย", height: 9 },
  9: { x: -5.3, z: -52.2, label: "สวนสมเด็จฯ", height: 6 },
  10: { x: 10.1, z: -64.9, label: "ตึกพระเถระ", height: 8 },
  11: { x: 19.8, z: -25.3, label: "ร้านอิ่มบุญ", height: 8 },
  12: { x: 11.3, z: -31.2, label: "วิหารแก้ว 100 เมตร", height: 14, highlight: true },
  13: { x: 35.2, z: -47.3, label: "กาแฟท่าซุง", height: 7 },
  14: { x: 40.6, z: -45.1, label: "ร้านค้าสวัสดิการ", height: 7 },
  15: { x: 50.5, z: -3.7, label: "ห้องสมุดประชาชน", height: 8 },
  16: { x: 43.3, z: -6.7, label: "ที่พักพระพินิจอักษร", height: 8 },
  17: { x: -37.5, z: 70.4, label: "ศาลา 12 ไร่", height: 10, highlight: true },
  18: { x: -28.6, z: 57.2, label: "หอประชุมพระสุธรรมยานเถระ", height: 9 },
  19: { x: -22.9, z: 77, label: "โรงเรียนพระพินิจอักษร", height: 8 },
  20: { x: -16.7, z: 68.5, label: "พระอุโบสถ", height: 11, highlight: true },
  21: { x: -8.8, z: 59.4, label: "ศาลาบูรพาจารย์", height: 8 },
  22: { x: -2.9, z: 69.1, label: "ศาลานวราช", height: 8 },
  23: { x: -35.9, z: 37.8, label: "ศาลา 2 ไร่", height: 8 },
  24: { x: -19.8, z: 40.1, label: "ศาลา 3 ไร่", height: 8 },
  25: { x: 17.6, z: -16.5, label: "อาคารธรรมวิโมกข์", height: 8 },
  26: { x: 56.1, z: -46.2, label: "พระเจ้าพรหมมหาราช", height: 8 },
  27: { x: 47.3, z: -11, label: "อาคารเสริมศรี", height: 8 },
  28: { x: 51.7, z: -58.3, label: "เจดีย์พุดตาน", height: 9 },
  29: { x: 52.8, z: -52.8, label: "วิหารพระมหากัสสป", height: 9 },
  30: { x: 38.5, z: -68.2, label: "วิหาร 5 พระองค์", height: 10, highlight: true },
  31: { x: 34.1, z: -73.7, label: "หอฉัน", height: 8 },
  32: { x: 46.2, z: -60.5, label: "โบสถ์เก่า", height: 11, highlight: true },
  33: { x: 61.6, z: -82.5, label: "แพเลี้ยงปลา", height: 6, highlight: true },
  34: { x: 53.9, z: -45.1, label: "มณฑปแก้วพระองค์ที่ 10-11", height: 9 },
  35: { x: 58.3, z: -38.5, label: "มณฑปท้าวมหาราช", height: 9 },
  36: { x: 48.4, z: -56.1, label: "วิหารหลวงพ่อศักดิ์สิทธิ์", height: 12, highlight: true },
  37: { x: 62.7, z: -29.7, label: "ตึกรับแขก", height: 8 },
  38: { x: 51.7, z: -49.5, label: "วิหารใต้ต้นโพธิ์", height: 9 },
  39: { x: 73.7, z: -18, label: "โรงเรียนพระสุธรรมยานฯ", height: 8 },
  40: { x: 67.1, z: -79.2, label: "เรือคนึงหา", height: 6 },
};

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

  // Selection & UI state
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // References for dynamic 3D elements
  const lightsRef = useRef({});
  const interactiveObjectsRef = useRef([]);
  const userBeaconRef = useRef(null);
  const waterMeshRef = useRef(null);
  const highlightRingRef = useRef(null);

  // Camera Flying Target Ref
  const isFlyingRef = useRef(false);
  const flyTargetPosRef = useRef(new THREE.Vector3());
  const flyTargetLookRef = useRef(new THREE.Vector3());

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || null;

  // Function to fly camera to building
  const flyToBuilding = useCallback(
    (pId) => {
      setSelectedPlaceId(pId);
      setIsDrawerOpen(true);
      const bInfo = BUILDING_POSITIONS[pId];
      if (!bInfo || !controlsRef.current || !cameraRef.current) return;

      flyTargetLookRef.current.set(bInfo.x, 0, bInfo.z);
      flyTargetPosRef.current.set(bInfo.x + 22, 28, bInfo.z + 30);
      isFlyingRef.current = true;

      // Position Highlight Ring around target
      if (highlightRingRef.current) {
        highlightRingRef.current.position.set(bInfo.x, 0.25, bInfo.z);
        highlightRingRef.current.visible = true;
      }

      if (onSelectPlace) {
        const pObj = places.find((item) => item.id === pId);
        if (pObj) onSelectPlace(pObj);
      }
    },
    [onSelectPlace]
  );

  // Reset Camera View
  const handleResetCamera = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    flyTargetLookRef.current.set(0, 0, 0);
    flyTargetPosRef.current.set(0, 80, 115);
    isFlyingRef.current = true;
    if (highlightRingRef.current) {
      highlightRingRef.current.visible = false;
    }
  }, []);

  // Zoom In / Out
  const handleZoom = useCallback((delta) => {
    if (!controlsRef.current || !cameraRef.current) return;
    isFlyingRef.current = false;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    cameraRef.current.position.addScaledVector(dir, delta * 15);
  }, []);

  // Initialize Three.js Scene with OrbitControls
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 360;
    const height = mountRef.current.clientHeight || 520;

    // 1. Scene with Bangkok Digital Twin soft architectural tone
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe2e8f0);
    scene.fog = new THREE.FogExp2(0xe2e8f0, 0.0032);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 80, 115);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // 4. Official OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 18;
    controls.maxDistance = 260;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Lights (Architectural Daylight & Shadows)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(-70, 110, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    const d = 100;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // Point lights for Night glow
    const goldGlowLight = new THREE.PointLight(0xffd700, 0, 90);
    goldGlowLight.position.set(BUILDING_POSITIONS[1]?.x || -59, 16, BUILDING_POSITIONS[1]?.z || 35.7);
    scene.add(goldGlowLight);

    const glassGlowLight = new THREE.PointLight(0x7dd3fc, 0, 90);
    glassGlowLight.position.set(BUILDING_POSITIONS[12]?.x || 11.3, 14, BUILDING_POSITIONS[12]?.z || -31.2);
    scene.add(glassGlowLight);

    lightsRef.current = { ambientLight, sunLight, goldGlowLight, glassGlowLight };

    // 6. Architectural Materials (Bangkok Digital Twin Style: Clean Clay / Off-White)
    const clayWallMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Architectural pure white
      roughness: 0.5,
      metalness: 0.08,
    });
    const clayRoofMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Soft architectural light slate
      roughness: 0.45,
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Refined Thai Gold Accent
      roughness: 0.35,
      metalness: 0.65,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd, // Crystal glass
      transparent: true,
      opacity: 0.68,
      roughness: 0.15,
      metalness: 0.35,
    });
    const heritageRoofMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b, // Heritage terracotta
      roughness: 0.5,
    });

    const interactives = [];

    // Helper to register building mesh for click detection
    const registerBuilding = (group, placeId) => {
      group.userData = { placeId };
      group.traverse((child) => {
        if (child.isMesh) {
          child.userData = { placeId };
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(group);
      interactives.push(group);
    };

    // --- Ground (Smooth Architectural Slate) ---
    const groundGeo = new THREE.PlaneGeometry(260, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.9,
      metalness: 0.02,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Temple Courtyard Platforms (ฝั่งวัดใหม่ & วัดเก่า)
    const newCourtGeo = new THREE.PlaneGeometry(80, 160);
    const courtMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.75 });
    const newCourt = new THREE.Mesh(newCourtGeo, courtMat);
    newCourt.rotation.x = -Math.PI / 2;
    newCourt.position.set(-38, 0.05, 20);
    newCourt.receiveShadow = true;
    scene.add(newCourt);

    const oldCourtGeo = new THREE.PlaneGeometry(50, 90);
    const oldCourt = new THREE.Mesh(oldCourtGeo, courtMat);
    oldCourt.rotation.x = -Math.PI / 2;
    oldCourt.position.set(48, 0.05, -50);
    oldCourt.receiveShadow = true;
    scene.add(oldCourt);

    // --- Main Asphalt Road (Bangkok Digital Twin Charcoal Road) ---
    const roadGeo = new THREE.PlaneGeometry(12, 240);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.08, 0);
    road.receiveShadow = true;
    scene.add(road);

    // Center Lane Markings
    const stripeGeo = new THREE.PlaneGeometry(0.5, 240);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(0, 0.09, 0);
    scene.add(stripe);

    // Highlighted Visitor Arterial Corridor (like BDT Pink-Red Route)
    const corridorGeo = new THREE.PlaneGeometry(8, 120);
    const corridorMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.35,
    });
    const corridor = new THREE.Mesh(corridorGeo, corridorMat);
    corridor.rotation.x = -Math.PI / 2;
    corridor.position.set(-18, 0.09, 5);
    scene.add(corridor);

    // --- Sakae Krang River (แม่น้ำสะแกกรัง สไตล์ Digital Twin) ---
    const riverGeo = new THREE.PlaneGeometry(42, 240);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0f2438,
      roughness: 0.25,
      metalness: 0.35,
      transparent: true,
      opacity: 0.92,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(65, 0.06, 0);
    scene.add(river);
    waterMeshRef.current = river;

    // Selection Highlight Ring on Ground
    const highlightGeo = new THREE.RingGeometry(8, 9.5, 32);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      side: THREE.DoubleSide,
    });
    const highlightMesh = new THREE.Mesh(highlightGeo, highlightMat);
    highlightMesh.rotation.x = -Math.PI / 2;
    highlightMesh.visible = false;
    scene.add(highlightMesh);
    highlightRingRef.current = highlightMesh;

    // --- 3D Building Models (Clay Architectural White with Refined Accents) ---

    // 1. ปราสาททองคำ (Place 1)
    const castleGroup = new THREE.Group();
    castleGroup.position.set(BUILDING_POSITIONS[1].x, 0, BUILDING_POSITIONS[1].z);
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(22, 6, 22), clayWallMat);
    c1.position.y = 3;
    castleGroup.add(c1);
    const c2 = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 16), clayWallMat);
    c2.position.y = 8.5;
    castleGroup.add(c2);
    const c3 = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 10), clayWallMat);
    c3.position.y = 13;
    castleGroup.add(c3);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(2.5, 10, 8), goldTrimMat);
    spire.position.y = 19;
    castleGroup.add(spire);
    [[-4, -4], [-4, 4], [4, -4], [4, 4]].forEach(([cx, cz]) => {
      const s = new THREE.Mesh(new THREE.ConeGeometry(1, 4, 6), goldTrimMat);
      s.position.set(cx, 16, cz);
      castleGroup.add(s);
    });
    registerBuilding(castleGroup, 1);

    // 2. มหาวิหารแก้ว 100 เมตร (Place 12)
    const glassGroup = new THREE.Group();
    glassGroup.position.set(BUILDING_POSITIONS[12].x, 0, BUILDING_POSITIONS[12].z);
    const glassBody = new THREE.Mesh(new THREE.BoxGeometry(14, 9, 36), glassMat);
    glassBody.position.y = 4.5;
    glassGroup.add(glassBody);
    const glassRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 8, 36, 4), clayRoofMat);
    glassRoof.rotation.x = Math.PI / 2;
    glassRoof.rotation.y = Math.PI / 4;
    glassRoof.position.y = 10;
    glassGroup.add(glassRoof);
    registerBuilding(glassGroup, 12);

    // 3. พระยืน 30 ศอก (Place 3)
    const standingBuddhaGroup = new THREE.Group();
    standingBuddhaGroup.position.set(BUILDING_POSITIONS[3].x, 0, BUILDING_POSITIONS[3].z);
    const pBase = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 3, 16), clayWallMat);
    pBase.position.y = 1.5;
    standingBuddhaGroup.add(pBase);
    const bBody = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 14, 12), goldTrimMat);
    bBody.position.y = 10;
    standingBuddhaGroup.add(bBody);
    const bHead = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 12), goldTrimMat);
    bHead.position.y = 18;
    standingBuddhaGroup.add(bHead);
    registerBuilding(standingBuddhaGroup, 3);

    // 4. วิหารสมเด็จองค์ปฐม (Place 4)
    const somdejGroup = new THREE.Group();
    somdejGroup.position.set(BUILDING_POSITIONS[4].x, 0, BUILDING_POSITIONS[4].z);
    const sBody = new THREE.Mesh(new THREE.BoxGeometry(13, 7, 13), clayWallMat);
    sBody.position.y = 3.5;
    somdejGroup.add(sBody);
    const sRoof = new THREE.Mesh(new THREE.ConeGeometry(10, 5, 4), clayRoofMat);
    sRoof.rotation.y = Math.PI / 4;
    sRoof.position.y = 9;
    somdejGroup.add(sRoof);
    const sSpire = new THREE.Mesh(new THREE.ConeGeometry(1.2, 6, 8), goldTrimMat);
    sSpire.position.y = 14;
    somdejGroup.add(sSpire);
    registerBuilding(somdejGroup, 4);

    // 5. ตึกสมบัติพ่อให้ (Place 2)
    const museumGroup = new THREE.Group();
    museumGroup.position.set(BUILDING_POSITIONS[2].x, 0, BUILDING_POSITIONS[2].z);
    const mBody = new THREE.Mesh(new THREE.BoxGeometry(18, 7, 12), clayWallMat);
    mBody.position.y = 3.5;
    museumGroup.add(mBody);
    const mRoof = new THREE.Mesh(new THREE.ConeGeometry(12, 4, 4), clayRoofMat);
    mRoof.rotation.y = Math.PI / 4;
    mRoof.position.y = 8.5;
    museumGroup.add(mRoof);
    registerBuilding(museumGroup, 2);

    // 6. โบสถ์เก่า & วิหารหลวงพ่อศักดิ์สิทธิ์ (Place 36)
    const oldTempleGroup = new THREE.Group();
    oldTempleGroup.position.set(BUILDING_POSITIONS[36].x, 0, BUILDING_POSITIONS[36].z);
    const otBody = new THREE.Mesh(new THREE.BoxGeometry(11, 6, 17), clayWallMat);
    otBody.position.y = 3;
    oldTempleGroup.add(otBody);
    const otRoof = new THREE.Mesh(new THREE.ConeGeometry(10, 4.5, 4), heritageRoofMat);
    otRoof.rotation.y = Math.PI / 4;
    otRoof.position.y = 7.5;
    oldTempleGroup.add(otRoof);
    registerBuilding(oldTempleGroup, 36);

    // 7. แพเลี้ยงปลา / วังมัจฉา (Place 33)
    const pierGroup = new THREE.Group();
    pierGroup.position.set(BUILDING_POSITIONS[33].x, 0, BUILDING_POSITIONS[33].z);
    const pierPlank = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 8), clayRoofMat);
    pierPlank.position.set(3, 1, 0);
    pierGroup.add(pierPlank);
    const pierPav = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), clayWallMat);
    pierPav.position.set(-1, 3, 0);
    pierGroup.add(pierPav);
    registerBuilding(pierGroup, 33);

    // 8. ลาน 25 ไร่ (Place 5)
    const salaa24Group = new THREE.Group();
    salaa24Group.position.set(BUILDING_POSITIONS[5].x, 0, BUILDING_POSITIONS[5].z);
    const salaaBody = new THREE.Mesh(new THREE.BoxGeometry(20, 5, 20), clayWallMat);
    salaaBody.position.y = 2.5;
    salaa24Group.add(salaaBody);
    const salaaRoof = new THREE.Mesh(new THREE.ConeGeometry(15, 3.5, 4), clayRoofMat);
    salaaRoof.rotation.y = Math.PI / 4;
    salaaRoof.position.y = 6.5;
    salaa24Group.add(salaaRoof);
    registerBuilding(salaa24Group, 5);

    // 9. Generate standard clay massing for other buildings in BUILDING_POSITIONS
    const modeledIds = [1, 2, 3, 4, 5, 12, 33, 36];
    Object.entries(BUILDING_POSITIONS).forEach(([idStr, bInfo]) => {
      const id = parseInt(idStr, 10);
      if (modeledIds.includes(id)) return;

      const g = new THREE.Group();
      g.position.set(bInfo.x, 0, bInfo.z);
      const h = bInfo.height * 0.7;
      const body = new THREE.Mesh(new THREE.BoxGeometry(8, h, 8), clayWallMat);
      body.position.y = h / 2;
      g.add(body);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(6, 3, 4), clayRoofMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = h + 1.5;
      g.add(roof);
      registerBuilding(g, id);
    });

    // --- Floating Circular Red Beacon Pins (Bangkok Digital Twin Style) ---
    const createPinTexture = (num, isHighlight) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");

      // Outer Glow / Shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      // Pin Head (Bangkok Digital Twin Vibrant Red)
      ctx.beginPath();
      ctx.arc(64, 48, 38, 0, Math.PI * 2);
      ctx.fillStyle = isHighlight ? "#dc2626" : "#e11d48";
      ctx.fill();

      // Pin Pointer Tip
      ctx.beginPath();
      ctx.moveTo(46, 70);
      ctx.lineTo(64, 98);
      ctx.lineTo(82, 70);
      ctx.fillStyle = isHighlight ? "#dc2626" : "#e11d48";
      ctx.fill();

      // White Inner Border
      ctx.shadowColor = "transparent";
      ctx.beginPath();
      ctx.arc(64, 48, 34, 0, Math.PI * 2);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Bold White Number
      ctx.font = "bold 32px Prompt, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(num.toString(), 64, 49);

      return new THREE.CanvasTexture(canvas);
    };

    Object.entries(BUILDING_POSITIONS).forEach(([idStr, bInfo]) => {
      const id = parseInt(idStr, 10);
      const spriteMat = new THREE.SpriteMaterial({
        map: createPinTexture(id, bInfo.highlight),
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(6.5, 6.5, 1);
      sprite.position.set(bInfo.x, bInfo.height + 6, bInfo.z);
      sprite.userData = { placeId: id };
      scene.add(sprite);
      interactives.push(sprite);
    });

    // --- 3D User Beacon "คุณอยู่ที่นี่" ---
    const beaconGroup = new THREE.Group();
    beaconGroup.visible = false;
    const beaconCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 3, 22, 16, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      })
    );
    beaconCylinder.position.y = 11;
    beaconGroup.add(beaconCylinder);

    const beaconSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    beaconSphere.position.y = 1;
    beaconGroup.add(beaconSphere);
    scene.add(beaconGroup);
    userBeaconRef.current = beaconGroup;

    interactiveObjectsRef.current = interactives;

    // --- Click & Pointer Detection (Works on Mouse & Touch) ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };
    const canvasElem = renderer.domElement;

    const handlePointerDown = (e) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
      const moveDistance = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (moveDistance > 6) return;

      const rect = canvasElem.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveObjectsRef.current, true);

      if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj && !obj.userData?.placeId && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.placeId) {
          flyToBuilding(obj.userData.placeId);
        }
      }
    };

    canvasElem.addEventListener("pointerdown", handlePointerDown);
    canvasElem.addEventListener("pointerup", handlePointerUp);

    // --- Animation Loop ---
    let time = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      time += 0.02;

      // Animate gentle water reflection
      if (waterMeshRef.current) {
        waterMeshRef.current.material.opacity = 0.88 + Math.sin(time) * 0.04;
      }

      // Smooth camera flying interpolation
      if (isFlyingRef.current) {
        camera.position.lerp(flyTargetPosRef.current, 0.06);
        controls.target.lerp(flyTargetLookRef.current, 0.06);

        if (camera.position.distanceTo(flyTargetPosRef.current) < 0.8) {
          isFlyingRef.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvasElem) {
        canvasElem.removeEventListener("pointerdown", handlePointerDown);
        canvasElem.removeEventListener("pointerup", handlePointerUp);
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [flyToBuilding]);

  // Update Day / Night Mode in 3D Scene
  useEffect(() => {
    const scene = sceneRef.current;
    const { ambientLight, sunLight, goldGlowLight, glassGlowLight } = lightsRef.current;
    if (!scene || !ambientLight) return;

    if (isNightMode) {
      scene.background = new THREE.Color(0x0f172a);
      scene.fog.color = new THREE.Color(0x0f172a);
      ambientLight.color.setHex(0x1e293b);
      ambientLight.intensity = 0.45;
      sunLight.intensity = 0.2;
      goldGlowLight.intensity = 4.5;
      glassGlowLight.intensity = 3.5;
    } else {
      scene.background = new THREE.Color(0xe2e8f0);
      scene.fog.color = new THREE.Color(0xe2e8f0);
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 1.1;
      sunLight.intensity = 1.4;
      goldGlowLight.intensity = 0;
      glassGlowLight.intensity = 0;
    }
  }, [isNightMode]);

  // Update User Beacon Position in 3D
  useEffect(() => {
    if (!userBeaconRef.current) return;

    if (userLocation) {
      const centerLat = templeInfo.gps.lat;
      const centerLng = templeInfo.gps.lng;

      const deltaX = (userLocation.lng - centerLng) * 1000 * 25;
      const deltaZ = -(userLocation.lat - centerLat) * 1000 * 25;

      userBeaconRef.current.position.set(
        Math.max(-90, Math.min(90, deltaX)),
        0,
        Math.max(-90, Math.min(90, deltaZ))
      );
      userBeaconRef.current.visible = true;
    } else {
      userBeaconRef.current.visible = false;
    }
  }, [userLocation]);

  return (
    <div className="bdt-container">
      {/* 3D Canvas Viewport */}
      <div ref={mountRef} className="bdt-viewport" />

      {/* Top Left: Layer & Drawer Toggle Button */}
      <div className="bdt-hud-top-left">
        <button
          type="button"
          className="bdt-hud-pill-btn"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          title="เปิด/ปิด แถบข้อมูลด้านข้าง"
        >
          <span>{isDrawerOpen ? "◀ ซ่อนแถบข้อมูล" : `▶ ข้อมูลสถานที่ (${places.length} จุด)`}</span>
        </button>
      </div>

      {/* Top Right HUD Controls */}
      <div className="bdt-hud-top-right">
        <button
          type="button"
          className={`bdt-hud-icon-btn ${isNightMode ? "bdt-hud-icon-btn--active" : ""}`}
          onClick={() => setIsNightMode(!isNightMode)}
          title="สลับโหมดกลางวัน / กลางคืน"
        >
          {isNightMode ? "🌙" : "☀️"}
        </button>
        <button
          type="button"
          className="bdt-hud-icon-btn"
          onClick={() => handleZoom(1)}
          title="ซูมเข้า"
        >
          +
        </button>
        <button
          type="button"
          className="bdt-hud-icon-btn"
          onClick={() => handleZoom(-1)}
          title="ซูมออก"
        >
          -
        </button>
        <button
          type="button"
          className="bdt-hud-icon-btn"
          onClick={handleResetCamera}
          title="รีเซ็ตมุมมองกึ่งกลางวัด"
        >
          ↺
        </button>
      </div>

      {/* Side Detail Drawer (Bangkok Digital Twin Style) */}
      {isDrawerOpen && (
        <div className="bdt-drawer-overlay">
          <SideDetailDrawer
            place={selectedPlace}
            onClose={() => setIsDrawerOpen(false)}
            userLocation={userLocation}
            getFormattedDistanceTo={getFormattedDistanceTo}
            onOpenPhoto={onOpenPhoto}
            onSelectPlace={(p) => flyToBuilding(p.id)}
          />
        </div>
      )}
    </div>
  );
}
