"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Play, Pause, Square, SkipBack, SkipForward,
  MoreVertical, Volume2, Settings,
  Eye, EyeOff, Lock, LockOpen,
  Music, Waves, Edit3, Trash2, Copy,
} from "lucide-react";
import type { Track, TrackType } from "@/types/music";
import { SAMButton } from "./sam-button";
import { SAMKnob } from "./sam-knob";
import { SAMMeter } from "./sam-meter";

interface SamTrackHeaderProps {
  track: Track;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onMuteToggle: (id: string) => void;
  onSoloToggle: (id: string) => void;
  onRecordToggle: (id: string) => void;
  onVolumeChange: (id: string, value: number) => void;
  onPanChange: (id: string, value: number) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  className?: string;
}

const TRACK_TYPE_ICONS: Record<TrackType, React.ReactNode> = {
  audio: <Music className="h-3 w-3" />,
  vocal: <Music className="h-3 w-3" />,
  instrument: <Music className="h-3 w-3" />,
  midi: <Music className="h-3 w-3" />,
  drums: <Music className="h-3 w-3" />,
  bass: <Music className="h-3 w-3" />,
  guitar: <Music className="h-3 w-3" />,
  piano: <Music className="h-3 w-3" />,
  strings: <Music className="h-3 w-3" />,
  brass: <Music className="h-3 w-3" />,
  fx: <Music className="h-3 w-3" />,
  reference: <Music className="h-3 w-3" />,
};

const TRACK_TYPE_LABELS: Record<TrackType, string> = {
  audio: "Audio", vocal: "Vocal", instrument: "Instrument", midi: "MIDI",
  drums: "Drums", bass: "Bass", guitar: "Guitar", piano: "Piano",
  strings: "Strings", brass: "Brass", fx: "FX", reference: "Reference",
};

const SAMTrackHeader = React.forwardRef<HTMLDivElement, SamTrackHeaderProps>(
  ({
    track,
    isSelected = false,
    onSelect,
    onMuteToggle,
    onSoloToggle,
    onRecordToggle,
    onVolumeChange,
    onPanChange,
    onDelete,
    onDuplicate,
    className,
  }, ref) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(track.name);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setShowMenu(false);
        }
      };
      if (showMenu) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [showMenu]);

    const handleNameChange = () => {
      setIsEditingName(false);
      if (nameValue.trim() && nameValue !== track.name) {
        onVolumeChange(track.id, track.volume);
      }
    };

    const color = track.color || "hsl(210 60% 55%)";

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1 px-2 border-b border-border transition-colors sam-mono text-xs",
          isSelected ? "bg-primary/5" : "hover:bg-muted/20",
          className
        )}
      >
        {/* Track color strip & selection */}
        <div className="w-3 flex items-center justify-center">
          <div
            className="w-2.5 h-2.5 rounded-sm cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => onSelect(track.id)}
          />
        </div>

        {/* Track name */}
        <div className="flex-1 min-w-0 py-1.5">
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameChange}
              onKeyDown={(e) => e.key === "Enter" && handleNameChange()}
              className="w-full bg-transparent border border-border rounded px-1 text-xs focus:outline-none focus:border-primary"
              autoFocus
            />
          ) : (
            <div
              onDoubleClick={() => setIsEditingName(true)}
              className="truncate cursor-pointer"
              title={track.name}
            >
              {track.name}
            </div>
          )}
        </div>

        {/* Track type badge */}
        <div className="flex items-center gap-0.5 text-muted-foreground">
          {TRACK_TYPE_ICONS[track.type]}
          <span className="hidden sm:inline">{TRACK_TYPE_LABELS[track.type]}</span>
        </div>

        {/* Record arm */}
        <SAMButton
          size="icon-xs"
          variant={track.recordArmed ? "danger" : "ghost"}
          onClick={() => onRecordToggle(track.id)}
        >
          <div className="w-2 h-2 rounded-xs" />
        </SAMButton>

        {/* Solo */}
        <SAMButton
          size="icon-xs"
          variant={track.soloed ? "primary" : "ghost"}
          onClick={() => onSoloToggle(track.id)}
          className={cn(track.soloed && "text-primary")}
        >
          S
        </SAMButton>

        {/* Mute */}
        <SAMButton
          size="icon-xs"
          variant={track.muted ? "outline" : "ghost"}
          onClick={() => onMuteToggle(track.id)}
          className={cn(track.muted && "text-destructive")}
        >
          M
        </SAMButton>

        {/* Volume fader */}
        <div className="flex items-center gap-0.5">
          <SAMMeter value={track.muted ? 0 : track.volume} type="vu" width={4} height={24} orientation="vertical" />
          <SAMKnob
            value={track.volume}
            min={0}
            max={1}
            size={28}
            onChange={(v) => onVolumeChange(track.id, v)}
            showValue={false}
          />
        </div>

        {/* Pan knob */}
        <SAMKnob value={(track.pan + 1) / 2} min={0} max={1} size={28} onChange={(v) => onPanChange(track.id, v * 2 - 1)} showValue={false} />

        {/* Lock */}
        <SAMButton size="icon-xs" variant={track.locked ? "primary" : "ghost"}>
          {track.locked ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
        </SAMButton>

        {/* Visibility */}
        <SAMButton size="icon-xs" variant={track.visible ? "ghost" : "primary"}>
          {track.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </SAMButton>

        {/* More menu */}
        <div className="relative" ref={menuRef}>
          <SAMButton size="icon-xs" variant="ghost" onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical className="h-3 w-3" />
          </SAMButton>
          {showMenu && (
            <div className="absolute right-0 top-6 z-50 w-48 bg-surface-panel border border-border rounded-md py-1 shadow-lg">
              <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted transition-colors">
                <Edit3 className="h-3 w-3" /> Rename
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted transition-colors" onClick={() => onDuplicate?.(track.id)}>
                <Copy className="h-3 w-3" /> Duplicate
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-muted transition-colors" onClick={() => onDelete?.(track.id)}>
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SAMTrackHeader.displayName = "SAMTrackHeader";

export { SAMTrackHeader };
