"use client";
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Play, Pause, Download, Heart, MoreVertical,
  Scissors, Maximize2, RefreshCw, Volume2, Clock, Code,
} from "lucide-react";
import type { GenerationResult } from "@/types/music";
import { SAMButton } from "./sam-button";
import { SAMWaveform } from "./sam-waveform";
import { SAMBadge, SAMModelBadge } from "./sam-badges";

interface SamGenerationCardProps {
  result: GenerationResult;
  onOpenStudio?: (result: GenerationResult) => void;
  onRemix?: (result: GenerationResult) => void;
  onExtend?: (result: GenerationResult) => void;
  onSeparateStems?: (result: GenerationResult) => void;
  onDownload?: (result: GenerationResult) => void;
  onFavorite?: (result: GenerationResult) => void;
  onAddToProject?: (result: GenerationResult) => void;
  className?: string;
}

const SAMGenerationCard = React.forwardRef<HTMLDivElement, SamGenerationCardProps>(
  ({ result, onOpenStudio, onRemix, onExtend, onSeparateStems, onDownload, onFavorite, onAddToProject, className }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleFavorite = () => {
      setIsFavorite(!isFavorite);
      onFavorite?.(result);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "group sam-card transition-all duration-200",
          "border border-border hover:border-accent/40",
          isHovered && "shadow-lg shadow-black/20",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative p-4 border-b border-border">
          <SAMWaveform
            waveform={result.waveform}
            duration={result.duration}
            isPlaying={isPlaying}
            playhead={isPlaying ? result.duration * 0.3 : 0}
            bpm={result.bpm}
            musicalKey={result.key}
            height={40}
            interactive={true}
          />
          <div className="absolute top-4 right-4 flex gap-1">
            <SAMButton size="icon-sm" variant={isFavorite ? "primary" : "ghost"} onClick={handleFavorite}>
              <Heart className={cn("h-3.5 w-3.5", isFavorite && "fill-current")} />
            </SAMButton>
            <SAMButton size="icon-sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </SAMButton>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-base">{result.genre} · {result.language}</h3>
              <SAMModelBadge modelType="music">{result.model}</SAMModelBadge>
            </div>
            <SAMButton size="icon-xs" variant="ghost" onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical className="h-3 w-3" />
            </SAMButton>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground sam-mono">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(result.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              <span>{result.bpm} BPM</span>
            </div>
            <span>{result.key} {result.scale === "minor" ? "m" : ""}</span>
          </div>

          <div className="flex items-center gap-2">
            <SAMBadge variant="outline">{result.metadata.mood}</SAMBadge>
            <SAMBadge variant="default">Energy: {Math.round(result.metadata.energy * 100)}%</SAMBadge>
          </div>

          <div className="text-xs text-muted-foreground">
            {new Date(result.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <SAMButton size="sm" variant="primary" onClick={() => onOpenStudio?.(result)}>
              <Maximize2 className="h-3.5 w-3.5 mr-1" /> Open Studio
            </SAMButton>
            <SAMButton size="sm" variant="secondary" onClick={() => onRemix?.(result)}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Remix
            </SAMButton>
            <SAMButton size="sm" variant="secondary" onClick={() => onExtend?.(result)}>
              Extend
            </SAMButton>
            <SAMButton size="sm" variant="ghost" onClick={() => onSeparateStems?.(result)}>
              <Scissors className="h-3.5 w-3.5 mr-1" /> Stems
            </SAMButton>
            <SAMButton size="sm" variant="ghost" onClick={() => onAddToProject?.(result)}>
              <Code className="h-3.5 w-3.5 mr-1" /> Add to Project
            </SAMButton>
            <SAMButton size="sm" variant="ghost" onClick={() => onDownload?.(result)}>
              <Download className="h-3.5 w-3.5 mr-1" /> Download
            </SAMButton>
          </div>
        </div>
      </div>
    );
  }
);

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

SAMGenerationCard.displayName = "SAMGenerationCard";

export { SAMGenerationCard };
