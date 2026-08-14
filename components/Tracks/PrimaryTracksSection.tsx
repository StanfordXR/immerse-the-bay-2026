"use client";

import { motion } from "framer-motion";
import {
  BONUS_TRACK,
  PRIMARY_TRACKS,
  PRIMARY_TRACK_AWARDS,
} from "@/data/tracks";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { TrackBulletList } from "./TrackDetailBlocks";

function PrimaryTrackCard({
  title,
  theme,
  icon,
  bonus = false,
}: {
  title: string;
  theme: string;
  icon: string;
  bonus?: boolean;
}) {
  return (
    <motion.li variants={scaleIn}>
      <GlassCard className="h-full">
        <div className="flex items-start gap-3">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-neon-cyan/30 bg-neon-indigo/10 font-mono text-lg text-neon-cyan"
            aria-hidden
          >
            {icon}
          </span>
          <div>
            <h3 className="font-sans text-base font-semibold sm:text-lg">{title}</h3>
            {bonus && (
              <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-neon-purple-light">
                Bonus track
              </p>
            )}
            <p className="mt-2 text-sm text-muted">{theme}</p>
          </div>
        </div>
      </GlassCard>
    </motion.li>
  );
}

export function PrimaryTracksSection({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={embedded ? undefined : "py-16"}>
      {!embedded && (
        <SectionHeading
          eyebrow="Primary tracks"
          title="General competition categories"
          description="Primary and bonus tracks are judged on creativity, impact, and execution. All primary and bonus track winners share the awards below."
        />
      )}

      {embedded && (
        <p className="mb-8 text-center text-sm text-muted">
          Primary and bonus tracks are judged on creativity, impact, and execution.
          All winners share the awards below.
        </p>
      )}

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {PRIMARY_TRACKS.map((track) => (
          <PrimaryTrackCard
            key={track.id}
            title={track.title}
            theme={track.theme}
            icon={track.icon}
          />
        ))}
        <PrimaryTrackCard
          title={BONUS_TRACK.title}
          theme={BONUS_TRACK.theme}
          icon={BONUS_TRACK.icon}
          bonus
        />
      </motion.ul>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <GlassCard hover={false}>
          <p className="font-mono text-xs uppercase tracking-wider text-neon-cyan">
            {PRIMARY_TRACK_AWARDS.headline}
          </p>
          <p className="mt-3 font-sans text-lg font-semibold text-foreground">
            {PRIMARY_TRACK_AWARDS.prize}
          </p>
          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="font-mono text-xs uppercase tracking-wider text-neon-purple-light">
              Additional winner benefits
            </p>
            <p className="mt-2 text-sm text-muted">
              All primary and bonus track winners receive:
            </p>
            <div className="mt-3">
              <TrackBulletList items={PRIMARY_TRACK_AWARDS.winnerBenefits} />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
