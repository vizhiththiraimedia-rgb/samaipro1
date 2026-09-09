"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Bell, Check, X, Trash2 } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { SAMButton } from "./sam-button";
import { SAMSeparator } from "./sam-separator";

const SAMNotificationCenter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({}, ref) => {
  const notifications = useUIStore((s) => s.notifications);
  const markRead = useUIStore((s) => s.markNotificationRead);
  const clear = useUIStore((s) => s.clearNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-14 right-4 z-[var(--sam-z-popover)]",
        "w-80 max-h-96 overflow-hidden",
        "border border-border bg-card rounded-xl shadow-xl",
        "sam-transition-all duration-200"
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-border sam-mono">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="font-medium text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-primary text-xs text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <SAMButton size="icon-xs" variant="ghost" title="Mark all as read">
              <Check className="h-3 w-3" />
            </SAMButton>
          )}
          <SAMButton size="icon-xs" variant="ghost" title="Clear all" onClick={clear}>
            <Trash2 className="h-3 w-3" />
          </SAMButton>
        </div>
      </div>

      <div className="overflow-y-auto max-h-72">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "p-3 border-b border-border last:border-0 transition-colors",
                !n.read && "bg-primary/5",
              )}
            >
              <div className="flex items-start gap-2.5">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-0.5 flex-shrink-0",
                  n.type === "success" ? "bg-green-400" :
                  n.type === "error" ? "bg-red-400" :
                  n.type === "warning" ? "bg-amber-400" :
                  "bg-primary"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.message}</div>
                  <div className="text-xs text-muted-foreground/50 mt-1 sam-mono">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-0.5" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

SAMNotificationCenter.displayName = "SAMNotificationCenter";

export { SAMNotificationCenter };
