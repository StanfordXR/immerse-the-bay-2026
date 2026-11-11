import { SponsorLogoImage } from "@/components/SponsorLogoImage";
import { GlassCard } from "@/components/ui/GlassCard";
import { SPONSOR_TIERS } from "@/data/sponsors";
import { cn } from "@/lib/utils";

export function SponsorsCard() {
  return (
    <section aria-labelledby="live-sponsors">
      <GlassCard hover={false}>
        <h2 id="live-sponsors" className="mb-1 font-sans text-xl font-semibold">Our sponsors</h2>
        <p className="mb-5 text-sm text-muted">The teams making this weekend possible.</p>
        <div className="space-y-4">
          {SPONSOR_TIERS.map(({ tier, sponsors }) => {
            if (!sponsors.length) return null;
            const featured = tier === "Gold";
            return (
              <ul
                key={tier}
                aria-label={`${tier} sponsors`}
                className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3",
                  featured ? "lg:grid-cols-5" : "lg:grid-cols-4 xl:grid-cols-7")}
              >
                {sponsors.map((sponsor) => (
                  <li key={sponsor.name} className="min-w-0">
                    <a
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={sponsor.name}
                      className={cn(
                        "flex items-center justify-center overflow-hidden border bg-void/40 px-2 transition-colors hover:border-neon-purple-light/60 hover:bg-neon-violet/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan sm:px-3",
                        featured ? "h-24 border-white/20 sm:h-28" : "h-20 border-white/10 sm:h-24",
                      )}
                    >
                      {sponsor.logo ? (
                        <SponsorLogoImage
                          sponsor={sponsor}
                          scale={sponsor.logoScale}
                          loading="lazy"
                          className={cn("max-w-full", featured ? "max-h-12 sm:max-h-14" : "max-h-9 sm:max-h-11")}
                        />
                      ) : (
                        <span className="text-center text-sm font-semibold text-foreground">{sponsor.name}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            );
          })}
        </div>
      </GlassCard>
    </section>
  );
}
