import json
from PIL import Image, ImageDraw

with open('scratch/all_39_gps.json', 'r', encoding='utf-8') as f:
    places_gps = json.load(f)

# The satellite image Screenshot 2026-09-30 140334.png
# Let's see: on map_1200x850.jpg, what are the GPS bounds?
# Let's find the linear calibration between (lng, lat) and (x, y) on our 1200x850 map!
# We can use key anchor points that are clearly visible on both satellite and GPS:
# Anchor 1: Phra Yuen 30 Sok (id: 3): lat 15.332189, lng 100.069145 -> (x: 255, y: 245)
# Anchor 2: Prasat Thong (id: 1): lat 15.329376, lng 100.069318 -> (x: 280, y: 530)
# Anchor 3: New Ubosot (id: 20): lat 15.327889, lng 100.071243 -> (x: 490, y: 710)
# Anchor 4: Luang Por Saksit (id: 36): lat 15.327931, lng 100.073147 -> (x: 620, y: 710)
# Anchor 5: Vihara 100m (id: 12): lat 15.332050, lng 100.073200 -> (x: 675, y: 235)
# Anchor 6: Wang Matcha (id: 33): lat 15.326934, lng 100.073206 -> (x: 715, y: 780)

# Let's solve a simple 2D affine / linear transformation:
# x = a * lng + b * lat + c
# y = d * lng + e * lat + f
# Or since North is Up in Google Maps:
# x is primarily dependent on lng, y is primarily dependent on lat, with slight road angle / projection.

# Let's use numpy least squares to fit the best linear mapping:
import numpy as np

anchors = [
  # (lat, lng, x, y)
  (15.332189, 100.069145, 255, 245), # Phra Yuen 30 Sok
  (15.329376, 100.069318, 280, 530), # Prasat Thong
  (15.327889, 100.071243, 490, 710), # New Ubosot
  (15.327931, 100.073147, 620, 710), # Luang Por Saksit
  (15.332050, 100.073200, 675, 235), # Vihara 100m
  (15.326934, 100.073206, 715, 780), # Wang Matcha
  (15.330012, 100.075196, 840, 480), # School
  (15.330657, 100.068335, 195, 390), # Vihara Kasyapa
  (15.333375, 100.071758, 510, 160), # Suan Somdej
]

A = []
Bx = []
By = []
for lat, lng, x, y in anchors:
    A.append([lng, lat, 1])
    Bx.append(x)
    By.append(y)

A = np.array(A)
Bx = np.array(Bx)
By = np.array(By)

# Solve
coeff_x, _, _, _ = np.linalg.lstsq(A, Bx, rcond=None)
coeff_y, _, _, _ = np.linalg.lstsq(A, By, rcond=None)

print(f"X formula: {coeff_x[0]:.4f} * lng + {coeff_x[1]:.4f} * lat + {coeff_x[2]:.4f}")
print(f"Y formula: {coeff_y[0]:.4f} * lng + {coeff_y[1]:.4f} * lat + {coeff_y[2]:.4f}")

# Check anchor residuals
for lat, lng, x, y in anchors:
    pred_x = coeff_x[0] * lng + coeff_x[1] * lat + coeff_x[2]
    pred_y = coeff_y[0] * lng + coeff_y[1] * lat + coeff_y[2]
    print(f"Anchor at ({x}, {y}) -> pred: ({pred_x:.1f}, {pred_y:.1f}), diff: ({pred_x-x:.1f}, {pred_y-y:.1f})")

# Now calculate for ALL 39 places!
final_places = {}
for pid_str, info in places_gps.items():
    pid = int(pid_str)
    lat = info['lat']
    lng = info['lng']
    px = round(coeff_x[0] * lng + coeff_x[1] * lat + coeff_x[2], 1)
    py = round(coeff_y[0] * lng + coeff_y[1] * lat + coeff_y[2], 1)
    final_places[pid] = {
      'lat': lat,
      'lng': lng,
      'x': px,
      'y': py,
      'name': info['name']
    }

with open('scratch/calibrated_all_39.json', 'w', encoding='utf-8') as f:
    json.dump(final_places, f, ensure_ascii=False, indent=2)

print("Saved scratch/calibrated_all_39.json")
