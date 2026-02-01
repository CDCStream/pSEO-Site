import Link from 'next/link';
import { Snowflake, Palette, Cat, Square, Blend, ArrowRight } from 'lucide-react';
import { wallpapersConfig } from '@/config/pSEO-data';

const iconMap = {
  'snowflake': Snowflake,
  'bow-tie': Palette, // Using Palette as fallback
  'cat': Cat,
  'palette': Palette,
  'square': Square,
  'blend': Blend,
};

export const metadata = {
  title: 'Free Wallpaper Generator - Create Beautiful Backgrounds | MakerSilo',
  description: 'Generate stunning wallpapers for your devices. Solid colors, gradients, aesthetics, and more - all free.',
};

export default function WallpapersPage() {
  const wallpapers = Object.entries(wallpapersConfig).map(([slug, config]) => ({
    slug,
    ...config,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <Palette className="w-4 h-4" />
              Wallpaper Generators
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Wallpaper Generators
            </h1>
            <p className="text-xl text-gray-400">
              Create stunning wallpapers for any device. From solid colors to beautiful gradients
              and aesthetic patterns - all generated instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Wallpapers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallpapers.map((wallpaper) => {
            const Icon = iconMap[wallpaper.icon] || Palette;

            return (
              <Link
                key={wallpaper.slug}
                href={`/wallpapers/${wallpaper.slug}`}
                className="group relative bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-blue-500/30 transition-all duration-300 hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {wallpaper.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {wallpaper.subtitle}
                    </p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}


