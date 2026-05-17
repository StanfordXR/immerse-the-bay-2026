"use client";

import { motion } from "framer-motion";
import { EventCard } from "@/components/ui/EventCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SCHEDULE } from "@/lib/constants";
import { staggerContainer } from "@/lib/motion";

export function ScheduleSection() {
  return (
    <section id="schedule" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-section-glow pointer-events-none" aria-hidden />
      <motion.div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Schedule"
          title="Weekend at a glance"
          description="Times are approximate — final schedule published closer to the event."
        />

        <div className="relative">
          {/* Timeline spine */}
          <div
            className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-neon-purple via-neon-purple/40 to-transparent sm:left-1/2 sm:-translate-x-px"
            aria-hidden
          />

          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="space-y-6"
          >
            {SCHEDULE.map((event, index) => (
              <li key={event.id} className="relative pl-10 sm:pl-0">
                <span
                  className="absolute left-0 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-neon-purple bg-void shadow-glow-purple sm:left-1/2 sm:-translate-x-1/2"
                  aria-hidden
                >
                  <span className="h-2 w-2 rounded-full bg-neon-purple" />
                </span>
                <div className="sm:max-w-[calc(50%-2rem)] sm:odd:mr-auto sm:odd:pr-8 sm:even:ml-auto sm:even:pl-8">
                  <EventCard
                    time={event.time}
                    title={event.title}
                    description={event.description}
                    index={index}
                  />
                </div>
              </li>
            ))}
          </motion.ol>
        </div>
      </motion.div>
    </section>
  );
}
