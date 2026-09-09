"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Volume2, VolumeX, Settings, Plug,
  Send, Monitor, Smartphone, BarChart3,
  Filter, Hash, Waves, Link2,
} from "lucide-react";
import type { Track } from "@/types/music";
import { SAMKnob } from "./sam-knob";
import { SAMMeter } from "./sam-meter";
import { SAMSlider } from "./sam-slider";

interface SamMixerChannelProps {
  track: Track;
  index: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onMuteToggle: (id: string) => void;
  onSoloToggle: (id: string) => void;
  onRecordToggle: (id: string) => void;
  onVolumeChange: (id: string, value: number) => void;
  onPanChange: (id: string, value: number) => void;
  onEffectToggle: (id: string, effectId: string) => void;
  onSendChange: (trackId: string, busId: string, value: number) => void;
  className?: string;
}

const EFFECTS = [
  { id: "eq", name: "EQ", icon: <BarChart3 className="h-3 w-3" /> },
  { id: "comp", name: "Comp", icon: <Waves className="h-3 w-3" /> },
  { id: "del", name: "Delay", icon: <Settings className="h-3 w-3" /> },
  { id: "rev", name: "Reverb", icon: <Settings className="h-3 w-3" /> },
];

const SAMMixerChannel = React.forwardRef<HTMLDivElement, SamMixerChannelProps>(
  ({ track, index, isActive, onSelect, onMuteToggle, onSoloToggle, onRecordToggle, onVolumeChange, onPanChange, onEffectToggle, onSendChange, className }, ref) => {
    const isMuted = track.muted || (isActive && !track.soloed && track.soloed);
    const isSoloed = track.soloed;
    const isArmed = track.recordArmed;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center gap-1 px-2 pb-2 sam-mono text-xs",
          "border-r border-border first:border-l",
          isActive ? "bg-primary/5" : "hover:bg-muted/10",
          isSoloed && "ring-1 ring-primary",
          isArmed && "ring-1 ring-destructive",
          className
        )}
      >
        {/* Channel name */}
        <div className="mb-1 text-center w-full">
          <div className="truncate font-medium">{track.name}</div>
          <div className="text-[9px] text-muted-foreground uppercase">{track.type}</div>
        </div>

        {/* Input/Output */}
        <div className="flex items-center gap-0.5 mb-1">
          <Plug className="h-3 w-3 text-muted-foreground" />
          <span className="text-[9px] text-muted-foreground">1-2</span>
        </div>

        {/* Input selector */}
        <button className="mb-1 p-0.5 rounded hover:bg-muted transition-colors">
          <Monitor className="h-3 w-3 text-muted-foreground" />
        </button>

        {/* Volume fader */}
        <div className="flex items-center mb-1">
          <SAMMeter value={isMuted ? 0 : track.volume} type="vu" width={6} height={80} orientation="vertical" />
        </div>

        {/* Volume slider (vertical) */}
        <div className="h-16 flex items-end mb-1">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={track.volume}
            onChange={(e) => onVolumeChange(track.id, Number(e.target.value))}
            className="w-8 h-16 -rotate-180 cursor-col"
            style={{ writingMode: "vertical-lr" as const, transform: "rotate(180deg)" }}
          />
        </div>

        {/* Pan knob */}
        <SAMKnob
          value={(track.pan + 1) / 2}
          min={0}
          max={1}
          size={32}
          onChange={(v) => onPanChange(track.id, v * 2 - 1)}
          showValue={false}
        />
        <div className="text-[9px] text-muted-foreground">Pan</div>

        {/* Sends */}
        <div className="my-1 space-y-1 w-full">
          <div className="flex items-center gap-1">
            <Send className="h-3 w-3 text-muted-foreground" />
            <span className="text-[9px]">A</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.sendLevels["reverb"] || 0}
              onChange={(e) => onSendChange(track.id, "reverb", Number(e.target.value))}
              className="w-10 h-1 cursor-col resize-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <Send className="h-3 w-3 text-muted-foreground" />
            <span className="text-[9px]">B</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.sendLevels["delay"] || 0}
              onChange={(e) => onSendChange(track.id, "delay", Number(e.target.value))}
              className="w-10 h-1 cursor-col resize-none"
            />
          </div>
        </div>

        {/* Mute/Solo/Record */}
        <div className="flex flex-col gap-0.5 my-1">
          <button
            onClick={() => onRecordToggle(track.id)}
            className={cn(
              "w-6 h-6 rounded text-xs font-bold transition-colors",
              isArmed ? "bg-destructive text-white" : "hover:bg-muted"
            )}
          >
            R
          </button>
          <button
            onClick={() => onSoloToggle(track.id)}
            className={cn(
              "w-6 h-6 rounded text-xs font-bold transition-colors",
              isSoloed ? "bg-primary text-white" : "hover:bg-muted"
            )}
          >
            S
          </button>
          <button
            onClick={() => onMuteToggle(track.id)}
            className={cn(
              "w-6 h-6 rounded text-xs font-bold transition-colors",
              isMuted ? "bg-destructive text-white" : "hover:bg-muted"
            )}
          >
            M
          </button>
        </div>

        {/* Effects */}
        <div className="flex flex-col gap-0.5 my-1">
          {EFFECTS.map((fx) => (
            <button
              key={fx.id}
              onClick={() => onEffectToggle(track.id, fx.id)}
              className={cn(
                "w-7 h-7 rounded flex items-center justify-center transition-colors",
                 track.effects.some((eff) => eff.type === fx.id && eff.enabled)
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "hover:bg-muted"
              )}
              title={fx.name}
            >
              {fx.icon}
            </button>
          ))}
        </div>

        {/* Insert FX button */}
        <button className="mb-1 p-0.5 rounded hover:bg-muted transition-colors">
          <Settings className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    );
  }
);

SAMMixerChannel.displayName = "SAMMixerChannel";

export { SAMMixerChannel };
