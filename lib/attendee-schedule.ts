import "server-only";
import type { AttendeeScheduleDay } from "@/data/types";

const time = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit",
});
const display = (iso: string) => time.format(new Date(iso)).replace(":00 ", " ");

const days = [
  ["friday", "Friday", "November 13", "2026-11-13"],
  ["saturday", "Saturday", "November 14", "2026-11-14"],
  ["sunday", "Sunday", "November 15", "2026-11-15"],
] as const;

type Row = [id: string, title: string, start: string, end: string | null, rooms: string[]];

function isRow(value: unknown): value is Row {
  if (!Array.isArray(value) || value.length !== 5) return false;
  const [id, title, start, end, rooms] = value;
  return typeof id === "string" && typeof title === "string" &&
    typeof start === "string" && Number.isFinite(Date.parse(start)) &&
    (end === null || (typeof end === "string" && Number.isFinite(Date.parse(end)) && Date.parse(end) >= Date.parse(start))) &&
    Array.isArray(rooms) && rooms.every((room) => typeof room === "string");
}

const labels = (value: unknown) => new Map(
  value && typeof value === "object" && !Array.isArray(value)
    ? Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string")
    : [],
);

/** Loaded only after the server has authorized access to the live dashboard. */
export function getAttendeeSchedule(): { schedule: AttendeeScheduleDay[]; discordUrl?: string } {
  const empty = { schedule: [] };
  const raw = process.env.ITB_ATTENDEE_CONFIG_JSON;
  if (!raw) return empty;

  let config: unknown;
  try {
    config = JSON.parse(raw);
  } catch {
    return empty;
  }
  if (!config || typeof config !== "object") return empty;
  const { rows, titles, notes, roomLabels, discordUrl } = config as Record<string, unknown>;
  if (!Array.isArray(rows) || !rows.length || !rows.every(isRow)) return empty;
  const names = labels(titles);
  const descriptions = labels(notes);
  const locations = labels(roomLabels);

  const schedule = days.map(([id, label, date, iso]) => ({
    id, label, date, iso,
    events: rows.flatMap(([id, raw, start, end, rooms]) => {
      if (!start.startsWith(iso)) return [];
      return [{
        id, start, end,
        title: names.get(raw) ?? raw.replace(/^\[Food\] /, "").replace(/^\[([^\]]+)\]/, "$1"),
        time: start.length === 10 ? "All day" : end
          ? `${display(start)}–${display(end)}` : display(start),
        location: rooms.map((room) => locations.get(room) ?? room).join(" · "),
        description: descriptions.get(raw),
        workshop: /workshop|founder office hours/i.test(raw),
      }];
    }),
  }));
  return {
    schedule,
    discordUrl: typeof discordUrl === "string" && /^https:\/\/discord\.gg\/[A-Za-z0-9-]+\/?$/.test(discordUrl)
      ? discordUrl : undefined,
  };
}
