import type { Sponsor, SponsorTier } from "./types";

/**
 * 2026 sponsors by tier — logos live in public/images/sponsors/.
 * Sponsors without a logo render as their name. A tier with no sponsors
 * renders a "TBD" placeholder. Marquee order follows tier order.
 */
export const SPONSOR_TIERS: SponsorTier[] = [
  {
    tier: "Platinum",
    sponsors: [],
  },
  {
    tier: "Gold",
    sponsors: [
      {
        name: "ManageXR",
        logo: "/images/sponsors/managexr.svg",
        url: "https://www.managexr.com",
        description:
          "The management platform for VR and AR deployments. Distribute content, customize the user experience, and troubleshoot devices with end-to-end visibility and control. Solve the challenges of working with XR at scale.",
      },
      {
        name: "Raven Resonance",
        logo: "/images/sponsors/raven-resonance.png",
        url: "http://raven.computer/",
        description:
          "Raven Resonance is a San Francisco startup empowering technical creatives to envision and build groundbreaking ambient computing apps. Our flagship product, Raven Prism, is a standalone Linux computer in everyday glasses, controlled by eye and voice, featuring hot-swappable Raven Wings™ batteries and hardware-level privacy. Creators can build with our open Python-based SDK and desktop simulator, then deploy straight to the glasses.",
      },
      {
        name: "AWE",
        logo: "/images/sponsors/awe.png",
        url: "https://www.awexr.com/",
        marqueeScale: 0.6,
        description:
          "Since 2010, AWE has been the world’s largest XR and AI community, helping connect, educate, and enable commercial growth and market adoption for 5,000+ companies and 80,000+ professionals in the ecosystem.",
      },
      { name: "MyDearest / Mogura VR" },
    ],
  },
  {
    tier: "Silver",
    sponsors: [
      { name: "ShapesXR", logo: "/images/sponsors/shapesxr.svg", url: "https://www.shapesxr.com" },
      {
        name: "Attractor Labs",
        logo: "/images/sponsors/attractor-labs.svg",
        url: "https://attractor.world",
        marqueeScale: 1.4,
        logoScale: 1.3,
        description:
          "Attractor Labs builds audio world models. Our first product, SATIE, is an AI audio director for 3D worlds. Game developers and immersive worldbuilders use SATIE to create rich, interactive soundscapes, down to footsteps that change with floor materials, muffled sound underwater, and engines that rise in pitch as cars accelerate. Whether you're building without a sound team or designing sound professionally, SATIE lets you create, direct, and refine every detail of how your world sounds.",
      },
      { name: "DreamPark" },
      { name: "Shizuku AI", logo: "/images/sponsors/shizuku-ai.png", url: "https://shizuku.ai/" },
      {
        name: "Aelven",
        logo: "/images/sponsors/aelven.png",
        url: "https://aelven.ai",
        marqueeScale: 0.55,
        description:
          "Aelven creates rich, coherent datasets from human activity across physical and digital environments, connecting context across modalities and over time. Domes is its first consumer product, building real-time models of users’ worlds.",
      },
      {
        name: "Visko",
        url: "https://www.visko.ai",
        description:
          "Visko is an AI research company pioneering Live Models and the creator of Orbis, a foundation model that generates and streams living worlds in real time. Orbis unites persistent memory, steerable interactivity, and generation grounded in real-world physics to power the next generation of media, entertainment, gaming, and embodied AI.",
      },
    ],
  },
];

/** Flat list in tier order (Platinum → Silver). */
export const SPONSORS: Sponsor[] = SPONSOR_TIERS.flatMap(({ sponsors }) => sponsors);

/** Partner organizations, shown in a small row below the sponsor grid. */
export const PARTNERS: Sponsor[] = [
  { name: "UC Berkeley XR", logo: "/images/sponsors/berkeley.png", url: "#" },
];

/** Homepage sponsor marquee, in tier order. */
export const MARQUEE_SPONSORS = SPONSORS;
