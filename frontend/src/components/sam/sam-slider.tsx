"use client";
import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SamSliderProps {
  value?: number | number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  onChange?: (value: number) => void;
  className?: string;
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  disabled?: boolean;
  size?: "sm" | "md";
}

const SAMSlider = React.forwardRef<HTMLDivElement, SamSliderProps>(
  ({ className, value, min = 0, max = 100, step = 1, onValueChange, onChange, label, showValue, valueFormatter, disabled, size = "md" }, ref) => {
    const val = Array.isArray(value) ? value[0] : value;
    const normalizedValue: number[] = [val ?? 0];
    const handleValueChange = onChange
      ? (v: number[]) => onChange(v[0])
      : onValueChange;
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground font-medium">{label}</label>
            {showValue && (
              <span className={cn("text-xs font-mono text-muted-foreground/70", size === "sm" && "text-[10px]")}>
                {valueFormatter ? valueFormatter(val ?? 0) : `${Math.round(val ?? 0)}%`}
              </span>
            )}
          </div>
        )}
        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            "relative flex w-full cursor-pointer -touch-none select-none items-center",
            "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          value={normalizedValue}
          min={min}
          max={max}
          step={step}
          onValueChange={handleValueChange}
          disabled={disabled}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
            <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className={cn(
            "block h-3.5 w-3.5 rounded-full border border-border",
            "bg-primary transition-colors",
            "hover:brightness-110 focus:outline-none",
            "disabled:pointer-events-none disabled:opacity-50",
          )} />
        </SliderPrimitive.Root>
      </div>
    );
  }
);
SAMSlider.displayName = "SAMSlider";

export { SAMSlider };
