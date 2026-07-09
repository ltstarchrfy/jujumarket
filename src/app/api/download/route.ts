import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, count: 0, items: {} });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true, count: 0, item: "total", total: 0 });
}
