import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "TopUpKu — Top Up Game Favoritmu",
  description:
    "Platform top-up game terpercaya dengan harga terbaik dan proses instan. Top up Mobile Legends, PUBG, Free Fire, dan game lainnya.",
  keywords: ["Top Up", "Game", "Mobile Legends", "PUBG", "Free Fire", "Diamond", "UC"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
