"use client";

import { useEffect } from "react";

// Register Monetag service worker
// Domain: 3nbf4.com, Zone ID: 12127771
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Wait for window load to avoid contention with other resources
      const register = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Monetag SW registered:", registration.scope);
          })
          .catch((err) => {
            console.warn("Monetag SW registration failed:", err);
          });
      };

      if (document.readyState === "complete") {
        register();
      } else {
        window.addEventListener("load", register, { once: true });
        return () => window.removeEventListener("load", register);
      }
    }
  }, []);

  return null;
}
