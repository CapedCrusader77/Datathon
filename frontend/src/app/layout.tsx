import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POLICEGPT — Karnataka State Police AI Investigation Assistant",
  description:
    "National-grade AI-powered crime investigation platform for Karnataka State Police. Ask crime data like you ask ChatGPT.",
  keywords: [
    "Karnataka Police", "POLICEGPT", "AI Investigation", "Crime Database",
    "FIR Search", "Criminal Intelligence", "Law Enforcement AI"
  ],
  authors: [{ name: "Karnataka State Police - POLICEGPT Team" }],
  robots: "noindex, nofollow", // Internal government system
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
