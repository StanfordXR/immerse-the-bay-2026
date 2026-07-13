"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPONSORED_TRACKS } from "@/data/tracks";
import { TabButton, TabPanel } from "@/components/ui/Tabs";
import { fadeUp } from "@/lib/motion";
import { PrimaryTracksSection } from "./PrimaryTracksSection";
import { SponsoredTrackCard } from "./SponsoredTrackCard";
import { TracksOverview } from "./TracksOverview";

type MainTab = "overview" | "sponsored" | "primary";

const MAIN_TABS: { id: MainTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "sponsored", label: "Sponsored tracks" },
  { id: "primary", label: "Primary & bonus" },
];

export function TracksTabs() {
  const [mainTab, setMainTab] = useState<MainTab>("overview");
  const [sponsoredId, setSponsoredId] = useState(SPONSORED_TRACKS[0].id);
  const activeSponsored = SPONSORED_TRACKS.find((track) => track.id === sponsoredId)!;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Tracks and prizes sections"
        className="mb-8 flex flex-wrap justify-center gap-2"
      >
        {MAIN_TABS.map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={mainTab === tab.id}
            onClick={() => setMainTab(tab.id)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mainTab === "overview" && (
          <TabPanel key="overview" id="overview" labelledBy="tab-overview">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              <TracksOverview embedded />
            </motion.div>
          </TabPanel>
        )}

        {mainTab === "sponsored" && (
          <TabPanel key="sponsored" id="sponsored" labelledBy="tab-sponsored">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mb-4 text-center text-sm text-muted">
                Pick a partner track to see theme, prizes, and resources.
              </p>

              <div
                role="tablist"
                aria-label="Sponsored tracks"
                className="mb-6 flex flex-wrap justify-center gap-2"
              >
                {SPONSORED_TRACKS.map((track) => (
                  <TabButton
                    key={track.id}
                    id={`sponsored-${track.id}`}
                    label={track.title}
                    isActive={sponsoredId === track.id}
                    onClick={() => setSponsoredId(track.id)}
                    compact
                  />
                ))}
              </div>

              <motion.div
                key={sponsoredId}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <SponsoredTrackCard track={activeSponsored} variant="panel" />
              </motion.div>
            </motion.div>
          </TabPanel>
        )}

        {mainTab === "primary" && (
          <TabPanel key="primary" id="primary" labelledBy="tab-primary">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PrimaryTracksSection embedded />
            </motion.div>
          </TabPanel>
        )}
      </AnimatePresence>
    </div>
  );
}
