export type SponsorTierName = "Platinum" | "Gold" | "Silver" | "Supported By";

export interface Sponsor {
  name: string;
  logo?: string;
  url?: string;
  /** Marquee logo size multiplier (default 1). */
  marqueeScale?: number;
  /** Sponsor grid logo size multiplier (default 1). */
  logoScale?: number;
  /** Multiplier on horizontal space after this logo in the marquee (default 1). */
  marqueeSpacingAfter?: number;
}

export interface SponsorTier {
  tier: SponsorTierName;
  sponsors: Sponsor[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export type ScheduleDayId = "friday" | "saturday" | "sunday";

export type RoughScheduleBlockSize = "default" | "large" | "fill";

export interface RoughScheduleBlock {
  id: string;
  title: string;
  time: string;
  size?: RoughScheduleBlockSize;
}

export interface RoughScheduleDay {
  id: ScheduleDayId;
  label: string;
  date: string;
  blocks: RoughScheduleBlock[];
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  host?: string;
  icon?: string;
}

export interface ScheduleDay {
  id: ScheduleDayId;
  label: string;
  events: ScheduleEvent[];
}

export interface TrackResource {
  label: string;
  href?: string;
}

export interface TrackPrizeGroup {
  title: string;
  items: string[];
  note?: string;
}

export interface SponsoredTrack {
  id: string;
  title: string;
  sponsors: string[];
  presenter?: string;
  subtitle?: string;
  theme?: string;
  goal?: string;
  description?: string;
  listLabel?: string;
  listItems?: string[];
  lookingFor?: string[];
  judgingBonus?: string[];
  technologies?: string[];
  prizes?: TrackPrizeGroup[];
  participationPrize?: TrackPrizeGroup;
  applicationRequirements?: string[];
  notes?: string[];
  resources?: TrackResource[];
  icon: string;
}

export interface PrimaryTrack {
  id: string;
  title: string;
  theme: string;
  icon: string;
}

export interface PrimaryTrackAwards {
  headline: string;
  prize: string;
  winnerBenefits: string[];
}

export interface AboutBox {
  id: string;
  title: string;
  body: string;
}

export interface GalleryImage {
  id: string;
  src?: string;
  alt: string;
  width: number;
  height: number;
}

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  comingSoon?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "discord" | "instagram" | "linkedin" | "email";
}

export interface HackathonStat {
  id: string;
  value: string;
  label: string;
}

export interface DashboardResource {
  id: string;
  title: string;
  description: string;
  href: string;
}
