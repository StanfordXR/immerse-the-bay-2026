import { announcementFeedResponse, unavailableAnnouncements } from "@/lib/announcements";
import { getAttendee } from "@/lib/attendee";
import { dashboardAccess } from "@/lib/dashboard-access";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = dashboardAccess(await getAttendee());
  if (access.status !== "allowed") {
    return unavailableAnnouncements(access.status === "unavailable" ? 503 : access.status === "signed-out" ? 401 : 403);
  }
  return announcementFeedResponse();
}
