'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Search,
  Copy,
  Check,
  X,
  Download,
  FileArchive,
  Loader2,
  ClipboardList,
  History,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { tiktokEmojis, tiktokEmojiCategories, emojiUrl } from '@/data/tiktok-emojis';

const RECENT_KEY = 'tiktok-emoji-codes:recent';
const RECENT_MAX = 8;

function copyToClipboard(text) {
  if (typeof navigator === 'undefined') return Promise.reject(new Error('No navigator'));
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

export default function TikTokEmojiCodesClient() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [recent, setRecent] = useState([]);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [preview, setPreview] = useState(null);
  const [zipping, setZipping] = useState(false);
  const [copyAllOk, setCopyAllOk] = useState(false);
  const { addToast } = useToast();
  const copyTimer = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setRecent(arr.filter((s) => typeof s === 'string').slice(0, RECENT_MAX));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tiktokEmojis.filter((e) => {
      if (category !== 'all' && e.category !== category) return false;
      if (!q) return true;
      const hay = `${e.name} ${e.code} ${e.slug} ${e.keywords.join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, category]);

  const counts = useMemo(() => {
    const c = { all: tiktokEmojis.length };
    for (const e of tiktokEmojis) c[e.category] = (c[e.category] || 0) + 1;
    return c;
  }, []);

  const recentEmojis = useMemo(
    () => recent.map((slug) => tiktokEmojis.find((e) => e.slug === slug)).filter(Boolean),
    [recent]
  );

  const recordRecent = useCallback((slug) => {
    setRecent((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, RECENT_MAX);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const onCopy = useCallback(
    async (emoji) => {
      try {
        await copyToClipboard(emoji.code);
        recordRecent(emoji.slug);
        setCopiedSlug(emoji.slug);
        clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopiedSlug(null), 1500);
        addToast(`Copied ${emoji.code}`, 'success', 1800);
      } catch {
        addToast('Could not copy. Try the manual selection.', 'error');
      }
    },
    [addToast, recordRecent]
  );

  const onCopyAll = useCallback(async () => {
    const text = filtered.map((e) => e.code).join(' ');
    if (!text) return;
    try {
      await copyToClipboard(text);
      setCopyAllOk(true);
      setTimeout(() => setCopyAllOk(false), 1500);
      addToast(`Copied ${filtered.length} codes`, 'success', 2000);
    } catch {
      addToast('Could not copy.', 'error');
    }
  }, [filtered, addToast]);

  const onDownloadZip = useCallback(async () => {
    if (zipping) return;
    setZipping(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const list = filtered.length ? filtered : tiktokEmojis;
      const fetches = await Promise.all(
        list.map(async (e) => {
          const res = await fetch(emojiUrl(e.slug));
          if (!res.ok) throw new Error(`Failed: ${e.slug}`);
          return { slug: e.slug, blob: await res.blob() };
        })
      );
      for (const { slug, blob } of fetches) {
        zip.file(`${slug}.png`, blob);
      }
      const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tiktok-emojis-${list.length}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      addToast(`Downloaded ${list.length} PNGs as ZIP`, 'success', 2500);
    } catch (err) {
      addToast(err?.message || 'ZIP build failed.', 'error');
    } finally {
      setZipping(false);
    }
  }, [filtered, zipping, addToast]);

  const onDownloadOne = useCallback((emoji) => {
    const a = document.createElement('a');
    a.href = emojiUrl(emoji.slug);
    a.download = `${emoji.slug}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 via-cyan-500/5 to-lime-500/10 p-1.5">
        <div className="flex items-center gap-2 bg-black/40 rounded-xl backdrop-blur-sm">
          <div className="pl-4 text-pink-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, code, or keyword (e.g. happy, [smile], blush, pride)"
            className="flex-1 bg-transparent border-0 outline-none text-white placeholder:text-gray-500 px-3 py-3.5 text-sm sm:text-base min-w-0"
            spellCheck={false}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-2 text-gray-500 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tiktokEmojiCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              category === c.id
                ? 'bg-pink-500/20 border-pink-500/40 text-pink-200'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {c.label}
            <span className="ml-1.5 text-[10px] text-gray-500">{counts[c.id] || 0}</span>
          </button>
        ))}
      </div>

      {recentEmojis.length > 0 && (
        <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wide">
              <History className="w-3.5 h-3.5" />
              Recently copied
            </span>
            <button
              type="button"
              onClick={clearRecent}
              className="text-[11px] text-gray-500 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentEmojis.map((e) => (
              <button
                key={`recent-${e.slug}`}
                type="button"
                onClick={() => onCopy(e)}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white"
                title={`Copy ${e.code}`}
              >
                <Image
                  src={emojiUrl(e.slug)}
                  alt={e.name}
                  width={20}
                  height={20}
                  unoptimized
                />
                <span className="font-mono text-pink-300">{e.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 px-1">
        <span className="text-xs text-gray-500">
          Showing <span className="text-white font-semibold">{filtered.length}</span> of {tiktokEmojis.length}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCopyAll}
            disabled={!filtered.length}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white text-xs font-medium border border-white/10 transition-colors"
          >
            {copyAllOk ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ClipboardList className="w-3.5 h-3.5" />}
            Copy {filtered.length === tiktokEmojis.length ? 'All' : filtered.length} Codes
          </button>
          <button
            type="button"
            onClick={onDownloadZip}
            disabled={zipping || !filtered.length}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-pink-200 text-xs font-semibold border border-pink-500/30 transition-colors"
          >
            {zipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileArchive className="w-3.5 h-3.5" />}
            Download ZIP
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
          <div className="text-sm text-gray-400">No emojis match your search.</div>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((e) => {
            const justCopied = copiedSlug === e.slug;
            return (
              <div
                key={e.slug}
                className="group relative rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-colors p-3 flex flex-col items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => setPreview(e)}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/[0.03] flex items-center justify-center group-hover:scale-[1.04] transition-transform"
                  aria-label={`Preview ${e.name}`}
                >
                  <Image
                    src={emojiUrl(e.slug)}
                    alt={`TikTok ${e.name} emoji - shortcode ${e.code}`}
                    width={88}
                    height={88}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                    loading="lazy"
                    unoptimized
                  />
                </button>
                <div className="text-sm font-semibold text-white text-center w-full truncate" title={e.name}>
                  {e.name}
                </div>
                <code className="text-[11px] font-mono text-pink-300 bg-pink-500/10 border border-pink-500/20 rounded-md px-2 py-0.5 select-all">
                  {e.code}
                </code>
                <div className="flex items-center gap-1.5 w-full">
                  <button
                    type="button"
                    onClick={() => onCopy(e)}
                    className={`flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      justCopied
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-pink-500/15 hover:bg-pink-500/25 text-pink-200'
                    }`}
                    aria-label={`Copy ${e.code}`}
                  >
                    {justCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {justCopied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownloadOne(e)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                    aria-label={`Download ${e.name} PNG`}
                    title="Download PNG"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
          role="dialog"
        >
          <div
            className="relative max-w-md w-full rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 sm:w-60 sm:h-60 bg-white/[0.03] rounded-3xl flex items-center justify-center">
                <Image
                  src={emojiUrl(preview.slug)}
                  alt={preview.name}
                  width={240}
                  height={240}
                  className="w-40 h-40 sm:w-52 sm:h-52 object-contain"
                  unoptimized
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">{preview.name}</h3>
                <code className="mt-2 inline-block text-sm font-mono text-pink-300 bg-pink-500/10 border border-pink-500/20 rounded-md px-3 py-1">
                  {preview.code}
                </code>
              </div>
              <p className="text-sm text-gray-400 text-center leading-relaxed">{preview.description}</p>
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => onCopy(preview)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-semibold text-sm"
                >
                  <Copy className="w-4 h-4" />
                  Copy {preview.code}
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadOne(preview)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm border border-white/10"
                >
                  <Download className="w-4 h-4" />
                  PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
