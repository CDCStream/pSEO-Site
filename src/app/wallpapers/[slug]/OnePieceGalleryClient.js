'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/Toast';

const ALL_IMAGES = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  src: `/one-piece-wallpapers/one-piece-wallpaper${i + 1}.png`,
  alt: `One Piece Wallpaper ${i + 1} - Free HD Anime Phone Background`,
}));

export default function OnePieceGalleryClient() {
  const [lightbox, setLightbox] = useState(null);
  const { addToast } = useToast();

  const handleDownload = async (src, idx) => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `one-piece-wallpaper-${idx + 1}.png`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Wallpaper downloaded!', 'success');
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
            className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/20 aspect-[9/16] cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading={i < 10 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(img.src, i); }}
              className="absolute bottom-2 right-2 p-2 bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              aria-label={`Download One Piece Wallpaper ${i + 1}`}
            >
              <Download className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10">
            <X className="w-8 h-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 p-2 text-white/80 hover:text-white z-10">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 p-2 text-white/80 hover:text-white z-10">
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-lg h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={ALL_IMAGES[lightbox].src}
              alt={ALL_IMAGES[lightbox].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleDownload(ALL_IMAGES[lightbox].src, lightbox); }}
            className="absolute bottom-6 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-medium flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download HD
          </button>
        </div>
      )}
    </>
  );
}
