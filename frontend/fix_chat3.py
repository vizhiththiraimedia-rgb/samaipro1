import os
import re

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\chat\[projectId]\ChatClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'await apiFetch\(/chat/, \{', re.DOTALL)
replacement = 'await apiFetch(`/chat/${projectId}`, {'

new_content = pattern.sub(replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
