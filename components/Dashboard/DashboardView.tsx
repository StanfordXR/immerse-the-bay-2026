"use client";

import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/Dashboard/CountdownTimer";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  DASHBOARD_ANNOUNCEMENTS,
  DASHBOARD_CALENDAR_EMBED_URL,
  DASHBOARD_COUNTDOWN_TARGET,
  DASHBOARD_RESOURCES,
} from "@/data/dashboard";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function DashboardView() {
  const hasCalendar = Boolean(DASHBOARD_CALENDAR_EMBED_URL);

  return (
    <Container as="section" className="relative pb-20 pt-8 sm:pb-28">
      <SectionHeading
        eyebrow="Live"
        title="Event dashboard"
        description="Countdown, announcements, schedule calendar, and quick links for hackers on site."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="flex flex-col gap-8"
      >
        <motion.div variants={fadeUp}>
          <GlassCard hover={false} className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-neon-purple-light">
              Countdown to kickoff
            </p>
            <div className="mt-6">
              <CountdownTimer targetIso={DASHBOARD_COUNTDOWN_TARGET} />
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div variants={fadeUp}>
            <GlassCard hover={false} className="h-full">
              <h3 className="font-sans text-lg font-semibold sm:text-xl">
                Live announcements
              </h3>
              <ul className="mt-5 space-y-4">
                {DASHBOARD_ANNOUNCEMENTS.map((item) => (
                  <li
                    key={item.id}
                    className="border border-white/10 bg-void/40 px-4 py-3"
                  >
                    <p className="font-mono text-xs uppercase tracking-wider text-neon-cyan">
                      {item.time}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                      {item.message}
                    </p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp}>
            <GlassCard hover={false} className="h-full overflow-hidden p-0">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="font-sans text-lg font-semibold sm:text-xl">
                  Live calendar
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Shared Google Calendar for workshops, meals, and key events.
                </p>
              </div>
              <div className="relative min-h-[320px] bg-void/50 sm:min-h-[380px]">
                {hasCalendar ? (
                  <iframe
                    className="absolute inset-0 h-full w-full border-0"
                    src={DASHBOARD_CALENDAR_EMBED_URL}
                    title="Immerse the Bay live calendar"
                  />
                ) : (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 p-6 text-center sm:min-h-[380px]">
                    <p className="max-w-sm text-sm text-muted">
                      Add your public Google Calendar embed URL in{" "}
                      <code className="text-neon-purple-light">data/dashboard.ts</code>
                    </p>
                    <p className="font-mono text-xs text-muted/70">
                      Google Calendar → Settings → Integrate calendar → Embed code
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div variants={fadeUp}>
          <GlassCard hover={false}>
            <h3 className="font-sans text-lg font-semibold sm:text-xl">
              Resources
            </h3>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DASHBOARD_RESOURCES.map((resource) => (
                <li key={resource.id}>
                  <a
                    href={resource.href}
                    className="group block h-full border border-white/10 bg-void/40 p-4 transition hover:border-neon-cyan/30 hover:shadow-glow-cyan"
                  >
                    <p className="font-semibold text-foreground group-hover:text-neon-cyan">
                      {resource.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {resource.description}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </motion.div>
    </Container>
  );
}
