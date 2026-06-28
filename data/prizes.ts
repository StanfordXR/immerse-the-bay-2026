import type { Prize } from "./types";

export const PRIZES: Prize[] = [
  {
    id: "grand",
    title: "Grand Prize",
    description: "Best overall immersive experience across technical depth, creativity, and impact.",
    amount: "$5,000",
    sponsor: "Meta",
  },
  {
    id: "xr-ai",
    title: "XR + AI Track Winner",
    description: "Most innovative use of spatial AI or machine learning in an immersive project.",
    amount: "$2,500",
    sponsor: "NVIDIA",
  },
  {
    id: "vr-gaming",
    title: "VR Gaming Track Winner",
    description: "Standout gameplay, polish, and fun factor in virtual reality.",
    amount: "$2,500",
    sponsor: "Unity",
  },
  {
    id: "spatial",
    title: "Spatial Computing Track Winner",
    description: "Best mixed reality experience blending digital and physical worlds.",
    amount: "$2,500",
    sponsor: "Apple Vision",
  },
  {
    id: "storytelling",
    title: "Interactive Storytelling Winner",
    description: "Most compelling narrative with meaningful audience agency.",
    amount: "$1,500",
    sponsor: "Epic Games",
  },
  {
    id: "creative-tools",
    title: "Creative Tools Winner",
    description: "Best tool or pipeline that empowers immersive creators.",
    amount: "$1,500",
    sponsor: "Autodesk",
  },
  {
    id: "hci",
    title: "HCI Track Winner",
    description: "Strongest contribution to accessible or novel XR interaction.",
    amount: "$1,500",
    sponsor: "VHIL",
  },
  {
    id: "peoples",
    title: "People's Choice",
    description: "Community-voted favorite from the demo fair.",
    amount: "$1,000",
    sponsor: "Stanford XR",
  },
];
