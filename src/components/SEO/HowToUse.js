import { Type, Sparkles, Copy, Share2 } from 'lucide-react';

const defaultSteps = [
  {
    icon: Type,
    title: 'Type Your Text',
    description: 'Enter the text you want to transform in the input field above.',
  },
  {
    icon: Sparkles,
    title: 'Generate',
    description: 'Watch your text transform instantly with real-time preview.',
  },
  {
    icon: Copy,
    title: 'Copy',
    description: 'Click the copy button to save the transformed text to your clipboard.',
  },
  {
    icon: Share2,
    title: 'Paste & Share',
    description: 'Paste your new text anywhere - social media, messages, or documents.',
  },
];

export default function HowToUse({ keyword, steps = defaultSteps }) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-8">
        How to Use {keyword}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative bg-white/5 rounded-xl border border-white/10 p-6 hover:border-orange-500/30 transition-colors group"
          >
            {/* Step number */}
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {index + 1}
            </div>

            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <step.icon className="w-6 h-6 text-orange-400" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            'name': `How to Use ${keyword}`,
            'description': `Learn how to use our free ${keyword} in 4 simple steps.`,
            'step': steps.map((step, index) => ({
              '@type': 'HowToStep',
              'position': index + 1,
              'name': step.title,
              'text': step.description,
            })),
          }),
        }}
      />
    </section>
  );
}


