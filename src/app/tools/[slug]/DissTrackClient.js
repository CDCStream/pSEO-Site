'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, Music } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

// Diss track components
const DISS_DATA = {
  openers: [
    "Listen up, {name}, let me set the record straight",
    "Yo {name}, you thought you could hide from fate",
    "Hey {name}, sit down, let me educate",
    "{name} talking big but can't relate",
    "They call you {name}? More like {name} the fake",
    "Ayo {name}, your whole career's a mistake",
    "{name} in the building? Nah, {name}'s too late",
  ],
  roasts: [
    "Your flow's so weak, it needs a crutch",
    "You talk too much but say nothin' clutch",
    "Your style's outdated like a flip phone touch",
    "You're a one-hit wonder, that's not much",
    "Your bars are softer than a pillow fluff",
    "You think you're tough but you're just a bluff",
    "Your rhymes are dry like a desert's dust",
    "You came to battle but forgot to adjust",
    "Your career's a joke, the punchline's rough",
    "You're fading fast like a sunset's blush",
  ],
  middles: [
    "I came to win, you came to lose",
    "Every track I drop is front page news",
    "While you're confused, I'm paying dues",
    "Step in my lane, you'll sing the blues",
    "I got the juice, you got excuses",
    "My flow's exclusive, yours is useless",
    "I'm making moves while you're making truces",
  ],
  closers: [
    "So take a seat, class dismissed",
    "Remember this when you reminisce",
    "You've been served, you can't resist",
    "{name}'s done, crossed off my list",
    "That's a wrap, you won't be missed",
    "Consider this your final twist",
    "Game over {name}, I don't miss",
  ],
  adlibs: ['(uh!)', '(yeah!)', '(let\'s go!)', '(woo!)', '(skrrt!)', '(ayy!)', '(fire!)', '(boom!)', '(facts!)', '(period!)'],
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function DissTrackClient({ config, slug }) {
  const [targetName, setTargetName] = useState('');
  const [topic, setTopic] = useState('general');
  const [intensity, setIntensity] = useState('medium');
  const [lyrics, setLyrics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDissTrack = useCallback(() => {
    const name = targetName.trim() || 'Hater';
    setIsGenerating(true);

    setTimeout(() => {
      // Build the diss track
      let verses = [];

      // Verse 1
      verses.push(`[Verse 1]`);
      verses.push(getRandom(DISS_DATA.openers).replace(/{name}/g, name) + ' ' + getRandom(DISS_DATA.adlibs));
      verses.push(getRandom(DISS_DATA.roasts));
      verses.push(getRandom(DISS_DATA.middles) + ' ' + getRandom(DISS_DATA.adlibs));
      verses.push(getRandom(DISS_DATA.roasts));

      // Hook
      verses.push('');
      verses.push(`[Hook]`);
      verses.push(`${name}, ${name}, where you at? ${getRandom(DISS_DATA.adlibs)}`);
      verses.push(`${name}, ${name}, you can't match that`);
      verses.push(`${name}, ${name}, that's a fact ${getRandom(DISS_DATA.adlibs)}`);
      verses.push(`${name}, ${name}, no coming back`);

      // Verse 2
      verses.push('');
      verses.push(`[Verse 2]`);
      verses.push(getRandom(DISS_DATA.middles) + ' ' + getRandom(DISS_DATA.adlibs));
      verses.push(getRandom(DISS_DATA.roasts));
      verses.push(getRandom(DISS_DATA.roasts) + ' ' + getRandom(DISS_DATA.adlibs));
      verses.push(getRandom(DISS_DATA.closers).replace(/{name}/g, name));

      // Outro
      verses.push('');
      verses.push(`[Outro]`);
      verses.push(getRandom(DISS_DATA.closers).replace(/{name}/g, name) + ' ' + getRandom(DISS_DATA.adlibs));

      setLyrics(verses.join('\n'));
      setIsGenerating(false);
    }, 800);
  }, [targetName]);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            🎯 Target Name (who's getting dissed?)
          </label>
          <input
            type="text"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            placeholder="Enter a name..."
            className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            🔥 Intensity Level
          </label>
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
          >
            <option value="mild">Mild Roast 😏</option>
            <option value="medium">Medium Heat 🔥</option>
            <option value="savage">Savage Mode 💀</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={generateDissTrack}
          disabled={isGenerating}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-lg"
        >
          {isGenerating ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <Music className="w-6 h-6" />
          )}
          Generate Diss Track 🎤
        </button>
      </div>

      {/* Output Section */}
      {lyrics && (
        <div className="bg-black/40 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🎵 Your Diss Track
            </h3>
            <CopyButton text={lyrics} />
          </div>
          <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {lyrics}
          </pre>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-gray-500 text-xs mt-6">
        ⚠️ For entertainment purposes only. Keep it fun, not hurtful!
      </p>
    </div>
  );
}

