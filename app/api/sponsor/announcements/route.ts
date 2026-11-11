import { announcementFeedResponse, unavailableAnnouncements } from "@/lib/announcements";
import { hasSponsorAccess } from "@/lib/sponsor-access";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return await hasSponsorAccess() ? announcementFeedResponse() : unavailableAnnouncements(401);
}
