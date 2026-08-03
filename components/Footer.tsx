"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaDiscord, FaInstagram, FaLinkedinIn, FaEnvelope } from "react-icons/fa6";
import { SITE, SOCIAL_LINKS } from "@/data/site";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Container } from "@/components/ui/Container";

const ICONS: Record<string, IconType> = {
  discord: FaDiscord,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  email: FaEnvelope,
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-navy/90 py-14">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"
        aria-hidden
      />
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-10 md:flex-row md:justify-between"
        >
          <motion.div variants={fadeUp} className="text-center md:text-left">
            <Link href="/" className="font-sans text-xl font-semibold">
              Stanford XR
            </Link>
            <p className="mt-2 text-sm text-muted">{SITE.tagline}</p>
            <p className="mt-1 font-mono text-xs text-neon-cyan/80">
              {SITE.name}
            </p>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-3"
            aria-label="Social links"
          >
            {SOCIAL_LINKS.map((link) => {
              const Icon = ICONS[link.icon];
              return (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2, scale: 1.04 }}
                    aria-label={link.label}
                    className="flex h-11 w-11 items-center justify-center border border-white/10 bg-surface/50 text-neon-cyan transition hover:border-neon-cyan/40 hover:shadow-glow-cyan"
                  >
                    {Icon ? <Icon className="h-5 w-5" aria-hidden /> : null}
                  </motion.a>
                </li>
              );
            })}
          </motion.ul>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 space-y-2 text-center"
        >
          <p className="font-mono text-xs text-muted/70">
            © {SITE.year} Stanford XR. All rights reserved.
          </p>
          <p className="text-xs text-muted/50">
            Built with ❤️ by{" "}
            <a
              href="https://www.stanfordxr.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted/70 transition hover:text-neon-cyan"
            >
              Stanford XR
            </a>
          </p>
        </motion.div>
      </Container>
    </footer>
  );
}
