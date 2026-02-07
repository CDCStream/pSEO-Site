'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

const GENRES = [
  'Rock',
  'Pop',
  'Hip Hop',
  'Electronic',
  'Metal',
  'Indie',
  'Jazz',
  'R&B/Soul',
  'Country',
  'Punk',
  'Alternative',
  'Folk',
  'Classical',
  'Reggae',
  'Blues',
  'EDM',
  'K-Pop',
  'Latin',
];

const VIBES = [
  'Energetic',
  'Dark & Mysterious',
  'Chill & Relaxed',
  'Rebellious',
  'Romantic',
  'Futuristic',
  'Nostalgic/Retro',
  'Aggressive',
  'Dreamy',
  'Fun & Playful',
  'Serious & Deep',
  'Experimental',
  'Minimalist',
  'Epic & Grand',
];

export default function BandNameClient({ config }) {
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [vibe, setVibe] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeWords, setIncludeWords] = useState('');
  const [excludeWords, setExcludeWords] = useState('');
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateNames = async () => {
    if (!description.trim()) {
      setError('Please describe your band');
      return;
    }

    setLoading(true);
    setError('');
    setNames([]);

    try {
      const response = await fetch('/api/band-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          genre,
          vibe,
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
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 mb-8">
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Description */}
        <div className="lg:col-span-2">
          <label className="block text-white font-medium mb-2">
            Briefly Describe the Band<span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="a fusion of electronic beats and soulful vocals..."
            className="w-full h-40 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Genre */}
          <div>
            <label className="block text-white font-medium mb-2">
              Genre<span className="text-red-400">*</span>
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
            >
              <option value="" className="bg-gray-900">Select genre...</option>
              {GENRES.map(g => (
                <option key={g} value={g} className="bg-gray-900">{g}</option>
              ))}
            </select>
          </div>

          {/* Vibe */}
          <div>
            <label className="block text-white font-medium mb-2">
              Vibe/Tone<span className="text-red-400">*</span>
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
            >
              <option value="" className="bg-gray-900">Select vibe...</option>
              {VIBES.map(v => (
                <option key={v} value={v} className="bg-gray-900">{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-gray-400 text-sm">Advanced settings</span>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`relative w-12 h-6 rounded-full transition-colors ${showAdvanced ? 'bg-purple-600' : 'bg-gray-600'}`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${showAdvanced ? 'left-7' : 'left-1'}`}
          />
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="grid sm:grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Words to include
            </label>
            <input
              type="text"
              value={includeWords}
              onChange={(e) => setIncludeWords(e.target.value)}
              placeholder="e.g., Night, Electric, Soul"
              className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Words to exclude
            </label>
            <input
              type="text"
              value={excludeWords}
              onChange={(e) => setExcludeWords(e.target.value)}
              placeholder="e.g., Death, Blood"
              className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={generateNames}
          disabled={loading || !description.trim()}
          className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
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
            🎸 Your Band Name Ideas
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {names.map((name, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10 rounded-xl hover:border-purple-500/50 transition-colors group"
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

