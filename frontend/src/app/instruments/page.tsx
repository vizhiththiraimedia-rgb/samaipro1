"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";
import { SAMSlider } from "@/components/sam/sam-slider";
import { Music, Save, Download, Share2, Play, Pause, Volume2, Settings, Guitar, Piano, Drum, Wind, Smartphone } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function InstrumentsPage() {
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const instruments: Instrument[] = [
    { id: "1", name: "Grand Piano", category: "keys", type: "virtual", manufacturer: "Yamaha", model: "Cfx", price: 0, isFavorite: true, icon: <Piano className="h-5 w-5" /> },
    { id: "2", name: "Jazz Guitar", category: "strings", type: "sampled", manufacturer: "Fender", model: "Stratocaster", price: 0, isFavorite: false, icon: <Guitar className="h-5 w-5" /> },
    { id: "3", name: "Analog Drums", category: "drums", type: "synthesized", manufacturer: "Roland", model: "TR-808", price: 0, isFavorite: true, icon: <Drum className="h-5 w-5" /> },
    { id: "4", name: "String Ensemble", category: "orchestra", type: "sampled", manufacturer: "Vienna Symphonic", model: "VSE", price: 0, isFavorite: false, icon: <Music className="h-5 w-5" /> },
    { id: "5", name: "Synth Brass", category: "synth", type: "synthesized", manufacturer: "Moog", model: "One", price: 0, isFavorite: false, icon: <Wind className="h-5 w-5" /> },
    { id: "6", name: "Vocal Choir", category: "vocals", type: "ai", manufacturer: "SAM AI", model: "VoxSynth", price: 0, isFavorite: true, icon: <Music className="h-5 w-5" /> },
  ];

  const categories = [
    { id: "all", name: "All", icon: <Music className="h-4 w-4" /> },
    { id: "keys", name: "Keys", icon: <Piano className="h-4 w-4" /> },
    { id: "strings", name: "Strings", icon: <Guitar className="h-4 w-4" /> },
    { id: "drums", name: "Drums", icon: <Drum className="h-4 w-4" /> },
    { id: "orchestra", name: "Orchestra", icon: <Wind className="h-4 w-4" /> },
    { id: "synth", name: "Synths", icon: <Settings className="h-4 w-4" /> },
    { id: "vocals", name: "Vocals", icon: <Music className="h-4 w-4" /> },
    { id: "mobile", name: "Mobile", icon: <Smartphone className="h-4 w-4" /> },
  ];

  const filtered = selectedCategory === "all" ? instruments : instruments.filter(i => i.category === selectedCategory);

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Virtual Instruments</h1>
              <p className="text-sm text-muted-foreground mt-1">Browse and configure virtual instruments for your projects</p>
            </div>
            <SAMButton leftIcon={<Save className="h-4 w-4" />}>Save Preset</SAMButton>
          </div>

          <div className="flex gap-2 mb-6 sam-mono overflow-x-auto sam-scrollbar-hide">
            {categories.map(cat => (
              <SAMButton key={cat.id} size="sm" variant={selectedCategory === cat.id ? "primary" : "ghost"} onClick={() => setSelectedCategory(cat.id)}>
                {cat.icon} {cat.name}
              </SAMButton>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sam-mono">
            {filtered.map((inst, i) => (
              <motion.div key={inst.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <InstrumentCard instrument={inst} isSelected={selectedInstrument?.id === inst.id} onSelect={setSelectedInstrument} />
              </motion.div>
            ))}
          </div>
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}

interface Instrument {
  id: string;
  name: string;
  category: string;
  type: "virtual" | "sampled" | "synthesized" | "ai";
  manufacturer: string;
  model: string;
  price: number;
  isFavorite: boolean;
  icon: React.ReactNode;
}

function InstrumentCard({ instrument, isSelected, onSelect }: { instrument: Instrument; isSelected: boolean; onSelect: (i: Instrument) => void }) {
  return (
    <SAMCard className={`p-4 cursor-pointer transition-all ${isSelected ? "ring-2 ring-accent" : "hover:ring-1 hover:ring-accent/30"}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          {instrument.icon}
        </div>
        <div>
          <h3 className="font-semibold">{instrument.name}</h3>
          <p className="text-xs text-muted-foreground">{instrument.manufacturer} {instrument.model}</p>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mb-3 sam-mono">
        Type: {instrument.type} • $0
      </div>
      <div className="flex gap-2">
        <SAMButton size="sm" variant="ghost" className="flex-1">Audition</SAMButton>
        <SAMButton size="sm" variant="primary" className="flex-1" onClick={(e) => { e.stopPropagation(); }}>Load</SAMButton>
      </div>
    </SAMCard>
  );
}
