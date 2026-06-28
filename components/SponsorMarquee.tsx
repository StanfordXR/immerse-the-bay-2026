"use client";

import { MARQUEE_SPONSORS } from "@/data/sponsors";
import type { Sponsor } from "@/data/types";

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.url ?? "#"}
      className="group flex shrink-0 items-center justify-center px-6 transition-opacity hover:opacity-100"
      aria-label={sponsor.name}
    >
      {sponsor.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="h-9 w-auto max-w-[140px] object-contain opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0 sm:h-11"
        />
      ) : (
        <span className="whitespace-nowrap font-sans text-sm font-semibold tracking-wide text-foreground/50 transition group-hover:text-neon-cyan sm:text-base">
          {sponsor.name}
        </span>
      )}
    </a>
  );
}

function SponsorStrip({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-10 sm:gap-14"
      aria-hidden={ariaHidden}
    >
      {MARQUEE_SPONSORS.map((sponsor) => (
        <SponsorLogo key={sponsor.name} sponsor={sponsor} />
      ))}
    </div>
  );
}

export function SponsorMarquee() {
  return (
    <div
      className="relative w-full border-y border-white/10 bg-void/70 py-5 backdrop-blur-md sm:py-6"
      aria-label="Sponsor logos"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-void to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-void to-transparent sm:w-24" />

      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee-rtl will-change-transform">
          <SponsorStrip />
          <SponsorStrip ariaHidden />
        </div>
      </div>
    </div>
  );
}
