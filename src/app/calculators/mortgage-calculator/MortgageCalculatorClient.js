'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Home, Percent, DollarSign, Calendar, Settings2, RotateCcw, Copy, Check, ChevronDown } from 'lucide-react';
import { monthlyPI, buildSchedule, biWeeklySavings, summarize } from '@/lib/mortgage';

const STORAGE_KEY = 'makersilo:mortgage:v1';

const CURRENCIES = [
  { id: 'USD', symbol: '$',  label: 'USD' },
  { id: 'GBP', symbol: '\u00A3', label: 'GBP' },
  { id: 'EUR', symbol: '\u20AC', label: 'EUR' },
  { id: 'CAD', symbol: 'C$', label: 'CAD' },
  { id: 'AUD', symbol: 'A$', label: 'AUD' },
];

const LOAN_TYPES = ['Conventional', 'FHA', 'VA', 'USDA'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DEFAULTS = {
  homeValue: 400000,
  downPaymentDollar: 80000,
  annualRatePct: 6.5,
  termYears: 30,
  startMonth: new Date().getMonth(),
  startYear: new Date().getFullYear(),
  loanType: 'Conventional',
  pmiRatePct: 0.5,
  propertyTaxInput: 1.2,
  homeInsurance: 1500,
  hoa: 0,
  currency: 'USD',
};

function num(v, fallback = 0) {
  if (v === '' || v === null || v === undefined) return fallback;
  const n = Number(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

function formatMoney(v, symbol = '$', decimals = 0) {
  if (!Number.isFinite(v)) return `${symbol}0`;
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(v);
  const fixed = abs.toFixed(decimals);
  const [whole, frac] = fixed.split('.');
  const wholeWithCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${symbol}${wholeWithCommas}${frac ? '.' + frac : ''}`;
}

function formatYearsMonths(monthsTotal) {
  if (!Number.isFinite(monthsTotal) || monthsTotal <= 0) return '0 months';
  const y = Math.floor(monthsTotal / 12);
  const m = monthsTotal % 12;
  if (y === 0) return `${m} month${m === 1 ? '' : 's'}`;
  if (m === 0) return `${y} year${y === 1 ? '' : 's'}`;
  return `${y}y ${m}m`;
}

// Build a simple SVG donut. Slices is an array of { value, color, label }.
function Donut({ slices, size = 200, stroke = 36, currency = '$' }) {
  const total = slices.reduce((s, x) => s + Math.max(0, x.value), 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;

  if (total <= 0) {
    return (
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      </svg>
    );
  }

  let acc = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      {slices.map((s, i) => {
        const v = Math.max(0, s.value);
        if (v <= 0) return null;
        const seg = (v / total) * C;
        const dasharray = `${seg} ${C - seg}`;
        const dashoffset = -acc;
        acc += seg;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={dasharray}
            strokeDashoffset={dashoffset}
          />
        );
      })}
    </svg>
  );
}

// Minimal SVG line chart of cumulative principal & interest over the schedule.
function BalanceChart({ schedule, currency }) {
  const W = 560;
  const H = 200;
  const pad = { l: 50, r: 12, t: 12, b: 28 };
  if (!schedule.length) return null;

  const n = schedule.length;
  const maxVal = Math.max(
    schedule[0].endingBalance,
    schedule[n - 1].cumulativeInterest,
    schedule[n - 1].cumulativePrincipal
  );
  const xAt = (i) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const yAt = (v) => pad.t + (1 - v / maxVal) * (H - pad.t - pad.b);

  const balancePath = schedule.map((row, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(row.endingBalance)}`).join(' ');
  const interestPath = schedule.map((row, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(row.cumulativeInterest)}`).join(' ');
  const principalPath = schedule.map((row, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(row.cumulativePrincipal)}`).join(' ');

  const gridYs = [0, 0.25, 0.5, 0.75, 1].map((p) => p * maxVal);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" className="block">
      {gridYs.map((g, i) => (
        <g key={i}>
          <line x1={pad.l} x2={W - pad.r} y1={yAt(g)} y2={yAt(g)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={pad.l - 6} y={yAt(g)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="#9ca3af">
            {formatMoney(g, currency, 0)}
          </text>
        </g>
      ))}
      {/* x-axis years */}
      {Array.from({ length: Math.min(7, Math.ceil(n / 12)) + 1 }, (_, i) => {
        const yIdx = Math.round((i / Math.min(7, Math.ceil(n / 12))) * (n - 1));
        return (
          <text
            key={i}
            x={xAt(yIdx)}
            y={H - 10}
            textAnchor="middle"
            fontSize="9"
            fill="#9ca3af"
          >
            Yr {Math.round(yIdx / 12)}
          </text>
        );
      })}
      <path d={balancePath} fill="none" stroke="#10b981" strokeWidth="2" />
      <path d={interestPath} fill="none" stroke="#f43f5e" strokeWidth="2" />
      <path d={principalPath} fill="none" stroke="#06b6d4" strokeWidth="2" />
    </svg>
  );
}

export default function MortgageCalculatorClient() {
  const [homeValue, setHomeValue] = useState(DEFAULTS.homeValue);
  const [downPaymentDollar, setDownPaymentDollar] = useState(DEFAULTS.downPaymentDollar);
  const [annualRatePct, setAnnualRatePct] = useState(DEFAULTS.annualRatePct);
  const [termYears, setTermYears] = useState(DEFAULTS.termYears);
  const [startMonth, setStartMonth] = useState(DEFAULTS.startMonth);
  const [startYear, setStartYear] = useState(DEFAULTS.startYear);
  const [loanType, setLoanType] = useState(DEFAULTS.loanType);
  const [pmiRatePct, setPmiRatePct] = useState(DEFAULTS.pmiRatePct);
  const [propertyTaxInput, setPropertyTaxInput] = useState(DEFAULTS.propertyTaxInput);
  const [homeInsurance, setHomeInsurance] = useState(DEFAULTS.homeInsurance);
  const [hoa, setHoa] = useState(DEFAULTS.hoa);
  const [currency, setCurrency] = useState(DEFAULTS.currency);

  const [extrasOpen, setExtrasOpen] = useState(true);
  const [view, setView] = useState('annual');
  const [openYears, setOpenYears] = useState(new Set());
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (Number.isFinite(p.homeValue)) setHomeValue(p.homeValue);
        if (Number.isFinite(p.downPaymentDollar)) setDownPaymentDollar(p.downPaymentDollar);
        if (Number.isFinite(p.annualRatePct)) setAnnualRatePct(p.annualRatePct);
        if (Number.isFinite(p.termYears)) setTermYears(p.termYears);
        if (Number.isFinite(p.pmiRatePct)) setPmiRatePct(p.pmiRatePct);
        if (Number.isFinite(p.propertyTaxInput)) setPropertyTaxInput(p.propertyTaxInput);
        if (Number.isFinite(p.homeInsurance)) setHomeInsurance(p.homeInsurance);
        if (Number.isFinite(p.hoa)) setHoa(p.hoa);
        if (LOAN_TYPES.includes(p.loanType)) setLoanType(p.loanType);
        if (CURRENCIES.find((c) => c.id === p.currency)) setCurrency(p.currency);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ homeValue, downPaymentDollar, annualRatePct, termYears, loanType, pmiRatePct, propertyTaxInput, homeInsurance, hoa, currency })
      );
    } catch {}
  }, [hydrated, homeValue, downPaymentDollar, annualRatePct, termYears, loanType, pmiRatePct, propertyTaxInput, homeInsurance, hoa, currency]);

  const symbol = useMemo(() => CURRENCIES.find((c) => c.id === currency)?.symbol || '$', [currency]);

  const loanAmount = Math.max(0, num(homeValue) - num(downPaymentDollar));
  const downPct = num(homeValue) > 0 ? (num(downPaymentDollar) / num(homeValue)) * 100 : 0;

  const updateDownDollar = (v) => {
    setDownPaymentDollar(Math.min(num(v), num(homeValue)));
  };
  const updateDownPct = (v) => {
    const pct = Math.max(0, Math.min(100, num(v)));
    setDownPaymentDollar(Math.round((num(homeValue) * pct) / 100));
  };

  const computation = useMemo(() => {
    return buildSchedule({
      homeValue: num(homeValue),
      loanAmount,
      annualRatePct: num(annualRatePct),
      termYears: num(termYears),
      loanType,
      pmiRatePct: num(pmiRatePct),
      propertyTax: num(propertyTaxInput),
      homeInsurance: num(homeInsurance),
      hoa: num(hoa),
      startDate: new Date(num(startYear, new Date().getFullYear()), num(startMonth), 1),
    });
  }, [homeValue, loanAmount, annualRatePct, termYears, loanType, pmiRatePct, propertyTaxInput, homeInsurance, hoa, startMonth, startYear]);

  const { schedule, meta } = computation;
  const years = useMemo(() => summarize(schedule), [schedule]);

  const biWeekly = useMemo(
    () =>
      biWeeklySavings({
        loanAmount,
        annualRatePct: num(annualRatePct),
        termYears: num(termYears),
        monthlyPiBaseline: meta.piMonthly,
      }),
    [loanAmount, annualRatePct, termYears, meta.piMonthly]
  );

  const totalMonthly = meta.piMonthly + meta.monthlyTax + meta.monthlyInsurance + meta.monthlyHoa + meta.firstMonthlyPmi;

  const donutSlices = [
    { value: meta.piMonthly, color: '#10b981', label: 'P&I' },
    { value: meta.monthlyTax, color: '#06b6d4', label: 'Property tax' },
    { value: meta.monthlyInsurance, color: '#f59e0b', label: 'Home insurance' },
    { value: meta.firstMonthlyPmi, color: '#f43f5e', label: 'PMI' },
    { value: meta.monthlyHoa, color: '#a855f7', label: 'HOA' },
  ];

  const reset = () => {
    setHomeValue(DEFAULTS.homeValue);
    setDownPaymentDollar(DEFAULTS.downPaymentDollar);
    setAnnualRatePct(DEFAULTS.annualRatePct);
    setTermYears(DEFAULTS.termYears);
    setStartMonth(new Date().getMonth());
    setStartYear(new Date().getFullYear());
    setLoanType(DEFAULTS.loanType);
    setPmiRatePct(DEFAULTS.pmiRatePct);
    setPropertyTaxInput(DEFAULTS.propertyTaxInput);
    setHomeInsurance(DEFAULTS.homeInsurance);
    setHoa(DEFAULTS.hoa);
    setOpenYears(new Set());
  };

  const copyCsv = useCallback(async () => {
    if (!schedule.length) return;
    const header = ['Month', 'Date', 'Interest', 'Principal', 'PMI', 'Tax', 'Insurance', 'HOA', 'Total', 'EndingBalance'];
    const rows = schedule.map((r) => [
      r.month,
      `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`,
      r.interest.toFixed(2),
      r.principal.toFixed(2),
      r.pmi.toFixed(2),
      r.tax.toFixed(2),
      r.insurance.toFixed(2),
      r.hoa.toFixed(2),
      r.total.toFixed(2),
      r.endingBalance.toFixed(2),
    ]);
    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
    try {
      await navigator.clipboard.writeText(csv);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, [schedule]);

  const toggleYear = (idx) => {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const pmiStatusText = (() => {
    if (!meta.pmiInitiallyRequired) return loanType === 'Conventional' ? 'Not required (LTV \u2264 80%)' : 'N/A for ' + loanType;
    if (meta.pmiDropMonth) {
      const dropDate = schedule[meta.pmiDropMonth - 1]?.date;
      const dropLabel = dropDate ? `${MONTHS[dropDate.getMonth()]} ${dropDate.getFullYear()}` : `month ${meta.pmiDropMonth}`;
      return `Drops at LTV 80% in ${dropLabel} (month ${meta.pmiDropMonth})`;
    }
    return 'Required for full term';
  })();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 sm:p-6">
      {/* Currency + Loan-type bar */}
      <div className="flex flex-wrap items-center gap-2 mb-5 pb-5 border-b border-white/10">
        <div className="inline-flex rounded-xl bg-black/30 border border-white/10 p-1">
          {LOAN_TYPES.map((lt) => (
            <button
              key={lt}
              onClick={() => setLoanType(lt)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                loanType === lt ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              {lt}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-black/30 border border-white/10 p-1">
            {CURRENCIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCurrency(c.id)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  currency === c.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title={c.label}
              >
                {c.symbol} {c.label}
              </button>
            ))}
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* INPUTS */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
              <Home className="w-3.5 h-3.5" />
              Home value
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">{symbol}</span>
              <input
                type="number"
                inputMode="decimal"
                step="1000"
                min="0"
                value={homeValue}
                onChange={(e) => setHomeValue(num(e.target.value))}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-base font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              Down payment
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">{symbol}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="100"
                  min="0"
                  value={downPaymentDollar}
                  onChange={(e) => updateDownDollar(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-base font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">%</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  max="100"
                  value={Number.isFinite(downPct) ? downPct.toFixed(2) : 0}
                  onChange={(e) => updateDownPct(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-base font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>
            <p className="mt-1.5 text-xs text-gray-500">Loan amount: <span className="text-gray-300 font-semibold">{formatMoney(loanAmount, symbol, 0)}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                <Percent className="w-3.5 h-3.5" />
                Interest rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.001"
                  min="0"
                  max="30"
                  value={annualRatePct}
                  onChange={(e) => setAnnualRatePct(num(e.target.value))}
                  className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-base font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">%</span>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                Term
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="1"
                  max="40"
                  value={termYears}
                  onChange={(e) => setTermYears(num(e.target.value))}
                  className="w-full pl-3 pr-12 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-base font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">years</span>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Start date
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i} className="bg-[#1a1a2e] text-white">{m}</option>
                ))}
              </select>
              <input
                type="number"
                step="1"
                min="2000"
                max="2100"
                value={startYear}
                onChange={(e) => setStartYear(num(e.target.value, new Date().getFullYear()))}
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Extras toggle */}
          <button
            onClick={() => setExtrasOpen((v) => !v)}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
              <Settings2 className="w-3.5 h-3.5" />
              Taxes, insurance, PMI, HOA
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${extrasOpen ? 'rotate-180' : ''}`} />
          </button>

          {extrasOpen && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-white/10 bg-black/20">
              <div>
                <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Property tax</label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    value={propertyTaxInput}
                    onChange={(e) => setPropertyTaxInput(num(e.target.value))}
                    className="w-full pl-3 pr-12 py-2 rounded bg-black/40 border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-[10px] pointer-events-none">{num(propertyTaxInput) <= 20 ? '% / yr' : '$/yr'}</span>
                </div>
                <p className="mt-1 text-[10px] text-gray-500">{num(propertyTaxInput) <= 20 ? 'Treated as % of home value' : 'Treated as annual dollar amount'}</p>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Home insurance / yr</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">{symbol}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="50"
                    min="0"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(num(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded bg-black/40 border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">PMI rate / yr</label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.05"
                    min="0"
                    max="3"
                    value={pmiRatePct}
                    onChange={(e) => setPmiRatePct(num(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 rounded bg-black/40 border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">%</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">HOA / month</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">{symbol}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="10"
                    min="0"
                    value={hoa}
                    onChange={(e) => setHoa(num(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded bg-black/40 border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESULT */}
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent p-4 sm:p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-1">Total monthly payment</div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl sm:text-5xl font-bold text-white">{formatMoney(totalMonthly, symbol, 2)}</span>
            <span className="text-sm text-gray-400 font-medium">/mo</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="shrink-0">
              <Donut slices={donutSlices} size={160} stroke={28} currency={symbol} />
            </div>
            <div className="flex-1 w-full grid grid-cols-1 gap-1.5 text-sm">
              {donutSlices.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-300 flex-1">{s.label}</span>
                  <span className="text-white font-mono font-medium">{formatMoney(s.value, symbol, 2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/5 border border-white/5 p-2.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Payoff date</div>
              <div className="text-white font-semibold">{MONTHS[meta.payoffDate.getMonth()]} {meta.payoffDate.getFullYear()}</div>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/5 p-2.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Total interest</div>
              <div className="text-white font-semibold">{formatMoney(meta.totalInterest, symbol, 0)}</div>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/5 p-2.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Total of {meta.n} payments</div>
              <div className="text-white font-semibold">{formatMoney(meta.grandTotalPaid, symbol, 0)}</div>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/5 p-2.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">LTV</div>
              <div className="text-white font-semibold">{(meta.ltv * 100).toFixed(2)}%</div>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/5 p-2.5 col-span-2">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">PMI status</div>
              <div className="text-white font-semibold leading-tight">{pmiStatusText}</div>
            </div>
          </div>

          {biWeekly.monthsSaved > 0 && (
            <div className="mt-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs text-cyan-100 leading-relaxed">
              <span className="font-semibold">Bi-weekly tip: </span>
              Paying {formatMoney(meta.piMonthly / 2, symbol, 2)} every two weeks (one extra monthly payment per year) pays the loan off in <span className="font-semibold">{formatYearsMonths(biWeekly.monthsToPayoff)}</span> instead of {formatYearsMonths(meta.n)} \u2014 saving roughly <span className="font-semibold">{formatMoney(biWeekly.interestSaved, symbol, 0)}</span> in interest.
            </div>
          )}
        </div>
      </div>

      {/* AMORTIZATION */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold text-white">Amortization schedule</h3>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-black/30 border border-white/10 p-0.5">
              <button
                onClick={() => setView('annual')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${view === 'annual' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Annual
              </button>
              <button
                onClick={() => setView('monthly')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${view === 'monthly' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Monthly
              </button>
            </div>
            <button
              onClick={copyCsv}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy CSV'}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3 mb-4">
          <BalanceChart schedule={schedule} currency={symbol} />
          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-emerald-500" />Remaining balance</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-cyan-500" />Cumulative principal</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-rose-500" />Cumulative interest</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left py-2 px-3 font-semibold">{view === 'annual' ? 'Year' : 'Month'}</th>
                <th className="text-right py-2 px-3 font-semibold">Interest</th>
                <th className="text-right py-2 px-3 font-semibold">Principal</th>
                <th className="text-right py-2 px-3 font-semibold hidden sm:table-cell">PMI</th>
                <th className="text-right py-2 px-3 font-semibold hidden sm:table-cell">Tax</th>
                <th className="text-right py-2 px-3 font-semibold hidden md:table-cell">Insurance</th>
                <th className="text-right py-2 px-3 font-semibold">Total paid</th>
                <th className="text-right py-2 px-3 font-semibold">Ending balance</th>
              </tr>
            </thead>
            <tbody>
              {view === 'annual'
                ? years.map((y, idx) => (
                    <YearRow
                      key={y.yearNumber}
                      y={y}
                      idx={idx}
                      open={openYears.has(idx)}
                      onToggle={() => toggleYear(idx)}
                      symbol={symbol}
                    />
                  ))
                : schedule.map((row) => (
                    <tr key={row.month} className="border-t border-white/5 text-gray-300">
                      <td className="py-1.5 px-3 text-white font-medium">{row.month} <span className="text-gray-500 text-xs">({MONTHS[row.date.getMonth()]} {String(row.date.getFullYear()).slice(-2)})</span></td>
                      <td className="py-1.5 px-3 text-right font-mono">{formatMoney(row.interest, symbol, 2)}</td>
                      <td className="py-1.5 px-3 text-right font-mono">{formatMoney(row.principal, symbol, 2)}</td>
                      <td className="py-1.5 px-3 text-right font-mono hidden sm:table-cell">{row.pmi > 0 ? formatMoney(row.pmi, symbol, 2) : '\u2014'}</td>
                      <td className="py-1.5 px-3 text-right font-mono hidden sm:table-cell">{formatMoney(row.tax, symbol, 2)}</td>
                      <td className="py-1.5 px-3 text-right font-mono hidden md:table-cell">{formatMoney(row.insurance, symbol, 2)}</td>
                      <td className="py-1.5 px-3 text-right font-mono">{formatMoney(row.total, symbol, 2)}</td>
                      <td className="py-1.5 px-3 text-right font-mono text-white">{formatMoney(row.endingBalance, symbol, 0)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function YearRow({ y, idx, open, onToggle, symbol }) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-t border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${open ? 'bg-white/5' : ''}`}
      >
        <td className="py-1.5 px-3 text-white font-semibold flex items-center gap-1.5">
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : '-rotate-90'}`} />
          Year {y.yearNumber} <span className="text-gray-500 text-xs font-normal">({y.calendarYear})</span>
        </td>
        <td className="py-1.5 px-3 text-right font-mono text-gray-300">{formatMoney(y.interest, symbol, 2)}</td>
        <td className="py-1.5 px-3 text-right font-mono text-gray-300">{formatMoney(y.principal, symbol, 2)}</td>
        <td className="py-1.5 px-3 text-right font-mono text-gray-300 hidden sm:table-cell">{y.pmi > 0 ? formatMoney(y.pmi, symbol, 2) : '\u2014'}</td>
        <td className="py-1.5 px-3 text-right font-mono text-gray-300 hidden sm:table-cell">{formatMoney(y.tax, symbol, 2)}</td>
        <td className="py-1.5 px-3 text-right font-mono text-gray-300 hidden md:table-cell">{formatMoney(y.insurance, symbol, 2)}</td>
        <td className="py-1.5 px-3 text-right font-mono text-gray-300">{formatMoney(y.total, symbol, 2)}</td>
        <td className="py-1.5 px-3 text-right font-mono text-white">{formatMoney(y.endingBalance, symbol, 0)}</td>
      </tr>
      {open &&
        y.months.map((row) => (
          <tr key={`m-${row.month}`} className="border-t border-white/5 bg-black/20 text-gray-400 text-xs">
            <td className="py-1 px-3 pl-9">M {row.month} <span className="text-gray-600">({MONTHS[row.date.getMonth()]})</span></td>
            <td className="py-1 px-3 text-right font-mono">{formatMoney(row.interest, symbol, 2)}</td>
            <td className="py-1 px-3 text-right font-mono">{formatMoney(row.principal, symbol, 2)}</td>
            <td className="py-1 px-3 text-right font-mono hidden sm:table-cell">{row.pmi > 0 ? formatMoney(row.pmi, symbol, 2) : '\u2014'}</td>
            <td className="py-1 px-3 text-right font-mono hidden sm:table-cell">{formatMoney(row.tax, symbol, 2)}</td>
            <td className="py-1 px-3 text-right font-mono hidden md:table-cell">{formatMoney(row.insurance, symbol, 2)}</td>
            <td className="py-1 px-3 text-right font-mono">{formatMoney(row.total, symbol, 2)}</td>
            <td className="py-1 px-3 text-right font-mono text-gray-300">{formatMoney(row.endingBalance, symbol, 0)}</td>
          </tr>
        ))}
    </>
  );
}
