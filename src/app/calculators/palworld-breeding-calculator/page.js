import PalworldBreedingClient from './PalworldBreedingClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Search, MousePointerClick, Sparkles, Sigma } from 'lucide-react';
import { palworldPalCount } from '@/data/palworld-pals';
import { specialComboCount } from '@/data/palworld-special-combos';

export const metadata = {
  title: 'Palworld Breeding Calculator - Find Any Pal Offspring | MakerSilo',
  description:
    'Free Palworld breeding calculator. Pick any two parents and instantly see the child Pal, with the BreedingPower math and special combo overrides explained.',
  keywords:
    'palworld breeding calculator, palworld breeding combos, palworld breeding chart, palworld breeding combinations, how to breed pals palworld, palworld breeding power, palworld special combos, necromus breeding palworld, anubis breeding palworld, frostallion noct breeding, palworld pal breeding guide, palworld baby pal calculator',
  alternates: {
    canonical: 'https://makersilo.com/calculators/palworld-breeding-calculator/',
  },
  openGraph: {
    title: 'Palworld Breeding Calculator - Find Any Pal Offspring',
    description:
      'Pick any two Pals and instantly see the child. Same-species, special combos, and BreedingPower math all handled.',
    type: 'website',
    url: 'https://makersilo.com/calculators/palworld-breeding-calculator/',
    siteName: 'MakerSilo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palworld Breeding Calculator - Find Any Pal Offspring',
    description:
      'Pick any two Pals and instantly see the child. Same-species, special combos, and BreedingPower math all handled.',
  },
};

const steps = [
  {
    icon: MousePointerClick,
    title: 'Pick Parent A',
    description:
      'Tap the left slot to open the Pal picker. Search by name, paldex, or element, and use the filter chips to narrow by Fire, Water, Grass, Ground, Electric, Ice, Dark, Dragon, or Neutral, plus Common / Rare / Epic / Legendary rarity.',
  },
  {
    icon: Search,
    title: 'Pick Parent B',
    description:
      'Tap the second slot and pick the other parent the same way. Order does not matter — A + B gives the same baby as B + A. Use Swap if you want to flip them.',
  },
  {
    icon: Sparkles,
    title: 'See the computed child',
    description:
      'The child slot updates the moment both parents are picked. A coloured badge tells you whether the result came from the same-species rule, a hardcoded special combo, or the closest BreedingPower match.',
  },
  {
    icon: Sigma,
    title: 'Read the math breakdown',
    description:
      'Tap "Why this child?" under the child card to see the exact arithmetic: avg = floor((PowerA + PowerB + 1) / 2), the closest matching Pal, and the absolute distance from that average.',
  },
];

const faqs = [
  {
    q: 'How does Palworld breeding actually work?',
    a: 'Two parents make an egg. The game picks the offspring in three layers, in this order. (1) Same species: A + A always produces A. (2) Special combo override: about two dozen hardcoded pairings always produce a fixed Pal — for example Frostallion + Jetragon always produces Necromus, regardless of any power math. (3) Closest-power match: for every other pair, the game averages the parents\u2019 internal BreedingPower stat with the formula avg = floor((PowerA + PowerB + 1) / 2) and picks the Pal whose own BreedingPower is closest to that number. Ties are broken by an internal index that lines up with alphabetical order for most cases.',
  },
  {
    q: 'What is BreedingPower?',
    a: 'BreedingPower (sometimes called CombiRank in datamined files) is a hidden integer assigned to every breedable Pal. It represents roughly "how late-game" the Pal is — common starter Pals like Lamball and Cattiva sit at 1460-1500, common but tougher Pals are in the 700-1300 range, Rare and Epic Pals are in the 200-700 range, and the four Legendaries (Frostallion, Jetragon, Paladius, Necromus) sit at 70-120. Lower numbers mean a more powerful breeding outcome. The numbers themselves are arbitrary — what matters is the ordering. This calculator uses the same numbers that the game uses internally.',
  },
  {
    q: 'Are the special combos really hardcoded?',
    a: 'Yes. The game ships an explicit list of "if Parent A and Parent B are this exact pair, always return this child" rules that override the closest-power formula. They cover most of the iconic dual-element variants (Pyrin Noct, Jormuntide Ignis, Suzaku Aqua, Reptyro Cryst, Mossanda Lux, Wumpo Botan, Vanwyrm Cryst, Eikthyrdeer Terra, Elphidran Aqua, Mau Cryst, Robinquill Terra, Broncherry Aqua, Dinossom Lux, Surfent Terra, Kingpaca Cryst, Relaxaurus Lux, Lyleen Noct, Frostallion Noct, Helzephyr Lux, Blazehowl Noct), plus the Legendary cross-routes (Frostallion + Jetragon = Necromus, Jetragon + Frostallion Noct = Paladius). This calculator checks the special-combo list before it ever touches the power math.',
  },
  {
    q: 'Why does my baby keep coming out the same as a parent?',
    a: 'Two reasons. First, the same-species rule: A + A always breeds A. Second, even when the parents are different, the closest-power match can still land on one of them if the average happens to fall closer to a parent than to any other Pal in the pool. To reach a target Pal you usually need parents whose averaged BreedingPower lands close to that target — sometimes that means breeding a different intermediate Pal first.',
  },
  {
    q: 'Do I need a male and a female to breed?',
    a: 'Yes — a single breeding farm needs one Pal of each gender. The calculator does not show gender because the resulting child is the same either way; only the order of the two BreedingPower numbers matters, and addition is commutative. Cake is required to start incubating; an egg appears in roughly 5 in-game minutes if both parents have full sanity.',
  },
  {
    q: 'How are variants like Cryst, Noct, Lux, Terra, Aqua, Ignis, and Botan inherited?',
    a: 'Variants are not inherited automatically — you have to either roll a special combo or land the closest-power match exactly on that variant. For example Mau Cryst is reached via the special combo Mau + Pengullet (which always outputs Mau Cryst), or by any pair whose averaged BreedingPower happens to be close enough to Mau Cryst\u2019s value (around 1440) and not closer to a different Pal. Most variant breeds are deliberately gated behind their special-combo route because the math alone would rarely land there.',
  },
  {
    q: 'How do I breed Necromus, Paladius, Frostallion Noct, or Anubis?',
    a: 'Anubis falls out of the closest-power formula: pairs whose average lands near Anubis\u2019 BreedingPower (around 570) tend to roll Anubis — common combinations include Penking + Bushi, Bushi + Surfent Terra, and Incineram Noct + Penking. Necromus comes from the special combo Frostallion + Jetragon. Paladius comes from Jetragon + Frostallion Noct. Frostallion Noct itself comes from Frostallion + Helzephyr. The calculator marks each result with a "Special Combo" badge whenever a hardcoded route is being used.',
  },
  {
    q: 'Is this calculator accurate?',
    a: 'Yes. The math implements the publicly documented in-game formula exactly: avg = floor((PowerA + PowerB + 1) / 2), with same-species short-circuit, the special-combo override list, and an alphabetical tie-break. The Pal table contains every breedable Pal in the base game plus the Sakurajima, Tides of Terraria, and Feybreak content updates. If a future patch changes BreedingPower values or adds new combos, those values update with the page.',
  },
  {
    q: 'How does this differ from palworld.gg, game8, or progameguides calculators?',
    a: 'The math is identical because every accurate breeding calculator must implement the same in-game formula. What this page adds is a clear "Why this child?" panel that prints the actual arithmetic step by step, search and filter chips by element and rarity, the ability to use a computed child as a parent for chained breeding planning, and persistent state so your last picked pair is still there when you come back later. The calculator is also fully responsive and works offline once cached.',
  },
  {
    q: 'Are tiebreaks alphabetical?',
    a: 'Effectively yes for almost all pairs. The game uses an internal Pal index (close to paldex order) for tie-breaking when two Pals are equidistant from the average. For the vast majority of combinations the alphabetically earlier name also has the lower internal index, so an alphabetical tiebreak gives the same result as the in-game logic. Edge cases involving DLC Pals can occasionally diverge by one alphabetical position; we cross-reference the public combo lists to keep the displayed result consistent with the canonical breeding routes.',
  },
];

const longContent = `The Palworld Breeding Calculator on this page lets you instantly see what offspring any two parent Pals will produce. Pick a Pal in each slot, and the child appears immediately along with a colour-coded badge that explains how the result was derived: same-species rule, hardcoded special combo, or closest-BreedingPower numeric match. A "Why this child?" expander prints the exact arithmetic so you can trust the answer and learn the formula at the same time.

Palworld breeding boils down to three layered rules that the game evaluates in a fixed order. The first rule is the same-species shortcut: if both parents are the exact same Pal, including the same variant, the offspring is always that same Pal. Two Lamballs always make a Lamball; two Mau Crysts always make a Mau Cryst; two Frostallions always make a Frostallion. There is no chance of randomness or upgrade — the same-species rule short-circuits everything else and returns the parents\u2019 own species. This is why "stat-stacking" by breeding two of the same Pal repeatedly works as an end-game strategy without ever changing the species.

The second rule is the special-combo override. About two dozen specific parent pairs are hardcoded inside the game files and always produce a predetermined offspring no matter what the math would otherwise say. These are the iconic dual-element variants and Legendary routes that make Palworld\u2019s breeding system feel handcrafted instead of purely numerical. Documented examples include Frostallion + Jetragon producing Necromus, Jetragon + Frostallion Noct producing Paladius, Frostallion + Helzephyr producing Frostallion Noct, Jormuntide + Pyrin producing Jormuntide Ignis, Suzaku + Jormuntide producing Suzaku Aqua, Mau + Pengullet producing Mau Cryst, Vanwyrm + Foxcicle producing Vanwyrm Cryst, Eikthyrdeer + Hangyu producing Eikthyrdeer Terra, Elphidran + Surfent producing Elphidran Aqua, Pyrin + Katress producing Pyrin Noct, Mossanda + Grizzbolt producing Mossanda Lux, Mossanda + Rayhound producing Grizzbolt, Relaxaurus + Sparkit producing Relaxaurus Lux, Kingpaca + Reindrix producing Kingpaca Cryst, Lyleen + Menasting producing Lyleen Noct, Robinquill + Fuddler producing Robinquill Terra, Broncherry + Fuack producing Broncherry Aqua, Surfent + Dumud producing Surfent Terra, Reptyro + Cryolinx producing Reptyro Cryst, Wumpo + Mossanda producing Wumpo Botan, Dinossom + Rayhound producing Dinossom Lux, Mammorest + Wumpo producing Mammorest Cryst, Helzephyr + Lyleen producing Helzephyr Lux, Pyrin + Ragnahawk producing Faleris, and the variant routes for Kelpsea, Leezpunk, Gobfin, and others. Whenever the calculator displays a "Special Combo" badge it means that pair is in this list and the math beneath would otherwise have produced a different result.

The third rule, applied only when the first two do not match, is the closest-power match. Every breedable Pal in the game has a hidden integer stat called BreedingPower (it appears as CombiRank in datamined files). The exact numbers are arbitrary, but their ordering encodes how late-game each Pal is supposed to feel: common starters like Lamball, Chikipi, and Cattiva sit at 1460-1500; basic-but-not-trivial Pals like Foxparks and Lifmunk are in the 1300-1430 band; mid-tier Pals like Anubis and Grizzbolt are in the 200-700 range; and the four Legendaries — Frostallion, Jetragon, Necromus, and Paladius — are at 70-120. Lower numbers mean stronger Pals. To compute the offspring of any non-special pair, the game averages the two parents\u2019 BreedingPower with the formula avg = floor((PowerA + PowerB + 1) / 2), then walks the entire roster of breedable Pals and picks the one whose own BreedingPower is closest to that average. Ties are broken by an internal Pal index that for the most part lines up with alphabetical order.

The +1 inside the floor is the part that trips up most home-brewed calculators. Without it, an average of 800 and 850 would give floor(1650 / 2) = 825, but the game actually computes floor((800 + 850 + 1) / 2) = floor(1651 / 2) = 825. For two even powers the +1 changes nothing because the sum is already even and the +1 is removed by floor. But for two odd powers or one of each parity, the +1 nudges the rounding so that the result always matches the in-game value. Always use the +1 form. Skip it and you will produce off-by-one mismatches on roughly half of all pairings.

That handful of rules is enough to model the entire breeding system. To reach Anubis, for example, you do not need a special combo at all — you just need a parent pair whose averaged BreedingPower lands close to 570. Penking (520) and Bushi (640) average to floor((520 + 640 + 1) / 2) = 580, which is closer to Anubis than to either Penking or Bushi, so Penking + Bushi reliably produces Anubis. Bushi + Surfent Terra (640 + 550) averages to 595, also nearest Anubis. Even slightly off-target pairs can land on Anubis depending on what other Pals sit nearest the average. The same logic applies to any rare offspring you want: figure out the target\u2019s BreedingPower, find two parents whose averaged power is closest to that number while also being closer to the target than to any other Pal, and you have a guaranteed breeding route.

This brings us to multi-step breeding. Some Pals are easier to reach via an intermediate stop than from your starting roster. A common path to Frostallion Noct is to first breed a Frostallion (special combo from a few documented routes), then pair it with Helzephyr (also itself a result of mid-game breeding), which triggers the Frostallion + Helzephyr = Frostallion Noct special combo. To reach Necromus the canonical fastest path is to acquire one Frostallion and one Jetragon — both wild-catchable Legendaries — and breed them directly, since their special combo overrides any math. Anubis-into-Faleris-into-Suzaku Aqua is a popular endgame ladder for fire-immunity volcano farming. The calculator helps with planning by letting you instantly turn the computed child into the next parent slot.

A few gotchas. Variants are not contagious. Breeding a Cryst variant with a non-Cryst parent does not pass on the variant unless the resulting average happens to land on the variant\u2019s BreedingPower, which is unusual. Most variants are reached only via their special-combo route. Bellanoir is a special raid-summon Pal in the data files; some Pals such as Bellanoir Libero have a sentinel BreedingPower of 1 because they are not reachable through normal pairing — the calculator excludes those from the closest-power pool so they never surface as a phantom answer. The BreedingPower numbers themselves are tuned for each game patch; if you find a discrepancy with in-game results, double-check that the table here matches the latest patch — values can shift slightly with content updates.

A note on accuracy and tiebreaks. When two Pals are exactly equidistant from the average, the in-game tie-breaker uses each Pal\u2019s internal index, which is roughly the paldex number. For the vast majority of pairs the alphabetically earlier Pal is also the one with the lower internal index, so an alphabetical tiebreak produces the same answer as the game. We use that approximation, cross-checked against the canonical breeding combo lists from the community wikis. If you ever notice a one-position alphabetical mismatch with another calculator, that is the cause. The math itself is identical.

Finally, breeding logistics. You need one male and one female Pal in a Breeding Farm, plus a freshly baked cake from a Cooking Pot. The cake recipe is 2 Honey, 2 Cake Mix, 1 Egg, 5 Wheat, 8 Milk, and 7 Red Berries. Honey comes from Beegarde or Cinnamoth, Eggs from Chikipi, Milk from Mozzarina, and Red Berries grow on bushes. With sanity at 100% an egg appears in roughly five in-game minutes; the egg type is determined the moment it is laid, so this calculator tells you the result before you spend a single egg slot incubating. IV stats and passive traits are inherited semi-randomly from both parents — that part is outside the scope of this offspring calculator and is best handled by a passive-roll sheet.

Disclaimer: Palworld and all Pal designs, names, and visual references are trademarks of Pocket Pair, Inc. MakerSilo is not affiliated with, endorsed by, or sponsored by Pocket Pair. The breeding mechanics described and implemented on this page match the publicly observed in-game formula and are provided for community planning and educational purposes only.`;

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://makersilo.com' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://makersilo.com/calculators' },
    { '@type': 'ListItem', position: 3, name: 'Palworld Breeding Calculator' },
  ],
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to use the Palworld Breeding Calculator',
  description:
    'Pick two parent Pals, the calculator instantly returns the offspring along with the BreedingPower math.',
  step: steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.description,
  })),
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function PalworldBreedingCalculatorPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ToolSchema
        name="Palworld Breeding Calculator"
        description="Free Palworld breeding calculator. Pick any two parents and instantly see the child Pal, with the BreedingPower math and special combo overrides explained."
        category="Calculator"
        url="https://makersilo.com/calculators/palworld-breeding-calculator"
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/calculators/" className="hover:text-white transition-colors">
              Calculators
            </a>
            <span>/</span>
            <span className="text-gray-300">Palworld Breeding Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Palworld Breeding Calculator
            </h1>
            <p className="text-lg text-gray-400">
              Pick any two parent Pals and instantly see the offspring. The calculator handles the
              same-species rule, all {specialComboCount}+ documented special combos, and the
              closest-BreedingPower formula across {palworldPalCount} Pals — with the math shown step
              by step.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <PalworldBreedingClient />

            <HowToUse keyword="Palworld Breeding Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="Palworld Breeding Calculator" />
            <LongContent content={longContent} keyword="Palworld Breeding Calculator" />

            <p className="mt-10 text-xs text-zinc-500 leading-relaxed border-t border-white/5 pt-6">
              Disclaimer: Palworld and all Pal designs, names, and visual references are trademarks
              of Pocket Pair, Inc. MakerSilo is not affiliated with, endorsed by, or sponsored by
              Pocket Pair. The breeding mechanics described match the publicly observed in-game
              formula and are provided for community planning and educational purposes only.
            </p>

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
