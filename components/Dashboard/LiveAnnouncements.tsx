"use client";

import { useCallback, useEffect, useState } from "react";
import type { Announcement } from "@/lib/announcements";

/** The API caches Discord for 10s, so polling faster than that only re-reads the cache. */
const POLL_INTERVAL_MS = 10_000;

interface AnnouncementsResponse {
  announcements: Announcement[];
  error?: string;
}

export function LiveAnnouncements({ discordUrl }: { discordUrl?: string }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/announcements", { cache: "no-store" });
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
  }, []);

  useEffect(() => {
    const firstLoad = window.setTimeout(() => void load(), 0);
    const interval = window.setInterval(() => void load(), POLL_INTERVAL_MS);
    return () => {
      window.clearTimeout(firstLoad);
      window.clearInterval(interval);
    };
  }, [load]);

  return (
    <div className="max-h-80 overflow-y-auto">
      <div className="min-h-0">
        {loading && announcements.length === 0 ? (
          <p className="text-sm text-muted">Loading announcements…</p>
        ) : error ? (
          <p className="text-sm text-muted">
            Live announcements are temporarily unavailable.
            {discordUrl && <>{" "}Check the <a href={discordUrl} className="text-neon-cyan underline">event Discord</a> for updates.</>}
          </p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-muted">No announcements yet. Check back soon.</p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((item) => (
              <li
                key={item.id}
                className="border border-white/10 bg-void/40 px-4 py-3"
              >
                <p className="font-mono text-xs uppercase tracking-wider text-neon-cyan">
                  {[item.pinned && "Pinned", [item.date, item.time].filter(Boolean).join(" ")].filter(Boolean).join(" · ") || "Live"}
                </p>
                <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-muted sm:text-base">
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
