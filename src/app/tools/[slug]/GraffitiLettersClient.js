'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/components/Toast';

const FONTS = [
  { id: 'a-attack-graffiti-font', label: 'A Attack Graffiti', file: 'a-attack-graffiti-font.otf' },
  { id: 'a-dripping-marker-font', label: 'A Dripping Marker', file: 'a-dripping-marker-font.ttf' },
  { id: 'absolute-graffiti-font', label: 'Absolute Graffiti', file: 'absolute-graffiti-font.otf' },
  { id: 'angel-rhapsody-font', label: 'Angel Rhapsody', file: 'angel-rhapsody-font.otf' },
  { id: 'ayaha-2-font', label: 'Ayaha 2', file: 'ayaha-2-font.ttf' },
  { id: 'barachiel-font', label: 'Barachiel', file: 'barachiel-font.ttf' },
  { id: 'beast-quotz-solid-font', label: 'Beast Quotz Solid', file: 'beast-quotz-solid-font.ttf' },
  { id: 'big-monkey-font', label: 'Big Monkey', file: 'big-monkey-font.otf' },
  { id: 'black-destroy-font', label: 'Black Destroy', file: 'black-destroy-font.otf' },
  { id: 'black-gatte-font', label: 'Black Gatte', file: 'black-gatte-font.otf' },
  { id: 'bloody-modes-font', label: 'Bloody Modes', file: 'bloody-modes-font.ttf' },
  { id: 'bobagum-font', label: 'Bobagum', file: 'bobagum-font.otf' },
  { id: 'boldie-blondie-font', label: 'Boldie Blondie', file: 'boldie-blondie-font.otf' },
  { id: 'breakingrule-font', label: 'Breakingrule', file: 'breakingrule-font.otf' },
  { id: 'bricks-font', label: 'Bricks', file: 'bricks-font.ttf' },
  { id: 'bulbis-font', label: 'Bulbis', file: 'bulbis-font.ttf' },
  { id: 'bulzing-font', label: 'Bulzing', file: 'bulzing-font.otf' },
  { id: 'christmas-cypher-font', label: 'Christmas Cypher', file: 'christmas-cypher-font.otf' },
  { id: 'closer-font', label: 'Closer', file: 'closer-font.otf' },
  { id: 'comback-home-font', label: 'Comback Home', file: 'comback-home-font.ttf' },
  { id: 'crackline-font', label: 'Crackline', file: 'crackline-font.otf' },
  { id: 'crazy-graffiti-font', label: 'Crazy Graffiti', file: 'crazy-graffiti-font.otf' },
  { id: 'criminalz-font', label: 'Criminalz', file: 'criminalz-font.ttf' },
  { id: 'cruel-machine-font', label: 'Cruel Machine', file: 'cruel-machine-font.otf' },
  { id: 'deathmetal-font', label: 'Deathmetal', file: 'deathmetal-font.otf' },
  { id: 'devious-road-font', label: 'Devious Road', file: 'devious-road-font.ttf' },
  { id: 'dirtyboy-font', label: 'Dirtyboy', file: 'dirtyboy-font.ttf' },
  { id: 'docallisme-on-street-font', label: 'Docallisme On Street', file: 'docallisme-on-street-font.otf' },
  { id: 'dripping-drops-font', label: 'Dripping Drops', file: 'dripping-drops-font.otf' },
  { id: 'dunara-font', label: 'Dunara', file: 'dunara-font.ttf' },
  { id: 'exthing-font', label: 'Exthing', file: 'exthing-font.ttf' },
  { id: 'fczl-font', label: 'Fczl', file: 'fczl-font.ttf' },
  { id: 'fillings-urban-font', label: 'Fillings Urban', file: 'fillings-urban-font.otf' },
  { id: 'fluffy-blitz-font', label: 'Fluffy Blitz', file: 'fluffy-blitz-font.otf' },
  { id: 'gas-huffer-phat-font', label: 'Gas Huffer Phat', file: 'gas-huffer-phat-font.ttf' },
  { id: 'gaviro-font', label: 'Gaviro', file: 'gaviro-font.ttf' },
  { id: 'genius-fraud-font', label: 'Genius Fraud', file: 'genius-fraud-font.ttf' },
  { id: 'ghang-font', label: 'Ghang', file: 'ghang-font.ttf' },
  { id: 'glowst-font', label: 'Glowst', file: 'glowst-font.otf' },
  { id: 'graffiti-brick-font', label: 'Graffiti Brick', file: 'graffiti-brick-font.ttf' },
  { id: 'groovy-bombs-font', label: 'Groovy Bombs', file: 'groovy-bombs-font.ttf' },
  { id: 'hiro-misake-font', label: 'Hiro Misake', file: 'hiro-misake-font.otf' },
  { id: 'holland-font', label: 'Holland', file: 'holland-font.ttf' },
  { id: 'hoperush-font', label: 'Hoperush', file: 'hoperush-font.otf' },
  { id: 'hyper-blob-font', label: 'Hyper Blob', file: 'hyper-blob-font.otf' },
  { id: 'jackboa-font', label: 'Jackboa', file: 'jackboa-font.otf' },
  { id: 'kemujan-font', label: 'Kemujan', file: 'kemujan-font.otf' },
  { id: 'kortz-font', label: 'Kortz', file: 'kortz-font.otf' },
  { id: 'kramood-font', label: 'Kramood', file: 'kramood-font.ttf' },
  { id: 'mashiro-font', label: 'Mashiro', file: 'mashiro-font.otf' },
  { id: 'mawns-graffiti-filled-font', label: 'Mawns Graffiti Filled', file: 'mawns-graffiti-filled-font.ttf' },
  { id: 'melted-monster-font', label: 'Melted Monster', file: 'melted-monster-font.ttf' },
  { id: 'misdemeanor-font', label: 'Misdemeanor', file: 'misdemeanor-font.ttf' },
  { id: 'monovibe-graffiti-font', label: 'Monovibe Graffiti', file: 'monovibe-graffiti-font.ttf' },
  { id: 'nightfate-graffiti-font', label: 'Nightfate Graffiti', file: 'nightfate-graffiti-font.ttf' },
  { id: 'noctra-drip-solid-font', label: 'Noctra Drip Solid', file: 'noctra-drip-solid-font.ttf' },
  { id: 'noise-block-font', label: 'Noise Block', file: 'noise-block-font.ttf' },
  { id: 'outline-mirage-fill-font', label: 'Outline Mirage Fill', file: 'outline-mirage-fill-font.ttf' },
  { id: 'paper-ropped-font', label: 'Paper Ropped', file: 'paper-ropped-font.otf' },
  { id: 'ragamgaris-font', label: 'Ragamgaris', file: 'ragamgaris-font.otf' },
  { id: 'rattenca-font', label: 'Rattenca', file: 'rattenca-font.otf' },
  { id: 'rattle-dread-font', label: 'Rattle Dread', file: 'rattle-dread-font.ttf' },
  { id: 'rift-punk-drip-font', label: 'Rift Punk Drip', file: 'rift-punk-drip-font.ttf' },
  { id: 'ruthless-wreckin-one-font', label: 'Ruthless Wreckin One', file: 'ruthless-wreckin-one-font.ttf' },
  { id: 'sabindo-font', label: 'Sabindo', file: 'sabindo-font.otf' },
  { id: 'sabloomy-font', label: 'Sabloomy', file: 'sabloomy-font.otf' },
  { id: 'sabrock-font', label: 'Sabrock', file: 'sabrock-font.otf' },
  { id: 'scary-graffiti-font', label: 'Scary Graffiti', file: 'scary-graffiti-font.ttf' },
  { id: 'silooc-font', label: 'Silooc', file: 'silooc-font.ttf' },
  { id: 'sion-possible-font', label: 'Sion Possible', file: 'sion-possible-font.otf' },
  { id: 'slime-drip-font', label: 'Slime Drip', file: 'slime-drip-font.ttf' },
  { id: 'smilen-font', label: 'Smilen', file: 'smilen-font.otf' },
  { id: 'solarona-font', label: 'Solarona', file: 'solarona-font.otf' },
  { id: 'spooky-punk-font', label: 'Spooky Punk', file: 'spooky-punk-font.ttf' },
  { id: 'stencil-ptx-sprayed-font', label: 'Stencil Ptx Sprayed', file: 'stencil-ptx-sprayed-font.ttf' },
  { id: 'stop-famous-font', label: 'Stop Famous', file: 'stop-famous-font.ttf' },
  { id: 'street-explorer-font', label: 'Street Explorer', file: 'street-explorer-font.otf' },
  { id: 'strezy-break-font', label: 'Strezy Break', file: 'strezy-break-font.otf' },
  { id: 'subway-graph-font', label: 'Subway Graph', file: 'subway-graph-font.ttf' },
  { id: 'super-crown-font', label: 'Super Crown', file: 'super-crown-font.ttf' },
  { id: 'super-feel-font', label: 'Super Feel', file: 'super-feel-font.ttf' },
  { id: 'tf-madloud-font', label: 'Tf Madloud', file: 'tf-madloud-font.otf' },
  { id: 'the-battle-continuez-font', label: 'The Battle Continuez', file: 'the-battle-continuez-font.ttf' },
  { id: 'the-droga-font', label: 'The Droga', file: 'the-droga-font.ttf' },
  { id: 'throwupz-font', label: 'Throwupz', file: 'throwupz-font.ttf' },
  { id: 'toxia-font', label: 'Toxia', file: 'toxia-font.ttf' },
  { id: 'tratags-font', label: 'Tratags', file: 'tratags-font.otf' },
  { id: 'trigger-graffiti-font', label: 'Trigger Graffiti', file: 'trigger-graffiti-font.ttf' },
  { id: 'ugesra-font', label: 'Ugesra', file: 'ugesra-font.otf' },
  { id: 'urban-sign-font', label: 'Urban Sign', file: 'urban-sign-font.otf' },
  { id: 'vantela-font', label: 'Vantela', file: 'vantela-font.otf' },
  { id: 'viper-gear-font', label: 'Viper Gear', file: 'viper-gear-font.otf' },
  { id: 'wasted-punk-font', label: 'Wasted Punk', file: 'wasted-punk-font.ttf' },
  { id: 'zombies-coming-graffiti-font', label: 'Zombies Coming Graffiti', file: 'zombies-coming-graffiti-font.ttf' },
];

const loadedFonts = new Set();

async function loadFont(font) {
  if (loadedFonts.has(font.id)) return;
  const url = `/graffiti-fonts/${font.file}`;
  const face = new FontFace(font.id, `url(${url})`);
  const loaded = await face.load();
  document.fonts.add(loaded);
  loadedFonts.add(font.id);
}

function drawBrickWall(ctx, w, h) {
  const brickW = 60;
  const brickH = 25;
  const mortar = 3;

  ctx.fillStyle = '#8B7355';
  ctx.fillRect(0, 0, w, h);

  const colors = ['#A0522D', '#8B4513', '#CD853F', '#B8652A', '#9B5A2D', '#7A4420', '#C4713B', '#A66332'];
  const rows = Math.ceil(h / (brickH + mortar));
  const cols = Math.ceil(w / (brickW + mortar)) + 1;

  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : -(brickW + mortar) / 2;
    for (let col = -1; col < cols; col++) {
      const x = col * (brickW + mortar) + offset;
      const y = row * (brickH + mortar);
      const ci = (row * 7 + col * 3) & 7;
      ctx.fillStyle = colors[ci < 0 ? ci + 8 : ci];
      ctx.fillRect(x, y, brickW, brickH);

      ctx.fillStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.08})`;
      ctx.fillRect(x, y, brickW, brickH);

      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
      ctx.fillRect(x + 2, y + 1, brickW - 4, brickH / 2);
    }
  }

  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, 0, w, h);
}

function renderText(ctx, text, fontId, fontSize, fillColor, strokeColor, strokeWidth, centerX, centerY) {
  const fontStr = `${fontSize}px "${fontId}"`;
  ctx.font = fontStr;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = (text || ' ').split('\n');
  const lineH = fontSize * 1.3;
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

export default function GraffitiLettersClient() {
  const previewCanvasRef = useRef(null);
  const wallCanvasRef = useRef(null);
  const [text, setText] = useState('Graffiti');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontReady, setFontReady] = useState(false);
  const [fontSize, setFontSize] = useState(80);
  const [fillColor, setFillColor] = useState('#FF4500');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
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

    const preview = previewCanvasRef.current;
    const wall = wallCanvasRef.current;
    if (!preview || !wall) return;

    const fontStr = `${fontSize}px "${selectedFont.id}"`;
    const tmpCtx = preview.getContext('2d');
    tmpCtx.font = fontStr;

    const lines = (text || ' ').split('\n');
    const lineH = fontSize * 1.3;
    let maxW = 0;
    lines.forEach(l => {
      const w = tmpCtx.measureText(l || ' ').width;
      if (w > maxW) maxW = w;
    });

    const pad = strokeWidth + 40;
    const cw = Math.max(300, maxW + pad * 2);
    const ch = Math.max(150, lines.length * lineH + pad * 2);

    preview.width = cw;
    preview.height = ch;
    const pCtx = preview.getContext('2d');
    pCtx.clearRect(0, 0, cw, ch);
    renderText(pCtx, text, selectedFont.id, fontSize, fillColor, strokeColor, strokeWidth, cw / 2, ch / 2);

    const wallW = Math.max(600, cw);
    const wallH = Math.max(300, ch + 60);
    wall.width = wallW;
    wall.height = wallH;
    const wCtx = wall.getContext('2d');
    drawBrickWall(wCtx, wallW, wallH);
    renderText(wCtx, text, selectedFont.id, fontSize, fillColor, strokeColor, strokeWidth, wallW / 2, wallH / 2);
  }, [text, selectedFont, fontSize, fillColor, strokeColor, strokeWidth, fontReady]);

  useEffect(() => { draw(); }, [draw]);

  const handleDownload = (canvasRef, filename) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    addToast('Downloaded!', 'success');
  };

  const handleReset = () => {
    setText('Graffiti');
    setSelectedFont(FONTS[0]);
    setFontSize(80);
    setFillColor('#FF4500');
    setStrokeColor('#000000');
    setStrokeWidth(3);
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

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Text</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type your graffiti..."
              rows={3}
              className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Size: {fontSize}px</label>
            <input type="range" min="24" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full accent-orange-500" />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Fill Color</label>
              <input type="color" value={fillColor} onChange={e => setFillColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Outline Color</label>
              <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0" />
            </div>
          </div>

          {/* Stroke Width */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Outline Width: {strokeWidth}px</label>
            <input type="range" min="0" max="20" value={strokeWidth} onChange={e => setStrokeWidth(+e.target.value)} className="w-full accent-orange-500" />
          </div>

          {/* Font Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Graffiti Font ({FONTS.length} fonts)
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search fonts..."
                className="w-full pl-9 pr-4 py-2.5 bg-black/30 rounded-xl border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
            <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {filtered.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFont(f)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left truncate ${
                    selectedFont.id === f.id
                      ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300'
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

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleReset} className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors" aria-label="Reset">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 min-w-0 order-1 lg:order-2 space-y-8">

          {/* Normal Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Text Preview {loading && '— Loading font...'}
              </p>
              <button
                onClick={() => handleDownload(previewCanvasRef, `graffiti-${selectedFont.label.replace(/\s+/g, '-').toLowerCase()}.png`)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />Download PNG
              </button>
            </div>
            <div className="bg-[repeating-conic-gradient(#1a1a2e_0%_25%,#16162a_0%_50%)] bg-[length:20px_20px] rounded-xl p-4 sm:p-6 flex items-center justify-center min-h-[180px] overflow-auto">
              <canvas ref={previewCanvasRef} className="max-w-full h-auto" />
            </div>
          </div>

          {/* Wall Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Wall Preview</p>
              <button
                onClick={() => handleDownload(wallCanvasRef, `graffiti-wall-${selectedFont.label.replace(/\s+/g, '-').toLowerCase()}.png`)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />Download Wall
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <canvas ref={wallCanvasRef} className="w-full h-auto" />
            </div>
          </div>

          {/* Font alphabet preview */}
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
