'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
// Only import icons that are always visible
import { Menu, X, ChevronDown } from 'lucide-react';

// Simple inline SVG icons to avoid loading full lucide bundle
const TypeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>
);
const SparklesIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
);
const ImageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);
const PaletteIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>
);

const navItems = [
  {
    label: 'Text Tools',
    href: '/tools',
    icon: TypeIcon,
    color: 'from-orange-500 to-amber-500',
    items: [
      { label: 'Small Text Generator', href: '/tools/small-text-generator' },
      { label: 'Glitch Text Generator', href: '/tools/glitch-text-generator' },
      { label: 'Gothic Font', href: '/tools/gothic-font' },
      { label: 'Bubble Font', href: '/tools/bubble-font' },
      { label: 'Morse Code Generator', href: '/tools/morse-code-generator' },
      { label: 'Text to Binary', href: '/tools/text-to-binary' },
    ],
  },
  {
    label: 'Symbols',
    href: '/symbols',
    icon: SparklesIcon,
    color: 'from-purple-500 to-pink-500',
    items: [
      { label: 'Music Symbols', href: '/symbols/music-symbols' },
      { label: 'Heart Symbols', href: '/symbols/heart-symbol-copy-paste' },
      { label: 'Japanese Symbols', href: '/symbols/japanese-symbols' },
      { label: 'Kaomoji List', href: '/symbols/kaomoji-list' },
      { label: 'Religious Symbols', href: '/symbols/religious-symbols' },
    ],
  },
  {
    label: 'Meme Maker',
    href: '/meme-maker',
    icon: ImageIcon,
    color: 'from-green-500 to-emerald-500',
    items: [
      { label: 'Drake Meme', href: '/meme-maker/drake-meme' },
      { label: 'Speech Bubble Meme', href: '/meme-maker/speech-bubble-meme' },
      { label: 'Bernie Sanders Meme', href: '/meme-maker/bernie-sanders-meme' },
      { label: 'Change My Mind', href: '/meme-maker/change-my-mind-meme' },
    ],
  },
  {
    label: 'Wallpapers',
    href: '/wallpapers',
    icon: PaletteIcon,
    color: 'from-blue-500 to-cyan-500',
    items: [
      { label: 'Solid Color Backgrounds', href: '/wallpapers/solid-color-backgrounds' },
      { label: 'Gradient Wallpaper', href: '/wallpapers/gradient-wallpaper-generator' },
      { label: 'Aesthetic Wallpaper', href: '/wallpapers/aesthetic-wallpaper' },
    ],
  },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <header className="sticky top-0 z-50 bg-glass-dark">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
{/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <NextImage
              src="/logo.png"
              alt="MakerSilo Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="text-xl font-bold text-white tracking-tight">
              Maker<span className="text-gradient">Silo</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                </Link>

                {/* Dropdown */}
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-56 py-2 bg-[#1a1a2e] rounded-xl border border-white/10 shadow-xl animate-fade-in">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                    <div className="border-t border-white/10 mt-2 pt-2 px-4">
                      <Link
                        href={item.href}
                        className="text-xs text-gray-500 hover:text-orange-400 transition-colors"
                      >
                        View all →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 animate-fade-in">
            {navItems.map((item) => (
              <div key={item.label} className="py-2">
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-base font-medium text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  {item.label}
                </Link>
                <div className="ml-16 mt-1 space-y-1">
                  {item.items.slice(0, 3).map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className="block py-1 text-sm text-gray-400 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}


