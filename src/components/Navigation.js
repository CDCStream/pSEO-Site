'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  Type,
  Sparkles,
  Image,
  Palette,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

const navItems = [
  {
    label: 'Text Tools',
    href: '/tools',
    icon: Type,
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
    icon: Sparkles,
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
    icon: Image,
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
    icon: Palette,
    color: 'from-blue-500 to-cyan-500',
    items: [
      { label: 'Solid Color Backgrounds', href: '/wallpapers/solid-color-backgrounds' },
      { label: 'Gradient Wallpaper', href: '/wallpapers/gradient-wallpaper-generator' },
      { label: 'Aesthetic Wallpaper', href: '/wallpapers/aesthetic-wallpaper' },
      { label: 'Christmas Wallpaper', href: '/wallpapers/christmas-wallpaper' },
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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 transform group-hover:scale-105 transition-transform">
              <NextImage
                src="/logo.png"
                alt="MakerSilo Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
                loading="eager"
              />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
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


