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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700;800&family=Rajdhani:wght@500;600;700&display=swap"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
