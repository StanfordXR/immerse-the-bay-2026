import type { DashboardResource, RoughScheduleDay } from "./types";

/** ISO datetime for countdown target (Pacific). */
export const DASHBOARD_COUNTDOWN_TARGET = "2026-11-13T09:00:00-08:00";

/**
 * Event schedule shown on the dashboard. Hardcoded here, separate from the
 * Schedule page's ROUGH_SCHEDULE in data/schedule.ts, so the two can diverge.
 */
export const DASHBOARD_SCHEDULE: RoughScheduleDay[] = [
  {
    id: "friday",
    label: "Friday",
    date: "November 13",
    blocks: [
      { id: "fri-workshops", title: "Workshops", time: "12–6 pm", size: "large" },
      { id: "fri-dinner", title: "Dinner", time: "6–7 pm" },
      { id: "fri-opening", title: "Opening Ceremony", time: "7–8:30 pm" },
      { id: "fri-hacking", title: "Hacking", time: "9 pm" },
    ],
  },
  {
    id: "saturday",
    label: "Saturday",
    date: "November 14",
    blocks: [
      { id: "sat-hacking", title: "Hacking", time: "All day", size: "fill" },
    ],
  },
  {
    id: "sunday",
    label: "Sunday",
    date: "November 15",
    blocks: [
      { id: "sun-hacking-ends", title: "Hacking Ends", time: "9 am" },
      { id: "sun-judging", title: "Judging", time: "9:30 am–12 pm" },
      { id: "sun-lunch", title: "Lunch", time: "12 pm" },
      { id: "sun-closing", title: "Closing Ceremony", time: "1:30 pm" },
    ],
  },
];

/**
 * Spotify playlist embed URL (iframe src).
 * In Spotify: playlist → ⋮ → Share → Embed playlist → copy src.
 * Use theme=0 for dark player. Example:
 * https://open.spotify.com/embed/playlist/PLAYLIST_ID?utm_source=generator&theme=0
 */
export const DASHBOARD_SPOTIFY_EMBED_URL =
  "https://open.spotify.com/embed/playlist/7j8FJVYFvenzQ4Sj22Iic0?utm_source=generator&theme=0";

/** Optional link for “Open in Spotify” (Share → Copy link to playlist). */
export const DASHBOARD_SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/7j8FJVYFvenzQ4Sj22Iic0?si=170cf7407b194c3f&pt=d29717758a4b50e5f20aadaf91cce627";

export const DASHBOARD_RESOURCES: DashboardResource[] = [
  {
    id: "discord",
    title: "Hackathon Discord Server",
    description: "Join the Immerse the Bay 2026 Discord server here:",
    href: "https://discord.gg/jCqYbN6t4",
    accent: "#ec4899",
  },
  {
    id: "devpost",
    title: "Devpost / Submissions",
    description: "Project submission portal. Link will go live closer to demo day.",
    // Placeholder: last year's Devpost until the 2026 page is up.
    href: "https://immerse-the-bay-xr-2025.devpost.com/",
    accent: "#3b82f6",
  },
  {
    id: "stanfordxr-discord",
    title: "StanfordXR Discord Server",
    description: "Join the StanfordXR Discord server here:",
    href: "https://discord.gg/FqxQSafU",
    accent: "#a855f7",
  },
];
