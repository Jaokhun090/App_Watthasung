import re

with open(r'c:\Users\Asus\Desktop\เทอม1\GEN211\App_Watthasung\src\data\places.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Match each place block
place_blocks = re.findall(r'\{\s*"id":\s*(\d+),\s*"name":\s*"([^"]+)"(?:[^{}]|\{[^{}]*\})*"gps":\s*\{\s*"lat":\s*([0-9.]+),\s*"lng":\s*([0-9.]+)\s*\}', content)

print(f'Found {len(place_blocks)} places with GPS')
for pid, name, lat, lng in place_blocks:
    print(f'{pid:>2}: {name:<45} -> {lat}, {lng}')
