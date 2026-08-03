import type { AboutBox, NavLink, SocialLink } from "./types";

export const SITE = {
  name: "Immerse the Bay 2026",
  tagline: "Stanford's premier XR hackathon",
  subtitle:
    "A weekend of VR, AR, AI, gaming, and spatial computing on the Stanford campus — build immersive experiences with mentors, hardware, and a community that ships.",
  description:
    "Build the future of immersive technology at Stanford — VR, AR, AI, gaming, and spatial computing.",
  email: "admin@stanfordxr.org",
  website: "https://stanfordxr.org",
  year: 2026,
  foundedYear: 2019,
  eventDate: "* November 13-15, 2026",
  eventDateNote: "* To be confirmed",
  eventLocation: "Stanford, CA",
  heroTagline: "Take Me To The Moon",
} as const;

/** Toggle to show Live Dashboard in the navbar (route stays at /dashboard). */
export const SHOW_LIVE_DASHBOARD_NAV = false;

const LIVE_DASHBOARD_NAV_LINK: NavLink = {
  label: "Live Dashboard",
  href: "/dashboard",
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Schedule", href: "/schedule" },
  { label: "FAQ", href: "/faq" },
  ...(SHOW_LIVE_DASHBOARD_NAV ? [LIVE_DASHBOARD_NAV_LINK] : []),
  { label: "Tracks & Prizes", href: "/tracks" },
  {
    label: "2025 Hackathon",
    href: "https://immersethebay.stanfordxr.org/",
    external: true,
  },
];

export const HERO_CTAS = [
  {
    label: "Apply",
    href: "#apply",
    variant: "primary" as const,
    tooltip: "Launching applications on the 14th!",
  },
  {
    label: "Volunteer",
    href: "#volunteer",
    variant: "secondary" as const,
    tooltip: "Coming soon!",
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Discord", href: "https://discord.gg/stanfordxr", icon: "discord" },
  { label: "Instagram", href: "https://www.instagram.com/stanford_xr/", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com/company/stanfordxr", icon: "linkedin" },
  { label: "Email", href: `mailto:${SITE.email}`, icon: "email" },
];

export const ABOUT_BOXES: AboutBox[] = [
  {
    id: "immerse",
    title: "What is Immerse the Bay?",
    body: `Immerse the Bay is Silicon Valley's leading extended reality (XR) hackathon. Hosted on the Stanford University campus, the three-day event brings together students, designers, and developers to build the future of spatial computing.
    
    Over the course of 36 hours, participants form teams to prototype augmented reality (AR), virtual reality (VR), and mixed-reality (MR) experiences. All skill levels and backgrounds are welcome to jump in and start building.`,
  },
  {
    id: "expect",
    title: "What to expect",
    body: `Next-Gen Hardware: Get hands-on access to over $150k worth of XR equipment, including headsets, controllers, and spatial computing peripherals loaned for the full weekend.

Industry Support: Level up your skills with engaging workshops, live demos, and direct mentorship from engineers and designers at leading immersive technology companies.

Massive Prizes: Showcase your live prototype at the demo fair and compete for ~$10k in prizes across multiple tracks and sponsor awards.

Global Networking: Connect with a vibrant XR community that previously drew participants from over 175 universities and organizations across 13 countries.

All Weekend Long: From opening kickoff through overnight hacking, expect meals, swag, mentor office hours, and a high-energy showcase where teams present what they built to judges and the broader Stanford community.`,
  },
];

export const RECAP_VIDEO = {
  title: "Immerse the Bay 2024",
  /** Replace with your official YouTube embed URL */
  embedUrl: "https://www.youtube.com/embed/7FEPbaH6c-w?si=wwpQ7vP4Blks8Buw",
  description:
    "Relive highlights from last year's hackathon — workshops, builds, and the demo fair.",
};
