"use client";

import { useCallback, useEffect, useState } from "react";
import type { Announcement } from "@/lib/announcements";

const POLL_INTERVAL_MS = 5_000;

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
    <div className="flex h-[320px] w-full flex-col sm:h-[380px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {loading && announcements.length === 0 ? (
          <p className="text-sm text-muted">Loading announcements…</p>
        ) : error ? (
          <div className="space-y-2 text-sm">
            <p className="text-red-300">{error}</p>
            <p className="text-muted">
              Make sure the Google Sheet is shared as{" "}
              <span className="text-foreground">Anyone with the link → Viewer</span>.
            </p>
          </div>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-muted">
            No announcements yet. Type a message in column{" "}
            <span className="text-foreground">Message</span> of the shared Google
            Sheet — date and time are filled in automatically.
          </p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((item, index) => (
              <li
                key={`${index}-${item.id}`}
                className="border border-white/10 bg-void/40 px-4 py-3"
              >
                <p className="font-mono text-xs uppercase tracking-wider text-neon-cyan">
                  {[item.date, item.time].filter(Boolean).join(" ") || "Live"}
                </p>
                <p className="mt-2 break-words text-sm leading-relaxed text-muted sm:text-base">
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
