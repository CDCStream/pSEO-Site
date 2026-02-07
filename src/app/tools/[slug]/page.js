import { notFound } from 'next/navigation';
import { toolsConfig, getSlugsForCategory } from '@/config/pSEO-data';
import TextToolClient from './TextToolClient';
import MinecraftTextClient from './MinecraftTextClient';
import QRCodeClient from './QRCodeClient';
import DissTrackClient from './DissTrackClient';
import TierListClient from './TierListClient';
import YouTubeChannelIdeaClient from './YouTubeChannelIdeaClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';

// Generate static paths for all tools
export async function generateStaticParams() {
  const slugs = getSlugsForCategory('tools');
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for each page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = toolsConfig[slug];

  if (!config) {
    return { title: 'Tool Not Found' };
  }

  return {
    title: config.title,
    description: config.description,
    keywords: `${config.keyword}, free ${config.keyword}, online ${config.keyword}, ${config.keyword} for Instagram, ${config.keyword} for Discord`,
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const config = toolsConfig[slug];

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Schema */}
      <ToolSchema
        name={config.name}
        description={config.description}
        category="tools"
        url={`https://makersilo.com/tools/${slug}`}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

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
          {/* Main Column */}
          <div className="flex-1 min-w-0">
            {/* Ad Above Tool */}
            <AdSlot position="above-tool" />

            {/* Tool Interface */}
            {slug === 'minecraft-font' ? (
              <MinecraftTextClient config={config} />
            ) : config.generatorType === 'qr' || config.generatorType === 'wifiQr' || config.generatorType === 'barcode' ? (
              <QRCodeClient config={config} slug={slug} />
            ) : config.generatorType === 'dissTrack' ? (
              <DissTrackClient config={config} slug={slug} />
            ) : config.generatorType === 'tierList' ? (
              <TierListClient config={config} slug={slug} />
            ) : config.generatorType === 'youtubeIdea' ? (
              <YouTubeChannelIdeaClient config={config} />
            ) : (
              <TextToolClient config={config} slug={slug} />
            )}

            {/* How to Use */}
            <HowToUse keyword={config.keyword} />

            {/* FAQ Section */}
            <FAQSection faqs={config.faq} keyword={config.keyword} />

            {/* Long Content */}
            <LongContent content={config.longContent} keyword={config.keyword} />

            {/* Ad Below Content */}
            <AdSlot position="below-content" />
          </div>

          {/* Sidebar Ad */}
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
