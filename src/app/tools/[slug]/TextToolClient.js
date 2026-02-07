'use client';

import { useState, useMemo } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { unicodeMaps, glitchChars } from '@/config/pSEO-data';

// Upside down text mapping
const UPSIDE_DOWN_MAP = {
  'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
  'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
  'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
  'y': 'ʎ', 'z': 'z',
  'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H',
  'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ',
  'Q': 'Q', 'R': 'ɹ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X',
  'Y': '⅄', 'Z': 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
  '8': '8', '9': '6', '.': '˙', ',': "'", "'": ',', '"': ',,', '!': '¡', '?': '¿',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<',
  '_': '‾', ' ': ' '
};

// Italic Unicode mapping (Mathematical Italic)
const ITALIC_MAP = {
  'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩',
  'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱',
  'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹',
  'y': '𝘺', 'z': '𝘻',
  'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏',
  'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗',
  'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟',
  'Y': '𝘠', 'Z': '𝘡', ' ': ' '
};

// Bold Italic Unicode mapping
const BOLD_ITALIC_MAP = {
  'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝',
  'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥',
  'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭',
  'y': '𝙮', 'z': '𝙯',
  'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃',
  'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋',
  'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓',
  'Y': '𝙔', 'Z': '𝙕', ' ': ' '
};

// Weird text mappings (various weird styles)
const WEIRD_MAPS = {
  squares: {
    'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷',
    'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿',
    'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇',
    'y': '🅈', 'z': '🅉', ' ': ' '
  },
  negative: {
    'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷',
    'i': '🅸', 'j': '🅹', 'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿',
    'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃', 'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇',
    'y': '🆈', 'z': '🆉', ' ': ' '
  },
  medieval: {
    'a': 'ค', 'b': '๒', 'c': 'ς', 'd': '๔', 'e': 'є', 'f': 'Ŧ', 'g': 'ﻮ', 'h': 'ђ',
    'i': 'เ', 'j': 'ן', 'k': 'к', 'l': 'ɭ', 'm': '๓', 'n': 'ภ', 'o': '๏', 'p': 'ק',
    'q': 'ợ', 'r': 'г', 's': 'ร', 't': 'Շ', 'u': 'ย', 'v': 'ש', 'w': 'ฬ', 'x': 'א',
    'y': 'ץ', 'z': 'ž', ' ': ' '
  },
  currency: {
    'a': '₳', 'b': '฿', 'c': '₵', 'd': 'Đ', 'e': 'Ɇ', 'f': '₣', 'g': '₲', 'h': 'Ⱨ',
    'i': 'ł', 'j': 'J', 'k': '₭', 'l': 'Ⱡ', 'm': '₥', 'n': '₦', 'o': 'Ø', 'p': '₱',
    'q': 'Q', 'r': 'Ɽ', 's': '₴', 't': '₮', 'u': 'Ʉ', 'v': 'V', 'w': '₩', 'x': 'Ӿ',
    'y': 'Ɏ', 'z': 'Ⱬ', ' ': ' '
  }
};

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

  // Upside down text transformer
  upsideDown: (text) => {
    const flipped = text.split('').map(char => UPSIDE_DOWN_MAP[char] || char).reverse().join('');
    return [
      { name: 'Upside Down', text: flipped },
    ];
  },

  // Zalgo text transformer (more intense version)
  zalgo: (text, intensity = 8) => {
    const { above, below, middle } = glitchChars;

    const getRandomChars = (arr, count) => {
      let result = '';
      for (let i = 0; i < count; i++) {
        result += arr[Math.floor(Math.random() * arr.length)];
      }
      return result;
    };

    const zalgoLight = text.split('').map(char => {
      if (char === ' ') return ' ';
      return char + getRandomChars(above, 2) + getRandomChars(below, 1);
    }).join('');

    const zalgoMedium = text.split('').map(char => {
      if (char === ' ') return ' ';
      return char + getRandomChars(above, 4) + getRandomChars(below, 3) + getRandomChars(middle, 1);
    }).join('');

    const zalgoHeavy = text.split('').map(char => {
      if (char === ' ') return ' ';
      return char + getRandomChars(above, 8) + getRandomChars(below, 6) + getRandomChars(middle, 3);
    }).join('');

    return [
      { name: 'Zalgo Light', text: zalgoLight },
      { name: 'Zalgo Medium', text: zalgoMedium },
      { name: 'Zalgo Heavy', text: zalgoHeavy },
    ];
  },

  // Cursed text (extreme zalgo)
  cursed: (text) => {
    const { above, below, middle } = glitchChars;

    const getRandomChars = (arr, count) => {
      let result = '';
      for (let i = 0; i < count; i++) {
        result += arr[Math.floor(Math.random() * arr.length)];
      }
      return result;
    };

    const cursedText = text.split('').map(char => {
      if (char === ' ') return ' ';
      return char +
        getRandomChars(above, 10 + Math.floor(Math.random() * 5)) +
        getRandomChars(below, 8 + Math.floor(Math.random() * 4)) +
        getRandomChars(middle, 4 + Math.floor(Math.random() * 3));
    }).join('');

    return [
      { name: 'Cursed Text', text: cursedText },
    ];
  },

  // Weird text transformer
  weird: (text) => {
    const lowerText = text.toLowerCase();

    const squares = lowerText.split('').map(char => WEIRD_MAPS.squares[char] || char).join('');
    const negative = lowerText.split('').map(char => WEIRD_MAPS.negative[char] || char).join('');
    const medieval = lowerText.split('').map(char => WEIRD_MAPS.medieval[char] || char).join('');
    const currency = lowerText.split('').map(char => WEIRD_MAPS.currency[char] || char).join('');

    return [
      { name: 'Square Style', text: squares },
      { name: 'Negative Squares', text: negative },
      { name: 'Medieval', text: medieval },
      { name: 'Currency Style', text: currency },
    ];
  },

  // Italic text transformer
  italics: (text) => {
    const italic = text.split('').map(char => ITALIC_MAP[char] || char).join('');
    const boldItalic = text.split('').map(char => BOLD_ITALIC_MAP[char] || char).join('');

    return [
      { name: 'Italic', text: italic },
      { name: 'Bold Italic', text: boldItalic },
    ];
  },

  // Brat text (social media trend - alternating case + special chars)
  brat: (text) => {
    // Brat style: alternating caps, lowercase alternating
    const bratAlternating = text.split('').map((char, i) =>
      i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
    ).join('');

    // Spaced out
    const bratSpaced = text.split('').join(' ');

    // With aesthetic dots
    const bratDots = '·˚ ' + text.toLowerCase() + ' ˚·';

    // Sarcastic
    const bratSarcastic = text.split('').map((char, i) =>
      i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
    ).join('');

    return [
      { name: 'Alternating', text: bratAlternating },
      { name: 'Spaced Out', text: bratSpaced },
      { name: 'Aesthetic', text: bratDots },
      { name: 'Sarcastic', text: bratSarcastic },
    ];
  },

  // Random letter generator - picks ONE random letter from input
  randomLetter: (text) => {
    // Get letters from input (filter only letters)
    const letters = text.replace(/[^a-zA-Z]/g, '').split('');

    if (letters.length === 0) {
      return [{ name: 'Random Letter', text: 'Enter letters to pick from (e.g. abcdefghijklmnopqrstuvwxyz)' }];
    }

    // Pick one random letter
    const randomIndex = Math.floor(Math.random() * letters.length);
    const pickedLetter = letters[randomIndex];

    return [
      { name: '🎲 Random Letter', text: pickedLetter.toUpperCase() },
    ];
  },

  // YouTube Handle Generator
  youtubeHandle: (text) => {
    const name = text.trim() || 'Creator';
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '');
    const words = ['Gaming', 'Plays', 'TV', 'HD', 'Official', 'Clips', 'Studio', 'World', 'Hub', 'Zone'];
    const numbers = ['', '1', '2', '24', '365', '101', ''];

    const handles = [
      `@${cleanName}`,
      `@${cleanName}${words[Math.floor(Math.random() * words.length)]}`,
      `@The${cleanName}`,
      `@${cleanName}${numbers[Math.floor(Math.random() * numbers.length)]}`,
      `@Real${cleanName}`,
      `@${cleanName}Official`,
      `@${cleanName.toLowerCase()}_`,
      `@itsthe${cleanName.toLowerCase()}`,
    ].filter((h, i, arr) => arr.indexOf(h) === i); // Remove duplicates

    return handles.slice(0, 6).map(h => ({ name: 'Handle', text: h }));
  },

  // YouTube Channel Idea Generator
  youtubeIdea: (text) => {
    const niches = ['Gaming', 'Tech', 'Lifestyle', 'Education', 'Finance', 'Fitness', 'Food', 'Travel', 'Art', 'Music'];
    const formats = ['Tutorials', 'Reviews', 'Vlogs', 'Commentary', 'How-to', 'Top 10', 'Reactions', 'Challenges', 'Stories', 'Tips'];
    const angles = ['for Beginners', 'on a Budget', 'in 2025', 'Nobody Talks About', 'Secrets', 'Mistakes', 'Hacks', 'Deep Dives', 'Explained', 'Daily'];

    const ideas = [];
    for (let i = 0; i < 5; i++) {
      const niche = niches[Math.floor(Math.random() * niches.length)];
      const format = formats[Math.floor(Math.random() * formats.length)];
      const angle = angles[Math.floor(Math.random() * angles.length)];
      ideas.push({ name: 'Channel Idea', text: `${niche} ${format} ${angle}` });
    }

    return ideas;
  },

  // YouTube Comment Picker
  commentPicker: (text) => {
    const comments = text.split('\n').filter(c => c.trim().length > 0);

    if (comments.length === 0) {
      return [{ name: 'Instructions', text: 'Paste commenter names (one per line) to pick random winners!' }];
    }

    // Pick up to 3 random winners
    const shuffled = [...comments].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, Math.min(3, comments.length));

    return [
      { name: 'Total Entries', text: `${comments.length} comments entered` },
      ...winners.map((w, i) => ({ name: `🎉 Winner #${i + 1}`, text: w.trim() }))
    ];
  },
};

export default function TextToolClient({ config, slug }) {
  const [inputText, setInputText] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [regenerateKey, setRegenerateKey] = useState(0);

  // useMemo ensures Zalgo/random text is NOT regenerated on every render
  // regenerateKey allows manual regeneration for random generators
  const results = useMemo(() => {
    if (!inputText.trim()) return [];

    const transformerKey = config.transformType;
    const transformer = transformers[transformerKey];

    if (!transformer) return [];

    if (transformerKey === 'glitch') {
      return transformer(inputText, intensity);
    }

    return transformer(inputText);
  }, [inputText, config.transformType, intensity, regenerateKey]);

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

      {/* Quick Presets for Random Letter Generator */}
      {config.transformType === 'randomLetter' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setInputText('abcdefghijklmnopqrstuvwxyz')}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-lg hover:from-orange-400 hover:to-amber-400 transition-all"
            >
              A to Z
            </button>
            <button
              onClick={() => setInputText('aeiou')}
              className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-all"
            >
              Vowels
            </button>
            <button
              onClick={() => setInputText('bcdfghjklmnpqrstvwxyz')}
              className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-all"
            >
              Consonants
            </button>
            {inputText && (
              <button
                onClick={() => setRegenerateKey(k => k + 1)}
                className="px-4 py-2 bg-green-500/20 text-green-400 text-sm rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Pick Again
              </button>
            )}
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
              <div className="p-10 overflow-x-auto min-h-[180px]">
                <p className="text-white text-xl break-all select-all whitespace-pre-wrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '4', wordBreak: 'break-word' }}>
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


