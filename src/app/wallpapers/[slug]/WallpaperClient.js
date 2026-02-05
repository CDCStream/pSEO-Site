'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/Toast';

const presetColors = [
  '#FF6B35', '#FF8C42', '#FFC857', '#4ECDC4', '#44BBA4',
  '#E63946', '#F4A261', '#2A9D8F', '#264653', '#E9C46A',
  '#9B59B6', '#3498DB', '#1ABC9C', '#E74C3C', '#2ECC71',
  '#F39C12', '#9B59B6', '#34495E', '#16A085', '#27AE60',
  '#2980B9', '#8E44AD', '#C0392B', '#D35400', '#1A1A2E',
  '#16213E', '#0F3460', '#533483', '#E94560', '#000000',
  '#FFFFFF', '#F8F9FA', '#DEE2E6', '#ADB5BD', '#6C757D',
];

const presetGradients = [
  { name: 'Sunset', colors: ['#FF6B35', '#FFC857'] },
  { name: 'Ocean', colors: ['#667EEA', '#764BA2'] },
  { name: 'Forest', colors: ['#11998E', '#38EF7D'] },
  { name: 'Lavender', colors: ['#A18CD1', '#FBC2EB'] },
  { name: 'Fire', colors: ['#F12711', '#F5AF19'] },
  { name: 'Night', colors: ['#0F2027', '#203A43', '#2C5364'] },
  { name: 'Cotton Candy', colors: ['#D299C2', '#FEF9D7'] },
  { name: 'Midnight', colors: ['#232526', '#414345'] },
];

const sizes = [
  { name: 'Phone', icon: Smartphone, width: 1080, height: 1920 },
  { name: 'Tablet', icon: Tablet, width: 2048, height: 2732 },
  { name: 'Desktop', icon: Monitor, width: 1920, height: 1080 },
  { name: 'Custom', icon: null, width: 1920, height: 1080 },
];

export default function WallpaperClient({ config, slug }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#FF6B35');
  const [gradientColors, setGradientColors] = useState(['#667EEA', '#764BA2']);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [gradientAngle, setGradientAngle] = useState(135);
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const { addToast } = useToast();

  // Get actual dimensions (always use custom values)
  const actualWidth = customWidth;
  const actualHeight = customHeight;

  const isGradient = config.generatorType === 'gradient';
  const isSolidColor = config.generatorType === 'solidColor';

  // Draw wallpaper
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const displayWidth = 400;
    const aspectRatio = actualHeight / actualWidth;
    const displayHeight = displayWidth * aspectRatio;

    canvas.width = displayWidth;
    canvas.height = displayHeight;

    if (isSolidColor) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, displayWidth, displayHeight);
    } else if (isGradient) {
      const angleRad = (gradientAngle * Math.PI) / 180;
      const x1 = displayWidth / 2 - Math.cos(angleRad) * displayWidth;
      const y1 = displayHeight / 2 - Math.sin(angleRad) * displayHeight;
      const x2 = displayWidth / 2 + Math.cos(angleRad) * displayWidth;
      const y2 = displayHeight / 2 + Math.sin(angleRad) * displayHeight;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradientColors.forEach((c, i) => {
        gradient.addColorStop(i / (gradientColors.length - 1), c);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, displayWidth, displayHeight);
    } else {
      // Other wallpaper types - create abstract patterns
      drawPatternBackground(ctx, config.generatorType, displayWidth, displayHeight);
    }
  }, [color, gradientColors, selectedSize, gradientAngle, config.generatorType, isSolidColor, isGradient, actualWidth, actualHeight]);

  const drawPatternBackground = (ctx, type, width, height) => {
    // Base gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);

    switch (type) {
      case 'christmas':
        gradient.addColorStop(0, '#1a472a');
        gradient.addColorStop(0.5, '#2d5a3f');
        gradient.addColorStop(1, '#8B0000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        // Snowflakes
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 4 + 1;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'preppy':
        gradient.addColorStop(0, '#FFB6C1');
        gradient.addColorStop(0.5, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        // Stripes
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 8;
        for (let i = 0; i < width + height; i += 30) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(0, i);
          ctx.stroke();
        }
        break;
      case 'helloKitty':
        gradient.addColorStop(0, '#FFB6C1');
        gradient.addColorStop(1, '#FFC0CB');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        // Hearts
        ctx.fillStyle = 'rgba(255,105,180,0.3)';
        ctx.font = '24px Arial';
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          ctx.fillText('♡', x, y);
        }
        break;
      case 'aesthetic':
        gradient.addColorStop(0, '#2C3E50');
        gradient.addColorStop(0.5, '#4CA1AF');
        gradient.addColorStop(1, '#C4E0E5');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        break;
      default:
        ctx.fillStyle = '#667EEA';
        ctx.fillRect(0, 0, width, height);
    }
  };

  const handleDownload = () => {
    // Create full-size canvas for download
    const downloadCanvas = document.createElement('canvas');
    const ctx = downloadCanvas.getContext('2d');
    downloadCanvas.width = actualWidth;
    downloadCanvas.height = actualHeight;

    if (isSolidColor) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, actualWidth, actualHeight);
    } else if (isGradient) {
      const angleRad = (gradientAngle * Math.PI) / 180;
      const w = actualWidth;
      const h = actualHeight;
      const x1 = w / 2 - Math.cos(angleRad) * w;
      const y1 = h / 2 - Math.sin(angleRad) * h;
      const x2 = w / 2 + Math.cos(angleRad) * w;
      const y2 = h / 2 + Math.sin(angleRad) * h;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradientColors.forEach((c, i) => {
        gradient.addColorStop(i / (gradientColors.length - 1), c);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    } else {
      drawPatternBackground(ctx, config.generatorType, actualWidth, actualHeight);
    }

    const link = document.createElement('a');
    link.download = `${slug}-${actualWidth}x${actualHeight}.png`;
    link.href = downloadCanvas.toDataURL('image/png');
    link.click();

    addToast(`Wallpaper downloaded (${actualWidth}x${actualHeight})`, 'success');
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="order-2 lg:order-1">
          <div className="bg-black/30 rounded-xl p-4 flex items-center justify-center min-h-[400px]">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-lg shadow-2xl"
              style={{ maxHeight: '500px' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="order-1 lg:order-2 space-y-6">
          <h3 className="text-lg font-semibold text-white">Customize Your Wallpaper</h3>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Size Presets
            </label>
            <div className="flex gap-3 mb-4">
              {sizes.filter(s => s.name !== 'Custom').map((size) => (
                <button
                  key={size.name}
                  onClick={() => {
                    setSelectedSize(size);
                    setCustomWidth(size.width);
                    setCustomHeight(size.height);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    selectedSize.name === size.name
                      ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <size.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{size.name}</span>
                </button>
              ))}
            </div>

            {/* Image Dimensions Input - Always visible */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-gray-400 mb-3">Image Dimensions (in pixels)</p>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => {
                      setCustomWidth(Math.max(1, parseInt(e.target.value) || 1));
                      setSelectedSize(sizes.find(s => s.name === 'Custom'));
                    }}
                    className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white font-mono text-center focus:outline-none focus:border-blue-500/50"
                    min="1"
                    max="8000"
                  />
                  <span className="text-xs text-gray-500 mt-1 block text-center">Width</span>
                </div>
                <span className="text-gray-500 text-xl">×</span>
                <div className="flex-1">
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => {
                      setCustomHeight(Math.max(1, parseInt(e.target.value) || 1));
                      setSelectedSize(sizes.find(s => s.name === 'Custom'));
                    }}
                    className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white font-mono text-center focus:outline-none focus:border-blue-500/50"
                    min="1"
                    max="8000"
                  />
                  <span className="text-xs text-gray-500 mt-1 block text-center">Height</span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Selection for Solid Color */}
          {isSolidColor && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Color
              </label>
              <div className="flex gap-4 items-center mb-4">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white uppercase font-mono focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.slice(0, 18).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                      color === c ? 'border-white ring-2 ring-white/30' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gradient Controls */}
          {isGradient && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Gradient Colors
                </label>
                <div className="flex gap-4 mb-4">
                  {gradientColors.map((c, i) => (
                    <div key={i} className="flex-1">
                      <input
                        type="color"
                        value={c}
                        onChange={(e) => {
                          const newColors = [...gradientColors];
                          newColors[i] = e.target.value;
                          setGradientColors(newColors);
                        }}
                        className="w-full h-12 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>
                  ))}
                </div>

                {/* Preset Gradients */}
                <div className="grid grid-cols-4 gap-2">
                  {presetGradients.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setGradientColors([...preset.colors])}
                      className="aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-white transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${preset.colors.join(', ')})`,
                      }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Angle: {gradientAngle}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradientAngle}
                  onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </>
          )}

          {/* Download Button */}
          <div className="pt-4">
            <button
              onClick={handleDownload}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 text-lg"
            >
              <Download className="w-5 h-5" />
              Download {actualWidth}x{actualHeight}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


