/** Midnight in Stanford's local time, after the November switch to PST. */
export const DASHBOARD_OPENS_AT = Date.parse("2026-11-11T00:00:00-08:00");
export const DASHBOARD_OPENS_ON = "Wednesday, November 11";

export type StaffRole = "reviewer" | "admin";

export type Attendee =
  | { status: "signed-out" }
  | { status: "not-confirmed" }
  | { status: "confirmed"; name: string; audience?: "staff" | "hacker"; staffRole?: StaffRole; badgeQr?: string };

export type DashboardAccess = { isOpen: boolean } & (
  | { status: "allowed"; name: string }
  | { status: "signed-out" | "not-confirmed" | "waiting" | "unavailable" }
);

export function parseAttendee(body: unknown): Attendee | null {
  if (!body || typeof body !== "object") return null;
  const { status, name, audience, staffRole, badgeQr } = body as Record<string, unknown>;
  if (status === "signed-out" || status === "not-confirmed") return { status };
  if (status !== "confirmed" || typeof name !== "string") return null;
  return {
    status,
    name,
    audience: audience === "staff" || audience === "hacker" ? audience : undefined,
    ...(audience === "staff" && (staffRole === "reviewer" || staffRole === "admin") ? { staffRole } : {}),
    ...((audience === "staff" || audience === "hacker") && typeof badgeQr === "string" && badgeQr.length <= 20_000
      && /^data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/]+={0,2}$/.test(badgeQr) ? { badgeQr } : {}),
  };
}

/** The page and its private announcement feed must share this gate. */
export function dashboardAccess(attendee: Attendee | null, now = Date.now()): DashboardAccess {
  const isOpen = now >= DASHBOARD_OPENS_AT;
  if (!attendee) return { status: "unavailable", isOpen };
  if (attendee.status !== "confirmed") return { status: attendee.status, isOpen };
  // Legacy responses did not distinguish confirmed hackers from staff.
  // Only a positively identified staff account gets access before launch.
  if (attendee.audience !== "staff" && !isOpen) return { status: "waiting", isOpen };
  return { status: "allowed", name: attendee.name, isOpen };
}
