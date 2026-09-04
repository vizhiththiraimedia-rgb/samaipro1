import os
filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\social-news\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Download,,', 'Download,')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed syntax error!")
