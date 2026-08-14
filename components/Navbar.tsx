"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, PORTAL_APPLY_URL } from "@/data/site";
import type { NavLink } from "@/data/types";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, link: NavLink): boolean {
  if (link.external || link.comingSoon) return false;
  return link.href === "/"
    ? pathname === "/"
    : pathname.startsWith(link.href);
}

function DesktopNavItem({ link, pathname }: { link: NavLink; pathname: string }) {
  const active = isNavActive(pathname, link);
  const linkClass = cn(
    "text-sm transition-colors",
    active ? "text-neon-cyan" : "text-muted hover:text-foreground",
  );

  if (link.comingSoon) {
    return (
      <li className="group relative">
        <span className={cn(linkClass, "cursor-default")}>{link.label}</span>
        <div
          className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap border border-white/10 bg-navy/95 px-3 py-1.5 text-xs text-neon-cyan opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
          role="tooltip"
        >
          Coming soon!
        </div>
      </li>
    );
  }

  if (link.external) {
    return (
      <li>
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {link.label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={link.href} className={linkClass}>
        {link.label}
      </Link>
    </li>
  );
}

function MobileNavItem({ link }: { link: NavLink }) {
  if (link.comingSoon) {
    return (
      <li>
        <span className="block py-2 text-sm text-muted sm:py-3">
          {link.label}{" "}
          <span className="text-xs text-neon-cyan/70">(Coming soon!)</span>
        </span>
      </li>
    );
  }

  if (link.external) {
    return (
      <li>
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block py-2 text-sm text-foreground sm:py-3"
        >
          {link.label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={link.href} className="block py-2 text-sm text-foreground sm:py-3">
        {link.label}
      </Link>
    </li>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/5 bg-void/85 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-[0.8rem] sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-foreground transition-colors hover:text-foreground"
          aria-label="Immerse the Bay home"
        >
          {/* The bunny lives in the hero eyebrow now; the wordmark gets the
              whole brand slot, as large as the bar allows. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo/ITB_Standard.png"
            alt="Immerse the Bay"
            className="h-11 max-w-[11rem] w-auto shrink-0 object-contain sm:h-[4.25rem] sm:max-w-none"
          />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <DesktopNavItem key={link.label} link={link} pathname={pathname} />
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <span className="group relative hidden sm:inline-flex">
            <a
              href={PORTAL_APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-neon-cyan/50 bg-neon-indigo/20 px-4 py-2 text-sm font-semibold shadow-glow transition hover:shadow-glow-cyan"
            >
              Apply
            </a>
            <span
              className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap border border-white/10 bg-navy/95 px-3 py-1.5 text-xs text-neon-cyan opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
              role="tooltip"
            >
              Applications are open!
            </span>
          </span>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-white/10 md:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="font-mono text-neon-cyan">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/5 bg-navy/95 px-4 py-4 md:hidden"
        >
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <MobileNavItem key={link.label} link={link} />
            ))}
            <li>
              <a
                href={PORTAL_APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-3 text-sm text-neon-cyan"
              >
                Apply{" "}
                <span className="text-xs text-neon-cyan/70">
                  (Applications are open!)
                </span>
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
