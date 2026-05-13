import MortgageCalculatorClient from './MortgageCalculatorClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Home, ListChecks, Calculator, BarChart3, Globe2, AlertCircle } from 'lucide-react';
import { monthlyPI } from '@/lib/mortgage';

export const metadata = {
  title: 'Mortgage Calculator - Free Monthly Payment, Amortization & PMI | MakerSilo',
  description:
    'Free mortgage calculator. Estimate your full monthly payment with taxes, insurance, PMI, and HOA. Includes amortization schedule, bi-weekly comparison, and balance chart.',
  keywords:
    'mortgage calculator, monthly mortgage payment, mortgage payment calculator, home loan calculator, amortization calculator, PITI calculator, PMI calculator, mortgage with taxes and insurance, bi-weekly mortgage calculator, 30 year mortgage calculator, 15 year mortgage calculator',
  alternates: {
    canonical: 'https://makersilo.com/calculators/mortgage-calculator/',
  },
  openGraph: {
    title: 'Mortgage Calculator - Free Monthly Payment, Amortization & PMI',
    description:
      'Estimate your full monthly mortgage payment with taxes, insurance, PMI, and HOA. Free, accurate, with amortization schedule and bi-weekly savings comparison.',
    type: 'website',
    url: 'https://makersilo.com/calculators/mortgage-calculator/',
    siteName: 'MakerSilo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator - Free Monthly Payment, Amortization & PMI',
    description:
      'Free mortgage calculator with PITI, PMI, amortization schedule, bi-weekly comparison, and currency toggle for global use.',
  },
};

const steps = [
  {
    icon: Home,
    title: 'Enter the home value and down payment',
    description: 'Type the home price and your down payment in dollars or as a percentage \u2014 the two fields stay linked so you can edit either one. The loan amount and your loan-to-value (LTV) ratio update instantly underneath.',
  },
  {
    icon: ListChecks,
    title: 'Set the rate, term, and start date',
    description: 'Enter the APR (a current 30-year fixed in the United States is roughly 6\u20137% in early 2026), pick a term (15, 20, or 30 years are most common), and choose the month and year of your first payment.',
  },
  {
    icon: Calculator,
    title: 'Add property tax, insurance, PMI, and HOA',
    description: 'Open the "Taxes, insurance, PMI, HOA" panel and fill in any extras that apply. Property tax accepts either a percentage of home value (typed as a number 20 or below) or an annual dollar amount (any number above 20).',
  },
  {
    icon: BarChart3,
    title: 'Read the result, donut chart, and amortization',
    description: 'The total monthly payment, payoff date, total interest, and PMI drop-off month update live as you type. The amortization table and balance chart below show the year-by-year (or month-by-month) breakdown of every payment, plus a copy-as-CSV button.',
  },
];

const faqs = [
  {
    q: 'How is a mortgage payment calculated?',
    a: 'The principal-and-interest (P&I) part of a mortgage payment is calculated with the standard amortising-loan formula M = P \u00d7 [r(1+r)\u207f] / [(1+r)\u207f \u2212 1], where P is the loan amount, r is the monthly interest rate (annual APR \u00f7 12 \u00f7 100), and n is the total number of monthly payments (years \u00d7 12). Property tax, home insurance, PMI (if applicable), and HOA dues are added on top to give the total monthly payment, often abbreviated PITI when it includes principal, interest, taxes, and insurance.',
  },
  {
    q: 'What is included in PITI?',
    a: 'PITI stands for Principal, Interest, Taxes, and Insurance \u2014 the four components most lenders require you to escrow into a single monthly payment. Principal pays down the loan balance. Interest is the cost of borrowing. Taxes are your annual property tax divided by 12. Insurance is your homeowners insurance premium divided by 12 (and, if your loan-to-value is above 80%, private mortgage insurance is added too). Many calculators (and this one) also let you add HOA dues, which are not part of PITI but are part of your real monthly housing cost.',
  },
  {
    q: 'What is PMI and when does it stop?',
    a: 'Private Mortgage Insurance (PMI) is a monthly fee a lender charges on a conventional loan when the borrower puts less than 20% down (loan-to-value above 80%). It protects the lender, not you, against default. Under the Homeowners Protection Act, lenders are required to automatically terminate PMI once the loan balance reaches 78% of the original home value, and you can typically request termination once you reach 80% LTV. This calculator drops PMI from the schedule the first month your LTV reaches 80% based on the original home value, which is the consumer-facing rule. FHA loans use a separate Mortgage Insurance Premium (MIP) that, since 2013, is generally required for the life of the loan if the original LTV was above 90%.',
  },
  {
    q: 'How much house can I afford?',
    a: 'A widely-used rule of thumb is the 28/36 rule: housing costs (PITI + HOA) should be no more than about 28% of your gross monthly income, and total debt payments (housing plus car, student, and credit-card minimums) no more than 36%. Lenders look at debt-to-income (DTI) ratios when underwriting; conventional loans typically allow up to 43%, with some flexibility for compensating factors. The 28/36 rule is a more conservative budget target that gives room for emergencies, retirement saving, and life changes, and is the number most personal-finance writers recommend.',
  },
  {
    q: 'What is a good mortgage interest rate?',
    a: 'A "good" rate depends on the prevailing market rate at the time you lock. As of early 2026, the average United States 30-year fixed conventional rate is in the mid-to-high 6% range, having come down from the 7-8% peak in late 2023 and early 2024. A rate is "good" if it is at or below the daily average for your loan type, your credit score band, and your loan-to-value ratio. Always compare quotes from at least three lenders \u2014 differences of even 0.25 percentage points add up to thousands of dollars over a 30-year term. Discount points (paying upfront to lower the rate) are generally worthwhile only if you plan to keep the loan for at least the break-even period, often 5\u20137 years.',
  },
  {
    q: 'Is a 15-year or 30-year mortgage better?',
    a: 'A 15-year mortgage has a higher monthly payment but a much lower total interest cost and a shorter rate (typically 0.5\u20130.75 percentage points below the 30-year rate). A 30-year mortgage has a lower monthly payment, more flexibility, and lets you direct any savings toward investing or other priorities. As a worked example, a $300,000 loan at 6% over 30 years has a P&I of $1,799/month and total interest of about $347,500. The same loan over 15 years at 5.5% has a P&I of $2,452/month \u2014 about $653 more per month \u2014 but total interest of only $141,300, a saving of more than $200,000 over the life of the loan. Choose 15 if your budget is comfortable with the higher payment; choose 30 if you value the flexibility or want to invest the difference.',
  },
  {
    q: 'How much do I save with bi-weekly payments?',
    a: 'Paying half of your monthly P&I every two weeks creates 26 half-payments per year, which is equivalent to 13 monthly payments instead of 12 \u2014 one extra full payment annually, applied directly to principal. On a typical 30-year mortgage this strategy shaves 4\u20137 years off the loan and saves tens of thousands of dollars in interest. For a $200,000 loan at 5%, bi-weekly payments pay the loan off in roughly 25 years instead of 30 and save about $34,000 in interest. The savings come entirely from the extra principal, not from any compounding magic; you can achieve the same effect by adding 1/12 of your monthly P&I to your regular payment each month.',
  },
  {
    q: 'What is loan-to-value (LTV)?',
    a: 'Loan-to-value is the loan amount divided by the home value, expressed as a percentage. If you buy a $400,000 home with $80,000 down, your loan amount is $320,000 and your LTV is 320,000 / 400,000 = 80%. LTV is the single most important number for lenders after credit score: it determines whether PMI is required, what interest rate band you fall into, and whether the loan qualifies for various secondary-market programs. Most conventional loans require PMI when LTV is above 80%, and the absolute maximum LTV for most conventional loans is 97% (or 96.5% for FHA, 100% for USDA, and 100% for VA loans for eligible veterans).',
  },
  {
    q: 'How are property taxes calculated for this calculator?',
    a: 'This calculator follows a common convention: if you enter a property-tax value of 20 or below, the tool treats it as a percentage of the home value (so 1.2 means 1.2% of home value per year). If you enter anything above 20, it treats the value as a flat annual dollar amount. Both styles are widely used \u2014 percentage entry is convenient when you know the local mill rate or county effective rate, and dollar entry is convenient when you have last year\u2019s tax bill on hand. Real-estate sites like Zillow, Redfin, and Realtor.com publish current and historical property-tax payments for most homes in the United States, which is the easiest way to find the right number for a specific address.',
  },
  {
    q: 'How does mortgage math differ in the UK, Canada, Australia, and the EU?',
    a: 'United States mortgages are unusually borrower-friendly: most are 30-year fixed-rate loans amortised with monthly compounding, locked in at origination. Canada compounds interest semi-annually, typical amortisation is 25 years, and the rate is fixed for only the first 5 years (sometimes 1, 2, or 3) and resets at renewal. The United Kingdom typical term is 25 years, mostly with a 2/3/5/10-year fixed-rate teaser before reverting to a variable rate. Australian and New Zealand mortgages are typically 25\u201330 years and are mostly variable-rate, with a small minority of borrowers taking 1\u20135 year fixes. Most of the European Union is similar to Australia (variable rate dominant, 25\u201330 year terms), with national variations \u2014 Germany and the Netherlands use long initial fixed periods of 10\u201320 years, while France, Italy, and Spain are mixed. This calculator uses the United States monthly-compounding convention; for Canadian-style semi-annual compounding the effective monthly rate is slightly lower than (1 + APR/12) and the calculated payment will be a few dollars off, so use a Canada-specific calculator for exact Canadian quotes.',
  },
];

const longContent = `The Mortgage Calculator is a free online tool that estimates your full monthly mortgage payment, including principal, interest, property tax, home insurance, PMI, and HOA dues, plus a complete year-by-year and month-by-month amortization schedule. It uses the standard United States amortising-loan formula with monthly compounding, the same formula used by the American Mortgage Bankers Association, the Consumer Financial Protection Bureau\u2019s "Owning a Home" tool, and every other major mortgage calculator on the web. The tool runs entirely in your browser \u2014 nothing you type is sent to a server \u2014 and the math has been validated against the canonical benchmark cases used by the industry: $200,000 at 5.000% over 30 years gives a P&I of $1,073.64 and $320,000 at 6.500% over 30 years gives a P&I of $2,022.62, both to the cent.

Behind the calculator is the mortgage payment formula M = P \u00d7 [r(1+r)\u207f] / [(1+r)\u207f \u2212 1], where M is the monthly payment, P is the loan amount, r is the monthly interest rate (the annual APR divided by 12 and expressed as a decimal), and n is the total number of monthly payments (loan term in years multiplied by 12). The formula falls out of compound-interest mathematics: it is the fixed monthly amount that, paid every month, will exactly retire the loan in n payments. The amortisation schedule then splits each monthly payment between interest (the previous month\u2019s outstanding balance multiplied by the monthly rate) and principal (the rest of the payment, which reduces the balance for next month). In the early years of a typical 30-year mortgage, most of each monthly payment goes to interest; by year 20\u201325, the split flips and most of each payment goes to principal. The schedule and balance chart on this page make the shift visible at a glance.

PITI \u2014 Principal, Interest, Taxes, and Insurance \u2014 is the four-letter abbreviation lenders use for the full payment they typically collect each month. Principal and interest come straight out of the mortgage formula. Taxes are your annual property-tax bill divided by 12; the calculator accepts either a percentage of home value (any input \u226420 is treated as a percent) or a flat annual dollar amount (anything above 20). Insurance is your annual homeowners-insurance premium divided by 12. If your loan-to-value at origination is above 80% on a conventional loan, Private Mortgage Insurance is added on top \u2014 a few hundred dollars a month for a typical loan, computed as the PMI annual rate (often 0.3\u20131.5%) multiplied by the loan amount, divided by 12. PMI is automatically terminated under the United States Homeowners Protection Act once the balance reaches 78% of the original home value, and you can request termination once you reach 80%. This calculator uses the 80% rule, which is the consumer-facing convention.

Bi-weekly payments are one of the simplest, most powerful prepayment strategies on a mortgage. Instead of paying the full monthly P&I once a month (12 payments per year), you pay half the monthly P&I every two weeks (26 half-payments per year). Because there are 52 weeks in a year and 26 bi-weekly periods, you end up making the equivalent of 13 monthly payments per year instead of 12. That extra payment is applied entirely to principal, which has a big effect over a long loan. On a typical 30-year mortgage, bi-weekly payments shave 4\u20137 years off the loan and save tens of thousands of dollars in interest. The bi-weekly comparison panel on this calculator shows the savings for your specific scenario in real time. You can achieve the same effect manually by adding 1/12 of your monthly P&I to every regular payment \u2014 there is no compounding magic, just one extra full payment\u2019s worth of principal per year.

The 28/36 rule is the time-tested affordability heuristic the personal-finance world uses to translate "how much income do I have" into "how much home can I afford". Housing costs \u2014 PITI plus HOA \u2014 should be no more than about 28% of your gross monthly income, and total debt payments (housing plus car, student, and credit-card minimums) no more than 36%. Lenders themselves often allow more aggressive ratios under conventional underwriting (debt-to-income up to 43% or even 50% with compensating factors), but the 28/36 rule gives you breathing room for emergencies, retirement contributions, and life changes that the lender\u2019s maximum does not. As a quick check: at the 28% housing ratio, a $7,500/month gross income supports about $2,100/month of total housing cost, which at a 6.5% rate is roughly a $260,000 loan after down payment, taxes, insurance, and HOA.

Choosing a loan term is one of the bigger trade-offs in the mortgage decision. A 30-year fixed-rate loan has the lowest monthly payment, the longest commitment, and by far the highest total interest cost over the life of the loan. A 15-year fixed has a payment about 30\u201340% higher, finishes seven times faster than the loan that just paid off your neighbour\u2019s house, and saves roughly half the total interest. A 20-year is a sensible middle ground that some buyers like, although it is offered by fewer lenders. Consider a worked example with a $300,000 loan: at 6.0% over 30 years the P&I is about $1,799/month and total interest is around $347,500; at 5.5% over 15 years the P&I is about $2,452/month and total interest is just $141,300. The 15-year saves more than $200,000 in interest but commits you to roughly $653 more per month for 15 years. There is no universally correct answer; the right choice depends on whether your budget can comfortably absorb the higher payment, whether you would otherwise invest the difference in tax-advantaged accounts, and how stable your income is.

Fixed-rate versus adjustable-rate (ARM) is the other major structural choice. A fixed-rate mortgage locks the interest rate for the entire term \u2014 you know exactly what your P&I will be in year 30 the day you close. An ARM has a fixed teaser rate for the first 3, 5, 7, or 10 years (commonly written 5/1, 7/1, 10/1, where the second number is how often the rate adjusts after the initial period), then resets to a market-tracking rate. ARMs typically start with a lower rate than the equivalent 30-year fixed, which makes them attractive when fixed rates are unusually high or when the borrower expects to move or refinance before the reset. The downside is rate-reset risk: if rates rise during your fixed period, your payment can jump significantly when the loan resets. United States borrowers are unusually lucky: outside the United States, most mortgages are variable-rate or short-term-fixed (Canada is famous for its 5-year rate-reset convention), and the option of locking 30 years of rate certainty is rare or unavailable.

Refinancing is worth considering whenever current market rates fall meaningfully below your existing rate. The classic rule of thumb is "refinance when rates have fallen 0.75\u20131.0 percentage points below your current rate", though the right threshold depends on closing costs and how long you plan to keep the new loan. Closing costs typically run 2\u20135% of the loan amount, and the break-even point on a refi is the number of months it takes for the lower payment to recover those costs. If your break-even is shorter than how long you plan to stay in the home, refinancing makes sense; if not, the closing costs swallow the savings. The same calculator can be used to model a refinance scenario \u2014 just enter the current loan balance as the home value, the same balance as the loan amount (zero down), and the new rate and term.

A note on regional differences. United States mortgages are an unusually pro-borrower product. The 30-year fixed-rate loan with no rate-reset risk and no prepayment penalty is essentially a free option from the lender to the borrower, made possible by the secondary mortgage market and the implicit federal backstop of Fannie Mae and Freddie Mac. Canadian mortgages compound interest semi-annually instead of monthly, are typically 25 years amortised, and reset every 5 years (sometimes 1, 2, or 3 years), which means Canadian borrowers face rate-reset risk that United States borrowers do not. United Kingdom mortgages are typically 25 years and mostly use 2/3/5/10-year fixes that revert to a variable Standard Variable Rate; Australian and New Zealand mortgages are mostly variable-rate over a 25\u201330 year term; the European Union is largely variable-rate-dominant with national exceptions. The math in this calculator uses the United States monthly-compounding convention, so for Canadian or non-US quotes you should use a country-specific calculator that applies the correct compounding frequency.

Estimate, not a quote. This calculator gives an accurate mathematical estimate based on the inputs you provide, but it is not a quote. Real loan offers depend on your credit score, debt-to-income ratio, employment history, the property\u2019s appraised value, the lender\u2019s overlays, and current market conditions, all of which can shift the offered rate, the down-payment requirement, the PMI rate, and the closing costs. Always shop at least three lenders before locking, get a Loan Estimate (the standardised three-page disclosure mandated by the CFPB) from each one, and compare the APR \u2014 not just the note rate \u2014 because APR includes most of the lender fees baked into the deal. For tax, insurance, and HOA dues, get current numbers for your specific address from your county assessor, an insurance broker, and the HOA management company; the values you type into this calculator are estimates that should be replaced with real numbers as your purchase progresses.`;

// Reference table: monthly P&I for a $200,000 30-year loan at common rates,
// computed live so it always matches the calculator above.
const refRates = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0];
const referenceRows = refRates.map((rate) => ({
  rate,
  pi200: monthlyPI({ principal: 200000, annualRatePct: rate, termYears: 30 }),
  pi300: monthlyPI({ principal: 300000, annualRatePct: rate, termYears: 30 }),
  pi400: monthlyPI({ principal: 400000, annualRatePct: rate, termYears: 30 }),
}));

function fmtUsd(v) {
  if (!Number.isFinite(v)) return '$0';
  return '$' + v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function MortgageCalculatorPage() {
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
              { '@type': 'ListItem', position: 3, name: 'Mortgage Calculator' },
            ],
          }),
        }}
      />
      <ToolSchema
        name="Mortgage Calculator"
        description="Free mortgage calculator. Estimate your full monthly payment with taxes, insurance, PMI, and HOA. Includes amortization schedule, bi-weekly comparison, and balance chart."
        category="Calculator"
        url="https://makersilo.com/calculators/mortgage-calculator"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to use the Mortgage Calculator',
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
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
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
            <span className="text-gray-300">Mortgage Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
              <Globe2 className="w-3.5 h-3.5" />
              PITI + PMI + HOA \u00b7 Multi-currency
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Mortgage Calculator
            </h1>
            <p className="text-lg text-gray-400">
              Estimate your full monthly mortgage payment with principal, interest, property tax, home insurance, PMI, and HOA dues. Includes a complete amortization schedule, balance chart, bi-weekly savings comparison, and currency toggle.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <MortgageCalculatorClient />

            <section className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300 leading-relaxed">
                  <strong className="text-amber-200">Estimate, not a quote.</strong> This calculator gives an accurate mathematical estimate based on the inputs you provide, but it is not a loan offer. Real quotes depend on your credit score, debt-to-income ratio, employment history, the property\u2019s appraised value, lender overlays, and current market conditions. Always shop at least three lenders and compare the standardized Loan Estimate (the three-page CFPB disclosure) before locking. Property tax and insurance assumptions, PMI thresholds, and compounding conventions vary by country.
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-bold text-white mb-1">30-year monthly P&I reference table</h2>
              <p className="text-sm text-gray-400 mb-4">Principal &amp; interest only, no taxes / insurance / PMI / HOA. Computed live with the same formula used by the calculator above.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-left">
                      <th className="py-2 pr-4 font-semibold">Rate</th>
                      <th className="py-2 pr-4 font-semibold">$200K loan</th>
                      <th className="py-2 pr-4 font-semibold">$300K loan</th>
                      <th className="py-2 pr-4 font-semibold">$400K loan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referenceRows.map((row) => (
                      <tr key={row.rate} className="border-b border-white/5">
                        <td className="py-2 pr-4 text-white font-medium">{row.rate.toFixed(2)}%</td>
                        <td className="py-2 pr-4 text-gray-300 font-mono">{fmtUsd(row.pi200)}</td>
                        <td className="py-2 pr-4 text-gray-300 font-mono">{fmtUsd(row.pi300)}</td>
                        <td className="py-2 pr-4 text-gray-300 font-mono">{fmtUsd(row.pi400)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <HowToUse keyword="Mortgage Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="Mortgage Calculator" />
            <LongContent content={longContent} keyword="Mortgage Calculator" />

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
