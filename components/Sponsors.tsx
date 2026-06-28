"use client";

import { motion } from "framer-motion";
import { SPONSOR_TIERS } from "@/data/sponsors";
import type { SponsorTierName } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TIER_STYLES: Record<SponsorTierName, string> = {
  Platinum: "min-h-[88px] min-w-[180px] border-neon-cyan/40 text-lg shadow-glow-cyan",
  Gold: "min-h-[76px] min-w-[160px] border-neon-blue/30 shadow-glow",
  Silver: "min-h-[68px] min-w-[140px] border-white/15",
  "Supported By": "min-h-[56px] min-w-[120px] border-white/10 text-sm",
};

export function Sponsors() {
  return (
    <section id="sponsors" className="relative py-20 sm:py-28">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      <Container as="section">
        <SectionHeading
          eyebrow="Sponsors"
          title="Powered by immersive industry leaders"
          description="Logo grids are driven by data/sponsors.ts — drop assets into public/ and reference logo paths."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="space-y-12"
        >
          {SPONSOR_TIERS.map((tier) => (
            <motion.div key={tier.tier} variants={fadeUp}>
              <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-neon-cyan">
                {tier.tier}
              </p>
              <ul
                className={cn(
                  "flex flex-wrap justify-center gap-4",
                  tier.tier === "Platinum" && "gap-6",
                )}
              >
                {tier.sponsors.map((sponsor) => (
                  <motion.li key={sponsor.name} variants={scaleIn}>
                    <motion.a
                      href={sponsor.url ?? "#"}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={cn(
                        "flex items-center justify-center border bg-surface/50 px-8 py-5 backdrop-blur-md transition hover:border-neon-cyan/40",
                        TIER_STYLES[tier.tier],
                      )}
                    >
                      {sponsor.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="max-h-10 w-auto object-contain"
                        />
                      ) : (
                        <span className="font-sans font-semibold text-foreground/85">
                          {sponsor.name}
                        </span>
                      )}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
