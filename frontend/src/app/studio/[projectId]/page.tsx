"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard } from "@/components/sam/sam-card";

export default function StudioProjectPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-2xl font-bold">Project: {params.projectId}</h1>
          <p className="text-sm text-muted-foreground mt-1">Loading project...</p>
        </div>
        <SAMBottomNav />
      </div>
    </div>
  );
}
