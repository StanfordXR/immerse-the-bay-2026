"use client";

import { useEffect, useRef, useState } from "react";

export function SponsorLinkGate({ signedIn = false }: { signedIn?: boolean }) {
  const [status, setStatus] = useState<"idle" | "opening" | "denied" | "retry">("idle");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const key = window.location.hash.slice(1);
    if (!key) return;
    // Fragments never reach the server on navigation. Clear this one before
    // making any request so it stays out of history and subsequent page URLs.
    window.history.replaceState(null, "", window.location.pathname);
    if (signedIn) return;
    if (!/^[A-Za-z0-9_-]{43}$/.test(key)) {
      setStatus("denied");
      return;
    }
    setStatus("opening");
    void fetch("/api/sponsor/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      credentials: "same-origin",
      cache: "no-store",
    }).then((response) => {
      if (response.ok) window.location.replace(window.location.pathname);
      else setStatus(response.status === 401 || response.status === 403 ? "denied" : "retry");
    }).catch(() => setStatus("retry"));
  }, [signedIn]);

  if (signedIn) return null;
  return (
    <p role="status" className="leading-relaxed text-muted">
      {status === "idle" ? "Open the sponsor link from Stanford XR to see the event dashboard. No account is needed."
        : status === "opening" ? "Opening the sponsor dashboard…"
          : status === "denied" ? "This sponsor link is invalid or has expired. Contact Stanford XR if you need help."
            : "We couldn’t open the sponsor dashboard. Try reopening the link from your email."}
    </p>
  );
}
