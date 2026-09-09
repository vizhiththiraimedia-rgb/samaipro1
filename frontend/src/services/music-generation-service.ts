import type { GenerationParams, GenerationResult, GenerationJob } from "@/types/music";

const MOCK_WAVEFORM = Array.from({ length: 128 }, () => Math.random() * 0.8 + 0.1);

const MOCK_MODELS = [
  "sam-ai-orchestra-v2",
  "sam-ai-melody-v3",
  "sam-ai-bassline-v1",
  "sam-ai-drum-v2",
  "sam-ai-vocalist-v4",
];

class MusicGenerationService {
  async generateMusic(params: GenerationParams): Promise<GenerationJob> {
    const job: GenerationJob = {
      id: `gen_${Math.random().toString(36).slice(2, 10)}`,
      type: "generation",
      prompt: params.prompt,
      params,
      status: "queued",
      progress: 0,
      model: MOCK_MODELS[Math.floor(Math.random() * MOCK_MODELS.length)],
      createdAt: new Date().toISOString(),
      estimatedTime: Math.floor(Math.random() * 30) + 15,
    };
    return job;
  }

  async generateLyrics(params: GenerationParams): Promise<GenerationJob> {
    const job: GenerationJob = {
      id: `lyr_${Math.random().toString(36).slice(2, 10)}`,
      type: "lyrics",
      prompt: params.prompt,
      params,
      status: "queued",
      progress: 0,
      model: "sam-ai-lyrics-v2",
      createdAt: new Date().toISOString(),
      estimatedTime: 8,
    };
    return job;
  }

  async generateVocals(params: GenerationParams & { voiceProfileId?: string }): Promise<GenerationJob> {
    const job: GenerationJob = {
      id: `voc_${Math.random().toString(36).slice(2, 10)}`,
      type: "vocals",
      prompt: params.prompt,
      params,
      status: "queued",
      progress: 0,
      model: "sam-ai-vocalist-v4",
      createdAt: new Date().toISOString(),
      estimatedTime: Math.floor(Math.random() * 20) + 10,
    };
    return job;
  }

  async extendTrack(jobId: string, continuationPrompt: string): Promise<GenerationJob> {
    const job: GenerationJob = {
      id: `ext_${Math.random().toString(36).slice(2, 10)}`,
      type: "generation",
      prompt: continuationPrompt,
      params: { prompt: continuationPrompt },
      status: "queued",
      progress: 0,
      model: MOCK_MODELS[Math.floor(Math.random() * MOCK_MODELS.length)],
      createdAt: new Date().toISOString(),
      estimatedTime: 20,
    };
    return job;
  }

  async remixTrack(jobId: string, style: string): Promise<GenerationJob> {
    const job: GenerationJob = {
      id: `rem_${Math.random().toString(36).slice(2, 10)}`,
      type: "generation",
      prompt: `Remix in ${style} style`,
      params: { prompt: `Remix in ${style} style`, productionStyle: style },
      status: "queued",
      progress: 0,
      model: MOCK_MODELS[Math.floor(Math.random() * MOCK_MODELS.length)],
      createdAt: new Date().toISOString(),
      estimatedTime: 25,
    };
    return job;
  }

  async pollJob(jobId: string): Promise<GenerationJob> {
    return {
      id: jobId,
      type: "generation",
      prompt: "",
      params: {},
      status: "completed",
      progress: 100,
      model: MOCK_MODELS[0],
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      result: {
        id: `res_${crypto.randomUUID()}`,
        jobId,
        audioUrl: "/audio/generated-sample.mp3",
        waveform: MOCK_WAVEFORM,
        duration: 60,
        bpm: 120,
        key: "C",
        scale: "major",
        genre: "Cinematic",
        language: "English",
        model: MOCK_MODELS[0],
        createdAt: new Date().toISOString(),
        metadata: { energy: 0.7, mood: "heroic" as const, structure: "verse-chorus-bridge" },
      },
    };
  }

  async getResult(resultId: string): Promise<GenerationResult | null> {
    return {
      id: resultId,
      jobId: "gen_001",
      audioUrl: "/audio/generated-sample.mp3",
      waveform: MOCK_WAVEFORM,
      duration: 60,
      bpm: 120,
      key: "C",
      scale: "major",
      genre: "Cinematic",
      language: "English",
      model: MOCK_MODELS[0],
      createdAt: new Date().toISOString(),
      metadata: { energy: 0.7, mood: "heroic" as const, structure: "verse-chorus-bridge" },
    };
  }
}

export const musicGenerationService = new MusicGenerationService();
