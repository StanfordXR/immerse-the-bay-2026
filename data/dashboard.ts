import type { DashboardResource } from "./types";

/** ISO datetime for countdown target (Pacific). */
export const DASHBOARD_COUNTDOWN_TARGET = "2026-11-13T09:00:00-08:00";

/**
 * Live announcements Google Sheet.
 * Row 1 headers: Date | Time | Message
 * Share: Anyone with the link → Viewer (organizers → Editor).
 * Auto date/time: paste scripts/google-sheets-announcements.gs into Apps Script.
 */
export const DASHBOARD_ANNOUNCEMENTS_SHEET_ID =
  "1Ma6zcyiXObHjrvhupr03kE5q2a_Ef0Q9sCWvgV7z8K8";
export const DASHBOARD_ANNOUNCEMENTS_SHEET_GID = "0";

/**
 * Public Google Calendar embed URL.
 * In Google Calendar: Settings → Integrate calendar → copy embed code src.
 */
export const DASHBOARD_CALENDAR_EMBED_URL =
  "https://calendar.google.com/calendar/embed?src=dea89397aa12e3b95bad5724b4561b35fb04aa33b71bb72ee9afc34d17a80862%40group.calendar.google.com&ctz=America%2FLos_Angeles&bgcolor=%2306040c&color=%23c084fc";

/**
 * Spotify playlist embed URL (iframe src).
 * In Spotify: playlist → ⋮ → Share → Embed playlist → copy src.
 * Use theme=0 for dark player. Example:
 * https://open.spotify.com/embed/playlist/PLAYLIST_ID?utm_source=generator&theme=0
 */
export const DASHBOARD_SPOTIFY_EMBED_URL =
  "https://open.spotify.com/embed/playlist/7j8FJVYFvenzQ4Sj22Iic0?utm_source=generator&theme=0&height=152";

/** Optional link for “Open in Spotify” (Share → Copy link to playlist). */
export const DASHBOARD_SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/7j8FJVYFvenzQ4Sj22Iic0?si=170cf7407b194c3f&pt=d29717758a4b50e5f20aadaf91cce627";

export const DASHBOARD_RESOURCES: DashboardResource[] = [
  {
    id: "discord",
    title: "Discord Server",
    description: "Chat with organizers, find teammates, and get help in real time.",
    href: "https://discord.gg/stanfordxr",
  },
  {
    id: "devpost",
    title: "Devpost / Submissions",
    description: "Project submission portal — link will go live closer to demo day.",
    href: "#",
  },
  {
    id: "hardware",
    title: "Hardware Lending",
    description: "Headset checkout policies and inventory list for the weekend.",
    href: "#",
  },
  {
    id: "wifi",
    title: "Venue Wi‑Fi",
    description: "Network name and guest access instructions for the hackathon space.",
    href: "#",
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct",
    description: "Community guidelines for a safe, inclusive building environment.",
    href: "#",
  },
  {
    id: "emergency",
    title: "Emergency Contacts",
    description: "On-site organizer numbers and campus safety resources.",
    href: "#",
  },
];
