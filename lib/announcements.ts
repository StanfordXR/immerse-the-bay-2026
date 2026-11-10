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
}

/** The fields we use from Discord's message object. */
interface DiscordMessage {
  id: string;
  content: string;
  timestamp: string;
  pinned?: boolean;
  mentions: Array<{ id: string; username: string; global_name: string | null }>;
}

/** How long Discord responses are cached, so polling clients share one request. */
const REVALIDATE_SECONDS = 10;

const TIME_ZONE = "America/Los_Angeles";

/**
 * Turns Discord's message syntax into plain text: mentions become names,
 * custom emoji become `:name:`, `<t:…>` timestamps become Pacific time, and
 * bold/italic/strike markers are dropped.
 */
export function toPlainText(message: Pick<DiscordMessage, "content" | "mentions">): string {
  const names = new Map(message.mentions.map((u) => [u.id, u.global_name ?? u.username]));
  return message.content
    .replace(/<@!?(\d+)>/g, (_, id: string) => `@${names.get(id) ?? "someone"}`)
    .replace(/<@&\d+>/g, "")
    .replace(/<#\d+>/g, "#channel")
    .replace(/<a?(:\w+:)\d+>/g, "$1")
    .replace(/<t:(\d+)(?::\w)?>/g, (_, unix: string) =>
      new Date(Number(unix) * 1000).toLocaleString("en-US", {
        timeZone: TIME_ZONE,
        dateStyle: "medium",
        timeStyle: "short",
      }),
    )
    .replace(/@(everyone|here)\s*/g, "")
    .replace(/(\*\*|__|~~|\|\|)/g, "")
    .trim();
}

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
      return {
        id: m.id,
        date: sent.toLocaleDateString("en-US", { timeZone: TIME_ZONE, month: "short", day: "numeric" }),
        time: sent.toLocaleTimeString("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" }),
        message: toPlainText(m),
        pinned: m.pinned === true,
      };
    })
    .filter((a) => a.message.length > 0)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
}
