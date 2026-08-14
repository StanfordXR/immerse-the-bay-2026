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
      {/* slight corner vignette so the art frames the title without competing */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(115%_90%_at_50%_45%,transparent_55%,rgba(5,3,18,0.5)_100%)]"
      />
      <HudFrame />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 pb-6 pt-24 text-center sm:px-6 sm:pb-12 sm:pt-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-[20rem] flex-col items-center translate-y-4 sm:max-w-none sm:translate-y-12 lg:translate-y-14"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.18em] text-neon-cyan sm:text-sm sm:tracking-[0.3em]"
          >
            <span className="h-px w-8 bg-neon-cyan/40" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/SXRLogo.png"
              alt=""
              className="h-6 w-6 shrink-0 object-contain sm:h-8 sm:w-8"
            />
            Stanford XR Presents
            <span className="h-px w-8 bg-neon-cyan/40" aria-hidden />
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-hero-title font-normal leading-[1.05]"
          >
            <span
              data-text="Immerse the Bay"
              className="glitch-text block bg-gradient-to-r from-white via-neon-purple-light to-neon-violet bg-clip-text text-[2.75rem] text-transparent sm:text-[5.625rem] lg:text-[6.75rem]"
            >
              Immerse the Bay
            </span>
            {/* neither demo display font ships digit glyphs — mono keeps it deliberate */}
            <span className="mt-1 block font-mono text-2xl tracking-[0.28em] text-neon-fuchsia sm:mt-2 sm:text-4xl sm:tracking-[0.4em]">
              2026
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 font-glitch text-xl uppercase tracking-wide text-foreground/90 [text-shadow:0_0_14px_rgba(255,255,255,0.55),0_0_36px_rgba(255,255,255,0.35),0_0_64px_rgba(255,255,255,0.18),0_2px_12px_rgba(0,0,0,0.65)] sm:mt-6 sm:text-3xl lg:text-4xl"
          >
            {SITE.heroTagline}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-5 flex flex-col items-center gap-1"
          >
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-white sm:text-base">
              {SITE.eventDate}
            </p>
            <p className="font-sans text-xs tracking-[0.14em] text-white/80 sm:text-sm">
              {SITE.eventDateNote}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {HERO_CTAS.map((cta) => (
              <Button
                key={cta.label}
                href={cta.href}
                variant={cta.variant}
                external={"external" in cta ? cta.external : false}
                tooltip={cta.tooltip}
              >
                {cta.label}
              </Button>
            ))}
          </motion.div>

          {/* Static scroll cue: hero art fills the viewport, so first-time
              visitors need a signifier that the page continues (NN/g's
              "illusion of completeness"). A real link to the next section,
              not decoration — no animation, visibility comes from size,
              contrast, and glow instead. */}
          <motion.a
            variants={fadeUp}
            href="#about"
            aria-label="Scroll down to learn more"
            className="group mt-8 flex flex-col items-center gap-1.5 glow-drop-soft transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-purple-light"
          >
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-foreground/85 [text-shadow:0_0_10px_rgba(240,234,255,0.45)] transition group-hover:text-foreground">
              Scroll
            </span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              aria-hidden
              className="text-neon-purple-light drop-shadow-[0_0_8px_rgba(192,132,252,0.6)] transition group-hover:translate-y-0.5"
            >
              <path d="M4 5.5l7 7 7-7" stroke="currentColor" strokeWidth="2" />
              <path
                d="M4 12l7 7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.45"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>

      <div className="relative z-10 w-full shrink-0">
        <SponsorMarquee />
      </div>
    </section>
  );
}
