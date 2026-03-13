import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

const BOT_PATTERNS = /bot|crawler|spider|headless|lighthouse|pagespeed|ahrefs|semrush|mj12|yandex|baidu|bingpreview|slurp|duckduck|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|pingdom|uptimerobot|gtmetrix/i;

const SEARCH_ENGINES = {
  google: /google\./,
  bing: /bing\.com/,
  yahoo: /yahoo\./,
  yandex: /yandex\./,
  baidu: /baidu\.com/,
  duckduckgo: /duckduckgo\.com/,
};

const SOCIAL_DOMAINS = /t\.co|twitter\.com|x\.com|facebook\.com|instagram\.com|linkedin\.com|reddit\.com|pinterest\.com|tiktok\.com|youtube\.com/;

function detectSource(referrer, referrerDomain) {
  if (!referrer || !referrerDomain) return 'direct';
  if (referrerDomain.includes('makersilo.com')) return 'internal';

  for (const [engine, pattern] of Object.entries(SEARCH_ENGINES)) {
    if (pattern.test(referrerDomain)) return engine;
  }
  if (SOCIAL_DOMAINS.test(referrerDomain)) return 'social';
  return 'other';
}

function extractDomain(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';

    if (BOT_PATTERNS.test(userAgent)) {
      return new Response(null, { status: 204 });
    }

    const body = await request.json();
    const { page, referrer, title, sw, sh, lang } = body;

    if (!page) {
      return new Response(null, { status: 204 });
    }

    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      null;

    const country = headersList.get('x-vercel-ip-country') || null;
    const referrerDomain = extractDomain(referrer);
    const source = detectSource(referrer, referrerDomain);

    if (source === 'internal') {
      return new Response(null, { status: 204 });
    }

    await supabase.from('page_views').insert({
      page,
      referrer: referrer || null,
      referrer_domain: referrerDomain,
      source,
      ip: ip || null,
      country,
      user_agent: userAgent.substring(0, 500),
      title: title ? title.substring(0, 300) : null,
      screen_width: sw ? parseInt(sw, 10) || null : null,
      screen_height: sh ? parseInt(sh, 10) || null : null,
      language: lang ? lang.substring(0, 20) : null,
    });

    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 204 });
  }
}
