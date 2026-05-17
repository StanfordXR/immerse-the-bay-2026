"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.25 } } : undefined}
      className={cn(
        "rounded-2xl border border-white/10 bg-surface/40 p-6 shadow-lg backdrop-blur-xl",
        hover && "hover:border-neon-purple/30 hover:shadow-glow-purple",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
