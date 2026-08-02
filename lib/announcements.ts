import {
  DASHBOARD_ANNOUNCEMENTS_SHEET_GID,
  DASHBOARD_ANNOUNCEMENTS_SHEET_ID,
} from "@/data/dashboard";

export interface Announcement {
  id: string;
  date: string;
  time: string;
  message: string;
}

function formatTime(value: string): string {
  const trimmed = value.trim();
  const withoutSeconds = trimmed.replace(/^(\d{1,2}:\d{2}):\d{2}(\s*[AP]M)$/i, "$1$2");
  return withoutSeconds.replace(/\s*([AP]M)$/i, " $1");
}

function cellValue(
  cell: { v?: string | number | boolean; f?: string } | null | undefined,
  kind: "date" | "time" | "text",
): string {
  if (!cell) return "";

  const formatted = cell.f?.trim();
  if (formatted) {
    return kind === "time" ? formatTime(formatted) : formatted;
  }

  if (cell.v == null) return "";
  const raw = String(cell.v).trim();
  if (raw.startsWith("Date(")) return "";

  return kind === "time" ? formatTime(raw) : raw;
}

function columnIndex(labels: string[], ...names: string[]): number {
  for (const name of names) {
    const idx = labels.findIndex((label) => label.includes(name));
    if (idx !== -1) return idx;
  }
  return -1;
}

export function parseAnnouncementsFromGviz(raw: string): Announcement[] {
  const match = raw.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);?\s*$/);
  if (!match) return [];

  const payload = JSON.parse(match[1]) as {
    table?: {
      cols?: Array<{ label?: string }>;
      rows?: Array<{
        c?: Array<{ v?: string | number | boolean; f?: string } | null>;
      }>;
    };
  };

  const table = payload.table;
  if (!table?.rows?.length) return [];

  const labels = (table.cols ?? []).map((col) => (col.label ?? "").toLowerCase().trim());

  let dateIdx = columnIndex(labels, "date");
  let timeIdx = columnIndex(labels, "time");
  let messageIdx = columnIndex(labels, "message", "announcement", "text");

  if (dateIdx === -1 && timeIdx === -1 && messageIdx === -1) {
    dateIdx = 0;
    timeIdx = 1;
    messageIdx = 2;
  } else {
    if (dateIdx === -1) dateIdx = 0;
    if (timeIdx === -1) timeIdx = 1;
    if (messageIdx === -1) messageIdx = Math.max(dateIdx, timeIdx, 0) + 1;
  }

  return table.rows
    .map((row, index) => {
      const cells = row.c ?? [];
      const date = cellValue(cells[dateIdx], "date");
      const time = cellValue(cells[timeIdx], "time");
      const message = cellValue(cells[messageIdx], "text");

      return {
        id: `row-${index}-${date}-${time}`,
        date,
        time,
        message,
      };
    })
    .filter((item) => item.message.length > 0)
    .filter(
      (item) =>
        !(
          item.date.toLowerCase() === "date" &&
          item.time.toLowerCase() === "time" &&
          item.message.toLowerCase() === "message"
        ),
    )
    .reverse();
}

export async function fetchAnnouncementsFromSheet(): Promise<Announcement[]> {
  const url = `https://docs.google.com/spreadsheets/d/${DASHBOARD_ANNOUNCEMENTS_SHEET_ID}/gviz/tq?tqx=out:json&gid=${DASHBOARD_ANNOUNCEMENTS_SHEET_GID}`;

  const response = await fetch(url, {
    next: { revalidate: 0 },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google Sheet request failed (${response.status})`);
  }

  const raw = await response.text();
  return parseAnnouncementsFromGviz(raw);
}
