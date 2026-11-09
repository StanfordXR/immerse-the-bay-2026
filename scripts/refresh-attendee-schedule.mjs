import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const firstDay = "2026-11-13";
const lastDay = "2026-11-15";

export function attendeeRows(pages) {
  return pages.flatMap((page) => {
    if (page.archived || page.in_trash || page.is_archived || page.icon?.type !== "emoji" || page.icon.emoji !== "📣") return [];
    const { Name: name, "Date & Time": when, Location: location } = page.properties;
    const title = name.title.map(({ plain_text }) => plain_text).join("").trim();
    const { start, end } = when.date ?? {};
    if (!title || !start) throw new Error("An attendee schedule entry is missing its title or date.");
    const day = start.slice(0, 10);
    if (day < firstDay || day > lastDay) return [];
    if (!Number.isFinite(Date.parse(start)) || (end && (!Number.isFinite(Date.parse(end)) || Date.parse(end) < Date.parse(start)))) {
      throw new Error("An attendee schedule entry has invalid dates.");
    }
    // Do not copy page bodies, internal URLs, people, volunteer notes or formulas.
    const id = `${start.slice(0, 16)}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    return [[id, title, start, end ?? null, location.multi_select.map(({ name }) => name)]];
  }).sort((a, b) => a[2].localeCompare(b[2]) || a[1].localeCompare(b[1]));
}

async function refresh() {
  const token = process.env.NOTION_SCHEDULE_TOKEN;
  const sourceId = process.env.NOTION_SCHEDULE_SOURCE_ID;
  const configPath = process.argv[2];
  if (!token || !sourceId || !configPath) {
    throw new Error("Set NOTION_SCHEDULE_TOKEN and NOTION_SCHEDULE_SOURCE_ID and pass the existing private config path.");
  }
  const config = JSON.parse(await readFile(configPath, "utf8"));
  if (!config || typeof config !== "object" || !Array.isArray(config.rows)) {
    throw new Error("Invalid private attendee configuration.");
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
  const rows = attendeeRows(pages);
  if (!rows.length) throw new Error("No attendee schedule entries returned; snapshot unchanged.");
  process.stdout.write(JSON.stringify({ ...config, rows }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await refresh();
}
