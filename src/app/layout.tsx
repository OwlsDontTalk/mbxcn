import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@/styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "mbxcn";
const siteDescription =
  "Customizable Mapbox GL components for React. Built on Mapbox GL JS. Styled with Tailwind. Works with shadcn/ui.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "mbxcn",
    template: "%s - mbxcn",
  },
  description: siteDescription,
  keywords: [
    "react map",
    "next.js map",
    "mapbox",
    "mapbox gl",
    "map components",
    "shadcn map",
    "tailwind map",
    "react map library",
    "typescript map",
    "interactive maps",
  ],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: "mbxcn",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "mbxcn",
    description: siteDescription,
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
