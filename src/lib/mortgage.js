// Pure-JS mortgage math, no DOM, no React. Used by both the client UI
// and the offline validation script (scripts/validate-mortgage.js).
//
// All monetary values are in unit-agnostic dollars (or any single currency
// the caller picks; conversion is purely a display concern).

/**
 * Monthly principal + interest payment using the standard amortising loan
 * formula. Returns 0 for non-positive principal or term, and falls back to
 * straight-line P/n for the zero-rate edge case.
 */
export function monthlyPI({ principal, annualRatePct, termYears }) {
  const P = Number(principal);
  const r = Number(annualRatePct) / 100 / 12;
  const n = Math.round(Number(termYears) * 12);
  if (!(P > 0) || !(n > 0)) return 0;
  if (!Number.isFinite(r) || r <= 0) return P / n;
  const pow = Math.pow(1 + r, n);
  return (P * r * pow) / (pow - 1);
}

/**
 * Build a full month-by-month amortisation schedule. PMI (if applicable) is
 * dropped automatically the first month the loan-to-value ratio reaches 80%
 * or below, which matches US conventional-loan practice.
 *
 * Returns:
 *   schedule: Array<{ month, date, interest, principal, pmi, tax, insurance,
 *                     hoa, total, endingBalance, cumulativeInterest,
 *                     cumulativePrincipal, cumulativeTotalPaid }>
 *   meta:     { piMonthly, n, ltv, pmiInitiallyRequired, pmiDropMonth,
 *               monthlyTax, monthlyInsurance, monthlyHoa,
 *               firstMonthlyPmi, totalInterest, totalPMI, totalTax,
 *               totalInsurance, totalHoa, grandTotalPaid, payoffDate }
 */
export function buildSchedule({
  homeValue,
  loanAmount,
  annualRatePct,
  termYears,
  loanType = 'Conventional',
  pmiRatePct = 0.5,
  propertyTax = 0,
  homeInsurance = 0,
  hoa = 0,
  startDate = new Date(),
}) {
  const P = Number(loanAmount);
  const home = Number(homeValue);
  const r = Number(annualRatePct) / 100 / 12;
  const n = Math.round(Number(termYears) * 12);
  const piMonthly = monthlyPI({ principal: P, annualRatePct, termYears });

  const ltv = home > 0 ? P / home : 0;
  const pmiInitiallyRequired = loanType === 'Conventional' && ltv > 0.8;

  // Property tax convention: input <= 20 -> percent of home value, otherwise
  // treated as an absolute annual dollar amount. Matches the help text on
  // mortgagecalculator.org.
  const ptInput = Number(propertyTax) || 0;
  const annualTax = ptInput <= 20 ? home * (ptInput / 100) : ptInput;
  const monthlyTax = annualTax / 12;
  const monthlyInsurance = (Number(homeInsurance) || 0) / 12;
  const monthlyHoa = Number(hoa) || 0;
  const annualPmi = pmiInitiallyRequired ? P * (Number(pmiRatePct) / 100) : 0;
  const firstMonthlyPmi = annualPmi / 12;

  const start = startDate instanceof Date ? new Date(startDate) : new Date(startDate);
  if (Number.isNaN(start.getTime())) start.setTime(Date.now());

  const schedule = [];
  let balance = P;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  let cumulativeTotalPaid = 0;
  let totalPMI = 0;
  let pmiDropMonth = null;
  let pmiActive = pmiInitiallyRequired;

  for (let i = 1; i <= n; i++) {
    const interest = r > 0 ? balance * r : 0;
    let principalPaid = piMonthly - interest;
    if (i === n || principalPaid > balance) principalPaid = balance;
    balance = Math.max(0, balance - principalPaid);

    if (pmiActive && home > 0 && balance / home <= 0.8) {
      pmiActive = false;
      pmiDropMonth = i;
    }
    const pmiThisMonth = pmiActive ? firstMonthlyPmi : 0;
    if (i > 0 && pmiThisMonth === 0 && pmiInitiallyRequired && pmiDropMonth === null) {
      // covers the case where i is the boundary month: PMI was active
      // *during* the calculation above, so we already added it. Nothing to
      // do here.
    }
    totalPMI += pmiThisMonth;

    const total = interest + principalPaid + pmiThisMonth + monthlyTax + monthlyInsurance + monthlyHoa;
    cumulativeInterest += interest;
    cumulativePrincipal += principalPaid;
    cumulativeTotalPaid += total;

    const date = new Date(start.getFullYear(), start.getMonth() + i - 1, 1);

    schedule.push({
      month: i,
      date,
      interest,
      principal: principalPaid,
      pmi: pmiThisMonth,
      tax: monthlyTax,
      insurance: monthlyInsurance,
      hoa: monthlyHoa,
      total,
      endingBalance: balance,
      cumulativeInterest,
      cumulativePrincipal,
      cumulativeTotalPaid,
    });
  }

  const totalTax = monthlyTax * n;
  const totalInsurance = monthlyInsurance * n;
  const totalHoa = monthlyHoa * n;
  const totalInterest = cumulativeInterest;
  const grandTotalPaid = cumulativeTotalPaid;
  const payoffDate = schedule.length ? schedule[schedule.length - 1].date : start;

  return {
    schedule,
    meta: {
      piMonthly,
      n,
      ltv,
      pmiInitiallyRequired,
      pmiDropMonth,
      monthlyTax,
      monthlyInsurance,
      monthlyHoa,
      firstMonthlyPmi,
      totalInterest,
      totalPMI,
      totalTax,
      totalInsurance,
      totalHoa,
      grandTotalPaid,
      payoffDate,
    },
  };
}

/**
 * Bi-weekly payoff simulation. The standard convention is paying half of the
 * scheduled monthly P&I every two weeks, which produces 26 half-payments per
 * year, equivalent to 13 monthly payments per year (one extra). Interest is
 * still applied monthly: the second half-payment in a calendar month is
 * applied as a small extra principal payment that month.
 *
 * Returns interest saved and number of months shaved off the original term.
 */
export function biWeeklySavings({ loanAmount, annualRatePct, termYears, monthlyPiBaseline }) {
  const P = Number(loanAmount);
  const r = Number(annualRatePct) / 100 / 12;
  const n = Math.round(Number(termYears) * 12);
  const M = Number(monthlyPiBaseline) || monthlyPI({ principal: P, annualRatePct, termYears });
  if (!(P > 0) || !(n > 0) || !(M > 0)) {
    return { monthsToPayoff: 0, monthsSaved: 0, interestSaved: 0, totalInterest: 0 };
  }

  const baselineTotalInterest = M * n - P;

  // Bi-weekly = 26 half-payments per year = 13 monthly equivalents per year.
  // Treat as: each month pay M, plus add M/12 of extra principal per month
  // (M/12 * 12 months = M extra per year, matching the 13th payment).
  const extra = M / 12;
  let balance = P;
  let totalInterestPaid = 0;
  let monthsTaken = 0;

  while (balance > 0.005 && monthsTaken < 1200) {
    monthsTaken += 1;
    const interest = r > 0 ? balance * r : 0;
    let principal = M - interest;
    if (principal < 0) principal = 0;
    let extraPrincipal = extra;
    if (principal + extraPrincipal > balance) {
      extraPrincipal = Math.max(0, balance - principal);
    }
    if (principal > balance) principal = balance;
    totalInterestPaid += interest;
    balance = Math.max(0, balance - principal - extraPrincipal);
  }

  return {
    monthsToPayoff: monthsTaken,
    monthsSaved: Math.max(0, n - monthsTaken),
    interestSaved: Math.max(0, baselineTotalInterest - totalInterestPaid),
    totalInterest: totalInterestPaid,
  };
}

/**
 * Year-by-year roll-up of the monthly schedule. Returns 30 rows for a 30-year
 * loan, each carrying that calendar year's totals plus the ending balance at
 * the end of the year and the embedded array of the 12 monthly rows.
 */
export function summarize(schedule) {
  if (!Array.isArray(schedule) || !schedule.length) return [];
  const years = [];
  let bucket = null;
  schedule.forEach((row) => {
    const yearIdx = Math.floor((row.month - 1) / 12);
    if (!bucket || bucket.yearIdx !== yearIdx) {
      bucket = {
        yearIdx,
        yearNumber: yearIdx + 1,
        calendarYear: row.date.getFullYear(),
        interest: 0,
        principal: 0,
        pmi: 0,
        tax: 0,
        insurance: 0,
        hoa: 0,
        total: 0,
        endingBalance: 0,
        months: [],
      };
      years.push(bucket);
    }
    bucket.interest += row.interest;
    bucket.principal += row.principal;
    bucket.pmi += row.pmi;
    bucket.tax += row.tax;
    bucket.insurance += row.insurance;
    bucket.hoa += row.hoa;
    bucket.total += row.total;
    bucket.endingBalance = row.endingBalance;
    bucket.months.push(row);
  });
  return years;
}
