// Statistical CDF functions for p-value calculator.
// Implementations based on Numerical Recipes in C (3rd ed.) and
// Abramowitz & Stegun, Handbook of Mathematical Functions.
// All functions return values in [0, 1] (probabilities) or [-Infinity, +Infinity] for log-gamma.

const SQRT_2 = Math.SQRT2;
const SQRT_PI = Math.sqrt(Math.PI);

// Error function (Abramowitz & Stegun 7.1.26), max error ~ 1.5e-7.
export function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y = 1 - (((((
    1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-ax * ax);
  return sign * y;
}

export function erfc(x) {
  return 1 - erf(x);
}

// Log-gamma via Lanczos approximation (g = 7, n = 9), max error ~ 2e-10.
const LANCZOS_G = 7;
const LANCZOS_COEF = [
  0.99999999999980993,
  676.5203681218851,
  -1259.1392167224028,
  771.32342877765313,
  -176.61502916214059,
  12.507343278686905,
  -0.13857109526572012,
  9.9843695780195716e-6,
  1.5056327351493116e-7,
];

export function gammaLn(x) {
  if (x < 0.5) {
    // Reflection: Γ(x)Γ(1-x) = π / sin(πx)
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - gammaLn(1 - x);
  }
  const z = x - 1;
  let a = LANCZOS_COEF[0];
  for (let i = 1; i < LANCZOS_COEF.length; i++) {
    a += LANCZOS_COEF[i] / (z + i);
  }
  const t = z + LANCZOS_G + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

// Regularized lower incomplete gamma P(s, x) = γ(s, x) / Γ(s).
// Uses series expansion for x < s + 1, continued fraction otherwise.
export function regularizedGammaP(s, x) {
  if (x < 0 || s <= 0) return NaN;
  if (x === 0) return 0;
  if (x < s + 1) return gammaSeries(s, x);
  return 1 - gammaContinuedFraction(s, x);
}

export function regularizedGammaQ(s, x) {
  return 1 - regularizedGammaP(s, x);
}

function gammaSeries(s, x) {
  const ITMAX = 200;
  const EPS = 1e-15;
  const lnGammaS = gammaLn(s);
  let ap = s;
  let sum = 1 / s;
  let del = sum;
  for (let n = 1; n <= ITMAX; n++) {
    ap += 1;
    del *= x / ap;
    sum += del;
    if (Math.abs(del) < Math.abs(sum) * EPS) {
      return sum * Math.exp(-x + s * Math.log(x) - lnGammaS);
    }
  }
  return sum * Math.exp(-x + s * Math.log(x) - lnGammaS);
}

function gammaContinuedFraction(s, x) {
  const ITMAX = 200;
  const EPS = 1e-15;
  const FPMIN = 1e-300;
  const lnGammaS = gammaLn(s);
  let b = x + 1 - s;
  let c = 1 / FPMIN;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i <= ITMAX; i++) {
    const an = -i * (i - s);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = b + an / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return Math.exp(-x + s * Math.log(x) - lnGammaS) * h;
}

// Regularized incomplete beta I_x(a, b) — Lentz's continued fraction with
// the symmetry I_x(a, b) = 1 - I_{1-x}(b, a) used to keep convergence fast.
export function ibeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const lnBeta = gammaLn(a) + gammaLn(b) - gammaLn(a + b);
  const logFront = a * Math.log(x) + b * Math.log(1 - x) - lnBeta;
  const front = Math.exp(logFront);
  if (x < (a + 1) / (a + b + 2)) {
    return (front * betaContinuedFraction(x, a, b)) / a;
  }
  return 1 - (front * betaContinuedFraction(1 - x, b, a)) / b;
}

function betaContinuedFraction(x, a, b) {
  const ITMAX = 300;
  const EPS = 1e-15;
  const FPMIN = 1e-300;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= ITMAX; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

// Standard normal CDF: Φ(z) = 0.5 * (1 + erf(z / √2)).
export function normalCdf(z) {
  return 0.5 * (1 + erf(z / SQRT_2));
}

// Student's t-distribution CDF for `df` degrees of freedom (df > 0).
// cdf_t(t, df) = 1 - 0.5 * I_{df/(df+t^2)}(df/2, 1/2), reflected for negative t.
export function tCdf(t, df) {
  if (df <= 0) return NaN;
  if (t === 0) return 0.5;
  const x = df / (df + t * t);
  const half = 0.5 * ibeta(x, df / 2, 0.5);
  return t > 0 ? 1 - half : half;
}

// Chi-square CDF: P(df/2, x/2).
export function chi2Cdf(x, df) {
  if (df <= 0) return NaN;
  if (x <= 0) return 0;
  return regularizedGammaP(df / 2, x / 2);
}

// F-distribution CDF: I_{(d1*x)/(d1*x + d2)}(d1/2, d2/2).
export function fCdf(x, d1, d2) {
  if (d1 <= 0 || d2 <= 0) return NaN;
  if (x <= 0) return 0;
  const num = d1 * x;
  const t = num / (num + d2);
  return ibeta(t, d1 / 2, d2 / 2);
}

// === P-value helpers ============================================================
// `tail` is one of 'two', 'left', 'right'.

function pValueFromCdf(cdf, { symmetric = false }) {
  return (tail) => {
    if (tail === 'left') return cdf;
    if (tail === 'right') return 1 - cdf;
    if (symmetric) {
      // For symmetric distributions, two-tailed = 2 * min(cdf, 1 - cdf).
      return 2 * Math.min(cdf, 1 - cdf);
    }
    return 2 * Math.min(cdf, 1 - cdf);
  };
}

export function pValueZ(z, tail) {
  const cdf = normalCdf(z);
  return pValueFromCdf(cdf, { symmetric: true })(tail);
}

export function pValueT(t, df, tail) {
  const cdf = tCdf(t, df);
  return pValueFromCdf(cdf, { symmetric: true })(tail);
}

export function pValueChi2(x, df, tail) {
  const cdf = chi2Cdf(x, df);
  return pValueFromCdf(cdf, { symmetric: false })(tail);
}

export function pValueF(x, d1, d2, tail) {
  const cdf = fCdf(x, d1, d2);
  return pValueFromCdf(cdf, { symmetric: false })(tail);
}
