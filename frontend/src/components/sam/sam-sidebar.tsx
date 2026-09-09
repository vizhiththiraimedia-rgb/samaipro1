"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import {
  Home, Music, SquarePlay, Folder, Library,
  Mic, Globe, Scissors, Piano, Brain,
  Film, Database, Cpu, Settings, BarChart3,
  Menu, User, LogOut, ChevronLeft, ChevronRight,
  Search, Workflow, Layers,
} from "lucide-react";
import { SAMButton } from "./sam-button";
import { SAMSeparator } from "./sam-separator";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  collapsed?: boolean;
}

const SAMSidebarItem = React.forwardRef<HTMLAnchorElement, {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}>(({ href, icon, label, count, isActive, collapsed, onClick }, ref) => (
  <Link ref={ref} href={href} onClick={onClick}>
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md mx-2 text-sm font-medium transition-all",
        "sam-mono",
        isActive
          ? "bg-primary/15 text-primary border border-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/10",
      )}
      title={collapsed ? label : undefined}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {count !== undefined && count > 0 && (
            <span className="ml-auto px-1.5 py-0.5 text-xs bg-muted rounded-full">
              {count}
            </span>
          )}
        </>
      )}
    </div>
  </Link>
));
SAMSidebarItem.displayName = "SAMSidebarItem";

const SIDEBAR_ITEMS = [
  { href: "/dashboard", icon: <Home className="h-4 w-4" />, label: "Dashboard" },
  { href: "/create", icon: <Music className="h-4 w-4" />, label: "Create" },
  { href: "/studio", icon: <SquarePlay className="h-4 w-4" />, label: "Studio" },
  { href: "/projects", icon: <Folder className="h-4 w-4" />, label: "Projects" },
  { href: "/library", icon: <Library className="h-4 w-4" />, label: "Library" },
  { href: "/voices", icon: <Mic className="h-4 w-4" />, label: "Voices" },
  { href: "/instruments", icon: <Globe className="h-4 w-4" />, label: "Instruments" },
  { href: "/stems", icon: <Scissors className="h-4 w-4" />, label: "Stems" },
  { href: "/midi", icon: <Piano className="h-4 w-4" />, label: "MIDI" },
  { href: "/producer", icon: <Brain className="h-4 w-4" />, label: "AI Producer" },
  { href: "/film-score", icon: <Film className="h-4 w-4" />, label: "Film Score" },
  { href: "/datasets", icon: <Database className="h-4 w-4" />, label: "Dataset Lab" },
  { href: "/models", icon: <Cpu className="h-4 w-4" />, label: "Model Lab" },
  { href: "/training", icon: <Workflow className="h-4 w-4" />, label: "Training Lab" },
  { href: "/system", icon: <BarChart3 className="h-4 w-4" />, label: "System" },
  { href: "/settings", icon: <Settings className="h-4 w-4" />, label: "Settings" },
];

const SAMSidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className }, ref) => {
    const pathname = usePathname();
    const collapsed = useUIStore((s) => s.sidebarCollapsed);
    const setCollapsed = useUIStore((s) => s.setSidebarCollapsed);
    const currentProjectId = useUIStore((s) => s.currentProjectId);
    const [hoverOpen, setHoverOpen] = useState(false);

    const isMobile = useMobile();

    const displayed = isMobile ? false : collapsed && !hoverOpen;

    return (
      <aside
        ref={ref}
        className={cn(
          "h-screen border-r border-border bg-surface-panel flex flex-col sam-transition",
          "fixed md:relative inset-y-0 left-0 z-30 flex-shrink-0",
          !isMobile && (displayed ? "w-16" : "w-64"),
          isMobile && "w-64 translate-x-full",
          isMobile && "data-[open=true]:translate-x-0",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-purple-500/50 rounded-lg flex items-center justify-center flex-shrink-0 sam-mono font-bold text-xs">
              SAM
            </div>
            {!displayed && <span className="font-bold text-lg sam-mono tracking-wider">MUSIC</span>}
          </div>
          {!isMobile && (
            <SAMButton size="icon-xs" variant="ghost" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </SAMButton>
          )}
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto py-2 sam-scrollbar-hide"
          onMouseEnter={() => !isMobile && collapsed && setHoverOpen(true)}
          onMouseLeave={() => !isMobile && setHoverOpen(false)}
        >
          {SIDEBAR_ITEMS.map((item) => (
            <SAMSidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
              collapsed={displayed}
              onClick={() => {
                if (isMobile) useUIStore.getState().setMobileNavOpen(false);
              }}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          {currentProjectId && !displayed && (
            <div className="mb-2 px-3 py-1.5 bg-muted/20 rounded-md">
              <div className="text-xs font-medium sam-mono">Project: {currentProjectId.slice(0, 8)}</div>
            </div>
          )}
          <SAMSidebarItem
            href="/settings"
            icon={<User className="h-4 w-4" />}
            label={"Account"}
            collapsed={displayed}
          />
          <SAMSidebarItem
            href="/login"
            icon={<LogOut className="h-4 w-4" />}
            label={"Logout"}
            collapsed={displayed}
          />
        </div>
      </aside>
    );
  }
);
SAMSidebar.displayName = "SAMSidebar";

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export { SAMSidebar, SAMSidebarItem };
