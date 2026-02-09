import { notFound } from 'next/navigation';
import { symbolsConfig, symbolCollections, getSlugsForCategory } from '@/config/pSEO-data';
import SymbolsClient from './SymbolsClient';
import AdSlot from '@/components/AdSlot';
/* ===== GEO: SEO Components ===== */
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import KeyTakeaway from '@/components/SEO/KeyTakeaway';
import TechnicalProcess from '@/components/SEO/TechnicalProcess';

/* Inline SVG icons — no lucide-react dependency */
const MousePointerSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>
);
const CopySvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const ShareSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
);
const SparklesSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
);

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
    alternates: {
      canonical: `https://makersilo.com/symbols/${slug}`,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      url: `https://makersilo.com/symbols/${slug}`,
      siteName: 'MakerSilo',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
  };
}

const symbolSteps = [
  {
    icon: MousePointerSvg,
    title: 'Browse Symbols',
    description: 'Explore our curated collection of symbols below.',
  },
  {
    icon: CopySvg,
    title: 'Click to Copy',
    description: 'Simply click on any symbol to copy it to your clipboard.',
  },
  {
    icon: ShareSvg,
    title: 'Paste Anywhere',
    description: 'Paste your symbol in any app — Instagram, Discord, Twitter, etc.',
  },
  {
    icon: SparklesSvg,
    title: 'Get Creative',
    description: 'Combine symbols to create unique patterns and expressions.',
  },
];

/* GEO: Symbol page technical steps */
const symbolTechSteps = [
  'Browse the curated symbol collection on this page.',
  'Click any symbol to instantly copy it to your clipboard using the Clipboard API.',
  'A confirmation toast appears to let you know the copy was successful.',
  'Paste the symbol anywhere: Instagram bio, Discord username, Twitter post, or any text field.',
  'All symbols are Unicode-based and work on every device and platform.',
];

export default async function SymbolsPage({ params }) {
  const { slug } = await params;
  const config = symbolsConfig[slug];

  if (!config) {
    notFound();
  }

  const symbols = symbolCollections[config.symbolKey]?.symbols || [];

  /* GEO: Key takeaway summary */
  const keyTakeawaySummary = `${config.name} — a free collection of copy-paste symbols by MakerSilo. ${config.description} Click any symbol to copy it instantly. Works on all platforms.`;

  return (
    <div className="min-h-screen">
      {/* GEO: Enhanced SoftwareApplication Schema */}
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
            {/* GEO: Key Takeaway — AI featured snippet */}
            <KeyTakeaway toolName={config.name} summary={keyTakeawaySummary} />

            <AdSlot position="above-tool" />

            {/* Symbol Grid — UNTOUCHED */}
            <SymbolsClient symbols={symbols} name={config.name} />

            {/* GEO: Technical Process */}
            <TechnicalProcess toolName={config.name} steps={symbolTechSteps} />

            {/* GEO: How to Use — Semantic <ol> */}
            <HowToUse keyword={config.keyword} steps={symbolSteps} />

            {/* GEO: FAQ Section — FAQPage Schema */}
            <FAQSection faqs={config.faq} keyword={config.keyword} />

            {/* GEO: Long Content — <article> */}
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
