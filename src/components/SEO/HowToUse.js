/* ===== GEO: Semantic HowTo Section with <ol> structure ===== */

/* Inline SVG icons — no lucide-react dependency */
const TypeSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>
);
const SparklesSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
);
const CopySvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const ShareSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
);

const defaultSteps = [
  {
    icon: TypeSvg,
    title: 'Type Your Text',
    description: 'Enter the text you want to transform in the input field above.',
  },
  {
    icon: SparklesSvg,
    title: 'See Instant Results',
    description: 'Watch your text transform instantly with real-time preview.',
  },
  {
    icon: CopySvg,
    title: 'Copy to Clipboard',
    description: 'Click the copy button to save the transformed text to your clipboard.',
  },
  {
    icon: ShareSvg,
    title: 'Paste & Share',
    description: 'Paste your new text anywhere — social media, messages, or documents.',
  },
];

export default function HowToUse({ keyword, steps = defaultSteps }) {
  return (
    <section className="mt-16" aria-label={`How to use ${keyword}`}>
      {/* Semantic H2 — no keyword stuffing */}
      <h2 className="text-2xl font-bold text-white mb-8">
        How to Use This Tool
      </h2>

      {/* Semantic ordered list for search engines and AI */}
      <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0">
        {steps.map((step, index) => (
          <li
            key={index}
            className="relative bg-white/5 rounded-xl border border-white/10 p-6"
          >
            {/* Step number badge */}
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {index + 1}
            </div>

            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mb-4">
              <step.icon className="w-6 h-6 text-orange-400" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      {/* HowTo JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: `How to Use ${keyword}`,
            description: `Step-by-step guide to using our free ${keyword}. No signup required.`,
            totalTime: 'PT1M',
            tool: {
              '@type': 'HowToTool',
              name: 'Web Browser',
            },
            step: steps.map((step, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: step.title,
              text: step.description,
            })),
          }),
        }}
      />
    </section>
  );
}
