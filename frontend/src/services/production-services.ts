import type { GenerationJob, GenerationResult, GenerationParams } from "@/types/music";

export const GENRES = [
  "Ambient", "Cinematic", "Electronic", "Orchestral", "Pop", "Rock",
  "Jazz", "Classical", "Hip-Hop", "R&B", "Folk", "World",
  "Experimental", "Synthwave", "Drum & Bass", "Techno",
];

export const CULTURES = [
  "Western", "Eastern", "Sri Lankan", "Indian", "Japanese", "Middle Eastern",
  "African", "Latin", "Celtic", "Nordic",
] as const;

export const INSTRUMENTS = [
  "Piano", "Guitar", "Bass", "Drums", "Violin", "Cello",
  "Flute", "Saxophone", "Trumpet", "Synth", "Vocals", "Tabla",
  "Veena", "Guitarra", "Erhu", "Didgeridoo",
] as const;

export const STRUCTURES = [
  "verse-chorus", "verse-chorus-bridge", "abrasion", "through-composed",
  "loop", "theme-variations", "sonata", "rondo",
] as const;

export const PRODUCTION_STYLES = [
  "Natural", "Polished", "Vintage", "Modern", "Lo-fi", "Hi-fi",
  "Analog Warm", "Digital Clean", "Live", "Studio",
] as const;

export const ERAS = [
  "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s", "Future",
] as const;

export type ProductionTask = {
  id: string;
  type: "compose" | "arrange" | "mix" | "master" | "lyrics";
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  model: string;
  createdAt: string;
  completedAt?: string;
  result?: GenerationResult;
  params: Record<string, unknown>;
};

export type Beat = {
  tick: number;
  duration: number;
  velocity: number;
};

export type Melody = {
  notes: Beat[];
  key: string;
  scale: string;
  bpm: number;
};

export type Arrangement = {
  sections: Array<{
    name: string;
    bars: number;
    energy: number;
    instruments: string[];
  }>;
};

class ProductionService {
  async compose(params: Record<string, unknown>): Promise<ProductionTask> {
    return {
      id: `prod_${Math.random().toString(36).slice(2, 10)}`,
      type: "compose",
      status: "queued",
      progress: 0,
      model: "sam-ai-composer-v3",
      createdAt: new Date().toISOString(),
      params,
    };
  }

  async arrange(params: Record<string, unknown>): Promise<ProductionTask> {
    return {
      id: `prod_${Math.random().toString(36).slice(2, 10)}`,
      type: "arrange",
      status: "queued",
      progress: 0,
      model: "sam-ai-arranger-v2",
      createdAt: new Date().toISOString(),
      params,
    };
  }

  async mix(params: Record<string, unknown>): Promise<ProductionTask> {
    return {
      id: `prod_${Math.random().toString(36).slice(2, 10)}`,
      type: "mix",
      status: "queued",
      progress: 0,
      model: "sam-ai-mixer-v3",
      createdAt: new Date().toISOString(),
      params,
    };
  }

  async master(params: Record<string, unknown>): Promise<ProductionTask> {
    return {
      id: `prod_${Math.random().toString(36).slice(2, 10)}`,
      type: "master",
      status: "queued",
      progress: 0,
      model: "sam-ai-master-v4",
      createdAt: new Date().toISOString(),
      params,
    };
  }
}

export const productionServices = new ProductionService();
