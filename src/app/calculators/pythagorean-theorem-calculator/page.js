import PythagoreanCalculatorClient from './PythagoreanCalculatorClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Triangle, Sigma, Calculator, ListChecks } from 'lucide-react';

export const metadata = {
  title: 'Pythagorean Theorem Calculator - Solve a² + b² = c² with Steps | MakerSilo',
  description:
    'Free Pythagorean theorem calculator. Solve for the hypotenuse or any missing leg of a right triangle with step-by-step working, area, perimeter, and angles.',
  keywords:
    'pythagorean theorem calculator, hypotenuse calculator, pythagoras calculator, find missing side right triangle, a squared plus b squared equals c squared calculator, pythagorean theorem with steps, right triangle side calculator, find leg of right triangle, pythagorean theorem solver',
  alternates: {
    canonical: 'https://makersilo.com/calculators/pythagorean-theorem-calculator/',
  },
  openGraph: {
    title: 'Pythagorean Theorem Calculator - Solve a² + b² = c² with Steps',
    description:
      'Free Pythagorean theorem calculator. Solve for the hypotenuse or any leg of a right triangle. See step-by-step working plus area, perimeter, and angles.',
    type: 'website',
    url: 'https://makersilo.com/calculators/pythagorean-theorem-calculator/',
    siteName: 'MakerSilo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pythagorean Theorem Calculator - Solve a² + b² = c² with Steps',
    description:
      'Solve for the hypotenuse or any leg of a right triangle. Step-by-step derivation, area, perimeter, and angles included.',
  },
};

const steps = [
  {
    icon: ListChecks,
    title: 'Pick what to solve for',
    description: 'Choose whether you want to find the hypotenuse c, leg a, or leg b. The calculator automatically updates to ask only for the two sides you already know.',
  },
  {
    icon: Triangle,
    title: 'Enter the two known sides',
    description: 'Type the lengths of the two sides you know. Use any positive number — the calculator works with whole numbers, decimals, and any unit (the unit is just a label for display).',
  },
  {
    icon: Calculator,
    title: 'Click Calculate',
    description: 'Press Calculate to instantly get the missing side using the Pythagorean theorem. The result card also shows the triangle\u2019s area, perimeter, and both acute angles in degrees.',
  },
  {
    icon: Sigma,
    title: 'Tap Show calculation steps',
    description: 'Open the step-by-step panel to see the full derivation: starting from a² + b² = c², substituting your numbers, squaring, adding (or subtracting), and taking the square root.',
  },
];

const faqs = [
  {
    q: 'What is the Pythagorean theorem?',
    a: 'The Pythagorean theorem states that for any right triangle (a triangle with one 90° angle), the squared length of the hypotenuse equals the sum of the squared lengths of the other two sides. In symbols: a² + b² = c², where c is the hypotenuse and a and b are the two legs that form the right angle. The theorem is named after the ancient Greek mathematician Pythagoras, although evidence suggests it was known to the Babylonians and Indians centuries earlier.',
  },
  {
    q: 'How do I find the hypotenuse with the Pythagorean theorem?',
    a: 'To find the hypotenuse c when you know both legs a and b, square each leg, add the squares together, and take the square root: c = √(a² + b²). For example, with legs of 3 and 4: c = √(9 + 16) = √25 = 5. This calculator does the arithmetic for you and also shows the full derivation step by step.',
  },
  {
    q: 'How do I find a missing leg of a right triangle?',
    a: 'Rearrange the formula. To find leg a when you know leg b and hypotenuse c, use a = √(c² − b²). To find leg b when you know leg a and hypotenuse c, use b = √(c² − a²). Important: the hypotenuse must be strictly larger than the known leg, otherwise no real right triangle exists. For example, with hypotenuse 13 and leg 5: b = √(169 − 25) = √144 = 12.',
  },
  {
    q: 'What if the hypotenuse is smaller than a known leg?',
    a: 'No real right triangle exists. The hypotenuse is always the longest side of a right triangle — it lies opposite the right angle and must be longer than either of the two legs. If you enter a hypotenuse that is smaller than (or equal to) a leg, the formula produces the square root of a negative number (or zero), which has no real solution. The calculator detects this case and shows a clear error message asking you to double-check the values.',
  },
  {
    q: 'What is a Pythagorean triple?',
    a: 'A Pythagorean triple is a set of three positive integers (a, b, c) that satisfy a² + b² = c². The most famous is the 3-4-5 triple (because 9 + 16 = 25). Other primitive Pythagorean triples include 5-12-13, 8-15-17, 7-24-25, 9-40-41, 20-21-29, 12-35-37, 11-60-61, and 28-45-53. Every primitive triple can be scaled by an integer k to produce another valid triple, so 6-8-10 and 9-12-15 are also Pythagorean triples (multiples of 3-4-5). Triples are widely used in carpentry, masonry, and surveying because they let you check that a corner is exactly square without an angle measurement.',
  },
  {
    q: 'Does the Pythagorean theorem only work for right triangles?',
    a: 'Yes. The relationship a² + b² = c² is exclusive to right triangles. For any triangle that is not a right triangle, the equation does not hold and you need the more general law of cosines: c² = a² + b² − 2ab·cos(C), where C is the angle opposite side c. When C = 90°, cos(C) = 0 and the law of cosines collapses back to the Pythagorean theorem, which is why the Pythagorean theorem can be viewed as a special case of the law of cosines.',
  },
  {
    q: 'Are "Pythagorean theorem" and "Pythagoras\u2019 theorem" the same thing?',
    a: 'Yes — both names refer to the same mathematical result, a² + b² = c². "Pythagorean theorem" is the spelling used most often in American English, while "Pythagoras\u2019 theorem" is more common in British English. You may also see "Pythagoras theorem" without the apostrophe, particularly in older textbooks. All three phrases describe the same theorem about right triangles.',
  },
  {
    q: 'How do I calculate the area and perimeter of a right triangle?',
    a: 'Area is half the product of the two legs: A = (a × b) / 2. The perimeter is the sum of all three sides: P = a + b + c. For example, a 3-4-5 right triangle has area = (3 × 4) / 2 = 6 and perimeter = 3 + 4 + 5 = 12. This calculator computes both values automatically as soon as you find the third side.',
  },
  {
    q: 'How accurate is this calculator?',
    a: 'The calculator uses double-precision floating-point arithmetic (IEEE-754, the JavaScript standard) and the numerically stable Math.hypot function for the hypotenuse, which avoids overflow and underflow even for very large or very small inputs. Results are accurate to roughly 15 significant digits internally. You can choose how many decimal places to display in the result (1 to 6). Exact integer results, such as the 3-4-5 triple, are shown as integers rather than padded with trailing zeros.',
  },
];

const longContent = `The Pythagorean Theorem Calculator is a free online tool that finds any missing side of a right triangle in one click. Pick whether you want the hypotenuse or one of the legs, type the two values you already know, and the calculator returns the third side, the triangle\u2019s area, perimeter, and both acute angles in degrees. A collapsible step-by-step panel shows the full derivation so you can hand the working in for class or double-check the arithmetic for yourself.

The Pythagorean theorem is one of the oldest and most influential results in mathematics. It states that in any right triangle (a triangle with one 90° angle) the area of the square built on the hypotenuse equals the combined area of the squares built on the two legs. Algebraically: a² + b² = c², where c is the hypotenuse — the side opposite the right angle, always the longest of the three — and a and b are the two legs that form the right angle. The theorem is named after the Greek mathematician Pythagoras of Samos (c. 570-495 BC), although clay tablets show that the relation was known to Babylonian scribes more than a thousand years earlier and to Indian mathematicians of the Sulba Sutras tradition.

There are three ways to use the formula, and the calculator handles all of them. To find the hypotenuse from two legs, the calculator computes c = √(a² + b²). To find a missing leg when you know the hypotenuse and the other leg, it rearranges to a = √(c² − b²) or b = √(c² − a²). The classic worked example is 3-4-5: with legs 3 and 4, the hypotenuse is √(9 + 16) = √25 = 5 exactly. With hypotenuse 13 and leg 5, the missing leg is √(169 − 25) = √144 = 12 exactly. With two legs of length 1, the hypotenuse is √2 ≈ 1.4142, the diagonal of a unit square — a number whose irrationality famously shocked the ancient Pythagoreans.

A Pythagorean triple is a set of three positive integers (a, b, c) for which a² + b² = c² holds exactly. Primitive triples — those whose three numbers share no common factor — are surprisingly numerous. The first ten in order of hypotenuse are 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29, 9-40-41, 12-35-37, 11-60-61, 28-45-53, and 33-56-65. Every primitive triple can be scaled by any positive integer k to produce another valid triple, so 6-8-10, 9-12-15, 12-16-20 and so on are all "shadows" of 3-4-5. Triples have a long practical history: Egyptian rope-stretchers used a 3-4-5 loop tied at twelve evenly spaced knots to lay out perfectly square corners for the bases of pyramids, and modern carpenters still use the same trick to check that a wall is plumb against a floor.

The Pythagorean theorem appears everywhere once you start looking. It is the basis for the distance formula in coordinate geometry: the distance between two points (x₁, y₁) and (x₂, y₂) on the plane is √((x₂ − x₁)² + (y₂ − y₁)²), which is just the Pythagorean theorem applied to the legs of a right triangle whose hypotenuse joins the two points. It tells you the diagonal of a screen given its width and height — a 16:9 television advertised as "55 inches" is measuring the hypotenuse, not the width. It tells you the length of a rafter given the run and rise of a roof, the length of a ladder given the height it must reach and how far its base sits from the wall, and the great-circle distance approximation for short hops on a map. In computer graphics and physics, it is the workhorse behind vector magnitude, collision detection, and lighting falloff calculations.

The calculator also returns the two acute angles in the right triangle, computed as α = arctan(a / b) and β = arctan(b / a), the angles opposite sides a and b respectively. These two angles always sum to exactly 90° because the triangle\u2019s three interior angles must total 180° and the right angle alone accounts for 90°. The area uses the simple formula A = (a × b) / 2, since the two legs are perpendicular and so serve directly as the base and height of the triangle. The perimeter is the straightforward sum a + b + c.

A small but important note about accuracy. The calculator computes the hypotenuse with the JavaScript Math.hypot function, which is specifically designed to avoid numerical overflow when the legs are very large and underflow when they are very small — it does not simply compute Math.sqrt(a*a + b*b). For solving a missing leg, the calculator uses the factored form √((c − leg)(c + leg)) instead of √(c² − leg²) because the factored form preserves more significant digits when the hypotenuse and leg are nearly equal. Internally everything is computed in IEEE-754 double precision and rounded only at display time, so the answers are accurate to about 15 significant digits regardless of how many decimal places you choose to show.

Finally, a reminder about scope. The Pythagorean theorem is exclusive to right triangles — triangles with one 90° angle. For any other triangle the more general law of cosines applies: c² = a² + b² − 2ab·cos(C), where C is the angle opposite side c. When the angle C happens to be 90°, cos(C) = 0 and the law of cosines collapses back to a² + b² = c². So you can think of the Pythagorean theorem as the right-triangle special case of a more general result. For non-right triangles use a triangle solver that supports the law of cosines and the law of sines instead.`;

export default function PythagoreanTheoremCalculatorPage() {
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
              { '@type': 'ListItem', position: 3, name: 'Pythagorean Theorem Calculator' },
            ],
          }),
        }}
      />
      <ToolSchema
        name="Pythagorean Theorem Calculator"
        description="Free Pythagorean theorem calculator. Solve a² + b² = c² for any side of a right triangle. Step-by-step working plus area, perimeter, and both acute angles."
        category="Calculator"
        url="https://makersilo.com/calculators/pythagorean-theorem-calculator"
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/calculators/" className="hover:text-white transition-colors">Calculators</a>
            <span>/</span>
            <span className="text-gray-300">Pythagorean Theorem Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Pythagorean Theorem Calculator
            </h1>
            <p className="text-lg text-gray-400">
              Solve a² + b² = c² for any side of a right triangle. Get the missing side instantly with step-by-step working, area, perimeter, and both acute angles in degrees.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <PythagoreanCalculatorClient />

            <HowToUse keyword="Pythagorean Theorem Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="Pythagorean Theorem Calculator" />
            <LongContent content={longContent} keyword="Pythagorean Theorem Calculator" />

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
