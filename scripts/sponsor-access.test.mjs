import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../lib/sponsor-key.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { validSponsorKey, SPONSOR_ACCESS_EXPIRES_AT } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const key = Buffer.alloc(32, 64).toString("base64url");
const digest = createHash("sha256").update(key).digest("hex");
const now = Date.parse("2026-11-11T09:00:00-08:00");

test("only the configured sponsor key opens the view", () => {
  assert.equal(validSponsorKey(key, digest, now), true);
  assert.equal(validSponsorKey(undefined, digest, now), false);
  assert.equal(validSponsorKey(key, undefined, now), false);
  assert.equal(validSponsorKey(digest, digest, now), false);
  assert.equal(validSponsorKey(Buffer.alloc(32, 20).toString("base64url"), digest, now), false);
  assert.equal(validSponsorKey(key, "z".repeat(64), now), false);
});

test("the link and its sessions fail closed at event-weekend expiry", () => {
  assert.equal(SPONSOR_ACCESS_EXPIRES_AT, Date.parse("2026-11-16T00:00:00-08:00"));
  assert.equal(validSponsorKey(key, digest, SPONSOR_ACCESS_EXPIRES_AT - 1), true);
  assert.equal(validSponsorKey(key, digest, SPONSOR_ACCESS_EXPIRES_AT), false);
  assert.equal(validSponsorKey(key, digest, NaN), false);
});
