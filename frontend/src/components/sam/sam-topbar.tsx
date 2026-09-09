"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Search, Command, Bell, User, Settings, Moon, Sun,
  Wifi, WifiOff, Activity, BarChart3,
} from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { SAMButton } from "./sam-button";
import { SAMInput } from "./sam-form-inputs";
import { SAMSeparator } from "./sam-separator";
import { useTheme } from "@/components/providers/theme-provider";

const SAMTopbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className }, ref) => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
    const notifications = useUIStore((s) => s.notifications);
    const unreadCount = notifications.filter((n) => !n.read).length;
    const generationQueue = useUIStore((s) => s.generationQueue);
    const activeJobs = generationQueue.filter((j) => j.status === "queued" || j.status === "generating");
    const [backendStatus, setBackendStatus] = useState<"online" | "offline">("offline");
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
      const checkBackend = async () => {
        try {
          const res = await fetch("/api/v1/health", { signal: AbortSignal.timeout(2000) });
          setBackendStatus(res.ok ? "online" : "offline");
        } catch {
          setBackendStatus("offline");
        }
      };
      checkBackend();
      const interval = setInterval(checkBackend, 30000);
      return () => clearInterval(interval);
    }, []);

    return (
      <header
        ref={ref}
        className={cn(
          "h-14 border-b border-border bg-surface-panel flex items-center justify-between px-4 sam-mono",
          className
        )}
      >
        {/* Left: Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <SAMInput
              placeholder="Search projects, generations, voices..."
              className="pl-9 h-8 text-sm"
            />
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 sam-mono">
          {/* Backend status */}
          <div className={cn("flex items-center gap-1.5 text-xs", backendStatus === "online" ? "text-green-400" : "text-red-400")}>
            {backendStatus === "online" ? <Activity className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{backendStatus === "online" ? "Backend" : "Local Mode"}</span>
          </div>

          <SAMSeparator orientation="vertical" className="h-5 data-[orientation=vertical]:w-px" />

          {/* Generation queue */}
          {activeJobs.length > 0 && (
            <SAMButton size="sm" variant="ghost" onClick={() => useUIStore.getState().setRightPanelType("queue")}>
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <Activity className="h-4 w-4 text-accent animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary text-[6px] flex items-center justify-center text-white font-bold">
                      {activeJobs.length}
                    </span>
                  </span>
                </div>
                <span>{activeJobs.length} queued</span>
              </div>
            </SAMButton>
          )}

          {/* Theme toggle */}
          <SAMButton
            size="icon-xs"
            variant="ghost"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            title={resolvedTheme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </SAMButton>

          {/* Notifications */}
          <SAMButton size="icon-xs" variant="ghost" title="Notifications">
            <div className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[8px] flex items-center justify-center text-white font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </span>
              )}
            </div>
          </SAMButton>

          {/* Command palette trigger */}
          <SAMButton size="icon-xs" variant="ghost" onClick={() => setCommandPaletteOpen(true)} title="Command Palette (⌘K)">
            <Command className="h-4 w-4" />
          </SAMButton>

          <SAMSeparator orientation="vertical" className="h-6 data-[orientation=vertical]:w-px" />

          {/* User profile */}
          <SAMButton size="icon" variant="ghost" className="h-8 w-8">
            <User className="h-4 w-4" />
          </SAMButton>
        </div>
      </header>
    );
  }
);

SAMTopbar.displayName = "SAMTopbar";

export { SAMTopbar };
