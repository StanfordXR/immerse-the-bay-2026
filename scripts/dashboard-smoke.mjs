import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { createServer, get } from "node:http";
import { setTimeout as delay } from "node:timers/promises";

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
const announcementChannel = `itb-smoke-${randomUUID()}`;
const privateRoom = "Example Private Hall 111";
const privateInvite = "https://discord.gg/itb-smoke-fixture";
const guideUrl = "https://guide.example.test/attendees";
const tracksUrl = "https://tracks.example.test/reveal";
const submissionUrl = "https://submit.example.test/project";
const privateMarkers = [privateRoom, privateInvite, guideUrl, tracksUrl, submissionUrl];
const attendeeConfig = JSON.stringify({
  rows: [
    ["sample-workshop", "Example Workshop", "2026-11-13T18:00:00-08:00", "2026-11-13T18:30:00-08:00", [privateRoom]],
    ["sample-opening", "Opening Ceremony", "2026-11-13T19:00:00-08:00", "2026-11-13T20:00:00-08:00", [privateRoom]],
    ["sample-hacking", "Hacking", "2026-11-14", null, [privateRoom]],
    ["sample-closing", "Closing Ceremony", "2026-11-15T13:30:00-08:00", null, [privateRoom]],
  ],
  discordUrl: privateInvite,
  arrivalGuideUrl: guideUrl,
  tracksUrl,
  submissionUrl,
  submissionDeadline: "2026-11-15T09:00:00-08:00",
});
const fixtures = {
  reviewer: { status: "confirmed", name: "Test Reviewer", audience: "staff" },
  admin: { status: "confirmed", name: "Test Admin", audience: "staff" },
  "accepted-fixture": { status: "confirmed", name: "Test Hacker", audience: "hacker" },
  legacy: { status: "confirmed", name: "Test Legacy Account" },
  expired: { status: "signed-out" },
};
const portal = createServer((req, res) => {
  if (req.url !== "/api/attendee") return res.writeHead(404).end();
  const token = (req.headers.cookie ?? "").match(/itb_session=(\S+)$/)?.[1];
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(fixtures[token] ?? { status: "not-confirmed" }));
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
        id: "smoke", content: ${JSON.stringify(announcement)}, mentions: [], timestamp: "2026-11-09T20:00:00Z",
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
  },
  stdio: "inherit",
});
// Node fetch can normalize Host back to the loopback address. Use HTTP
// directly so this actually exercises Next's hostname-based routing.
const request = (path, headers = {}) => new Promise((resolve, reject) => {
  get({ host: "127.0.0.1", port, path, headers, signal: AbortSignal.timeout(6000) }, async (res) => {
    try {
      const chunks = [];
      for await (const chunk of res) chunks.push(chunk);
      resolve({
        ok: res.statusCode >= 200 && res.statusCode < 300,
        status: res.statusCode,
        headers: res.headers,
        text: () => Buffer.concat(chunks).toString(),
      });
    } catch (error) {
      reject(error);
    }
  }).on("error", reject);
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
  }
  for (const session of ["reviewer", "admin", ...(afterLaunch ? ["accepted-fixture", "legacy"] : [])]) {
    const headers = { ...live, cookie: `itb_session=${session}` };
    await Promise.all(Object.entries(views).map(async ([path, heading]) => {
      const response = await request(path, headers);
      assert.equal(response.status, 200, path);
      assert.match(response.headers["cache-control"], /no-store/);
      const html = await response.text();
      assert.match(html, /Live dashboard navigation/);
      assert.match(html, new RegExp(`<h1[^>]*>${heading}</h1>`));
      for (const href of Object.keys(views)) assert.ok(html.includes(`href="${href}"`), `Missing nav link ${href}`);
      assert.ok(html.includes(`href="${path}" aria-current="page"`), `Missing current-page state on ${path}`);
      assert.ok(!html.includes("/people"), "Directory should not be exposed");
      const expectedName = fixtures[session].name;
      for (const { name } of Object.values(fixtures)) {
        if (name && (name !== expectedName || path !== "/badge")) assert.ok(!html.includes(name), "Unexpected identity exposed");
      }
      if (path === "/") {
        assert.match(html, /Live announcements/);
        assert.match(html, /Happening now/);
        assert.ok(html.includes(privateRoom));
      } else if (path === "/schedule") {
        assert.match(html, /role="tablist"/);
        assert.match(html, />Workshops</);
        assert.ok(html.includes(privateRoom));
      } else if (path === "/equipment") {
        assert.match(html, /href="https:\/\/equipment\.stanfordxr\.org\/"/);
        assert.match(html, /9:30 PM Pacific/);
      } else if (path === "/tracks") {
        assert.equal(html.includes(tracksUrl), afterOpening);
        assert.equal(html.includes(submissionUrl), afterOpening);
        if (afterOpening) assert.match(html, /Deadline/);
        else assert.match(html, /revealed at Friday/);
      } else if (path === "/help") {
        assert.ok(html.includes(privateInvite) && html.includes(guideUrl));
      } else if (path === "/badge") {
        assert.ok(html.includes(expectedName));
        assert.match(html, /confirmation email/);
        for (const marker of privateMarkers) assert.ok(!html.includes(marker), "Unexpected attendee data in the badge");
      }
    }));
    const feed = await request("/api/announcements", headers);
    assert.equal(feed.status, 200);
    const { announcements } = JSON.parse(await feed.text());
    assert.equal(announcements[0].pinned, true);
    assert.equal(announcements[1].message, announcement);
  }
  const callback = await request("/dashboard?signed_in=1", { host: "immersethebay.org" });
  assert.equal(callback.status, 307);
  assert.equal(callback.headers.location, "https://live.immersethebay.org/?signed_in=1");
  const deepLink = await request("/dashboard/schedule", { host: "immersethebay.org" });
  assert.equal(deepLink.status, 307);
  assert.equal(deepLink.headers.location, "https://live.immersethebay.org/schedule");
  const invalidRoute = await request("/dashboard/people", { ...live, cookie: "itb_session=reviewer" });
  assert.equal(invalidRoute.status, 404);
  const phase = afterOpening ? "at the track reveal" : afterLaunch ? "at launch" : "before launch";
  console.log(`Public grid, five dashboard tabs, private badge, role gate, track embargo, announcements, and hostname handoff passed ${phase}.`);
} finally {
  child.kill("SIGTERM");
  portal.close();
}
