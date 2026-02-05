'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { unicodeMaps, glitchChars } from '@/config/pSEO-data';

// Unicode mappings using escape sequences for encoding safety
const SUPERSCRIPT_MAP = {
  // Lowercase
  'a': '\u1D43', 'b': '\u1D47', 'c': '\u1D9C', 'd': '\u1D48', 'e': '\u1D49', 'f': '\u1DA0', 'g': '\u1D4D', 'h': '\u02B0',
  'i': '\u1DA6', 'j': '\u02B2', 'k': '\u1D4F', 'l': '\u02E1', 'm': '\u1D50', 'n': '\u207F', 'o': '\u1D52', 'p': '\u1D56',
  'q': '\u1D60', 'r': '\u02B3', 's': '\u02E2', 't': '\u1D57', 'u': '\u1D58', 'v': '\u1D5B', 'w': '\u02B7', 'x': '\u02E3',
  'y': '\u02B8', 'z': '\u1DBB',
  // Uppercase (using small caps as superscript capitals)
  'A': '\u1D2C', 'B': '\u1D2E', 'C': '\u1D9C', 'D': '\u1D30', 'E': '\u1D31', 'F': '\u1DA0', 'G': '\u1D33', 'H': '\u1D34',
  'I': '\u1D35', 'J': '\u1D36', 'K': '\u1D37', 'L': '\u1D38', 'M': '\u1D39', 'N': '\u1D3A', 'O': '\u1D3C', 'P': '\u1D3E',
  'Q': '\u1D60', 'R': '\u1D3F', 'S': '\u02E2', 'T': '\u1D40', 'U': '\u1D41', 'V': '\u2C7D', 'W': '\u1D42', 'X': '\u02E3',
  'Y': '\u02B8', 'Z': '\u1DBB',
  // Numbers
  '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074', '5': '\u2075',
  '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079', ' ': ' '
};

const SUBSCRIPT_MAP = {
  // Lowercase
  'a': '\u2090', 'b': '\u1D66', 'c': '\uD835\uDCB8', 'd': '\uD835\uDCB9', 'e': '\u2091', 'f': '\uD835\uDCBB', 'g': '\uD835\uDCF0', 'h': '\u2095',
  'i': '\u1D62', 'j': '\u2C7C', 'k': '\u2096', 'l': '\u2097', 'm': '\u2098', 'n': '\u2099', 'o': '\u2092', 'p': '\u209A',
  'q': '\u1D69', 'r': '\u1D63', 's': '\u209B', 't': '\u209C', 'u': '\u1D64', 'v': '\u1D65', 'w': '\uD835\uDCCC', 'x': '\u2093',
  'y': '\u1D67', 'z': '\uD835\uDCCF',
  // Uppercase (same as lowercase for subscript - no uppercase subscript in Unicode)
  'A': '\u2090', 'B': '\u1D66', 'C': '\uD835\uDCB8', 'D': '\uD835\uDCB9', 'E': '\u2091', 'F': '\uD835\uDCBB', 'G': '\uD835\uDCF0', 'H': '\u2095',
  'I': '\u1D62', 'J': '\u2C7C', 'K': '\u2096', 'L': '\u2097', 'M': '\u2098', 'N': '\u2099', 'O': '\u2092', 'P': '\u209A',
  'Q': '\u1D69', 'R': '\u1D63', 'S': '\u209B', 'T': '\u209C', 'U': '\u1D64', 'V': '\u1D65', 'W': '\uD835\uDCCC', 'X': '\u2093',
  'Y': '\u1D67', 'Z': '\uD835\uDCCF',
  // Numbers
  '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084', '5': '\u2085',
  '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089', ' ': ' '
};

const SMALLCAPS_MAP = {
  // Lowercase
  'a': '\u1D00', 'b': '\u0299', 'c': '\u1D04', 'd': '\u1D05', 'e': '\u1D07', 'f': '\uA730', 'g': '\u0262', 'h': '\u029C',
  'i': '\u026A', 'j': '\u1D0A', 'k': '\u1D0B', 'l': '\u029F', 'm': '\u1D0D', 'n': '\u0274', 'o': '\u1D0F', 'p': '\u1D18',
  'q': '\u01EB', 'r': '\u0280', 's': 's', 't': '\u1D1B', 'u': '\u1D1C', 'v': '\u1D20', 'w': '\u1D21', 'x': 'x',
  'y': '\u028F', 'z': '\u1D22',
  // Uppercase (same small caps for uppercase input)
  'A': '\u1D00', 'B': '\u0299', 'C': '\u1D04', 'D': '\u1D05', 'E': '\u1D07', 'F': '\uA730', 'G': '\u0262', 'H': '\u029C',
  'I': '\u026A', 'J': '\u1D0A', 'K': '\u1D0B', 'L': '\u029F', 'M': '\u1D0D', 'N': '\u0274', 'O': '\u1D0F', 'P': '\u1D18',
  'Q': '\u01EB', 'R': '\u0280', 'S': 's', 'T': '\u1D1B', 'U': '\u1D1C', 'V': '\u1D20', 'W': '\u1D21', 'X': 'x',
  'Y': '\u028F', 'Z': '\u1D22', ' ': ' '
};

// Text transformation functions
const transformers = {
  smallText: (text) => {
    const toSmallCaps = text.split('').map(char => {
      return SMALLCAPS_MAP[char] || SMALLCAPS_MAP[char.toLowerCase()] || char;
    }).join('');

    const toSuperscript = text.split('').map(char => {
      // Preserve case - check original char first, then lowercase
      return SUPERSCRIPT_MAP[char] || SUPERSCRIPT_MAP[char.toLowerCase()] || char;
    }).join('');

    const toSubscript = text.split('').map(char => {
      return SUBSCRIPT_MAP[char] || SUBSCRIPT_MAP[char.toLowerCase()] || char;
    }).join('');

    return [
      { name: 'Small Caps', text: toSmallCaps },
      { name: 'Superscript', text: toSuperscript },
      { name: 'Subscript', text: toSubscript },
    ];
  },

  tiny: (text) => {
    const toSmallCaps = text.split('').map(char => {
      return SMALLCAPS_MAP[char] || SMALLCAPS_MAP[char.toLowerCase()] || char;
    }).join('');

    const toSuperscript = text.split('').map(char => {
      return SUPERSCRIPT_MAP[char] || SUPERSCRIPT_MAP[char.toLowerCase()] || char;
    }).join('');

    const toSubscript = text.split('').map(char => {
      return SUBSCRIPT_MAP[char] || SUBSCRIPT_MAP[char.toLowerCase()] || char;
    }).join('');

    return [
      { name: 'Small Caps', text: toSmallCaps },
      { name: 'Superscript', text: toSuperscript },
      { name: 'Subscript', text: toSubscript },
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
                <p className="text-white text-xl break-all leading-relaxed select-all" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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


