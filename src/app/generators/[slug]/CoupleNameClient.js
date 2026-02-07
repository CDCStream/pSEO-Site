'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function CoupleNameClient({ config }) {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateNames = async () => {
    if (!firstName.trim() || !secondName.trim()) {
      setError('Please enter both names');
      return;
    }

    setLoading(true);
    setError('');
    setNames([]);

    try {
      const response = await fetch('/api/couple-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          secondName: secondName.trim(),
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
      {/* Names Input */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-white font-medium mb-2">
            First Person Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g., Romeo"
            className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            Second Person Name
          </label>
          <input
            type="text"
            value={secondName}
            onChange={(e) => setSecondName(e.target.value)}
            placeholder="e.g., Juliet"
            className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Heart Decoration */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent flex-1" />
        <span className="text-4xl">💕</span>
        <div className="h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent flex-1" />
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
          disabled={loading || !firstName.trim() || !secondName.trim()}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-xl hover:from-pink-400 hover:to-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg"
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
              <span className="text-2xl">💝</span>
              Generate Couple Names
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {names.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white text-center mb-4">
            💑 Ship Names for {firstName} + {secondName}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {names.map((name, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-white/10 rounded-xl hover:border-pink-500/50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">❤️</span>
                  <span className="text-white font-medium">{name}</span>
                </div>
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

