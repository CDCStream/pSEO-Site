'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function DissTrackClient({ config, slug }) {
  const [target, setTarget] = useState('');
  const [style, setStyle] = useState('');
  const [beef, setBeef] = useState('');
  const [tone, setTone] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateDissTrack = async () => {
    if (!target.trim()) {
      setError('Please enter a target name');
      return;
    }

    setLoading(true);
    setError('');
    setLyrics('');

    try {
      const response = await fetch('/api/diss-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: target.trim(),
          style: style.trim(),
          beef: beef.trim(),
          tone: tone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate diss track');
      }

      setLyrics(data.lyrics);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-glass-dark rounded-2xl border border-white/10 p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">🎤</span> Generate Your AI Diss Track
      </h2>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        {/* Target */}
        <div>
          <label htmlFor="target" className="block text-gray-300 text-sm font-medium mb-2">
            Target <span className="text-red-400">*</span>
          </label>
          <input
            id="target"
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="example: rival rapper, ex-friend"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Style */}
        <div>
          <label htmlFor="style" className="block text-gray-300 text-sm font-medium mb-2">
            Your Style (optional)
          </label>
          <input
            id="style"
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="example: Eminem, Kendrick Lamar"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Specific Beef */}
        <div>
          <label htmlFor="beef" className="block text-gray-300 text-sm font-medium mb-2">
            Specific Beef (optional)
          </label>
          <input
            id="beef"
            type="text"
            value={beef}
            onChange={(e) => setBeef(e.target.value)}
            placeholder="example: stole my beat, dissed my crew"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Tone */}
        <div>
          <label htmlFor="tone" className="block text-gray-300 text-sm font-medium mb-2">
            Tone
          </label>
          <input
            id="tone"
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="example: aggressive, sarcastic, humorous"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateDissTrack}
          disabled={loading || !target.trim()}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-bold rounded-xl hover:from-orange-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Writing Bars...
            </>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              Generate Diss Track 🔥
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      {lyrics && (
        <div className="bg-black/40 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🎵 Your Diss Track
            </h3>
            <CopyButton text={lyrics} />
          </div>
          <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {lyrics}
          </pre>

          {/* Regenerate Button */}
          <button
            onClick={generateDissTrack}
            disabled={loading}
            className="mt-4 w-full py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            Generate Another Track
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-gray-500 text-xs mt-6">
        ⚠️ For entertainment purposes only. AI-generated content. Keep it fun, not hurtful!
      </p>
    </div>
  );
}
