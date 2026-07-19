import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ─── Server-side shared download counter ──────────────────────────────
// All devices see the same count via /api/count. Never resets.
// When Firebase is configured, it uses Firebase Realtime Database.
// Otherwise, falls back to file-based storage with time-based auto-increment.

const DATA_FILE = path.join(process.cwd(), "download-count.json");
const START_COUNT = 2000;
const ANCHOR_MS = 1784451994147; // Anchor set so count starts at 2000
const INCREMENT_INTERVAL_MS = 8000; // +1 every 8 seconds

interface CountData {
  base: number;
  anchorMs: number;
  extraClicks: number;
}

function readData(): CountData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const d = JSON.parse(raw);
      return {
        base: d.base ?? START_COUNT,
        anchorMs: d.anchorMs ?? ANCHOR_MS,
        extraClicks: d.extraClicks ?? 0,
      };
    }
  } catch {}
  return { base: START_COUNT, anchorMs: ANCHOR_MS, extraClicks: 0 };
}

function writeData(d: CountData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(d), "utf-8");
  } catch {}
}

function getCurrentCount(d: CountData): number {
  const now = Date.now();
  const timeBased = Math.floor((now - d.anchorMs) / INCREMENT_INTERVAL_MS);
  return d.base + timeBased + d.extraClicks;
}

// GET /api/count — returns current count (file-based fallback)
export async function GET() {
  const data = readData();
  const count = getCurrentCount(data);
  return NextResponse.json({ count });
}

// POST /api/count — increment by clicks
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const add = typeof body.add === "number" && body.add > 0 ? body.add : 1;
    const data = readData();
    data.extraClicks += add;
    writeData(data);
    const count = getCurrentCount(data);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: START_COUNT }, { status: 400 });
  }
}
