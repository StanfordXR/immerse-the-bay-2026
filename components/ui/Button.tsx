"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
  tooltip?: string;
}

/* Notched frames are built from two clipped layers: the outer layer paints the
 * border color, the inner layer paints the fill 1px smaller. Glow lives on the
 * unclipped anchor so it follows the notched silhouette. */
const frameStyles: Record<ButtonVariant, string> = {
  primary: "bg-neon-purple-light/70",
  secondary: "bg-neon-purple/50",
  ghost: "bg-white/15",
};

const fillStyles: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-neon-violet to-neon-purple text-white",
  secondary:
    "bg-surface/90 text-foreground backdrop-blur-md group-hover:bg-surface/70",
  ghost: "bg-void/80 text-muted group-hover:text-foreground",
};

const glowStyles: Record<ButtonVariant, string> = {
  primary: "glow-drop",
  secondary: "hover:glow-drop-soft",
  ghost: "",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external = false,
  tooltip,
}: ButtonProps) {
  const button = (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group inline-flex transition-[filter] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-purple-light",
        glowStyles[variant],
        className,
      )}
    >
      <span className={cn("cyber-clip inline-flex p-px", frameStyles[variant])}>
        <span
          className={cn(
            "cyber-clip inline-flex items-center justify-center px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300 sm:px-6 sm:text-sm sm:tracking-[0.15em]",
            fillStyles[variant],
          )}
        >
          {children}
        </span>
      </span>
    </motion.a>
  );

  if (!tooltip) return button;

  return (
    <span className="group/tooltip relative inline-flex">
      {button}
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap border border-white/10 bg-navy/95 px-3 py-1.5 text-xs text-neon-cyan opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100"
        role="tooltip"
      >
        {tooltip}
      </span>
    </span>
  );
}
