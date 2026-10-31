"use client";

import { useEffect } from "react";

// Monetag Direct Link Ad (Zone 12154476)
// iOS-friendly: use synchronous <a> tag click instead of window.open
export default function MonetagDirectLink() {
  useEffect(() => {
    let opened = false;
    const DIRECT_URL = "https://uplcm.com/4/12154476";

    const openDirectLink = (e: Event) => {
      if (opened) return;
      opened = true;

      try {
        // Create synchronous <a> element and click — works on iOS Safari
        const link = document.createElement("a");
        link.href = DIRECT_URL;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.display = "none";
        document.body.appendChild(link);
        // Synchronous click — within user gesture event
        link.click();
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 1000);
      } catch (err) {
        console.warn("Monetag direct link error:", err);
      }

      document.removeEventListener("click", openDirectLink, true);
      document.removeEventListener("touchend", openDirectLink, true);
    };

    // Wait 2.5s before listening (let user interact with site first)
    const timer = setTimeout(() => {
      // Use capture phase + touchend for iOS (more reliable than click)
      document.addEventListener("click", openDirectLink, true);
      document.addEventListener("touchend", openDirectLink, true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", openDirectLink, true);
      document.removeEventListener("touchend", openDirectLink, true);
    };
  }, []);

  return null;
}
