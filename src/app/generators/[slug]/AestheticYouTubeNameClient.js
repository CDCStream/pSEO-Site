'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

const AESTHETICS = [
  { value: 'cottagecore', label: '🌿 Cottagecore', desc: 'Nature, cozy, pastoral vibes' },
  { value: 'dark-academia', label: '📚 Dark Academia', desc: 'Literary, vintage, mysterious' },
  { value: 'minimalist', label: '⬜ Minimalist', desc: 'Clean, simple, zen' },
  { value: 'soft-pastel', label: '🌸 Soft/Pastel', desc: 'Dreamy, gentle, kawaii' },
  { value: 'vintage', label: '📷 Vintage', desc: 'Retro, nostalgic, classic' },
  { value: 'ethereal', label: '✨ Ethereal', desc: 'Magical, celestial, airy' },
  { value: 'grunge', label: '🖤 Grunge', desc: 'Raw, edgy, alternative' },
  { value: 'coastal', label: '🌊 Coastal/Beachy', desc: 'Ocean, summer, serene' },
];

const CONTENT_TYPES = [
  'Lifestyle & Vlogs',
  'Art & Creativity',
  'Study & Productivity',
  'Fashion & Beauty',
  'Home & Decor',
  'Cooking & Baking',
  'Reading & Books',
  'Music & Covers',
  'ASMR & Relaxation',
  'Travel & Adventure',
];

export default function AestheticYouTubeNameClient({ config }) {
  const [aesthetic, setAesthetic] = useState('');
  const [contentType, setContentType] = useState('');
  const [keywords, setKeywords] = useState('');
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateNames = async () => {
    setLoading(true);
    setError('');
    setNames([]);

    try {
      const response = await fetch('/api/aesthetic-youtube-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aesthetic: AESTHETICS.find(a => a.value === aesthetic)?.label || '',
          contentType,
          keywords: keywords.trim(),
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
    <div className="bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-2xl border border-white/10 p-6 sm:p-8 mb-8">
      {/* Aesthetic Selection */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">
          Choose your aesthetic ✨
        </label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AESTHETICS.map((item) => (
            <button
              key={item.value}
              onClick={() => setAesthetic(item.value)}
              className={`p-4 rounded-xl text-left transition-all ${
                aesthetic === item.value
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-xs opacity-70 mt-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Type */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">
          What type of content will you create?
        </label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setContentType(contentType === type ? '' : type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                contentType === type
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">
          Any words or themes to include? (optional)
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., moon, rose, dream, cloud, your name..."
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
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
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-pink-400 hover:to-purple-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg"
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
              <span className="text-2xl">☁️</span>
              Generate Aesthetic Names
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {names.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white text-center mb-4">
            ✿ Your Aesthetic Channel Names
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {names.map((name, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-white/10 rounded-xl hover:border-pink-500/50 transition-colors"
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

      {/* Initial State */}
      {names.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-6xl mb-4">☁️</div>
          <p>Choose your aesthetic and create dreamy channel names</p>
        </div>
      )}
    </div>
  );
}

