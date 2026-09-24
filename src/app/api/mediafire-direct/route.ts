import { NextResponse } from "next/server";

// ─── Mediafire Direct Download API ─────────────────────────────────────
// Scrapes Mediafire page to extract direct download URL
// Returns the direct URL so client can trigger download without leaving web

interface MediafireInfo {
  directUrl: string;
  filename: string;
  size: string;
}

async function scrapeMediafire(mediafireUrl: string): Promise<MediafireInfo | null> {
  try {
    const res = await fetch(mediafireUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      cache: "no-store",
    });

    if (!res.ok) return null;
    const html = await res.text();

    // Extract direct download URL from Mediafire page
    const directMatch = html.match(/href="(https:\/\/download[^"]+)"/i);
    const altDirectMatch = html.match(/(https:\/\/download\d+\.mediafire\.com\/[^"'\s<>]+)/i);
    const metaMatch = html.match(/content="(https:\/\/download[^"]+)"/i);

    const directUrl = directMatch?.[1] || altDirectMatch?.[1] || metaMatch?.[1];
    if (!directUrl) return null;

    // Extract filename
    const filenameMatch = html.match(/<div class="filename"[^>]*>([^<]+)<\/div>/i)
      || html.match(/<title>([^<]+)<\/title>/i);
    const filename = filenameMatch?.[1]?.trim() || "download";

    // Extract file size
    const sizeMatch = html.match(/<div class="filesize"[^>]*>([^<]+)<\/div>/i)
      || html.match(/([\d.]+\s*[KMGT]B)/i);
    const size = sizeMatch?.[1]?.trim() || "Unknown";

    return { directUrl, filename, size };
  } catch (e) {
    console.warn("Mediafire scrape error:", e);
    return null;
  }
}

// GET /api/mediafire-direct?url=https://www.mediafire.com/file/xxx/file
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || !url.includes("mediafire.com")) {
    return NextResponse.json({ error: "Invalid Mediafire URL" }, { status: 400 });
  }

  const info = await scrapeMediafire(url);
  if (!info) {
    return NextResponse.json({
      error: "Failed to extract direct link",
      fallback: url,
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    directUrl: info.directUrl,
    filename: info.filename,
    size: info.size,
    originalUrl: url,
    timestamp: Date.now(),
  });
}
