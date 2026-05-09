'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Search,
  Loader2,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  Lock,
  Eye,
  Server,
  Pause,
  Play,
  ExternalLink,
  AlertCircle,
  Clipboard,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

function formatCount(n) {
  if (!Number.isFinite(n)) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return String(n);
}

function downloadFromProxy(url, filename) {
  if (!url) return;
  const sep = url.includes('?') ? '&' : '?';
  const dl = `${url}${sep}download=1`;
  const a = document.createElement('a');
  a.href = dl;
  if (filename) a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function InstagramHighlightsViewerClient() {
  const [input, setInput] = useState('');
  const [profile, setProfile] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState(null);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const profileCacheRef = useRef(new Map());
  const storiesCacheRef = useRef(new Map());
  const inputRef = useRef(null);
  const { addToast } = useToast();

  const search = useCallback(
    async (raw) => {
      const cleaned = (raw ?? input).trim();
      if (!cleaned) return;

      const cached = profileCacheRef.current.get(cleaned.toLowerCase());
      if (cached && Date.now() - cached.t < 60_000) {
        setProfile(cached.profile);
        setHighlights(cached.highlights);
        setError(null);
        return;
      }

      setLoadingProfile(true);
      setError(null);
      setProfile(null);
      setHighlights([]);
      try {
        const res = await fetch('/api/instagram/highlights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleaned }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError({
            code: data?.error || 'failed',
            message: data?.message || `Lookup failed (HTTP ${res.status}).`,
          });
          if (data?.profile) setProfile(data.profile);
          return;
        }
        setProfile(data.profile);
        setHighlights(data.highlights || []);
        profileCacheRef.current.set(cleaned.toLowerCase(), {
          t: Date.now(),
          profile: data.profile,
          highlights: data.highlights || [],
        });
      } catch (err) {
        setError({ code: 'network', message: err?.message || 'Network error. Try again.' });
      } finally {
        setLoadingProfile(false);
      }
    },
    [input]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    search();
  };

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        inputRef.current?.focus();
      }
    } catch {
      addToast('Clipboard access blocked. Paste manually.', 'error');
    }
  };

  const onClear = () => {
    setInput('');
    setProfile(null);
    setHighlights([]);
    setError(null);
    inputRef.current?.focus();
  };

  const openHighlight = useCallback(async (h) => {
    setActiveHighlight(h);
    setStoryIndex(0);
    setProgress(0);
    setPaused(false);

    const cached = storiesCacheRef.current.get(h.id);
    if (cached && Date.now() - cached.t < 60_000) {
      setStories(cached.stories);
      return;
    }
    setStories([]);
    setStoriesLoading(true);
    try {
      const res = await fetch('/api/instagram/highlight-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highlightId: h.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError({
          code: data?.error || 'failed',
          message: data?.message || `Failed to load highlight stories.`,
        });
        setActiveHighlight(null);
        return;
      }
      const list = data.stories || [];
      setStories(list);
      storiesCacheRef.current.set(h.id, { t: Date.now(), stories: list });
      if (!list.length) {
        setError({ code: 'empty', message: 'No stories were found in this highlight.' });
        setActiveHighlight(null);
      }
    } catch (err) {
      setError({ code: 'network', message: err?.message || 'Network error.' });
      setActiveHighlight(null);
    } finally {
      setStoriesLoading(false);
    }
  }, []);

  const closeViewer = useCallback(() => {
    setActiveHighlight(null);
    setStories([]);
    setStoryIndex(0);
    setProgress(0);
    setPaused(false);
  }, []);

  const nextStory = useCallback(() => {
    setStoryIndex((i) => {
      if (i + 1 >= stories.length) {
        setActiveHighlight(null);
        setStories([]);
        return 0;
      }
      setProgress(0);
      return i + 1;
    });
  }, [stories.length]);

  const prevStory = useCallback(() => {
    setStoryIndex((i) => {
      if (i <= 0) return 0;
      setProgress(0);
      return i - 1;
    });
  }, []);

  useEffect(() => {
    if (!activeHighlight || !stories.length) return undefined;
    const story = stories[storyIndex];
    if (!story) return undefined;
    if (paused) return undefined;

    const durationMs = Math.max(2_000, (Number(story.duration) || 5) * 1_000);
    const start = performance.now() - progress * durationMs;
    let raf;
    const tick = (now) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / durationMs);
      setProgress(ratio);
      if (ratio >= 1) {
        nextStory();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeHighlight, stories, storyIndex, paused, nextStory]);

  useEffect(() => {
    if (!activeHighlight) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowRight') nextStory();
      else if (e.key === 'ArrowLeft') prevStory();
      else if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeHighlight, closeViewer, nextStory, prevStory]);

  useEffect(() => {
    if (!activeHighlight) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeHighlight]);

  const touchRef = useRef({ x: 0, y: 0 });
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 60) {
      if (dx < 0) nextStory();
      else prevStory();
    } else if (dy > 80 && Math.abs(dx) < 60) {
      closeViewer();
    }
  };

  const currentStory = stories[storyIndex];
  const hasResults = !!profile;
  const headerName = useMemo(() => profile?.username || '', [profile]);

  return (
    <div className="space-y-6">
      <form
        onSubmit={onSubmit}
        className="relative rounded-2xl bg-gradient-to-br from-pink-500/10 via-fuchsia-500/10 to-purple-500/10 border border-pink-500/20 p-1.5"
      >
        <div className="flex items-center gap-1.5 bg-black/40 rounded-xl backdrop-blur-sm">
          <div className="pl-4 text-pink-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a public Instagram username (e.g. @nasa or instagram.com/nasa)"
            className="flex-1 bg-transparent border-0 outline-none text-white placeholder:text-gray-500 px-3 py-3.5 text-sm sm:text-base min-w-0"
            autoComplete="off"
            spellCheck={false}
          />
          {input && (
            <button
              type="button"
              onClick={onClear}
              className="p-2 text-gray-500 hover:text-white transition-colors"
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onPaste}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 hover:text-white border-l border-white/10 transition-colors"
          >
            <Clipboard className="w-3.5 h-3.5" />
            Paste
          </button>
          <button
            type="submit"
            disabled={loadingProfile || !input.trim()}
            className="m-1 inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity text-sm shadow-lg shadow-pink-500/20"
          >
            {loadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className="hidden sm:inline">View Highlights</span>
            <span className="sm:hidden">View</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 flex items-start gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" />
          <div className="flex-1 text-sm">
            <div className="font-medium">{error.message}</div>
            {error.code === 'private' && (
              <div className="text-xs text-red-300/80 mt-1">
                Private accounts are protected by Instagram itself; no third-party tool can bypass this.
              </div>
            )}
            {error.code === 'rate_limited' && (
              <div className="text-xs text-red-300/80 mt-1">
                Wait 30-60 seconds and try again. The same limit applies on every viewer site.
              </div>
            )}
          </div>
        </div>
      )}

      {hasResults && (
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="px-5 py-5 sm:px-6 sm:py-6 flex flex-col sm:flex-row gap-5 sm:items-center">
            {profile.profilePic ? (
              <img
                src={profile.profilePic}
                alt={profile.username}
                width={88}
                height={88}
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full ring-2 ring-pink-500/40 object-cover bg-white/5 shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/5 ring-2 ring-pink-500/40 flex items-center justify-center text-2xl text-pink-400 shrink-0">
                @
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg sm:text-xl font-bold text-white truncate">
                  @{profile.username}
                </span>
                {profile.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" aria-label="Verified" />
                )}
                {profile.fullName && (
                  <span className="text-sm text-gray-400 truncate">- {profile.fullName}</span>
                )}
              </div>
              {profile.biography && (
                <p className="mt-1 text-sm text-gray-400 line-clamp-2">{profile.biography}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>
                  <span className="text-gray-300 font-semibold">{formatCount(profile.followerCount)}</span> followers
                </span>
                <span>
                  <span className="text-gray-300 font-semibold">{formatCount(profile.followingCount)}</span> following
                </span>
                <span>
                  <span className="text-gray-300 font-semibold">{highlights.length}</span> highlight{highlights.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
            <a
              href={`https://www.instagram.com/${profile.username}/`}
              target="_blank"
              rel="noopener nofollow noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Profile
            </a>
          </div>

          {highlights.length === 0 ? (
            <div className="border-t border-white/5 px-6 py-12 text-center text-gray-500 text-sm">
              This account has no public highlights.
            </div>
          ) : (
            <div className="border-t border-white/5 px-4 sm:px-6 py-5">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
                {highlights.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => openHighlight(h)}
                    className="group flex flex-col items-center text-center"
                  >
                    <div className="relative w-full aspect-square rounded-full p-[3px] bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-500 transition-transform group-hover:scale-105">
                      <div className="w-full h-full rounded-full bg-black p-[2px]">
                        {h.cover ? (
                          <img
                            src={h.cover}
                            alt={h.title}
                            className="w-full h-full rounded-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-white/5" />
                        )}
                      </div>
                    </div>
                    <span className="mt-2 text-xs text-gray-300 truncate w-full px-1" title={h.title}>
                      {h.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!hasResults && !loadingProfile && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Eye className="w-5 h-5 mx-auto mb-2 text-pink-400" />
            <div className="text-sm font-semibold text-white">Anonymous</div>
            <div className="text-xs text-gray-500 mt-1">The profile owner never sees your view.</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Server className="w-5 h-5 mx-auto mb-2 text-pink-400" />
            <div className="text-sm font-semibold text-white">No Login</div>
            <div className="text-xs text-gray-500 mt-1">Server-side fetch. No Instagram account needed.</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Lock className="w-5 h-5 mx-auto mb-2 text-pink-400" />
            <div className="text-sm font-semibold text-white">No Tracking</div>
            <div className="text-xs text-gray-500 mt-1">No logs, no history, no account required.</div>
          </div>
        </div>
      )}

      {activeHighlight && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            onClick={closeViewer}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
            aria-label="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={prevStory}
            disabled={storyIndex === 0}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white z-10"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={nextStory}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
            aria-label="Next story"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-md aspect-[9/16] bg-black rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 z-10 px-3 pt-3 pb-6 bg-gradient-to-b from-black/70 to-transparent">
              <div className="flex gap-1 mb-3">
                {stories.map((_, i) => (
                  <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-[width] duration-100 linear"
                      style={{
                        width:
                          i < storyIndex
                            ? '100%'
                            : i === storyIndex
                            ? `${progress * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {profile?.profilePic ? (
                  <img
                    src={profile.profilePic}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-white/30"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/10" />
                )}
                <span className="text-sm font-semibold text-white">@{headerName}</span>
                <span className="text-xs text-white/60 truncate">- {activeHighlight.title}</span>
              </div>
            </div>

            <div
              className="absolute inset-0 flex items-center justify-center"
              onMouseDown={() => setPaused(true)}
              onMouseUp={() => setPaused(false)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
            >
              {storiesLoading && (
                <div className="text-white/70 inline-flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading stories...
                </div>
              )}
              {currentStory && currentStory.type === 'video' && currentStory.video ? (
                <video
                  key={currentStory.id}
                  src={currentStory.video}
                  poster={currentStory.image || undefined}
                  className="max-w-full max-h-full w-full h-full object-contain bg-black"
                  autoPlay
                  playsInline
                  controls={false}
                  muted={false}
                />
              ) : currentStory?.image ? (
                <img
                  key={currentStory.id}
                  src={currentStory.image}
                  alt={`Story ${storyIndex + 1} of ${stories.length}`}
                  className="max-w-full max-h-full w-full h-full object-contain"
                />
              ) : null}
            </div>

            <div className="absolute left-0 top-0 h-full w-1/3 sm:hidden" onClick={prevStory} />
            <div className="absolute right-0 top-0 h-full w-1/3 sm:hidden" onClick={nextStory} />

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur"
                aria-label={paused ? 'Resume' : 'Pause'}
              >
                {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                {paused ? 'Play' : 'Pause'}
              </button>
              {currentStory && (currentStory.video || currentStory.image) && (
                <button
                  type="button"
                  onClick={() => {
                    const url = currentStory.video || currentStory.image;
                    const ext = currentStory.video ? 'mp4' : 'jpg';
                    downloadFromProxy(url, `${profile?.username || 'instagram'}-highlight-${storyIndex + 1}.${ext}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download {currentStory.type === 'video' ? 'video' : 'photo'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 px-4 py-3 text-xs text-amber-200/80 flex items-start gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <div>
          <strong className="text-amber-200">Public profiles only.</strong> We are not affiliated
          with Instagram or Meta. We do not host or store any Instagram content; media is fetched
          on demand and streamed directly to your browser.
        </div>
      </div>
    </div>
  );
}
