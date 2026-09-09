"use client";

import { SAMSidebar, SAMTopbar, SAMBottomNav, SAMCommandPalette } from "@/components/sam";
import { SAMButton } from "@/components/sam/sam-button";
import { SAMCard, SAMPanel } from "@/components/sam/sam-card";
import { SAMSlider } from "@/components/sam/sam-slider";
import { SAMKnob } from "@/components/sam/sam-knob";
import { midiService } from "@/services/midi-service";
import type { MidiNote } from "@/types/music";
import { Play, Pause, SkipBack, SkipForward, Volume2, MousePointer, Edit, Copy, Clipboard, Trash2, Save, Upload, Download, Grid3x3, Piano, Settings2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const PITCHES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const KEYS_PER_OCTAVE = 12;
const OCTAVES = 8;
const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];
const BLACK_KEYS = [1, 3, 5, 6, 8, 10];

export default function MidiPage() {
  const [notes, setNotes] = useState<MidiNote[]>(midiService.getDemoNotes());
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTool, setSelectedTool] = useState<"select" | "draw" | "erase" | "audition">("draw");
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [pianoRollHeight, setPianoRollHeight] = useState(400);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const TICKS_PER_BEAT = 480;
  const BEATS_PER_BAR = 4;
  const TOTAL_BARS = 8;
  const TOTAL_TICKS = TICKS_PER_BEAT * BEATS_PER_BAR * TOTAL_BARS;

  const ticksToX = (ticks: number, width: number) => (ticks / TOTAL_TICKS) * width;
  const xToTicks = (x: number, width: number) => (x / width) * TOTAL_TICKS;
  const midiToY = (noteNumber: number, height: number) => height - ((noteNumber / 127) * height);
  const yToMidi = (y: number, height: number) => Math.round((1 - y / height) * 127);

  const drawPianoRoll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = pianoRollHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const ticksPerPixel = TOTAL_TICKS / width;
    const pixelsPerBeat = width / (BEATS_PER_BAR * TOTAL_BARS);
    const beatWidth = pixelsPerBeat;

    // Draw grid
    ctx.strokeStyle = "hsl(220 20% 20%)";
    ctx.lineWidth = 0.5;
    for (let bar = 0; bar <= TOTAL_BARS; bar++) {
      const x = (bar / TOTAL_BARS) * width;
      ctx.lineWidth = bar % BEATS_PER_BAR === 0 ? 1 : 0.5;
      ctx.strokeStyle = bar % BEATS_PER_BAR === 0 ? "hsl(220 30% 25%)" : "hsl(220 20% 20%)";
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw beat lines
    for (let beat = 0; beat <= BEATS_PER_BAR * TOTAL_BARS; beat++) {
      const x = (beat / (BEATS_PER_BAR * TOTAL_BARS)) * width;
      ctx.strokeStyle = "hsl(220 15% 25%)";
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw playhead
    const playheadX = ticksToX(currentTime, width);
    ctx.strokeStyle = "hsl(0 90% 60%)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();

    // Draw notes
    notes.forEach((note) => {
      const noteX = ticksToX(note.startTime * TICKS_PER_BEAT, width);
      const noteWidth = ticksToX(note.duration * TICKS_PER_BEAT, width);
      if (noteX + noteWidth < 0 || noteX > width) return;

      const noteY = midiToY(note.pitch, height);
      const noteHeight = Math.max(2, height / 128);

      const isSelected = selectedNotes.has(note.id);
      ctx.fillStyle = isSelected ? "hsl(230 90% 65%)" : `hsl(210 60% ${60 + (note.pitch % 12) * 2}%)`;
      ctx.strokeStyle = isSelected ? "hsl(230 100% 75%)" : ctx.fillStyle;
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.fillRect(noteX, noteY - noteHeight / 2, Math.max(2, noteWidth), noteHeight);
      ctx.strokeRect(noteX, noteY - noteHeight / 2, Math.max(2, noteWidth), noteHeight);
    });

    ctx.textBaseline = "top";
  }, [notes, currentTime, pianoRollHeight, selectedNotes]);

  useEffect(() => {
    drawPianoRoll();
  }, [drawPianoRoll]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ticks = Math.floor(xToTicks(x, rect.width));
    const noteNumber = yToMidi(y, rect.height);

    if (selectedTool === "draw") {
      const noteLen = 0.25;
      const newNote: MidiNote = {
        id: `note_${Date.now()}`,
        pitch: noteNumber,
        velocity: 90,
        startTime: ticks / TICKS_PER_BEAT,
        duration: noteLen,
        channel: 0,
      };
      setNotes([...notes, newNote]);
      drawPianoRoll();
    } else if (selectedTool === "erase") {
      const noteToDelete = notes.find((n) =>
        ticks >= n.startTime * TICKS_PER_BEAT - 10 && ticks <= (n.startTime + n.duration) * TICKS_PER_BEAT + 10 &&
        Math.abs(n.pitch - noteNumber) < 2
      );
      if (noteToDelete) {
        setNotes(notes.filter((n) => n.id !== noteToDelete.id));
        drawPianoRoll();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.tagName === "INPUT") return;
    if (e.key === " ") { e.preventDefault(); setIsPlaying(!isPlaying); }
    if (e.key === "Delete") setNotes(notes.filter((n) => !selectedNotes.has(n.id)));
    if (e.key === "c" && e.ctrlKey) {
      navigator.clipboard.writeText(JSON.stringify(notes.filter((n) => selectedNotes.has(n.id))));
    }
    if (e.key === "v" && e.ctrlKey) {
      navigator.clipboard.readText().then((text) => {
        try {
          const clipped = JSON.parse(text);
          if (Array.isArray(clipped)) setNotes([...notes, ...clipped]);
        } catch {}
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNotes]);

  // Playhead animation
  useEffect(() => {
    if (!isPlaying) return;
    const start = Date.now();
    const startTime = currentTime;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const newTime = startTime + elapsed * (TICKS_PER_BEAT * BEATS_PER_BAR * TOTAL_BARS / 60);
      if (newTime >= TOTAL_TICKS) {
        setCurrentTime(0);
        setIsPlaying(false);
        clearInterval(interval);
      } else {
        setCurrentTime(newTime);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);

  const renderPiano = () => {
    const keys = [];
    for (let octave = OCTAVES - 1; octave >= 0; octave--) {
      for (let key = 0; key < KEYS_PER_OCTAVE; key++) {
        const noteNumber = octave * KEYS_PER_OCTAVE + key;
        const isWhite = WHITE_KEYS.includes(key);
        keys.push(
          <div
            key={noteNumber}
            className={`relative w-8 h-6 ${isWhite ? "bg-white text-black" : "bg-black text-white"} flex items-end justify-center sam-mono cursor-pointer`}
            onClick={() => {
              const note = {
                id: `note_${Date.now()}`,
                noteNumber,
                startTick: 0,
                endTick: TICKS_PER_BEAT,
                velocity: 100,
                channel: 0,
              };
              midiService.addNote(note);
              drawPianoRoll();
            }}
          >
            <span className={`text-[8px] ${isWhite ? "text-black/60" : "text-white/60"}`}>
              {PITCHES[key]}
            </span>
          </div>
        );
      }
    }
    return <div className="flex">{keys}</div>;
  };

  return (
    <div className="flex h-screen bg-background sam-mono overflow-hidden">
      <SAMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SAMTopbar />

        {/* Transport */}
        <div className="h-12 border-b border-border bg-surface-panel sam-mono px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SAMButton size="sm" variant="ghost">
              <Upload className="h-4 w-4" />
            </SAMButton>
            <SAMButton size="sm" variant="ghost">
              <Download className="h-4 w-4" />
            </SAMButton>
            <SAMButton size="sm" variant="ghost">
              <Save className="h-4 w-4" />
            </SAMButton>
          </div>

          <div className="flex items-center gap-4">
            <SAMButton size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </SAMButton>
            <SAMButton size="sm" variant="ghost">
              <SkipBack className="h-4 w-4" />
            </SAMButton>
            <SAMButton size="sm" variant="ghost">
              <SkipForward className="h-4 w-4" />
            </SAMButton>
            <div className="sam-mono text-sm">
              {Math.floor(currentTime / TICKS_PER_BEAT / BEATS_PER_BAR)}:{String(Math.floor((currentTime % (TICKS_PER_BEAT * BEATS_PER_BAR)) / TICKS_PER_BEAT) + 1).padStart(2, "0")}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SAMSlider value={isPlaying ? 80 : 50} max={100} size="sm" showValue={false} className="w-20" />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Piano keyboard */}
          <div className="w-20 border-r border-border overflow-y-auto sam-scrollbar-hide">
            {renderPiano()}
          </div>

          {/* Piano roll */}
          <div className="flex-1 overflow-auto bg-surface">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={pianoRollHeight}
                className="w-full cursor-crosshair"
                onClick={handleCanvasClick}
              />
            </div>
          </div>

          {/* Controls panel */}
          <div className="w-64 border-l border-border bg-surface-panel p-4 overflow-y-auto sam-scrollbar-hide">
            <div className="space-y-4 sam-mono">
              <div>
                <h3 className="text-sm font-semibold mb-2">Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  <SAMButton size="sm" variant={selectedTool === "select" ? "primary" : "ghost"} onClick={() => setSelectedTool("select")}>
                    <MousePointer className="h-4 w-4" />
                  </SAMButton>
                  <SAMButton size="sm" variant={selectedTool === "draw" ? "primary" : "ghost"} onClick={() => setSelectedTool("draw")}>
                    <Edit className="h-4 w-4" />
                  </SAMButton>
                  <SAMButton size="sm" variant={selectedTool === "erase" ? "primary" : "ghost"} onClick={() => setSelectedTool("erase")}>
                    <Trash2 className="h-4 w-4" />
                  </SAMButton>
                  <SAMButton size="sm" variant={selectedTool === "audition" ? "primary" : "ghost"} onClick={() => setSelectedTool("audition")}>
                    <Play className="h-4 w-4" />
                  </SAMButton>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Selected: {selectedNotes.size} note(s)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Velocity</label>
                    <SAMSlider value={90} max={127} size="sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Quantization</label>
                    <select className="w-full text-sm bg-surface border border-border rounded px-2 py-1">
                      <option>1/4</option>
                      <option>1/8</option>
                      <option>1/16</option>
                      <option>1/32</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Controllers</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Mod Wheel</label>
                    <SAMSlider value={0} max={127} size="sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Expression</label>
                    <SAMSlider value={100} max={127} size="sm" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Piano Roll</h3>
                <SAMSlider
                  value={pianoRollHeight}
                  min={200}
                  max={800}
                  size="sm"
                  showValue={false}
                  onChange={setPianoRollHeight}
                />
                <div className="text-xs text-muted-foreground text-center">{pianoRollHeight}px</div>
              </div>
            </div>
          </div>
        </div>

        <SAMBottomNav />
      </div>
    </div>
  );
}
