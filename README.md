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

The marketing homepage lives at `app/(marketing)/page.tsx`. The attendee dashboard pages live under `app/dashboard/[[...view]]`.

## Public schedule

The public site reads only the approved three-day overview in `data/schedule.ts`. Update those public milestone times separately if they change.

The full schedule and event Discord invite live in the production Vercel project's sensitive, server-only `ITB_ATTENDEE_CONFIG_JSON` variable. Keep local copies out of Git. The JSON contains `rows` of `[id, title, start, end, rooms]` plus optional `titles`, `notes`, `roomLabels`, and `discordUrl`. Only authorized dashboard users receive this data.

A schedule-only release can set the private `ITB_ATTENDEE_RUN_OF_SHOW_JSON` to
`{ "rows": [...], "submissionDeadline": "...", "workshops": {...} }`. Valid
rows override the base timetable and its announced deadline; optional workshop
copy is keyed by schedule row ID and only supplements those rows. The original
guide, Discord, track/submission links, and other display metadata stay in place.
`attendeeWorkshopSnapshot` builds this overlay from announcement-marked Notion
rows and the explicit `Attendee listing` sections of selected workshop cards.
An `Attendee ends` field may shorten the displayed slot without changing the
internal room reservation. Do not publish the full Notion card bodies.

Optional `arrivalGuideUrl`, `tracksUrl`, `submissionUrl`, and `submissionDeadline` can be set once those details are approved. Links must be HTTPS, and deadlines use ISO 8601 with an explicit offset. Tracks & Submit links to the public 2026 Devpost listing before opening; track details, an optional direct link on the same Devpost event host, and the submission deadline are shown at or after opening.

Set the server-only `ITB_ARRIVAL_GUIDE_URL` to the guide sent to attendees. It overrides `arrivalGuideUrl` in the schedule snapshot and is only rendered on the gated Help page.
For approved guide FAQs, set `ITB_HELP_FAQ_JSON` to an array of `{ "question": "...", "answer": "..." }` items. The dashboard reads it only for signed-in Help. The main site's general FAQ is shared from `data/faq.ts`.

For a schedule refresh, set `NOTION_SCHEDULE_TOKEN` and `NOTION_SCHEDULE_SOURCE_ID` in a private shell, then run `npm run --silent schedule:refresh -- /path/to/private/attendee-config.json`. To apply an already-reviewed announcement-only snapshot, append `--rows /path/to/approved-attendee-rows.json`. Use the current private configuration as the base so guide, Discord, track, and submission links stay intact. Save the output to a new private file and review it before changing the sensitive Vercel variable. The export never copies volunteer assignments, page bodies, or internal notes; it uses the announced submission deadline.

## Optional live subdomain

The dashboard works under `/dashboard` without configuration. When `live.immersethebay.org` is attached to the same website project, set `NEXT_PUBLIC_LIVE_URL=https://live.immersethebay.org` at build time. Home, Schedule, Equipment, Tracks & Submit, Help, and My Badge have their own URLs on the live host. The existing marketing-domain `/dashboard` redirects there, preserving the portal's sign-in callback query. The public Schedule and Tracks URLs stay separate. The portal must continue to set its secure attendee cookie on `.immersethebay.org`; do not use an unrelated domain with this handoff.

## Passwordless sponsor view

`/sponsor` on the live host is a separate read-only view of the same attendee
pages: Home, Schedule, Equipment, Tracks & Submit, and Help. It includes the
attendee guide, event Discord link, and the same timed track reveal. It does
not expose My Badge or staff tools, create a portal account, or authorize
actions in the equipment or application portals.

Generate a random 32-byte base64url key and set only its SHA-256 hex digest as
the sensitive production variable `ITB_SPONSOR_ACCESS_KEY_SHA256`. Share
`https://live.immersethebay.org/sponsor#<key>` directly with sponsors, not in
public channels or in source. The client clears the fragment and exchanges it
for an HttpOnly, host-only session cookie. Sponsor pages have no analytics and
are not cached. The link is forwardable and expires with all sponsor sessions
at midnight Pacific after Sunday, November 15. Removing or rotating the digest
and redeploying invalidates the previous link and all its sessions.

Staff and reviewers have early access. Accepted hackers who confirmed their spot can use the dashboard and its announcements after midnight Pacific on Wednesday, November 11. Before launch, the portal's `/api/attendee` response must identify staff explicitly; legacy responses do not receive early access.

**My Badge** and the staff-only **Check-in** link are grouped after the navigation
divider. Check-in links to the authenticated reviewer desk. My Badge requests a
signed QR for the current account only: staff can use it before launch, and
confirmed hackers can use it from the opening time. The QR is excluded from replay.

### Apple Wallet check-in pass

My Badge offers **Add to Apple Wallet** and an Android download using the same
signed `.pkpass` and QR as the attendee’s web badge. On Android, open the file
in Google Wallet when offered, or save the QR image and import it through
**Add to Wallet → Photo**. This is a file/photo import, not a Google Wallet
issuer link. Both downloads recheck the dashboard gate and return only the
signed-in attendee’s badge. The web QR and image download stay available if
Wallet signing is off. The portal’s confirmed-hacker card links to the shared
dashboard instead of duplicating the schedule.

Configure these three **server-only** values as multiline PEMs:

| Variable | File |
| --- | --- |
| `ITB_WALLET_SIGNER_CERT_PEM` | Pass Type ID certificate for `pass.org.immersethebay.checkin.2026` |
| `ITB_WALLET_SIGNER_KEY_PEM` | Its matching private key |
| `ITB_WALLET_WWDR_PEM` | Apple Worldwide Developer Relations G4 intermediate |

Keep the key out of source control, public environment variables, and shared
files. For local QA, the smoke test reads `signer-cert.pem`, `signer-key.pem`,
and `wwdr.pem` from the owner-only directory set in
`ITB_WALLET_TEST_SIGNING_DIR`, and uses synthetic attendees on loopback. Optionally
set `ITB_WALLET_SAMPLE_PATH` to a new filename outside the repo to save a signed
sample. The sample QR is not valid for event check-in.

Before rollout, verify the complete sign-in and callback in a nonproduction environment and test staff, confirmed hackers, and unconfirmed attendees. Configure the dashboard’s Discord announcements channel and bot credentials server-side. The schedule requires no Notion credentials at runtime.

Local smoke test (uses synthetic portal responses and loopback only): build with `NEXT_PUBLIC_LIVE_URL=https://live.immersethebay.org npm run build`, then run `node scripts/dashboard-smoke.mjs`, `node scripts/dashboard-smoke.mjs --after-launch`, and `node scripts/dashboard-smoke.mjs --after-opening`. Do not set a portal URL when building for this test.

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
