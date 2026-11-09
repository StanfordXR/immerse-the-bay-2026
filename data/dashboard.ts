import type { DashboardResource } from "./types";
import { OPENING_START } from "./schedule";

export const DASHBOARD_COUNTDOWN_TARGET = OPENING_START;
export const DASHBOARD_SPOTIFY_EMBED_URL =
  "https://open.spotify.com/embed/playlist/7j8FJVYFvenzQ4Sj22Iic0?utm_source=generator&theme=0";
export const DASHBOARD_SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/7j8FJVYFvenzQ4Sj22Iic0";

export const DASHBOARD_RESOURCES: DashboardResource[] = [
  {
    id: "discord",
    title: "Event Discord",
    description: "Get announcements, meet teammates, and ask questions.",
    href: "",
  },
  {
    id: "devpost",
    title: "Project submissions",
    description: "The 2026 submission link will be posted in the event Discord. Submit by Sunday at 9 AM Pacific.",
    href: "",
  },
  {
    id: "equipment",
    title: "Equipment lending",
    description: "Requests are expected to open around midday Friday, after inventory is scanned. Requests submitted before the 9:30 PM first match have equal priority.",
    href: "https://equipment.stanfordxr.org/",
  },
];
