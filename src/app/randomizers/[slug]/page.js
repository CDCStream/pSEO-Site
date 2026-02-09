import { notFound } from 'next/navigation';
import { randomizersConfig, siteConfig } from '@/config/pSEO-data';
import RandomizerClient from './RandomizerClient';
/* ===== GEO: SEO Components ===== */
import KeyTakeaway from '@/components/SEO/KeyTakeaway';
import TechnicalProcess from '@/components/SEO/TechnicalProcess';
import FAQSection from '@/components/SEO/FAQSection';
import LongContent from '@/components/SEO/LongContent';

// Generate static params for all randomizer pages
export async function generateStaticParams() {
  return Object.keys(randomizersConfig).map((slug) => ({ slug }));
}

// Generate metadata for each page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = randomizersConfig[slug];

  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
    keywords: [config.keyword, 'random generator', 'free online tool', 'random picker'],
    alternates: {
      canonical: `${siteConfig.url}/randomizers/${slug}`,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${siteConfig.url}/randomizers/${slug}`,
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

/* GEO: Randomizer technical steps */
const randomizerTechSteps = [
  'Click the "Generate" button to start the randomization process.',
  'A cryptographically random selection is made from the curated dataset.',
  'The result is displayed instantly with relevant details and images.',
  'Click again to generate a new random result.',
  'Works entirely in your browser — no data is collected.',
];

export default async function RandomizerPage({ params }) {
  const { slug } = await params;
  const config = randomizersConfig[slug];

  if (!config) {
    notFound();
  }

  /* GEO: Enhanced WebApplication JSON-LD */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.name,
    description: config.description,
    url: `${siteConfig.url}/randomizers/${slug}`,
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
  const keyTakeawaySummary = `${config.name} is a free random generator by MakerSilo. ${config.description} Click to generate — no signup required.`;

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

          {/* GEO: Key Takeaway */}
          <div className="max-w-4xl mx-auto mb-6">
            <KeyTakeaway toolName={config.name} summary={keyTakeawaySummary} />
          </div>

          {/* Tool Interface — UNTOUCHED */}
          <div className="max-w-4xl mx-auto mb-12">
            <RandomizerClient config={config} slug={slug} />
          </div>

          {/* GEO: Technical Process */}
          <div className="max-w-4xl mx-auto mb-12">
            <TechnicalProcess toolName={config.name} steps={randomizerTechSteps} />
          </div>

          {/* GEO: FAQ Section with JSON-LD */}
          {config.faq && config.faq.length > 0 && (
            <div className="max-w-4xl mx-auto mb-12">
              <FAQSection faqs={config.faq} keyword={config.keyword} />
            </div>
          )}

          {/* GEO: Long Content */}
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
