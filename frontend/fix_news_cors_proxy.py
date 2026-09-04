import os
import re

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\social-news\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the feature image div to use a cors proxy
old_div = '''{featureImage && (
                    <div style={{ width: "100%", height: "200px", backgroundImage: `url(${featureImage})`, backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}></div>
                  )}'''

new_div = '''{featureImage && (
                    <div style={{ width: "100%", height: "200px", backgroundImage: `url(https://corsproxy.io/?${encodeURIComponent(featureImage)})`, backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}></div>
                  )}'''

if old_div in content:
    content = content.replace(old_div, new_div)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed image CORS proxy!")
else:
    print("Could not find the old div!")

