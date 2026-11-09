/** Midnight in Stanford's local time, after the November switch to PST. */
export const DASHBOARD_OPENS_AT = Date.parse("2026-11-11T00:00:00-08:00");
export const DASHBOARD_OPENS_ON = "Wednesday, November 11";

export type Attendee =
  | { status: "signed-out" }
  | { status: "not-confirmed" }
  | { status: "confirmed"; name: string; audience?: "staff" | "hacker" };

export type DashboardAccess = { isOpen: boolean } & (
  | { status: "allowed"; name: string }
  | { status: "signed-out" | "not-confirmed" | "waiting" | "unavailable" }
);

export function parseAttendee(body: unknown): Attendee | null {
  if (!body || typeof body !== "object") return null;
  const { status, name, audience } = body as Record<string, unknown>;
  if (status === "signed-out" || status === "not-confirmed") return { status };
  if (status !== "confirmed" || typeof name !== "string") return null;
  return { status, name, audience: audience === "staff" || audience === "hacker" ? audience : undefined };
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
