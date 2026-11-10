import type { CSSProperties } from "react";

/** Start points and timing; the uneven cycles keep them from syncing up. */
const SHOOTING_STARS = [
  { top: "6%", left: "80%", delay: "0.5s", duration: "7s" },
  { top: "20%", left: "96%", delay: "2.5s", duration: "8s" },
  { top: "3%", left: "50%", delay: "4.5s", duration: "9s" },
  { top: "32%", left: "72%", delay: "6s", duration: "10s" },
  { top: "12%", left: "30%", delay: "8s", duration: "11s" },
  { top: "45%", left: "92%", delay: "9.5s", duration: "12s" },
];

/**
 * Fixed atmosphere behind the live dashboard, built from the main site's
 * pieces: nebula glows, a sparse starfield with the occasional shooting star,
 * and the hero's synthwave grid along the bottom. Purely decorative and kept
 * faint so text stays readable; the glass cards blur it, which gives them depth.
 */
export function DashboardBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-neon-violet/25 blur-[120px]" />
      <div className="absolute -right-48 top-1/3 h-[30rem] w-[30rem] rounded-full bg-neon-fuchsia/15 blur-[120px]" />
      <div className="absolute -bottom-40 left-1/4 h-[28rem] w-[40rem] rounded-full bg-neon-purple/20 blur-[140px]" />
      <div className="dashboard-stars absolute inset-0" />
      {SHOOTING_STARS.map(({ top, left, delay, duration }) => (
        <span
          key={`${top}-${left}`}
          className="shooting-star"
          style={{ "--top": top, "--left": left, "--delay": delay, "--duration": duration } as CSSProperties}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-[45vh] overflow-hidden opacity-70">
        <div className="hero-grid absolute inset-0" />
      </div>
      <div className="bg-scanlines absolute inset-0" />
    </div>
  );
}
