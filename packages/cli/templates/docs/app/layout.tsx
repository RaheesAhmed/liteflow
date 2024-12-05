import React from "react";
import { LiteFlowProvider } from "@liteflow/core";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchProvider } from "@/components/search-provider";

import "@/styles/globals.css";

export const metadata = {
  title: {
    default: "LiteFlow - The Modern Web Framework",
    template: "%s | LiteFlow",
  },
  description:
    "The modern web framework for building fast, scalable applications",
  keywords: [
    "liteflow",
    "react",
    "framework",
    "web development",
    "typescript",
    "nextjs alternative",
  ],
  authors: [
    {
      name: "LiteFlow Team",
      url: "https://liteflow.dev",
    },
  ],
  creator: "LiteFlow Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://liteflow.dev",
    title: "LiteFlow - The Modern Web Framework",
    description:
      "The modern web framework for building fast, scalable applications",
    siteName: "LiteFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiteFlow - The Modern Web Framework",
    description:
      "The modern web framework for building fast, scalable applications",
    creator: "@liteflowjs",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <LiteFlowProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SearchProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
            </SearchProvider>
          </ThemeProvider>
        </LiteFlowProvider>
      </body>
    </html>
  );
}
