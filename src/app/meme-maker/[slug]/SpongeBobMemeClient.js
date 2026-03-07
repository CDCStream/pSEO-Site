'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/components/Toast';

const TEMPLATES = [
  {
    id: 1,
    name: 'Increasingly Buff SpongeBob',
    file: '/spongebob-memes/spongebob-template.jpg',
    textZones: [
      { id: 'top', label: 'Weak (Top)', x: 0.02, y: 0.04, w: 0.46, h: 0.28, fontSize: 28, align: 'center', valign: 'middle' },
      { id: 'mid', label: 'Normal (Middle)', x: 0.02, y: 0.37, w: 0.46, h: 0.28, fontSize: 28, align: 'center', valign: 'middle' },
      { id: 'bot', label: 'Strong (Bottom)', x: 0.02, y: 0.70, w: 0.46, h: 0.28, fontSize: 28, align: 'center', valign: 'middle' },
    ],
  },
  {
    id: 2,
    name: 'Squidward Leaving',
    file: '/spongebob-memes/spongebob-template2.jpg',
    textZones: [
      { id: 'top', label: 'Leaving For', x: 0.50, y: 0.02, w: 0.48, h: 0.48, fontSize: 30, align: 'center', valign: 'middle' },
      { id: 'bot', label: 'Coming Back For', x: 0.50, y: 0.52, w: 0.48, h: 0.46, fontSize: 30, align: 'center', valign: 'middle' },
    ],
  },
  {
    id: 3,
    name: 'SpongeBob Mocking',
    file: '/spongebob-memes/spongebob-templates3.webp',
    textZones: [
      { id: 'top', label: 'Top Text', x: 0.50, y: 0.02, w: 0.48, h: 0.48, fontSize: 30, align: 'center', valign: 'middle' },
      { id: 'bot', label: 'Bottom Text', x: 0.50, y: 0.52, w: 0.48, h: 0.46, fontSize: 30, align: 'center', valign: 'middle' },
    ],
  },
  {
    id: 4,
    name: 'SpongeBob Burning Paper',
    file: '/spongebob-memes/spongebob-templates4.webp',
    textZones: [
      { id: 'top', label: 'Top Text', x: 0.05, y: 0.02, w: 0.90, h: 0.15, fontSize: 32, align: 'center', valign: 'middle' },
      { id: 'bot', label: 'Bottom Text', x: 0.05, y: 0.83, w: 0.90, h: 0.15, fontSize: 32, align: 'center', valign: 'middle' },
    ],
  },
  {
    id: 5,
    name: 'SpongeBob Worshipping',
    file: '/spongebob-memes/spongebob-templates5.webp',
    textZones: [
      { id: 'paper', label: 'Paper / Sign Text', x: 0.58, y: 0.02, w: 0.38, h: 0.40, fontSize: 32, align: 'center', valign: 'middle' },
      { id: 'spongebob', label: 'SpongeBob Label', x: 0.03, y: 0.55, w: 0.35, h: 0.30, fontSize: 28, align: 'center', valign: 'middle' },
    ],
  },
  {
    id: 6,
    name: 'Poor Squidward vs Rich SpongeBob',
    file: '/spongebob-memes/spongebob-template6.jpg',
    textZones: [
      { id: 'top', label: 'Poor (Top)', x: 0.50, y: 0.02, w: 0.48, h: 0.48, fontSize: 28, align: 'center', valign: 'middle' },
      { id: 'bot', label: 'Rich (Bottom)', x: 0.50, y: 0.52, w: 0.48, h: 0.46, fontSize: 28, align: 'center', valign: 'middle' },
    ],
  },
  {
    id: 7,
    name: 'Smart Patrick vs Dumb Patrick',
    file: '/spongebob-memes/spongebob-template7.jpg',
    textZones: [
      { id: 'left', label: 'Smart Patrick', x: 0.02, y: 0.02, w: 0.46, h: 0.15, fontSize: 24, align: 'center', valign: 'middle' },
      { id: 'right', label: 'Dumb Patrick', x: 0.52, y: 0.02, w: 0.46, h: 0.15, fontSize: 24, align: 'center', valign: 'middle' },
    ],
  },
  {
    id: 8,
    name: 'SpongeBob Ol\' Reliable',
    file: '/spongebob-memes/spongebob-template8.jpg',
    textZones: [
      { id: 'box', label: 'Box Text', x: 0.25, y: 0.50, w: 0.42, h: 0.22, fontSize: 28, align: 'center', valign: 'middle', rotation: 20 },
    ],
  },
  {
    id: 9,
    name: 'Chocolate Guy',
    file: '/spongebob-memes/spongebob-template9.jpg',
    textZones: [
      { id: 'top', label: 'Top Text', x: 0.05, y: 0.02, w: 0.90, h: 0.18, fontSize: 32, align: 'center', valign: 'middle', color: '#fff', stroke: '#000' },
      { id: 'bot', label: 'Bottom Text', x: 0.05, y: 0.80, w: 0.90, h: 0.18, fontSize: 32, align: 'center', valign: 'middle', color: '#fff', stroke: '#000' },
    ],
  },
  {
    id: 10,
    name: 'Here Lies',
    file: '/spongebob-memes/spongebob-template10.jpg',
    textZones: [
      { id: 'tomb', label: 'Tombstone Text', x: 0.22, y: 0.38, w: 0.56, h: 0.30, fontSize: 48, align: 'center', valign: 'middle', rotation: 5 },
    ],
  },
];

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if (ctx.measureText(word).width > maxWidth) {
      if (line) { lines.push(line); line = ''; }
      let chunk = '';
      for (const ch of word) {
        if (ctx.measureText(chunk + ch).width > maxWidth && chunk) {
          lines.push(chunk);
          chunk = ch;
        } else {
          chunk += ch;
        }
      }
      line = chunk;
    } else {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function SpongeBobMemeClient() {
  const [selected, setSelected] = useState(null);
  const [texts, setTexts] = useState({});
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const { addToast } = useToast();

  const template = selected !== null ? TEMPLATES[selected] : null;

  useEffect(() => {
    if (template) {
      const init = {};
      template.textZones.forEach(z => { init[z.id] = texts[z.id] || ''; });
      setTexts(init);
    }
  }, [selected]);

  const drawMeme = useCallback(() => {
    if (!template || !canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    template.textZones.forEach(zone => {
      const txt = texts[zone.id] || '';
      if (!txt) return;

      const zx = zone.x * canvas.width;
      const zy = zone.y * canvas.height;
      const zw = zone.w * canvas.width;
      const zh = zone.h * canvas.height;

      ctx.save();
      if (zone.rotation) {
        const cx = zx + zw / 2;
        const cy = zy + zh / 2;
        ctx.translate(cx, cy);
        ctx.rotate((zone.rotation * Math.PI) / 180);
        ctx.translate(-cx, -cy);
      }
      ctx.beginPath();
      ctx.rect(zx, zy, zw, zh);
      ctx.clip();

      const scale = canvas.width / 800;
      let fs = Math.max(12, Math.round(zone.fontSize * scale));
      let lines, lineHeight, totalH;

      for (let attempt = 0; attempt < 50; attempt++) {
        ctx.font = `bold ${fs}px Impact, Arial Black, sans-serif`;
        lines = wrapText(ctx, txt, zw - 16);
        lineHeight = fs * 1.2;
        totalH = lines.length * lineHeight;
        if (totalH <= zh || fs <= 10) break;
        fs -= 2;
      }

      if (!lines || lines.length === 0) { ctx.restore(); return; }

      ctx.font = `bold ${fs}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = zone.align || 'center';
      ctx.textBaseline = 'top';

      let startY = zy;
      if (zone.valign === 'middle') startY = zy + (zh - totalH) / 2;
      else if (zone.valign === 'bottom') startY = zy + zh - totalH;

      const cx = zx + zw / 2;

      lines.forEach((line, i) => {
        const ly = startY + i * lineHeight;
        if (zone.stroke) {
          ctx.strokeStyle = zone.stroke;
          ctx.lineWidth = Math.max(3, fs / 6);
          ctx.lineJoin = 'round';
          ctx.strokeText(line, cx, ly);
        }
        ctx.fillStyle = zone.color || '#000';
        ctx.fillText(line, cx, ly);
      });

      ctx.restore();
    });
  }, [template, texts]);

  useEffect(() => {
    drawMeme();
  }, [drawMeme]);

  const handleImageLoad = () => {
    drawMeme();
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `spongebob-meme-${template?.name?.toLowerCase().replace(/\s+/g, '-') || 'meme'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    addToast('Meme downloaded!', 'success');
  };

  const handleTextChange = (zoneId, value) => {
    setTexts(prev => ({ ...prev, [zoneId]: value }));
  };

  if (!template) {
    return (
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Choose a SpongeBob Meme Template</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {TEMPLATES.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setSelected(i)}
              className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/20 hover:border-yellow-500/50 transition-all duration-200"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={t.file}
                  alt={t.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-2 bg-black/40">
                <span className="text-xs text-white font-medium line-clamp-1">{t.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
      {/* Back + Template Name */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => { setSelected(null); setTexts({}); }}
          className="px-3 py-1.5 rounded-lg bg-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/15 transition-colors"
        >
          ← Templates
        </button>
        <h2 className="text-lg font-semibold text-white">{template.name}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Inputs */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Add Your Text</h3>
          {template.textZones.map(zone => (
            <div key={zone.id}>
              <label className="text-xs text-gray-400 font-medium mb-1 block">{zone.label}</label>
              <input
                type="text"
                value={texts[zone.id] || ''}
                onChange={e => handleTextChange(zone.id, e.target.value)}
                placeholder={`Enter ${zone.label.toLowerCase()}...`}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-500/50 placeholder-gray-600"
              />
            </div>
          ))}

          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold hover:opacity-90 transition-opacity mt-4 inline-flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Download as PNG
          </button>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Live Preview</h3>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
            <img
              ref={imgRef}
              src={template.file}
              alt={template.name}
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
              className="hidden"
            />
            <canvas
              ref={canvasRef}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
