"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Home, Music, SquarePlay, Folder, Library,
  Mic, Scissors, Piano, Brain, BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

const MOBILE_NAV_ITEMS = [
  { href: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Home" },
  { href: "/create", icon: <Music className="h-5 w-5" />, label: "Create" },
  { href: "/studio", icon: <SquarePlay className="h-5 w-5" />, label: "Studio" },
  { href: "/library", icon: <Library className="h-5 w-5" />, label: "Library" },
  { href: "/profile", icon: <Mic className="h-5 w-5" />, label: "Profile" },
];

const SAMBottomNav = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({}, ref) => {
  const pathname = usePathname();
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);

  return (
    <div
      ref={ref}
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-40",
        "border-t border-border bg-surface-panel/95 backdrop-blur-sm",
        "sam-transition-transform duration-300",
        !mobileNavOpen && "translate-y-0",
      )}
    >
      <div className="flex items-around justify-between h-16 px-2 sam-mono">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center flex-1 py-2">
              <div
                className={cn(
                  "flex flex-col items-center gap-0.5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

SAMBottomNav.displayName = "SAMBottomNav";

export { SAMBottomNav };
