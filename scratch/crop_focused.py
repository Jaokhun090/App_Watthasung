# Let's inspect the user map closely by cropping around all clusters
from PIL import Image

im = Image.open('scratch/user_master_map.jpg')
W, H = im.size

# 1. Top North-West cluster (around 39, 38, 11, 3, 4, 32, 15, 9)
im.crop((0, 0, int(W*0.48), int(H*0.55))).save('scratch/crop_nw.jpg')

# 2. Center West & South West (around 31, 34, 2, 17, 18, 19, 16, 23, 20, 5)
im.crop((0, int(H*0.45), int(W*0.55), H)).save('scratch/crop_sw.jpg')

# 3. North East (around 1, 28, 26, 21, 37, 10, 33, 36)
im.crop((int(W*0.42), 0, int(W*0.82), int(H*0.55))).save('scratch/crop_ne.jpg')

# 4. South East (Old Temple: 14, 13, 29, 27, 6, 8, 7, 22, 12, 24, 25, 35, 30)
im.crop((int(W*0.42), int(H*0.5), int(W*0.82), H)).save('scratch/crop_se.jpg')

print("Cropped 4 focused areas")
