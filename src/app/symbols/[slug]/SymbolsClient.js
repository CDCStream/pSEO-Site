'use client';

import { useState } from 'react';
import { Search, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function SymbolsClient({ symbols, name }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { addToast } = useToast();

  const filteredSymbols = symbols.filter(symbol =>
    symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = async (symbol, index) => {
    try {
      await navigator.clipboard.writeText(symbol);
      setCopiedIndex(index);
      addToast(`Copied: ${symbol}`, 'success');

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (err) {
      addToast('Failed to copy', 'error');
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(symbols.join(' '));
      addToast('All symbols copied!', 'success');
    } catch (err) {
      addToast('Failed to copy', 'error');
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symbols..."
            className="w-full pl-10 pr-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
        <button
          onClick={copyAll}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy All
        </button>
      </div>

      {/* Symbols Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {filteredSymbols.map((symbol, index) => (
          <button
            key={index}
            onClick={() => handleCopy(symbol, index)}
            className={`
              relative aspect-square flex items-center justify-center
              text-2xl sm:text-3xl
              rounded-xl border transition-all duration-200
              hover:scale-110 hover:z-10
              ${copiedIndex === index
                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                : 'bg-black/30 border-white/10 hover:border-purple-500/50 hover:bg-white/10'}
            `}
            title={`Click to copy: ${symbol}`}
          >
            {copiedIndex === index ? (
              <Check className="w-5 h-5" />
            ) : (
              symbol
            )}
          </button>
        ))}
      </div>

      {filteredSymbols.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No symbols found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-white/10 flex justify-between text-sm text-gray-400">
        <span>Showing {filteredSymbols.length} of {symbols.length} symbols</span>
        <span>Click any symbol to copy</span>
      </div>
    </div>
  );
}

