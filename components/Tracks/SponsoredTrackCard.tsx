"use client";

import type { SponsoredTrack } from "@/data/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import {
  TrackBlock,
  TrackBulletList,
  TrackPrizeGroups,
  TrackResources,
  TrackTagList,
} from "./TrackDetailBlocks";

export function SponsoredTrackCard({
  track,
  variant = "full",
}: {
  track: SponsoredTrack;
  variant?: "full" | "panel";
}) {
  return (
    <article id={track.id} className="scroll-mt-28">
      <GlassCard className="h-full">
        {variant === "full" && (
          <div className="flex items-start gap-4">
            <span
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-neon-cyan/30 bg-neon-indigo/10 font-mono text-xl text-neon-cyan"
              aria-hidden
            >
              {track.icon}
            </span>
            <div>
              <h3 className="font-sans text-xl font-semibold sm:text-2xl">{track.title}</h3>
              {track.subtitle && (
                <p className="mt-1 text-sm text-neon-purple-light/90">{track.subtitle}</p>
              )}
              {track.presenter && (
                <p className="mt-1 font-mono text-xs text-muted">
                  Presenter: <span className="text-foreground">{track.presenter}</span>
                </p>
              )}
              <p className="mt-2 break-words font-mono text-xs leading-relaxed text-muted">
                {track.sponsors.join(" · ")}
              </p>
            </div>
          </div>
        )}

        {variant === "panel" && (
          <div className="border-b border-white/10 pb-4">
            {track.subtitle && (
              <p className="text-sm text-neon-purple-light/90">{track.subtitle}</p>
            )}
            {track.presenter && (
              <p className="mt-1 font-mono text-xs text-muted">
                Presenter: <span className="text-foreground">{track.presenter}</span>
              </p>
            )}
            <p className="mt-1 font-mono text-xs text-muted">{track.sponsors.join(" · ")}</p>
          </div>
        )}

        <div
          className={cn(
            "space-y-4",
            variant === "full" ? "mt-6" : "mt-4",
            "md:grid md:grid-cols-2 md:gap-x-6 md:space-y-0 md:[&>*]:mb-4",
          )}
        >
          {track.theme && (
            <TrackBlock label="Theme">
              <p className="text-sm leading-relaxed text-muted">{track.theme}</p>
            </TrackBlock>
          )}

          {track.goal && (
            <TrackBlock label="Goal">
              <p className="text-sm leading-relaxed text-muted">{track.goal}</p>
            </TrackBlock>
          )}

          {track.description && (
            <TrackBlock label="About">
              <p className="text-sm leading-relaxed text-muted">{track.description}</p>
            </TrackBlock>
          )}

          {track.listItems && track.listItems.length > 0 && (
            <TrackBlock label={track.listLabel ?? "Details"}>
              <TrackBulletList items={track.listItems} />
            </TrackBlock>
          )}

          {track.technologies && (
            <TrackBlock label="Technologies">
              <TrackTagList items={track.technologies} />
            </TrackBlock>
          )}

          {track.lookingFor && (
            <TrackBlock label="What they're looking for">
              <TrackBulletList items={track.lookingFor} />
            </TrackBlock>
          )}

          {track.judgingBonus && (
            <TrackBlock label="Judging bonus points">
              <TrackBulletList items={track.judgingBonus} />
            </TrackBlock>
          )}

          {track.applicationRequirements && (
            <TrackBlock label="Application instructions">
              <TrackBulletList items={track.applicationRequirements} />
            </TrackBlock>
          )}

          {track.participationPrize && (
            <TrackBlock label="Participation">
              <TrackPrizeGroups groups={[track.participationPrize]} />
            </TrackBlock>
          )}

          {track.prizes && track.prizes.length > 0 && (
            <TrackBlock label="Prizes">
              <TrackPrizeGroups groups={track.prizes} />
            </TrackBlock>
          )}

          {track.notes && (
            <TrackBlock label="Notes">
              <TrackBulletList items={track.notes} />
            </TrackBlock>
          )}

          {track.resources && (
            <TrackBlock label="Resources">
              <TrackResources resources={track.resources} />
            </TrackBlock>
          )}
        </div>
      </GlassCard>
    </article>
  );
}
