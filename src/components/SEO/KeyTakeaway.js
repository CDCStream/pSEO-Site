/* ===== GEO: Key Takeaway — Featured Snippet Box for AI Engines ===== */

/**
 * A concise summary box placed near the top of tool pages.
 * Designed so AI search engines (Gemini, Perplexity, ChatGPT) can extract
 * a direct answer from the first <p> as a featured snippet.
 *
 * Props:
 *   - toolName: string — e.g. "Small Text Generator"
 *   - summary: string — 2-3 sentence plain-text description
 */
export default function KeyTakeaway({ toolName, summary }) {
  if (!summary) return null;

  return (
    <aside
      role="note"
      aria-label={`What is ${toolName}`}
      className="mb-8 rounded-xl border border-orange-500/20 bg-orange-500/5 p-5"
    >
      {/* Direct-answer heading — AI engines prioritize this pattern */}
      <h2 className="text-lg font-bold text-orange-400 mb-2">
        What is {toolName}?
      </h2>
      <p className="text-gray-300 leading-relaxed text-sm">
        {summary}
      </p>
    </aside>
  );
}

