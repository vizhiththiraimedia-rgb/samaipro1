"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Search, Command, Clock, ArrowUpRight, X } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

const COMMANDS = [
  { id: "new-song", label: "New Song", subtitle: "Create a new AI-generated song", category: "Create", shortcut: "N" },
  { id: "open-studio", label: "Open Studio", subtitle: "Open the DAW workspace", category: "Navigate", shortcut: "G S" },
  { id: "new-project", label: "New Project", subtitle: "Create a blank project", category: "Create", shortcut: "N P" },
  { id: "import-audio", label: "Import Audio", subtitle: "Upload audio file", category: "Create", shortcut: "I A" },
  { id: "import-midi", label: "Import MIDI", subtitle: "Upload MIDI file", category: "Create", shortcut: "I M" },
  { id: "generate", label: "Generate Music", subtitle: "Generate music from prompt", category: "Create", shortcut: "G" },
  { id: "generate-lyrics", label: "Generate Lyrics", subtitle: "AI-generated lyrics", category: "Create", shortcut: "L" },
  { id: "generate-vocals", label: "Generate Vocals", subtitle: "AI vocal generation", category: "Create", shortcut: "V" },
  { id: "separate-stems", label: "Separate Stems", subtitle: "Isolate instruments", category: "Create", shortcut: "S" },
  { id: "audio-to-midi", label: "Convert to MIDI", subtitle: "Extract MIDI from audio", category: "Create", shortcut: "A M" },
  { id: "open-librarry", label: "Open Library", subtitle: "Browse media library", category: "Navigate", shortcut: "L" },
  { id: "open-voices", label: "Open Voice Lab", subtitle: "Manage AI voices", category: "Navigate", shortcut: "V" },
  { id: "ai-producer", label: "Open AI Producer", subtitle: "AI mixing and mastering", category: "Navigate", shortcut: "P" },
  { id: "film-score", label: "Open Film Score", subtitle: "Cinematic scoring", category: "Navigate", shortcut: "F" },
  { id: "open-datasets", label: "Open Dataset Lab", subtitle: "Manage training data", category: "Navigate", shortcut: "D" },
  { id: "open-models", label: "Open Model Lab", subtitle: "Manage AI models", category: "Navigate", shortcut: "M" },
  { id: "open-training", label: "Open Training Lab", subtitle: "Train models", category: "Navigate", shortcut: "T" },
  { id: "open-settings", label: "Open Settings", subtitle: "Application settings", category: "Navigate", shortcut: "," },
  { id: "search", label: "Search", subtitle: "Search across SAM AI", category: "General", shortcut: "⌘K" },
];

const SAMCommandPalette = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({}, ref) => {
    const isOpen = useUIStore((s) => s.commandPaletteOpen);
    const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [recentCommands, setRecentCommands] = useState<string[]>([]);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        document.body.style.overflow = "";
      }
      return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setCommandPaletteOpen(false);
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          setCommandPaletteOpen(!isOpen);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, setCommandPaletteOpen]);

    const filtered = COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
    );

    const handleExecute = (cmd: string) => {
      setRecentCommands((r) => [cmd, ...r.filter((c) => c !== cmd).slice(0, 4)]);
      setCommandPaletteOpen(false);
      setQuery("");
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[var(--sam-z-modal)] flex items-start justify-center pt-[10vh] backdrop-blur-sm">
        <div
          className={cn(
            "w-full max-w-2xl rounded-xl border bg-card shadow-xl",
            "overflow-hidden"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border sam-mono">
            <Command className="h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded">K</kbd>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {query.length > 0 && filtered.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No commands found</div>
            ) : (
              <div className="py-2">
                {query.length === 0 && recentCommands.length > 0 && (
                  <>
                    <div className="px-4 py-1.5 text-xs text-muted-foreground sam-mono">RECENT</div>
                    {recentCommands.map((cmd) => {
                      const command = COMMANDS.find((c) => c.id === cmd);
                      if (!command) return null;
                      return (
                        <div key={cmd} onClick={() => handleExecute(cmd)} className="px-4 py-2 hover:bg-muted/10 cursor-pointer">
                          <div className="font-medium">{command.label}</div>
                          <div className="text-sm text-muted-foreground">{command.subtitle}</div>
                        </div>
                      );
                    })}
                    <div className="h-px bg-border my-2" />
                  </>
                )}
                {filtered.map((cmd) => (
                  <div
                    key={cmd.id}
                    onClick={() => handleExecute(cmd.id)}
                    className="px-4 py-2.5 hover:bg-muted/10 cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium">{cmd.label}</div>
                      <div className="text-sm text-muted-foreground">{cmd.subtitle}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="sam-mono text-muted-foreground">{cmd.category}</span>
                      <kbd className="px-1.5 py-0.5 bg-muted rounded sam-mono text-xs">{cmd.shortcut}</kbd>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SAMCommandPalette.displayName = "SAMCommandPalette";

export { SAMCommandPalette };
