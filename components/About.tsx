"use client";

import { motion } from "framer-motion";
import { ABOUT_BOXES, RECAP_VIDEO } from "@/data/site";
import { FloatingGallery } from "@/components/FloatingGallery";
import { StatsBar } from "@/components/StatsBar";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer } from "@/lib/motion";

function RecapVideo() {
  const hasEmbed = Boolean(RECAP_VIDEO.embedUrl);

  return (
    <GlassCard className="h-full w-full overflow-hidden p-0" hover={false}>
      <div className="relative aspect-video w-full min-h-[220px] bg-gradient-to-br from-navy via-surface to-neon-purple/25 sm:min-h-[280px]">
        {hasEmbed ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={RECAP_VIDEO.embedUrl}
            title={RECAP_VIDEO.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
            <div className="flex h-16 w-16 items-center justify-center border border-neon-purple-light/50 bg-neon-violet/20 shadow-glow-purple">
              <span className="ml-1 text-2xl text-neon-purple-light" aria-hidden>
                ▶
              </span>
            </div>
            <p className="max-w-xs text-center text-sm text-muted">
              {RECAP_VIDEO.description}
            </p>
            <p className="text-center text-xs text-muted/70">
              Add embed URL in <code className="text-neon-purple-light">data/site.ts</code>
            </p>
          </div>
        )}
      </div>
      <div className="border-t border-white/10 px-4 py-3">
        <p className="font-mono text-xs uppercase tracking-wider text-neon-purple-light">
          {RECAP_VIDEO.title}
        </p>
      </div>
    </GlassCard>
  );
}

export function About() {
  return (
    <section id="about" className="relative pt-20 sm:pt-28">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      <Container as="div">
        <SectionHeading
          eyebrow="About"
          title="The hackathon behind Stanford's XR movement"
          description="Learn what Immerse the Bay is, who we are, and relive last year's highlights."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid items-start gap-8 lg:grid-cols-5 lg:gap-10"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-5 lg:col-span-2">
            {ABOUT_BOXES.map((box) => (
              <GlassCard key={box.id} hover={false}>
                <h3 className="font-sans text-lg font-semibold sm:text-xl">
                  {box.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {box.body}
                </p>
              </GlassCard>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="w-full lg:col-span-3">
            <RecapVideo />
          </motion.div>
        </motion.div>
      </Container>

      <div className="mt-8 w-full sm:mt-10">
        <StatsBar />
        <FloatingGallery />
      </div>
    </section>
  );
}
