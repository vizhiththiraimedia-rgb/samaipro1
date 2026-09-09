"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";
import { SAMSlider } from "@/components/sam/sam-slider";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { Play, Pause, Square, Download, Upload, Settings, Brain, Database, BarChart3, Activity, Layers, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<"labs" | "active" | "completed">("labs");

  const labs = [
    { id: "1", name: "Voice Fine-tuning Lab", description: "Fine-tune AI voice models with custom datasets", icon: <Brain className="h-5 w-5" />, color: "purple" },
    { id: "2", name: "Music Generation Lab", description: "Train custom music generation models", icon: <Layers className="h-5 w-5" />, color: "blue" },
    { id: "3", name: "Stem Separation Lab", description: "Custom stem separation model training", icon: <Layers className="h-5 w-5" />, color: "green" },
    { id: "4", name: "Text-to-Speech Alignment Lab", description: "Phoneme-level TTS alignment", icon: <FileText className="h-5 w-5" />, color: "orange" },
  ];

  const activeJobs = [
    { id: "1", name: "Vocal Clone: Sarah", stage: "Epoch 42/100", progress: 42, eta: "2:30h", status: "training" },
    { id: "2", name: "Jazz Piano Model", stage: "Validation", progress: 85, eta: "0:15m", status: "validating" },
  ];

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Training Labs</h1>
              <p className="text-sm text-muted-foreground mt-1">Train custom AI models for voice, music, and audio generation</p>
            </div>
            <SAMButton leftIcon={<Upload className="h-4 w-4" />}>New Training Job</SAMButton>
          </div>

          <div className="flex gap-2 mb-6 sam-mono">
            <SAMButton size="sm" variant={activeTab === "labs" ? "primary" : "ghost"} onClick={() => setActiveTab("labs")}>
              <Brain className="h-4 w-4" /> Labs
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "active" ? "primary" : "ghost"} onClick={() => setActiveTab("active")}>
              <Activity className="h-4 w-4" /> Active Jobs
            </SAMButton>
            <SAMButton size="sm" variant={activeTab === "completed" ? "primary" : "ghost"} onClick={() => setActiveTab("completed")}>
              <CheckCircle className="h-4 w-4" /> Completed
            </SAMButton>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === "labs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sam-mono">
                  {labs.map((lab) => (
                    <motion.div key={lab.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: parseInt(lab.id) * 0.05 }}>
                      <SAMCard className="p-4 text-center h-full flex flex-col">
                        <div className={`w-14 h-14 mx-auto rounded-xl bg-${lab.color}-500/10 flex items-center justify-center mb-3`}>
                          {lab.icon}
                        </div>
                        <h3 className="font-semibold mb-1">{lab.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3 flex-1">{lab.description}</p>
                        <SAMButton className="w-full" leftIcon={<Play className="h-4 w-4" />} size="sm">Open Lab</SAMButton>
                      </SAMCard>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "active" && (
                <div className="space-y-4 sam-mono">
                  <p className="text-sm text-muted-foreground">{activeJobs.length} active training job{activeJobs.length !== 1 ? "s" : ""}</p>
                  {activeJobs.map((job) => (
                    <div key={job.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{job.name}</h3>
                        <SAMStatusBadge status={job.status === "training" ? "active" : "draft"}>
                          {job.status}
                        </SAMStatusBadge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-2 bg-border rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-accent rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${job.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                        <span className="text-sm sam-mono">{job.progress}%</span>
                        <span className="text-sm text-muted-foreground">{job.eta}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{job.stage}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "completed" && (
                <div className="text-center py-12 sam-mono">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No completed training jobs</p>
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
