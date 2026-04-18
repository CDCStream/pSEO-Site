'use client';

import { useState } from 'react';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function calculateAge(birthDate, targetDate) {
  const birth = new Date(birthDate);
  const target = new Date(targetDate);

  if (birth > target) return null;

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = target.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= target) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  const dayOfWeek = birth.toLocaleDateString('en-US', { weekday: 'long' });

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    totalHours,
    totalMinutes,
    daysUntilBirthday,
    dayOfWeek,
  };
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
      <p className={`text-3xl sm:text-4xl font-bold ${color}`}>{value.toLocaleString()}</p>
      <p className="text-sm text-gray-300 font-medium mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ChronologicalAgeClient() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [useCustomTarget, setUseCustomTarget] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    if (!birthDate) {
      setError('Please enter your date of birth.');
      setResult(null);
      return;
    }

    const target = useCustomTarget && targetDate ? targetDate : new Date().toISOString().split('T')[0];
    const birth = new Date(birthDate);
    const tgt = new Date(target);

    if (birth > tgt) {
      setError('Date of birth cannot be after the target date.');
      setResult(null);
      return;
    }

    setError('');
    const age = calculateAge(birthDate, target);
    if (age) {
      setResult({ ...age, birthDate: birthDate, targetDate: target });
    }
  };

  const handleReset = () => {
    setBirthDate('');
    setTargetDate('');
    setUseCustomTarget(false);
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="relative bg-gradient-to-br from-teal-950/60 to-cyan-950/40 rounded-2xl border border-teal-500/20 p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg className="w-8 h-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Chronological <span className="text-teal-400">Age Calculator</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm mb-6 text-center">
            Enter your date of birth to calculate your exact age in years, months, days, and more.
          </p>

          <div className="max-w-lg mx-auto space-y-4">
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Date of Birth <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 text-sm appearance-none"
              />
            </div>

            {/* Optional target date toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseCustomTarget(!useCustomTarget)}
                className={`relative w-10 h-5 rounded-full transition-colors ${useCustomTarget ? 'bg-teal-500' : 'bg-white/20'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${useCustomTarget ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-gray-400">Calculate age at a specific date</span>
            </div>

            {/* Target Date */}
            {useCustomTarget && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Age at the Date of
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 text-sm appearance-none"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCalculate}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity text-sm"
              >
                Calculate Age
              </button>
              {result && (
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:bg-white/15 transition-all text-sm"
                >
                  Reset
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Main Age Display */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">Your Age</p>

            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
              <div className="text-center">
                <p className="text-5xl sm:text-6xl font-bold text-teal-400">{result.years}</p>
                <p className="text-sm text-gray-400 mt-1">Years</p>
              </div>
              <div className="text-center">
                <p className="text-5xl sm:text-6xl font-bold text-cyan-400">{result.months}</p>
                <p className="text-sm text-gray-400 mt-1">Months</p>
              </div>
              <div className="text-center">
                <p className="text-5xl sm:text-6xl font-bold text-sky-400">{result.days}</p>
                <p className="text-sm text-gray-400 mt-1">Days</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              Born on {new Date(result.birthDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Detailed Stats */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Detailed Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard label="Total Months" value={result.totalMonths} color="text-teal-400" />
              <StatCard label="Total Weeks" value={result.totalWeeks} color="text-cyan-400" />
              <StatCard label="Total Days" value={result.totalDays} color="text-sky-400" />
              <StatCard label="Total Hours" value={result.totalHours} color="text-blue-400" />
              <StatCard label="Total Minutes" value={result.totalMinutes} color="text-indigo-400" />
              <StatCard
                label="Next Birthday"
                value={result.daysUntilBirthday}
                sub={result.daysUntilBirthday === 1 ? 'day away' : 'days away'}
                color="text-amber-400"
              />
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span className="text-sm font-semibold text-teal-400">Quick Facts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                <span className="text-lg">📅</span>
                <div>
                  <p className="text-xs text-gray-500">Born on</p>
                  <p className="text-sm text-white font-medium">{result.dayOfWeek}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                <span className="text-lg">🎂</span>
                <div>
                  <p className="text-xs text-gray-500">Next Birthday in</p>
                  <p className="text-sm text-white font-medium">{result.daysUntilBirthday} {result.daysUntilBirthday === 1 ? 'day' : 'days'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                <span className="text-lg">💓</span>
                <div>
                  <p className="text-xs text-gray-500">Approximate Heartbeats</p>
                  <p className="text-sm text-white font-medium">{(result.totalMinutes * 72).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                <span className="text-lg">😴</span>
                <div>
                  <p className="text-xs text-gray-500">Time Spent Sleeping (est.)</p>
                  <p className="text-sm text-white font-medium">{Math.round(result.totalDays / 3).toLocaleString()} days</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
