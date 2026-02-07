import Link from 'next/link';
import { randomizersConfig, siteConfig } from '@/config/pSEO-data';

export const metadata = {
  title: 'Random Generators - Fun & Interactive Tools | MakerSilo',
  description: 'Free random generators for games, decisions, and fun. Generate random animals, Pokémon, objects, teams, questions, and emojis instantly.',
  alternates: {
    canonical: `${siteConfig.url}/randomizers`,
  },
};

const iconMap = {
  'paw-print': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19c-2 0-4-1-4-3s2-3 4-3 4 1 4 3-2 3-4 3zm-5-6c-1.5 0-3-1-3-2.5S5.5 8 7 8s3 1 3 2.5S8.5 13 7 13zm10 0c-1.5 0-3-1-3-2.5S15.5 8 17 8s3 1 3 2.5-1.5 2.5-3 2.5zM9 7c-1 0-2-.5-2-1.5S8 4 9 4s2 .5 2 1.5S10 7 9 7zm6 0c-1 0-2-.5-2-1.5S14 4 15 4s2 .5 2 1.5S16 7 15 7z" />
    </svg>
  ),
  'gamepad-2': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7v4m-6-4v4m12 2a3 3 0 01-3 3H6a3 3 0 01-3-3V8a3 3 0 013-3h12a3 3 0 013 3v5z" />
    </svg>
  ),
  'box': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  'trophy': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h4v2a6 6 0 0012 0V4h4M6 4a2 2 0 00-2 2v1a4 4 0 004 4M18 4a2 2 0 012 2v1a4 4 0 01-4 4m-4 7v3m-4 0h8" />
    </svg>
  ),
  'help-circle': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'smile': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function RandomizersPage() {
  const randomizers = Object.entries(randomizersConfig).map(([slug, config]) => ({
    slug,
    ...config,
  }));

  return (
    <main className="min-h-screen bg-gray-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Random <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Generators</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Fun random generators for games, decisions, and entertainment. Generate random items with a single click.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {randomizers.map((tool) => (
            <Link
              key={tool.slug}
              href={`/randomizers/${tool.slug}`}
              prefetch={false}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-orange-500/30"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                {iconMap[tool.icon] || iconMap['box']}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{tool.name}</h3>
              <p className="text-gray-400 text-sm">{tool.description.substring(0, 100)}...</p>
            </Link>
          ))}
        </div>

        {/* SEO Content */}
        <section className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">About Random Generators</h2>
            <div className="prose prose-invert prose-orange max-w-none">
              <p className="text-gray-300">
                Our collection of random generators helps with decisions, games, education, and entertainment. 
                Whether you need a random animal for a story, a Pokémon for a challenge run, or just want to 
                add some randomness to your day, our generators deliver instant results.
              </p>
              <p className="text-gray-300 mt-4">
                All generators use fair random algorithms to ensure truly unpredictable results. Perfect for 
                teachers, game masters, content creators, and anyone who needs a touch of randomness.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

