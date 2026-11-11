"use client";

import { useCallback, useEffect, useState } from "react";
import type { Announcement } from "@/lib/announcements";
import { cn } from "@/lib/utils";

/** The API caches Discord for 10s, so polling faster than that only re-reads the cache. */
const POLL_INTERVAL_MS = 10_000;

interface AnnouncementsResponse {
  announcements: Announcement[];
  error?: string;
}

export function LiveAnnouncements({ discordUrl, sponsorView }: { discordUrl?: string; sponsorView?: boolean }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(sponsorView ? "/api/sponsor/announcements" : "/api/announcements", { cache: "no-store" });
      const data = (await response.json()) as AnnouncementsResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Could not load announcements");
      }

      setAnnouncements(data.announcements);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load announcements");
    } finally {
      setLoading(false);
    }
  }, [sponsorView]);

  useEffect(() => {
    const firstLoad = window.setTimeout(() => void load(), 0);
    const interval = window.setInterval(() => void load(), POLL_INTERVAL_MS);
    return () => {
      window.clearTimeout(firstLoad);
      window.clearInterval(interval);
    };
  }, [load]);

  return (
    <div
      role="region"
      aria-label="Live announcements"
      aria-busy={loading}
      tabIndex={0}
      className="absolute inset-0 overflow-y-auto overscroll-contain pr-2 [scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neon-cyan"
    >
      <div className="min-h-0">
        {loading && announcements.length === 0 ? (
          <p className="text-sm text-muted">Loading announcements…</p>
        ) : error ? (
          <p className="text-sm text-muted">
            Live announcements are temporarily unavailable.
            {discordUrl && <>{" "}Check the <a href={discordUrl} className="text-neon-cyan underline">event Discord</a> for updates.</>}
          </p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-muted">Announcements will show up here once the event starts :)</p>
        ) : (
          <ul className="space-y-3">
            {announcements.map((item, index) => (
              <li
                key={item.id}
                className={cn(
                  "border px-4 py-3",
                  index === 0 ? "border-neon-purple-light/40 bg-neon-violet/10" : "border-white/10 bg-void/40",
                )}
              >
                <p className="font-mono text-xs uppercase tracking-wider text-neon-cyan">
                  {[index === 0 && !item.pinned && "Latest", item.pinned && "Pinned", [item.date, item.time].filter(Boolean).join(" ")].filter(Boolean).join(" · ") || "Live"}
                </p>
                <p className={cn(
                  "mt-2 whitespace-pre-line text-sm leading-relaxed [overflow-wrap:anywhere] sm:text-base",
                  index === 0 ? "text-foreground" : "text-muted",
                )}>
                  {item.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
