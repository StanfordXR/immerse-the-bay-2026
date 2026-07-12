"use client";

import { motion } from "framer-motion";
import { SPONSORS, PARTNERS } from "@/data/sponsors";
import type { Sponsor } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

function SponsorCard({ sponsor, className }: { sponsor: Sponsor; className?: string }) {
  return (
    <motion.li variants={scaleIn}>
      <motion.a
        href={sponsor.url ?? "#"}
        target={sponsor.url && sponsor.url !== "#" ? "_blank" : undefined}
        rel="noopener noreferrer"
        whileHover={{ y: -4, scale: 1.02 }}
        className={cn(
          "flex h-full items-center justify-center border border-white/10 bg-surface/50 px-8 py-6 backdrop-blur-md transition hover:border-neon-cyan/40 hover:shadow-glow-cyan",
          className,
        )}
      >
        {sponsor.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            loading="lazy"
            className="max-h-12 w-auto max-w-[160px] object-contain"
          />
        ) : (
          <span className="font-sans font-semibold text-foreground/85">
            {sponsor.name}
          </span>
        )}
      </motion.a>
    </motion.li>
  );
}

export function Sponsors() {
  return (
    <section id="sponsors" className="relative py-20 sm:py-28">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      <Container as="section">
        <SectionHeading
          eyebrow="Sponsors"
          title="Powered by immersive industry leaders"
          description="Last year's sponsors made Immerse the Bay possible — from XR hardware pioneers to the fuel that kept builders going."
        />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {SPONSORS.map((sponsor) => (
            <SponsorCard key={sponsor.name} sponsor={sponsor} />
          ))}
        </motion.ul>

        {PARTNERS.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-neon-cyan">
              In partnership with
            </p>
            <ul className="flex flex-wrap justify-center gap-4">
              {PARTNERS.map((partner) => (
                <SponsorCard
                  key={partner.name}
                  sponsor={partner}
                  className="min-w-[180px]"
                />
              ))}
            </ul>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
