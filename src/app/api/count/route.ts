import { NextResponse } from "next/server";

// ─── Download Counter API (Firebase Realtime Database) ─────────────────
// Atomic increment with ETag-based conditional update
// Retry mechanism for race conditions
// Works on Vercel (serverless) — no admin SDK needed

const FIREBASE_DB_URL = "https://jujumarket-default-rtdb.asia-southeast1.firebasedatabase.app";
const COUNT_PATH = `${FIREBASE_DB_URL}/downloadCount.json`;

const START_COUNT = 5000;
const MAX_RETRIES = 5;

async function getFirebaseCount(): Promise<{ count: number | null; etag: string | null }> {
  try {
    const res = await fetch(COUNT_PATH, {
      cache: "no-store",
      headers: { "X-Firebase-ETag": "true" },
    });
    if (!res.ok) return { count: null, etag: null };
    const data = await res.json();
    const etag = res.headers.get("etag");
    return {
      count: typeof data === "number" ? data : null,
      etag,
    };
  } catch {
    return { count: null, etag: null };
  }
}

async function setFirebaseCount(value: number, etag?: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (etag) headers["if-match"] = etag;

    const res = await fetch(COUNT_PATH, {
      method: "PUT",
      headers,
      body: JSON.stringify(value),
      cache: "no-store",
    });

    if (res.ok) return true;

    // 412 = precondition failed (someone updated first) — caller should retry
    if (res.status === 412) return false;

    // 401 = permission denied (rules issue)
    if (res.status === 401) {
      console.warn("Firebase permission denied — check rules");
    }

    return false;
  } catch (e) {
    console.warn("Firebase PUT error:", e);
    return false;
  }
}

// Atomic increment with retry on conflict
async function incrementFirebase(add: number): Promise<number | null> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Step 1: Get current value + ETag
      const { count: current, etag } = await getFirebaseCount();

      let baseValue: number;
      let useEtag: string | undefined;

      if (current === null) {
        // Path doesn't exist or invalid — initialize
        baseValue = START_COUNT;
        // No ETag for new path
      } else {
        baseValue = current;
        useEtag = etag || undefined;
      }

      const newValue = baseValue + add;

      // Step 2: Try conditional update
      const success = await setFirebaseCount(newValue, useEtag);
      if (success) return newValue;

      // Conflict — wait and retry
      await new Promise(resolve => setTimeout(resolve, 50 * (attempt + 1)));
    } catch (e) {
      console.warn(`Increment attempt ${attempt + 1} failed:`, e);
      await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
    }
  }

  // All retries failed — return current count as fallback
  const { count } = await getFirebaseCount();
  return count;
}

// GET /api/count — returns current Firebase count
export async function GET() {
  const { count } = await getFirebaseCount();
  return NextResponse.json({
    count: count ?? START_COUNT,
    source: count !== null ? "firebase" : "fallback",
    timestamp: Date.now(),
  });
}

// POST /api/count — atomic increment
export async function POST(request: Request) {
  let add = 1;
  try {
    const body = await request.json();
    if (typeof body.add === "number" && body.add > 0) {
      add = body.add;
    }
  } catch {
    // Body parsing failed — use default add = 1
  }

  const newCount = await incrementFirebase(add);
  return NextResponse.json({
    count: newCount ?? START_COUNT,
    added: add,
    source: newCount !== null ? "firebase" : "fallback",
    timestamp: Date.now(),
  });
}
