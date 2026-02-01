import Link from 'next/link';
import { Zap, Github, Twitter, Mail } from 'lucide-react';

const footerLinks = {
  tools: [
    { label: 'Small Text Generator', href: '/tools/small-text-generator' },
    { label: 'Glitch Text Generator', href: '/tools/glitch-text-generator' },
    { label: 'Gothic Font', href: '/tools/gothic-font' },
    { label: 'Morse Code', href: '/tools/morse-code-generator' },
    { label: 'Text to Binary', href: '/tools/text-to-binary' },
  ],
  symbols: [
    { label: 'Music Symbols', href: '/symbols/music-symbols' },
    { label: 'Heart Symbols', href: '/symbols/heart-symbol-copy-paste' },
    { label: 'Japanese Symbols', href: '/symbols/japanese-symbols' },
    { label: 'Kaomoji', href: '/symbols/kaomoji-list' },
  ],
  wallpapers: [
    { label: 'Solid Colors', href: '/wallpapers/solid-color-backgrounds' },
    { label: 'Gradient Wallpapers', href: '/wallpapers/gradient-wallpaper-generator' },
    { label: 'Aesthetic Wallpapers', href: '/wallpapers/aesthetic-wallpaper' },
  ],
  memes: [
    { label: 'Drake Meme', href: '/meme-maker/drake-meme' },
    { label: 'Speech Bubble', href: '/meme-maker/speech-bubble-meme' },
    { label: 'Change My Mind', href: '/meme-maker/change-my-mind-meme' },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">TextForge</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Free online tools for creators. Transform text, make memes, and create beautiful content.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Text Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Symbols</h3>
            <ul className="space-y-2">
              {footerLinks.symbols.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Wallpapers</h3>
            <ul className="space-y-2">
              {footerLinks.wallpapers.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Meme Maker</h3>
            <ul className="space-y-2">
              {footerLinks.memes.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} TextForge. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


