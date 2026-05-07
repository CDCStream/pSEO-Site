/**
 * Limit calculator engine — pure functions, no React.
 *
 * Strategy: numerical-first (always reliable) + nerdamer enrichment
 * (best-effort). Numerical evaluation is the source of truth; nerdamer
 * provides nicer symbolic display when it agrees with the numerical
 * estimate.
 *
 * Why numerical-first?
 *   nerdamer can hang or return incomplete results on certain inputs
 *   (abs(x)/x, ln(x)/x at infinity, complex compositions). Numerical
 *   evaluation at sequences x = a ± 10^(-1..-7) (or 10^1..10^7 for
 *   infinity targets) always terminates and catches divergence /
 *   left ≠ right one-sided cases.
 */

'use client';

let nerdamerPromise = null;
async function getNerdamer() {
  if (nerdamerPromise) return nerdamerPromise;
  // Allow tests to inject nerdamer via globalThis to avoid bundler quirks
  if (typeof globalThis !== 'undefined' && globalThis.__nerdamer__) {
    nerdamerPromise = Promise.resolve(globalThis.__nerdamer__);
    return nerdamerPromise;
  }
  nerdamerPromise = import('nerdamer/all.min')
    .then((m) => m.default || m)
    .catch(() => null);
  return nerdamerPromise;
}

// Patterns that nerdamer cannot handle reliably (and may hang on)
const RISKY_FOR_NERDAMER = /\b(abs|floor|ceil|sign|min|max|piecewise|round|trunc)\s*\(/i;

// Internal "very tight" tolerance for samples that already match exactly
const TOL = 1e-7;
// Practical recognition tolerance — handles floating-point noise from
// e.g. ((1+h)^3 - 1) / h at h=10^-5 which is ~3 + 3e-5.
const RECOG_TOL = 1e-4;

// ---------------------------------------------------------------------------
// 1. Input normalization
// ---------------------------------------------------------------------------

export function normalize(rawText) {
  if (!rawText) return '';
  let s = String(rawText).trim();
  // Unicode -> ASCII
  s = s
    .replace(/∞/g, 'Infinity')
    .replace(/π/g, 'pi')
    .replace(/×/g, '*')
    .replace(/·/g, '*')
    .replace(/÷/g, '/')
    .replace(/[−–—]/g, '-');
  // Strip whitespace inside the expression
  s = s.replace(/\s+/g, '');
  return s;
}

export function parseTargetValue(t) {
  if (typeof t === 'number') return t;
  const s = String(t || '').trim().toLowerCase().replace(/\s+/g, '');
  if (s === '' ) return NaN;
  if (s === 'pi' || s === 'π') return Math.PI;
  if (s === '-pi' || s === '-π') return -Math.PI;
  if (s === 'pi/2' || s === 'π/2') return Math.PI / 2;
  if (s === '-pi/2' || s === '-π/2') return -Math.PI / 2;
  if (s === 'e') return Math.E;
  if (s === '-e') return -Math.E;
  if (s === 'infinity' || s === 'inf' || s === '∞' || s === '+inf' || s === '+infinity' || s === '+∞') return Infinity;
  if (s === '-infinity' || s === '-inf' || s === '-∞') return -Infinity;
  const n = Number(s);
  return isNaN(n) ? NaN : n;
}

export function targetToNerdamer(target) {
  if (target === Infinity) return 'Infinity';
  if (target === -Infinity) return '-Infinity';
  return String(target);
}

export function targetToLatex(target) {
  if (target === Infinity) return '\\infty';
  if (target === -Infinity) return '-\\infty';
  if (Math.abs(target - Math.PI) < TOL) return '\\pi';
  if (Math.abs(target + Math.PI) < TOL) return '-\\pi';
  if (Math.abs(target - Math.PI / 2) < TOL) return '\\frac{\\pi}{2}';
  if (Math.abs(target - Math.E) < TOL) return 'e';
  if (target === 0) return '0';
  return formatNumber(target);
}

// ---------------------------------------------------------------------------
// 2. Convert user expression to a JS-evaluable function f(x)
// ---------------------------------------------------------------------------

export function toJSExpr(expr, varName = 'x') {
  let s = expr;

  // Implicit multiplication
  // digit followed by letter or '(': 2x -> 2*x, 3(x+1) -> 3*(x+1)
  s = s.replace(/(\d)(?=[a-zA-Z(])/g, '$1*');
  // ')' followed by letter or '(': )(x+1) -> )*(x+1), )x -> )*x
  s = s.replace(/(\))(?=[a-zA-Z(])/g, '$1*');

  // ^ -> **  (must precede function/constant substitution since they may add **)
  s = s.replace(/\^/g, '**');

  // Functions (longer names first to avoid prefix collisions)
  const fnReplacements = [
    [/\blog10\(/g, 'Math.log10('],
    [/\blog2\(/g, 'Math.log2('],
    [/\blog\(/g, 'Math.log10('], // calculator convention: log = base 10
    [/\bln\(/g, 'Math.log('],     // ln = natural log
    [/\bsqrt\(/g, 'Math.sqrt('],
    [/\bexp\(/g, 'Math.exp('],
    [/\basin\(/g, 'Math.asin('],
    [/\bacos\(/g, 'Math.acos('],
    [/\batan\(/g, 'Math.atan('],
    [/\barcsin\(/g, 'Math.asin('],
    [/\barccos\(/g, 'Math.acos('],
    [/\barctan\(/g, 'Math.atan('],
    [/\bsinh\(/g, 'Math.sinh('],
    [/\bcosh\(/g, 'Math.cosh('],
    [/\btanh\(/g, 'Math.tanh('],
    [/\bsin\(/g, 'Math.sin('],
    [/\bcos\(/g, 'Math.cos('],
    [/\btan\(/g, 'Math.tan('],
    [/\bsec\(/g, '1/Math.cos('],
    [/\bcsc\(/g, '1/Math.sin('],
    [/\bcot\(/g, '1/Math.tan('],
    [/\babs\(/g, 'Math.abs('],
    [/\bfloor\(/g, 'Math.floor('],
    [/\bceil\(/g, 'Math.ceil('],
    [/\bsign\(/g, 'Math.sign('],
  ];
  for (const [re, rep] of fnReplacements) s = s.replace(re, rep);

  // Constants (word-boundary so we don't collide with function bodies)
  s = s.replace(/\bpi\b/g, '(Math.PI)');
  s = s.replace(/\be\b/g, '(Math.E)');

  // Variable -> x (engine always uses x internally)
  if (varName && varName !== 'x') {
    const re = new RegExp('\\b' + varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
    s = s.replace(re, 'x');
  }

  return s;
}

export function compileFn(expr, varName = 'x') {
  try {
    const jsExpr = toJSExpr(expr, varName);
    // eslint-disable-next-line no-new-func
    const f = new Function('x', `"use strict"; return (${jsExpr});`);
    // Smoke test
    const probe = f(1);
    if (typeof probe !== 'number') return null;
    return f;
  } catch {
    return null;
  }
}

function safeEval(f, x) {
  try {
    const y = f(x);
    if (typeof y !== 'number') return { y: null, kind: 'invalid' };
    if (isNaN(y)) return { y: null, kind: 'nan' };
    if (y === Infinity) return { y: Infinity, kind: 'pos_inf' };
    if (y === -Infinity) return { y: -Infinity, kind: 'neg_inf' };
    return { y, kind: 'num' };
  } catch {
    return { y: null, kind: 'error' };
  }
}

// ---------------------------------------------------------------------------
// 3. Numerical limit evaluation (always runs)
// ---------------------------------------------------------------------------

// Aitken Δ² acceleration: for a sequence converging to L geometrically
// with ratio r, returns a much better estimate of L than the last sample.
// Returns null if the formula is unstable (denominator near zero).
function aitkenAccelerate(s1, s2, s3) {
  const denom = s3 - 2 * s2 + s1;
  if (!isFinite(denom) || Math.abs(denom) < 1e-15) return null;
  const num = (s2 - s1) ** 2;
  const out = s1 - num / denom;
  if (!isFinite(out)) return null;
  return out;
}

function classifyOneSidedSeq(rows) {
  // rows: [{x, y, kind}], ordered with x progressively closer to target
  const valid = rows.filter(r => r.kind === 'num').map(r => r.y);
  const infCount = rows.filter(r => r.kind === 'pos_inf').length;
  const negInfCount = rows.filter(r => r.kind === 'neg_inf').length;

  // Divergence to ±∞: at least one overflow sample AND the remaining
  // finite samples consistently have the same sign (no contradiction).
  if (infCount >= 2 && negInfCount === 0) {
    if (valid.every(v => v > 0)) {
      return { kind: 'pos_inf', value: Infinity };
    }
  }
  if (negInfCount >= 2 && infCount === 0) {
    if (valid.every(v => v < 0)) {
      return { kind: 'neg_inf', value: -Infinity };
    }
  }
  // Strict majority overrides borderline mixed cases
  if (infCount >= rows.length - 1) return { kind: 'pos_inf', value: Infinity };
  if (negInfCount >= rows.length - 1) return { kind: 'neg_inf', value: -Infinity };

  // Detect divergence: values growing in magnitude consistently with same sign
  if (valid.length >= 4) {
    const tail = valid.slice(-4);
    const allPositive = tail.every(v => v > 0);
    const allNegative = tail.every(v => v < 0);
    let growing = true;
    for (let i = 1; i < tail.length; i++) {
      if (Math.abs(tail[i]) < Math.abs(tail[i - 1]) * 1.5) { growing = false; break; }
    }
    const lastAbs = Math.abs(tail[tail.length - 1]);
    if (growing && lastAbs > 1e4 && (allPositive || allNegative)) {
      return {
        kind: allPositive ? 'pos_inf' : 'neg_inf',
        value: allPositive ? Infinity : -Infinity,
      };
    }
  }

  // Convergence: try Aitken Δ² on the last 3 samples for accurate extrapolation
  if (valid.length >= 3) {
    const n = valid.length;
    const s1 = valid[n - 3];
    const s2 = valid[n - 2];
    const s3 = valid[n - 1];

    // If samples are tightly clustered already, just use s3
    const spread = Math.max(s1, s2, s3) - Math.min(s1, s2, s3);
    const scale = Math.max(1, Math.abs(s3));
    if (spread / scale < 1e-9) return { kind: 'num', value: s3 };

    // Try Aitken
    const accel = aitkenAccelerate(s1, s2, s3);
    if (accel !== null) {
      // Sanity: accelerated value should be in the neighborhood of s3
      // (within 10x the spread) to guard against noise-driven instabilities.
      if (Math.abs(accel - s3) < 10 * spread + 1e-3 * scale) {
        return { kind: 'num', value: accel };
      }
    }
    // Fallback: just use the last sample (closest to the limit point)
    return { kind: 'num', value: s3 };
  }
  if (valid.length > 0) return { kind: 'num', value: valid[valid.length - 1] };
  return { kind: 'undefined', value: NaN };
}

export function evaluateNumeric(expr, varName, target, direction = 'both') {
  const f = compileFn(expr, varName);
  if (!f) return { ok: false, error: 'Could not parse expression', leftRows: [], rightRows: [] };

  const a = parseTargetValue(target);
  if (a !== Infinity && a !== -Infinity && !isFinite(a)) {
    return { ok: false, error: 'Invalid target value', leftRows: [], rightRows: [] };
  }

  // Build sample sequences
  const leftRows = [];
  const rightRows = [];

  if (a === Infinity) {
    for (let k = 1; k <= 7; k++) {
      const x = Math.pow(10, k);
      leftRows.push({ x, ...safeEval(f, x) });
    }
  } else if (a === -Infinity) {
    for (let k = 1; k <= 7; k++) {
      const x = -Math.pow(10, k);
      rightRows.push({ x, ...safeEval(f, x) });
    }
  } else {
    // Cap at 10^-6 to avoid catastrophic floating-point cancellation
    // (e.g. 1 - cos(10^-7) loses precision). 6 samples are enough for
    // both convergence detection and divergence detection.
    for (let k = 1; k <= 6; k++) {
      const eps = Math.pow(10, -k);
      if (direction !== 'right') {
        const x = a - eps;
        leftRows.push({ x, ...safeEval(f, x) });
      }
      if (direction !== 'left') {
        const x = a + eps;
        rightRows.push({ x, ...safeEval(f, x) });
      }
    }
  }

  // Direct substitution attempt (only for finite target, for indeterminate-form detection)
  let directSub = null;
  if (a !== Infinity && a !== -Infinity) {
    directSub = safeEval(f, a);
  }

  // Classify
  let result;
  if (a === Infinity) {
    result = classifyOneSidedSeq(leftRows);
  } else if (a === -Infinity) {
    result = classifyOneSidedSeq(rightRows);
  } else if (direction === 'left') {
    result = classifyOneSidedSeq(leftRows);
  } else if (direction === 'right') {
    result = classifyOneSidedSeq(rightRows);
  } else {
    const L = classifyOneSidedSeq(leftRows);
    const R = classifyOneSidedSeq(rightRows);
    if (L.kind === 'num' && R.kind === 'num') {
      const scale = Math.max(1, Math.abs(L.value), Math.abs(R.value));
      const diff = Math.abs(L.value - R.value);
      // Use a reasonably forgiving tolerance to absorb floating-point noise
      // from sampling at h ~ 10^-5 / 10^-6.
      if (diff < Math.max(1e-5, 1e-3 * scale)) {
        result = { kind: 'num', value: (L.value + R.value) / 2 };
      } else {
        result = { kind: 'dne', value: NaN, left: L.value, right: R.value };
      }
    } else if (L.kind === R.kind) {
      result = L;
    } else {
      result = { kind: 'dne', value: NaN, left: L.value, right: R.value };
    }
  }

  return { ok: true, result, leftRows, rightRows, directSub };
}

// ---------------------------------------------------------------------------
// 4. Symbolic evaluation via nerdamer (best-effort enrichment)
// ---------------------------------------------------------------------------

export async function evaluateSymbolic(expr, varName, target, direction = 'both') {
  const N = await getNerdamer();
  if (!N) return { ok: false, error: 'Engine not available' };
  if (RISKY_FOR_NERDAMER.test(expr)) {
    return { ok: false, error: 'Skipping symbolic engine for this expression (handled numerically)' };
  }

  try {
    const tgt = targetToNerdamer(target);
    let dirArg = '';
    if (direction === 'left') dirArg = ',-1';
    else if (direction === 'right') dirArg = ',1';
    const call = `limit(${expr},${varName},${tgt}${dirArg})`;
    const r = N(call);
    // toString() preserves symbolic form (e.g. "1/2", "e", "pi/4");
    // text() coerces to decimal which we don't want for display.
    const display = r.toString();
    const tex = r.toTeX();

    // Validity heuristic: result should not still contain the variable
    // (means nerdamer couldn't simplify)
    const stillHasVar = new RegExp('\\b' + varName + '\\b').test(display);
    if (stillHasVar) return { ok: false, error: 'Symbolic engine could not simplify' };

    // Reject obviously incomplete results like "ln" or "sin" without args
    if (/^(ln|log|sin|cos|tan|exp|sqrt|sec|csc|cot)$/.test(display)) {
      return { ok: false, error: 'Incomplete symbolic answer' };
    }

    // Try to coerce to number for cross-check
    let numVal = null;
    try {
      const ev = N(display).evaluate();
      const num = Number(ev.text());
      if (!isNaN(num)) numVal = num;
    } catch {}
    if (numVal === null) {
      if (/^Infinity$/i.test(display)) numVal = Infinity;
      else if (/^-Infinity$/.test(display)) numVal = -Infinity;
    }

    return { ok: true, text: display, tex, numVal };
  } catch (e) {
    return { ok: false, error: e.message || 'Symbolic engine error' };
  }
}

// ---------------------------------------------------------------------------
// 5. Closed-form recognition for numerical results
// ---------------------------------------------------------------------------

const KNOWN_CONSTANTS = [
  { val: Math.E, txt: 'e', tex: 'e' },
  { val: -Math.E, txt: '-e', tex: '-e' },
  { val: Math.PI, txt: 'π', tex: '\\pi' },
  { val: -Math.PI, txt: '-π', tex: '-\\pi' },
  { val: 2 * Math.PI, txt: '2π', tex: '2\\pi' },
  { val: Math.PI / 2, txt: 'π/2', tex: '\\frac{\\pi}{2}' },
  { val: Math.PI / 3, txt: 'π/3', tex: '\\frac{\\pi}{3}' },
  { val: Math.PI / 4, txt: 'π/4', tex: '\\frac{\\pi}{4}' },
  { val: Math.PI / 6, txt: 'π/6', tex: '\\frac{\\pi}{6}' },
  { val: 1 / Math.E, txt: '1/e', tex: '\\frac{1}{e}' },
  { val: Math.LN2, txt: 'ln(2)', tex: '\\ln(2)' },
  { val: Math.LN10, txt: 'ln(10)', tex: '\\ln(10)' },
  { val: Math.SQRT2, txt: '√2', tex: '\\sqrt{2}' },
  { val: Math.SQRT1_2, txt: '√2/2', tex: '\\frac{\\sqrt{2}}{2}' },
];

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function recognizeFraction(y) {
  if (!isFinite(y)) return null;
  if (Math.abs(y - Math.round(y)) < RECOG_TOL) return null; // integer, no fraction
  for (let d = 2; d <= 100; d++) {
    const n = Math.round(y * d);
    if (n === 0) continue;
    if (Math.abs(y - n / d) < RECOG_TOL) {
      const g = gcd(Math.abs(n), d);
      const nn = n / g, dd = d / g;
      if (dd === 1) return null;
      return { num: nn, den: dd, txt: `${nn}/${dd}`, tex: `\\frac{${nn}}{${dd}}` };
    }
  }
  return null;
}

export function formatNumber(y) {
  if (y === Infinity) return '∞';
  if (y === -Infinity) return '-∞';
  if (Math.abs(y - Math.round(y)) < TOL) return String(Math.round(y));
  return Number(y.toFixed(10)).toString();
}

export function recognizeClosedForm(y) {
  if (!isFinite(y)) {
    if (y === Infinity) return { txt: '∞', tex: '\\infty' };
    if (y === -Infinity) return { txt: '-∞', tex: '-\\infty' };
    return null;
  }
  // Integer (with practical tolerance)
  if (Math.abs(y - Math.round(y)) < RECOG_TOL) {
    const n = Math.round(y);
    return { txt: String(n), tex: String(n) };
  }
  // Known constant
  for (const c of KNOWN_CONSTANTS) {
    if (Math.abs(y - c.val) < RECOG_TOL) return { txt: c.txt, tex: c.tex };
  }
  // Simple fraction
  const f = recognizeFraction(y);
  if (f) return { txt: f.txt, tex: f.tex };
  // Multiples of π
  for (let d = 2; d <= 12; d++) {
    const k = y / (Math.PI / d);
    if (Math.abs(k - Math.round(k)) < RECOG_TOL && Math.abs(Math.round(k)) <= 12) {
      const num = Math.round(k);
      if (num === 0) continue;
      const g = gcd(Math.abs(num), d);
      const nn = num / g, dd = d / g;
      if (dd === 1) {
        if (nn === 1) return { txt: 'π', tex: '\\pi' };
        if (nn === -1) return { txt: '-π', tex: '-\\pi' };
        return { txt: `${nn}π`, tex: `${nn}\\pi` };
      }
      const sign = nn < 0 ? '-' : '';
      const absNum = Math.abs(nn);
      const numStr = absNum === 1 ? '\\pi' : `${absNum}\\pi`;
      return { txt: `${sign}${absNum === 1 ? '' : absNum}π/${dd}`, tex: `${sign}\\frac{${numStr}}{${dd}}` };
    }
  }
  // Default: rounded decimal
  const rounded = Number(y.toFixed(10));
  return { txt: rounded.toString(), tex: rounded.toString() };
}

// ---------------------------------------------------------------------------
// 6. Indeterminate form detection
// ---------------------------------------------------------------------------

export function detectForm(expr, directSub, target) {
  // directSub is the result of substituting target into f at the limit point
  // (only meaningful for finite target). For ∞/∞ etc, infer differently.
  if (target === Infinity || target === -Infinity) {
    // We don't have direct substitution; report based on heuristic
    // Look for x in numerator and denominator
    const slash = expr.indexOf('/');
    if (slash > -1) {
      // Crude: if expr is rational at infinity, it's potentially ∞/∞
      return { form: 'inf/inf', label: '∞/∞ indeterminate (limit at infinity)' };
    }
    return { form: 'inf', label: 'Limit at infinity' };
  }
  if (!directSub) return { form: 'unknown', label: 'Could not classify' };
  if (directSub.kind === 'num' && isFinite(directSub.y)) {
    return { form: 'definite', label: 'Direct substitution defined', value: directSub.y };
  }
  if (directSub.kind === 'nan') {
    // Likely 0/0 or 0·∞ or ∞−∞ — try to detect 0/0 via syntactic check
    if (/\//.test(expr)) {
      return { form: '0/0', label: '0/0 indeterminate' };
    }
    return { form: 'indeterminate', label: 'Indeterminate form' };
  }
  if (directSub.kind === 'pos_inf' || directSub.kind === 'neg_inf') {
    return { form: 'inf', label: 'Diverges to infinity at this point' };
  }
  return { form: 'unknown', label: 'Could not classify' };
}

// ---------------------------------------------------------------------------
// 7. Step-by-step solution generator
// ---------------------------------------------------------------------------

export function generateSteps(input) {
  const { expr, varName, target, direction, numericResult, symbolicResult, directSub } = input;
  const steps = [];
  const tgtTeX = targetToLatex(target);
  const dirSym = direction === 'left' ? '^-' : direction === 'right' ? '^+' : '';
  const exprTeX = exprToTeX(expr);

  steps.push({
    title: 'Set up the limit',
    explanation: `We want to evaluate this limit as ${varName} approaches ${formatTargetTextual(target)}${direction !== 'both' ? ` from the ${direction}` : ''}.`,
    tex: `\\lim_{${varName}\\to ${tgtTeX}${dirSym}} ${exprTeX}`,
  });

  // Step 2: form detection
  if (target === Infinity || target === -Infinity) {
    steps.push({
      title: 'Identify the type',
      explanation: `Since ${varName} \u2192 ${target === Infinity ? '\u221e' : '-\u221e'}, this is a limit at infinity. We analyze the dominant behavior of the function as ${varName} grows without bound.`,
    });
  } else if (directSub && directSub.kind === 'num') {
    steps.push({
      title: 'Try direct substitution',
      explanation: `Substituting ${varName} = ${formatTargetTextual(target)} directly into the function produces a finite value, so the limit equals that value.`,
      tex: `${exprTeX}\\Big|_{${varName}=${tgtTeX}} = ${formatNumber(directSub.y)}`,
    });
  } else if (directSub) {
    const formInfo = detectForm(expr, directSub, target);
    steps.push({
      title: 'Try direct substitution',
      explanation: `Substituting ${varName} = ${formatTargetTextual(target)} produces an indeterminate form (${formInfo.label}). We need an algebraic technique to evaluate it.`,
    });
  }

  // Step 3: method
  let method = 'numerical';
  if (symbolicResult && symbolicResult.ok) {
    // Pick method label based on form
    const formInfo = detectForm(expr, directSub, target);
    if (formInfo.form === '0/0' && /\//.test(expr)) method = 'factoring or L\'Hôpital\'s rule';
    else if (formInfo.form === 'inf/inf') method = 'rational function analysis or L\'Hôpital\'s rule';
    else if (target === Infinity || target === -Infinity) method = 'asymptotic / L\'Hôpital analysis';
    else method = 'algebraic simplification';

    steps.push({
      title: 'Apply the method',
      explanation: `Using ${method}, the symbolic engine simplifies the expression and evaluates the limit.`,
    });
  } else {
    steps.push({
      title: 'Numerical evaluation',
      explanation: `We evaluate the function at points ${varName} approaching ${formatTargetTextual(target)} from ${direction === 'both' ? 'both sides' : `the ${direction}`}, then check that the values converge.`,
    });
  }

  // Step 4: final answer
  let finalTeX = '';
  let finalTxt = '';
  if (numericResult.kind === 'dne') {
    finalTeX = '\\text{Does not exist (DNE)}';
    finalTxt = 'Does not exist (DNE)';
  } else if (numericResult.kind === 'pos_inf') {
    finalTeX = '\\infty';
    finalTxt = '∞';
  } else if (numericResult.kind === 'neg_inf') {
    finalTeX = '-\\infty';
    finalTxt = '-∞';
  } else {
    const cf = recognizeClosedForm(numericResult.value);
    finalTeX = symbolicResult && symbolicResult.ok && symbolicResult.tex ? symbolicResult.tex : cf.tex;
    finalTxt = symbolicResult && symbolicResult.ok ? symbolicResult.text : cf.txt;
  }

  steps.push({
    title: 'Final answer',
    explanation: numericResult.kind === 'dne'
      ? `The left-hand limit (${formatNumber(numericResult.left)}) and the right-hand limit (${formatNumber(numericResult.right)}) disagree, so the two-sided limit does not exist.`
      : `The limit evaluates to ${finalTxt}.`,
    tex: `\\lim_{${varName}\\to ${tgtTeX}${dirSym}} ${exprTeX} = ${finalTeX}`,
  });

  return { steps, finalTeX, finalTxt };
}

function formatTargetTextual(t) {
  if (t === Infinity) return '\u221e';
  if (t === -Infinity) return '-\u221e';
  if (Math.abs(t - Math.PI) < TOL) return 'π';
  if (Math.abs(t - Math.E) < TOL) return 'e';
  return formatNumber(t);
}

// Quick LaTeX-ifier for the user expression (best-effort, not a full parser)
export function exprToTeX(expr) {
  let s = expr;
  // sqrt(x) -> \sqrt{x}  (greedy match parens)
  s = s.replace(/\bsqrt\(([^()]+)\)/g, '\\sqrt{$1}');
  s = s.replace(/\bln\(([^()]+)\)/g, '\\ln($1)');
  s = s.replace(/\blog10\(([^()]+)\)/g, '\\log_{10}($1)');
  s = s.replace(/\blog2\(([^()]+)\)/g, '\\log_{2}($1)');
  s = s.replace(/\blog\(([^()]+)\)/g, '\\log($1)');
  s = s.replace(/\bexp\(([^()]+)\)/g, 'e^{$1}');
  s = s.replace(/\b(sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|asin|acos|atan)\(/g, '\\$1(');
  s = s.replace(/\babs\(([^()]+)\)/g, '\\left|$1\\right|');
  s = s.replace(/\bpi\b/g, '\\pi');
  s = s.replace(/\*/g, ' \\cdot ');
  // fraction: a/b where a, b are simple — for safety we keep / as plain text
  // Convert simple ^n into ^{n}
  s = s.replace(/\^([a-zA-Z0-9]+)/g, '^{$1}');
  s = s.replace(/\^\(([^()]+)\)/g, '^{$1}');
  return s;
}

// ---------------------------------------------------------------------------
// 8. Plot data sampler
// ---------------------------------------------------------------------------

export function samplePlot(expr, varName, target, options = {}) {
  const f = compileFn(expr, varName);
  if (!f) return { points: [], xMin: 0, xMax: 0 };

  const { points = 200 } = options;
  const a = parseTargetValue(target);

  let xMin, xMax;
  if (a === Infinity) {
    xMin = 1;
    xMax = 100;
  } else if (a === -Infinity) {
    xMin = -100;
    xMax = -1;
  } else {
    const span = Math.max(2, Math.abs(a) * 0.3 || 2);
    xMin = a - span;
    xMax = a + span;
  }

  const result = [];
  const dx = (xMax - xMin) / (points - 1);
  for (let i = 0; i < points; i++) {
    const x = xMin + i * dx;
    const { y, kind } = safeEval(f, x);
    if (kind === 'num' && isFinite(y) && Math.abs(y) < 1e8) {
      result.push({ x: Number(x.toFixed(6)), y: Number(y.toFixed(6)) });
    } else {
      // Skip undefined/divergent points so Recharts breaks the line
      result.push({ x: Number(x.toFixed(6)), y: null });
    }
  }
  return { points: result, xMin, xMax };
}

// ---------------------------------------------------------------------------
// 9. Top-level: solve()
// ---------------------------------------------------------------------------

export async function solve(rawInput, varName, rawTarget, direction = 'both') {
  const expr = normalize(rawInput);
  const target = parseTargetValue(rawTarget);

  if (!expr) return { ok: false, error: 'Please enter an expression.' };
  if (target !== Infinity && target !== -Infinity && !isFinite(target)) {
    return { ok: false, error: 'Please enter a valid target value (number, ∞, -∞, π, or e).' };
  }
  if (!varName || !/^[a-zA-Z]\w*$/.test(varName)) {
    return { ok: false, error: 'Variable name must be a letter (default x).' };
  }

  const numeric = evaluateNumeric(expr, varName, target, direction);
  if (!numeric.ok) return { ok: false, error: numeric.error };

  const symbolic = await evaluateSymbolic(expr, varName, target, direction);

  // Cross-check: if symbolic and numeric disagree significantly, prefer numeric
  let warning = null;
  if (symbolic.ok && symbolic.numVal !== null) {
    const numK = numeric.result.kind;
    const symV = symbolic.numVal;
    const numV = numeric.result.value;

    // Sign-mismatch on infinities (e.g. nerdamer says +∞, numerical says -∞)
    const symPosInf = symV === Infinity;
    const symNegInf = symV === -Infinity;
    const symFinite = isFinite(symV);
    if (numK === 'pos_inf' && symNegInf) {
      warning = 'Symbolic engine reported -∞ but numerical evaluation diverges to +∞. Using numerical result.';
    } else if (numK === 'neg_inf' && symPosInf) {
      warning = 'Symbolic engine reported +∞ but numerical evaluation diverges to -∞. Using numerical result.';
    } else if (numK === 'dne' && (symPosInf || symNegInf || symFinite)) {
      warning = 'Symbolic engine returned a value but the limit does not exist (left- and right-hand limits disagree). Using numerical result.';
    } else if (numK === 'num' && symFinite) {
      const diff = Math.abs(symV - numV);
      const scale = Math.max(1, Math.abs(numV));
      if (diff / scale > 1e-4) {
        warning = `Symbolic engine returned ${formatNumber(symV)} but numerical evaluation gave ${formatNumber(numV)}. Using numerical result.`;
      }
    } else if (numK === 'num' && (symPosInf || symNegInf)) {
      warning = `Symbolic engine reported ${symPosInf ? '+∞' : '-∞'} but numerical evaluation converges to ${formatNumber(numV)}. Using numerical result.`;
    }
  }

  // Build display answer
  let displayTxt, displayTeX, method;
  if (numeric.result.kind === 'dne') {
    displayTxt = 'Does not exist (DNE)';
    displayTeX = '\\text{Does not exist}';
    method = 'Left- and right-hand limits disagree';
  } else if (numeric.result.kind === 'pos_inf') {
    displayTxt = '∞';
    displayTeX = '\\infty';
    method = 'Diverges to +∞';
  } else if (numeric.result.kind === 'neg_inf') {
    displayTxt = '-∞';
    displayTeX = '-\\infty';
    method = 'Diverges to -∞';
  } else if (numeric.result.kind === 'undefined') {
    displayTxt = 'Undefined';
    displayTeX = '\\text{Undefined}';
    method = 'Function is undefined near the limit point';
  } else {
    const cf = recognizeClosedForm(numeric.result.value);
    if (symbolic.ok && !warning) {
      displayTxt = symbolic.text;
      displayTeX = symbolic.tex;
      method = 'Symbolic CAS evaluation (verified numerically)';
    } else {
      displayTxt = cf.txt;
      displayTeX = cf.tex;
      method = warning ? 'Numerical evaluation' : 'Numerical convergence';
    }
  }

  const formInfo = detectForm(expr, numeric.directSub, target);
  const stepsResult = generateSteps({
    expr,
    varName,
    target,
    direction,
    numericResult: numeric.result,
    symbolicResult: symbolic,
    directSub: numeric.directSub,
  });
  const plot = samplePlot(expr, varName, target);

  return {
    ok: true,
    expr,
    varName,
    target,
    direction,
    displayTxt,
    displayTeX,
    method,
    formInfo,
    warning,
    steps: stepsResult.steps,
    leftRows: numeric.leftRows,
    rightRows: numeric.rightRows,
    numericValue: numeric.result.value,
    numericKind: numeric.result.kind,
    plot,
    inputTeX: exprToTeX(expr),
  };
}
