import type { RoughScheduleBlock } from "@/data/types";
import { cn } from "@/lib/utils";

const SIZE_CLASS: Record<
  NonNullable<RoughScheduleBlock["size"]> | "default",
  string
> = {
  default: "min-h-[4.5rem] flex-1",
  large: "min-h-[7rem] flex-[3]",
  fill: "min-h-[18rem] flex-1 sm:min-h-[22rem]",
};

export function ScheduleGridBlock({ block }: { block: RoughScheduleBlock }) {
  const size = block.size ?? "default";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-5 text-center backdrop-blur-md",
        SIZE_CLASS[size],
      )}
    >
      <p className="font-sans text-base font-semibold uppercase tracking-wide text-foreground sm:text-lg">
        {block.title}
      </p>
      <p className="mt-1.5 font-mono text-xs uppercase tracking-[0.14em] text-neon-cyan/80 sm:text-sm">
        {block.time}
      </p>
    </div>
  );
}
