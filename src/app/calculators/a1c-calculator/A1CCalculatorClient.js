'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Activity, ArrowLeftRight, Copy, RotateCcw, ChevronDown, Check } from 'lucide-react';

const STORAGE_KEY = 'makersilo:a1c:prefs';
const FACTOR = 18.0182;

function parseInput(s) {
  if (typeof s !== 'string') return NaN;
  const t = s.trim().replace(',', '.');
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}

function safeRound(x) {
  return Math.round(Math.round(x * 1e10) / 1e10);
}

function round1(x) {
  return Math.round(Math.round(x * 1e11) / 1e10) / 10;
}

function rangeFor(a1c) {
  if (a1c < 5.7) return { label: 'Normal', tone: 'emerald', note: 'Below the ADA prediabetes threshold of 5.7%.' };
  if (a1c < 6.5) return { label: 'Prediabetes', tone: 'amber', note: 'In the ADA prediabetes range (5.7\u20136.4%). Talk to your clinician about lifestyle changes.' };
  if (a1c < 9) return { label: 'Diabetes', tone: 'rose', note: 'In the diabetes range (\u22656.5%). Standard ADA target for many adults is below 7%.' };
  return { label: 'Diabetes', tone: 'rose', note: 'Significantly above target. Discuss treatment adjustment with your clinician.' };
}

function toneClasses(tone) {
  switch (tone) {
    case 'emerald':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'amber':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    default:
      return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  }
}

const QUICK_PICKS = {
  a1c: [
    { value: '5.7', label: '5.7%' },
    { value: '6.5', label: '6.5%' },
    { value: '7.0', label: '7.0%' },
    { value: '8.0', label: '8.0%' },
  ],
  mgdl: [
    { value: '117', label: '117 mg/dL' },
    { value: '140', label: '140 mg/dL' },
    { value: '154', label: '154 mg/dL' },
    { value: '183', label: '183 mg/dL' },
  ],
  mmol: [
    { value: '6.5', label: '6.5 mmol/L' },
    { value: '7.8', label: '7.8 mmol/L' },
    { value: '8.6', label: '8.6 mmol/L' },
    { value: '10.2', label: '10.2 mmol/L' },
  ],
};

export default function A1CCalculatorClient() {
  const [direction, setDirection] = useState('a1cToEag');
  const [unit, setUnit] = useState('mgdl');
  const [a1cInput, setA1cInput] = useState('7.0');
  const [eagInput, setEagInput] = useState('154');
  const [showSteps, setShowSteps] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.unit === 'mgdl' || parsed.unit === 'mmol') setUnit(parsed.unit);
        if (parsed.direction === 'a1cToEag' || parsed.direction === 'eagToA1c') setDirection(parsed.direction);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ unit, direction }));
    } catch {}
  }, [unit, direction]);

  useEffect(() => {
    if (direction === 'eagToA1c') {
      if (unit === 'mgdl') setEagInput((v) => (parseInput(v) > 50 ? v : '154'));
      else setEagInput((v) => (parseInput(v) > 3 ? v : '8.6'));
    }
  }, [unit, direction]);

  const result = useMemo(() => {
    if (direction === 'a1cToEag') {
      const a1c = parseInput(a1cInput);
      if (!Number.isFinite(a1c) || a1c < 4 || a1c > 18) return null;
      const rawMgdl = 28.7 * a1c - 46.7;
      const rawMmol = rawMgdl / FACTOR;
      return {
        kind: 'a1cToEag',
        a1c,
        rawMgdl,
        rawMmol,
        mgdl: safeRound(rawMgdl),
        mmol: round1(rawMmol),
        range: rangeFor(a1c),
      };
    }
    const eag = parseInput(eagInput);
    if (!Number.isFinite(eag)) return null;
    const eagMgdl = unit === 'mgdl' ? eag : eag * FACTOR;
    const eagMmol = unit === 'mgdl' ? eag / FACTOR : eag;
    if (eagMgdl < 50 || eagMgdl > 500) return null;
    const a1c = (eagMgdl + 46.7) / 28.7;
    return {
      kind: 'eagToA1c',
      eagInput: eag,
      eagMgdl,
      eagMmol,
      a1c: round1(a1c),
      rawA1c: a1c,
      range: rangeFor(a1c),
    };
  }, [direction, unit, a1cInput, eagInput]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    let text = '';
    if (result.kind === 'a1cToEag') {
      text = `A1C ${result.a1c}% \u2248 ${result.mgdl} mg/dL \u2248 ${result.mmol.toFixed(1)} mmol/L (${result.range.label})`;
    } else {
      text = `eAG ${result.kind === 'eagToA1c' && unit === 'mgdl' ? `${result.eagMgdl.toFixed(0)} mg/dL` : `${result.eagMmol.toFixed(1)} mmol/L`} \u2248 A1C ${result.a1c.toFixed(1)}% (${result.range.label})`;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }, [result, unit]);

  const handleReset = useCallback(() => {
    setA1cInput('7.0');
    setEagInput(unit === 'mgdl' ? '154' : '8.6');
    setShowSteps(false);
  }, [unit]);

  const swapDirection = useCallback(() => {
    setDirection((d) => (d === 'a1cToEag' ? 'eagToA1c' : 'a1cToEag'));
    setShowSteps(false);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6">
      {/* direction tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="inline-flex rounded-xl bg-black/30 border border-white/10 p-1">
          <button
            onClick={() => { setDirection('a1cToEag'); setShowSteps(false); }}
            className={`px-3 sm:px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              direction === 'a1cToEag' ? 'bg-rose-500 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            A1C \u2192 eAG
          </button>
          <button
            onClick={() => { setDirection('eagToA1c'); setShowSteps(false); }}
            className={`px-3 sm:px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              direction === 'eagToA1c' ? 'bg-rose-500 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            eAG \u2192 A1C
          </button>
        </div>

        <button
          onClick={swapDirection}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Swap conversion direction"
          title="Swap direction"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Swap
        </button>

        <div className="ml-auto inline-flex rounded-xl bg-black/30 border border-white/10 p-1">
          <button
            onClick={() => setUnit('mgdl')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              unit === 'mgdl' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            mg/dL
          </button>
          <button
            onClick={() => setUnit('mmol')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              unit === 'mmol' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            mmol/L
          </button>
        </div>
      </div>

      {/* input */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          {direction === 'a1cToEag' ? (
            <>
              <label htmlFor="a1c-in" className="block text-sm font-medium text-gray-300 mb-1.5">
                A1C (%)
              </label>
              <input
                id="a1c-in"
                type="number"
                inputMode="decimal"
                step="0.1"
                min="4"
                max="18"
                value={a1cInput}
                onChange={(e) => setA1cInput(e.target.value)}
                placeholder="e.g. 7.0"
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-lg font-semibold focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
              <p className="mt-1.5 text-xs text-gray-500">Valid range: 4.0% to 18.0%</p>
            </>
          ) : (
            <>
              <label htmlFor="eag-in" className="block text-sm font-medium text-gray-300 mb-1.5">
                Average glucose ({unit === 'mgdl' ? 'mg/dL' : 'mmol/L'})
              </label>
              <input
                id="eag-in"
                type="number"
                inputMode="decimal"
                step={unit === 'mgdl' ? '1' : '0.1'}
                min={unit === 'mgdl' ? '50' : '2.8'}
                max={unit === 'mgdl' ? '500' : '27.8'}
                value={eagInput}
                onChange={(e) => setEagInput(e.target.value)}
                placeholder={unit === 'mgdl' ? 'e.g. 154' : 'e.g. 8.6'}
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-lg font-semibold focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Valid range: {unit === 'mgdl' ? '50 to 500 mg/dL' : '2.8 to 27.8 mmol/L'}
              </p>
            </>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {(direction === 'a1cToEag'
              ? QUICK_PICKS.a1c
              : unit === 'mgdl'
                ? QUICK_PICKS.mgdl
                : QUICK_PICKS.mmol
            ).map((qp) => (
              <button
                key={qp.value}
                onClick={() => {
                  if (direction === 'a1cToEag') setA1cInput(qp.value);
                  else setEagInput(qp.value);
                  setShowSteps(false);
                }}
                className="px-2.5 py-1 text-xs rounded-md border border-white/10 bg-white/5 text-gray-300 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-200 transition-colors"
              >
                {qp.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!result}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy result'}
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* result card */}
        <div className="rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-red-500/5 p-4">
          {!result ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Enter a value to see the conversion.
            </div>
          ) : result.kind === 'a1cToEag' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-300" />
                <span className="text-xs font-semibold text-rose-200 uppercase tracking-wider">Estimated Average Glucose</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold text-white">{unit === 'mgdl' ? result.mgdl : result.mmol.toFixed(1)}</span>
                <span className="text-base text-gray-400 font-medium">{unit === 'mgdl' ? 'mg/dL' : 'mmol/L'}</span>
              </div>
              <div className="text-sm text-gray-400">
                = <span className="text-gray-200 font-semibold">{unit === 'mgdl' ? `${result.mmol.toFixed(1)} mmol/L` : `${result.mgdl} mg/dL`}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <span className={`inline-flex w-fit items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${toneClasses(result.range.tone)}`}>
                  ADA range: {result.range.label}
                </span>
                <p className="text-xs text-gray-400 leading-relaxed">{result.range.note}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-300" />
                <span className="text-xs font-semibold text-rose-200 uppercase tracking-wider">Estimated A1C</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold text-white">{result.a1c.toFixed(1)}</span>
                <span className="text-base text-gray-400 font-medium">%</span>
              </div>
              <div className="text-sm text-gray-400">
                from <span className="text-gray-200 font-semibold">{unit === 'mgdl' ? `${Math.round(result.eagMgdl)} mg/dL` : `${result.eagMmol.toFixed(1)} mmol/L`}</span>
                {' '}({unit === 'mgdl' ? `${result.eagMmol.toFixed(1)} mmol/L` : `${Math.round(result.eagMgdl)} mg/dL`})
              </div>
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <span className={`inline-flex w-fit items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${toneClasses(result.range.tone)}`}>
                  ADA range: {result.range.label}
                </span>
                <p className="text-xs text-gray-400 leading-relaxed">{result.range.note}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* explainer */}
      {result && (
        <div className="mt-5">
          <button
            onClick={() => setShowSteps((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm text-rose-300 hover:text-rose-200 font-medium"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showSteps ? 'rotate-180' : ''}`} />
            Why this number?
          </button>
          {showSteps && (
            <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed">
              {result.kind === 'a1cToEag' ? (
                <div className="space-y-1">
                  <div>Formula (ADA, Nathan et al. 2008):</div>
                  <div className="text-white">eAG (mg/dL) = 28.7 \u00d7 A1C \u2212 46.7</div>
                  <div className="mt-2 text-gray-400">Substitute A1C = {result.a1c}%:</div>
                  <div>eAG = 28.7 \u00d7 {result.a1c} \u2212 46.7</div>
                  <div>eAG = {(28.7 * result.a1c).toFixed(2)} \u2212 46.7</div>
                  <div className="text-white">eAG = {result.rawMgdl.toFixed(2)} mg/dL \u2248 <span className="text-rose-300">{result.mgdl} mg/dL</span></div>
                  <div className="mt-2 text-gray-400">Convert to mmol/L (\u00f7 18.0182):</div>
                  <div>{result.rawMgdl.toFixed(2)} \u00f7 18.0182 = {result.rawMmol.toFixed(4)}</div>
                  <div className="text-white">eAG \u2248 <span className="text-rose-300">{result.mmol.toFixed(1)} mmol/L</span></div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div>Inverse formula:</div>
                  <div className="text-white">A1C (%) = (eAG (mg/dL) + 46.7) \u00f7 28.7</div>
                  {unit === 'mmol' && (
                    <>
                      <div className="mt-2 text-gray-400">First convert mmol/L \u2192 mg/dL (\u00d7 18.0182):</div>
                      <div>{result.eagMmol.toFixed(1)} \u00d7 18.0182 = {result.eagMgdl.toFixed(2)} mg/dL</div>
                    </>
                  )}
                  <div className="mt-2 text-gray-400">Substitute eAG = {result.eagMgdl.toFixed(2)} mg/dL:</div>
                  <div>A1C = ({result.eagMgdl.toFixed(2)} + 46.7) \u00f7 28.7</div>
                  <div>A1C = {(result.eagMgdl + 46.7).toFixed(2)} \u00f7 28.7</div>
                  <div className="text-white">A1C = {result.rawA1c.toFixed(4)}% \u2248 <span className="text-rose-300">{result.a1c.toFixed(1)}%</span></div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
