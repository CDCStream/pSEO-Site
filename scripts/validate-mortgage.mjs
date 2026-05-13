// One-shot validation gate for src/lib/mortgage.js
// Run: node scripts/validate-mortgage.mjs

import { monthlyPI, buildSchedule, biWeeklySavings, summarize } from '../src/lib/mortgage.js';

let failures = 0;
function check(name, actual, expected, tolerance = 0.005) {
  const ok = Math.abs(actual - expected) <= tolerance;
  const status = ok ? 'OK ' : 'FAIL';
  if (!ok) failures += 1;
  const a = typeof actual === 'number' ? actual.toFixed(4) : String(actual);
  const e = typeof expected === 'number' ? expected.toFixed(4) : String(expected);
  console.log(`  [${status}] ${name}: actual=${a}  expected=${e}`);
}

console.log('\n--- Test 1: $200,000 / 5.000% APR / 30 yr ---');
{
  const M = monthlyPI({ principal: 200000, annualRatePct: 5, termYears: 30 });
  check('Monthly P&I', M, 1073.64, 0.01);
}

console.log('\n--- Test 2: $320,000 / 6.500% APR / 30 yr ---');
{
  const M = monthlyPI({ principal: 320000, annualRatePct: 6.5, termYears: 30 });
  check('Monthly P&I', M, 2022.62, 0.01);
}

console.log('\n--- Test 3: Schedule integrity ($300K / 6% / 30y, no extras) ---');
{
  const { schedule, meta } = buildSchedule({
    homeValue: 400000,
    loanAmount: 300000,
    annualRatePct: 6,
    termYears: 30,
    loanType: 'Conventional',
    pmiRatePct: 0,
    propertyTax: 0,
    homeInsurance: 0,
    hoa: 0,
    startDate: new Date(2026, 0, 1),
  });
  check('Schedule length', schedule.length, 360, 0);
  check('Last ending balance', schedule[schedule.length - 1].endingBalance, 0, 0.01);
  const sumInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const sumPrincipal = schedule.reduce((s, r) => s + r.principal, 0);
  check('Sum of principal payments', sumPrincipal, 300000, 0.01);
  check('M*n - P matches sum interest', sumInterest, meta.piMonthly * 360 - 300000, 0.05);
  check('Total interest in meta', meta.totalInterest, sumInterest, 0.001);
  check('LTV', meta.ltv, 0.75, 0.0001);
  check('PMI initially required (75% LTV)', meta.pmiInitiallyRequired ? 1 : 0, 0, 0);
}

console.log('\n--- Test 4: PMI drop-off ($400K home / 10% down / 6% / 30y / 0.5% PMI) ---');
{
  const { schedule, meta } = buildSchedule({
    homeValue: 400000,
    loanAmount: 360000,
    annualRatePct: 6,
    termYears: 30,
    loanType: 'Conventional',
    pmiRatePct: 0.5,
    propertyTax: 0,
    homeInsurance: 0,
    hoa: 0,
    startDate: new Date(2026, 0, 1),
  });
  check('PMI initially required', meta.pmiInitiallyRequired ? 1 : 0, 1, 0);
  // PMI drops the first month balance/home <= 0.80 -> balance <= 320,000
  // Verify the drop month matches independent recomputation
  let bal = 360000;
  const r = 0.06 / 12;
  const M = meta.piMonthly;
  let expectedDrop = -1;
  for (let i = 1; i <= 360; i++) {
    const interest = bal * r;
    const principal = i === 360 ? bal : M - interest;
    bal = Math.max(0, bal - principal);
    if (bal / 400000 <= 0.8 && expectedDrop === -1) {
      expectedDrop = i;
      break;
    }
  }
  check('PMI drop month matches independent calc', meta.pmiDropMonth, expectedDrop, 0);
  // pmiDropMonth is the first month with LTV <= 0.80 (and therefore the
  // first month no PMI is charged), so PMI is paid for (expectedDrop - 1)
  // months: 1..expectedDrop-1.
  const pmiMonthsPaid = expectedDrop - 1;
  const pmiMonths = schedule.filter((row) => row.pmi > 0).length;
  check('PMI months paid count', pmiMonths, pmiMonthsPaid, 0);
  check('Total PMI paid', meta.totalPMI, pmiMonthsPaid * (360000 * 0.005 / 12), 0.01);
}

console.log('\n--- Test 5: Property-tax % vs $ convention ---');
{
  // input <= 20 means percent of home value
  const a = buildSchedule({
    homeValue: 500000,
    loanAmount: 400000,
    annualRatePct: 6,
    termYears: 30,
    loanType: 'Conventional',
    pmiRatePct: 0,
    propertyTax: 1.2, // -> 1.2% of $500K = $6,000/yr = $500/mo
    homeInsurance: 0,
    hoa: 0,
  });
  check('Monthly tax (1.2% of $500K)', a.meta.monthlyTax, 500, 0.001);

  // input > 20 means absolute annual dollar amount
  const b = buildSchedule({
    homeValue: 500000,
    loanAmount: 400000,
    annualRatePct: 6,
    termYears: 30,
    loanType: 'Conventional',
    pmiRatePct: 0,
    propertyTax: 6000, // -> $6,000/yr = $500/mo
    homeInsurance: 0,
    hoa: 0,
  });
  check('Monthly tax ($6,000/yr)', b.meta.monthlyTax, 500, 0.001);
}

console.log('\n--- Test 6: Bi-weekly savings (200K / 5% / 30y) ---');
{
  const M = monthlyPI({ principal: 200000, annualRatePct: 5, termYears: 30 });
  const bw = biWeeklySavings({ loanAmount: 200000, annualRatePct: 5, termYears: 30, monthlyPiBaseline: M });
  // The well-known result is roughly 5-6 years saved on a 30-year 5% loan.
  // Expect roughly 295-310 months total payoff (about 25 years).
  if (!(bw.monthsToPayoff > 280 && bw.monthsToPayoff < 320)) {
    failures += 1;
    console.log(`  [FAIL] Bi-weekly months in expected band: actual=${bw.monthsToPayoff}`);
  } else {
    console.log(`  [OK ] Bi-weekly months in expected band: actual=${bw.monthsToPayoff}`);
  }
  // Interest saved roughly $30k-$40k for this scenario.
  if (!(bw.interestSaved > 25000 && bw.interestSaved < 50000)) {
    failures += 1;
    console.log(`  [FAIL] Interest saved in expected band: actual=${bw.interestSaved.toFixed(2)}`);
  } else {
    console.log(`  [OK ] Interest saved in expected band: actual=${bw.interestSaved.toFixed(2)}`);
  }
}

console.log('\n--- Test 7: Annual summary roll-up ---');
{
  const { schedule } = buildSchedule({
    homeValue: 400000,
    loanAmount: 300000,
    annualRatePct: 6,
    termYears: 30,
    loanType: 'Conventional',
    pmiRatePct: 0,
    propertyTax: 0,
    homeInsurance: 0,
    hoa: 0,
    startDate: new Date(2026, 0, 1),
  });
  const years = summarize(schedule);
  check('Year count', years.length, 30, 0);
  check('Months in first year', years[0].months.length, 12, 0);
  check('Last-year ending balance', years[29].endingBalance, 0, 0.01);
}

console.log('\n--- Test 8: Zero-rate edge case ---');
{
  const M = monthlyPI({ principal: 120000, annualRatePct: 0, termYears: 10 });
  check('Zero-rate $120K / 0% / 10y', M, 1000, 0.001);
}

console.log(`\n========================================`);
if (failures > 0) {
  console.error(`${failures} ASSERTION(S) FAILED`);
  process.exit(1);
}
console.log('All assertions passed.');
