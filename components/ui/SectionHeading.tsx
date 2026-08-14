"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.header
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={cn(
        "mb-8 max-w-2xl sm:mb-12",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-neon-cyan",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-8 bg-neon-purple-light/40" aria-hidden />
          <span>{`// ${eyebrow}`}</span>
          <span className="h-px w-8 bg-neon-purple-light/40" aria-hidden />
        </p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </motion.header>
  );
}
