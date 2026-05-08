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

// Strip non-ASCII characters before stuffing into a HTTP header (some upstream
// titles contain emoji/CJK characters which break header serialization).
function safeHeader(str) {
  if (!str) return '';
  return String(str).replace(/[^\x20-\x7E]/g, '').slice(0, 200);
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

  // ---------------------------------------------------------------------
  // Two-stage fallback. We want to deliver audio bytes whenever possible:
  //   1. youtube-mp36 (MP3 host) — fastest, lowest bandwidth, normal path
  //   2. ytstream MP4 host's audio-only adaptive stream (m4a / AAC) — saves
  //      us when youtube-mp36 hands back a stale/dead CDN link, common on
  //      YouTube Music videos accessed via "&list=RD…" radio links
  // Retrying the SAME RapidAPI MP3 endpoint after a CDN miss is pointless
  // because the upstream serves the same cached link for several minutes,
  // so we skip straight to the MP4 fallback.
  // ---------------------------------------------------------------------

  let info = null;
  let upstream = null;
  let firstError = null;
  let mp3Worked = false;

  // Stage 1: MP3 host.
  try {
    const tmpInfo = await getMp3DownloadUrl(videoId, apiKey);
    mp3Worked = true;
    upstream = await tryStream(tmpInfo.link);
    if (upstream) {
      info = { ...tmpInfo, contentType: 'audio/mpeg', via: 'mp3-host' };
    } else {
      // RapidAPI happily returned a "ready" link but the CDN serves 404.
      // Record this so we can surface it if the fallback also fails.
      firstError = new Error('MP3 CDN miss');
    }
  } catch (err) {
    firstError = err;
    const status = err?.status || 502;
    const isProcessing = status === 202 || /preparing|processing/i.test(err?.message || '');
    // "Still processing" means the MP3 host is mid-encode. The MP4 host
    // doesn't share that state, but it usually has the audio ready
    // immediately, so it's still worth trying as a fallback.
    if (isProcessing) {
      // Don't return early — fall through to the MP4 host attempt.
    }
  }

  // Stage 2: MP4 host adaptive audio fallback.
  if (!upstream) {
    try {
      const tmpInfo = await getAudioFromMp4Host(videoId, apiKey);
      const candidate = await tryStream(tmpInfo.link);
      if (candidate) {
        upstream = candidate;
        info = tmpInfo;
      } else if (!firstError) {
        firstError = new Error('Adaptive audio CDN miss');
      }
    } catch (err) {
      if (!firstError) firstError = err;
    }
  }

  if (!upstream) {
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

  // Stream the audio bytes back to the browser as same-origin so that
  // AudioContext.decodeAudioData() works without a CORS preflight.
  const headers = new Headers();
  const upstreamCt = upstream.headers.get('content-type');
  headers.set('Content-Type', upstreamCt || info.contentType || 'audio/mpeg');
  const len = upstream.headers.get('content-length');
  if (len) headers.set('Content-Length', len);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Video-Id', videoId);
  if (info.title) headers.set('X-Video-Title', encodeURIComponent(info.title));
  if (info.duration) headers.set('X-Video-Duration', safeHeader(String(info.duration)));
  if (info.via) headers.set('X-Audio-Source', info.via);
  // Allow the client to read these custom headers
  headers.set('Access-Control-Expose-Headers', 'X-Video-Id, X-Video-Title, X-Video-Duration, X-Audio-Source');

  return new Response(upstream.body, { status: 200, headers });
}
