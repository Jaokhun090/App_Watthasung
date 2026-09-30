import re

with open(r'c:\Users\Asus\Desktop\เทอม1\GEN211\App_Watthasung\src\data\places.js', 'r', encoding='utf-8') as f:
    text = f.read()

places = []
chunks = text.split('"id":')[1:]
for c in chunks:
    id_m = re.match(r'\s*(\d+)', c)
    pid = int(id_m.group(1)) if id_m else None
    name_m = re.search(r'"name":\s*"([^"]+)"', c)
    name = name_m.group(1) if name_m else "Unknown"
    lat_m = re.search(r'"lat":\s*([0-9.]+)', c)
    lng_m = re.search(r'"lng":\s*([0-9.]+)', c)
    lat = float(lat_m.group(1)) if lat_m else None
    lng = float(lng_m.group(1)) if lng_m else None
    if pid is not None:
        places.append((pid, name, lat, lng))

with open(r'c:\Users\Asus\Desktop\เทอม1\GEN211\App_Watthasung\scratch\places_gps.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total places: {len(places)}\n")
    for p in places:
        f.write(f"ID {p[0]:>2}: {p[1]:<45} -> lat: {p[2]}, lng: {p[3]}\n")

print("Done dumping to scratch/places_gps.txt")
