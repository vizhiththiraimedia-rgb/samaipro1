import type { Stem, StemType, GenerationJob } from "@/types/music";

export type { Stem, GenerationJob };

export interface StemSeparationJob extends GenerationJob {
  inputFile?: File;
  inputFileName?: string;
  stems?: Stem[];
}

const MOCK_STEMS: Stem[] = [
  { id: "stem_1", jobId: "job_001", type: "vocals", name: "Vocals", audioUrl: "/audio/stem-vocals.mp3", waveform: Array.from({ length: 64 }, () => Math.random()), duration: 60, bpm: 120, key: "C", volume: 0.9, muted: false, soloed: false },
  { id: "stem_2", jobId: "job_001", type: "drums", name: "Drums", audioUrl: "/audio/stem-drums.mp3", waveform: Array.from({ length: 64 }, () => Math.random()), duration: 60, bpm: 120, key: "C", volume: 0.85, muted: false, soloed: false },
  { id: "stem_3", jobId: "job_001", type: "bass", name: "Bass", audioUrl: "/audio/stem-bass.mp3", waveform: Array.from({ length: 64 }, () => Math.random()), duration: 60, bpm: 120, key: "C", volume: 0.8, muted: false, soloed: false },
  { id: "stem_4", jobId: "job_001", type: "other", name: "Other", audioUrl: "/audio/stem-other.mp3", waveform: Array.from({ length: 64 }, () => Math.random()), duration: 60, bpm: 120, key: "C", volume: 0.75, muted: false, soloed: false },
  { id: "stem_5", jobId: "job_002", type: "piano", name: "Piano", audioUrl: "/audio/stem-piano.mp3", waveform: Array.from({ length: 64 }, () => Math.random()), duration: 48, bpm: 140, key: "Am", volume: 0.7, muted: false, soloed: false },
  { id: "stem_6", jobId: "job_002", type: "synth", name: "Synth", audioUrl: "/audio/stem-synth.mp3", waveform: Array.from({ length: 64 }, () => Math.random()), duration: 48, bpm: 140, key: "Am", volume: 0.65, muted: false, soloed: false },
];

class StemService {
  async separateStems(audioFile: File, stemTypes: StemType[]): Promise<GenerationJob> {
    const job: GenerationJob = {
      id: `stem_${Math.random().toString(36).slice(2, 10)}`,
      type: "stems",
      prompt: `Separate ${stemTypes.join(", ")}`,
      params: {},
      status: "queued",
      progress: 0,
      model: "demucs-v4-stereo",
      createdAt: new Date().toISOString(),
      estimatedTime: 12,
    };
    return job;
  }

  async getStems(jobId: string): Promise<Stem[]> {
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_STEMS.filter((s) => s.jobId === jobId) || MOCK_STEMS.slice(0, 4);
  }

  async getAllStems(): Promise<Stem[]> {
    return MOCK_STEMS;
  }

  async downloadStem(stemId: string): Promise<Blob> {
    const response = await fetch(`/api/mock/stem/${stemId}/download`);
    return await response.blob();
  }

  async sendToStudio(stemId: string): Promise<string> {
    return `project_${crypto.randomUUID().slice(0, 8)}`;
  }

  async aiCleanup(stemId: string): Promise<Stem> {
    const stem = MOCK_STEMS.find((s) => s.id === stemId) || MOCK_STEMS[0];
    return { ...stem, name: `${stem.name} (AI Cleaned)` };
  }

  async rebuildMix(stemIds: string[], targetBpm: number, targetKey: string): Promise<Blob> {
    return new Blob([`Mixed audio ${targetBpm} BPM ${targetKey}`], { type: "audio/wav" });
  }

  getStemTypes(): StemType[] {
    return ["vocals", "drums", "bass", "guitar", "piano", "strings", "brass", "synth", "percussion", "fx", "other"];
  }

  async createSeparationJob(file: File, stemTypes?: StemType[]): Promise<StemSeparationJob> {
    const job: StemSeparationJob = {
      id: `stem_${Math.random().toString(36).slice(2, 10)}`,
      type: "stems",
      prompt: `Separate ${stemTypes?.join(", ") || "all stems"} from ${file.name}`,
      params: {},
      status: "queued",
      progress: 0,
      model: "demucs-v4-stereo",
      createdAt: new Date().toISOString(),
      estimatedTime: 15,
      inputFile: file,
      inputFileName: file.name,
    };
    return job;
  }

  async separateAll(jobs: StemSeparationJob[]): Promise<StemSeparationJob[]> {
    return Promise.all(jobs.map((j) => ({
      ...j,
      status: "queued" as const,
      progress: 0,
      id: `stem_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
    })));
  }
}

export const stemService = new StemService();
export { MOCK_STEMS };
