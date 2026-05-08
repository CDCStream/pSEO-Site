/**
 * Server-side helper for the YouTube → WAV converter.
 *
 * Why this exists:
 *   Both upstream sources we use (youtube-mp36 RapidAPI host and the
 *   ytstream MP4 host's audio-only adaptive streams) are CORS-restricted,
 *   so the browser can't fetch them directly. We act as a same-origin
 *   range proxy.
 *
 * Why range chunking:
 *   Streaming the full body through a single Vercel function invocation
 *   was hitting Vercel's ~30-second HTTP-proxy timeout for longer clips
 *   (504 Gateway Timeout). Splitting the file into 1-2 MB ranges keeps
 *   each function call short.
 *
 * Two endpoints, one route:
 *   POST { url }     → JSON metadata { link, sig, size, contentType,
 *                      title, duration, via, videoId }. Picks MP3 host
 *                      first, falls through to MP4 audio if the MP3
 *                      CDN serves 404. HMAC-signs the link.
 *   GET ?link=…&sig=…&start=N&end=M
 *                    → Verifies the HMAC, fetches the requested byte
 *                      range from upstream, streams it back. The sig
 *                      check makes sure this isn't an open proxy.
 */

const MP3_HOST = process.env.RAPIDAPI_MP3_HOST || 'youtube-mp36.p.rapidapi.com';
const MP4_HOST = process.env.RAPIDAPI_MP4_HOST || 'ytstream-download-youtube-videos.p.rapidapi.com';

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

/**
 * Fallback path: when the MP3 host's CDN serves a 404 for the converted file,
 * pull the audio out of the MP4 extraction host instead. YouTube's adaptive
 * formats include audio-only streams (AAC in m4a, or Opus in WebM) that the
 * browser's AudioContext.decodeAudioData() accepts without modification. This
 * is what saves us when youtube-mp36 returns a stale/dead link — common on
 * music videos accessed via "&list=RD…" YouTube Music radio links.
 */
async function getAudioFromMp4Host(videoId, apiKey) {
  const res = await fetch(`https://${MP4_HOST}/dl?id=${encodeURIComponent(videoId)}`, {
    method: 'GET',
    headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': MP4_HOST },
  });
  if (!res.ok) {
    const e = new Error(`MP4 host returned ${res.status}`);
    e.status = res.status;
    throw e;
  }
  const data = await res.json().catch(() => ({}));
  if (data.status === 'fail' || data.errorId) {
    throw new Error(data.reason || data.msg || 'Video is not available for download.');
  }

  const adaptive = Array.isArray(data.adaptiveFormats) ? data.adaptiveFormats : [];
  // Pick all audio-only adaptive streams (mimeType starts with "audio/").
  const audioOnly = adaptive.filter(
    (f) => f && f.url && (f.mimeType || '').toLowerCase().startsWith('audio/')
  );
  if (audioOnly.length === 0) {
    throw new Error('No audio-only stream available for this video.');
  }
  // Prefer the highest bitrate; AAC (audio/mp4) generally decodes more
  // reliably across browsers than Opus, so use it as a tiebreaker.
  audioOnly.sort((a, b) => {
    const aac = (m) => /audio\/mp4/i.test(m || '') ? 1 : 0;
    const bitDiff = (b.bitrate || 0) - (a.bitrate || 0);
    if (bitDiff !== 0) return bitDiff;
    return aac(b.mimeType) - aac(a.mimeType);
  });
  const best = audioOnly[0];

  const seconds = parseInt(data.lengthSeconds, 10);
  const duration = Number.isFinite(seconds)
    ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
    : null;

  return {
    link: best.url,
    title: data.title || 'YouTube Audio',
    duration,
    contentType: (best.mimeType || 'audio/mp4').split(';')[0].trim(),
    via: 'mp4-adaptive',
  };
}

/**
 * Try once at the given upstream link. Returns the upstream Response on 200,
 * null on a CDN miss (404/410), throws on anything else worth surfacing.
 */
async function tryStream(link) {
  let upstream;
  try {
    upstream = await fetch(link);
  } catch {
    return null;
  }
  if (upstream.ok && upstream.body) return upstream;
  if (upstream.status === 404 || upstream.status === 410) return null;
  // Any other status (5xx, etc.) — drain and treat as a miss.
  try { await upstream.body?.cancel(); } catch { /* ignore */ }
  return null;
}

// HMAC-sign the upstream link so the GET range-proxy below is not an open
// proxy. Only links our own POST handler produced can be replayed back to us.
async function signLink(link) {
  const secret = process.env.LINK_SIGNING_SECRET || process.env.RAPIDAPI_KEY || 'dev-fallback-secret';
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(link));
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Try to read the file size of an upstream URL without downloading the body.
// googlevideo.com URLs include a `clen=` parameter that reports the exact
// length, which is by far the cheapest way to learn it. For other CDNs we
// fall back to a HEAD request, then to a Range "0-0" probe (some CDNs reject
// HEAD).
async function probeSize(link) {
  try {
    const u = new URL(link);
    const clen = u.searchParams.get('clen');
    if (clen && /^\d+$/.test(clen)) return parseInt(clen, 10);
  } catch { /* ignore */ }
  try {
    const headRes = await fetch(link, { method: 'HEAD' });
    if (headRes.ok) {
      const cl = headRes.headers.get('content-length');
      if (cl && /^\d+$/.test(cl)) return parseInt(cl, 10);
    }
  } catch { /* ignore */ }
  try {
    const probeRes = await fetch(link, { headers: { Range: 'bytes=0-0' } });
    if (probeRes.ok || probeRes.status === 206) {
      const cr = probeRes.headers.get('content-range');
      const m = cr && cr.match(/\/(\d+)\s*$/);
      try { await probeRes.body?.cancel(); } catch { /* ignore */ }
      if (m) return parseInt(m[1], 10);
    }
  } catch { /* ignore */ }
  return 0;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Range proxy. The client splits the audio file into 1-2 MB chunks and asks
// us for each one in turn. This keeps any single function invocation well
// under Vercel's 30-second HTTP-proxy timeout, regardless of the upstream
// file size.
export async function GET(request) {
  const url = new URL(request.url);
  const link = url.searchParams.get('link');
  const sig = url.searchParams.get('sig');
  const startStr = url.searchParams.get('start');
  const endStr = url.searchParams.get('end');

  if (!link || !sig) {
    return Response.json({ error: 'Missing link or signature.' }, { status: 400 });
  }
  const expectedSig = await signLink(link);
  if (sig !== expectedSig) {
    return Response.json({ error: 'Bad signature.' }, { status: 403 });
  }

  const reqHeaders = {};
  if (startStr || endStr) {
    reqHeaders.Range = `bytes=${startStr || 0}-${endStr || ''}`;
  }

  // Hard 22-second budget on the upstream fetch so we surface a clean 502
  // before Vercel's HTTP-proxy decides to shoot us down with an opaque 504.
  // Vercel's proxy hangs up at ~30 s; leaving a few seconds of headroom for
  // headers + body forwarding makes our error message reach the client.
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 22_000);

  let upstream;
  try {
    upstream = await fetch(link, { headers: reqHeaders, signal: ac.signal });
  } catch (err) {
    clearTimeout(timeout);
    const isAbort = err?.name === 'AbortError';
    return Response.json(
      {
        error: isAbort
          ? 'CDN took too long to respond (YouTube may be throttling this video). Please retry.'
          : `CDN unreachable: ${err.message}`,
      },
      { status: 502 }
    );
  }
  // Headers received — clear the timeout. Letting it stay armed during body
  // streaming would chop the response in half if upstream is slow, leaving
  // the client with a truncated chunk that then fails decode.
  clearTimeout(timeout);
  if (!upstream.ok && upstream.status !== 206) {
    try { await upstream.body?.cancel(); } catch { /* ignore */ }
    return Response.json({ error: `CDN returned ${upstream.status}` }, { status: 502 });
  }

  const respHeaders = new Headers();
  respHeaders.set('Content-Type', upstream.headers.get('content-type') || 'application/octet-stream');
  const cl = upstream.headers.get('content-length');
  if (cl) respHeaders.set('Content-Length', cl);
  const cr = upstream.headers.get('content-range');
  if (cr) respHeaders.set('Content-Range', cr);
  respHeaders.set('Cache-Control', 'private, no-store');
  respHeaders.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length');

  return new Response(upstream.body, { status: upstream.status, headers: respHeaders });
}

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

  // ---------------------------------------------------------------------
  // Two-stage fallback. The POST handler ALWAYS returns JSON metadata; the
  // client then pulls the audio bytes through the GET range-proxy in small
  // chunks. We never stream the full body from this function, which means
  // we can never trip Vercel's ~30 s HTTP-proxy timeout (the cause of the
  // 504s users were seeing on long YouTube Music tracks).
  //
  //   1. youtube-mp36 (MP3 host) — fast, small files
  //   2. ytstream MP4 host's audio-only adaptive stream (m4a / AAC) —
  //      saves us when youtube-mp36 hands back a stale/dead CDN link
  // ---------------------------------------------------------------------

  let info = null;
  let firstError = null;
  let mp3Worked = false;

  // Stage 1: MP3 host. We still call tryStream() here because youtube-mp36
  // happily returns "ready" status for links whose CDN returns 404; this
  // way we detect the CDN miss server-side and fall through to MP4 before
  // bothering the client with a chunked download that would just 404.
  try {
    const tmpInfo = await getMp3DownloadUrl(videoId, apiKey);
    mp3Worked = true;
    const probe = await tryStream(tmpInfo.link);
    if (probe) {
      try { await probe.body?.cancel(); } catch { /* ignore */ }
      info = { ...tmpInfo, contentType: 'audio/mpeg', via: 'mp3-host' };
    } else {
      firstError = new Error('MP3 CDN miss');
    }
  } catch (err) {
    firstError = err;
  }

  // Stage 2: MP4 host adaptive audio fallback.
  if (!info) {
    try {
      info = await getAudioFromMp4Host(videoId, apiKey);
    } catch (err) {
      if (!firstError) firstError = err;
    }
  }

  if (!info) {
    const err = firstError || new Error('All upstream audio sources returned errors.');
    const status = err.status || 502;
    const isBlocked = status === 429 || status === 403 || /block|rate|limit/i.test(err.message || '');
    const isProcessing = status === 202 || /preparing|processing/i.test(err.message || '');
    return Response.json(
      {
        error: isBlocked
          ? 'YouTube briefly blocked this request. Please click "Try Again" in a few seconds.'
          : isProcessing
          ? err.message
          : mp3Worked
          ? 'The MP3 service handed back a dead CDN link, and the audio fallback also failed. Please try a different video or retry in a minute.'
          : `Audio could not be retrieved for this video (${err.message || 'CDN miss'}). Please try a different video or retry.`,
        retryable: true,
        processing: isProcessing,
      },
      { status: isBlocked ? 429 : isProcessing ? 202 : status }
    );
  }

  // Probe the file size so the client knows how to chunk. If we can't learn
  // it (size = 0), the client falls back to a single un-ranged GET which is
  // fine for small files.
  const size = await probeSize(info.link);
  const sig = await signLink(info.link);

  return Response.json({
    link: info.link,
    sig,
    size,
    contentType: info.contentType || 'audio/mpeg',
    title: info.title || 'YouTube Audio',
    duration: info.duration || null,
    via: info.via || 'mp3-host',
    videoId,
  });
}
