import { NextResponse } from "next/server";

// ─── Download Counter API (Firebase Realtime Database) ─────────────────
// +1 per unique device per click (with 2-second cooldown)
// Uses Firebase REST API with ETag-based atomic transaction
// Works on Vercel (serverless) — no admin SDK needed

const FIREBASE_DB_URL = "https://jujumarket-default-rtdb.asia-southeast1.firebasedatabase.app";
const COUNT_PATH = `${FIREBASE_DB_URL}/downloadCount.json`;
const LOG_PATH = `${FIREBASE_DB_URL}/downloadLog.json`;

const START_COUNT = 5000;
const MAX_RETRIES = 5;
const COOLDOWN_MS = 2000; // 2 seconds between increments per device

async function getFirebaseValue(path: string): Promise<{ value: any; etag: string | null }> {
  try {
    const res = await fetch(path, {
      cache: "no-store",
      headers: { "X-Firebase-ETag": "true" },
    });
    if (!res.ok) return { value: null, etag: null };
    const data = await res.json();
    return { value: data, etag: res.headers.get("etag") };
  } catch {
    return { value: null, etag: null };
  }
}

async function setFirebaseValue(path: string, value: any, etag?: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (etag) headers["if-match"] = etag;
    const res = await fetch(path, {
      method: "PUT",
      headers,
      body: JSON.stringify(value),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

// In-memory cooldown cache (per server instance, fast)
const deviceCooldown = new Map<string, number>();

// Check device cooldown — returns true if device can increment (not in cooldown)
function checkDeviceCooldownLocal(deviceId: string): boolean {
  const now = Date.now();
  const last = deviceCooldown.get(deviceId);
  if (last && (now - last) < COOLDOWN_MS) {
    return false; // Still in cooldown
  }
  return true;
}

function markDeviceLocal(deviceId: string): void {
  deviceCooldown.set(deviceId, Date.now());
  // Cleanup old entries every 1000 clicks to prevent memory leak
  if (deviceCooldown.size > 1000) {
    const cutoff = Date.now() - COOLDOWN_MS * 2;
    for (const [key, time] of deviceCooldown.entries()) {
      if (time < cutoff) deviceCooldown.delete(key);
    }
  }
}

// Atomic increment with retry on conflict
async function incrementFirebase(add: number): Promise<number | null> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const { value: current, etag } = await getFirebaseValue(COUNT_PATH);

      let baseValue: number;
      let useEtag: string | undefined;

      if (typeof current !== "number") {
        baseValue = START_COUNT;
      } else {
        baseValue = current;
        useEtag = etag || undefined;
      }

      const newValue = baseValue + add;
      const success = await setFirebaseValue(COUNT_PATH, newValue, useEtag);
      if (success) return newValue;

      // Conflict — wait and retry
      await new Promise(resolve => setTimeout(resolve, 50 * (attempt + 1)));
    } catch (e) {
      console.warn(`Increment attempt ${attempt + 1} failed:`, e);
      await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
    }
  }

  const { value } = await getFirebaseValue(COUNT_PATH);
  return typeof value === "number" ? value : null;
}

// Generate device ID from request (IP + User-Agent hash)
function getDeviceId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  // Simple hash
  const str = `${ip}-${ua}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return `d${Math.abs(hash).toString(36)}`;
}

// GET /api/count — returns current Firebase count
export async function GET() {
  const { value } = await getFirebaseValue(COUNT_PATH);
  return NextResponse.json({
    count: typeof value === "number" ? value : START_COUNT,
    source: typeof value === "number" ? "firebase" : "fallback",
    timestamp: Date.now(),
  });
}

// POST /api/count — atomic increment with device cooldown (+1 per device per 2 seconds)
export async function POST(request: Request) {
  let add = 1;
  try {
    const body = await request.json();
    if (typeof body.add === "number" && body.add > 0) {
      add = body.add;
    }
  } catch {}

  const deviceId = getDeviceId(request);

  // Check cooldown (local memory — fast, prevents double-click within 2 seconds)
  if (!checkDeviceCooldownLocal(deviceId)) {
    const { value } = await getFirebaseValue(COUNT_PATH);
    return NextResponse.json({
      count: typeof value === "number" ? value : START_COUNT,
      added: 0,
      source: "cooldown",
      reason: "Device in cooldown (anti-spam, 2s)",
      deviceId,
      timestamp: Date.now(),
    });
  }

  // Mark device immediately (before increment) to prevent race
  markDeviceLocal(deviceId);

  // Increment counter
  const newCount = await incrementFirebase(add);

  return NextResponse.json({
    count: newCount ?? START_COUNT,
    added: add,
    source: newCount !== null ? "firebase" : "fallback",
    deviceId,
    timestamp: Date.now(),
  });
}
