This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The marketing homepage lives at `app/(marketing)/page.tsx`. The attendee dashboard lives at `app/dashboard/page.tsx`.

## Public schedule

The public site reads only the approved three-day overview in `data/schedule.ts`. Update those public milestone times separately if they change.

The full schedule and event Discord invite live in the production Vercel project's sensitive, server-only `ITB_ATTENDEE_CONFIG_JSON` variable. Keep local copies out of Git. The JSON contains `rows` of `[id, title, start, end, rooms]` plus optional `titles`, `notes`, `roomLabels`, and `discordUrl`. Only authorized dashboard users receive this data.

For a schedule refresh, set `NOTION_SCHEDULE_TOKEN` and `NOTION_SCHEDULE_SOURCE_ID` in a private shell, then run `npm run --silent schedule:refresh -- /path/to/private/attendee-config.json`. Redirect stdout to a new private file, review it locally, and update the sensitive Vercel variable before deploying. The export includes only announcement-marked rows and preserves the existing display metadata. It never copies volunteer assignments, page bodies, or internal notes.

## Optional live subdomain

The dashboard works at `/dashboard` without configuration. To launch on a sibling domain later, attach `live.immersethebay.org` to the same website project, then set `NEXT_PUBLIC_LIVE_URL=https://live.immersethebay.org` at build time. The live host root serves the attendee dashboard with its own navigation. The existing marketing-domain `/dashboard` redirects there, preserving the portal's sign-in callback query. The portal must continue to set its secure attendee cookie on `.immersethebay.org`; do not use an unrelated domain with this handoff.

Staff and reviewers have early access. Accepted hackers who confirmed their spot can use the dashboard and its announcements after midnight Pacific on Wednesday, November 11. Before launch, the portal's `/api/attendee` response must identify staff explicitly; legacy responses do not receive early access.

Before rollout, verify the complete sign-in and callback in a nonproduction environment and test staff, confirmed hackers, and unconfirmed attendees. Configure the dashboard’s Discord announcements channel and bot credentials server-side. The schedule requires no Notion credentials at runtime.

Local smoke test (uses synthetic portal responses and loopback only): build with `NEXT_PUBLIC_LIVE_URL=https://live.immersethebay.org npm run build`, then run `node scripts/dashboard-smoke.mjs`. Do not set a portal URL when building for this test.

`live.immersebay.org` (without “the”) is a different domain and cannot receive the current attendee cookie. Using it would require a separate sign-in handoff design, not just a DNS record.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
