import { NextResponse } from "next/server";

// ─── Download Counter API ──────────────────────────────────────────────
// Uses Firebase Realtime Database REST API (no admin SDK needed, works on Vercel)
// Falls back to time-based mock if Firebase fails

const FIREBASE_DB_URL = "https://jujumarket-default-rtdb.asia-southeast1.firebasedatabase.app";
const COUNT_PATH = `${FIREBASE_DB_URL}/downloadCount.json`;

const START_COUNT = 2000;
const ANCHOR_MS = 1784451994147;
const INCREMENT_INTERVAL_MS = 8000;

function getTimeBasedCount(): number {
  const now = Date.now();
  return START_COUNT + Math.floor((now - ANCHOR_MS) / INCREMENT_INTERVAL_MS);
}

async function getFirebaseCount(): Promise<number | null> {
  try {
    const res = await fetch(COUNT_PATH, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data === "number") return data;
    return null;
  } catch {
    return null;
  }
}

async function incrementFirebase(add: number): Promise<number | null> {
  try {
    // Get current value
    const current = await getFirebaseCount();
    const newValue = (current ?? START_COUNT) + add;
    // Update via PUT
    const res = await fetch(COUNT_PATH, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newValue),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return newValue;
  } catch {
    return null;
  }
}

// GET /api/count — returns current count
export async function GET() {
  const fbCount = await getFirebaseCount();
  const count = fbCount ?? getTimeBasedCount();
  return NextResponse.json({ count, source: fbCount !== null ? "firebase" : "time-based" });
}

// POST /api/count — increment by clicks
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const add = typeof body.add === "number" && body.add > 0 ? body.add : 1;
    const newCount = await incrementFirebase(add);
    const count = newCount ?? getTimeBasedCount();
    return NextResponse.json({ count, source: newCount !== null ? "firebase" : "time-based" });
  } catch {
    return NextResponse.json({ count: getTimeBasedCount(), source: "time-based" }, { status: 200 });
  }
}
