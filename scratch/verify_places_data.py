import json
import re
import os
from urllib.parse import unquote

places_path = r'c:\Users\Asus\Desktop\เทอม1\GEN211\App_Watthasung\src\data\places.js'
img_root = r'c:\Users\Asus\Desktop\เทอม1\GEN211\App_Watthasung'

with open(places_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Extract only the "export const places = [" section
match = re.search(r'export const places = \[\s*([\s\S]*?)\n\];', text)
if not match:
    print("Could not isolate export const places!")
    exit(1)

places_block = match.group(1)
chunks = places_block.split('"id":')[1:]
print(f"Places in 'export const places': {len(chunks)}")

ids = []
missing_fields = []
missing_photos = []
places_data = []

for idx, c in enumerate(chunks):
    id_m = re.match(r'\s*(\d+)', c)
    pid = int(id_m.group(1)) if id_m else None
    ids.append(pid)
    
    name_m = re.search(r'"name":\s*"([^"]+)"', c)
    name = name_m.group(1) if name_m else "N/A"
    
    # check required fields
    for field in ['name', 'shortName', 'zone', 'category', 'description', 'openingHours', 'gps', 'photos', 'tips']:
        if f'"{field}":' not in c:
            missing_fields.append((pid, field))
            
    lat_m = re.search(r'"lat":\s*([0-9.]+)', c)
    lng_m = re.search(r'"lng":\s*([0-9.]+)', c)
    lat = float(lat_m.group(1)) if lat_m else None
    lng = float(lng_m.group(1)) if lng_m else None
    
    # check photos
    photos_m = re.findall(r'"(/Img/[^"]+)"', c)
    for p in photos_m:
        rel_path = unquote(p.lstrip('/'))
        full_path = os.path.join(img_root, rel_path)
        if not os.path.exists(full_path):
            missing_photos.append((pid, rel_path))
            
    places_data.append({
        'id': pid,
        'name': name,
        'lat': lat,
        'lng': lng,
        'photos_count': len(photos_m)
    })

print(f"Exact count of places: {len(ids)}")
print(f"List of IDs: {sorted(ids)}")
print(f"Expected IDs: 1 to 40 (excluding 19) -> {sorted(list(set(range(1, 41)) - {19}))}")
print(f"IDs match perfectly: {sorted(ids) == sorted(list(set(range(1, 41)) - {19}))}")
print(f"Missing fields: {missing_fields}")
print(f"Missing photos: {missing_photos}")

# Print summary table of places
for p in places_data:
    print(f"ID {p['id']:>2}: {p['name']:<42} -> GPS: ({p['lat']}, {p['lng']}) | Photos: {p['photos_count']}")
