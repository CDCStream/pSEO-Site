'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/components/Toast';

const PHOTO_ZONE = { x: 0.22, y: 0.27, w: 0.56, h: 0.30 };

const TEXT_FIELDS = [
  { id: 'name', label: 'Name', placeholder: 'e.g. John Doe', required: true },
  { id: 'crime', label: 'Crime / Reason', placeholder: 'e.g. Stealing all the pizza' },
  { id: 'alias', label: 'A.K.A. (Nickname)', placeholder: 'e.g. The Snack Bandit' },
  { id: 'reward', label: 'Reward', placeholder: 'e.g. $10,000 Dead or Alive' },
  { id: 'lastSeen', label: 'Last Seen', placeholder: 'e.g. Raiding the fridge at 3AM' },
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

function drawTextField(ctx, text, x, y, maxW, maxH, fontSize, font, color) {
  if (!text) return 0;
  let fs = fontSize;
  let lines, lineHeight, totalH;
  for (let i = 0; i < 40; i++) {
    ctx.font = `bold ${fs}px ${font}`;
    lines = wrapText(ctx, text.toUpperCase(), maxW - 16);
    lineHeight = fs * 1.2;
    totalH = lines.length * lineHeight;
    if (totalH <= maxH || fs <= 10) break;
    fs -= 2;
  }
  if (!lines || lines.length === 0) return 0;
  ctx.font = `bold ${fs}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const startY = y + (maxH - totalH) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, x + maxW / 2, startY + i * lineHeight);
  });
  return totalH;
}

export default function WantedPosterClient() {
  const [fields, setFields] = useState({ name: '', crime: '', alias: '', reward: '', lastSeen: '' });
  const [photo, setPhoto] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const photoImgRef = useRef(null);
  const { addToast } = useToast();

  const drawPoster = useCallback(() => {
    if (!canvasRef.current || !imgRef.current || !imgRef.current.complete) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    const W = img.naturalWidth;
    const H = img.naturalHeight;

    canvas.width = W;
    canvas.height = H;
    ctx.drawImage(img, 0, 0, W, H);

    const darkBrown = '#2c1810';
    const font = 'Impact, Arial Black, sans-serif';
    const serifFont = '"Georgia", "Times New Roman", serif';

    if (photoImgRef.current && photoImgRef.current.complete) {
      const px = PHOTO_ZONE.x * W;
      const py = PHOTO_ZONE.y * H;
      const pw = PHOTO_ZONE.w * W;
      const ph = PHOTO_ZONE.h * H;
      ctx.save();
      ctx.beginPath();
      ctx.rect(px + 10, py + 10, pw - 20, ph - 20);
      ctx.clip();
      const pImg = photoImgRef.current;
      const scale = Math.max((pw - 20) / pImg.naturalWidth, (ph - 20) / pImg.naturalHeight);
      const dw = pImg.naturalWidth * scale;
      const dh = pImg.naturalHeight * scale;
      const dx = px + 10 + (pw - 20 - dw) / 2;
      const dy = py + 10 + (ph - 20 - dh) / 2;
      ctx.drawImage(pImg, dx, dy, dw, dh);
      ctx.restore();
    }

    if (fields.crime) {
      ctx.save();
      const crimeY = 0.175 * H;
      const crimeH = 0.065 * H;
      const crimeW = 0.75 * W;
      const crimeX = (W - crimeW) / 2;
      ctx.beginPath();
      ctx.rect(crimeX, crimeY, crimeW, crimeH);
      ctx.clip();
      drawTextField(ctx, `FOR ${fields.crime}`, crimeX, crimeY, crimeW, crimeH, 42, font, darkBrown);
      ctx.restore();
    }

    if (fields.name) {
      ctx.save();
      const nameY = 0.585 * H;
      const nameH = 0.06 * H;
      const nameW = 0.82 * W;
      const nameX = (W - nameW) / 2;
      ctx.beginPath();
      ctx.rect(nameX, nameY, nameW, nameH);
      ctx.clip();
      drawTextField(ctx, fields.name, nameX, nameY, nameW, nameH, 72, font, darkBrown);
      ctx.restore();
    }

    if (fields.alias) {
      ctx.save();
      const aliasY = 0.645 * H;
      const aliasH = 0.05 * H;
      const aliasW = 0.78 * W;
      const aliasX = (W - aliasW) / 2;
      ctx.beginPath();
      ctx.rect(aliasX, aliasY, aliasW, aliasH);
      ctx.clip();
      drawTextField(ctx, `A.K.A. "${fields.alias}"`, aliasX, aliasY, aliasW, aliasH, 42, serifFont, darkBrown);
      ctx.restore();
    }

    if (fields.reward) {
      ctx.save();
      const rewardY = 0.72 * H;
      const rewardH = 0.055 * H;
      const rewardW = 0.48 * W;
      const rewardX = 0.40 * W;
      ctx.beginPath();
      ctx.rect(rewardX, rewardY, rewardW, rewardH);
      ctx.clip();
      drawTextField(ctx, fields.reward, rewardX, rewardY, rewardW, rewardH, 32, font, darkBrown);
      ctx.restore();
    }

    if (fields.lastSeen) {
      ctx.save();
      const lsY = 0.925 * H;
      const lsH = 0.045 * H;
      const lsW = 0.82 * W;
      const lsX = (W - lsW) / 2;
      ctx.beginPath();
      ctx.rect(lsX, lsY, lsW, lsH);
      ctx.clip();
      drawTextField(ctx, fields.lastSeen, lsX, lsY, lsW, lsH, 30, font, darkBrown);
      ctx.restore();
    }
  }, [fields, photo]);

  useEffect(() => { drawPoster(); }, [drawPoster]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        photoImgRef.current = img;
        drawPoster();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAI = async () => {
    if (!fields.name.trim()) {
      addToast('Please enter a name first', 'error');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/wanted-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fields.name }),
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setFields(prev => ({
        ...prev,
        crime: prev.crime || data.crime || '',
        alias: prev.alias || data.alias || '',
        reward: prev.reward || data.reward || '',
        lastSeen: prev.lastSeen || data.lastSeen || '',
      }));
      addToast('AI generated your wanted poster content!', 'success');
    } catch {
      addToast('AI generation failed. Please try again.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `wanted-poster-${fields.name || 'custom'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    addToast('Wanted poster downloaded!', 'success');
  };

  const handleClear = () => {
    setFields({ name: '', crime: '', alias: '', reward: '', lastSeen: '' });
    setPhoto(null);
    photoImgRef.current = null;
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Customize Your Poster</h3>

          {TEXT_FIELDS.map(f => (
            <div key={f.id}>
              <label className="text-xs text-gray-400 font-medium mb-1 block">
                {f.label} {f.required && <span className="text-red-400">*</span>}
              </label>
              <input
                type="text"
                value={fields[f.id]}
                onChange={e => setFields(prev => ({ ...prev, [f.id]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 placeholder-gray-600"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">Photo (Optional)</label>
            <label className="flex items-center justify-center w-full py-3 rounded-lg bg-white/5 border border-dashed border-white/20 text-gray-400 text-sm cursor-pointer hover:border-amber-500/50 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              {photo ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <button
            onClick={handleAI}
            disabled={aiLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {aiLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75"/></svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Fill Empty Fields with AI
              </>
            )}
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Download PNG
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Live Preview</h3>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
            <img
              ref={imgRef}
              src="/memes/wanted-poster-templete.png"
              alt="Wanted Poster Template"
              crossOrigin="anonymous"
              onLoad={drawPoster}
              className="hidden"
            />
            <canvas ref={canvasRef} className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
