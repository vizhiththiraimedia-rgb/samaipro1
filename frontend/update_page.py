import json
import re

with open('src/app/modules/ai-intelligence/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add useEffect
content = content.replace('import React, { useState } from "react";', 'import React, { useState, useEffect } from "react";')

# 2. Update state and add useEffect for fetching watchers
state_and_effect = '''  const [watchers, setWatchers] = useState<Watcher[]>([]);
  const [activeTab, setActiveTab] = useState<"watchers" | "briefing" | "telemetry">("watchers");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [generatingBriefing, setGeneratingBriefing] = useState(false);

  useEffect(() => {
    fetchWatchers();
  }, []);

  const fetchWatchers = async () => {
    try {
      const res = await apiFetch("/api/ai-intelligence/watchers");
      if (res && Array.isArray(res)) {
        setWatchers(res);
      }
    } catch (e) {
      console.error(e);
    }
  };'''

content = re.sub(r'const \[watchers, setWatchers\].*?const \[generatingBriefing, setGeneratingBriefing\] = useState\(false\);', state_and_effect, content, flags=re.DOTALL)

# 3. Update handleAddWatcher
add_watcher = '''  const handleAddWatcher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatcherName || !newWatcherCriteria) return;

    try {
      await apiFetch("/api/ai-intelligence/watchers", {
        method: "POST",
        body: JSON.stringify({
          name: newWatcherName,
          category: newWatcherCategory,
          criteria: newWatcherCriteria,
          schedule: newWatcherSchedule,
          channel: newWatcherChannel
        })
      });
      setNewWatcherName("");
      setNewWatcherCriteria("");
      fetchWatchers();
    } catch (e) {
      console.error(e);
    }
  };'''
content = re.sub(r'const handleAddWatcher = \(e: React\.FormEvent\) => \{.*?setNewWatcherCriteria\(""\);\s*\};', add_watcher, content, flags=re.DOTALL)

# 4. Update handleToggleStatus
toggle_status = '''  const handleToggleStatus = async (id: string) => {
    try {
      await apiFetch(/api/ai-intelligence/watchers//status, { method: "PUT" });
      fetchWatchers();
    } catch (e) {
      console.error(e);
    }
  };'''
content = re.sub(r'const handleToggleStatus = \(id: string\) => \{.*?\}\)\);\s*\};', toggle_status, content, flags=re.DOTALL)

# 5. Update handleDeleteWatcher
delete_watcher = '''  const handleDeleteWatcher = async (id: string) => {
    try {
      await apiFetch(/api/ai-intelligence/watchers/, { method: "DELETE" });
      fetchWatchers();
    } catch (e) {
      console.error(e);
    }
  };'''
content = re.sub(r'const handleDeleteWatcher = \(id: string\) => \{.*?\}\);\s*\};', delete_watcher, content, flags=re.DOTALL)

# 6. Update handleGenerateLiveBriefing
generate_briefing = '''  const handleGenerateLiveBriefing = async () => {
    setGeneratingBriefing(true);
    try {
      const res = await apiFetch("/api/ai-intelligence/generate-briefing", { method: "POST" });
      if (res && res.briefing) {
        setBriefingText(res.briefing);
      }
      setActiveTab("briefing");
    } catch (e) {
      console.error(e);
      setBriefingText("மன்னிக்கவும், சர்வருடன் தொடர்பு கொள்ள முடியவில்லை (Connection Error).");
    } finally {
      setGeneratingBriefing(false);
    }
  };'''
content = re.sub(r'const handleGenerateLiveBriefing = \(\) => \{.*?setActiveTab\("briefing"\);\s*\}, 600\);\s*\};', generate_briefing, content, flags=re.DOTALL)

with open('src/app/modules/ai-intelligence/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")
