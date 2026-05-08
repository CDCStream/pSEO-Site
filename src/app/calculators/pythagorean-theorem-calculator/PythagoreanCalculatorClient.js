'use client';

import { useState, useCallback } from 'react';
import { Triangle, Calculator, ChevronDown } from 'lucide-react';

const SOLVE_FOR = [
  { id: 'c', label: 'Hypotenuse c' },
  { id: 'a', label: 'Side a' },
  { id: 'b', label: 'Side b' },
];

const UNITS = [
  { id: 'none', label: '—' },
  { id: 'm', label: 'm' },
  { id: 'cm', label: 'cm' },
  { id: 'mm', label: 'mm' },
  { id: 'km', label: 'km' },
  { id: 'ft', label: 'ft' },
  { id: 'in', label: 'in' },
  { id: 'yd', label: 'yd' },
  { id: 'mi', label: 'mi' },
];

// Returns the value as a clean string. If `raw` is essentially an integer
// (within 1e-9), show the integer (so 3-4-5 displays as 5, not 5.0000).
// Otherwise honour the user's decimal-places choice.
function fmt(raw, decimals) {
  if (!Number.isFinite(raw)) return '';
  const rounded = Math.round(raw);
  if (Math.abs(raw - rounded) < 1e-9) return String(rounded);
  return raw.toFixed(decimals);
}

function parseInput(s) {
  if (typeof s !== 'string') return NaN;
  const trimmed = s.trim();
  if (!trimmed) return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

function unitLabel(unit) {
  const u = UNITS.find((x) => x.id === unit);
  if (!u || u.id === 'none') return '';
  return u.label;
}

export default function PythagoreanCalculatorClient() {
  const [solveFor, setSolveFor] = useState('c');
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [inputC, setInputC] = useState('');
  const [unit, setUnit] = useState('none');
  const [decimals, setDecimals] = useState(4);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showSteps, setShowSteps] = useState(false);

  const calculate = useCallback(() => {
    setError(null);
    setShowSteps(false);

    let a, b, c;

    if (solveFor === 'c') {
      a = parseInput(inputA);
      b = parseInput(inputB);
      if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) {
        setResult(null);
        setError('Please enter positive numbers for both legs (a and b).');
        return;
      }
      c = Math.hypot(a, b);
    } else if (solveFor === 'a') {
      b = parseInput(inputB);
      c = parseInput(inputC);
      if (!Number.isFinite(b) || !Number.isFinite(c) || b <= 0 || c <= 0) {
        setResult(null);
        setError('Please enter positive numbers for leg b and hypotenuse c.');
        return;
      }
      if (c === b) {
        setResult(null);
        setError('When the hypotenuse equals a leg, side a would be 0 and the triangle is degenerate.');
        return;
      }
      if (c < b) {
        setResult(null);
        setError('The hypotenuse must be larger than the known leg. Otherwise no real right triangle exists.');
        return;
      }
      a = Math.sqrt((c - b) * (c + b));
    } else {
      a = parseInput(inputA);
      c = parseInput(inputC);
      if (!Number.isFinite(a) || !Number.isFinite(c) || a <= 0 || c <= 0) {
        setResult(null);
        setError('Please enter positive numbers for leg a and hypotenuse c.');
        return;
      }
      if (c === a) {
        setResult(null);
        setError('When the hypotenuse equals a leg, side b would be 0 and the triangle is degenerate.');
        return;
      }
      if (c < a) {
        setResult(null);
        setError('The hypotenuse must be larger than the known leg. Otherwise no real right triangle exists.');
        return;
      }
      b = Math.sqrt((c - a) * (c + a));
    }

    const area = (a * b) / 2;
    const perimeter = a + b + c;
    const alphaDeg = (Math.atan2(a, b) * 180) / Math.PI;
    const betaDeg = (Math.atan2(b, a) * 180) / Math.PI;

    setResult({
      a,
      b,
      c,
      area,
      perimeter,
      alphaDeg,
      betaDeg,
      solvedFor: solveFor,
    });
  }, [solveFor, inputA, inputB, inputC]);

  const resetAll = () => {
    setInputA('');
    setInputB('');
    setInputC('');
    setResult(null);
    setError(null);
    setShowSteps(false);
  };

  const u = unitLabel(unit);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-cyan-950/60 to-blue-950/40 rounded-2xl border border-cyan-500/20 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Triangle className="w-7 h-7 text-cyan-400" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Pythagorean Theorem <span className="text-cyan-400">Calculator</span>
          </h2>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Solve <span className="font-mono text-gray-300">a² + b² = c²</span> for any side of a right triangle. Returns the missing side, area, perimeter, and both acute angles.
        </p>

        <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Solve for</label>
            <div className="flex flex-wrap gap-2">
              {SOLVE_FOR.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSolveFor(s.id); setResult(null); setError(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    solveFor === s.id
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                  type="button"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {solveFor !== 'a' && (
              <SideInput
                label="Side a"
                value={inputA}
                onChange={setInputA}
                unit={u}
                placeholder="e.g. 3"
              />
            )}
            {solveFor !== 'b' && (
              <SideInput
                label="Side b"
                value={inputB}
                onChange={setInputB}
                unit={u}
                placeholder="e.g. 4"
              />
            )}
            {solveFor !== 'c' && (
              <SideInput
                label="Hypotenuse c"
                value={inputC}
                onChange={setInputC}
                unit={u}
                placeholder="e.g. 5"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Unit (display only)</label>
            <div className="flex flex-wrap gap-2">
              {UNITS.map((unitOpt) => (
                <button
                  key={unitOpt.id}
                  onClick={() => setUnit(unitOpt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    unit === unitOpt.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-white/5 text-gray-500 border border-white/5 hover:text-gray-300'
                  }`}
                  type="button"
                >
                  {unitOpt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Round (decimal places)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((d) => (
                <button
                  key={d}
                  onClick={() => setDecimals(d)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    decimals === d
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                  }`}
                  type="button"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={calculate}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              type="button"
            >
              <Calculator className="w-[18px] h-[18px]" />
              Calculate
            </button>
            <button
              onClick={resetAll}
              className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium hover:bg-white/10 hover:text-white transition-all"
              type="button"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <ResultCard result={result} decimals={decimals} unit={u} showSteps={showSteps} setShowSteps={setShowSteps} />
      )}
    </div>
  );
}

function SideInput({ label, value, onChange, unit, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder={placeholder}
        />
        {unit && <span className="text-xs text-gray-500 w-8 shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

function ResultCard({ result, decimals, unit, showSteps, setShowSteps }) {
  const { a, b, c, area, perimeter, alphaDeg, betaDeg, solvedFor } = result;

  const heroLabel = solvedFor === 'c' ? 'Hypotenuse c' : solvedFor === 'a' ? 'Side a' : 'Side b';
  const heroValue = solvedFor === 'c' ? c : solvedFor === 'a' ? a : b;
  const angleDecimals = Math.min(decimals, 4);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
      <div className="text-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">{heroLabel}</p>
        <p className="text-4xl sm:text-5xl font-bold text-cyan-400">
          {fmt(heroValue, decimals)}
          {unit && <span className="text-lg text-gray-400 ml-2">{unit}</span>}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Cell label="Side a" value={fmt(a, decimals)} unit={unit} highlight={solvedFor === 'a'} />
        <Cell label="Side b" value={fmt(b, decimals)} unit={unit} highlight={solvedFor === 'b'} />
        <Cell label="Hypotenuse c" value={fmt(c, decimals)} unit={unit} highlight={solvedFor === 'c'} />
        <Cell label="Area A" value={fmt(area, decimals)} unit={unit ? `${unit}²` : ''} />
        <Cell label="Perimeter P" value={fmt(perimeter, decimals)} unit={unit} />
        <Cell label="Angle α" value={`${fmt(alphaDeg, angleDecimals)}°`} sub="opposite a" />
        <Cell label="Angle β" value={`${fmt(betaDeg, angleDecimals)}°`} sub="opposite b" />
        <Cell label="Right angle" value="90°" sub="between a and b" />
      </div>

      <div>
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/[0.07] transition-colors"
          type="button"
        >
          <span className="text-sm font-medium">
            {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
          </span>
          <ChevronDown
            className={`w-5 h-5 shrink-0 transition-transform duration-200 ${showSteps ? 'rotate-180' : ''}`}
          />
        </button>

        {showSteps && (
          <div className="mt-3 bg-black/30 border border-white/10 rounded-xl p-4 sm:p-5">
            <Steps result={result} decimals={decimals} />
          </div>
        )}
      </div>
    </div>
  );
}

function Cell({ label, value, unit, sub, highlight }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        highlight
          ? 'bg-cyan-500/10 border-cyan-500/30'
          : 'bg-white/5 border-white/5'
      }`}
    >
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-cyan-300' : 'text-white'}`}>{value}</p>
      <p className="text-xs text-gray-500">{unit || sub || ''}</p>
    </div>
  );
}

function Steps({ result, decimals }) {
  const { a, b, c, solvedFor } = result;

  let lines;
  if (solvedFor === 'c') {
    const aSq = a * a;
    const bSq = b * b;
    const sum = aSq + bSq;
    lines = [
      'c² = a² + b²',
      `c² = (${fmt(a, decimals)})² + (${fmt(b, decimals)})²`,
      `c² = ${fmt(aSq, decimals)} + ${fmt(bSq, decimals)}`,
      `c² = ${fmt(sum, decimals)}`,
      `c  = √${fmt(sum, decimals)}`,
      `c  = ${fmt(c, decimals)}`,
    ];
  } else if (solvedFor === 'a') {
    const cSq = c * c;
    const bSq = b * b;
    const diff = cSq - bSq;
    lines = [
      'a² + b² = c²',
      'a²       = c² − b²',
      `a²       = (${fmt(c, decimals)})² − (${fmt(b, decimals)})²`,
      `a²       = ${fmt(cSq, decimals)} − ${fmt(bSq, decimals)}`,
      `a²       = ${fmt(diff, decimals)}`,
      `a        = √${fmt(diff, decimals)}`,
      `a        = ${fmt(a, decimals)}`,
    ];
  } else {
    const cSq = c * c;
    const aSq = a * a;
    const diff = cSq - aSq;
    lines = [
      'a² + b² = c²',
      'b²       = c² − a²',
      `b²       = (${fmt(c, decimals)})² − (${fmt(a, decimals)})²`,
      `b²       = ${fmt(cSq, decimals)} − ${fmt(aSq, decimals)}`,
      `b²       = ${fmt(diff, decimals)}`,
      `b        = √${fmt(diff, decimals)}`,
      `b        = ${fmt(b, decimals)}`,
    ];
  }

  return (
    <div className="font-mono text-sm leading-7 break-words">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`whitespace-pre ${i === lines.length - 1 ? 'text-cyan-300 font-semibold' : 'text-gray-300'}`}
        >
          {line}
        </div>
      ))}
    </div>
  );
}
