export type SponsorTierName = "Platinum" | "Gold" | "Silver" | "Supported By";

export interface Sponsor {
  name: string;
  logo?: string;
  url?: string;
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

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  icon?: string;
}

export interface ScheduleDay {
  id: ScheduleDayId;
  label: string;
  events: ScheduleEvent[];
}

export interface Track {
  id: string;
  title: string;
  sponsors: string[];
  theme: string;
  description: string;
  hardware: string[];
  software: string[];
  apis: string[];
  mentors: string;
  resources: string;
  icon: string;
}

export interface Prize {
  id: string;
  title: string;
  description: string;
  amount: string;
  sponsor: string;
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
