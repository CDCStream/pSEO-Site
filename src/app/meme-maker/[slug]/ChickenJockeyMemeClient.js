'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/components/Toast';

const FONTS = [
  { id: 'impact', label: 'Impact', value: 'Impact, Arial Black, sans-serif' },
  { id: 'arial', label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { id: 'comic', label: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  { id: 'courier', label: 'Courier', value: '"Courier New", monospace' },
  { id: 'georgia', label: 'Georgia', value: 'Georgia, serif' },
  { id: 'times', label: 'Times', value: '"Times New Roman", serif' },
  { id: 'verdana', label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
];

const PRESET_COLORS = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff6600', '#ff69b4'];

let nextId = 1;

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

export default function ChickenJockeyMemeClient() {
  const [textBoxes, setTextBoxes] = useState([]);
  const [activeBox, setActiveBox] = useState(null);
  const [dragging, setDragging] = useState(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const { addToast } = useToast();

  const getCanvasPos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const drawMeme = useCallback(() => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const scale = canvas.width / 800;

    textBoxes.forEach((box) => {
      const txt = box.text || '';
      if (!txt) return;

      const maxW = canvas.width * 0.45;
      const fs = Math.max(10, Math.round((box.fontSize || 36) * scale));
      const fontFamily = box.fontFamily || FONTS[0].value;

      ctx.font = `bold ${fs}px ${fontFamily}`;
      ctx.letterSpacing = `${Math.max(1, Math.round(fs * 0.06))}px`;
      const lines = wrapText(ctx, txt.toUpperCase(), maxW);
      const lineHeight = fs * 1.15;

      const cx = box.x * canvas.width;
      const cy = box.y * canvas.height;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const totalH = lines.length * lineHeight;
      const startY = cy - totalH / 2;

      lines.forEach((line, i) => {
        const ly = startY + i * lineHeight;
        if (box.stroke && box.stroke !== 'none') {
          ctx.strokeStyle = box.stroke;
          ctx.lineWidth = Math.max(3, fs / 5);
          ctx.lineJoin = 'round';
          ctx.strokeText(line, cx, ly);
        }
        ctx.fillStyle = box.color || '#ffffff';
        ctx.fillText(line, cx, ly);
      });
    });

    textBoxes.forEach((box) => {
      if (box.text) return;
      const cx = box.x * canvas.width;
      const cy = box.y * canvas.height;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 16 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 88, 12, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${12 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+', cx, cy);
      ctx.restore();
    });
  }, [textBoxes]);

  useEffect(() => { drawMeme(); }, [drawMeme]);

  const handleCanvasClick = (e) => {
    if (dragging) return;
    const pos = getCanvasPos(e);
    if (!pos || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const nx = pos.x / canvas.width;
    const ny = pos.y / canvas.height;

    const hitRadius = 0.05;
    const hit = textBoxes.find(
      (b) => Math.abs(b.x - nx) < hitRadius && Math.abs(b.y - ny) < hitRadius
    );
    if (hit) {
      setActiveBox(hit.id);
      return;
    }

    const newBox = { id: nextId++, x: nx, y: ny, text: '', color: '#ffffff', stroke: '#000000', fontFamily: FONTS[0].value, fontSize: 36 };
    setTextBoxes((prev) => [...prev, newBox]);
    setActiveBox(newBox.id);
  };

  const handlePointerDown = (e) => {
    const pos = getCanvasPos(e);
    if (!pos || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const nx = pos.x / canvas.width;
    const ny = pos.y / canvas.height;

    const hitRadius = 0.05;
    const hit = textBoxes.find(
      (b) => Math.abs(b.x - nx) < hitRadius && Math.abs(b.y - ny) < hitRadius
    );

    if (hit) {
      setDragging({ id: hit.id, offsetX: hit.x - nx, offsetY: hit.y - ny });
      setActiveBox(hit.id);
      e.preventDefault();
    }
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const pos = getCanvasPos(e);
    if (!pos || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const nx = Math.max(0.05, Math.min(0.95, pos.x / canvas.width + dragging.offsetX));
    const ny = Math.max(0.05, Math.min(0.95, pos.y / canvas.height + dragging.offsetY));

    setTextBoxes((prev) =>
      prev.map((b) => (b.id === dragging.id ? { ...b, x: nx, y: ny } : b))
    );
  };

  const handlePointerUp = () => {
    if (dragging) setDragging(null);
  };

  const handleCanvasInteraction = (e) => {
    if (dragging) return;
    handleCanvasClick(e);
  };

  const updateText = (id, text) => {
    setTextBoxes((prev) =>
      prev.map((b) => (b.id === id ? { ...b, text } : b))
    );
  };

  const updateBoxStyle = (id, key, value) => {
    setTextBoxes((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [key]: value } : b))
    );
  };

  const removeBox = (id) => {
    setTextBoxes((prev) => prev.filter((b) => b.id !== id));
    if (activeBox === id) setActiveBox(null);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'chicken-jockey-meme.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    addToast('Meme downloaded!', 'success');
  };

  const clearAll = () => {
    setTextBoxes([]);
    setActiveBox(null);
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Text Boxes ({textBoxes.length})
            </h3>
            {textBoxes.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="bg-white/5 rounded-lg border border-dashed border-white/20 p-3 text-center">
            <p className="text-xs text-gray-500">
              Click on the image to place text. Drag to reposition.
            </p>
          </div>

          {textBoxes.length === 0 && (
            <div className="text-center py-6 text-gray-600 text-sm">
              No text boxes yet. Click on the image to add one.
            </div>
          )}

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {textBoxes.map((box, i) => (
              <div
                key={box.id}
                className={`rounded-lg border transition-colors ${
                  activeBox === box.id
                    ? 'border-orange-500/50 bg-orange-500/10'
                    : 'border-white/10 bg-white/5'
                }`}
                onClick={() => setActiveBox(box.id)}
              >
                <div className="flex items-center gap-2 p-2">
                  <span className="text-xs text-gray-500 font-mono w-5 shrink-0">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={box.text}
                    onChange={(e) => updateText(box.id, e.target.value)}
                    placeholder="Type your text..."
                    className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder-gray-600"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBox(box.id);
                    }}
                    className="p-1 text-gray-500 hover:text-red-400 transition-colors shrink-0"
                    aria-label="Remove text box"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>

                {activeBox === box.id && (
                  <div className="px-2 pb-2 pt-1 border-t border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-gray-500 uppercase w-10 shrink-0">Font</label>
                      <select
                        value={box.fontFamily || FONTS[0].value}
                        onChange={(e) => updateBoxStyle(box.id, 'fontFamily', e.target.value)}
                        className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                      >
                        {FONTS.map((f) => (
                          <option key={f.id} value={f.value} className="bg-[#1a1a2e] text-white">
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-gray-500 uppercase w-10 shrink-0">Size</label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        step="2"
                        value={box.fontSize || 36}
                        onChange={(e) => updateBoxStyle(box.id, 'fontSize', Number(e.target.value))}
                        className="flex-1 accent-orange-500 h-1.5"
                      />
                      <span className="text-xs text-gray-400 font-mono w-7 text-right">{box.fontSize || 36}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-gray-500 uppercase w-10 shrink-0">Color</label>
                      <div className="flex items-center gap-1 flex-wrap">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={(e) => { e.stopPropagation(); updateBoxStyle(box.id, 'color', c); }}
                            className={`w-5 h-5 rounded-full border-2 transition-transform ${
                              (box.color || '#ffffff') === c ? 'border-orange-400 scale-125' : 'border-white/20'
                            }`}
                            style={{ backgroundColor: c }}
                            aria-label={`Text color ${c}`}
                          />
                        ))}
                        <input
                          type="color"
                          value={box.color || '#ffffff'}
                          onChange={(e) => updateBoxStyle(box.id, 'color', e.target.value)}
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                          title="Custom color"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-gray-500 uppercase w-10 shrink-0">Stroke</label>
                      <div className="flex items-center gap-1 flex-wrap">
                        {['#000000', '#ffffff', '#ff0000', '#0000ff', '#ffff00', 'none'].map((c) => (
                          <button
                            key={c}
                            onClick={(e) => { e.stopPropagation(); updateBoxStyle(box.id, 'stroke', c); }}
                            className={`w-5 h-5 rounded-full border-2 transition-transform ${
                              (box.stroke || '#000000') === c ? 'border-orange-400 scale-125' : 'border-white/20'
                            }`}
                            style={{ backgroundColor: c === 'none' ? 'transparent' : c }}
                            aria-label={c === 'none' ? 'No stroke' : `Stroke color ${c}`}
                          >
                            {c === 'none' && <span className="text-[8px] text-gray-400 leading-none">OFF</span>}
                          </button>
                        ))}
                        <input
                          type="color"
                          value={box.stroke === 'none' ? '#000000' : (box.stroke || '#000000')}
                          onChange={(e) => updateBoxStyle(box.id, 'stroke', e.target.value)}
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                          title="Custom stroke color"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:opacity-90 transition-opacity mt-4 inline-flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download Meme as PNG
          </button>
        </div>

        {/* Canvas Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
            Preview — Click to Add Text
          </h3>
          <div
            ref={containerRef}
            className="rounded-xl overflow-hidden border border-white/10 bg-black/20 cursor-crosshair select-none touch-none"
          >
            <img
              ref={imgRef}
              src="/memes/chicken-jockey-meme.png"
              alt="Chicken Jockey Meme Template"
              crossOrigin="anonymous"
              onLoad={drawMeme}
              className="hidden"
            />
            <canvas
              ref={canvasRef}
              className="w-full h-auto"
              onClick={handleCanvasInteraction}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
