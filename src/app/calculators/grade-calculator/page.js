import GradeCalculatorClient from './GradeCalculatorClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Calculator, BookOpen, Target, Download } from 'lucide-react';

export const metadata = {
  title: 'Grade Calculator - Weighted Average & Final Grade Calculator | MakerSilo',
  description: 'Free grade calculator to compute your weighted average course grade. Supports percentage and letter grades. Also includes a final grade calculator to find what you need on your final exam.',
  keywords: 'grade calculator, weighted grade calculator, final grade calculator, course grade calculator, GPA calculator, college grade calculator, weighted average calculator, letter grade calculator',
  openGraph: {
    title: 'Grade Calculator - Weighted Average & Final Grade Calculator',
    description: 'Calculate your weighted course grade with percentage or letter grades. Find out what you need on your final exam to achieve your target grade.',
    type: 'website',
  },
};

const steps = [
  { icon: BookOpen, title: 'Enter Assignments', description: 'Add your assignments, tests, or exams with their grades (percentage or letter) and weight percentages.' },
  { icon: Calculator, title: 'Calculate Average', description: 'Click Calculate to see your weighted average grade, letter grade equivalent, and GPA.' },
  { icon: Target, title: 'Plan Ahead', description: 'Optionally enter a target grade and remaining weight to find out what score you need on upcoming work.' },
  { icon: Download, title: 'Final Grade Mode', description: 'Switch to Final Grade Calculator to find the exact score needed on your final exam to hit your target.' },
];

const faqs = [
  { q: 'How does the weighted grade calculator work?', a: 'The calculator multiplies each grade by its weight, sums all the weighted grades, then divides by the total sum of weights. Formula: Weighted Average = Σ(Grade × Weight) ÷ Σ(Weights). For example, if you have an 85% on homework (20% weight) and 78% on a midterm (30% weight), your weighted average is (85×20 + 78×30) ÷ (20+30) = 80.8%.' },
  { q: 'What is the difference between weighted and unweighted grades?', a: 'A weighted grade calculation accounts for the relative importance of each assignment. A midterm worth 30% of your grade counts more than a quiz worth 5%. An unweighted average treats all assignments equally regardless of importance. Most college courses use weighted grading.' },
  { q: 'How do I use the Final Grade Calculator?', a: 'Enter your current course grade (before the final), the grade you want to achieve in the course, and the percentage weight of your final exam. The calculator will tell you exactly what score you need on the final to reach your target. Formula: Needed = (Target × 100 − Current × CourseWeight) ÷ FinalWeight.' },
  { q: 'What if my weights do not add up to 100%?', a: 'The calculator works correctly regardless of whether weights sum to 100%. It divides by the actual sum of weights entered. This means you can enter grades for only the assignments completed so far, and the calculator will give you an accurate current average based on those weights.' },
  { q: 'How are letter grades converted to percentages?', a: 'The calculator uses standard midpoint values: A+ = 98.5%, A = 94.5%, A- = 91%, B+ = 88%, B = 84.5%, B- = 81%, C+ = 78%, C = 74.5%, C- = 71%, D+ = 68%, D = 64.5%, D- = 61%, F = 0%. These midpoint values represent the center of each letter grade range.' },
  { q: 'Can I use this for college and high school courses?', a: 'Yes! The weighted grade calculator works for any course at any level — high school, college, university, or graduate school. Simply enter your assignments with their grades and weight percentages as listed in your course syllabus.' },
];

const longContent = `The Grade Calculator is a comprehensive tool designed to help students calculate their weighted course grade quickly and accurately. Whether you are tracking your progress mid-semester or planning what you need on a final exam, this calculator gives you the precise numbers you need to make informed academic decisions.

Understanding how weighted grades work is essential for academic success. In most courses, different assignments contribute different percentages to your final grade. A final exam might be worth 40% of your grade, while homework assignments collectively account for 20%. This weighted system means that performing well on heavily-weighted assessments has a much larger impact on your course grade than acing a lightly-weighted quiz.

The weighted average formula is straightforward: multiply each grade by its corresponding weight, sum all the products, then divide by the total of all weights. Mathematically: Weighted Average = (Grade1 × Weight1 + Grade2 × Weight2 + ... + GradeN × WeightN) ÷ (Weight1 + Weight2 + ... + WeightN). Our calculator handles this computation instantly for any number of assignments.

The Final Grade Calculator mode solves a different but equally important problem. When approaching a final exam, students often ask: "What do I need on the final to get a B in this course?" The formula used is: Required Final Grade = (Target Grade × 100 − Current Grade × (100 − Final Weight)) ÷ Final Weight. This accounts for how much the final exam is worth relative to all other coursework.

Letter grades are supported through a standard conversion table. Each letter grade corresponds to a percentage range (for example, a B ranges from 83% to 86%), and the calculator uses the midpoint of each range when computing averages. This approach aligns with standard academic practice at most institutions, though individual schools may use slightly different scales.

The "Grade Needed" feature helps with forward planning. By entering your target overall grade and the weight of remaining assignments, you can determine exactly what average you need to maintain on future work. This is invaluable for prioritizing study time — if you discover you need a 95% average on remaining work to achieve your goal, you know you need to dedicate serious study effort.

Grade Point Average (GPA) equivalents are automatically calculated alongside your weighted average. The standard 4.0 scale (with A+ at 4.3) is used to convert your percentage grade into a GPA value. This helps students understand how their course grade will impact their overall GPA, which is critical for maintaining academic standing, scholarship eligibility, and graduate school applications.

Tips for using the calculator effectively: First, gather your course syllabus which should list the weight of each component (homework, quizzes, midterm, final, etc.). Enter each graded component with its percentage weight. You can add names to keep track of which row represents which assignment. The calculator works even if you only enter some assignments — it will give you your current average based on the work completed so far.

Common scenarios where this calculator proves most useful include: mid-semester grade checks to see if you are on track, pre-final exam planning to determine study priorities, comparing different grade scenarios through "what if" analysis, and semester planning to set realistic grade goals based on your current performance trajectory.`;

export default function GradeCalculatorPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://makersilo.com/' },
              { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://makersilo.com/calculators/' },
              { '@type': 'ListItem', position: 3, name: 'Grade Calculator', item: 'https://makersilo.com/calculators/grade-calculator/' },
            ],
          }),
        }}
      />

      <ToolSchema
        name="Grade Calculator"
        description="Free weighted grade calculator to compute your course grade. Supports percentage and letter grades, calculates GPA, and includes a final grade calculator."
        url="https://makersilo.com/calculators/grade-calculator/"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Grade Calculator
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
              Calculate your weighted course grade using percentage or letter grades. Find out what you need on your final exam to achieve your target grade.
            </p>

            <AdSlot position="above-tool" />

            <GradeCalculatorClient />

            <HowToUse keyword="Grade Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="Grade Calculator" />
            <LongContent content={longContent} keyword="Grade Calculator" />

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
