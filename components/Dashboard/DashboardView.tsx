"use client";

import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/Dashboard/CountdownTimer";
import { HackerBadge } from "@/components/Dashboard/HackerBadge";
import { LiveAnnouncements } from "@/components/Dashboard/LiveAnnouncements";
import { ScheduleGridBlock } from "@/components/Schedule/ScheduleGridBlock";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  DASHBOARD_COUNTDOWN_TARGET,
  DASHBOARD_RESOURCES,
  DASHBOARD_SCHEDULE,
  DASHBOARD_SPOTIFY_EMBED_URL,
  DASHBOARD_SPOTIFY_PLAYLIST_URL,
} from "@/data/dashboard";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function DashboardView() {
  const hasSpotify = Boolean(DASHBOARD_SPOTIFY_EMBED_URL);

  return (
    <Container as="section" className="relative pb-20 pt-8 sm:pb-28">
      <SectionHeading
        eyebrow="Live"
        title="Event dashboard"
        description="Updates on countdown, announcements, music, schedule, and resources in real-time."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="flex flex-col gap-8"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div variants={fadeUp} className="w-full">
            <GlassCard hover={false} className="flex h-full flex-col justify-center px-4 py-5 text-center sm:py-6">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-neon-purple-light">
                Countdown to kickoff
              </p>
              <div className="mt-4">
                <CountdownTimer targetIso={DASHBOARD_COUNTDOWN_TARGET} compact />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp} className="w-full">
            <GlassCard hover={false} className="h-full overflow-hidden p-0">
              <div className="border-b border-white/10 px-6 py-3">
                <h3 className="font-sans text-lg font-semibold sm:text-xl">
                  Vibes playlist
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Music inspires creativity! Send recs to organizers on Discord at #suggestions channel!
                </p>
              </div>
              <div className="flex w-full items-center gap-4 bg-void/50 py-4 pr-4 sm:gap-6 sm:pr-6">
                <div className="relative h-[152px] min-w-0 flex-1">
                  {hasSpotify ? (
                    <iframe
                      className="absolute inset-0 h-full w-full border-0"
                      src={DASHBOARD_SPOTIFY_EMBED_URL}
                      title="Immerse the Bay Spotify playlist"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                      <p className="max-w-sm text-sm text-muted">
                        Add your Spotify embed URL in{" "}
                        <code className="text-neon-purple-light">data/dashboard.ts</code>
                      </p>
                      <p className="font-mono text-xs text-muted/70">
                        Spotify → playlist → Share → Embed playlist
                      </p>
                    </div>
                  )}
                </div>
                <div
                  className="shrink-0 drop-shadow-[0_0_12px_rgb(217_70_239_/_0.45)]"
                  aria-hidden
                >
                  <div className="vinyl-record aspect-square h-[120px] sm:h-[152px]" />
                </div>
              </div>
              {DASHBOARD_SPOTIFY_PLAYLIST_URL ? (
                <div className="border-t border-white/10 px-6 py-2 text-center">
                  <a
                    href={DASHBOARD_SPOTIFY_PLAYLIST_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-wider text-neon-purple-light transition hover:text-neon-cyan"
                  >
                    Open in Spotify
                  </a>
                </div>
              ) : null}
            </GlassCard>
          </motion.div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div variants={fadeUp} className="w-full">
              <GlassCard hover={false} className="h-full w-full overflow-hidden p-0">
                <div className="px-6 py-4">
                  <h3 className="font-sans text-lg font-semibold sm:text-xl">
                    Live announcements
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    Real-time updates on announcements from the organizers.
                  </p>
                </div>
                <div
                  className="resource-shine h-1"
                  style={{ "--shine-color": "#ef4444" } as React.CSSProperties}
                  aria-hidden
                />
                <LiveAnnouncements />
              </GlassCard>
            </motion.div>

            <motion.div variants={fadeUp} className="w-full">
              <HackerBadge />
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="w-full">
            <GlassCard hover={false} className="w-full overflow-hidden p-0">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="font-sans text-lg font-semibold sm:text-xl">
                  Schedule
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Workshops, meals, and key events across the weekend.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 bg-void/50 p-6 md:grid-cols-3 md:gap-5 lg:gap-6">
                {DASHBOARD_SCHEDULE.map((day) => (
                  <div key={day.id} className="flex min-h-0 flex-col sm:min-h-[32rem]">
                    <div className="mb-4 text-center">
                      <h4 className="font-sans text-xl font-semibold uppercase tracking-[0.12em] text-foreground sm:text-2xl">
                        {day.label}
                      </h4>
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-neon-cyan/70">
                        {day.date}
                      </p>
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                      {day.blocks.map((block) => (
                        <ScheduleGridBlock key={block.id} block={block} />
                      ))}
                    </div>
                  </div>
                ))}
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
                <li
                  key={resource.id}
                  className="h-full border border-white/10 bg-void/40 p-4 pt-0"
                >
                  {resource.accent ? (
                    <div
                      className="resource-shine -mx-4 mb-4 h-1"
                      style={{ "--shine-color": resource.accent } as React.CSSProperties}
                      aria-hidden
                    />
                  ) : (
                    <div className="mb-4" aria-hidden />
                  )}
                  <p className="font-semibold text-foreground">{resource.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {resource.description}
                  </p>
                  {resource.href && resource.href !== "#" ? (
                    <a
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block break-all text-sm text-neon-cyan underline underline-offset-4 hover:text-neon-purple-light"
                    >
                      {resource.href}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </motion.div>
    </Container>
  );
}
