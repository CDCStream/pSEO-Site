import { FileText } from 'lucide-react';

export default function LongContent({ content, keyword }) {
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          About {keyword}
        </h2>
      </div>

      <article className="prose prose-invert prose-lg max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-gray-400 leading-relaxed mb-4"
          >
            {paragraph}
          </p>
        ))}
      </article>
    </section>
  );
}

