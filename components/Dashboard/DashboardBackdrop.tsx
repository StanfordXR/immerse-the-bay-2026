/** Start points and timing; the uneven cycles keep them from syncing up. */
const SHOOTING_STARS = [
  { top: "6%", left: "85%", delay: "0.5s", duration: "9s" },
  { top: "22%", left: "100%", delay: "3.5s", duration: "11s" },
  { top: "2%", left: "55%", delay: "6s", duration: "12s" },
  { top: "35%", left: "80%", delay: "8.5s", duration: "13s" },
  { top: "14%", left: "38%", delay: "11s", duration: "14s" },
];

/** Glows that slowly drift; offsets and loop lengths differ so they never move in step. */
const NEBULAE = [
  { className: "-left-40 -top-40 h-[34rem] w-[34rem] bg-neon-violet/25 blur-[120px]", drift: "32s", dx: "8%", dy: "6%" },
  { className: "-right-48 top-1/3 h-[30rem] w-[30rem] bg-neon-fuchsia/15 blur-[120px]", drift: "26s", dx: "-10%", dy: "5%" },
  { className: "-bottom-40 left-1/4 h-[28rem] w-[40rem] bg-neon-purple/20 blur-[140px]", drift: "38s", dx: "6%", dy: "-8%" },
];

/**
 * Fixed atmosphere behind the live dashboard, built from the main site's
 * pieces: drifting nebula glows, a two-layer twinkling starfield, shooting
 * stars, and the hero's synthwave grid along the bottom. (The moon lives in
 * the hero, over its skyline.) Purely decorative and kept faint so text
 * stays readable; the glass cards blur it, which gives them depth. Every
 * animation stops under prefers-reduced-motion (see globals.css).
 */
export function DashboardBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {NEBULAE.map(({ className, drift, dx, dy }) => (
        <div
          key={className}
          className={`nebula-drift absolute ${className}`}
          style={{ "--drift": drift, "--dx": dx, "--dy": dy }}
        />
      ))}
      <div className="dashboard-stars absolute inset-0" />
      {/* Second, offset star layer twinkling out of phase reads as depth. */}
      <div className="dashboard-stars absolute inset-0 opacity-60 [animation-direction:alternate-reverse] [animation-duration:9s] [background-position:130px_70px]" />
      {SHOOTING_STARS.map(({ top, left, delay, duration }) => (
        <span
          key={`${top}-${left}`}
          className="shooting-star"
          style={{ "--top": top, "--left": left, "--delay": delay, "--duration": duration }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-[45vh] overflow-hidden opacity-70">
        <div className="hero-grid absolute inset-0" />
      </div>
      <div className="bg-scanlines absolute inset-0" />
    </div>
  );
}
