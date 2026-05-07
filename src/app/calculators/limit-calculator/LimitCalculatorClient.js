'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts';
import {
  Calculator, RotateCcw, Copy, ChevronDown, AlertTriangle,
  Infinity as InfinityIcon, ArrowLeft, ArrowRight, ArrowLeftRight,
} from 'lucide-react';
import { solve, exprToTeX, targetToLatex, formatNumber } from '@/lib/limit-engine';

const EXAMPLES = [
  { label: 'sin(x)/x at x→0', expr: 'sin(x)/x', v: 'x', tgt: '0', dir: 'both' },
  { label: '(x²−4)/(x−2) at x→2', expr: '(x^2-4)/(x-2)', v: 'x', tgt: '2', dir: 'both' },
  { label: '(1+1/x)^x at x→∞', expr: '(1+1/x)^x', v: 'x', tgt: 'infinity', dir: 'both' },
  { label: '(1−cos x)/x² at x→0', expr: '(1-cos(x))/x^2', v: 'x', tgt: '0', dir: 'both' },
  { label: '(eˣ−1)/x at x→0', expr: '(e^x-1)/x', v: 'x', tgt: '0', dir: 'both' },
  { label: 'tan(x)/x at x→0', expr: 'tan(x)/x', v: 'x', tgt: '0', dir: 'both' },
  { label: '(2x²+3x)/(x²+1) at x→∞', expr: '(2*x^2+3*x)/(x^2+1)', v: 'x', tgt: 'infinity', dir: 'both' },
  { label: '1/x at x→0⁺', expr: '1/x', v: 'x', tgt: '0', dir: 'right' },
  { label: '1/x at x→0⁻', expr: '1/x', v: 'x', tgt: '0', dir: 'left' },
  { label: 'ln(x)/x at x→∞', expr: 'ln(x)/x', v: 'x', tgt: 'infinity', dir: 'both' },
  { label: '√(x+1)−1)/x at x→0', expr: '(sqrt(x+1)-1)/x', v: 'x', tgt: '0', dir: 'both' },
  { label: 'x·sin(1/x) at x→0', expr: 'x*sin(1/x)', v: 'x', tgt: '0', dir: 'both' },
];

// Render a LaTeX string into HTML using KaTeX
function renderTeX(tex, displayMode = false) {
  if (!tex) return '';
  try {
    return katex.renderToString(tex, {
      throwOnError: false,
      displayMode,
      strict: 'ignore',
      output: 'html',
    });
  } catch {
    return `<span class="text-red-400">${tex}</span>`;
  }
}

function TeX({ tex, block = false, className = '' }) {
  const html = useMemo(() => renderTeX(tex, block), [tex, block]);
  return (
    <span
      className={`${block ? 'block text-center my-2 overflow-x-auto' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function LimitCalculatorClient() {
  const [expr, setExpr] = useState('(x^2-4)/(x-2)');
  const [variable, setVariable] = useState('x');
  const [target, setTarget] = useState('2');
  const [direction, setDirection] = useState('both');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(true);
  const [tableOpen, setTableOpen] = useState(true);
  const [graphOpen, setGraphOpen] = useState(true);
  const [copied, setCopied] = useState(null);

  const previewTeX = useMemo(() => {
    if (!expr) return '';
    const tgtTeX = (() => {
      const s = String(target).trim().toLowerCase();
      if (s === 'infinity' || s === 'inf' || s === '∞') return '\\infty';
      if (s === '-infinity' || s === '-inf' || s === '-∞') return '-\\infty';
      if (s === 'pi' || s === 'π') return '\\pi';
      if (s === '-pi' || s === '-π') return '-\\pi';
      if (s === 'e') return 'e';
      return s || '?';
    })();
    const dirSym = direction === 'left' ? '^-' : direction === 'right' ? '^+' : '';
    return `\\lim_{${variable}\\to ${tgtTeX}${dirSym}} ${exprToTeX(expr)}`;
  }, [expr, variable, target, direction]);

  async function handleCalculate(e) {
    if (e) e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const r = await solve(expr, variable, target, direction);
      if (!r.ok) {
        setError(r.error || 'Could not solve.');
        setResult(null);
      } else {
        setResult(r);
      }
    } catch (err) {
      setError(err && err.message ? err.message : 'Unexpected error.');
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  function handleReset() {
    setExpr('');
    setVariable('x');
    setTarget('');
    setDirection('both');
    setResult(null);
    setError('');
  }

  function fillExample(ex) {
    setExpr(ex.expr);
    setVariable(ex.v);
    setTarget(ex.tgt);
    setDirection(ex.dir);
    setResult(null);
    setError('');
  }

  function copyToClipboard(text, key) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  // Trigger an initial calculation on mount so users see something immediately
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* INPUT CARD */}
      <form
        onSubmit={handleCalculate}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Function input */}
          <div className="lg:col-span-12">
            <label className="text-sm text-gray-300 mb-2 block">
              Function f({variable})
            </label>
            <textarea
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              rows={2}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              placeholder="e.g. (x^2 - 4) / (x - 2)"
            />
            <div className="text-xs text-gray-500 mt-2">
              Use <code>^</code> for powers, <code>*</code> for multiplication, <code>sqrt(x)</code>, <code>sin(x)</code>, <code>ln(x)</code>, <code>e^x</code>, <code>pi</code>.
            </div>
          </div>

          {/* Variable */}
          <div className="lg:col-span-3">
            <label className="text-sm text-gray-300 mb-2 block">Variable</label>
            <input
              value={variable}
              onChange={(e) => setVariable(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 1) || 'x')}
              maxLength={1}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white font-mono text-center focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* Target */}
          <div className="lg:col-span-6">
            <label className="text-sm text-gray-300 mb-2 block">
              {variable} approaches
            </label>
            <div className="flex gap-2">
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                className="flex-1 bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                placeholder="e.g. 0, π, infinity"
              />
              <button
                type="button"
                onClick={() => setTarget('infinity')}
                title="Infinity"
                className="px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white text-lg"
              >
                ∞
              </button>
              <button
                type="button"
                onClick={() => setTarget((t) => (t.startsWith('-') ? t.slice(1) : '-' + t))}
                title="Toggle sign"
                className="px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-white"
              >
                ±
              </button>
            </div>
          </div>

          {/* Direction */}
          <div className="lg:col-span-3">
            <label className="text-sm text-gray-300 mb-2 block">Direction</label>
            <div className="grid grid-cols-3 bg-black/40 border border-white/15 rounded-xl p-1">
              {[
                { id: 'left', icon: ArrowLeft, label: 'Left' },
                { id: 'both', icon: ArrowLeftRight, label: 'Both' },
                { id: 'right', icon: ArrowRight, label: 'Right' },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = direction === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDirection(opt.id)}
                    title={opt.label}
                    className={`flex items-center justify-center py-2 rounded-lg text-sm font-medium transition ${
                      active
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live preview */}
        {previewTeX && (
          <div className="mt-6 px-4 py-3 bg-black/30 border border-white/10 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">Preview</div>
            <div className="text-white text-lg overflow-x-auto">
              <TeX tex={previewTeX} block />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition disabled:opacity-50"
          >
            <Calculator className="w-5 h-5" />
            {busy ? 'Calculating…' : 'Calculate'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl transition"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {error && (
          <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* EXAMPLES */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="text-sm text-gray-300 mb-3">Try an example:</div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => fillExample(ex)}
              className="px-3 py-1.5 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/40 rounded-lg text-sm text-gray-200 hover:text-white transition"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-6 sm:p-8">
            <div className="text-sm text-blue-300 mb-1">Limit</div>
            <div className="text-white text-2xl sm:text-3xl overflow-x-auto">
              <TeX
                tex={`\\lim_{${result.varName}\\to ${targetToLatex(result.target)}${
                  result.direction === 'left' ? '^-' : result.direction === 'right' ? '^+' : ''
                }} ${result.inputTeX} \\;=\\; ${result.displayTeX}`}
                block
              />
            </div>
            <div className="mt-3 text-sm text-gray-400">
              <span className="text-blue-300">Method:</span> {result.method}
            </div>

            {result.warning && (
              <div className="mt-4 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{result.warning}</span>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => copyToClipboard(result.displayTxt, 'val')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-sm text-white transition"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied === 'val' ? 'Copied!' : `Copy answer (${result.displayTxt})`}
              </button>
              <button
                onClick={() => copyToClipboard(result.displayTeX, 'tex')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-sm text-white transition"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied === 'tex' ? 'Copied!' : 'Copy LaTeX'}
              </button>
            </div>
          </div>

          {/* STEPS */}
          <details
            open={stepsOpen}
            onToggle={(e) => setStepsOpen(e.currentTarget.open)}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between hover:bg-white/5">
              <span className="text-white font-semibold">Step-by-Step Solution</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition ${stepsOpen ? 'rotate-180' : ''}`} />
            </summary>
            <div className="px-6 pb-6 space-y-4">
              {result.steps.map((s, i) => (
                <div key={i} className="border-l-2 border-blue-400/40 pl-4">
                  <div className="text-blue-300 text-sm font-medium mb-1">
                    Step {i + 1}: {s.title}
                  </div>
                  <div className="text-gray-300 text-sm mb-2">{s.explanation}</div>
                  {s.tex && (
                    <div className="text-white overflow-x-auto py-1">
                      <TeX tex={s.tex} block />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </details>

          {/* NUMERICAL TABLE */}
          <details
            open={tableOpen}
            onToggle={(e) => setTableOpen(e.currentTarget.open)}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between hover:bg-white/5">
              <span className="text-white font-semibold">Numerical Verification</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition ${tableOpen ? 'rotate-180' : ''}`} />
            </summary>
            <div className="px-2 sm:px-6 pb-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="text-left py-2 px-3">{result.varName}</th>
                    <th className="text-left py-2 px-3">f({result.varName})</th>
                    <th className="text-left py-2 px-3">Side</th>
                  </tr>
                </thead>
                <tbody>
                  {result.leftRows.map((r, i) => (
                    <tr key={`l${i}`} className="border-b border-white/5">
                      <td className="py-1.5 px-3 font-mono text-gray-200">{formatRowX(r.x)}</td>
                      <td className="py-1.5 px-3 font-mono text-gray-200">{formatRowY(r)}</td>
                      <td className="py-1.5 px-3 text-gray-500">left</td>
                    </tr>
                  ))}
                  <tr className="border-b border-white/10 bg-blue-500/10">
                    <td className="py-2 px-3 font-mono text-blue-300">→ {targetText(result.target)}</td>
                    <td className="py-2 px-3 font-mono text-blue-300">→ {result.displayTxt}</td>
                    <td className="py-2 px-3 text-blue-300">limit</td>
                  </tr>
                  {result.rightRows.map((r, i) => (
                    <tr key={`r${i}`} className="border-b border-white/5">
                      <td className="py-1.5 px-3 font-mono text-gray-200">{formatRowX(r.x)}</td>
                      <td className="py-1.5 px-3 font-mono text-gray-200">{formatRowY(r)}</td>
                      <td className="py-1.5 px-3 text-gray-500">right</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          {/* GRAPH */}
          {result.plot && result.plot.points && result.plot.points.length > 0 && (
            <details
              open={graphOpen}
              onToggle={(e) => setGraphOpen(e.currentTarget.open)}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between hover:bg-white/5">
                <span className="text-white font-semibold">Graph of f({result.varName})</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition ${graphOpen ? 'rotate-180' : ''}`} />
              </summary>
              <div className="px-2 sm:px-6 pb-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.plot.points} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke="#ffffff10" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      stroke="#9ca3af"
                      tickFormatter={(v) => Number(v).toFixed(2)}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      domain={['auto', 'auto']}
                      tickFormatter={(v) => Number(v).toFixed(2)}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0b1220', border: '1px solid #ffffff20', borderRadius: 8 }}
                      labelStyle={{ color: '#9ca3af' }}
                      formatter={(value) =>
                        value === null ? '—' : Number(value).toFixed(6)
                      }
                      labelFormatter={(label) => `${result.varName} = ${Number(label).toFixed(4)}`}
                    />
                    {Number.isFinite(result.target) && (
                      <ReferenceLine
                        x={result.target}
                        stroke="#3b82f6"
                        strokeDasharray="4 4"
                        label={{ value: `${result.varName}=${formatNumber(result.target)}`, fill: '#60a5fa', fontSize: 11, position: 'top' }}
                      />
                    )}
                    {result.numericKind === 'num' && Number.isFinite(result.numericValue) && (
                      <ReferenceLine
                        y={result.numericValue}
                        stroke="#06b6d4"
                        strokeDasharray="4 4"
                        label={{ value: `y=${result.displayTxt}`, fill: '#67e8f9', fontSize: 11, position: 'right' }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}

function formatRowX(x) {
  if (typeof x !== 'number' || !isFinite(x)) return String(x);
  // Use scientific notation only for tiny / huge values
  if (Math.abs(x) > 0 && (Math.abs(x) < 0.001 || Math.abs(x) >= 1e6)) {
    return x.toExponential(3);
  }
  return Number(x.toFixed(8)).toString();
}

function formatRowY(row) {
  if (row.kind === 'num') return formatRowX(row.y);
  if (row.kind === 'pos_inf') return '+∞';
  if (row.kind === 'neg_inf') return '-∞';
  if (row.kind === 'nan') return 'undefined';
  if (row.kind === 'error') return 'error';
  return '—';
}

function targetText(t) {
  if (t === Infinity) return '∞';
  if (t === -Infinity) return '-∞';
  return formatNumber(t);
}
