from PIL import Image

im = Image.open('scratch/user_master_map.jpg')
w, h = im.size

# Let's crop into 4 quadrants to view all numbers clearly
# Top-Left:
im.crop((0, 0, int(w*0.5), int(h*0.55))).save('scratch/user_tl.jpg', quality=95)
# Bottom-Left:
im.crop((0, int(h*0.45), int(w*0.55), h)).save('scratch/user_bl.jpg', quality=95)
# Top-Right:
im.crop((int(w*0.4), 0, w, int(h*0.55))).save('scratch/user_tr.jpg', quality=95)
# Bottom-Right:
im.crop((int(w*0.4), int(h*0.45), w, h)).save('scratch/user_br.jpg', quality=95)

print("Saved 4 crops of user map")
