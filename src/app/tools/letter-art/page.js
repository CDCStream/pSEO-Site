import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const LetterAIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h1.5l1-3h11l1 3H19L13 4h-2L5 20"/><path d="M7 14h10"/></svg>
);

const letterArtTools = [
  {
    title: 'Bubble Letter Art Generator',
    description: 'Create eye-catching bubble letter art with 6 unique fonts. Customize fill color, outline, shadow effects and download as transparent PNG.',
    href: '/tools/letter-art/bubble-letters',
    tags: ['6 Fonts', 'Outline', 'Shadow', 'Transparent PNG'],
  },
];

export const metadata = {
  title: 'Letter Art Generator - Create Custom Letter Art Free | MakerSilo',
  description: 'Create beautiful letter art with bubble fonts, custom outlines, shadows, and effects. Download as high-quality transparent PNG. Free online tools.',
  keywords: 'letter art, bubble letters, letter art generator, bubble font, custom lettering, letter art maker',
  openGraph: {
    title: 'Letter Art Generator - Create Custom Letter Art Free',
    description: 'Create beautiful letter art with bubble fonts, custom outlines, shadows, and effects. Download as transparent PNG.',
    type: 'website',
    url: 'https://makersilo.com/tools/letter-art',
  },
};

export default function LetterArtPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium mb-4">
              <LetterAIcon className="w-4 h-4" />
              Letter Art Tools
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Letter Art Generator
            </h1>
            <p className="text-xl text-gray-400">
              Create stunning letter art with unique fonts, custom colors, outlines, and shadow effects. Download as high-quality transparent PNGs.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {letterArtTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-pink-500/30 transition-all duration-300 hover:bg-white/[0.07]"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <LetterAIcon className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-3">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-gray-400">{tag}</span>
                    ))}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon placeholder */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">More letter art styles coming soon — Graffiti Letters, 3D Letters, Block Letters, and more.</p>
        </div>
      </section>
    </div>
  );
}
