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
    body: `Immerse the Bay is Silicon Valley's leading extended reality (XR) hackathon. Hosted on the Stanford University campus, the three-day event brings together students, designers, and developers to build the future of spatial computing.
    
    Over the course of 36 hours, participants form teams to prototype augmented reality (AR), virtual reality (VR), and mixed-reality (MR) experiences. All skill levels and backgrounds are welcome to jump in and start building.`,
  },
  {
    id: "expect",
    title: "What to expect",
    body: `Next-Gen Hardware: Get hands-on access to over $150k worth of XR equipment.

Industry Support: Level up your skills with engaging workshops, demos, and direct mentorship from industry leaders.

Massive Prizes: Showcase your live prototype and compete for ~$10k in prizes.

Global Networking: Connect with a vibrant XR community, which previously drew participants from over 175 universities and organizations across 13 countries.`,
  },
];

export const RECAP_VIDEO = {
  title: "Last Year's Recap",
  /** Replace with your official YouTube embed URL */
  embedUrl: "https://www.youtube.com/embed/7FEPbaH6c-w?si=wwpQ7vP4Blks8Buw",
  description:
    "Relive highlights from last year's hackathon — workshops, builds, and the demo fair.",
};
