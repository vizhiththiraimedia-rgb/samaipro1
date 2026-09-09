"use client";

import Link from "next/link";
import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";
import { SAMStatusBadge } from "@/components/sam/sam-badges";
import { useProjectStore } from "@/stores/data-stores";
import { Project } from "@/types/music";
import { Plus, FolderOpen, Play, Pause, MoreVertical, Clock, Users, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const { projects, addProject: createProject, setCurrentProject: selectProject, deleteProject, duplicateProject, updateProject: updateProjectStatus } = useProjectStore();

  const handleCreate = () => {
    createProject({
      id: crypto.randomUUID(),
      title: `Project ${projects.length + 1}`,
      description: "A new SAM AI project",
      bpm: 120,
      key: "C",
      scale: "major",
      timeSignature: { numerator: 4, denominator: 4 },
      duration: 0,
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
      version: 1,
      versions: [],
      tags: [],
      modelUsed: "sam-ai-orchestra-v2",
    });
  };

const router = useRouter();

  const openInStudio = (project: Project) => {
    selectProject(project);
    router.push("/studio");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Projects</h1>
              <p className="text-sm text-muted-foreground mt-1">Your AI music creation workspace</p>
            </div>
            <SAMButton leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
              New Project
            </SAMButton>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Link href={`/projects/${project.id}`} className="block group">
                  <SAMCard className="p-4 transition-all group-hover:shadow-md">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
                      </div>
                      <SAMStatusBadge status={project.status === "draft" ? "draft" : project.status === "mixing" ? "processing" : "completed"} size="sm">
                        {project.status}
                      </SAMStatusBadge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.tags.length} tags
                      </div>
                      <div className="w-1 h-1 bg-border rounded-full" />
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {project.tracks.length} tracks
                      </div>
                      <div className="w-1 h-1 bg-border rounded-full" />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <SAMButton size="sm" variant="ghost" leftIcon={<Play className="h-3 w-3" />}>
                        Continue
                      </SAMButton>
                      <SAMButton size="sm" variant="ghost" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openInStudio(project); }} leftIcon={<ExternalLink className="h-3 w-3" />}>
                        Studio
                      </SAMButton>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteProject(project.id); }}
                        className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                  </SAMCard>
                </Link>
              </motion.div>
            ))}

            {projects.length === 0 && (
              <div className="col-span-full text-center py-12">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No projects yet. Create your first project to get started.</p>
                <SAMButton leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate} className="mt-4">
                  Create Project
                </SAMButton>
              </div>
            )}
          </motion.div>
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}
