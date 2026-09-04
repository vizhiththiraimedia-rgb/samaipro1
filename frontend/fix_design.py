import os
import re

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\social-news\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# The block to replace:
# <div ref={cardRef} style={{ flex: 1, minHeight: "300px", background: "#05060a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
# ...
# </div>

pattern = re.compile(r'<div ref=\{cardRef\} style=\{\{ flex: 1, minHeight: "300px", background: "#05060a".*?(?=</div>\s*</div>\s*</div>)', re.DOTALL)

new_design = """<div style={{ width: '100%', overflow: 'auto', display: 'flex', justifyContent: 'center', background: '#11131a', padding: '1rem', borderRadius: '12px' }}>
                <div ref={cardRef} style={{ width: "700px", minHeight: "1024px", background: "#fdb953", position: "relative", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
                  
                  {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "1024px", gap: "10px" }}>
                      <RefreshCw className="animate-spin" size={36} color="#232185" />
                      <span style={{ color: "#232185", fontSize: "1.1rem", fontWeight: "bold" }}>Generating Post...</span>
                    </div>
                  ) : postResult ? (
                    <>
                      {/* Top Image Section */}
                      {featureImage ? (
                        <img src={featureImage} style={{ width: "100%", height: "460px", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: "460px", background: "#fdb953" }}></div>
                      )}

                      {/* Logo Top Right */}
                      <img src="/assets/chudar_logo.png" style={{ position: "absolute", top: "20px", right: "20px", width: "100px", height: "100px", borderRadius: "8px", objectFit: "contain", background: "#fff" }} />

                      {/* Text Box */}
                      <div style={{ margin: "20px", flex: 1, backgroundColor: "#fff", border: "2px solid #232185", borderRadius: "15px", padding: "30px", marginBottom: "150px" }}>
                        <div style={{ color: "#ed1c24", fontSize: "1.2rem", lineHeight: 1.8, whiteSpace: "pre-wrap", fontWeight: 600 }}>
                          {postResult}
                        </div>
                      </div>

                      {/* Bottom Banner */}
                      <img src="/assets/sasip_banner.png" style={{ position: "absolute", bottom: "0", left: "0", width: "100%", height: "130px", objectFit: "cover" }} />
                    </>
                  ) : (
                    <div style={{ padding: "3rem", color: "#232185", fontSize: "1.1rem", textAlign: "center", fontWeight: "bold", marginTop: "200px" }}>
                      Enter a news URL to generate the card...
                    </div>
                  )}
                </div>"""

if pattern.search(content):
    content = pattern.sub(new_design, content)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated design successfully!")
else:
    print("Could not find the cardRef div!")
