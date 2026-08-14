"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ABOUT_BOXES, RECAP_VIDEO } from "@/data/site";
import { FloatingGallery } from "@/components/FloatingGallery";
import { StatsBar } from "@/components/StatsBar";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const EXPECT_ITEM_EMOJI: Record<string, string> = {
  "Next-Gen Hardware": "👾",
  "Industry Support": "💜",
  "Massive Prizes": "🔮",
  "Global Networking": "🦄",
  "All Weekend Long": "🟣",
};

function parseLabeledItems(body: string) {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((item) => {
      const colonIndex = item.indexOf(":");

      if (colonIndex === -1) {
        return { label: item, content: "" };
      }

      return {
        label: item.slice(0, colonIndex).trim(),
        content: item.slice(colonIndex + 1).trim(),
      };
    });
}

function ExpectSection({ title, body }: { title: string; body: string }) {
  const items = parseLabeledItems(body);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] ?? items[0];

  return (
    <GlassCard hover={false} className="w-full min-w-0">
      <h3 className="font-sans text-xl font-semibold sm:text-2xl">{title}</h3>

      <div className="mt-6 flex flex-col gap-4 sm:gap-5">
        <div
          role="tablist"
          aria-label="What to expect topics"
          className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3"
        >
          {items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`expect-panel-${index}`}
              id={`expect-tab-${index}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 border px-3 py-4 text-center text-xs font-medium transition sm:px-4 sm:py-4 sm:text-base lg:text-[0.95rem]",
                activeIndex === index
                  ? "border-neon-cyan/50 bg-neon-indigo/20 text-foreground shadow-glow-cyan"
                  : "border-white/10 bg-surface/40 text-muted hover:border-neon-blue/30 hover:text-foreground",
              )}
            >
              <span
                className="text-lg drop-shadow-[0_0_10px_rgb(192_132_252/0.45)] sm:text-xl"
                aria-hidden
              >
                {EXPECT_ITEM_EMOJI[item.label] ?? "🟣"}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`expect-panel-${activeIndex}`}
          aria-labelledby={`expect-tab-${activeIndex}`}
          className="min-h-[5rem] border border-white/10 bg-void/40 px-4 py-5 sm:min-h-[6rem] sm:px-7 sm:py-6"
        >
          <p className="break-words text-base leading-relaxed text-muted [overflow-wrap:anywhere] sm:text-lg lg:leading-relaxed">
            {activeItem.content}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

function renderProseBody(body: string) {
  const paragraphs = body
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="break-words [overflow-wrap:anywhere]">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function renderBoxBody(body: string, isList: boolean, horizontal = false) {
  if (!isList) {
    return renderProseBody(body);
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
    <GlassCard className="w-full min-w-0 overflow-hidden p-0 lg:h-full" hover={false}>
      <div className="relative aspect-video w-full min-w-0 overflow-hidden bg-gradient-to-br from-navy via-surface to-neon-purple/25">
        {hasEmbed ? (
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={RECAP_VIDEO.embedUrl}
            title={RECAP_VIDEO.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 sm:p-6">
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
      <div className="border-t border-white/10 px-4 py-3 sm:px-5">
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
    <section id="about" className="relative overflow-x-clip pt-20 sm:pt-28">
      <div className="bg-section-glow pointer-events-none absolute inset-x-0 -top-48 bottom-0" aria-hidden />
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
          className="grid min-w-0 items-start gap-6 sm:gap-8 lg:grid-cols-5 lg:items-stretch lg:gap-10"
        >
          {immerseBox && (
            <motion.div variants={fadeUp} className="min-w-0 lg:col-span-2">
              <GlassCard hover={false} className="h-full min-w-0">
                <h3 className="font-sans text-lg font-semibold sm:text-xl">
                  {immerseBox.title}
                </h3>
                {renderBoxBody(immerseBox.body, false)}
              </GlassCard>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="min-w-0 w-full lg:col-span-3">
            <RecapVideo />
          </motion.div>
        </motion.div>

        {expectBox && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="mt-8">
            <ExpectSection title={expectBox.title} body={expectBox.body} />
          </motion.div>
        )}
      </Container>

      <div className="mt-8 w-full sm:mt-10">
        <StatsBar />
      </div>
      {/* the gallery stands apart from the stats band, full bleed */}
      <div className="mt-12 w-full sm:mt-16">
        <FloatingGallery />
      </div>
    </section>
  );
}
