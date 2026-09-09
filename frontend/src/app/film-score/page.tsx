"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard, SAMPanel } from "@/components/sam/sam-card";
import { SAMSlider } from "@/components/sam/sam-slider";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { Film, Music, Play, Pause, Download, Save, Wand2, Clock, Sparkles, ListMusic, Headphones, Volume2, Settings, Layers, Palette, Layout } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilmScorePage() {
  const [projectName, setProjectName] = useState("Untitled Score");
  const [isComposing, setIsComposing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"composer" | "instruments" | "export">("composer");

  const [scenes, setScenes] = useState<Scene[]>([
    { id: "1", name: "Opening", description: "Establish the mood", duration: "0:00-1:30", emotionalWeight: 30 },
    { id: "2", name: "Rising Action", description: "Build tension", duration: "1:30-3:00", emotionalWeight: 70 },
    { id: "3", name: "Climax", description: "Peak drama", duration: "3:00-4:30", emotionalWeight: 95 },
    { id: "4", name: "Resolution", description: "Release and resolution", duration: "4:30-6:00", emotionalWeight: 20 },
  ]);

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Film Score Composer</h1>
              <p className="text-sm text-muted-foreground mt-1">AI-powered orchestral composition for visual media</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="px-3 py-1 text-sm bg-surface-panel border border-border rounded sam-mono"
                placeholder="Project name"
              />
              <SAMButton size="sm" variant="ghost"><Save className="h-4 w-4" /></SAMButton>
              <SAMButton size="sm" variant="ghost"><Download className="h-4 w-4" /></SAMButton>
            </div>
          </div>

          <div className="flex gap-2 mb-6 sam-mono">
            <SAMButton size="sm" variant={activeTab === "composer" ? "primary" : "ghost"} onClick={() => setActiveTab("composer")}>
              <Music className="h-4 w-4" /> Composer
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "instruments" ? "primary" : "ghost"} onClick={() => setActiveTab("instruments")}>
              <Layers className="h-4 w-4" /> Instruments
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "export" ? "primary" : "ghost"} onClick={() => setActiveTab("export")}>
              <Download className="h-4 w-4" /> Export
            </SAMButton>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === "composer" && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1 space-y-4 sam-mono">
                    <SAMCard className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2"><Wand2 className="h-4 w-4" /> Scene Builder</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground">Scene</label>
                          <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm">
                            {scenes.map(s => <option key={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1">Emotional Weight: {scenes[0]?.emotionalWeight}%</label>
                          <SAMSlider min={0} max={100} value={scenes[0]?.emotionalWeight || 50} showValue={false} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1">Intensity</label>
                          <div className="flex gap-2">
                            <SAMButton size="sm" variant="ghost">Subtle</SAMButton>
                            <SAMButton size="sm" variant="ghost">Moderate</SAMButton>
                            <SAMButton size="sm" variant="primary">Intense</SAMButton>
                          </div>
                        </div>
                      </div>
                    </SAMCard>

                    <SAMCard className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2"><Film className="h-4 w-4" /> Genre</h3>
                      <div className="space-y-2">
                        {["Orchestral", "Electronic", "Hybrid", "Minimalist", "Ambient"].map(g => (
                          <button key={g} className="w-full text-left px-3 py-2 text-sm bg-surface border border-border rounded hover:bg-muted transition-colors">
                            {g}
                          </button>
                        ))}
                      </div>
                    </SAMCard>

                    <SAMButton className="w-full" leftIcon={<Sparkles className="h-4 w-4" />} onClick={() => { setIsComposing(true); setTimeout(() => setIsComposing(false), 3000); }} disabled={isComposing}>
                      {isComposing ? "Composing..." : "Generate Score"}
                    </SAMButton>
                  </div>

                  <div className="lg:col-span-3 space-y-4 sam-mono">
                    <SAMCard className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Score Timeline</h3>
                        <div className="flex gap-2">
                          <SAMButton size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </SAMButton>
                          <SAMButton size="sm" variant="ghost"><Settings className="h-4 w-4" /></SAMButton>
                        </div>
                      </div>

                      <div className="border border-border rounded-lg p-4 bg-surface h-80 relative">
                        <div className="absolute top-0 left-0 right-0 h-8 border-b border-border px-4 flex items-center sam-mono text-xs">
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">00:00</span>
                            <div className="w-1 h-4 bg-accent rounded" />
                            <span>Scene 2</span>
                          </div>
                          <div className="ml-auto text-muted-foreground">6:00</div>
                        </div>

                        <div className="mt-8 space-y-4">
                          {scenes.map((scene) => (
                            <motion.div key={scene.id} className="flex items-center gap-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                              <div className="w-24 text-right text-sm sam-mono text-muted-foreground">
                                {scene.id === "1" ? "00:00" : scene.id === "2" ? "01:30" : scene.id === "3" ? "03:00" : "04:30"}
                              </div>
                              <div className="w-1 h-6 bg-accent rounded-full" style={{ opacity: scene.emotionalWeight / 100 }} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{scene.name}</span>
                                  <SAMStatusBadge status="draft" size="sm">{Math.round(scene.emotionalWeight)}% intensity</SAMStatusBadge>
                                </div>
                                <p className="text-xs text-muted-foreground">{scene.description}</p>
                                <div className="h-3 bg-border rounded-full mt-2 overflow-hidden">
                                  <div className="h-full bg-accent rounded-full" style={{ width: `${scene.emotionalWeight}%` }} />
                                </div>
                              </div>
                              <div className="w-24 text-sm sam-mono text-muted-foreground">{scene.duration}</div>
                            </motion.div>
                          ))}
                        </div>

                        {isPlaying && (
                          <motion.div
                            className="absolute top-0 bottom-0 w-0.5 bg-accent shadow-lg shadow-accent/50 z-10"
                            initial={{ left: "0%", opacity: 1 }}
                            animate={{ left: "100%" }}
                            transition={{ duration: 30, ease: "linear" }}
                          />
                        )}
                      </div>
                    </SAMCard>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sam-mono">
                      <SAMCard className="p-3 text-center">
                        <div className="text-2xl font-bold text-accent">42</div>
                        <div className="text-xs text-muted-foreground">Stems</div>
                      </SAMCard>
                      <SAMCard className="p-3 text-center">
                        <div className="text-2xl font-bold text-accent">6:00</div>
                        <div className="text-xs text-muted-foreground">Duration</div>
                      </SAMCard>
                      <SAMCard className="p-3 text-center">
                        <div className="text-2xl font-bold text-accent">120</div>
                        <div className="text-xs text-muted-foreground">Tempo BPM</div>
                      </SAMCard>
                      <SAMCard className="p-3 text-center">
                        <div className="text-2xl font-bold text-accent">C</div>
                        <div className="text-xs text-muted-foreground">Key</div>
                      </SAMCard>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "instruments" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sam-mono">
                  {["Strings", "Brass", "Woodwinds", "Choir", "Percussion", "Piano", "Harp", "Bass", "Synths", "Ethnic"].map(inst => (
                    <SAMCard key={inst} className="p-4 text-center group">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                        <Music className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold">{inst}</h3>
                      <p className="text-xs text-muted-foreground mt-1">AI virtual performer</p>
                      <SAMButton size="sm" className="mt-3 w-full" leftIcon={<Play className="h-3 w-3" />}>Audition</SAMButton>
                    </SAMCard>
                  ))}
                </div>
              )}

              {activeTab === "export" && (
                <div className="max-w-2xl mx-auto space-y-4 sam-mono">
                  <SAMCard className="p-4">
                    <h3 className="font-semibold mb-3">Export Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1">Format</label>
                        <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm">
                          <option>WAV 24-bit</option>
                          <option>WAV 16-bit</option>
                          <option>MP3 320kbps</option>
                          <option>AIFF</option>
                          <option>MIDI</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1">Stems</label>
                        <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm">
                          <option>Mixed Stereo</option>
                          <option>Individual Stems</option>
                          <option>5.1 Surround</option>
                        </select>
                      </div>
                    </div>
                  </SAMCard>
                  <SAMButton className="w-full" leftIcon={<Download className="h-4 w-4" />} size="lg">
                    Export Score
                  </SAMButton>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}

interface Scene {
  id: string;
  name: string;
  description: string;
  duration: string;
  emotionalWeight: number;
}
