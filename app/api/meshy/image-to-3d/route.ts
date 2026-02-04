import { NextRequest, NextResponse } from 'next/server';

// Meshy API v1 endpoint (v2 is multi-image only)
const MESHY_API = 'https://api.meshy.ai/openapi/v1/image-to-3d';

export async function POST(request: NextRequest) {
  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Meshy API key not configured. Add MESHY_API_KEY to .env.local.' },
      { status: 503 }
    );
  }

  let body: { image_url: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { image_url } = body;
  if (!image_url || typeof image_url !== 'string') {
    return NextResponse.json(
      { error: 'image_url (data URI or public URL) is required' },
      { status: 400 }
    );
  }

  // Retry logic for reliability
  const MAX_RETRIES = 2;
  let lastError: string = '';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Meshy] Attempt ${attempt + 1}/${MAX_RETRIES + 1} - Creating task...`);
      
      const res = await fetch(MESHY_API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url,
          // Use Meshy-6 (latest) for best quality
          ai_model: 'meshy-6',
          // High detail mode
          model_type: 'standard',
          // Higher poly count for detailed scenes (max 300k)
          target_polycount: 50000,
          // Quad topology for better mesh quality
          topology: 'quad',
          // Full texturing with PBR
          should_texture: true,
          enable_pbr: true,
          // Auto symmetry detection
          symmetry_mode: 'auto',
        }),
        signal: AbortSignal.timeout(90000), // 90 second timeout
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        lastError = data?.detail?.msg ?? data?.detail ?? data?.message ?? data?.error ?? res.statusText;
        console.error(`[Meshy] API error (attempt ${attempt + 1}):`, lastError);
        
        // Don't retry on client errors (4xx)
        if (res.status < 500) {
          return NextResponse.json(
            { error: typeof lastError === 'string' ? lastError : 'Meshy API error' },
            { status: res.status }
          );
        }
        
        // Retry on server errors (5xx)
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); // Exponential backoff
          continue;
        }
      }

      const taskId = data?.result ?? data?.id ?? data?.task_id;
      if (!taskId || typeof taskId !== 'string') {
        console.error('[Meshy] No task ID in response:', data);
        lastError = 'No task ID in Meshy response';
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        return NextResponse.json(
          { error: 'No task ID returned. Try a different image.' },
          { status: 502 }
        );
      }

      console.log(`[Meshy] Task created successfully: ${taskId}`);
      return NextResponse.json({ taskId });
      
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Meshy request failed';
      console.error(`[Meshy] Request error (attempt ${attempt + 1}):`, lastError);
      
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
    }
  }

  return NextResponse.json({ error: lastError || 'Meshy request failed after retries' }, { status: 502 });
}
