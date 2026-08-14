"use client";

import { motion } from "framer-motion";
import { SPONSOR_TIERS, PARTNERS } from "@/data/sponsors";
import type { Sponsor, SponsorTierName } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TIER_LAYOUT: Record<
  SponsorTierName,
  { grid: string; logoClass: string; cardClass?: string; titleClass: string }
> = {
  Diamond: {
    grid: "grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
    logoClass: "max-h-12 max-w-[160px]",
    cardClass: "px-4 py-4 sm:px-8 sm:py-5",
    titleClass:
      "bg-gradient-to-r from-white via-sky-100 to-cyan-200 bg-clip-text text-transparent",
  },
  Gold: {
    grid: "grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4",
    logoClass: "max-h-11 max-w-[150px]",
    cardClass: "px-4 py-3 sm:px-6 sm:py-4",
    titleClass: "text-amber-400",
  },
  Silver: {
    grid: "grid-cols-2 gap-3 sm:grid-cols-3",
    logoClass: "max-h-10 max-w-[140px]",
    titleClass: "text-neutral-300",
  },
  "Supported By": {
    grid: "grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
    logoClass: "max-h-9 max-w-[120px]",
    cardClass: "px-4 py-3 sm:px-5 sm:py-[1.4rem]",
    titleClass: "text-orange-400",
  },
};

function SponsorCard({
  sponsor,
  logoClass,
  className,
}: {
  sponsor: Sponsor;
  logoClass: string;
  className?: string;
}) {
  return (
    <motion.li variants={scaleIn}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className={cn(
          "flex h-full cursor-default items-center justify-center border border-white/10 bg-surface/50 px-4 py-3 backdrop-blur-md transition hover:border-neon-cyan/40 hover:shadow-glow-cyan sm:px-6 sm:py-4",
          className,
        )}
      >
        {sponsor.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            loading="lazy"
            className={cn("w-auto object-contain", logoClass)}
            style={
              sponsor.logoScale
                ? { transform: `scale(${sponsor.logoScale})` }
                : undefined
            }
          />
        ) : (
          <span className="font-sans font-semibold text-foreground/85">
            {sponsor.name}
          </span>
        )}
      </motion.div>
    </motion.li>
  );
}

export function Sponsors() {
  return (
    <section id="sponsors" className="relative py-14 sm:py-20">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      <Container as="section">
        <SectionHeading
          eyebrow="Sponsors"
          title="Backed by immersive industry leaders"
          description="Immerse the Bay is made possible by the innovative companies backing the next generation of XR builders, like our 2025 sponsors below."
          className="mb-8"
        />

        <div className="space-y-10">
          {SPONSOR_TIERS.map(({ tier, sponsors }) => {
            const layout = TIER_LAYOUT[tier];

            return (
              <motion.div
                key={tier}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <p
                  className={cn(
                    "mb-5 text-center font-mono text-xl font-semibold uppercase tracking-[0.1em] sm:text-3xl sm:tracking-[0.15em]",
                    layout.titleClass,
                  )}
                >
                  {tier}
                </p>
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className={cn("grid", layout.grid)}
                >
                  {sponsors.map((sponsor) => (
                    <SponsorCard
                      key={sponsor.name}
                      sponsor={sponsor}
                      logoClass={layout.logoClass}
                      className={layout.cardClass}
                    />
                  ))}
                </motion.ul>
              </motion.div>
            );
          })}
        </div>

        {PARTNERS.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-neon-cyan">
              In partnership with
            </p>
            <ul className="flex flex-wrap justify-center gap-3">
              {PARTNERS.map((partner) => (
                <SponsorCard
                  key={partner.name}
                  sponsor={partner}
                  logoClass="max-h-12 max-w-[168px]"
                  className="min-w-0 w-full max-w-[211px] px-4 py-4 sm:min-w-[211px] sm:px-[1.65rem] sm:py-[1.155rem]"
                />
              ))}
            </ul>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
