import GagCalculatorClient from './GagCalculatorClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Leaf, Search, Zap, Download } from 'lucide-react';

export const metadata = {
  title: 'Grow a Garden Calculator - Free Crop Mutation Value Calculator | MakerSilo',
  description: 'Free Grow a Garden calculator for Roblox. Calculate crop mutation values instantly — select from 100+ mutations, set quality (Silver/Gold/Rainbow), friend boost, and see total sheckle value. Updated for 2026.',
  keywords: 'grow a garden calculator, gag calculator, grow a garden mutation calculator, crop value calculator, roblox grow a garden, gag crop calculator, grow a garden value calculator, mutation stacking calculator',
  alternates: {
    canonical: 'https://makersilo.com/calculators/grow-a-garden-calculator/',
  },
  openGraph: {
    title: 'Grow a Garden Calculator - Free Crop Mutation Value Calculator',
    description: 'Calculate crop values with 100+ mutations, quality modifiers, and friend boost for Roblox Grow a Garden. Instant results, no signup.',
    type: 'website',
    url: 'https://makersilo.com/calculators/grow-a-garden-calculator/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grow a Garden Calculator - Crop Mutation Value Calculator',
    description: 'Free GAG crop calculator with 100+ mutations. Calculate sheckle values instantly.',
  },
};

const steps = [
  {
    icon: Leaf,
    title: 'Enter Base Crop Value',
    description: 'Input your crop\'s base sheckle price at its current weight. This is the starting value before any mutations or quality modifiers.',
  },
  {
    icon: Search,
    title: 'Select Mutations',
    description: 'Browse and select from 100+ mutations organized by category (Weather, Pet, Admin, Combo, Spray, Event). Use the search bar or category tabs to find specific mutations quickly.',
  },
  {
    icon: Zap,
    title: 'Set Quality & Boost',
    description: 'Choose the quality tier (None, Silver 5x, Gold 20x, Rainbow 50x) and adjust the friend boost percentage for additional value.',
  },
  {
    icon: Download,
    title: 'Read Your Total Value',
    description: 'See the calculated total sheckle value instantly with a full formula breakdown showing each multiplier component.',
  },
];

const faqs = [
  {
    q: 'How does the Grow a Garden crop value formula work?',
    a: 'The formula is: Final Value = Base Price × Quality × (1 + Sum of Mutation Multipliers - Number of Mutations) × (1 + Friend Boost / 100) × Amount. Mutations stack additively — each mutation adds (its multiplier - 1) to a base factor of 1. For example, Wet (2x) + Chilled (2x) gives a mutation factor of 3, not 4.',
  },
  {
    q: 'What are the quality multipliers in Grow a Garden?',
    a: 'There are three quality tiers that multiply your crop value: Silver (5x), Gold (20x), and Rainbow (50x). Silver is obtained when a fruit grows or from fertilizer. Gold comes from fruit growth, dragonflies, or fertilizer. Rainbow comes from fruit growth, butterflies, or fertilizer.',
  },
  {
    q: 'Do mutations stack multiplicatively or additively in GAG?',
    a: 'Mutations stack additively in Grow a Garden. The formula uses (1 + Sum - N) where Sum is the total of all mutation multiplier values and N is the number of mutations. This means adding a 100x mutation (like Shocked) adds 99 to the factor, while adding a 2x mutation (like Wet) adds 1. They do not multiply each other.',
  },
  {
    q: 'What is the highest multiplier mutation in Grow a Garden?',
    a: 'The highest single mutation multiplier is Goldsparkle at 500x, obtained from the Goldfinch pet mutation. Other extremely high multipliers include Astral (365x, from Cosmic + Galactic combo), Stormbound (270x, from Riptide + Stormcharged), Cosmic (240x, from Celestial + Aurora), Abyssal (240x, from Void Touched + Eclipsed), and Ascended Chakra (230x, from Harmonised Foxfire + Harmonised Chakra).',
  },
  {
    q: 'What is the friend boost in Grow a Garden?',
    a: 'Friend boost is a percentage bonus applied to your crop value based on how many friends are in your server. Each friend adds a small percentage to your crop earnings. The boost ranges from 0% to over 100% depending on the number of friends present. Our calculator lets you set any percentage to calculate the exact impact.',
  },
  {
    q: 'How do combo mutations work in Grow a Garden?',
    a: 'Combo mutations are created by combining specific mutations together. For example, Wet + Chilled creates Frozen (10x), Bloom + Rot creates Gloom (30x), and Celestial + Aurora creates Cosmic (240x). Combo mutations typically have higher multipliers than their individual components. Our calculator includes all known combos with their recipes.',
  },
  {
    q: 'Is this Grow a Garden calculator free to use?',
    a: 'Yes, completely free. No signup, no ads blocking results, no premium tier. The calculator works entirely in your browser with no data sent to any server. Your selections are saved locally so you can pick up where you left off.',
  },
  {
    q: 'Does this calculator work for all crops in Grow a Garden?',
    a: 'Yes. Since all crops in Grow a Garden use the same mutation stacking formula, this calculator works for any crop. Simply input your crop\'s base sheckle value (which varies by crop type and weight) and the calculator handles the rest. It covers all mutations from every event, weather type, pet ability, spray, and admin occurrence.',
  },
  {
    q: 'How often are the mutation values updated?',
    a: 'The mutation multipliers are based on the game\'s core mechanics and rarely change. When Roblox developers update Grow a Garden with new mutations or adjust existing multipliers, we update the calculator accordingly. The current database includes all mutations through 2026 events including Easter 2026 and Bizzy Bee Event.',
  },
  {
    q: 'Can I use this calculator on mobile?',
    a: 'Yes, the calculator is fully responsive and works on phones, tablets, and desktops. The mutation grid adjusts to your screen size, and all touch interactions work smoothly on mobile browsers.',
  },
];

const longContent = `The Grow a Garden Calculator is a free tool designed for Roblox players who want to maximize their crop earnings in the popular farming and trading game Grow a Garden (GAG). Understanding how mutations stack and interact with quality modifiers is essential for any serious GAG trader, and this calculator makes those complex calculations instant and error-free.

Grow a Garden has become one of the most popular experiences on Roblox, with millions of active players planting seeds, growing crops, collecting pets, and trading in a vibrant in-game economy. The game's depth comes from its mutation system — over 100 different mutations that can be applied to crops, each with a specific multiplier that increases the crop's sheckle value. From common weather mutations like Wet (2x) and Chilled (2x) to extremely rare admin event mutations like Dawnbound (150x) and Void Touched (135x), the range of possible value multipliers is enormous.

The key mechanic that players need to understand is additive stacking. Unlike many games where buffs multiply each other, Grow a Garden uses an additive formula: (1 + Sum of All Multipliers - Number of Mutations). This means a crop with Wet (2x) and Chilled (2x) gets a mutation factor of 3x total, not 4x. The practical implication is that adding more high-value mutations gives diminishing relative returns but still linear absolute gains. A single Shocked (100x) mutation gives a factor of 100, while adding Wet (2x) on top raises it to 101 — a 1% relative increase but still a full multiplier point in absolute terms.

Quality modifiers apply multiplicatively on top of the mutation factor. A Rainbow quality crop (50x) with a mutation factor of 100 gives a combined multiplier of 5,000x before friend boost. This is why experienced traders prize Rainbow crops with high-tier mutations — the multiplicative interaction between quality and mutation stacking creates astronomical values.

The friend boost system adds another layer. Having friends in your server provides a percentage bonus that multiplies the final value. This incentivizes community play and makes cooperative farming sessions significantly more profitable than solo grinding.

For traders, understanding exact crop values is critical for fair trades. The Grow a Garden trading economy runs on knowledge — knowing whether a crop with Celestial + Aurora (Cosmic combo, 240x) is worth more or less than one with Void Touched (135x) + Dawnbound (150x) requires precise calculation. Our calculator eliminates guesswork by computing exact values in real-time as you select mutations.

The mutation system in Grow a Garden is tied to various game events and mechanics. Weather mutations (Wet, Chilled, Shocked, Sandy, Sundried, Aurora) come from in-game weather events that cycle regularly. Pet ability mutations (Burnt, Verdant, Static, Bloom, Stampede, Terran) come from specific pets using their passive abilities on your crops. Admin event mutations (Disco, Celestial, Galactic, Void Touched, Dawnbound) come from special server-wide events triggered by game administrators and are among the rarest and most valuable.

Combo mutations represent the pinnacle of the value system. These are created by combining specific mutations — for example, combining Celestial (120x) with Aurora (90x) creates Cosmic (240x), and further combining Cosmic with Galactic (120x) creates Astral (365x), one of the highest possible multipliers in the game. Understanding these combo recipes is essential for maximizing crop value, and our calculator displays the recipe for each combo mutation.

The Grow a Garden community spans the globe. As one of Roblox's top experiences, it attracts players from the United States, United Kingdom, Philippines, Brazil, Indonesia, Turkey, and virtually every country where Roblox is available. Trading happens across servers with players communicating in dozens of languages. This calculator serves the entire global community with a language-agnostic interface — numbers are universal.

Whether you are a new player trying to understand why your Rainbow Shocked crop sold for millions, or a veteran trader calculating whether a specific mutation combination justifies the time investment to obtain it, this calculator gives you instant answers. Input your base crop value, select your mutations, set your quality and friend boost, and see the exact final value broken down into each component multiplier.`;

export default function GrowAGardenCalculatorPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://makersilo.com' },
              { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://makersilo.com/calculators' },
              { '@type': 'ListItem', position: 3, name: 'Grow a Garden Calculator', item: 'https://makersilo.com/calculators/grow-a-garden-calculator' },
            ],
          }),
        }}
      />
      <ToolSchema
        name="Grow a Garden Calculator"
        description="Free Grow a Garden crop mutation value calculator. Select from 100+ mutations, set quality and friend boost, calculate total sheckle value instantly."
        category="Calculator"
        url="https://makersilo.com/calculators/grow-a-garden-calculator"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Use the Grow a Garden Calculator',
            step: steps.map((s, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: s.title,
              text: s.description,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/calculators/" className="hover:text-white transition-colors">Calculators</a>
            <span>/</span>
            <span className="text-emerald-400">Grow a Garden Calculator</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">Roblox Tool</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Grow a Garden Calculator
            </h1>
            <p className="text-lg text-gray-400">
              Calculate your crop&apos;s total sheckle value by selecting from 100+ mutations, setting quality (Silver/Gold/Rainbow), friend boost, and amount. Uses the official additive stacking formula.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <GagCalculatorClient />

            <section className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-200/80">
                <strong className="text-amber-300">Disclaimer:</strong> This is a fan-made calculator and is not officially affiliated with Grow a Garden or Roblox Corporation. Mutation multipliers are based on community-verified game mechanics and may change with game updates.
              </p>
            </section>

            <HowToUse keyword="Grow a Garden Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="Grow a Garden Calculator" />
            <LongContent content={longContent} keyword="Grow a Garden Calculator" />

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
