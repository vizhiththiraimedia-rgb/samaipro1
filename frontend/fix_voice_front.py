import os
import re

filepath = r'c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\src\app\modules\voice\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add audioObj state
state_pattern = re.compile(r'(const \[isPlaying, setIsPlaying\] = useState\(false\);)')
if state_pattern.search(content):
    content = state_pattern.sub(r'\1\n  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);', content)

# 2. Replace handleSpeak
handleSpeak_pattern = re.compile(r'const handleSpeak = \(\) => \{.*?window\.speechSynthesis\.speak\(utterance\);\n  \};', re.DOTALL)
new_handleSpeak = '''const handleSpeak = async () => {
    if (isPlaying) {
      if (audioObj) {
        audioObj.pause();
        audioObj.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }

    if (!textToSpeak.trim()) return;

    setIsPlaying(true);
    try {
      const formData = new FormData();
      formData.append("text", textToSpeak);
      formData.append("voice_id", selectedVoice);
      formData.append("language", "en"); // Base UI is mostly English or handled by elevenlabs
      
      const res = await apiFetch("/voice/text-to-speech", {
        method: "POST",
        body: formData
      });
      
      if (res && res.audio_url) {
        const audio = new Audio(res.audio_url);
        setAudioObj(audio);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        audio.play();
      } else {
        setIsPlaying(false);
      }
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };'''

if handleSpeak_pattern.search(content):
    content = handleSpeak_pattern.sub(new_handleSpeak, content)

# 3. Replace speakCustomText
speakCustomText_pattern = re.compile(r'const speakCustomText = \(text: string, langCode: string = "en-US"\) => \{.*?window\.speechSynthesis\.speak\(u\);\n  \};', re.DOTALL)
new_speakCustomText = '''const speakCustomText = async (text: string, langCode: string = "en-US") => {
    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("language", langCode);
      
      const res = await apiFetch("/voice/text-to-speech", {
        method: "POST",
        body: formData
      });
      
      if (res && res.audio_url) {
        const audio = new Audio(res.audio_url);
        audio.play();
      }
    } catch (e) {
      console.error("TTS Failed:", e);
    }
  };'''

if speakCustomText_pattern.search(content):
    content = speakCustomText_pattern.sub(new_speakCustomText, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated handleSpeak and speakCustomText!")
