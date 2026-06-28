import type { SponsorTier } from "./types";

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    tier: "Platinum",
    sponsors: [
      { name: "Meta", url: "#" },
      { name: "Apple Vision", url: "#" },
      { name: "NVIDIA", url: "#" },
    ],
  },
  {
    tier: "Gold",
    sponsors: [
      { name: "Unity", url: "#" },
      { name: "Epic Games", url: "#" },
      { name: "Google XR", url: "#" },
    ],
  },
  {
    tier: "Silver",
    sponsors: [
      { name: "Snap", url: "#" },
      { name: "Magic Leap", url: "#" },
      { name: "Qualcomm", url: "#" },
      { name: "Autodesk", url: "#" },
    ],
  },
  {
    tier: "Supported By",
    sponsors: [
      { name: "Stanford d.school", url: "#" },
      { name: "VHIL", url: "#" },
      { name: "Treehacks", url: "#" },
      { name: "ACM SIGGRAPH", url: "#" },
    ],
  },
];

/** Flat list for the homepage sponsor marquee — add logo paths in public/ when ready */
export const MARQUEE_SPONSORS = SPONSOR_TIERS.flatMap((tier) => tier.sponsors);

