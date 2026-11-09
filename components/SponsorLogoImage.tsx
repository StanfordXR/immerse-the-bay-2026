import type { Sponsor } from "@/data/types";
import { cn } from "@/lib/utils";

const TONE_CLASS = { reversed: "invert", brightened: "brightness-150" } as const;

export function SponsorLogoImage({
  sponsor,
  className,
  scale = 1,
  loading,
}: {
  sponsor: Sponsor;
  className?: string;
  scale?: number;
  loading?: "lazy" | "eager";
}) {
  if (!sponsor.logo) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      loading={loading}
      className={cn(
        "object-contain object-center",
        className,
        sponsor.lightLogoBackground && "rounded bg-white px-2 py-1",
        sponsor.logoTone && TONE_CLASS[sponsor.logoTone],
      )}
      style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
    />
  );
}
