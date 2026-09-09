"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, Square, SkipForward, SkipBack } from "lucide-react";

interface SamWaveformProps {
  waveform: number[];
  duration: number;
  isPlaying?: boolean;
  playhead?: number;
  bpm?: number;
  musicalKey?: string;
  color?: string;
  height?: number;
  interactive?: boolean;
  showMarkers?: boolean;
  loopRegion?: { start: number; end: number };
  onPlayheadChange?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  className?: string;
}

const SAMWaveform = React.forwardRef<HTMLDivElement, SamWaveformProps>(
  ({
    waveform,
    duration,
    isPlaying = false,
    playhead = 0,
    bpm = 120,
    musicalKey = "C",
    color,
    height = 60,
    interactive = true,
    showMarkers = true,
    loopRegion,
    onPlayheadChange,
    onPlay,
    onPause,
    onStop,
    onMouseDown,
    className,
  }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const [hoverTime, setHoverTime] = useState(0);
    const [isLooping, setIsLooping] = useState(false);

    const accentColor = color || "hsl(var(--sam-accent))";

    const drawWaveform = useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      const data = waveform.length > 0 ? waveform : [0.5];
      const barWidth = width / data.length;
      const centerY = height / 2;

      data.forEach((amp, i) => {
        const barHeight = amp * centerY;
        const x = i * barWidth;
        ctx.fillStyle = amp > 0.5 ? accentColor : `hsl(220 30% ${30 + amp * 20}%)`;
        ctx.fillRect(x, centerY - barHeight, Math.max(1, barWidth - 0.5), barHeight * 2);
      });

      if (showMarkers && isPlaying && playhead > 0) {
        const playheadX = (playhead / duration) * width;
        ctx.fillStyle = "hsl(0 90% 60%)";
        ctx.fillRect(playheadX, 0, 1, height);
        ctx.fillStyle = "hsl(0 90% 60%)";
        ctx.beginPath();
        ctx.moveTo(playheadX, 2);
        ctx.lineTo(playheadX + 6, centerY);
        ctx.lineTo(playheadX, height - 2);
        ctx.closePath();
        ctx.fill();
      }

      if (loopRegion && isLooping) {
        const startX = (loopRegion.start / duration) * width;
        const endX = (loopRegion.end / duration) * width;
        ctx.fillStyle = "hsl(245 80% 55% / 0.15)";
        ctx.fillRect(startX, 0, endX - startX, height);
        ctx.strokeStyle = "hsl(245 80% 55% / 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(startX, 2);
        ctx.lineTo(startX, height - 2);
        ctx.moveTo(endX, 2);
        ctx.lineTo(endX, height - 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }, [waveform, height, duration, playhead, isPlaying, showMarkers, accentColor, loopRegion, isLooping]);

    useEffect(() => {
      drawWaveform();
    }, [drawWaveform]);

    useEffect(() => {
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(() => {
          requestAnimationFrame(() => drawWaveform());
        });
      }
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }, [isPlaying, drawWaveform]);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        if (!interactive || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const time = (x / rect.width) * duration;
        onPlayheadChange?.(time);
      },
      [interactive, duration, onPlayheadChange]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!interactive || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const time = (x / rect.width) * duration;
        setHoverTime(time);
      },
      [interactive, duration]
    );

    return (
      <div ref={containerRef} className={cn("relative w-full select-none group", className)} onMouseDown={onMouseDown}>
        <div className="relative flex items-center h-full">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" onClick={handleClick} onMouseMove={handleMouseMove} />
          {hoverTime > 0 && interactive && (
            <div
              className="absolute bottom-1 px-2 py-0.5 text-xs font-mono rounded bg-black/60 text-white pointer-events-none"
              style={{ left: `${(hoverTime / duration) * 100}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {interactive && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1">
              <button onClick={isPlaying ? onPause : onPlay} className="p-1 rounded hover:bg-muted transition-colors">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={onStop} className="p-1 rounded hover:bg-muted transition-colors">
                <Square className="h-4 w-4" />
              </button>
              <button onClick={() => setIsLooping(!isLooping)} className={cn("p-1 rounded transition-colors", isLooping ? "bg-primary/20 text-primary" : "hover:bg-muted")}>
                <SkipBack className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              {musicalKey} · {bpm} BPM
            </div>
          </div>
        )}
      </div>
    );
  }
);

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

SAMWaveform.displayName = "SAMWaveform";

export { SAMWaveform };
