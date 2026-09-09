import type { MidiNote, Key, Emotion } from "@/types/music";

export interface MidiController {
  addNote: (note: Partial<MidiNote>) => void;
  deleteNote: (id: string) => void;
  deleteSelected: (ids: string[]) => void;
  copySelected: (ids: string[]) => void;
  pasteSelected: () => void;
  getDemoNotes: () => MidiNote[];
}

class MidiService {
  private notes: MidiNote[] = [];

  async audioToMidi(audioFile: File): Promise<{
    notes: MidiNote[];
    bpm: number;
    key: Key;
    chords: string[];
    confidence: number;
    tempo: number;
  }> {
    await new Promise((r) => setTimeout(r, 800));
    return {
      notes: this.generateDefaultNotes(),
      bpm: 126,
      key: "Am",
      chords: ["Am", "F", "C", "G"],
      confidence: 0.87,
      tempo: 126,
    };
  }

  async midiToNotes(midiFile: File): Promise<MidiNote[]> {
    return this.generateDefaultNotes();
  }

  async exportMidi(notes: MidiNote[], bpm: number): Promise<Blob> {
    const csv = notes.map((n) => `${n.startTime},${n.pitch},${n.velocity},${n.duration}`).join("\n");
    return new Blob([csv], { type: "text/csv" });
  }

  async exportMidiFile(notes: MidiNote[], bpm: number): Promise<Blob> {
    const midiData = this.generateMockMidi(notes, bpm);
    return new Blob([midiData] as BlobPart[], { type: "application/octet-stream" });
  }

  getDemoNotes(): MidiNote[] {
    return this.generateDefaultNotes();
  }

  addNote(note: Partial<MidiNote>): void {
    this.notes.push({ ...note, id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` } as MidiNote);
  }

  deleteNote(id: string): void {
    this.notes = this.notes.filter((n) => n.id !== id);
  }

  deleteSelected(ids: string[]): void {
    this.notes = this.notes.filter((n) => !ids.includes(n.id));
  }

  copySelected(ids: string[]): void {
    this.copiedNotes = this.notes.filter((n) => ids.includes(n.id));
  }

  pasteSelected(): void {
    if (this.copiedNotes) {
      this.notes.push(...this.copiedNotes.map((n) => ({ ...n, id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` })));
    }
  }

  private copiedNotes: MidiNote[] | null = null;

  private generateDefaultNotes(): MidiNote[] {
    const notes: MidiNote[] = [];
    const pitches = [57, 60, 63, 64, 67, 60, 63, 67, 71];
    let time = 0;
    for (let i = 0; i < 16; i++) {
      notes.push({
        id: `note_${i}`,
        pitch: pitches[i % pitches.length],
        velocity: 90 + Math.random() * 20,
        startTime: time,
        duration: 0.5,
        channel: 0,
      });
      time += 0.5;
    }
    return notes;
  }

  private generateMockMidi(notes: MidiNote[], bpm: number): Uint8Array {
    return new Uint8Array(48);
  }

  getKeyName(pitch: number): string {
    const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octave = Math.floor(pitch / 12) - 1;
    const name = names[pitch % 12];
    return `${name}${octave}`;
  }

  getNoteFromKey(key: string): number {
    const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const parts = key.match(/^([A-G]#?)(\d)$/);
    if (!parts) return 60;
    const nameIdx = names.indexOf(parts[1]);
    const octave = parseInt(parts[2]);
    return nameIdx + (octave + 1) * 12;
  }
}

export const midiService = new MidiService();
export const midiController: MidiController = midiService as unknown as MidiController;
