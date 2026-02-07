'use client';

import { useState } from 'react';

export default function YouTubeChannelIdeaClient({ config }) {
  const [description, setDescription] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateIdeas = async () => {
    if (!description.trim()) {
      setError('Please describe what your channel is about');
      return;
    }

    setLoading(true);
    setError('');
    setIdeas([]);

    try {
      const response = await fetch('/api/youtube-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate ideas');
      }

      setIdeas(data.ideas);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPotentialColor = (potential) => {
    const p = potential.toLowerCase();
    if (p.includes('high')) return 'text-green-400 bg-green-500/20';
    if (p.includes('medium')) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="bg-glass-dark rounded-2xl border border-white/10 p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Tell us what your channel is about
      </h2>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., I want to make videos about cooking healthy meals for busy professionals, or gaming tutorials for indie games, or tech reviews for budget smartphones..."
          className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <button
          onClick={generateIdeas}
          disabled={loading || !description.trim()}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating Ideas...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate Channel Ideas
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {ideas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Generated Channel Ideas
          </h3>

          <div className="grid gap-4">
            {ideas.map((idea, index) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="text-xl font-bold text-white">
                    {idea.name}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPotentialColor(idea.potential)}`}>
                    {idea.potential}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-20 shrink-0">Niche:</span>
                    <span className="text-blue-400">{idea.niche}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500 w-20 shrink-0">Audience:</span>
                    <span className="text-gray-300">{idea.audience}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-500 w-20 shrink-0">Content:</span>
                    <span className="text-gray-300">{idea.content}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={generateIdeas}
            disabled={loading}
            className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            Generate More Ideas
          </button>
        </div>
      )}
    </div>
  );
}

