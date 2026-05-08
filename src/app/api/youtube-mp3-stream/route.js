/**
 * Server-side helper for the YouTube → WAV converter.
 *
 * Why this exists:
 *   The /api/youtube-mp3 endpoint returns a *third-party* CDN URL pointing
 *   at the converted MP3 (typically *.amazonaws.com or rapidapi-managed
 *   CDN). For the client-side AudioContext-based WAV transcoding we need
 *   to pull those bytes into the page; doing that with a direct fetch from
 *   the browser fails against most of the CDNs because they don't send
 *   permissive `Access-Control-Allow-Origin` headers. Bouncing the bytes
 *   through this same-origin route sidesteps the CORS check cleanly.
 *
 * Flow:
 *   POST { url } → 1) extracts videoId 2) calls the same RapidAPI MP3 host
 *   the existing route uses 3) streams the MP3 body straight back to the
 *   client with `audio/mpeg` and a few `X-…` metadata headers (title,
 *   duration, channel) the WAV client can read for display.
 */

const MP3_HOST = process.env.RAPIDAPI_MP3_HOST || 'youtube-mp36.p.rapidapi.com';

const VIDEO_ID_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const SHORTS_REGEX = /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/;

function extractVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const cleaned = url.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(cleaned)) return cleaned;
  const sm = cleaned.match(SHORTS_REGEX);
  if (sm) return sm[1];
  const m = cleaned.match(VIDEO_ID_REGEX);
  return m ? m[1] : null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getMp3DownloadUrl(videoId, apiKey) {
  // Tight retry budget — total wall-clock max ~5 s before we surface a
  // retryable error to the client. The user's "Try Again" button kicks off
  // a fresh round, so a long server-side retry loop only makes the UI feel
  // frozen with no progress feedback.
  const NETWORK_BACKOFF = [600, 1200];   // 429 / 5xx
  const PROCESSING_BACKOFF = [1500, 2000]; // upstream still encoding

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`https://${MP3_HOST}/dl?id=${encodeURIComponent(videoId)}`, {
      method: 'GET',
      headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': MP3_HOST },
    });

    if (!res.ok) {
      if ((res.status === 429 || res.status === 403 || res.status >= 500) && NETWORK_BACKOFF[attempt] != null) {
        await sleep(NETWORK_BACKOFF[attempt]);
        continue;
      }
      const err = new Error(`Upstream ${res.status}`);
      err.status = res.status;
      throw err;
    }

    const data = await res.json().catch(() => ({}));

    if (data.status === 'fail' || (data.msg && /not found|unavailable|private/i.test(data.msg))) {
      throw new Error(data.msg || 'Video is not available for conversion.');
    }

    if (data.status === 'processing' || (!data.link && data.progress !== undefined)) {
      if (PROCESSING_BACKOFF[attempt] == null) {
        // Out of budget — bail with a clean retryable error so the client
        // can show "Try Again" instead of leaving the user staring at a
        // spinner for another 10+ seconds.
        const e = new Error('YouTube source is still preparing. Please click "Try Again" in a few seconds.');
        e.status = 202;
        throw e;
      }
      await sleep(PROCESSING_BACKOFF[attempt]);
      continue;
    }

    if (!data.link) {
      throw new Error(data.msg || 'No download link returned.');
    }

    return {
      link: data.link,
      title: data.title || 'YouTube Audio',
      duration: data.duration || null,
      filesize: data.filesize || null,
    };
  }

  const e = new Error('YouTube source is still preparing. Please click "Try Again" in a few seconds.');
  e.status = 202;
  throw e;
}

// Strip non-ASCII characters before stuffing into a HTTP header (some upstream
// titles contain emoji/CJK characters which break header serialization).
function safeHeader(str) {
  if (!str) return '';
  return String(str).replace(/[^\x20-\x7E]/g, '').slice(0, 200);
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const url = body?.url;
  if (!url || typeof url !== 'string') {
    return Response.json({ error: 'Please provide a YouTube URL.' }, { status: 400 });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return Response.json({ error: 'Invalid YouTube URL.' }, { status: 400 });
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error: 'YouTube conversion service is not configured. The site owner needs to set the RAPIDAPI_KEY environment variable.',
        configError: true,
      },
      { status: 503 }
    );
  }

  let info;
  try {
    info = await getMp3DownloadUrl(videoId, apiKey);
  } catch (err) {
    const status = err?.status || 502;
    const isBlocked = status === 429 || status === 403 || /block|rate|limit/i.test(err?.message || '');
    const isProcessing = status === 202 || /preparing|processing/i.test(err?.message || '');
    return Response.json(
      {
        error: isBlocked
          ? 'YouTube briefly blocked this request. Please click "Try Again" in a few seconds.'
          : err?.message || 'Conversion failed.',
        retryable: true,
        processing: isProcessing,
      },
      { status: isBlocked ? 429 : isProcessing ? 202 : status }
    );
  }

  // Stream the MP3 bytes back to the browser as same-origin audio/mpeg so
  // that AudioContext.decodeAudioData() works without a CORS preflight.
  let upstream;
  try {
    upstream = await fetch(info.link);
  } catch (err) {
    return Response.json({ error: 'Failed to fetch the converted MP3 from CDN.', retryable: true }, { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    return Response.json({ error: `MP3 CDN returned ${upstream.status}. Please retry.`, retryable: true }, { status: 502 });
  }

  const headers = new Headers();
  headers.set('Content-Type', upstream.headers.get('content-type') || 'audio/mpeg');
  const len = upstream.headers.get('content-length');
  if (len) headers.set('Content-Length', len);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Video-Id', videoId);
  if (info.title) headers.set('X-Video-Title', encodeURIComponent(info.title));
  if (info.duration) headers.set('X-Video-Duration', safeHeader(String(info.duration)));
  // Allow the client to read these custom headers
  headers.set('Access-Control-Expose-Headers', 'X-Video-Id, X-Video-Title, X-Video-Duration');

  return new Response(upstream.body, { status: 200, headers });
}
