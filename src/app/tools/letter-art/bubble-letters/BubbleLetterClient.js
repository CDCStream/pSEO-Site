'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RefreshCw, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useToast } from '@/components/Toast';

const FONTS = [
  { id: 'bubblegum', label: 'Bubblegum Sans', family: 'Bubblegum Sans', query: 'Bubblegum+Sans' },
  { id: 'fredoka', label: 'Fredoka', family: 'Fredoka', query: 'Fredoka:wght@700' },
  { id: 'luckiest', label: 'Luckiest Guy', family: 'Luckiest Guy', query: 'Luckiest+Guy' },
  { id: 'chewy', label: 'Chewy', family: 'Chewy', query: 'Chewy' },
  { id: 'titan', label: 'Titan One', family: 'Titan One', query: 'Titan+One' },
  { id: 'bungee', label: 'Bungee Shade', family: 'Bungee Shade', query: 'Bungee+Shade' },
];

const FONT_URL = 'https://fonts.googleapis.com/css2?' + FONTS.map(f => `family=${f.query}`).join('&') + '&display=swap';

export default function BubbleLetterClient() {
  const canvasRef = useRef(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [text, setText] = useState('Bubble');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontSize, setFontSize] = useState(96);
  const [fillColor, setFillColor] = useState('#ff6b9d');
  const [outlineColor, setOutlineColor] = useState('#222222');
  const [outlineWidth, setOutlineWidth] = useState(4);
  const [shadowOn, setShadowOn] = useState(true);
  const [shadowColor, setShadowColor] = useState('#00000066');
  const [shadowBlur, setShadowBlur] = useState(8);
  const [shadowX, setShadowX] = useState(4);
  const [shadowY, setShadowY] = useState(4);
  const [textAlign, setTextAlign] = useState('center');
  const { addToast } = useToast();

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_URL;
    link.id = 'bubble-fonts-css';
    document.head.appendChild(link);

    const check = () => {
      const promises = FONTS.map(f => document.fonts.load(`bold 48px "${f.family}"`));
      Promise.all(promises).then(() => setFontsReady(true)).catch(() => setFontsReady(true));
    };
    link.onload = check;
    setTimeout(check, 3000);

    return () => { const el = document.getElementById('bubble-fonts-css'); if (el) el.remove(); };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fontsReady) return;
    const ctx = canvas.getContext('2d');

    const lines = (text || ' ').split('\n');
    const fontStr = `bold ${fontSize}px "${selectedFont.family}", sans-serif`;
    ctx.font = fontStr;

    const lineH = fontSize * 1.35;
    let maxW = 0;
    lines.forEach(l => { const w = ctx.measureText(l || ' ').width; if (w > maxW) maxW = w; });

    const pad = outlineWidth + (shadowOn ? Math.abs(shadowX) + shadowBlur : 0) + 24;
    const cw = Math.max(200, maxW + pad * 2);
    const ch = Math.max(100, lines.length * lineH + pad * 2);
    canvas.width = cw;
    canvas.height = ch;

    ctx.clearRect(0, 0, cw, ch);
    ctx.font = fontStr;
    ctx.textBaseline = 'middle';

    let ax;
    if (textAlign === 'left') { ctx.textAlign = 'left'; ax = pad; }
    else if (textAlign === 'right') { ctx.textAlign = 'right'; ax = cw - pad; }
    else { ctx.textAlign = 'center'; ax = cw / 2; }

    lines.forEach((line, i) => {
      const y = pad + i * lineH + lineH / 2;

      if (shadowOn) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowX;
        ctx.shadowOffsetY = shadowY;
      }

      if (outlineWidth > 0) {
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(line || ' ', ax, y);
      }

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = fillColor;
      ctx.fillText(line || ' ', ax, y);
    });
  }, [text, selectedFont, fontSize, fillColor, outlineColor, outlineWidth, shadowOn, shadowColor, shadowBlur, shadowX, shadowY, textAlign, fontsReady]);

  useEffect(() => { draw(); }, [draw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'bubble-letters.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    addToast('Downloaded!', 'success');
  };

  const handleReset = () => {
    setText('Bubble');
    setSelectedFont(FONTS[0]);
    setFontSize(96);
    setFillColor('#ff6b9d');
    setOutlineColor('#222222');
    setOutlineWidth(4);
    setShadowOn(true);
    setShadowColor('#00000066');
    setShadowBlur(8);
    setShadowX(4);
    setShadowY(4);
    setTextAlign('center');
    addToast('Reset to defaults', 'info');
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* Controls */}
        <div className="w-full lg:w-[360px] shrink-0 space-y-5 order-2 lg:order-1 lg:max-h-[82vh] lg:overflow-y-auto lg:pr-1">

          {/* Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Text</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type here..."
              rows={3}
              className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
            />
          </div>

          {/* Font Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bubble Font</label>
            <div className="grid grid-cols-2 gap-2">
              {FONTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFont(f)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left truncate ${
                    selectedFont.id === f.id
                      ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                      : 'bg-white/5 border border-transparent hover:bg-white/10 text-gray-300'
                  }`}
                  style={{ fontFamily: `"${f.family}", sans-serif` }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Size: {fontSize}px</label>
            <input type="range" min="24" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full accent-green-500" />
          </div>

          {/* Text Align */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Alignment</label>
            <div className="flex gap-2">
              {[['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]].map(([val, Icon]) => (
                <button
                  key={val}
                  onClick={() => setTextAlign(val)}
                  className={`flex-1 py-2 rounded-lg transition-colors inline-flex items-center justify-center ${
                    textAlign === val ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Fill Color</label>
              <input type="color" value={fillColor} onChange={e => setFillColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Outline Color</label>
              <input type="color" value={outlineColor} onChange={e => setOutlineColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0" />
            </div>
          </div>

          {/* Outline Width */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Outline Width: {outlineWidth}px</label>
            <input type="range" min="0" max="20" value={outlineWidth} onChange={e => setOutlineWidth(+e.target.value)} className="w-full accent-green-500" />
          </div>

          {/* Shadow */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setShadowOn(!shadowOn)} className={`w-10 h-5 rounded-full transition-all ${shadowOn ? 'bg-green-500' : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${shadowOn ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm font-medium text-gray-300">Shadow</span>
            </label>

            {shadowOn && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Shadow Color</label>
                  <input type="color" value={shadowColor.slice(0, 7)} onChange={e => setShadowColor(e.target.value + '99')} className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Blur: {shadowBlur}px</label>
                  <input type="range" min="0" max="30" value={shadowBlur} onChange={e => setShadowBlur(+e.target.value)} className="w-full accent-green-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Offset X: {shadowX}</label>
                    <input type="range" min="-20" max="20" value={shadowX} onChange={e => setShadowX(+e.target.value)} className="w-full accent-green-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Offset Y: {shadowY}</label>
                    <input type="range" min="-20" max="20" value={shadowY} onChange={e => setShadowY(+e.target.value)} className="w-full accent-green-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

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

        {/* Preview */}
        <div className="flex-1 min-w-0 order-1 lg:order-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Live Preview — transparent background</p>
          <div className="bg-[repeating-conic-gradient(#1a1a2e_0%_25%,#16162a_0%_50%)] bg-[length:20px_20px] rounded-xl p-4 sm:p-6 flex items-center justify-center min-h-[200px]">
            {fontsReady ? (
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
              />
            ) : (
              <p className="text-gray-500 text-sm">Loading fonts...</p>
            )}
          </div>

          {/* Alphabet Preview */}
          <div className="mt-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Font Preview — {selectedFont.label}</p>
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 text-center" style={{ fontFamily: `"${selectedFont.family}", sans-serif` }}>
              <p className="text-2xl sm:text-3xl text-white leading-relaxed tracking-wide">
                ABCDEFGHIJKLM<br />NOPQRSTUVWXYZ
              </p>
              <p className="text-xl sm:text-2xl text-gray-400 mt-2 leading-relaxed tracking-wide">
                abcdefghijklm<br />nopqrstuvwxyz
              </p>
              <p className="text-xl text-gray-500 mt-2">0123456789 !?&amp;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
