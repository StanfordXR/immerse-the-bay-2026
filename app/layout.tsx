import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { fontDystopian, fontGlitch } from "@/lib/fonts";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Immerse the Bay | StanfordXR",
    template: "%s | Immerse the Bay | StanfordXR",
  },
  description:
    "Stanford's premier XR hackathon — VR, AR, AI, gaming, and immersive technology.",
  openGraph: {
    title: "Immerse the Bay | StanfordXR",
    description: "Build the future of immersive technology at Stanford.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/images/logo/SXRLogo.png", type: "image/png" },
    ],
    apple: "/images/logo/SXRLogo.png",
    shortcut: "/favicon.ico",
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
      className={`${shareTechMono.variable} ${fontDystopian.variable} ${fontGlitch.variable} scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className={`${shareTechMono.className} min-h-screen bg-void text-foreground antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
