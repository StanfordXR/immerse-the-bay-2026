import type {
  PrimaryTrack,
  PrimaryTrackAwards,
  SponsoredTrack,
} from "./types";

/** PowerPoint / slides deck URL — update when the deck is hosted. */
export const TRACKS_PRESENTATION_URL =
  "https://immersethebay.stanfordxr.org/slides2025.pdf";

export const TRACKS_OVERVIEW = {
  sponsored: [
    "Moonlake",
    "XREAL",
    "Afference",
    "OpenBCI",
    "ByteDance / PICO",
    "Meta (Reality AI)",
  ],
  primary: ["Creative Zenith", "Virtuous Reality", "AI Horizons", "Game Changer"],
  bonus: "Wild West",
};

export const SPONSORED_TRACKS: SponsoredTrack[] = [
  {
    id: "moonlake",
    title: "Moonlake",
    sponsors: ["Moonlake"],
    theme: "Build your project using Moonlake.",
    prizes: [
      {
        title: "Grand Prize — Best Creation on Moonlake",
        items: ["Nintendo Switch 2", "PlayStation 5"],
        note: "Multiple winners may be awarded.",
      },
    ],
    participationPrize: {
      title: "Participation Prize — Moonlake Master",
      items: ["$25 Amazon Gift Card"],
      note: "Everyone who becomes a Moonlake Master receives this prize.",
    },
    resources: [
      { label: "moonlakeai.com", href: "https://moonlakeai.com" },
      { label: "Track application QR code" },
    ],
    icon: "◎",
  },
  {
    id: "xreal",
    title: "XREAL",
    sponsors: ["XREAL"],
    goal: "Create an application using XREAL hardware.",
    listLabel: "Suggested categories",
    listItems: ["Productivity", "Enterprise", "Lifestyle", "Gaming", "Fun"],
    prizes: [
      {
        title: "Winning Team Prize",
        items: ["XREAL Air 2 Pro for every member of the winning team"],
      },
    ],
    resources: [
      { label: "XREAL Discord" },
      { label: "SDK Documentation" },
      { label: "docs.xreal.com", href: "https://docs.xreal.com" },
    ],
    icon: "◈",
  },
  {
    id: "afference",
    title: "Afference",
    sponsors: ["Afference"],
    theme: "Feel the Future: Artificial Touch in XR",
    description:
      "Use Afference's CES award-winning touch ring to create immersive XR experiences with haptic feedback.",
    listLabel: "Examples include",
    listItems: [
      "Button confirmation",
      "Hover interactions",
      "Slider feedback",
      "Object interaction",
      "Texture creation",
      "In-game notifications",
    ],
    lookingFor: [
      "Projects that use touch to improve immersion",
      "Projects that use touch to improve awareness",
      "Projects that create new interaction paradigms",
    ],
    judgingBonus: [
      "Multiple touch interaction types",
      "Completely novel touch interaction",
      "Creativity",
    ],
    prizes: [
      {
        title: "Best Integration of Afference Artificial Touch",
        items: ["Nintendo Switch 2 (1st place)", "TV (runner-up)"],
      },
    ],
    icon: "◇",
  },
  {
    id: "openbci",
    title: "OpenBCI",
    sponsors: ["OpenBCI"],
    description:
      "Apply to compete in the OpenBCI track for brain-computer interface projects using Galea and related hardware.",
    applicationRequirements: [
      "Apply by Friday 9:10 PM",
      "Must apply as a team",
      "Follow application instructions",
    ],
    resources: [
      { label: "OpenBCI (QR code)" },
      { label: "Documentation (QR code)" },
      { label: "Galea (QR code)" },
      { label: "Newsletter (QR code)" },
    ],
    icon: "⬡",
  },
  {
    id: "bytedance-pico",
    title: "ByteDance / PICO",
    sponsors: ["ByteDance", "PICO"],
    theme: "Break Into Spatial Computing",
    technologies: ["PICO", "SecureMR", "WebSpatial", "RoboToolKit"],
    participationPrize: {
      title: "Participation Reward",
      items: [
        "Golden Ticket",
        "Invitation to XR Career Workshop hosted by ByteDance / PICO",
      ],
      note: "Awarded to everyone who completes the track, has a working demo, and presents on Sunday.",
    },
    prizes: [
      {
        title: "Cash Awards — up to $5,000 total",
        items: [
          "Best WebSpatial App — $750",
          "Best SecureMR App — $750",
          "Best Overall Design / Storytelling — $500",
          "$2,000 remaining prize pool in cash",
        ],
      },
      {
        title: "Ambassador Continuation Track",
        items: [
          "Winning WebSpatial or SecureMR teams become PICO Ambassadors",
          "$1,000 per team",
          "Open-source funding to polish project after hackathon",
          "1-on-1 mentorship (Product, Engineering, DevRel)",
          "Featured on social media, GitHub, and developer blogs",
        ],
      },
    ],
    resources: [{ label: "Project resources (QR code)" }],
    icon: "▣",
  },
  {
    id: "meta",
    title: "Meta",
    sponsors: ["Meta"],
    presenter: "Dhwaj Agrawal",
    subtitle: "Reality AI — AI Experiences",
    theme: "Hands-On Coach",
    description:
      "Build real-time headset-based coaching powered by Contextual AI — allowing users to complete complex real-world tasks while wearing a headset through contextual understanding, step-by-step guidance, and real-time assistance.",
    prizes: [
      {
        title: "1st Place",
        items: ["4× Meta Quest 3"],
      },
      {
        title: "2nd Place",
        items: ["4× Meta Quest 3S"],
      },
      {
        title: "3rd Place",
        items: ["4× Xbox Elite Series 2 Controllers"],
      },
    ],
    icon: "✦",
  },
];

export const PRIMARY_TRACKS: PrimaryTrack[] = [
  {
    id: "creative-zenith",
    title: "Creative Zenith",
    theme: "Best Creative XR Experience",
    icon: "✦",
  },
  {
    id: "virtuous-reality",
    title: "Virtuous Reality",
    theme: "Best Social Good + XR",
    icon: "◎",
  },
  {
    id: "ai-horizons",
    title: "AI Horizons",
    theme: "Best Use of AI in XR",
    icon: "◈",
  },
  {
    id: "game-changer",
    title: "Game Changer",
    theme: "Best XR Game",
    icon: "▣",
  },
];

export const BONUS_TRACK: PrimaryTrack = {
  id: "wild-west",
  title: "Wild West",
  theme: "Thinking Outside the Box",
  icon: "⬡",
};

export const PRIMARY_TRACK_AWARDS: PrimaryTrackAwards = {
  headline: "Primary Track Awards",
  prize: "Up to 4 Meta Quest 2 headsets (sponsored prize)",
  winnerBenefits: [
    "Automatic acceptance",
    "3-Day All Access Passes",
  ],
};
