"use client";

import { motion } from "framer-motion";
import type { ScheduleEvent } from "@/data/types";

interface ScheduleEventCardProps {
  event: ScheduleEvent;
  index: number;
}

export function ScheduleEventCard({ event }: ScheduleEventCardProps) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="border border-white/10 bg-surface/50 p-5 backdrop-blur-md transition hover:border-neon-cyan/30 hover:shadow-glow"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {event.icon && (
            <span
              className="flex h-9 w-9 items-center justify-center border border-neon-indigo/30 bg-neon-indigo/10 font-mono text-neon-cyan"
              aria-hidden
            >
              {event.icon}
            </span>
          )}
          <div>
            <time className="font-mono text-xs uppercase tracking-wider text-neon-cyan">
              {event.time}
            </time>
            {event.host && (
              <p className="font-mono text-xs uppercase tracking-wider text-neon-purple-light/90">
                {event.host}
              </p>
            )}
            <h3 className="font-sans text-lg font-semibold">{event.title}</h3>
          </div>
        </div>
        <p className="border border-white/10 bg-void/50 px-3 py-1 font-mono text-xs text-muted">
          {event.location}
        </p>
      </div>
      {event.description ? (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
          {event.description}
        </p>
      ) : null}
    </motion.article>
  );
}
