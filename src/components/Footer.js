import Link from 'next/link';
import Image from 'next/image';

// Inline SVG icons to reduce bundle size
const TwitterIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const GithubIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);
const MailIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

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
<Link href="/" prefetch={false} className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="MakerSilo Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-xl font-bold text-white">MakerSilo</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Free online tools for creators. Transform text, make memes, and create beautiful content.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Email">
                <MailIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Text Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className="text-sm text-gray-400 hover:text-white transition-colors">
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
                  <Link href={link.href} prefetch={false} className="text-sm text-gray-400 hover:text-white transition-colors">
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
                  <Link href={link.href} prefetch={false} className="text-sm text-gray-400 hover:text-white transition-colors">
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
                  <Link href={link.href} prefetch={false} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MakerSilo. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" prefetch={false} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" prefetch={false} className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" prefetch={false} className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
