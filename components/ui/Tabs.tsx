"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  compact?: boolean;
}

export function TabButton({ id, label, isActive, onClick, compact }: TabButtonProps) {
  return (
    <button
      id={`tab-${id}`}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      onClick={onClick}
      className={cn(
        "border font-medium transition",
        compact ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm",
        isActive
          ? "border-neon-cyan/50 bg-neon-indigo/20 text-foreground shadow-glow-cyan"
          : "border-white/10 bg-surface/40 text-muted hover:border-neon-blue/30",
      )}
    >
      {label}
    </button>
  );
}

interface TabPanelProps {
  id: string;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ id, labelledBy, children, className }: TabPanelProps) {
  return (
    <div
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </div>
  );
}
