import { notFound } from 'next/navigation';
import { memeMakerConfig, getSlugsForCategory } from '@/config/pSEO-data';
import MemeClient from './MemeClient';
import AdSlot from '@/components/AdSlot';
/* ===== GEO: SEO Components ===== */
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import KeyTakeaway from '@/components/SEO/KeyTakeaway';
import TechnicalProcess from '@/components/SEO/TechnicalProcess';

/* Inline SVG icons — no lucide-react dependency */
const ImageSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);
const TypeSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>
);
const DownloadSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
const ShareSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
);

export async function generateStaticParams() {
  const slugs = getSlugsForCategory('meme-maker');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = memeMakerConfig[slug];

  if (!config) {
    return { title: 'Meme Not Found' };
  }

  return {
    title: config.title,
    description: config.description,
    keywords: `${config.keyword}, free ${config.keyword}, ${config.keyword} online`,
    alternates: {
      canonical: `https://makersilo.com/meme-maker/${slug}`,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      url: `https://makersilo.com/meme-maker/${slug}`,
      siteName: 'MakerSilo',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
  };
}

const memeSteps = [
  {
    icon: ImageSvg,
    title: 'Choose Template',
    description: 'Select your meme template from our collection.',
  },
  {
    icon: TypeSvg,
    title: 'Add Your Text',
    description: 'Enter your custom text in the provided fields.',
  },
  {
    icon: DownloadSvg,
    title: 'Download',
    description: 'Download your meme as a high-quality PNG image.',
  },
  {
    icon: ShareSvg,
    title: 'Share & Enjoy',
    description: 'Post your meme on social media and spread the laughs.',
  },
];

/* GEO: Meme maker technical steps */
const memeTechSteps = [
  'Select a meme template from our curated collection.',
  'The template image is loaded onto an HTML5 Canvas element.',
  'Type your custom text — it\'s rendered onto the image in real-time.',
  'Click "Download" to export the meme as a high-quality PNG file.',
  'Share your creation on Instagram, Twitter, Reddit, or any platform.',
];

export default async function MemePage({ params }) {
  const { slug } = await params;
  const config = memeMakerConfig[slug];

  if (!config) {
    notFound();
  }

  /* GEO: Key takeaway summary */
  const keyTakeawaySummary = `${config.name} is a free online meme generator by MakerSilo. ${config.description} No watermark, no signup — download instantly.`;

  return (
    <div className="min-h-screen">
      {/* GEO: Enhanced Schema */}
      <ToolSchema
        name={config.name}
        description={config.description}
        category="meme-maker"
        url={`https://makersilo.com/meme-maker/${slug}`}
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
            {/* GEO: Key Takeaway */}
            <KeyTakeaway toolName={config.name} summary={keyTakeawaySummary} />

            <AdSlot position="above-tool" />

            {/* Meme Tool — UNTOUCHED */}
            <MemeClient config={config} slug={slug} />

            {/* GEO: Technical Process */}
            <TechnicalProcess toolName={config.name} steps={memeTechSteps} />

            {/* GEO: How to Use — Semantic <ol> */}
            <HowToUse keyword={config.keyword} steps={memeSteps} />

            {/* GEO: FAQ Section */}
            <FAQSection faqs={config.faq} keyword={config.keyword} />

            {/* GEO: Long Content */}
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
