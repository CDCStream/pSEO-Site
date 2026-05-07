import LimitCalculatorClient from './LimitCalculatorClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Pencil, Target, Calculator, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Limit Calculator – Step-by-Step Solver with Graph | MakerSilo',
  description:
    'Free online limit calculator. Solve limits at a point, at infinity, and one-sided limits with full step-by-step solutions, numerical verification table, and an interactive graph. Handles 0/0, ∞/∞, L\u2019Hôpital, factoring, conjugates, sin x/x, (1+1/x)^x and more.',
  keywords:
    'limit calculator, limit solver, calculus limit calculator, find limit, limit of a function, limit at infinity, one-sided limit, left-hand limit, right-hand limit, l\u2019hopital rule calculator, indeterminate form calculator, 0/0 limit, infinity over infinity, sin x over x, e limit, lim calculator, free limit calculator, step by step limit solver',
  alternates: {
    canonical: 'https://makersilo.com/calculators/limit-calculator/',
  },
  openGraph: {
    title: 'Limit Calculator – Step-by-Step Solver with Graph',
    description:
      'Solve limits with step-by-step working, numerical table and graph. Supports limits at a point, at infinity, and one-sided limits. Free.',
    type: 'website',
    url: 'https://makersilo.com/calculators/limit-calculator/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Limit Calculator – Step-by-Step Solver',
    description:
      'Free online limit calculator with full step-by-step solutions, numerical verification, and an interactive graph.',
  },
};

const steps = [
  {
    icon: Pencil,
    title: 'Enter the Function',
    description:
      'Type the expression whose limit you want to compute, for example (x^2 - 4) / (x - 2) or sin(x)/x. Use ^ for powers, * for multiplication, sqrt(x) for square roots, ln(x) for natural log, and pi or e for the constants. The live preview shows the rendered formula in standard math notation.',
  },
  {
    icon: Target,
    title: 'Set the Limit Point and Direction',
    description:
      'Choose what value the variable approaches: a finite number (0, 2, π, 1/2), positive or negative infinity, or any expression. Pick a direction: two-sided (default) for the standard limit, or left-hand / right-hand for a one-sided limit useful at vertical asymptotes or piecewise definitions.',
  },
  {
    icon: Calculator,
    title: 'Calculate',
    description:
      'Click Calculate. The engine first attempts symbolic evaluation (factoring, conjugates, L\u2019Hôpital\u2019s rule, special limits), then independently verifies the answer numerically by sampling the function at points x = a ± 10\u207b\u00b9, 10\u207b\u00b2, …, 10\u207b\u2076 and applying Aitken Δ² acceleration. If the symbolic and numerical answers disagree, you see a warning so you can decide which to trust.',
  },
  {
    icon: CheckCircle2,
    title: 'Read Steps, Table & Graph',
    description:
      'Get the final answer in closed form (recognizing common values such as e, π, π/2, 1/2, ln 2, fractions of π, etc.), a 4-step explanation of the method used, a numerical verification table showing the function value as x approaches the target from each side, and an interactive graph with reference lines marking the limit point and the limit value.',
  },
];

const faqs = [
  {
    q: 'What is a limit in calculus?',
    a:
      'A limit describes the value that a function f(x) approaches as the input x gets arbitrarily close to a target value a (written lim_{x→a} f(x)). It is the foundational concept of calculus: derivatives are defined as a limit of average rates of change, definite integrals are defined as a limit of Riemann sums, and continuity at a point requires that the limit equals the function value there. A limit can be a finite number, +∞ or −∞, or it can fail to exist (DNE) when the left- and right-hand limits disagree or oscillate.',
  },
  {
    q: 'How do I find the limit of a function?',
    a:
      'Try direct substitution first: plug the target value into the expression. If you get a finite, defined number, that is the limit. If you get an indeterminate form like 0/0 or ∞/∞, simplify the expression algebraically — factor and cancel, multiply by a conjugate, expand binomials, or rewrite using a trig identity. If algebra is not enough, apply L\u2019Hôpital\u2019s rule when applicable, use a known special limit (sin(x)/x → 1, (1+1/x)^x → e), use the Squeeze Theorem, or compare growth rates at infinity (polynomial < exponential). This calculator does all of these for you and shows the steps.',
  },
  {
    q: 'What is L\u2019Hôpital\u2019s rule and when do I use it?',
    a:
      'L\u2019Hôpital\u2019s rule says: if lim_{x→a} f(x)/g(x) is of the form 0/0 or ∞/∞ and both f and g are differentiable near a (with g\u2032 nonzero), then lim_{x→a} f(x)/g(x) = lim_{x→a} f\u2032(x)/g\u2032(x), provided the latter limit exists. In short, take the derivative of numerator and denominator separately and try the limit again. You may need to apply the rule multiple times. It also handles the indeterminate forms 0·∞, ∞−∞, 0⁰, 1^∞, and ∞⁰ after first rewriting them as 0/0 or ∞/∞ (typically using a logarithm).',
  },
  {
    q: 'What is an indeterminate form (0/0, ∞/∞, 1^∞, …)?',
    a:
      'An indeterminate form is an algebraic expression that arises from direct substitution but whose value cannot be determined without further analysis because it could equal anything. The seven classic indeterminate forms are 0/0, ∞/∞, 0·∞, ∞−∞, 1^∞, 0⁰, and ∞⁰. Each requires a specific technique: 0/0 and ∞/∞ are handled by L\u2019Hôpital\u2019s rule or factoring; 0·∞ is converted to 0/0 by rewriting one factor as a reciprocal; ∞−∞ usually needs a common denominator or rationalization; the three exponential forms (1^∞, 0⁰, ∞⁰) are handled by taking ln of both sides, applying L\u2019Hôpital\u2019s rule, then exponentiating.',
  },
  {
    q: 'What does it mean when a limit does not exist (DNE)?',
    a:
      'A two-sided limit fails to exist (DNE) in three main scenarios. First, the left-hand and right-hand limits exist but disagree — for example lim_{x→0} |x|/x has left limit −1 and right limit +1, so the two-sided limit DNE. Second, the function diverges to +∞ from one side and −∞ from the other (e.g. lim_{x→0} 1/x). Third, the function oscillates infinitely without settling (e.g. lim_{x→0} sin(1/x) — values cycle between −1 and +1 arbitrarily close to 0). Note: a one-sided limit can exist even when the two-sided limit does not.',
  },
  {
    q: 'When should I use one-sided limits (left vs right)?',
    a:
      'Use a one-sided limit whenever the function is defined only on one side of the target, behaves differently on each side, or when you specifically need to characterize behavior at a vertical asymptote. Common cases include: piecewise functions (test continuity at the boundary), absolute-value expressions (sign changes at zero), square roots like sqrt(x) at x = 0 (only the right side is real-valued), and 1/x at x = 0 (left → −∞, right → +∞). The two-sided limit exists if and only if both one-sided limits exist and are equal.',
  },
  {
    q: 'How do I evaluate limits at infinity?',
    a:
      'For lim_{x→∞} f(x) compare growth rates. For rational functions p(x)/q(x): if deg(p) < deg(q) the limit is 0, if deg(p) = deg(q) it equals the ratio of leading coefficients, and if deg(p) > deg(q) it diverges to ±∞. For exponentials and logs, the hierarchy is constants ≪ logarithms ≪ polynomials ≪ exponentials ≪ factorials. To make a leading-term argument rigorous, divide numerator and denominator by the highest power of x in the denominator. L\u2019Hôpital\u2019s rule also works for ∞/∞ at infinity. The classic special limit at infinity is (1 + 1/x)^x → e.',
  },
  {
    q: 'What are the most important limits to memorize?',
    a:
      'A short list every calculus student should know: lim_{x→0} sin(x)/x = 1, lim_{x→0} (1 − cos(x))/x = 0, lim_{x→0} (1 − cos(x))/x² = 1/2, lim_{x→0} tan(x)/x = 1, lim_{x→0} (e^x − 1)/x = 1, lim_{x→0} (a^x − 1)/x = ln(a), lim_{x→0} ln(1+x)/x = 1, lim_{x→∞} (1 + 1/x)^x = e, lim_{x→∞} ln(x)/x = 0, lim_{x→∞} x^n / e^x = 0 for any n, and lim_{n→∞} (1 + r/n)^n = e^r. These appear constantly in derivatives, Taylor series, and asymptotic analysis. The calculator recognizes all of them and shows the canonical closed-form answer.',
  },
];

const longContent = `The Limit Calculator is a free online tool that evaluates limits of mathematical functions step-by-step, with full symbolic working, numerical verification, and an interactive graph. It handles limits at a finite point, limits at positive or negative infinity, and one-sided (left- or right-hand) limits, and it works on the most common types of expressions you will meet in a first or second calculus course: polynomial and rational functions, trigonometric and inverse trig functions, exponentials and logarithms, square roots and other radicals, and compositions of all of these. Whether you are studying for an exam, double-checking your homework, or trying to understand the behavior of a function near a tricky point, this calculator gives you the answer plus the reasoning that produced it.

Conceptually, a limit answers a single question: as the input variable gets arbitrarily close to a target value, what value (if any) does the output approach? The intuitive picture is geometric — you are watching points on the graph of y = f(x) as x slides toward x = a, and asking whether the y-values cluster around a single number. The formal ε–δ definition (the limit equals L if for every ε > 0 there exists δ > 0 such that 0 < |x − a| < δ implies |f(x) − L| < ε) makes this picture precise, but in practice you almost never need to invoke it directly. Instead you use a small toolbox of techniques: direct substitution, algebraic simplification, special limits, L\u2019Hôpital\u2019s rule, the Squeeze Theorem, and growth-rate comparison.

Limits split naturally into a few categories that determine the right technique. **Limits at a defined point** are the easiest: if f is continuous at a, simply substitute and you are done. **Removable indeterminate limits** of the form 0/0 typically arise from a removable discontinuity — the function is not defined at the target value but its graph has a small "hole" that can be filled in by simplifying the algebraic expression. The classic example is (x² − 4)/(x − 2) at x = 2: factor the numerator as (x − 2)(x + 2), cancel the common factor, and the limit becomes the limit of (x + 2) at x = 2, which is 4. **Limits at infinity** describe end behavior: as x grows without bound, what does f(x) tend toward? For rational functions this reduces to comparing degrees of numerator and denominator. For mixed expressions involving exponentials, logarithms, and powers, you compare growth rates: any polynomial grows faster than any logarithm, any exponential grows faster than any polynomial, and any factorial grows faster than any exponential. **One-sided limits** restrict the approach to one side and are used to test continuity of piecewise functions, characterize behavior at vertical asymptotes (where left and right limits often diverge to opposite infinities), and analyze functions that are real-valued only on one side of the target (such as sqrt(x) at x = 0).

The seven classical indeterminate forms — 0/0, ∞/∞, 0·∞, ∞ − ∞, 1^∞, 0⁰, and ∞⁰ — are all handled by transforming them into a form to which L\u2019Hôpital\u2019s rule applies. L\u2019Hôpital\u2019s rule states that if f(x)/g(x) is of the form 0/0 or ∞/∞ near x = a, and f and g are differentiable with g\u2032(x) ≠ 0 near a, then the limit equals the limit of f\u2032(x)/g\u2032(x) (provided the latter exists). The rule may need to be applied multiple times. The exponential forms (1^∞, 0⁰, ∞⁰) are handled by taking the natural logarithm of the expression, which converts them into a 0·∞ form; then rewrite the product as a quotient and apply L\u2019Hôpital\u2019s rule. The most famous result of this technique is the limit (1 + 1/x)^x → e as x → ∞, which is the constant e\u2019s defining limit and the foundation of continuous compounding.

Several **special limits** appear so often that you should learn them by heart. The most important is lim_{x→0} sin(x)/x = 1, which is the cornerstone of differentiating trigonometric functions and follows from the Squeeze Theorem applied to a geometric inequality on the unit circle. Closely related are lim_{x→0} tan(x)/x = 1, lim_{x→0} (1 − cos(x))/x² = 1/2, and lim_{x→0} (1 − cos(x))/x = 0. From the exponential and logarithmic family come lim_{x→0} (e^x − 1)/x = 1, lim_{x→0} ln(1+x)/x = 1, lim_{x→0} (a^x − 1)/x = ln(a), and lim_{x→∞} ln(x)/x = 0 (logarithm grows slower than any polynomial). Each of these can be derived from L\u2019Hôpital\u2019s rule, but recognizing them by sight makes a huge difference in speed during exams.

This calculator combines symbolic computation with numerical verification to give you a robust answer. The symbolic engine attempts to apply known limit laws — factor cancellation for 0/0 cases, leading-term analysis for ∞/∞ at infinity, L\u2019Hôpital\u2019s rule when derivatives are tractable, conjugate multiplication for square-root indeterminate forms, and a library of known special limits. In parallel, the numerical engine evaluates the function at points h = 10⁻¹, 10⁻², …, 10⁻⁶ on each side of the target (or 10¹, 10², …, 10⁷ for limits at infinity), applies Aitken Δ² extrapolation to accelerate convergence of slowly-converging sequences (such as ln(x)/x at infinity), and recognizes whether the values converge to a finite number, diverge to ±∞, or fail to settle. The two answers are cross-checked: if they match, the symbolic answer is shown with high confidence; if they disagree by more than a small relative tolerance, the calculator reports the numerical estimate and warns you about the discrepancy. The numerical table you see in the result panel shows exactly the samples that were used so you can sanity-check the convergence yourself.

Limits underpin most of single- and multi-variable calculus. The derivative of f at x = a is defined as lim_{h→0} (f(a + h) − f(a))/h — this is by construction a 0/0 indeterminate form, and the entire theory of differentiation is built on resolving it for various function families. Definite integrals are defined as the limit of Riemann sums as the partition mesh shrinks to zero. Continuity at a point is defined by the equation lim_{x→a} f(x) = f(a). Vertical asymptotes correspond to one- or two-sided limits diverging to ±∞; horizontal asymptotes correspond to finite limits at infinity; oblique (slant) asymptotes appear when the difference f(x) − (mx + b) has a finite limit at infinity. In a more applied direction, limits formalize "instantaneous" behavior in physics (instantaneous velocity, instantaneous current), the long-run behavior of dynamical systems, and the convergence of infinite series and improper integrals.

To use this calculator effectively: type your expression, choose the variable and the value it approaches, optionally pick a one-sided direction, then click Calculate. The result panel shows the final answer in closed form, the method used, and any cross-check warnings. The Step-by-Step Solution panel breaks the work into clearly-labeled stages with the relevant LaTeX equations rendered inline. The Numerical Verification table shows the function value at each sample point so you can watch the convergence happen. The Graph panel plots the function around the limit point with reference lines marking the limit and the target value. Common pitfalls to watch for: indeterminate forms can hide inside compositions (always check what direct substitution gives before applying L\u2019Hôpital\u2019s rule); one-sided limits are not the same as the two-sided limit unless they agree; growth-rate comparisons at infinity always trump algebraic complexity; and a numerical value alone (without a symbolic check) can be fooled by floating-point precision around the limit point. The cross-check built into this calculator is designed precisely to catch those mistakes.`;

export default function LimitCalculatorPage() {
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
              { '@type': 'ListItem', position: 3, name: 'Limit Calculator', item: 'https://makersilo.com/calculators/limit-calculator/' },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to use the Limit Calculator',
            description:
              'Step-by-step instructions for evaluating limits with the Limit Calculator: enter a function, set the target and direction, calculate, then read steps, table and graph.',
            step: steps.map((s, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: s.title,
              text: s.description,
            })),
          }),
        }}
      />

      <ToolSchema
        name="Limit Calculator"
        description="Free online limit calculator with step-by-step solutions, numerical verification table and interactive graph. Evaluates limits at a point, at infinity, and one-sided limits."
        url="https://makersilo.com/calculators/limit-calculator/"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Limit Calculator
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
              Find the limit of any function step-by-step — at a point, at infinity, or one-sided. Get the symbolic answer, the full working, a numerical verification table, and an interactive graph.
            </p>

            <AdSlot position="above-tool" />

            <LimitCalculatorClient />

            <HowToUse keyword="Limit Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="Limit Calculator" />
            <LongContent content={longContent} keyword="Limit Calculator" />

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
