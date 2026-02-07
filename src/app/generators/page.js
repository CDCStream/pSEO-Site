import Link from 'next/link';
import { generatorsConfig, siteConfig } from '@/config/pSEO-data';

export const metadata = {
  title: 'Name Generators - Creative Name Ideas | MakerSilo',
  description: 'Free name generators for gaming, roleplay, and creative projects. Generate Japanese names, elf names, gamertags, ship names, and more.',
  alternates: {
    canonical: `${siteConfig.url}/generators`,
  },
};

const iconMap = {
  'user': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  'wand': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
    </svg>
  ),
  'gamepad': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7v4m-6-4v4m12 2a3 3 0 01-3 3H6a3 3 0 01-3-3V8a3 3 0 013-3h12a3 3 0 013 3v5z" />
    </svg>
  ),
  'heart': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  'mic': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  'music': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  'sparkles': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  'ship': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
};

export default function GeneratorsPage() {
  const generators = Object.entries(generatorsConfig).map(([slug, config]) => ({
    slug,
    ...config,
  }));

  return (
    <main className="min-h-screen bg-gray-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Name <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Generators</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Creative name generators for gaming, roleplay, writing, and creative projects. Find the perfect name instantly.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {generators.map((tool) => (
            <Link
              key={tool.slug}
              href={`/generators/${tool.slug}`}
              prefetch={false}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-orange-500/30"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                {iconMap[tool.icon] || iconMap['user']}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{tool.name}</h3>
              <p className="text-gray-400 text-sm">{tool.description.substring(0, 100)}...</p>
            </Link>
          ))}
        </div>

        {/* SEO Content */}
        <section className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">About Name Generators</h2>
            <div className="prose prose-invert prose-orange max-w-none">
              <p className="text-gray-300">
                Our name generators help you find the perfect names for characters, projects, and online identities. 
                Whether you need a fantasy name for roleplay, a gamertag for gaming, or a creative name for any purpose, 
                our generators deliver instant inspiration.
              </p>
              <p className="text-gray-300 mt-4">
                Each generator uses curated databases and intelligent combination algorithms to create authentic-feeling 
                names. Generate multiple options instantly and find the perfect name for any creative endeavor.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

