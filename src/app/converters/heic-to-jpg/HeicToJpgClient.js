'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  Download,
  X,
  Loader2,
  Check,
  AlertCircle,
  ImageIcon,
  Trash2,
  FileArchive,
  Lock,
  Sliders,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ACCEPT = '.heic,.heif,image/heic,image/heif';

function fmtBytes(b) {
  if (!Number.isFinite(b) || b <= 0) return '0 B';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function isHeic(file) {
  if (!file) return false;
  const name = (file.name || '').toLowerCase();
  if (name.endsWith('.heic') || name.endsWith('.heif')) return true;
  const type = (file.type || '').toLowerCase();
  if (type === 'image/heic' || type === 'image/heif') return true;
  return false;
}

function safeJpgName(originalName) {
  const base = (originalName || 'image')
    .replace(/\.heic$/i, '')
    .replace(/\.heif$/i, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-');
  return `${base}.jpg`;
}

export default function HeicToJpgClient() {
  const [items, setItems] = useState([]);
  const [quality, setQuality] = useState(0.92);
  const [isDragging, setIsDragging] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zipping, setZipping] = useState(false);
  const inputRef = useRef(null);
  const heic2anyRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    return () => {
      setItems((prev) => {
        prev.forEach((it) => {
          if (it.outUrl) URL.revokeObjectURL(it.outUrl);
        });
        return prev;
      });
    };
  }, []);

  const loadHeic2any = useCallback(async () => {
    if (heic2anyRef.current) return heic2anyRef.current;
    const mod = await import('heic2any');
    heic2anyRef.current = mod.default || mod;
    return heic2anyRef.current;
  }, []);

  const addFiles = useCallback(
    (files) => {
      const arr = Array.from(files || []);
      if (!arr.length) return;

      const accepted = [];
      const rejected = [];
      for (const f of arr) {
        if (!isHeic(f)) {
          rejected.push(`${f.name}: not a HEIC/HEIF file`);
          continue;
        }
        if (f.size > MAX_FILE_SIZE) {
          rejected.push(`${f.name}: larger than 50 MB`);
          continue;
        }
        accepted.push({
          id: `${f.name}-${f.size}-${f.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
          file: f,
          name: f.name,
          inSize: f.size,
          status: 'pending',
          outBlob: null,
          outUrl: null,
          outSize: 0,
          error: null,
        });
      }

      if (rejected.length) {
        addToast(rejected[0], 'error');
      }
      if (accepted.length) {
        setItems((prev) => [...prev, ...accepted]);
      }
    },
    [addToast]
  );

  const onPick = (e) => {
    addFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(0);
    if (e.dataTransfer?.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it?.outUrl) URL.revokeObjectURL(it.outUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const clearAll = () => {
    setItems((prev) => {
      prev.forEach((it) => {
        if (it.outUrl) URL.revokeObjectURL(it.outUrl);
      });
      return [];
    });
  };

  const convertOne = async (item) => {
    try {
      setItems((prev) =>
        prev.map((x) => (x.id === item.id ? { ...x, status: 'converting', error: null } : x))
      );

      const heic2any = await loadHeic2any();
      const result = await heic2any({
        blob: item.file,
        toType: 'image/jpeg',
        quality,
      });

      const outBlob = Array.isArray(result) ? result[0] : result;
      const outUrl = URL.createObjectURL(outBlob);
      const outSize = outBlob.size;

      setItems((prev) =>
        prev.map((x) =>
          x.id === item.id
            ? { ...x, status: 'done', outBlob, outUrl, outSize, error: null }
            : x
        )
      );
      return true;
    } catch (err) {
      const message = err?.message || 'Failed to convert this file.';
      setItems((prev) =>
        prev.map((x) => (x.id === item.id ? { ...x, status: 'error', error: message } : x))
      );
      return false;
    }
  };

  const convertAll = async () => {
    if (isProcessing) return;
    const queue = items.filter((x) => x.status === 'pending' || x.status === 'error');
    if (!queue.length) return;
    setIsProcessing(true);
    try {
      for (const it of queue) {
        await convertOne(it);
      }
      addToast('Conversion complete!', 'success');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadOne = (item) => {
    if (!item.outBlob) return;
    const a = document.createElement('a');
    a.href = item.outUrl;
    a.download = safeJpgName(item.name);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadZip = async () => {
    const done = items.filter((x) => x.status === 'done' && x.outBlob);
    if (!done.length || zipping) return;
    setZipping(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      for (const it of done) {
        zip.file(safeJpgName(it.name), it.outBlob);
      }
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'STORE',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `heic-to-jpg-${done.length}-files.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      addToast(`Downloaded ${done.length} JPGs as a ZIP.`, 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to build ZIP.', 'error');
    } finally {
      setZipping(false);
    }
  };

  const totals = items.reduce(
    (acc, it) => {
      acc.inSize += it.inSize;
      if (it.status === 'done') {
        acc.outSize += it.outSize;
        acc.doneCount += 1;
      }
      return acc;
    },
    { inSize: 0, outSize: 0, doneCount: 0 }
  );

  const savedPct =
    totals.inSize > 0 && totals.outSize > 0
      ? Math.max(0, Math.round((1 - totals.outSize / totals.inSize) * 100))
      : 0;

  const pendingCount = items.filter((x) => x.status === 'pending' || x.status === 'error').length;
  const hasItems = items.length > 0;
  const hasDone = items.some((x) => x.status === 'done');

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging((c) => c + 1);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
        }}
        onDragLeave={() => setIsDragging((c) => Math.max(0, c - 1))}
        onDrop={onDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
          isDragging
            ? 'border-rose-400 bg-rose-500/10'
            : 'border-white/15 bg-gradient-to-br from-rose-950/40 to-fuchsia-950/30 hover:border-rose-500/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          onChange={onPick}
          className="hidden"
        />
        <div className="px-6 sm:px-10 py-12 sm:py-16 text-center">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-500 items-center justify-center mb-4 shadow-lg shadow-rose-500/20">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Drop your HEIC files here
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Drag and drop, or click below to pick photos. Up to 50 MB per file. Batch supported.
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-rose-500/20"
          >
            <Upload className="w-5 h-5" />
            Choose HEIC Files
          </button>
          <p className="mt-5 text-xs text-gray-500 inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Files never leave your browser. 100% on-device conversion.
          </p>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-semibold text-white">Output Quality</h3>
          <span className="ml-auto text-sm text-rose-300 font-mono tabular-nums">
            {Math.round(quality * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="100"
          step="1"
          value={Math.round(quality * 100)}
          onChange={(e) => setQuality(parseInt(e.target.value, 10) / 100)}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />
        <div className="flex justify-between text-[11px] text-gray-500 mt-1.5">
          <span>Smaller file</span>
          <span>Recommended (92%)</span>
          <span>Best quality</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { id: 0.7, label: 'Compact', sub: 'smallest' },
            { id: 0.92, label: 'Recommended', sub: 'balanced' },
            { id: 1.0, label: 'Maximum', sub: 'largest' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setQuality(p.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                Math.abs(quality - p.id) < 0.005
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div>{p.label}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{p.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {hasItems && (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-white/5 bg-white/[0.03]">
            <h3 className="text-sm font-semibold text-white">
              {items.length} file{items.length === 1 ? '' : 's'}
            </h3>
            {totals.doneCount > 0 && (
              <span className="text-xs text-gray-400">
                {fmtBytes(totals.inSize)} → {fmtBytes(totals.outSize)}
                {savedPct > 0 && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 font-medium">
                    -{savedPct}%
                  </span>
                )}
              </span>
            )}

            <div className="ml-auto flex flex-wrap gap-2">
              {pendingCount > 0 && (
                <button
                  type="button"
                  onClick={convertAll}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
                >
                  {isProcessing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Convert {pendingCount === items.length ? 'All' : pendingCount}
                </button>
              )}
              {hasDone && totals.doneCount > 1 && (
                <button
                  type="button"
                  onClick={downloadZip}
                  disabled={zipping}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                >
                  {zipping ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileArchive className="w-3.5 h-3.5" />
                  )}
                  Download ZIP
                </button>
              )}
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          <ul className="divide-y divide-white/5">
            {items.map((it) => (
              <li key={it.id} className="px-4 sm:px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4.5 h-4.5 text-rose-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium truncate" title={it.name}>
                      {it.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {fmtBytes(it.inSize)}
                    {it.status === 'done' && it.outSize > 0 && (
                      <>
                        <span className="mx-1.5 text-gray-700">→</span>
                        <span className="text-emerald-400 font-medium">{fmtBytes(it.outSize)}</span>
                      </>
                    )}
                    {it.status === 'error' && it.error && (
                      <span className="ml-2 text-rose-400">{it.error}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {it.status === 'pending' && (
                    <span className="text-[11px] text-gray-500 px-2 py-1">queued</span>
                  )}
                  {it.status === 'converting' && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-rose-300 px-2 py-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      converting
                    </span>
                  )}
                  {it.status === 'error' && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 px-2 py-1">
                      <AlertCircle className="w-3 h-3" />
                      failed
                    </span>
                  )}
                  {it.status === 'done' && (
                    <button
                      type="button"
                      onClick={() => downloadOne(it)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold transition-colors"
                      aria-label={`Download ${safeJpgName(it.name)}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      JPG
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-rose-400 transition-colors"
                    aria-label={`Remove ${it.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <Lock className="w-5 h-5 mx-auto mb-2 text-rose-400" />
          <div className="text-sm font-semibold text-white">100% Private</div>
          <div className="text-xs text-gray-500 mt-1">No upload. Conversion runs in your browser.</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <FileArchive className="w-5 h-5 mx-auto mb-2 text-rose-400" />
          <div className="text-sm font-semibold text-white">Batch &amp; ZIP</div>
          <div className="text-xs text-gray-500 mt-1">Convert dozens at once and download as a ZIP.</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <Check className="w-5 h-5 mx-auto mb-2 text-rose-400" />
          <div className="text-sm font-semibold text-white">Quality Control</div>
          <div className="text-xs text-gray-500 mt-1">Slider from 50% to 100% for size vs. quality.</div>
        </div>
      </div>
    </div>
  );
}
