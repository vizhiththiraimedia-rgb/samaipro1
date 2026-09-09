"use client";
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SamMeterProps {
  value: number;
  peak?: number;
  width?: number;
  height?: number;
  orientation?: "vertical" | "horizontal";
  type?: "vu" | "peak";
  color?: string;
  mindB?: number;
  maxdB?: number;
  className?: string;
}

const SAMMeter = React.forwardRef<HTMLDivElement, SamMeterProps>(
  ({ value, peak = 0, width = 6, height = 60, orientation = "vertical", type = "vu", color, mindB = -60, maxdB = 0, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = orientation === "vertical" ? width : height;
      const h = orientation === "vertical" ? height : width;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "hsl(220 20% 20%)";
      ctx.fillRect(0, 0, w, h);

      const barLen = (type === "vu" ? value : peak) * h;
      const clamped = Math.max(0, Math.min(1, barLen));

      if (clamped > 0.02) {
        const intensity = type === "vu" ? value : peak;
        let r = Math.floor(255 * (1 - intensity * 0.7));
        let g = Math.floor(255 * intensity);
        let b = Math.floor(60 * (1 - intensity));
        if (intensity < 0.3) { r = 60; g = Math.floor(255 * intensity / 0.3); b = 255; }
        else if (intensity < 0.7) { r = 80; g = 255; b = Math.floor(120 * (1 - (intensity - 0.3) / 0.4)); }
        else { r = 255; g = Math.max(0, Math.floor(255 * (1 - (intensity - 0.7) / 0.3))); b = 0; }

        const gradient = orientation === "vertical"
          ? ctx.createLinearGradient(0, h, 0, h - clamped)
          : ctx.createLinearGradient(0, 0, clamped, 0);
        gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
        gradient.addColorStop(1, `rgb(${Math.floor(r * 0.6)}, ${Math.floor(g * 0.6)}, ${Math.floor(b * 0.6)})`);
        ctx.fillStyle = gradient;

        if (orientation === "vertical") ctx.fillRect(0, h - clamped, w, clamped);
        else ctx.fillRect(0, 0, clamped, h);
      }

      ctx.strokeStyle = "hsl(220 20% 30%)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, w, h);
    }, [value, peak, type, orientation, width, height, mindB, maxdB]);

    return (
      <div
        ref={ref}
        className={cn("relative rounded-sm overflow-hidden border", className)}
        style={{ width: orientation === "vertical" ? width : height, height: orientation === "vertical" ? height : width }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        {type === "peak" && peak > 0 && peak > 0.8 && (
          <div className="absolute inset-0 bg-red-500/50 animate-pulse" style={{ opacity: peak > 0.95 ? 0.9 : 0.4 }} />
        )}
      </div>
    );
  }
);
SAMMeter.displayName = "SAMMeter";

export { SAMMeter };
