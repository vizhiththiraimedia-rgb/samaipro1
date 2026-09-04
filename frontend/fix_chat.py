import os

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\chat\[projectId]\ChatClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_code = '''      try {
        const formData = new FormData();
        formData.append("role", "user");
        formData.append("content", userMessage.content);
        
        currentAttachments.forEach((att) => {
          if (att.file) {
            formData.append("files", att.file);
          }
        });

        const token = localStorage.getItem("token");
        const response = await fetch(/api/chat/, {
          method: "POST",
          headers: {
            Authorization: Bearer ,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        const aiMessage: Message = { role: "assistant", content: data.content };'''

new_code = '''      try {
        const formData = new FormData();
        formData.append("role", "user");
        formData.append("content", userMessage.content);
        
        currentAttachments.forEach((att) => {
          if (att.file) {
            formData.append("files", att.file);
          }
        });

        const data = await apiFetch(/chat/, {
          method: "POST",
          body: formData,
        });

        const aiMessage: Message = { role: "assistant", content: data.content };'''

if old_code in content:
    content = content.replace(old_code, new_code)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Code replaced!")
else:
    print("ERROR: Old code not found! Proceed with caution.")
