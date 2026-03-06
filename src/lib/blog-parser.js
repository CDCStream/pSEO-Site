export function parseBlogPost(row) {
  let { slug, title, description, content, author, image, tags, published_at, created_at, updated_at } = row;

  // Legacy: if content is a <pre>-wrapped JSON debug payload, try to extract the real article
  if (content && content.trim().startsWith('<pre>')) {
    try {
      const inner = content.replace(/^<pre[^>]*>/i, '').replace(/<\/pre>$/i, '').trim();
      const parsed = JSON.parse(inner);
      const article = parsed.article || parsed.data?.article || parsed;
      if (article.content_html || article.content || article.html || article.body) {
        content = article.content_html || article.content || article.html || article.body;
        if (!title && (article.title || article.headline)) title = article.title || article.headline;
        if (!description && (article.meta_description || article.description)) description = article.meta_description || article.description;
        if (!image && (article.image_url || article.featured_image || article.cover_image)) image = article.image_url || article.featured_image || article.cover_image;
      }
    } catch {
      // not valid JSON, keep original content
    }
  }

  return {
    slug,
    title: title || 'Untitled',
    description: description || '',
    content: content || '',
    author: author || 'Admin',
    image: image || '',
    tags: tags || [],
    published_at: published_at || created_at || new Date().toISOString(),
    updated_at: updated_at || new Date().toISOString(),
    readingTime: estimateReadingTime(content || ''),
  };
}

function estimateReadingTime(html) {
  const text = html.replace(/<[^>]*>/g, '').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
