import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import QRCode from "qrcode";
import { PNG } from "pngjs";
import ts from "typescript";

const sourceUrl = new URL("../lib/wallet-pass.ts", import.meta.url);
const source = await readFile(sourceUrl, "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
});
const compiled = { exports: {} };
new Function("require", "module", "exports", outputText)(createRequire(sourceUrl), compiled, compiled.exports);
const { decodeBadgeQr, validateWalletSigner } = compiled.exports;

const qrOptions = { errorCorrectionLevel: "M", margin: 4, scale: 6 };
const hacker = `itb2026.12345678-1234-1234-1234-1234567890ab.${"H".repeat(43)}`;
const staff = `itb2026.staff.${Buffer.from("test-reviewer").toString("base64url")}.${"S".repeat(43)}`;

test("Wallet uses the exact check-in QR data produced by the portal for either badge type", async () => {
  for (const badge of [hacker, staff, `itb2026.staff.${"A".repeat(171)}.${"S".repeat(43)}`]) {
    assert.equal(decodeBadgeQr(await QRCode.toDataURL(badge, qrOptions)), badge);
  }
});

test("unsupported QR content and malformed or oversized images cannot become passes", async () => {
  for (const text of ["https://example.test", `${hacker}\n`, staff.slice(0, -1)]) {
    assert.equal(decodeBadgeQr(await QRCode.toDataURL(text, qrOptions)), null);
  }
  const valid = await QRCode.toDataURL(hacker, qrOptions);
  const oversized = PNG.sync.write(new PNG({ width: 769, height: 769 })).toString("base64");
  for (const bad of [valid.replace("image/png", "image/svg+xml"), valid.slice(0, 100), valid + "A".repeat(20_000), `data:image/png;base64,${oversized}`]) {
    assert.equal(decodeBadgeQr(bad), null);
  }
});

test("bad signing configuration fails closed", () => {
  assert.equal(validateWalletSigner({ signerCert: "invalid", signerKey: "invalid", wwdr: "invalid" }), null);
});
