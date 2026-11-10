import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function load(relative) {
  const source = await readFile(new URL(relative, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const { DASHBOARD_TABS, DASHBOARD_BADGE, dashboardPath, isDashboardPage } =
  await load("../data/dashboard-nav.ts");
const { dashboardHighlights } = await load("../lib/dashboard-highlights.ts");
const { pickScheduleAnchor, scheduleClock, scheduleEventState } = await load("../lib/schedule-timing.ts");

test("all primary tabs and My Badge have canonical and local paths", () => {
  assert.deepEqual(DASHBOARD_TABS.map(({ id }) => id), ["home", "schedule", "equipment", "tracks", "help"]);
  for (const { id } of [...DASHBOARD_TABS, DASHBOARD_BADGE]) {
    assert.equal(isDashboardPage(id), true);
    assert.equal(dashboardPath(id, true), id === "home" ? "/" : `/${id}`);
    assert.equal(dashboardPath(id, false), id === "home" ? "/dashboard" : `/dashboard/${id}`);
  }
  assert.equal(isDashboardPage("organizer-roster"), false);
  assert.equal(isDashboardPage("people"), false);
});

test("Home highlights current and parallel next sessions without treating all-day or expired events as ongoing", () => {
  const now = Date.parse("2026-11-13T15:00:00-08:00");
  const time = (hour) => `2026-11-13T${hour}:00:00-08:00`;
  const days = [{
    label: "Friday",
    events: [
      { id: "next-a", start: time("16"), end: time("17") },
      { id: "all-day", start: "2026-11-13" },
      { id: "current", start: time("14"), end: time("16") },
      { id: "ended", start: time("13"), end: time("15") },
      { id: "instant", start: time("15") },
      { id: "next-b", start: time("16"), end: time("18") },
      { id: "later", start: time("17") },
    ],
  }];
  const { current, next } = dashboardHighlights(days, now);
  assert.deepEqual(current.map(({ id }) => id), ["current"]);
  assert.deepEqual(next.map(({ id }) => id), ["next-a", "next-b"]);
  assert.equal(next[0].day, "Friday");
});

test("Schedule opens on the first, current, next, or last timed session", () => {
  const days = [
    { id: "friday", events: [
      { id: "first", start: "2026-11-13T12:00:00-08:00", end: "2026-11-13T13:00:00-08:00" },
      { id: "late", start: "2026-11-13T18:00:00-08:00", end: "2026-11-13T19:00:00-08:00" },
    ] },
    { id: "saturday", events: [
      { id: "all-day", start: "2026-11-14" },
      { id: "last", start: "2026-11-14T10:30:00-08:00", end: "2026-11-14T11:30:00-08:00" },
    ] },
  ];
  const pick = (iso) => pickScheduleAnchor(days, Date.parse(iso));
  assert.deepEqual(pick("2026-11-12T23:00:00-08:00"), { dayIndex: 0, eventId: "first" });
  assert.deepEqual(pick("2026-11-13T12:30:00-08:00"), { dayIndex: 0, eventId: "first" });
  assert.deepEqual(pick("2026-11-13T13:30:00-08:00"), { dayIndex: 0, eventId: "late" });
  assert.deepEqual(pick("2026-11-14T10:35:00-08:00"), { dayIndex: 1, eventId: "last" });
  assert.deepEqual(pick("2026-11-14T13:00:00-08:00"), { dayIndex: 1, eventId: "all-day" });
  assert.deepEqual(pick("2026-11-16T15:30:00-08:00"), { dayIndex: 1, eventId: "last" });
});

test("Schedule states use Pacific date boundaries and known session ends", () => {
  const allDay = { start: "2026-11-14" };
  const timed = { start: "2026-11-13T19:00:00-08:00", end: "2026-11-13T20:00:00-08:00" };
  const state = (event, iso) => scheduleEventState(event, scheduleClock(Date.parse(iso)));
  assert.equal(state(allDay, "2026-11-14T07:59:00Z"), "upcoming");
  assert.equal(state(allDay, "2026-11-14T08:00:00Z"), "current");
  assert.equal(state(allDay, "2026-11-15T08:00:00Z"), "past");
  assert.equal(state(timed, "2026-11-13T18:59:59-08:00"), "upcoming");
  assert.equal(state(timed, "2026-11-13T19:00:00-08:00"), "current");
  assert.equal(state(timed, "2026-11-13T20:00:00-08:00"), "past");
});
