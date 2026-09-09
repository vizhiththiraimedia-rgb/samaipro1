import type { VoiceProfile, GenerationParams } from "@/types/music";

const MOCK_VOICES: VoiceProfile[] = [
  {
    id: "voice_1",
    name: "Aria",
    gender: "female",
    age: "young-adult",
    language: "en",
    tone: "clear, expressive",
    style: "lead",
    model: "sam-ai-vocalist-v4",
    isCustom: false,
    createdAt: "2026-09-01T10:00:00Z",
    usageCount: 128,
  },
  {
    id: "voice_2",
    name: "Bassam",
    gender: "male",
    age: "adult",
    language: "en",
    tone: "warm, deep",
    style: "rap",
    model: "sam-ai-vocalist-v4",
    isCustom: false,
    createdAt: "2026-08-28T14:30:00Z",
    usageCount: 86,
  },
  {
    id: "voice_3",
    name: "Maya",
    gender: "female",
    age: "teen",
    language: "ta",
    tone: "bright, melodic",
    style: "harmony",
    model: "sam-ai-vocalist-v4",
    isCustom: true,
    createdAt: "2026-08-20T09:00:00Z",
    usageCount: 42,
  },
  {
    id: "voice_4",
    name: "Ravi",
    gender: "male",
    age: "adult",
    language: "ta",
    tone: "rich, resonant",
    style: "lead",
    model: "sam-ai-vocalist-v4",
    isCustom: true,
    createdAt: "2026-08-15T16:20:00Z",
    usageCount: 67,
  },
];

class VocalService {
  async generateVocals(params: GenerationParams & { voiceProfileId: string }): Promise<string> {
    const jobId = `voc_${Math.random().toString(36).slice(2, 10)}`;
    return jobId;
  }

  async getVoices(): Promise<VoiceProfile[]> {
    return MOCK_VOICES;
  }

  async getVoice(id: string): Promise<VoiceProfile | null> {
    return MOCK_VOICES.find((v) => v.id === id) || null;
  }

  async createVoice(voice: Partial<VoiceProfile>): Promise<VoiceProfile> {
    const newVoice: VoiceProfile = {
      id: `voice_${crypto.randomUUID().slice(0, 8)}`,
      name: voice.name || "New Voice",
      gender: voice.gender || "neutral",
      age: voice.age || "adult",
      language: voice.language || "en",
      tone: voice.tone || "",
      style: voice.style || "lead",
      model: voice.model || "sam-ai-vocalist-v4",
      isCustom: true,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };
    return newVoice;
  }

  async previewVoice(voiceId: string, text: string): Promise<string> {
    const voice = await this.getVoice(voiceId);
    if (!voice) throw new Error("Voice not found");
    return `/audio/voice-preview-${voiceId}.mp3`;
  }

  getLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: "en", name: "English" },
      { code: "ta", name: "Tamil" },
      { code: "si", name: "Sinhala" },
      { code: "hi", name: "Hindi" },
      { code: "te", name: "Telugu" },
      { code: "ml", name: "Malayalam" },
    ];
  }

  getVoiceGenders(): Array<{ value: string; label: string }> {
    return [
      { value: "female", label: "Female" },
      { value: "male", label: "Male" },
      { value: "neutral", label: "Neutral" },
      { value: "child", label: "Child" },
    ];
  }

  getVoiceAges(): Array<{ value: string; label: string }> {
    return [
      { value: "child", label: "Child" },
      { value: "teen", label: "Teen" },
      { value: "young-adult", label: "Young Adult" },
      { value: "adult", label: "Adult" },
      { value: "senior", label: "Senior" },
    ];
  }
}

export const vocalService = new VocalService();
export { MOCK_VOICES };
