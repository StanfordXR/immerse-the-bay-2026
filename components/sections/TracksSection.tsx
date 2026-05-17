"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TRACKS } from "@/lib/constants";
import { scaleIn, staggerContainer } from "@/lib/motion";

export function TracksSection() {
  return (
    <section id="tracks" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tracks"
          title="Six paths into immersive creation"
          description="Choose a track that matches your vision — or blend disciplines. Judges award excellence within each lane."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TRACKS.map((track, i) => (
            <motion.div key={track.id} variants={scaleIn} custom={i}>
              <GlassCard className="group h-full">
                <motion.span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-neon-purple/30 bg-neon-purple/10 font-mono text-2xl text-neon-purple shadow-glow-purple"
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  {track.icon}
                </motion.span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {track.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {track.description}
                </p>
                <motion.div
                  className="mt-4 h-0.5 w-0 bg-gradient-to-r from-neon-purple to-neon-magenta transition-all duration-500 group-hover:w-full"
                />
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
