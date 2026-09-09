"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Download, Maximize2 } from "lucide-react";
import { useGenerationStore } from "@/stores/data-stores";
import { SAMButton } from "./sam-button";
import { SAMWaveform } from "./sam-waveform";

const SAMMiniPlayer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({}, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState({
    title: "Cinematic Dawn",
    artist: "SAM AI Orchestrator",
    artwork: "/images/project-cinematic.jpg",
    duration: 240,
    bpm: 128,
    key: "C",
  });

  return (
    <div
      ref={ref}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "border-t border-border bg-surface-panel/95 backdrop-blur-sm",
        "sam-transition-all duration-300",
        isExpanded ? "h-32" : "h-16",
      )}
    >
      <div className="h-full flex items-center px-4 sam-mono">
        {/* Left: Track info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-purple-500/50 flex items-center justify-center flex-shrink-0 text-xs font-bold">
            {currentTrack.title.slice(0, 2)}
          </div>
          <div>
            <div className="font-medium text-sm">{currentTrack.title}</div>
            <div className="text-xs text-muted-foreground">{currentTrack.artist}</div>
          </div>
          <SAMButton size="icon-xs" variant="ghost">
            <Heart className="h-3 w-3" />
          </SAMButton>
        </div>

        {/* Center: Waveform + Playback */}
        <div className="flex-1 mx-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SAMButton size="icon-xs" variant="ghost">
              <SkipBack className="h-4 w-4" />
            </SAMButton>
            <SAMButton
              size="icon"
              variant={isPlaying ? "ghost" : "primary"}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </SAMButton>
            <SAMButton size="icon-xs" variant="ghost">
              <SkipForward className="h-4 w-4" />
            </SAMButton>
          </div>

          {!isExpanded && (
            <div className="hidden sm:block flex-1 max-w-md">
              <div className="flex items-center gap-2 sam-mono text-xs text-muted-foreground">
                <span>0:00</span>
                <div className="flex-1 h-1 bg-muted rounded-full relative">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(isPlaying ? 35 : 0) * 100 / currentTrack.duration}%`, }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-primary rounded-sm"
                    style={{ left: `${(isPlaying ? 35 : 0) * 100 / currentTrack.duration}%` }}
                  />
                </div>
                <span>{formatDuration(currentTrack.duration)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Volume + Expand */}
        <div className="flex items-center gap-3 flex-shrink-0 sam-mono">
          <div className="hidden sm:flex items-center gap-2">
            <SAMButton size="icon-xs" variant="ghost" onClick={() => setVolume(volume > 0 ? 0 : 0.7)}>
              {volume > 0 ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            </SAMButton>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 h-1"
            />
            <span className="text-xs sam-mono">{Math.round(volume * 100)}%</span>
          </div>
          <div className="text-xs sam-mono text-muted-foreground">
            {currentTrack.key} · {currentTrack.bpm} BPM
          </div>
          <SAMButton size="icon-xs" variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
            <Maximize2 className="h-3 w-3" />
          </SAMButton>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-3 border-t border-border">
          <SAMWaveform
            waveform={Array.from({ length: 128 }, () => 0.3 + Math.random() * 0.5)}
            duration={currentTrack.duration}
            isPlaying={isPlaying}
            playhead={0}
            bpm={currentTrack.bpm}
            musicalKey={currentTrack.key}
            height={32}
          />
        </div>
      )}
    </div>
  );
});

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

SAMMiniPlayer.displayName = "SAMMiniPlayer";

export { SAMMiniPlayer };
