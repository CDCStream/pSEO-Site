'use client';

import { useState, useMemo } from 'react';

function formatCurrency(num) {
  if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
  return '$' + num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function calculateInvestment(initialBalance, monthlyContribution, annualReturn, years) {
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) {
    const futureValue = initialBalance + monthlyContribution * totalMonths;
    const totalContributions = monthlyContribution * totalMonths;
    return { futureValue, totalContributions, growth: 0, initialBalance };
  }

  const fvInitial = initialBalance * Math.pow(1 + monthlyRate, totalMonths);
  const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  const futureValue = fvInitial + fvContributions;
  const totalContributions = monthlyContribution * totalMonths;
  const growth = futureValue - initialBalance - totalContributions;

  return { futureValue, totalContributions, growth, initialBalance };
}

function getYearlyBreakdown(initialBalance, monthlyContribution, annualReturn, years) {
  const monthlyRate = annualReturn / 100 / 12;
  const data = [];
  let balance = initialBalance;

  for (let y = 0; y <= years; y++) {
    if (y === 0) {
      data.push({ year: y, balance: initialBalance, contributions: 0, growth: 0 });
      continue;
    }
    const prevBalance = data[y - 1].balance;
    let yearEnd = prevBalance;
    for (let m = 0; m < 12; m++) {
      yearEnd = yearEnd * (1 + monthlyRate) + monthlyContribution;
    }
    const totalContrib = monthlyContribution * 12 * y;
    const totalGrowth = yearEnd - initialBalance - totalContrib;
    data.push({ year: y, balance: yearEnd, contributions: totalContrib, growth: totalGrowth });
  }
  return data;
}

function BarChart({ data, maxYears }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.balance));
  const displayData = data.length > 20 ? data.filter((_, i) => i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 15) === 0) : data;

  return (
    <div className="mt-6">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Growth Over Time</h4>
      <div className="flex items-end gap-1 h-40 bg-white/5 rounded-xl p-3 border border-white/5">
        {displayData.map((d, i) => {
          const height = maxVal > 0 ? (d.balance / maxVal) * 100 : 0;
          const growthPct = d.balance > 0 ? ((d.balance - d.contributions - data[0].balance) / d.balance) * 100 : 0;
          const contribPct = d.balance > 0 ? (d.contributions / d.balance) * 100 : 0;

          return (
            <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 rounded px-2 py-1 text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Year {d.year}: {formatCurrency(d.balance)}
              </div>
              <div
                className="w-full rounded-t transition-all duration-300"
                style={{
                  height: `${Math.max(height, 2)}%`,
                  background: `linear-gradient(to top, #059669 0%, #059669 ${100 - growthPct}%, #10b981 ${100 - growthPct}%, #10b981 100%)`,
                }}
              />
              {i % Math.max(1, Math.floor(displayData.length / 5)) === 0 && (
                <span className="text-[8px] text-gray-600 mt-1">{d.year}y</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-700" /> Contributions + Initial</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Growth</span>
      </div>
    </div>
  );
}

export default function InvestmentCalculatorClient() {
  const [currentAge, setCurrentAge] = useState('');
  const [retireAge, setRetireAge] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const age = parseInt(currentAge) || 0;
    const retire = parseInt(retireAge) || 0;
    const initial = parseFloat(initialBalance) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualReturn) || 0;

    if (retire <= age) {
      setResult({ error: 'Retirement age must be greater than current age.' });
      return;
    }
    if (rate < 0 || rate > 50) {
      setResult({ error: 'Please enter a realistic annual return (0-50%).' });
      return;
    }

    const years = retire - age;
    const main = calculateInvestment(initial, monthly, rate, years);
    const yearlyData = getYearlyBreakdown(initial, monthly, rate, years);

    const extra100 = calculateInvestment(initial, monthly + 100, rate, years);
    const extraCoffee = calculateInvestment(initial, monthly + 128, rate, years);
    const extraRestaurant = calculateInvestment(initial, monthly + 200, rate, years);

    setResult({
      years,
      ...main,
      yearlyData,
      scenarios: [
        { label: 'Saved an extra $100 per month', extraMonthly: 100, additionalGrowth: extra100.futureValue - main.futureValue },
        { label: 'Gave up daily coffee purchases ($128/mo)', extraMonthly: 128, additionalGrowth: extraCoffee.futureValue - main.futureValue },
        { label: 'Gave up weekly restaurant visits ($200/mo)', extraMonthly: 200, additionalGrowth: extraRestaurant.futureValue - main.futureValue },
      ],
    });
  };

  const resetAll = () => {
    setCurrentAge(''); setRetireAge(''); setInitialBalance('');
    setMonthlyContribution(''); setAnnualReturn(''); setResult(null);
  };

  const total = result && !result.error ? result.futureValue : 0;
  const initialPct = total > 0 ? ((result.initialBalance / total) * 100).toFixed(1) : 0;
  const contribPct = total > 0 ? ((result.totalContributions / total) * 100).toFixed(1) : 0;
  const growthPct = total > 0 ? ((result.growth / total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-950/60 to-teal-950/40 rounded-2xl border border-emerald-500/20 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Investment <span className="text-emerald-400">Calculator</span>
          </h2>
        </div>
        <p className="text-gray-400 text-sm mb-6">See how much your investments could grow over time with compound interest and regular monthly contributions.</p>

        <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Current Age</label>
              <input
                type="number" min="1" max="100" value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                placeholder="e.g. 30"
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Retirement Age</label>
              <input
                type="number" min="1" max="100" value={retireAge}
                onChange={(e) => setRetireAge(e.target.value)}
                placeholder="e.g. 67"
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <p className="text-[10px] text-gray-600 mt-1">Full retirement benefits start at age 67 (born 1960+).</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Current Investment Balance</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number" min="0" value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-1">Total of all investment accounts (401k, IRA, mutual funds, etc.)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Monthly Contribution</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number" min="0" value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="500"
                className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-1">Amount you invest each month. 15% of paycheck is recommended.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Expected Annual Return</label>
            <div className="relative">
              <input
                type="number" min="0" max="50" step="0.1" value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                placeholder="10"
                className="w-full pr-7 pl-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">S&P 500 historical 30-year return is roughly 10-12%.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={calculate}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Calculate
            </button>
            <button
              onClick={resetAll}
              className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium hover:bg-white/10 hover:text-white transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {result && result.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          {result.error}
        </div>
      )}

      {result && !result.error && (
        <>
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Estimated Investment Value</p>
            <p className="text-sm text-gray-400 mb-4">In {result.years} years, your investment could be worth:</p>
            <p className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-6">
              {formatCurrency(result.futureValue)}
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-1.5" />
                <p className="text-[10px] text-gray-500 uppercase font-medium">Initial Balance</p>
                <p className="text-lg font-bold text-white">{formatCurrency(result.initialBalance)}</p>
                <p className="text-xs text-gray-500">{initialPct}%</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="w-3 h-3 rounded-full bg-emerald-600 mx-auto mb-1.5" />
                <p className="text-[10px] text-gray-500 uppercase font-medium">Contributions</p>
                <p className="text-lg font-bold text-white">{formatCurrency(result.totalContributions)}</p>
                <p className="text-xs text-gray-500">{contribPct}%</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 mx-auto mb-1.5" />
                <p className="text-[10px] text-gray-500 uppercase font-medium">Growth</p>
                <p className="text-lg font-bold text-white">{formatCurrency(result.growth)}</p>
                <p className="text-xs text-gray-500">{growthPct}%</p>
              </div>
            </div>

            <div className="mt-6 max-w-lg mx-auto">
              <div className="h-3 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 transition-all duration-700" style={{ width: `${initialPct}%` }} />
                <div className="bg-emerald-600 transition-all duration-700" style={{ width: `${contribPct}%` }} />
                <div className="bg-emerald-400 transition-all duration-700" style={{ width: `${growthPct}%` }} />
              </div>
            </div>

            <BarChart data={result.yearlyData} maxYears={result.years} />
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              What if I...
            </h3>
            <div className="space-y-3">
              {result.scenarios.map((s, i) => (
                <div key={i} className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-white font-medium">{s.label}</p>
                    <p className="text-xs text-gray-500">Adds ${s.extraMonthly}/month in contributions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">+{formatCurrency(s.additionalGrowth)}</p>
                    <p className="text-[10px] text-gray-500 uppercase">additional growth</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
