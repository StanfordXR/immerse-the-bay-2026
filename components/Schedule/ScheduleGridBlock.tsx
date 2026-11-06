import type { ReactNode } from "react";
import type { RoughScheduleBlock } from "@/data/types";
import { cn } from "@/lib/utils";

const SIZE_CLASS: Record<
  NonNullable<RoughScheduleBlock["size"]> | "default",
  string
> = {
  default: "min-h-[4.5rem] flex-1",
  large: "min-h-[7rem] flex-[3]",
  fill: "min-h-[12rem] flex-1 sm:min-h-[22rem]",
};

export function ScheduleGridBlock({
  block,
  compact = false,
  className,
  children,
}: {
  block: RoughScheduleBlock;
  /** Tighter padding and type, for dense layouts like the dashboard. */
  compact?: boolean;
  className?: string;
  /** Optional detail (e.g. a session list) rendered under the time. */
  children?: ReactNode;
}) {
  const size = block.size ?? "default";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 text-center backdrop-blur-md",
        // Compact blocks size to their content instead of flexing.
        compact ? "py-3" : cn("py-5", SIZE_CLASS[size]),
        children != null && "justify-start px-5",
        className,
      )}
    >
      <p
        className={cn(
          "font-sans font-semibold uppercase tracking-wide text-foreground",
          compact ? "text-sm sm:text-base" : "text-base sm:text-lg",
        )}
      >
        {block.title}
      </p>
      <p
        className={cn(
          "font-mono text-xs uppercase tracking-[0.14em] text-neon-cyan/80",
          compact ? "mt-1" : "mt-1.5 sm:text-sm",
        )}
      >
        {block.time}
      </p>
      {children}
    </div>
  );
}
