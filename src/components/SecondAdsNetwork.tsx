"use client";

import { useEffect } from "react";

// Second Ad Network Integration (ardance/bellnewyork/accountut)
// Multiple ad formats: direct link, iframe banner, display ads
// This is SEPARATE from Monetag — both run together
export default function SecondAdsNetwork() {
  useEffect(() => {
    // === 1. Direct Link Ad (ardance.org) — open on first click after 3s ===
    let directOpened = false;
    const DIRECT_URL = "https://ardance.org/4/c0b200879ae90d4f15083070772a7f1e";

    const openDirectLink = () => {
      if (directOpened) return;
      directOpened = true;
      try {
        const win = window.open(DIRECT_URL, "_blank", "noopener,noreferrer");
        if (!win) {
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
        }
      } catch (e) {
        console.warn("SecondAds direct link error:", e);
      }
      document.removeEventListener("click", openDirectLink);
      document.removeEventListener("touchstart", openDirectLink);
    };

    const directTimer = setTimeout(() => {
      document.addEventListener("click", openDirectLink);
      document.addEventListener("touchstart", openDirectLink);
    }, 3000);

    // === 2. Inject async ad scripts (bellnewyork.org + accountut.com) ===
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

    // bellnewyork.org/21
    injectScript("https://bellnewyork.org/21/e77eee0b028422bbef17fb9b19960788");
    // accountut.com/1
    injectScript("https://accountut.com/1/2f3d7536a272f99cde7250907c023498", false);
    // bellnewyork.org/14
    injectScript("https://bellnewyork.org/14/bab1c85f04544aebe45cc4f763b18642", false);

    // === 3. Banner ad container (bellnewyork.org/21) ===
    const containerDiv = document.createElement("div");
    containerDiv.id = "container-e77eee0b028422bbef17fb9b19960788";
    containerDiv.style.cssText = "position:fixed;bottom:0;left:0;right:0;z-index:99998;pointer-events:auto;max-height:60px;overflow:hidden;";
    document.body.appendChild(containerDiv);

    // === 4. atOptions Banner 1 (160x300 sidebar) ===
    try {
      (window as any).atOptions = {
        'key': '71992caacbb5883a246d05cf34f9e4f7',
        'format': 'iframe',
        'height': 300,
        'width': 160,
        'params': {}
      };
      const s1 = document.createElement("script");
      s1.src = "https://bellnewyork.org/22/71992caacbb5883a246d05cf34f9e4f7";
      s1.setAttribute("data-cfasync", "false");
      document.head.appendChild(s1);
    } catch (e) {
      console.warn("atOptions1 error:", e);
    }

    // === 5. atOptions Banner 2 (728x90 leaderboard) ===
    try {
      (window as any).atOptions = {
        'key': '9193fdcf2c0921abb96383d7c0ff9164',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
      };
      const s2 = document.createElement("script");
      s2.src = "https://bellnewyork.org/22/9193fdcf2c0921abb96383d7c0ff9164";
      s2.setAttribute("data-cfasync", "false");
      document.head.appendChild(s2);
    } catch (e) {
      console.warn("atOptions2 error:", e);
    }

    return () => {
      clearTimeout(directTimer);
      document.removeEventListener("click", openDirectLink);
      document.removeEventListener("touchstart", openDirectLink);
      if (document.body.contains(containerDiv)) {
        document.body.removeChild(containerDiv);
      }
    };
  }, []);

  return null;
}
