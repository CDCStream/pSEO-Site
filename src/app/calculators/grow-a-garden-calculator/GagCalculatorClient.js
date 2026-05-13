'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, X, RotateCcw, Zap, Leaf, Sparkles } from 'lucide-react';
import { QUALITY_OPTIONS, MUTATION_CATEGORIES, MUTATIONS, calculateCropValue, formatValue } from '@/lib/gag-mutations';

const STORAGE_KEY = 'makersilo:gag-calc:state';

export default function GagCalculatorClient() {
  const [basePrice, setBasePrice] = useState(1000);
  const [amount, setAmount] = useState(1);
  const [quality, setQuality] = useState(QUALITY_OPTIONS[0]);
  const [friendBoost, setFriendBoost] = useState(0);
  const [selectedMutationIds, setSelectedMutationIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.basePrice) setBasePrice(data.basePrice);
        if (data.amount) setAmount(data.amount);
        if (data.qualityId) {
          const q = QUALITY_OPTIONS.find(o => o.id === data.qualityId);
          if (q) setQuality(q);
        }
        if (data.friendBoost != null) setFriendBoost(data.friendBoost);
        if (data.mutationIds) setSelectedMutationIds(new Set(data.mutationIds));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        basePrice,
        amount,
        qualityId: quality.id,
        friendBoost,
        mutationIds: [...selectedMutationIds],
      }));
    } catch {}
  }, [basePrice, amount, quality, friendBoost, selectedMutationIds, hydrated]);

  const selectedMutations = useMemo(() =>
    MUTATIONS.filter(m => selectedMutationIds.has(m.id)),
    [selectedMutationIds]
  );

  const result = useMemo(() =>
    calculateCropValue({ basePrice, quality, selectedMutations, friendBoost, amount }),
    [basePrice, quality, selectedMutations, friendBoost, amount]
  );

  const filteredMutations = useMemo(() => {
    let list = MUTATIONS;
    if (activeCategory !== 'all') {
      list = list.filter(m => m.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.source.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.multiplier - a.multiplier);
  }, [activeCategory, searchQuery]);

  const toggleMutation = useCallback((id) => {
    setSelectedMutationIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedMutationIds(new Set());
    setBasePrice(1000);
    setAmount(1);
    setQuality(QUALITY_OPTIONS[0]);
    setFriendBoost(0);
    setSearchQuery('');
  }, []);

  const categoryColorMap = {
    weather: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    pet: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    admin: 'bg-red-500/20 text-red-300 border-red-500/30',
    combo: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    spray: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    event: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    special: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  };

  const categoryColorMapActive = {
    weather: 'bg-sky-500 text-white',
    pet: 'bg-amber-500 text-white',
    admin: 'bg-red-500 text-white',
    combo: 'bg-violet-500 text-white',
    spray: 'bg-teal-500 text-white',
    event: 'bg-rose-500 text-white',
    special: 'bg-emerald-500 text-white',
  };

  if (!hydrated) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-8 min-h-[400px] animate-pulse" />;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Crop Mutation Value Calculator</h2>
          <p className="text-sm text-gray-400">Select mutations and calculate your crop&apos;s total sheckle value</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row">
        {/* Left: Inputs + Mutations */}
        <div className="flex-1 min-w-0 p-6 border-b xl:border-b-0 xl:border-r border-white/10">
          {/* Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Base Crop Value ($)</label>
              <input
                type="number"
                min={0}
                value={basePrice}
                onChange={e => setBasePrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount of Plants</label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={e => setAmount(Math.max(1, Math.round(Number(e.target.value))))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Friend Boost (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={friendBoost}
                  onChange={e => setFriendBoost(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-white/10 accent-emerald-500"
                />
                <span className="text-sm text-white w-10 text-right">{friendBoost}%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Quality</label>
              <div className="flex gap-1">
                {QUALITY_OPTIONS.map(q => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      quality.id === q.id
                        ? q.id === 'none' ? 'bg-gray-600 text-white'
                          : q.id === 'silver' ? 'bg-slate-400 text-white'
                          : q.id === 'gold' ? 'bg-yellow-500 text-black'
                          : 'bg-purple-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Tabs + Search */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All ({MUTATIONS.length})
            </button>
            {MUTATION_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? categoryColorMapActive[cat.id]
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search mutations..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mutation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredMutations.map(mutation => {
              const isActive = selectedMutationIds.has(mutation.id);
              return (
                <button
                  key={mutation.id}
                  onClick={() => toggleMutation(mutation.id)}
                  className={`text-left p-2.5 rounded-lg border transition-all ${
                    isActive
                      ? `${categoryColorMapActive[mutation.category]} border-transparent shadow-lg scale-[1.02]`
                      : `${categoryColorMap[mutation.category]} hover:scale-[1.01]`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{mutation.name}</span>
                    <span className={`text-xs font-bold ml-1 ${isActive ? 'text-white/90' : ''}`}>
                      {mutation.multiplier}x
                    </span>
                  </div>
                  <p className="text-[10px] opacity-70 mt-0.5 truncate">{mutation.source}</p>
                </button>
              );
            })}
            {filteredMutations.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No mutations found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* Selected Mutations Chips */}
          {selectedMutations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">
                  Selected ({selectedMutations.length})
                </span>
                <button
                  onClick={() => setSelectedMutationIds(new Set())}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedMutations.map(m => (
                  <button
                    key={m.id}
                    onClick={() => toggleMutation(m.id)}
                    className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${categoryColorMapActive[m.category]}`}
                  >
                    {m.name} ({m.multiplier}x)
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Results Panel */}
        <div className="w-full xl:w-[340px] shrink-0 p-6 bg-white/[0.02]">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Calculation Result
              </h3>
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Final Value */}
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 p-5 mb-4">
              <p className="text-xs text-emerald-300/70 mb-1">Total Crop Value</p>
              <p className="text-3xl font-bold text-emerald-300 tracking-tight">
                {formatValue(result.finalValue)}
              </p>
              {amount > 1 && (
                <p className="text-xs text-emerald-300/60 mt-1">
                  {formatValue(result.finalValue / amount)} per plant × {amount}
                </p>
              )}
            </div>

            {/* Total Multiplier */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Total Multiplier</span>
              </div>
              <p className="text-2xl font-bold text-white mb-3">
                {result.totalMultiplier.toLocaleString('en-US', { maximumFractionDigits: 2 })}x
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Quality ({quality.label})</span>
                  <span className="text-white font-medium">{result.qualityMultiplier}x</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Mutations ({selectedMutations.length})</span>
                  <span className="text-white font-medium">
                    {result.mutationFactor.toLocaleString('en-US', { maximumFractionDigits: 2 })}x
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Friend Boost ({friendBoost}%)</span>
                  <span className="text-white font-medium">{result.friendFactor.toFixed(2)}x</span>
                </div>
              </div>
            </div>

            {/* Formula Display */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-gray-400 mb-2 font-medium">Formula</p>
              <div className="font-mono text-[11px] text-gray-300 break-all leading-relaxed">
                <span className="text-emerald-400">{formatValue(basePrice)}</span>
                {' × '}
                <span className="text-yellow-400">{result.qualityMultiplier}</span>
                {' × '}
                <span className="text-violet-400">(1 + {selectedMutations.reduce((s, m) => s + m.multiplier, 0)} - {selectedMutations.length})</span>
                {' × '}
                <span className="text-sky-400">{result.friendFactor.toFixed(2)}</span>
                {amount > 1 && (
                  <>
                    {' × '}
                    <span className="text-rose-400">{amount}</span>
                  </>
                )}
                {' = '}
                <span className="text-emerald-300 font-bold">{formatValue(result.finalValue)}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                <strong>Tip:</strong> Mutations stack additively. Each mutation adds (multiplier − 1) to the base factor of 1. 
                For example, Wet (2x) + Chilled (2x) = factor of 3, not 4.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
