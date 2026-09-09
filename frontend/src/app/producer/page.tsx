"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";
import { SAMSlider } from "@/components/sam/sam-slider";
import { productionServices, ProductionTask } from "@/services/production-services";
import { Bot, Sparkles, Music, Wand2, Repeat, Shuffle, BarChart3, TrendingUp, Save, Share2, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProducerPage() {
  const [tasks, setTasks] = useState<ProductionTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ProductionTask | null>(null);
  const [activeTab, setActiveTab] = useState<"composer" | "arranger" | "mixer" | "master">("composer");
  const [isGenerating, setIsGenerating] = useState(false);

  const startComposerTask = async (params: Record<string, unknown>) => {
    setIsGenerating(true);
    const task = await productionServices.compose(params);
    setTasks([task, ...tasks]);
    setSelectedTask(task);
    setIsGenerating(false);
  };

  const startArrangementTask = async (params: Record<string, unknown>) => {
    setIsGenerating(true);
    const task = await productionServices.arrange(params);
    setTasks([task, ...tasks]);
    setSelectedTask(task);
    setIsGenerating(false);
  };

  const startMixTask = async (params: Record<string, unknown>) => {
    setIsGenerating(true);
    const task = await productionServices.mix(params);
    setTasks([task, ...tasks]);
    setSelectedTask(task);
    setIsGenerating(false);
  };

  const startMasterTask = async (params: Record<string, unknown>) => {
    setIsGenerating(true);
    const task = await productionServices.master(params);
    setTasks([task, ...tasks]);
    setSelectedTask(task);
    setIsGenerating(false);
  };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">AI Producer</h1>
              <p className="text-sm text-muted-foreground mt-1">Full-track production with AI composition, arrangement, mixing & mastering</p>
            </div>
            <div className="flex gap-2">
              <SAMButton variant="ghost" size="sm"><Clock className="h-4 w-4" /> History</SAMButton>
              <SAMButton variant="ghost" size="sm"><Save className="h-4 w-4" /> Save Session</SAMButton>
              <SAMButton variant="ghost" size="sm"><Share2 className="h-4 w-4" /> Export</SAMButton>
            </div>
          </div>

          <div className="flex gap-2 mb-6 sam-mono">
            <SAMButton size="sm" variant={activeTab === "composer" ? "primary" : "ghost"} onClick={() => setActiveTab("composer")}>
              <Music className="h-4 w-4" /> Composer
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "arranger" ? "primary" : "ghost"} onClick={() => setActiveTab("arranger")}>
              <BarChart3 className="h-4 w-4" /> Arranger
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "mixer" ? "primary" : "ghost"} onClick={() => setActiveTab("mixer")}>
              <TrendingUp className="h-4 w-4" /> Mixer
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "master" ? "primary" : "ghost"} onClick={() => setActiveTab("master")}>
              <Sparkles className="h-4 w-4" /> Mastering
            </SAMButton>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === "composer" && (
                <ComposerTab onCompose={startComposerTask} isLoading={isGenerating} />
              )}
              {activeTab === "arranger" && (
                <ArrangerTab onArrange={startArrangementTask} isLoading={isGenerating} />
              )}
              {activeTab === "mixer" && (
                <MixerTab onMix={startMixTask} isLoading={isGenerating} />
              )}
              {activeTab === "master" && (
                <MasterTab onMaster={startMasterTask} isLoading={isGenerating} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}

function ComposerTab({ onCompose, isLoading }: { onCompose: (p: Record<string, unknown>) => void; isLoading: boolean }) {
  const [genre, setGenre] = useState("ambient");
  const [mood, setMood] = useState("calm");
  const [tempo, setTempo] = useState(120);
  const [key, setKey] = useState("C");
  const [complexity, setComplexity] = useState(50);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4 sam-mono">
        <SAMCard className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Music className="h-4 w-4" /> Musical Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1">Genre</label>
              <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm" value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="ambient">Ambient</option>
                <option value="electronic">Electronic</option>
                <option value="cinematic">Cinematic</option>
                <option value="orchestral">Orchestral</option>
                <option value="jazz">Jazz</option>
                <option value="rock">Rock</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1">Mood</label>
              <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm" value={mood} onChange={(e) => setMood(e.target.value)}>
                <option value="calm">Calm</option>
                <option value="uplifting">Uplifting</option>
                <option value="dramatic">Dramatic</option>
                <option value="melancholic">Melancholic</option>
                <option value="energetic">Energetic</option>
                <option value="mysterious">Mysterious</option>
              </select>
            </div>
            <div>
              <label className="flex justify-between text-xs text-muted-foreground mb-1">Tempo: {tempo} BPM</label>
              <SAMSlider min={60} max={200} value={tempo} onChange={setTempo} showValue={false} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1">Key</label>
              <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm" value={key} onChange={(e) => setKey(e.target.value)}>
                {["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="flex justify-between text-xs text-muted-foreground mb-1">Complexity: {complexity}%</label>
              <SAMSlider min={0} max={100} value={complexity} onChange={setComplexity} showValue={false} />
            </div>
          </div>
        </SAMCard>

        <SAMButton className="w-full" leftIcon={<Sparkles className="h-4 w-4" />} onClick={() => onCompose({ genre, mood, tempo, key, complexity })} disabled={isLoading}>
          {isLoading ? "Composing..." : "Compose Melody"}
        </SAMButton>
      </div>

      <div className="lg:col-span-2">
        <SAMCard className="p-4 h-full">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Bot className="h-4 w-4" /> AI Composition</h3>
          <div className="text-center py-12 text-muted-foreground">
            <Music className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p>Set parameters and compose to generate a melody</p>
          </div>
        </SAMCard>
      </div>
    </div>
  );
}

function ArrangerTab({ onArrange, isLoading }: { onArrange: (p: Record<string, unknown>) => void; isLoading: boolean }) {
  const [structure, setStructure] = useState("verse-chorus");
  const [sections, setSections] = useState(8);
  const [transitionStyle, setTransitionStyle] = useState("smooth");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4 sam-mono">
        <SAMCard className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Arrangement</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1">Structure</label>
              <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm" value={structure} onChange={(e) => setStructure(e.target.value)}>
                <option value="verse-chorus">Verse - Chorus</option>
                <option value="abrasion">A-B-A-B</option>
                <option value="through-composed">Through Composed</option>
                <option value="loop">Loop</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1">Sections: {sections}</label>
              <SAMSlider min={2} max={16} value={sections} onChange={setSections} showValue={false} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1">Transition Style</label>
              <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm" value={transitionStyle} onChange={(e) => setTransitionStyle(e.target.value)}>
                <option value="smooth">Smooth</option>
                <option value="abrupt">Abrupt</option>
                <option value="build">Build-up</option>
                <option value="drop">Drop</option>
              </select>
            </div>
          </div>
        </SAMCard>
        <SAMButton className="w-full" leftIcon={<Repeat className="h-4 w-4" />} onClick={() => onArrange({ structure, sections, transitionStyle })} disabled={isLoading}>
          {isLoading ? "Arranging..." : "Generate Arrangement"}
        </SAMButton>
      </div>
      <div className="lg:col-span-2">
        <SAMCard className="p-4 h-full">
          <h3 className="font-semibold mb-3">Song Arrangement</h3>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p>Arrange your melody into a full song structure</p>
          </div>
        </SAMCard>
      </div>
    </div>
  );
}

function MixerTab({ onMix, isLoading }: { onMix: (p: Record<string, unknown>) => void; isLoading: boolean }) {
  const [balance, setBalance] = useState("balanced");
  const [width, setWidth] = useState("wide");
  const [depth, setDepth] = useState(50);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4 sam-mono">
        <SAMCard className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Mixing</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1">Balance</label>
              <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm" value={balance} onChange={(e) => setBalance(e.target.value)}>
                <option value="balanced">Balanced</option>
                <option value="instrumental">Instrumental Focus</option>
                <option value="vocal">Vocal Focus</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1">Width</label>
              <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm" value={width} onChange={(e) => setWidth(e.target.value)}>
                <option value="wide">Wide Stereo</option>
                <option value="narrow">Narrow</option>
                <option value="mono">Mono Compatible</option>
              </select>
            </div>
            <div>
              <label className="flex justify-between text-xs text-muted-foreground mb-1">Depth: {depth}%</label>
              <SAMSlider min={0} max={100} value={depth} onChange={setDepth} showValue={false} />
            </div>
          </div>
        </SAMCard>
        <SAMButton className="w-full" leftIcon={<Wand2 className="h-4 w-4" />} onClick={() => onMix({ balance, width, depth })} disabled={isLoading}>
          {isLoading ? "Mixing..." : "Auto-Mix Track"}
        </SAMButton>
      </div>
      <div className="lg:col-span-2">
        <SAMCard className="p-4 h-full">
          <h3 className="font-semibold mb-3">Mix Automation</h3>
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p>AI will automatically balance all tracks</p>
          </div>
        </SAMCard>
      </div>
    </div>
  );
}

function MasterTab({ onMaster, isLoading }: { onMaster: (p: Record<string, unknown>) => void; isLoading: boolean }) {
  const [preset, setPreset] = useState("loudness");
  const [stereoEnhancement, setStereoEnhancement] = useState(50);
  const [transients, setTransients] = useState(50);
  const [harmonic, setHarmonic] = useState(50);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4 sam-mono">
        <SAMCard className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4" /> Mastering</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1">Preset</label>
              <select className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm" value={preset} onChange={(e) => setPreset(e.target.value)}>
                <option value="loudness">Loudness Boost</option>
                <option value="clarity">Clarity Enhancement</option>
                <option value="warmth">Analog Warmth</option>
                <option value="spatial">Spatial Width</option>
                <option value="transparent">Transparent</option>
              </select>
            </div>
            <div>
              <label className="flex justify-between text-xs text-muted-foreground mb-1">Stereo Enhancement: {stereoEnhancement}%</label>
              <SAMSlider min={0} max={100} value={stereoEnhancement} onChange={setStereoEnhancement} showValue={false} />
            </div>
            <div>
              <label className="flex justify-between text-xs text-muted-foreground mb-1">Transients: {transients}%</label>
              <SAMSlider min={-100} max={100} value={transients} onChange={setTransients} showValue={false} />
            </div>
            <div>
              <label className="flex justify-between text-xs text-muted-foreground mb-1">Harmonic Excitement: {harmonic}%</label>
              <SAMSlider min={0} max={100} value={harmonic} onChange={setHarmonic} showValue={false} />
            </div>
          </div>
        </SAMCard>
        <SAMButton className="w-full" leftIcon={<Sparkles className="h-4 w-4" />} onClick={() => onMaster({ preset, stereoEnhancement, transients, harmonic })} disabled={isLoading}>
          {isLoading ? "Mastering..." : "AI Master Track"}
        </SAMButton>
      </div>
      <div className="lg:col-span-2">
        <SAMCard className="p-4 h-full">
          <h3 className="font-semibold mb-3">Master Output</h3>
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p>Ready to master. Master output will appear here.</p>
          </div>
        </SAMCard>
      </div>
    </div>
  );
}
