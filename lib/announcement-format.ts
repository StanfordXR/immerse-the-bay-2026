export interface AnnouncementPart {
  text: string;
  href?: string;
}

export interface AnnouncementEmbed {
  href: string;
  title: string;
  description?: string;
}

interface DiscordMention {
  id: string;
  username: string;
  global_name: string | null;
}

const EVENT_DISCORD = "https://discord.com/channels/1564030617778126968/";
// Only resolve attendee channels. Unknown or internal channel IDs are not linked.
const CHANNEL_NAMES: Record<string, string> = {
  "1564280294855409794": "announcements",
  "1564030618310811870": "introductions",
  "1564030618776641539": "event-questions",
};

const LINKS = /\[([^\]\r\n]{1,300})\]\((?:<(https?:\/\/[^\s<>]+)>|(https?:\/\/(?:[^\s<>()]|\([^()\s]*\))+))(?:[ \t]+"[^"\r\n]*")?\)|<(https?:\/\/[^\s<>]+)>|<#(\d+)>|(?<![A-Za-z0-9_:/])(https?:\/\/[^\s<>"\x60[\]{}]+)/gi;

export function safeAnnouncementHref(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 2048 || !/^https?:\/\//i.test(value) || /[\s\\\x00-\x1f\x7f]/.test(value)) return;
  try {
    const url = new URL(value);
    if ((url.protocol === "https:" || url.protocol === "http:") && url.hostname && !url.username && !url.password) return url.href;
  } catch {
    // Ignore malformed or unsafe Discord URLs.
  }
}

function plainText(text: string, names: ReadonlyMap<string, string>): string {
  return text
    .replace(/<@!?(\d+)>/g, (_, id: string) => "@" + (names.get(id) ?? "someone"))
    .replace(/<@&\d+>/g, "")
    .replace(/<#\d+>/g, "#channel")
    .replace(/<a?(:\w+:)\d+>/g, "$1")
    .replace(/<t:(\d+)(?::\w)?>/g, (_, unix: string) =>
      new Date(Number(unix) * 1000).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short",
      }))
    .replace(/@(everyone|here)\b[ \t]*/gi, "")
    .replace(/(\*\*|__|~~|\|\|)/g, "")
    .replace(/[ \t]+(?=[,.;:!?])/g, "");
}

function trimBareUrl(value: string, precedingText: string) {
  let url = value.replace(/[.,;!?]+$/, "");
  // Keep balanced parentheses and underscores in URLs. Only trim closing
  // punctuation, or formatting marks that also appear before the URL.
  const extraClosing = (url.match(/\)/g)?.length ?? 0) - (url.match(/\(/g)?.length ?? 0);
  for (let i = 0; i < extraClosing && url.endsWith(")"); i++) url = url.slice(0, -1);
  for (const marks of ["**", "__", "~~", "||"]) {
    if (precedingText.endsWith(marks) && url.endsWith(marks)) url = url.slice(0, -2);
  }
  return url;
}

/** Parse the URLs first: stripping Markdown from the raw text corrupts URL paths. */
export function formatDiscordAnnouncement(content: string, mentions: DiscordMention[] = []): AnnouncementPart[] {
  const names = new Map(mentions.map((mention) => [mention.id, mention.global_name ?? mention.username]));
  const parts: AnnouncementPart[] = [];
  let cursor = 0;
  for (const match of content.matchAll(LINKS)) {
    const [literal, label, wrapped, target, autolink, channelId, bare] = match;
    const offset = match.index!;
    const prefix = content.slice(cursor, offset);
    const channel = channelId && Object.hasOwn(CHANNEL_NAMES, channelId) ? CHANNEL_NAMES[channelId] : undefined;
    const bareUrl = bare ? trimBareUrl(bare, prefix) : undefined;
    const rawUrl = channel ? EVENT_DISCORD + channelId : wrapped ?? target ?? autolink ?? bareUrl;
    const href = safeAnnouncementHref(rawUrl);
    if (!href || !rawUrl) continue;
    if (prefix) parts.push({ text: plainText(prefix, names) });
    parts.push({ text: channel ? "#" + channel : label ? plainText(label, names).trim() || rawUrl : rawUrl, href });
    cursor = offset + literal.length - (bare && bareUrl ? bare.length - bareUrl.length : 0);
  }
  if (cursor < content.length) parts.push({ text: plainText(content.slice(cursor), names) });
  if (parts[0] && !parts[0].href) parts[0].text = parts[0].text.trimStart();
  const last = parts[parts.length - 1];
  if (last && !last.href) last.text = last.text.trimEnd();
  return parts.filter(({ text }) => text.length > 0);
}

/** Display only Discord's own link metadata, with no third-party fetch or iframe. */
export function formatDiscordEmbeds(embeds: unknown): AnnouncementEmbed[] {
  if (!Array.isArray(embeds)) return [];
  const previews: AnnouncementEmbed[] = [];
  const seen = new Set<string>();
  for (const embed of embeds) {
    if (previews.length >= 2) break;
    if (!embed || typeof embed !== "object") continue;
    const href = safeAnnouncementHref(embed.url);
    if (!href || seen.has(href)) continue;
    const title = typeof embed.title === "string" ? embed.title.trim().slice(0, 160) : "";
    const description = typeof embed.description === "string" ? embed.description.trim().slice(0, 320) : "";
    if (!title && !description) continue;
    seen.add(href);
    previews.push({ href, title: title || new URL(href).hostname, ...(description ? { description } : {}) });
  }
  return previews;
}
