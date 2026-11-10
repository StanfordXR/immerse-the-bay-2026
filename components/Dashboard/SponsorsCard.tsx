import { SponsorLogoImage } from "@/components/SponsorLogoImage";
import { GlassCard } from "@/components/ui/GlassCard";
import { SPONSOR_TIERS } from "@/data/sponsors";
import { cn } from "@/lib/utils";

const SPONSORS = SPONSOR_TIERS.flatMap(({ sponsors }) => sponsors);

/**
 * Sponsor logos for the home tab's left column. On desktop it fills whatever
 * height is left beside the right column, so the two columns end level; the
 * logo grid is taken out of flow (absolute) so it never stretches the row, and
 * scrolls (fading at the bottom) when there are more logos than fit. On phones
 * it's natural height.
 */
export function SponsorsCard({ className }: { className?: string }) {
  return (
    <GlassCard hover={false} className={cn("flex flex-col", className)}>
      <h2 className="mb-1 font-sans text-xl font-semibold">Our sponsors</h2>
      <p className="mb-4 text-sm text-muted">The teams making this weekend possible.</p>
      <div className="relative min-h-0 md:min-h-40 md:flex-1">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:absolute md:inset-0 md:content-start md:overflow-y-auto md:pb-6 md:pr-1 md:[mask-image:linear-gradient(to_bottom,black_85%,transparent)]">
          {SPONSORS.map((sponsor) => (
            <li key={sponsor.name}>
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                title={sponsor.name}
                className="flex h-20 items-center justify-center border border-white/10 bg-void/40 px-3 transition-colors hover:border-neon-purple-light/50 hover:bg-neon-violet/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan"
              >
                {sponsor.logo ? (
                  <SponsorLogoImage sponsor={sponsor} scale={sponsor.logoScale} loading="lazy" className="max-h-10 max-w-full" />
                ) : (
                  <span className="text-center text-sm font-semibold text-foreground">{sponsor.name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}
