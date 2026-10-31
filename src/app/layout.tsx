import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import MonetagDirectLink from "@/components/MonetagDirectLink";
import SecondAdsNetwork from "@/components/SecondAdsNetwork";

export const metadata: Metadata = {
  title: "JUJU MARKET",
  description:
    "Reseller private server terbaru dengan fitur lengkap dan anti-ban protection. Download ASTUTE sekarang!",
  keywords: ["ASTUTE", "Reseller", "Private Server", "Mod", "Android"],
  icons: {
    icon: ["/favicon.ico", "/avatar.jpg"],
    apple: ["/avatar.jpg"],
  },
  appleWebApp: {
    capable: true,
    title: "JUJU MARKET",
    statusBarStyle: "black-translucent",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
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
        <meta name="monetag" content="83bad22c01a0b9fe999d7bfe41ea80a5" />

        {/* === NEW Monetag ad scripts (replaced old zones) === */}

        {/* Zone 12154478 - 5gvci.com tag.min.js */}
        <script
          src="https://5gvci.com/act/files/tag.min.js?z=12154478"
          data-cfasync="false"
          async
        />
        {/* Zone 12154468 - 5gvci.com tag.min.js */}
        <script
          src="https://5gvci.com/act/files/tag.min.js?z=12154468"
          data-cfasync="false"
          async
        />
        {/* Zone 303630 - quge5.com tag.min.js */}
        <script
          src="https://quge5.com/88/tag.min.js"
          data-zone="303630"
          async
          data-cfasync="false"
        />

        {/* Monetag vignette + tag scripts (auto-appended via IIFE) */}
        {/* Zone 12154471 - n6wxm.com vignette.min.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='12154471',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`,
          }}
        />
        {/* Zone 12154470 - nap5k.com tag.min.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='12154470',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`,
          }}
        />
        {/* Zone 12154466 - al5sm.com tag.min.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='12154466',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`,
          }}
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
        <MonetagDirectLink />
        <SecondAdsNetwork />
        {children}
      </body>
    </html>
  );
}
