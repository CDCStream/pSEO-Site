/* ===== GEO: Technical Process — Trust & E-E-A-T Signal ===== */

/**
 * Explains how the tool works under the hood.
 * Builds user trust and provides AI engines with technical context.
 *
 * Props:
 *   - toolName: string — e.g. "Small Text Generator"
 *   - steps: string[] — e.g. ["User enters text", "Unicode mapping is applied", ...]
 *     If not provided, a sensible default is used.
 */

/* Inline SVG icon */
const CogSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

const defaultSteps = [
  'You enter your text into the input field.',
  'The tool processes your input using Unicode character mapping in real-time.',
  'Transformed text is displayed instantly — no server request needed.',
  'Click the copy button to save the result to your clipboard.',
  'Paste the result anywhere: Instagram, Discord, Twitter, TikTok, or any app.',
];

export default function TechnicalProcess({ toolName, steps = defaultSteps }) {
  return (
    <section className="mt-12" aria-label={`How ${toolName} works technically`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <CogSvg className="w-5 h-5 text-white" />
        </div>
        {/* Unique H2 — not repeating "How to Use" */}
        <h2 className="text-2xl font-bold text-white">
          How It Works — Technical Process
        </h2>
      </div>

      {/* Semantic ordered list */}
      <ol className="space-y-3 list-decimal list-inside">
        {steps.map((step, index) => (
          <li
            key={index}
            className="text-gray-400 leading-relaxed pl-2"
          >
            {step}
          </li>
        ))}
      </ol>

      {/* Trust signal */}
      <p className="mt-4 text-xs text-gray-500">
        All processing happens in your browser. No data is sent to our servers. Your privacy is fully protected.
      </p>
    </section>
  );
}

