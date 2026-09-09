"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { Bot, Cpu, BarChart3, Database, Activity, Layers, Wifi, ThermometerSun, Gauge, Play, Pause, Settings, Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ModelsPage() {
  const [models] = useState<Model[]>([
    { id: "1", name: "sam-ai-model-v2", provider: "sam-ai", type: "text-to-music", status: "online", latency: 450, accuracy: 94, tokens: 4000, cost: 0.002, lastUsed: "2 hours ago" },
    { id: "2", name: "vocal-clone-pro", provider: "sam-ai", type: "voice-cloning", status: "online", latency: 2200, accuracy: 89, tokens: 2048, cost: 0.015, lastUsed: "5 hours ago" },
    { id: "3", name: "stem-separator-xl", provider: "sam-ai", type: "audio-separation", status: "online", latency: 3200, accuracy: 96, tokens: 8192, cost: 0.008, lastUsed: "1 day ago" },
    { id: "4", name: "midi-composer-v3", provider: "sam-ai", type: "composition", status: "degraded", latency: 1200, accuracy: 87, tokens: 4096, cost: 0.004, lastUsed: "3 hours ago" },
    { id: "5", name: "master-ai-pro", provider: "sam-ai", type: "mastering", status: "offline", latency: 0, accuracy: 0, tokens: 1024, cost: 0.006, lastUsed: "2 days ago" },
    { id: "6", name: "lyric-writer-v1", provider: "sam-ai", type: "text-generation", status: "online", latency: 850, accuracy: 92, tokens: 2048, cost: 0.001, lastUsed: "6 hours ago" },
  ]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const types = ["All", "text-to-music", "voice-cloning", "audio-separation", "composition", "mastering", "text-generation"];
  const filteredModels = selectedType ? models.filter(m => m.type === selectedType) : models;

  const getStatusColor = (status: Model["status"]) => {
    return status === "online" ? "success" : status === "degraded" ? "active" : "error";
  };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">AI Models</h1>
              <p className="text-sm text-muted-foreground mt-1">Monitor and configure AI models powering SAM AI services</p>
            </div>
            <SAMButton leftIcon={<Settings className="h-4 w-4" />} variant="ghost">Model Config</SAMButton>
          </div>

          <div className="flex gap-2 mb-6 sam-mono overflow-x-auto sam-scrollbar-hide">
            {types.map(type => (
              <SAMButton
                key={type}
                size="sm"
                variant={selectedType === (type === "All" ? null : type) ? "primary" : "ghost"}
                onClick={() => setSelectedType(type === "All" ? null : type)}
                className="whitespace-nowrap"
              >
                <Cpu className="h-4 w-4" /> {type.replace(/-/g, " ")}
              </SAMButton>
            ))}
          </div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </motion.div>
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}

interface Model {
  id: string;
  name: string;
  provider: string;
  type: string;
  status: "online" | "degraded" | "offline";
  latency: number;
  accuracy: number;
  tokens: number;
  cost: number;
  lastUsed: string;
}

function ModelCard({ model }: { model: Model }) {
  const statusColors = {
    online: "text-green-400",
    degraded: "text-yellow-400",
    offline: "text-red-400",
  };

  return (
    <SAMCard className="p-4 sam-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center text-background font-bold`}>
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {model.name}
              <span className={`w-2 h-2 rounded-full ${model.status === "online" ? "bg-green-400" : model.status === "degraded" ? "bg-yellow-400" : "bg-red-400"}`}>
                <span className={`sr-only ${statusColors[model.status]}`}></span>
              </span>
            </h3>
            <p className="text-sm text-muted-foreground">{model.provider} • {model.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SAMStatusBadge status={model.status === "online" ? "success" : model.status === "degraded" ? "active" : "error"}>
            {model.status}
          </SAMStatusBadge>
          <SAMButton size="sm" variant="ghost">
            <Settings className="h-4 w-4" />
          </SAMButton>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${statusColors[model.status]}`}>{model.status === "online" || model.status === "degraded" ? `${model.latency}ms` : "—"}</div>
          <div className="text-xs text-muted-foreground">Latency</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{model.accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{model.tokens.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Context</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">${model.cost}/1k</div>
          <div className="text-xs text-muted-foreground">Cost</div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground flex justify-between">
        <span>Last used: {model.lastUsed}</span>
        <div className="flex gap-2">
          <button className="hover:text-foreground transition-colors">
            <Download className="h-3 w-3" />
          </button>
          <button className="hover:text-foreground transition-colors">
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </SAMCard>
  );
}
