import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDemoAstuteProject2025KeyReplaceMe",
  authDomain: "astute-download-counter.firebaseapp.com",
  databaseURL: "https://astute-download-counter-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "astute-download-counter",
  storageBucket: "astute-download-counter.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:astute2025downloadcounter",
};

// Only initialize once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export { db };
