export const DASHBOARD_TABS = [
  { id: "home", label: "Home" },
  { id: "schedule", label: "Schedule" },
  { id: "equipment", label: "Equipment" },
  { id: "tracks", label: "Tracks & Submit" },
  { id: "help", label: "Help" },
] as const;

export type DashboardTabId = (typeof DASHBOARD_TABS)[number]["id"];

export const DASHBOARD_BADGE = { id: "badge", label: "My Badge" } as const;
export const DASHBOARD_PAGES = [...DASHBOARD_TABS, DASHBOARD_BADGE] as const;
export type DashboardPageId = (typeof DASHBOARD_PAGES)[number]["id"];

export function isDashboardPage(value: string): value is DashboardPageId {
  return DASHBOARD_PAGES.some((page) => page.id === value);
}

export function dashboardPath(page: DashboardPageId, onLiveHost: boolean) {
  const segment = page === "home" ? "" : `/${page}`;
  return onLiveHost ? segment || "/" : `/dashboard${segment}`;
}
