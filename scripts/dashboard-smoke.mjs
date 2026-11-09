import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer, get } from "node:http";
import { setTimeout as delay } from "node:timers/promises";

const bind = async (server) => {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
};
const afterLaunch = process.argv.includes("--after-launch");
const testTime = Date.parse(afterLaunch ? "2026-11-11T00:00:00-08:00" : "2026-11-10T23:59:59-08:00");
const announcement = "Synthetic dashboard test announcement";
const privateRoom = "Example Private Hall 111";
const privateInvite = "https://discord.gg/itb-smoke-fixture";
const attendeeConfig = JSON.stringify({
  rows: [
    ["sample-opening", "Opening Ceremony", "2026-11-13T19:00:00-08:00", "2026-11-13T20:00:00-08:00", [privateRoom]],
    ["sample-hacking", "Hacking", "2026-11-14", null, [privateRoom]],
    ["sample-closing", "Closing Ceremony", "2026-11-15T13:30:00-08:00", null, [privateRoom]],
  ],
  discordUrl: privateInvite,
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
    if (url.startsWith("https://discord.com/api/v10/channels/itb-smoke-test/")) {
      return Promise.resolve(Response.json([{
        id: "smoke", content: ${JSON.stringify(announcement)}, mentions: [], timestamp: "2026-11-09T20:00:00Z",
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
    DISCORD_ANNOUNCEMENTS_CHANNEL_ID: "itb-smoke-test",
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
  for (const path of ["/", "/schedule", "/faq"]) {
    const response = await request(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(!html.includes(privateRoom) && !html.includes(privateInvite), `Private data on ${path}`);
    if (path === "/schedule") {
      assert.match(html, /7 PM–8 PM/);
      assert.match(html, /10 AM–12 PM/);
      for (const day of ["Friday", "Saturday", "Sunday"]) assert.match(html, new RegExp(`>${day}</h3>`));
      assert.doesNotMatch(html, /role="tab(list|panel)?"/);
    }
  }
  const live = { host: "live.immersethebay.org" };
  for (const session of ["", "not-approved", "expired", ...(afterLaunch ? [] : ["accepted-fixture", "legacy"])]) {
    const headers = { ...live, cookie: session ? `itb_session=${session}` : "" };
    const response = await request("/", headers);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, afterLaunch ? /Dashboard access|Sign in to the live dashboard/ : /Live dashboard is coming Wednesday/);
    assert.ok(!html.includes(privateRoom) && !html.includes(privateInvite), "Private data on the sign-in wall");
    assert.doesNotMatch(html, /role="tablist"/);
    const feed = await request("/api/announcements", headers);
    assert.equal(feed.status, !session || session === "expired" ? 401 : 403);
    assert.deepEqual(JSON.parse(await feed.text()), { announcements: [] });
  }
  for (const session of ["reviewer", "admin", ...(afterLaunch ? ["accepted-fixture", "legacy"] : [])]) {
    const headers = { ...live, cookie: `itb_session=${session}` };
    const response = await request("/", headers);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Live dashboard navigation/);
    assert.ok(html.includes(privateRoom) && html.includes(privateInvite), "Authorized attendee data is missing");
    assert.match(html, /role="tablist"/);
    const feed = await request("/api/announcements", headers);
    assert.equal(feed.status, 200);
    assert.match(await feed.text(), new RegExp(announcement));
  }
  const callback = await request("/dashboard?signed_in=1", { host: "immersethebay.org" });
  assert.equal(callback.status, 307);
  assert.equal(callback.headers.location, "https://live.immersethebay.org/?signed_in=1");
  console.log(`Public grid, dashboard tabs, role gate, announcement feed, and hostname handoff passed ${afterLaunch ? "at" : "before"} launch.`);
} finally {
  child.kill("SIGTERM");
  portal.close();
}
