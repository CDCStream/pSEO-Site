import A1CCalculatorClient from './A1CCalculatorClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Activity, ArrowLeftRight, Calculator, ListChecks, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'A1C Calculator - Convert A1C to Average Glucose (mg/dL & mmol/L) | MakerSilo',
  description:
    'Free A1C calculator. Convert A1C (%) to estimated Average Glucose in mg/dL and mmol/L using the ADA ADAG-study formula. Includes diagnostic interpretation and reference table.',
  keywords:
    'a1c calculator, a1c to average glucose, a1c to eag, eag to a1c, hba1c calculator, a1c to mg/dL, a1c to mmol/L, glucose to a1c, average blood sugar to a1c, diabetes calculator, a1c conversion, estimated average glucose calculator',
  alternates: {
    canonical: 'https://makersilo.com/calculators/a1c-calculator/',
  },
  openGraph: {
    title: 'A1C Calculator - Convert A1C to Average Glucose (mg/dL & mmol/L)',
    description:
      'Convert A1C to estimated Average Glucose in mg/dL or mmol/L instantly. Bidirectional, with ADA diagnostic interpretation and a full reference table.',
    type: 'website',
    url: 'https://makersilo.com/calculators/a1c-calculator/',
    siteName: 'MakerSilo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A1C Calculator - Convert A1C to Average Glucose (mg/dL & mmol/L)',
    description:
      'Convert A1C to estimated Average Glucose in mg/dL or mmol/L. Free, bidirectional, with ADA diagnostic interpretation.',
  },
};

const steps = [
  {
    icon: ArrowLeftRight,
    title: 'Pick your conversion direction',
    description: 'Choose A1C \u2192 eAG to convert a percentage A1C result into your daily glucose meter units, or eAG \u2192 A1C to estimate your A1C from an average glucose reading.',
  },
  {
    icon: ListChecks,
    title: 'Choose your glucose unit',
    description: 'Toggle between mg/dL (used in the United States) and mmol/L (used in the UK, EU, Australia, Canada, and most of the rest of the world). The calculator remembers your choice on this device.',
  },
  {
    icon: Calculator,
    title: 'Enter your value',
    description: 'Type your A1C as a percentage (for example, 7.2) or your average glucose value. Sensible ranges are A1C 4\u201318% and eAG 50\u2013500 mg/dL. The result updates instantly with no button press.',
  },
  {
    icon: Activity,
    title: 'Read the result and diagnostic chip',
    description: 'The result card shows your converted value in both mg/dL and mmol/L, plus an ADA diagnostic chip (Normal under 5.7%, Prediabetes 5.7\u20136.4%, Diabetes 6.5% and above). Tap "Why this number?" to see the substituted formula step by step.',
  },
];

const faqs = [
  {
    q: 'What is A1C?',
    a: 'A1C (also written HbA1c, glycated hemoglobin, or glycohemoglobin) is a blood test that measures the percentage of hemoglobin in your red blood cells that has glucose attached to it. Because red blood cells live for roughly 120 days, A1C reflects your average blood glucose level over the past two to three months \u2014 a much longer window than a single fingerstick. The American Diabetes Association uses A1C as the gold-standard metric for diagnosing prediabetes and diabetes and for monitoring how well diabetes treatment is working over time.',
  },
  {
    q: 'What is a normal A1C?',
    a: 'According to the American Diabetes Association Standards of Care, the diagnostic cutoffs are: under 5.7% is normal, 5.7% to 6.4% is prediabetes, and 6.5% or above on two separate tests is diabetes. For people who already have diabetes, the general A1C target is below 7%, although your personal target can be tighter (for example below 6.5%) or more relaxed (for example below 8%) depending on age, life expectancy, history of severe hypoglycemia, cardiovascular disease, and other individual factors. Always discuss your personal target with your clinician.',
  },
  {
    q: 'What does an A1C of 6.5, 7, or 8 mean?',
    a: 'An A1C of 6.5% corresponds to an estimated average glucose of about 140 mg/dL (7.8 mmol/L) and is the cutoff for a diabetes diagnosis. An A1C of 7% corresponds to about 154 mg/dL (8.6 mmol/L) and is the standard target for many adults with diabetes. An A1C of 8% corresponds to about 183 mg/dL (10.1 mmol/L) and usually indicates that current treatment is not bringing glucose into target range \u2014 a conversation about adjusting medications, nutrition, or activity is warranted. These conversions come straight from the ADA ADAG-study formula used by this calculator.',
  },
  {
    q: 'How do I convert A1C to mg/dL?',
    a: 'Use the formula derived from the 2008 ADAG study (Nathan et al., Diabetes Care): eAG (mg/dL) = 28.7 \u00d7 A1C (%) \u2212 46.7. For example, an A1C of 7.0% gives 28.7 \u00d7 7 \u2212 46.7 = 200.9 \u2212 46.7 = 154.2 mg/dL, which rounds to 154 mg/dL. To convert mg/dL to mmol/L, divide by 18.0182. So 154 mg/dL is 154 / 18.0182 = 8.55 mmol/L, which rounds to 8.6 mmol/L. This calculator does both steps automatically and shows the substitution.',
  },
  {
    q: 'What is eAG (estimated Average Glucose)?',
    a: 'eAG stands for estimated Average Glucose. It is your A1C result expressed in the same units as a blood glucose meter or continuous glucose monitor reading \u2014 milligrams per deciliter (mg/dL) in the United States or millimoles per liter (mmol/L) in most other countries. The American Diabetes Association recommends reporting A1C alongside its eAG so that patients can directly compare their long-term average to the daily numbers they already see on their meter. The ADAG study (A1c-Derived Average Glucose, 2008) defined the linear relationship between A1C and eAG.',
  },
  {
    q: 'How accurate is converting A1C to average glucose?',
    a: 'The ADAG-study formula explains roughly 84% of the variability between A1C and average glucose for typical adults, which means the conversion is a good approximation but not exact for every individual. Personal factors that can shift your eAG away from the formula prediction include red blood cell lifespan, anemia, hemoglobinopathies (sickle cell trait, thalassemia, certain hemoglobin variants), recent blood transfusion, pregnancy, kidney disease, and use of erythropoietin. If your fingerstick or CGM averages disagree noticeably with your A1C, talk to your clinician \u2014 it does not necessarily mean either reading is wrong, but it is useful information for tailoring your care plan.',
  },
  {
    q: 'How often should I test my A1C?',
    a: 'The ADA recommends an A1C test at least twice a year for adults with diabetes whose treatment plan is stable and who are meeting glycemic goals, and at least every three months for adults whose treatment has recently changed or who are not meeting goals. People with prediabetes are typically tested every one to two years. The Centers for Disease Control and Prevention recommends a baseline A1C as part of routine screening for adults age 35 and older, and earlier for those with risk factors such as overweight, family history of diabetes, polycystic ovary syndrome, gestational diabetes, or being a member of certain ethnic groups with higher diabetes prevalence.',
  },
  {
    q: 'Can I lower my A1C?',
    a: 'Yes. Sustained changes in nutrition, physical activity, sleep, stress management, and medication adherence reliably lower A1C in most people. Evidence-based approaches include eating fewer ultra-processed carbohydrates, walking 150 minutes per week, doing two to three sessions of resistance training, sleeping seven to nine hours, taking prescribed medications consistently, and using a continuous glucose monitor (CGM) so you can see how individual meals and activities affect your glucose in real time. Newer GLP-1 receptor agonists (semaglutide, tirzepatide) and SGLT-2 inhibitors have driven significant A1C reductions for many adults with type 2 diabetes \u2014 always discuss medication choices with your clinician.',
  },
  {
    q: 'What is the difference between A1C and fasting blood glucose?',
    a: 'Fasting blood glucose is a snapshot \u2014 a single measurement taken after at least 8 hours without food. A1C is a long exposure \u2014 a weighted average of every glucose value you carried over the past two to three months, with the most recent month counting roughly twice as much as the month before. The two tests answer different questions. Fasting glucose tells you what is happening today; A1C tells you whether your overall control has been steady. Both are valid for diagnosing diabetes (fasting glucose 126 mg/dL or higher, or A1C 6.5% or higher), and many clinicians use them together because each catches cases the other misses.',
  },
  {
    q: 'Is mg/dL or mmol/L used in my country?',
    a: 'Glucose units vary by country. mg/dL (milligrams per deciliter) is the standard in the United States and a handful of others. mmol/L (millimoles per liter) is the standard across the United Kingdom, Ireland, Australia, New Zealand, Canada, most of continental Europe (Germany, France, Spain, Italy, Netherlands, Sweden, Norway, Denmark, Finland, Poland, Hungary, Czechia), and most of the Middle East. Many countries (China, Japan, parts of Latin America, India, South Africa, Egypt) use both. The conversion factor is constant: divide mg/dL by 18.0182 to get mmol/L, or multiply mmol/L by 18.0182 to get mg/dL. This calculator handles both with a single toggle.',
  },
];

const longContent = `The A1C Calculator is a free online tool that converts an A1C (HbA1c) percentage into the estimated Average Glucose value you would see on a blood glucose meter, in either mg/dL (the standard unit in the United States) or mmol/L (the standard unit across the United Kingdom, the European Union, Australia, Canada, and most of the rest of the world). It works in both directions, so you can also enter an average glucose number and see the equivalent A1C. The calculator uses the formula published by the American Diabetes Association from the 2008 ADAG (A1c-Derived Average Glucose) study, the same formula used by the ADA's own glucose conversion calculator and by clinical lab reports across the United States.

A1C, sometimes written HbA1c, glycated hemoglobin, or glycohemoglobin, measures the percentage of hemoglobin molecules inside your red blood cells that have glucose chemically bonded to them. Glucose attaches to hemoglobin slowly and irreversibly while the red blood cell circulates, and red blood cells live for roughly 120 days, so the A1C result is a weighted time-average of every glucose value you carried over the previous two to three months. The most recent month counts roughly twice as much as the month before, so a recent change in glucose control is reflected in your A1C, but not as quickly as you might expect. This is why clinicians wait at least three months between A1C tests when adjusting treatment.

The relationship between A1C and average glucose was put on a firm clinical footing by the 2008 A1c-Derived Average Glucose (ADAG) study, led by David M. Nathan and published in Diabetes Care. The study followed 507 participants with type 1 diabetes, type 2 diabetes, or no diabetes for three months, collecting roughly 2,700 glucose values per person from a combination of continuous glucose monitoring and seven-point fingerstick profiles. A simple linear regression of mean glucose against A1C produced the formula eAG (mg/dL) = 28.7 \u00d7 A1C (%) \u2212 46.7, with an R-squared of about 0.84. That means roughly 84% of the variability in average glucose at a given A1C is explained by A1C alone, and the remaining 16% is individual biology. The same formula is used by this calculator and by every standard lab report that prints "estimated average glucose" alongside the A1C result.

Reading the diagnostic ranges. The American Diabetes Association Standards of Care define three A1C ranges for diagnosis. Below 5.7% is normal. 5.7% to 6.4% is prediabetes \u2014 a state where insulin resistance is climbing and beta-cell function is starting to fail, and where lifestyle changes can often prevent or significantly delay progression to type 2 diabetes. 6.5% or higher, confirmed on two separate tests, is diabetes. For people who already have diabetes, the typical treatment target is below 7%, although ADA explicitly endorses individualized targets: tighter (below 6.5%) for younger, healthier adults at low risk of hypoglycemia, and more relaxed (below 8% or below 8.5%) for older adults with limited life expectancy, severe hypoglycemia history, advanced complications, or extensive comorbidities. The diagnostic chip in this calculator's result card uses the ADA general thresholds; your personal target should always be set with your clinician.

Why eAG matters to patients. An A1C result of 7.5% does not mean very much intuitively \u2014 percentages of glycated hemoglobin are not a concept anyone meets in daily life. But that same A1C expressed as eAG \u2014 169 mg/dL or 9.4 mmol/L \u2014 is exactly the kind of number you see on the meter every day. Reporting the two side by side makes it instantly clear whether your long-term average is in the same ballpark as your daily readings, whether your readings on the meter cluster above or below the long-term mean, and how much room you have to your personal target. The ADA pushed clinical labs and electronic health record systems to start reporting eAG alongside A1C precisely for this reason: it closes the loop between the daily numbers patients see and the quarterly summary their endocrinologist talks about.

Converting between mg/dL and mmol/L. The conversion factor is fixed by chemistry: one mole of glucose weighs 180.182 grams, so one millimole per liter equals 180.182 mg per liter, which equals 18.0182 mg per deciliter. To convert mg/dL to mmol/L, divide by 18.0182. To convert mmol/L to mg/dL, multiply by 18.0182. For example, an eAG of 154 mg/dL is 154 / 18.0182 = 8.546 mmol/L, which rounds to 8.6 mmol/L; conversely an eAG of 7.0 mmol/L is 7.0 \u00d7 18.0182 = 126.1 mg/dL, which rounds to 126 mg/dL. This calculator displays both units side by side so you do not need to do the arithmetic yourself.

How to lower your A1C. The evidence base for lowering A1C is strong and broadly aligned across medical societies. Eating fewer ultra-processed refined carbohydrates and added sugars, and replacing them with vegetables, legumes, whole grains, and lean protein, lowers A1C reliably across diet patterns (Mediterranean, low-carb, plant-based, and DASH all work). 150 minutes of moderate aerobic activity per week, plus two to three sessions of resistance training, lowers A1C by an average of about 0.5\u20130.7%. Sleeping seven to nine hours per night and managing chronic stress have measurable effects too. On the medication side, metformin remains the cornerstone first-line treatment for type 2 diabetes, and the GLP-1 receptor agonists (semaglutide, dulaglutide, tirzepatide) and SGLT-2 inhibitors (empagliflozin, dapagliflozin) have driven significant A1C reductions plus cardiovascular and renal benefits in major trials. Continuous glucose monitoring is increasingly available at low cost and lets you see the moment-to-moment effect of every meal, walk, and night of sleep on your glucose, which often does more than any single intervention to motivate sustainable change.

Important accuracy caveats. The ADAG formula is an excellent average, but several conditions can shift your eAG away from the prediction in either direction. Anything that shortens red blood cell lifespan \u2014 hemolytic anemia, sickle cell disease, hereditary spherocytosis, recent significant blood loss, or recent blood transfusion \u2014 makes A1C read falsely low for a given true average glucose, because new red blood cells have had less time to glycate. Conditions that lengthen red blood cell lifespan \u2014 splenectomy, iron-deficiency anemia, vitamin B12 deficiency \u2014 can make A1C read falsely high. Hemoglobin variants (HbS, HbC, HbE, HbF in adults) interfere with some A1C assays. Late pregnancy lowers A1C because of increased red cell turnover. Advanced kidney disease and erythropoietin therapy both affect A1C reliability. If you have any of these conditions, an alternate measure such as fructosamine, glycated albumin, or CGM-derived Glucose Management Indicator (GMI) may be more reliable than A1C for monitoring control.

A1C versus CGM-derived GMI. Continuous glucose monitors compute a separate metric called the Glucose Management Indicator, defined as GMI (%) = 3.31 + 0.02392 \u00d7 mean CGM glucose (mg/dL), from the 2018 Bergenstal study. GMI is similar to A1C but not identical; for any individual, the difference between A1C and GMI can be up to about 1 percentage point in either direction, mostly because of the same red-blood-cell-lifespan issues that shift A1C in the first place. If your CGM GMI and your lab A1C disagree by more than half a percentage point, that gap is information \u2014 not error \u2014 and it is worth a conversation with your clinician about whether to weight one measure more than the other when setting targets and adjusting treatment.

Glucose units around the world. mg/dL (milligrams per deciliter) is the standard reporting unit in the United States, parts of Latin America, and a handful of Middle Eastern and Asian countries. mmol/L (millimoles per liter) is the standard across the United Kingdom, Ireland, Australia, New Zealand, Canada, and most of continental Europe \u2014 including Germany, France, Spain, Italy, the Netherlands, Sweden, Norway, Denmark, Finland, Poland, Hungary, and Czechia. Many countries (China, Japan, India, South Africa, Egypt) report both, depending on the lab. International scientific publications increasingly report both side by side. This calculator switches between the two units with a single toggle and persists your preference on your device, so once you pick the unit you actually use, the calculator opens to it next time.

Medical disclaimer. This calculator is provided for informational and educational purposes only. It is not a medical device, it does not diagnose any condition, and its results are not a substitute for professional medical advice, diagnosis, or treatment. The diagnostic ranges shown reflect the general thresholds published by the American Diabetes Association in its current Standards of Care; your personal A1C target may differ. Always discuss your A1C results, your eAG, and any change to your treatment plan with a qualified healthcare professional. If you think you are having a medical emergency, call your local emergency number immediately. The conversion math used by this calculator comes from Nathan DM et al., "Translating the A1C Assay into Estimated Average Glucose Values," Diabetes Care 31(8):1473\u20131478 (2008).`;

function safeRound(x) {
  return Math.round(Math.round(x * 1e10) / 1e10);
}

function safeRound1(x) {
  return Math.round(Math.round(x * 1e11) / 1e10) / 10;
}

function computeRow(a1c) {
  const rawMgdl = 28.7 * a1c - 46.7;
  const rawMmol = rawMgdl / 18.0182;
  return {
    a1c,
    mgdl: safeRound(rawMgdl),
    mmol: safeRound1(rawMmol),
  };
}

function rangeFor(a1c) {
  if (a1c < 5.7) return 'Normal';
  if (a1c < 6.5) return 'Prediabetes';
  return 'Diabetes';
}

const referenceRows = [5.0, 5.5, 5.7, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 11.0, 12.0, 13.0, 14.0]
  .map((a1c) => ({ ...computeRow(a1c), label: rangeFor(a1c) }));

function chipClass(label) {
  if (label === 'Normal') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  if (label === 'Prediabetes') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
}

export default function A1CCalculatorPage() {
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
              { '@type': 'ListItem', position: 3, name: 'A1C Calculator' },
            ],
          }),
        }}
      />
      <ToolSchema
        name="A1C Calculator"
        description="Free A1C calculator. Convert A1C (%) to estimated Average Glucose in mg/dL and mmol/L using the ADA ADAG-study formula. Bidirectional with diagnostic interpretation and a full reference table."
        category="Calculator"
        url="https://makersilo.com/calculators/a1c-calculator"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to use the A1C Calculator',
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/calculators/" className="hover:text-white transition-colors">Calculators</a>
            <span>/</span>
            <span className="text-gray-300">A1C Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-4">
              <Activity className="w-3.5 h-3.5" />
              ADA ADAG-Study Formula
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              A1C Calculator
            </h1>
            <p className="text-lg text-gray-400">
              Convert A1C (%) to estimated Average Glucose in mg/dL or mmol/L \u2014 and back. Bidirectional, with the ADA diagnostic chip (Normal, Prediabetes, Diabetes) and a complete A1C-to-eAG reference table.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <A1CCalculatorClient />

            <section className="mt-8 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300 leading-relaxed">
                  <strong className="text-rose-200">Medical disclaimer.</strong> This calculator is for informational and educational purposes only. It is not a medical device, it does not diagnose any condition, and its output is not a substitute for professional medical advice, diagnosis, or treatment. The diagnostic ranges reflect the general thresholds published by the American Diabetes Association; your personal A1C target may differ. Always discuss your A1C and treatment plan with a qualified healthcare professional. Conversion math from Nathan DM et al., <em>Diabetes Care</em> 31(8):1473\u20131478 (2008).
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-bold text-white mb-1">A1C \u2194 eAG reference table</h2>
              <p className="text-sm text-gray-400 mb-4">Computed from <code className="text-rose-300">eAG (mg/dL) = 28.7 \u00d7 A1C \u2212 46.7</code> and <code className="text-rose-300">mmol/L = mg/dL / 18.0182</code>.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-left">
                      <th className="py-2 pr-4 font-semibold">A1C (%)</th>
                      <th className="py-2 pr-4 font-semibold">eAG (mg/dL)</th>
                      <th className="py-2 pr-4 font-semibold">eAG (mmol/L)</th>
                      <th className="py-2 pr-4 font-semibold">ADA range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referenceRows.map((row) => (
                      <tr key={row.a1c} className="border-b border-white/5">
                        <td className="py-2 pr-4 text-white font-medium">{row.a1c.toFixed(1)}</td>
                        <td className="py-2 pr-4 text-gray-300">{row.mgdl}</td>
                        <td className="py-2 pr-4 text-gray-300">{row.mmol.toFixed(1)}</td>
                        <td className="py-2 pr-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${chipClass(row.label)}`}>
                            {row.label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <HowToUse keyword="A1C Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="A1C Calculator" />
            <LongContent content={longContent} keyword="A1C Calculator" />

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
