"use client";

import { motion } from "framer-motion";
import { SPONSOR_TIERS, PARTNERS } from "@/data/sponsors";
import type { Sponsor, SponsorTierName } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Breakpoint = "base" | "sm" | "lg";
type Align = "start" | "center" | "end";

/**
 * Horizontal anchoring for the description popover, so popovers on the outer
 * columns stay inside the viewport. Literal strings so Tailwind picks them up.
 */
const POPOVER_ALIGN: Record<Breakpoint, Record<Align, string>> = {
  base: {
    start: "left-0 translate-x-0",
    center: "left-1/2 -translate-x-1/2",
    end: "left-full -translate-x-full",
  },
  sm: {
    start: "sm:left-0 sm:translate-x-0",
    center: "sm:left-1/2 sm:-translate-x-1/2",
    end: "sm:left-full sm:-translate-x-full",
  },
  lg: {
    start: "lg:left-0 lg:translate-x-0",
    center: "lg:left-1/2 lg:-translate-x-1/2",
    end: "lg:left-full lg:-translate-x-full",
  },
};

function popoverAlignClass(index: number, cols: Record<Breakpoint, number>) {
  return (Object.keys(cols) as Breakpoint[])
    .map((bp) => {
      const col = index % cols[bp];
      const align: Align = col === 0 ? "start" : col === cols[bp] - 1 ? "end" : "center";
      return POPOVER_ALIGN[bp][align];
    })
    .join(" ");
}

const TIER_LAYOUT: Record<
  SponsorTierName,
  {
    grid: string;
    /** Column count per breakpoint; keep in sync with `grid`. */
    cols: Record<Breakpoint, number>;
    logoClass: string;
    cardClass?: string;
    titleClass: string;
  }
> = {
  Platinum: {
    grid: "grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
    cols: { base: 2, sm: 3, lg: 5 },
    logoClass: "max-h-12 max-w-[160px]",
    cardClass: "px-4 py-4 sm:px-8 sm:py-5",
    titleClass:
      "bg-gradient-to-r from-white via-sky-100 to-cyan-200 bg-clip-text text-transparent",
  },
  Gold: {
    grid: "grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4",
    cols: { base: 2, sm: 2, lg: 4 },
    logoClass: "max-h-11 max-w-[150px]",
    cardClass: "px-4 py-3 sm:px-6 sm:py-4",
    titleClass: "text-amber-400",
  },
  Silver: {
    grid: "grid-cols-2 gap-3 sm:grid-cols-3",
    cols: { base: 2, sm: 3, lg: 3 },
    logoClass: "max-h-10 max-w-[140px]",
    titleClass: "text-neutral-300",
  },
  "Supported By": {
    grid: "grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
    cols: { base: 2, sm: 3, lg: 5 },
    logoClass: "max-h-9 max-w-[120px]",
    cardClass: "px-4 py-3 sm:px-5 sm:py-[1.4rem]",
    titleClass: "text-orange-400",
  },
};

function SponsorCard({
  sponsor,
  logoClass,
  className,
  popoverClass,
}: {
  sponsor: Sponsor;
  logoClass: string;
  className?: string;
  popoverClass?: string;
}) {
  return (
    <motion.li
      variants={scaleIn}
      className="group relative focus-within:z-30 hover:z-30"
    >
      <div
        tabIndex={sponsor.description ? 0 : undefined}
        aria-describedby={sponsor.description ? descriptionId(sponsor) : undefined}
        className={cn(
          "flex h-full cursor-default items-center justify-center border border-white/10 bg-surface/50 px-4 py-3 backdrop-blur-md transition-colors sm:px-6 sm:py-4",
          sponsor.description &&
            "outline-none group-hover:border-white/25 focus-visible:border-neon-cyan/60",
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
      </div>
      {sponsor.description && (
        <div
          id={descriptionId(sponsor)}
          role="tooltip"
          className={cn(
            "pointer-events-none invisible absolute top-full z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] border border-white/15 bg-surface/95 p-4 text-left opacity-0 shadow-xl shadow-black/40 backdrop-blur-md transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100",
            popoverClass,
          )}
        >
          <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.15em] text-neon-cyan">
            {sponsor.name}
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            {sponsor.description}
          </p>
        </div>
      )}
    </motion.li>
  );
}

function descriptionId(sponsor: Sponsor) {
  return `sponsor-desc-${sponsor.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function Sponsors() {
  return (
    <section id="sponsors" className="relative py-14 sm:py-20">
      <div className="bg-section-glow pointer-events-none absolute inset-x-0 -top-48 bottom-0" aria-hidden />
      <Container as="section">
        <SectionHeading
          eyebrow="Sponsors"
          title="Backed by immersive industry leaders"
          description="Immerse the Bay is made possible by the innovative companies backing the next generation of XR builders, like our 2026 sponsors below."
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
                  className={cn(
                    sponsors.length > 0 ? cn("grid", layout.grid) : "flex justify-center",
                  )}
                >
                  {sponsors.length > 0 ? (
                    sponsors.map((sponsor, index) => (
                      <SponsorCard
                        key={sponsor.name}
                        sponsor={sponsor}
                        logoClass={layout.logoClass}
                        className={layout.cardClass}
                        popoverClass={popoverAlignClass(index, layout.cols)}
                      />
                    ))
                  ) : (
                    <motion.li variants={scaleIn}>
                      <div
                        className={cn(
                          "flex min-w-[180px] items-center justify-center border border-dashed border-white/15 bg-surface/30 px-6 py-4 backdrop-blur-md",
                          layout.cardClass,
                        )}
                      >
                        <span className="font-mono text-lg font-semibold uppercase tracking-[0.2em] text-foreground/50">
                          TBD
                        </span>
                      </div>
                    </motion.li>
                  )}
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
