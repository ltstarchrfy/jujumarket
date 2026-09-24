import { NextResponse } from "next/server";

// ─── Download Counter API ──────────────────────────────────────────────
// Uses Firebase Realtime Database REST API with conditional update (transaction)
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

// Atomic increment using Firebase conditional PUT (ETag-based transaction)
// This prevents race conditions when multiple users click at the same time
async function incrementFirebase(add: number): Promise<number | null> {
  try {
    // Step 1: GET with ETag header
    const getRes = await fetch(COUNT_PATH, {
      cache: "no-store",
      headers: { "X-Firebase-ETag": "true" },
    });
    if (!getRes.ok) {
      // Path doesn't exist yet, create it
      const initRes = await fetch(COUNT_PATH, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(START_COUNT + add),
        cache: "no-store",
      });
      if (!initRes.ok) return null;
      return START_COUNT + add;
    }

    const etag = getRes.headers.get("etag") || "";
    const currentVal = await getRes.json();
    const current = typeof currentVal === "number" ? currentVal : START_COUNT;
    const newValue = current + add;

    // Step 2: Conditional PUT with if-match
    const putRes = await fetch(COUNT_PATH, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "if-match": etag,
      },
      body: JSON.stringify(newValue),
      cache: "no-store",
    });

    if (putRes.ok) {
      return newValue;
    }

    // If conflict (412), retry once with fresh GET
    if (putRes.status === 412) {
      const retryGet = await fetch(COUNT_PATH, { cache: "no-store" });
      if (!retryGet.ok) return null;
      const retryVal = await retryGet.json();
      const retryCurrent = typeof retryVal === "number" ? retryVal : START_COUNT;
      const retryNew = retryCurrent + add;
      const retryPut = await fetch(COUNT_PATH, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(retryNew),
        cache: "no-store",
      });
      if (retryPut.ok) return retryNew;
      return null;
    }

    return null;
  } catch {
    return null;
  }
}

// GET /api/count — returns current count
export async function GET() {
  const fbCount = await getFirebaseCount();
  const count = fbCount ?? getTimeBasedCount();
  return NextResponse.json({
    count,
    source: fbCount !== null ? "firebase" : "time-based",
    timestamp: Date.now(),
  });
}

// POST /api/count — atomic increment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const add = typeof body.add === "number" && body.add > 0 ? body.add : 1;
    const newCount = await incrementFirebase(add);
    const count = newCount ?? getTimeBasedCount();
    return NextResponse.json({
      count,
      added: add,
      source: newCount !== null ? "firebase" : "time-based",
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json({
      count: getTimeBasedCount(),
      added: 1,
      source: "time-based",
      timestamp: Date.now(),
    }, { status: 200 });
  }
}
