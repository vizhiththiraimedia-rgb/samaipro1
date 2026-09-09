"use client";
import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SamKnobProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  label?: string;
  onChange: (value: number) => void;
  onRelease?: (value: number) => void;
  variant?: "default" | "fader" | "circular";
  color?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  disabled?: boolean;
}

const SAMKnob = React.forwardRef<HTMLDivElement, SamKnobProps>(
  ({ value, min = 0, max = 1, size = 44, label, onChange, onRelease, variant = "circular", color = "hsl(var(--sam-accent))", showValue, valueFormatter, disabled }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const rafRef = useRef<number | undefined>(undefined);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const angle = ((localValue - min) / (max - min)) * 270 - 135;

    const handlePointerDown = (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
    };

    const handlePointerMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging || disabled) return;
        const deltaY = e.clientY - (window.innerHeight / 2);
        const sensitivity = 0.5;
        const newValue = Math.max(min, Math.min(max, localValue - deltaY * sensitivity / 100));
        const stepped = Math.round(newValue / (max === 1 ? 0.01 : 1)) * (max === 1 ? 0.01 : 1);
        setLocalValue(stepped);
        onChange(stepped);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {});
      },
      [isDragging, localValue, min, max, onChange, disabled]
    );

    const handlePointerUp = React.useCallback(
      (e: MouseEvent) => {
        if (disabled) return;
        setIsDragging(false);
        onRelease?.(localValue);
      },
      [localValue, onRelease, disabled]
    );

    useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handlePointerMove);
        window.addEventListener("mouseup", handlePointerUp);
        return () => {
          window.removeEventListener("mousemove", handlePointerMove);
          window.removeEventListener("mouseup", handlePointerUp);
        };
      }
    }, [isDragging, handlePointerMove, handlePointerUp]);

    if (variant === "fader") {
      return (
        <div ref={ref} className="flex flex-col items-center gap-1">
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
          <div
            className={cn(
              "w-6 h-32 relative rounded-full bg-gradient-to-b from-muted via-muted to-muted",
              "cursor-pointer group",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onPointerDown={handlePointerDown}
          >
            <div
              className="absolute bottom-0 w-full rounded-b-full transition-all"
              style={{
                height: `${((localValue - min) / (max - min)) * 100}%`,
                background: `linear-gradient(to top, ${color}, ${color})`,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
            <div
              className="absolute w-6 h-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border"
              style={{
                bottom: `${((localValue - min) / (max - min)) * 100}%`,
                borderColor: color,
                background: color,
              }}
            />
          </div>
          {showValue && <span className="text-xs font-mono text-muted-foreground mt-1">{valueFormatter ? valueFormatter(localValue) : localValue.toFixed(2)}</span>}
        </div>
      );
    }

    return (
      <div ref={ref} className="flex flex-col items-center gap-1">
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
        <div
          className={cn(
            "relative rounded-full cursor-pointer group transition-transform",
            isDragging && "scale-105",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ width: size, height: size }}
          onPointerDown={handlePointerDown}
        >
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 4}
              fill="none"
              stroke="hsl(var(--sam-grid))"
              strokeWidth="2"
              className="opacity-50"
            />
            <path
              d={arcPath(size / 2 - 4, size / 2 - 4, size / 2 - 4, -135, angle)}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              className="transition-stroke 0.1s"
            />
            <circle cx={size / 2} cy={size / 2} r={size / 2 - 16} fill="hsl(var(--sam-surface-panel))" />
          </svg>
          {showValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono text-muted-foreground">
                {valueFormatter ? valueFormatter(localValue) : Math.round(localValue)}
              </span>
            </div>
          )}
        </div>
        {showValue && <span className="text-xs font-mono text-muted-foreground mt-1">{valueFormatter ? valueFormatter(localValue) : Math.round(localValue)}</span>}
      </div>
    );
  }
);

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function arcPath(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

SAMKnob.displayName = "SAMKnob";

export { SAMKnob };
