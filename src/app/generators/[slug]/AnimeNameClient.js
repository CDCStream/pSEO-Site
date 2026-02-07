'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

const STYLES = [
  'Traditional Japanese',
  'Modern Anime',
  'Fantasy/Isekai',
  'Shonen Style',
  'Shoujo Style',
  'Cool & Mysterious',
  'Cute & Kawaii',
  'Warrior/Fighter',
  'Noble/Royal',
  'Demon/Dark',
];

export default function AnimeNameClient({ config }) {
  const [gender, setGender] = useState('');
  const [style, setStyle] = useState('');
  const [meaning, setMeaning] = useState('');
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateNames = async () => {
    setLoading(true);
    setError('');
    setNames([]);

    try {
      const response = await fetch('/api/anime-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          style,
          meaning: meaning.trim(),
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
      {/* Gender Selection */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">
          Select Gender
        </label>
        <div className="flex flex-wrap gap-3">
          {['Any', 'Male', 'Female'].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g === 'Any' ? '' : g)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                (g === 'Any' && gender === '') || gender === g
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {g === 'Male' && '👦 '}
              {g === 'Female' && '👧 '}
              {g === 'Any' && '✨ '}
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">
          Name Style (Optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(style === s ? '' : s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                style === s
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Meaning Input */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">
          Desired Meaning (Optional)
        </label>
        <input
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="e.g., light, darkness, flower, fire, moon..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <p className="text-gray-500 text-sm mt-1">
          Enter themes or meanings you'd like the names to reflect
        </p>
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
          disabled={loading}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:from-pink-400 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg"
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
              <span className="text-2xl">🌸</span>
              Generate Anime Names
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {names.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white text-center mb-4">
            🎌 Your Anime Character Names
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {names.map((name, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-white/10 rounded-xl hover:border-pink-500/50 transition-colors group"
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

