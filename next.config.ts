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
    ];
  },
};

export default nextConfig;
