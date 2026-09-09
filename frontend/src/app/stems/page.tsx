"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard, SAMPanel } from "@/components/sam/sam-card";
import { SAMSlider } from "@/components/sam/sam-slider";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { stemService, StemSeparationJob, Stem } from "@/services/stem-service";
import { Upload, Music, Headphones, Layers, Download, Play, Pause, Volume2, Settings, FileAudio } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StemsPage() {
  const [jobs, setJobs] = useState<StemSeparationJob[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedStems, setSelectedStems] = useState<Stem[]>([]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const job = await stemService.createSeparationJob(files[0]);
      setJobs([job, ...jobs]);
    }
  }, [jobs]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const job = await stemService.createSeparationJob(files[0]);
      setJobs([job, ...jobs]);
    }
  };

   const handleSeparateAll = async () => {
    const newJobs = await stemService.separateAll(jobs.filter(j => j.status === "queued" || j.status === "generating" || j.status === "rendering"));
    setJobs([...newJobs, ...jobs]);
   };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Stem Separator</h1>
              <p className="text-sm text-muted-foreground mt-1">Separate your audio into individual instrument stems using AI</p>
            </div>
            <SAMButton leftIcon={<Settings className="h-4 w-4" />} variant="ghost" size="sm">
              Separation Settings
            </SAMButton>
          </div>

          {/* Upload area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-all ${
              isDragging
                ? "border-accent bg-accent/5 scale-[1.02]"
                : "border-border hover:border-accent/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <FileAudio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop audio file to separate</h3>
            <p className="text-sm text-muted-foreground mb-4">Supports MP3, WAV, FLAC, M4A (max 200MB)</p>
            <label className="inline-block">
              <SAMButton leftIcon={<Upload className="h-4 w-4" />} asChild>
                <input type="file" accept="audio/*" onChange={handleFileSelect} className="hidden" />
              </SAMButton>
            </label>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> 2-5 stems</span>
              <span className="flex items-center gap-1"><Headphones className="h-3 w-3" /> ~10s separation</span>
              <span className="flex items-center gap-1"><Music className="h-3 w-3" /> AI-powered</span>
            </div>
          </div>

          {/* Stems preview */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Your Stems</h2>
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <StemPreview name="Vocals" color="hsl(0 90% 60%)" icon={<Headphones className="h-5 w-5" />} />
                <StemPreview name="Drums" color="hsl(210 90% 60%)" icon={<Music className="h-5 w-5" />} />
                <StemPreview name="Bass" color="hsl(270 80% 60%)" icon={<Volume2 className="h-5 w-5" />} />
                <StemPreview name="Other" color="hsl(30 80% 60%)" icon={<Layers className="h-5 w-5" />} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Jobs list */}
          {jobs.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Separation Jobs</h2>
                <SAMButton size="sm" variant="ghost" onClick={handleSeparateAll}>
                  Separate All New
                </SAMButton>
              </div>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <JobItem key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <Layers className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Upload an audio file to start separating stems.</p>
            </div>
          )}
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}

function StemPreview({ name, color, icon }: { name: string; color: string; icon: React.ReactNode }) {
  return (
    <SAMCard className="p-4 text-center group">
      <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: color + "20", color }}>
        {icon}
      </div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-xs text-muted-foreground">256 kbps</p>
      <div className="mt-3 flex items-center gap-2">
        <SAMButton size="icon-sm" variant="ghost">
          <Play className="h-3 w-3" />
        </SAMButton>
        <SAMButton size="icon-sm" variant="ghost">
          <Download className="h-3 w-3" />
        </SAMButton>
      </div>
    </SAMCard>
  );
}

function JobItem({ job }: { job: StemSeparationJob }) {
  const progress = job.progress || 0;
  const statusColor = job.status === "completed" ? "success" : job.status === "generating" || job.status === "rendering" || job.status === "analyzing" ? "active" : job.status === "failed" ? "error" : "draft";

  return (
    <SAMCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <FileAudio className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">{job.inputFile?.name || `Job ${job.id.substring(0, 8)}`}</h3>
            <p className="text-xs text-muted-foreground">{job.stems?.length || 0} stems • {job.model}</p>
          </div>
        </div>
        <SAMStatusBadge status={statusColor}>{job.status}</SAMStatusBadge>
      </div>

      {(job.status === "generating" || job.status === "rendering" || job.status === "analyzing") && (
        <div className="mb-3">
          <SAMSlider value={progress} max={100} className="w-full" showValue={false} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{Math.round(progress)}% complete</span>
            <span>~{Math.round((100 - progress) / 20)}s remaining</span>
          </div>
        </div>
      )}

      {job.status === "completed" && job.stems && (        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {job.stems.map((stem) => (
            <div key={stem.id} className="flex items-center gap-2">
              <SAMButton size="icon-xs" variant="ghost">
                <Play className="h-3 w-3" />
              </SAMButton>
              <span className="text-sm truncate">{stem.name}</span>
              <SAMButton size="icon-xs" variant="ghost" className="ml-auto">
                <Download className="h-3 w-3" />
              </SAMButton>
            </div>
          ))}
        </div>
      )}
    </SAMCard>
  );
}
