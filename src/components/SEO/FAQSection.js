/* ===== GEO: FAQ Section optimized for featured snippets ===== */
'use client';

import { useState } from 'react';

/* Inline SVG icons — no lucide-react dependency */
const HelpCircleSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
);
const ChevronDownSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

export default function FAQSection({ faqs, keyword }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-16" aria-label="Frequently Asked Questions">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <HelpCircleSvg className="w-5 h-5 text-white" />
        </div>
        {/* Semantic H2 — descriptive, not keyword-stuffed */}
        <h2 className="text-2xl font-bold text-white">
          Frequently Asked Questions
        </h2>
      </div>

      {/* FAQ items — first 2 open by default for featured snippet crawlability */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.q}
            answer={faq.a}
            defaultOpen={index < 2}
          />
        ))}
      </div>

      {/* FAQPage JSON-LD Schema — critical for AI search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}

function FAQItem({ question, answer, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-white pr-4" itemProp="name">
          {question}
        </span>
        <ChevronDownSvg
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <div className="px-5 pb-5 text-gray-400 leading-relaxed" itemProp="text">
          {answer}
        </div>
      </div>
    </div>
  );
}
