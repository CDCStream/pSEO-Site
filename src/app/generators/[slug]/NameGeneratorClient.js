'use client';

import { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

// Name data sets for generators
const NAME_DATA = {
  japanese: {
    firstNames: {
      male: ['Haruto', 'Yuto', 'Sota', 'Yuki', 'Hayato', 'Haruki', 'Ryusei', 'Kota', 'Sosuke', 'Ren', 'Kaito', 'Asahi', 'Minato', 'Riku', 'Hiroto', 'Takumi', 'Sora', 'Yuma', 'Aoi', 'Hinata'],
      female: ['Yui', 'Hana', 'Mei', 'Rin', 'Sakura', 'Aoi', 'Koharu', 'Himari', 'Akari', 'Yuna', 'Mio', 'Saki', 'Emi', 'Ayaka', 'Misaki', 'Nana', 'Yuki', 'Miku', 'Riko', 'Nanami'],
      unisex: ['Hikaru', 'Akira', 'Sora', 'Haruka', 'Nao', 'Makoto', 'Ren', 'Kaoru', 'Shinobu', 'Tsubasa']
    },
    lastNames: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu', 'Yamazaki']
  },

  elf: {
    prefixes: ['Ael', 'Aer', 'Ar', 'Cal', 'Cel', 'El', 'Fae', 'Gal', 'Gil', 'Ith', 'Leg', 'Lir', 'Mel', 'Mir', 'Nim', 'Sil', 'Tar', 'Thal', 'Val', 'Zeph'],
    suffixes: ['anor', 'arion', 'dil', 'dor', 'iel', 'ion', 'las', 'orn', 'ras', 'riel', 'rin', 'wen', 'wynn', 'dal', 'mir', 'nor', 'oth', 'ros', 'thil', 'wyn'],
    titles: ['of the Silver Wood', 'Starweaver', 'Moonwhisper', 'Lightbringer', 'Shadowdancer', 'Leafsong', 'Dawnchaser', 'Nightbloom', 'Stormcaller', 'Frostweaver']
  },

  gamertag: {
    adjectives: ['Epic', 'Shadow', 'Dark', 'Swift', 'Cyber', 'Neon', 'Toxic', 'Chaos', 'Alpha', 'Omega', 'Stealth', 'Blazing', 'Frozen', 'Thunder', 'Savage', 'Silent', 'Royal', 'Mystic', 'Crimson', 'Golden'],
    nouns: ['Wolf', 'Dragon', 'Phoenix', 'Ninja', 'Knight', 'Warrior', 'Hunter', 'Sniper', 'Ghost', 'Reaper', 'Titan', 'Viper', 'Hawk', 'Storm', 'Blade', 'Fury', 'Legend', 'Champion', 'Demon', 'Angel'],
    numbers: ['007', '101', '360', '420', '69', '99', '13', '666', '777', '88', 'X', 'XX', 'XXX', '_', '-', '.']
  },

  ship: {
    patterns: [
      (name1, name2) => name1.slice(0, Math.ceil(name1.length / 2)) + name2.slice(Math.floor(name2.length / 2)),
      (name1, name2) => name1.slice(0, 3) + name2.slice(-3),
      (name1, name2) => name2.slice(0, Math.ceil(name2.length / 2)) + name1.slice(Math.floor(name1.length / 2)),
      (name1, name2) => name1.charAt(0).toUpperCase() + name2.toLowerCase(),
      (name1, name2) => name1.slice(0, 2) + name2.slice(1, 3) + name1.slice(-2)
    ]
  },

  podcast: {
    formats: [
      'The {adj} {noun} Show',
      '{adj} {noun} Podcast',
      'The {noun} Hour',
      '{noun} Talk',
      'The {adj} {noun}',
      '{noun} Unplugged',
      'Beyond the {noun}',
      '{noun} Stories',
      'The {adj} Life',
      '{noun} Chronicles'
    ],
    adjectives: ['Weekly', 'Daily', 'Honest', 'Creative', 'Digital', 'Modern', 'Classic', 'Casual', 'Deep', 'Real', 'True', 'Wild', 'Late Night', 'Early Morning', 'Underground'],
    nouns: ['Mind', 'Talk', 'Life', 'Story', 'Truth', 'Voice', 'Wave', 'Pulse', 'Vibe', 'Chat', 'Hour', 'Zone', 'Corner', 'Studio', 'Room']
  },

  band: {
    patterns: [
      'The {adj} {noun}s',
      '{noun} {noun}',
      '{adj} {noun}',
      'The {noun}',
      '{noun} of {noun}',
      '{adj} {adj} {noun}',
      '{noun} & The {noun}s'
    ],
    adjectives: ['Black', 'Red', 'Blue', 'Electric', 'Atomic', 'Cosmic', 'Neon', 'Velvet', 'Crystal', 'Iron', 'Silver', 'Golden', 'Midnight', 'Silent', 'Screaming'],
    nouns: ['Rose', 'Wolf', 'Moon', 'Sun', 'Star', 'Fire', 'Ice', 'Thunder', 'Dream', 'Shadow', 'Light', 'Storm', 'Heart', 'Soul', 'Mind', 'Kings', 'Queens', 'Knights']
  },

  anime: {
    firstNames: ['Yuki', 'Sakura', 'Akira', 'Rin', 'Kira', 'Haru', 'Sora', 'Kai', 'Ryu', 'Mika', 'Hiro', 'Yui', 'Ren', 'Mei', 'Shin', 'Aoi', 'Nao', 'Taro', 'Kenji', 'Mio'],
    lastNames: ['Yamamoto', 'Nakamura', 'Takahashi', 'Watanabe', 'Tanaka', 'Suzuki', 'Ito', 'Sato', 'Kobayashi', 'Kato', 'Fujimoto', 'Matsuda', 'Hayashi', 'Mori', 'Ishida'],
    titles: ['-kun', '-chan', '-san', '-sama', '-sensei', '-senpai', '']
  },

  couple: {
    patterns: [
      '{name1} + {name2}',
      '{name1} & {name2}',
      '{name1} ❤️ {name2}',
      '{name1} x {name2}',
      '{first1}{first2}',
      'Team {combined}'
    ]
  },

  roblox: {
    prefixes: ['ii', 'xx', 'Xx', 'xX', 'oO', '0o', 'lI', 'Il'],
    words: ['Pro', 'Noob', 'Epic', 'Cool', 'Super', 'Mega', 'Ultra', 'Gamer', 'Player', 'Master', 'King', 'Queen', 'Lord', 'Boss', 'Chief', 'Legend', 'Hero', 'Ninja', 'Dragon', 'Wolf'],
    suffixes: ['YT', 'TV', 'HD', '2024', '2025', '123', '007', '_', 'ii', 'xx', 'xX', 'Xx'],
    numbers: ['1', '2', '3', '7', '9', '11', '12', '13', '21', '69', '99', '100', '123', '420', '666', '777', '999']
  },

  gaming: {
    prefixes: ['Dark', 'Shadow', 'Night', 'Storm', 'Fire', 'Ice', 'Thunder', 'Cyber', 'Neo', 'Omega', 'Alpha', 'Elite', 'Pro', 'Lethal', 'Toxic'],
    cores: ['Wolf', 'Dragon', 'Phoenix', 'Knight', 'Reaper', 'Hunter', 'Slayer', 'Sniper', 'Ghost', 'Ninja', 'Demon', 'Titan', 'Viper', 'Falcon', 'Raven'],
    suffixes: ['X', 'Gaming', 'YT', 'TTV', 'HD', '69', '420', 'Pro', 'Elite', 'Boss', 'King', 'God', 'Lord', 'Master', 'Legend']
  },

  youtube: {
    patterns: [
      '{adj}{noun}',
      '{noun}With{name}',
      'The{adj}{noun}',
      '{name}Plays',
      '{name}Gaming',
      '{adj}{name}',
      '{noun}Nation',
      '{adj}Vibes',
      '{noun}Hub',
      '{name}Official'
    ],
    adjectives: ['Cool', 'Epic', 'Amazing', 'Super', 'Ultra', 'Mega', 'Awesome', 'Great', 'Best', 'Top', 'Real', 'True', 'Daily', 'Weekly', 'Creative'],
    nouns: ['Gamer', 'Player', 'Content', 'Creator', 'Show', 'Channel', 'TV', 'Media', 'Studio', 'Productions', 'Entertainment', 'Life', 'World', 'Zone', 'Hub'],
    names: ['Alex', 'Max', 'Sam', 'Jordan', 'Taylor', 'Chris', 'Jamie', 'Casey', 'Morgan', 'Riley']
  }
};

// Generator functions
const generators = {
  japanese: (gender = 'random') => {
    const data = NAME_DATA.japanese;
    let firstName;
    if (gender === 'male') {
      firstName = data.firstNames.male[Math.floor(Math.random() * data.firstNames.male.length)];
    } else if (gender === 'female') {
      firstName = data.firstNames.female[Math.floor(Math.random() * data.firstNames.female.length)];
    } else {
      const allFirst = [...data.firstNames.male, ...data.firstNames.female, ...data.firstNames.unisex];
      firstName = allFirst[Math.floor(Math.random() * allFirst.length)];
    }
    const lastName = data.lastNames[Math.floor(Math.random() * data.lastNames.length)];
    return `${lastName} ${firstName}`;
  },

  elf: () => {
    const data = NAME_DATA.elf;
    const prefix = data.prefixes[Math.floor(Math.random() * data.prefixes.length)];
    const suffix = data.suffixes[Math.floor(Math.random() * data.suffixes.length)];
    const hasTitle = Math.random() > 0.5;
    const title = hasTitle ? ' ' + data.titles[Math.floor(Math.random() * data.titles.length)] : '';
    return prefix + suffix + title;
  },

  gamertag: () => {
    const data = NAME_DATA.gamertag;
    const patterns = [
      () => data.adjectives[Math.floor(Math.random() * data.adjectives.length)] + data.nouns[Math.floor(Math.random() * data.nouns.length)],
      () => data.nouns[Math.floor(Math.random() * data.nouns.length)] + data.numbers[Math.floor(Math.random() * data.numbers.length)],
      () => data.adjectives[Math.floor(Math.random() * data.adjectives.length)] + data.nouns[Math.floor(Math.random() * data.nouns.length)] + data.numbers[Math.floor(Math.random() * data.numbers.length)],
      () => 'x' + data.nouns[Math.floor(Math.random() * data.nouns.length)] + 'x',
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
  },

  ship: (name1 = 'Romeo', name2 = 'Juliet') => {
    const patterns = NAME_DATA.ship.patterns;
    return patterns.map(p => p(name1, name2));
  },

  podcast: () => {
    const data = NAME_DATA.podcast;
    const format = data.formats[Math.floor(Math.random() * data.formats.length)];
    const adj = data.adjectives[Math.floor(Math.random() * data.adjectives.length)];
    const noun = data.nouns[Math.floor(Math.random() * data.nouns.length)];
    return format.replace('{adj}', adj).replace('{noun}', noun);
  },

  band: () => {
    const data = NAME_DATA.band;
    const pattern = data.patterns[Math.floor(Math.random() * data.patterns.length)];
    let name = pattern;
    while (name.includes('{adj}')) {
      name = name.replace('{adj}', data.adjectives[Math.floor(Math.random() * data.adjectives.length)]);
    }
    while (name.includes('{noun}')) {
      name = name.replace('{noun}', data.nouns[Math.floor(Math.random() * data.nouns.length)]);
    }
    return name;
  },

  anime: () => {
    const data = NAME_DATA.anime;
    const firstName = data.firstNames[Math.floor(Math.random() * data.firstNames.length)];
    const lastName = data.lastNames[Math.floor(Math.random() * data.lastNames.length)];
    const title = data.titles[Math.floor(Math.random() * data.titles.length)];
    return `${lastName} ${firstName}${title}`;
  },

  couple: (name1 = 'Alex', name2 = 'Sam') => {
    const first1 = name1.slice(0, Math.ceil(name1.length / 2));
    const first2 = name2.slice(Math.floor(name2.length / 2));
    const combined = first1 + first2;
    return [
      `${name1} + ${name2}`,
      `${name1} & ${name2}`,
      `${name1} ❤️ ${name2}`,
      `${name1} x ${name2}`,
      combined,
      `Team ${combined}`
    ];
  },

  roblox: () => {
    const data = NAME_DATA.roblox;
    const patterns = [
      () => data.prefixes[Math.floor(Math.random() * data.prefixes.length)] + data.words[Math.floor(Math.random() * data.words.length)] + data.prefixes[Math.floor(Math.random() * data.prefixes.length)],
      () => data.words[Math.floor(Math.random() * data.words.length)] + data.words[Math.floor(Math.random() * data.words.length)] + data.numbers[Math.floor(Math.random() * data.numbers.length)],
      () => data.words[Math.floor(Math.random() * data.words.length)] + '_' + data.words[Math.floor(Math.random() * data.words.length)],
      () => data.prefixes[Math.floor(Math.random() * data.prefixes.length)] + data.words[Math.floor(Math.random() * data.words.length)] + data.suffixes[Math.floor(Math.random() * data.suffixes.length)],
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
  },

  gaming: () => {
    const data = NAME_DATA.gaming;
    const patterns = [
      () => data.prefixes[Math.floor(Math.random() * data.prefixes.length)] + data.cores[Math.floor(Math.random() * data.cores.length)],
      () => data.cores[Math.floor(Math.random() * data.cores.length)] + data.suffixes[Math.floor(Math.random() * data.suffixes.length)],
      () => data.prefixes[Math.floor(Math.random() * data.prefixes.length)] + data.cores[Math.floor(Math.random() * data.cores.length)] + data.suffixes[Math.floor(Math.random() * data.suffixes.length)],
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
  },

  youtube: () => {
    const data = NAME_DATA.youtube;
    const pattern = data.patterns[Math.floor(Math.random() * data.patterns.length)];
    return pattern
      .replace('{adj}', data.adjectives[Math.floor(Math.random() * data.adjectives.length)])
      .replace('{noun}', data.nouns[Math.floor(Math.random() * data.nouns.length)])
      .replace('{name}', data.names[Math.floor(Math.random() * data.names.length)]);
  },

  aesthetic: () => {
    const aestheticWords = ['dreamy', 'ethereal', 'pastel', 'soft', 'velvet', 'moon', 'star', 'cloud', 'honey', 'sugar', 'cherry', 'strawberry', 'peach', 'lavender', 'rose'];
    const emojis = ['✨', '🌙', '☁️', '🍯', '🍒', '🍓', '🌸', '💫', '⭐', '🦋'];
    const word1 = aestheticWords[Math.floor(Math.random() * aestheticWords.length)];
    const word2 = aestheticWords[Math.floor(Math.random() * aestheticWords.length)];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    return `${emoji} ${word1}${word2} ${emoji}`;
  }
};

export default function NameGeneratorClient({ config, slug }) {
  const [count, setCount] = useState(5);
  const [results, setResults] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [gender, setGender] = useState('random');

  const isShipOrCouple = config.generatorType === 'ship' || config.generatorType === 'couple';
  const isJapanese = config.generatorType === 'japanese';

  const generate = useCallback(() => {
    setIsAnimating(true);
    const generator = generators[config.generatorType] || generators.gamertag;

    let newResults;
    if (isShipOrCouple) {
      const name1 = input1.trim() || 'Romeo';
      const name2 = input2.trim() || 'Juliet';
      newResults = generator(name1, name2);
    } else if (isJapanese) {
      newResults = Array(count).fill(0).map(() => generator(gender));
    } else {
      newResults = Array(count).fill(0).map(() => generator());
    }

    setTimeout(() => {
      setResults(Array.isArray(newResults) ? newResults : [newResults]);
      setIsAnimating(false);
    }, 300);
  }, [count, config.generatorType, input1, input2, isShipOrCouple, isJapanese, gender]);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Ship/Couple Name Inputs */}
        {isShipOrCouple && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">First Name</label>
              <input
                type="text"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Romeo"
                className="w-full px-4 py-2 bg-black/30 rounded-lg border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Second Name</label>
              <input
                type="text"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Juliet"
                className="w-full px-4 py-2 bg-black/30 rounded-lg border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>
        )}

        {/* Japanese Gender Select */}
        {isJapanese && (
          <div className="flex justify-center gap-4">
            <label className="text-gray-300">Gender:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="px-3 py-2 bg-black/30 rounded-lg border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
            >
              <option value="random">Random</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        )}

        {/* Count and Generate */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {!isShipOrCouple && (
            <div className="flex items-center gap-3">
              <label className="text-gray-300">Count:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-2 bg-black/30 rounded-lg border border-white/10 text-white text-center focus:outline-none focus:border-orange-500/50"
              />
            </div>
          )}
          <button
            onClick={generate}
            disabled={isAnimating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
            Generate Names
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="min-h-[200px]">
        {results.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            <p className="text-lg">Click Generate to create names!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between bg-black/30 rounded-xl border border-white/10 p-4 transition-all ${
                  isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <span className="text-xl text-white font-medium">{result}</span>
                <CopyButton text={result} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

