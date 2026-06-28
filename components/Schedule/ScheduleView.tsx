"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SCHEDULE_DAYS } from "@/data/schedule";
import type { ScheduleDayId } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ScheduleEventCard } from "./ScheduleEventCard";

export function ScheduleView() {
  const [activeDay, setActiveDay] = useState<ScheduleDayId>("friday");
  const day = SCHEDULE_DAYS.find((d) => d.id === activeDay)!;

  return (
    <Container as="section" className="py-20 sm:py-28">
      <SectionHeading
        eyebrow="Schedule"
        title="Three days of building"
        description="Times and locations are approximate — final schedule published closer to the event."
      />

      <div
        role="tablist"
        aria-label="Schedule days"
        className="mb-10 flex flex-wrap justify-center gap-2"
      >
        {SCHEDULE_DAYS.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={activeDay === d.id}
            onClick={() => setActiveDay(d.id)}
            className={cn(
              "border px-5 py-2.5 text-sm font-medium transition",
              activeDay === d.id
                ? "border-neon-cyan/50 bg-neon-indigo/20 text-foreground shadow-glow-cyan"
                : "border-white/10 bg-surface/40 text-muted hover:border-neon-blue/30",
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <motion.ol
        key={activeDay}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative space-y-4"
      >
        <div
          className="absolute bottom-2 left-[15px] top-2 w-px bg-gradient-to-b from-neon-cyan via-neon-indigo/40 to-transparent sm:left-8"
          aria-hidden
        />
        {day.events.map((event, index) => (
          <motion.li key={event.id} variants={fadeUp} className="relative pl-12 sm:pl-16">
            <span
              className="absolute left-2 top-6 z-10 flex h-7 w-7 items-center justify-center border-2 border-neon-cyan bg-void sm:left-5"
              aria-hidden
            >
              <span className="h-2 w-2 bg-neon-cyan" />
            </span>
            <ScheduleEventCard event={event} index={index} />
          </motion.li>
        ))}
      </motion.ol>
    </Container>
  );
}
