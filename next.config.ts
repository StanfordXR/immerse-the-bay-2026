import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
