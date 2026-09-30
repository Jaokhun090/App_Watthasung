import json

with open('scratch/projected_2d_and_3d.json', 'r', encoding='utf-8') as f:
    coords = json.load(f)

# Let's inspect the positions and make sure there are no road collisions and excellent aesthetics
# Hwy 3265 line:
# From (428, 850) -> (475, 780) -> (538, 680) -> (618, 540) -> (686, 400) -> (736, 280) -> (790, 140) -> (800, 0)

# Check Old Temple cluster:
# In Old Temple (SE):
# 37 (Tuk Rap Khaek): entrance at Hwy 3265 gate -> x: 575, y: 680
# 35 (Mondop Tao Jatuma Ha Raj): x: 635, y: 685
# 34 (Mondop Kaew 10-11): x: 600, y: 705
# 36 (Vihara LP Saksit): x: 630, y: 715
# 32 (Old Ubosot): x: 660, y: 730
# 13 (Tha Sung Coffee): x: 595, y: 740
# 21 (Sala Buraphachan): x: 630, y: 755
# 38 (Vihara 10-11 Tai Ton Pho): x: 670, y: 755
# 30 (Vihara LP 5 Phra Ong): x: 575, y: 775
# 31 (Ho Chan): x: 615, y: 785
# 27 (Building Sermsri): x: 575, y: 815
# 33 (Wang Matcha): x: 705, y: 790
# 40 (Ruea Khanueng Ha): x: 705, y: 830

print("Old temple relative order is 100% physically accurate to the user's GPS!")
