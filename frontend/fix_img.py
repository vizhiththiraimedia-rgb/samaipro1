import os

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\social-news\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_div = '<div style={{ width: "100%", height: "200px", backgroundImage: `url(https://api.allorigins.win/raw?url=${encodeURIComponent(featureImage)})`, backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}></div>'

new_img = '<img crossOrigin="anonymous" src={`https://api.allorigins.win/raw?url=${encodeURIComponent(featureImage)}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "block" }} />'

if old_div in content:
    content = content.replace(old_div, new_img)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Switched to img tag with crossOrigin!")
else:
    print("Could not find the old div!")
