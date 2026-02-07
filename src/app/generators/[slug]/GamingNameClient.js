'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

const GAME_TYPES = [
  { value: 'fps', label: '🎯 FPS / Shooter', desc: 'Call of Duty, CS2, Valorant' },
  { value: 'moba', label: '⚔️ MOBA', desc: 'League of Legends, Dota 2' },
  { value: 'battle-royale', label: '🏆 Battle Royale', desc: 'Fortnite, PUBG, Apex' },
  { value: 'mmo', label: '🐉 MMO / RPG', desc: 'WoW, Final Fantasy, Lost Ark' },
  { value: 'racing', label: '🏎️ Racing', desc: 'Forza, Need for Speed' },
  { value: 'sports', label: '⚽ Sports', desc: 'FIFA, NBA 2K, Madden' },
  { value: 'horror', label: '👻 Horror', desc: 'Dead by Daylight, Phasmophobia' },
  { value: 'sandbox', label: '🧱 Sandbox', desc: 'Minecraft, Roblox, Terraria' },
  { value: 'fighting', label: '🥊 Fighting', desc: 'Street Fighter, Tekken, Mortal Kombat' },
  { value: 'strategy', label: '🏰 Strategy', desc: 'Age of Empires, Civilization' },
];

const STYLES = [
  'Aggressive',
  'Tactical', 
  'Mysterious',
  'Funny',
  'Pro/Competitive',
  'Toxic/Edgy',
  'Chill/Friendly',
];

export default function GamingNameClient({ config }) {
  const [gameType, setGameType] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateNames = async () => {
    setLoading(true);
    setError('');
    setNames([]);

    try {
      const response = await fetch('/api/gaming-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: GAME_TYPES.find(g => g.value === gameType)?.label || '',
          description: description.trim(),
          style,
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

  const getStyleColor = (style) => {
    const colors = {
      'Aggressive': 'text-red-400',
      'Tactical': 'text-blue-400',
      'Legendary': 'text-yellow-400',
      'Mysterious': 'text-purple-400',
      'Pro': 'text-green-400',
      'Funny': 'text-orange-400',
      'Elite': 'text-cyan-400',
      'Toxic': 'text-lime-400',
    };
    return colors[style] || 'text-gray-400';
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 mb-8">
      {/* Game Type Selection */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">
          What type of game do you play?
        </label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GAME_TYPES.map((game) => (
            <button
              key={game.value}
              onClick={() => setGameType(game.value)}
              className={`p-4 rounded-xl text-left transition-all ${
                gameType === game.value
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className="font-medium">{game.label}</div>
              <div className="text-xs opacity-70">{game.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">
          Describe your playstyle or personality
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., I'm an aggressive sniper who loves clutch moments, my team calls me the silent assassin..."
          className="w-full h-24 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      {/* Style Selection */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-3">
          Preferred vibe (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(style === s ? '' : s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                style === s
                  ? 'bg-green-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {s}
            </button>
          ))}
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
          disabled={loading}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg"
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
              <span className="text-2xl">🎮</span>
              Generate Gaming Names
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {names.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white text-center mb-4">
            ⚡ Your Gaming Names
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {names.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-white/10 rounded-xl hover:border-green-500/50 transition-colors"
              >
                <div>
                  <div className="text-lg font-bold text-white font-mono">
                    {item.name}
                  </div>
                  <div className={`text-sm ${getStyleColor(item.style)}`}>
                    {item.style}
                  </div>
                </div>
                <CopyButton text={item.name} />
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
        <div className="text-center py-8 text-gray-500">
          <div className="text-6xl mb-4">🎮</div>
          <p>Select your game type and click Generate to create epic gaming names</p>
        </div>
      )}
    </div>
  );
}

