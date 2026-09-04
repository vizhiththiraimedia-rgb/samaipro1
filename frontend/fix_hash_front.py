import os
import re

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\social-news\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_set = 'setPostResult(data.post);'
new_set = 'setPostResult(data.post.replace(/#\\S+/g, "").trim());'

if old_set in content:
    content = content.replace(old_set, new_set)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Frontend hashtag strip added!")
else:
    print("Could not find setPostResult!")

