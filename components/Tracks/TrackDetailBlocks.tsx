import type { ReactNode } from "react";
import type { TrackPrizeGroup, TrackResource } from "@/data/types";
import { cn } from "@/lib/utils";

export function TrackBlock({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-xs uppercase tracking-wider text-neon-cyan">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function TrackBulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-neon-indigo">▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function TrackPrizeGroups({ groups }: { groups: TrackPrizeGroup[] }) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.title}
          className="border border-white/10 bg-void/40 p-4"
        >
          <p className="font-sans text-sm font-semibold text-foreground">{group.title}</p>
          <TrackBulletList items={group.items} />
          {group.note && (
            <p className="mt-2 text-xs leading-relaxed text-muted">{group.note}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function TrackResources({ resources }: { resources: TrackResource[] }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {resources.map((resource) => (
        <li key={resource.label}>
          {resource.href ? (
            <a
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-purple-light transition hover:text-neon-cyan"
            >
              {resource.label}
            </a>
          ) : (
            <span className="text-muted">{resource.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function TrackTagList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="border border-white/10 bg-void/50 px-2.5 py-1 font-mono text-xs text-foreground/90"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
