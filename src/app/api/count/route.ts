import { NextResponse } from "next/server";

// ─── Download Counter API (Firebase Realtime Database) ─────────────────
// Uses Firebase REST API with conditional update (transaction-safe)
// Works on Vercel (no admin SDK needed, no filesystem)

const FIREBASE_DB_URL = "https://jujumarket-default-rtdb.asia-southeast1.firebasedatabase.app";
const COUNT_PATH = `${FIREBASE_DB_URL}/downloadCount.json`;

const START_COUNT = 2000;

async function getFirebaseCount(): Promise<number | null> {
  try {
    const res = await fetch(COUNT_PATH, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data === "number" ? data : null;
  } catch {
    return null;
  }
}

// Atomic increment using Firebase REST conditional update with ETag
// This prevents race conditions when multiple users click simultaneously
async function incrementFirebase(add: number): Promise<number | null> {
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Step 1: GET with ETag
      const getRes = await fetch(COUNT_PATH, {
        cache: "no-store",
        headers: { "X-Firebase-ETag": "true" },
      });

      let currentVal: number;
      let etag: string;

      if (getRes.status === 200) {
        const data = await getRes.json();
        if (typeof data !== "number") {
          // Path exists but not a number — overwrite
          currentVal = START_COUNT;
        } else {
          currentVal = data;
        }
        etag = getRes.headers.get("etag") || "";
      } else if (getRes.status === 404) {
        // Path doesn't exist — create it
        const initRes = await fetch(COUNT_PATH, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(START_COUNT + add),
          cache: "no-store",
        });
        if (initRes.ok) return START_COUNT + add;
        continue;
      } else {
        continue;
      }

      const newValue = currentVal + add;

      // Step 2: Conditional PUT (only if ETag matches)
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

      // 412 = precondition failed (someone else updated first), retry
      if (putRes.status === 412) {
        continue;
      }

      // Other error — try plain PUT without condition
      const plainPut = await fetch(COUNT_PATH, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newValue),
        cache: "no-store",
      });
      if (plainPut.ok) return newValue;
      break;
    } catch (e) {
      console.warn(`Increment attempt ${attempt + 1} failed:`, e);
      // Wait a bit before retry
      await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
    }
  }

  return null;
}

// GET /api/count — returns current Firebase count
export async function GET() {
  const count = await getFirebaseCount();
  if (count !== null) {
    return NextResponse.json({
      count,
      source: "firebase",
      timestamp: Date.now(),
    });
  }
  // Fallback to START_COUNT if Firebase unavailable
  return NextResponse.json({
    count: START_COUNT,
    source: "fallback",
    timestamp: Date.now(),
  });
}

// POST /api/count — atomic increment via Firebase REST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const add = typeof body.add === "number" && body.add > 0 ? body.add : 1;

    const newCount = await incrementFirebase(add);
    if (newCount !== null) {
      return NextResponse.json({
        count: newCount,
        added: add,
        source: "firebase",
        timestamp: Date.now(),
      });
    }

    // Fallback: at least return current count
    const currentCount = await getFirebaseCount();
    return NextResponse.json({
      count: currentCount ?? START_COUNT,
      added: add,
      source: currentCount !== null ? "firebase-read-only" : "fallback",
      timestamp: Date.now(),
    });
  } catch (e) {
    return NextResponse.json({
      count: START_COUNT,
      added: 1,
      source: "error",
      error: String(e),
      timestamp: Date.now(),
    }, { status: 200 });
  }
}
