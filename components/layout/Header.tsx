"use client";

import { motion } from "framer-motion";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/5 bg-void/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base"
        >
          <span className="text-neon-purple">◈</span> {SITE.name.split(" ")[0]}{" "}
          <span className="hidden sm:inline">the Bay</span>
        </a>
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-neon-purple"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#apply"
          className="rounded-lg border border-neon-purple/50 bg-neon-purple/20 px-3 py-1.5 text-xs font-semibold text-foreground shadow-glow-purple transition hover:bg-neon-purple/30 sm:px-4 sm:text-sm"
        >
          Apply
        </a>
      </nav>
    </motion.header>
  );
}
