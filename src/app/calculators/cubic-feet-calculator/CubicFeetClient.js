'use client';

import { useState, useCallback } from 'react';

const MODES = [
  { id: 'cubic-feet', label: 'Cubic Feet' },
  { id: 'square-footage', label: 'Square Footage' },
  { id: 'cbm', label: 'CBM' },
  { id: 'cubic-yards', label: 'Cubic Yards' },
];

const UNITS = [
  { id: 'feet', label: 'feet' },
  { id: 'inches', label: 'in' },
  { id: 'yards', label: 'yd' },
  { id: 'meters', label: 'm' },
  { id: 'cm', label: 'cm' },
];

function toFeet(value, unit) {
  switch (unit) {
    case 'inches': return value / 12;
    case 'yards': return value * 3;
    case 'meters': return value * 3.28084;
    case 'cm': return value / 30.48;
    default: return value;
  }
}

function InputField({ label, value, onChange, unit, showInches, inchValue, onInchChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
        <span className="text-xs text-gray-500 w-8 shrink-0">{UNITS.find(u => u.id === unit)?.label || unit}</span>
        {showInches && (
          <>
            <input
              type="number"
              min="0"
              max="11"
              step="1"
              value={inchValue}
              onChange={(e) => onInchChange(e.target.value)}
              className="w-20 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <span className="text-xs text-gray-500 w-4 shrink-0">in</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function CubicFeetClient() {
  const [mode, setMode] = useState('cubic-feet');
  const [unit, setUnit] = useState('feet');
  const [decimals, setDecimals] = useState(4);

  const [width, setWidth] = useState('');
  const [widthIn, setWidthIn] = useState('');
  const [length, setLength] = useState('');
  const [lengthIn, setLengthIn] = useState('');
  const [height, setHeight] = useState('');
  const [heightIn, setHeightIn] = useState('');

  const [result, setResult] = useState(null);

  const showInches = unit === 'feet';
  const isAreaMode = mode === 'square-footage';

  const calculate = useCallback(() => {
    const wVal = parseFloat(width) || 0;
    const lVal = parseFloat(length) || 0;
    const hVal = parseFloat(height) || 0;
    const wiVal = showInches ? (parseFloat(widthIn) || 0) : 0;
    const liVal = showInches ? (parseFloat(lengthIn) || 0) : 0;
    const hiVal = showInches ? (parseFloat(heightIn) || 0) : 0;

    let wFeet, lFeet, hFeet;
    if (showInches) {
      wFeet = wVal + wiVal / 12;
      lFeet = lVal + liVal / 12;
      hFeet = hVal + hiVal / 12;
    } else {
      wFeet = toFeet(wVal, unit);
      lFeet = toFeet(lVal, unit);
      hFeet = toFeet(hVal, unit);
    }

    if (wFeet <= 0 || lFeet <= 0 || (!isAreaMode && hFeet <= 0)) {
      setResult(null);
      return;
    }

    const d = decimals;

    if (isAreaMode) {
      const sqFt = wFeet * lFeet;
      setResult({
        type: 'area',
        sqFt: sqFt.toFixed(d),
        sqM: (sqFt * 0.092903).toFixed(d),
        sqYd: (sqFt / 9).toFixed(d),
        sqIn: (sqFt * 144).toFixed(d),
        acres: (sqFt / 43560).toFixed(d + 2),
      });
    } else {
      const cuFt = wFeet * lFeet * hFeet;
      const cuM = cuFt * 0.0283168;
      const cuYd = cuFt / 27;
      const cuIn = cuFt * 1728;
      const gallons = cuFt * 7.48052;
      const liters = cuM * 1000;

      if (mode === 'cbm') {
        setResult({
          type: 'volume',
          primary: { label: 'Cubic Meters (CBM)', value: cuM.toFixed(d), unit: 'm³' },
          cuFt: cuFt.toFixed(d),
          cuM: cuM.toFixed(d),
          cuYd: cuYd.toFixed(d),
          cuIn: cuIn.toFixed(d),
          gallons: gallons.toFixed(d),
          liters: liters.toFixed(d),
        });
      } else if (mode === 'cubic-yards') {
        setResult({
          type: 'volume',
          primary: { label: 'Cubic Yards', value: cuYd.toFixed(d), unit: 'yd³' },
          cuFt: cuFt.toFixed(d),
          cuM: cuM.toFixed(d),
          cuYd: cuYd.toFixed(d),
          cuIn: cuIn.toFixed(d),
          gallons: gallons.toFixed(d),
          liters: liters.toFixed(d),
        });
      } else {
        setResult({
          type: 'volume',
          primary: { label: 'Cubic Feet', value: cuFt.toFixed(d), unit: 'ft³' },
          cuFt: cuFt.toFixed(d),
          cuM: cuM.toFixed(d),
          cuYd: cuYd.toFixed(d),
          cuIn: cuIn.toFixed(d),
          gallons: gallons.toFixed(d),
          liters: liters.toFixed(d),
        });
      }
    }
  }, [width, widthIn, length, lengthIn, height, heightIn, unit, mode, decimals, showInches, isAreaMode]);

  const resetAll = () => {
    setWidth(''); setWidthIn(''); setLength(''); setLengthIn(''); setHeight(''); setHeightIn('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-950/60 to-amber-950/40 rounded-2xl border border-orange-500/20 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Cubic Feet <span className="text-orange-400">Calculator</span>
          </h2>
        </div>
        <p className="text-gray-400 text-sm mb-6">Calculate volume in cubic feet, cubic meters, cubic yards, or area in square feet.</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setResult(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === m.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Unit Choice</label>
            <div className="flex flex-wrap gap-2">
              {UNITS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => { setUnit(u.id); setResult(null); setWidthIn(''); setLengthIn(''); setHeightIn(''); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    unit === u.id
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-white/5 text-gray-500 border border-white/5 hover:text-gray-300'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <InputField
            label="Width"
            value={width}
            onChange={setWidth}
            unit={unit}
            showInches={showInches}
            inchValue={widthIn}
            onInchChange={setWidthIn}
          />

          <InputField
            label="Length"
            value={length}
            onChange={setLength}
            unit={unit}
            showInches={showInches}
            inchValue={lengthIn}
            onInchChange={setLengthIn}
          />

          {!isAreaMode && (
            <InputField
              label="Height"
              value={height}
              onChange={setHeight}
              unit={unit}
              showInches={showInches}
              inchValue={heightIn}
              onInchChange={setHeightIn}
            />
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Round (decimal places)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setDecimals(d)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    decimals === d
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={calculate}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="16" height="20" x="4" y="2" rx="2" />
                <line x1="8" x2="16" y1="6" y2="6" />
                <line x1="16" x2="16" y1="14" y2="18" />
                <path d="M16 10h.01" />
                <path d="M12 10h.01" />
                <path d="M8 10h.01" />
                <path d="M12 14h.01" />
                <path d="M8 14h.01" />
                <path d="M12 18h.01" />
                <path d="M8 18h.01" />
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

      {result && result.type === 'volume' && (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">{result.primary.label}</p>
            <p className="text-4xl sm:text-5xl font-bold text-orange-400">
              {result.primary.value}
              <span className="text-lg text-gray-400 ml-2">{result.primary.unit}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard label="Cubic Feet" value={result.cuFt} unit="ft³" />
            <ResultCard label="Cubic Meters" value={result.cuM} unit="m³" />
            <ResultCard label="Cubic Yards" value={result.cuYd} unit="yd³" />
            <ResultCard label="Cubic Inches" value={result.cuIn} unit="in³" />
            <ResultCard label="US Gallons" value={result.gallons} unit="gal" />
            <ResultCard label="Liters" value={result.liters} unit="L" />
          </div>
        </div>
      )}

      {result && result.type === 'area' && (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Square Feet</p>
            <p className="text-4xl sm:text-5xl font-bold text-orange-400">
              {result.sqFt}
              <span className="text-lg text-gray-400 ml-2">ft²</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard label="Square Feet" value={result.sqFt} unit="ft²" />
            <ResultCard label="Square Meters" value={result.sqM} unit="m²" />
            <ResultCard label="Square Yards" value={result.sqYd} unit="yd²" />
            <ResultCard label="Square Inches" value={result.sqIn} unit="in²" />
            <ResultCard label="Acres" value={result.acres} unit="ac" />
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ label, value, unit }) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/5 p-3 text-center">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500">{unit}</p>
    </div>
  );
}
