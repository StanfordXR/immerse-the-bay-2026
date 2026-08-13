import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WebsiteJsonLd } from "@/components/WebsiteJsonLd";
import { SITE } from "@/data/site";
import { fontDystopian, fontGlitch } from "@/lib/fonts";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.seoTitle,
    template: `%s | ${SITE.seoTitle}`,
  },
  description:
    "Stanford's premier XR hackathon — VR, AR, AI, gaming, and immersive technology.",
  applicationName: "StanfordXR",
  openGraph: {
    title: SITE.seoTitle,
    siteName: "StanfordXR",
    description: "Build the future of immersive technology at Stanford.",
    type: "website",
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.seoTitle,
    description: "Build the future of immersive technology at Stanford.",
  },
  icons: {
    icon: [{ url: "/images/logo/SXRLogo.png", type: "image/png" }],
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
      <head>
        <WebsiteJsonLd />
      </head>
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
