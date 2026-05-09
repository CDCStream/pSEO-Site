'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Search,
  X,
  ArrowRightLeft,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Heart,
} from 'lucide-react';
import {
  palworldPals,
  palworldElements,
  palworldRarities,
  palworldPalsBySlug,
  palImage,
} from '@/data/palworld-pals';
import { getChild, searchPals } from '@/lib/palworld-breeding';

const STORAGE_KEY = 'palworld-breeding-calculator:v1';

const RARITY_COLORS = {
  Common: { ring: 'ring-zinc-400/40', text: 'text-zinc-300' },
  Rare: { ring: 'ring-blue-400/50', text: 'text-blue-300' },
  Epic: { ring: 'ring-purple-400/60', text: 'text-purple-300' },
  Legendary: { ring: 'ring-amber-400/70', text: 'text-amber-300' },
};

function ElementBadge({ element }) {
  const meta = palworldElements.find((e) => e.id === element);
  if (!meta) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${meta.tone}`}>
      {meta.label}
    </span>
  );
}

function PalAvatar({ pal, size = 96, className = '' }) {
  const ring = pal ? RARITY_COLORS[pal.rarity]?.ring || 'ring-zinc-400/40' : 'ring-zinc-700';
  return (
    <div
      className={`relative rounded-full overflow-hidden ring-2 ${ring} bg-zinc-900/60 ${className}`}
      style={{ width: size, height: size }}
    >
      {pal ? (
        <Image
          src={palImage(pal.slug)}
          alt={`${pal.name} Palworld portrait`}
          width={size}
          height={size}
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
          <Plus className="w-8 h-8" />
        </div>
      )}
    </div>
  );
}

function PalSlot({ pal, label, onClick, onClear, large = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center gap-3 p-4 rounded-2xl border-2 ${
        pal
          ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
          : 'border-dashed border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-600'
      } transition-all w-full max-w-[220px]`}
    >
      <span className="text-xs uppercase tracking-widest text-zinc-500">{label}</span>
      <PalAvatar pal={pal} size={large ? 120 : 96} />
      {pal ? (
        <>
          <div className="text-center">
            <div className="text-base font-semibold text-white">{pal.name}</div>
            <div className={`text-xs ${RARITY_COLORS[pal.rarity]?.text || 'text-zinc-300'}`}>
              {pal.rarity} · Power {pal.breedPower}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {pal.elements.map((e) => (
              <ElementBadge key={e} element={e} />
            ))}
          </div>
          {onClear ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(ev) => {
                ev.stopPropagation();
                onClear();
              }}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.stopPropagation();
                  onClear();
                }
              }}
              className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Clear
            </span>
          ) : null}
        </>
      ) : (
        <span className="text-sm text-zinc-500 group-hover:text-zinc-300">Pick a Pal</span>
      )}
    </button>
  );
}

function PickerModal({ open, onClose, onPick, title }) {
  const [query, setQuery] = useState('');
  const [activeElements, setActiveElements] = useState([]);
  const [activeRarities, setActiveRarities] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveElements([]);
      setActiveRarities([]);
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const matches = useMemo(() => {
    return searchPals(query, { elements: activeElements, rarities: activeRarities });
  }, [query, activeElements, activeRarities]);

  const toggleElement = (id) => {
    setActiveElements((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  };
  const toggleRarity = (id) => {
    setActiveRarities((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] bg-zinc-950 border border-white/10 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">{title || 'Pick a Pal'}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
            aria-label="Close picker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, slug or element..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {palworldElements.map((el) => (
              <button
                key={el.id}
                type="button"
                onClick={() => toggleElement(el.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  activeElements.includes(el.id)
                    ? el.tone
                    : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                {el.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {palworldRarities.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleRarity(r.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  activeRarities.includes(r.id)
                    ? `${r.tone} border-white/20 bg-white/5`
                    : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                {r.id}
              </button>
            ))}
          </div>
          <div className="text-xs text-zinc-500">
            {matches.length} of {palworldPals.length} Pals
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {matches.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p className="mb-1">No Pals match these filters.</p>
              <p className="text-xs">Try clearing the search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {matches.map((pal) => (
                <button
                  key={pal.slug}
                  type="button"
                  onClick={() => onPick(pal)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-left"
                >
                  <PalAvatar pal={pal} size={72} />
                  <div className="w-full text-center">
                    <div className="text-sm font-semibold text-white truncate" title={pal.name}>
                      {pal.name}
                    </div>
                    <div className={`text-[11px] ${RARITY_COLORS[pal.rarity]?.text || 'text-zinc-300'}`}>
                      {pal.rarity} · {pal.breedPower}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {pal.elements.map((e) => (
                      <ElementBadge key={e} element={e} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChildResult({ result, onPickChildAsParent }) {
  const [showMath, setShowMath] = useState(false);
  if (!result || !result.child) return null;
  const { child, reason, avg, distance, parents } = result;
  const [pa, pb] = parents || [];

  const reasonBadge =
    reason === 'special-combo'
      ? { text: 'Special Combo', tone: 'bg-amber-500/15 text-amber-300 border-amber-500/40' }
      : reason === 'same-species'
      ? { text: 'Same Species', tone: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' }
      : { text: 'Power Match', tone: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' };

  return (
    <div className="rounded-2xl bg-zinc-950 border border-emerald-500/20 p-5 sm:p-6 shadow-2xl shadow-emerald-500/5">
      <div className="flex items-start gap-4 sm:gap-6 flex-col sm:flex-row sm:items-center">
        <PalAvatar pal={child} size={140} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="text-xs uppercase tracking-widest text-zinc-500">Offspring</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">{child.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded border ${reasonBadge.tone}`}>
              {reasonBadge.text}
            </span>
            <span className={`text-xs px-2 py-1 rounded border border-white/10 bg-white/5 ${RARITY_COLORS[child.rarity]?.text || 'text-zinc-300'}`}>
              {child.rarity}
            </span>
            {child.elements.map((e) => (
              <ElementBadge key={e} element={e} />
            ))}
          </div>
          <div className="text-sm text-zinc-400 mt-3">
            Breeding Power <span className="text-white font-mono">{child.breedPower}</span>
            {reason === 'closest-power' && distance !== undefined ? (
              <>
                {' '}· Distance from average <span className="text-white font-mono">{distance}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowMath((s) => !s)}
        className="mt-5 inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200"
      >
        {showMath ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {showMath ? 'Hide the math' : 'Why this child?'}
      </button>

      {showMath ? (
        <div className="mt-4 rounded-xl bg-black/30 border border-white/10 p-4 font-mono text-sm text-zinc-300 space-y-1">
          {reason === 'same-species' ? (
            <>
              <div>Same-species rule: {pa.name} + {pa.name} always breeds itself.</div>
              <div>Output: {child.name}.</div>
            </>
          ) : reason === 'special-combo' ? (
            <>
              <div>Special combo override matched.</div>
              <div>{pa.name} (power {pa.breedPower}) + {pb.name} (power {pb.breedPower})</div>
              <div>= avg = floor((({pa.breedPower}) + ({pb.breedPower}) + 1) / 2) = {avg}</div>
              <div>Game uses the hardcoded combo instead, returning {child.name}.</div>
            </>
          ) : (
            <>
              <div>{pa.name} power = {pa.breedPower}</div>
              <div>{pb.name} power = {pb.breedPower}</div>
              <div>avg = floor(({pa.breedPower} + {pb.breedPower} + 1) / 2) = {avg}</div>
              <div>Closest BreedingPower: {child.name} (power {child.breedPower}, |diff| = {distance})</div>
              <div>Tie-break: alphabetical by name.</div>
            </>
          )}
        </div>
      ) : null}

      {onPickChildAsParent ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onPickChildAsParent('a')}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            Use as Parent A
          </button>
          <button
            type="button"
            onClick={() => onPickChildAsParent('b')}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            Use as Parent B
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function PalworldBreedingClient() {
  const [parentA, setParentA] = useState(null);
  const [parentB, setParentB] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(null); // 'a' | 'b' | null
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.a && palworldPalsBySlug[parsed.a]) setParentA(palworldPalsBySlug[parsed.a]);
        if (parsed.b && palworldPalsBySlug[parsed.b]) setParentB(palworldPalsBySlug[parsed.b]);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ a: parentA?.slug || null, b: parentB?.slug || null })
      );
    } catch {
      // ignore
    }
  }, [parentA, parentB, hydrated]);

  const result = useMemo(() => {
    if (!parentA || !parentB) return null;
    return getChild(parentA.slug, parentB.slug);
  }, [parentA, parentB]);

  const onPick = useCallback(
    (pal) => {
      if (pickerOpen === 'a') setParentA(pal);
      if (pickerOpen === 'b') setParentB(pal);
      setPickerOpen(null);
    },
    [pickerOpen]
  );

  const swap = useCallback(() => {
    setParentA(parentB);
    setParentB(parentA);
  }, [parentA, parentB]);

  const reset = useCallback(() => {
    setParentA(null);
    setParentB(null);
  }, []);

  const pickChildAsParent = useCallback(
    (slot) => {
      if (!result?.child) return;
      if (slot === 'a') setParentA(result.child);
      if (slot === 'b') setParentB(result.child);
    },
    [result]
  );

  return (
    <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 rounded-2xl border border-white/10 p-5 sm:p-8 shadow-xl">
      <div className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4 sm:gap-6 w-full">
          <div className="flex justify-center">
            <PalSlot
              pal={parentA}
              label="Parent A"
              onClick={() => setPickerOpen('a')}
              onClear={parentA ? () => setParentA(null) : undefined}
            />
          </div>
          <div className="flex justify-center text-3xl font-bold text-zinc-500 select-none">+</div>
          <div className="flex justify-center">
            <PalSlot
              pal={parentB}
              label="Parent B"
              onClick={() => setPickerOpen('b')}
              onClear={parentB ? () => setParentB(null) : undefined}
            />
          </div>
          <div className="flex justify-center text-3xl font-bold text-zinc-500 select-none">=</div>
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-3 p-4 w-full max-w-[220px]">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Child</span>
              <PalAvatar pal={result?.child} size={120} />
              {result?.child ? (
                <div className="text-center">
                  <div className="text-base font-semibold text-white">{result.child.name}</div>
                  <div className={`text-xs ${RARITY_COLORS[result.child.rarity]?.text || 'text-zinc-300'}`}>
                    {result.child.rarity} · Power {result.child.breedPower}
                  </div>
                </div>
              ) : (
                <span className="text-sm text-zinc-500">Pick both parents</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={swap}
            disabled={!parentA && !parentB}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-zinc-200 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" /> Swap
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={!parentA && !parentB}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-zinc-200 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <Sparkles className="w-3.5 h-3.5" /> Pairings auto-update as you pick
          </span>
        </div>

        {result ? (
          <div className="w-full mt-2">
            <ChildResult result={result} onPickChildAsParent={pickChildAsParent} />
          </div>
        ) : null}
      </div>

      <PickerModal
        open={pickerOpen !== null}
        onClose={() => setPickerOpen(null)}
        onPick={onPick}
        title={pickerOpen === 'a' ? 'Pick Parent A' : 'Pick Parent B'}
      />
    </div>
  );
}
