import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../lib/dashboard-phase.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
});
const { dashboardPhase, countdownParts } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const hour = 60 * 60 * 1000;
const timeline = { opening: 0, hackingStart: 2 * hour, hackingEnd: 38 * hour, closing: 42 * hour };
const phaseAt = (h) => dashboardPhase(timeline, h * hour).id;

test("The hero follows the event from countdown to wrap", () => {
  assert.deepEqual([-1, 1, 3, 37, 39, 43, 45].map(phaseAt),
    ["before", "opening", "hacking", "hacking", "wrap-up", "wrap-up", "after"]);
});

test("The countdown automatically switches at opening, hacking start, and the submission deadline", () => {
  assert.deepEqual(dashboardPhase(timeline, -1), { id: "before", target: timeline.opening });
  assert.deepEqual(dashboardPhase(timeline, timeline.opening), { id: "opening", target: timeline.hackingStart });
  assert.deepEqual(countdownParts(timeline.hackingStart - timeline.opening).map(({ value }) => value), [2, 0, 0]);
  assert.deepEqual(dashboardPhase(timeline, timeline.hackingStart), {
    id: "hacking", target: timeline.hackingEnd, progress: 0, finalStretch: false,
  });
  assert.deepEqual(dashboardPhase(timeline, timeline.hackingEnd), { id: "wrap-up", target: timeline.closing });
});

test("Hacking reports progress and flags the final three hours", () => {
  const early = dashboardPhase(timeline, 20 * hour);
  assert.equal(early.progress, 0.5);
  assert.equal(early.finalStretch, false);
  assert.equal(dashboardPhase(timeline, 35 * hour).finalStretch, true);
});

test("Countdowns drop the days unit once under a day", () => {
  const values = (ms) => countdownParts(ms).map(({ value, label }) => `${value}${label[0]}`);
  assert.deepEqual(values(26 * hour + 61_000), ["1D", "2H", "1M", "1S"]);
  assert.deepEqual(values(5 * hour), ["5H", "0M", "0S"]);
  assert.deepEqual(values(-1), ["0H", "0M", "0S"]);
});
