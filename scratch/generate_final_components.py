import json

# Read the calibrated 2D coordinates
with open('scratch/projected_2d_and_3d.json', 'r', encoding='utf-8') as f:
    coords = json.load(f)

# Adjust Sala Nawarat (id: 22) so it stays cleanly on the west side of Hwy 3265
# Hwy 3265 is at x: 538 near y: 685. So id: 22 should be at x: 518, y: 685
coords['22']['x'] = 518.0
coords['22']['y'] = 685.0

# Adjust Tuk Rap Khaek (id: 37) so it stays cleanly on the east side of Hwy 3265 gate
coords['37']['x'] = 578.0
coords['37']['y'] = 675.0

# Adjust Old Temple pins for maximum visual clarity & zero overlap:
# 35: Mondop Tao Jatuma Ha Raj
coords['35']['x'] = 635.0
coords['35']['y'] = 655.0

# 34: Mondop Kaew 10-11
coords['34']['x'] = 605.0
coords['34']['y'] = 680.0

# 36: Vihara LP Saksit
coords['36']['x'] = 650.0
coords['36']['y'] = 690.0

# 32: Old Ubosot
coords['32']['x'] = 685.0
coords['32']['y'] = 705.0

# 13: Tha Sung Coffee
coords['13']['x'] = 600.0
coords['13']['y'] = 720.0

# 21: Sala Buraphachan
coords['21']['x'] = 645.0
coords['21']['y'] = 735.0

# 38: Vihara 10-11 Tai Ton Pho
coords['38']['x'] = 685.0
coords['38']['y'] = 745.0

# 30: Vihara LP 5 Phra Ong
coords['30']['x'] = 585.0
coords['30']['y'] = 765.0

# 31: Ho Chan
coords['31']['x'] = 625.0
coords['31']['y'] = 775.0

# 27: Building Sermsri
coords['27']['x'] = 585.0
coords['27']['y'] = 810.0

# 33: Wang Matcha (fish raft)
coords['33']['x'] = 695.0
coords['33']['y'] = 785.0

# 40: Ruea Khanueng Ha (boat)
coords['40']['x'] = 695.0
coords['40']['y'] = 825.0

# Let's verify all 39 places are present
print(f"Total places: {len(coords)}")

# Place styling map:
style_map = {
  14: {'icon': 'utensils', 'color': '#ea580c', 'type': 'shop', 'w': 12, 'd': 9, 'h': 7, 'label': 'ร้านค้าสวัสดิการ', 'zone': 'pavilion'},
  11: {'icon': 'utensils', 'color': '#ea580c', 'type': 'shop', 'w': 14, 'd': 10, 'h': 7, 'label': 'ร้านอิ่มบุญ (ครัวร้อยเมตร)', 'zone': 'pavilion'},
  12: {'icon': 'crystal', 'color': '#38bdf8', 'type': 'vihara100m', 'w': 48, 'd': 16, 'h': 13, 'rotY': -0.59, 'label': 'มหาวิหารแก้ว 100 เมตร', 'zone': 'new'},
  6:  {'icon': 'pray', 'color': '#eab308', 'type': 'crystalMondop', 'w': 14, 'd': 14, 'h': 13, 'label': 'วิหารพระวิสุทธิเทพ (พระจุฬามณี)', 'zone': 'new'},
  26: {'icon': 'stupa', 'color': '#ca8a04', 'type': 'monument', 'w': 11, 'd': 11, 'h': 8, 'label': 'อนุสาวรีย์พระเจ้าพรหมมหาราช', 'zone': 'pavilion'},
  16: {'icon': 'meditation', 'color': '#b45309', 'type': 'retreat', 'w': 15, 'd': 11, 'h': 9, 'label': 'อาคารที่พักผู้ปฏิบัติธรรมพระพินิจอักษร', 'zone': 'pavilion'},
  15: {'icon': 'scripture', 'color': '#d97706', 'type': 'library', 'w': 14, 'd': 11, 'h': 8, 'label': 'ห้องสมุดประชาชนเฉลิมราชกุมารี', 'zone': 'pavilion'},
  39: {'icon': 'scripture', 'color': '#b45309', 'type': 'school', 'w': 26, 'd': 22, 'h': 10, 'label': 'โรงเรียนพระสุธรรมยานเถระวิทยา', 'zone': 'pavilion'},

  9:  {'icon': 'lotus', 'color': '#10b981', 'type': 'pondGazebo', 'w': 26, 'd': 18, 'h': 6, 'label': 'สวนสมเด็จฯ (สระน้ำ & ศาลากลางน้ำ)', 'zone': 'pavilion'},
  10: {'icon': 'stupa', 'color': '#64748b', 'type': 'hall', 'w': 16, 'd': 12, 'h': 8, 'label': 'ตึกพระเถระ', 'zone': 'pavilion'},
  4:  {'icon': 'mondop', 'color': '#f59e0b', 'type': 'somdejPrathom', 'w': 16, 'd': 13, 'h': 14, 'label': 'วิหารสมเด็จองค์ปฐม', 'zone': 'new'},
  28: {'icon': 'stupa', 'color': '#94a3b8', 'type': 'stupa', 'w': 10, 'd': 10, 'h': 13, 'label': 'เจดีย์พุดตาน', 'zone': 'new'},
  3:  {'icon': 'coinFlow', 'color': '#eab308', 'type': 'standingBuddha', 'w': 12, 'd': 12, 'h': 24, 'label': 'พระยืน 30 ศอก (หลวงพ่อเงินไหลมาเทมา)', 'zone': 'new'},
  8:  {'icon': 'lotusSun', 'color': '#38bdf8', 'type': 'goldMondop', 'w': 12, 'd': 12, 'h': 13, 'label': 'มณฑปพระศรีอาริยเมตไตรย', 'zone': 'new'},
  2:  {'icon': 'museum', 'color': '#94a3b8', 'type': 'museum', 'w': 22, 'd': 13, 'h': 10, 'label': 'พิพิธภัณฑ์สมบัติพ่อให้', 'zone': 'new'},
  29: {'icon': 'stupa', 'color': '#0284c7', 'type': 'forestVihara', 'w': 13, 'd': 11, 'h': 8, 'label': 'วิหารหลวงพ่อพระมหากัสสป', 'zone': 'new'},

  7:  {'icon': 'stupa', 'color': '#94a3b8', 'type': 'whiteBuilding', 'w': 28, 'd': 32, 'h': 10, 'label': 'ตึกขาว', 'zone': 'pavilion'},
  5:  {'icon': 'scripture', 'color': '#b45309', 'type': 'plaza', 'w': 22, 'd': 16, 'h': 6, 'label': 'ลาน 25 ไร่', 'zone': 'pavilion'},
  1:  {'icon': 'palace', 'color': '#d4a843', 'type': 'prasatThong', 'w': 26, 'd': 26, 'h': 22, 'label': 'ปราสาททองกาญจนาภิเษก (ปราสาททองคำ)', 'zone': 'new'},
  23: {'icon': 'scripture', 'color': '#92400e', 'type': 'hall', 'w': 22, 'd': 14, 'h': 9, 'label': 'ศาลา 2 ไร่', 'zone': 'pavilion'},
  24: {'icon': 'scripture', 'color': '#b45309', 'type': 'hall', 'w': 20, 'd': 12, 'h': 8, 'label': 'ศาลา 3 ไร่', 'zone': 'pavilion'},
  18: {'icon': 'house', 'color': '#78350f', 'type': 'hall', 'w': 22, 'd': 14, 'h': 9, 'label': 'หอประชุมพระสุธรรมยานเถระ (ศาลา 4 ไร่)', 'zone': 'pavilion'},

  17: {'icon': 'scripture', 'color': '#991b1b', 'type': 'curvedVault', 'w': 38, 'd': 26, 'h': 14, 'label': 'พระมหาวิหาร 100 ปี (ศาลา 12 ไร่)', 'zone': 'pavilion'},
  25: {'icon': 'lotus', 'color': '#16a34a', 'type': 'hall', 'w': 16, 'd': 11, 'h': 8, 'label': 'อาคารธรรมวิโมกข์', 'zone': 'pavilion'},
  20: {'icon': 'navTemple', 'color': '#d4a843', 'type': 'newUbosot', 'w': 20, 'd': 14, 'h': 14, 'label': 'พระอุโบสถ (โบสถ์ใหม่)', 'zone': 'new'},
  22: {'icon': 'scripture', 'color': '#78350f', 'type': 'pavilion', 'w': 14, 'd': 11, 'h': 8, 'label': 'ศาลานวราช (ติดต่อที่พัก)', 'zone': 'pavilion'},

  37: {'icon': 'house', 'color': '#64748b', 'type': 'office', 'w': 18, 'd': 11, 'h': 8, 'label': 'ตึกรับแขก (จำหน่ายวัตถุมงคล/หนังสือ)', 'zone': 'old'},
  35: {'icon': 'fourKings', 'color': '#f59e0b', 'type': 'goldMondop', 'w': 10, 'd': 10, 'h': 12, 'label': 'มณฑปท้าวจาตุมหาราช', 'zone': 'old'},
  34: {'icon': 'crystal', 'color': '#0284c7', 'type': 'crystalMondop', 'w': 9, 'd': 9, 'h': 12, 'label': 'มณฑปแก้วพระองค์ที่ 10-11', 'zone': 'old'},
  36: {'icon': 'oldTemple', 'color': '#b91c1c', 'type': 'vihara', 'w': 16, 'd': 11, 'h': 9, 'label': 'วิหารหลวงพ่อศักดิ์สิทธิ์', 'zone': 'old'},
  32: {'icon': 'oldTemple', 'color': '#78350f', 'type': 'ancientUbosot', 'w': 18, 'd': 11, 'h': 10, 'label': 'พระอุโบสถเก่า (โบสถ์เก่า)', 'zone': 'old'},
  13: {'icon': 'scripture', 'color': '#78350f', 'type': 'shop', 'w': 11, 'd': 9, 'h': 7, 'label': 'Tha Sung Coffee (กาแฟท่าซุง)', 'zone': 'old'},
  21: {'icon': 'scripture', 'color': '#b45309', 'type': 'pavilion', 'w': 14, 'd': 11, 'h': 7, 'label': 'ศาลาบูรพาจารย์', 'zone': 'old'},
  38: {'icon': 'tenthBuddha', 'color': '#f59e0b', 'type': 'bodhiShrine', 'w': 12, 'd': 12, 'h': 8, 'label': 'วิหารใต้ต้นโพธิ์', 'zone': 'old'},
  30: {'icon': 'fiveBuddhas', 'color': '#94a3b8', 'type': 'fiveBuddha', 'w': 18, 'd': 12, 'h': 11, 'label': 'วิหารหลวงพ่อ 5 พระองค์', 'zone': 'old'},
  31: {'icon': 'utensils', 'color': '#b45309', 'type': 'hall', 'w': 16, 'd': 12, 'h': 8, 'label': 'หอฉัน', 'zone': 'old'},
  27: {'icon': 'pray', 'color': '#eab308', 'type': 'hall', 'w': 18, 'd': 11, 'h': 7, 'label': 'อาคารเสริมศรี', 'zone': 'old'},
  33: {'icon': 'fish', 'color': '#0284c7', 'type': 'raft', 'w': 20, 'd': 12, 'h': 4, 'label': 'แพเลี้ยงปลา (วังมัจฉา)', 'zone': 'old'},
  40: {'icon': 'fish', 'color': '#0369a1', 'type': 'boat', 'w': 14, 'd': 6, 'h': 5, 'rotY': 0.25, 'label': 'เรือคนึงหา (จามเทวีนาวา)', 'zone': 'old'}
}

# Group order for SATELLITE_LOCATIONS:
order = [
  14, 11, 12, 6, 26, 16, 15, 39,
  9, 10, 4, 28, 3, 8, 2, 29,
  7, 5, 1, 23, 24, 18,
  17, 25, 20, 22,
  37, 35, 34, 36, 32, 13, 21, 38, 30, 31, 27, 33, 40
]

# Generate SATELLITE_LOCATIONS JS code
sat_code = "const SATELLITE_LOCATIONS = [\n"
for pid in order:
    c = coords[str(pid)]
    st = style_map[pid]
    sat_code += f"  {{ id: {pid:>2}, x: {c['x']:>5.1f}, y: {c['y']:>5.1f}, icon: \"{st['icon']}\", color: \"{st['color']}\" }}, // {st['label']}\n"
sat_code += "];\n"

with open('scratch/generated_satellite_locations.js', 'w', encoding='utf-8') as f:
    f.write(sat_code)

# Generate BUILDING_LAYOUT JS code for DigitalTwin3D.jsx
bld_code = "export const BUILDING_LAYOUT = {\n"
for pid in order:
    c = coords[str(pid)]
    st = style_map[pid]
    x_3d = round((c['x'] - 520) * 0.45, 1)
    z_3d = round((c['y'] - 460) * 0.45, 1)
    rot_str = f", rotY: {st['rotY']}" if 'rotY' in st else ""
    bld_code += f"  {pid:>2}: {{ x: {x_3d:>6.1f}, z: {z_3d:>6.1f}, w: {st['w']:>2}, d: {st['d']:>2}, h: {st['h']:>2}{rot_str}, type: \"{st['type']}\", label: \"{st['label']}\", zone: \"{st['zone']}\" }},\n"
bld_code += "};\n"

with open('scratch/generated_3d_layout.js', 'w', encoding='utf-8') as f:
    f.write(bld_code)

print("Generated satellite locations and 3D layout successfully!")
