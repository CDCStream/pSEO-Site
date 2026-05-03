'use client';

import { useMemo, useState } from 'react';
import { pValueZ, pValueT, pValueChi2, pValueF } from '@/lib/stats';

const DISTRIBUTIONS = [
  {
    id: 'z',
    label: 'Z-score',
    sub: 'Standard Normal',
    statLabel: 'Z-score',
    statPlaceholder: 'e.g. 1.96',
    needsDf: 0,
    allowNegative: true,
    tails: ['two', 'left', 'right'],
    description: 'Use when your test statistic follows the standard normal distribution N(0, 1). Common for large-sample tests of population means or proportions.',
  },
  {
    id: 't',
    label: 't-score',
    sub: "Student's t",
    statLabel: 't-score',
    statPlaceholder: 'e.g. 2.4',
    needsDf: 1,
    dfLabels: ['Degrees of freedom (df)'],
    dfPlaceholders: ['e.g. 24'],
    allowNegative: true,
    tails: ['two', 'left', 'right'],
    description: 'Use when testing means with an unknown population standard deviation, especially for small samples. Bell-shaped but with heavier tails than normal.',
  },
  {
    id: 'chi2',
    label: 'Chi-square (χ²)',
    sub: 'χ² distribution',
    statLabel: 'χ²-score',
    statPlaceholder: 'e.g. 5.991',
    needsDf: 1,
    dfLabels: ['Degrees of freedom (df)'],
    dfPlaceholders: ['e.g. 2'],
    allowNegative: false,
    tails: ['right', 'left', 'two'],
    description: 'Use for goodness-of-fit, independence, and variance tests. Goodness-of-fit and independence are right-tailed.',
  },
  {
    id: 'f',
    label: 'F-score',
    sub: 'Fisher–Snedecor F',
    statLabel: 'F-score',
    statPlaceholder: 'e.g. 3.84',
    needsDf: 2,
    dfLabels: ['Numerator df (d₁)', 'Denominator df (d₂)'],
    dfPlaceholders: ['e.g. 2', 'e.g. 30'],
    allowNegative: false,
    tails: ['right', 'left', 'two'],
    description: 'Use for ANOVA, regression overall significance, and tests for equality of variances. ANOVA and regression F-tests are right-tailed.',
  },
];

const TAIL_LABELS = {
  two: 'Two-tailed',
  left: 'Left-tailed',
  right: 'Right-tailed',
};

const TAIL_HINTS = {
  two: 'H₁: parameter ≠ value (extreme in either direction)',
  left: 'H₁: parameter < value (extreme on the left)',
  right: 'H₁: parameter > value (extreme on the right)',
};

function formatPValue(p) {
  if (!Number.isFinite(p)) return '—';
  if (p < 1e-10) return '< 1 × 10⁻¹⁰';
  if (p < 0.0001) return p.toExponential(3);
  if (p < 0.01) return p.toFixed(5);
  return p.toFixed(4);
}

function decisionText(p, alpha) {
  if (!Number.isFinite(p) || !Number.isFinite(alpha)) return null;
  return p <= alpha
    ? {
        verdict: 'Reject H₀',
        color: 'text-emerald-300',
        bg: 'from-emerald-500/15 to-emerald-600/5 border-emerald-500/30',
        explain: `p-value (${formatPValue(p)}) ≤ α (${alpha}). The result is statistically significant at this significance level.`,
      }
    : {
        verdict: 'Fail to reject H₀',
        color: 'text-amber-300',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-500/30',
        explain: `p-value (${formatPValue(p)}) > α (${alpha}). There is not enough evidence to reject the null hypothesis at this significance level.`,
      };
}

export default function PValueCalculatorClient() {
  const [distId, setDistId] = useState('z');
  const [tail, setTail] = useState('two');
  const [stat, setStat] = useState('');
  const [df1, setDf1] = useState('');
  const [df2, setDf2] = useState('');
  const [alpha, setAlpha] = useState('0.05');
  const [touched, setTouched] = useState(false);

  const dist = DISTRIBUTIONS.find((d) => d.id === distId);

  const handleDistChange = (id) => {
    const next = DISTRIBUTIONS.find((d) => d.id === id);
    setDistId(id);
    if (next && !next.tails.includes(tail)) {
      setTail(next.tails[0]);
    }
    setTouched(false);
  };

  const result = useMemo(() => {
    const x = parseFloat(stat);
    const a = parseFloat(alpha);
    if (!Number.isFinite(x)) return null;
    if (!Number.isFinite(a) || a <= 0 || a >= 1) return null;
    if (!dist.allowNegative && x < 0) return null;

    let p = null;
    if (dist.id === 'z') {
      p = pValueZ(x, tail);
    } else if (dist.id === 't') {
      const d = parseFloat(df1);
      if (!Number.isFinite(d) || d <= 0) return null;
      p = pValueT(x, d, tail);
    } else if (dist.id === 'chi2') {
      const d = parseFloat(df1);
      if (!Number.isFinite(d) || d <= 0) return null;
      p = pValueChi2(x, d, tail);
    } else if (dist.id === 'f') {
      const d1 = parseFloat(df1);
      const d2 = parseFloat(df2);
      if (!Number.isFinite(d1) || d1 <= 0) return null;
      if (!Number.isFinite(d2) || d2 <= 0) return null;
      p = pValueF(x, d1, d2, tail);
    }
    if (!Number.isFinite(p)) return null;
    return { p: Math.max(0, Math.min(1, p)), alpha: a, x };
  }, [distId, dist, tail, stat, df1, df2, alpha]);

  const handleClear = () => {
    setStat('');
    setDf1('');
    setDf2('');
    setAlpha('0.05');
    setTouched(false);
  };

  const handleExample = () => {
    if (distId === 'z') {
      setStat('1.96');
    } else if (distId === 't') {
      setStat('2.0');
      setDf1('20');
    } else if (distId === 'chi2') {
      setStat('5.991');
      setDf1('2');
    } else if (distId === 'f') {
      setStat('3.84');
      setDf1('2');
      setDf2('30');
    }
    setAlpha('0.05');
    setTouched(true);
  };

  const decision = result ? decisionText(result.p, result.alpha) : null;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-medium block mb-2">
          Test statistic distribution
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {DISTRIBUTIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => handleDistChange(d.id)}
              className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                distId === d.id
                  ? 'bg-gradient-to-br from-cyan-600/25 to-cyan-500/10 border-cyan-500/40 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="font-semibold">{d.label}</div>
              <div className="text-[10px] opacity-60">{d.sub}</div>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
          {dist.description}
        </p>

        <label className="text-xs text-gray-400 uppercase tracking-wider font-medium block mb-2">
          Alternative hypothesis (tail)
        </label>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {dist.tails.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTail(t)}
              className={`px-2 py-2 rounded-xl border text-sm font-medium transition-all ${
                tail === t
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {TAIL_LABELS[t]}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-gray-500 mb-5">{TAIL_HINTS[tail]}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="stat-input" className="text-xs text-gray-400 uppercase tracking-wider font-medium block mb-2">
              {dist.statLabel}
            </label>
            <input
              id="stat-input"
              type="number"
              step="any"
              value={stat}
              onChange={(e) => { setStat(e.target.value); setTouched(true); }}
              placeholder={dist.statPlaceholder}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 placeholder-gray-600 font-mono"
            />
          </div>

          {dist.needsDf >= 1 && (
            <div>
              <label htmlFor="df1-input" className="text-xs text-gray-400 uppercase tracking-wider font-medium block mb-2">
                {dist.dfLabels[0]}
              </label>
              <input
                id="df1-input"
                type="number"
                step="any"
                min="0"
                value={df1}
                onChange={(e) => { setDf1(e.target.value); setTouched(true); }}
                placeholder={dist.dfPlaceholders[0]}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 placeholder-gray-600 font-mono"
              />
            </div>
          )}

          {dist.needsDf >= 2 && (
            <div>
              <label htmlFor="df2-input" className="text-xs text-gray-400 uppercase tracking-wider font-medium block mb-2">
                {dist.dfLabels[1]}
              </label>
              <input
                id="df2-input"
                type="number"
                step="any"
                min="0"
                value={df2}
                onChange={(e) => { setDf2(e.target.value); setTouched(true); }}
                placeholder={dist.dfPlaceholders[1]}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 placeholder-gray-600 font-mono"
              />
            </div>
          )}

          <div>
            <label htmlFor="alpha-input" className="text-xs text-gray-400 uppercase tracking-wider font-medium block mb-2">
              Significance level (α)
            </label>
            <input
              id="alpha-input"
              type="number"
              step="0.01"
              min="0.0001"
              max="0.5"
              value={alpha}
              onChange={(e) => { setAlpha(e.target.value); setTouched(true); }}
              placeholder="0.05"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 placeholder-gray-600 font-mono"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-5">
          <button
            type="button"
            onClick={handleExample}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-colors text-sm font-medium"
          >
            Try example
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!stat && !df1 && !df2 && alpha === '0.05'}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors text-sm disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

      {touched && !result && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-sm text-amber-200/80">
          Enter a valid {dist.statLabel}
          {dist.needsDf >= 1 ? `, ${dist.dfLabels[0].toLowerCase()}` : ''}
          {dist.needsDf >= 2 ? `, and ${dist.dfLabels[1].toLowerCase()}` : ''} to see the p-value.
          {!dist.allowNegative && ' This distribution requires a non-negative test statistic.'}
        </div>
      )}

      {result && decision && (
        <div className={`bg-gradient-to-br ${decision.bg} border rounded-2xl p-5 sm:p-6`}>
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-5">
            <div className="lg:w-1/3 flex flex-col justify-center bg-black/20 rounded-xl p-5 border border-white/5">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                p-value
              </div>
              <div className="font-mono text-3xl sm:text-4xl text-white font-bold tabular-nums break-all">
                {formatPValue(result.p)}
              </div>
              <div className="text-[11px] text-gray-500 mt-2">
                {TAIL_LABELS[tail]} • α = {result.alpha}
              </div>
            </div>

            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/10 text-sm font-semibold mb-3 ${decision.color}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {decision.verdict.startsWith('Reject') ? (
                    <polyline points="20 6 9 17 4 12" />
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </>
                  )}
                </svg>
                {decision.verdict}
              </div>

              <p className="text-sm text-gray-200 leading-relaxed mb-3">
                {decision.explain}
              </p>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { a: 0.05, label: 'α = 0.05' },
                  { a: 0.01, label: 'α = 0.01' },
                  { a: 0.001, label: 'α = 0.001' },
                ].map(({ a, label }) => {
                  const sig = result.p <= a;
                  return (
                    <div
                      key={a}
                      className={`px-2 py-2 rounded-lg border text-xs font-mono ${
                        sig
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                          : 'bg-white/5 border-white/10 text-gray-500'
                      }`}
                    >
                      <div className="font-semibold">{label}</div>
                      <div className="opacity-80">{sig ? 'Significant' : 'Not sig.'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <details className="mt-5 group">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors font-medium uppercase tracking-wider list-none flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-open:rotate-90 transition-transform">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              Calculation details
            </summary>
            <div className="mt-3 text-xs text-gray-400 leading-relaxed space-y-1 font-mono bg-black/20 p-3 rounded-lg border border-white/5">
              <div>Distribution: {dist.label}</div>
              <div>Test statistic: {result.x}</div>
              {dist.needsDf >= 1 && <div>{dist.dfLabels[0]}: {df1}</div>}
              {dist.needsDf >= 2 && <div>{dist.dfLabels[1]}: {df2}</div>}
              <div>Tail: {TAIL_LABELS[tail]}</div>
              <div>Significance level α: {result.alpha}</div>
              <div className="pt-2 border-t border-white/5 mt-2">
                Exact p-value: {result.p.toExponential(8)}
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
