"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SPONSOR_TIERS } from "@/lib/constants";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const tierStyles: Record<string, string> = {
  Platinum: "border-neon-purple/50 shadow-glow-purple-lg text-lg",
  Gold: "border-neon-purple/30 shadow-glow-purple",
  Silver: "border-white/15",
};

export function SponsorsSection() {
  return (
    <section id="sponsors" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sponsors"
          title="Powered by immersive industry leaders"
          description="Interested in partnering? Reach out through our sponsor CTA — logo placements are placeholders."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-12"
        >
          {SPONSOR_TIERS.map((tier) => (
            <motion.div key={tier.tier} variants={fadeUp}>
              <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-neon-purple">
                {tier.tier}
              </p>
              <div
                className={cn(
                  "flex flex-wrap justify-center gap-4",
                  tier.tier === "Platinum" && "gap-6",
                )}
              >
                {tier.sponsors.map((name) => (
                  <motion.div
                    key={name}
                    variants={scaleIn}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={cn(
                      "flex min-w-[140px] items-center justify-center rounded-xl border bg-surface/40 px-8 py-6 backdrop-blur-md transition duration-300 hover:border-neon-purple/50",
                      tierStyles[tier.tier],
                      tier.tier === "Platinum" && "min-w-[180px] px-10 py-8",
                    )}
                  >
                    <span className="font-display font-semibold text-foreground/80">
                      {name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-muted"
        >
          <a
            href="#sponsor"
            className="text-neon-purple underline-offset-4 hover:underline"
          >
            Become a sponsor →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
