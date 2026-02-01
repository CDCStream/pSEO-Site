import Link from 'next/link';
import {
  Type,
  Sparkles,
  Image,
  Palette,
  ArrowRight,
  Zap,
  Copy,
  Download,
  Globe,
  Shield
} from 'lucide-react';

const categories = [
  {
    title: 'Text Tools',
    description: 'Transform your text with unique fonts, styles, and encodings',
    href: '/tools',
    icon: Type,
    color: 'from-orange-500 to-amber-500',
    tools: ['Small Text', 'Glitch Text', 'Gothic Font', 'Morse Code'],
  },
  {
    title: 'Symbols',
    description: 'Copy and paste symbols, emojis, and special characters',
    href: '/symbols',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    tools: ['Music ♪', 'Hearts ❤', 'Kaomoji (◕‿◕)', 'Japanese あ'],
  },
  {
    title: 'Meme Maker',
    description: 'Create viral memes with our easy-to-use templates',
    href: '/meme-maker',
    icon: Image,
    color: 'from-green-500 to-emerald-500',
    tools: ['Drake Meme', 'Speech Bubble', 'Bernie Sanders', 'Change My Mind'],
  },
  {
    title: 'Wallpapers',
    description: 'Generate beautiful backgrounds for any device',
    href: '/wallpapers',
    icon: Palette,
    color: 'from-blue-500 to-cyan-500',
    tools: ['Solid Colors', 'Gradients', 'Aesthetic', 'Patterns'],
  },
];

const features = [
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Real-time transformations with zero wait time',
  },
  {
    icon: Copy,
    title: 'One-Click Copy',
    description: 'Copy anything to clipboard with a single click',
  },
  {
    icon: Download,
    title: 'Easy Downloads',
    description: 'Download images and wallpapers as high-quality PNGs',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'Compatible with all social media and messaging platforms',
  },
  {
    icon: Shield,
    title: '100% Free',
    description: 'No sign-ups, no limits, no hidden costs',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-8 animate-fade-in">
              <Zap className="w-4 h-4" />
              Free Online Tools for Creators
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
              Create. Transform.
              <span className="block text-gradient">Share Instantly.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-slide-up delay-100">
              Transform text into unique fonts, create viral memes, copy rare symbols,
              and generate stunning wallpapers — all in one place, completely free.
            </p>

            <div className="flex flex-wrap justify-center gap-4 animate-slide-up delay-200">
              <Link
                href="/tools"
                className="btn-primary px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2"
              >
                Start Creating
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/symbols"
                className="btn-secondary px-8 py-4 rounded-xl text-lg"
              >
                Browse Symbols
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-400 text-lg">
            Four powerful tool categories, endless creative possibilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-orange-500/30 transition-all duration-300 card-glow overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              <div className="relative">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gradient transition-all">
                  {category.title}
                </h3>
                <p className="text-gray-400 mb-6">
                  {category.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {category.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300 border border-white/10"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose TextForge?
            </h2>
            <p className="text-gray-400 text-lg">
              Built for speed, simplicity, and creative freedom
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Popular Tools
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Small Text ᵗⁱⁿʸ', href: '/tools/small-text-generator' },
            { label: 'Gothic 𝔉𝔬𝔫𝔱', href: '/tools/gothic-font' },
            { label: 'Glitch T̷̙̓e̴̢͠x̵̣̆t̵͇̐', href: '/tools/glitch-text-generator' },
            { label: 'Hearts ❤', href: '/symbols/heart-symbol-copy-paste' },
            { label: 'Kaomoji (◕‿◕)', href: '/symbols/kaomoji-list' },
            { label: 'Drake Meme', href: '/meme-maker/drake-meme' },
            { label: 'Music ♪♫', href: '/symbols/music-symbols' },
            { label: 'Solid Colors', href: '/wallpapers/solid-color-backgrounds' },
            { label: 'Gradients', href: '/wallpapers/gradient-wallpaper-generator' },
            { label: 'Morse ·-·', href: '/tools/morse-code-generator' },
            { label: 'Binary 01', href: '/tools/text-to-binary' },
            { label: 'Bubbles ⓑ', href: '/tools/bubble-font' },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center text-sm text-gray-300 hover:text-white hover:border-orange-500/30 hover:bg-white/10 transition-all"
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-90" />
          <div className="absolute inset-0 pattern-grid opacity-20" />

          <div className="relative px-8 py-12 sm:px-12 sm:py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Create Something Amazing?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of creators using TextForge every day.
              No sign-up required — just start creating.
            </p>
            <Link
              href="/tools/small-text-generator"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
            >
              Try Small Text Generator
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


