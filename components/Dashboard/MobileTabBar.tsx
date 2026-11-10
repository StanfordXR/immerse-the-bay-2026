import type { IconType } from "react-icons";
import { LuCalendarDays, LuHouse, LuLifeBuoy, LuPackage, LuTrophy } from "react-icons/lu";
import type { DashboardTabId } from "@/data/dashboard-nav";
import { cn } from "@/lib/utils";

const ICONS: Record<DashboardTabId, IconType> = {
  home: LuHouse,
  schedule: LuCalendarDays,
  equipment: LuPackage,
  tracks: LuTrophy,
  help: LuLifeBuoy,
};

/** Shorter labels where the desktop one won't fit a fifth of a phone. */
const SHORT_LABELS: Partial<Record<DashboardTabId, string>> = { tracks: "Tracks" };

/**
 * Phone navigation for the event pages, fixed to the bottom of the screen
 * where thumbs reach. My Badge and Check-in stay in the header's account group.
 */
export function MobileTabBar({ tabs, current }: {
  tabs: Array<{ id: DashboardTabId; label: string; url: string }>;
  current: string;
}) {
  return (
    <nav
      aria-label="Dashboard tabs"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-void/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
    >
      <ul className="flex">
        {tabs.map(({ id, label, url }) => {
          const Icon = ICONS[id];
          const active = id === current;
          return (
            <li key={id} className="flex flex-1">
              <a
                href={url}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold",
                  active ? "text-neon-purple-light" : "text-muted",
                )}
              >
                <Icon aria-hidden className="h-5 w-5" />
                {SHORT_LABELS[id] ?? label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
