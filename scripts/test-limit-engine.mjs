// Comprehensive sanity test for the limit engine.
// Run with: node scripts/test-limit-engine.mjs
import { createRequire } from 'module';
const r = createRequire(import.meta.url);
globalThis.__nerdamer__ = r('nerdamer/all.min');
globalThis.window = globalThis;

const { solve, parseTargetValue, normalize, toJSExpr, compileFn } = await import(
  '../src/lib/limit-engine.js'
);

const cases = [
  // Direct substitution
  ['x^2 at 3', 'x^2', 'x', '3', 'both', '9'],
  ['polynomial at 2', '2*x+5', 'x', '2', 'both', '9'],

  // 0/0 indeterminate (factor)
  ['(x^2-4)/(x-2) at 2', '(x^2-4)/(x-2)', 'x', '2', 'both', '4'],
  ['(x^3-1)/(x-1) at 1', '(x^3-1)/(x-1)', 'x', '1', 'both', '3'],
  ['(x^2-9)/(x-3) at 3', '(x^2-9)/(x-3)', 'x', '3', 'both', '6'],

  // 0/0 with conjugate
  ['(sqrt(x+1)-1)/x at 0', '(sqrt(x+1)-1)/x', 'x', '0', 'both', '1/2'],

  // Special trig limits
  ['sin(x)/x at 0', 'sin(x)/x', 'x', '0', 'both', '1'],
  ['sin(3x)/x at 0', 'sin(3*x)/x', 'x', '0', 'both', '3'],
  ['tan(x)/x at 0', 'tan(x)/x', 'x', '0', 'both', '1'],
  ['(1-cos(x))/x^2 at 0', '(1-cos(x))/x^2', 'x', '0', 'both', '1/2'],
  ['(1-cos(x))/x at 0', '(1-cos(x))/x', 'x', '0', 'both', '0'],

  // Exponential / log limits
  ['(e^x-1)/x at 0', '(e^x-1)/x', 'x', '0', 'both', '1'],
  ['(1+1/x)^x at infinity', '(1+1/x)^x', 'x', 'infinity', 'both', 'e'],
  ['ln(x)/x at infinity', 'ln(x)/x', 'x', 'infinity', 'both', '0'],
  ['ln(1+x)/x at 0', 'ln(1+x)/x', 'x', '0', 'both', '1'],

  // Limits at infinity (rational)
  ['(2x^2+3x)/(x^2+1) at inf', '(2*x^2+3*x)/(x^2+1)', 'x', 'infinity', 'both', '2'],
  ['x/(x^2+1) at inf', 'x/(x^2+1)', 'x', 'infinity', 'both', '0'],
  ['x^2/(x+1) at inf', 'x^2/(x+1)', 'x', 'infinity', 'both', '∞'],

  // One-sided
  ['1/x at 0+', '1/x', 'x', '0', 'right', '∞'],
  ['1/x at 0-', '1/x', 'x', '0', 'left', '-∞'],
  ['1/(x-2) at 2-', '1/(x-2)', 'x', '2', 'left', '-∞'],
  ['1/(x-2) at 2+', '1/(x-2)', 'x', '2', 'right', '∞'],

  // L'Hopital (∞/∞ at infinity)
  ['x/e^x at inf', 'x/e^x', 'x', 'infinity', 'both', '0'],
  ['e^x/x at inf', 'e^x/x', 'x', 'infinity', 'both', '∞'],

  // Squeeze theorem
  ['x*sin(1/x) at 0', 'x*sin(1/x)', 'x', '0', 'both', '0'],
];

let pass = 0, fail = 0;
for (const [name, expr, v, tgt, dir, expected] of cases) {
  const res = await solve(expr, v, tgt, dir);
  if (!res.ok) {
    fail++;
    console.log(`FAIL ${name}: ERROR -> ${res.error}`);
  } else {
    const got = String(res.displayTxt);
    const ok = got.includes(expected) || expected.includes(got)
      || (expected === '∞' && got === '∞')
      || (expected === '-∞' && got === '-∞');
    if (ok) {
      pass++;
      console.log(`PASS ${name.padEnd(40)} => ${got}`);
    } else {
      fail++;
      console.log(`FAIL ${name.padEnd(40)} => ${got}  (expected ${expected})`);
    }
    if (res.warning) console.log(`     warn: ${res.warning}`);
  }
}

console.log(`\n${pass} pass, ${fail} fail (out of ${cases.length})`);
process.exit(fail === 0 ? 0 : 1);
