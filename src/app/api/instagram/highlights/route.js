import { NextResponse } from 'next/server';
import { signMediaUrl } from '@/lib/instagram-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOST = process.env.RAPIDAPI_INSTAGRAM_HOST || 'instagram-scraper-api2.p.rapidapi.com';

const USERNAME_RE = /^[A-Za-z0-9._]{1,30}$/;

function sanitizeUsername(input) {
  if (!input || typeof input !== 'string') return null;
  let s = input.trim();
  if (!s) return null;
  s = s.replace(/^@+/, '');
  if (s.includes('instagram.com')) {
    try {
      const u = new URL(s.startsWith('http') ? s : `https://${s}`);
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length) s = parts[0];
    } catch {
      return null;
    }
  }
  s = s.split('?')[0].split('/')[0].toLowerCase();
  return USERNAME_RE.test(s) ? s : null;
}

async function rapidGet(path, apiKey) {
  const res = await fetch(`https://${HOST}${path}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': HOST,
    },
    cache: 'no-store',
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-json */
  }
  return { status: res.status, body };
}

function pickFirst(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] != null) return obj[k];
  }
  return null;
}

function normalizeProfile(raw) {
  if (!raw) return null;
  const data = raw.data || raw.user || raw;
  if (!data) return null;
  return {
    id: pickFirst(data, ['id', 'pk', 'pk_id', 'user_id']),
    username: pickFirst(data, ['username', 'user_name']) || null,
    fullName: pickFirst(data, ['full_name', 'fullName', 'name']) || '',
    biography: pickFirst(data, ['biography', 'bio']) || '',
    followerCount: pickFirst(data, ['follower_count', 'followerCount', 'edge_followed_by_count']) || 0,
    followingCount: pickFirst(data, ['following_count', 'followingCount']) || 0,
    isPrivate: !!pickFirst(data, ['is_private', 'isPrivate']),
    isVerified: !!pickFirst(data, ['is_verified', 'isVerified']),
    profilePic: signMediaUrl(
      pickFirst(data, [
        'hd_profile_pic_url_info',
        'profile_pic_url_hd',
        'hdProfilePicUrl',
        'profile_pic_url',
        'profilePicUrl',
      ])?.url ||
        pickFirst(data, [
          'profile_pic_url_hd',
          'hdProfilePicUrl',
          'profile_pic_url',
          'profilePicUrl',
        ])
    ),
  };
}

function normalizeHighlightTray(raw) {
  if (!raw) return [];
  const list =
    raw.data?.items ||
    raw.data?.tray ||
    raw.data ||
    raw.tray ||
    raw.items ||
    raw.highlights ||
    [];
  if (!Array.isArray(list)) return [];

  return list
    .map((h) => {
      const id = pickFirst(h, ['id', 'pk', 'highlight_id', 'reel_id']);
      const title = pickFirst(h, ['title', 'name']) || 'Untitled';
      const cover =
        h.cover_media?.cropped_image_version?.url ||
        h.cover_media?.full_image_version?.url ||
        h.cover_media?.cover_image_version?.url ||
        h.cover_media_cropped_thumbnail?.url ||
        h.cover?.cropped_image_version?.url ||
        h.cover?.url ||
        h.thumbnail?.url ||
        h.thumbnail_url ||
        null;
      const count = pickFirst(h, ['media_count', 'mediaCount', 'count']) || 0;
      return {
        id: id ? String(id).replace(/^highlight:/, '') : null,
        title: String(title),
        cover: signMediaUrl(cover),
        count: Number(count) || 0,
      };
    })
    .filter((h) => h.id);
}

function mapUpstreamError(status) {
  if (status === 404) return { code: 'not_found', message: 'No Instagram account with that username.' };
  if (status === 403) return { code: 'forbidden', message: 'Instagram blocked this request. Try again in a moment.' };
  if (status === 429) return { code: 'rate_limited', message: 'Too many lookups in a short time. Please wait and retry.' };
  if (status >= 500) return { code: 'upstream_error', message: 'Instagram is having problems right now.' };
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

  const username = sanitizeUsername(body?.username);
  if (!username) {
    return NextResponse.json(
      { error: 'invalid_username', message: 'Enter a valid Instagram username (letters, numbers, dots, underscores).' },
      { status: 400 }
    );
  }

  const infoRes = await rapidGet(
    `/v1/info?username_or_id_or_url=${encodeURIComponent(username)}`,
    apiKey
  );
  if (infoRes.status >= 400 || !infoRes.body) {
    const e = mapUpstreamError(infoRes.status);
    return NextResponse.json({ error: e.code, message: e.message }, { status: infoRes.status === 404 ? 404 : 502 });
  }

  const profile = normalizeProfile(infoRes.body);
  if (!profile || !profile.id) {
    return NextResponse.json(
      { error: 'not_found', message: 'No Instagram account with that username.' },
      { status: 404 }
    );
  }
  if (profile.isPrivate) {
    return NextResponse.json(
      {
        error: 'private',
        message: 'This account is private. Highlights are only visible to approved followers on Instagram itself.',
        profile,
      },
      { status: 403 }
    );
  }

  const trayRes = await rapidGet(
    `/v1/highlights?username_or_id_or_url=${encodeURIComponent(profile.id)}`,
    apiKey
  );
  if (trayRes.status >= 400 || !trayRes.body) {
    const e = mapUpstreamError(trayRes.status);
    return NextResponse.json({ error: e.code, message: e.message, profile }, { status: 502 });
  }

  const highlights = normalizeHighlightTray(trayRes.body);

  return NextResponse.json({
    profile,
    highlights,
    fetchedAt: Date.now(),
  });
}
