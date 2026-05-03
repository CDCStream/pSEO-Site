import Link from 'next/link';
import { Languages, ArrowRight, ShieldCheck, Music } from 'lucide-react';

const converterTools = [
  {
    name: 'Chinese to English Translator',
    description: 'AI-powered Chinese to English translation. Translate Simplified & Traditional Chinese text instantly with accurate context-aware results.',
    href: '/converters/chinese-to-english-translator/',
    icon: Languages,
    color: 'from-red-500 to-rose-400',
    tags: ['Chinese', 'English', 'AI Translation', 'Mandarin'],
  },
  {
    name: 'Plagiarism Checker',
    description: 'Free hybrid plagiarism checker that combines AI detection with live web search. Find AI-generated content and matching web sources.',
    href: '/converters/plagiarism-checker/',
    icon: ShieldCheck,
    color: 'from-rose-500 to-pink-400',
    tags: ['AI Detection', 'Originality', 'Web Search', 'Free'],
  },
  {
    name: 'YouTube to MP3 Converter',
    description: 'Convert YouTube videos to MP3 audio or MP4 video. Free, fast, no sign-up required. Supports 128/192/320 kbps audio and up to 1080p video.',
    href: '/converters/youtube-to-mp3/',
    icon: Music,
    color: 'from-red-500 to-orange-400',
    tags: ['YouTube', 'MP3', 'MP4', 'Free Downloader'],
  },
];

export const metadata = {
  title: 'Free Online Converters & Translators - AI-Powered | MakerSilo',
  description: 'Explore our collection of free AI-powered converters and translators. Chinese to English translator and more language tools.',
  keywords: 'online translator, free translator, chinese to english, AI translator, language converter, translation tool',
  openGraph: {
    title: 'Free Online Converters & Translators - AI-Powered',
    description: 'Explore our collection of free AI-powered converters and translators.',
    type: 'website',
  },
};

export default function ConvertersPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-4">
              <Languages className="w-4 h-4" />
              Converters & Translators
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Converters & Translators
            </h1>
            <p className="text-xl text-gray-400">
              AI-powered translation and conversion tools.
              Accurate, fast, and completely free to use.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {converterTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-rose-500/30 transition-all duration-300 hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-rose-400 transition-colors">
                      {tool.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2">{tool.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] text-gray-400">{tag}</span>
                  ))}
                </div>
              </Link>
            );
          })}

          <div className="bg-white/[0.02] rounded-2xl border border-dashed border-white/10 p-6 flex items-center justify-center">
            <p className="text-gray-600 text-sm text-center">More translators & converters coming soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
}
