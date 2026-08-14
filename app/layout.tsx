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
  description: SITE.seoDescription,
  applicationName: SITE.organizationName,
  openGraph: {
    title: SITE.seoTitle,
    siteName: SITE.seoTitle,
    description: SITE.seoDescription,
    type: "website",
    url: SITE.url,
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Immerse the Bay 2026, Stanford's XR hackathon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.seoTitle,
    description: SITE.seoDescription,
    images: ["/images/og.jpg"],
  },
  icons: {
    icon: [
      // Google Search only shows a favicon that's a square multiple of 48px;
      // the explicit sizes attr is what its crawler keys on.
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
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
