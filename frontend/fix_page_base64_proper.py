import os
import re

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\social-news\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update handleGenerateNews block
pattern_set = re.compile(r'if \(data && data\.post\)\s*\{\s*setPostResult\(data\.post\);\s*setFeatureImage\(data\.image \|\| ""\);\s*\}', re.DOTALL)

new_set_image = """if (data && data.post) {
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

if pattern_set.search(content):
    content = pattern_set.sub(new_set_image, content)
    print("Replaced handleGenerateNews block.")
else:
    print("Could not find pattern for handleGenerateNews!")

# 2. Update the img tag
pattern_img = re.compile(r'<img.*?crossOrigin="anonymous".*?/>', re.DOTALL)
new_img = '<img src={featureImage} style={{ width: "100%", height: "200px", objectFit: "cover", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "block" }} />'

if pattern_img.search(content):
    content = pattern_img.sub(new_img, content)
    print("Replaced img tag.")
else:
    print("Could not find img tag!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
