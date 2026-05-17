"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, slideInLeft, staggerContainer } from "@/lib/motion";

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <motion.div
        className="absolute inset-0 bg-section-glow pointer-events-none"
        aria-hidden
      />
      <motion.div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About"
          title="Where immersive builders ship the future"
          description="Immerse the Bay is Stanford XR's flagship hackathon — a high-energy weekend for students and creators pushing VR, AR, AI, and spatial computing forward."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-8 lg:grid-cols-2 lg:gap-12"
        >
          <motion.div variants={slideInLeft} className="space-y-6">
            <GlassCard hover={false}>
              <h3 className="font-display text-xl font-semibold text-foreground">
                Our mission
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                We bring together designers, engineers, artists, and researchers to
                prototype bold immersive experiences. Whether you are shipping your
                first Quest app or exploring neural radiance fields, you will find
                mentors, hardware, and a community that shares your obsession with
                presence and play.
              </p>
            </GlassCard>
            <GlassCard>
              <h3 className="font-display text-lg font-semibold text-foreground">
                What to expect
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li className="flex gap-2">
                  <span className="text-neon-purple">▸</span>
                  Hands-on workshops with industry partners
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-purple">▸</span>
                  Loaner headsets, sensors, and dev kits
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-purple">▸</span>
                  Track prizes and sponsor challenges
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-purple">▸</span>
                  Demo fair with XR leaders and investors
                </li>
              </ul>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp}>
            <GlassCard className="overflow-hidden p-0" hover={false}>
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-void via-surface to-neon-purple/20">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-neon-purple/50 bg-neon-purple/20 shadow-glow-purple">
                    <span className="ml-1 text-2xl text-neon-purple">▶</span>
                  </div>
                </motion.div>
                {/* Set iframe src to your recap YouTube/Vimeo embed URL */}
                <iframe
                  className="absolute inset-0 h-full w-full opacity-0 pointer-events-none"
                  src=""
                  title="Immerse the Bay — Last Year's Recap"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="border-t border-white/10 p-4">
                <p className="font-mono text-xs uppercase tracking-wider text-neon-purple">
                  Recap
                </p>
                <p className="mt-1 text-sm text-muted">
                  Watch highlights from last year&apos;s hackathon — add your embed URL
                  to the iframe in AboutSection.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
