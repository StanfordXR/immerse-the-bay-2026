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

function approvedLink(value: unknown): string | undefined {
  if (typeof value !== "string") return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password) return url.href;
  } catch {
    return;
  }
}

function approvedDeadline(value: unknown): string | undefined {
  if (typeof value === "string"
      && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
      && Number.isFinite(Date.parse(value))) return value;
}

interface AttendeeDashboardConfig {
  schedule: AttendeeScheduleDay[];
  discordUrl?: string;
  arrivalGuideUrl?: string;
  tracksUrl?: string;
  submissionUrl?: string;
  submissionDeadline?: string;
}

function readConfig(raw: string | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const config: unknown = JSON.parse(raw);
    if (config && typeof config === "object" && !Array.isArray(config)) return config as Record<string, unknown>;
  } catch {
    // A bad refresh must not break the dashboard or replace the existing schedule.
  }
  return {};
}

/** Loaded only after the server has authorized access to the live dashboard. */
export function getAttendeeSchedule(): AttendeeDashboardConfig {
  const configuredGuide = approvedLink(process.env.ITB_ARRIVAL_GUIDE_URL);
  const config = readConfig(process.env.ITB_ATTENDEE_CONFIG_JSON);
  const runOfShow = readConfig(process.env.ITB_ATTENDEE_RUN_OF_SHOW_JSON);
  const { rows, titles, notes, roomLabels, discordUrl, arrivalGuideUrl, tracksUrl, submissionUrl, submissionDeadline } =
    config;
  // A schedule-only refresh must not overwrite the original private links and display metadata.
  const approvedRows = Array.isArray(runOfShow.rows) && runOfShow.rows.length && runOfShow.rows.every(isRow)
    ? runOfShow.rows : undefined;
  const validRows = approvedRows ?? (Array.isArray(rows) && rows.every(isRow) ? rows : []);
  const names = labels(titles);
  const descriptions = labels(notes);
  const locations = labels(roomLabels);

  const schedule = validRows.length ? days.map(([id, label, date, iso]) => ({
    id, label, date,
    events: validRows.flatMap(([id, raw, start, end, rooms]) => {
      if (!start.startsWith(iso)) return [];
      const title = names.get(raw) ?? raw.replace(/^\[Food\] /, "").replace(/^\[([^\]]+)\]/, "$1").replace(/\bFounder OH\b/i, "Founder Office Hours");
      return [{
        id, start, end,
        title,
        time: start.length === 10 ? "All day" : end
          ? `${display(start)}–${display(end)}` : display(start),
        location: rooms.map((room) => locations.get(room) ?? room).join(" · "),
        description: descriptions.get(raw),
        workshop: /workshop|founder office hours/i.test(title),
      }];
    }),
  })) : [];
  return {
    schedule,
    discordUrl: typeof discordUrl === "string" && /^https:\/\/discord\.gg\/[A-Za-z0-9-]+\/?$/.test(discordUrl)
      ? discordUrl : undefined,
    arrivalGuideUrl: configuredGuide ?? approvedLink(arrivalGuideUrl),
    tracksUrl: approvedLink(tracksUrl),
    submissionUrl: approvedLink(submissionUrl),
    submissionDeadline: (approvedRows ? approvedDeadline(runOfShow.submissionDeadline) : undefined)
      ?? approvedDeadline(submissionDeadline),
  };
}
