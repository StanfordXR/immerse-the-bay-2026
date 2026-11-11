import "server-only";
import { cookies, headers } from "next/headers";
import { validSponsorKey } from "@/lib/sponsor-key";

const LIVE_HOST = "live.immersethebay.org";

/** Host-only cookie; never a portal session or shared with the application hostname. */
export function sponsorSessionHost(host: string | null) {
  if (host === LIVE_HOST) {
    return { origin: `https://${LIVE_HOST}`, name: "__Host-itb_sponsor", secure: true };
  }
  if (process.env.NODE_ENV === "development" && host && /^(?:127\.0\.0\.1|localhost):\d+$/.test(host)) {
    return { origin: `http://${host}`, name: "itb_sponsor_local", secure: false };
  }
  return null;
}

export function sponsorKeyAccepted(key: string | undefined, now = Date.now()) {
  return validSponsorKey(key, process.env.ITB_SPONSOR_ACCESS_KEY_SHA256, now);
}

export async function hasSponsorAccess() {
  const site = sponsorSessionHost((await headers()).get("host"));
  return !!site && sponsorKeyAccepted((await cookies()).get(site.name)?.value);
}
