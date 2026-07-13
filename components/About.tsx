"use client";

import { motion } from "framer-motion";
import { ABOUT_BOXES, RECAP_VIDEO } from "@/data/site";
import { FloatingGallery } from "@/components/FloatingGallery";
import { StatsBar } from "@/components/StatsBar";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

function renderBoxBody(body: string, isList: boolean, horizontal = false) {
  if (!isList) {
    return (
      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
        {body}
      </p>
    );
  }

  const items = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <ul
      className={cn(
        "mt-3 text-sm leading-relaxed text-muted sm:text-base",
        horizontal
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-5"
          : "space-y-3 sm:space-y-3.5",
      )}
    >
      {items.map((item, index) => {
        const colonIndex = item.indexOf(":");

        if (colonIndex === -1) {
          return (
            <li key={`${item}-${index}`} className="flex items-start gap-2">
              <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-neon-purple-light" />
              <span>{item}</span>
            </li>
          );
        }

        const label = item.slice(0, colonIndex).trim();
        const content = item.slice(colonIndex + 1).trim();

        return (
          <li key={`${item}-${index}`} className="flex items-start gap-2">
            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-neon-purple-light" />
            <span>
              <span className="font-semibold text-neon-purple-light/90">{label}:</span>{" "}
              {content}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

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
  const immerseBox = ABOUT_BOXES.find((box) => box.id === "immerse");
  const expectBox = ABOUT_BOXES.find((box) => box.id === "expect");

  return (
    <section id="about" className="relative pt-20 sm:pt-28">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      <Container as="div">
        <SectionHeading
          eyebrow="About"
          title="The Bay Area’s leading XR hackathon."
          description="Join us for an incredible weekend of innovative building and pushing the boundaries of spatial computing."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid items-start gap-8 lg:grid-cols-5 lg:gap-10"
        >
          {immerseBox && (
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <GlassCard hover={false}>
                <h3 className="font-sans text-lg font-semibold sm:text-xl">
                  {immerseBox.title}
                </h3>
                {renderBoxBody(immerseBox.body, false)}
              </GlassCard>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="w-full lg:col-span-3">
            <RecapVideo />
          </motion.div>
        </motion.div>

        {expectBox && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="mt-8">
            <GlassCard hover={false} className="w-full">
              <h3 className="font-sans text-lg font-semibold sm:text-xl">
                {expectBox.title}
              </h3>
              {renderBoxBody(expectBox.body, true, true)}
            </GlassCard>
          </motion.div>
        )}
      </Container>

      <div className="mt-8 w-full sm:mt-10">
        <StatsBar />
        <FloatingGallery />
      </div>
    </section>
  );
}
