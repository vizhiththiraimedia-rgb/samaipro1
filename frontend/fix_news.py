import os
import re

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\social-news\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
if 'html2canvas' not in content:
    content = content.replace('import React, { useState } from "react";', 'import React, { useState, useRef } from "react";\nimport html2canvas from "html2canvas";')
    content = content.replace('import { \n  Flame', 'import { \n  Flame, Download,')

# 2. Add useRef and handleDownloadImage
if 'const cardRef = useRef<HTMLDivElement>(null);' not in content:
    new_hooks = '''  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: "#05060a", scale: 2 });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `samai-news-${Date.now()}.jpg`;
      link.click();
    } catch (e) {
      console.error("Download failed", e);
    }
  };'''
    content = content.replace('  const [copied, setCopied] = useState(false);', new_hooks)

# 3. Add Download button next to Copy News
button_block_old = '''              {postResult && (
                <button
                  onClick={handleCopy}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "5px 12px", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  {copied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy News"}
                </button>
              )}
            </div>'''
button_block_new = '''              {postResult && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleDownloadImage}
                    style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", padding: "5px 12px", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}
                  >
                    <Download size={13} /> Download Post
                  </button>
                  <button
                    onClick={handleCopy}
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "5px 12px", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    {copied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy News"}
                  </button>
                </div>
              )}
            </div>'''

if button_block_old in content:
    content = content.replace(button_block_old, button_block_new)

# 4. Add ref to the card wrapper
card_div_old = '''            <div style={{ flex: 1, minHeight: "300px", background: "#05060a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>'''
card_div_new = '''            <div ref={cardRef} style={{ flex: 1, minHeight: "300px", background: "#05060a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>'''
if card_div_old in content:
    content = content.replace(card_div_old, card_div_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated social news page!")
