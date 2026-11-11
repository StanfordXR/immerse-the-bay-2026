import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

/**
 * The dashboard's button-style link. `primary` is the one action a card or
 * section is for; everything else is the outlined secondary style.
 */
export function ActionLink({ href, primary, icon: Icon, children, className }: {
  href: string;
  primary?: boolean;
  icon?: IconType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 px-5 text-center font-mono text-sm font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan",
        primary
          ? "bg-gradient-to-r from-neon-violet to-neon-purple text-white shadow-glow-purple hover:brightness-110"
          : "border border-white/20 bg-void/60 text-foreground backdrop-blur hover:border-neon-purple-light/60",
        className,
      )}
    >
      {Icon && <Icon aria-hidden className="h-4 w-4 shrink-0" />}
      {children}
    </a>
  );
}
