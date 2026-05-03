'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';

function getScoreColor(score, inverted = false) {
  const s = inverted ? 100 - score : score;
  if (s >= 70) return 'text-red-400';
  if (s >= 40) return 'text-amber-400';
  return 'text-emerald-400';
}

function getScoreBg(score, inverted = false) {
  const s = inverted ? 100 - score : score;
  if (s >= 70) return 'from-red-500/10 to-red-600/5 border-red-500/20';
  if (s >= 40) return 'from-amber-500/10 to-amber-600/5 border-amber-500/20';
  return 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20';
}

function getRiskLevel(combined) {
  if (combined >= 70) return { label: 'High Risk', color: 'text-red-400' };
  if (combined >= 40) return { label: 'Medium Risk', color: 'text-amber-400' };
  if (combined >= 20) return { label: 'Low Risk', color: 'text-yellow-400' };
  return { label: 'Original', color: 'text-emerald-400' };
}

export default function PlagiarismCheckerClient() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [webResult, setWebResult] = useState(null);
  const [activeTab, setActiveTab] = useState('ai');
  const { addToast } = useToast();

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleCheck = async () => {
    if (!text.trim() || text.trim().length < 50) {
      addToast('Please enter at least 50 characters of text.', 'error');
      return;
    }
    if (text.length > 5000) {
      addToast('Text exceeds 5000 character limit.', 'error');
      return;
    }

    setLoading(true);
    setAiResult(null);
    setWebResult(null);

    try {
      const [aiRes, webRes] = await Promise.allSettled([
        fetch('/api/plagiarism-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        }).then((r) => r.json()),
        fetch('/api/plagiarism-web', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        }).then((r) => r.json()),
      ]);

      if (aiRes.status === 'fulfilled' && !aiRes.value.error) {
        setAiResult(aiRes.value);
      } else {
        const errMsg = aiRes.status === 'fulfilled' ? aiRes.value.error : 'AI analysis failed';
        setAiResult({ error: errMsg });
      }

      if (webRes.status === 'fulfilled' && !webRes.value.error) {
        setWebResult(webRes.value);
      } else {
        const errMsg = webRes.status === 'fulfilled' ? webRes.value.error : 'Web search failed';
        setWebResult({ error: errMsg });
      }

      addToast('Analysis complete!', 'success');
    } catch {
      addToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setAiResult(null);
    setWebResult(null);
  };

  const handleSample = () => {
    setText(`In today's rapidly evolving digital landscape, artificial intelligence has become an integral part of our daily lives. From the moment we wake up to the time we go to bed, AI-powered systems are working behind the scenes to make our experiences more seamless and efficient. Whether it's the recommendation algorithms that suggest what we should watch next, or the voice assistants that help us manage our schedules, the impact of AI is undeniable. As we move forward into the future, it's important to consider both the benefits and the potential challenges that come with this transformative technology.`);
  };

  const aiDetectionScore = aiResult && !aiResult.error ? aiResult.aiDetectionScore : null;
  const originalityScore = aiResult && !aiResult.error ? aiResult.originalityScore : null;
  const webMatchScore = webResult && !webResult.error ? (webResult.webMatchScore ?? 0) : null;

  const combinedRisk =
    aiDetectionScore !== null && webMatchScore !== null
      ? Math.round((aiDetectionScore * 0.4) + ((100 - originalityScore) * 0.3) + (webMatchScore * 0.3))
      : aiDetectionScore !== null
      ? Math.round((aiDetectionScore * 0.6) + ((100 - originalityScore) * 0.4))
      : null;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">
            Paste Your Text
          </label>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500">{wordCount} words</span>
            <span className={`font-mono ${charCount > 4500 ? 'text-red-400' : 'text-gray-500'}`}>
              {charCount}/5000
            </span>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => e.target.value.length <= 5000 && setText(e.target.value)}
          placeholder="Paste the text you want to check for plagiarism (minimum 50 characters, maximum 5000 characters)..."
          className="w-full h-56 sm:h-72 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none focus:outline-none focus:border-rose-500/50 placeholder-gray-600 text-sm leading-relaxed"
        />
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button
            onClick={handleCheck}
            disabled={loading || !text.trim() || text.trim().length < 50}
            className="flex-1 min-w-[180px] py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Checking...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>
                </svg>
                Check Plagiarism
              </>
            )}
          </button>
          <button
            onClick={handleSample}
            disabled={loading}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors text-sm"
          >
            Try Sample Text
          </button>
          <button
            onClick={handleClear}
            disabled={loading || !text}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors text-sm disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Running AI analysis and searching the web...</p>
            <p className="text-gray-600 text-xs">This may take 10-15 seconds</p>
          </div>
        </div>
      )}

      {(aiResult || webResult) && !loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {aiDetectionScore !== null && (
              <div className={`bg-gradient-to-br ${getScoreBg(aiDetectionScore)} border rounded-xl p-4 text-center`}>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">AI Detection</p>
                <p className={`text-3xl font-bold ${getScoreColor(aiDetectionScore)}`}>{aiDetectionScore}%</p>
                <p className="text-[10px] text-gray-500 mt-1">Likely AI-written</p>
              </div>
            )}
            {originalityScore !== null && (
              <div className={`bg-gradient-to-br ${getScoreBg(originalityScore, true)} border rounded-xl p-4 text-center`}>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Originality</p>
                <p className={`text-3xl font-bold ${getScoreColor(originalityScore, true)}`}>{originalityScore}%</p>
                <p className="text-[10px] text-gray-500 mt-1">Unique voice</p>
              </div>
            )}
            {webMatchScore !== null && !webResult.disabled && (
              <div className={`bg-gradient-to-br ${getScoreBg(webMatchScore)} border rounded-xl p-4 text-center`}>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Web Match</p>
                <p className={`text-3xl font-bold ${getScoreColor(webMatchScore)}`}>{webMatchScore}%</p>
                <p className="text-[10px] text-gray-500 mt-1">{webResult.matchedSentences}/{webResult.totalSentences} sentences</p>
              </div>
            )}
            {combinedRisk !== null && (
              <div className={`bg-gradient-to-br ${getScoreBg(combinedRisk)} border rounded-xl p-4 text-center`}>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Combined Risk</p>
                <p className={`text-3xl font-bold ${getScoreColor(combinedRisk)}`}>{combinedRisk}%</p>
                <p className={`text-[10px] mt-1 font-medium ${getRiskLevel(combinedRisk).color}`}>{getRiskLevel(combinedRisk).label}</p>
              </div>
            )}
          </div>

          {webResult && webResult.disabled && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 shrink-0 mt-0.5">
                <path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
              </svg>
              <div>
                <p className="text-amber-300 text-sm font-medium">Web search unavailable</p>
                <p className="text-amber-400/70 text-xs mt-0.5">{webResult.message} Showing AI analysis only.</p>
              </div>
            </div>
          )}

          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-5 py-3 text-sm font-medium transition-colors ${activeTab === 'ai' ? 'text-rose-400 border-b-2 border-rose-500' : 'text-gray-500 hover:text-gray-300'}`}
              >
                AI Analysis
              </button>
              <button
                onClick={() => setActiveTab('web')}
                className={`px-5 py-3 text-sm font-medium transition-colors ${activeTab === 'web' ? 'text-rose-400 border-b-2 border-rose-500' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Web Sources
                {webResult && !webResult.error && !webResult.disabled && webResult.matchedSentences > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] rounded-full font-mono">
                    {webResult.matchedSentences}
                  </span>
                )}
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === 'ai' && (
                <div className="space-y-5">
                  {aiResult && aiResult.error && (
                    <div className="text-red-400 text-sm">{aiResult.error}</div>
                  )}

                  {aiResult && !aiResult.error && (
                    <>
                      <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Verdict</p>
                        <p className="text-gray-200 text-sm leading-relaxed">{aiResult.verdict}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                          Cliche & Templated Phrases ({aiResult.clichePhrases.length})
                        </p>
                        {aiResult.clichePhrases.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {aiResult.clichePhrases.map((phrase, i) => (
                              <span key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                                {phrase}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No cliched or templated phrases detected. Good originality!</p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                          Suspicious Sections ({aiResult.suspiciousSections.length})
                        </p>
                        {aiResult.suspiciousSections.length > 0 ? (
                          <div className="space-y-2">
                            {aiResult.suspiciousSections.map((section, i) => (
                              <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                                <p className="text-gray-200 text-sm italic mb-1.5">&ldquo;{section.text}&rdquo;</p>
                                <p className="text-red-300/70 text-xs">{section.reason}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No suspicious sections found. Writing appears consistent.</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'web' && (
                <div className="space-y-3">
                  {webResult && webResult.error && (
                    <div className="text-red-400 text-sm">{webResult.error}</div>
                  )}

                  {webResult && webResult.disabled && (
                    <p className="text-gray-500 text-sm">{webResult.message}</p>
                  )}

                  {webResult && !webResult.error && !webResult.disabled && webResult.matches.length === 0 && (
                    <p className="text-gray-500 text-sm">No web sources searched.</p>
                  )}

                  {webResult && !webResult.error && !webResult.disabled && webResult.matches.length > 0 && (
                    <>
                      <p className="text-xs text-gray-500 mb-3">
                        Searched {webResult.totalSentences} distinctive sentences. Found web matches for {webResult.matchedSentences} of them.
                      </p>
                      {webResult.matches.map((match, i) => (
                        <div key={i} className={`rounded-xl border p-4 ${match.sources.length > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                          <div className="flex items-start gap-2 mb-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider shrink-0 ${match.sources.length > 0 ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                              {match.sources.length > 0 ? `${match.sources.length} match` : 'No match'}
                            </span>
                            <p className="text-gray-200 text-sm italic">&ldquo;{match.sentence}&rdquo;</p>
                          </div>
                          {match.sources.length > 0 && (
                            <div className="space-y-2 ml-2 pl-3 border-l border-red-500/20">
                              {match.sources.map((source, j) => (
                                <div key={j} className="text-sm">
                                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-300 font-medium block truncate">
                                    {source.title || source.url}
                                  </a>
                                  <p className="text-xs text-gray-500 truncate">{source.url}</p>
                                  {source.snippet && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: source.snippet }} />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
