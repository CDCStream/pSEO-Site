import Link from 'next/link';
import { Music, Star, Calculator, Languages, Heart, Smile, ArrowRight, Sparkles } from 'lucide-react';
import { symbolsConfig } from '@/config/pSEO-data';

const iconMap = {
  'music': Music,
  'star': Star,
  'calculator': Calculator,
  'languages': Languages,
  'heart': Heart,
  'smile': Smile,
};

export const metadata = {
  title: 'Copy and Paste Symbols - Free Symbol Collections | MakerSilo',
  description: 'Copy and paste symbols for social media. Find music symbols, hearts, kaomoji, Japanese characters, and more.',
};

export default function SymbolsPage() {
  const symbols = Object.entries(symbolsConfig).map(([slug, config]) => ({
    slug,
    ...config,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Symbol Collections
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Symbols Copy & Paste
            </h1>
            <p className="text-xl text-gray-400">
              Click to copy symbols, emojis, and special characters.
              Works on Instagram, Discord, Twitter, and everywhere else.
            </p>
          </div>
        </div>
      </section>

      {/* Symbols Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {symbols.map((symbol) => {
            const Icon = iconMap[symbol.icon] || Sparkles;

            return (
              <Link
                key={symbol.slug}
                href={`/symbols/${symbol.slug}`}
                className="group relative bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300 hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                      {symbol.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {symbol.subtitle}
                    </p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}


