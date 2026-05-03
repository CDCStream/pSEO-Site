'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useToast } from '@/components/Toast';

const VIDEO_ID_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

function extractVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const cleaned = url.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(cleaned)) return cleaned;
  const match = cleaned.match(VIDEO_ID_REGEX);
  return match ? match[1] : null;
}

const MP3_QUALITIES = [
  { value: '128', label: '128 kbps', sub: 'Standard' },
  { value: '192', label: '192 kbps', sub: 'High' },
  { value: '320', label: '320 kbps', sub: 'Best' },
];

const MP4_QUALITIES = [
  { value: '360', label: '360p', sub: 'Low' },
  { value: '480', label: '480p', sub: 'SD' },
  { value: '720', label: '720p', sub: 'HD' },
  { value: '1080', label: '1080p', sub: 'Full HD' },
];

export default function YouTubeToMp3Client({ defaultFormat = 'mp3' } = {}) {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState(defaultFormat === 'mp4' ? 'mp4' : 'mp3');
  const [mp3Quality, setMp3Quality] = useState('320');
  const [mp4Quality, setMp4Quality] = useState('1080');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { addToast } = useToast();

  const videoId = useMemo(() => extractVideoId(url), [url]);
  const isValidUrl = !!videoId;

  const previewThumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  const currentQuality = format === 'mp3' ? mp3Quality : mp4Quality;
  const qualityOptions = format === 'mp3' ? MP3_QUALITIES : MP4_QUALITIES;
  const setQuality = format === 'mp3' ? setMp3Quality : setMp4Quality;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        addToast('Link pasted!', 'success');
      }
    } catch {
      addToast('Could not access clipboard. Please paste manually.', 'error');
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setError(null);
    setRetryCount(0);
  };

  const performConversion = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/youtube-mp3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format, quality: currentQuality }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError({
          message: data.error || 'Conversion failed.',
          retryable: data.retryable !== false,
          configError: data.configError === true,
        });
        if (data.configError) {
          addToast('Service not configured.', 'error');
        } else {
          addToast(data.error || 'Conversion failed.', 'error');
        }
        return;
      }

      if (data.processing) {
        setError({
          message: data.message || 'Still processing on the server. Please retry shortly.',
          retryable: true,
        });
        return;
      }

      setResult(data);
      setRetryCount(0);
      addToast('Conversion ready!', 'success');
    } catch {
      setError({
        message: 'Network error. Please check your connection and try again.',
        retryable: true,
      });
      addToast('Network error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = () => {
    if (!isValidUrl) {
      addToast('Please enter a valid YouTube URL.', 'error');
      return;
    }
    setRetryCount(0);
    performConversion();
  };

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
    performConversion();
  };

  const handleDownload = () => {
    if (!result?.downloadUrl) return;
    const a = document.createElement('a');
    a.href = result.downloadUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    const safeTitle = (result.title || 'youtube-download').replace(/[^a-z0-9_\-\s]/gi, '').slice(0, 80).trim();
    a.download = `${safeTitle}.${result.format || format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-medium block mb-2">
          YouTube Video URL
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && isValidUrl && !loading && handleConvert()}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-500/50 placeholder-gray-600 text-sm"
            />
            {url && isValidUrl && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" title="Valid YouTube URL">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
            {url && !isValidUrl && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400" title="Invalid YouTube URL">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </span>
            )}
          </div>
          <button
            onClick={handlePaste}
            disabled={loading}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-colors text-sm font-medium disabled:opacity-50"
          >
            Paste Link
          </button>
        </div>

        {previewThumbnail && (
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-black/40 max-w-sm">
            <div className="relative aspect-video">
              <Image
                src={previewThumbnail}
                alt="Video thumbnail preview"
                fill
                sizes="(max-width: 640px) 100vw, 384px"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-14 h-14 rounded-full bg-red-600/95 flex items-center justify-center shadow-lg">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium block mb-2">
              Format
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormat('mp3')}
                disabled={loading}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 ${
                  format === 'mp3'
                    ? 'bg-gradient-to-r from-rose-600 to-red-500 border-transparent text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                MP3 Audio
              </button>
              <button
                onClick={() => setFormat('mp4')}
                disabled={loading}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 ${
                  format === 'mp4'
                    ? 'bg-gradient-to-r from-rose-600 to-red-500 border-transparent text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                MP4 Video
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium block mb-2">
              Quality
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {qualityOptions.map((q) => (
                <button
                  key={q.value}
                  onClick={() => setQuality(q.value)}
                  disabled={loading}
                  className={`px-2 py-2 rounded-lg border text-xs font-medium transition-all ${
                    currentQuality === q.value
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-semibold">{q.label}</div>
                  <div className="text-[10px] opacity-60">{q.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-5">
          <button
            onClick={handleConvert}
            disabled={loading || !isValidUrl}
            className="flex-1 min-w-[200px] py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Converting...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Convert to {format.toUpperCase()}
              </>
            )}
          </button>
          {url && (
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors text-sm disabled:opacity-50"
            >
              Clear
            </button>
          )}
        </div>

        <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
          By using this tool, you confirm that you have the rights to download the content
          (e.g. royalty-free, Creative Commons, your own video, or for personal fair use).
        </p>
      </div>

      {loading && (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Fetching {format.toUpperCase()} from YouTube...</p>
            <p className="text-gray-600 text-xs">Usually takes 5-15 seconds</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-red-300 font-semibold text-sm mb-1">Conversion failed</h3>
              <p className="text-red-200/80 text-sm leading-relaxed">{error.message}</p>
              {error.configError ? (
                <p className="text-red-200/60 text-xs mt-2">
                  Site owner: add <code className="px-1 py-0.5 rounded bg-black/30">RAPIDAPI_KEY</code> in Vercel environment variables.
                </p>
              ) : error.retryable ? (
                <button
                  onClick={handleRetry}
                  className="mt-3 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm font-medium inline-flex items-center gap-2 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                  Try Again {retryCount > 0 && `(${retryCount})`}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            {(result.thumbnail || previewThumbnail) && (
              <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-black/40 shrink-0">
                <Image
                  src={result.thumbnail || previewThumbnail}
                  alt={result.title || 'Video thumbnail'}
                  fill
                  sizes="(max-width: 640px) 100vw, 192px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Ready to download
              </div>
              <h3 className="text-white font-semibold text-base sm:text-lg leading-snug mb-2 break-words">
                {result.title}
              </h3>
              <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                {result.duration && (
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {result.duration}
                  </span>
                )}
                {result.channel && (
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {result.channel}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-wide font-mono">
                  {result.format} {result.quality}{result.format === 'mp3' ? 'kbps' : 'p'}
                </span>
              </div>
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download {result.format.toUpperCase()}
              </button>
              {result.expiresIn && (
                <p className="text-[11px] text-gray-500 mt-2">
                  Download link expires in approximately {result.expiresIn}.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
