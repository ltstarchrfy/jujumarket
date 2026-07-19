// ─── Firebase Realtime Database Configuration ────────────────────────
// Shared counter — all devices see the same number in real-time
//
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project called "astute-juju-counter"
// 3. Go to Build > Realtime Database > Create Database
// 4. Choose "Start in test mode" and location asia-southeast1
// 5. Go to Project Settings > General > Your apps > Add Web App
// 6. Copy the config values into .env.local:
//
//    NEXT_PUBLIC_USE_FIREBASE=true
//    NEXT_PUBLIC_FB_API_KEY=your-api-key
//    NEXT_PUBLIC_FB_AUTH_DOMAIN=your-project.firebaseapp.com
//    NEXT_PUBLIC_FB_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
//    NEXT_PUBLIC_FB_PROJECT_ID=your-project-id
//    NEXT_PUBLIC_FB_STORAGE_BUCKET=your-project.firebasestorage.app
//    NEXT_PUBLIC_FB_MESSAGING_SENDER_ID=your-sender-id
//    NEXT_PUBLIC_FB_APP_ID=your-app-id
//
// 7. In Realtime Database > Rules, set:
//    { "rules": { "downloadCount": { ".read": true, ".write": true } } }
//
// Without Firebase, the counter uses the server API as fallback (still shared across devices)

const USE_FIREBASE = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_FIREBASE === "true";

let firebaseDb: any = null;

if (USE_FIREBASE) {
  try {
    const { initializeApp } = require("firebase/app");
    const { getDatabase } = require("firebase/database");

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FB_API_KEY || "",
      authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN || "",
      databaseURL: process.env.NEXT_PUBLIC_FB_DATABASE_URL || "",
      projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID || "",
      storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FB_APP_ID || "",
    };

    if (firebaseConfig.databaseURL) {
      const app = initializeApp(firebaseConfig);
      firebaseDb = getDatabase(app);
    }
  } catch (e) {
    console.warn("Firebase not available, using API fallback");
  }
}

export const isFirebaseEnabled = USE_FIREBASE && firebaseDb !== null;
export const db = firebaseDb;
