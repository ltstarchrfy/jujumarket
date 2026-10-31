"use client";

import { useEffect } from "react";

// Register Monetag service worker
// iOS Safari requires explicit scope + HTTPS (Vercel provides HTTPS)
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const register = () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("Monetag SW registered:", registration.scope);
          })
          .catch((err) => {
            console.warn("Monetag SW registration failed:", err);
          });
      };

      // Register after window load to avoid contention
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
