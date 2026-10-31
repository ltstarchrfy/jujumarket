"use client";

import { useEffect } from "react";

// Second Ad Network Integration (ardance/bellnewyork/accountut)
// Multiple ad formats: direct link, iframe banner, display ads
// This is SEPARATE from Monetag — both run together
export default function SecondAdsNetwork() {
  useEffect(() => {
    // === 1. Direct Link Ad (ardance.org) — iOS-friendly synchronous <a> click ===
    let directOpened = false;
    const DIRECT_URL = "https://ardance.org/4/349289c34954275239a2b5c70154aa89";

    const openDirectLink = (e: Event) => {
      if (directOpened) return;
      directOpened = true;
      try {
        // Synchronous <a> click — works on iOS Safari
        const link = document.createElement("a");
        link.href = DIRECT_URL;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (document.body.contains(link)) document.body.removeChild(link);
        }, 1000);
      } catch (e) {
        console.warn("SecondAds direct link error:", e);
      }
      document.removeEventListener("click", openDirectLink, true);
      document.removeEventListener("touchend", openDirectLink, true);
    };

    const directTimer = setTimeout(() => {
      document.addEventListener("click", openDirectLink, true);
      document.addEventListener("touchend", openDirectLink, true);
    }, 3000);

    // === 2. Inject async ad scripts ===
    const injectScript = (src: string, async = true) => {
      try {
        const s = document.createElement("script");
        s.src = src;
        s.setAttribute("data-cfasync", "false");
        if (async) s.async = true;
        document.head.appendChild(s);
      } catch (e) {
        console.warn("Failed to inject script:", src, e);
      }
    };

    // bellnewyork.org/21 (new ID)
    injectScript("https://bellnewyork.org/21/d4018cde0bd42d908dd836f837bc0151", true);
    // accountut.com/1 (new ID)
    injectScript("https://accountut.com/1/24e860136f0e6d02f496d88f69100ffe", false);
    // bellnewyork.org/14 (new ID)
    injectScript("https://bellnewyork.org/14/7af5b241a0120eab08854e4916f5bf4d", false);

    // === 3. Banner ad container (bellnewyork.org/21) — new ID ===
    const containerDiv = document.createElement("div");
    containerDiv.id = "container-d4018cde0bd42d908dd836f837bc0151";
    containerDiv.style.cssText = "position:fixed;bottom:0;left:0;right:0;z-index:99998;pointer-events:auto;max-height:60px;overflow:hidden;";
    document.body.appendChild(containerDiv);

    // === 4. atOptions Banner 1 (728x90 leaderboard) — new key ===
    try {
      (window as any).atOptions = {
        'key': 'a06ca4de81f87aa2b76cc71bdad2ba7e',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
      };
      const s1 = document.createElement("script");
      s1.src = "https://bellnewyork.org/22/a06ca4de81f87aa2b76cc71bdad2ba7e";
      s1.setAttribute("data-cfasync", "false");
      document.head.appendChild(s1);
    } catch (e) {
      console.warn("atOptions1 error:", e);
    }

    // === 5. atOptions Banner 2 (300x250 medium rectangle) — new key ===
    try {
      (window as any).atOptions = {
        'key': '12148d8aa42b08b48bb4ac17c7e4d3bb',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };
      const s2 = document.createElement("script");
      s2.src = "https://bellnewyork.org/22/12148d8aa42b08b48bb4ac17c7e4d3bb";
      s2.setAttribute("data-cfasync", "false");
      document.head.appendChild(s2);
    } catch (e) {
      console.warn("atOptions2 error:", e);
    }

    // === 6. atOptions Banner 3 (160x600 skyscraper) — new key ===
    try {
      (window as any).atOptions = {
        'key': 'c54044d4e6b68b54a521f3f69ccbedbc',
        'format': 'iframe',
        'height': 600,
        'width': 160,
        'params': {}
      };
      const s3 = document.createElement("script");
      s3.src = "https://bellnewyork.org/22/c54044d4e6b68b54a521f3f69ccbedbc";
      s3.setAttribute("data-cfasync", "false");
      document.head.appendChild(s3);
    } catch (e) {
      console.warn("atOptions3 error:", e);
    }

    return () => {
      clearTimeout(directTimer);
      document.removeEventListener("click", openDirectLink, true);
      document.removeEventListener("touchend", openDirectLink, true);
      if (document.body.contains(containerDiv)) {
        document.body.removeChild(containerDiv);
      }
    };
  }, []);

  return null;
}
