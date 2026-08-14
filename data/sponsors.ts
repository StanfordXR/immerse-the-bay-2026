import type { Sponsor, SponsorTier } from "./types";

/**
 * 2025 sponsors by tier — logos live in public/images/sponsors/.
 * Marquee order follows tier order (Platinum → Gold → Silver → Supported By).
 */
export const SPONSOR_TIERS: SponsorTier[] = [
  {
    tier: "Platinum",
    sponsors: [
      { name: "AWE", logo: "/images/sponsors/awe.svg", url: "https://www.awexr.com", marqueeScale: 0.63 },
      {
        name: "ByteDance",
        logo: "/images/sponsors/ByteDance.png",
        url: "https://www.bytedance.com",
        marqueeScale: 1.37,
        marqueeSpacingAfter: 1.5,
      },
      { name: "OpenBCI", logo: "/images/sponsors/OpenBCI.png", url: "https://openbci.com", marqueeScale: 1.37 },
      {
        name: "Meta",
        logo: "/images/sponsors/meta.png",
        url: "https://www.meta.com",
        marqueeScale: 0.95,
        logoScale: 0.81,
        marqueeSpacingAfter: 0.9,
      },
      {
        name: "XR Bootcamp by Meta",
        logo: "/images/sponsors/XRMeta.png",
        url: "https://xrbootcamp.com",
        marqueeScale: 0.72,
        logoScale: 1.21,
        marqueeSpacingAfter: 0.9,
      },
    ],
  },
  {
    tier: "Gold",
    sponsors: [
      {
        name: "Raven Resonance",
        logo: "/images/sponsors/Raven.png",
        url: "#",
        marqueeScale: 1.07,
        marqueeSpacingAfter: 1.65,
      },
      { name: "Afference", logo: "/images/sponsors/Afference.png", url: "https://www.afference.com", marqueeScale: 1.56, logoScale: 1.452 },
      { name: "XREAL", logo: "/images/sponsors/XREAL.png", url: "https://www.xreal.com", logoScale: 0.8 },
      { name: "Meshy AI", logo: "/images/sponsors/Meshy.png", url: "https://www.meshy.ai", marqueeScale: 0.9, logoScale: 0.88 },
    ],
  },
  {
    tier: "Silver",
    sponsors: [
      { name: "ShapesXR", logo: "/images/sponsors/shapesxr.svg", url: "https://www.shapesxr.com", marqueeScale: 1.2 },
      { name: "Snap AR", logo: "/images/sponsors/Snap_AR.png", url: "https://ar.snap.com", marqueeScale: 0.95, logoScale: 1.097 },
      { name: "CVRE", logo: "/images/sponsors/CVRE.png", url: "#", marqueeScale: 0.9, marqueeSpacingAfter: 0.5 },
    ],
  },
  {
    tier: "Supported By",
    sponsors: [
      { name: "Red Bull", logo: "/images/sponsors/Redbull.png", url: "https://www.redbull.com", marqueeScale: 0.8, logoScale: 1.69 },
      { name: "Shake Shack", logo: "/images/sponsors/shakeshack.png", url: "https://www.shakeshack.com", marqueeScale: 1.54, logoScale: 1.521 },
      {
        name: "Panda Express",
        logo: "/images/sponsors/Panda.png",
        url: "https://www.pandaexpress.com",
        marqueeScale: 0.72,
        logoScale: 1.606,
        marqueeSpacingAfter: 0.45,
      },
      {
        name: "Insomnia Cookies",
        logo: "/images/sponsors/Insomnia.png",
        url: "https://insomniacookies.com",
        marqueeScale: 0.72,
        logoScale: 1.606,
        marqueeSpacingAfter: 0.6,
      },
      {
        name: "Ike's Love & Sandwiches",
        logo: "/images/sponsors/Ike.png",
        url: "https://www.ilikeikesplace.com",
        marqueeScale: 1.26,
        logoScale: 2.9,
        marqueeSpacingAfter: 0.8,
      },
    ],
  },
];

/** Flat list in tier order (Platinum → Supported By). */
export const SPONSORS: Sponsor[] = SPONSOR_TIERS.flatMap(({ sponsors }) => sponsors);

/** Partner organizations, shown in a small row below the sponsor grid. */
export const PARTNERS: Sponsor[] = [
  { name: "UC Berkeley XR", logo: "/images/sponsors/berkeley.png", url: "#" },
];

/** Homepage sponsor marquee — tier order, excluding catering partners. */
const MARQUEE_EXCLUDED_SPONSORS = new Set([
  "Red Bull",
  "Shake Shack",
  "Panda Express",
  "Insomnia Cookies",
  "Ike's Love & Sandwiches",
]);

export const MARQUEE_SPONSORS = SPONSORS.filter(
  (sponsor) => !MARQUEE_EXCLUDED_SPONSORS.has(sponsor.name),
);
