import type { DashboardAnnouncement, DashboardResource } from "./types";

/** ISO datetime for countdown target (Pacific). */
export const DASHBOARD_COUNTDOWN_TARGET = "2026-11-13T09:00:00-08:00";

/**
 * Public Google Calendar embed URL.
 * In Google Calendar: Settings → Integrate calendar → copy embed code src.
 */
export const DASHBOARD_CALENDAR_EMBED_URL = "";

export const DASHBOARD_ANNOUNCEMENTS: DashboardAnnouncement[] = [
  {
    id: "welcome",
    time: "Live",
    message:
      "Welcome to Immerse the Bay 2026. This dashboard will surface real-time updates during the event weekend.",
  },
  {
    id: "checkin",
    time: "T-7d",
    message: "Check-in opens at the main venue — bring your student ID and confirmation email.",
  },
  {
    id: "discord",
    time: "Now",
    message:
      "Join the Discord for mentor office hours, team formation, and live Q&A with organizers.",
  },
];

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
