import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Project, GenerationJob, GenerationResult, VoiceProfile } from "@/types/music";

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  createProject: (project: Partial<Project>) => void;
  selectProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateProjectStatus: (id: string, status: Project["status"]) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  archiveProject: (id: string) => void;
  createVersion: () => void;
  restoreVersion: (versionId: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addTrackToProject: (track: any) => void;
}

export const useProjectStore = create<ProjectState & ProjectActions>()(
  subscribeWithSelector((set, get) => ({
    currentProject: null,
    projects: [],
    isLoading: false,
    error: null,

    setCurrentProject: (project) => set({ currentProject: project }),
    setProjects: (projects) => set({ projects }),
    addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),
    createProject: (project) =>
      set((s) => {
        const newProject: Project = {
          id: crypto.randomUUID(),
          title: project.title || "Untitled Project",
          name: project.name || project.title || "Untitled Project",
          description: project.description || "",
          coverArt: project.coverArt || "/images/project-default.jpg",
          bpm: project.bpm || 120,
          key: project.key || "C",
          scale: project.scale || "major",
          timeSignature: project.timeSignature || { numerator: 4, denominator: 4 },
          duration: project.duration || 0,
          tracks: project.tracks || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: project.status || "draft",
          version: 1,
          versions: [],
          tags: project.tags || [],
          modelUsed: project.modelUsed || "",
          collaborators: project.collaborators || [],
        };
        return { projects: [newProject, ...s.projects] };
      }),
    selectProject: (id) =>
      set((s) => ({
        currentProject: s.projects.find((p) => p.id === id) || null,
      })),
    updateProject: (id, updates) =>
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        currentProject: s.currentProject?.id === id ? { ...s.currentProject, ...updates } : s.currentProject,
      })),
    updateProjectStatus: (id, status) =>
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? { ...p, status } : p)),
        currentProject: s.currentProject?.id === id ? { ...s.currentProject, status } : s.currentProject,
      })),
    deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
    duplicateProject: (id) => {
      const project = get().projects.find((p) => p.id === id);
      if (project) {
        const duplicate: Project = { ...project, id: crypto.randomUUID(), title: `${project.title} (Copy)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        set((s) => ({ projects: [duplicate, ...s.projects] }));
      }
    },
    archiveProject: (id) =>
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? { ...p, status: "archived" } : p)),
      })),
    createVersion: () =>
      set((s) => {
        const project = s.currentProject;
        if (!project) return {};
        const version = {
          id: crypto.randomUUID(),
          projectId: project.id,
          number: project.versions?.length + 1 || 1,
          title: `Version ${project.versions?.length + 1 || 1}`,
          createdAt: new Date().toISOString(),
          snapshot: JSON.stringify({ tracks: project.tracks, bpm: project.bpm, key: project.key }),
        };
        return {
          currentProject: { ...project, versions: [...(project.versions || []), version], version: version.number },
        };
      }),
    restoreVersion: (versionId) =>
      set((s) => {
        const project = s.currentProject;
        if (!project) return {};
        const version = project.versions?.find((v) => v.id === versionId);
        if (version) {
          const snapshot = JSON.parse(version.snapshot);
          return {
            currentProject: { ...project, ...snapshot, version: version.number },
          };
        }
        return {};
      }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    addTrackToProject: (track) =>
      set((s) => {
        if (!s.currentProject) return {};
        return {
          currentProject: { ...s.currentProject, tracks: [...s.currentProject.tracks, track] },
        };
      }),
  }))
);

interface GenerationState {
  jobs: GenerationJob[];
  generations: GenerationJob[];
  results: Record<string, GenerationResult>;
  activeJobs: Set<string>;
  isGenerating: boolean;
  isLoading: boolean;
  currentPrompt: string;
  presets: any[];
}

interface GenerationActions {
  addJob: (job: GenerationJob) => void;
  updateJob: (id: string, updates: Partial<GenerationJob>) => void;
  completeJob: (id: string, result: GenerationResult) => void;
  failJob: (id: string, error: string) => void;
  cancelJob: (id: string) => void;
  setJobs: (jobs: GenerationJob[]) => void;
  setCurrentPrompt: (prompt: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  fetchPresets: () => void;
  generateFromPreset: (preset: any) => void;
}

export const useGenerationStore = create<GenerationState & GenerationActions>()(
  subscribeWithSelector((set, get) => ({
    jobs: [],
    generations: [],
    results: {},
    activeJobs: new Set<string>(),
    isGenerating: false,
    isLoading: false,
    currentPrompt: "",
    presets: [],

    addJob: (job) =>
      set((s) => ({
        jobs: [job, ...s.jobs],
        generations: [job, ...s.generations],
        activeJobs: job.status === "queued" || job.status === "generating" ? new Set([...s.activeJobs, job.id]) : s.activeJobs,
      })),
    updateJob: (id, updates) =>
      set((s) => ({
        jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
        generations: s.generations.map((j) => (j.id === id ? { ...j, ...updates } : j)),
      })),
    completeJob: (id, result) =>
      set((s) => ({
        jobs: s.jobs.map((j) => (j.id === id ? { ...j, status: "completed", result, progress: 100 } : j)),
        generations: s.generations.map((j) => (j.id === id ? { ...j, status: "completed", result, progress: 100 } : j)),
        results: { ...s.results, [id]: result },
        activeJobs: new Set([...s.activeJobs].filter((a) => a !== id)),
      })),
    failJob: (id, error) =>
      set((s) => ({
        jobs: s.jobs.map((j) => (j.id === id ? { ...j, status: "failed", error, progress: 0 } : j)),
        generations: s.generations.map((j) => (j.id === id ? { ...j, status: "failed", error, progress: 0 } : j)),
        activeJobs: new Set([...s.activeJobs].filter((a) => a !== id)),
      })),
    cancelJob: (id) =>
      set((s) => ({
        jobs: s.jobs.map((j) => (j.id === id ? { ...j, status: "idle", progress: 0 } : j)),
        generations: s.generations.map((j) => (j.id === id ? { ...j, status: "idle", progress: 0 } : j)),
        activeJobs: new Set([...s.activeJobs].filter((a) => a !== id)),
      })),
    setJobs: (jobs) => set({ jobs, generations: jobs }),
    setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
    setIsGenerating: (generating) => set({ isGenerating: generating }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    fetchPresets: () => set({ presets: [] }),
    generateFromPreset: (preset) => set({ currentPrompt: preset.prompt || "" }),
  }))
);

interface VoiceState {
  voices: VoiceProfile[];
  profiles: VoiceProfile[];
  currentProfile: VoiceProfile | null;
  activeVoiceId: string | null;
  selectedVoiceId: string | null;
  isGenerating: boolean;
  isLoading: boolean;
}

interface VoiceActions {
  setVoices: (voices: VoiceProfile[]) => void;
  setActiveVoice: (id: string | null) => void;
  setSelectedVoice: (id: string | null) => void;
  addVoice: (voice: VoiceProfile) => void;
  updateVoice: (id: string, updates: Partial<VoiceProfile>) => void;
  setGenerating: (generating: boolean) => void;
  createVoiceProfile: (profile: Partial<VoiceProfile>) => void;
  selectProfile: (id: string | null) => void;
  updateVoiceSettings: (id: string, updates: Partial<VoiceProfile>) => void;
  favoriteVoice: (id: string) => void;
}

export const useVoiceStore = create<VoiceState & VoiceActions>()(
  subscribeWithSelector((set, get) => ({
    voices: [],
    profiles: [],
    currentProfile: null,
    activeVoiceId: null,
    selectedVoiceId: null,
    isGenerating: false,
    isLoading: false,

    setVoices: (voices) => set({ voices, profiles: voices }),
    setActiveVoice: (id) => set({ activeVoiceId: id }),
    setSelectedVoice: (id) => set({ selectedVoiceId: id }),
    addVoice: (voice) => set((s) => ({ voices: [voice, ...s.voices], profiles: [voice, ...s.profiles] })),
    updateVoice: (id, updates) =>
      set((s) => ({
        voices: s.voices.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        profiles: s.profiles.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        currentProfile: s.currentProfile?.id === id ? { ...s.currentProfile, ...updates } : s.currentProfile,
      })),
    setGenerating: (generating) => set({ isGenerating: generating }),
    createVoiceProfile: (profile) =>
      set((s) => {
        const newProfile = { ...profile, id: crypto.randomUUID() } as VoiceProfile;
        return { profiles: [newProfile, ...s.profiles], voices: [newProfile, ...s.voices] };
      }),
    selectProfile: (id) => set((s) => ({ currentProfile: s.profiles.find((p) => p.id === id) || null })),
    updateVoiceSettings: (id, updates) =>
      set((s) => ({
        profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        currentProfile: s.currentProfile?.id === id ? { ...s.currentProfile, ...updates } : s.currentProfile,
      })),
    favoriteVoice: (id) =>
      set((s) => ({
        profiles: s.profiles.map((p) => (p.id === id ? { ...p, usageCount: p.usageCount + 1 } : p)),
      })),
  }))
);

interface LibraryState {
  activeTab: string;
  searchQuery: string;
  selectedTag: string | null;
  selectedItems: Set<string>;
  sortBy: string;
  sortOrder: "asc" | "desc";
  assets: any[];
  presets: any[];
  isLoading: boolean;
}

interface LibraryActions {
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  toggleItemSelection: (id: string) => void;
  clearSelection: () => void;
  setSortBy: (by: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  fetchAssets: () => void;
  fetchPresets: () => void;
  previewAsset: (id: string) => void;
  favoriteAsset: (id: string) => void;
}

export const useLibraryStore = create<LibraryState & LibraryActions>()(
  subscribeWithSelector((set) => ({
    activeTab: "songs",
    searchQuery: "",
    selectedTag: null,
    selectedItems: new Set<string>(),
    sortBy: "createdAt",
    sortOrder: "desc",
    assets: [],
    presets: [],
    isLoading: false,

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedTag: (tag) => set({ selectedTag: tag }),
    toggleItemSelection: (id) =>
      set((s) => {
        const selected = new Set(s.selectedItems);
        selected.has(id) ? selected.delete(id) : selected.add(id);
        return { selectedItems: selected };
      }),
    clearSelection: () => set({ selectedItems: new Set<string>() }),
    setSortBy: (by) => set({ sortBy: by }),
    setSortOrder: (order) => set({ sortOrder: order }),
    fetchAssets: () => set({ isLoading: true }),
    fetchPresets: () => set({ isLoading: true }),
    previewAsset: (id) => set({ isLoading: false }),
    favoriteAsset: (id) => set((s) => ({ assets: s.assets.map((a: any) => (a.id === id ? { ...a, isFavorite: !a.isFavorite } : a)) })),
  }))
);

export const useMidiStore = create<{
  selectedNotes: Set<string>;
  noteLength: number;
  velocity: number;
  grid: number;
  scale: string;
  showScale: boolean;
  showVelocity: boolean;
  showChordNames: boolean;
} & {
  setSelectedNotes: (notes: Set<string>) => void;
  setNoteLength: (length: number) => void;
  setVelocity: (vel: number) => void;
  setGrid: (grid: number) => void;
  setScale: (scale: string) => void;
  setShowScale: (show: boolean) => void;
  setShowVelocity: (show: boolean) => void;
  setShowChordNames: (show: boolean) => void;
  clearSelection: () => void;
}>()(
  subscribeWithSelector((set) => ({
    selectedNotes: new Set<string>(),
    noteLength: 0.25,
    velocity: 100,
    grid: 4,
    scale: "major",
    showScale: true,
    showVelocity: false,
    showChordNames: false,

    setSelectedNotes: (notes) => set({ selectedNotes: notes }),
    setNoteLength: (length) => set({ noteLength: length }),
    setVelocity: (vel) => set({ velocity: vel }),
    setGrid: (grid) => set({ grid }),
    setScale: (scale) => set({ scale }),
    setShowScale: (show) => set({ showScale: show }),
    setShowVelocity: (show) => set({ showVelocity: show }),
    setShowChordNames: (show) => set({ showChordNames: show }),
    clearSelection: () => set({ selectedNotes: new Set<string>() }),
  }))
);
