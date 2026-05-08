'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/components/Toast';
import { encodeWav, resampleBuffer } from '@/lib/wav-encoder';

const VIDEO_ID_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

function extractVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const cleaned = url.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(cleaned)) return cleaned;
  const match = cleaned.match(VIDEO_ID_REGEX);
  return match ? match[1] : null;
}

const WAV_QUALITIES = [
  { value: '16-44100', label: '16-bit', sub: '44.1 kHz · CD' },
  { value: '16-48000', label: '16-bit', sub: '48 kHz · DVD' },
  { value: '24-44100', label: '24-bit', sub: '44.1 kHz · Studio' },
  { value: '24-48000', label: '24-bit', sub: '48 kHz · Studio HD' },
];

const STAGES = {
  preparing: 'Preparing source on YouTube\u2026',
  fetching: 'Downloading audio stream\u2026',
  decoding: 'Decoding audio to PCM\u2026',
  resampling: 'Resampling to target rate\u2026',
  encoding: 'Encoding WAV file\u2026',
  done: 'Ready to download',
};

function fmtElapsed(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function safeFileName(title) {
  return (title || 'youtube-audio').replace(/[^a-z0-9_\-\s]/gi, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'youtube-audio';
}

export default function YouTubeToWavClient() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('16-44100');
  const [stage, setStage] = useState(null); // null | one of STAGES keys
  const [progress, setProgress] = useState(0); // 0..1 within the current stage
  const [elapsed, setElapsed] = useState(0); // ms since conversion started
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const audioCtxRef = useRef(null);
  const startTimeRef = useRef(0);
  const tickRef = useRef(null);
  const { addToast } = useToast();

  // Drive the elapsed-time counter while a conversion is in flight. Without
  // this, a slow upstream (10+ s of "preparing" on RapidAPI) feels frozen
  // because every individual stage hides behind a single blocking await.
  useEffect(() => {
    const isWorking = stage && stage !== 'done';
    if (!isWorking) {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }
    if (!tickRef.current) {
      tickRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 250);
    }
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [stage]);

  const videoId = useMemo(() => extractVideoId(url), [url]);
  const isValidUrl = !!videoId;
  const previewThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  const [bitDepthStr, sampleRateStr] = quality.split('-');
  const bitDepth = parseInt(bitDepthStr, 10);
  const sampleRate = parseInt(sampleRateStr, 10);

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
    setStage(null);
    setProgress(0);
    setElapsed(0);
  };

  const performConversion = async () => {
    setError(null);
    setResult(null);
    setProgress(0);
    setElapsed(0);
    startTimeRef.current = Date.now();
    setStage('preparing');

    // Track whether we reached the success path so the `finally` knows
    // whether to leave stage='done' (success) or null it out (any failure).
    let succeeded = false;

    try {
      // 1) Server hands us back the audio bytes as same-origin audio/*.
      //    The first ~1-3 s on this fetch is server-side: RapidAPI
      //    conversion + (rarely) "still processing" backoff or a fall-
      //    through to the MP4 host's audio-only stream. Once the upstream
      //    is ready, the response body streams the bytes.
      const res = await fetch('/api/youtube-mp3-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        let errBody = null;
        try { errBody = await res.json(); } catch { /* not JSON */ }
        setError({
          message: errBody?.error || `Conversion failed (HTTP ${res.status}).`,
          retryable: errBody?.retryable !== false,
          configError: errBody?.configError === true,
          processing: errBody?.processing === true,
        });
        addToast(errBody?.error || 'Conversion failed.', 'error');
        return;
      }

      // Two response shapes possible:
      //   - audio/* binary body: stream-proxy mode (MP3 host, CORS-restricted)
      //   - application/json: direct-fetch mode (MP4 host fallback whose
      //     googlevideo.com CDN allows CORS, so we fetch it ourselves to
      //     avoid Vercel's proxy timeout chewing through the function budget)
      const responseCt = (res.headers.get('Content-Type') || '').toLowerCase();
      let mp3Buffer;
      let decodedTitle = null;
      let durationHeader = null;

      if (responseCt.includes('application/json')) {
        // 2a) Direct-fetch path. The server hands us the audio link plus
        //     metadata; we fetch the bytes from googlevideo.com ourselves.
        const directInfo = await res.json().catch(() => null);
        if (!directInfo?.direct || !directInfo.link) {
          throw new Error('Server returned an unusable response.');
        }
        decodedTitle = directInfo.title || null;
        durationHeader = directInfo.duration || null;

        setStage('fetching');
        setProgress(0);
        let directRes;
        try {
          directRes = await fetch(directInfo.link);
        } catch (netErr) {
          throw new Error('Could not reach the audio CDN. ' + (netErr?.message || 'Network error.'));
        }
        if (!directRes.ok || !directRes.body) {
          throw new Error(`Audio CDN returned HTTP ${directRes.status}. Please retry.`);
        }
        const directLen = parseInt(directRes.headers.get('Content-Length') || '0', 10);
        const reader = directRes.body.getReader();
        const chunks = [];
        let received = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          if (directLen > 0) setProgress(received / directLen);
        }
        mp3Buffer = new ArrayBuffer(received);
        const bytes = new Uint8Array(mp3Buffer);
        let offset = 0;
        for (const c of chunks) {
          bytes.set(c, offset);
          offset += c.length;
        }
      } else {
        // 2b) Stream-proxy path (MP3 host). Body is audio/* directly.
        const titleHeader = res.headers.get('X-Video-Title');
        durationHeader = res.headers.get('X-Video-Duration');
        decodedTitle = titleHeader ? decodeURIComponent(titleHeader) : null;

        setStage('fetching');
        setProgress(0);
        const totalLen = parseInt(res.headers.get('Content-Length') || '0', 10);
        const reader = res.body.getReader();
        const chunks = [];
        let received = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          if (totalLen > 0) setProgress(received / totalLen);
        }
        mp3Buffer = new ArrayBuffer(received);
        const bytes = new Uint8Array(mp3Buffer);
        let offset = 0;
        for (const c of chunks) {
          bytes.set(c, offset);
          offset += c.length;
        }
      }

      // 3) Decode the MP3 into a PCM AudioBuffer.
      setStage('decoding');
      setProgress(0);
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) throw new Error('Your browser does not support the Web Audio API. Please use a recent Chrome, Safari, Firefox, or Edge.');
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      const buffer = await ctx.decodeAudioData(mp3Buffer);

      // 4) Resample only when needed.
      const channels = Math.min(2, buffer.numberOfChannels);
      let finalBuffer = buffer;
      if (buffer.sampleRate !== sampleRate || buffer.numberOfChannels !== channels) {
        setStage('resampling');
        setProgress(0);
        finalBuffer = await resampleBuffer(buffer, sampleRate, channels);
      }

      // 5) Encode WAV (chunked, with progress, yielding to the UI thread
      //    so the progress bar can paint and the page stays interactive).
      setStage('encoding');
      setProgress(0);
      const wavBytes = await encodeWav(finalBuffer, bitDepth, (p) => setProgress(p));

      const blob = new Blob([wavBytes], { type: 'audio/wav' });
      const sizeMB = (blob.size / 1024 / 1024).toFixed(1);

      setResult({
        title: decodedTitle || 'YouTube Audio',
        duration: durationHeader || formatDuration(finalBuffer.duration),
        bitDepth,
        sampleRate,
        channels,
        sizeMB,
        blob,
        thumbnail: previewThumbnail,
        elapsedMs: Date.now() - startTimeRef.current,
      });
      setStage('done');
      setRetryCount(0);
      succeeded = true;
      addToast('WAV ready to download!', 'success');
    } catch (e) {
      const msg =
        (e && e.message) ||
        (typeof e === 'string' ? e : 'Conversion failed unexpectedly.');
      setError({
        message:
          /decode/i.test(msg)
            ? 'Could not decode the audio. The MP3 stream may be corrupt or in an unsupported codec — please retry.'
            : msg,
        retryable: true,
      });
      addToast('Conversion failed.', 'error');
    } finally {
      // Whichever way the conversion left the try block — early `return`
      // on a server error, decode/encode throw, or success — make sure the
      // spinner/stage is cleared. Without this, the UI used to be stuck on
      // "Preparing source on YouTube..." forever after a 502 from the API.
      if (!succeeded) {
        setStage(null);
        setProgress(0);
      }
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
    if (!result?.blob) return;
    const filename = `${safeFileName(result.title)}.wav`;
    downloadBlob(result.blob, filename);
  };

  const isWorking = stage && stage !== 'done';

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
              onKeyDown={(e) => e.key === 'Enter' && isValidUrl && !isWorking && handleConvert()}
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
            disabled={isWorking}
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

        <div className="mt-5">
          <label className="text-xs text-gray-400 uppercase tracking-wider font-medium block mb-2">
            Quality
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {WAV_QUALITIES.map((q) => (
              <button
                key={q.value}
                onClick={() => setQuality(q.value)}
                disabled={isWorking}
                className={`px-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                  quality === q.value
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

        <div className="flex flex-wrap items-center gap-2 mt-5">
          <button
            onClick={handleConvert}
            disabled={isWorking || !isValidUrl}
            className="flex-1 min-w-[200px] py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isWorking ? (
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
                Convert to WAV
              </>
            )}
          </button>
          {url && (
            <button
              onClick={handleClear}
              disabled={isWorking}
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

      {isWorking && (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-sm font-medium">{STAGES[stage]}</p>
              <p className="text-gray-500 text-[11px] mt-0.5 font-mono">
                elapsed {fmtElapsed(elapsed)}
                {(stage === 'fetching' || stage === 'encoding') && progress > 0 && (
                  <> · {Math.round(progress * 100)}%</>
                )}
              </p>
            </div>
          </div>

          {(stage === 'fetching' || stage === 'encoding') && progress > 0 && (
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-red-500 transition-all"
                style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
              />
            </div>
          )}

          {stage === 'preparing' && elapsed > 5000 && (
            <p className="text-amber-300/80 text-xs mt-3">
              YouTube is still preparing the source audio for this video — that&apos;s normal on first
              conversion of a video. If this is the first time anyone has converted this clip,
              the upstream service caches it in 5-15 seconds.
            </p>
          )}
          {stage === 'encoding' && elapsed > 20000 && (
            <p className="text-amber-300/80 text-xs mt-3">
              Long tracks take more time to encode in the browser. For 1-hour+ audio, picking
              16-bit / 44.1 kHz roughly halves the encode time.
            </p>
          )}

          <p className="text-gray-500 text-xs mt-3">
            Conversion happens in your browser — your audio is never stored on a server.
            Most clips finish in 5-20 seconds.
          </p>
        </div>
      )}

      {error && !isWorking && (
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

      {result && stage === 'done' && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            {result.thumbnail && (
              <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-black/40 shrink-0">
                <Image
                  src={result.thumbnail}
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
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-wide font-mono">
                  WAV {result.bitDepth}-bit / {result.sampleRate / 1000} kHz
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
                  {result.sizeMB} MB
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
                Download WAV
              </button>
              <p className="text-[11px] text-gray-500 mt-2">
                File generated locally in your browser — never uploaded anywhere.
                {result.elapsedMs ? <> · Converted in {fmtElapsed(result.elapsedMs)}.</> : null}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
