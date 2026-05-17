"use client";

import { motion } from "framer-motion";
import { HeroBackground } from "@/components/background/HeroBackground";
import { Button } from "@/components/ui/Button";
import { HERO_CTAS, SITE } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-32 text-center sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-neon-purple sm:text-sm"
          >
            Stanford XR Presents
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            <span className="bg-gradient-to-r from-white via-neon-purple-light to-neon-purple bg-clip-text text-transparent">
              Immerse the Bay
            </span>
            <br />
            <span className="text-foreground/90">2026</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {SITE.description} Join hundreds of builders for a weekend of VR, AR,
            AI, gaming, and spatial innovation on the Stanford campus.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {HERO_CTAS.map((cta) => (
              <Button key={cta.label} href={cta.href} variant={cta.variant}>
                {cta.label}
              </Button>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-16 flex items-center gap-2 font-mono text-xs text-muted/70"
          >
            <motion.span
              className="inline-block h-2 w-2 rounded-full bg-neon-purple shadow-glow-purple"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Scroll to explore
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
