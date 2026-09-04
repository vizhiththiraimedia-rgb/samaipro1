import os

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\social-news\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_img = '<img crossOrigin="anonymous" src={`https://api.allorigins.win/raw?url=${encodeURIComponent(featureImage)}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "block" }} />'

# First, ensure getApiBaseUrl is imported if not already. It should be imported.
if 'getApiBaseUrl' not in content:
    content = content.replace('import { apiFetch } from "../../../utils/api";', 'import { apiFetch, getApiBaseUrl } from "../../../utils/api";')
elif 'import { apiFetch }' in content and 'getApiBaseUrl' not in content.split('import { apiFetch')[0]:
     content = content.replace('import { apiFetch } from "../../../utils/api";', 'import { apiFetch, getApiBaseUrl } from "../../../utils/api";')

new_img = '<img crossOrigin="anonymous" src={`${getApiBaseUrl()}/social-news/proxy-image?url=${encodeURIComponent(featureImage)}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "block" }} />'

if old_img in content:
    content = content.replace(old_img, new_img)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Switched to backend proxy!")
else:
    print("Could not find old img tag!")
