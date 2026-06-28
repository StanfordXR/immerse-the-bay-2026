"use client";

import { motion } from "framer-motion";
import { PRIZES } from "@/data/prizes";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";

export function PrizesSection() {
  return (
    <section id="prizes" className="py-20 sm:py-28">
      <SectionHeading
        eyebrow="Prizes"
        title="Awards & track winners"
        description="Prize amounts are placeholders — update data/prizes.ts as sponsors confirm."
      />

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {PRIZES.map((prize) => (
          <motion.li key={prize.id} variants={scaleIn}>
            <GlassCard className="h-full">
              <p className="font-mono text-2xl font-bold text-neon-cyan">{prize.amount}</p>
              <h3 className="mt-2 font-sans text-lg font-semibold">{prize.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{prize.description}</p>
              <p className="mt-4 font-mono text-xs text-muted">
                Sponsor: <span className="text-foreground">{prize.sponsor}</span>
              </p>
            </GlassCard>
          </motion.li>
        ))}
      </motion.ul>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-8 text-center text-sm text-muted"
      >
        Additional sponsor challenge prizes announced at opening ceremony.
      </motion.p>
    </section>
  );
}
