"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SamSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  showClose?: boolean;
}

const SAMSheet = React.forwardRef<HTMLDivElement, SamSheetProps>(
  ({ open, onOpenChange, side = "right", className, children, title, description, showClose = true }, ref) => {
    const sideClasses = {
      left: "h-full top-0 bottom-0 left-0 w-80 max-w-full rounded-r-xl",
      right: "h-full top-0 bottom-0 right-0 w-80 max-w-full rounded-l-xl",
      top: "top-0 left-0 right-0 w-full max-h-[80vh] rounded-b-xl",
      bottom: "bottom-0 left-0 right-0 w-full max-h-[80vh] rounded-t-xl",
    };

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              ref={ref}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
            />
            <motion.div
              className={cn(
                "fixed z-50 border border-border bg-card shadow-xl",
                sideClasses[side],
                "flex flex-col",
                className
              )}
              initial={side === "right" ? { x: "100%" } : side === "left" ? { x: "-100%" } : side === "top" ? { y: "-100%" } : { y: "100%" }}
              animate={{ x: 0, y: 0 }}
              exit={side === "right" ? { x: "100%" } : side === "left" ? { x: "-100%" } : side === "top" ? { y: "-100%" } : { y: "100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {showClose && (
                <div className="flex items-center justify-between p-4 border-b border-border">
                  {title && <h3 className="font-semibold">{title}</h3>}
                  {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
                  <button
                    onClick={() => onOpenChange(false)}
                    className="ml-auto rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);
SAMSheet.displayName = "SAMSheet";

export { SAMSheet };
