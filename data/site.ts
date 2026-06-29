import type { AboutBox, NavLink, SocialLink } from "./types";

export const SITE = {
  name: "Immerse the Bay 2026",
  tagline: "Stanford's premier XR hackathon",
  subtitle:
    "A weekend of VR, AR, AI, gaming, and spatial computing on the Stanford campus — build immersive experiences with mentors, hardware, and a community that ships.",
  description:
    "Build the future of immersive technology at Stanford — VR, AR, AI, gaming, and spatial computing.",
  email: "stanfordxr@stanford.edu",
  website: "https://stanfordxr.org",
  year: 2026,
  foundedYear: 2019,
  eventDate: "Date TBD, 2026",
  eventLocation: "Stanford, CA",
  heroTagline: "Take Me To The Moon",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Schedule", href: "/schedule" },
  { label: "Tracks & Prizes", href: "/tracks" },
  { label: "Live Dashboard", href: "#", comingSoon: true },
  {
    label: "2025 Hackathon",
    href: "https://immersethebay.stanfordxr.org/",
    external: true,
  },
  { label: "FAQ", href: "/faq" },
];

export const HERO_CTAS = [
  { label: "Apply", href: "#apply", variant: "primary" as const },
  { label: "Volunteer", href: "#volunteer", variant: "secondary" as const },
  { label: "Sponsor", href: "#sponsors", variant: "secondary" as const },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Discord", href: "https://discord.gg/stanfordxr", icon: "discord" },
  { label: "Instagram", href: "https://instagram.com/stanfordxr", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com/company/stanfordxr", icon: "linkedin" },
  { label: "Email", href: `mailto:${SITE.email}`, icon: "email" },
];

export const ABOUT_BOXES: AboutBox[] = [
  {
    id: "immerse",
    title: "What is Immerse the Bay?",
    body: "Immerse the Bay is Stanford XR's flagship hackathon — a high-energy weekend where students and creators prototype bold experiences across VR, AR, AI, and spatial computing. Stanford XR is the student community behind it: workshops, speaker series, dev nights, and a builder-first culture that bridges research, art, and engineering.",
  },
  {
    id: "expect",
    title: "What to expect",
    body: `Since ${SITE.foundedYear}, the event has grown from a small VR build night into the Bay Area's most vibrant student immersive hackathon. Expect hands-on workshops, loaner headsets, mentor office hours, meals and swag, overnight hacking, and a demo fair where teams showcase to judges and the community.`,
  },
];

export const RECAP_VIDEO = {
  title: "Last Year's Recap",
  /** Replace with your official YouTube embed URL */
  embedUrl: "",
  description:
    "Relive highlights from last year's hackathon — workshops, builds, and the demo fair.",
};
