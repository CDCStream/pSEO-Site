import PValueCalculatorClient from './PValueCalculatorClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Sigma, Target, Calculator, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'P-value Calculator - Z, t, Chi-square & F-test | MakerSilo',
  description: 'Free p-value calculator for Z-score, t-score, chi-square, and F-distribution. Calculate one-tailed and two-tailed p-values with custom significance level (α). Includes step-by-step decision and interpretation.',
  keywords: 'p value calculator, p-value calculator, p value from z score, p value from t score, p value from chi square, p value from f score, hypothesis testing calculator, statistical significance calculator, two tailed p value, one tailed p value, z test calculator, t test p value',
  openGraph: {
    title: 'P-value Calculator - Z, t, Chi-square & F-test',
    description: 'Calculate p-values from any test statistic with custom significance level. Free online statistical hypothesis testing calculator.',
    type: 'website',
  },
};

const steps = [
  { icon: Sigma, title: 'Pick the Distribution', description: 'Select the distribution your test statistic follows: Z (standard normal), t (Student\u2019s t), \u03c7\u00b2 (chi-square), or F (Fisher\u2013Snedecor). The choice depends on the test you ran.' },
  { icon: Target, title: 'Choose the Tail', description: 'Pick the alternative hypothesis: two-tailed (H\u2081: parameter \u2260 value), left-tailed (parameter <), or right-tailed (parameter >). For \u03c7\u00b2 goodness-of-fit, independence, and ANOVA F-tests, use right-tailed.' },
  { icon: Calculator, title: 'Enter Statistic & Degrees of Freedom', description: 'Type your test statistic value. For t and \u03c7\u00b2 add the degrees of freedom; for F add both numerator (d\u2081) and denominator (d\u2082) degrees of freedom. Optionally adjust the significance level (default \u03b1 = 0.05).' },
  { icon: CheckCircle2, title: 'Read the Result', description: 'Get the exact p-value, the reject / fail-to-reject H\u2080 decision at your chosen \u03b1, plus a quick comparison against the three most common significance thresholds (0.05, 0.01, 0.001).' },
];

const faqs = [
  { q: 'What is a p-value?', a: 'The p-value is the probability of observing a test statistic at least as extreme as the one you got, assuming the null hypothesis (H\u2080) is true. A small p-value (typically \u2264 0.05) means your observed result would be unusual if H\u2080 were true, providing evidence to reject H\u2080 in favor of the alternative hypothesis (H\u2081). A large p-value means your data is consistent with H\u2080 and you fail to reject it.' },
  { q: 'How is the p-value calculated from a Z-score?', a: 'For a standard normal distribution N(0, 1) with cumulative distribution function \u03a6(z): left-tailed p-value = \u03a6(z); right-tailed p-value = 1 \u2212 \u03a6(z); two-tailed p-value = 2 \u00d7 \u03a6(\u2212|z|), or equivalently 2 \u00d7 (1 \u2212 \u03a6(|z|)). For example, a two-tailed Z = 1.96 gives p \u2248 0.0500 and Z = 2.96 gives p \u2248 0.0031.' },
  { q: 'How does the p-value calculator handle t-scores?', a: 'It uses the cumulative distribution function of the Student\u2019s t-distribution with the degrees of freedom you provide. Internally we use the standard relation cdf\u209c(t, df) = 1 \u2212 0.5 \u00b7 I\u2093(df/2, 1/2) for t > 0 (where x = df / (df + t\u00b2) and I\u2093 is the regularized incomplete beta function), and the symmetric reflection for t < 0. Two-tailed p-value = 2 \u00d7 min(cdf, 1 \u2212 cdf).' },
  { q: 'When should I use a one-tailed vs two-tailed test?', a: 'Use a two-tailed test when you only care that the parameter differs from the null value, in either direction (this is the conservative default). Use a one-tailed test only when you have a specific directional hypothesis decided before looking at the data \u2014 for example, "the new treatment increases survival rate" (right-tailed) or "the failure rate is lower than 1%" (left-tailed). Picking the tail based on what you observed in the data inflates your false positive rate.' },
  { q: 'What does it mean to reject the null hypothesis?', a: 'Rejecting H\u2080 means your data is unlikely to have occurred by chance alone if H\u2080 were true. It does NOT prove H\u2081 is true \u2014 it just means there is statistically significant evidence against H\u2080 at your chosen significance level (\u03b1). Failing to reject H\u2080 also doesn\u2019t prove H\u2080 is true; it just means you don\u2019t have enough evidence to reject it.' },
  { q: 'What significance level should I use?', a: 'The conventional default is \u03b1 = 0.05 (5% chance of a Type I error). Stricter thresholds like \u03b1 = 0.01 or \u03b1 = 0.001 are common in medical, pharmaceutical, and physics research where false positives are costly. The threshold should be chosen before running the test, based on the consequences of a wrong rejection. The calculator shows you significance at all three common thresholds simultaneously so you can see how your conclusion would change.' },
  { q: 'What is the chi-square p-value used for?', a: 'Chi-square (\u03c7\u00b2) p-values are used for three common tests: (1) goodness-of-fit \u2014 does an observed distribution match an expected one? (2) test of independence \u2014 are two categorical variables related? (3) test of variance \u2014 does a sample variance match a hypothesized value? Goodness-of-fit and independence tests are right-tailed (large \u03c7\u00b2 = poor fit). The variance test can be one- or two-tailed.' },
  { q: 'What is the F-distribution used for?', a: 'F-test p-values are used in ANOVA (comparing means of three or more groups), regression overall significance tests, and tests for equality of two variances. ANOVA and regression F-tests are inherently right-tailed: large F values indicate that group means differ or that the regression model explains a significant amount of variance. Two degrees of freedom are required: numerator (d\u2081) and denominator (d\u2082).' },
  { q: 'Can the p-value be greater than 1 or less than 0?', a: 'No. The p-value is a probability and is always between 0 and 1 inclusive. If a calculator returns a value outside this range, there is a numerical error. For very extreme test statistics, the p-value can be astronomically small (e.g., 10\u207b\u00b2\u2070), but mathematically still positive. We display p-values smaller than 1 \u00d7 10\u207b\u00b9\u2070 in scientific notation or as "< 1 \u00d7 10\u207b\u00b9\u2070" since IEEE 754 floating-point precision becomes meaningful at that range.' },
  { q: 'Does a low p-value mean the effect is large or important?', a: 'No \u2014 this is a common misinterpretation. The p-value only tells you about statistical significance (probability of seeing this result by chance under H\u2080). It says nothing about the size of the effect or its practical importance. With a large enough sample size, even tiny, meaningless effects can produce very small p-values. Always report the effect size (e.g., difference in means, correlation coefficient, odds ratio) and a confidence interval alongside the p-value.' },
  { q: 'How accurate is this calculator?', a: 'The calculator uses standard numerical methods from the literature: the Abramowitz & Stegun approximation of the error function (erf) for normal CDF (max error ~1.5\u00d710\u207b\u2077), the Lanczos approximation for log-gamma, and continued fraction expansions for the regularized incomplete gamma and incomplete beta functions (per Numerical Recipes). Results match major statistical software (R, SciPy, GraphPad Prism) to at least 5\u20136 significant digits across normal use cases.' },
];

const longContent = `The P-value Calculator computes the exact p-value for a hypothesis test using the four most common test-statistic distributions in classical statistics: the standard normal Z, the Student\u2019s t, the chi-square \u03c7\u00b2, and the Fisher\u2013Snedecor F. Whether you are interpreting a Z-test for a proportion, a t-test for a mean, a chi-square goodness-of-fit test, or an ANOVA F-test, this calculator gives you the p-value and the reject / fail-to-reject decision in one step.

Hypothesis testing follows a consistent five-step structure. First, state a null hypothesis (H\u2080) and an alternative hypothesis (H\u2081). The null hypothesis is the default position you want to test against \u2014 typically "no effect," "no difference," or "no relationship." The alternative is the claim you want to provide evidence for. Second, decide on a significance level \u03b1 (commonly 0.05, 0.01, or 0.001) before looking at the data. Third, compute the test statistic from your data. Fourth, calculate the p-value \u2014 the probability of seeing a result at least as extreme as yours if H\u2080 were true. Fifth, compare: if p-value \u2264 \u03b1, reject H\u2080; otherwise, fail to reject.

Choosing the correct distribution depends on the test you ran. Use a Z-distribution for large-sample tests of population means or proportions when the population standard deviation is known (or the sample is large enough that the central limit theorem applies, typically n \u2265 30). Use the t-distribution when testing means with an unknown population standard deviation, especially in small samples; the t-distribution looks like the normal distribution but with heavier tails to account for the additional uncertainty in estimating \u03c3 from the sample. Use the chi-square distribution for goodness-of-fit tests, tests of independence in contingency tables, and tests of variance. Use the F-distribution for ANOVA, regression overall significance, and ratio-of-variances tests \u2014 it requires two separate degrees-of-freedom parameters (numerator d\u2081 and denominator d\u2082).

The choice between one-tailed and two-tailed tests is one of the most consequential decisions in hypothesis testing. A two-tailed test asks "is the parameter different from the hypothesized value, in either direction?" A one-tailed test asks "is the parameter strictly greater (or strictly less) than the hypothesized value?" The two-tailed test is more conservative \u2014 it requires a more extreme statistic to achieve the same significance level. The convention in most fields is to use two-tailed tests by default and only use one-tailed tests when there is a strong a priori directional hypothesis. Critically, you must decide which to use BEFORE looking at the data; choosing the tail to match what you observed is a form of p-hacking that inflates Type I error rates.

The mathematical foundations are well-established. For a standard normal distribution N(0, 1) with cumulative distribution function \u03a6(z), the right-tailed p-value is 1 \u2212 \u03a6(z), the left-tailed is \u03a6(z), and the two-tailed is 2 \u00d7 (1 \u2212 \u03a6(|z|)). For the t-distribution we use the relation cdf\u209c(t, df) = 1 \u2212 0.5 \u00b7 I\u2093(df/2, 1/2) where x = df / (df + t\u00b2) and I\u2093 is the regularized incomplete beta function. For chi-square the CDF is the regularized lower incomplete gamma function P(df/2, x/2). For the F-distribution, F(x, d\u2081, d\u2082) = I_{d\u2081x/(d\u2081x + d\u2082)}(d\u2081/2, d\u2082/2). These special functions are computed numerically using continued fraction expansions with sub-microscopic error tolerances; results match major statistical software (R, Python\u2019s SciPy, GraphPad Prism, SAS) to five or six significant digits across all reasonable inputs.

Common pitfalls in p-value interpretation deserve special attention. First, a small p-value does not measure the size of an effect \u2014 it only measures the strength of evidence against the null hypothesis. With a large enough sample size, statistically significant p-values can correspond to effects so small they are practically meaningless. Always report effect sizes (Cohen\u2019s d, correlation coefficients, odds ratios) and confidence intervals alongside p-values. Second, "p > 0.05" does not mean "the null hypothesis is true" \u2014 it just means you don\u2019t have enough evidence to reject it. Absence of evidence is not evidence of absence. Third, p-hacking (running many tests, selecting the favorable ones, choosing the tail post-hoc, or stopping data collection when p drops below 0.05) destroys the meaning of the p-value entirely; pre-registration of analyses is the gold standard remedy. Fourth, the p-value depends on the assumed distribution \u2014 if your data violates the underlying assumptions (e.g., non-normal data analyzed with a t-test on a small sample), the p-value can be misleading.

The calculator displays your result against the three most common significance thresholds (\u03b1 = 0.05, 0.01, and 0.001) at once. This gives you a quick sense of how robust your finding is. A result that is significant at \u03b1 = 0.05 but not at \u03b1 = 0.01 is borderline and warrants caution; a result significant at \u03b1 = 0.001 is strong even by conservative standards. The exact p-value is also shown in scientific notation for extremely small values (where precision matters for meta-analyses or when comparing to literature thresholds).

For practitioners new to hypothesis testing, the workflow is straightforward: identify the test you ran (Z, t, \u03c7\u00b2, or F), enter the test statistic, enter the degrees of freedom (if applicable), pick the tail based on your alternative hypothesis, set the significance level, and read the result. The "Try example" button preloads a classic example for each distribution so you can see how the inputs and outputs relate. Together with effect sizes and confidence intervals, the p-value remains a foundational tool in scientific inference \u2014 imperfect, often misused, but irreplaceable when applied thoughtfully.`;

export default function PValueCalculatorPage() {
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
              { '@type': 'ListItem', position: 3, name: 'P-value Calculator', item: 'https://makersilo.com/calculators/p-value-calculator/' },
            ],
          }),
        }}
      />

      <ToolSchema
        name="P-value Calculator"
        description="Free p-value calculator for Z-score, t-score, chi-square, and F-distribution. Computes one-tailed and two-tailed p-values with custom significance level."
        url="https://makersilo.com/calculators/p-value-calculator/"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              P-value Calculator
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
              Calculate p-values from Z-score, t-score, chi-square (χ²), or F-statistic. Choose one or two-tailed tests, set your significance level, and get an instant reject / fail-to-reject decision.
            </p>

            <AdSlot position="above-tool" />

            <PValueCalculatorClient />

            <HowToUse keyword="P-value Calculator" steps={steps} />
            <FAQSection faqs={faqs} keyword="P-value Calculator" />
            <LongContent content={longContent} keyword="P-value Calculator" />

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
