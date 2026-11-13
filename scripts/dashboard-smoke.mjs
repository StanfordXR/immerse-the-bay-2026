import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { once } from "node:events";
import { readFile, writeFile } from "node:fs/promises";
import { createServer, request as httpRequest } from "node:http";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import QRCode from "qrcode";

const bind = async (server) => {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
};
const afterOpening = process.argv.includes("--after-opening");
const afterLaunch = afterOpening || process.argv.includes("--after-launch");
const testTime = Date.parse(afterOpening ? "2026-11-13T19:00:00-08:00"
  : afterLaunch ? "2026-11-11T00:00:00-08:00" : "2026-11-10T23:59:59-08:00");
const announcement = "Synthetic dashboard test announcement";
const announcementGuide = "https://docs.example.test/arrival__guide#check-in";
const announcementContent = announcement + " [Arrival guide](" + announcementGuide + ") <#1564030618776641539>";
const announcementChannel = `itb-smoke-${randomUUID()}`;
const privateRoom = "Example Private Hall 111";
const privateNote = "Attendee-only workshop setup note";
const workshopPresenter = "Example Workshop Presenter";
const workshopDescription = "A confirmed description from the workshop listing.";
const privateInvite = "https://discord.gg/itb-smoke-fixture";
const guideUrl = "https://guide.example.test/attendees";
const snapshotGuideUrl = "https://guide.example.test/snapshot-fallback";
const guideFaq = "Where do I pick up the synthetic check-in badge?";
const tracksUrl = "https://tracks.example.test/reveal";
const devpostUrl = "https://immerse-the-bay-2026.devpost.com/";
const submissionUrl = `${devpostUrl}project-submission/fixture`;
const sponsorKey = randomBytes(32).toString("base64url");
const sponsorDigest = createHash("sha256").update(sponsorKey).digest("hex");
const badgeCodes = {
  reviewer: `itb2026.staff.${Buffer.from("fixture-reviewer").toString("base64url")}.${"R".repeat(43)}`,
  admin: `itb2026.staff.${Buffer.from("fixture-admin").toString("base64url")}.${"A".repeat(43)}`,
  "accepted-fixture": `itb2026.12345678-1234-1234-1234-1234567890ab.${"H".repeat(43)}`,
};
const badgePngs = Object.fromEntries(await Promise.all(Object.entries(badgeCodes).map(async ([key, value]) =>
  [key, await QRCode.toDataURL(value, { errorCorrectionLevel: "M", margin: 4, scale: 6 })])));
const privateMarkers = [privateRoom, privateNote, workshopPresenter, workshopDescription, privateInvite, guideUrl, snapshotGuideUrl, guideFaq, tracksUrl, submissionUrl, ...Object.values(badgePngs)];
function assertWorkshopLayout(html) {
  const row = html.match(/<li[^>]*>(?:(?!<\/li>).)*?<h3[^>]*>Example Workshop<\/h3>.*?<\/li>/s)?.[0];
  assert.ok(row, "Missing workshop card");
  const markup = row.replaceAll("<!-- -->", "");
  assert.match(markup, /<time[^>]*>12:00 PM–12:30 PM<\/time>/);
  assert.ok(markup.includes(`>${privateRoom} | ${workshopPresenter}</p><p`), "Presenter should follow the room, with the description in a separate paragraph");
  assert.ok(markup.includes(`>${workshopDescription}</p>`));
  const labels = [...html.matchAll(/<time[^>]*>(\d[^<]*)<\/time>/g)].map(([, label]) => label);
  assert.ok(labels.length && labels.every((label) => /^(?:\d{1,2}:\d{2} [AP]M)(?:–\d{1,2}:\d{2} [AP]M)?$/.test(label)));
}
const signingDir = process.env.ITB_WALLET_TEST_SIGNING_DIR;
const samplePath = process.env.ITB_WALLET_SAMPLE_PATH;
const walletPath = "/api/wallet/badge";
const qrPath = `${walletPath}?format=qr`;
const walletEnv = Object.fromEntries(await Promise.all(Object.entries({
  ITB_WALLET_SIGNER_CERT_PEM: "signer-cert.pem",
  ITB_WALLET_SIGNER_KEY_PEM: "signer-key.pem",
  ITB_WALLET_WWDR_PEM: "wwdr.pem",
}).map(async ([key, filename]) => [key, signingDir ? await readFile(join(signingDir, filename), "utf8") : ""])));
const attendeeConfig = JSON.stringify({
  rows: [["old-slot", "Outdated Event", "2026-11-13T10:00:00-08:00", null, []]],
  notes: { "Example Workshop": privateNote },
  discordUrl: privateInvite,
  arrivalGuideUrl: snapshotGuideUrl,
  tracksUrl,
  submissionUrl,
  submissionDeadline: "2026-11-15T08:00:00-08:00",
});
const runOfShow = JSON.stringify({
  rows: [
    ["sample-workshop", "Example Workshop", "2026-11-13T12:00:00-08:00", "2026-11-13T12:30:00-08:00", [privateRoom]],
    ["sample-opening", "Opening Ceremony", "2026-11-13T19:00:00-08:00", "2026-11-13T20:00:00-08:00", [privateRoom]],
    ["sample-hacking", "Hacking", "2026-11-14", null, [privateRoom]],
    ["sample-closing", "Closing Ceremony", "2026-11-15T13:30:00-08:00", null, [privateRoom]],
  ],
  workshops: { "sample-workshop": { presenter: workshopPresenter, description: workshopDescription } },
  submissionDeadline: "2026-11-15T09:00:00-08:00",
});
const fixtures = {
  reviewer: { status: "confirmed", name: "Test Reviewer", audience: "staff", staffRole: "reviewer" },
  admin: { status: "confirmed", name: "Test Admin", audience: "staff", staffRole: "admin" },
  "accepted-fixture": { status: "confirmed", name: "Test Hacker", audience: "hacker" },
  legacy: { status: "confirmed", name: "Test Legacy Account" },
  expired: { status: "signed-out" },
};
const portal = createServer((req, res) => {
  if (req.url !== "/api/attendee" && req.url !== "/api/attendee?badge=1") return res.writeHead(404).end();
  const token = (req.headers.cookie ?? "").match(/itb_session=(\S+)$/)?.[1];
  res.setHeader("Content-Type", "application/json");
  const result = fixtures[token] ?? { status: "not-confirmed" };
  res.end(JSON.stringify(req.url.endsWith("?badge=1") && (result.audience === "staff" || (afterLaunch && token === "accepted-fixture"))
    ? { ...result, badgeQr: badgePngs[token] }
    : result));
});
const portalPort = await bind(portal);
const reserve = createServer();
const port = await bind(reserve);
await new Promise((resolve) => reserve.close(resolve));
// Only the test process has a simulated clock and Discord response.
const preload = `
  Date.now = () => ${testTime};
  const fetchUpstream = globalThis.fetch;
  globalThis.fetch = (input, options) => {
    const url = String(input?.url ?? input);
    if (url.startsWith(${JSON.stringify(`https://discord.com/api/v10/channels/${announcementChannel}/`)})) {
      return Promise.resolve(Response.json([{
        id: "smoke", content: ${JSON.stringify(announcementContent)}, mentions: [], timestamp: "2026-11-09T20:00:00Z",
        embeds: [{ url: ${JSON.stringify(announcementGuide)}, title: "Arrival guide", description: "Read before Friday." }],
      }, {
        id: "pin", content: "Synthetic pinned announcement", mentions: [], pinned: true, timestamp: "2026-11-08T20:00:00Z",
      }]));
    }
    return fetchUpstream(input, options);
  };
`;
const child = spawn(process.execPath, ["--import", `data:text/javascript,${encodeURIComponent(preload)}`, "node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  env: {
    ...process.env,
    NEXT_PUBLIC_LIVE_URL: "https://live.immersethebay.org",
    NEXT_PUBLIC_PORTAL_URL: `http://127.0.0.1:${portalPort}`,
    DISCORD_BOT_TOKEN: "synthetic-test-token",
    DISCORD_ANNOUNCEMENTS_CHANNEL_ID: announcementChannel,
    ITB_ATTENDEE_CONFIG_JSON: attendeeConfig,
    ITB_ATTENDEE_RUN_OF_SHOW_JSON: runOfShow,
    ITB_ARRIVAL_GUIDE_URL: guideUrl,
    ITB_HELP_FAQ_JSON: JSON.stringify([{ question: guideFaq, answer: "Use the synthetic check-in desk." }]),
    ITB_SPONSOR_ACCESS_KEY_SHA256: sponsorDigest,
    ...walletEnv,
  },
  stdio: "inherit",
});
// Node fetch can normalize Host back to the loopback address. Use HTTP
// directly so this actually exercises Next's hostname-based routing.
const request = (path, headers = {}, method = "GET") => new Promise((resolve, reject) => {
  httpRequest({ host: "127.0.0.1", port, path, method, headers, signal: AbortSignal.timeout(6000) }, async (res) => {
    try {
      const chunks = [];
      for await (const chunk of res) chunks.push(chunk);
      const body = Buffer.concat(chunks);
      resolve({
        ok: res.statusCode >= 200 && res.statusCode < 300,
        status: res.statusCode,
        headers: res.headers,
        text: () => body.toString(),
        buffer: () => body,
      });
    } catch (error) {
      reject(error);
    }
  }).on("error", reject).end();
});
try {
  for (let attempt = 0; ; attempt++) {
    try {
      if ((await request("/schedule")).ok) break;
    } catch (error) {
      if (attempt === 39) throw error;
    }
    if (attempt === 39 || child.exitCode !== null) throw new Error("Local server did not start");
    await delay(250);
  }
  for (const path of ["/", "/schedule", "/tracks", "/faq"]) {
    const response = await request(path, { host: "immersethebay.org" });
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const marker of privateMarkers) assert.ok(!html.includes(marker), `Private data on public ${path}`);
    assert.doesNotMatch(html, /Live dashboard navigation/);
    if (path === "/") {
      const markup = html.replaceAll("<!-- -->", "");
      assert.ok(/<button[^>]*disabled=""[^>]*>(?:(?!<\/button>).)*?>Volunteer \(Closed\)</.test(markup),
        "Volunteer is not a disabled button on the public homepage");
      assert.match(html, /href="https:\/\/portal\.immersethebay\.org\/apply\?utm_source=es"/);
      assert.doesNotMatch(html, /Open now!/);
    }
    if (path === "/schedule") {
      assert.match(html, /12 PM–6 PM/);
      assert.match(html, /7 PM–8 PM/);
      assert.match(html, /10 AM–12 PM/);
      for (const day of ["Friday", "Saturday", "Sunday"]) assert.match(html, new RegExp(`>${day}</h3>`));
      assert.doesNotMatch(html, /role="tab(list|panel)?"/);
    }
  }
  const live = { host: "live.immersethebay.org" };
  const views = {
    "/": "Live Dashboard",
    "/schedule": "Schedule",
    "/equipment": "Equipment",
    "/tracks": "Tracks &amp; Submit",
    "/help": "Help",
    "/badge": "My Badge",
  };
  for (const session of ["", "not-approved", "expired", ...(afterLaunch ? [] : ["accepted-fixture", "legacy"])]) {
    const headers = { ...live, cookie: session ? `itb_session=${session}` : "" };
    await Promise.all(Object.keys(views).map(async (path) => {
      const response = await request(path, headers);
      assert.equal(response.status, 200, path);
      assert.match(response.headers["cache-control"], /no-store/);
      const html = await response.text();
      assert.match(html, afterLaunch ? /Dashboard access|Sign in to the live dashboard/ : /Live dashboard is coming Wednesday/, path);
      for (const marker of privateMarkers) assert.ok(!html.includes(marker), `Private data on gated ${path}`);
      assert.doesNotMatch(html, /Live dashboard navigation|role="tablist"|Test Hacker/);
    }));
    const payload = await request("/schedule?_rsc=smoke", { ...headers, rsc: "1" });
    assert.equal(payload.status, 200);
    const payloadText = await payload.text();
    for (const marker of privateMarkers) assert.ok(!payloadText.includes(marker), "Private data in gated navigation payload");
    const feed = await request("/api/announcements", headers);
    assert.equal(feed.status, !session || session === "expired" ? 401 : 403);
    assert.deepEqual(JSON.parse(await feed.text()), { announcements: [] });
    const wallet = await request(walletPath, headers);
    assert.equal(wallet.status, !session || session === "expired" ? 401 : 403);
    assert.match(wallet.headers["cache-control"], /private.*no-store/);
    assert.ok(!wallet.text().includes("Test Reviewer"));
    const qr = await request(qrPath, headers);
    assert.equal(qr.status, wallet.status);
    assert.match(qr.headers["cache-control"], /private.*no-store/);
  }
  for (const session of ["reviewer", "admin", ...(afterLaunch ? ["accepted-fixture", "legacy"] : [])]) {
    const headers = { ...live, cookie: `itb_session=${session}` };
    await Promise.all(Object.entries(views).map(async ([path, heading]) => {
      const response = await request(path, headers);
      assert.equal(response.status, 200, path);
      assert.match(response.headers["cache-control"], /no-store/);
      const html = await response.text();
      assert.match(html, /Live dashboard navigation/);
      const staff = session === "reviewer" || session === "admin";
      assert.equal(html.includes("/review/check-in"), staff);
      for (const [holder, png] of Object.entries(badgePngs)) {
        assert.equal(html.includes(png), path === "/badge" && session === holder);
      }
      const hasOwnBadge = path === "/badge" && Boolean(badgePngs[session]);
      assert.equal(html.includes(`href="${qrPath}"`), hasOwnBadge);
      const hasWalletPass = Boolean(signingDir && hasOwnBadge);
      assert.equal(html.includes(`href="${walletPath}"`), hasWalletPass);
      assert.equal(html.includes("Add to Apple Wallet"), hasWalletPass);
      assert.equal(html.includes("Download for Android"), hasWalletPass);
      const accountNav = html.match(/<ul[^>]*aria-label="Account and staff pages"[^>]*>[\s\S]*?<\/ul>/)?.[0] ?? "";
      assert.match(accountNav, /border-l/);
      assert.match(accountNav, /href="\/badge"/);
      assert.equal(accountNav.includes("/review/check-in"), staff);
      assert.doesNotMatch(html, /href="\/people"|>People<|Your profile/i);
      assert.ok(html.includes('src="/images/logo/ITB_Standard.png"'), "Missing the branded live wordmark");
      assert.equal(html.includes("Immerse the Bay Spotify playlist"), path === "/", "Playlist belongs on Home only");
      if (path !== "/help") assert.ok(!html.includes(guideUrl) && !html.includes(snapshotGuideUrl), "Guide belongs on Help only");
      if (path !== "/help") assert.ok(!html.includes(guideFaq), "Guide FAQs belong on Help only");
      if (path === "/") assert.match(html, /id="live-hero-title"/);
      else assert.match(html, new RegExp(`<h1[^>]*>${heading}</h1>`));
      for (const href of Object.keys(views)) assert.ok(html.includes(`href="${href}"`), `Missing nav link ${href}`);
      assert.ok(html.includes(`href="${path}" aria-current="page"`), `Missing current-page state on ${path}`);
      const expectedName = fixtures[session].name;
      for (const { name } of Object.values(fixtures)) {
        if (name && (name !== expectedName || path !== "/badge")) assert.ok(!html.includes(name), "Unexpected identity exposed");
      }
      if (path === "/") {
        assert.match(html, /Announcements<\/h2>/);
        assert.match(html, /aria-label="Live announcements"[^>]*overflow-y-auto/);
        assert.match(html, afterOpening ? /Happening now/ : /Up next/);
        assert.match(html, afterOpening ? /Hacking starts in/ : /Liftoff in/);
        assert.ok(html.includes(privateRoom));
        const highlightsColumn = html.match(/<section[^>]*aria-label="Schedule highlights and playlist"[^>]*>(.*?)<\/section>/)?.[1] ?? "";
        assert.match(highlightsColumn, /(?:Up next|Now &amp; next).*Event playlist/);
        assert.doesNotMatch(highlightsColumn, /Announcements|Our sponsors/);
        assert.ok(html.indexOf('id="live-sponsors"') > html.indexOf("Event playlist"));
        const gold = html.match(/<ul[^>]*aria-label="Gold sponsors"[^>]*>(.*?)<\/ul>/)?.[1];
        const silver = html.match(/<ul[^>]*aria-label="Silver sponsors"[^>]*>(.*?)<\/ul>/)?.[1];
        assert.equal(gold?.match(/<li /g)?.length, 5);
        assert.equal(silver?.match(/<li /g)?.length, 7);
        assert.ok(html.indexOf('aria-label="Gold sponsors"') < html.indexOf('aria-label="Silver sponsors"'));
        assert.equal(html.includes(submissionUrl), afterOpening);
        assert.ok(html.indexOf('id="live-hero-title"') < html.indexOf("Announcements</h2>"));
      } else if (path === "/schedule") {
        assert.doesNotMatch(html, /Outdated Event/);
        assert.match(html, /role="tablist"/);
        assert.doesNotMatch(html, /Schedule filter|>Workshops<|>All events</);
        assert.ok(html.includes(privateRoom));
        assert.ok(html.includes(workshopPresenter) && html.includes(workshopDescription));
        assert.ok(!html.includes(privateNote));
        assertWorkshopLayout(html);
        const focus = html.match(/<li[^>]*data-schedule-anchor="true"[^>]*>.*?<h3[^>]*>([^<]+)/);
        assert.equal(focus?.[1], afterOpening ? "Opening Ceremony" : "Example Workshop");
        const marker = html.match(/data-friday-time-marker[^>]*>.*?<time[^>]*>([^<]+)/);
        assert.equal(marker?.[1], afterOpening ? "7:00 PM" : "12:00 PM");
        if (afterOpening) {
          assert.match(focus[0], /data-event-state="current"/);
          assert.match(html, /data-event-state="past"/);
        }
      } else if (path === "/equipment") {
        assert.match(html, /href="https:\/\/equipment\.stanfordxr\.org\/"/);
        assert.match(html, /9:30 PM Pacific/);
      } else if (path === "/tracks") {
        assert.equal(html.includes(tracksUrl), afterOpening);
        assert.equal(html.includes(submissionUrl), afterOpening);
        assert.ok(html.includes(`href="${afterOpening ? submissionUrl : devpostUrl}"`));
        assert.match(html, afterOpening ? /Submit on Devpost/ : /Open Devpost/);
        assert.doesNotMatch(html, /Check event Discord/);
        if (afterOpening) assert.match(html, /dateTime="2026-11-15T09:00:00-08:00"/i);
        else assert.match(html, /revealed at Friday/);
      } else if (path === "/help") {
        assert.ok(html.includes(privateInvite) && html.includes(guideUrl));
        assert.ok(html.includes("Open the Hacker Arrival Guide") && !html.includes(snapshotGuideUrl));
        assert.ok(html.includes("#event-questions") && html.includes(guideFaq) && html.includes("What is the latest I should arrive"));
        assert.match(html, /Wi-Fi and on-site support<\/h2>.*Ask on Discord/);
        assert.match(html, /Stanford Visitor.*eduroam.*Stanford students/);
      } else if (path === "/badge") {
        assert.ok(html.includes(expectedName));
        const role = session === "admin" ? "Admin" : session === "reviewer" ? "Reviewer" : "Hacker";
        assert.match(html, /Check-in Badge/);
        assert.match(html, new RegExp(`>${expectedName}</p><p[^>]*>${role}</p>`));
        if (!staff) assert.match(html, /confirmation email/);
        for (const marker of privateMarkers.filter((value) => value !== badgePngs[session])) {
          assert.ok(!html.includes(marker), "Unexpected attendee data in the badge");
        }
      }
    }));
    const feed = await request("/api/announcements", headers);
    assert.equal(feed.status, 200);
    const { announcements } = JSON.parse(await feed.text());
    assert.equal(announcements[0].pinned, true);
    assert.equal(announcements[1].message, announcement + " Arrival guide #event-questions");
    assert.deepEqual(announcements[1].parts.filter(({ href }) => href).map(({ href }) => href), [
      announcementGuide, "https://discord.com/channels/1564030617778126968/1564030618776641539",
    ]);
    assert.deepEqual(announcements[1].embeds, [{ href: announcementGuide, title: "Arrival guide", description: "Read before Friday." }]);
    const qr = await request(qrPath, headers);
    assert.equal(qr.status, badgePngs[session] ? 200 : 404);
    assert.match(qr.headers["cache-control"], /private.*no-store/);
    if (qr.ok) {
      assert.equal(qr.headers["content-type"], "image/png");
      assert.match(qr.headers["content-disposition"], /attachment; filename="Immerse-the-Bay-2026-Check-in\.png"/);
      assert.deepEqual(qr.buffer(), Buffer.from(badgePngs[session].split(",", 2)[1], "base64"));
    }
    const wallet = await request(walletPath, headers);
    assert.equal(wallet.status, !badgePngs[session] ? 404 : signingDir ? 200 : 503);
    assert.match(wallet.headers["cache-control"], /private.*no-store/);
    if (wallet.ok) {
      assert.equal(wallet.headers["content-type"], "application/vnd.apple.pkpass");
      assert.match(wallet.headers["content-disposition"], /attachment; filename="Immerse-the-Bay-2026-Check-in\.pkpass"/);
      assert.equal(wallet.buffer().subarray(0, 4).toString("hex"), "504b0304");
      if (samplePath && session === "reviewer") await writeFile(samplePath, wallet.buffer(), { flag: "wx", mode: 0o600 });
    }
  }
  for (const path of [walletPath, qrPath]) {
    const blockedCrossSite = await request(path, { ...live, cookie: "itb_session=reviewer", "sec-fetch-site": "cross-site" });
    assert.equal(blockedCrossSite.status, 403);
  }
  const callback = await request("/dashboard?signed_in=1", { host: "immersethebay.org" });
  assert.equal(callback.status, 307);
  assert.equal(callback.headers.location, "https://live.immersethebay.org/?signed_in=1");
  const deepLink = await request("/dashboard/schedule", { host: "immersethebay.org" });
  assert.equal(deepLink.status, 307);
  assert.equal(deepLink.headers.location, "https://live.immersethebay.org/schedule");
  const invalidRoute = await request("/dashboard/organizer-roster", { ...live, cookie: "itb_session=reviewer" });
  assert.equal(invalidRoute.status, 404);
  for (const removed of ["/people", "/dashboard/people"]) {
    assert.equal((await request(removed, { ...live, cookie: "itb_session=reviewer" })).status, 404);
  }
  const sponsorPaths = ["/sponsor", "/sponsor/schedule", "/sponsor/equipment", "/sponsor/tracks", "/sponsor/help"];
  for (const path of sponsorPaths) {
    const guest = await request(path, live);
    assert.equal(guest.status, 200);
    assert.match(guest.headers["cache-control"], /no-store/);
    assert.equal(guest.headers["referrer-policy"], "no-referrer");
    assert.match(guest.text(), /Open the sponsor link from Stanford XR/);
    assert.doesNotMatch(guest.text(), /Live dashboard navigation|Attendee-only workshop setup note|Open the equipment portal/);
    for (const marker of privateMarkers) assert.ok(!guest.text().includes(marker), "Sponsor gate exposed content");
  }
  assert.equal((await request("/api/sponsor/announcements", live)).status, 401);
  const origin = "https://live.immersethebay.org";
  const sessionPath = "/api/sponsor/session";
  assert.equal((await request(sessionPath, { ...live, origin }, "POST")).status, 401);
  assert.equal((await request(sessionPath, { ...live, origin, authorization: `Bearer ${"A".repeat(43)}` }, "POST")).status, 401);
  assert.equal((await request(sessionPath, { ...live, origin: "https://immersethebay.org", authorization: `Bearer ${sponsorKey}` }, "POST")).status, 403);
  const exchange = await request(sessionPath, { ...live, origin, authorization: `Bearer ${sponsorKey}` }, "POST");
  assert.equal(exchange.status, 200);
  const setCookie = exchange.headers["set-cookie"]?.[0] ?? "";
  assert.ok(/^__Host-itb_sponsor=[^;]+;.*Path=\/;.*Secure;.*HttpOnly;.*SameSite=lax/i.test(setCookie));
  assert.ok(!/;\s*Domain=/i.test(setCookie));
  const sponsorHeaders = { ...live, cookie: setCookie.split(";", 1)[0] };
  for (const path of sponsorPaths) {
    const response = await request(path, sponsorHeaders);
    assert.equal(response.status, 200);
    const html = response.text();
    assert.match(html, /Sponsor view/);
    assert.doesNotMatch(html, /href="\/(?:sponsor\/)?badge"|\/review\/check-in|Check-in QR code|Tracks &amp; Devpost|Event on Devpost/);
    assert.ok(!html.includes(sponsorKey));
    for (const navPath of sponsorPaths) assert.ok(html.includes(`href="${navPath}"`), `Missing sponsor tab ${navPath}`);
    for (const marker of [...Object.values(badgePngs), snapshotGuideUrl, ...Object.values(fixtures).map(({ name }) => name).filter(Boolean)]) {
      assert.ok(!html.includes(marker), "Sponsor view exposed an account-only resource");
    }
    assert.ok(!html.includes(privateNote));
    assert.equal(html.includes(workshopPresenter) && html.includes(workshopDescription), path === "/sponsor/schedule");
    assert.equal(html.includes(privateInvite), path === "/sponsor" || path === "/sponsor/help");
    assert.equal(html.includes(guideUrl), path === "/sponsor/help");
    assert.equal(html.includes(guideFaq), path === "/sponsor/help");
    assert.equal(html.includes(tracksUrl), afterOpening && path === "/sponsor/tracks");
    assert.equal(html.includes(submissionUrl), afterOpening && (path === "/sponsor" || path === "/sponsor/tracks"));
    if (path === "/sponsor/schedule") assertWorkshopLayout(html);
    if (path === "/sponsor") assert.match(html, /<section[^>]*aria-label="Schedule highlights and playlist"[^>]*>.*Event playlist.*<\/section>.*id="live-sponsors"/);
    if (path === "/sponsor/equipment") assert.match(html, /href="https:\/\/equipment\.stanfordxr\.org\/"/);
    if (path === "/sponsor/tracks") assert.match(html, afterOpening ? /Tracks &amp; Submit.*Submit on Devpost/ : /Tracks &amp; Submit.*Open Devpost/);
    if (path === "/sponsor/help") assert.match(html, /Hacker Arrival Guide.*Stanford Visitor.*eduroam/);
  }
  for (const path of ["/sponsor/badge", "/sponsor/check-in"]) {
    assert.equal((await request(path, sponsorHeaders)).status, 404);
  }
  for (const path of [walletPath, qrPath, "/api/announcements"]) {
    assert.equal((await request(path, sponsorHeaders)).status, 401);
  }
  assert.doesNotMatch((await request("/badge", sponsorHeaders)).text(), /Live dashboard navigation/);
  const sponsorFeed = await request("/api/sponsor/announcements", sponsorHeaders);
  const hackerFeed = await request("/api/announcements", { ...live, cookie: "itb_session=reviewer" });
  assert.equal(sponsorFeed.status, 200);
  assert.deepEqual(JSON.parse(sponsorFeed.text()).announcements, JSON.parse(hackerFeed.text()).announcements);
  const phase = afterOpening ? "at the track reveal" : afterLaunch ? "at launch" : "before launch";
  console.log(`Public grid, live layout, Wi-Fi help, track embargo, isolated sponsor sessions, private badges, and announcement parity passed ${phase}.`);
} finally {
  child.kill("SIGTERM");
  portal.close();
}
