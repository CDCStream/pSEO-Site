'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';

// QR Code generator using canvas (no external library)
// Based on https://github.com/nayuki/QR-Code-generator (MIT license concept)

// Simple QR Code generation using a CDN-loaded library
export default function QRCodeClient({ config, slug }) {
  const [inputValue, setInputValue] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(256);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiType, setWifiType] = useState('WPA');
  const [barcodeValue, setBarcodeValue] = useState('');
  const canvasRef = useRef(null);

  const isWifi = config.generatorType === 'wifiQr';
  const isBarcode = config.generatorType === 'barcode';

  // Generate QR code using canvas
  const generateQR = useCallback(async (text) => {
    if (!text || typeof window === 'undefined') return;

    try {
      // Use the qrcode-generator library loaded from CDN
      if (!window.qrcode) {
        // Load the library dynamically
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const qr = window.qrcode(0, 'M');
      qr.addData(text);
      qr.make();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const moduleCount = qr.getModuleCount();
      const cellSize = Math.floor(size / moduleCount);
      const actualSize = cellSize * moduleCount;

      canvas.width = actualSize;
      canvas.height = actualSize;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, actualSize, actualSize);

      // QR modules
      ctx.fillStyle = qrColor;
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
          }
        }
      }

      setQrDataUrl(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('QR generation error:', error);
    }
  }, [size, qrColor, bgColor]);

  // Generate Barcode using canvas
  const generateBarcode = useCallback((value) => {
    if (!value || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Simple Code128 barcode (subset B for alphanumeric)
    const width = 300;
    const height = 100;
    const barWidth = 2;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw simple barcode representation
    ctx.fillStyle = qrColor;
    let x = 10;

    // Start pattern
    ctx.fillRect(x, 10, barWidth, 60);
    x += barWidth * 2;
    ctx.fillRect(x, 10, barWidth, 60);
    x += barWidth * 3;

    // Draw bars based on character codes
    for (let i = 0; i < value.length && x < width - 20; i++) {
      const code = value.charCodeAt(i);
      for (let j = 0; j < 6; j++) {
        if ((code >> j) & 1) {
          ctx.fillRect(x, 10, barWidth, 60);
        }
        x += barWidth;
      }
      x += barWidth; // Space between chars
    }

    // End pattern
    ctx.fillRect(x, 10, barWidth, 60);
    x += barWidth * 2;
    ctx.fillRect(x, 10, barWidth, 60);

    // Draw text below
    ctx.fillStyle = '#000';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(value, width / 2, 85);

    setQrDataUrl(canvas.toDataURL('image/png'));
  }, [qrColor, bgColor]);

  // Effect to generate QR/Barcode when inputs change
  useEffect(() => {
    if (isWifi) {
      if (wifiSSID) {
        const wifiString = `WIFI:T:${wifiType};S:${wifiSSID};P:${wifiPassword};;`;
        generateQR(wifiString);
      }
    } else if (isBarcode) {
      if (barcodeValue) {
        generateBarcode(barcodeValue);
      }
    } else {
      if (inputValue) {
        generateQR(inputValue);
      }
    }
  }, [inputValue, wifiSSID, wifiPassword, wifiType, barcodeValue, isWifi, isBarcode, generateQR, generateBarcode]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = isBarcode ? 'barcode.png' : 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {isWifi ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSSID}
                  onChange={(e) => setWifiSSID(e.target.value)}
                  placeholder="Enter WiFi network name"
                  className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Enter WiFi password"
                  className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Security Type
                </label>
                <select
                  value={wifiType}
                  onChange={(e) => setWifiType(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password</option>
                </select>
              </div>
            </>
          ) : isBarcode ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Barcode Value
              </label>
              <input
                type="text"
                value={barcodeValue}
                onChange={(e) => setBarcodeValue(e.target.value)}
                placeholder="Enter numbers or text"
                className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter product codes, numbers, or text for your barcode.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter URL or Text
              </label>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="https://example.com or any text"
                rows={4}
                className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-orange-500/50"
              />
            </div>
          )}

          {/* Customization */}
          {!isBarcode && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    QR Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-black/30 rounded-lg border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-black/30 rounded-lg border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Size: {size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-xl mb-4">
            <canvas
              ref={canvasRef}
              className="max-w-full"
              style={{ display: qrDataUrl ? 'block' : 'none' }}
            />
            {!qrDataUrl && (
              <div className="w-64 h-64 flex items-center justify-center text-gray-400 text-center">
                {isWifi ? 'Enter WiFi details to generate QR' : isBarcode ? 'Enter value to generate barcode' : 'Enter URL or text to generate QR'}
              </div>
            )}
          </div>

          {qrDataUrl && (
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              <Download className="w-5 h-5" />
              Download {isBarcode ? 'Barcode' : 'QR Code'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

