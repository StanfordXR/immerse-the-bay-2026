import { NextResponse } from "next/server";
import { sponsorKeyAccepted, sponsorSessionHost } from "@/lib/sponsor-access";
import { SPONSOR_ACCESS_EXPIRES_AT } from "@/lib/sponsor-key";

export const runtime = "nodejs";

const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, noarchive",
};

export async function POST(request: Request) {
  const site = sponsorSessionHost(request.headers.get("host"));
  if (!site || request.headers.get("origin") !== site.origin || request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ ok: false }, { status: 403, headers: privateHeaders });
  }

  const key = request.headers.get("authorization")?.match(/^Bearer ([A-Za-z0-9_-]{43})$/)?.[1];
  const now = Date.now();
  if (!key || !sponsorKeyAccepted(key, now)) {
    return NextResponse.json({ ok: false }, { status: 401, headers: privateHeaders });
  }

  const response = NextResponse.json({ ok: true }, { headers: privateHeaders });
  response.cookies.set(site.name, key, {
    path: "/",
    httpOnly: true,
    secure: site.secure,
    sameSite: "lax",
    expires: new Date(SPONSOR_ACCESS_EXPIRES_AT),
    maxAge: Math.floor((SPONSOR_ACCESS_EXPIRES_AT - now) / 1000),
  });
  return response;
}
