import re
import json

with open('scratch/true_39_places_gps.json', 'r', encoding='utf-8') as f:
    true_gps = json.load(f)

# 1. Update src/data/places.js
places_file = r'c:\Users\Asus\Desktop\เทอม1\GEN211\App_Watthasung\src\data\places.js'
with open(places_file, 'r', encoding='utf-8') as f:
    content = f.read()

# For each place ID, replace its gps object
for pid_str, info in true_gps.items():
    pid = int(pid_str)
    lat = info['lat']
    lng = info['lng']
    
    # We find the place block by searching for "id": <pid>
    # Pattern to match the place object:
    # "id": <pid>,
    # ...
    # "gps": {
    #   "lat": ...,
    #   "lng": ...
    # }
    
    pattern = rf'("id":\s*{pid},[\s\S]*?"gps":\s*\{{\s*"lat":\s*)[0-9.]+(,\s*"lng":\s*)[0-9.]+(\s*\}})'
    match = re.search(pattern, content)
    if match:
        repl = rf'\g<1>{lat}\g<2>{lng}\g<3>'
        content = re.sub(pattern, repl, content, count=1)
        print(f"Updated GPS for place {pid}")
    else:
        print(f"WARNING: Could not find GPS block for place {pid}")

# Also update zone for Place 13 (Tha Sung Coffee) -> "old", Place 21 (Sala Buraphachan) -> "old"
# Let's check their current zone:
content = re.sub(
    r'("id":\s*13,[\s\S]*?"zone":\s*")[^"]+(")',
    r'\g<1>old\g<2>',
    content
)
content = re.sub(
    r'("id":\s*21,[\s\S]*?"zone":\s*")[^"]+(")',
    r'\g<1>old\g<2>',
    content
)

with open(places_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated src/data/places.js successfully!")
