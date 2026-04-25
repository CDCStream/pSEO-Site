import { notFound } from 'next/navigation';
import { wallpapersConfig, getSlugsForCategory } from '@/config/pSEO-data';
import WallpaperClient from './WallpaperClient';
import ChristmasGalleryClient from './ChristmasGalleryClient';
import StitchGalleryClient from './StitchGalleryClient';
import PrepyGalleryClient from './PrepyGalleryClient';
import HelloKittyGalleryClient from './HelloKittyGalleryClient';
import PinkGalleryClient from './PinkGalleryClient';
import BlackGalleryClient from './BlackGalleryClient';
import BlueGalleryClient from './BlueGalleryClient';
import FallGalleryClient from './FallGalleryClient';
import HalloweenGalleryClient from './HalloweenGalleryClient';
import CuteGalleryClient from './CuteGalleryClient';
import SummerGalleryClient from './SummerGalleryClient';
import ThanksgivingGalleryClient from './ThanksgivingGalleryClient';
import FlowerGalleryClient from './FlowerGalleryClient';
import GifWallpaperGalleryClient from './GifWallpaperGalleryClient';
import GreenGalleryClient from './GreenGalleryClient';
import JesusGalleryClient from './JesusGalleryClient';
import PurpleGalleryClient from './PurpleGalleryClient';
import WhiteGalleryClient from './WhiteGalleryClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import { ImageGallerySchema } from '@/components/SEO/ToolSchema';
import { Palette, Sliders, Download, Monitor, Search, Smartphone } from 'lucide-react';

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

const gallerySteps = {
  christmasGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through our collection of HD Christmas wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Hit the download button to save the wallpaper as a PNG file.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Open your device settings and set the downloaded image as your wallpaper.' },
  ],
  stitchGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through our collection of cute HD Stitch wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Hit the download button to save the Stitch wallpaper as a PNG file.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Open your device settings and set the downloaded image as your wallpaper.' },
  ],
  preppyGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 19 cute preppy aesthetic wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the preppy wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  helloKittyGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 15 adorable Hello Kitty wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Hit the download button to save the Hello Kitty wallpaper as a PNG file.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Open your device settings and set the downloaded image as your wallpaper.' },
  ],
  pinkGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 16 stunning pink aesthetic wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the pink wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  blackGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 24 stunning dark aesthetic wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the black wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  blueGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 24 stunning blue aesthetic wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the blue wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  fallGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 24 stunning fall aesthetic wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the fall wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  halloweenGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 16 spooky Halloween aesthetic wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the Halloween wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  cuteGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 24 adorable cute aesthetic wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the cute wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  summerGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 32 stunning summer beach and tropical wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the summer wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  thanksgivingGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 32 stunning Thanksgiving and autumn harvest wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the Thanksgiving wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  flowerGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 32 beautiful flower and botanical wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the flower wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  gifWallpaperGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 30 vibrant GIF-style aesthetic wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the GIF wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  greenGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 36 stunning green aesthetic wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the green wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  jesusGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 41 beautiful Jesus Christ HD wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the Jesus wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  purpleGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 31 stunning purple aesthetic HD wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the purple wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
  whiteGallery: [
    { icon: Search, title: 'Browse Gallery', description: 'Scroll through 32 stunning white aesthetic HD wallpapers.' },
    { icon: Monitor, title: 'Preview', description: 'Click any wallpaper to open a full-size lightbox preview.' },
    { icon: Download, title: 'Download', description: 'Tap the download button to save the white wallpaper as a high-res PNG.' },
    { icon: Smartphone, title: 'Set as Wallpaper', description: 'Go to your device settings and set the downloaded image as your wallpaper.' },
  ],
};

export default async function WallpaperPage({ params }) {
  const { slug } = await params;
  const config = wallpapersConfig[slug];

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

            {config.generatorType === 'christmasGallery'
              ? <ChristmasGalleryClient />
              : config.generatorType === 'stitchGallery'
              ? <StitchGalleryClient />
              : config.generatorType === 'preppyGallery'
              ? <PrepyGalleryClient />
              : config.generatorType === 'helloKittyGallery'
              ? <HelloKittyGalleryClient />
              : config.generatorType === 'pinkGallery'
              ? <PinkGalleryClient />
              : config.generatorType === 'blackGallery'
              ? <BlackGalleryClient />
              : config.generatorType === 'blueGallery'
              ? <BlueGalleryClient />
              : config.generatorType === 'fallGallery'
              ? <FallGalleryClient />
              : config.generatorType === 'halloweenGallery'
              ? <HalloweenGalleryClient />
              : config.generatorType === 'cuteGallery'
              ? <CuteGalleryClient />
              : config.generatorType === 'summerGallery'
              ? <SummerGalleryClient />
              : config.generatorType === 'thanksgivingGallery'
              ? <ThanksgivingGalleryClient />
              : config.generatorType === 'flowerGallery'
              ? <FlowerGalleryClient />
              : config.generatorType === 'gifWallpaperGallery'
              ? <GifWallpaperGalleryClient />
              : config.generatorType === 'greenGallery'
              ? <GreenGalleryClient />
              : config.generatorType === 'jesusGallery'
              ? <JesusGalleryClient />
              : config.generatorType === 'purpleGallery'
              ? <PurpleGalleryClient />
              : config.generatorType === 'whiteGallery'
              ? <WhiteGalleryClient />
              : <WallpaperClient config={config} slug={slug} />
            }

            <HowToUse keyword={config.keyword} steps={gallerySteps[config.generatorType] || wallpaperSteps} />
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
