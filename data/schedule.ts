import type { RoughScheduleDay } from "./types";

export const ROUGH_SCHEDULE: RoughScheduleDay[] = [
  {
    id: "friday",
    label: "Friday",
    date: "November 13",
    blocks: [
      { id: "fri-workshops", title: "Workshops", time: "12–6 pm", size: "large" },
      { id: "fri-dinner", title: "Dinner", time: "6–7 pm" },
      { id: "fri-opening", title: "Opening Ceremony", time: "7–8:30 pm" },
      { id: "fri-hacking", title: "Hacking", time: "9 pm" },
    ],
  },
  {
    id: "saturday",
    label: "Saturday",
    date: "November 14",
    blocks: [
      { id: "sat-hacking", title: "Hacking", time: "All day", size: "fill" },
    ],
  },
  {
    id: "sunday",
    label: "Sunday",
    date: "November 15",
    blocks: [
      { id: "sun-hacking-ends", title: "Hacking Ends", time: "9 am" },
      { id: "sun-judging", title: "Judging", time: "9:30 am–12 pm" },
      { id: "sun-lunch", title: "Lunch", time: "12 pm" },
      { id: "sun-closing", title: "Closing Ceremony", time: "1:30 pm" },
    ],
  },
];
