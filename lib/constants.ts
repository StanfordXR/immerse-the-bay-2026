export const SITE = {
  name: "Immerse the Bay 2026",
  tagline: "Stanford's premier XR hackathon",
  description:
    "Build the future of immersive technology at Stanford — VR, AR, AI, gaming, and spatial computing.",
  email: "stanfordxr@stanford.edu",
  website: "https://stanfordxr.org",
} as const;

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Tracks", href: "#tracks" },
  { label: "Schedule", href: "#schedule" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "FAQ", href: "#faq" },
] as const;

export const HERO_CTAS = [
  { label: "Apply", href: "#apply", variant: "primary" as const },
  { label: "Volunteer", href: "#volunteer", variant: "secondary" as const },
  { label: "Sponsor", href: "#sponsors", variant: "secondary" as const },
  { label: "Learn More", href: "#about", variant: "ghost" as const },
];

export const TRACKS = [
  {
    id: "xr-ai",
    title: "XR + AI",
    description:
      "Fuse large models, computer vision, and spatial AI into next-gen immersive experiences.",
    icon: "◈",
  },
  {
    id: "vr-gaming",
    title: "VR Gaming",
    description:
      "Design playful worlds, multiplayer mechanics, and embodied interaction in virtual reality.",
    icon: "▣",
  },
  {
    id: "spatial",
    title: "Spatial Computing",
    description:
      "Build for AR glasses, passthrough, and mixed reality that blends digital with physical space.",
    icon: "◎",
  },
  {
    id: "storytelling",
    title: "Interactive Storytelling",
    description:
      "Craft narrative worlds where audience agency, presence, and emotion drive the experience.",
    icon: "✦",
  },
  {
    id: "creative-tools",
    title: "Creative Tools",
    description:
      "Prototype pipelines, editors, and creator tooling that empower immersive artists and devs.",
    icon: "⬡",
  },
  {
    id: "hci",
    title: "Human Computer Interaction",
    description:
      "Explore new interfaces, accessibility, and embodied UX at the frontier of human–machine symbiosis.",
    icon: "◇",
  },
] as const;

export const SCHEDULE = [
  {
    id: "day1-open",
    time: "Fri · 5:00 PM",
    title: "Doors Open & Check-in",
    description: "Pick up badges, gear, and meet your team in the XR lounge.",
  },
  {
    id: "day1-keynote",
    time: "Fri · 6:30 PM",
    title: "Opening Keynote",
    description: "Industry leaders share the state of immersive tech and hackathon themes.",
  },
  {
    id: "day1-hacking",
    time: "Fri · 8:00 PM",
    title: "Hacking Begins",
    description: "Workshops, mentor office hours, and midnight snack fuel.",
  },
  {
    id: "day2-build",
    time: "Sat · All Day",
    title: "Build Sprint",
    description: "Deep work sessions, track-specific mentors, and hardware demos.",
  },
  {
    id: "day2-submit",
    time: "Sat · 4:00 PM",
    title: "Submission Deadline",
    description: "Upload your project, demo video, and devpost entry.",
  },
  {
    id: "day2-demo",
    time: "Sat · 5:30 PM",
    title: "Demo Fair & Awards",
    description: "Showcase to judges, community voting, and celebration.",
  },
] as const;

export const SPONSOR_TIERS = [
  {
    tier: "Platinum",
    sponsors: ["Meta", "Apple Vision", "NVIDIA"],
  },
  {
    tier: "Gold",
    sponsors: ["Unity", "Epic Games", "Google XR"],
  },
  {
    tier: "Silver",
    sponsors: ["Snap", "Magic Leap", "Qualcomm", "Autodesk"],
  },
] as const;

export const FAQ_ITEMS = [
  {
    id: "who",
    question: "Who can participate?",
    answer:
      "Immerse the Bay is open to students and builders passionate about XR. Teams of up to four are welcome — solo hackers too. No prior VR/AR experience required.",
  },
  {
    id: "cost",
    question: "Is there a registration fee?",
    answer:
      "The hackathon is free for accepted participants. Meals, swag, and workspace access are included for the weekend.",
  },
  {
    id: "hardware",
    question: "What hardware is provided?",
    answer:
      "We lend Quest headsets, AR devices, and sensors on a first-come basis. Bring your laptop and any personal gear you prefer.",
  },
  {
    id: "prizes",
    question: "What can we win?",
    answer:
      "Track prizes, sponsor challenges, and special awards for technical depth, creativity, and impact. Full prize list announced closer to the event.",
  },
  {
    id: "overnight",
    question: "Can we stay overnight?",
    answer:
      "Yes — the venue stays open for registered hackers with quiet zones and security on site.",
  },
] as const;

export const SOCIAL_LINKS = [
  { label: "Stanford XR Discord", href: "https://discord.gg/stanfordxr", icon: "discord" },
  { label: "Instagram", href: "https://instagram.com/stanfordxr", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com/company/stanfordxr", icon: "linkedin" },
  { label: "Email", href: `mailto:${SITE.email}`, icon: "email" },
  { label: "Website", href: SITE.website, icon: "web" },
] as const;
