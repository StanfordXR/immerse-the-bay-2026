import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../lib/announcement-format.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
});
const moduleUrl = "data:text/javascript;base64," + Buffer.from(outputText).toString("base64");
const { formatDiscordAnnouncement, formatDiscordEmbeds, safeAnnouncementHref } = await import(moduleUrl);

test("masked links keep underscores and fragments, and the event channel references stay clickable", () => {
  const guide = "https://docs.example.test/document/d/Guide__ID/edit?tab=t.0#heading=h.abc";
  const parts = formatDiscordAnnouncement(
    "Hey @everyone, the **event** is up!\n\n[Arrival Guide](" + guide + "). Questions? Ask in <#1564030618776641539>.",
  );
  assert.equal(parts.map((part) => part.text).join(""), "Hey, the event is up!\n\nArrival Guide. Questions? Ask in #event-questions.");
  assert.deepEqual(parts.filter((part) => part.href), [
    { text: "Arrival Guide", href: guide },
    { text: "#event-questions", href: "https://discord.com/channels/1564030617778126968/1564030618776641539" },
  ]);
});

test("plain and angle-wrapped URLs preserve punctuation in the destination where it belongs", () => {
  const parts = formatDiscordAnnouncement(
    "See <https://example.test/one__two> and (https://example.test/a_(b)). [Docs](https://example.test/(a))",
  );
  assert.deepEqual(parts.filter((part) => part.href).map((part) => part.href), [
    "https://example.test/one__two",
    "https://example.test/a_(b)",
    "https://example.test/(a)",
  ]);
  assert.equal(parts.map((part) => part.text).join(""),
    "See https://example.test/one__two and (https://example.test/a_(b)). Docs");
});

test("non-web URLs, credentials, and unknown channel IDs do not turn into clickable links", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,test", "//example.test/", "https://victor@example.test/", "https://example.test/\n"]) {
    assert.equal(safeAnnouncementHref(url), undefined);
  }
  const parts = formatDiscordAnnouncement("[Bad](javascript:alert(1)) https://victor@example.test/ <#1234>");
  assert.equal(parts.some((part) => part.href), false);
  assert.ok(parts.map((part) => part.text).join("").endsWith("#channel"));
});

test("only safe text and links from Discord previews are kept; no image or iframe metadata is used", () => {
  const good = { url: "https://example.test/guide__one", title: " Guide ", description: "Event information", image: { url: "https://tracker.test/pixel" } };
  assert.deepEqual(formatDiscordEmbeds([
    { url: "javascript:alert(1)", title: "Unsafe" }, good, good,
    { url: "https://example.test/other", description: "More information" },
    { url: "https://example.test/third", title: "Too many previews" },
  ]), [
    { href: "https://example.test/guide__one", title: "Guide", description: "Event information" },
    { href: "https://example.test/other", title: "example.test", description: "More information" },
  ]);
});
