import { NextResponse } from "next/server";

// ─── Mediafire Direct Download URL Extractor ───────────────────────────
// Scrapes Mediafire page to extract direct download URL (downloadXXX.mediafire.com)
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

    // Multiple patterns to extract direct URL (Mediafire changes structure sometimes)
    const patterns = [
      /href="(https:\/\/download\d+\.mediafire\.com\/[^"]+)"/i,
      /href='(https:\/\/download\d+\.mediafire\.com\/[^']+)'/i,
      /(https:\/\/download\d+\.mediafire\.com\/[^"'\s<>]+)/i,
      /"download_link":"(https:[^"]+)"/i,
      /'download_link':'(https:[^']+)'/i,
      /download_url["'\s:=]+["'](https:\/\/download[^"']+)/i,
    ];

    let directUrl: string | null = null;
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        directUrl = match[1];
        // Unescape if needed
        directUrl = directUrl.replace(/\\\//g, "/").replace(/&amp;/g, "&");
        break;
      }
    }

    if (!directUrl) return null;

    // Extract filename from page title or filename div
    let filename = "download";
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      filename = titleMatch[1].trim()
        .replace(/\s*-\s*MediaFire\s*$/i, "")
        .replace(/\s*MediaFire\s*$/i, "")
        .replace(/\|.*/, "")
        .trim();
    }
    const filenameDivMatch = html.match(/<div class="filename"[^>]*>([^<]+)<\/div>/i);
    if (filenameDivMatch) {
      filename = filenameDivMatch[1].trim();
    }
    if (!filename) filename = "download";

    // Extract file size
    let size = "Unknown";
    const sizeMatch = html.match(/<div class="filesize"[^>]*>([^<]+)<\/div>/i)
      || html.match(/([\d.]+\s*[KMGT]B)/i);
    if (sizeMatch) {
      size = sizeMatch[1].trim();
    }

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
      success: false,
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
