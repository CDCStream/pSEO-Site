import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { parseBlogPost } from '@/lib/blog-parser';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published');
    return (data || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    if (!data) return { title: 'Post Not Found - MakerSilo Blog' };
    const post = parseBlogPost(data);
    return {
      title: `${post.title} - MakerSilo Blog`,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        url: `https://makersilo.com/blog/${post.slug}/`,
        ...(post.image && { images: [{ url: post.image, alt: post.title }] }),
        article: {
          publishedTime: post.published_at,
          modifiedTime: post.updated_at,
          authors: [post.author],
          tags: post.tags,
        },
      },
    };
  } catch {
    return { title: 'Post Not Found - MakerSilo Blog' };
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  let post;
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error || !data) notFound();
    post = parseBlogPost(data);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            image: post.image || undefined,
            author: { '@type': 'Person', name: post.author },
            datePublished: post.published_at,
            dateModified: post.updated_at,
            publisher: { '@type': 'Organization', name: 'MakerSilo', url: 'https://makersilo.com' },
            mainEntityOfPage: `https://makersilo.com/blog/${post.slug}/`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://makersilo.com' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://makersilo.com/blog/' },
              { '@type': 'ListItem', position: 3, name: post.title },
            ],
          }),
        }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog/" className="hover:text-white transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-2xl mb-8"
          />
        )}

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-lg text-gray-400 mb-6">{post.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="text-gray-300 font-medium">{post.author}</span>
            <span>·</span>
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-16 pt-8 border-t border-white/10">
          <Link href="/blog/" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
            ← Back to Blog
          </Link>
        </footer>
      </article>
    </div>
  );
}
