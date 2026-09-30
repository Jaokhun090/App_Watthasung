import json
import math
from PIL import Image, ImageDraw, ImageFont

with open('scratch/true_39_places_gps.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

# Let's inspect the bounding box of the true coordinates:
lats = [p['lat'] for p in places.values()]
lngs = [p['lng'] for p in places.values()]
min_lat, max_lat = min(lats), max(lats)
min_lng, max_lng = min(lngs), max(lngs)

print(f"Lat range: {min_lat} to {max_lat} (delta: {max_lat - min_lat:.6f})")
print(f"Lng range: {min_lng} to {max_lng} (delta: {max_lng - min_lng:.6f})")

# In our 1200x850 map:
# X spans roughly from 150 (West) to 850 (East river bank)
# Y spans roughly from 130 (North) to 800 (South)
# Note: In screen coords, Y increases downwards, whereas Latitude increases NORTHWARDS (upwards).
# So Y is negatively proportional to Lat.
# X is positively proportional to Lng.

# Let's use an affine model:
# X = a * lng + b * lat + c
# Y = d * lng + e * lat + f
# Anchors that align with our existing beautiful SVG landmarks and roads:
# 1) Phra Yuen 30 Sok (id: 3): lat 15.332189, lng 100.069145 -> (X: 255, Y: 245)
# 2) Prasat Thong (id: 1): lat 15.329376, lng 100.069318 -> (X: 280, Y: 530)
# 3) New Ubosot (id: 20): lat 15.327889, lng 100.071243 -> (X: 490, Y: 710)
# 4) Vihara 100m (id: 12): lat 15.332025, lng 100.073260 -> (X: 685, Y: 235)
# 5) Wang Matcha (id: 33): lat 15.326934, lng 100.073206 -> (X: 715, Y: 780)
# 6) School (id: 39): lat 15.330012, lng 100.075196 -> (X: 840, Y: 480)
# 7) Vihara Kasyapa (id: 29): lat 15.330657, lng 100.068335 -> (X: 195, Y: 390)
# 8) Suan Somdej (id: 9): lat 15.333375, lng 100.071758 -> (X: 510, Y: 150)

import numpy as np

anchors = [
  (15.332189, 100.069145, 255, 245),
  (15.329376, 100.069318, 280, 530),
  (15.327889, 100.071243, 490, 710),
  (15.332025, 100.073260, 685, 235),
  (15.326934, 100.073206, 715, 780),
  (15.330012, 100.075196, 840, 480),
  (15.330657, 100.068335, 195, 390),
  (15.333375, 100.071758, 510, 150),
]

A = []
Bx, By = [], []
for lat, lng, x, y in anchors:
    A.append([lng, lat, 1])
    Bx.append(x)
    By.append(y)

A = np.array(A)
coeff_x, _, _, _ = np.linalg.lstsq(A, Bx, rcond=None)
coeff_y, _, _, _ = np.linalg.lstsq(A, By, rcond=None)

# Calculate initial projected positions
coords_2d = {}
for pid_str, info in places.items():
    pid = int(pid_str)
    lat = info['lat']
    lng = info['lng']
    px = coeff_x[0] * lng + coeff_x[1] * lat + coeff_x[2]
    py = coeff_y[0] * lng + coeff_y[1] * lat + coeff_y[2]
    coords_2d[pid] = {'x': px, 'y': py, 'name': info['name'], 'lat': lat, 'lng': lng}

# In tight clusters (e.g. Old Temple, Phra Yuen/Chedi Phuttan, Im Boon/Sawatdikan),
# let's apply collision resolution so that icons and labels never overlap!
# Minimum distance between pin centers: 36px
for step in range(50):
    moved = False
    for id1, p1 in coords_2d.items():
        for id2, p2 in coords_2d.items():
            if id1 >= id2:
                continue
            dx = p2['x'] - p1['x']
            dy = p2['y'] - p1['y']
            dist = math.hypot(dx, dy)
            min_dist = 36.0
            # Extra horizontal spacing if y is very close (for label pills)
            if abs(dy) < 18 and abs(dx) < 55:
                min_dist = 48.0
            if dist < min_dist and dist > 0.001:
                overlap = (min_dist - dist) / 2.0
                nx = dx / dist
                ny = dy / dist
                p1['x'] -= nx * overlap * 0.5
                p1['y'] -= ny * overlap * 0.5
                p2['x'] += nx * overlap * 0.5
                p2['y'] += ny * overlap * 0.5
                moved = True

# Round to 1 decimal place
for pid, p in coords_2d.items():
    p['x'] = round(p['x'], 1)
    p['y'] = round(p['y'], 1)

# Draw on a test canvas overlay to visually check!
im = Image.new('RGB', (1200, 850), (247, 243, 236))
draw = ImageDraw.Draw(im)

# Draw Hwy 3265
hwy_points = [(428, 850), (475, 780), (538, 680), (618, 540), (686, 400), (736, 280), (790, 140), (800, 0)]
draw.line(hwy_points, fill=(30, 41, 59), width=20)
draw.line(hwy_points, fill=(255, 255, 255), width=2)

# Draw River
river_points = [(630, 850), (670, 780), (735, 680), (800, 560), (885, 420), (960, 280), (1010, 140), (1040, 0), (1200, 0), (1200, 850)]
draw.polygon(river_points, fill=(14, 165, 233))

# Draw places
for pid, p in coords_2d.items():
    x, y = p['x'], p['y']
    draw.rectangle([x-15, y-13, x+15, y+13], fill=(254, 243, 199), outline=(212, 168, 67), width=2)
    draw.ellipse([x+5, y-15, x+18, y-2], fill=(212, 168, 67))
    # text
    draw.text((x-20, y+16), f"{pid}:{p['name'][:10]}", fill=(15, 23, 42))

im.save('scratch/gps_aligned_map_test.jpg', quality=90)
print("Saved scratch/gps_aligned_map_test.jpg")

with open('scratch/projected_2d_and_3d.json', 'w', encoding='utf-8') as f:
    json.dump(coords_2d, f, ensure_ascii=False, indent=2)
