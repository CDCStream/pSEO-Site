'use client';

import { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
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

const CATEGORY_WORDS = {
  education: ['Academy', 'Learn', 'Teach', 'Edu', 'Study', 'Class', 'Tutor', 'Prof'],
  gaming: ['Gaming', 'Plays', 'Gamer', 'Games', 'GG', 'Pro', 'Streamer', 'Arcade'],
  tech: ['Tech', 'Digital', 'Geek', 'Byte', 'Code', 'Dev', 'Gadget', 'Pixel'],
  beauty: ['Beauty', 'Glam', 'Glow', 'Makeup', 'Style', 'Pretty', 'Cosmetics'],
  fitness: ['Fit', 'Gym', 'Strong', 'Muscle', 'Workout', 'Train', 'Active', 'Gains'],
  foodie: ['Food', 'Chef', 'Cook', 'Kitchen', 'Eats', 'Taste', 'Recipe', 'Yummy'],
  lifestyle: ['Life', 'Vibes', 'Daily', 'Living', 'Moments', 'Days', 'Journal'],
  travel: ['Travel', 'Wander', 'Explore', 'Nomad', 'Journey', 'Adventures', 'Trips'],
  family: ['Family', 'Home', 'Kids', 'Parents', 'Together', 'Memories', 'Moments'],
  comedy: ['Comedy', 'Funny', 'LOL', 'Jokes', 'Humor', 'Laugh', 'Hilarious'],
  music: ['Music', 'Beats', 'Sound', 'Audio', 'Melody', 'Tunes', 'Songs', 'Vibe'],
  art: ['Art', 'Creative', 'Design', 'Draw', 'Paint', 'Artist', 'Sketch', 'Studio'],
  finance: ['Finance', 'Money', 'Invest', 'Wealth', 'Rich', 'Budget', 'Crypto'],
  fashion: ['Fashion', 'Style', 'Trend', 'OOTD', 'Chic', 'Vogue', 'Wardrobe'],
  sports: ['Sports', 'Athlete', 'Pro', 'Champion', 'Win', 'Game', 'Team', 'MVP'],
  reviews: ['Reviews', 'Honest', 'Unbox', 'Test', 'Opinion', 'Rate', 'Compare'],
  health: ['Health', 'Wellness', 'Heal', 'Care', 'Vitality', 'Life', 'Healthy'],
  wellness: ['Zen', 'Calm', 'Mind', 'Soul', 'Peace', 'Balance', 'Mindful'],
  coaching: ['Coach', 'Mentor', 'Guide', 'Success', 'Grow', 'Motivate', 'Inspire'],
  nonprofit: ['Cause', 'Impact', 'Change', 'Help', 'Give', 'Support', 'Community'],
  realestate: ['Realty', 'Homes', 'Property', 'Estate', 'Houses', 'Living'],
  pet: ['Pet', 'Paw', 'Furry', 'Cute', 'Animals', 'Fluffy', 'Buddy', 'Companion'],
  diy: ['DIY', 'Craft', 'Make', 'Create', 'Build', 'Handmade', 'Projects'],
  photography: ['Photo', 'Lens', 'Capture', 'Shot', 'Clicks', 'Visual', 'Focus'],
  automotive: ['Auto', 'Cars', 'Drive', 'Motor', 'Speed', 'Wheels', 'Garage'],
};

export default function YouTubeNameClient({ config }) {
  const [accountType, setAccountType] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [regenerateKey, setRegenerateKey] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateNames = () => {
    if (!accountType || !category) return [];

    const descWords = description.trim().split(/\s+/).filter(w => w.length > 0);
    const mainWord = descWords[0] || category;
    const cleanWord = mainWord.replace(/[^a-zA-Z0-9]/g, '');
    const categoryWords = CATEGORY_WORDS[category] || ['Official', 'HQ', 'Hub'];

    const prefixes = accountType === 'business'
      ? ['Official', 'The', 'Real', 'Get', 'Try', 'Join', 'Visit', 'Go']
      : ['Its', 'The', 'Hey', 'Just', 'Im', 'Hi', 'Meet', 'Call'];

    const suffixes = accountType === 'business'
      ? ['HQ', 'Co', 'Inc', 'Official', 'Global', 'Media', 'Studio', 'Brand']
      : ['TV', 'Tube', 'Daily', 'Weekly', 'Show', 'Live', 'Vids', ''];

    const names = new Set();

    // Generate various name patterns
    const catWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const year = ['24', '25', '2024', '2025', ''][Math.floor(Math.random() * 5)];

    // Pattern variations
    names.add(`${cleanWord} ${catWord}`);
    names.add(`${prefix} ${cleanWord}`);
    names.add(`${cleanWord} ${suffix}`);
    names.add(`${cleanWord} ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    names.add(`${catWord} ${cleanWord}`);
    names.add(`${cleanWord}${year}`);
    names.add(`${cleanWord} Official`);
    names.add(`The ${cleanWord}`);
    names.add(`${cleanWord} ${categoryWords[Math.floor(Math.random() * categoryWords.length)]}`);
    names.add(`${prefix} ${cleanWord} ${suffix}`);

    // If description has multiple words, create combinations
    if (descWords.length >= 2) {
      const combo = descWords.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      names.add(combo);
      names.add(`${combo} ${catWord}`);
    }

    return Array.from(names)
      .filter(n => n.trim().length >= 3 && n.trim().length <= 50)
      .slice(0, 8)
      .map(name => ({ name: 'YouTube Name', text: name.trim() }));
  };

  const results = useMemo(() => {
    if (!hasGenerated) return [];
    return generateNames();
  }, [accountType, category, description, regenerateKey, hasGenerated]);

  const handleGenerate = () => {
    if (!accountType || !category) return;
    setHasGenerated(true);
    setRegenerateKey(k => k + 1);
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
          disabled={!accountType || !category}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all ${
            accountType && category
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/25'
              : 'bg-gray-700 cursor-not-allowed opacity-50'
          }`}
        >
          Generate Names
        </button>
        {hasGenerated && (
          <button
            onClick={() => setRegenerateKey(k => k + 1)}
            className="px-4 py-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results */}
      {!hasGenerated ? (
        <div className="text-center py-12 text-gray-500">
          <p>Select account type and category, then click Generate</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Please select Account Type and Category</p>
        </div>
      ) : (
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
      )}

      {/* Disclaimer */}
      {hasGenerated && results.length > 0 && (
        <p className="text-xs text-gray-500 text-center mt-6 italic">
          Please note: Check name availability on YouTube before using. Some names may already be taken.
        </p>
      )}
    </div>
  );
}

