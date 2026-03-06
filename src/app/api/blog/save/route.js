import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const adminSecret = request.headers.get('x-admin-secret');
    if (!adminSecret || adminSecret !== process.env.BLOG_ADMIN_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, description, content, author, image, tags, status } = body;

    if (!slug || !title || !content) {
      return Response.json({ error: 'slug, title, and content are required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(
        {
          slug,
          title,
          description: description || '',
          content,
          author: author || 'Admin',
          image: image || '',
          tags: tags || [],
          status: status || 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select()
      .single();

    if (error) throw error;

    pingSitemaps();

    return Response.json({ success: true, slug: data.slug, id: data.id });
  } catch (err) {
    console.error('Blog Save Error:', err);
    return Response.json({ error: err.message || 'Failed to save post.' }, { status: 500 });
  }
}

function pingSitemaps() {
  const sitemapUrl = encodeURIComponent('https://makersilo.com/sitemap.xml');
  fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
  fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
}
