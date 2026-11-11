import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { attendeeRows, mergeAttendeeConfig } from "./refresh-attendee-schedule.mjs";

const page = (icon, overrides = {}) => ({
  id: "row",
  icon: { type: "emoji", emoji: icon },
  properties: {
    Name: { title: [{ plain_text: "Opening Ceremony" }] },
    "Date & Time": { date: { start: "2026-11-13T19:00:00-08:00", end: "2026-11-13T20:00:00-08:00" } },
    Location: { multi_select: [{ name: "Example Private Hall 111" }] },
    Volunteers: "private staff notes",
  },
  ...overrides,
});

test("the private export selects announcement-marked rows and excludes staff notes", () => {
  assert.deepEqual(attendeeRows([page("🔒"), page("📣", { archived: true }), page("📣")]), [
    ["2026-11-13T19:00-opening-ceremony", "Opening Ceremony", "2026-11-13T19:00:00-08:00", "2026-11-13T20:00:00-08:00", ["Example Private Hall 111"]],
  ]);
});

test("an updated run of show preserves attendee metadata and uses only the announced deadline", () => {
  const deadline = (icon, name, start) => page(icon, { properties: {
    Name: { title: [{ plain_text: name }] },
    "Date & Time": { date: { start, end: null } },
    Location: { multi_select: [] },
  } });
  const rows = attendeeRows([
    deadline("📣", "Submissions close", "2026-11-15T09:00:00.000-08:00"),
    deadline("🔒", "Submissions actually close", "2026-11-15T09:30:00.000-08:00"),
  ]);
  const base = { rows: [], discordUrl: "https://discord.gg/test-invite", submissionUrl: "https://submit.example.test/" };
  assert.deepEqual(mergeAttendeeConfig(base, rows), {
    ...base, rows, submissionDeadline: "2026-11-15T09:00:00-08:00",
  });
  assert.throws(() => mergeAttendeeConfig(base, []));
  assert.throws(() => mergeAttendeeConfig(base, [rows[0], rows[0]]));
  assert.throws(() => mergeAttendeeConfig(base, [["unsafe", "Workshop", "2026-11-13T12:15:00", null, []]]));
});

test("the public overview contains only public milestone fields", async () => {
  const source = await readFile(new URL("../data/schedule.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
  const { PUBLIC_SCHEDULE, OPENING_START } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  assert.deepEqual(PUBLIC_SCHEDULE.map(({ id }) => id), ["friday", "saturday", "sunday"]);
  const blocks = PUBLIC_SCHEDULE.flatMap(({ blocks }) => blocks);
  assert.equal(OPENING_START, "2026-11-13T19:00:00-08:00");
  assert.equal(blocks.find(({ id }) => id === "fri-workshops").time, "12 PM–6 PM");
  assert.equal(blocks.find(({ id }) => id === "fri-opening").time, "7 PM–8 PM");
  assert.equal(blocks.find(({ id }) => id === "sun-judging").time, "10 AM–12 PM");
  assert.ok(blocks.every((block) => Object.keys(block).every((key) => ["id", "title", "time", "size"].includes(key))));
});
