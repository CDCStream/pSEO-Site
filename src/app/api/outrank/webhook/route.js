import { supabase } from '@/lib/supabase';

const TITLE_KEYS = ['title', 'headline', 'name', 'meta_title', 'post_title', 'articleTitle'];
const CONTENT_KEYS = ['content_html', 'content', 'html', 'body', 'text', 'article_html', 'post_content'];
const SLUG_KEYS = ['slug', 'url_slug', 'permalink'];
const DESC_KEYS = ['meta_description', 'description', 'excerpt', 'summary'];
const IMAGE_KEYS = ['image_url', 'featured_image', 'cover_image', 'image', 'thumbnail', 'og_image'];
const TAG_KEYS = ['tags', 'keywords', 'categories', 'topics'];

function findField(obj, keys) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
  }
  return null;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

function findLongString(obj, minLen = 100) {
  for (const val of Object.values(obj)) {
    if (typeof val === 'string' && val.length >= minLen) return val;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const found = findLongString(val, minLen);
      if (found) return found;
    }
  }
  return null;
}

function extractArticles(payload) {
  if (payload?.data?.articles && Array.isArray(payload.data.articles)) return payload.data.articles;
  if (payload?.articles && Array.isArray(payload.articles)) return payload.articles;
  if (payload?.data?.article) return [payload.data.article];
  if (payload?.article) return [payload.article];
  if (payload?.title || payload?.content || payload?.content_html || payload?.headline) return [payload];
  return null;
}

function parseTags(raw) {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') return raw.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

async function processArticle(article) {
  let title = findField(article, TITLE_KEYS);
  let content = findField(article, CONTENT_KEYS);
  const slugRaw = findField(article, SLUG_KEYS);
  const description = findField(article, DESC_KEYS) || '';
  const image = findField(article, IMAGE_KEYS) || '';
  const tags = parseTags(findField(article, TAG_KEYS));

  if (!content) content = findLongString(article);

  if (!title && !content) return null;

  if (!title) title = 'Untitled Post';
  const slug = slugRaw ? slugify(slugRaw) : slugify(title);

  if (!content) {
    content = `<pre>${JSON.stringify(article, null, 2)}</pre>`;
    const { error } = await supabase.from('blog_posts').upsert(
      { slug, title, description, content, image, tags, author: 'Outrank', status: 'draft', published_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { onConflict: 'slug' }
    );
    return { slug, status: 'draft', error: error?.message };
  }

  const { error } = await supabase.from('blog_posts').upsert(
    { slug, title, description, content, image, tags, author: 'Outrank', status: 'published', published_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { onConflict: 'slug' }
  );
  return { slug, status: 'published', error: error?.message };
}

function verifyAuth(request) {
  const secret = process.env.OUTRANK_WEBHOOK_SECRET;
  if (!secret) return true;

  const sig = request.headers.get('x-webhook-signature')
    || request.headers.get('x-outrank-signature')
    || '';
  const auth = request.headers.get('authorization') || '';

  if (sig === secret) return true;
  if (auth === `Bearer ${secret}`) return true;
  return false;
}

function pingSitemaps() {
  const url = encodeURIComponent('https://makersilo.com/sitemap.xml');
  fetch(`https://www.google.com/ping?sitemap=${url}`).catch(() => {});
  fetch(`https://www.bing.com/ping?sitemap=${url}`).catch(() => {});
}

export async function POST(request) {
  if (!verifyAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const articles = extractArticles(payload);

    if (!articles) {
      const slug = `debug-${Date.now()}`;
      await supabase.from('blog_posts').upsert(
        { slug, title: 'Debug Webhook Payload', description: '', content: `<pre>${JSON.stringify(payload, null, 2)}</pre>`, author: 'Outrank', status: 'draft', tags: ['debug'], image: '', published_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { onConflict: 'slug' }
      );
      return Response.json({ message: 'Unknown format, saved as debug draft.', slug });
    }

    const results = [];
    for (const article of articles) {
      const result = await processArticle(article);
      if (result) results.push(result);
    }

    if (results.some(r => r.status === 'published')) pingSitemaps();

    return Response.json({ message: `Processed ${results.length} article(s).`, results });
  } catch (err) {
    console.error('Outrank Webhook Error:', err);
    return Response.json({ error: err.message || 'Webhook processing failed.' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge') || searchParams.get('hub.challenge');
  if (challenge) {
    return new Response(challenge, { headers: { 'Content-Type': 'text/plain' } });
  }
  return Response.json({ status: 'Outrank webhook endpoint active.' });
}
