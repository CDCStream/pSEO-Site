'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Upload, X, ImageIcon, Check } from 'lucide-react';

const ADOBE_PRESETS = [
  { id: 'adobe-red', name: 'Adobe Red', qr: '#FA0F00', bg: '#FFFFFF' },
  { id: 'spectrum-black', name: 'Spectrum Black', qr: '#000B1D', bg: '#FFFFFF' },
  { id: 'photoshop-blue', name: 'Photoshop Blue', qr: '#001E36', bg: '#31A8FF' },
  { id: 'illustrator-orange', name: 'Illustrator Orange', qr: '#330000', bg: '#FF9A00' },
  { id: 'indesign-pink', name: 'InDesign Pink', qr: '#49021F', bg: '#FF3366' },
  { id: 'express-magenta', name: 'Express Magenta', qr: '#FFFFFF', bg: '#DA1F26' },
  { id: 'acrobat-red', name: 'Acrobat Red', qr: '#FFFFFF', bg: '#B30B00' },
  { id: 'premiere-purple', name: 'Premiere Purple', qr: '#2A0634', bg: '#9999FF' },
  { id: 'lightroom-blue', name: 'Lightroom Blue', qr: '#FFFFFF', bg: '#0A4F94' },
  { id: 'mono-on-white', name: 'Mono on White', qr: '#000000', bg: '#FFFFFF' },
];

const ECC_LEVELS = [
  { id: 'L', label: 'L · 7%' },
  { id: 'M', label: 'M · 15%' },
  { id: 'Q', label: 'Q · 25%' },
  { id: 'H', label: 'H · 30%' },
];

const SIZE_OPTIONS = [256, 512, 1024, 2048, 4096];

function loadQrLib() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.qrcode) return Promise.resolve(window.qrcode);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
    script.onload = () => resolve(window.qrcode);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function buildSvg({ moduleCount, isDark, size, qrColor, bgColor, transparentBg }) {
  const cellSize = size / moduleCount;
  const rects = [];
  if (!transparentBg) {
    rects.push(`<rect width="${size}" height="${size}" fill="${bgColor}"/>`);
  }
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isDark(row, col)) {
        const x = (col * cellSize).toFixed(3);
        const y = (row * cellSize).toFixed(3);
        const w = cellSize.toFixed(3);
        rects.push(`<rect x="${x}" y="${y}" width="${w}" height="${w}" fill="${qrColor}"/>`);
      }
    }
  }
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">\n${rects.join('\n')}\n</svg>\n`;
}

export default function AdobeQRCodeClient() {
  const [inputValue, setInputValue] = useState('https://makersilo.com');
  const [qrColor, setQrColor] = useState('#FA0F00');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [transparentBg, setTransparentBg] = useState(false);
  const [size, setSize] = useState(1024);
  const [eccLevel, setEccLevel] = useState('M');
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [logoFileName, setLogoFileName] = useState('');
  const [activePreset, setActivePreset] = useState('adobe-red');
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const generate = useCallback(async () => {
    setErrorMsg('');
    if (!inputValue.trim()) {
      setPreviewDataUrl('');
      setSvgString('');
      return;
    }
    try {
      setBusy(true);
      const qrcode = await loadQrLib();
      if (!qrcode) return;
      const qr = qrcode(0, eccLevel);
      qr.addData(inputValue);
      qr.make();
      const moduleCount = qr.getModuleCount();
      const isDark = (r, c) => qr.isDark(r, c);

      const svg = buildSvg({
        moduleCount,
        isDark,
        size,
        qrColor,
        bgColor,
        transparentBg,
      });
      setSvgString(svg);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const cellSize = Math.floor(size / moduleCount);
      const actualSize = cellSize * moduleCount;
      canvas.width = actualSize;
      canvas.height = actualSize;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, actualSize, actualSize);

      if (!transparentBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, actualSize, actualSize);
      }
      ctx.fillStyle = qrColor;
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (isDark(row, col)) {
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
          }
        }
      }

      if (logoDataUrl) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const safeSize = Math.floor(actualSize * 0.24);
            const safeX = Math.floor((actualSize - safeSize) / 2);
            const safeY = safeX;
            const radius = Math.floor(safeSize * 0.15);

            ctx.fillStyle = transparentBg ? 'rgba(255,255,255,0.95)' : bgColor;
            ctx.beginPath();
            ctx.moveTo(safeX + radius, safeY);
            ctx.lineTo(safeX + safeSize - radius, safeY);
            ctx.quadraticCurveTo(safeX + safeSize, safeY, safeX + safeSize, safeY + radius);
            ctx.lineTo(safeX + safeSize, safeY + safeSize - radius);
            ctx.quadraticCurveTo(
              safeX + safeSize,
              safeY + safeSize,
              safeX + safeSize - radius,
              safeY + safeSize
            );
            ctx.lineTo(safeX + radius, safeY + safeSize);
            ctx.quadraticCurveTo(safeX, safeY + safeSize, safeX, safeY + safeSize - radius);
            ctx.lineTo(safeX, safeY + radius);
            ctx.quadraticCurveTo(safeX, safeY, safeX + radius, safeY);
            ctx.closePath();
            ctx.fill();

            const padding = Math.floor(safeSize * 0.08);
            const innerSize = safeSize - padding * 2;
            const ratio = Math.min(innerSize / img.width, innerSize / img.height);
            const drawW = img.width * ratio;
            const drawH = img.height * ratio;
            const drawX = safeX + (safeSize - drawW) / 2;
            const drawY = safeY + (safeSize - drawH) / 2;
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = logoDataUrl;
        });
      }

      setPreviewDataUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      setErrorMsg('Could not generate QR code. The text may be too long for the chosen error correction level.');
    } finally {
      setBusy(false);
    }
  }, [inputValue, qrColor, bgColor, transparentBg, size, eccLevel, logoDataUrl]);

  useEffect(() => {
    generate();
  }, [generate]);

  const applyPreset = useCallback((preset) => {
    setActivePreset(preset.id);
    setQrColor(preset.qr);
    setBgColor(preset.bg);
    if (transparentBg && preset.bg !== '#FFFFFF' && preset.bg !== '#FFF') {
      setTransparentBg(false);
    }
  }, [transparentBg]);

  const handleLogoFile = useCallback(
    (file) => {
      if (!file) return;
      if (!/^image\//.test(file.type)) {
        setErrorMsg('Logo file must be an image (PNG, JPG, or SVG).');
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setErrorMsg('Logo file is too large. Please use one under 4 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoDataUrl(ev.target.result);
        setLogoFileName(file.name);
        if (eccLevel !== 'H') setEccLevel('H');
      };
      reader.onerror = () => setErrorMsg('Could not read the logo file.');
      reader.readAsDataURL(file);
    },
    [eccLevel]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) handleLogoFile(file);
    },
    [handleLogoFile]
  );

  const clearLogo = useCallback(() => {
    setLogoDataUrl('');
    setLogoFileName('');
  }, []);

  const downloadPng = useCallback(() => {
    if (!previewDataUrl) return;
    const a = document.createElement('a');
    a.href = previewDataUrl;
    a.download = 'adobe-qr-code.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [previewDataUrl]);

  const downloadSvg = useCallback(() => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adobe-qr-code.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [svgString]);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-5 sm:p-8">
      <div className="grid lg:grid-cols-[1fr_420px] gap-8">
        <div className="space-y-6 min-w-0">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter URL or text
            </label>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="https://example.com or any text"
              rows={3}
              className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#FA0F00]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Adobe brand color presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ADOBE_PRESETS.map((p) => {
                const active = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`relative flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all ${
                      active
                        ? 'border-white/40 bg-white/10'
                        : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30'
                    }`}
                    title={`${p.name} (${p.qr} on ${p.bg})`}
                  >
                    <span
                      className="w-5 h-5 rounded shrink-0 ring-1 ring-black/20"
                      style={{ background: `linear-gradient(135deg, ${p.qr} 50%, ${p.bg} 50%)` }}
                    />
                    <span className="text-[11px] text-gray-200 truncate flex-1">{p.name}</span>
                    {active ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">QR color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => {
                    setQrColor(e.target.value);
                    setActivePreset('');
                  }}
                  className="w-12 h-10 rounded cursor-pointer bg-black/30 border border-white/10"
                />
                <input
                  type="text"
                  value={qrColor}
                  onChange={(e) => {
                    setQrColor(e.target.value);
                    setActivePreset('');
                  }}
                  className="flex-1 px-3 py-2 bg-black/30 rounded-lg border border-white/10 text-white text-sm font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setActivePreset('');
                  }}
                  disabled={transparentBg}
                  className="w-12 h-10 rounded cursor-pointer bg-black/30 border border-white/10 disabled:opacity-40"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setActivePreset('');
                  }}
                  disabled={transparentBg}
                  className="flex-1 px-3 py-2 bg-black/30 rounded-lg border border-white/10 text-white text-sm font-mono disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={transparentBg}
              onChange={(e) => {
                setTransparentBg(e.target.checked);
                setActivePreset('');
              }}
              className="w-4 h-4 accent-[#FA0F00]"
            />
            <span className="text-sm text-gray-200">Transparent background (PNG only)</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Logo overlay <span className="text-xs text-gray-500">(optional, PNG / JPG / SVG)</span>
            </label>
            {logoDataUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-black/20">
                <img
                  src={logoDataUrl}
                  alt={logoFileName || 'logo preview'}
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{logoFileName || 'Logo loaded'}</div>
                  <div className="text-[11px] text-gray-500">Error correction auto-set to H</div>
                </div>
                <button
                  type="button"
                  onClick={clearLogo}
                  className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5"
                  aria-label="Remove logo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`w-full flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed transition-colors ${
                  dragOver
                    ? 'border-[#FA0F00]/60 bg-[#FA0F00]/5'
                    : 'border-white/15 bg-black/20 hover:border-white/30 hover:bg-black/30'
                }`}
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-300">Click or drop a logo here</span>
                <span className="text-[11px] text-gray-500">Max 4 MB. Bumps error correction to H.</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleLogoFile(e.target.files?.[0])}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">PNG size</label>
              <select
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 bg-black/30 rounded-lg border border-white/10 text-white text-sm focus:outline-none focus:border-[#FA0F00]/50"
              >
                {SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s} x {s} px
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Error correction</label>
              <select
                value={eccLevel}
                onChange={(e) => setEccLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-black/30 rounded-lg border border-white/10 text-white text-sm focus:outline-none focus:border-[#FA0F00]/50"
              >
                {ECC_LEVELS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMsg ? (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300">
              {errorMsg}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-center justify-start gap-4">
          <div
            className={`relative rounded-2xl p-4 border border-white/10 ${
              transparentBg
                ? 'bg-[conic-gradient(at_50%_50%,_#27272a_25%,_#3f3f46_25%_50%,_#27272a_50%_75%,_#3f3f46_75%)] [background-size:24px_24px]'
                : 'bg-white'
            }`}
            style={{ width: 320, height: 320 }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
              style={{ imageRendering: 'pixelated' }}
            />
            {!previewDataUrl && !busy ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm text-center px-4">
                Type a URL or text to generate the QR
              </div>
            ) : null}
            {busy ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                <span className="text-xs text-white">Rendering…</span>
              </div>
            ) : null}
          </div>

          <div className="text-[11px] text-gray-500 -mt-2 flex items-center gap-3">
            <span>{size} x {size} px</span>
            <span>·</span>
            <span>ECC {eccLevel}</span>
            {logoDataUrl ? (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Logo
                </span>
              </>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              type="button"
              onClick={downloadPng}
              disabled={!previewDataUrl}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#FA0F00] to-[#FF9A00] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              type="button"
              onClick={downloadSvg}
              disabled={!svgString}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Download className="w-4 h-4" /> Download SVG
            </button>
          </div>

          <p className="text-[11px] text-gray-500 text-center max-w-xs leading-relaxed">
            SVG is true vector for Illustrator and InDesign. PNG is best for Photoshop layering and
            Adobe Express. Static codes never expire.
          </p>
        </div>
      </div>
    </div>
  );
}
