import json
import math
from PIL import Image, ImageDraw, ImageFont

with open('scratch/projected_2d_and_3d.json', 'r', encoding='utf-8') as f:
    coords = json.load(f)

# Fine-tune coordinates for maximum legibility (Zero overlap guaranteed)
# Old Temple group:
coords['37']['x'] = 585.0; coords['37']['y'] = 665.0  # ตึกรับแขก (ริมถนนประตูวัดเก่า)
coords['35']['x'] = 645.0; coords['35']['y'] = 650.0  # มณฑปท้าวจาตุมหาราช
coords['34']['x'] = 610.0; coords['34']['y'] = 690.0  # มณฑปแก้วพระองค์ที่ 10-11
coords['36']['x'] = 665.0; coords['36']['y'] = 685.0  # วิหารหลวงพ่อศักดิ์สิทธิ์
coords['32']['x'] = 715.0; coords['32']['y'] = 695.0  # พระอุโบสถเก่า
coords['13']['x'] = 585.0; coords['13']['y'] = 725.0  # Tha Sung Coffee
coords['21']['x'] = 640.0; coords['21']['y'] = 725.0  # ศาลาบูรพาจารย์
coords['38']['x'] = 695.0; coords['38']['y'] = 735.0  # วิหารใต้ต้นโพธิ์
coords['30']['x'] = 580.0; coords['30']['y'] = 765.0  # วิหาร 5 พระองค์
coords['31']['x'] = 635.0; coords['31']['y'] = 765.0  # หอฉัน
coords['27']['x'] = 580.0; coords['27']['y'] = 810.0  # อาคารเสริมศรี
coords['33']['x'] = 695.0; coords['33']['y'] = 785.0  # แพปลา วังมัจฉา
coords['40']['x'] = 695.0; coords['40']['y'] = 835.0  # เรือคนึงหา

# New Temple adjustments:
coords['20']['x'] = 490.0; coords['20']['y'] = 685.0  # โบสถ์ใหม่
coords['22']['x'] = 530.0; coords['22']['y'] = 685.0  # ศาลานวราช
coords['25']['x'] = 455.0; coords['25']['y'] = 650.0  # ธรรมวิโมกข์
coords['17']['x'] = 395.0; coords['17']['y'] = 700.0  # ศาลา 12 ไร่
coords['18']['x'] = 355.0; coords['18']['y'] = 590.0  # ศาลา 4 ไร่
coords['23']['x'] = 400.0; coords['23']['y'] = 540.0  # ศาลา 2 ไร่
coords['24']['x'] = 475.0; coords['24']['y'] = 550.0  # ศาลา 3 ไร่
coords['1']['x']  = 290.0; coords['1']['y']  = 530.0  # ปราสาททอง
coords['5']['x']  = 370.0; coords['5']['y']  = 430.0  # ลาน 25 ไร่
coords['7']['x']  = 460.0; coords['7']['y']  = 420.0  # ตึกขาว

# Canvas setup
scale = 1.3333333333333333
W, H = int(1200 * scale), int(850 * scale)
im = Image.new('RGB', (W, H), (247, 244, 238))
draw = ImageDraw.Draw(im)

def S(x, y):
    return (int(x * scale), int(y * scale))

def S_pts(pts):
    return [S(x, y) for (x, y) in pts]

# 1. Background Temple Territory (warm earth tone like the signboard)
territory_pts = S_pts([
    (140, 290), (140, 110), (220, 85), (540, 85), (630, 125), 
    (750, 125), (820, 230), (840, 380), (890, 460), (745, 630),
    (740, 860), (430, 860), (240, 810), (180, 560), (140, 290)
])
draw.polygon(territory_pts, fill=(241, 234, 222), outline=(226, 215, 198), width=2)

# Suan Somdej Lake
lake_pts = S_pts([
    (260, 165), (300, 140), (420, 130), (480, 145), (495, 155), 
    (485, 185), (450, 190), (390, 200), (310, 195), (270, 185), (255, 175), (260, 165)
])
draw.polygon(lake_pts, fill=(56, 189, 248), outline=(2, 132, 199), width=2)
gx, gy = S(380, 160)
draw.ellipse([gx-12, gy-12, gx+12, gy+12], fill=(254, 240, 138), outline=(180, 83, 9), width=2)

# Sakae Krang River (East)
river_pts = S_pts([
    (630, 850), (670, 780), (735, 680), (800, 560), (885, 420), 
    (960, 280), (1010, 140), (1040, 0), (1200, 0), (1200, 850)
])
draw.polygon(river_pts, fill=(14, 165, 233), outline=(2, 132, 199))

# River Fish Raft (Wang Matcha)
rx, ry = S(695, 785)
draw.rectangle([rx-28, ry-18, rx+28, ry+18], fill=(249, 115, 22), outline=(194, 65, 12), width=3)
# Boat (Ruea Khanueng Ha)
bx, by = S(695, 835)
draw.polygon([(bx-22, by-9), (bx+22, by-9), (bx+14, by+12), (bx-14, by+12)], fill=(2, 132, 199), outline=(3, 105, 161), width=2)

# 2. ROADS (Google Maps Real Network)
# Highway 3265
hwy = S_pts([(428, 850), (475, 780), (538, 680), (618, 540), (686, 400), (736, 280), (790, 140), (800, 0)])
draw.line(hwy, fill=(30, 41, 59), width=int(24 * scale))
draw.line(hwy, fill=(255, 255, 255), width=int(2.5 * scale))

# North Loop
north_loop = S_pts([
    (740, 270), (600, 210), (480, 210), (370, 210), (290, 210), (220, 230), 
    (210, 280), (230, 310), (330, 310), (460, 310), (580, 310), (700, 360)
])
draw.line(north_loop, fill=(71, 85, 105), width=int(14 * scale))
draw.line(north_loop, fill=(255, 255, 255), width=int(1.5 * scale))

# West Central Spine Road
spine_w = S_pts([(650, 470), (540, 470), (430, 470), (330, 470), (250, 470), (250, 560), (330, 560), (440, 560), (520, 560), (600, 570)])
draw.line(spine_w, fill=(71, 85, 105), width=int(13 * scale))

# South Cross Road
south_road = S_pts([(538, 680), (470, 680), (380, 680), (260, 680), (250, 560)])
draw.line(south_road, fill=(71, 85, 105), width=int(13 * scale))

# Vihara 100m East Loop
vihara_loop = S_pts([(790, 140), (740, 140), (680, 150), (630, 200), (630, 280), (660, 340), (720, 340), (750, 310)])
draw.line(vihara_loop, fill=(71, 85, 105), width=int(12 * scale))

# Old Temple Road Loop
old_loop = S_pts([(538, 680), (590, 650), (650, 645), (715, 660), (745, 720), (730, 780), (660, 785), (560, 785), (550, 740), (538, 680)])
draw.line(old_loop, fill=(71, 85, 105), width=int(12 * scale))

# 3. DASHED ZONE BOUNDARY & PATHWAY LINES (ถอดจากป้าย 20260927_122430.jpg)
def draw_dashed_path(points, color=(180, 83, 9), width=3.5, dash_len=9, gap_len=6):
    scaled_pts = S_pts(points)
    for i in range(len(scaled_pts)-1):
        p1 = scaled_pts[i]
        p2 = scaled_pts[i+1]
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        dist = math.hypot(dx, dy)
        if dist < 1:
            continue
        ux = dx / dist
        uy = dy / dist
        curr = 0
        while curr < dist:
            start_x = p1[0] + ux * curr
            start_y = p1[1] + uy * curr
            end_dist = min(curr + dash_len, dist)
            end_x = p1[0] + ux * end_dist
            end_y = p1[1] + uy * end_dist
            draw.line([(start_x, start_y), (end_x, end_y)], fill=color, width=int(width * scale))
            curr += dash_len + gap_len

# 3.1 เส้นประเชื่อม ศาลา ๑๒ ไร่ ↔ ศาลา ๒,๔ ไร่ ↔ ศาลา ๓ ไร่ (ตามป้าย)
draw_dashed_path([(395, 700), (375, 640), (355, 590), (400, 540), (475, 550)], color=(180, 83, 9), width=3.5)

# 3.2 เส้นประแบ่งเขต สวนป่าไผ่ ↔ ลาน ๒๕ ไร่ ↔ ตึกขาว (ตามป้าย)
draw_dashed_path([(190, 401), (250, 420), (370, 430), (460, 420), (480, 470)], color=(16, 185, 129), width=3.5)

# 3.3 เส้นประทางเดิน มหาวิหารแก้ว ๑๐๐ เมตร ↔ วิหารพระวิสุทธิเทพ ↔ พระเจ้าพรหมมหาราช (ตามป้าย)
draw_dashed_path([(664, 265), (685, 310), (706, 366), (709, 402)], color=(2, 132, 199), width=3.5)

# 3.4 เส้นประทางเดิน พระยืน ๓๐ ศอก ↔ เจดีย์พุดตาน ↔ สมเด็จองค์ปฐม ↔ พระศรีอาริยเมตไตรย (ตามป้าย)
draw_dashed_path([(252, 259), (264, 225), (311, 218), (340, 260), (370, 210)], color=(217, 119, 6), width=3.5)

# 3.5 เส้นประเชื่อม วิหารพระวิสุทธิเทพ ↔ พระพินิจอักษร ↔ ห้องสมุดประชาชน ↔ โรงเรียน (ตามป้าย)
draw_dashed_path([(706, 366), (733, 338), (776, 356), (820, 410), (868, 474)], color=(180, 83, 9), width=3.5)

# 3.6 เส้นประฝั่งวัดเก่า: ทางเดินเชื่อม โบสถ์เก่า ↔ หลวงพ่อศักดิ์สิทธิ์ ↔ มณฑป ↔ กาแฟท่าซุง ↔ ศาลาบูรพาจารย์ ↔ วังมัจฉา (ตามป้าย)
draw_dashed_path([(715, 695), (665, 685), (610, 690), (585, 725), (640, 725), (695, 735), (695, 785)], color=(185, 28, 28), width=3.5)

# 4. BUILDING FOOTPRINTS
# Prasat Thong
pt_x, pt_y = S(290, 530)
draw.rectangle([pt_x-32, pt_y-32, pt_x+32, pt_y+32], fill=(254, 243, 199), outline=(212, 168, 67), width=3)
draw.rectangle([pt_x-20, pt_y-20, pt_x+20, pt_y+20], fill=(253, 230, 138), outline=(212, 168, 67), width=2)

# Vihara 100m
v_x, v_y = S(664, 265)
draw.rectangle([v_x-48, v_y-20, v_x+48, v_y+20], fill=(224, 242, 254), outline=(2, 132, 199), width=3)

# Tuk Khao
tk_x, tk_y = S(460, 420)
draw.rectangle([tk_x-45, tk_y-40, tk_x+45, tk_y+40], fill=(248, 250, 252), outline=(148, 163, 184), width=3)

# Sala 12 Rai
s12_x, s12_y = S(395, 700)
draw.rectangle([s12_x-36, s12_y-24, s12_x+36, s12_y+24], fill=(241, 245, 249), outline=(100, 116, 139), width=3)

# New Ubosot
nb_x, nb_y = S(490, 685)
draw.rectangle([nb_x-24, nb_y-30, nb_x+24, nb_y+30], fill=(254, 243, 199), outline=(212, 168, 67), width=3)

# Old Ubosot
ob_x, ob_y = S(715, 695)
draw.rectangle([ob_x-20, ob_y-14, ob_x+20, ob_y+14], fill=(255, 251, 235), outline=(180, 83, 9), width=2)

# 5. PINS & LABELS FOR ALL 39 PLACES
try:
    font_bold = ImageFont.truetype("tahoma.ttf", 13)
    font_small = ImageFont.truetype("tahoma.ttf", 11)
    font_badge = ImageFont.truetype("tahoma.ttf", 12)
    font_title = ImageFont.truetype("tahomabd.ttf", 19)
    font_arrow = ImageFont.truetype("tahomabd.ttf", 15)
except:
    font_bold = ImageFont.load_default()
    font_small = ImageFont.load_default()
    font_badge = ImageFont.load_default()
    font_title = ImageFont.load_default()
    font_arrow = ImageFont.load_default()

# Highways direction labels
draw.text(S(420, 825), "<- ไป อ.มโนรมย์ / ชัยนาท", fill=(255, 255, 255), font=font_arrow)
draw.text(S(745, 45), "ไป อ.เมือง อุทัยธานี ->", fill=(255, 255, 255), font=font_arrow)
draw.text(S(980, 380), "แม่น้ำสะแกกรัง", fill=(255, 255, 255), font=font_title)

# Draw pins
for pid_str, p in coords.items():
    pid = int(pid_str)
    x, y = S(p['x'], p['y'])
    name = p['name']
    
    is_hl = pid in [1, 12, 3, 20, 32, 4, 36, 17, 34, 35, 6, 28, 30, 38, 29]
    box_color = (254, 243, 199) if is_hl else (255, 255, 255)
    border_color = (212, 168, 67) if is_hl else (148, 163, 184)
    badge_color = (212, 168, 67) if is_hl else (71, 85, 105)
    
    # Base Box
    draw.rectangle([x-18, y-15, x+18, y+15], fill=box_color, outline=border_color, width=2)
    
    # Badge circle
    draw.ellipse([x+8, y-22, x+28, y-2], fill=badge_color, outline=(255, 255, 255), width=2)
    draw.text((x+13 if pid < 10 else x+10, y-19), str(pid), fill=(255, 255, 255), font=font_badge)
    
    # Short name
    short_name = name.split('(')[0].strip()
    draw.rectangle([x-42, y+18, x+42, y+34], fill=(255, 255, 255), outline=(203, 213, 225), width=1)
    draw.text((x-38, y+19), short_name[:11], fill=(15, 23, 42), font=font_small)

# Title & Legend Box
draw.rectangle([20, 20, 560, 115], fill=(255, 255, 255), outline=(212, 168, 67), width=3)
draw.text((35, 26), "แบบร่างแผนผังวัดท่าซุง 2D (แนวถนนจริง + เส้นประแบ่งเขต)", fill=(180, 83, 9), font=font_title)
draw.text((35, 58), "• แถบสีเทาเข้ม = ถนนสาย 3265 (ผ่ากลาง) และแนวถนนเชื่อมจริงจาก Google Maps", fill=(30, 41, 59), font=font_small)
draw.text((35, 76), "• เส้นประสีส้ม/เขียว/น้ำตาล = เส้นประแบ่งเขต & ทางเดิน ถอดแบบจากป้ายผังวัดท่าซุง", fill=(180, 83, 9), font=font_small)
draw.text((35, 94), "• หมุดสีทอง = ปูชนียสถานสำคัญ 15 จุด | หมุดสีเทา = ศาลา / ที่พัก / ร้านค้า / บริการ", fill=(100, 116, 139), font=font_small)

im.save('scratch/wat_tha_sung_2d_draft_preview.jpg', quality=95)
print("Updated scratch/wat_tha_sung_2d_draft_preview.jpg successfully!")
