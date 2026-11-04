import { cookies } from "next/headers";
import { PORTAL_URL } from "@/data/site";

/**
 * Who is looking at the Live Dashboard. Sign-in lives on the portal: its
 * /live-dashboard route sets SHARED_SESSION_COOKIE on `.immersethebay.org`,
 * and we forward it to the portal's /api/attendee, which checks the session and
 * whether that hacker was accepted and confirmed their spot.
 */
const SHARED_SESSION_COOKIE = "itb_session";

/** Mirrors `AttendeeStatus` in the portal repo's lib/live-dashboard.ts. */
export type Attendee =
  | { status: "signed-out" }
  | { status: "not-confirmed" }
  | { status: "confirmed"; name: string };

/** Returns null when the portal couldn't be reached, so callers don't mistake an outage for "signed out". */
export async function getAttendee(): Promise<Attendee | null> {
  const token = (await cookies()).get(SHARED_SESSION_COOKIE)?.value;
  if (!token) return { status: "signed-out" };

  try {
    const res = await fetch(`${PORTAL_URL}/api/attendee`, {
      headers: { cookie: `${SHARED_SESSION_COOKIE}=${encodeURIComponent(token)}` },
      cache: "no-store",
    });
    return res.ok ? ((await res.json()) as Attendee) : null;
  } catch {
    return null;
  }
}
