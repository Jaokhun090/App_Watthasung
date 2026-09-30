from PIL import Image

im = Image.open(r'c:\Users\Asus\Desktop\เทอม1\GEN211\App_Watthasung\Img\map\20260927_122430.jpg')
# The signboard board is roughly within (250, 650, 3850, 2600)
crop = im.crop((280, 680, 3800, 2550))
crop.save('scratch/signboard_clean.jpg', quality=85)
print('Saved clean signboard')
