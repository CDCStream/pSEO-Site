'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function PodcastNameClient({ config }) {
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [likedPodcasts, setLikedPodcasts] = useState('');
  const [includeWords, setIncludeWords] = useState('');
  const [excludeWords, setExcludeWords] = useState('');
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateNames = async () => {
    if (!description.trim()) {
      setError('Please enter a podcast description');
      return;
    }

    setLoading(true);
    setError('');
    setNames([]);

    try {
      const response = await fetch('/api/podcast-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          audience: audience.trim(),
          likedPodcasts: likedPodcasts.trim(),
          includeWords: includeWords.trim(),
          excludeWords: excludeWords.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate names');
      }

      setNames(data.names);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-glass-dark rounded-2xl border border-white/10 p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-6 text-center">
        Enter a description of your podcast:
      </h2>

      {/* Main Description */}
      <div className="mb-6">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what your podcast is about, the topics you'll cover, your unique angle..."
          className="w-full h-48 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
        />
      </div>

      {/* Additional Options */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-white font-medium mb-2">
            What is the target audience for your podcast?
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-gray-500 text-sm mt-1">For example, gamers or young professionals.</p>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            What other podcast names do you like? (Full name)
          </label>
          <input
            type="text"
            value={likedPodcasts}
            onChange={(e) => setLikedPodcasts(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-gray-500 text-sm mt-1">For example, The Joe Rogan Experience, not Joe Rogan.</p>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            What words need to be in the title?
          </label>
          <input
            type="text"
            value={includeWords}
            onChange={(e) => setIncludeWords(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-gray-500 text-sm mt-1">For example, someone's name.</p>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            What words should NOT be in the title?
          </label>
          <input
            type="text"
            value={excludeWords}
            onChange={(e) => setExcludeWords(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-gray-500 text-sm mt-1">We will try to exclude these words.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={generateNames}
          disabled={loading || !description.trim()}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" />
                <path d="M12 6v6l4 2" />
              </svg>
              Generate Names
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {names.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white text-center mb-4">
            🎙️ Your Podcast Name Ideas
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {names.map((name, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <span className="text-white font-medium">{name}</span>
                <CopyButton text={name} />
              </div>
            ))}
          </div>

          <button
            onClick={generateNames}
            disabled={loading}
            className="w-full mt-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            Generate More Names
          </button>
        </div>
      )}
    </div>
  );
}

