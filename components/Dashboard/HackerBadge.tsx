import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";

interface HackerBadgeProps {
  /** Signed-in hacker's name, verified through the portal. */
  name?: string;
  /** Check-in QR provided by the authorized badge issuer when available. */
  qrSrc?: string;
}

export function HackerBadge({ name, qrSrc }: HackerBadgeProps) {
  return (
    <GlassCard hover={false} className="flex h-full w-full flex-col overflow-hidden p-0">
      <div className="px-6 py-4">
        <h2 className="font-sans text-lg font-semibold sm:text-xl">
          Hacker badge
        </h2>
        <p className="mt-1 text-sm text-muted">
          {qrSrc ? "Show this QR code at the check-in desk. If it won’t scan, have your confirmation email handy." : "If you don't have a QR code, have your confirmation email handy and ask a check-in volunteer for help."}
        </p>
      </div>
      <div
        className="resource-shine h-1"
        style={{ "--shine-color": "#a855f7" } as React.CSSProperties}
        aria-hidden
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-void/50 px-6 py-8 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-neon-purple-light">
            Immerse the Bay 2026
          </p>
          <p className="mt-2 font-sans text-2xl font-semibold text-foreground sm:text-3xl">
            {name ?? "Your name"}
          </p>
        </div>

        {qrSrc ? (
          <div className="flex h-48 w-48 items-center justify-center border border-white/20 bg-white/10 sm:h-56 sm:w-56">
            <Image
              src={qrSrc}
              alt="Check-in QR code"
              width={224}
              height={224}
              unoptimized
              loading="eager"
              className="h-full w-full bg-white p-3 [image-rendering:pixelated]"
            />
          </div>
        ) : <p className="text-sm text-muted">QR code not available yet.</p>}
      </div>
    </GlassCard>
  );
}
