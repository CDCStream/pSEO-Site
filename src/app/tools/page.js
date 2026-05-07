import Link from 'next/link';
import { Type, Zap, Minimize2, Strikethrough, Radio, Binary, Crown, Circle, Gamepad2, ArrowRight, Quote } from 'lucide-react';
import { toolsConfig } from '@/config/pSEO-data';

const featuredTools = [
  {
    href: '/tools/ama-citation-generator/',
    name: 'AMA Citation Generator',
    subtitle: 'Auto-cite by URL, DOI, PubMed PMID, or ISBN. Build a full AMA 11 reference list with in-text superscripts. Export to Word, BibTeX, or plain text.',
    Icon: Quote,
    accent: 'from-blue-500 to-cyan-500',
    badge: 'AMA 11',
  },
];

const iconMap = {
  'type': Type,
  'zap': Zap,
  'minimize-2': Minimize2,
  'strikethrough': Strikethrough,
  'radio': Radio,
  'binary': Binary,
  'crown': Crown,
  'circle': Circle,
  'gamepad-2': Gamepad2,
};

export const metadata = {
  title: 'Free Text Tools - Transform Your Text Online | MakerSilo',
  description: 'Explore our collection of free text transformation tools. Generate small text, glitch text, gothic fonts, morse code, and more.',
};

export default function ToolsPage() {
  const tools = Object.entries(toolsConfig).map(([slug, config]) => ({
    slug,
    ...config,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
              <Type className="w-4 h-4" />
              Text Transformation Tools
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Text Tools
            </h1>
            <p className="text-xl text-gray-400">
              Transform your regular text into unique fonts, styles, and encodings.
              Perfect for social media, gaming, and creative projects.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Tools (custom-built tools that aren't part of toolsConfig) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredTools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group relative bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-blue-500/30 transition-all duration-300 hover:bg-white/[0.07]"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${t.accent} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <t.Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{t.name}</h2>
                    {t.badge && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">{t.badge}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{t.subtitle}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = iconMap[tool.icon] || Type;

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}/`}
                className="group relative bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-orange-500/30 transition-all duration-300 hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                      {tool.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {tool.subtitle}
                    </p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}


