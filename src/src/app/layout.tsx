import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Application Maker Platform — Build Apps with AI",
  description:
    "Build production-ready apps through conversation. Chat with AI agents that design, code, and deploy your application from start to finish.",
  keywords: [
    "AI app builder",
    "no-code",
    "vibe coding",
    "AI agents",
    "full-stack",
    "app generator",
  ],
  openGraph: {
    title: "Smart Application Maker Platform — Build Apps with AI",
    description:
      "Chat with AI agents that design, code, and deploy your application from start to finish.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
