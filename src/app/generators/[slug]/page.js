import { notFound } from 'next/navigation';
import { generatorsConfig, siteConfig } from '@/config/pSEO-data';
import NameGeneratorClient from './NameGeneratorClient';
import YouTubeNameClient from './YouTubeNameClient';
import PodcastNameClient from './PodcastNameClient';
import BandNameClient from './BandNameClient';

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
    keywords: [config.keyword, 'name generator', 'free online tool', 'random name'],
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
  };
}

export default async function GeneratorPage({ params }) {
  const { slug } = await params;
  const config = generatorsConfig[slug];

  if (!config) {
    notFound();
  }

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.name,
    description: config.description,
    url: `${siteConfig.url}/generators/${slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
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

          {/* Tool Interface */}
          <div className="max-w-4xl mx-auto mb-12">
            {slug === 'youtube-name-generator' ? (
              <YouTubeNameClient config={config} />
            ) : slug === 'podcast-name-generator' ? (
              <PodcastNameClient config={config} />
            ) : slug === 'band-name-generator' ? (
              <BandNameClient config={config} />
            ) : (
              <NameGeneratorClient config={config} slug={slug} />
            )}
          </div>

          {/* FAQ Section */}
          {config.faq && config.faq.length > 0 && (
            <section className="max-w-4xl mx-auto mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {config.faq.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                    <p className="text-gray-400">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Long Content */}
          {config.longContent && (
            <section className="max-w-4xl mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">About {config.name}</h2>
                <div className="prose prose-invert prose-orange max-w-none">
                  {config.longContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-300 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

