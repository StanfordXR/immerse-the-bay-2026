import type { NextConfig } from "next";

const liveOrigin = process.env.NEXT_PUBLIC_LIVE_URL
  ? new URL(process.env.NEXT_PUBLIC_LIVE_URL).origin
  : undefined;
if (liveOrigin && liveOrigin !== "https://live.immersethebay.org") {
  throw new Error("The live dashboard requires https://live.immersethebay.org to share the portal's attendee session.");
}
const liveHost = liveOrigin
  ? new URL(liveOrigin).hostname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  : undefined;

const nextConfig: NextConfig = {
  async rewrites() {
    return { beforeFiles: liveHost ? [{
      source: "/",
      has: [{ type: "host", value: liveHost }],
      destination: "/dashboard",
    }] : [] };
  },
  async redirects() {
    return [
      ...(liveOrigin ? [{
        // Also handles the existing portal callback, preserving signed_in and
        // the shared cookie. Never redirect the live host back to itself.
        source: "/dashboard",
        has: [{ type: "host" as const, value: "immersethebay\\.org" }],
        destination: liveOrigin,
        permanent: false,
      }] : []),
      // www duplicates the site for SEO and splits analytics by host.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.immersethebay.org" }],
        destination: "https://immersethebay.org/:path*",
        permanent: true,
      },
      // Campaign short links live on this domain so posts read
      // immersethebay.org/r/…, but the portal's /r/ route does the actual
      // work (click log + first-touch cookie) before sending visitors back
      // here with UTMs. Codes are defined in the portal repo.
      {
        source: "/r/:code",
        // Preserve which public alias was used. The portal records this for
        // referral diagnostics; direct legacy portal links default to "portal".
        destination: "https://portal.immersethebay.org/r/:code?via=site",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
