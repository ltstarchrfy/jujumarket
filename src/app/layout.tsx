import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "JUJU MARKET",
  description:
    "Reseller private server terbaru dengan fitur lengkap dan anti-ban protection. Download ASTUTE sekarang!",
  keywords: ["ASTUTE", "Reseller", "Private Server", "Mod", "Android"],
  icons: {
    icon: ["/favicon.ico", "/avatar.jpg"],
  },
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
        {/* Monetag verification */}
        <meta name="monetag" content="ba97e2d4c98334eb41ce9ba40bb34201" />
        {/* Monetag ad script (quge5.com) */}
        <script
          src="https://quge5.com/88/tag.min.js"
          data-zone="302327"
          async
          data-cfasync="false"
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7128718289235835"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
