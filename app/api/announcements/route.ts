import { fetchAnnouncements } from "@/lib/announcements";
import { getAttendee } from "@/lib/attendee";
import { dashboardAccess } from "@/lib/dashboard-access";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = dashboardAccess(await getAttendee());
  if (access.status !== "allowed") {
    return NextResponse.json(
      { announcements: [] },
      {
        status: access.status === "unavailable" ? 503 : access.status === "signed-out" ? 401 : 403,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
  try {
    const announcements = await fetchAnnouncements();

    return NextResponse.json(
      { announcements, fetchedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { announcements: [] },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
