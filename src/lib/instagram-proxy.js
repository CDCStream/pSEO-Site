import crypto from 'crypto';

const PROXY_TTL_MS = 60 * 60 * 1000;
const ALLOWED_HOST_SUFFIXES = [
  'cdninstagram.com',
  'fbcdn.net',
  'instagram.com',
];

function getSecret() {
  return (
    process.env.MEDIA_PROXY_SECRET ||
    process.env.RAPIDAPI_KEY ||
    'makersilo-instagram-proxy-dev-secret-do-not-use-in-prod'
  );
}

function isHostAllowed(hostname) {
  if (!hostname) return false;
  const h = hostname.toLowerCase();
  return ALLOWED_HOST_SUFFIXES.some((suffix) => h === suffix || h.endsWith('.' + suffix));
}

function sign(payload) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex').slice(0, 32);
}

export function signMediaUrl(rawUrl, { ttlMs = PROXY_TTL_MS } = {}) {
  if (!rawUrl) return null;
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  if (!isHostAllowed(parsed.hostname)) return null;

  const exp = Date.now() + ttlMs;
  const payload = `${rawUrl}|${exp}`;
  const sig = sign(payload);
  const params = new URLSearchParams({
    u: rawUrl,
    e: String(exp),
    s: sig,
  });
  return `/api/instagram/media-proxy?${params.toString()}`;
}

export function verifyAndExtract(searchParams) {
  const u = searchParams.get('u');
  const e = searchParams.get('e');
  const s = searchParams.get('s');

  if (!u || !e || !s) {
    return { ok: false, error: 'missing_params' };
  }

  const exp = parseInt(e, 10);
  if (!Number.isFinite(exp)) return { ok: false, error: 'bad_exp' };
  if (Date.now() > exp) return { ok: false, error: 'expired' };

  const expected = sign(`${u}|${exp}`);
  if (!crypto.timingSafeEqual(Buffer.from(s, 'hex'), Buffer.from(expected, 'hex'))) {
    return { ok: false, error: 'bad_sig' };
  }

  let parsed;
  try {
    parsed = new URL(u);
  } catch {
    return { ok: false, error: 'bad_url' };
  }
  if (!isHostAllowed(parsed.hostname)) {
    return { ok: false, error: 'bad_host' };
  }

  return { ok: true, url: u, parsed };
}
