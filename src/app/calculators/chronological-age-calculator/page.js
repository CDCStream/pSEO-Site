import ChronologicalAgeClient from './ChronologicalAgeClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Calendar, Clock, Calculator, Download } from 'lucide-react';

export const metadata = {
  title: 'Chronological Age Calculator - Calculate Your Exact Age Free | MakerSilo',
  description: 'Calculate your exact chronological age in years, months, days, hours, and minutes. Free age calculator with detailed breakdown and fun facts. No sign-up required.',
  keywords: 'chronological age calculator, age calculator, calculate my age, how old am i, age in days, age in months, date of birth calculator, exact age calculator, age difference calculator',
  openGraph: {
    title: 'Chronological Age Calculator - Calculate Your Exact Age Free',
    description: 'Calculate your exact chronological age in years, months, days, hours, and minutes. Free online age calculator with detailed breakdown.',
    type: 'website',
  },
};

const steps = [
  { icon: Calendar, title: 'Enter Date of Birth', description: 'Select your date of birth using the date picker.' },
  { icon: Clock, title: 'Optional Target Date', description: 'Toggle the switch to calculate your age at a specific date instead of today.' },
  { icon: Calculator, title: 'Calculate', description: 'Click "Calculate Age" to see your exact age in years, months, and days.' },
  { icon: Download, title: 'View Breakdown', description: 'See detailed stats: total months, weeks, days, hours, minutes, and fun facts.' },
];

const faqs = [
  { q: 'How does the Chronological Age Calculator work?', a: 'The calculator subtracts your date of birth from today\'s date (or a custom target date you specify) to determine your exact age. It accounts for varying month lengths and leap years to give you a precise result in years, months, and days.' },
  { q: 'What is chronological age?', a: 'Chronological age is the amount of time that has passed from a person\'s birth to a given date. It is the most common way of expressing age and is typically quoted in years, months, and days. This differs from biological age, which considers health and physiological factors.' },
  { q: 'Can I calculate my age at a specific date?', a: 'Yes! Toggle the "Calculate age at a specific date" switch and enter any target date. The calculator will show your age as it would have been (or will be) on that specific date.' },
  { q: 'Is this age calculator free to use?', a: 'Completely free! No sign-up, no email, no hidden fees. Use the calculator as many times as you want with no limitations.' },
  { q: 'What additional information does the calculator provide?', a: 'Beyond years, months, and days, the calculator shows your total age in months, weeks, days, hours, and minutes. It also provides fun facts like your birth day of the week, days until your next birthday, estimated heartbeats, and estimated time spent sleeping.' },
  { q: 'How accurate is the age calculation?', a: 'The calculator is highly accurate. It correctly handles varying month lengths (28, 29, 30, 31 days), leap years, and edge cases like being born at the end of a month. The calculation follows the most common Western age system where age increases on each birthday.' },
];

const longContent = `The Chronological Age Calculator is a free online tool that determines your exact age based on your date of birth. Whether you need to know your precise age for official documents, medical records, school enrollment, or simple curiosity, this calculator provides an instant, accurate result broken down into years, months, days, and more.

Chronological age is the most universally recognized way of measuring how old someone is. It counts the time elapsed from birth to the present moment (or any specified date), following the standard Western convention where age increments on each birthday. This straightforward measurement is used in virtually every official context — from legal age requirements and retirement planning to medical assessments and insurance calculations.

Our calculator goes beyond simple year counting. It provides a comprehensive breakdown of your age across multiple time units. See your total age in months for milestone tracking, in weeks for developmental assessments, in days for a truly granular perspective, and even in hours and minutes for a mind-expanding view of just how much time you have experienced.

The optional target date feature adds powerful flexibility. Instead of calculating age as of today, you can specify any date — past or future. This is useful for determining how old you were at a past event, how old you will be at a future date, or calculating someone else's age at any point in time. Simply toggle the switch and enter your desired date.

Understanding the difference between chronological age and biological age is important. While chronological age is a fixed mathematical calculation, biological age reflects how well your body is aging relative to your chronological age. Factors like genetics, lifestyle, nutrition, exercise, and stress all influence biological aging. Someone who is chronologically 50 might have the biological age of a 40-year-old through healthy living.

Age calculations can vary across cultures. The most common system, used throughout the Western world and implemented in this calculator, counts from zero at birth and increments on each birthday. Some East Asian traditions count from one at birth, with age increasing at the lunar new year rather than the birthday. Our calculator follows the Western system as it is the international standard for legal and administrative purposes.

The fun facts section adds an entertaining dimension to your age calculation. Discover what day of the week you were born on, how many days remain until your next birthday, an estimate of how many times your heart has beaten since birth, and approximately how much of your life you have spent sleeping. These fascinating statistics put your chronological age into tangible, relatable perspective.

This calculator is completely free, requires no registration, and works instantly in your browser. No data is sent to any server — all calculations happen locally on your device for complete privacy. Use it as often as you need for yourself, family members, friends, or any age-related calculation.`;

export default function ChronologicalAgeCalculatorPage() {
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
              { '@type': 'ListItem', position: 3, name: 'Chronological Age Calculator' },
            ],
          }),
        }}
      />
      <ToolSchema
        name="Chronological Age Calculator"
        description="Calculate your exact chronological age in years, months, days, hours, and minutes. Free online age calculator."
        category="Calculator"
        url="https://makersilo.com/calculators/chronological-age-calculator"
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/calculators/" className="hover:text-white transition-colors">Calculators</a>
            <span>/</span>
            <span className="text-gray-300">Chronological Age Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Chronological Age Calculator
            </h1>
            <p className="text-lg text-gray-400">
              Calculate your exact age in years, months, days, hours, and minutes. Enter your date of birth and get a detailed age breakdown instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <ChronologicalAgeClient />

            <HowToUse keyword="Chronological Age Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="Chronological Age Calculator" />
            <LongContent content={longContent} keyword="Chronological Age Calculator" />

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
