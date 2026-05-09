import { NextResponse } from 'next/server';
import { verifyAndExtract } from '@/lib/instagram-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FORWARDED_REQUEST_HEADERS = ['range', 'if-range', 'accept', 'accept-encoding'];
const FORWARDED_RESPONSE_HEADERS = [
  'content-type',
  'content-length',
  'content-range',
  'accept-ranges',
  'last-modified',
  'etag',
];

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,video/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.instagram.com/',
  Origin: 'https://www.instagram.com',
};

function safeFilename(rawUrl, type) {
  try {
    const parsed = new URL(rawUrl);
    const last = parsed.pathname.split('/').filter(Boolean).pop() || 'instagram-media';
    const cleaned = last.split('?')[0].replace(/[^a-zA-Z0-9._-]+/g, '-');
    if (cleaned.includes('.')) return cleaned;
    if (type?.startsWith('video/')) return `${cleaned}.mp4`;
    if (type?.startsWith('image/')) return `${cleaned}.jpg`;
    return cleaned;
  } catch {
    return 'instagram-media';
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const result = verifyAndExtract(url.searchParams);

  if (!result.ok) {
    return new NextResponse(`Bad signature: ${result.error}`, { status: 400 });
  }

  const downloadFlag = url.searchParams.get('download') === '1';
  const upstreamHeaders = { ...BROWSER_HEADERS };
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const v = request.headers.get(name);
    if (v) upstreamHeaders[name] = v;
  }

  let upstream;
  try {
    upstream = await fetch(result.url, {
      method: 'GET',
      headers: upstreamHeaders,
      redirect: 'follow',
      cache: 'no-store',
    });
  } catch (err) {
    return new NextResponse(`Upstream fetch failed: ${err?.message || 'unknown'}`, {
      status: 502,
    });
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new NextResponse(`Upstream returned ${upstream.status}`, { status: upstream.status });
  }

  const headers = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const v = upstream.headers.get(name);
    if (v) headers.set(name, v);
  }
  headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  headers.set('X-Content-Type-Options', 'nosniff');

  if (downloadFlag) {
    const fname = safeFilename(result.url, headers.get('content-type'));
    headers.set('Content-Disposition', `attachment; filename="${fname}"`);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
