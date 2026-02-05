'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RotateCcw, Trash2, Type, Palette, Image, Settings } from 'lucide-react';

// Background themes
const BACKGROUNDS = {
  pixelated: { name: 'Pixelated', preview: 'linear-gradient(180deg, #5D8C3E 0%, #5D8C3E 30%, #8B6914 30%)' },
  grass: { name: 'Grass', preview: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 40%, #5D8C3E 40%, #5D8C3E 75%, #8B5A2B 75%)' },
  night: { name: 'Night', preview: 'linear-gradient(180deg, #0a0a20, #1a1a3a, #2a2a4a)' },
  nether: { name: 'Nether', preview: 'linear-gradient(180deg, #1a0500, #3d0a00, #5a1500)' },
  transparent: { name: 'Transparent', preview: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px' },
};

// Block materials
const MATERIALS = {
  stone: {
    name: 'Stone',
    gradient: ['#B8B8B8', '#D8D8D8', '#F0F0F0', '#C8C8C8', '#909090'],
    outline: '#1a1a1a',
    shadow: '#404040',
    hasCracks: true,
  },
  diamond: {
    name: 'Diamond',
    gradient: ['#4DD0E1', '#80DEEA', '#B2EBF2', '#4DD0E1', '#00ACC1'],
    outline: '#003D33',
    shadow: '#00695C',
    hasCracks: false,
  },
  gold: {
    name: 'Gold',
    gradient: ['#FFD54F', '#FFEB3B', '#FFF59D', '#FFC107', '#FF8F00'],
    outline: '#5D4037',
    shadow: '#8D6E63',
    hasCracks: false,
  },
  emerald: {
    name: 'Emerald',
    gradient: ['#66BB6A', '#81C784', '#A5D6A7', '#66BB6A', '#43A047'],
    outline: '#1B5E20',
    shadow: '#388E3C',
    hasCracks: false,
  },
  redstone: {
    name: 'Redstone',
    gradient: ['#E53935', '#EF5350', '#FFCDD2', '#E53935', '#C62828'],
    outline: '#3E0000',
    shadow: '#7F0000',
    hasCracks: false,
  },
  obsidian: {
    name: 'Obsidian',
    gradient: ['#2A1B3D', '#3D2B52', '#4A3662', '#2A1B3D', '#1A0F28'],
    outline: '#0a0510',
    shadow: '#150A20',
    hasCracks: false,
  },
};

// Pixelated block colors for background (matching reference image exactly)
const BLOCK_COLORS = {
  grass: ['#5CB85C', '#4CA64C', '#6BC96B', '#3D8B3D', '#7ADA7A', '#2E7D2E'],
  dirt: ['#8B5A2B', '#6B4423', '#9C6B3C', '#5A3A1A', '#7A4A28', '#4A2A10', '#A07040', '#C09060'],
  stone: ['#808080', '#909090', '#707070', '#A0A0A0', '#606060'],
};

export default function MinecraftTextClient({ config }) {
  const canvasRef = useRef(null);
  const [inputText, setInputText] = useState('MINECRAFT');
  const [subtitleText, setSubtitleText] = useState('');
  const [material, setMaterial] = useState('stone');
  const [background, setBackground] = useState('pixelated');
  const [fontSize, setFontSize] = useState(72);
  const [depth, setDepth] = useState(8);
  const [activeTab, setActiveTab] = useState('text');
  const [fontLoaded, setFontLoaded] = useState(false);

  const mat = MATERIALS[material];

  // Load Minecraft fonts
  useEffect(() => {
    const loadFont = async () => {
      try {
        // Try multiple fonts in order of preference
        const fonts = [
          { name: 'Minecrafter', url: '/fonts/Minecrafter.Reg.ttf' },
          { name: 'MinecrafterAlt', url: '/fonts/Minecrafter.Alt.ttf' },
          { name: 'Minercraftory', url: '/fonts/Minercraftory.ttf' },
          { name: '8bitArcade', url: '/fonts/8-bit Arcade In.ttf' },
        ];

        for (const font of fonts) {
          try {
            const fontFace = new FontFace(font.name, `url(${font.url})`);
            const loadedFont = await fontFace.load();
            document.fonts.add(loadedFont);
            console.log(`Loaded font: ${font.name}`);
          } catch (e) {
            console.log(`Failed to load ${font.name}:`, e.message);
          }
        }

        setFontLoaded(true);
      } catch (e) {
        console.error('Font loading error:', e);
        setFontLoaded(true); // Continue with fallback
      }
    };
    loadFont();
  }, []);

  // Draw pixelated Minecraft background (matching reference image)
  const drawPixelatedBackground = useCallback((ctx, w, h, blockSize = 32) => {
    // Seed for consistent randomness
    const seededRandom = (x, y) => {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return n - Math.floor(n);
    };

    // Draw grass layer (top ~25%)
    const grassHeight = Math.floor(h * 0.22);
    for (let y = 0; y < grassHeight; y += blockSize) {
      for (let x = 0; x < w; x += blockSize) {
        const colors = BLOCK_COLORS.grass;
        const rand = seededRandom(x, y);
        ctx.fillStyle = colors[Math.floor(rand * colors.length)];
        ctx.fillRect(x, y, blockSize, blockSize);
      }
    }

    // Draw transition layer (grass to dirt, ~5%)
    const transitionHeight = grassHeight + Math.floor(h * 0.08);
    for (let y = grassHeight; y < transitionHeight; y += blockSize) {
      for (let x = 0; x < w; x += blockSize) {
        const rand = seededRandom(x, y);
        // Mix of grass and dirt
        if (rand > 0.5) {
          ctx.fillStyle = BLOCK_COLORS.grass[Math.floor(rand * BLOCK_COLORS.grass.length)];
        } else {
          ctx.fillStyle = BLOCK_COLORS.dirt[Math.floor(rand * BLOCK_COLORS.dirt.length)];
        }
        ctx.fillRect(x, y, blockSize, blockSize);
      }
    }

    // Draw dirt layer (remaining area)
    for (let y = transitionHeight; y < h; y += blockSize) {
      for (let x = 0; x < w; x += blockSize) {
        const rand = seededRandom(x, y);
        const colors = BLOCK_COLORS.dirt;
        ctx.fillStyle = colors[Math.floor(rand * colors.length)];
        ctx.fillRect(x, y, blockSize, blockSize);

        // Add some stone/gravel blocks randomly
        if (rand > 0.93) {
          const stoneColors = BLOCK_COLORS.stone;
          ctx.fillStyle = stoneColors[Math.floor(rand * stoneColors.length)];
          ctx.fillRect(x, y, blockSize, blockSize);
        }
      }
    }
  }, []);

  // Draw background
  const drawBackground = useCallback((ctx, w, h, bgType) => {
    switch (bgType) {
      case 'pixelated':
        drawPixelatedBackground(ctx, w, h, 28);
        break;
      case 'grass':
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, w, h * 0.4);
        ctx.fillStyle = '#5D8C3E';
        ctx.fillRect(0, h * 0.4, w, h * 0.35);
        ctx.fillStyle = '#8B5A2B';
        ctx.fillRect(0, h * 0.75, w, h * 0.25);
        break;
      case 'night':
        const nightGrad = ctx.createLinearGradient(0, 0, 0, h);
        nightGrad.addColorStop(0, '#0a0a20');
        nightGrad.addColorStop(0.5, '#1a1a3a');
        nightGrad.addColorStop(1, '#2a2a4a');
        ctx.fillStyle = nightGrad;
        ctx.fillRect(0, 0, w, h);
        break;
      case 'nether':
        const netherGrad = ctx.createLinearGradient(0, 0, 0, h);
        netherGrad.addColorStop(0, '#1a0500');
        netherGrad.addColorStop(0.5, '#3d0a00');
        netherGrad.addColorStop(1, '#5a1500');
        ctx.fillStyle = netherGrad;
        ctx.fillRect(0, 0, w, h);
        break;
      default: // transparent
        ctx.clearRect(0, 0, w, h);
    }
  }, [drawPixelatedBackground]);

  // Draw cracks on text
  const drawCracks = useCallback((ctx, x, y, textWidth, textHeight) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(50, 50, 50, 0.6)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    const crackCount = Math.floor(textWidth / 50) + 5;

    for (let i = 0; i < crackCount; i++) {
      const startX = x - textWidth/2 + 15 + (i * textWidth / crackCount);
      const startY = y - textHeight/2 + 5 + (i % 4) * 4;

      ctx.beginPath();
      ctx.moveTo(startX, startY);

      let cx = startX;
      let cy = startY;

      const segments = 2 + (i % 3);
      for (let j = 0; j < segments; j++) {
        cx += (i % 2 === 0 ? 1 : -1) * (4 + j * 2);
        cy += 10 + j * 5;

        if (cy > y + textHeight/2 - 10) break;
        ctx.lineTo(cx, cy);

        // Small branch
        if (j === 1 && Math.random() > 0.5) {
          const branchDir = i % 2 === 0 ? 6 : -6;
          ctx.lineTo(cx + branchDir, cy + 5);
          ctx.moveTo(cx, cy);
        }
      }
      ctx.stroke();

      // Lighter edge
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      cx = startX + 1;
      cy = startY + 1;
      ctx.moveTo(cx, cy);
      for (let j = 0; j < segments; j++) {
        cx += (i % 2 === 0 ? 1 : -1) * (4 + j * 2);
        cy += 10 + j * 5;
        if (cy > y + textHeight/2 - 10) break;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(50, 50, 50, 0.6)';
      ctx.lineWidth = 2;
    }
    ctx.restore();
  }, []);

  // Main render function
  const renderText = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fontLoaded) return;

    const ctx = canvas.getContext('2d');
    const text = (inputText || 'MINECRAFT').toUpperCase();
    const subtitle = subtitleText.toUpperCase();

    // Font setup - try Minecraft fonts first
    const fontFamily = 'Minecrafter, MinecrafterAlt, Minercraftory, "Arial Black", Impact, sans-serif';
    const subtitleFontFamily = '8bitArcade, Minecrafter, "Arial Black", sans-serif';

    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Measure text
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    // Measure subtitle if exists
    let subtitleWidth = 0;
    let subtitleHeight = 0;
    if (subtitle) {
      ctx.font = `bold ${Math.floor(fontSize * 0.35)}px ${subtitleFontFamily}`;
      subtitleWidth = ctx.measureText(subtitle).width;
      subtitleHeight = Math.floor(fontSize * 0.35);
    }

    const padding = 100;
    const subtitleSpacing = subtitle ? 30 : 0;
    const totalHeight = textHeight + (subtitle ? subtitleHeight + subtitleSpacing : 0);

    // Set canvas size
    canvas.width = Math.max(textWidth, subtitleWidth) + depth * 2 + padding * 2;
    canvas.height = totalHeight + depth * 2 + padding * 2;

    const centerX = canvas.width / 2;
    const mainTextY = subtitle
      ? (padding + textHeight / 2 + depth)
      : (canvas.height / 2);
    const subtitleY = mainTextY + textHeight / 2 + subtitleSpacing + subtitleHeight / 2;

    // === LAYER 1: Background ===
    drawBackground(ctx, canvas.width, canvas.height, background);

    // Re-apply font after canvas resize
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // === LAYER 2: Drop shadow (blur) ===
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = depth + 5;
    ctx.shadowOffsetY = depth + 5;
    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.fillText(text, centerX, mainTextY);
    ctx.restore();

    // === LAYER 3: 3D Depth extrusion (isometric style) ===
    for (let i = depth; i > 0; i--) {
      const ratio = i / depth;
      // Darker at the back, lighter near the front
      const shade = Math.floor(20 + (1 - ratio) * 35);
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.fillText(text, centerX + i * 0.8, mainTextY + i);
    }

    // === LAYER 4: Thick black outline ===
    ctx.strokeStyle = mat.outline;
    ctx.lineWidth = 14;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeText(text, centerX, mainTextY);

    // === LAYER 5: Main text with gradient ===
    const gradient = ctx.createLinearGradient(0, mainTextY - textHeight/2, 0, mainTextY + textHeight/2);
    gradient.addColorStop(0, mat.gradient[0]);
    gradient.addColorStop(0.2, mat.gradient[1]);
    gradient.addColorStop(0.5, mat.gradient[2]);
    gradient.addColorStop(0.8, mat.gradient[3]);
    gradient.addColorStop(1, mat.gradient[4]);

    ctx.fillStyle = gradient;
    ctx.fillText(text, centerX, mainTextY);

    // === LAYER 6: Inner outline ===
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 2;
    ctx.strokeText(text, centerX, mainTextY);

    // === LAYER 7: Top highlight ===
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    const highlightGrad = ctx.createLinearGradient(0, mainTextY - textHeight/2, 0, mainTextY - textHeight/4);
    highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = highlightGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // === LAYER 8: Middle shadow line ===
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, mainTextY - 2, canvas.width, 4);
    ctx.restore();

    // === LAYER 9: Cracks overlay ===
    if (mat.hasCracks) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      drawCracks(ctx, centerX, mainTextY, textWidth, textHeight);
      ctx.restore();
    }

    // === LAYER 10: Subtitle (matching reference style) ===
    if (subtitle) {
      const subFontSize = Math.floor(fontSize * 0.38);
      ctx.font = `bold ${subFontSize}px ${subtitleFontFamily}`;

      // Subtitle 3D depth (stronger effect)
      for (let i = 5; i > 0; i--) {
        const shade = Math.floor(25 + (5 - i) * 8);
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
        ctx.fillText(subtitle, centerX + i * 0.6, subtitleY + i * 0.8);
      }

      // Subtitle outline
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 7;
      ctx.lineJoin = 'round';
      ctx.strokeText(subtitle, centerX, subtitleY);

      // Subtitle fill with gradient
      const subGrad = ctx.createLinearGradient(0, subtitleY - subtitleHeight/2, 0, subtitleY + subtitleHeight/2);
      subGrad.addColorStop(0, '#D0D0D0');
      subGrad.addColorStop(0.3, '#F5F5F5');
      subGrad.addColorStop(0.5, '#FFFFFF');
      subGrad.addColorStop(0.7, '#E8E8E8');
      subGrad.addColorStop(1, '#A8A8A8');
      ctx.fillStyle = subGrad;
      ctx.fillText(subtitle, centerX, subtitleY);

      // Subtitle inner stroke for definition
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1.5;
      ctx.strokeText(subtitle, centerX, subtitleY);
    }

  }, [inputText, subtitleText, material, background, fontSize, depth, mat, drawBackground, drawCracks, fontLoaded]);

  // Re-render when dependencies change
  useEffect(() => {
    // Add small delay to ensure font is rendered
    const timer = setTimeout(() => {
      renderText();
    }, 100);
    return () => clearTimeout(timer);
  }, [renderText]);

  // Download PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `minecraft-${inputText.toLowerCase().replace(/\s+/g, '-') || 'text'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Reset to defaults
  const handleReset = () => {
    setInputText('MINECRAFT');
    setSubtitleText('');
    setFontSize(72);
    setDepth(8);
    setMaterial('stone');
    setBackground('pixelated');
  };

  return (
    <div className="space-y-6">
      {/* Canvas Preview */}
      <div className="bg-black/30 rounded-2xl border border-white/10 p-4 overflow-hidden">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="rounded-xl shadow-2xl max-w-full h-auto"
            style={{ imageRendering: 'auto' }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'text', icon: Type, label: 'TEXT' },
            { id: 'style', icon: Palette, label: 'MATERIAL' },
            { id: 'background', icon: Image, label: 'BACKGROUND' },
            { id: 'settings', icon: Settings, label: 'SETTINGS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-green-500/20 text-green-400 border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Main Text
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value.toUpperCase().slice(0, 15))}
                    placeholder="MINECRAFT"
                    className="w-full px-4 py-4 bg-black/30 rounded-xl border border-white/10 text-white text-xl font-bold placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all uppercase tracking-widest text-center"
                    maxLength={15}
                  />
                  {inputText && (
                    <button
                      onClick={() => setInputText('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={subtitleText}
                  onChange={(e) => setSubtitleText(e.target.value.toUpperCase().slice(0, 25))}
                  placeholder="HYPERPIX EDITION"
                  className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white font-medium placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all uppercase tracking-wider text-center"
                  maxLength={25}
                />
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Block Material
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(MATERIALS).map(([key, m]) => (
                  <button
                    key={key}
                    onClick={() => setMaterial(key)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      material === key
                        ? 'border-green-500 bg-green-500/10 scale-105'
                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className="w-full h-10 rounded-lg mb-2"
                      style={{
                        background: `linear-gradient(180deg, ${m.gradient.join(', ')})`,
                        border: `3px solid ${m.outline}`,
                        boxShadow: `4px 4px 0 ${m.shadow}`,
                      }}
                    />
                    <span className="text-xs text-gray-400">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'background' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Background Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(BACKGROUNDS).map(([key, b]) => (
                  <button
                    key={key}
                    onClick={() => setBackground(key)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      background === key
                        ? 'border-green-500 bg-green-500/10 scale-105'
                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-lg mb-2"
                      style={{ background: b.preview }}
                    />
                    <span className="text-xs text-gray-400">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
                  <span>Text Size</span>
                  <span className="text-green-400">{fontSize}px</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
                  <span>3D Depth</span>
                  <span className="text-green-400">{depth}px</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="15"
                  value={depth}
                  onChange={(e) => setDepth(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/25 hover:scale-105"
        >
          <Download className="w-5 h-5" />
          Download PNG
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>
    </div>
  );
}
