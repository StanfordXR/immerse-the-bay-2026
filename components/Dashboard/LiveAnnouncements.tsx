"use client";

import { useCallback, useEffect, useState } from "react";
import type { Announcement } from "@/lib/announcements";

/** The API caches Discord for 10s, so polling faster than that only re-reads the cache. */
const POLL_INTERVAL_MS = 10_000;

interface AnnouncementsResponse {
  announcements: Announcement[];
  error?: string;
}

export function LiveAnnouncements() {
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
    void load();
    const interval = window.setInterval(() => void load(), POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [load]);

  return (
    <div className="flex h-[400px] w-full flex-col sm:h-[475px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {loading && announcements.length === 0 ? (
          <p className="text-sm text-muted">Loading announcements…</p>
        ) : error ? (
          <p className="text-sm text-red-300">{error}</p>
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
                  {[item.date, item.time].filter(Boolean).join(" ") || "Live"}
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
