import { notFound } from 'next/navigation';
import { generatorsConfig, siteConfig } from '@/config/pSEO-data';
import NameGeneratorClient from './NameGeneratorClient';
import YouTubeNameClient from './YouTubeNameClient';
import PodcastNameClient from './PodcastNameClient';
import BandNameClient from './BandNameClient';
import AnimeNameClient from './AnimeNameClient';
import CoupleNameClient from './CoupleNameClient';
import RobloxNameClient from './RobloxNameClient';
import GamingNameClient from './GamingNameClient';
import AestheticYouTubeNameClient from './AestheticYouTubeNameClient';
/* ===== GEO: SEO Components ===== */
import KeyTakeaway from '@/components/SEO/KeyTakeaway';
import TechnicalProcess from '@/components/SEO/TechnicalProcess';
import FAQSection from '@/components/SEO/FAQSection';
import LongContent from '@/components/SEO/LongContent';

// Generate static params for all generator pages
export async function generateStaticParams() {
  return Object.keys(generatorsConfig).map((slug) => ({ slug }));
}

// Generate metadata for each page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = generatorsConfig[slug];

  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
    keywords: [config.keyword, 'name generator', 'free online tool', 'random name', 'AI generator'],
    alternates: {
      canonical: `${siteConfig.url}/generators/${slug}`,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${siteConfig.url}/generators/${slug}`,
      siteName: siteConfig.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
  };
}

/* GEO: AI-powered generator technical steps */
const aiGeneratorSteps = [
  'You fill in the input fields describing your preferences.',
  'Your request is sent to our AI engine (powered by Claude) for processing.',
  'The AI analyzes your input and generates creative, unique name suggestions.',
  'Results are displayed instantly — pick your favorites.',
  'Click to copy any name directly to your clipboard.',
];

export default async function GeneratorPage({ params }) {
  const { slug } = await params;
  const config = generatorsConfig[slug];

  if (!config) {
    notFound();
  }

  /* GEO: SoftwareApplication + WebApplication JSON-LD */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.name,
    description: config.description,
    url: `${siteConfig.url}/generators/${slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Organization',
      name: 'MakerSilo',
      url: 'https://makersilo.com',
    },
    datePublished: '2025-01-01',
    inLanguage: 'en',
  };

  /* GEO: Key takeaway summary */
  const keyTakeawaySummary = `${config.name} is a free AI-powered tool by MakerSilo. ${config.description} Powered by Claude AI — no signup required.`;

  return (
    <>
      {/* GEO: WebApplication JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-950 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {config.h1}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {config.subtitle}
            </p>
          </div>

          {/* GEO: Key Takeaway — AI featured snippet */}
          <div className="max-w-4xl mx-auto mb-6">
            <KeyTakeaway toolName={config.name} summary={keyTakeawaySummary} />
          </div>

          {/* Tool Interface — UNTOUCHED */}
          <div className="max-w-4xl mx-auto mb-12">
            {slug === 'youtube-name-generator' ? (
              <YouTubeNameClient config={config} />
            ) : slug === 'podcast-name-generator' ? (
              <PodcastNameClient config={config} />
            ) : slug === 'band-name-generator' ? (
              <BandNameClient config={config} />
            ) : slug === 'anime-name-generator' ? (
              <AnimeNameClient config={config} />
            ) : slug === 'couple-name-generator' ? (
              <CoupleNameClient config={config} />
            ) : slug === 'roblox-username-generator' ? (
              <RobloxNameClient config={config} />
            ) : slug === 'gaming-name-generator' ? (
              <GamingNameClient config={config} />
            ) : slug === 'aesthetic-youtube-name-generator' ? (
              <AestheticYouTubeNameClient config={config} />
            ) : (
              <NameGeneratorClient config={config} slug={slug} />
            )}
          </div>

          {/* GEO: Technical Process — Trust & E-E-A-T */}
          <div className="max-w-4xl mx-auto mb-12">
            <TechnicalProcess toolName={config.name} steps={aiGeneratorSteps} />
          </div>

          {/* GEO: FAQ Section with FAQPage JSON-LD schema */}
          {config.faq && config.faq.length > 0 && (
            <div className="max-w-4xl mx-auto mb-12">
              <FAQSection faqs={config.faq} keyword={config.keyword} />
            </div>
          )}

          {/* GEO: Long Content — <article> with lead emphasis */}
          {config.longContent && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <LongContent content={config.longContent} keyword={config.name} />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
