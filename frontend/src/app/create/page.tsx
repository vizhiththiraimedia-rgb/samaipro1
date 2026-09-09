"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav, SAMCommandPalette, SAMMiniPlayer } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";
import { SAMSlider } from "@/components/sam/sam-slider";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { SAMGenerationCard } from "@/components/sam/sam-generation-card";
import { useUIStore } from "@/stores/ui-store";
import { useGenerationStore } from "@/stores/data-stores";
import { musicGenerationService } from "@/services/music-generation-service";
import { GENRES, CULTURES, INSTRUMENTS, STRUCTURES, PRODUCTION_STYLES, ERAS } from "@/services/production-services";
import { MOCK_VOICES } from "@/services/vocal-service";
import type { GenerationParams, GenerationJob, GenerationStatus } from "@/types/music";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music, Upload, Wand2, Settings, Play, Pause, Clock,
  ChevronRight,
} from "lucide-react";

const initialParams: Partial<GenerationParams> = {
  prompt: "",
  language: "English",
  genre: "Cinematic",
  region: "Global",
  culture: "Western",
  mood: "heroic",
  energy: 0.7,
  tempo: 120,
  bpm: 120,
  key: "C",
  scale: "major",
  timeSignature: { numerator: 4, denominator: 4 },
  duration: 240,
  structure: "verse-chorus-bridge",
  instrumentation: [],
  vocalStyle: undefined,
  voiceProfileId: undefined,
  productionStyle: "Cinematic",
  era: "2020s",
  mixStyle: "balanced",
  seed: undefined,
  creativity: 0.7,
  structureStrength: 0.8,
  melodyStrength: 0.8,
  rhythmStrength: 0.8,
  vocalStrength: 0.7,
  instrumentStrength: 0.8,
};

const MOODS = [
  { value: "neutral", label: "Neutral" },
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "angry", label: "Angry" },
  { value: "calm", label: "Calm" },
  { value: "romantic", label: "Romantic" },
  { value: "heroic", label: "Heroic" },
  { value: "mysterious", label: "Mysterious" },
  { value: "dramatic", label: "Dramatic" },
  { value: "tense", label: "Tense" },
  { value: "nostalgic", label: "Nostalgic" },
  { value: "excited", label: "Excited" },
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ta", name: "Tamil" },
  { code: "si", name: "Sinhala" },
  { code: "hi", name: "Hindi" },
  { code: "te", name: "Telugu" },
  { code: "ml", name: "Malayalam" },
];

const TIME_SIGS = [
  { n: 4, d: 4 }, { n: 3, d: 4 }, { n: 6, d: 8 }, { n: 7, d: 8 }, { n: 2, d: 4 },
  { n: 5, d: 4 }, { n: 5, d: 8 },
];

export default function CreatePage() {
  const [params, setParams] = useState<Partial<GenerationParams>>(initialParams);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [progress, setProgress] = useState(0);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const updateParam = (key: keyof GenerationParams, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!params.prompt || !params.prompt.trim()) return;
    setStatus("queued");
    setProgress(0);

    try {
      const newJob = await musicGenerationService.generateMusic(params as GenerationParams);
      setJob(newJob);
      useUIStore.getState().addGenerationJob(newJob);
      useUIStore.getState().addNotification({
        title: "Generation Started",
        message: `"${params.prompt.slice(0, 60)}..." is being generated.`,
        type: "info",
        read: false,
      });

      setStatus("generating");
      const steps = [15, 30, 45, 60, 75, 85, 100];
      for (let i = 0; i < steps.length; i++) {
        await new Promise((r) => setTimeout(r, 700));
        setProgress(steps[i]);
      }

      const job = await musicGenerationService.pollJob(newJob.id);
      useGenerationStore.getState().completeJob(newJob.id, job.result!);
      setStatus("completed");
      useUIStore.getState().addNotification({
        title: "Generation Complete",
        message: "Your composition has been generated successfully.",
        type: "success",
        read: false,
      });
    } catch (error) {
      setStatus("failed");
      useUIStore.getState().addNotification({
        title: "Generation Failed",
        message: "An error occurred during music generation.",
        type: "error",
        read: false,
      });
    }
  };

  const getStepLabel = () => {
    switch (status) {
      case "queued": return "Queued";
      case "generating": return "Generating composition";
      case "completed": return "Generation complete";
      case "failed": return "Generation failed";
      default: return "Ready to generate";
    }
  };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Creation controls */}
          <div className="w-80 overflow-y-auto border-r border-border p-4 sam-scrollbar-hide">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2 sam-mono">PROMPT</label>
                <textarea
                  className="w-full bg-background/50 border border-border rounded-lg p-3 text-sm text-foreground placeholder-muted-foreground/50 resize-y"
                  placeholder="Describe the music you want to create..."
                  rows={4}
                  value={params.prompt}
                  onChange={(e) => updateParam("prompt", e.target.value)}
                  disabled={status === "generating" || status === "queued"}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Genre</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm" value={params.genre} onChange={(e) => updateParam("genre", e.target.value)} disabled={status === "generating"}>{GENRES.map((g) => <option key={g} value={g}>{g}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Language</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm" value={params.language} onChange={(e) => updateParam("language", e.target.value)} disabled={status === "generating"}>{LANGUAGES.map((l) => <option key={l.code} value={l.name}>{l.name}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Region</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm" value={params.region} onChange={(e) => updateParam("region", e.target.value)} disabled={status === "generating"}>{CULTURES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Culture</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm" value={params.culture} onChange={(e) => updateParam("culture", e.target.value)} disabled={status === "generating"}>{CULTURES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Mood</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm" value={params.mood} onChange={(e) => updateParam("mood", e.target.value as any)} disabled={status === "generating"}>{MOODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Voice</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm" value={params.voiceProfileId || ""} onChange={(e) => updateParam("voiceProfileId", e.target.value || undefined)} disabled={status === "generating"}><option value="">No Vocals</option>{MOCK_VOICES.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.gender})</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Era</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm" value={params.era} onChange={(e) => updateParam("era", e.target.value)} disabled={status === "generating"}>{ERAS.map((e) => <option key={e} value={e}>{e}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Production</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm" value={params.productionStyle} onChange={(e) => updateParam("productionStyle", e.target.value)} disabled={status === "generating"}>{PRODUCTION_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Structure</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm" value={params.structure} onChange={(e) => updateParam("structure", e.target.value)} disabled={status === "generating"}>{STRUCTURES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Duration (sec)</label>
                  <input type="number" min="10" max="600" className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm sam-mono" value={params.duration} onChange={(e) => updateParam("duration", Number(e.target.value))} disabled={status === "generating"} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Energy</label>
                  <SAMSlider value={[params.energy || 0.5]} min={0} max={1} step={0.1} onValueChange={(v) => updateParam("energy", v[0])} showValue valueFormatter={(v) => `${Math.round(v * 100)}%`} disabled={status === "generating"} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Key</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm sam-mono" value={params.key} onChange={(e) => updateParam("key", e.target.value as any)} disabled={status === "generating"}>{["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"].map((k) => <option key={k} value={k}>{k}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Scale</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm sam-mono" value={params.scale} onChange={(e) => updateParam("scale", e.target.value as any)} disabled={status === "generating"}><option value="major">Major</option><option value="minor">Minor</option><option value="dorian">Dorian</option><option value="mixolydian">Mixolydian</option></select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Time Signature</label>
                  <select className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm sam-mono" value={`${params.timeSignature?.numerator}/${params.timeSignature?.denominator}`} onChange={(e) => { const [n, d] = e.target.value.split("/").map(Number); updateParam("timeSignature", { numerator: n, denominator: d }); }} disabled={status === "generating"}>{TIME_SIGS.map((ts) => <option key={`${ts.n}/${ts.d}`} value={`${ts.n}/${ts.d}`}>{ts.n}/{ts.d}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Tempo (BPM)</label>
                  <input type="number" min="20" max="300" className="w-full bg-background/50 border border-border rounded-md px-2 py-1.5 text-sm sam-mono" value={params.bpm} onChange={(e) => updateParam("bpm", Number(e.target.value))} disabled={status === "generating"} />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Reference Audio</label>
                  <div className="border border-dashed border-border rounded-lg p-4 text-center"><Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xs text-muted-foreground">Drop audio file or click to upload</p></div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 sam-mono">Reference MIDI</label>
                  <div className="border border-dashed border-border rounded-lg p-4 text-center"><Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xs text-muted-foreground">Drop MIDI file or click to upload</p></div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-2 sam-mono">INSTRUMENTATION</label>
                <div className="flex flex-wrap gap-1.5">
                  {INSTRUMENTS.map((inst) => (
                    <button key={inst} type="button" onClick={() => { const current = params.instrumentation || []; const updated = current.includes(inst) ? current.filter((i) => i !== inst) : [...current, inst]; updateParam("instrumentation", updated); }} className={`px-2.5 py-1 text-xs rounded-md transition-colors sam-mono ${ (params.instrumentation || []).includes(inst) ? "bg-primary/20 text-primary border border-primary/30" : "bg-background/30 text-muted-foreground hover:bg-background/50" }`} disabled={status === "generating"}>{inst}</button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <SAMButton variant="musical" size="lg" className="w-full h-14 text-lg" isLoading={status === "generating" || status === "queued"} onClick={handleGenerate} disabled={!params.prompt?.trim() || status === "generating"}><Wand2 className="h-5 w-5 mr-2" /> GENERATE</SAMButton>
              </div>
            </div>
          </div>

          {/* Center: Generation workspace */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b border-border p-4 sam-mono flex items-center justify-between">
              <h2 className="text-lg font-semibold">Generation Workspace</h2>
              <SAMStatusBadge status={status === "failed" ? "error" : status === "idle" ? "idle" : status === "queued" ? "pending" : status === "analyzing" || status === "generating" || status === "rendering" ? "processing" : "idle"} />
            </div>
            <div className="flex-1 overflow-y-auto p-6 sam-scrollbar-hide">
              <AnimatePresence>
                {status === "idle" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20"><Wand2 className="h-8 w-8 text-primary" /></div>
                    <h3 className="text-xl font-semibold mb-2">Ready to create</h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">Enter a detailed prompt describing your musical vision. Include genres, emotions, instruments, tempo, and cultural influences.</p>
                    <p className="text-xs text-muted-foreground">Model: sam-ai-orchestra-v2 · GPU: Available · Credits: 1,240</p>
                  </motion.div>
                )}

                {(status === "queued" || status === "generating") && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <SAMCard className="p-6">
                      <div className="flex items-center justify-between mb-4"><SAMStatusBadge status="processing">{getStepLabel()}</SAMStatusBadge><span className="text-sm sam-mono text-muted-foreground">{progress}%</span></div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} /></div>
                      <div className="mt-4 space-y-1 text-xs sam-mono text-muted-foreground">
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Analyzing prompt and selecting optimal model...</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />Generating musical structure and arrangement...</div>
                        <div className="flex items-center gap-2 opacity-50"><span className="w-1.5 h-1.5 rounded-full" />Rendering audio waveform...</div>
                        <div className="flex items-center gap-2 opacity-50"><span className="w-1.5 h-1.5 rounded-full" />Finalizing master mix...</div>
                      </div>
                    </SAMCard>
                  </motion.div>
                )}

                {status === "completed" && job?.result && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <SAMGenerationCard result={job.result} />
                    <div className="flex justify-center gap-3 sam-mono"><SAMButton variant="primary" size="sm">Open in Studio</SAMButton><SAMButton variant="secondary" size="sm">Extend</SAMButton><SAMButton variant="secondary" size="sm">Remix</SAMButton></div>
                  </motion.div>
                )}

                {status === "failed" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4"><span className="text-red-400">!</span></div>
                    <h3 className="text-xl font-semibold mb-2">Generation Failed</h3>
                    <p className="text-sm text-muted-foreground mb-6">An error occurred during music generation. Please check your prompt and try again.</p>
                    <SAMButton variant="primary" onClick={() => setStatus("idle")}>Retry Generation</SAMButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Advanced settings */}
          {showRightPanel && (
            <div className="w-80 border-l border-border overflow-y-auto sam-scrollbar-hide">
              <div className="p-4 border-b border-border sam-mono flex items-center justify-between">
                <h3 className="font-medium">Advanced Settings</h3>
                <SAMButton size="icon-xs" variant="ghost" onClick={() => setShowRightPanel(false)}><ChevronRight className="h-4 w-4" /></SAMButton>
              </div>
              <div className="p-4 space-y-6">
                <div className="space-y-4">
                  <SAMSlider label="Random Seed" value={[params.seed || 0]} min={0} max={9999} step={1} onValueChange={(v) => updateParam("seed", v[0])} showValue valueFormatter={(v) => v > 0 ? Math.round(v).toString() : "Random"} />
                  <SAMSlider label="Creativity" value={[params.creativity || 0.5]} min={0} max={1} step={0.05} onValueChange={(v) => updateParam("creativity", v[0])} showValue valueFormatter={(v) => `${Math.round(v * 100)}%`} />
                  <SAMSlider label="Structure Strength" value={[params.structureStrength || 0.5]} min={0} max={1} step={0.05} onValueChange={(v) => updateParam("structureStrength", v[0])} showValue valueFormatter={(v) => `${Math.round(v * 100)}%`} />
                  <SAMSlider label="Melody Strength" value={[params.melodyStrength || 0.5]} min={0} max={1} step={0.05} onValueChange={(v) => updateParam("melodyStrength", v[0])} />
                  <SAMSlider label="Rhythm Strength" value={[params.rhythmStrength || 0.5]} min={0} max={1} step={0.05} onValueChange={(v) => updateParam("rhythmStrength", v[0])} />
                  <SAMSlider label="Vocal Strength" value={[params.vocalStrength || 0.5]} min={0} max={1} step={0.05} onValueChange={(v) => updateParam("vocalStrength", v[0])} />
                  <SAMSlider label="Instrument Strength" value={[params.instrumentStrength || 0.5]} min={0} max={1} step={0.05} onValueChange={(v) => updateParam("instrumentStrength", v[0])} />
                </div>
                <SAMButton size="sm" variant="secondary" className="w-full">Save as Preset</SAMButton>
              </div>
            </div>
          )}
        </div>
      </div>
      <SAMCommandPalette />
      <SAMBottomNav />
      <SAMMiniPlayer />
    </div>
  );
}
