'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { unicodeMaps, glitchChars } from '@/config/pSEO-data';

// Text transformation functions
const transformers = {
  smallText: (text) => {
    const smallCaps = unicodeMaps.smallCaps;
    const superscript = unicodeMaps.superscript;

    const toSmallCaps = text.split('').map(char => {
      const lower = char.toLowerCase();
      return smallCaps[lower] || char;
    }).join('');

    const toSuperscript = text.split('').map(char => {
      const lower = char.toLowerCase();
      return superscript[lower] || char;
    }).join('');

    const toSubscript = text.split('').map(char => {
      const lower = char.toLowerCase();
      return unicodeMaps.subscript[lower] || char;
    }).join('');

    return [
      { name: 'Small Caps', text: toSmallCaps },
      { name: 'Superscript', text: toSuperscript },
      { name: 'Subscript', text: toSubscript },
    ];
  },

  tiny: (text) => {
    const superscript = unicodeMaps.superscript;
    const result = text.split('').map(char => {
      const lower = char.toLowerCase();
      return superscript[lower] || char;
    }).join('');

    return [
      { name: 'Tiny Text', text: result },
    ];
  },

  glitch: (text, intensity = 5) => {
    const { above, below, middle } = glitchChars;

    const getRandomChars = (arr, count) => {
      let result = '';
      for (let i = 0; i < count; i++) {
        result += arr[Math.floor(Math.random() * arr.length)];
      }
      return result;
    };

    const glitched = text.split('').map(char => {
      if (char === ' ') return ' ';
      return char +
        getRandomChars(above, Math.floor(intensity / 2)) +
        getRandomChars(below, Math.floor(intensity / 2)) +
        getRandomChars(middle, Math.floor(intensity / 3));
    }).join('');

    return [
      { name: 'Glitch Text', text: glitched },
    ];
  },

  strikethrough: (text) => {
    const result = text.split('').map(char => char + '\u0336').join('');
    const underline = text.split('').map(char => char + '\u0332').join('');

    return [
      { name: 'Strikethrough', text: result },
      { name: 'Underline', text: underline },
    ];
  },

  morse: (text) => {
    const morse = unicodeMaps.morse;
    const result = text.toLowerCase().split('').map(char => {
      return morse[char] || char;
    }).join(' ');

    return [
      { name: 'Morse Code', text: result },
    ];
  },

  binary: (text) => {
    const result = text.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');

    return [
      { name: 'Binary', text: result },
    ];
  },

  gothic: (text) => {
    const gothic = unicodeMaps.gothic;
    const result = text.split('').map(char => gothic[char] || char).join('');

    return [
      { name: 'Gothic/Fraktur', text: result },
    ];
  },

  bubble: (text) => {
    const bubble = unicodeMaps.bubble;
    const result = text.split('').map(char => bubble[char] || char).join('');

    return [
      { name: 'Bubble Text', text: result },
    ];
  },

  minecraft: (text) => {
    const minecraft = unicodeMaps.minecraft;
    const result = text.toLowerCase().split('').map(char => minecraft[char] || char).join('');

    return [
      { name: 'Minecraft Enchanting', text: result },
    ];
  },
};

export default function TextToolClient({ config, slug }) {
  const [inputText, setInputText] = useState('');
  const [intensity, setIntensity] = useState(5);

  const getTransformedText = useCallback(() => {
    if (!inputText.trim()) return [];

    const transformerKey = config.transformType;
    const transformer = transformers[transformerKey];

    if (!transformer) return [];

    if (transformerKey === 'glitch') {
      return transformer(inputText, intensity);
    }

    return transformer(inputText);
  }, [inputText, config.transformType, intensity]);

  const results = getTransformedText();

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Enter your text
        </label>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-32 px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Intensity Slider for Glitch */}
      {config.transformType === 'glitch' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Glitch Intensity: {intensity}
          </label>
          <input
            type="range"
            min="1"
            max="15"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Subtle</span>
            <span>Extreme</span>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Start typing to see your transformed text</p>
          </div>
        ) : (
          results.map((result, index) => (
            <div
              key={index}
              className="bg-black/30 rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
                <span className="text-sm font-medium text-gray-300">{result.name}</span>
                <CopyButton text={result.text} size="sm" />
              </div>
              <div className="p-4">
                <p className="text-white text-lg break-all font-mono leading-relaxed">
                  {result.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Regenerate for Glitch */}
      {config.transformType === 'glitch' && inputText && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIntensity(prev => prev)} // Force re-render
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Glitch
          </button>
        </div>
      )}
    </div>
  );
}

