import { GlassCard } from "@/components/ui/GlassCard";

interface HackerBadgeProps {
  /** Signed-in hacker's name. Placeholder until dashboard login exists. */
  name?: string;
  /** Check-in QR code (image URL or data URI). Placeholder until generated. */
  qrSrc?: string;
}

export function HackerBadge({ name, qrSrc }: HackerBadgeProps) {
  return (
    <GlassCard hover={false} className="flex h-full w-full flex-col overflow-hidden p-0">
      <div className="border-b border-white/10 px-6 py-4">
        <h3 className="font-sans text-lg font-semibold sm:text-xl">
          Hacker badge
        </h3>
        <p className="mt-1 text-sm text-muted">
          Show this QR code at the check-in desk.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-void/50 px-6 py-8 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-neon-purple-light">
            Immerse the Bay 2026
          </p>
          <p className="mt-2 font-sans text-2xl font-semibold text-foreground sm:text-3xl">
            {name ?? "Your name"}
          </p>
        </div>

        <div className="flex h-48 w-48 items-center justify-center border border-white/20 bg-white/10 sm:h-56 sm:w-56">
          {qrSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URI QR, nothing to optimize
            <img src={qrSrc} alt="Check-in QR code" className="h-full w-full bg-white p-3" />
          ) : (
            <p className="px-4 font-mono text-xs uppercase tracking-wider text-muted">
              QR code appears here after you sign in
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
