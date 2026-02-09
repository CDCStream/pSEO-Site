import { notFound } from 'next/navigation';
import { wallpapersConfig, getSlugsForCategory } from '@/config/pSEO-data';
import WallpaperClient from './WallpaperClient';
import AdSlot from '@/components/AdSlot';
/* ===== GEO: SEO Components ===== */
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import { ImageGallerySchema } from '@/components/SEO/ToolSchema';
import KeyTakeaway from '@/components/SEO/KeyTakeaway';
import TechnicalProcess from '@/components/SEO/TechnicalProcess';

/* Inline SVG icons — no lucide-react dependency */
const PaletteSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>
);
const SlidersSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>
);
const MonitorSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
);
const DownloadSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

export async function generateStaticParams() {
  const slugs = getSlugsForCategory('wallpapers');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = wallpapersConfig[slug];

  if (!config) {
    return { title: 'Wallpaper Not Found' };
  }

  return {
    title: config.title,
    description: config.description,
    keywords: `${config.keyword}, free ${config.keyword}, ${config.keyword} download`,
    alternates: {
      canonical: `https://makersilo.com/wallpapers/${slug}`,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      url: `https://makersilo.com/wallpapers/${slug}`,
      siteName: 'MakerSilo',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
  };
}

const wallpaperSteps = [
  {
    icon: PaletteSvg,
    title: 'Choose Colors',
    description: 'Select your preferred colors using the color picker or presets.',
  },
  {
    icon: SlidersSvg,
    title: 'Customize',
    description: 'Adjust settings like size, style, and additional options.',
  },
  {
    icon: MonitorSvg,
    title: 'Preview',
    description: 'See your wallpaper update in real-time as you make changes.',
  },
  {
    icon: DownloadSvg,
    title: 'Download',
    description: 'Download your wallpaper as a high-quality PNG file.',
  },
];

/* GEO: Wallpaper technical steps */
const wallpaperTechSteps = [
  'Choose your desired colors and style using the interactive controls.',
  'The wallpaper is generated on an HTML5 Canvas element in real-time.',
  'Preview updates instantly as you adjust any setting.',
  'Click "Download" to export the wallpaper as a high-resolution PNG file.',
  'Set as your phone, tablet, or desktop background — all standard sizes supported.',
];

export default async function WallpaperPage({ params }) {
  const { slug } = await params;
  const config = wallpapersConfig[slug];

  if (!config) {
    notFound();
  }

  /* GEO: Key takeaway summary */
  const keyTakeawaySummary = `${config.name} is a free wallpaper creation tool by MakerSilo. ${config.description} Download high-quality PNG backgrounds instantly — no signup needed.`;

  return (
    <div className="min-h-screen">
      {/* GEO: ImageGallery Schema */}
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
            {/* GEO: Key Takeaway */}
            <KeyTakeaway toolName={config.name} summary={keyTakeawaySummary} />

            <AdSlot position="above-tool" />

            {/* Wallpaper Tool — UNTOUCHED */}
            <WallpaperClient config={config} slug={slug} />

            {/* GEO: Technical Process */}
            <TechnicalProcess toolName={config.name} steps={wallpaperTechSteps} />

            {/* GEO: How to Use — Semantic <ol> */}
            <HowToUse keyword={config.keyword} steps={wallpaperSteps} />

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
