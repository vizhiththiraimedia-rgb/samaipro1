import os

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\social-news\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update handleGenerateNews
old_set_image = """        if (data && data.post) {
          setPostResult(data.post);
          setFeatureImage(data.image || "");
        }"""
new_set_image = """        if (data && data.post) {
          setPostResult(data.post);
          if (data.image) {
            try {
              const b64Res = await apiFetch(`/social-news/proxy-image?url=${encodeURIComponent(data.image)}`);
              setFeatureImage(b64Res.base64 || data.image);
            } catch (e) {
              setFeatureImage(data.image);
            }
          } else {
            setFeatureImage("");
          }
        }"""
if old_set_image in content:
    content = content.replace(old_set_image, new_set_image)

# 2. Update the img tag
old_img = '<img crossOrigin="anonymous" src={`${getApiBaseUrl()}/social-news/proxy-image?url=${encodeURIComponent(featureImage)}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "block" }} />'
new_img = '<img src={featureImage} style={{ width: "100%", height: "200px", objectFit: "cover", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "block" }} />'

if old_img in content:
    content = content.replace(old_img, new_img)
elif 'crossOrigin' in content:
    import re
    content = re.sub(r'<img crossOrigin="anonymous".*? />', new_img, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated frontend for base64 image!")
