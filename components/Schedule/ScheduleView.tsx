"use client";

import { motion } from "framer-motion";
import { ROUGH_SCHEDULE } from "@/data/schedule";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { ScheduleGridBlock } from "./ScheduleGridBlock";

export function ScheduleView() {
  return (
    <Container as="section" className="py-20 sm:py-28">
      <SectionHeading
        eyebrow="Schedule"
        title="Schedule"
        description="More details will be released closer to date of hackathon."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5 lg:gap-6"
      >
        {ROUGH_SCHEDULE.map((day) => (
          <motion.div
            key={day.id}
            variants={fadeUp}
            className="flex min-h-0 flex-col sm:min-h-[32rem]"
          >
            <div className="mb-4 text-center">
              <h3 className="font-sans text-xl font-semibold uppercase tracking-[0.12em] text-foreground sm:text-2xl">
                {day.label}
              </h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-neon-cyan/70">
                {day.date}
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              {day.blocks.map((block) => (
                <ScheduleGridBlock key={block.id} block={block} />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
}
