import os
import re

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\social-news\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('{ backgroundColor: "#05060a", scale: 2 }', '{ backgroundColor: "#05060a", scale: 2, useCORS: true, allowTaint: true }')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added CORS options to html2canvas!")
