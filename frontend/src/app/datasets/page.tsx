"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard, SAMPanel } from "@/components/sam/sam-card";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { Database, Upload, Download, FileAudio, FileText, BarChart3, Tag, Search, Filter, Clock, Users, Globe, Lock, CheckCircle, AlertCircle, Music } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DatasetsPage() {
  const [datasets] = useState<Dataset[]>([
    { id: "1", name: "Classical Orchestra", description: "Professional orchestra recordings", size: "2.4 GB", samples: 12500, type: "audio", status: "ready", visibility: "public" },
    { id: "2", name: "Jazz Ensemble", description: "Live jazz session recordings", size: "1.8 GB", samples: 8900, type: "audio", status: "ready", visibility: "public" },
    { id: "3", name: "Electronic Drums", description: "Synthetic drum samples", size: "500 MB", samples: 5400, type: "midi", status: "indexing", visibility: "private" },
    { id: "4", name: "World Percussion", description: "Global percussion samples", size: "3.2 GB", samples: 18700, type: "audio", status: "ready", visibility: "public" },
    { id: "5", name: "Vocal Harmony", description: "Multi-language vocal samples", size: "4.1 GB", samples: 22000, type: "audio", status: "ready", visibility: "public" },
    { id: "6", name: "Acoustic Guitar", description: "Fingerpicked and strummed guitar", size: "1.2 GB", samples: 6800, type: "audio", status: "processing", visibility: "private" },
  ]);
  const [activeTab, setActiveTab] = useState<"audio" | "midi" | "text">("audio");

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Datasets</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage training datasets for AI voice and music models</p>
            </div>
            <SAMButton leftIcon={<Upload className="h-4 w-4" />} asChild>
              <label className="cursor-pointer">
                <input type="file" multiple className="hidden" />
                Upload Dataset
              </label>
            </SAMButton>
          </div>

          <div className="flex gap-2 mb-6 sam-mono">
            <SAMButton size="sm" variant={activeTab === "audio" ? "primary" : "ghost"} onClick={() => setActiveTab("audio")}>Audio</SAMButton>
            <SAMButton size="sm" variant={activeTab === "midi" ? "primary" : "ghost"} onClick={() => setActiveTab("midi")}>MIDI</SAMButton>
            <SAMButton size="sm" variant={activeTab === "text" ? "primary" : "ghost"} onClick={() => setActiveTab("text")}>Text</SAMButton>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search datasets..." className="w-full pl-10 pr-4 py-2 text-sm bg-surface-panel border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent sam-mono" />
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {datasets.filter(d => activeTab === "audio" && d.type === "audio" || activeTab === "midi" && d.type === "midi" || activeTab === "text" && d.type === "text").map((ds) => (
              <motion.div key={ds.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <DatasetCard dataset={ds} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}

interface Dataset {
  id: string;
  name: string;
  description: string;
  size: string;
  samples: number;
  type: "audio" | "midi" | "text";
  status: "ready" | "processing" | "indexing";
  visibility: "public" | "private";
}

function DatasetCard({ dataset }: { dataset: Dataset }) {
  const statusMap: Record<Dataset["status"], { color: "success" | "active" | "draft"; icon: React.ReactNode }> = {
    ready: { color: "success", icon: <CheckCircle className="h-4 w-4" /> },
    processing: { color: "active", icon: <Clock className="h-4 w-4" /> },
    indexing: { color: "draft", icon: <Clock className="h-4 w-4" /> },
  };

  return (
    <SAMCard className="p-4 sam-mono">
      <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dataset.type === "audio" ? "bg-blue-500/10 text-blue-500" : dataset.type === "midi" ? "bg-purple-500/10 text-purple-500" : "bg-green-500/10 text-green-500"}`}>
            {dataset.type === "audio" ? <FileAudio className="h-5 w-5" /> : dataset.type === "midi" ? <Music className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="font-semibold">{dataset.name}</h3>
            <p className="text-xs text-muted-foreground">{dataset.description}</p>
          </div>
        </div>
        <SAMStatusBadge status={statusMap[dataset.status].color}>{dataset.status}</SAMStatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs sam-mono mb-3">
        <div className="flex justify-between"><span className="text-muted-foreground">Size:</span><span>{dataset.size}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Samples:</span><span>{dataset.samples.toLocaleString()}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Type:</span><span>{dataset.type}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Visibility:</span><span className="flex items-center gap-1">{dataset.visibility === "public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}{dataset.visibility}</span></div>
      </div>

      <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
        <div className="h-full bg-accent rounded-full" style={{ width: dataset.status === "ready" ? "100%" : dataset.status === "processing" ? "65%" : "30%" }} />
      </div>

      <div className="flex gap-2">
        <SAMButton size="sm" variant="ghost" className="flex-1" leftIcon={<Download className="h-3 w-3" />}>Export</SAMButton>
        <SAMButton size="sm" variant="ghost" className="flex-1" leftIcon={<BarChart3 className="h-3 w-3" />}>Stats</SAMButton>
        <SAMButton size="sm" variant="ghost" className="flex-1" leftIcon={<Filter className="h-3 w-3" />}>Filter</SAMButton>
      </div>
    </SAMCard>
  );
}
