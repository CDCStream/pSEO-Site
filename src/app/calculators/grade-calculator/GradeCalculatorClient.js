'use client';

import { useState } from 'react';

const LETTER_GRADES = [
  { letter: 'A+', value: 98.5 },
  { letter: 'A', value: 94.5 },
  { letter: 'A-', value: 91 },
  { letter: 'B+', value: 88 },
  { letter: 'B', value: 84.5 },
  { letter: 'B-', value: 81 },
  { letter: 'C+', value: 78 },
  { letter: 'C', value: 74.5 },
  { letter: 'C-', value: 71 },
  { letter: 'D+', value: 68 },
  { letter: 'D', value: 64.5 },
  { letter: 'D-', value: 61 },
  { letter: 'F', value: 0 },
];

function getLetterGrade(percentage) {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}

function getGPA(percentage) {
  if (percentage >= 97) return 4.3;
  if (percentage >= 93) return 4.0;
  if (percentage >= 90) return 3.7;
  if (percentage >= 87) return 3.3;
  if (percentage >= 83) return 3.0;
  if (percentage >= 80) return 2.7;
  if (percentage >= 77) return 2.3;
  if (percentage >= 73) return 2.0;
  if (percentage >= 70) return 1.7;
  if (percentage >= 67) return 1.3;
  if (percentage >= 63) return 1.0;
  if (percentage >= 60) return 0.7;
  return 0.0;
}

let nextId = 1;

function createRow() {
  return { id: nextId++, name: '', grade: '', letterGrade: '', weight: '' };
}

export default function GradeCalculatorClient() {
  const [mode, setMode] = useState('weighted');
  const [gradeType, setGradeType] = useState('percentage');
  const [rows, setRows] = useState(() => Array.from({ length: 5 }, () => createRow()));
  const [result, setResult] = useState(null);

  const [targetGrade, setTargetGrade] = useState('');
  const [remainingWeight, setRemainingWeight] = useState('');

  const [fgCurrent, setFgCurrent] = useState('');
  const [fgTarget, setFgTarget] = useState('');
  const [fgFinalWeight, setFgFinalWeight] = useState('');
  const [fgResult, setFgResult] = useState(null);

  const addRow = () => setRows((prev) => [...prev, createRow()]);

  const removeRow = (id) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const getGradeValue = (row) => {
    if (gradeType === 'percentage') {
      const val = parseFloat(row.grade);
      return isNaN(val) ? null : val;
    }
    const found = LETTER_GRADES.find((lg) => lg.letter === row.letterGrade);
    return found ? found.value : null;
  };

  const calculateWeightedGrade = () => {
    let sumWeightedGrades = 0;
    let sumWeights = 0;
    const validRows = [];

    for (const row of rows) {
      const gradeVal = getGradeValue(row);
      const weightVal = parseFloat(row.weight);
      if (gradeVal === null || isNaN(weightVal) || weightVal <= 0) continue;
      sumWeightedGrades += gradeVal * weightVal;
      sumWeights += weightVal;
      validRows.push({ name: row.name || `Assignment ${validRows.length + 1}`, grade: gradeVal, weight: weightVal });
    }

    if (validRows.length === 0 || sumWeights === 0) {
      setResult({ error: 'Please enter at least one valid grade and weight.' });
      return;
    }

    const weightedAverage = sumWeightedGrades / sumWeights;
    const letterGrade = getLetterGrade(weightedAverage);
    const gpa = getGPA(weightedAverage);

    let neededGrade = null;
    const tgt = parseFloat(targetGrade);
    const remW = parseFloat(remainingWeight);
    if (!isNaN(tgt) && !isNaN(remW) && remW > 0) {
      const totalWeightNeeded = sumWeights + remW;
      const needed = (tgt * totalWeightNeeded - sumWeightedGrades) / remW;
      neededGrade = { target: tgt, remainingWeight: remW, needed: Math.max(0, needed) };
    }

    setResult({
      weightedAverage,
      letterGrade,
      gpa,
      validRows,
      sumWeights,
      neededGrade,
    });
  };

  const calculateFinalGrade = () => {
    const current = parseFloat(fgCurrent);
    const target = parseFloat(fgTarget);
    const finalWeight = parseFloat(fgFinalWeight);

    if (isNaN(current) || isNaN(target) || isNaN(finalWeight)) {
      setFgResult({ error: 'Please fill in all fields with valid numbers.' });
      return;
    }

    if (finalWeight <= 0 || finalWeight > 100) {
      setFgResult({ error: 'Final exam weight must be between 0 and 100.' });
      return;
    }

    const courseWeight = 100 - finalWeight;
    const needed = (target * 100 - current * courseWeight) / finalWeight;

    setFgResult({
      needed,
      current,
      target,
      finalWeight,
      letterNeeded: getLetterGrade(Math.max(0, needed)),
    });
  };

  const resetAll = () => {
    setRows(Array.from({ length: 5 }, () => createRow()));
    setResult(null);
    setTargetGrade('');
    setRemainingWeight('');
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        <button
          onClick={() => setMode('weighted')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'weighted' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Grade Calculator
        </button>
        <button
          onClick={() => setMode('final')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'final' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Final Grade Calculator
        </button>
      </div>

      {mode === 'weighted' ? (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-gray-400">Grade Input:</span>
            <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
              <button
                onClick={() => setGradeType('percentage')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${gradeType === 'percentage' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Percentage
              </button>
              <button
                onClick={() => setGradeType('letter')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${gradeType === 'letter' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Letter Grade
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
                  <th className="pb-3 pr-2 w-8">#</th>
                  <th className="pb-3 pr-2">Assignment (optional)</th>
                  <th className="pb-3 pr-2 w-32">Grade {gradeType === 'percentage' ? '(%)' : '(Letter)'}</th>
                  <th className="pb-3 pr-2 w-28">Weight (%)</th>
                  <th className="pb-3 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((row, i) => (
                  <tr key={row.id} className="group">
                    <td className="py-2 pr-2 text-gray-500 font-mono text-xs">{i + 1}</td>
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                        placeholder={`Assignment ${i + 1}`}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder-gray-600"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      {gradeType === 'percentage' ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={row.grade}
                          onChange={(e) => updateRow(row.id, 'grade', e.target.value)}
                          placeholder="85"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder-gray-600"
                        />
                      ) : (
                        <select
                          value={row.letterGrade}
                          onChange={(e) => updateRow(row.id, 'letterGrade', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#1a1a2e]">--</option>
                          {LETTER_GRADES.map((lg) => (
                            <option key={lg.letter} value={lg.letter} className="bg-[#1a1a2e]">{lg.letter}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={row.weight}
                        onChange={(e) => updateRow(row.id, 'weight', e.target.value)}
                        placeholder="20"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder-gray-600"
                      />
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => removeRow(row.id)}
                        className="p-1.5 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove row"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addRow}
            className="mt-3 px-4 py-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 border border-dashed border-emerald-500/30 hover:border-emerald-500/50 rounded-lg transition-colors"
          >
            + Add Row
          </button>

          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Grade Needed for Remaining Assignments (Optional)
            </h4>
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] text-gray-500 uppercase block mb-1">Target Grade (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                  placeholder="90"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder-gray-600"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] text-gray-500 uppercase block mb-1">Remaining Weight (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={remainingWeight}
                  onChange={(e) => setRemainingWeight(e.target.value)}
                  placeholder="40"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={calculateWeightedGrade}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
              </svg>
              Calculate
            </button>
            <button
              onClick={resetAll}
              className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium hover:text-white hover:border-white/20 transition-colors"
            >
              Reset
            </button>
          </div>

          {result && !result.error && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-emerald-400/70 uppercase tracking-wider mb-1">Weighted Average</p>
                  <p className="text-3xl font-bold text-emerald-400">{result.weightedAverage.toFixed(2)}%</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-400/70 uppercase tracking-wider mb-1">Letter Grade</p>
                  <p className="text-3xl font-bold text-blue-400">{result.letterGrade}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-purple-400/70 uppercase tracking-wider mb-1">GPA</p>
                  <p className="text-3xl font-bold text-purple-400">{result.gpa.toFixed(1)}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Calculation Breakdown</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 text-xs uppercase">
                      <th className="pb-2">Assignment</th>
                      <th className="pb-2 text-right">Grade</th>
                      <th className="pb-2 text-right">Weight</th>
                      <th className="pb-2 text-right">Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {result.validRows.map((r, i) => (
                      <tr key={i}>
                        <td className="py-1.5 text-gray-300">{r.name}</td>
                        <td className="py-1.5 text-right text-gray-300">{r.grade.toFixed(1)}%</td>
                        <td className="py-1.5 text-right text-gray-400">{r.weight}%</td>
                        <td className="py-1.5 text-right text-emerald-400 font-mono">{((r.grade * r.weight) / result.sumWeights).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/10">
                      <td className="pt-2 font-medium text-white">Total</td>
                      <td></td>
                      <td className="pt-2 text-right text-gray-300">{result.sumWeights}%</td>
                      <td className="pt-2 text-right text-emerald-400 font-bold font-mono">{result.weightedAverage.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
                <p className="mt-3 text-xs text-gray-500">
                  Formula: Weighted Average = Σ(Grade × Weight) ÷ Σ(Weights) = {result.weightedAverage.toFixed(2)}%
                </p>
              </div>

              {result.neededGrade && (
                <div className={`rounded-xl border p-4 ${result.neededGrade.needed > 100 ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Grade Needed on Remaining Assignments</h4>
                  {result.neededGrade.needed > 100 ? (
                    <p className="text-red-400">
                      You need <span className="font-bold">{result.neededGrade.needed.toFixed(1)}%</span> on remaining assignments (weight: {result.neededGrade.remainingWeight}%) to achieve {result.neededGrade.target}%. This is <span className="font-bold">not achievable</span> with a maximum score of 100%.
                    </p>
                  ) : (
                    <p className="text-amber-300">
                      You need at least <span className="font-bold text-amber-200">{result.neededGrade.needed.toFixed(1)}%</span> ({getLetterGrade(result.neededGrade.needed)}) on remaining assignments (weight: {result.neededGrade.remainingWeight}%) to achieve a course average of {result.neededGrade.target}%.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {result && result.error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {result.error}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-1">Final Grade Calculator</h3>
          <p className="text-sm text-gray-400 mb-6">Find out what grade you need on your final exam to get your desired course grade.</p>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Your Current Grade (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={fgCurrent}
                onChange={(e) => setFgCurrent(e.target.value)}
                placeholder="85"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Target Grade You Want (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={fgTarget}
                onChange={(e) => setFgTarget(e.target.value)}
                placeholder="90"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Final Exam Weight (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={fgFinalWeight}
                onChange={(e) => setFgFinalWeight(e.target.value)}
                placeholder="40"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 placeholder-gray-600"
              />
            </div>

            <button
              onClick={calculateFinalGrade}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
              </svg>
              Calculate
            </button>
          </div>

          {fgResult && !fgResult.error && (
            <div className="mt-6 space-y-4">
              <div className={`rounded-xl border p-5 text-center ${fgResult.needed > 100 ? 'bg-red-500/5 border-red-500/20' : fgResult.needed < 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
                {fgResult.needed < 0 ? (
                  <>
                    <p className="text-emerald-400 text-lg font-semibold">You already have enough!</p>
                    <p className="text-gray-400 text-sm mt-1">Even with a 0% on the final, you will still achieve your target grade of {fgResult.target}%.</p>
                  </>
                ) : fgResult.needed > 100 ? (
                  <>
                    <p className="text-xs text-red-400/70 uppercase tracking-wider mb-1">Grade Needed on Final</p>
                    <p className="text-3xl font-bold text-red-400">{fgResult.needed.toFixed(1)}%</p>
                    <p className="text-red-400/70 text-sm mt-2">This exceeds 100%. Achieving a {fgResult.target}% course grade is not possible.</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-blue-400/70 uppercase tracking-wider mb-1">Grade Needed on Final</p>
                    <p className="text-3xl font-bold text-blue-400">{fgResult.needed.toFixed(1)}%</p>
                    <p className="text-gray-400 text-sm mt-2">
                      You need at least a <span className="text-blue-300 font-medium">{fgResult.needed.toFixed(1)}% ({fgResult.letterNeeded})</span> on your final exam (worth {fgResult.finalWeight}% of your grade) to get a {fgResult.target}% in the course.
                    </p>
                  </>
                )}
              </div>

              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Formula Used</h4>
                <p className="text-sm text-gray-300 font-mono">
                  Final Needed = (Target × 100 − Current × CourseWeight) ÷ FinalWeight
                </p>
                <p className="text-sm text-gray-300 font-mono mt-1">
                  = ({fgResult.target} × 100 − {fgResult.current} × {100 - fgResult.finalWeight}) ÷ {fgResult.finalWeight}
                </p>
                <p className="text-sm text-emerald-400 font-mono mt-1">
                  = {fgResult.needed.toFixed(2)}%
                </p>
              </div>
            </div>
          )}

          {fgResult && fgResult.error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {fgResult.error}
            </div>
          )}
        </div>
      )}

      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Letter Grade to Percentage Conversion</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase border-b border-white/10">
                <th className="pb-2 pr-4">Letter</th>
                <th className="pb-2 pr-4">GPA</th>
                <th className="pb-2">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { l: 'A+', g: '4.3', p: '97-100%' },
                { l: 'A', g: '4.0', p: '93-96%' },
                { l: 'A-', g: '3.7', p: '90-92%' },
                { l: 'B+', g: '3.3', p: '87-89%' },
                { l: 'B', g: '3.0', p: '83-86%' },
                { l: 'B-', g: '2.7', p: '80-82%' },
                { l: 'C+', g: '2.3', p: '77-79%' },
                { l: 'C', g: '2.0', p: '73-76%' },
                { l: 'C-', g: '1.7', p: '70-72%' },
                { l: 'D+', g: '1.3', p: '67-69%' },
                { l: 'D', g: '1.0', p: '63-66%' },
                { l: 'D-', g: '0.7', p: '60-62%' },
                { l: 'F', g: '0.0', p: '0-59%' },
              ].map((row) => (
                <tr key={row.l}>
                  <td className="py-1.5 pr-4 text-white font-medium">{row.l}</td>
                  <td className="py-1.5 pr-4 text-gray-300">{row.g}</td>
                  <td className="py-1.5 text-gray-400">{row.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
