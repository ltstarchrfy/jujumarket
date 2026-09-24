import { NextResponse } from "next/server";

// ─── Mediafire Streaming Download API ──────────────────────────────────
// Downloads file server-side, streams to client with Content-Disposition: attachment
// Browser triggers download WITHOUT navigating away

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

    const directMatch = html.match(/href="(https:\/\/download[^"]+)"/i);
    const altDirectMatch = html.match(/(https:\/\/download\d+\.mediafire\.com\/[^"'\s<>]+)/i);
    const metaMatch = html.match(/content="(https:\/\/download[^"]+)"/i);

    const directUrl = directMatch?.[1] || altDirectMatch?.[1] || metaMatch?.[1];
    if (!directUrl) return null;

    const filenameMatch = html.match(/<div class="filename"[^>]*>([^<]+)<\/div>/i)
      || html.match(/<title>([^<]+)<\/title>/i);
    let filename = filenameMatch?.[1]?.trim() || "download";
    filename = filename.replace(/\s*-\s*MediaFire\s*$/i, "").replace(/\s*MediaFire\s*$/i, "").trim();
    if (!filename) filename = "download";

    const sizeMatch = html.match(/<div class="filesize"[^>]*>([^<]+)<\/div>/i)
      || html.match(/([\d.]+\s*[KMGT]B)/i);
    const size = sizeMatch?.[1]?.trim() || "Unknown";

    return { directUrl, filename, size };
  } catch (e) {
    console.warn("Mediafire scrape error:", e);
    return null;
  }
}

// GET /api/mediafire-download?url=...
// Streams the file directly with attachment headers - browser downloads without navigating
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || !url.includes("mediafire.com")) {
    return NextResponse.json({ error: "Invalid Mediafire URL" }, { status: 400 });
  }

  const info = await scrapeMediafire(url);
  if (!info) {
    return NextResponse.json({ error: "Failed to extract direct link", fallback: url }, { status: 404 });
  }

  try {
    const fileRes = await fetch(info.directUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept": "*/*",
        "Referer": "https://www.mediafire.com/",
      },
      redirect: "follow",
      cache: "no-store",
    });

    if (!fileRes.ok) {
      return NextResponse.json({ error: `Failed: ${fileRes.status}`, fallback: url }, { status: 502 });
    }

    const contentType = fileRes.headers.get("content-type") || "application/octet-stream";
    const contentLength = fileRes.headers.get("content-length");
    const fileBuffer = await fileRes.arrayBuffer();

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${info.filename.replace(/"/g, '\\"')}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    };
    if (contentLength) headers["Content-Length"] = contentLength;

    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (e) {
    console.warn("File download error:", e);
    return NextResponse.json({ error: "Failed to stream file", fallback: url }, { status: 502 });
  }
}
