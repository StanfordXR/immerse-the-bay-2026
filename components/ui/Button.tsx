"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const styles: Record<ButtonVariant, string> = {
  primary:
    "border-neon-purple-light/60 bg-gradient-to-r from-neon-violet/80 to-neon-purple/80 text-white shadow-glow hover:shadow-glow-purple",
  secondary:
    "border-neon-purple/40 bg-surface/50 text-foreground backdrop-blur-md hover:border-neon-purple-light/60 hover:shadow-glow",
  ghost:
    "border-white/10 bg-transparent text-muted hover:border-neon-violet/40 hover:text-foreground",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center border px-6 py-3 text-sm font-semibold tracking-wide transition-shadow duration-300",
        styles[variant],
        className,
      )}
    >
      {children}
    </motion.a>
  );
}
