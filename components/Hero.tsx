"use client";

import { motion } from "framer-motion";
import { HeroBackground } from "@/components/background/HeroBackground";
import { SponsorMarquee } from "@/components/SponsorMarquee";
import { Button } from "@/components/ui/Button";
import { HERO_CTAS, SITE } from "@/data/site";
import { fadeUp, staggerContainer } from "@/lib/motion";

function HudFrame() {
  return (
    <div
      className="pointer-events-none absolute inset-x-4 bottom-6 top-24 z-10 hidden sm:inset-x-8 sm:block"
      aria-hidden
    >
      {/* corner brackets */}
      <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-neon-purple-light/50" />
      <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-neon-purple-light/50" />
      <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-neon-purple-light/50" />
      <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-neon-purple-light/50" />

      {/* HUD microtext */}
      <span className="absolute left-8 top-0 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-neon-purple-light/50">
        sys://immerse_the_bay
      </span>
      <span className="absolute right-8 top-0 font-mono text-[0.6rem] tracking-[0.25em] text-neon-purple-light/50">
        37.4275° N / 122.1697° W
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <HeroBackground />
      <HudFrame />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-end px-4 pb-10 pt-28 text-center sm:px-6 sm:pb-14 sm:pt-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan sm:text-sm"
          >
            <span className="h-px w-8 bg-neon-cyan/40" aria-hidden />
            Stanford XR Presents
            <span className="h-px w-8 bg-neon-cyan/40" aria-hidden />
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-hero-title font-normal leading-[1.05]"
          >
            <span
              data-text="Immerse the Bay"
              className="glitch-text block bg-gradient-to-r from-white via-neon-purple-light to-neon-violet bg-clip-text text-[3.375rem] text-transparent sm:text-[5.625rem] lg:text-[6.75rem]"
            >
              Immerse the Bay
            </span>
            {/* neither demo display font ships digit glyphs — mono keeps it deliberate */}
            <span className="mt-1 block font-mono text-3xl tracking-[0.4em] text-neon-fuchsia sm:mt-2 sm:text-4xl">
              2026
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 font-glitch text-2xl uppercase tracking-wide text-foreground/90 sm:mt-6 sm:text-3xl lg:text-4xl"
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
