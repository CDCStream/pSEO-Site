'use client';

import { useState } from 'react';
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/Toast';

const ALL_IMAGES = [
  { id: 0, src: '/mike-wazowski-meme/mike-wazowski-meme1.gif', ext: 'gif' },
  { id: 1, src: '/mike-wazowski-meme/mike-wazowski-meme2.gif', ext: 'gif' },
  { id: 2, src: '/mike-wazowski-meme/mike-wazowski-meme3.gif', ext: 'gif' },
  { id: 3, src: '/mike-wazowski-meme/mike-wazowski-meme4.gif', ext: 'gif' },
  { id: 4, src: '/mike-wazowski-meme/mike-wazowski-meme5.gif', ext: 'gif' },
  { id: 5, src: '/mike-wazowski-meme/mike-wazowski-meme6.gif', ext: 'gif' },
  { id: 6, src: '/mike-wazowski-meme/mike-wazowski-meme7.gif', ext: 'gif' },
  { id: 7, src: '/mike-wazowski-meme/mike-wazowski-meme8.png', ext: 'png' },
  { id: 8, src: '/mike-wazowski-meme/mike-wazowski-meme9.gif', ext: 'gif' },
  { id: 9, src: '/mike-wazowski-meme/mike-wazowski-meme10.gif', ext: 'gif' },
  { id: 10, src: '/mike-wazowski-meme/mike-wazowski-meme11.gif', ext: 'gif' },
  { id: 11, src: '/mike-wazowski-meme/mike-wazowski-meme12.gif', ext: 'gif' },
  { id: 12, src: '/mike-wazowski-meme/mike-wazowski-meme13.gif', ext: 'gif' },
  { id: 13, src: '/mike-wazowski-meme/mike-wazowski-meme14.gif', ext: 'gif' },
].map((img) => ({
  ...img,
  alt: `Mike Wazowski Meme ${img.id + 1} - Funny Monsters Inc ${img.ext === 'gif' ? 'GIF' : 'Image'}`,
}));

export default function MikeWazowskiMemeGalleryClient() {
  const [lightbox, setLightbox] = useState(null);
  const { addToast } = useToast();

  const handleDownload = async (src, idx, ext) => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mike-wazowski-meme-${idx + 1}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Meme downloaded!', 'success');
    } catch {
      addToast('Download failed', 'error');
    }
  };

  const openLightbox = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((i) => (i <= 0 ? ALL_IMAGES.length - 1 : i - 1));
  const next = () => setLightbox((i) => (i >= ALL_IMAGES.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {ALL_IMAGES.map((img, i) => (
          <div
            key={img.id}
            className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/20 aspect-square cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {img.ext === 'gif' && (
              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 text-[10px] font-bold text-green-400 rounded uppercase tracking-wider">
                GIF
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(img.src, i, img.ext);
              }}
              className="absolute bottom-2 right-2 p-2 bg-lime-500/90 hover:bg-lime-400 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              aria-label={`Download ${img.alt}`}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/80 hover:text-white z-10">
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-white/80 hover:text-white z-10"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-white/80 hover:text-white z-10"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={ALL_IMAGES[lightbox].src}
              alt={ALL_IMAGES[lightbox].alt}
              className="max-h-[75vh] w-auto rounded-lg shadow-2xl object-contain"
            />
            <button
              onClick={() => handleDownload(ALL_IMAGES[lightbox].src, lightbox, ALL_IMAGES[lightbox].ext)}
              className="flex items-center gap-2 px-6 py-3 bg-lime-500 hover:bg-lime-400 text-white rounded-xl font-semibold transition-colors"
            >
              <Download className="w-5 h-5" />
              Download {ALL_IMAGES[lightbox].ext === 'gif' ? 'GIF' : 'Meme'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
