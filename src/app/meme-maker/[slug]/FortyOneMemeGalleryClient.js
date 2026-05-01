'use client';

import { useState } from 'react';
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/Toast';

const ALL_IMAGES = [
  { id: 0, src: '/41-memes/41-meme1.gif', alt: '41 Meme 1 - Funny 41 Reaction GIF', isGif: true },
  { id: 1, src: '/41-memes/41-meme2.gif', alt: '41 Meme 2 - Hilarious 41 GIF', isGif: true },
  { id: 2, src: '/41-memes/41-meme3.gif', alt: '41 Meme 3 - 41 Reaction GIF', isGif: true },
  { id: 3, src: '/41-memes/41-meme4.gif', alt: '41 Meme 4 - Funny 41 GIF', isGif: true },
  { id: 4, src: '/41-memes/41-meme5.jpg', alt: '41 Meme 5 - 41 Meme Image', isGif: false },
  { id: 5, src: '/41-memes/41-meme6.png', alt: '41 Meme 6 - 41 Meme Image', isGif: false },
  { id: 6, src: '/41-memes/41-meme7.png', alt: '41 Meme 7 - 41 Meme Image', isGif: false },
  { id: 7, src: '/41-memes/41-meme8.png', alt: '41 Meme 8 - 41 Meme Image', isGif: false },
  { id: 8, src: '/41-memes/41-meme9.png', alt: '41 Meme 9 - 41 Meme Image', isGif: false },
  { id: 9, src: '/41-memes/41-meme10.png', alt: '41 Meme 10 - 41 Meme Image', isGif: false },
];

export default function FortyOneMemeGalleryClient() {
  const [lightbox, setLightbox] = useState(null);
  const { addToast } = useToast();

  const handleDownload = async (src, idx) => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = src.split('.').pop();
      a.download = `41-meme-${idx + 1}.${ext}`;
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
            {img.isGif && (
              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 text-[10px] font-bold text-rose-400 rounded uppercase tracking-wider">
                GIF
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(img.src, i); }}
              className="absolute bottom-2 right-2 p-2 bg-rose-500/90 hover:bg-rose-400 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              aria-label={`Download ${img.alt}`}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/80 hover:text-white z-10">
            <X className="w-8 h-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white/80 hover:text-white z-10">
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white/80 hover:text-white z-10">
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={ALL_IMAGES[lightbox].src}
              alt={ALL_IMAGES[lightbox].alt}
              className="max-h-[75vh] w-auto rounded-lg shadow-2xl object-contain"
            />
            <button
              onClick={() => handleDownload(ALL_IMAGES[lightbox].src, lightbox)}
              className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-400 text-white rounded-xl font-semibold transition-colors"
            >
              <Download className="w-5 h-5" />
              Download {ALL_IMAGES[lightbox].isGif ? 'GIF' : 'Image'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
