import Link from 'next/link';
import { Image, MessageCircle, Armchair, Coffee, ArrowRight } from 'lucide-react';
import { memeMakerConfig } from '@/config/pSEO-data';

const iconMap = {
  'image': Image,
  'message-circle': MessageCircle,
  'armchair': Armchair,
  'coffee': Coffee,
};

export const metadata = {
  title: 'Free Meme Generator - Create Viral Memes Online | TextForge',
  description: 'Create viral memes instantly with our free meme generator. Drake meme, speech bubbles, Bernie Sanders, and more templates.',
};

export default function MemeMakerPage() {
  const memes = Object.entries(memeMakerConfig).map(([slug, config]) => ({
    slug,
    ...config,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
              <Image className="w-4 h-4" />
              Meme Templates
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Meme Maker
            </h1>
            <p className="text-xl text-gray-400">
              Create hilarious memes in seconds. Choose a template, add your text,
              and download your masterpiece.
            </p>
          </div>
        </div>
      </section>

      {/* Memes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {memes.map((meme) => {
            const Icon = iconMap[meme.icon] || Image;

            return (
              <Link
                key={meme.slug}
                href={`/meme-maker/${meme.slug}`}
                className="group relative bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-green-500/30 transition-all duration-300 hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                      {meme.name}
                    </h2>
                    <p className="text-gray-400">
                      {meme.subtitle}
                    </p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

