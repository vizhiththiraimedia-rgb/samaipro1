"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Play, Pause, Square, SkipBack, SkipForward,
  RotateCcw, RotateCw, Rewind, FastForward,
  Divide, Repeat, Volume2, VolumeX,
  Thermometer, Clock, Settings,
} from "lucide-react";
import { useTransportStore } from "@/stores/studio-store";
import { SAMButton } from "./sam-button";
import { SAMKnob } from "./sam-knob";

const SAMTransport = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const {
      isPlaying, isRecording, isLooping, tempo, key, scale, timeSignature,
      metronome, playhead, loopStart, loopEnd, duration,
      play, pause, stop, setLooping, setTempo, setMetronome, setPlayhead,
    } = useTransportStore();

    const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempo(Number(e.target.value));
    };

    const formatTimecode = (beats: number) => {
      const min = Math.floor(beats / 4 / 4);
      const sec = Math.floor((beats / 4 / 4 - min) * 60);
      const ms = Math.floor(((beats / 4 / 4 - min) * 60 - sec) * 1000);
      return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
        switch (e.key.toLowerCase()) {
          case " ": e.preventDefault(); isPlaying ? pause() : play(); break;
          case "s": e.preventDefault(); stop(); break;
          case "r": e.preventDefault(); isRecording ? stop() : setLooping(isLooping); break;
          case "m": e.preventDefault(); setMetronome(!metronome); break;
          case "j": e.preventDefault(); setPlayhead(Math.max(0, playhead - 1)); break;
          case "l": e.preventDefault(); setPlayhead(Math.min(duration, playhead + 1)); break;
          case "k": e.preventDefault(); isPlaying ? pause() : play(); break;
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, play, pause, stop, setLooping, isLooping, metronome, setMetronome, playhead, duration, setPlayhead]);

    return (
      <div
        ref={ref}
        className={cn(
          "h-14 border-b border-border bg-surface-panel flex items-center justify-between px-4 sam-mono",
          className
        )}
        {...props}
      >
        {/* Left: Transport Controls */}
        <div className="flex items-center gap-1">
          <SAMButton size="sm" variant={isRecording ? "danger" : "ghost"} onClick={() => {}}>
            <div className="w-2 h-2 rounded-full bg-current mr-1.5" />
            Rec
          </SAMButton>

          <SAMButton size="icon-sm" variant="ghost" onClick={() => stop()}>
            <SkipBack className="h-4 w-4" />
          </SAMButton>

          <SAMButton
            size="icon-lg"
            variant={isPlaying ? "ghost" : "primary"}
            onClick={isPlaying ? pause : play}
            className={cn("w-10 h-10 rounded-full", isPlaying && "bg-primary/10")}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </SAMButton>

          <SAMButton size="icon-sm" variant="ghost" onClick={() => stop()}>
            <Square className="h-4 w-4" />
          </SAMButton>

          <SAMButton size="icon-sm" variant={isLooping ? "primary" : "ghost"} onClick={() => setLooping(!isLooping)}>
            <Repeat className={cn("h-4 w-4", isLooping && "text-primary")} />
          </SAMButton>

          <SAMButton size="icon-sm" variant="ghost">
            <RotateCcw className="h-4 w-4" />
          </SAMButton>
          <SAMButton size="icon-sm" variant="ghost">
            <FastForward className="h-4 w-4" />
          </SAMButton>

          <div className="w-px h-6 bg-border mx-1" />

          <SAMButton
            size="icon-sm"
            variant={metronome ? "primary" : "ghost"}
            onClick={() => setMetronome(!metronome)}
          >
            <Thermometer className={cn("h-4 w-4", metronome && "text-primary")} />
          </SAMButton>
        </div>

        {/* Center: Tempo & Time */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <SAMButton size="xs" variant="ghost">
              <Rewind className="h-3 w-3" />
            </SAMButton>
            <input
              type="number"
              min="20"
              max="300"
              step="1"
              value={tempo}
              onChange={handleTempoChange}
              className="w-14 text-center bg-transparent border border-border rounded px-1.5 py-0.5 text-sm focus:outline-none focus:border-primary sam-mono"
            />
            <SAMButton size="xs" variant="ghost">
              <FastForward className="h-3 w-3" />
            </SAMButton>
          </div>

          <div className="text-xs sam-mono text-muted-foreground">
            {key} {scaleLabel()} {timeSignature.numerator}/{timeSignature.denominator}
          </div>

          <div className="w-px h-6 bg-border" />

          <div className="sam-mono text-sm font-medium">
            {formatTimecode(playhead)} / {formatTimecode(duration)}
          </div>
        </div>

        {/* Right: Mix Controls */}
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <SAMKnob
            value={0.7}
            size={32}
            onChange={() => {}}
            showValue={false}
          />
          <SAMButton size="xs" variant="ghost">
            <Settings className="h-4 w-4" />
          </SAMButton>
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs sam-mono text-muted-foreground">48 kHz</span>
        </div>
      </div>
    );

    function scaleLabel() {
      return useTransportStore.getState().scale === "major" ? "" : "m";
    }
  }
);

SAMTransport.displayName = "SAMTransport";

export { SAMTransport };
