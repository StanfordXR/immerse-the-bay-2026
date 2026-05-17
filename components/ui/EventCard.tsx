"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

interface EventCardProps {
  time: string;
  title: string;
  description: string;
  index: number;
}

export function EventCard({ time, title, description, index }: EventCardProps) {
  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      className="group relative rounded-xl border border-white/10 bg-surface/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-neon-purple/40 hover:shadow-glow-purple"
    >
      <time className="font-mono text-xs uppercase tracking-wider text-neon-purple">
        {time}
      </time>
      <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </motion.article>
  );
}
