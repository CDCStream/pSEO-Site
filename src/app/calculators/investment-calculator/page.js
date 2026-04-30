import InvestmentCalculatorClient from './InvestmentCalculatorClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { DollarSign, TrendingUp, Calculator, PieChart } from 'lucide-react';

export const metadata = {
  title: 'Investment Calculator - See How Your Money Grows | MakerSilo',
  description: 'Free investment calculator to estimate how your money grows with compound interest. Enter your age, monthly contribution, and expected return to see your future investment value.',
  keywords: 'investment calculator, compound interest calculator, retirement calculator, investment growth calculator, dave ramsey investment calculator, how much will my investments be worth, monthly contribution calculator',
  openGraph: {
    title: 'Investment Calculator - See How Your Money Grows Over Time',
    description: 'Free investment calculator with compound interest. See your future investment value based on monthly contributions and expected returns.',
    type: 'website',
  },
};

const steps = [
  { icon: Calculator, title: 'Enter Your Age', description: 'Input your current age and the age you plan to retire. This determines your investment timeline.' },
  { icon: DollarSign, title: 'Add Financial Details', description: 'Enter your current investment balance and how much you plan to contribute monthly.' },
  { icon: TrendingUp, title: 'Set Expected Return', description: 'Choose your expected annual return rate. The S&P 500 has historically returned 10-12% over 30 years.' },
  { icon: PieChart, title: 'View Results', description: 'See your estimated future value, growth breakdown, bar chart, and "What if" scenarios for extra savings.' },
];

const faqs = [
  { q: 'How does the investment calculator work?', a: 'The calculator uses the compound interest formula with monthly contributions. It takes your initial balance, adds monthly contributions, and applies your expected annual return rate compounded monthly over your investment timeline (current age to retirement age). The formula accounts for both the growth of your initial balance and the growth of each monthly contribution.' },
  { q: 'What annual return rate should I use?', a: 'The historical 30-year average annual return of the S&P 500 is roughly 10-12%. A conservative estimate would be 7-8% (accounting for inflation), while an optimistic estimate would be 10-12%. If you invest in bonds or CDs, expect lower returns of 3-5%. We recommend using 10% as a reasonable starting point for stock market investments.' },
  { q: 'How much should I invest per month?', a: 'Financial experts like Dave Ramsey recommend investing 15% of your gross household income. For example, if you earn $5,000/month, aim to invest $750/month. However, any amount is better than nothing — even $100/month can grow significantly over decades thanks to compound interest.' },
  { q: 'What is compound interest?', a: 'Compound interest is when you earn interest not only on your original investment but also on the interest you have already earned. It creates a snowball effect where your money grows exponentially over time. This is why starting early is so important — even small amounts have decades to compound into large sums.' },
  { q: 'Are the calculator results guaranteed?', a: 'No. The calculator provides estimates based on a fixed annual return rate. In reality, stock market returns vary significantly year to year. Some years may see 20%+ gains while others may see losses. However, over long periods (20-30+ years), the market has historically trended upward at approximately 10-12% annually.' },
  { q: 'How do the "What if" scenarios work?', a: 'The "What if" section shows how much extra wealth you could build by investing additional money each month. For example, giving up a $4.27 daily coffee ($128/month) and investing that amount instead could generate hundreds of thousands in additional growth over decades, thanks to the power of compound interest.' },
];

const longContent = `The Investment Calculator is a powerful financial planning tool that shows you exactly how your money can grow over time through the magic of compound interest. Whether you are just starting your investment journey or planning for retirement, this calculator gives you a clear picture of your financial future based on your current savings, monthly contributions, and expected market returns.

Understanding compound interest is the foundation of successful long-term investing. Unlike simple interest, which only earns returns on your original investment, compound interest earns returns on both your principal and your accumulated gains. This creates an exponential growth curve that becomes more dramatic the longer you invest. A 25-year-old who invests $500 per month at 10% annual return will have approximately $3.16 million by age 65 — even though they only contributed $240,000 of their own money. The remaining $2.92 million is pure growth from compound interest.

The calculator uses the future value formula for compound interest with regular monthly contributions. For your initial balance, it calculates: FV = PV × (1 + r)^n, where PV is your current balance, r is the monthly interest rate, and n is the total number of months. For monthly contributions, it adds: PMT × ((1 + r)^n - 1) / r. This industry-standard formula is the same one used by financial advisors and retirement planning tools.

Your investment timeline is one of the most critical factors in wealth building. The difference between starting at age 25 versus age 35 is enormous. Those extra 10 years of compounding can mean the difference between retiring with $3 million versus $1.2 million, even with identical monthly contributions. This is why every financial expert emphasizes starting as early as possible — time is your greatest asset in investing.

The expected annual return you choose significantly impacts your results. Historically, the S&P 500 index has delivered approximately 10-12% average annual returns over 30-year periods. However, this includes years of significant gains and years of losses. A more conservative estimate of 7-8% accounts for inflation, giving you results in today's purchasing power. For a diversified portfolio of growth stock mutual funds, 10% is a commonly used benchmark.

Monthly contribution amount is the variable you have the most control over. Financial advisors typically recommend investing 15% of your gross household income. However, even smaller amounts make a significant difference over time. The "What if" scenarios in our calculator demonstrate this powerfully — giving up a daily coffee habit and investing that money instead can generate hundreds of thousands of dollars in additional growth over a 30-year period.

The results breakdown shows three components of your future wealth: your initial balance (money you already have invested), total contributions (the sum of all monthly payments over your timeline), and growth (the compound interest earned on everything). For long investment horizons, growth typically represents 60-80% of your total future value, demonstrating the incredible power of compound interest over time.

The bar chart visualization shows your investment growth year by year, making it easy to see how compound interest accelerates over time. Notice how the bars grow slowly at first but increasingly faster in later years — this is the exponential nature of compounding at work. The visual makes it clear why patience and consistency are the keys to investment success.

Use this calculator to set realistic retirement goals, compare different contribution levels, understand the impact of starting early versus starting late, and motivate yourself to stay consistent with monthly investing. Remember: the best time to start investing was yesterday. The second best time is today.`;

export default function InvestmentCalculatorPage() {
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
              { '@type': 'ListItem', position: 3, name: 'Investment Calculator' },
            ],
          }),
        }}
      />
      <ToolSchema
        name="Investment Calculator"
        description="Free investment calculator to estimate how your money grows with compound interest and monthly contributions over time."
        category="Calculator"
        url="https://makersilo.com/calculators/investment-calculator"
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/calculators/" className="hover:text-white transition-colors">Calculators</a>
            <span>/</span>
            <span className="text-gray-300">Investment Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Investment Calculator
            </h1>
            <p className="text-lg text-gray-400">
              See how much your investments could be worth in the future. Enter your details to estimate your earning potential with compound interest and regular monthly contributions.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <InvestmentCalculatorClient />

            <HowToUse keyword="Investment Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="Investment Calculator" />
            <LongContent content={longContent} keyword="Investment Calculator" />

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
