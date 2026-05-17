import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Immerse the Bay 2026 | Stanford XR Hackathon",
  description:
    "Stanford's premier XR hackathon — VR, AR, AI, gaming, and immersive technology. April 2026.",
  openGraph: {
    title: "Immerse the Bay 2026",
    description: "Build the future of immersive technology at Stanford.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${orbitron.variable} ${jetbrains.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-void text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
