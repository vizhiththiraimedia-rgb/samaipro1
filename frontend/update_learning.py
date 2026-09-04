import re

with open('src/app/modules/learning/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state for knowledge bases
state_add = '''  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);
  useEffect(() => {
    fetchKnowledge();
  }, []);
  const fetchKnowledge = async () => {
    try {
      const res = await apiFetch("/api/learning/knowledge");
      if (res && res.knowledge) {
        setKnowledgeList(res.knowledge);
      }
    } catch (e) {
      console.error(e);
    }
  };'''

content = re.sub(r'const \[memoryStats, setMemoryStats\] = useState\(\{.*?\}\);', r'\g<0>\n\n' + state_add, content, flags=re.DOTALL)

# 2. Update ingest fetch call to refetch knowledge list
ingest_update = '''      await apiFetch("/learning/knowledge", {
        method: "POST",
        body: formData
      });
      setIngestSuccess(true);
      setMemoryStats(prev => ({ ...prev, vectorsStored: prev.vectorsStored + 1 }));
      fetchKnowledge();'''

content = re.sub(r'      await apiFetch\("/learning/knowledge", \{.*?setMemoryStats\(prev => \(\{ \.\.\.prev, vectorsStored: prev\.vectorsStored \+ 1 \}\)\);', ingest_update, content, flags=re.DOTALL)

# 3. Replace the hardcoded Indexed Knowledge Verticals with map
# The hardcoded UI is inside <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
# I will find that grid and replace its contents.

html_replacement = '''            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              {knowledgeList.length > 0 ? knowledgeList.map((kb, idx) => (
                <div key={idx} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "1.2rem", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>{kb.source}</h4>
                    <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{kb.usage_count || 0} Usages</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "8px", background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6", fontWeight: 700, alignSelf: "flex-start" }}>
                    ● {kb.metadata?.category || "General"}
                  </span>
                </div>
              )) : (
                <div style={{ color: "#9ca3af", fontSize: "0.85rem", padding: "1rem" }}>No knowledge ingested yet. Switch to Knowledge Ingestion to add some!</div>
              )}
            </div>'''

# The original has: <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}> ... 4 divs ... </div>
# I will use a regex to replace that specific block.
pattern = r'<div style=\{\{ display: "grid", gridTemplateColumns: "repeat\(auto-fit, minmax\(300px, 1fr\)\)", gap: "1rem" \}\}>.*?</div>\s*</div>\s*</div>'
replacement = html_replacement + '\n          </div>\n        </div>'
# wait, it's safer to just split and find the index.

parts = content.split('<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>')
if len(parts) > 1:
    before = parts[0]
    after = parts[1]
    # find the matching closing div for the grid
    # this is brittle. let's just use string replace for the 4 hardcoded items.
    pass

with open('src/app/modules/learning/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated basic state")
