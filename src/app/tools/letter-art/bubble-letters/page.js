import BubbleLetterClient from './BubbleLetterClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Type, Palette, Download, Share2, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Bubble Letter Art Generator - Create Custom Bubble Text Free | MakerSilo',
  description: 'Create stunning bubble letter art with 6 unique bubble fonts. Customize fill color, outline, shadow effects and download as transparent PNG. Free online tool.',
  keywords: 'bubble letters, bubble letter generator, bubble text, bubble font, letter art, bubble letter art, printable bubble letters, bubble letter maker',
  openGraph: {
    title: 'Bubble Letter Art Generator - Create Custom Bubble Text Free',
    description: 'Create stunning bubble letter art with 6 unique bubble fonts. Customize colors, outlines, shadows and download as transparent PNG.',
    type: 'website',
    url: 'https://makersilo.com/tools/letter-art/bubble-letters',
  },
};

const keyword = 'Bubble Letter Art Generator';

const steps = [
  { icon: Type, title: 'Type Your Text', description: 'Enter any word, name, or phrase into the text field. Multi-line text is supported.' },
  { icon: Palette, title: 'Pick Font & Style', description: 'Choose from 6 bubble fonts. Customize fill color, outline thickness, and shadow effects.' },
  { icon: Download, title: 'Download PNG', description: 'Download your bubble letter art as a high-resolution transparent PNG image.' },
  { icon: Share2, title: 'Use Anywhere', description: 'Print it, use it in projects, share on social media, or add it to presentations.' },
];

const faqs = [
  { q: 'What are bubble letters?', a: 'Bubble letters are a style of lettering where each character appears rounded, inflated, and three-dimensional — like a soap bubble. They are commonly used in graffiti art, posters, party decorations, school projects, and social media graphics.' },
  { q: 'How many fonts are available?', a: 'We offer 6 distinct bubble fonts: Bubblegum Sans (classic bubbly), Fredoka (round bold), Luckiest Guy (comic bubble), Chewy (playful rounded), Titan One (chunky bold), and Bungee Shade (3D shadow effect). Each creates a unique look.' },
  { q: 'Can I download with a transparent background?', a: 'Yes! All downloads are transparent PNG files by default. The checkerboard pattern in the preview represents transparency. Your bubble letters will have no background, making them perfect for layering over photos or colored backgrounds.' },
  { q: 'Is this tool free to use?', a: 'Absolutely. The Bubble Letter Art Generator is 100% free with no watermarks, no sign-up, and unlimited downloads.' },
  { q: 'Can I use the bubble letters commercially?', a: 'Yes. All 6 fonts used are open-source Google Fonts licensed under the SIL Open Font License. You can use the generated images for personal and commercial projects without attribution.' },
  { q: 'What customization options are available?', a: 'You can customize the fill color, outline color and thickness, shadow effects (color, blur, offset), text alignment (left, center, right), and font size (24px to 200px). Every change updates the live preview instantly.' },
];

const longContent = `Bubble letters have been a beloved form of creative expression for decades. From the graffiti-covered walls of New York City in the 1970s to today's digital design tools, the rounded, puffy letterforms have remained iconic. Our Bubble Letter Art Generator brings this classic art form to your browser, letting you create professional-quality bubble text in seconds.

The tool offers six carefully selected bubble fonts, each with a distinct personality. Bubblegum Sans delivers the classic smooth bubble look. Fredoka provides ultra-round, modern bubble letters perfect for children's content. Luckiest Guy channels bold comic-book energy. Chewy gives a casual, hand-drawn bubbly feel. Titan One offers thick, chunky bubble characters. And Bungee Shade adds a stunning 3D layered effect that makes your text pop off the screen.

What sets our generator apart is the depth of customization. Every aspect of your bubble letters can be fine-tuned. Choose any fill color to match your project's palette. Add outlines with adjustable thickness and color for definition. Enable shadow effects with control over color, blur radius, and directional offset. The result is bubble letter art that looks exactly how you envision it.

All output downloads as a transparent PNG file, which means your bubble letters can be placed on any background without white edges or boxes. This makes them ideal for layering in photo editors, adding to presentations, printing on custom merchandise, or posting on social media platforms. The high-resolution output ensures crisp results even when printed at large sizes.

Bubble letters are incredibly versatile. Teachers use them for classroom displays and educational materials. Parents create personalized decorations for birthday parties and nursery walls. Designers incorporate them into logos, social media posts, and marketing materials. Students use them for school projects and presentations. Content creators add them to thumbnails, banners, and video overlays. Whatever your creative need, bubble letters add a fun, eye-catching element that grabs attention.

For those who prefer drawing bubble letters by hand, our tool also serves as a reference. Use the alphabet preview section to see how each letter looks in your chosen font, then trace or replicate the shapes on paper. It is the perfect bridge between digital and traditional lettering art.`;

export default function BubbleLettersPage() {
  return (
    <div className="min-h-screen">
      <ToolSchema
        name="Bubble Letter Art Generator"
        description="Create custom bubble letter art with 6 unique fonts. Customize colors, outlines, shadows and download as transparent PNG."
        category="tools"
        url="https://makersilo.com/tools/letter-art/bubble-letters"
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://makersilo.com' },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://makersilo.com/tools' },
              { '@type': 'ListItem', position: 3, name: 'Letter Art', item: 'https://makersilo.com/tools/letter-art' },
              { '@type': 'ListItem', position: 4, name: 'Bubble Letters' },
            ],
          }),
        }}
      />

      {/* Hero + Breadcrumb */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400">Letter Art</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">Bubble Letters</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Bubble Letter Art Generator
            </h1>
            <p className="text-lg text-gray-400">
              Create eye-catching bubble letter art with 6 unique fonts. Customize colors, outlines, shadows, and download as a transparent PNG.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />
            <BubbleLetterClient />
            <HowToUse keyword={keyword} steps={steps} />

            {/* Printable Bubble Letter Templates */}
            <section className="mt-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Type className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Printable Bubble Letter Templates</h2>
              </div>
              <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                <p className="text-gray-400 mb-4">
                  Want to draw bubble letters by hand? Use our generator as a reference template. Select any of the 6 bubble fonts above to see the full A-Z alphabet in the preview panel. You can then trace or replicate the shapes on paper for posters, cards, and art projects.
                </p>
                <h3 className="text-lg font-semibold text-white mb-3">Tips for Drawing Bubble Letters by Hand</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex gap-2"><span className="text-green-400 mt-0.5">•</span>Start by writing each letter in regular block form with a pencil, leaving extra space between characters.</li>
                  <li className="flex gap-2"><span className="text-green-400 mt-0.5">•</span>Draw a rounded outline around each letter, making every edge curved instead of sharp.</li>
                  <li className="flex gap-2"><span className="text-green-400 mt-0.5">•</span>Add a second outline outside the first to create the puffy, inflated bubble effect.</li>
                  <li className="flex gap-2"><span className="text-green-400 mt-0.5">•</span>Erase the original block letters inside, leaving only the bubble shapes.</li>
                  <li className="flex gap-2"><span className="text-green-400 mt-0.5">•</span>Add highlights (small oval or curved line) near the top-left of each letter to simulate a glossy, reflective surface.</li>
                  <li className="flex gap-2"><span className="text-green-400 mt-0.5">•</span>Color your letters with markers, colored pencils, or paint. Use gradients for a more realistic 3D look.</li>
                </ul>
              </div>
            </section>

            <FAQSection faqs={faqs} keyword={keyword} />
            <LongContent content={longContent} keyword={keyword} />
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
