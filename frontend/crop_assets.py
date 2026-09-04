from PIL import Image
import os

img_path = r'C:\Users\ASUS\.gemini\antigravity\brain\fa821946-df07-4234-806e-5369fe744475\.user_uploaded\media_1788449480274.png'
out_dir = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\public\assets'
os.makedirs(out_dir, exist_ok=True)

with Image.open(img_path) as img:
    # 1. Chudar Media Logo
    # Approximating bounding box from looking at the image
    logo_box = (580, 20, 680, 120)
    logo_img = img.crop(logo_box)
    logo_img.save(os.path.join(out_dir, 'chudar_logo.png'))
    
    # 2. Bottom Banner
    banner_box = (0, 894, 700, 1024)
    banner_img = img.crop(banner_box)
    banner_img.save(os.path.join(out_dir, 'sasip_banner.png'))

print("Cropped successfully!")
