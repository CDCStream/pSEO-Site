import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { parseBlogPost } from '@/lib/blog-parser';

export const revalidate = 60;

export const metadata = {
  title: 'Blog - MakerSilo',
  description: 'Tips, tutorials, and creative inspiration for content creators. Learn about text tools, meme making, design, and more.',
  keywords: 'makersilo blog, creative tools blog, text generator tips, meme making tutorials',
  openGraph: {
    title: 'Blog - MakerSilo',
    description: 'Tips, tutorials, and creative inspiration for content creators.',
    type: 'website',
    url: 'https://makersilo.com/blog/',
  },
};

async function getPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(parseBlogPost);
  } catch {
    return [];
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              Blog
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">MakerSilo Blog</h1>
            <p className="text-xl text-gray-400">Tips, tutorials, and creative inspiration for content creators.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No blog posts yet. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}/`}
                className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:bg-white/[0.07] flex flex-col"
              >
                {post.image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>{post.author}</span>
                    <span>·</span>
                    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">{post.description}</p>
                  )}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] text-gray-400">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
