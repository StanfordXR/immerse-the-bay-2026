"use client";

import { motion } from "framer-motion";
import type { Track } from "@/data/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { scaleIn } from "@/lib/motion";

interface TrackCardProps {
  track: Track;
}

function DetailList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-neon-cyan">{label}</p>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-neon-indigo">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrackCard({ track }: TrackCardProps) {
  return (
    <motion.article variants={scaleIn}>
      <GlassCard className="h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="inline-flex h-11 w-11 items-center justify-center border border-neon-cyan/30 bg-neon-indigo/10 font-mono text-xl text-neon-cyan"
              aria-hidden
            >
              {track.icon}
            </span>
            <h3 className="mt-4 font-sans text-xl font-semibold">{track.title}</h3>
            <p className="mt-1 text-sm text-neon-cyan/90">{track.theme}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">{track.description}</p>

        <p className="mt-4 font-mono text-xs text-muted">
          Sponsors:{" "}
          <span className="text-foreground">{track.sponsors.join(" · ")}</span>
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <DetailList label="Hardware" items={track.hardware} />
          <DetailList label="Software" items={track.software} />
          <DetailList label="APIs / SDKs" items={track.apis} />
        </div>

        <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm text-muted">
          <p>
            <span className="font-medium text-foreground">Mentors: </span>
            {track.mentors}
          </p>
          <p>
            <span className="font-medium text-foreground">Resources: </span>
            {track.resources}
          </p>
        </div>
      </GlassCard>
    </motion.article>
  );
}
