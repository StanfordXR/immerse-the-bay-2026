"use client";

import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/Dashboard/CountdownTimer";
import { LiveAnnouncements } from "@/components/Dashboard/LiveAnnouncements";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  DASHBOARD_CALENDAR_EMBED_URL,
  DASHBOARD_COUNTDOWN_TARGET,
  DASHBOARD_RESOURCES,
  DASHBOARD_SPOTIFY_EMBED_URL,
  DASHBOARD_SPOTIFY_PLAYLIST_URL,
} from "@/data/dashboard";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function DashboardView() {
  const hasCalendar = Boolean(DASHBOARD_CALENDAR_EMBED_URL);
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
                  Send song recs to organizers on Discord at #music-recs channel!
                </p>
              </div>
              <div className="relative h-[168px] w-full bg-void/50 sm:h-[211px]">
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
          <motion.div variants={fadeUp} className="w-full">
            <GlassCard hover={false} className="w-full overflow-hidden p-0">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="font-sans text-lg font-semibold sm:text-xl">
                  Live announcements
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Real-time updates on announcements from the organizers.
                </p>
              </div>
              <LiveAnnouncements />
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp} className="w-full">
            <GlassCard hover={false} className="w-full overflow-hidden p-0">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="font-sans text-lg font-semibold sm:text-xl">
                  Live calendar
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Shared Google Calendar for workshops, meals, and key events.
                </p>
              </div>
              <div className="relative h-[380px] w-full bg-void/50 sm:h-[420px]">
                {hasCalendar ? (
                  <iframe
                    className="absolute inset-0 h-full w-full border-0"
                    src={DASHBOARD_CALENDAR_EMBED_URL}
                    title="Immerse the Bay live calendar"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
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
