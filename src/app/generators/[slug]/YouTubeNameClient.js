'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

const ACCOUNT_TYPES = [
  { value: '', label: 'Select Account Type' },
  { value: 'business', label: 'Business' },
  { value: 'personal', label: 'Personal' },
];

const CATEGORIES = [
  { value: '', label: 'Select Category' },
  { value: 'education', label: 'Education' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'tech', label: 'Tech' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'foodie', label: 'Foodie' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'travel', label: 'Travel Vlog' },
  { value: 'family', label: 'Family Vlog' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'music', label: 'Musician' },
  { value: 'art', label: 'Artist' },
  { value: 'finance', label: 'Finance' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'sports', label: 'Sports' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'health', label: 'Health' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'pet', label: 'Pet' },
  { value: 'diy', label: 'DIY & Crafts' },
  { value: 'photography', label: 'Photography' },
  { value: 'automotive', label: 'Automotive' },
];

// Inline SVG for refresh icon
const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Loading spinner
const Spinner = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function YouTubeNameClient({ config }) {
  const [accountType, setAccountType] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!accountType || !category) return;

    setLoading(true);
    setError('');
    setHasGenerated(true);

    try {
      const response = await fetch('/api/youtube-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountType: ACCOUNT_TYPES.find(t => t.value === accountType)?.label || accountType,
          category: CATEGORIES.find(c => c.value === category)?.label || category,
          description,
        }),
      });

      const data = await response.json();

      if (data.success && data.names) {
        setResults(data.names.map(name => ({ name: 'YouTube Name', text: name })));
      } else {
        setError('Failed to generate names. Please try again.');
        setResults([]);
      }
    } catch (err) {
      console.error('Error generating names:', err);
      setError('Something went wrong. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const selectClass = "w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none cursor-pointer";

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      {/* Account Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Account Type
        </label>
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className={selectClass}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
        >
          {ACCOUNT_TYPES.map(type => (
            <option key={type.value} value={type.value} className="bg-gray-900">
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={selectClass}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value} className="bg-gray-900">
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Short Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Short Description <span className="text-gray-500 text-xs">({description.length}/200)</span>
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 200))}
          placeholder="Enter your channel name or keywords..."
          className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
        />
      </div>

      {/* Generate Button */}
      <div className="mb-8 flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={!accountType || !category || loading}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
            accountType && category && !loading
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/25'
              : 'bg-gray-700 cursor-not-allowed opacity-50'
          }`}
        >
          {loading ? (
            <>
              <Spinner />
              <span>Generating with AI...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Generate with AI</span>
            </>
          )}
        </button>
        {hasGenerated && !loading && results.length > 0 && (
          <button
            onClick={handleGenerate}
            className="px-4 py-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-all flex items-center gap-2"
            title="Regenerate"
          >
            <RefreshIcon />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Results */}
      {!hasGenerated ? (
        <div className="text-center py-12 text-gray-500">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-lg">Powered by Claude AI</p>
          <p className="text-sm mt-1">Select account type and category, then click Generate</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <Spinner />
          <p className="text-gray-400 mt-4">AI is generating creative names...</p>
        </div>
      ) : results.length === 0 && !error ? (
        <div className="text-center py-12 text-gray-500">
          <p>Please select Account Type and Category</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-black/30 rounded-xl border border-white/10 p-4 flex items-center justify-between group hover:border-orange-500/30 transition-all"
            >
              <span className="text-white text-lg font-medium select-all">
                {result.text}
              </span>
              <CopyButton text={result.text} size="sm" showLabel={false} />
            </div>
          ))}
        </div>
      ) : null}

      {/* AI Badge & Disclaimer */}
      {hasGenerated && results.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Generated by Claude AI</span>
          </div>
          <p className="text-xs text-gray-500 text-center italic">
            Please note: Check name availability on YouTube before using. Some names may already be taken.
          </p>
        </div>
      )}
    </div>
  );
}
