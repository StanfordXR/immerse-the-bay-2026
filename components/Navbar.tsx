"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/data/site";
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
        <span className="block py-2 text-sm text-muted">
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
          className="block py-2 text-sm text-foreground"
        >
          {link.label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={link.href} className="block py-2 text-sm text-foreground">
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
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-sans text-sm font-semibold tracking-tight sm:text-base"
        >
          <span className="text-neon-cyan">◈</span> {SITE.name.split(" ")[0]}{" "}
          <span className="hidden sm:inline">the Bay</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <DesktopNavItem key={link.label} link={link} pathname={pathname} />
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#apply"
            className="hidden border border-neon-cyan/50 bg-neon-indigo/20 px-4 py-2 text-sm font-semibold shadow-glow transition hover:shadow-glow-cyan sm:inline-flex"
          >
            Apply
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-white/10 md:hidden"
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
              <a href="#apply" className="block py-2 text-sm text-neon-cyan">
                Apply
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
