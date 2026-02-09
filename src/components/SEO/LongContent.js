/* ===== GEO: Semantic Long Content with <article> structure ===== */

/* Inline SVG icon — no lucide-react dependency */
const FileTextSvg = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);

/**
 * Parse markdown-style links [text](url) into clickable anchor elements.
 */
function parseLinks(text) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-400 hover:text-orange-300 underline"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function LongContent({ content, keyword }) {
  if (!content) return null;

  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <section className="mt-16" aria-label={`About ${keyword}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <FileTextSvg className="w-5 h-5 text-white" />
        </div>
        {/* Semantic H2 — descriptive heading */}
        <h2 className="text-2xl font-bold text-white">
          About {keyword}
        </h2>
      </div>

      {/* Semantic <article> wrapper for AI content extraction */}
      <article className="prose prose-invert prose-lg max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`text-gray-400 leading-relaxed mb-4 ${
              index === 0 ? 'text-gray-300 font-medium' : ''
            }`}
          >
            {/* First paragraph is emphasized as the summary/lead */}
            {index === 0 ? (
              <strong>{parseLinks(paragraph)}</strong>
            ) : (
              parseLinks(paragraph)
            )}
          </p>
        ))}
      </article>
    </section>
  );
}
