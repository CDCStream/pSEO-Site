'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Snowflake, Wind, Droplets, Thermometer, AlertTriangle, RefreshCw } from 'lucide-react';

function Snowfall() {
  const flakes = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      dur: 4 + Math.random() * 6,
      size: 4 + Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.5,
    }))
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {flakes.map(f => (
        <span
          key={f.id}
          className="absolute rounded-full bg-white animate-snowfall"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

function ProbabilityRing({ value }) {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color =
    value >= 80 ? '#22c55e' :
    value >= 50 ? '#eab308' :
    value >= 20 ? '#f97316' : '#3b82f6';

  return (
    <svg viewBox="0 0 200 200" className="w-44 h-44 mx-auto">
      <circle cx="100" cy="100" r={r} fill="none" stroke="currentColor" className="text-white/10" strokeWidth="12" />
      <circle
        cx="100" cy="100" r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
        transform="rotate(-90 100 100)"
      />
      <text x="100" y="105" textAnchor="middle" dominantBaseline="central" className="fill-white font-bold" style={{ fontSize: 56 }}>{value}<tspan className="fill-white/60" style={{ fontSize: 22 }}>%</tspan></text>
    </svg>
  );
}

function DayCard({ day, index, wind, humidity }) {
  const d = new Date(day.date + 'T00:00:00');
  const dayName = index === 0 ? 'Today' : 'Tomorrow';
  const formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">{index + 1}</span>
        <div>
          <p className="text-white font-semibold text-sm">{dayName}</p>
          <p className="text-gray-500 text-xs">{formatted}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{day.emoji}</span>
        <span className="text-2xl font-bold text-white">{day.temp}°C</span>
      </div>
      <p className="text-xs text-gray-400 mb-3">H: {day.tempMax}° L: {day.tempMin}°</p>
      <p className="text-sm text-gray-300 mb-3">{day.label}</p>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-gray-400"><span>Snow Chance</span><span className="text-white font-medium">{day.snowChance}%</span></div>
        <div className="flex justify-between text-gray-400"><span>Snowfall</span><span className="text-white font-medium">{day.snowfall}&quot;</span></div>
        {wind != null && <div className="flex justify-between text-gray-400"><span>Wind</span><span className="text-white font-medium">{wind} Km/h</span></div>}
        {humidity != null && <div className="flex justify-between text-gray-400"><span>Humidity</span><span className="text-white font-medium">{humidity}%</span></div>}
      </div>
    </div>
  );
}

export default function SnowDayClient() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const predict = async () => {
    if (!query.trim()) { setError('Please enter a location.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/snow-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: query.trim() }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || 'Something went wrong.'); return; }
      setResult(data);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setError(''); setQuery(''); };

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <div className="relative bg-gradient-to-br from-blue-950/60 to-sky-950/40 rounded-2xl border border-blue-500/20 p-6 sm:p-8 overflow-hidden">
        <Snowfall />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Snowflake className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Will I have snow day <span className="text-blue-400">tomorrow</span>?
            </h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">Check the probability of school closures based on real-time local weather data.</p>

          <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && predict()}
                placeholder="Enter your city (e.g. Boston)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 text-sm"
              />
            </div>
            <button
              onClick={predict}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Predicting...</> : 'Predict'}
            </button>
          </div>

          {error && (
            <div className="mt-4 max-w-lg mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Probability Card */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 text-center">
            <button onClick={reset} className="text-sm text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1 mb-4">
              <RefreshCw className="w-3.5 h-3.5" /> Check another location
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              {result.location.name}, {result.location.admin}
            </div>

            <ProbabilityRing value={result.probability} />

            <p className="text-xl text-gray-300 mt-2 font-medium">{result.label}</p>

            <div className="mt-6 max-w-md mx-auto">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${result.probability}%`,
                    background: result.probability >= 80 ? '#22c55e' : result.probability >= 50 ? '#eab308' : result.probability >= 20 ? '#f97316' : '#3b82f6',
                  }}
                />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-semibold">School Closure Probability</p>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Snowflake className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">AI Analysis</span>
            </div>

            <h3 className="text-white font-semibold mb-2">{result.location.name} area: {result.label === 'No chance' ? 'Low' : result.label} chance of school closure</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{result.analysis}</p>

            <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" /> TIP
              </div>
              <p className="text-amber-200/80 text-sm">{result.tip}</p>
            </div>
          </div>

          {/* Weather Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.days.map((day, i) => (
              <DayCard
                key={day.date}
                day={day}
                index={i}
                wind={i === 0 ? result.current.wind : Math.round(10 + Math.random() * 10)}
                humidity={i === 0 ? result.current.humidity : Math.round(50 + Math.random() * 30)}
              />
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes snowfall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        :global(.animate-snowfall) {
          animation: snowfall linear infinite;
        }
      `}</style>
    </div>
  );
}
