'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/components/Toast';

const FONTS = [
  { id: 'ananda-black-font', label: 'Ananda Black', file: 'ananda-black-font.ttf' },
  { id: 'angel-3-font', label: 'Angel 3', file: 'angel-3-font.otf' },
  { id: 'autumn-flowers-font', label: 'Autumn Flowers', file: 'autumn-flowers-font.otf' },
  { id: 'beautiful-christmas-font', label: 'Beautiful Christmas', file: 'beautiful-christmas-font.ttf' },
  { id: 'beautiful-people-font', label: 'Beautiful People', file: 'beautiful-people-font.ttf' },
  { id: 'bettani-sellia-font', label: 'Bettani Sellia', file: 'bettani-sellia-font.otf' },
  { id: 'blessed-day-font', label: 'Blessed Day', file: 'blessed-day-font.otf' },
  { id: 'brooklyn-font', label: 'Brooklyn', file: 'brooklyn-font.otf' },
  { id: 'brotherland-signature-font', label: 'Brotherland Signature', file: 'brotherland-signature-font.otf' },
  { id: 'brother-signature-font', label: 'Brother Signature', file: 'brother-signature-font.otf' },
  { id: 'chicanos-font', label: 'Chicanos', file: 'chicanos-font.ttf' },
  { id: 'christmas-carol-font', label: 'Christmas Carol', file: 'christmas-carol-font.otf' },
  { id: 'delicious-font', label: 'Delicious', file: 'delicious-font.otf' },
  { id: 'distropiax-font', label: 'Distropiax', file: 'distropiax-font.otf' },
  { id: 'emotional-rescue-font', label: 'Emotional Rescue', file: 'emotional-rescue-font.ttf' },
  { id: 'feelfree-font', label: 'Feelfree', file: 'feelfree-font.ttf' },
  { id: 'geraldine-font', label: 'Geraldine', file: 'geraldine-font.ttf' },
  { id: 'golden-beach-font', label: 'Golden Beach', file: 'golden-beach-font.otf' },
  { id: 'golden-coast-font', label: 'Golden Coast', file: 'golden-coast-font.otf' },
  { id: 'hugh-is-life-font', label: 'Hugh Is Life', file: 'hugh-is-life-font.ttf' },
  { id: 'katerlin-font', label: 'Katerlin', file: 'katerlin-font.ttf' },
  { id: 'lemon-jelly-font', label: 'Lemon Jelly', file: 'lemon-jelly-font.ttf' },
  { id: 'lovely-home-font', label: 'Lovely Home', file: 'lovely-home-font.ttf' },
  { id: 'lucy-said-ok-font', label: 'Lucy Said Ok', file: 'lucy-said-ok-font.ttf' },
  { id: 'maellen-font', label: 'Maellen', file: 'maellen-font.otf' },
  { id: 'mitchel-font', label: 'Mitchel', file: 'mitchel-font.otf' },
  { id: 'motterdam-font', label: 'Motterdam', file: 'motterdam-font.otf' },
  { id: 'nature-beauty-font', label: 'Nature Beauty', file: 'nature-beauty-font.ttf' },
  { id: 'painter-font', label: 'Painter', file: 'painter-font.ttf' },
  { id: 'pink-and-blue-font', label: 'Pink And Blue', file: 'pink-and-blue-font.otf' },
  { id: 'sellena-brush-font', label: 'Sellena Brush', file: 'sellena-brush-font.ttf' },
  { id: 'simple-cakes-font', label: 'Simple Cakes', file: 'simple-cakes-font.ttf' },
  { id: 'stanley-font', label: 'Stanley', file: 'stanley-font.ttf' },
  { id: 'stylish-calligraphy-font', label: 'Stylish Calligraphy', file: 'stylish-calligraphy-font.ttf' },
  { id: 'sweet-hipster-font', label: 'Sweet Hipster', file: 'sweet-hipster-font.ttf' },
  { id: 'the-amagist-font', label: 'The Amagist', file: 'the-amagist-font.otf' },
  { id: 'the-malabar-font', label: 'The Malabar', file: 'the-malabar-font.otf' },
  { id: 'weddingday-font', label: 'Weddingday', file: 'weddingday-font.ttf' },
  { id: 'xanas-weddinggroom-demoof22styles-seeall-font', label: 'Xanas Weddinggroom', file: 'xanas-weddinggroom-demoof22styles-seeall-font.ttf' },
  { id: 'youth-touch-font', label: 'Youth Touch', file: 'youth-touch-font.ttf' },
];

const loadedFonts = new Set();

async function loadFont(font) {
  if (loadedFonts.has(font.id)) return;
  const url = `/calligraphy-fonts/${font.file}`;
  const face = new FontFace(font.id, `url(${url})`);
  const loaded = await face.load();
  document.fonts.add(loaded);
  loadedFonts.add(font.id);
}

function renderText(ctx, text, fontId, fontSize, fillColor, strokeColor, strokeWidth, centerX, centerY) {
  const fontStr = `${fontSize}px "${fontId}"`;
  ctx.font = fontStr;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = (text || ' ').split('\n');
  const lineH = fontSize * 1.4;
  const totalH = lines.length * lineH;
  const startY = centerY - totalH / 2 + lineH / 2;

  lines.forEach((line, i) => {
    const y = startY + i * lineH;
    if (strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineJoin = 'round';
      ctx.strokeText(line || ' ', centerX, y);
    }
    ctx.fillStyle = fillColor;
    ctx.fillText(line || ' ', centerX, y);
  });
}

export default function CalligraphyAlphabetClient() {
  const canvasRef = useRef(null);
  const [text, setText] = useState('Calligraphy');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontReady, setFontReady] = useState(false);
  const [fontSize, setFontSize] = useState(72);
  const [fillColor, setFillColor] = useState('#1a1a2e');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setFontReady(false);
    setLoading(true);
    loadFont(selectedFont)
      .then(() => { setFontReady(true); setLoading(false); })
      .catch(() => { setFontReady(true); setLoading(false); });
  }, [selectedFont]);

  const draw = useCallback(() => {
    if (!fontReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const fontStr = `${fontSize}px "${selectedFont.id}"`;
    ctx.font = fontStr;

    const lines = (text || ' ').split('\n');
    const lineH = fontSize * 1.4;
    let maxW = 0;
    lines.forEach(l => {
      const w = ctx.measureText(l || ' ').width;
      if (w > maxW) maxW = w;
    });

    const pad = strokeWidth + 40;
    const cw = Math.max(300, maxW + pad * 2);
    const ch = Math.max(150, lines.length * lineH + pad * 2);

    canvas.width = cw;
    canvas.height = ch;
    const pCtx = canvas.getContext('2d');
    pCtx.clearRect(0, 0, cw, ch);
    renderText(pCtx, text, selectedFont.id, fontSize, fillColor, strokeColor, strokeWidth, cw / 2, ch / 2);
  }, [text, selectedFont, fontSize, fillColor, strokeColor, strokeWidth, fontReady]);

  useEffect(() => { draw(); }, [draw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `calligraphy-${selectedFont.label.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    addToast('Downloaded!', 'success');
  };

  const handleReset = () => {
    setText('Calligraphy');
    setSelectedFont(FONTS[0]);
    setFontSize(72);
    setFillColor('#1a1a2e');
    setStrokeColor('#000000');
    setStrokeWidth(0);
    setSearchQuery('');
    addToast('Reset to defaults', 'info');
  };

  const filtered = searchQuery
    ? FONTS.filter(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : FONTS;

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* Controls */}
        <div className="w-full lg:w-[360px] shrink-0 space-y-5 order-2 lg:order-1 lg:max-h-[85vh] lg:overflow-y-auto lg:pr-1">

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Text</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type your calligraphy..."
              rows={3}
              className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Size: {fontSize}px</label>
            <input type="range" min="24" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full accent-pink-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Text Color</label>
              <input type="color" value={fillColor} onChange={e => setFillColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Outline Color</label>
              <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Outline Width: {strokeWidth}px</label>
            <input type="range" min="0" max="12" value={strokeWidth} onChange={e => setStrokeWidth(+e.target.value)} className="w-full accent-pink-500" />
          </div>

          {/* Font Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Calligraphy Font ({FONTS.length} fonts)
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search fonts..."
                className="w-full pl-9 pr-4 py-2.5 bg-black/30 rounded-xl border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
              />
            </div>
            <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {filtered.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFont(f)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left truncate ${
                    selectedFont.id === f.id
                      ? 'bg-pink-500/20 border border-pink-500/40 text-pink-300'
                      : 'bg-white/5 border border-transparent hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No fonts found</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleDownload} className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />Download PNG
            </button>
            <button onClick={handleReset} className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors" aria-label="Reset">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 min-w-0 order-1 lg:order-2 space-y-8">

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Text Preview {loading && '— Loading font...'}
            </p>
            <div className="bg-white rounded-xl p-4 sm:p-6 flex items-center justify-center min-h-[200px] overflow-auto">
              <canvas ref={canvasRef} className="max-w-full h-auto" />
            </div>
          </div>

          {/* Font alphabet preview */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Font Preview — {selectedFont.label}
            </p>
            <div
              className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 text-center"
              style={{ fontFamily: fontReady ? `"${selectedFont.id}", cursive` : 'cursive' }}
            >
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
