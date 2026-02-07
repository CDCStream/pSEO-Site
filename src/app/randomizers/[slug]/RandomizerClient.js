'use client';

import { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

// Data sets for random generators
const DATA = {
  animals: [
    'Lion', 'Tiger', 'Elephant', 'Giraffe', 'Zebra', 'Penguin', 'Kangaroo', 'Koala',
    'Panda', 'Wolf', 'Fox', 'Bear', 'Eagle', 'Owl', 'Dolphin', 'Whale', 'Shark',
    'Octopus', 'Butterfly', 'Bee', 'Ant', 'Spider', 'Snake', 'Crocodile', 'Turtle',
    'Frog', 'Rabbit', 'Deer', 'Moose', 'Horse', 'Cow', 'Pig', 'Sheep', 'Goat',
    'Chicken', 'Duck', 'Peacock', 'Flamingo', 'Parrot', 'Monkey', 'Gorilla', 'Chimpanzee',
    'Leopard', 'Cheetah', 'Jaguar', 'Hyena', 'Hippopotamus', 'Rhinoceros', 'Camel', 'Llama',
    'Sloth', 'Armadillo', 'Hedgehog', 'Raccoon', 'Skunk', 'Otter', 'Seal', 'Walrus',
    'Polar Bear', 'Red Panda', 'Meerkat', 'Wombat', 'Platypus', 'Tasmanian Devil'
  ],

  pokemon: [
    'Pikachu', 'Charizard', 'Bulbasaur', 'Squirtle', 'Jigglypuff', 'Mewtwo', 'Mew',
    'Eevee', 'Snorlax', 'Gengar', 'Dragonite', 'Gyarados', 'Lapras', 'Articuno',
    'Zapdos', 'Moltres', 'Ditto', 'Vaporeon', 'Jolteon', 'Flareon', 'Espeon', 'Umbreon',
    'Lucario', 'Garchomp', 'Greninja', 'Rayquaza', 'Lugia', 'Ho-Oh', 'Celebi',
    'Blaziken', 'Mudkip', 'Treecko', 'Torchic', 'Gardevoir', 'Salamence', 'Metagross',
    'Latios', 'Latias', 'Groudon', 'Kyogre', 'Dialga', 'Palkia', 'Giratina', 'Arceus',
    'Darkrai', 'Shaymin', 'Victini', 'Reshiram', 'Zekrom', 'Kyurem', 'Genesect',
    'Xerneas', 'Yveltal', 'Zygarde', 'Mimikyu', 'Rowlet', 'Litten', 'Popplio',
    'Sobble', 'Scorbunny', 'Grookey', 'Eternatus', 'Zacian', 'Zamazenta'
  ],

  objects: [
    'Chair', 'Table', 'Lamp', 'Book', 'Phone', 'Computer', 'Television', 'Clock',
    'Mirror', 'Pillow', 'Blanket', 'Cup', 'Plate', 'Fork', 'Knife', 'Spoon',
    'Bottle', 'Bag', 'Wallet', 'Keys', 'Umbrella', 'Glasses', 'Watch', 'Ring',
    'Necklace', 'Hat', 'Scarf', 'Gloves', 'Shoes', 'Socks', 'Belt', 'Backpack',
    'Camera', 'Headphones', 'Speaker', 'Keyboard', 'Mouse', 'Pencil', 'Pen', 'Eraser',
    'Notebook', 'Stapler', 'Scissors', 'Tape', 'Ruler', 'Calculator', 'Globe', 'Map',
    'Candle', 'Vase', 'Picture Frame', 'Rug', 'Curtain', 'Toothbrush', 'Soap', 'Towel',
    'Bicycle', 'Skateboard', 'Ball', 'Kite', 'Puzzle', 'Board Game', 'Cards', 'Dice'
  ],

  nflTeams: [
    'Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens', 'Buffalo Bills',
    'Carolina Panthers', 'Chicago Bears', 'Cincinnati Bengals', 'Cleveland Browns',
    'Dallas Cowboys', 'Denver Broncos', 'Detroit Lions', 'Green Bay Packers',
    'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Kansas City Chiefs',
    'Las Vegas Raiders', 'Los Angeles Chargers', 'Los Angeles Rams', 'Miami Dolphins',
    'Minnesota Vikings', 'New England Patriots', 'New Orleans Saints', 'New York Giants',
    'New York Jets', 'Philadelphia Eagles', 'Pittsburgh Steelers', 'San Francisco 49ers',
    'Seattle Seahawks', 'Tampa Bay Buccaneers', 'Tennessee Titans', 'Washington Commanders'
  ],

  questions: [
    'What is your biggest dream?', 'If you could travel anywhere, where would you go?',
    'What makes you happiest?', 'What is your favorite childhood memory?',
    'If you could have any superpower, what would it be?', 'What are you most grateful for?',
    'What would you do if you won the lottery?', 'What is your biggest fear?',
    'If you could meet anyone in history, who would it be?', 'What is your life motto?',
    'What skill would you most like to learn?', 'What is your favorite book or movie?',
    'If you could change one thing about the world, what would it be?',
    'What is the best advice you ever received?', 'What makes a good friend?',
    'If you could live in any era, when would it be?', 'What is your hidden talent?',
    'What do you value most in life?', 'If you could master any instrument, which one?',
    'What is your idea of a perfect day?', 'What inspires you the most?',
    'If you could only eat one food forever, what would it be?',
    'What is something you have always wanted to try?', 'Who is your role model?',
    'What is your favorite way to relax?', 'If you could be any animal, what would you be?',
    'What is the most important lesson you have learned?', 'What makes you unique?',
    'If you could solve one world problem, which one?', 'What do you want to be remembered for?'
  ],

  emojis: [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰',
    '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗',
    '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌',
    '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵',
    '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲',
    '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓',
    '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹',
    '👺', '👻', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'
  ]
};

// Get random item(s) from array
const getRandomItems = (arr, count = 1) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function RandomizerClient({ config, slug }) {
  const [count, setCount] = useState(1);
  const [results, setResults] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const getDataSet = useCallback(() => {
    switch (config.generatorType) {
      case 'animal': return DATA.animals;
      case 'pokemon': return DATA.pokemon;
      case 'object': return DATA.objects;
      case 'nflTeam': return DATA.nflTeams;
      case 'question': return DATA.questions;
      case 'emoji': return DATA.emojis;
      default: return DATA.animals;
    }
  }, [config.generatorType]);

  const generate = useCallback(() => {
    setIsAnimating(true);
    const data = getDataSet();
    const newResults = getRandomItems(data, Math.min(count, data.length));
    
    // Brief animation delay
    setTimeout(() => {
      setResults(newResults);
      setIsAnimating(false);
    }, 300);
  }, [count, getDataSet]);

  const isEmoji = config.generatorType === 'emoji';

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      {/* Controls */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
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
          <button
            onClick={generate}
            disabled={isAnimating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
            Generate
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="min-h-[200px] flex items-center justify-center">
        {results.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg">Click Generate to get started!</p>
          </div>
        ) : (
          <div className={`grid gap-4 w-full ${results.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {results.map((result, index) => (
              <div
                key={index}
                className={`bg-black/30 rounded-xl border border-white/10 p-6 text-center transition-all ${
                  isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className={`mb-3 ${isEmoji ? 'text-6xl' : 'text-2xl font-bold text-white'}`}>
                  {result}
                </div>
                <div className="flex justify-center">
                  <CopyButton text={result} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fun Stats */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-center text-gray-500 text-sm">
          {getDataSet().length} options available • Truly random selection
        </p>
      </div>
    </div>
  );
}

