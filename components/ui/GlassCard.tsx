"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  /** HUD-style corner brackets (top-left + bottom-right) */
  corners?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
  corners = true,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -3 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        "border border-white/10 bg-surface/50 p-6 shadow-lg backdrop-blur-xl",
        corners && "hud-corners",
        hover && "hover:border-neon-cyan/25 hover:shadow-glow",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
