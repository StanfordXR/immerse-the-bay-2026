import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../lib/dashboard-access.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
});
const { dashboardAccess, DASHBOARD_OPENS_AT, parseAttendee } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const name = "Test attendee";
const verified = (audience) => parseAttendee({ status: "confirmed", name, audience });
const dayBefore = Date.parse("2026-11-10T23:59:59.999-08:00");
const launch = Date.parse("2026-11-11T00:00:00-08:00");

test("only explicitly verified staff get early access", () => {
  assert.equal(dashboardAccess(verified("staff"), dayBefore).status, "allowed");
  for (const attendee of [verified("hacker"), verified(undefined), verified("unknown")]) {
    assert.equal(dashboardAccess(attendee, dayBefore).status, "waiting");
  }
});

test("confirmed hackers gain access at midnight Pacific on November 11", () => {
  assert.equal(DASHBOARD_OPENS_AT, launch);
  assert.equal(new Date(DASHBOARD_OPENS_AT).toISOString(), "2026-11-11T08:00:00.000Z");
  assert.deepEqual(dashboardAccess(verified("hacker"), launch), { status: "allowed", name, isOpen: true });
  assert.equal(dashboardAccess(verified("staff"), launch).status, "allowed");
});

test("the release date does not grant access to unconfirmed or unauthenticated users", () => {
  for (const now of [dayBefore, launch]) {
    assert.equal(dashboardAccess(parseAttendee({ status: "signed-out" }), now).status, "signed-out");
    assert.equal(dashboardAccess(parseAttendee({ status: "not-confirmed", audience: "staff" }), now).status, "not-confirmed");
    assert.equal(dashboardAccess(parseAttendee({ status: "confirmed", audience: "staff" }), now).status, "unavailable");
    assert.equal(dashboardAccess(null, now).status, "unavailable");
  }
});
