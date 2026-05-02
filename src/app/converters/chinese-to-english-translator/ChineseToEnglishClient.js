'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/components/Toast';

export default function ChineseToEnglishClient() {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState('zh-en');
  const [charCount, setCharCount] = useState(0);
  const outputRef = useRef(null);
  const { addToast } = useToast();

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length <= 5000) {
      setInputText(val);
      setCharCount(val.length);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      addToast('Please enter text to translate.', 'error');
      return;
    }

    setLoading(true);
    setTranslation('');

    try {
      const from = direction === 'zh-en' ? 'Chinese (Simplified and Traditional)' : 'English';
      const to = direction === 'zh-en' ? 'English' : 'Chinese (Simplified)';

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText.trim(), from, to }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || 'Translation failed.', 'error');
        return;
      }

      setTranslation(data.translation);
      addToast('Translation complete!', 'success');
    } catch {
      addToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translation) return;
    navigator.clipboard.writeText(translation);
    addToast('Copied to clipboard!', 'success');
  };

  const handleSwap = () => {
    setDirection((d) => (d === 'zh-en' ? 'en-zh' : 'zh-en'));
    if (translation) {
      setInputText(translation);
      setCharCount(translation.length);
      setTranslation('');
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslation('');
    setCharCount(0);
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${direction === 'zh-en' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
          {direction === 'zh-en' ? '中文 Chinese' : 'English'}
        </div>
        <button
          onClick={handleSwap}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
          aria-label="Swap languages"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
            <path d="M7 16V4m0 0L3 8m4-4l4 4" /><path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${direction === 'zh-en' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
          {direction === 'zh-en' ? 'English' : '中文 Chinese'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              {direction === 'zh-en' ? 'Chinese Text' : 'English Text'}
            </label>
            <span className={`text-xs font-mono ${charCount > 4500 ? 'text-red-400' : 'text-gray-500'}`}>
              {charCount}/5000
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder={direction === 'zh-en' ? '请输入中文文本...\nEnter Chinese text here...' : 'Enter English text here...'}
            className="w-full h-56 sm:h-64 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none focus:outline-none focus:border-red-500/50 placeholder-gray-600 text-sm leading-relaxed"
          />
          <div className="flex gap-2">
            <button
              onClick={handleTranslate}
              disabled={loading || !inputText.trim()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Translating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
                  </svg>
                  Translate
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              {direction === 'zh-en' ? 'English Translation' : 'Chinese Translation'}
            </label>
            {translation && (
              <button
                onClick={handleCopy}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                Copy
              </button>
            )}
          </div>
          <div
            ref={outputRef}
            className="w-full h-56 sm:h-64 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm leading-relaxed overflow-y-auto"
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                  <p className="text-gray-500 text-sm">AI is translating...</p>
                </div>
              </div>
            ) : translation ? (
              <p className="text-gray-200 whitespace-pre-wrap">{translation}</p>
            ) : (
              <p className="text-gray-600">Translation will appear here...</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Tips</h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Supports both Simplified (简体) and Traditional (繁體) Chinese</li>
          <li>• Click the swap button to switch between Chinese→English and English→Chinese</li>
          <li>• For best results, include complete sentences rather than isolated words</li>
          <li>• Maximum 5,000 characters per translation</li>
          <li>• AI preserves context, idioms, and natural tone in translations</li>
        </ul>
      </div>
    </div>
  );
}
