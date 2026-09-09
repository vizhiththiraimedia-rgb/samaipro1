"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav, SAMCommandPalette, SAMMiniPlayer } from "@/components/sam";
import { SAMTransport } from "@/components/sam/sam-transport";
import { SAMTrackHeader } from "@/components/sam/sam-track-header";
import { SAMMixerChannel } from "@/components/sam/sam-mixer-channel";
import { SAMButton } from "@/components/sam/sam-button";
import { useStudioStore, useTransportStore, useMixerStore } from "@/stores/studio-store";
import { useEffect, useRef, useCallback } from "react";
import {
  ZoomIn, ZoomOut, Maximize2, Settings,
  Menu, ChevronLeft, ChevronRight, Waves,
  Scissors, Copy, Clipboard, Trash2, Play, Pause,
  Volume2, RotateCcw, Divide, Repeat, Eye, EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { TrackType } from "@/types/music";

const TIMELINE_HEIGHT = 4;

const formatBeats = (beats: number, timeSig: { numerator: number; denominator: number }) => {
  const bar = Math.floor(beats / timeSig.numerator);
  const beat = Math.floor(beats % timeSig.numerator) + 1;
  return `${bar}:${String(beat).padStart(2, "0")}`;
};

export default function StudioPage() {
  const { tracks, selectedTrackId, selectedRegionId, selectTrack, updateTrack, setZoomLevel, zoomLevel, scrollPosition, setScrollPosition, timeView, setTimeView, showRulers, toggleRulers, showWaveform, toggleWaveform, addRegion } = useStudioStore();
  const transport = useTransportStore();
  const mixer = useMixerStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (e.key === " " || e.key === "k") { e.preventDefault(); transport.isPlaying ? transport.pause() : transport.play(); }
      if (e.key === "s") transport.stop();
      if (e.key === "m") mixer.toggleMute(selectedTrackId || "");
      if (e.key === "s" && e.shiftKey) mixer.toggleSolo(selectedTrackId || "");
      if (e.key === "r") mixer.toggleRecordArm(selectedTrackId || "");
      if (e.key === "Delete") { /* delete selected region */ }
      if (e.key === "=" && (e.ctrlKey || e.metaKey)) setZoomLevel(Math.min(3, zoomLevel + 0.25));
      if (e.key === "-" && (e.ctrlKey || e.metaKey)) setZoomLevel(Math.max(0.5, zoomLevel - 0.25));
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [transport, mixer, selectedTrackId, zoomLevel]);

  const drawTimeline = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !timelineRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = timelineRef.current.clientWidth;
    const height = Math.max(...tracks.map((t) => t.height));
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const pixelsPerSecond = 50 * zoomLevel;
    const pixelsPerBeat = pixelsPerSecond / 60 * 60 / transport.tempo;
    const visibleStart = scrollPosition;
    const visibleEnd = scrollPosition + width / pixelsPerSecond * 60;

    if (showRulers) {
      ctx.font = "10px monospace";
      ctx.fillStyle = "hsl(220 20% 55%)";
      ctx.textAlign = "center";

      for (let bar = 0; bar <= transport.duration; bar += TIMELINE_HEIGHT) {
        const x = (bar - visibleStart) * pixelsPerBeat * transport.timeSignature.numerator;
        if (x < 0 || x > width) continue;

        ctx.strokeStyle = "hsl(220 20% 25%)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        ctx.fillStyle = "hsl(220 20% 55%)";
        ctx.fillText(formatBeats(bar * TIMELINE_HEIGHT, transport.timeSignature), x + 2, 12);
      }
    }

    if (showWaveform) {
      tracks.forEach((track, trackIndex) => {
        const y = trackIndex * (track.height + 1);
        ctx.fillStyle = track.color || "hsl(210 60% 55%)";
        ctx.globalAlpha = track.muted ? 0.3 : 1;

        track.regions.forEach((region) => {
          const startX = (region.startBeat - visibleStart) * pixelsPerBeat * transport.timeSignature.numerator;
          const width = (region.endBeat - region.startBeat) * pixelsPerBeat * transport.timeSignature.numerator;
          if (startX + width < 0 || startX > canvas.width / dpr) return;

          ctx.fillRect(startX, y + 4, Math.max(2, width), track.height - 8);
          ctx.globalAlpha = 0.8;

          if (region.audioUrl) {
            const waveformHeight = track.height / 2 - 4;
            const barWidth = Math.max(0.5, width / (region.waveformData?.length || 32));
            region.waveformData?.forEach((amp, i) => {
              const bx = startX + i * barWidth;
              const bh = amp * waveformHeight;
              ctx.fillRect(bx, y + 4 + waveformHeight / 2 - bh / 2, Math.max(0.5, barWidth - 0.2), bh);
            });
          }
        });
      });
    }

    if (transport.isPlaying) {
      const playheadX = (transport.playhead - visibleStart) * pixelsPerBeat * transport.timeSignature.numerator;
      ctx.strokeStyle = "hsl(0 90% 60%)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();

      ctx.fillStyle = "hsl(0 90% 60%)";
      ctx.beginPath();
      ctx.moveTo(playheadX, 4);
      ctx.lineTo(playheadX + 4, 8);
      ctx.lineTo(playheadX + 4, height - 4);
      ctx.closePath();
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }, [tracks, transport, zoomLevel, scrollPosition, showRulers, showWaveform, transport.isPlaying]);

  useEffect(() => {
    drawTimeline();
  }, [drawTimeline]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pixelsPerSecond = 50 * zoomLevel;
    const time = scrollPosition + x / pixelsPerSecond;
    transport.setPlayhead(time);
  };

  const addEmptyTrack = (type: string) => {
    useStudioStore.getState().addTrack({ name: `New ${type}`, type: type as TrackType, color: `hsl(${210 + Math.random() * 60}, 60%, 55%)` });
  };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />
        <SAMTransport />

        {/* Main studio area */}
        <div className="flex-1 flex overflow-hidden border-t border-border">
          {/* Track headers */}
          <div className="w-64 flex-shrink-0 border-r border-border bg-surface-panel overflow-y-auto sam-scrollbar-hide">
            {tracks.map((track) => (
              <SAMTrackHeader
                key={track.id}
                track={track}
                isSelected={track.id === selectedTrackId}
                onSelect={selectTrack}
                onMuteToggle={mixer.toggleMute}
                onSoloToggle={mixer.toggleSolo}
                onRecordToggle={mixer.toggleRecordArm}
                onVolumeChange={mixer.setFader}
                onPanChange={mixer.setPan}
              />
            ))}
            <div className="border-t border-border p-1 space-y-0.5 sam-mono">
              <button
                onClick={() => addEmptyTrack("audio")}
                className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded"
              >
                + Add Audio Track
              </button>
              <button
                onClick={() => addEmptyTrack("midi")}
                className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded"
              >
                + Add MIDI Track
              </button>
              <button
                onClick={() => addEmptyTrack("vocal")}
                className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded"
              >
                + Add Vocal Track
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 flex flex-col overflow-hidden bg-surface">
            {/* Timeline header */}
            <div className="h-8 border-b border-border px-4 flex items-center sam-mono text-xs">
              <div className="flex items-center gap-4">
                <SAMButton size="xs" variant={showRulers ? "primary" : "ghost"} onClick={toggleRulers}>
                  <Waves className="h-3 w-3" /> Rulers
                </SAMButton>
                <SAMButton size="xs" variant={showWaveform ? "primary" : "ghost"} onClick={toggleWaveform}>
                  {showWaveform ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} Waveform
                </SAMButton>
                <SAMButton size="xs" variant={timeView === "beats" ? "primary" : "ghost"} onClick={() => setTimeView("beats")}>
                  Beats
                </SAMButton>
                <SAMButton size="xs" variant={timeView === "time" ? "primary" : "ghost"} onClick={() => setTimeView("time")}>
                  Time
                </SAMButton>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <SAMButton size="xs" variant="ghost" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}>
                  <ZoomOut className="h-3 w-3" />
                </SAMButton>
                <span className="text-xs sam-mono">{Math.round(zoomLevel * 100)}%</span>
                <SAMButton size="xs" variant="ghost" onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}>
                  <ZoomIn className="h-3 w-3" />
                </SAMButton>
              </div>
            </div>

            {/* Timeline canvas */}
            <div
              ref={timelineRef}
              className="flex-1 relative overflow-hidden sam-scrollbar-hide"
              onWheel={(e) => {
                setZoomLevel(Math.max(0.5, Math.min(3, zoomLevel + (e.deltaY > 0 ? -0.1 : 0.1))));
                e.preventDefault();
              }}
            >
              <canvas
                ref={canvasRef}
                width={1000}
                height={400}
                className="absolute inset-0 w-full h-full"
                onClick={handleCanvasClick}
              />
            </div>
          </div>
        </div>

        {/* Mixer / Bottom panel */}
        <div className="h-32 border-t border-border bg-surface-panel sam-mono">
          <div className="flex items-end h-full overflow-x-auto sam-scrollbar-hide">
            <div className="flex items-end gap-1 px-2">
            <div className="flex-1 flex items-end">
                <SAMMixerChannel
                  track={tracks[0]}
                  index={0}
                  isActive={selectedTrackId === tracks[0]?.id}
                  onSelect={selectTrack}
                  onMuteToggle={mixer.toggleMute}
                  onSoloToggle={mixer.toggleSolo}
                  onRecordToggle={mixer.toggleRecordArm}
                  onVolumeChange={mixer.setFader}
                  onPanChange={mixer.setPan}
                  onEffectToggle={() => {}}
                  onSendChange={mixer.setBusSend}
                />
              </div>
              {tracks.slice(1).map((track, i) => (
                <div key={track.id} className="flex-1 flex items-end">
                  <SAMMixerChannel
                    track={track}
                    index={i + 1}
                    isActive={selectedTrackId === track.id}
                    onSelect={selectTrack}
                    onMuteToggle={mixer.toggleMute}
                    onSoloToggle={mixer.toggleSolo}
                    onRecordToggle={mixer.toggleRecordArm}
                    onVolumeChange={mixer.setFader}
                    onPanChange={mixer.setPan}
                    onEffectToggle={() => {}}
                    onSendChange={mixer.setBusSend}
                  />
                </div>
              ))}
            </div>

            {/* Master channel */}
            <div className="w-20 border-l border-border">
              <div className="p-2 text-center">
                <div className="text-xs font-bold sam-mono">MASTER</div>
                <SAMButton size="icon-xs" variant="ghost" onClick={() => {}}>
                  <Settings className="h-3 w-3" />
                </SAMButton>
              </div>
              <div className="px-1">
                <SAMButton size="icon-xs" variant="ghost">
                  <Volume2 className="h-4 w-4" />
                </SAMButton>
                <div className="h-20 flex items-center justify-center my-1">
                  <input type="range" min={0} max={1} step={0.01} defaultValue={0.85} className="w-6 h-20 cursor-col" style={{ writingMode: "vertical-lr" as const, transform: "rotate(180deg)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SAMCommandPalette />
      <SAMBottomNav />
      <SAMMiniPlayer />
    </div>
  );
}
