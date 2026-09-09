"use client";
import React, { useEffect } from "react";
import { SAMSidebar, SAMTopbar, SAMBottomNav, SAMCommandPalette, SAMMiniPlayer } from "@/components/sam";
import { useUIStore } from "@/stores/ui-store";
import { useMobile } from "@/hooks/use-mobile";

interface SAMLayoutProps {
  children: React.ReactNode;
  showShell?: boolean;
}

const SAMLayout: React.FC<SAMLayoutProps> = ({ children, showShell = true }) => {
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const isMobile = useMobile();

  useEffect(() => {
    if (!showShell) return;
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useUIStore.getState().setCommandPaletteOpen(true);
      }
      if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useUIStore.getState().toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [showShell]);

  if (!showShell) {
    return <>{children}</>;
  }

  const sidebarWidth = isMobile ? 256 : (useUIStore.getState().sidebarCollapsed ? 64 : 256);

  return (
    <div className="flex h-screen bg-background overflow-x-hidden sam-mono">
      <SAMSidebar />

      {isMobile && mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => useUIStore.getState().setMobileNavOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
        <SAMTopbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          {children}
        </main>
      </div>

      <SAMCommandPalette />
      <SAMBottomNav />
      <SAMMiniPlayer />
    </div>
  );
};

export { SAMLayout };
