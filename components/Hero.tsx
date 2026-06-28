"use client";

import { motion } from "framer-motion";
import { HeroBackground } from "@/components/background/HeroBackground";
import { SponsorMarquee } from "@/components/SponsorMarquee";
import { Button } from "@/components/ui/Button";
import { HERO_CTAS, SITE } from "@/data/site";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-end px-4 pb-10 pt-28 text-center sm:px-6 sm:pb-14 sm:pt-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan sm:text-sm"
          >
            Stanford XR Presents
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-hero-title font-normal leading-[1.05]"
          >
            <span className="block bg-gradient-to-r from-white via-neon-purple-light to-neon-violet bg-clip-text text-[3.375rem] text-transparent sm:text-[5.625rem] lg:text-[6.75rem]">
              Immerse the Bay
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 font-sans text-2xl font-semibold tracking-wide text-foreground/90 sm:mt-6 sm:text-3xl lg:text-4xl"
          >
            {SITE.heroTagline}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-5 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-neon-cyan/80 sm:text-base"
          >
            {SITE.eventDate}
            <span className="mx-2.5 text-neon-cyan/50" aria-hidden>
              •
            </span>
            {SITE.eventLocation}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {HERO_CTAS.map((cta) => (
              <Button key={cta.label} href={cta.href} variant={cta.variant}>
                {cta.label}
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full shrink-0">
        <SponsorMarquee />
      </div>
    </section>
  );
}
