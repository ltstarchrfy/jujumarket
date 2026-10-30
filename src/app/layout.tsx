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

        {/* Monetag ad scripts */}
        {/* Zone 12128589 - 5gvci.com tag.min.js */}
        <script
          src="https://5gvci.com/act/files/tag.min.js?z=12128589"
          data-cfasync="false"
          async
        />
        {/* Zone 302327 - quge5.com tag.min.js */}
        <script
          src="https://quge5.com/88/tag.min.js"
          data-zone="302327"
          async
          data-cfasync="false"
        />

        {/* Monetag vignette scripts (auto-appended via IIFE) */}
        {/* Zone 12128111 - nap5k.com tag.min.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='12128111',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`,
          }}
        />
        {/* Zone 12128588 - n6wxm.com vignette.min.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='12128588',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`,
          }}
        />
        {/* Zone 12128599 - n6wxm.com vignette.min.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='12128599',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`,
          }}
        />
        {/* Zone 12128600 - n6wxm.com vignette.min.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='12128600',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`,
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
