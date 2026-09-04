from PIL import Image
import os

img_path = r'C:\Users\ASUS\.gemini\antigravity\brain\fa821946-df07-4234-806e-5369fe744475\.user_uploaded\media_1788449480274.png'
if os.path.exists(img_path):
    with Image.open(img_path) as img:
        print(f"Size: {img.width}x{img.height}")
else:
    print("Image not found!")
