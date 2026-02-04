import { NextRequest, NextResponse } from 'next/server';

// Force dynamic to prevent caching of status polling
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Meshy API key not configured.' },
      { status: 503 }
    );
  }

  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'Task id required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.meshy.ai/openapi/v1/image-to-3d/${encodeURIComponent(id)}`,
      {
        headers: { 
          Authorization: `Bearer ${apiKey}`,
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store',
        next: { revalidate: 0 },
      }
    );

    const data = await res.json();
    
    // Log progress for debugging
    const status = data?.status || 'UNKNOWN';
    const progress = data?.progress ?? 0;
    console.log(`[Meshy Poll] ${id.slice(0, 8)}... Status: ${status}, Progress: ${progress}%`);

    if (!res.ok) {
      const message = data?.detail || data?.message || res.statusText;
      console.error(`[Meshy Poll] Error for ${id}:`, message);
      return NextResponse.json(
        { error: message || 'Meshy API error' },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    // Add helpful info to the response
    const response = {
      ...data,
      // Normalize status for client
      status: data.status || 'PENDING',
      progress: data.progress ?? 0,
      // Include model URLs if available
      model_urls: data.model_urls || null,
      // Include any error info
      task_error: data.task_error || null,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Meshy request failed';
    console.error(`[Meshy Poll] Exception for ${id}:`, message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
