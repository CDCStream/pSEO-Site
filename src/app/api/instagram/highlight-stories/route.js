import { NextResponse } from 'next/server';
import { signMediaUrl } from '@/lib/instagram-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOST = process.env.RAPIDAPI_INSTAGRAM_HOST || 'instagram-scraper-api2.p.rapidapi.com';

const ID_RE = /^[A-Za-z0-9:_-]{1,80}$/;

function pickFirst(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] != null) return obj[k];
  }
  return null;
}

function bestImageUrl(images) {
  if (!Array.isArray(images) || !images.length) return null;
  const sorted = [...images].sort((a, b) => (b?.width || 0) - (a?.width || 0));
  return sorted[0]?.url || null;
}

function bestVideoUrl(versions) {
  if (!Array.isArray(versions) || !versions.length) return null;
  const sorted = [...versions].sort((a, b) => (b?.width || 0) - (a?.width || 0));
  return sorted[0]?.url || null;
}

function normalizeStory(item) {
  if (!item) return null;
  const id = pickFirst(item, ['id', 'pk', 'media_id']);
  if (!id) return null;

  const mediaType = pickFirst(item, ['media_type', 'mediaType']);
  const isVideo = mediaType === 2 || mediaType === '2' || !!item.video_versions || !!item.videoVersions;

  const imageRaw =
    bestImageUrl(item.image_versions2?.candidates) ||
    bestImageUrl(item.imageVersions?.items) ||
    bestImageUrl(item.image_versions?.candidates) ||
    item.thumbnail_url ||
    item.display_url ||
    null;

  const videoRaw = isVideo
    ? bestVideoUrl(item.video_versions) ||
      bestVideoUrl(item.videoVersions) ||
      item.video_url ||
      null
    : null;

  const takenAt = pickFirst(item, ['taken_at', 'takenAt', 'taken_at_timestamp']) || null;
  const duration = pickFirst(item, ['video_duration', 'videoDuration']) || (isVideo ? 0 : 5);

  return {
    id: String(id),
    type: isVideo ? 'video' : 'image',
    image: signMediaUrl(imageRaw),
    video: signMediaUrl(videoRaw),
    duration: Number(duration) || (isVideo ? 0 : 5),
    takenAt: takenAt ? Number(takenAt) : null,
  };
}

function normalizeStoriesEnvelope(raw) {
  if (!raw) return [];
  const items =
    raw.data?.items ||
    raw.data?.reels?.items ||
    raw.data ||
    raw.items ||
    raw.reels?.items ||
    raw.stories ||
    [];

  if (Array.isArray(items)) return items.map(normalizeStory).filter(Boolean);

  if (typeof items === 'object') {
    for (const key of Object.keys(items)) {
      const candidate = items[key]?.items;
      if (Array.isArray(candidate)) return candidate.map(normalizeStory).filter(Boolean);
    }
  }
  return [];
}

function mapUpstreamError(status) {
  if (status === 404) return { code: 'not_found', message: 'This highlight no longer exists.' };
  if (status === 403) return { code: 'forbidden', message: 'Instagram blocked this request. Try again in a moment.' };
  if (status === 429) return { code: 'rate_limited', message: 'Too many lookups in a short time. Please wait and retry.' };
  return { code: 'failed', message: `Instagram lookup failed (HTTP ${status}).` };
}

export async function POST(request) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'config', message: 'Server is missing RAPIDAPI_KEY. Add it on Vercel and redeploy.' },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Invalid JSON body.' }, { status: 400 });
  }

  const rawId = (body?.highlightId || '').toString().trim().replace(/^highlight:/, '');
  if (!ID_RE.test(rawId)) {
    return NextResponse.json(
      { error: 'invalid_id', message: 'Invalid highlight id.' },
      { status: 400 }
    );
  }

  const url = `/v1/highlight_stories?highlight_id=${encodeURIComponent(rawId)}`;
  const upstream = await fetch(`https://${HOST}${url}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': HOST,
    },
    cache: 'no-store',
  });

  if (!upstream.ok) {
    const e = mapUpstreamError(upstream.status);
    return NextResponse.json(
      { error: e.code, message: e.message },
      { status: upstream.status === 404 ? 404 : 502 }
    );
  }

  let data;
  try {
    data = await upstream.json();
  } catch {
    return NextResponse.json(
      { error: 'bad_response', message: 'Instagram returned an unexpected response.' },
      { status: 502 }
    );
  }

  const stories = normalizeStoriesEnvelope(data);
  return NextResponse.json({ stories, count: stories.length });
}
