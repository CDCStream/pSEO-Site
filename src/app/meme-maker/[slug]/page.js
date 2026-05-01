import { notFound } from 'next/navigation';
import { memeMakerConfig, getSlugsForCategory } from '@/config/pSEO-data';
import MemeClient from './MemeClient';
import UnoReverseClient from './UnoReverseClient';
import SpongeBobMemeClient from './SpongeBobMemeClient';
import HyperpigmentationMemeClient from './HyperpigmentationMemeClient';
import SybauMemeClient from './SybauMemeClient';
import WantedPosterClient from './WantedPosterClient';
import JdVanceMemeClient from './JdVanceMemeClient';
import DogMemeClient from './DogMemeClient';
import CryingMemeGalleryClient from './CryingMemeGalleryClient';
import SideEyeMemeGalleryClient from './SideEyeMemeGalleryClient';
import GetALoadMemeClient from './GetALoadMemeClient';
import HamsterMemeGalleryClient from './HamsterMemeGalleryClient';
import MikeWazowskiMemeGalleryClient from './MikeWazowskiMemeGalleryClient';
import SpidermanMemeClient from './SpidermanMemeClient';
import ChillGuyMemeClient from './ChillGuyMemeClient';
import MonkeyThinkingMemeClient from './MonkeyThinkingMemeClient';
import BidenMemeGalleryClient from './BidenMemeGalleryClient';
import LowTaperFadeMemeClient from './LowTaperFadeMemeClient';
import JobApplicationMemeClient from './JobApplicationMemeClient';
import NoMemeGalleryClient from './NoMemeGalleryClient';
import ShockedMemeClient from './ShockedMemeClient';
import ThursdayMemeGalleryClient from './ThursdayMemeGalleryClient';
import ChadMemeGalleryClient from './ChadMemeGalleryClient';
import SadMemeGalleryClient from './SadMemeGalleryClient';
import MondayMemeGalleryClient from './MondayMemeGalleryClient';
import AnthonyMackieMemeGalleryClient from './AnthonyMackieMemeGalleryClient';
import AlwaysHasBeenMemeClient from './AlwaysHasBeenMemeClient';
import ShrekMemeGalleryClient from './ShrekMemeGalleryClient';
import ThumbsUpMemeGalleryClient from './ThumbsUpMemeGalleryClient';
import GoodMorningMemeGalleryClient from './GoodMorningMemeGalleryClient';
import ConfusedMemeGalleryClient from './ConfusedMemeGalleryClient';
import LizardMemeGalleryClient from './LizardMemeGalleryClient';
import ChickenJockeyMemeClient from './ChickenJockeyMemeClient';
import CharlieKirkMemeClient from './CharlieKirkMemeClient';
import ThankYouMemeGalleryClient from './ThankYouMemeGalleryClient';
import TrumpMemeClient from './TrumpMemeClient';
import HandOnShoulderMemeClient from './HandOnShoulderMemeClient';
import CryingCatMemeGalleryClient from './CryingCatMemeGalleryClient';
import LaughingMemeGalleryClient from './LaughingMemeGalleryClient';
import FortyOneMemeGalleryClient from './FortyOneMemeGalleryClient';
import JonHammDancingMemeGalleryClient from './JonHammDancingMemeGalleryClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Image, Type, Download, Share2, Palette, Upload as UploadIcon, Search } from 'lucide-react';

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

const unoSteps = [
  {
    icon: Palette,
    title: 'Pick a Color',
    description: 'Choose from Red, Blue, Green, or Yellow — the four classic Uno card colors.',
  },
  {
    icon: Type,
    title: 'Add Text or Image',
    description: 'Type custom center text or upload your own photo to personalize the card.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your custom Uno Reverse Card as a high-quality PNG file.',
  },
  {
    icon: Share2,
    title: 'Share It',
    description: 'Send it in group chats, post on social media, or use it as a reaction image.',
  },
];

const hyperpigmentationSteps = [
  {
    icon: Type,
    title: 'Enter Left Side Text',
    description: 'Type the "before" text for the left panel of the comparison meme.',
  },
  {
    icon: Type,
    title: 'Enter Right Side Text',
    description: 'Type the "after" text for the right panel to complete the contrast.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your hyperpigmentation meme as a high-quality PNG image.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const wantedPosterSteps = [
  {
    icon: Type,
    title: 'Enter a Name',
    description: 'Type the name of your "wanted" person — the star of the poster.',
  },
  {
    icon: UploadIcon,
    title: 'Upload a Photo',
    description: 'Optionally upload a photo to place inside the poster frame.',
  },
  {
    icon: Image,
    title: 'Generate with AI',
    description: 'Click "Fill Empty Fields with AI" to auto-generate funny crimes, alias, and reward.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your custom wanted poster as a high-quality PNG image.',
  },
];

const sybauSteps = [
  {
    icon: Type,
    title: 'Add Top Text',
    description: 'Type the setup text at the top of the SYBAU meme.',
  },
  {
    icon: Type,
    title: 'Add Bottom Text',
    description: 'Type the punchline or reaction text at the bottom.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your SYBAU meme as a high-quality PNG image.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const jdVanceSteps = [
  {
    icon: Image,
    title: 'Pick a Template',
    description: 'Browse 10 JD Vance meme templates and select the one that fits your idea.',
  },
  {
    icon: Type,
    title: 'Add Your Text',
    description: 'Type custom top and bottom text for your meme caption.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your JD Vance meme as a high-quality PNG image.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const dogMemeSteps = [
  {
    icon: Image,
    title: 'Pick a Template',
    description: 'Browse 7 dog meme templates and select the one that fits your idea.',
  },
  {
    icon: Type,
    title: 'Click to Place Text',
    description: 'Click anywhere on the image to add a text box. Add as many as you want.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your dog meme as a high-quality PNG image.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const cryingMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 23 hilarious crying reaction memes.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any meme to open a full-size lightbox preview.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Hit the download button to save the crying meme as a PNG file.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction image.',
  },
];

const sideEyeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 23 side eye memes and animated GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any meme to open a full-size lightbox. GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download as PNG (static) or GIF (animated) — format is preserved.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction image.',
  },
];

const getALoadSteps = [
  {
    icon: Type,
    title: 'Click to Place Text',
    description: 'Click anywhere on the meme image to add a text box at that position.',
  },
  {
    icon: Palette,
    title: 'Customize Style',
    description: 'Choose font, size, color, and stroke for each text box individually.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your "Get A Load Of This Guy" meme as a high-quality PNG.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const hamsterMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 10 hilarious hamster memes and animated GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any meme to open a full-size lightbox. GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download as PNG (static) or GIF (animated) — format is preserved.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction image.',
  },
];

const chillGuyMemeSteps = [
  {
    icon: Image,
    title: 'Pick a Template',
    description: 'Browse 4 Chill Guy meme templates and select the one that fits your idea.',
  },
  {
    icon: Type,
    title: 'Click to Place Text',
    description: 'Click anywhere on the image to add text. Customize font, size, color, and stroke.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your Chill Guy meme as a high-quality PNG image.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const spidermanMemeSteps = [
  {
    icon: Image,
    title: 'Pick a Template',
    description: 'Browse 14 iconic Spiderman meme templates and select the one that fits your idea.',
  },
  {
    icon: Type,
    title: 'Click to Place Text',
    description: 'Click anywhere on the image to add text. Customize font, size, color, and stroke.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your Spiderman meme as a high-quality PNG image.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const monkeyThinkingSteps = [
  {
    icon: Type,
    title: 'Click to Place Text',
    description: 'Click anywhere on the monkey image to add a text box at that position.',
  },
  {
    icon: Palette,
    title: 'Customize Style',
    description: 'Choose font, size, color, and stroke for each text box individually.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your Monkey Thinking meme as a high-quality PNG.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const lowTaperFadeSteps = [
  {
    icon: Type,
    title: 'Click to Place Text',
    description: 'Click anywhere on the Low Taper Fade image to add a text box at that position.',
  },
  {
    icon: Palette,
    title: 'Customize Style',
    description: 'Choose font, size, color, and stroke for each text box individually.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your Low Taper Fade meme as a high-quality PNG.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const bidenMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 15 hilarious Biden memes and animated GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any meme to open a full-size lightbox. GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download as PNG (static) or GIF (animated) — format is preserved.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction image.',
  },
];

const jobApplicationMemeSteps = [
  {
    icon: Image,
    title: 'Pick a Template',
    description: 'Browse 16 job application meme templates and select the one that fits your idea.',
  },
  {
    icon: Type,
    title: 'Click to Place Text',
    description: 'Click anywhere on the image to add text. Customize font, size, color, and stroke.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your job application meme as a high-quality PNG image.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, LinkedIn, or send it in group chats.',
  },
];

const chadMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 19 Chad and GigaChad memes and animated GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any meme to open a full-size lightbox. GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download as PNG (static) or GIF (animated) — format is preserved.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction image.',
  },
];

const thursdayMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 21 hilarious Thursday meme GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size lightbox. All GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download any Thursday meme as an animated GIF file.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or share every Thursday.',
  },
];

const shockedMemeSteps = [
  {
    icon: Image,
    title: 'Pick a Template',
    description: 'Browse 18 shocked face meme templates and select the one that fits your idea.',
  },
  {
    icon: Type,
    title: 'Click to Place Text',
    description: 'Click anywhere on the image to add text. Customize font, size, color, and stroke.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your shocked meme as a high-quality PNG image.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const noMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 13 hilarious "No" reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size lightbox. All GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download any "No" meme as an animated GIF file.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction GIF.',
  },
];

const shrekMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 18 hilarious Shrek reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size lightbox. All GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download any Shrek meme as an animated GIF file.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction GIF.',
  },
];

const handOnShoulderSteps = [
  {
    icon: Image,
    title: 'Choose Template',
    description: 'Pick from 3 hand-on-shoulder meme templates.',
  },
  {
    icon: UploadIcon,
    title: 'Upload Image',
    description: 'Upload your own images to place on the meme. Drag to reposition and resize.',
  },
  {
    icon: Type,
    title: 'Add Text',
    description: 'Click anywhere on the image to place text boxes. Drag to reposition.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download your finished meme as a high-quality PNG file.',
  },
];

const trumpMemeSteps = [
  {
    icon: Image,
    title: 'Choose Template',
    description: 'Pick from 11 Trump meme templates.',
  },
  {
    icon: Type,
    title: 'Add Text',
    description: 'Click anywhere on the image to place text boxes. Drag to reposition.',
  },
  {
    icon: Palette,
    title: 'Customize',
    description: 'Choose fonts, sizes, colors, and stroke for each text box.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download your finished meme as a high-quality PNG file.',
  },
];

const cryingCatMemeSteps = [
  {
    icon: Search,
    title: 'Browse Memes',
    description: 'Scroll through 20 crying cat reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any meme to open a full-size animated preview in the lightbox.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Click the download button to save the GIF directly to your device.',
  },
  {
    icon: Share2,
    title: 'Share',
    description: 'Send the crying cat meme to friends via social media, Discord, or messaging apps.',
  },
];

const jonHammDancingSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 19 hilarious Jon Hamm dancing GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size animated preview in the lightbox.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Click the download button to save the dancing GIF to your device.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction GIF.',
  },
];

const fortyOneMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 10 funny 41 memes and GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any meme to open a full-size preview in the lightbox.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Click the download button to save the meme to your device.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction.',
  },
];

const laughingMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 22 hilarious laughing reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size animated preview in the lightbox.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Click the download button to save the laughing GIF to your device.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction GIF.',
  },
];

const thankYouMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 33 hilarious thank you reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size lightbox preview.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Hit the download button to save the thank you GIF to your device.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction GIF.',
  },
];

const charlieKirkSteps = [
  {
    icon: Image,
    title: 'Choose Template',
    description: 'Pick from 6 Charlie Kirk meme templates.',
  },
  {
    icon: Type,
    title: 'Add Text',
    description: 'Click anywhere on the image to place text boxes. Drag to reposition.',
  },
  {
    icon: Palette,
    title: 'Customize',
    description: 'Choose fonts, sizes, colors, and stroke for each text box.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download your finished meme as a high-quality PNG file.',
  },
];

const chickenJockeySteps = [
  {
    icon: Image,
    title: 'View Template',
    description: 'The Chicken Jockey meme template is loaded and ready.',
  },
  {
    icon: Type,
    title: 'Add Text',
    description: 'Click anywhere on the image to place text boxes. Drag to reposition.',
  },
  {
    icon: Palette,
    title: 'Customize',
    description: 'Choose fonts, sizes, colors, and stroke for each text box.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download your finished meme as a high-quality PNG file.',
  },
];

const lizardMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 14 hilarious lizard reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size lightbox. All GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download any lizard meme as an animated GIF file.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction GIF.',
  },
];

const confusedMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 17 hilarious confused reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size lightbox. All GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download any confused meme as an animated GIF file.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction GIF.',
  },
];

const goodMorningMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 19 hilarious good morning reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size lightbox. All GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download any good morning meme as an animated GIF file.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a morning greeting.',
  },
];

const thumbsUpMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 23 hilarious thumbs up reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size lightbox. All GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download any thumbs up meme as an animated GIF file.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction GIF.',
  },
];

const alwaysHasBeenSteps = [
  {
    icon: Type,
    title: 'Click to Place Text',
    description: 'Click anywhere on the astronaut meme to add a text box at that position.',
  },
  {
    icon: Palette,
    title: 'Customize Style',
    description: 'Choose font, size, color, and stroke for each text box individually.',
  },
  {
    icon: Download,
    title: 'Download PNG',
    description: 'Download your Always Has Been meme as a high-quality PNG.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Post it on Instagram, Twitter, TikTok, Reddit, or send it in group chats.',
  },
];

const anthonyMackieSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 16 hilarious Anthony Mackie reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any GIF to open a full-size lightbox. All GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download any Anthony Mackie meme as an animated GIF file.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction GIF.',
  },
];

const mondayMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 16 funny Monday memes and animated GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any meme to open a full-size lightbox. GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download as PNG (static) or GIF (animated) — format is preserved.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats every Monday morning to survive the week.',
  },
];

const sadMemeSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 19 sad memes and animated reaction GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any meme to open a full-size lightbox. GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download as PNG (static) or GIF (animated) — format is preserved.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction image.',
  },
];

const mikeWazowskiSteps = [
  {
    icon: Search,
    title: 'Browse Collection',
    description: 'Scroll through 14 hilarious Mike Wazowski memes and animated GIFs.',
  },
  {
    icon: Image,
    title: 'Preview',
    description: 'Click any meme to open a full-size lightbox. GIFs play automatically.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Download as PNG (static) or GIF (animated) — format is preserved.',
  },
  {
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Send it in group chats, post on social media, or use as a reaction image.',
  },
];

export default async function MemePage({ params }) {
  const { slug } = await params;
  const config = memeMakerConfig[slug];

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen">
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
            <AdSlot position="above-tool" />

            {slug === 'uno-reverse-card' ? (
              <UnoReverseClient config={config} slug={slug} />
            ) : slug === 'spongebob-meme' ? (
              <SpongeBobMemeClient />
            ) : slug === 'hyperpigmentation-meme' ? (
              <HyperpigmentationMemeClient />
            ) : slug === 'sybau-meme' ? (
              <SybauMemeClient />
            ) : slug === 'wanted-poster' ? (
              <WantedPosterClient />
            ) : slug === 'jd-vance-meme' ? (
              <JdVanceMemeClient />
            ) : slug === 'dog-meme' ? (
              <DogMemeClient />
            ) : slug === 'crying-meme' ? (
              <CryingMemeGalleryClient />
            ) : slug === 'side-eye-meme' ? (
              <SideEyeMemeGalleryClient />
            ) : slug === 'get-a-load-of-this-guy-meme' ? (
              <GetALoadMemeClient />
            ) : slug === 'hamster-meme' ? (
              <HamsterMemeGalleryClient />
            ) : slug === 'mike-wazowski-meme' ? (
              <MikeWazowskiMemeGalleryClient />
            ) : slug === 'spiderman-meme' ? (
              <SpidermanMemeClient />
            ) : slug === 'chill-guy-meme' ? (
              <ChillGuyMemeClient />
            ) : slug === 'monkey-thinking-meme' ? (
              <MonkeyThinkingMemeClient />
            ) : slug === 'biden-meme' ? (
              <BidenMemeGalleryClient />
            ) : slug === 'low-taper-fade-meme' ? (
              <LowTaperFadeMemeClient />
            ) : slug === 'job-application-meme' ? (
              <JobApplicationMemeClient />
            ) : slug === 'no-meme' ? (
              <NoMemeGalleryClient />
            ) : slug === 'shocked-meme' ? (
              <ShockedMemeClient />
            ) : slug === 'thursday-meme' ? (
              <ThursdayMemeGalleryClient />
            ) : slug === 'chad-meme' ? (
              <ChadMemeGalleryClient />
            ) : slug === 'sad-meme' ? (
              <SadMemeGalleryClient />
            ) : slug === 'monday-meme' ? (
              <MondayMemeGalleryClient />
            ) : slug === 'anthony-mackie-meme' ? (
              <AnthonyMackieMemeGalleryClient />
            ) : slug === 'always-has-been-meme' ? (
              <AlwaysHasBeenMemeClient />
            ) : slug === 'shrek-meme' ? (
              <ShrekMemeGalleryClient />
            ) : slug === 'thumbs-up-meme' ? (
              <ThumbsUpMemeGalleryClient />
            ) : slug === 'good-morning-meme' ? (
              <GoodMorningMemeGalleryClient />
            ) : slug === 'confused-meme' ? (
              <ConfusedMemeGalleryClient />
            ) : slug === 'lizard-meme' ? (
              <LizardMemeGalleryClient />
            ) : slug === 'chicken-jockey-meme' ? (
              <ChickenJockeyMemeClient />
            ) : slug === 'charlie-kirk-meme' ? (
              <CharlieKirkMemeClient />
            ) : slug === 'thank-you-thank-you-thank-you-meme' ? (
              <ThankYouMemeGalleryClient />
            ) : slug === 'trump-meme' ? (
              <TrumpMemeClient />
            ) : slug === 'hand-on-shoulder-meme' ? (
              <HandOnShoulderMemeClient />
            ) : slug === 'crying-cat-meme' ? (
              <CryingCatMemeGalleryClient />
            ) : slug === 'laughing-meme' ? (
              <LaughingMemeGalleryClient />
            ) : slug === '41-meme' ? (
              <FortyOneMemeGalleryClient />
            ) : slug === 'jon-hamm-dancing-meme' ? (
              <JonHammDancingMemeGalleryClient />
            ) : (
              <MemeClient config={config} slug={slug} />
            )}

            <HowToUse keyword={config.keyword} steps={slug === 'uno-reverse-card' ? unoSteps : slug === 'hyperpigmentation-meme' ? hyperpigmentationSteps : slug === 'sybau-meme' ? sybauSteps : slug === 'wanted-poster' ? wantedPosterSteps : slug === 'jd-vance-meme' ? jdVanceSteps : slug === 'dog-meme' ? dogMemeSteps : slug === 'crying-meme' ? cryingMemeSteps : slug === 'side-eye-meme' ? sideEyeSteps : slug === 'get-a-load-of-this-guy-meme' ? getALoadSteps : slug === 'hamster-meme' ? hamsterMemeSteps : slug === 'mike-wazowski-meme' ? mikeWazowskiSteps : slug === 'spiderman-meme' ? spidermanMemeSteps : slug === 'chill-guy-meme' ? chillGuyMemeSteps : slug === 'monkey-thinking-meme' ? monkeyThinkingSteps : slug === 'biden-meme' ? bidenMemeSteps : slug === 'low-taper-fade-meme' ? lowTaperFadeSteps : slug === 'job-application-meme' ? jobApplicationMemeSteps : slug === 'no-meme' ? noMemeSteps : slug === 'shocked-meme' ? shockedMemeSteps : slug === 'thursday-meme' ? thursdayMemeSteps : slug === 'chad-meme' ? chadMemeSteps : slug === 'sad-meme' ? sadMemeSteps : slug === 'monday-meme' ? mondayMemeSteps : slug === 'anthony-mackie-meme' ? anthonyMackieSteps : slug === 'always-has-been-meme' ? alwaysHasBeenSteps : slug === 'shrek-meme' ? shrekMemeSteps : slug === 'thumbs-up-meme' ? thumbsUpMemeSteps : slug === 'good-morning-meme' ? goodMorningMemeSteps : slug === 'confused-meme' ? confusedMemeSteps : slug === 'lizard-meme' ? lizardMemeSteps : slug === 'chicken-jockey-meme' ? chickenJockeySteps : slug === 'charlie-kirk-meme' ? charlieKirkSteps : slug === 'thank-you-thank-you-thank-you-meme' ? thankYouMemeSteps : slug === 'trump-meme' ? trumpMemeSteps : slug === 'hand-on-shoulder-meme' ? handOnShoulderSteps : slug === 'crying-cat-meme' ? cryingCatMemeSteps : slug === 'laughing-meme' ? laughingMemeSteps : slug === '41-meme' ? fortyOneMemeSteps : slug === 'jon-hamm-dancing-meme' ? jonHammDancingSteps : memeSteps} />
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
