'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useToast } from '@/components/Toast';

const TEMPLATES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  src: `/jd-vance-meme-templates/jd_vance_meme_templete${i + 1}.png`,
  label: `Template ${i + 1}`,
}));

const TEXT_ZONES = [
  { id: 'top', label: 'Top Text', x: 0.02, y: 0.02, w: 0.96, h: 0.18, fontSize: 48, align: 'center', color: '#fff', stroke: '#000' },
  { id: 'bottom', label: 'Bottom Text', x: 0.02, y: 0.80, w: 0.96, h: 0.18, fontSize: 48, align: 'center', color: '#fff', stroke: '#000' },
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

export default function JdVanceMemeClient() {
  const [selected, setSelected] = useState(0);
  const [texts, setTexts] = useState({ top: '', bottom: '' });
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const { addToast } = useToast();

  const drawMeme = useCallback(() => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    TEXT_ZONES.forEach(zone => {
      const txt = texts[zone.id] || '';
      if (!txt) return;

      const zx = zone.x * canvas.width;
      const zy = zone.y * canvas.height;
      const zw = zone.w * canvas.width;
      const zh = zone.h * canvas.height;

      ctx.save();
      ctx.beginPath();
      ctx.rect(zx, zy, zw, zh);
      ctx.clip();

      const scale = canvas.width / 800;
      let fs = Math.max(12, Math.round(zone.fontSize * scale));
      let lines, lineHeight, totalH;

      for (let attempt = 0; attempt < 50; attempt++) {
        ctx.font = `bold ${fs}px Impact, Arial Black, sans-serif`;
        lines = wrapText(ctx, txt.toUpperCase(), zw - 20);
        lineHeight = fs * 1.15;
        totalH = lines.length * lineHeight;
        if (totalH <= zh || fs <= 10) break;
        fs -= 2;
      }

      if (!lines || lines.length === 0) { ctx.restore(); return; }

      ctx.font = `bold ${fs}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      let startY = zy + (zh - totalH) / 2;
      const cx = zx + zw / 2;

      lines.forEach((line, i) => {
        const ly = startY + i * lineHeight;
        ctx.strokeStyle = zone.stroke;
        ctx.lineWidth = Math.max(4, fs / 5);
        ctx.lineJoin = 'round';
        ctx.strokeText(line, cx, ly);
        ctx.fillStyle = zone.color;
        ctx.fillText(line, cx, ly);
      });

      ctx.restore();
    });
  }, [texts, selected]);

  useEffect(() => { drawMeme(); }, [drawMeme]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `jd-vance-meme-${selected + 1}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    addToast('Meme downloaded!', 'success');
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
      {/* Template Selector */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Choose a Template</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {TEMPLATES.map((tpl, i) => (
            <button
              key={tpl.id}
              onClick={() => setSelected(i)}
              className={`relative rounded-lg overflow-hidden border-2 aspect-square transition-all ${
                selected === i
                  ? 'border-red-500 ring-2 ring-red-500/30 scale-105'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <Image
                src={tpl.src}
                alt={tpl.label}
                fill
                sizes="80px"
                quality={40}
                className="object-cover"
              />
              <div className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white bg-black/40 ${selected === i ? 'bg-red-500/20' : ''}`}>
                {i + 1}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Inputs */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Add Your Text</h3>
          {TEXT_ZONES.map(zone => (
            <div key={zone.id}>
              <label className="text-xs text-gray-400 font-medium mb-1 block">{zone.label}</label>
              <input
                type="text"
                value={texts[zone.id]}
                onChange={e => setTexts(prev => ({ ...prev, [zone.id]: e.target.value }))}
                placeholder={`Enter ${zone.label.toLowerCase()}...`}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50 placeholder-gray-600"
              />
            </div>
          ))}

          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold hover:opacity-90 transition-opacity mt-4 inline-flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Download Meme as PNG
          </button>
        </div>

        {/* Live Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Live Preview</h3>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
            <img
              ref={imgRef}
              src={TEMPLATES[selected].src}
              alt={`JD Vance Meme Template ${selected + 1}`}
              crossOrigin="anonymous"
              onLoad={drawMeme}
              className="hidden"
            />
            <canvas ref={canvasRef} className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
