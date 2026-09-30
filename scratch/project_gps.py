import json
from PIL import Image, ImageDraw

with open('scratch/all_39_gps.json', 'r', encoding='utf-8') as f:
    places_gps = json.load(f)

# Bounds
min_lat = 15.3265
max_lat = 15.3338
min_lng = 100.0680
max_lng = 100.0755

width = 1200
height = 850
padding = 60

# We map lng -> X [padding .. width - padding]
# lat -> Y [padding .. height - padding] where max_lat is at padding (top) and min_lat is at bottom
def gps_to_xy(lat, lng):
    x = padding + (lng - min_lng) / (max_lng - min_lng) * (width - 2 * padding)
    y = padding + (max_lat - lat) / (max_lat - min_lat) * (height - 2 * padding)
    return round(x, 1), round(y, 1)

im = Image.new('RGB', (width, height), '#f8fafc')
draw = ImageDraw.Draw(im)

xy_map = {}
for pid, info in places_gps.items():
    x, y = gps_to_xy(info['lat'], info['lng'])
    xy_map[pid] = {'x': x, 'y': y, 'name': info['name']}
    # draw pin
    draw.ellipse([x-6, y-6, x+6, y+6], fill='#ef4444', outline='#ffffff', width=2)
    draw.text((x+8, y-6), f"{pid}: {info['name']}", fill='#0f172a')

im.save('scratch/gps_projected_map.jpg', 'JPEG')
with open('scratch/projected_xy.json', 'w', encoding='utf-8') as f:
    json.dump(xy_map, f, ensure_ascii=False, indent=2)

print("Saved scratch/gps_projected_map.jpg and projected_xy.json")
