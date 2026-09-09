"use client";
import React from "react";
import { cn } from "@/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";

const SAMInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
          "border-border placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
SAMInput.displayName = "SAMInput";

const SAMTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm",
        "border-border placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 resize-y",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
SAMTextarea.displayName = "SAMTextarea";

const SAMLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn("text-sm font-medium leading-none text-muted-foreground", className)}
      {...props}
    />
  )
);
SAMLabel.displayName = LabelPrimitive.Root.displayName;

interface SAMFormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  onChange?: (value: string) => void;
}

const SAMFormInput = React.forwardRef<HTMLInputElement, SAMFormInputProps>(
  ({ label, className, id, onChange, value, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-") || crypto.randomUUID()}`;
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">{label}</label>}
        <SAMInput ref={ref} id={inputId} className={className} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} {...props} />
      </div>
    );
  }
);
SAMFormInput.displayName = "SAMFormInput";

export { SAMInput, SAMTextarea, SAMLabel, SAMFormInput };
