'use client';

import { useState } from 'react';
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/Toast';

const images = [
  'christmas_wallpaper.png',
  ...Array.from({ length: 31 }, (_, i) => `christmas_wallpaper (${i + 2}).png`),
].filter((_, i) => i < 31);

const ALL_IMAGES = images.map((file, i) => ({
  id: i,
  src: `/christmas-walpaper/${file}`,
  alt: `Christmas Wallpaper ${i + 1}`,
}));

export default function ChristmasGalleryClient() {
  const [lightbox, setLightbox] = useState(null);
  const { addToast } = useToast();

  const handleDownload = async (src, idx) => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `christmas-wallpaper-${idx + 1}.png`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Wallpaper downloaded!', 'success');
    } catch {
      addToast('Download failed', 'error');
    }
  };

  const openLightbox = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox(i => (i <= 0 ? ALL_IMAGES.length - 1 : i - 1));
  const next = () => setLightbox(i => (i >= ALL_IMAGES.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{ALL_IMAGES.length} Christmas Wallpapers</h2>
          <span className="text-xs text-gray-500">Click to preview · Free HD download</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {ALL_IMAGES.map((img, i) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/20 aspect-[9/16] cursor-pointer" onClick={() => openLightbox(i)}>
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <span className="text-xs text-white/80 font-medium">#{i + 1}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload(img.src, i); }}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-green-500/80 text-white transition-colors"
                  aria-label="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
            <X className="w-6 h-6" />
          </button>

          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={ALL_IMAGES[lightbox].src}
              alt={ALL_IMAGES[lightbox].alt}
              className="max-h-[75vh] w-auto rounded-lg shadow-2xl object-contain"
            />
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Wallpaper #{lightbox + 1} of {ALL_IMAGES.length}</span>
              <button
                onClick={() => handleDownload(ALL_IMAGES[lightbox].src, lightbox)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download HD
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
