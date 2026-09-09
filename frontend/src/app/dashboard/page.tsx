"use client";

import { SAMSidebar, SAMTopbar } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { useProjectStore, useGenerationStore } from "@/stores/data-stores";
import { Bot, Music, Mic, Layers, Play, MoreVertical } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { projects } = useProjectStore();
  const { jobs: generations } = useGenerationStore();

  const recentProjects = [...projects].reverse().slice(0, 4);
  const recentGenerations = [...generations].reverse().slice(0, 4);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-8 lg:p-12">
          
          {/* Hero Creation Area */}
          <div className="mb-12 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h2 className="text-3xl font-semibold mb-6 tracking-tight text-foreground">What are we creating today?</h2>
              
              <div className="relative group rounded-xl p-[1px] bg-gradient-to-br from-border to-transparent hover:from-primary/50 hover:to-primary/10 transition-all duration-500 shadow-sm hover:shadow-md">
                <div className="bg-surface rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden h-full w-full">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <textarea 
                    className="w-full bg-transparent resize-none outline-none text-lg text-foreground placeholder:text-muted-foreground/50 min-h-[100px] leading-relaxed"
                    placeholder="Describe the music you want to create... (e.g. 'Emotional Sri Lankan Tamil cinematic melody...')"
                  />
                  
                  <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-2">
                    <div className="flex items-center gap-1">
                      <SAMButton variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 rounded-md px-3 text-xs">
                        <Mic className="w-3.5 h-3.5 mr-2" /> Add Voice
                      </SAMButton>
                      <SAMButton variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 rounded-md px-3 text-xs">
                        <Music className="w-3.5 h-3.5 mr-2" /> Reference
                      </SAMButton>
                      <SAMButton variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 rounded-md px-3 text-xs">
                        <Layers className="w-3.5 h-3.5 mr-2" /> MIDI
                      </SAMButton>
                    </div>
                    
                    <SAMButton variant="primary" size="md" className="px-6 h-9 shadow-sm shadow-primary/25 rounded-md font-medium text-sm transition-all hover:scale-[1.02]">
                      Generate
                    </SAMButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Create Tiles */}
          <div className="mb-14">
            <h3 className="text-xs font-semibold text-muted-foreground/70 mb-4 uppercase tracking-widest">Quick Create</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Song", desc: "Full track generation", icon: <Music className="w-4 h-4" /> },
                { title: "Vocal", desc: "Singing & rap voices", icon: <Mic className="w-4 h-4" /> },
                { title: "Stem Split", desc: "Isolate tracks", icon: <Layers className="w-4 h-4" /> },
                { title: "Film Score", desc: "Cinematic cues", icon: <Play className="w-4 h-4" /> },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 + (i * 0.05) }}>
                  <div className="group cursor-pointer bg-surface/80 hover:bg-surface-elevated border border-border/50 hover:border-border rounded-lg p-4 transition-all duration-300">
                    <div className="w-9 h-9 rounded-md bg-surface-panel flex items-center justify-center text-muted-foreground group-hover:text-primary mb-3 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <h4 className="text-sm font-medium text-foreground mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dense Project & Generation Library */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            
            {/* Recent Projects */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground/70 uppercase tracking-widest">Recent Projects</h2>
                <Link href="/projects" className="text-xs text-primary hover:underline font-medium">View all</Link>
              </div>
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`} className="block group">
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface border border-transparent hover:border-border/50 transition-all duration-200">
                      <div className="w-12 h-12 rounded bg-surface-panel border border-border flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        <Music className="h-4 w-4 text-muted-foreground group-hover:opacity-0 transition-opacity" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-4 w-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {project.tracks.length} tracks • 120 BPM • C Minor
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-6 opacity-30">
                          {/* Abstract Waveform Placeholder */}
                          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-muted-foreground">
                            <rect x="0" y="40" width="4" height="20" rx="2" />
                            <rect x="10" y="20" width="4" height="60" rx="2" />
                            <rect x="20" y="10" width="4" height="80" rx="2" />
                            <rect x="30" y="30" width="4" height="40" rx="2" />
                            <rect x="40" y="25" width="4" height="50" rx="2" />
                            <rect x="50" y="45" width="4" height="10" rx="2" />
                            <rect x="60" y="15" width="4" height="70" rx="2" />
                            <rect x="70" y="35" width="4" height="30" rx="2" />
                            <rect x="80" y="25" width="4" height="50" rx="2" />
                            <rect x="90" y="40" width="4" height="20" rx="2" />
                          </svg>
                        </div>
                        <SAMButton variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </SAMButton>
                      </div>
                    </div>
                  </Link>
                ))}
                {recentProjects.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-border rounded-lg bg-surface/30">
                    <Music className="h-6 w-6 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No recent projects. Start composing.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Generations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground/70 uppercase tracking-widest">Recent Generations</h2>
                <Link href="/library" className="text-xs text-primary hover:underline font-medium">View all</Link>
              </div>
              <div className="space-y-2">
                {recentGenerations.map((gen) => (
                  <div key={gen.id} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-surface border border-transparent hover:border-border/50 transition-all duration-200">
                    <div className="w-12 h-12 rounded bg-surface-panel border border-border flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-foreground truncate">{gen.prompt || "Untitled Composition"}</h3>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-2">
                        <span>{new Date(gen.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>SAM Audio V1</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <SAMStatusBadge status={gen.status === "completed" ? "completed" : gen.status === "queued" || gen.status === "generating" || gen.status === "rendering" || gen.status === "analyzing" ? "processing" : gen.status === "failed" ? "error" : "idle"} size="sm" className="hidden sm:inline-flex">
                        {gen.status}
                      </SAMStatusBadge>
                      <SAMButton variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </SAMButton>
                    </div>
                  </div>
                ))}
                {recentGenerations.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-border rounded-lg bg-surface/30">
                    <Bot className="h-6 w-6 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No recent generations.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Compact Stats Footer */}
          <div className="border-t border-border pt-6 mt-12 flex flex-wrap gap-8 text-xs font-mono text-muted-foreground">
            <div><span className="text-foreground font-medium">{projects.length}</span> PROJECTS</div>
            <div><span className="text-foreground font-medium">{generations.length}</span> GENERATIONS</div>
            <div><span className="text-foreground font-medium">842</span> CREDITS</div>
            <div><span className="text-foreground font-medium">42 GB</span> STORAGE</div>
          </div>

        </div>
      </div>
    </div>
  );
}
