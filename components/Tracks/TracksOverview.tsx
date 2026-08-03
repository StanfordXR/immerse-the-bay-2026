"use client";

import { motion } from "framer-motion";
import { TRACKS_OVERVIEW } from "@/data/tracks";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp } from "@/lib/motion";

function TrackList({ title, items }: { title: string; items: string[] }) {
  return (
    <GlassCard hover={false} className="h-full">
      <p className="font-mono text-xs uppercase tracking-wider text-neon-cyan">{title}</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-foreground/90">
            <span className="text-neon-indigo">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function TracksOverview({ embedded = false }: { embedded?: boolean }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={embedded ? undefined : "mb-16"}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TrackList title="Sponsored Tracks" items={TRACKS_OVERVIEW.sponsored} />
        <TrackList
          title="Primary Tracks"
          items={[
            ...TRACKS_OVERVIEW.primary,
            TRACKS_OVERVIEW.bonus,
            "General competition prizes",
          ]}
        />
      </div>
    </motion.section>
  );
}
