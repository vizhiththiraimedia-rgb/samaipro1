import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  Track,
  TrackType,
  AutomationPoint,
  EffectInstance,
  Region,
  TimeSignature,
  Key,
  Scale,
} from "@/types/music";

interface TransportState {
  isPlaying: boolean;
  isRecording: boolean;
  isLooping: boolean;
  isPaused: boolean;
  tempo: number;
  tempoEditMode: boolean;
  key: Key;
  scale: Scale;
  timeSignature: TimeSignature;
  metronome: boolean;
  snapEnabled: boolean;
  snapValue: number;
  playhead: number;
  loopStart: number;
  loopEnd: number;
  duration: number;
  currentFrame: number;
  tempoMap: number;
}

interface TransportActions {
  play: () => void;
  pause: () => void;
  stop: () => void;
  record: () => void;
  setLooping: (looping: boolean) => void;
  setLoop: (start: number, end: number) => void;
  setTempo: (bpm: number) => void;
  setKey: (key: Key) => void;
  setScale: (scale: Scale) => void;
  setTimeSignature: (ts: TimeSignature) => void;
  setMetronome: (enabled: boolean) => void;
  setSnap: (enabled: boolean, value: number) => void;
  setPlayhead: (beat: number) => void;
  setDuration: (duration: number) => void;
  tick: () => void;
}

interface StudioState {
  tracks: Track[];
  selectedTrackId: string | null;
  selectedRegionId: string | null;
  editingTrackId: string | null;
  trackHeights: Record<string, number>;
  zoomLevel: number;
  scrollPosition: number;
  timeView: "beats" | "time";
  showRulers: boolean;
  showWaveform: boolean;
  showVelocity: boolean;
}

interface StudioActions {
  addTrack: (track: Partial<Track>) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  selectTrack: (id: string | null) => void;
  selectRegion: (id: string | null) => void;
  addRegion: (region: Partial<Region>) => void;
  removeRegion: (id: string) => void;
  updateRegion: (id: string, updates: Partial<Region>) => void;
  setTrackHeight: (id: string, height: number) => void;
  setZoomLevel: (level: number) => void;
  setScrollPosition: (pos: number) => void;
  setTimeView: (view: "beats" | "time") => void;
  toggleRulers: () => void;
  toggleWaveform: () => void;
  toggleVelocity: () => void;
  moveRegion: (id: string, targetTrackId: string, newStartBeat: number) => void;
  splitRegion: (id: string, atBeat: number) => void;
  addAutomationPoint: (trackId: string, point: AutomationPoint) => void;
  addEffect: (trackId: string, effect: EffectInstance) => void;
  removeEffect: (trackId: string, effectId: string) => void;
  setEditingTrack: (id: string | null) => void;
}

interface MixerState {
  faderValues: Record<string, number>;
  panValues: Record<string, number>;
  mutedTracks: Set<string>;
  soloedTracks: Set<string>;
  recordArmedTracks: Set<string>;
  masterVolume: number;
  masterPan: number;
  busSends: Record<string, Record<string, number>>;
}

interface MixerActions {
  setFader: (trackId: string, value: number) => void;
  setPan: (trackId: string, value: number) => void;
  toggleMute: (trackId: string) => void;
  toggleSolo: (trackId: string) => void;
  toggleRecordArm: (trackId: string) => void;
  setMasterVolume: (value: number) => void;
  setMasterPan: (value: number) => void;
  setBusSend: (trackId: string, busId: string, value: number) => void;
}

export const useTransportStore = create<TransportState & TransportActions>()(
  subscribeWithSelector((set) => ({
    isPlaying: false,
    isRecording: false,
    isLooping: false,
    isPaused: false,
    tempo: 120,
    tempoEditMode: false,
    key: "C",
    scale: "major",
    timeSignature: { numerator: 4, denominator: 4 },
    metronome: true,
    snapEnabled: true,
    snapValue: 0.25,
    playhead: 0,
    loopStart: 0,
    loopEnd: 16,
    duration: 128,
    currentFrame: 0,
    tempoMap: 0,

    play: () => set({ isPlaying: true, isPaused: false }),
    pause: () => set({ isPlaying: false, isPaused: true }),
    stop: () => set({ isPlaying: false, isPaused: false, playhead: 0 }),
    record: () => set((s) => ({ isRecording: !s.isRecording })),
    setLooping: (looping) => set({ isLooping: looping }),
    setLoop: (start, end) => set({ loopStart: start, loopEnd: end, isLooping: true }),
    setTempo: (bpm) => set({ tempo: bpm }),
    setKey: (key) => set({ key }),
    setScale: (scale) => set({ scale }),
    setTimeSignature: (ts) => set({ timeSignature: ts }),
    setMetronome: (enabled) => set({ metronome: enabled }),
    setSnap: (enabled, value) => set({ snapEnabled: enabled, snapValue: value }),
    setPlayhead: (beat) => set({ playhead: beat }),
    setDuration: (duration) => set({ duration }),
    tick: () => set((s) => ({ currentFrame: s.currentFrame + 1, playhead: s.playhead + 0.01 })),
  }))
);

const createEmptyTrack = (overrides: Partial<Track> = {}): Track => ({
  id: crypto.randomUUID(),
  projectId: "",
  name: overrides.name || "Untitled Track",
  type: overrides.type || "audio",
  color: overrides.color || "hsl(210 60% 55%)",
  muted: false,
  soloed: false,
  recordArmed: false,
  volume: 0.8,
  pan: 0,
  sendLevels: {},
  regions: [],
  automation: [],
  effects: [],
  frozen: false,
  locked: false,
  height: 80,
  visible: true,
  ...overrides,
});

export const useStudioStore = create<StudioState & StudioActions>()(
  subscribeWithSelector((set) => ({
    tracks: [
      createEmptyTrack({ name: "Lead Vocals", type: "vocal", color: "hsl(330 80% 58%)" }),
      createEmptyTrack({ name: "Drums", type: "drums", color: "hsl(45 90% 55%)" }),
      createEmptyTrack({ name: "Bass", type: "bass", color: "hsl(220 90% 60%)" }),
      createEmptyTrack({ name: "Syn Piano", type: "piano", color: "hsl(260 60% 60%)" }),
      createEmptyTrack({ name: "Strings", type: "strings", color: "hsl(280 50% 65%)" }),
    ],
    selectedTrackId: null,
    selectedRegionId: null,
    editingTrackId: null,
    trackHeights: {},
    zoomLevel: 1,
    scrollPosition: 0,
    timeView: "beats",
    showRulers: true,
    showWaveform: true,
    showVelocity: false,

    addTrack: (track) =>
      set((s) => {
        const newTrack = createEmptyTrack(track);
        return { tracks: [...s.tracks, newTrack] };
      }),
    removeTrack: (id) => set((s) => ({ tracks: s.tracks.filter((t) => t.id !== id) })),
    updateTrack: (id, updates) =>
      set((s) => ({
        tracks: s.tracks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      })),
    selectTrack: (id) => set({ selectedTrackId: id }),
    selectRegion: (id) => set({ selectedRegionId: id }),
    addRegion: (region) =>
      set((s) => {
        const newRegion: Region = {
          id: crypto.randomUUID(),
          trackId: "",
          name: "Region",
          startBeat: 0,
          endBeat: 4,
          startTime: 0,
          endTime: 4,
          duration: 4,
          gain: 0,
          pitch: 0,
          ...region,
        };
        return {
          tracks: s.tracks.map((t) =>
            t.id === region.trackId || t.id === s.selectedTrackId
              ? { ...t, regions: [...t.regions, newRegion] }
              : t
          ),
        };
      }),
    removeRegion: (id) =>
      set((s) => ({
        tracks: s.tracks.map((t) => ({ ...t, regions: t.regions.filter((r) => r.id !== id) })),
      })),
    updateRegion: (id, updates) =>
      set((s) => ({
        tracks: s.tracks.map((t) => ({
          ...t,
          regions: t.regions.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      })),
    setTrackHeight: (id, height) =>
      set((s) => ({ trackHeights: { ...s.trackHeights, [id]: height } })),
    setZoomLevel: (level) => set({ zoomLevel: level }),
    setScrollPosition: (pos) => set({ scrollPosition: pos }),
    setTimeView: (view) => set({ timeView: view }),
    toggleRulers: () => set((s) => ({ showRulers: !s.showRulers })),
    toggleWaveform: () => set((s) => ({ showWaveform: !s.showWaveform })),
    toggleVelocity: () => set((s) => ({ showVelocity: !s.showVelocity })),
    moveRegion: (id, targetTrackId, newStartBeat) =>
      set((s) => ({
        tracks: s.tracks.map((t) => ({
          ...t,
          regions: t.regions.filter((r) => r.id !== id),
        })),
      })),
    splitRegion: (id, atBeat) =>
      set((s) => ({
        tracks: s.tracks.map((t) => ({
          ...t,
          regions: t.regions.flatMap((r) => {
            if (r.id !== id || atBeat <= r.startBeat || atBeat >= r.endBeat) return [r];
            const first: Region = { ...r, id: crypto.randomUUID(), endBeat: atBeat, endTime: atBeat, duration: atBeat - r.startBeat };
            const second: Region = { ...r, id: crypto.randomUUID(), startBeat: atBeat, startTime: atBeat, duration: r.endBeat - atBeat };
            return [first, second];
          }),
        })),
      })),
    addAutomationPoint: (trackId, point) =>
      set((s) => ({
        tracks: s.tracks.map((t) =>
          t.id === trackId ? { ...t, automation: [...t.automation, point] } : t
        ),
      })),
    addEffect: (trackId, effect) =>
      set((s) => ({
        tracks: s.tracks.map((t) =>
          t.id === trackId ? { ...t, effects: [...t.effects, effect] } : t
        ),
      })),
    removeEffect: (trackId, effectId) =>
      set((s) => ({
        tracks: s.tracks.map((t) =>
          t.id === trackId ? { ...t, effects: t.effects.filter((e) => e.id !== effectId) } : t
        ),
      })),
    setEditingTrack: (id) => set({ editingTrackId: id, selectedTrackId: id }),
  }))
);

export const useMixerStore = create<MixerState & MixerActions>()(
  subscribeWithSelector((set) => ({
    faderValues: {},
    panValues: {},
    mutedTracks: new Set<string>(),
    soloedTracks: new Set<string>(),
    recordArmedTracks: new Set<string>(),
    masterVolume: 0.85,
    masterPan: 0,
    busSends: {},

    setFader: (trackId, value) => set((s) => ({ faderValues: { ...s.faderValues, [trackId]: value } })),
    setPan: (trackId, value) => set((s) => ({ panValues: { ...s.panValues, [trackId]: value } })),
    toggleMute: (trackId) =>
      set((s) => {
        const muted = new Set(s.mutedTracks);
        muted.has(trackId) ? muted.delete(trackId) : muted.add(trackId);
        return { mutedTracks: muted };
      }),
    toggleSolo: (trackId) =>
      set((s) => {
        const soloed = new Set(s.soloedTracks);
        soloed.has(trackId) ? soloed.delete(trackId) : soloed.add(trackId);
        return { soloedTracks: soloed };
      }),
    toggleRecordArm: (trackId) =>
      set((s) => {
        const armed = new Set(s.recordArmedTracks);
        armed.has(trackId) ? armed.delete(trackId) : armed.add(trackId);
        return { recordArmedTracks: armed };
      }),
    setMasterVolume: (value) => set({ masterVolume: value }),
    setMasterPan: (value) => set({ masterPan: value }),
    setBusSend: (trackId, busId, value) =>
      set((s) => ({
        busSends: {
          ...s.busSends,
          [trackId]: { ...(s.busSends[trackId] || {}), [busId]: value },
        },
      })),
  }))
);
