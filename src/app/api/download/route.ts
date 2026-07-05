import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

function getDataFile() {
  return path.join(process.cwd(), "data", "download-count.json");
}

const INITIAL_DATA = { total: 0, ff64: 0, ff32: 0, json: 0 };

async function readData(): Promise<Record<string, number>> {
  const filePath = getDataFile();
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    try {
      const raw = await readFile("/tmp/juju-download-count.json", "utf-8");
      return JSON.parse(raw);
    } catch {
      return { ...INITIAL_DATA };
    }
  }
}

async function writeData(data: Record<string, number>) {
  const filePath = getDataFile();
  const content = JSON.stringify(data, null, 2);
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf-8");
  } catch {
    try {
      await writeFile("/tmp/juju-download-count.json", content, "utf-8");
    } catch {}
  }
}

// ─── GET /api/download — get current count ────────────────────────────────
export async function GET() {
  const data = await readData();
  return NextResponse.json({ success: true, count: data.total || 0, items: data });
}

// ─── POST /api/download — increment counter (+1) ─────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const itemName = body.item || "total";

    // Read current data
    const data = await readData();

    // Increment the specific download item
    if (itemName !== "total") {
      data[itemName] = (data[itemName] || 0) + 1;
    }

    // Always increment total by exactly 1
    data.total = (data.total || 0) + 1;

    // Save to file
    await writeData(data);

    return NextResponse.json({
      success: true,
      count: data[itemName] || 0,
      item: itemName,
      total: data.total,
    });
  } catch (error: any) {
    console.error("Download increment error:", error?.message || error);
    return NextResponse.json({ success: false, error: error?.message || "Unknown error" }, { status: 500 });
  }
}
