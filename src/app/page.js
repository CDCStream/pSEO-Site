import Link from 'next/link';

// Disable prefetching to reduce initial load
const linkProps = { prefetch: false };

// Inline SVG icons for better performance - no external library needed
const TypeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>
);
const SparklesIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
);
const ImageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);
const PaletteIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>
);
const LetterAIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h1.5l1-3h11l1 3H19L13 4h-2L5 20"/><path d="M7 14h10"/></svg>
);
const CalculatorIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
);
const ArrowRightIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const ZapIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
);
const CopyIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const DownloadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
const GlobeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);
const ShieldIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
);

const categories = [
  {
    title: 'Text Tools',
    description: 'Transform your text with unique fonts, styles, and encodings',
    href: '/tools',
    icon: TypeIcon,
    color: 'from-orange-500 to-amber-500',
    tools: ['Small Text', 'Glitch Text', 'Gothic Font', 'Morse Code'],
  },
  {
    title: 'Symbols',
    description: 'Copy and paste symbols, emojis, and special characters',
    href: '/symbols',
    icon: SparklesIcon,
    color: 'from-purple-500 to-pink-500',
    tools: ['Music ♪', 'Hearts ❤', 'Kaomoji (◕‿◕)', 'Japanese あ'],
  },
  {
    title: 'Letter Art',
    description: 'Create stunning letter art with bubble fonts, outlines, and shadow effects',
    href: '/tools/letter-art',
    icon: LetterAIcon,
    color: 'from-pink-500 to-rose-500',
    tools: ['Bubble Letters', 'Custom Fonts', 'Shadow Effects', 'Transparent PNG'],
  },
  {
    title: 'Meme Maker',
    description: 'Create viral memes with our easy-to-use templates',
    href: '/meme-maker',
    icon: ImageIcon,
    color: 'from-green-500 to-emerald-500',
    tools: ['Drake Meme', 'Speech Bubble', 'Bernie Sanders', 'Change My Mind'],
  },
  {
    title: 'Wallpapers',
    description: 'Generate beautiful backgrounds for any device',
    href: '/wallpapers',
    icon: PaletteIcon,
    color: 'from-blue-500 to-cyan-500',
    tools: ['Solid Colors', 'Gradients', 'Aesthetic', 'Patterns'],
  },
  {
    title: 'Calculators',
    description: 'AI-powered calculators and predictors for everyday decisions',
    href: '/calculators',
    icon: CalculatorIcon,
    color: 'from-cyan-500 to-teal-500',
    tools: ['Snow Day Predictor', 'AI Analysis', 'Weather Data', 'School Closures'],
  },
];

const features = [
  {
    icon: ZapIcon,
    title: 'Instant Results',
    description: 'Real-time transformations with zero wait time',
  },
  {
    icon: CopyIcon,
    title: 'One-Click Copy',
    description: 'Copy anything to clipboard with a single click',
  },
  {
    icon: DownloadIcon,
    title: 'Easy Downloads',
    description: 'Download images and wallpapers as high-quality PNGs',
  },
  {
    icon: GlobeIcon,
    title: 'Works Everywhere',
    description: 'Compatible with all social media and messaging platforms',
  },
  {
    icon: ShieldIcon,
    title: '100% Free',
    description: 'No sign-ups, no limits, no hidden costs',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - No animations for better LCP */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
              <ZapIcon className="w-4 h-4" />
              Free Online Tools for Creators
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5">
              Create. Transform.
              <span className="block text-orange-400">Share Instantly.</span>
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Transform text into unique fonts, create viral memes, copy rare symbols,
              and generate stunning wallpapers — all in one place, completely free.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tools"
                prefetch={false}
                className="btn-primary px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2"
              >
                Start Creating
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/symbols"
                prefetch={false}
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
            Powerful tool categories for endless creative possibilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              prefetch={false}
              className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 hover:border-orange-500/30 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {category.title}
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                {category.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-1 rounded-full bg-white/5 text-xs text-gray-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features - Lazy loaded */}
      <section className="border-y border-white/10 lazy-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            Why Choose MakerSilo?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-4 rounded-xl bg-white/5"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lazy-section">
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
              prefetch={false}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center text-sm text-gray-300 hover:text-white hover:border-orange-500/30 hover:bg-white/10 transition-all"
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA - Simplified */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lazy-section">
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-10 sm:px-10 sm:py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-white/90 mb-6 max-w-lg mx-auto">
            Join thousands of creators using MakerSilo every day.
          </p>
          <Link
            href="/tools/small-text-generator"
            prefetch={false}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold"
          >
            Try Small Text Generator
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}


