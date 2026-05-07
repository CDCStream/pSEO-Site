'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/components/Toast';

const FONTS = [
  { id: 'america-s-best-hero', label: "America's Best Hero", file: 'america-s-best-hero-font.ttf' },
  { id: 'american-captain-patrius-02', label: 'American Captain Patrius', file: 'american-captain-patrius-02-font.ttf' },
  { id: 'awesome-america', label: 'Awesome America', file: 'awesome-america-font.ttf' },
  { id: 'baseball-club', label: 'Baseball Club', file: 'baseball-club-font.ttf' },
  { id: 'baseball-club-solid', label: 'Baseball Club Solid', file: 'baseball-club-solid-font.ttf' },
  { id: 'black-goth', label: 'Black Goth', file: 'black-goth-font.otf' },
  { id: 'bruce-forever', label: 'Bruce Forever', file: 'bruce-forever-font.ttf' },
  { id: 'chunky-puffly', label: 'Chunky Puffly', file: 'chunky-puffly-font.otf' },
  { id: 'college-block-2', label: 'College Block 2', file: 'college-block-2-font.ttf' },
  { id: 'digital-fingerprint', label: 'Digital Fingerprint', file: 'digital-fingerprint-font.ttf' },
  { id: 'farenheight', label: 'Farenheight', file: 'farenheight-font.ttf' },
  { id: 'freshman', label: 'Freshman', file: 'freshman-font.ttf' },
  { id: 'glory-of-justice', label: 'Glory of Justice', file: 'glory-of-justice-font.ttf' },
  { id: 'gome-pixel', label: 'Gome Pixel', file: 'gome-pixel-font.otf' },
  { id: 'groovy-complex', label: 'Groovy Complex', file: 'groovy-complex-font.ttf' },
  { id: 'groovy-texbox', label: 'Groovy Textbox', file: 'groovy-texbox-font.ttf' },
  { id: 'head-capital-bold-grunge', label: 'Head Capital Bold Grunge', file: 'head-capital-bold-grunge-font.otf' },
  { id: 'headliner-no-45', label: 'Headliner No. 45', file: 'headliner-no-45-font.ttf' },
  { id: 'high-school-usa', label: 'High School USA', file: 'high-school-usa-font.ttf' },
  { id: 'jersey-m54', label: 'Jersey M54', file: 'jersey-m54-font.ttf' },
  { id: 'mgf-goblockie', label: 'MGF Goblockie', file: 'mgf-goblockie-font.otf' },
  { id: 'pine-quest', label: 'Pine Quest', file: 'pine-quest-font.ttf' },
  { id: 'ravenda', label: 'Ravenda', file: 'ravenda-font.ttf' },
  { id: 'reason-loves', label: 'Reason Loves', file: 'reason-loves-font.ttf' },
  { id: 'ro-twimch', label: 'Ro Twimch', file: 'ro-twimch-font.ttf' },
  { id: 'sangyo', label: 'Sangyo', file: 'sangyo-font.ttf' },
  { id: 'scholar-block-christmas', label: 'Scholar Block Christmas', file: 'scholar-block-christmas-font.ttf' },
  { id: 'scribble-box', label: 'Scribble Box', file: 'scribble-box-font.ttf' },
  { id: 'signwood', label: 'Signwood', file: 'signwood-font.ttf' },
  { id: 'sketch-chalk', label: 'Sketch Chalk', file: 'sketch-chalk-font.ttf' },
  { id: 'speedy', label: 'Speedy', file: 'speedy-font.ttf' },
  { id: 'spiky-chain', label: 'Spiky Chain', file: 'spiky-chain-font.otf' },
  { id: 'star-shield-2', label: 'Star Shield 2', file: 'star-shield-2-font.ttf' },
  { id: 'sunday-morning', label: 'Sunday Morning', file: 'sunday-morning-font.otf' },
  { id: 'superstar-m54', label: 'Superstar M54', file: 'superstar-m54-font.ttf' },
  { id: 'that-sounds-great', label: 'That Sounds Great', file: 'that-sounds-great-font.ttf' },
  { id: 'unitblock', label: 'Unitblock', file: 'unitblock-font.ttf' },
  { id: 'vanilla-dreamers', label: 'Vanilla Dreamers', file: 'vanilla-dreamers-font.otf' },
  { id: 'wolfalcon', label: 'Wolfalcon', file: 'wolfalcon-font.ttf' },
  { id: 'wood-carving', label: 'Wood Carving', file: 'wood-carving-font.ttf' },
];

const loadedFonts = new Set();

async function loadFont(font) {
  if (loadedFonts.has(font.id)) return;
  const url = `/block-letters-files/${font.file}`;
  const face = new FontFace(font.id, `url(${url})`);
  const loaded = await face.load();
  document.fonts.add(loaded);
  loadedFonts.add(font.id);
}

function renderText(ctx, text, fontId, fontSize, fillColor, strokeColor, strokeWidth, centerX, centerY) {
  ctx.font = `${fontSize}px "${fontId}"`;
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

export default function BlockLettersClient() {
  const canvasRef = useRef(null);
  const [text, setText] = useState('Block');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontReady, setFontReady] = useState(false);
  const [fontSize, setFontSize] = useState(96);
  const [fillColor, setFillColor] = useState('#10b981');
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
    ctx.font = `${fontSize}px "${selectedFont.id}"`;

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
    link.download = `block-letters-${selectedFont.label.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    addToast('Downloaded!', 'success');
  };

  const handleReset = () => {
    setText('Block');
    setSelectedFont(FONTS[0]);
    setFontSize(96);
    setFillColor('#10b981');
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
              placeholder="Type your block letters..."
              rows={3}
              className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Size: {fontSize}px</label>
            <input type="range" min="24" max="240" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full accent-emerald-500" />
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
            <input type="range" min="0" max="16" value={strokeWidth} onChange={e => setStrokeWidth(+e.target.value)} className="w-full accent-emerald-500" />
          </div>

          {/* Font Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Block Letter Font ({FONTS.length} fonts)
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search fonts..."
                className="w-full pl-9 pr-4 py-2.5 bg-black/30 rounded-xl border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {filtered.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFont(f)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left truncate ${
                    selectedFont.id === f.id
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
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
            <button onClick={handleDownload} className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
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

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Font Preview — {selectedFont.label}
            </p>
            <div
              className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 text-center"
              style={{ fontFamily: fontReady ? `"${selectedFont.id}", sans-serif` : 'sans-serif' }}
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
