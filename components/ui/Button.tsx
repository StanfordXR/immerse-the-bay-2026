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

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-neon-purple/90 text-white border-neon-purple shadow-glow-purple hover:bg-neon-purple hover:shadow-glow-purple-lg",
  secondary:
    "bg-surface/60 text-foreground border-neon-purple/40 backdrop-blur-md hover:border-neon-purple/70 hover:shadow-glow-purple",
  ghost:
    "bg-transparent text-muted border-white/10 hover:border-neon-purple/50 hover:text-foreground",
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
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </motion.a>
  );
}
