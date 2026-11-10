import { cookies } from "next/headers";
import { PORTAL_URL } from "@/data/site";
import { parseAttendee, type Attendee } from "@/lib/dashboard-access";

/**
 * Who is looking at the Live Dashboard. Sign-in lives on the portal: its
 * /live-dashboard route sets SHARED_SESSION_COOKIE on `.immersethebay.org`,
 * and we forward it to the portal's /api/attendee, which checks the session and
 * whether that hacker was accepted and confirmed their spot.
 */
const SHARED_SESSION_COOKIE = "itb_session";

/** Returns null when the portal couldn't be reached, so callers don't mistake an outage for "signed out". */
export async function getAttendee(includeBadge = false): Promise<Attendee | null> {
  const token = (await cookies()).get(SHARED_SESSION_COOKIE)?.value;
  if (!token) return { status: "signed-out" };

  try {
    const res = await fetch(`${PORTAL_URL}/api/attendee${includeBadge ? "?badge=1" : ""}`, {
      headers: { cookie: `${SHARED_SESSION_COOKIE}=${encodeURIComponent(token)}` },
      cache: "no-store",
    });
    return res.ok ? parseAttendee(await res.json()) : null;
  } catch {
    return null;
  }
}
