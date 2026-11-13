import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const firstDay = "2026-11-13";
const lastDay = "2026-11-15";
const isAnnounced = (page) => !page.archived && !page.in_trash && !page.is_archived
  && page.icon?.type === "emoji" && page.icon.emoji === "📣";
const titleOf = (page) => page.properties.Name.title.map(({ plain_text }) => plain_text).join("").trim();
const rowId = (title, start) => `${start.slice(0, 16)}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

export function attendeeRows(pages) {
  return pages.flatMap((page) => {
    if (!isAnnounced(page)) return [];
    const { "Date & Time": when, Location: location } = page.properties;
    const title = titleOf(page);
    const { start, end } = when.date ?? {};
    if (!title || !start) throw new Error("An attendee schedule entry is missing its title or date.");
    const day = start.slice(0, 10);
    if (day < firstDay || day > lastDay) return [];
    if (!Number.isFinite(Date.parse(start)) || (end && (!Number.isFinite(Date.parse(end)) || Date.parse(end) < Date.parse(start)))) {
      throw new Error("An attendee schedule entry has invalid dates.");
    }
    // Do not copy page bodies, internal URLs, people, volunteer notes or formulas.
    return [[rowId(title, start), title, start, end ?? null, location.multi_select.map(({ name }) => name)]];
  }).sort((a, b) => a[2].localeCompare(b[2]) || a[1].localeCompare(b[1]));
}

const explicitDate = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?$/;
const validDate = (value) => typeof value === "string" && explicitDate.test(value) && Number.isFinite(Date.parse(value));

/** Apply approved schedule rows without replacing unrelated attendee links and notes. */
export function mergeAttendeeConfig(config, rows) {
  if (!config || typeof config !== "object" || !Array.isArray(config.rows)) {
    throw new Error("Invalid private attendee configuration.");
  }
  if (!Array.isArray(rows) || !rows.length || !rows.every((row) => {
    if (!Array.isArray(row) || row.length !== 5) return false;
    const [id, title, start, end, rooms] = row;
    return typeof id === "string" && id.trim() && typeof title === "string" && title.trim()
      && validDate(start) && start.slice(0, 10) >= firstDay && start.slice(0, 10) <= lastDay
      && (end === null || (validDate(end) && Date.parse(end) >= Date.parse(start)))
      && Array.isArray(rooms) && rooms.every((room) => typeof room === "string");
  })) {
    throw new Error("The approved schedule rows are missing or invalid; snapshot unchanged.");
  }
  if (new Set(rows.map(([id]) => id)).size !== rows.length) {
    throw new Error("Duplicate schedule row identifiers; snapshot unchanged.");
  }
  const deadlines = rows.filter(([, title, start]) => /^submissions close$/i.test(title.trim()) && start.length > 10);
  if (deadlines.length > 1) throw new Error("Multiple announced submission deadlines; snapshot unchanged.");
  // Only the announcement-facing deadline is displayed. Notion includes fractional seconds.
  const submissionDeadline = deadlines[0]?.[2].replace(/\.\d+(?=(?:Z|[+-]\d{2}:\d{2})$)/, "");
  return { ...config, rows, ...(submissionDeadline ? { submissionDeadline } : {}) };
}

/** Read only the explicitly approved attendee section, never surrounding Notion notes. */
function attendeeListing(markdown) {
  const sections = markdown.split(/^## Attendee listing[ \t]*\r?$/m);
  if (sections.length !== 2) throw new Error("Expected exactly one Attendee listing section.");
  const fields = {};
  const section = sections[1].split(/^#{1,2}[ \t]+/m)[0].trim();
  for (const line of section.split(/\r?\n/).map((part) => part.trim()).filter(Boolean)) {
    const match = /^(Presenter|Description|Attendee ends): (.+)$/.exec(line);
    if (!match || /https?:\/\/|mailto:|\[[^\]]*\]|[<>]/i.test(match[2]) || match[2].length > 500) {
      throw new Error("Unapproved content in an Attendee listing field.");
    }
    const key = { Presenter: "presenter", Description: "description", "Attendee ends": "end" }[match[1]];
    if (fields[key]) throw new Error("Duplicate Attendee listing field.");
    fields[key] = match[2];
  }
  if (!fields.presenter && !fields.description) throw new Error("Missing attendee workshop copy.");
  return fields;
}

function publicEnd(label, start, internalEnd) {
  const match = /^(1[0-2]|[1-9]):([0-5]\d) (AM|PM) Pacific$/.exec(label);
  const offset = start.match(/[+-]\d{2}:\d{2}$/)?.[0];
  if (!match || !offset || !internalEnd) throw new Error("Invalid attendee end time.");
  const hours = String(Number(match[1]) % 12 + (match[3] === "PM" ? 12 : 0)).padStart(2, "0");
  const end = `${start.slice(0, 10)}T${hours}:${match[2]}:00${offset}`;
  if (Date.parse(end) <= Date.parse(start) || Date.parse(end) > Date.parse(internalEnd)) {
    throw new Error("Attendee end must fit inside the internal room reservation.");
  }
  return end;
}

/** Build the private schedule overlay using an explicit set of workshop cards. */
export function attendeeWorkshopSnapshot(pages, markdownByPageId) {
  const rows = attendeeRows(pages);
  const byRowId = new Map(rows.map((row) => [row[0], row]));
  const byPageId = new Map(pages.map((page) => [page.id, page]));
  const workshops = {};
  for (const [id, markdown] of Object.entries(markdownByPageId)) {
    const page = byPageId.get(id);
    const start = page?.properties["Date & Time"].date?.start;
    const row = page && start && isAnnounced(page) ? byRowId.get(rowId(titleOf(page), start)) : undefined;
    if (!row || typeof markdown !== "string") throw new Error("Workshop card is not on the announced schedule.");
    const { end, ...copy } = attendeeListing(markdown);
    if (end) row[3] = publicEnd(end, row[2], row[3]);
    workshops[row[0]] = copy;
  }
  return { ...mergeAttendeeConfig({ rows: [] }, rows), workshops };
}

async function refresh() {
  const [configPath, mode, rowsPath, extra] = process.argv.slice(2);
  if (!configPath || extra || (mode && (mode !== "--rows" || !rowsPath))) {
    throw new Error("Pass the existing private config path, optionally followed by --rows and an approved rows file.");
  }
  const config = JSON.parse(await readFile(configPath, "utf8"));
  if (mode === "--rows") {
    const rows = JSON.parse(await readFile(rowsPath, "utf8"));
    process.stdout.write(JSON.stringify(mergeAttendeeConfig(config, rows)));
    return;
  }
  const token = process.env.NOTION_SCHEDULE_TOKEN;
  const sourceId = process.env.NOTION_SCHEDULE_SOURCE_ID;
  if (!token || !sourceId) {
    throw new Error("Set NOTION_SCHEDULE_TOKEN and NOTION_SCHEDULE_SOURCE_ID for a live refresh.");
  }
  const pages = [];
  let cursor;
  do {
    const response = await fetch(`https://api.notion.com/v1/data_sources/${encodeURIComponent(sourceId)}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": "2025-09-03",
      },
      body: JSON.stringify({ page_size: 100, start_cursor: cursor }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Notion query failed (HTTP ${response.status}); snapshot unchanged.`);
    const data = await response.json();
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  process.stdout.write(JSON.stringify(mergeAttendeeConfig(config, attendeeRows(pages))));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await refresh();
}
