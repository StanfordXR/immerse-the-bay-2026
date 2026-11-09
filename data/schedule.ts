import type { RoughScheduleDay } from "./types";

export const OPENING_START = "2026-11-13T19:00:00-08:00";

// Approved public overview. The detailed timetable never enters this module.
export const PUBLIC_SCHEDULE: RoughScheduleDay[] = [
  {
    id: "friday", label: "Friday", date: "November 13",
    blocks: [
      { id: "fri-workshops", title: "Workshops", time: "12 PM–6 PM", size: "large" },
      { id: "fri-dinner", title: "Dinner", time: "6 PM–7 PM" },
      { id: "fri-opening", title: "Opening Ceremony", time: "7 PM–8 PM" },
      { id: "fri-hacking", title: "Hacking Begins", time: "9 PM" },
    ],
  },
  {
    id: "saturday", label: "Saturday", date: "November 14",
    blocks: [{ id: "sat-hacking", title: "Hacking", time: "All day", size: "fill" }],
  },
  {
    id: "sunday", label: "Sunday", date: "November 15",
    blocks: [
      { id: "sun-hacking-ends", title: "Hacking Ends", time: "9 AM" },
      { id: "sun-judging", title: "Judging", time: "10 AM–12 PM" },
      { id: "sun-lunch", title: "Lunch", time: "12 PM" },
      { id: "sun-closing", title: "Closing Ceremony", time: "1:30 PM" },
    ],
  },
];
