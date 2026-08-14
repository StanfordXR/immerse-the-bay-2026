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
        destination: "https://portal.immersethebay.org/r/:code",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
