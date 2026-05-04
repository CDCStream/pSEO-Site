'use client';

import { useState, useCallback, useMemo } from 'react';
import { RefreshCw, Eye, EyeOff, RotateCcw } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

const EASY = [
  'Cat', 'Dog', 'Sun', 'Moon', 'Star', 'Tree', 'Book', 'Hat', 'Ball', 'Cake',
  'Apple', 'Milk', 'Nose', 'Foot', 'Bed', 'Car', 'Key', 'Fish', 'Cup', 'Eye',
  'Ear', 'Pizza', 'Egg', 'Bee', 'Pig', 'Cow', 'Bird', 'Fire', 'Rain', 'Snow',
  'Snowman', 'Smile', 'House', 'Door', 'Window', 'Chair', 'Table', 'Spoon', 'Fork', 'Knife',
  'Plate', 'Bowl', 'Lamp', 'Clock', 'Phone', 'Map', 'Bag', 'Hand', 'Heart', 'Smiley',
  'Banana', 'Grapes', 'Carrot', 'Bread', 'Cookie', 'Donut', 'Burger', 'Hot Dog', 'Ice Cream', 'Candy',
  'Lollipop', 'Watermelon', 'Strawberry', 'Lemon', 'Cherry', 'Pear', 'Coconut', 'Pineapple', 'Tomato', 'Potato',
  'Lion', 'Tiger', 'Bear', 'Elephant', 'Monkey', 'Frog', 'Duck', 'Chicken', 'Horse', 'Rabbit',
  'Mouse', 'Snake', 'Turtle', 'Penguin', 'Owl', 'Spider', 'Butterfly', 'Whale', 'Shark', 'Octopus',
  'Sock', 'Shoe', 'Shirt', 'Pants', 'Glove', 'Scarf', 'Hat', 'Belt', 'Bow', 'Tie',
  'Pencil', 'Pen', 'Eraser', 'Ruler', 'Crayon', 'Brush', 'Paint', 'Glue', 'Tape', 'Scissors',
  'Bus', 'Train', 'Plane', 'Boat', 'Bike', 'Truck', 'Rocket', 'Tractor', 'Helicopter', 'Sailboat',
  'Mountain', 'River', 'Beach', 'Island', 'Cloud', 'Rainbow', 'Lightning', 'Wind', 'Volcano', 'Cave',
  'Flower', 'Leaf', 'Grass', 'Rock', 'Mushroom', 'Cactus', 'Bush', 'Pot', 'Sand', 'Shell',
  'Robot', 'Castle', 'Crown', 'Wand', 'Sword', 'Shield', 'Treasure', 'Pirate', 'Ghost', 'Witch',
  'Doctor', 'Nurse', 'Police', 'Fireman', 'Chef', 'Teacher', 'Farmer', 'Astronaut', 'Soldier', 'Clown',
  'Soccer', 'Tennis', 'Golf', 'Skiing', 'Surfing', 'Boxing', 'Bowling', 'Karate', 'Yoga', 'Dance',
  'Drum', 'Guitar', 'Piano', 'Violin', 'Trumpet', 'Microphone', 'Headphones', 'Radio', 'Speaker', 'Bell',
  'Sun Hat', 'Sunglasses', 'Toothbrush', 'Toothpaste', 'Mirror', 'Soap', 'Towel', 'Comb', 'Razor', 'Shampoo',
  'Birthday', 'Party', 'Balloon', 'Gift', 'Candle', 'Cake', 'Hat', 'Streamer', 'Confetti', 'Fireworks',
];

const MEDIUM = [
  'Snowman', 'Vacation', 'Lighthouse', 'Telescope', 'Butterfly', 'Sandwich', 'Magician', 'Basketball', 'Pillow Fight', 'Fire Alarm',
  'Sunburn', 'Sunrise', 'Sunset', 'Skydiving', 'Rollercoaster', 'Treehouse', 'Campfire', 'Marshmallow', 'Bonfire', 'Igloo',
  'Backpack', 'Sleeping Bag', 'Tent', 'Compass', 'Binoculars', 'Map', 'Trail', 'Hiking', 'Fishing Pole', 'Canoe',
  'Astronaut', 'Spaceship', 'Asteroid', 'Comet', 'Galaxy', 'Planet', 'Satellite', 'Moonwalk', 'Black Hole', 'Solar System',
  'Detective', 'Magnifying Glass', 'Footprint', 'Fingerprint', 'Mystery', 'Suspect', 'Witness', 'Evidence', 'Spyglass', 'Trap',
  'Mermaid', 'Unicorn', 'Dragon', 'Wizard', 'Fairy', 'Goblin', 'Vampire', 'Werewolf', 'Centaur', 'Phoenix',
  'Skateboard', 'Scooter', 'Roller Skates', 'Snowboard', 'Surfboard', 'Skis', 'Sled', 'Ice Skates', 'Skateboard Park', 'Bowling Pin',
  'Drawing', 'Painting', 'Sculpture', 'Pottery', 'Origami', 'Knitting', 'Sewing', 'Photography', 'Stitching', 'Coloring Book',
  'Library', 'Museum', 'Stadium', 'Theater', 'Cinema', 'Concert', 'Carnival', 'Circus', 'Zoo', 'Aquarium',
  'Restaurant', 'Bakery', 'Pharmacy', 'Bookstore', 'Hardware Store', 'Grocery Store', 'Pet Store', 'Toy Store', 'Hair Salon', 'Gas Station',
  'Hospital', 'School', 'Post Office', 'Bank', 'Police Station', 'Fire Station', 'Airport', 'Train Station', 'Hotel', 'Office',
  'Bicycle Helmet', 'Knee Pad', 'Elbow Pad', 'Goggles', 'Snorkel', 'Flippers', 'Life Jacket', 'Parachute', 'Hot Air Balloon', 'Submarine',
  'Wedding', 'Funeral', 'Graduation', 'Birthday Party', 'Baby Shower', 'Anniversary', 'Honeymoon', 'Engagement', 'Reunion', 'Promotion',
  'Cooking', 'Baking', 'Grilling', 'Frying', 'Boiling', 'Slicing', 'Stirring', 'Whisking', 'Tasting', 'Recipe',
  'Robot Dance', 'Chicken Dance', 'Moonwalk', 'Tap Dance', 'Ballet', 'Ballroom', 'Salsa', 'Hip Hop', 'Breakdance', 'Tango',
  'Hurricane', 'Tornado', 'Earthquake', 'Tsunami', 'Blizzard', 'Drought', 'Avalanche', 'Flood', 'Wildfire', 'Sandstorm',
  'Mailbox', 'Crosswalk', 'Stop Sign', 'Traffic Light', 'Sidewalk', 'Tunnel', 'Bridge', 'Highway', 'Roundabout', 'Parking Lot',
  'Whisper', 'Shout', 'Laugh', 'Cry', 'Sneeze', 'Cough', 'Yawn', 'Snore', 'Giggle', 'Sigh',
  'Trapeze', 'Tightrope', 'Juggling', 'Acrobat', 'Ringmaster', 'Fortune Teller', 'Magic Show', 'Puppet Show', 'Clown Car', 'Ferris Wheel',
  'Chocolate Bar', 'Birthday Wish', 'Wishing Well', 'Time Capsule', 'Treasure Chest', 'Message in a Bottle', 'Snow Globe', 'Music Box', 'Piggy Bank', 'Photo Album',
];

const HARD = [
  'Electricity', 'Philosophy', 'Infinity', 'Civilization', 'Brainstorm', 'Dehydrate', 'Sophisticated', 'Procrastinate', 'Hypothesis', 'Democracy',
  'Capitalism', 'Communism', 'Economy', 'Inflation', 'Recession', 'Revolution', 'Evolution', 'Atmosphere', 'Photosynthesis', 'Metabolism',
  'Quantum', 'Gravity', 'Friction', 'Magnetism', 'Velocity', 'Acceleration', 'Vibration', 'Frequency', 'Radiation', 'Combustion',
  'Negotiation', 'Persuasion', 'Conversation', 'Disagreement', 'Compromise', 'Apology', 'Forgiveness', 'Reconciliation', 'Misunderstanding', 'Confession',
  'Imagination', 'Inspiration', 'Motivation', 'Determination', 'Frustration', 'Confusion', 'Hesitation', 'Anticipation', 'Concentration', 'Meditation',
  'Sneaky Suspicion', 'Cold Feet', 'Couch Potato', 'Chip on Shoulder', 'Pulling Strings', 'Cutting Corners', 'Bending the Rules', 'Burning the Midnight Oil', 'Spilling the Beans', 'Letting the Cat Out',
  'Time Travel', 'Parallel Universe', 'Wormhole', 'Singularity', 'Holodeck', 'Cybernetics', 'Cryogenics', 'Telepathy', 'Telekinesis', 'Levitation',
  'Stockholm Syndrome', 'Deja Vu', 'Sleep Paralysis', 'Lucid Dreaming', 'Out of Body', 'Mind Palace', 'Phantom Limb', 'Synesthesia', 'Hypnosis', 'Catharsis',
  'Renaissance', 'Enlightenment', 'Industrial Revolution', 'Cold War', 'Great Depression', 'Bronze Age', 'Stone Age', 'Middle Ages', 'Prehistoric', 'Ancient Egypt',
  'Symbiosis', 'Camouflage', 'Hibernation', 'Migration', 'Nocturnal', 'Predator', 'Endangered', 'Extinct', 'Domesticated', 'Carnivore',
  'Constellation', 'Equinox', 'Solstice', 'Eclipse', 'Aurora Borealis', 'Meteor Shower', 'Supernova', 'Nebula', 'Asteroid Belt', 'Lunar Cycle',
  'Hieroglyphics', 'Calligraphy', 'Encryption', 'Algorithm', 'Pixel', 'Bandwidth', 'Firewall', 'Cookie', 'Cloud Storage', 'Virtual Reality',
  'Mortgage', 'Insurance', 'Stock Market', 'Cryptocurrency', 'Bankruptcy', 'Investment', 'Dividend', 'Auction', 'Tax Return', 'Budget',
  'Anesthesia', 'Allergy', 'Antibody', 'Vaccine', 'Surgery', 'Transplant', 'Quarantine', 'Pandemic', 'Symptom', 'Diagnosis',
  'Foreshadowing', 'Metaphor', 'Allegory', 'Plot Twist', 'Cliffhanger', 'Protagonist', 'Antagonist', 'Narrator', 'Soliloquy', 'Climax',
  'Bermuda Triangle', 'Loch Ness Monster', 'Bigfoot', 'Atlantis', 'Stonehenge', 'Easter Island', 'Pyramids', 'Great Wall', 'Eiffel Tower', 'Statue of Liberty',
  'Honeymoon Phase', 'Midlife Crisis', 'Quarter Life Crisis', 'Empty Nest', 'Glass Ceiling', 'Wage Gap', 'Brain Drain', 'Culture Shock', 'Reverse Psychology', 'Peer Pressure',
  'Identity Theft', 'Plagiarism', 'Embezzlement', 'Forgery', 'Conspiracy', 'Whistleblower', 'Loophole', 'Alibi', 'Verdict', 'Acquittal',
  'Origami', 'Embroidery', 'Mosaic', 'Graffiti', 'Tattoo', 'Piercing', 'Manicure', 'Massage', 'Reflexology', 'Acupuncture',
  'Telekinesis', 'Pyrokinesis', 'Invisibility', 'Shape Shifting', 'Mind Control', 'Time Freeze', 'Force Field', 'Cloning', 'Resurrection', 'Immortality',
];

const DIFFICULTY_META = {
  easy: { label: 'Easy', color: 'text-emerald-300', badgeBg: 'bg-emerald-500/20 border-emerald-400/30', list: EASY },
  medium: { label: 'Medium', color: 'text-amber-300', badgeBg: 'bg-amber-500/20 border-amber-400/30', list: MEDIUM },
  hard: { label: 'Hard', color: 'text-rose-300', badgeBg: 'bg-rose-500/20 border-rose-400/30', list: HARD },
};

function getRandomItems(arr, n) {
  if (n >= arr.length) return [...arr].sort(() => Math.random() - 0.5);
  const used = new Set();
  const out = [];
  while (out.length < n) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx)) {
      used.add(idx);
      out.push(arr[idx]);
    }
  }
  return out;
}

export default function PictionaryWordClient() {
  const [difficulty, setDifficulty] = useState('all');
  const [count, setCount] = useState(1);
  const [results, setResults] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const pool = useMemo(() => {
    if (difficulty === 'all') {
      return [
        ...EASY.map((w) => ({ word: w, difficulty: 'easy' })),
        ...MEDIUM.map((w) => ({ word: w, difficulty: 'medium' })),
        ...HARD.map((w) => ({ word: w, difficulty: 'hard' })),
      ];
    }
    return DIFFICULTY_META[difficulty].list.map((w) => ({ word: w, difficulty }));
  }, [difficulty]);

  const generate = useCallback(() => {
    setIsAnimating(true);
    const picks = getRandomItems(pool, Math.min(count, pool.length));
    setTimeout(() => {
      setResults(picks);
      const initialReveal = {};
      picks.forEach((_, i) => {
        initialReveal[i] = false;
      });
      setRevealed(initialReveal);
      setIsAnimating(false);
    }, 300);
  }, [count, pool]);

  const reveal = (idx) => setRevealed((r) => ({ ...r, [idx]: !r[idx] }));
  const revealAll = () => {
    const all = {};
    results.forEach((_, i) => {
      all[i] = true;
    });
    setRevealed(all);
  };
  const reset = () => {
    setResults([]);
    setRevealed({});
  };

  const allRevealed = results.length > 0 && results.every((_, i) => revealed[i]);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      {/* Difficulty pills */}
      <div className="mb-5">
        <div className="text-center text-sm text-gray-400 mb-3">Choose difficulty</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'easy', label: 'Easy' },
            { id: 'medium', label: 'Medium' },
            { id: 'hard', label: 'Hard' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                difficulty === d.id
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 border-transparent text-white shadow-lg'
                  : 'bg-black/30 border-white/10 text-gray-300 hover:bg-black/40 hover:border-white/20'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="flex items-center gap-3">
            <label htmlFor="word-count" className="text-gray-300">Words:</label>
            <input
              id="word-count"
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 1)))}
              className="w-20 px-3 py-2 bg-black/30 rounded-lg border border-white/10 text-white text-center focus:outline-none focus:border-orange-500/50"
            />
          </div>
          <button
            onClick={generate}
            disabled={isAnimating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
            Generate Words
          </button>
          {results.length > 0 && (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-3 bg-black/30 hover:bg-black/40 text-gray-300 rounded-xl border border-white/10 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="min-h-[200px] flex items-center justify-center">
        {results.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg">Click Generate to get a random Pictionary word!</p>
            <p className="text-sm mt-2 text-gray-600">Words start hidden so the host can keep the secret.</p>
          </div>
        ) : (
          <div className="w-full">
            {results.length > 1 && !allRevealed && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={revealAll}
                  className="text-sm text-orange-300 hover:text-orange-200 underline underline-offset-4"
                >
                  Reveal all
                </button>
              </div>
            )}
            <div className={`grid gap-4 w-full ${results.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {results.map((result, index) => {
                const meta = DIFFICULTY_META[result.difficulty];
                const isRevealed = revealed[index];
                return (
                  <div
                    key={`${result.word}-${index}`}
                    className={`bg-black/30 rounded-xl border border-white/10 p-6 text-center transition-all ${
                      isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                    }`}
                  >
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-3 border ${meta.badgeBg} ${meta.color}`}>
                      {meta.label}
                    </div>

                    {isRevealed ? (
                      <div className="mb-3 text-2xl sm:text-3xl font-bold text-white break-words">
                        {result.word}
                      </div>
                    ) : (
                      <button
                        onClick={() => reveal(index)}
                        className="w-full flex flex-col items-center justify-center gap-2 mb-3 py-4 rounded-lg border border-dashed border-white/15 hover:border-white/30 hover:bg-white/5 transition-all text-gray-400 hover:text-gray-200"
                      >
                        <Eye className="w-5 h-5" />
                        <span className="text-sm font-medium">Tap to reveal</span>
                      </button>
                    )}

                    <div className="flex items-center justify-center gap-2">
                      {isRevealed && (
                        <>
                          <button
                            onClick={() => reveal(index)}
                            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 px-2 py-1 rounded"
                            aria-label="Hide word"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            Hide
                          </button>
                          <CopyButton text={result.word} size="sm" />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-center text-gray-500 text-sm">
          {pool.length} {difficulty === 'all' ? 'total' : DIFFICULTY_META[difficulty].label.toLowerCase()} Pictionary words available · {EASY.length} easy · {MEDIUM.length} medium · {HARD.length} hard
        </p>
      </div>
    </div>
  );
}
