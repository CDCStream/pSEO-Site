'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function RobloxNameClient({ config }) {
  const [keyword, setKeyword] = useState('');
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateNames = async () => {
    setLoading(true);
    setError('');
    setNames([]);

    try {
      const response = await fetch('/api/roblox-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keyword.trim(),
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

  const getCategoryColor = (category) => {
    const colors = {
      'Aesthetic': 'text-pink-400',
      'Cool': 'text-blue-400',
      'Funny': 'text-yellow-400',
      'OG': 'text-green-400',
      'Gaming': 'text-purple-400',
      'Cute': 'text-rose-400',
      'Creative': 'text-orange-400',
    };
    return colors[category] || 'text-gray-400';
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 mb-8">
      {/* Input Section */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateNames()}
          placeholder="Type a word, feeling or emotion (optional)"
          className="flex-1 px-6 py-4 bg-white/5 border-2 border-white/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
        />
        <button
          onClick={generateNames}
          disabled={loading}
          className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </>
          ) : (
            'GENERATE'
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {names.length > 0 && (
        <div className="space-y-3">
          {names.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div>
                <div className="text-xl font-bold text-white font-mono">
                  @{item.name}
                </div>
                <div className={`text-sm ${getCategoryColor(item.category)}`}>
                  {item.category} name
                </div>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(item.name)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors text-sm font-medium"
              >
                COPY
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          ))}

          <button
            onClick={generateNames}
            disabled={loading}
            className="w-full mt-4 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            Generate More Usernames
          </button>
        </div>
      )}

      {/* Initial State */}
      {names.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-6xl mb-4">🎮</div>
          <p>Enter a keyword or click Generate to create unique Roblox usernames</p>
        </div>
      )}
    </div>
  );
}

