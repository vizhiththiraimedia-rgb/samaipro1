import os
import re

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\chat\[projectId]\ChatClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the block from 'const token = localStorage.getItem' to 'const data = await response.json();'
pattern = re.compile(r'const token = localStorage\.getItem.*?const data = await response\.json\(\);', re.DOTALL)
replacement = '''const data = await apiFetch(/chat/, {
          method: "POST",
          body: formData,
        });'''

new_content = pattern.sub(replacement, content)

if content != new_content:
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: Code replaced via regex!")
else:
    print("ERROR: Regex did not match!")
