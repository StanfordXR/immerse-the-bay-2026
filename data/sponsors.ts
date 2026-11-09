import type { Sponsor, SponsorTier } from "./types";

/**
 * 2026 sponsors by tier — logos live in public/images/sponsors/.
 * Sponsors without a logo render as their name. Marquee order follows tier order.
 */
export const SPONSOR_TIERS: SponsorTier[] = [
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
        url: "https://raven.computer/",
        logoScale: 1.8,
        marqueeScale: 1.4,
        description:
          "Raven Resonance is a San Francisco startup empowering technical creatives to envision and build groundbreaking ambient computing apps. Our flagship product, Raven Prism, is a standalone Linux computer in everyday glasses, controlled by eye and voice, featuring hot-swappable Raven Wings™ batteries and hardware-level privacy. Creators can build with our open Python-based SDK and desktop simulator, then deploy straight to the glasses.",
      },
      {
        name: "AWE",
        logo: "/images/sponsors/awe-white.svg",
        url: "https://www.awexr.com/",
        marqueeScale: 0.51,
        description:
          "Augmented World Expo (AWE) is a global community for extended reality and AI. Since 2010, it has brought the industry together through conferences, exhibitions, meetups, educational programs, and the Auggie Awards.",
      },
      {
        name: "Mogura VR",
        logo: "/images/sponsors/mogura-vr.png",
        url: "https://www.moguravr.com/",
        lightLogoBackground: true,
        description:
          "Mogura VR is a Japanese publication covering XR, spatial computing, VTubers, the metaverse, and immersive media.",
      },
      {
        name: "Visko",
        logo: "/images/sponsors/visko.png",
        url: "https://www.visko.ai",
        description:
          "Visko is an AI research company pioneering Live Models and the creator of Orbis, a foundation model that generates and streams living worlds in real time. Orbis unites persistent memory, steerable interactivity, and generation grounded in real-world physics to power the next generation of media, entertainment, gaming, and embodied AI.",
      },
    ],
  },
  {
    tier: "Silver",
    sponsors: [
      {
        name: "ShapesXR",
        logo: "/images/sponsors/shapesxr.svg",
        url: "https://www.shapesxr.com",
        description: "ShapesXR helps teams design, prototype, and test interactive spatial apps and games together.",
      },
      {
        name: "Attractor Labs",
        logo: "/images/sponsors/attractor-labs.svg",
        url: "https://attractor.world",
        marqueeScale: 1.4,
        logoScale: 1.3,
        description:
          "Attractor Labs builds audio world models. Our first product, SATIE, is an AI audio director for 3D worlds. Game developers and immersive worldbuilders use SATIE to create rich, interactive soundscapes, down to footsteps that change with floor materials, muffled sound underwater, and engines that rise in pitch as cars accelerate. Whether you're building without a sound team or designing sound professionally, SATIE lets you create, direct, and refine every detail of how your world sounds.",
      },
      {
        name: "DreamPark",
        logo: "/images/sponsors/dreampark-white.png",
        url: "https://dreampark.app",
        marqueeScale: 0.57,
        logoScale: 1.05,
        description:
          "DreamPark turns any room, gym, or field into a video game. Using Meta Quest headsets, players jump into shared mixed reality games like laser tag and Super Adventure Land, no special venue or setup needed. We bring the headsets and run the session, for schools, parties, and events.",
      },
      {
        name: "Shizuku AI",
        logo: "/images/sponsors/shizuku-ai-white.png",
        url: "https://shizuku.ai/",
        logoScale: 0.8,
        description:
          "Shizuku AI develops interactive AI characters, including Shizuku, an AI VTuber who livestreams and interacts with viewers.",
      },
      {
        name: "Aelven",
        logo: "/images/sponsors/aelven.png",
        url: "https://aelven.ai",
        marqueeScale: 0.55,
        description:
          "Aelven creates rich, coherent datasets from human activity across physical and digital environments, connecting context across modalities and over time. Domes is its first consumer product, building real-time models of users’ worlds.",
      },
      {
        name: "PICO",
        logo: "/images/sponsors/pico.svg",
        url: "https://www.picoxr.com/global",
        logoTone: "reversed",
        description: "PICO builds VR and mixed reality headsets and software for immersive experiences.",
      },
      {
        name: "XR Bootcamp",
        logo: "/images/sponsors/xr-bootcamp.png",
        url: "https://xrbootcamp.com/",
        logoTone: "brightened",
        logoScale: 1.92,
        marqueeScale: 0.98,
        description: "XR Bootcamp offers hands-on courses and master classes in VR and mixed reality development.",
      },
    ],
  },
];

/** Flat list in tier order (Gold → Silver). */
export const SPONSORS: Sponsor[] = SPONSOR_TIERS.flatMap(({ sponsors }) => sponsors);

/** Partner organizations, shown in a small row below the sponsor grid. */
export const PARTNERS: Sponsor[] = [
  { name: "UC Berkeley XR", logo: "/images/sponsors/berkeley.png", url: "#" },
];

/** Homepage sponsor marquee, in tier order. */
export const MARQUEE_SPONSORS = SPONSORS;
