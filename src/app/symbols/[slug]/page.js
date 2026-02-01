import { notFound } from 'next/navigation';
import { symbolsConfig, symbolCollections, getSlugsForCategory } from '@/config/pSEO-data';
import SymbolsClient from './SymbolsClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Copy, MousePointer, Share2, Sparkles } from 'lucide-react';

// Generate static paths
export async function generateStaticParams() {
  const slugs = getSlugsForCategory('symbols');
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = symbolsConfig[slug];

  if (!config) {
    return { title: 'Symbols Not Found' };
  }

  return {
    title: config.title,
    description: config.description,
    keywords: `${config.keyword}, ${config.keyword} copy paste, free ${config.keyword}`,
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
    },
  };
}

const symbolSteps = [
  {
    icon: MousePointer,
    title: 'Browse Symbols',
    description: 'Explore our curated collection of symbols below.',
  },
  {
    icon: Copy,
    title: 'Click to Copy',
    description: 'Simply click on any symbol to copy it to your clipboard.',
  },
  {
    icon: Share2,
    title: 'Paste Anywhere',
    description: 'Paste your symbol in any app - Instagram, Discord, Twitter, etc.',
  },
  {
    icon: Sparkles,
    title: 'Get Creative',
    description: 'Combine symbols to create unique patterns and expressions.',
  },
];

export default async function SymbolsPage({ params }) {
  const { slug } = await params;
  const config = symbolsConfig[slug];

  if (!config) {
    notFound();
  }

  const symbols = symbolCollections[config.symbolKey]?.symbols || [];

  return (
    <div className="min-h-screen">
      <ToolSchema
        name={config.name}
        description={config.description}
        category="symbols"
        url={`https://makersilo.com/symbols/${slug}`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

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

            <SymbolsClient symbols={symbols} name={config.name} />

            <HowToUse keyword={config.keyword} steps={symbolSteps} />
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
