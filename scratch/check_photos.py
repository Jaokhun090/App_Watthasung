import json
import re
import os
from urllib.parse import unquote

places_path = r'c:\Users\Asus\Desktop\เทอม1\GEN211\App_Watthasung\src\data\places.js'
img_root = r'c:\Users\Asus\Desktop\เทอม1\GEN211\App_Watthasung'

with open(places_path, 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'export const places = \[\s*([\s\S]*?)\n\];', text)
places_block = match.group(1)
chunks = places_block.split('"id":')[1:]

missing_photos = []
total_photos = 0

for c in chunks:
    id_m = re.match(r'\s*(\d+)', c)
    pid = int(id_m.group(1)) if id_m else None
    photos_m = re.findall(r'"(/Img/[^"]+)"', c)
    total_photos += len(photos_m)
    for p in photos_m:
        rel_path = unquote(p.lstrip('/'))
        full_path = os.path.join(img_root, rel_path)
        if not os.path.exists(full_path):
            missing_photos.append((pid, rel_path))

with open('scratch/missing_photos_report.json', 'w', encoding='utf-8') as f:
    json.dump({'total_photos': total_photos, 'missing': missing_photos}, f, ensure_ascii=False, indent=2)

print(f"Total photos referenced: {total_photos}")
print(f"Missing photos count: {len(missing_photos)}")
