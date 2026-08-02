import { fetchAnnouncementsFromSheet } from "@/lib/announcements";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const announcements = await fetchAnnouncementsFromSheet();

    return NextResponse.json(
      { announcements, fetchedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load announcements";

    return NextResponse.json({ error: message, announcements: [] }, { status: 500 });
  }
}
