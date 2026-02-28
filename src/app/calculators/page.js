import Link from 'next/link';
import { Snowflake, Calculator, ArrowRight } from 'lucide-react';

const calculatorTools = [
  {
    name: 'Snow Day Calculator',
    description: 'Predict the probability of a snow day tomorrow using real-time weather data and AI analysis.',
    href: '/calculators/snow-day-calculator',
    icon: Snowflake,
    color: 'from-blue-500 to-sky-400',
    tags: ['Weather', 'AI Prediction', 'School Closure', 'Real-time Data'],
  },
];

export const metadata = {
  title: 'Free Online Calculators - AI-Powered Tools | MakerSilo',
  description: 'Explore our collection of free online calculators powered by AI. Snow day predictor, and more useful tools.',
  keywords: 'online calculators, free calculators, snow day calculator, AI calculator tools',
  openGraph: {
    title: 'Free Online Calculators - AI-Powered Tools',
    description: 'Explore our collection of free online calculators powered by AI.',
    type: 'website',
  },
};

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" />
              Calculators
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Online Calculators
            </h1>
            <p className="text-xl text-gray-400">
              AI-powered calculators and predictors for everyday decisions.
              From weather predictions to smart calculations — all free.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculatorTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                      {tool.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2">{tool.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] text-gray-400">{tag}</span>
                  ))}
                </div>
              </Link>
            );
          })}

          {/* Coming Soon */}
          <div className="bg-white/[0.02] rounded-2xl border border-dashed border-white/10 p-6 flex items-center justify-center">
            <p className="text-gray-600 text-sm text-center">More calculators coming soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
}
