import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  const imagePath = join(process.cwd(), "public", "vip-popup.png");
  
  if (!existsSync(imagePath)) {
    return new NextResponse("Not Found", { status: 404 });
  }
  
  const imageBuffer = readFileSync(imagePath);
  
  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
