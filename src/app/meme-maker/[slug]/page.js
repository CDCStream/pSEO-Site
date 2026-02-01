import { notFound } from 'next/navigation';
import { memeMakerConfig, getSlugsForCategory } from '@/config/pSEO-data';
import MemeClient from './MemeClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Image, Type, Download, Share2 } from 'lucide-react';

export async function generateStaticParams() {
  const slugs = getSlugsForCategory('meme-maker');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const config = memeMakerConfig[params.slug];

  if (!config) {
    return { title: 'Meme Not Found' };
  }

  return {
    title: config.title,
    description: config.description,
    keywords: `${config.keyword}, free ${config.keyword}, ${config.keyword} online`,
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
    },
  };
}

const memeSteps = [
  {
    icon: Image,
    title: 'Choose Template',
    description: 'Select your meme template from our collection.',
  },
  {
    icon: Type,
    title: 'Add Your Text',
    description: 'Enter your custom text in the provided fields.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download your meme as a high-quality PNG image.',
  },
  {
    icon: Share2,
    title: 'Share & Enjoy',
    description: 'Post your meme on social media and spread the laughs.',
  },
];

export default function MemePage({ params }) {
  const config = memeMakerConfig[params.slug];

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <ToolSchema
        name={config.name}
        description={config.description}
        category="meme-maker"
        url={`https://textforge.tools/meme-maker/${params.slug}`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

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

            <MemeClient config={config} slug={params.slug} />

            <HowToUse keyword={config.keyword} steps={memeSteps} />
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

