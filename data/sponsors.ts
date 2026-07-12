import type { Sponsor } from "./types";

/**
 * Last year's (2025) sponsors — logos live in public/images/sponsors/.
 * Rendered as a single flat grid to match the 2025 site (no public tiers).
 * Update this list once 2026 sponsors are confirmed.
 */
export const SPONSORS: Sponsor[] = [
  { name: "AWE", logo: "/images/sponsors/awe.svg", url: "https://www.awexr.com" },
  { name: "ByteDance", logo: "/images/sponsors/ByteDance.png", url: "https://www.bytedance.com" },
  { name: "OpenBCI", logo: "/images/sponsors/OpenBCI.png", url: "https://openbci.com" },
  { name: "Meta", logo: "/images/sponsors/meta.png", url: "https://www.meta.com" },
  { name: "XR Bootcamp by Meta", logo: "/images/sponsors/XRMeta.png", url: "https://xrbootcamp.com" },
  { name: "Raven Resonance", logo: "/images/sponsors/Raven.png", url: "#" },
  { name: "Afference", logo: "/images/sponsors/Afference.png", url: "https://www.afference.com" },
  { name: "XREAL", logo: "/images/sponsors/XREAL.png", url: "https://www.xreal.com" },
  { name: "Meshy AI", logo: "/images/sponsors/Meshy.png", url: "https://www.meshy.ai" },
  { name: "ShapesXR", logo: "/images/sponsors/shapesxr.svg", url: "https://www.shapesxr.com" },
  { name: "Snap AR", logo: "/images/sponsors/Snap_AR.png", url: "https://ar.snap.com" },
  { name: "CVRE", logo: "/images/sponsors/CVRE.png", url: "#" },
  { name: "Red Bull", logo: "/images/sponsors/Redbull.png", url: "https://www.redbull.com" },
  { name: "Shake Shack", logo: "/images/sponsors/shakeshack.png", url: "https://www.shakeshack.com" },
  { name: "Panda Express", logo: "/images/sponsors/Panda.png", url: "https://www.pandaexpress.com" },
  { name: "Insomnia Cookies", logo: "/images/sponsors/Insomnia.png", url: "https://insomniacookies.com" },
  { name: "Ike's Love & Sandwiches", logo: "/images/sponsors/Ike.png", url: "https://www.ilikeikesplace.com" },
];

/** Partner organizations, shown in a small row below the sponsor grid. */
export const PARTNERS: Sponsor[] = [
  { name: "UC Berkeley XR", logo: "/images/sponsors/berkeley.png", url: "#" },
];

/** Flat list for the homepage sponsor marquee. */
export const MARQUEE_SPONSORS = SPONSORS;
