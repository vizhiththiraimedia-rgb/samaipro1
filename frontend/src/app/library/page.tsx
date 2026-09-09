"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";
import { useGenerationStore } from "@/stores/data-stores";
import { Search, Filter, Play, Heart, Download, Share2, RefreshCw, Music, Headphones, Radio } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GenerationResult } from "@/types/music";

interface GenerationPreset {
  id: string;
  name: string;
  tags?: string[];
  isFavorite: boolean;
  model: string;
}

interface SoundAsset {
  id: string;
  name: string;
  category?: string;
  duration: number;
  isFavorite: boolean;
}

const MOCK_PRESETS: GenerationPreset[] = [
  { id: "preset_1", name: "Cinematic Orchestra", tags: ["cinematic", "orchestral"], isFavorite: true, model: "sam-ai-orchestra-v2" },
  { id: "preset_2", name: "Tamil Pop", tags: ["tamil", "pop"], isFavorite: false, model: "sam-ai-melody-v3" },
  { id: "preset_3", name: "Synthwave", tags: ["electronic", "80s"], isFavorite: true, model: "sam-ai-bassline-v1" },
  { id: "preset_4", name: "Ambient Pads", tags: ["ambient", "atmospheric"], isFavorite: false, model: "sam-ai-melody-v3" },
  { id: "preset_5", name: "Drum & Bass", tags: ["electronic", "dnb"], isFavorite: true, model: "sam-ai-drum-v2" },
  { id: "preset_6", name: "Acoustic Guitar", tags: ["folk", "acoustic"], isFavorite: false, model: "sam-ai-melody-v3" },
];

const MOCK_ASSETS: SoundAsset[] = [
  { id: "asset_1", name: "Epic Trailer Hit", category: "SFX", duration: 3, isFavorite: true },
  { id: "asset_2", name: "Ambient Pad C", category: "Synth", duration: 30, isFavorite: false },
  { id: "asset_3", name: "Tamil Vocal Sample", category: "Vocals", duration: 8, isFavorite: true },
  { id: "asset_4", name: "Tabla Loop", category: "World", duration: 16, isFavorite: false },
  { id: "asset_5", name: "Cinematic Boom", category: "Drums", duration: 2, isFavorite: true },
];

export default function LibraryPage() {
  const { jobs, isGenerating } = useGenerationStore();
  const [presets, setPresets] = useState<GenerationPreset[]>(MOCK_PRESETS);
  const [assets, setAssets] = useState<SoundAsset[]>(MOCK_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"presets" | "assets" | "generated">("presets");

  const filteredPresets = useMemo(() => {
    return presets.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [presets, searchQuery]);

  const filteredAssets = useMemo(() => {
    return assets.filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assets, searchQuery]);

  const generated = jobs.filter(j => j.status === "completed") as unknown as GenerationResult[];

  const handleGenerate = (preset: GenerationPreset) => {
    useGenerationStore.getState().addJob({
      id: `gen_${Math.random().toString(36).slice(2, 10)}`,
      type: "generation",
      prompt: preset.name,
      params: { genre: preset.tags?.[0] || "" },
      status: "queued",
      progress: 0,
      model: preset.model,
      createdAt: new Date().toISOString(),
      estimatedTime: 15,
    });
  };

  const handleFavoritePreset = (id: string) => {
    setPresets(presets.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleFavoriteAsset = (id: string) => {
    setAssets(assets.map(a => a.id === id ? { ...a, isFavorite: !a.isFavorite } : a));
  };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Sound Library</h1>
              <p className="text-sm text-muted-foreground mt-1">Browse presets, samples, and generated sounds</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sounds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-panel border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6 sam-mono">
            <SAMButton size="sm" variant={activeTab === "presets" ? "primary" : "ghost"} onClick={() => setActiveTab("presets")}>
              <Music className="h-4 w-4" /> Presets
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "assets" ? "primary" : "ghost"} onClick={() => setActiveTab("assets")}>
              <Headphones className="h-4 w-4" /> Samples
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "generated" ? "primary" : "ghost"} onClick={() => setActiveTab("generated")}>
              <Radio className="h-4 w-4" /> My Generations
            </SAMButton>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {activeTab === "presets" && filteredPresets.map((preset) => (
                <PresetCard key={preset.id} preset={preset} onGenerate={handleGenerate} onFavorite={handleFavoritePreset} />
              ))}
              {activeTab === "assets" && filteredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} onPreview={handleFavoriteAsset} onFavorite={handleFavoriteAsset} />
              ))}
              {activeTab === "generated" && generated.map((gen) => (
                <PresetCard key={gen.id} preset={{ id: gen.id, name: gen.genre, tags: [], isFavorite: false, model: gen.model }} onGenerate={handleGenerate} onFavorite={handleFavoritePreset} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}

function PresetCard({ preset, onGenerate, onFavorite }: { preset: GenerationPreset; onGenerate: (p: GenerationPreset) => void; onFavorite: (id: string) => void }) {
  return (
    <SAMCard className="p-4 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{preset.name}</h3>
          <p className="text-xs text-muted-foreground">{preset.tags?.slice(0, 2).join(", ")}</p>
        </div>
        <button
          onClick={() => onFavorite(preset.id)}
          className={`p-1 transition-colors ${preset.isFavorite ? "text-yellow-400" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Heart className={`h-4 w-4 ${preset.isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <SAMButton size="sm" className="flex-1" leftIcon={<Play className="h-3 w-3" />} onClick={() => onGenerate(preset)}>
          Generate
        </SAMButton>
        <SAMButton size="sm" variant="ghost">
          <RefreshCw className="h-3 w-3" />
        </SAMButton>
      </div>
    </SAMCard>
  );
}

function AssetCard({ asset, onPreview, onFavorite }: { asset: SoundAsset; onPreview: (id: string) => void; onFavorite: (id: string) => void }) {
  return (
    <SAMCard className="p-4 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{asset.name}</h3>
          <p className="text-xs text-muted-foreground">{asset.category} • {(asset.duration / 60).toFixed(1)}s</p>
        </div>
        <button
          onClick={() => onFavorite(asset.id)}
          className={`p-1 transition-colors ${asset.isFavorite ? "text-yellow-400" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Heart className={`h-4 w-4 ${asset.isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>
      <SAMButton size="sm" className="w-full" leftIcon={<Play className="h-3 w-3" />} onClick={() => onPreview(asset.id)}>
        Preview
      </SAMButton>
    </SAMCard>
  );
}
