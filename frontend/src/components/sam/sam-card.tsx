"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const samCardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-border shadow-md",
        elevated: "border-border bg-background/50 shadow-lg",
        panel: "border-border bg-background/30 shadow-sm",
        interactive: "border-border hover:border-primary/40 cursor-pointer transition-colors",
        compact: "border-border p-3 shadow-sm",
      },
      padding: {
        none: "p-0",
        xs: "p-3",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

interface SamCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof samCardVariants> {}

const SAMCard = React.forwardRef<HTMLDivElement, SamCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div ref={ref} className={cn(samCardVariants({ variant, padding, className }))} {...props} />
  )
);
SAMCard.displayName = "SAMCard";

const SAMCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-6 pt-6 first:pt-6", className)} {...props} />
  )
);
SAMCardHeader.displayName = "SAMCardHeader";

const SAMCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
SAMCardTitle.displayName = "SAMCardTitle";

const SAMCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
SAMCardDescription.displayName = "SAMCardDescription";

const SAMCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
SAMCardContent.displayName = "SAMCardContent";

const SAMCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
SAMCardFooter.displayName = "SAMCardFooter";

const SAMPanel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "border border-border bg-background/30 shadow-sm overflow-hidden",
        className
      )}
      {...props}
    />
  )
);
SAMPanel.displayName = "SAMPanel";

export {
  SAMCard,
  SAMCardHeader,
  SAMCardTitle,
  SAMCardDescription,
  SAMCardContent,
  SAMCardFooter,
  SAMPanel,
  samCardVariants,
};
