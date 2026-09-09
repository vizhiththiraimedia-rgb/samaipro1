"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";
import { SAMSlider } from "@/components/sam/sam-slider";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { useVoiceStore } from "@/stores/data-stores";
import { VoiceProfile } from "@/types/music";
import { Mic, Play, Volume2, Upload, Download, Share2, Users, Globe, UserPlus, Bot } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceSettings {
  pitch: number;
  speed: number;
  timbre: number;
  emotion: number;
  resonance: number;
  vibrato: number;
  breathiness: number;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  pitch: 0,
  speed: 100,
  timbre: 50,
  emotion: 50,
  resonance: 50,
  vibrato: 0,
  breathiness: 0,
};

export default function VoicesPage() {
  const { voices, addVoice, updateVoice, setSelectedVoice, selectedVoiceId } = useVoiceStore();
  const [selectedVoice, setSelectedVoiceLocal] = useState<VoiceProfile | null>(voices.length > 0 ? voices[0] : null);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<"library" | "studio" | "community">("studio");

  const handleSelectVoice = (voice: VoiceProfile) => {
    setSelectedVoiceLocal(voice);
    setSelectedVoice(voice.id);
    setVoiceSettings(DEFAULT_SETTINGS);
  };

  const handleCreateVoice = () => {
    const newVoice: VoiceProfile = {
      id: crypto.randomUUID(),
      name: "New Voice",
      gender: "neutral",
      age: "adult",
      language: "en",
      tone: "clear",
      style: "lead",
      model: "sam-ai-vocalist-v4",
      isCustom: true,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };
    addVoice(newVoice);
    handleSelectVoice(newVoice);
  };

  const updateSetting = (key: keyof VoiceSettings, value: number) => {
    setVoiceSettings({ ...voiceSettings, [key]: value });
  };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Voice Lab</h1>
              <p className="text-sm text-muted-foreground mt-1">Create AI voices, clone vocals, and design vocal profiles</p>
            </div>
            <SAMButton leftIcon={<UserPlus className="h-4 w-4" />} onClick={handleCreateVoice}>
              Clone Voice
            </SAMButton>
          </div>

          <div className="flex gap-2 mb-6 sam-mono">
            <SAMButton size="sm" variant={activeTab === "studio" ? "primary" : "ghost"} onClick={() => setActiveTab("studio")}>
              <Bot className="h-4 w-4" /> Voice Studio
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "library" ? "primary" : "ghost"} onClick={() => setActiveTab("library")}>
              <Users className="h-4 w-4" /> Voice Library
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "community" ? "primary" : "ghost"} onClick={() => setActiveTab("community")}>
              <Globe className="h-4 w-4" /> Community
            </SAMButton>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === "studio" && selectedVoice && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Voice controls */}
                  <div className="lg:col-span-1 space-y-4 sam-mono">
                    <SAMCard className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                          <Mic className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{selectedVoice.name}</h3>
                          <SAMStatusBadge status="active" size="sm">Active</SAMStatusBadge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 flex justify-between">
                            Pitch
                            <span className="text-foreground">{voiceSettings.pitch > 0 ? "+" : ""}{voiceSettings.pitch}</span>
                          </label>
                          <SAMSlider
                            min={-12} max={12} value={voiceSettings.pitch} onChange={(v) => updateSetting("pitch", v)}
                          />
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground mb-1 flex justify-between">
                            Speed
                            <span className="text-foreground">{voiceSettings.speed}%</span>
                          </label>
                          <SAMSlider
                            min={50} max={200} value={voiceSettings.speed} onChange={(v) => updateSetting("speed", v)}
                          />
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground mb-1 flex justify-between">
                            Timbre
                            <span className="text-foreground">{voiceSettings.timbre}%</span>
                          </label>
                          <SAMSlider value={voiceSettings.timbre} onChange={(v) => updateSetting("timbre", v)} />
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground mb-1 flex justify-between">
                            Emotion
                            <span className="text-foreground">{voiceSettings.emotion}%</span>
                          </label>
                          <SAMSlider value={voiceSettings.emotion} onChange={(v) => updateSetting("emotion", v)} />
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground mb-1 flex justify-between">
                            Resonance
                            <span className="text-foreground">{voiceSettings.resonance}%</span>
                          </label>
                          <SAMSlider value={voiceSettings.resonance} onChange={(v) => updateSetting("resonance", v)} />
                        </div>
                      </div>
                    </SAMCard>

                    <SAMCard className="p-4">
                      <h4 className="font-semibold mb-3">Test Vocals</h4>
                      <div className="space-y-3">
                        <textarea
                          placeholder="Enter text to test..."
                          className="w-full h-20 bg-surface border border-border rounded p-2 text-sm resize-none sam-mono"
                        />
                        <div className="flex items-center gap-2">
                          <SAMButton className="flex-1" leftIcon={<Play className="h-4 w-4" />}>
                            Generate Preview
                          </SAMButton>
                          <SAMButton variant="ghost" size="sm">
                            <Volume2 className="h-4 w-4" />
                          </SAMButton>
                        </div>
                      </div>
                    </SAMCard>
                  </div>

                  {/* Voice settings */}
                  <div className="lg:col-span-2 space-y-4 sam-mono">
                    <SAMCard className="p-4">
                      <h3 className="font-semibold mb-3">Advanced Synthesizer</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-muted-foreground">Vibrato</label>
                            <span className="text-xs font-mono">{voiceSettings.vibrato}%</span>
                          </div>
                          <SAMSlider min={0} max={100} value={voiceSettings.vibrato} onChange={(v) => updateSetting("vibrato", v)} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-muted-foreground">Breathiness</label>
                            <span className="text-xs font-mono">{voiceSettings.breathiness}%</span>
                          </div>
                          <SAMSlider min={0} max={100} value={voiceSettings.breathiness} onChange={(v) => updateSetting("breathiness", v)} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-muted-foreground">Gender</label>
                            <span className="text-xs font-mono">{selectedVoice.gender}</span>
                          </div>
                          <select className="w-full text-sm bg-surface border border-border rounded px-2 py-1">
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="neutral">Neutral</option>
                          </select>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-muted-foreground">Language</label>
                            <span className="text-xs font-mono">{selectedVoice.language}</span>
                          </div>
                          <select className="w-full text-sm bg-surface border border-border rounded px-2 py-1">
                            <option value="en">English</option>
                            <option value="ta">Tamil</option>
                            <option value="si">Sinhala</option>
                            <option value="hi">Hindi</option>
                          </select>
                        </div>
                      </div>
                    </SAMCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sam-mono">
                      <SAMCard className="p-4">
                        <h3 className="font-semibold mb-3">Voice Training Data</h3>
                        <div className="space-y-3 sam-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Samples uploaded</span>
                            <span className="text-sm font-mono">{selectedVoice.usageCount} uses</span>
                          </div>
                          <label className="flex items-center justify-center gap-2 p-4 border border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">Upload training samples</span>
                            <input type="file" multiple accept="audio/*" className="hidden" />
                          </label>
                        </div>
                      </SAMCard>

                      <SAMCard className="p-4">
                        <h3 className="font-semibold mb-3">Export Voice</h3>
                        <div className="space-y-3">
                          <button className="w-full text-left p-3 bg-surface border border-border rounded-lg hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                              <Download className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Download voice model</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">ONNX format (.zip)</div>
                          </button>
                          <button className="w-full text-left p-3 bg-surface border border-border rounded-lg hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                              <Share2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Share to community</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">Public voice profile</div>
                          </button>
                        </div>
                      </SAMCard>
                    </div>
                  </div>
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
