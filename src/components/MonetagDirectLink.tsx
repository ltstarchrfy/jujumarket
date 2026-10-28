"use client";

import { useEffect } from "react";

// Monetag Direct Link Ad (Zone 12128593)
// Opens direct ad link on user's first click (non-intrusive)
export default function MonetagDirectLink() {
  useEffect(() => {
    let opened = false;
    const DIRECT_URL = "https://uplcm.com/4/12128593";

    const openDirectLink = () => {
      if (opened) return;
      opened = true;

      try {
        // Open in new tab (non-intrusive)
        const win = window.open(DIRECT_URL, "_blank", "noopener,noreferrer");
        if (!win) {
          // Fallback: create hidden link and click
          const link = document.createElement("a");
          link.href = DIRECT_URL;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
          }, 1000);
        }
      } catch (e) {
        console.warn("Monetag direct link error:", e);
      }

      // Remove listener after first click
      document.removeEventListener("click", openDirectLink);
      document.removeEventListener("touchstart", openDirectLink);
    };

    // Wait a bit before attaching (let user interact with site first)
    const timer = setTimeout(() => {
      document.addEventListener("click", openDirectLink, { once: false });
      document.addEventListener("touchstart", openDirectLink, { once: false });
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", openDirectLink);
      document.removeEventListener("touchstart", openDirectLink);
    };
  }, []);

  return null;
}
