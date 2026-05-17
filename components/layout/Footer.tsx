"use client";

import { motion } from "framer-motion";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/motion";

const iconMap: Record<string, string> = {
  discord: "⬡",
  instagram: "◎",
  linkedin: "◆",
  email: "✉",
  web: "◇",
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-void/90 py-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-10 md:flex-row md:justify-between"
        >
          <motion.div variants={fadeUp} className="text-center md:text-left">
            <p className="font-display text-xl font-bold text-foreground">
              {SITE.name}
            </p>
            <p className="mt-2 text-sm text-muted">{SITE.tagline}</p>
            <p className="mt-1 font-mono text-xs text-neon-purple/80">
              Stanford University · Spring 2026
            </p>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-4"
          >
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-lg border border-white/10 bg-surface/30 px-4 py-2 text-sm text-muted transition hover:border-neon-purple/40 hover:text-foreground hover:shadow-glow-purple"
                >
                  <span className="text-neon-purple transition group-hover:scale-110">
                    {iconMap[link.icon]}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 text-center font-mono text-xs text-muted/60"
        >
          © 2026 Stanford XR · Built for immersive builders
        </motion.p>
      </div>
    </footer>
  );
}
