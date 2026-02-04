import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxies a Meshy GLB URL so the browser can load it same-origin (avoids CORS).
 * Frontend calls: /api/meshy/proxy-glb?url=<encoded-meshy-glb-url>
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'url query param required' }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  // Allow Meshy CDN domains
  const allowedHosts = ['meshy.ai', 'assets.meshy.ai', 'cdn.meshy.ai'];
  const isAllowed = allowedHosts.some(host => 
    targetUrl.hostname === host || targetUrl.hostname.endsWith(`.${host}`)
  );
  
  if (!isAllowed) {
    return NextResponse.json({ error: 'Only Meshy asset URLs are allowed' }, { status: 400 });
  }

  // Retry logic for reliability
  const MAX_RETRIES = 2;
  let lastError = '';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(targetUrl.toString(), {
        headers: { 
          Accept: 'model/gltf-binary,application/octet-stream,*/*',
          'User-Agent': 'Mozilla/5.0 (compatible; KitchenShowroom/1.0)',
        },
        signal: AbortSignal.timeout(60000), // 60 second timeout
      });
      
      if (!res.ok) {
        lastError = `Upstream returned ${res.status}`;
        if (res.status < 500 || attempt >= MAX_RETRIES) {
          return NextResponse.json(
            { error: lastError },
            { status: res.status >= 500 ? 502 : res.status }
          );
        }
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      
      const blob = await res.arrayBuffer();
      console.log(`[GLB Proxy] Successfully fetched ${(blob.byteLength / 1024 / 1024).toFixed(2)}MB`);
      
      return new NextResponse(blob, {
        headers: {
          'Content-Type': 'model/gltf-binary',
          'Cache-Control': 'public, max-age=3600',
          'Content-Length': blob.byteLength.toString(),
        },
      });
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Failed to fetch model';
      console.error(`[GLB Proxy] Attempt ${attempt + 1} failed:`, lastError);
      
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
    }
  }

  return NextResponse.json({ error: lastError }, { status: 502 });
}
