"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const samButtonVariants = cva(
  cn(
    "inline-flex items-center justify-center whitespace-nowrap font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "transition-all duration-150",
    "border border-transparent",
    "[&_svg]:pointer-events-none [&_svg]:center [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-[hsl(var(--sam-accent))] text-white hover:brightness-110 hover:shadow-lg hover:shadow-[hsl(var(--sam-accent))]/20",
        secondary:
          "bg-[hsl(var(--sam-surface-panel)] text-[hsl(var(--sam-text-primary))] hover:bg-[hsl(var(--sam-surface-elevated))",
        ghost:
          "text-[hsl(var(--sam-text-secondary))] hover:bg-[hsl(var(--sam-surface-panel)] hover:text-[hsl(var(--sam-text-primary))]",
        outline:
          "border-[hsl(var(--sam-border))] text-[hsl(var(--sam-text-primary))] hover:bg-[hsl(var(--sam-surface-panel)]",
        danger: "bg-[hsl(var(--sam-error))] text-white hover:brightness-110",
        musical:
          "bg-[hsl(var(--sam-accent))] text-white hover:brightness-110 shadow-md shadow-[hsl(var(--sam-accent))]/30",
      },
      size: {
        xs: "h-7 px-2.5 py-1 text-xs rounded",
        sm: "h-9 px-3 rounded-md text-sm",
        md: "h-10 px-4 py-2 rounded-md text-sm",
        lg: "h-12 px-5 py-2.5 rounded-lg text-base",
        xl: "h-14 px-6 py-3 rounded-lg text-lg",
        icon: "h-9 w-9 rounded-md",
        "icon-xs": "h-6 w-6 rounded",
        "icon-sm": "h-7 w-7 rounded",
        "icon-lg": "h-11 w-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface SamButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof samButtonVariants> {
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  asChild?: boolean;
}

const SAMButton = React.forwardRef<HTMLButtonElement, SamButtonProps>(
  ({ className, variant, size, isLoading, loading, leftIcon, children, disabled, asChild, ...props }, ref) => {
    const showLoading = isLoading || loading;
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string; disabled?: boolean }>, {
        className: cn(samButtonVariants({ variant, size, className }), (children.props as any)?.className),
        disabled: showLoading || disabled,
        ...props,
      });
    }
    return (
      <button
        className={cn(samButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={showLoading || disabled}
        {...props}
      >
        {showLoading ? (
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : leftIcon ? (
          <span className="mr-2 flex items-center">{leftIcon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);
SAMButton.displayName = "SAMButton";

export { SAMButton, samButtonVariants };
