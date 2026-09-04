from PIL import Image
import os

out_dir = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\public\assets'

with Image.open(os.path.join(out_dir, 'chudar_logo.png')) as img:
    print(f"Logo Size: {img.width}x{img.height}")
    
with Image.open(os.path.join(out_dir, 'sasip_banner.png')) as img:
    print(f"Banner Size: {img.width}x{img.height}")
