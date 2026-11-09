import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { attendeeRows } from "./refresh-attendee-schedule.mjs";

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

test("the public overview contains only public milestone fields", async () => {
  const source = await readFile(new URL("../data/schedule.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
  const { PUBLIC_SCHEDULE, OPENING_START } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  assert.deepEqual(PUBLIC_SCHEDULE.map(({ id }) => id), ["friday", "saturday", "sunday"]);
  const blocks = PUBLIC_SCHEDULE.flatMap(({ blocks }) => blocks);
  assert.equal(OPENING_START, "2026-11-13T19:00:00-08:00");
  assert.equal(blocks.find(({ id }) => id === "fri-opening").time, "7 PM–8 PM");
  assert.equal(blocks.find(({ id }) => id === "sun-judging").time, "10 AM–12 PM");
  assert.ok(blocks.every((block) => Object.keys(block).every((key) => ["id", "title", "time", "size"].includes(key))));
});
