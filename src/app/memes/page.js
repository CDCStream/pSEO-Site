import Link from 'next/link';
import { MessageCircleQuestion, Flame, ArrowRight, Download, Play } from 'lucide-react';

export const metadata = {
  title: 'Free Meme GIF Galleries - Download Reaction GIFs | MakerSilo',
  description:
    'Free meme GIF galleries. Auto-playing reaction packs you can download in one tap and drop into any chat or comment thread. No watermark, no signup.',
  alternates: {
    canonical: 'https://makersilo.com/memes/',
  },
  openGraph: {
    title: 'Free Meme GIF Galleries - Download Reaction GIFs',
    description:
      'Auto-playing meme GIF packs you can download in one tap. No watermark, no signup.',
    type: 'website',
    url: 'https://makersilo.com/memes/',
    siteName: 'MakerSilo',
  },
};

const galleries = [
  {
    slug: 'what-meme',
    name: 'What Meme GIFs',
    subtitle: 'The classic "what?!" reaction pack \u2014 8 animated loops for chat replies, comments, and stitches.',
    icon: MessageCircleQuestion,
    color: 'from-purple-500 to-fuchsia-500',
    href: '/memes/what-meme/',
    count: 8,
  },
  {
    slug: 'sheesh-meme',
    name: 'Sheesh Meme GIFs',
    subtitle: 'The TikTok-era "sheesh!" hype reaction \u2014 14 animated loops for flex replies, group chats, and stream moments.',
    icon: Flame,
    color: 'from-amber-500 to-orange-500',
    href: '/memes/sheesh-meme/',
    count: 14,
  },
];

export default function MemesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-200 text-sm font-medium mb-4">
              <Play className="w-4 h-4" fill="currentColor" />
              Reaction GIF galleries
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Meme GIFs</h1>
            <p className="text-xl text-gray-400">
              Auto-playing reaction GIF packs. Tap to play, click to download, drop into any chat. No watermark, no signup.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {galleries.map((g) => {
            const Icon = g.icon;
            return (
              <Link
                key={g.slug}
                href={g.href}
                className="group relative bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300 hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">{g.name}</h2>
                      <span className="px-2 py-0.5 text-[11px] font-mono rounded-full bg-white/5 border border-white/10 text-gray-400">{g.count} GIFs</span>
                    </div>
                    <p className="text-gray-400 text-sm">{g.subtitle}</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-purple-300/80">
                      <Download className="w-3.5 h-3.5" />
                      Free download \u00b7 No watermark
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-300 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
