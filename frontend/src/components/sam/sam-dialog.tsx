"use client";
import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMDialog = DialogPrimitive.Root;
const SAMDialogTrigger = DialogPrimitive.Trigger;

interface SamDialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const SAMDialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, SamDialogContentProps>(
  ({ className, children, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      full: "max-w-[90vw] md:max-w-[85vw] max-h-[90vh]",
    };
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2",
            "gap-4 border bg-[hsl(var(--sam-surface)] text-[hsl(var(--sam-text-primary))]",
            "shadow-lg rounded-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:slide-out-to-left-1\/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1\/2 data-[state=open]:slide-in-from-top-[48%]",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity",
              "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sam-accent)]",
              "disabled:pointer-events-none",
            )}
          >
            <X className="h-4 w-4 text-[hsl(var(--sam-text-secondary)]" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }
);
SAMDialogContent.displayName = DialogPrimitive.Content.displayName;

const SAMDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SAMDialogHeader.displayName = "SAMDialogHeader";

const SAMDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
SAMDialogFooter.displayName = "SAMDialogFooter";

const SAMDialogTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
SAMDialogTitle.displayName = DialogPrimitive.Title.displayName;

const SAMDialogDescription = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-[hsl(var(--sam-text-secondary)]", className)}
      {...props}
    />
  )
);
SAMDialogDescription.displayName = DialogPrimitive.Description.displayName;

export { SAMDialog, SAMDialogTrigger, SAMDialogContent, SAMDialogHeader, SAMDialogFooter, SAMDialogTitle, SAMDialogDescription };
