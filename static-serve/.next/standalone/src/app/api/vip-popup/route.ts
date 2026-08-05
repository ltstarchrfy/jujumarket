import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  // Try multiple possible paths for the image
  const possiblePaths = [
    join(process.cwd(), "public", "vip-popup.png"),
    join(process.cwd(), "..", "..", "public", "vip-popup.png"),
    join(process.cwd(), "..", "..", "static-serve", "public", "vip-popup.png"),
    "/home/z/my-project/public/vip-popup.png",
    "/home/z/my-project/upload/pasted_image_1785674820901.png",
  ];

  for (const imagePath of possiblePaths) {
    try {
      if (existsSync(imagePath)) {
        const imageBuffer = readFileSync(imagePath);
        return new NextResponse(imageBuffer, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=86400, immutable",
          },
        });
      }
    } catch {
      // continue to next path
    }
  }

  return new NextResponse("Not Found", { status: 404 });
}
