'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RefreshCw, Upload, Type, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/Toast';

const UNO_COLORS = [
  { id: 'red', label: 'Red', targetHue: 0, hex: '#ff5555' },
  { id: 'blue', label: 'Blue', targetHue: null, hex: '#5555ff' },
  { id: 'green', label: 'Green', targetHue: 130, hex: '#55aa55' },
  { id: 'yellow', label: 'Yellow', targetHue: 48, hex: '#ffaa00' },
];

const FONTS = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Impact', value: 'Impact, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
];

const SRC_HUE_MIN = 185;
const SRC_HUE_MAX = 255;
const SRC_HUE_CENTER = 215;

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (pp, qq, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return pp + (qq - pp) * 6 * t;
    if (t < 1 / 2) return qq;
    if (t < 2 / 3) return pp + (qq - pp) * (2 / 3 - t) * 6;
    return pp;
  };
  return [
    Math.round(f(p, q, h + 1 / 3) * 255),
    Math.round(f(p, q, h) * 255),
    Math.round(f(p, q, h - 1 / 3) * 255),
  ];
}

function shiftPixels(src, targetHue) {
  const out = new Uint8ClampedArray(src.data);
  const shift = targetHue - SRC_HUE_CENTER;
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] < 10) continue;
    const [h, s, l] = rgbToHsl(out[i], out[i + 1], out[i + 2]);
    if (h >= SRC_HUE_MIN && h <= SRC_HUE_MAX && s > 20) {
      let nh = (h + shift) % 360;
      if (nh < 0) nh += 360;
      const [nr, ng, nb] = hslToRgb(nh, s, l);
      out[i] = nr; out[i + 1] = ng; out[i + 2] = nb;
    }
  }
  return new ImageData(out, src.width, src.height);
}

export default function UnoReverseClient({ config, slug }) {
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const imgInputRef = useRef(null);
  const colorCache = useRef({ id: null, data: null });
  const dragRef = useRef(null);
  const idRef = useRef(0);

  const [originalPixels, setOriginalPixels] = useState(null);
  const [cardColor, setCardColor] = useState(UNO_COLORS[1]);
  const [cardAspect, setCardAspect] = useState(404 / 604);
  const [layers, setLayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [containerSize, setContainerSize] = useState({ w: 300, h: 450 });
  const { addToast } = useToast();

  // ---------- load card image ----------
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const cx = c.getContext('2d');
      cx.fillStyle = '#ffffff';
      cx.fillRect(0, 0, c.width, c.height);
      cx.drawImage(img, 0, 0);
      setOriginalPixels(cx.getImageData(0, 0, c.width, c.height));
      setCardAspect(img.naturalWidth / img.naturalHeight);
    };
    img.src = '/reverse-uno-card.png';
  }, []);

  // ---------- track container size ----------
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0) setContainerSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---------- draw card background ----------
  const drawBg = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !originalPixels) return;
    const ctx = canvas.getContext('2d');
    canvas.width = originalPixels.width;
    canvas.height = originalPixels.height;
    let px;
    if (cardColor.targetHue === null) {
      px = originalPixels;
    } else if (colorCache.current.id === cardColor.id) {
      px = colorCache.current.data;
    } else {
      px = shiftPixels(originalPixels, cardColor.targetHue);
      colorCache.current = { id: cardColor.id, data: px };
    }
    ctx.putImageData(px, 0, 0);
  }, [originalPixels, cardColor]);

  useEffect(() => { drawBg(); }, [drawBg]);

  // ---------- drag / resize ----------
  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      e.preventDefault();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = cx - d.sx;
      const dy = cy - d.sy;

      if (d.mode === 'move') {
        const nx = Math.max(-10, Math.min(110, d.ox + (dx / d.cw) * 100));
        const ny = Math.max(-10, Math.min(110, d.oy + (dy / d.ch) * 100));
        setLayers(p => p.map(l => l.id === d.lid ? { ...l, x: nx, y: ny } : l));
      } else {
        const nw = Math.max(5, Math.min(150, d.ow + (dx / d.cw) * 100));
        setLayers(p => p.map(l => l.id === d.lid ? { ...l, width: nw } : l));
      }
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const startDrag = (e, lid, mode = 'move') => {
    e.stopPropagation();
    e.preventDefault();
    const layer = layers.find(l => l.id === lid);
    if (!layer) return;
    const rect = previewRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = {
      lid, mode,
      sx: cx, sy: cy,
      cw: rect.width, ch: rect.height,
      ox: layer.x, oy: layer.y, ow: layer.width || 30,
    };
    setSelectedId(lid);
  };

  // ---------- layer management ----------
  const addText = () => {
    const id = ++idRef.current;
    setLayers(p => [...p, {
      id, type: 'text', x: 50, y: 50,
      content: 'Your Text', fontSize: 28,
      fontFamily: FONTS[0].value, fontColor: '#ffffff', rotation: 0,
    }]);
    setSelectedId(id);
  };

  const addImage = useCallback((file) => {
    if (!file?.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { addToast('Max 10 MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const id = ++idRef.current;
        setLayers(p => [...p, {
          id, type: 'image', x: 50, y: 50,
          width: 30, rotation: 0,
          src: img.src, imgEl: img,
          natW: img.naturalWidth, natH: img.naturalHeight,
        }]);
        setSelectedId(id);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }, [addToast]);

  const update = (id, u) => setLayers(p => p.map(l => l.id === id ? { ...l, ...u } : l));
  const remove = (id) => {
    setLayers(p => p.filter(l => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const selected = layers.find(l => l.id === selectedId);

  // ---------- download ----------
  const handleDownload = () => {
    if (!originalPixels) return;
    const W = originalPixels.width;
    const H = originalPixels.height;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    let px;
    if (cardColor.targetHue === null) px = originalPixels;
    else px = colorCache.current.id === cardColor.id
      ? colorCache.current.data
      : shiftPixels(originalPixels, cardColor.targetHue);
    ctx.putImageData(px, 0, 0);

    const scaleX = W / containerSize.w;

    layers.forEach(layer => {
      const lx = (layer.x / 100) * W;
      const ly = (layer.y / 100) * H;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate((layer.rotation * Math.PI) / 180);

      if (layer.type === 'text') {
        const fs = layer.fontSize * scaleX;
        ctx.font = `bold ${fs}px ${layer.fontFamily}`;
        ctx.fillStyle = layer.fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.content || '', 0, 0);
      } else if (layer.imgEl) {
        const iw = (layer.width / 100) * W;
        const ih = iw * (layer.natH / layer.natW);
        ctx.drawImage(layer.imgEl, -iw / 2, -ih / 2, iw, ih);
      }
      ctx.restore();
    });

    const link = document.createElement('a');
    link.download = 'uno-reverse-card.png';
    link.href = c.toDataURL('image/png');
    link.click();
    addToast('Card downloaded!', 'success');
  };

  const handleReset = () => {
    setLayers([]); setSelectedId(null);
    setCardColor(UNO_COLORS[1]);
    addToast('Card reset', 'info');
  };

  // ---------- render ----------
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* ===== CONTROLS ===== */}
        <div className="w-full lg:w-[360px] shrink-0 space-y-5 order-2 lg:order-1 lg:max-h-[82vh] lg:overflow-y-auto lg:pr-1">

          {/* Card Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Card Color</label>
            <div className="grid grid-cols-4 gap-3">
              {UNO_COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCardColor(c)}
                  aria-label={c.label}
                  className={`relative h-12 rounded-xl transition-all ${cardColor.id === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c.hex }}
                >
                  {cardColor.id === c.id && <span className="absolute inset-0 flex items-center justify-center text-white font-bold drop-shadow">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Add Layers */}
          <div className="flex gap-3">
            <button onClick={addText} className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors inline-flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />Add Text
            </button>
            <button onClick={() => imgInputRef.current?.click()} className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors inline-flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />Add Image
            </button>
            <input ref={imgInputRef} type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) addImage(e.target.files[0]); e.target.value = ''; }} className="hidden" />
          </div>

          {/* Layers List */}
          {layers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Layers</label>
              <div className="space-y-1.5">
                {layers.map((l, i) => (
                  <div
                    key={l.id}
                    onClick={() => setSelectedId(l.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedId === l.id ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                  >
                    {l.type === 'text'
                      ? <Type className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      : <Upload className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                    <span className="text-sm text-gray-300 truncate flex-1">
                      {l.type === 'text' ? (l.content || 'Text') : `Image ${i + 1}`}
                    </span>
                    <button onClick={e => { e.stopPropagation(); remove(l.id); }} className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Layer Properties */}
          {selected && (
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">{selected.type === 'text' ? 'Text Properties' : 'Image Properties'}</h4>
                <button onClick={() => remove(selected.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
              </div>

              {selected.type === 'text' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Content</label>
                    <input
                      type="text"
                      value={selected.content}
                      onChange={e => update(selectedId, { content: e.target.value })}
                      className="w-full px-3 py-2 bg-black/30 rounded-lg border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Font Family</label>
                    <select
                      value={selected.fontFamily}
                      onChange={e => update(selectedId, { fontFamily: e.target.value })}
                      className="w-full px-3 py-2 bg-black/30 rounded-lg border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 appearance-none"
                    >
                      {FONTS.map(f => <option key={f.value} value={f.value} style={{ background: '#1a1a1a' }}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Size: {selected.fontSize}px</label>
                      <input type="range" min="8" max="80" value={selected.fontSize} onChange={e => update(selectedId, { fontSize: +e.target.value })} className="w-full accent-green-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Color</label>
                      <input type="color" value={selected.fontColor} onChange={e => update(selectedId, { fontColor: e.target.value })} className="w-full h-9 rounded-lg cursor-pointer bg-transparent border-0" />
                    </div>
                  </div>
                </>
              )}

              {selected.type === 'image' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Size: {Math.round(selected.width)}%</label>
                  <input type="range" min="5" max="100" value={selected.width} onChange={e => update(selectedId, { width: +e.target.value })} className="w-full accent-green-500" />
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-400 mb-1">Rotation</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="-180" max="180" value={selected.rotation} onChange={e => update(selectedId, { rotation: +e.target.value })} className="flex-1 accent-green-500" />
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="-360"
                      max="360"
                      value={selected.rotation}
                      onChange={e => { const v = e.target.value === '' ? 0 : +e.target.value; update(selectedId, { rotation: Math.max(-360, Math.min(360, v)) }); }}
                      className="w-16 px-2 py-1 bg-black/30 rounded-lg border border-white/10 text-white text-sm text-center focus:outline-none focus:border-green-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2 text-xs text-gray-500 pointer-events-none">°</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {layers.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">Add text or images to customize your card</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleDownload} className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />Download PNG
            </button>
            <button onClick={handleReset} className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors" aria-label="Reset">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===== PREVIEW ===== */}
        <div className="flex-1 min-w-0 order-1 lg:order-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Live Preview — drag to move elements</p>
          <div className="bg-black/30 rounded-xl p-4 sm:p-6 flex items-center justify-center">
            <div
              ref={previewRef}
              className="relative select-none overflow-hidden rounded-lg shadow-2xl"
              style={{ width: '100%', maxWidth: '360px', aspectRatio: cardAspect }}
              onMouseDown={(e) => { if (e.target === e.currentTarget || e.target === canvasRef.current) setSelectedId(null); }}
            >
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

              {layers.map((layer, i) => {
                if (layer.type === 'text') {
                  return (
                    <div
                      key={layer.id}
                      className={`absolute cursor-move ${selectedId === layer.id ? 'outline-2 outline-dashed outline-green-400 outline-offset-2 rounded' : ''}`}
                      style={{
                        left: `${layer.x}%`, top: `${layer.y}%`,
                        transform: `translate(-50%,-50%) rotate(${layer.rotation}deg)`,
                        fontSize: layer.fontSize, fontFamily: layer.fontFamily,
                        color: layer.fontColor, fontWeight: 'bold',
                        whiteSpace: 'nowrap', userSelect: 'none', lineHeight: 1.2,
                        textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
                        zIndex: i + 1,
                      }}
                      onMouseDown={e => startDrag(e, layer.id)}
                      onTouchStart={e => startDrag(e, layer.id)}
                    >
                      {layer.content || '\u00A0'}
                    </div>
                  );
                }

                const imgW = (layer.width / 100) * containerSize.w;
                const imgH = layer.natW ? imgW * (layer.natH / layer.natW) : imgW;
                return (
                  <div
                    key={layer.id}
                    className={`absolute cursor-move ${selectedId === layer.id ? 'outline-2 outline-dashed outline-green-400 outline-offset-2 rounded' : ''}`}
                    style={{
                      left: `${layer.x}%`, top: `${layer.y}%`,
                      width: imgW, height: imgH,
                      transform: `translate(-50%,-50%) rotate(${layer.rotation}deg)`,
                      zIndex: i + 1,
                    }}
                    onMouseDown={e => startDrag(e, layer.id)}
                    onTouchStart={e => startDrag(e, layer.id)}
                  >
                    <img src={layer.src} alt="" draggable={false} className="w-full h-full object-contain pointer-events-none" />
                    {selectedId === layer.id && (
                      <div
                        className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-green-500 rounded-sm cursor-se-resize z-10"
                        onMouseDown={e => startDrag(e, layer.id, 'resize')}
                        onTouchStart={e => startDrag(e, layer.id, 'resize')}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
