import posthog from "posthog-js";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Only track the real site: localhost and Vercel preview traffic was
// polluting production analytics with dev sessions.
const isProductionHost =
  typeof window !== "undefined" &&
  /(^|\.)immersethebay\.org$/.test(window.location.hostname);

if (posthogKey && isProductionHost) {
  posthog.init(posthogKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2026-05-30",
  });
}
