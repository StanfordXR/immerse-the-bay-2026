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

test("the five primary tabs and My Badge have canonical and local paths", () => {
  assert.deepEqual(DASHBOARD_TABS.map(({ id }) => id), ["home", "schedule", "equipment", "tracks", "help"]);
  for (const { id } of [...DASHBOARD_TABS, DASHBOARD_BADGE]) {
    assert.equal(isDashboardPage(id), true);
    assert.equal(dashboardPath(id, true), id === "home" ? "/" : `/${id}`);
    assert.equal(dashboardPath(id, false), id === "home" ? "/dashboard" : `/dashboard/${id}`);
  }
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
