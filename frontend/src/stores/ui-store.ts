import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { GenerationJob } from "@/types/music";

export type ThemeMode = "dark" | "light" | "system";

interface UIState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  commandPaletteOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelType: string;
  bottomSheetOpen: boolean;
  bottomSheetType: string;
  currentProjectId: string | null;
  theme: ThemeMode;
  showGridLines: boolean;
  snapEnabled: boolean;
  metronomeEnabled: boolean;
  generationQueue: GenerationJob[];
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    timestamp: string;
  }>;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setRightPanelType: (type: string) => void;
  setBottomSheetOpen: (open: boolean) => void;
  setBottomSheetType: (type: string) => void;
  setCurrentProjectId: (id: string | null) => void;
  setTheme: (theme: ThemeMode) => void;
  setShowGridLines: (show: boolean) => void;
  setSnapEnabled: (snap: boolean) => void;
  setMetronomeEnabled: (enabled: boolean) => void;
  addGenerationJob: (job: GenerationJob) => void;
  updateGenerationJob: (id: string, updates: Partial<GenerationJob>) => void;
  removeGenerationJob: (id: string) => void;
  addNotification: (notification: Omit<UIState["notifications"][number], "id" | "timestamp">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
  subscribeWithSelector((set) => ({
    sidebarCollapsed: false,
    mobileNavOpen: false,
    commandPaletteOpen: false,
    rightPanelOpen: false,
    rightPanelType: "",
    bottomSheetOpen: false,
    bottomSheetType: "",
    currentProjectId: null,
    theme: "dark",
    showGridLines: true,
    snapEnabled: true,
    metronomeEnabled: true,
    generationQueue: [],
    notifications: [],

    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    setRightPanelOpen: (open) => set({ rightPanelOpen: open, rightPanelType: open ? "" : "" }),
    setRightPanelType: (type) => set({ rightPanelType: type, rightPanelOpen: true }),
    setBottomSheetOpen: (open) => set({ bottomSheetOpen: open }),
    setBottomSheetType: (type) => set({ bottomSheetType: type }),
    setCurrentProjectId: (id) => set({ currentProjectId: id }),
    setTheme: (theme) => set({ theme }),
    setShowGridLines: (show) => set({ showGridLines: show }),
    setSnapEnabled: (snap) => set({ snapEnabled: snap }),
    setMetronomeEnabled: (enabled) => set({ metronomeEnabled: enabled }),
    addGenerationJob: (job) => set((s) => ({ generationQueue: [job, ...s.generationQueue] })),
    updateGenerationJob: (id, updates) =>
      set((s) => ({
        generationQueue: s.generationQueue.map((j) => (j.id === id ? { ...j, ...updates } : j)),
      })),
    removeGenerationJob: (id) => set((s) => ({ generationQueue: s.generationQueue.filter((j) => j.id !== id) })),
    addNotification: (notification) =>
      set((s) => ({
        notifications: [
          { ...notification, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
          ...s.notifications,
        ],
      })),
    markNotificationRead: (id) =>
      set((s) => ({
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      })),
    clearNotifications: () => set({ notifications: [] }),
  }))
);
