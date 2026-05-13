'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useToast } from '@/components/Toast';

const ALL_GIFS = [
  { id: 1, src: '/what-memes/what-meme1.gif', alt: 'What meme GIF #1 \u2014 confused-reaction "what?" face animation, free download' },
  { id: 2, src: '/what-memes/what-meme2.gif', alt: 'What meme GIF #2 \u2014 wide-eyed "wait, what?" reaction, ideal for chat replies and stitches' },
  { id: 3, src: '/what-memes/what-meme3.gif', alt: 'What meme GIF #3 \u2014 cartoon "what?!" double-take animated reaction' },
  { id: 4, src: '/what-memes/what-meme4.gif', alt: 'What meme GIF #4 \u2014 deadpan stare "what" reaction GIF for replies' },
  { id: 5, src: '/what-memes/what-meme5.gif', alt: 'What meme GIF #5 \u2014 squinting confused "what is happening" reaction' },
  { id: 6, src: '/what-memes/what-meme6.gif', alt: 'What meme GIF #6 \u2014 head-tilt "wait what?" cartoon meme animation' },
  { id: 7, src: '/what-memes/what-meme7.gif', alt: 'What meme GIF #7 \u2014 jaw-drop "WHAT?!" reaction GIF for group chats' },
  { id: 8, src: '/what-memes/what-meme8.gif', alt: 'What meme GIF #8 \u2014 surprised "what just happened" loop animation' },
];

export default function WhatMemeGalleryClient() {
  const [lightbox, setLightbox] = useState(null);
  const { addToast } = useToast();

  const handleDownload = useCallback(
    async (src, idx) => {
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `what-meme-${idx + 1}.gif`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        addToast('What meme GIF downloaded!', 'success');
      } catch {
        addToast('Download failed', 'error');
      }
    },
    [addToast]
  );

  const openLightbox = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? null : i <= 0 ? ALL_GIFS.length - 1 : i - 1)),
    []
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : i >= ALL_GIFS.length - 1 ? 0 : i + 1)),
    []
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, prev, next]);

  return (
    <>
      <div className="mb-4 flex items-center gap-2 text-xs text-gray-400">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-200 font-medium">
          <Play className="w-3 h-3" fill="currentColor" />
          Auto-playing
        </span>
        <span>{ALL_GIFS.length} animated GIFs \u00b7 No watermark \u00b7 No signup</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {ALL_GIFS.map((gif, i) => (
          <div
            key={gif.id}
            className="group relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-square cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            <img
              src={gif.src}
              alt={gif.alt}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(gif.src, i);
              }}
              className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-500/95 hover:bg-purple-400 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 backdrop-blur-sm shadow-lg"
              aria-label={`Download ${gif.alt}`}
            >
              <Download className="w-3.5 h-3.5" />
              GIF
            </button>
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono backdrop-blur-sm">#{i + 1}</span>
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 sm:left-4 p-2 text-white/80 hover:text-white z-10 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Previous meme"
          >
            <ChevronLeft className="w-9 h-9" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 sm:right-4 p-2 text-white/80 hover:text-white z-10 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Next meme"
          >
            <ChevronRight className="w-9 h-9" />
          </button>

          <div className="flex flex-col items-center gap-4 max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={ALL_GIFS[lightbox].src}
              alt={ALL_GIFS[lightbox].alt}
              className="max-h-[75vh] w-auto rounded-xl shadow-2xl object-contain"
              draggable={false}
            />
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <span className="text-white/70 text-sm font-mono">{lightbox + 1} / {ALL_GIFS.length}</span>
              <button
                onClick={() => handleDownload(ALL_GIFS[lightbox].src, lightbox)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-xl font-semibold transition-colors shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download GIF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
