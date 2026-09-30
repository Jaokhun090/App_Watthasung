import json
import re

with open(r'c:\Users\Asus\Desktop\เทอม1\GEN211\App_Watthasung\src\data\places.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Match each place object
items = []
chunks = text.split('"id":')[1:]
for c in chunks:
    id_m = re.match(r'\s*(\d+)', c)
    pid = int(id_m.group(1)) if id_m else None
    name_m = re.search(r'"name":\s*"([^"]+)"', c)
    name = name_m.group(1) if name_m else ""
    short_m = re.search(r'"shortName":\s*"([^"]+)"', c)
    short = short_m.group(1) if short_m else ""
    zone_m = re.search(r'"zone":\s*"([^"]+)"', c)
    zone = zone_m.group(1) if zone_m else ""
    cat_m = re.search(r'"category":\s*"([^"]+)"', c)
    cat = cat_m.group(1) if cat_m else ""
    hl_m = re.search(r'"highlight":\s*(true|false)', c)
    hl = hl_m.group(1) == 'true' if hl_m else False
    if pid is not None:
        items.append({'id': pid, 'name': name, 'shortName': short, 'zone': zone, 'cat': cat, 'highlight': hl})

with open('scratch/places_list.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f"Total: {len(items)}")
