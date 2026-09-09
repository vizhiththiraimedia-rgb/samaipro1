"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const samBadgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary text-primary-foreground",
        success: "bg-green-500/20 text-green-400",
        warning: "bg-amber-500/20 text-amber-400",
        error: "bg-red-500/20 text-red-400",
        outline: "border border-border text-muted-foreground",
        mono: "bg-muted/30 text-muted-foreground font-mono",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-1.5 py-0.25 text-[10px]",
        xs: "px-1 py-0 text-[9px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface SamBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof samBadgeVariants> {
  size?: "default" | "sm" | "xs";
}

const SAMBadge = React.forwardRef<HTMLDivElement, SamBadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div ref={ref} className={cn(samBadgeVariants({ variant, size, className }))} {...props} />
  )
);
SAMBadge.displayName = "SAMBadge";

const SAMStatusBadge = React.forwardRef<HTMLDivElement, SamBadgeProps & { status?: "running" | "idle" | "error" | "completed" | "pending" | "processing" | "active" | "draft" | "success" | "warning" }>(
  ({ className, variant, size, status, children, ...props }, ref) => {
    const statusVariant = {
      running: "success",
      completed: "success",
      idle: "default",
      error: "error",
      pending: "warning",
      processing: "primary",
      active: "success",
      draft: "default",
      success: "success",
      warning: "warning",
    }[status || "idle"] as "default" | "primary" | "success" | "warning" | "error" | "outline" | "mono";

    const statusText = {
      running: "Running",
      completed: "Active",
      idle: "Idle",
      error: "Error",
      pending: "Pending",
      processing: "Processing",
      active: "Active",
      draft: "Draft",
      success: "Success",
      warning: "Warning",
    }[status || "idle"];

    return (
      <SAMBadge ref={ref} variant={variant || statusVariant} size={size} className={cn("gap-1", className)} {...props}>
        {status && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
                status === "running" ? "bg-green-400 animate-pulse" :
                status === "error" ? "bg-red-400" :
                status === "pending" || status === "processing" || status === "warning" ? "bg-amber-400" :
                status === "active" ? "bg-blue-400" :
                "bg-muted-foreground"
            )}
          />
        )}
        {children || statusText}
      </SAMBadge>
    );
  }
);
SAMStatusBadge.displayName = "SAMStatusBadge";

const SAMModelBadge = React.forwardRef<HTMLDivElement, SamBadgeProps & { modelType?: string }>(
  ({ className, modelType, children, ...props }, ref) => {
    const modelTypeColor = {
      music: "text-primary",
      vocal: "text-purple-400",
      stem: "text-blue-400",
      midi: "text-green-400",
      audio: "text-orange-400",
      lyrics: "text-pink-400",
      mix: "text-cyan-400",
      master: "text-yellow-400",
    }[modelType || ""] as string;

    return (
      <SAMBadge ref={ref} variant="outline" className={cn("font-mono text-xs", modelTypeColor, className)} {...props}>
        {children || modelType?.toUpperCase()}
      </SAMBadge>
    );
  }
);
SAMModelBadge.displayName = "SAMModelBadge";

export { SAMBadge, SAMStatusBadge, SAMModelBadge, samBadgeVariants };
