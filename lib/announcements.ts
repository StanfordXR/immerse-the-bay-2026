import { formatDiscordAnnouncement, formatDiscordEmbeds, type AnnouncementEmbed, type AnnouncementPart } from "@/lib/announcement-format";

/**
 * Live Dashboard announcements, read from the organizers' Discord
 * #announcements channel through a bot token. Discord is the source of truth:
 * edits and deletions there show up here on the next refresh.
 */

export interface Announcement {
  id: string;
  date: string;
  time: string;
  message: string;
  pinned: boolean;
  parts: AnnouncementPart[];
  embeds: AnnouncementEmbed[];
}

/** The fields we use from Discord's message object. */
interface DiscordMessage {
  id: string;
  content: string;
  timestamp: string;
  pinned?: boolean;
  mentions: Array<{ id: string; username: string; global_name: string | null }>;
  embeds?: unknown;
}

/** How long Discord responses are cached, so polling clients share one request. */
const REVALIDATE_SECONDS = 10;

const TIME_ZONE = "America/Los_Angeles";

/** Pinned messages first, with Discord's newest-first order within each group. */
export async function fetchAnnouncements(): Promise<Announcement[]> {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_ANNOUNCEMENTS_CHANNEL_ID;
  if (!token || !channelId) throw new Error("Announcements aren't configured");

  const response = await fetch(
    `https://discord.com/api/v10/channels/${channelId}/messages?limit=50`,
    {
      headers: { Authorization: `Bot ${token}` },
      next: { revalidate: REVALIDATE_SECONDS },
    },
  );
  if (!response.ok) throw new Error(`Discord request failed (${response.status})`);

  const messages = (await response.json()) as DiscordMessage[];
  return messages
    .map((m) => {
      const sent = new Date(m.timestamp);
      const parts = formatDiscordAnnouncement(m.content ?? "", m.mentions);
      return {
        id: m.id,
        date: sent.toLocaleDateString("en-US", { timeZone: TIME_ZONE, month: "short", day: "numeric" }),
        time: sent.toLocaleTimeString("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" }),
        message: parts.map(({ text }) => text).join(""),
        pinned: m.pinned === true,
        parts,
        embeds: formatDiscordEmbeds(m.embeds),
      };
    })
    .filter((a) => a.message.length > 0 || a.embeds.length > 0)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
}

const feedHeaders = { "Cache-Control": "private, no-store, max-age=0" };

export function unavailableAnnouncements(status: 401 | 403 | 503) {
  return Response.json({ announcements: [] }, { status, headers: feedHeaders });
}

/** Only call after the request has passed its own audience's access check. */
export async function announcementFeedResponse() {
  try {
    return Response.json({ announcements: await fetchAnnouncements(), fetchedAt: new Date().toISOString() }, {
      headers: feedHeaders,
    });
  } catch {
    return unavailableAnnouncements(503);
  }
}
