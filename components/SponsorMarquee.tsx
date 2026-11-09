"use client";

import { SponsorLogoImage } from "@/components/SponsorLogoImage";
import { MARQUEE_SPONSORS } from "@/data/sponsors";
import type { Sponsor } from "@/data/types";
import { cn } from "@/lib/utils";

/** Full band height (former py-5/py-6 + h-12/h-14) so logos clip at the edge with no inner margin. */
const LOGO_FRAME_CLASS =
  "flex h-[3.75rem] w-[5.5rem] shrink-0 items-center justify-center sm:h-[5.5rem] sm:w-[7.25rem]";

function SponsorLogo({
  sponsor,
  spacingBefore = 1,
  duplicate = false,
}: {
  sponsor: Sponsor;
  spacingBefore?: number;
  duplicate?: boolean;
}) {
  const scale = sponsor.marqueeScale ?? 1;
  const spacingAfter = sponsor.marqueeSpacingAfter ?? 1;
  const href = sponsor.url && sponsor.url !== "#" ? sponsor.url : undefined;
  const Logo = href ? "a" : "div";

  return (
    <Logo
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      tabIndex={duplicate ? -1 : undefined}
      className="flex shrink-0 items-center justify-center pl-[calc(1rem*var(--s-before))] pr-[calc(1rem*var(--s-after))] mr-[calc(1.5rem*var(--s-after))] focus-visible:outline-2 focus-visible:outline-neon-cyan sm:pl-[calc(1.25rem*var(--s-before))] sm:pr-[calc(1.25rem*var(--s-after))] sm:mr-[calc(2rem*var(--s-after))]"
      style={
        {
          "--s-before": spacingBefore,
          "--s-after": spacingAfter,
        } as React.CSSProperties
      }
      aria-label={sponsor.name}
    >
      {sponsor.logo ? (
        <span className={cn(LOGO_FRAME_CLASS, "overflow-hidden sm:overflow-visible")}>
          <SponsorLogoImage sponsor={sponsor} className="max-h-full max-w-full" scale={scale} />
        </span>
      ) : (
        <span className="whitespace-nowrap font-sans text-sm font-semibold tracking-wide text-foreground/85 sm:text-base">
          {sponsor.name}
        </span>
      )}
    </Logo>
  );
}

function SponsorStrip({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {MARQUEE_SPONSORS.map((sponsor, index) => (
        <SponsorLogo
          key={sponsor.name}
          sponsor={sponsor}
          duplicate={ariaHidden}
          spacingBefore={MARQUEE_SPONSORS[index - 1]?.marqueeSpacingAfter ?? 1}
        />
      ))}
    </div>
  );
}

export function SponsorMarquee() {
  return (
    <div
      className="group/marquee relative w-full border-y border-white/10 bg-void/40 py-0 backdrop-blur-md"
      aria-label="Sponsor logos"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-void to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-void to-transparent sm:w-24" />

      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee-rtl will-change-transform group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]">
          <SponsorStrip />
          <SponsorStrip ariaHidden />
        </div>
      </div>
    </div>
  );
}
