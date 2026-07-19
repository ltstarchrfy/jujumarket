import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ─── Shared download counter stored on server ────────────────────────
// All devices see the same count. Never resets.
// Auto-increments based on time (+1 every ~8 seconds since anchor).

const DATA_FILE = path.join(process.cwd(), "download-count.json");
const START_COUNT = 2000;
const ANCHOR_MS = 1784451994147; // Anchor set so count starts at 2000
const INCREMENT_INTERVAL_MS = 8000; // +1 every 8 seconds

interface CountData {
  base: number;          // START_COUNT
  anchorMs: number;      // timestamp anchor
  extraClicks: number;   // manual increments from users clicking
  lastUpdateMs: number;  // last time we synced extraClicks with time
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
        lastUpdateMs: d.lastUpdateMs ?? Date.now(),
      };
    }
  } catch {}
  return {
    base: START_COUNT,
    anchorMs: ANCHOR_MS,
    extraClicks: 0,
    lastUpdateMs: Date.now(),
  };
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

// GET /api/count — returns current count
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
    data.lastUpdateMs = Date.now();
    writeData(data);
    const count = getCurrentCount(data);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 }, { status: 400 });
  }
}
