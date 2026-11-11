import { createHash, timingSafeEqual } from "node:crypto";

/** The shared link and all sessions stop working after the event weekend. */
export const SPONSOR_ACCESS_EXPIRES_AT = Date.parse("2026-11-16T00:00:00-08:00");

export function validSponsorKey(key: string | undefined, expectedHash: string | undefined, now: number) {
  if (!Number.isFinite(now) || now >= SPONSOR_ACCESS_EXPIRES_AT
    || !key || !/^[A-Za-z0-9_-]{43}$/.test(key)
    || !expectedHash || !/^[a-f0-9]{64}$/i.test(expectedHash)) return false;

  return timingSafeEqual(createHash("sha256").update(key).digest(), Buffer.from(expectedHash, "hex"));
}
