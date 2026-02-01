import { notFound } from 'next/navigation';
import { wallpapersConfig, getSlugsForCategory } from '@/config/pSEO-data';
import WallpaperClient from './WallpaperClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import { ImageGallerySchema } from '@/components/SEO/ToolSchema';
import { Palette, Sliders, Download, Monitor } from 'lucide-react';

export async function generateStaticParams() {
  const slugs = getSlugsForCategory('wallpapers');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const config = wallpapersConfig[params.slug];

  if (!config) {
    return { title: 'Wallpaper Not Found' };
  }

  return {
    title: config.title,
    description: config.description,
    keywords: `${config.keyword}, free ${config.keyword}, ${config.keyword} download`,
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
    },
  };
}

const wallpaperSteps = [
  {
    icon: Palette,
    title: 'Choose Colors',
    description: 'Select your preferred colors using the color picker or presets.',
  },
  {
    icon: Sliders,
    title: 'Customize',
    description: 'Adjust settings like size, style, and additional options.',
  },
  {
    icon: Monitor,
    title: 'Preview',
    description: 'See your wallpaper update in real-time as you make changes.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download your wallpaper as a high-quality PNG file.',
  },
];

export default function WallpaperPage({ params }) {
  const config = wallpapersConfig[params.slug];

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <ImageGallerySchema
        name={config.name}
        description={config.description}
        images={[]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {config.h1}
            </h1>
            <p className="text-lg text-gray-400">
              {config.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <WallpaperClient config={config} slug={params.slug} />

            <HowToUse keyword={config.keyword} steps={wallpaperSteps} />
            <FAQSection faqs={config.faq} keyword={config.keyword} />
            <LongContent content={config.longContent} keyword={config.keyword} />

            <AdSlot position="below-content" />
          </div>

          <div className="hidden xl:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdSlot position="sidebar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

