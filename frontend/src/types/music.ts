export type TrackType =
  | "audio"
  | "vocal"
  | "instrument"
  | "midi"
  | "drums"
  | "bass"
  | "guitar"
  | "piano"
  | "strings"
  | "brass"
  | "fx"
  | "reference";

export type GenerationMode =
  | "text-to-music"
  | "text-to-song"
  | "lyrics-to-song"
  | "hum-to-music"
  | "audio-to-remix"
  | "midi-to-music";

export type GenerationStatus =
  | "idle"
  | "queued"
  | "analyzing"
  | "generating"
  | "rendering"
  | "completed"
  | "failed";

export type StemType =
  | "vocals"
  | "drums"
  | "bass"
  | "guitar"
  | "piano"
  | "strings"
  | "brass"
  | "synth"
  | "percussion"
  | "fx"
  | "other";

export type VocalStyle =
  | "lead"
  | "harmony"
  | "adlib"
  | "rap"
  | "spoken"
  | "choir"
  | "vocaloid";

export type VoiceGender = "female" | "male" | "neutral" | "child";

export type VoiceAge = "child" | "teen" | "young-adult" | "adult" | "senior";

export type Emotion =
  | "neutral"
  | "happy"
  | "sad"
  | "angry"
  | "fearful"
  | "surprised"
  | "disgusted"
  | "excited"
  | "calm"
  | "romantic"
  | "melancholic"
  | "heroic"
  | "mysterious"
  | "dramatic"
  | "tense"
  | "nostalgic";

export interface TimeSignature {
  numerator: number;
  denominator: number;
}

export type Key =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B"
  | "Am"
  | "Dm"
  | "Em"
  | "Bm"
  | "F#m"
  | "C#m"
  | "Gm"
  | "D#m"
  | "A#m";

export type Scale = "major" | "minor" | "dorian" | "mixolydian" | "ahirbhairav" | "bilawal" | "khamaj";

export interface GenerationParams {
  prompt: string;
  language: string;
  genre: string;
  region: string;
  culture: string;
  mood: Emotion;
  energy: number;
  tempo: number;
  bpm: number;
  key?: Key;
  scale?: Scale;
  timeSignature: TimeSignature;
  duration: number;
  structure: string;
  instrumentation: string[];
  vocalStyle?: VocalStyle;
  voiceProfileId?: string;
  productionStyle: string;
  era: string;
  mixStyle: string;
  referenceAudio?: string;
  referenceMidi?: string;
  seed?: number;
  creativity: number;
  structureStrength: number;
  melodyStrength: number;
  rhythmStrength: number;
  vocalStrength: number;
  instrumentStrength: number;
}

export interface GenerationJob {
  id: string;
  projectId?: string;
  type: "generation" | "vocals" | "stems" | "midi" | "mix" | "master" | "lyrics";
  prompt: string;
  params: Partial<GenerationParams>;
  status: GenerationStatus;
  progress: number;
  model: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  result?: GenerationResult;
  error?: string;
  estimatedTime?: number;
}

export interface GenerationResult {
  id: string;
  jobId: string;
  audioUrl: string;
  waveform: number[];
  duration: number;
  bpm: number;
  key: Key;
  scale: Scale;
  genre: string;
  language: string;
  model: string;
  createdAt: string;
  metadata: {
    energy: number;
    mood: Emotion;
    structure: string;
  };
}

export interface Project {
  id: string;
  title: string;
  name?: string;
  description?: string;
  coverArt?: string;
  bpm: number;
  key: Key;
  scale: Scale;
  timeSignature: TimeSignature;
  duration: number;
  tracks: Track[];
  createdAt: string;
  updatedAt: string;
  status: "draft" | "mixing" | "mastering" | "completed" | "archived" | "active" | "success";
  version: number;
  versions: ProjectVersion[];
  tags: string[];
  modelUsed?: string;
  collaborators?: string[];
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  number: number;
  title: string;
  createdAt: string;
  snapshot: string;
}

export interface Track {
  id: string;
  projectId: string;
  name: string;
  type: TrackType;
  color: string;
  muted: boolean;
  soloed: boolean;
  recordArmed: boolean;
  volume: number;
  pan: number;
  sendLevels: Record<string, number>;
  input?: string;
  output?: string;
  regions: Region[];
  automation: AutomationPoint[];
  effects: EffectInstance[];
  frozen: boolean;
  locked: boolean;
  height: number;
  visible: boolean;
}

export interface Region {
  id: string;
  trackId: string;
  name: string;
  startBeat: number;
  endBeat: number;
  startTime: number;
  endTime: number;
  duration: number;
  audioUrl?: string;
  midiData?: MidiNote[];
  waveformData?: number[];
  gain: number;
  pitch: number;
}

export interface AutomationPoint {
  time: number;
  value: number;
}

export interface EffectInstance {
  id: string;
  type: string;
  name: string;
  parameters: Record<string, number>;
  enabled: boolean;
  preset?: string;
}

export interface MidiNote {
  id: string;
  pitch: number;
  velocity: number;
  startTime: number;
  duration: number;
  channel: number;
  selected?: boolean;
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: VoiceGender;
  age: VoiceAge;
  language: string;
  tone: string;
  style: VocalStyle;
  model: string;
  isCustom: boolean;
  createdAt: string;
  usageCount: number;
}

export interface Stem {
  id: string;
  jobId: string;
  type: StemType;
  name: string;
  audioUrl: string;
  waveform: number[];
  duration: number;
  bpm: number;
  key: Key;
  volume: number;
  muted: boolean;
  soloed: boolean;
}

export interface GenerationPreset {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  params: Partial<GenerationParams>;
  tags?: string[];
  isFavorite?: boolean;
  createdAt: string;
}

export interface SoundAsset {
  id: string;
  name: string;
  category: string;
  description?: string;
  duration: number;
  audioUrl: string;
  waveform: number[];
  bpm?: number;
  key?: Key;
  tags?: string[];
  isFavorite?: boolean;
  createdAt: string;
}
export interface LibraryItem {
  id: string;
  type: "song" | "project" | "vocal" | "stem" | "midi" | "sample" | "instrument" | "preset" | "prompt";
  title: string;
  description?: string;
  tags: string[];
  coverArt?: string;
  duration?: number;
  bpm?: number;
  key?: Key;
  createdAt: string;
  favorite: boolean;
  collectionIds: string[];
}

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  type: "music" | "vocal" | "stem" | "midi" | "audio" | "lyrics" | "mix" | "master";
  size: number;
  gpuRequirement: string;
  status: "loaded" | "unloaded" | "loading";
  performance: number;
  quality: number;
  lastUpdated: string;
}

export interface Dataset {
  id: string;
  name: string;
  version: number;
  items: DatasetItem[];
  qualityScore: number;
  createdAt: string;
  stats: DatasetStats;
}

export interface DatasetItem {
  id: string;
  datasetId: string;
  filename: string;
  duration: number;
  bpm: number;
  key: Key;
  instruments: string[];
  language: string;
  genre: string;
  mood: Emotion;
  loudness: number;
  duplicate: boolean;
  quality: "good" | "poor" | "bad";
}

export interface DatasetStats {
  totalItems: number;
  totalDuration: number;
  averageBpm: number;
  keyDistribution: Record<string, number>;
  genreDistribution: Record<string, number>;
  languageDistribution: Record<string, number>;
}

export interface TrainingExperiment {
  id: string;
  name: string;
  datasetId: string;
  modelId: string;
  batchSize: number;
  learningRate: number;
  epochs: number;
  steps: number;
  status: "idle" | "running" | "completed" | "failed" | "stopped";
  loss: number;
  gpuUtilization: number;
  vram: number;
  lossHistory: number[];
  eta?: string;
  completedAt?: string;
  createdAt: string;
}

export interface SystemMetrics {
  cpu: number;
  ram: { used: number; total: number };
  gpu: { utilization: number; vram: { used: number; total: number }; temperature: number };
  storage: { used: number; total: number };
  workers: number;
  queue: number;
  activeJobs: number;
}

export interface Collection {
  id: string;
  name: string;
  type: "favorites" | "projects" | "sounds" | "custom";
  itemIds: string[];
}
