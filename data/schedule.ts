import type { ScheduleDay } from "./types";

export const SCHEDULE_DAYS: ScheduleDay[] = [
  {
    id: "friday",
    label: "Friday, November 14",
    events: [
      {
        id: "fri-checkin",
        time: "11:00 am – 6:00 pm",
        title: "Check-In & Merch",
        description: "",
        location: "Huang Foyer",
      },
      {
        id: "fri-workshop-beat-saber",
        time: "12:00 – 1:00 pm",
        host: "Beat Saber",
        title: "Mods, Maps, and Mastery",
        description:
          "Come learn about how to Mod, Map, and Master Beat Saber with multiple mentors from the top 1000 players in the nation!",
        location: "Rotunda E241",
      },
      {
        id: "fri-workshop-unity",
        time: "12:00 – 1:00 pm",
        host: "XR @ Berkeley",
        title: "Introduction to Unity",
        description:
          "This workshop will cover the basics of the Unity game engine and have a live demonstration on how to navigate the Unity editor. If you're new to AR/VR development, this overview can serve as a foundation for using other XR development tools in this event! Hope to see you there!",
        location: "Packard 101",
      },
      {
        id: "fri-workshop-xreal",
        time: "1:15 – 2:15 pm",
        host: "XREAL",
        title: "Building the AR Future",
        description:
          "Discover how XREAL is shaping the future of augmented reality through accessible hardware and our SDK that empowers developers to create spatial experiences for everyone.",
        location: "Rotunda E241",
      },
      {
        id: "fri-workshop-snap",
        time: "1:15 – 2:15 pm",
        host: "Snap AR",
        title: "Develop with Snap Spectacles",
        description:
          "Are you interested in developing AR, real-world applications? Or are you interested in learning more about Snap Spectacles? Come to this workshop to learn about the ecosystem behind Snap Spectacles and how to develop with them! By the end of it, you'll gain a better understanding of AR glasses and have a starter project set up that you can use for your hack! We will also provide mentorship throughout the hack if you choose to build with us!",
        location: "Packard 101",
      },
      {
        id: "fri-workshop-bytedance",
        time: "2:30 – 3:30 pm",
        host: "ByteDance",
        title: "Build for PICO XR, SecureMR, or Apple Vision Pro with WebSpatial",
        description:
          "Learn how to build for Apple Vision Pro, Android XR, and PICO headsets — using just HTML, React, CSS, and JavaScript. With WebSpatial, you can turn any 2D website into a spatial app in hours, not days. Build interactive travel planners, spatial productivity tools, 3D portfolios, or even immersive media dashboards — all with code you already know.\n\nWe'll also cover SecureMR, our mixed reality framework that lets you bring your own Computer Vision and ML models into Unity-powered XR apps. Think gesture-controlled interfaces, AI-driven fitness apps, smart home overlays, or spatial educational tools that respond to real-world objects.",
        location: "NVIDIA Auditorium",
      },
      {
        id: "fri-workshop-raven",
        time: "2:30 – 3:30 pm",
        host: "Raven",
        title: "Raven AR Glasses: Intro + SDK Preview",
        description:
          "Raven Resonance founding team members preview their smart glasses with eye tracking, full-color display, Linux-based OS, and hot-swappable batteries. Plus a sneak peek of the Raven SDK for creating apps & agents that utilize the powerful on-glasses compute and sensors.",
        location: "Packard 101",
      },
      {
        id: "fri-workshop-openbci",
        time: "3:45 – 4:45 pm",
        host: "OpenBCI",
        title: "Introduction to Brain Computer Interfaces",
        description:
          "An overview of OpenBCI and its hardware. Including a live Galea demo!",
        location: "NVIDIA Auditorium",
      },
      {
        id: "fri-workshop-meshy",
        time: "3:45 – 4:45 pm",
        host: "Meshy AI",
        title: "Empowering Creativity: How Meshy Facilitates 3D Asset Creation with AI in XR-Hacks",
        description:
          "Join us for an interactive workshop with Meshy, the leading GenAI platform revolutionizing 3D content creation. Meshy empowers artists, designers, and developers to generate fully textured 3D models from text or images in just minutes, drastically reducing the traditional modeling process from hours to seconds.\n\nIn this session, the Meshy team will walk through the complete Meshy workflow — from text-to-3D generation to texture refinement. You'll see how creators and studios are integrating Meshy into their pipelines for rapid prototyping, game development, XR experiences, and virtual production. Whether you're a designer, developer, or researcher, you'll gain practical insights into how generative AI is transforming 3D creation workflows — and how Meshy can accelerate your own creative process.",
        location: "Packard 101",
      },
      {
        id: "fri-workshop-xr-bootcamp",
        time: "5:00 – 6:00 pm",
        host: "XR Bootcamp / Meta",
        title: "Start in XR Today: Ideation, Prototyping & Social VR",
        description:
          "XR in 2025: A quick overview of the current XR ecosystem and why this is the best time to enter.",
        location: "NVIDIA Auditorium",
      },
      {
        id: "fri-workshop-afference",
        time: "5:00 – 6:00 pm",
        host: "Afference",
        title: "Artificial Touch: How To Let People Feel Virtual Objects",
        description:
          "This workshop will expose you to the powerful work behind Afference that deepens digital experiences by adding the power of touch. Through our simple Unity SDK, you'll learn how to provide users a more powerful and engaging experience by tapping into the most impactful human sense. Hosted by Afference engineers and product leads, you'll get a solid picture of the opportunity ahead of you to integrate Artificial Touch during the hackathon and beyond, as the technology is launched to consumers through the smart wearables you know and love today in the near future.",
        location: "Packard 101",
      },
      {
        id: "fri-dinner",
        time: "6:00 pm – 7:00 pm",
        title: "Dinner",
        description: "",
        location: "Huang Basement",
      },
      {
        id: "fri-opening",
        time: "7:00 pm – 8:15 pm",
        title: "Opening Ceremony",
        description: "",
        location: "Hewlett 200",
      },
      {
        id: "fri-team-formation",
        time: "8:15 pm – 9:00 pm",
        title: "Team Formation",
        description: "",
        location: "Huang Basement",
      },
      {
        id: "fri-hacking",
        time: "9:00 pm",
        title: "Hacking Begins",
        description: "",
        location: "Huang Basement",
      },
    ],
  },
  {
    id: "saturday",
    label: "Saturday, November 15",
    events: [
      {
        id: "sat-hacking",
        time: "All day",
        title: "Hacking",
        description: "",
        location: "Huang Basement",
      },
      {
        id: "sat-brunch",
        time: "10:00 am – 1:00 pm",
        title: "Brunch",
        description: "",
        location: "Huang Basement",
      },
      {
        id: "sat-dinner",
        time: "5:00 pm – 8:00 pm",
        title: "Dinner",
        description: "",
        location: "Huang Basement",
      },
    ],
  },
  {
    id: "sunday",
    label: "Sunday, November 16",
    events: [
      {
        id: "sun-hacking-ends",
        time: "9:00 am",
        title: "Hacking Ends",
        description: "",
        location: "Huang Basement",
      },
      {
        id: "sun-judging",
        time: "10:00 am – 12:00 pm",
        title: "Judging",
        description: "",
        location: "Huang Basement",
      },
      {
        id: "sun-lunch",
        time: "12:00 pm – 1:00 pm",
        title: "Lunch",
        description: "",
        location: "Huang Basement",
      },
      {
        id: "sun-closing",
        time: "2:00 pm – 3:00 pm",
        title: "Closing Ceremony",
        description: "",
        location: "Hewlett 200",
      },
      {
        id: "sun-expo",
        time: "3:00 pm – 5:00 pm",
        title: "Project Expo / Networking",
        description: "",
        location: "Huang Basement",
      },
    ],
  },
];
