'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/Toast';

const memeTemplates = {
  drake: {
    width: 600,
    height: 600,
    textFields: [
      { id: 'top', label: 'Top Text (Reject)', x: 350, y: 150, maxWidth: 200 },
      { id: 'bottom', label: 'Bottom Text (Accept)', x: 350, y: 450, maxWidth: 200 },
    ],
  },
  speechBubble: {
    width: 600,
    height: 400,
    textFields: [
      { id: 'bubble', label: 'Speech Bubble Text', x: 300, y: 100, maxWidth: 280 },
    ],
  },
  bernie: {
    width: 600,
    height: 400,
    textFields: [
      { id: 'caption', label: 'Caption', x: 300, y: 380, maxWidth: 550 },
    ],
  },
  changeMyMind: {
    width: 600,
    height: 400,
    textFields: [
      { id: 'sign', label: 'Sign Text', x: 400, y: 250, maxWidth: 180 },
    ],
  },
};

export default function MemeClient({ config, slug }) {
  const canvasRef = useRef(null);
  const [texts, setTexts] = useState({});
  const { addToast } = useToast();

  const templateKey = config.templateType;
  const template = memeTemplates[templateKey] || memeTemplates.drake;

  // Draw meme on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = template.width;
    canvas.height = template.height;

    // Draw background
    drawMemeBackground(ctx, templateKey, template);

    // Draw text
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    template.textFields.forEach(field => {
      const text = texts[field.id] || '';
      if (text) {
        wrapText(ctx, text, field.x, field.y, field.maxWidth, 24);
      }
    });
  }, [texts, templateKey, template]);

  const drawMemeBackground = (ctx, type, template) => {
    // Gradient backgrounds for demo - in production, use actual meme images
    const gradients = {
      drake: ['#1a1a2e', '#16213e', '#0f3460'],
      speechBubble: ['#f8f9fa', '#e9ecef', '#dee2e6'],
      bernie: ['#87CEEB', '#98D8C8', '#F7DC6F'],
      changeMyMind: ['#4a90a4', '#5da0b4', '#70b0c4'],
    };

    const colors = gradients[type] || gradients.drake;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, template.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, template.width, template.height);

    // Draw template-specific elements
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (type === 'drake') {
      // Drake template layout
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, template.height / 2);
      ctx.lineTo(template.width, template.height / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(template.width / 2, 0);
      ctx.lineTo(template.width / 2, template.height);
      ctx.stroke();

      // Labels
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '24px Arial';
      ctx.fillText('❌', 75, template.height / 4);
      ctx.fillText('✓', 75, template.height * 3 / 4);
    } else if (type === 'speechBubble') {
      // Speech bubble
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(300, 120, 200, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Bubble tail
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(280, 210);
      ctx.lineTo(240, 280);
      ctx.lineTo(320, 210);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.stroke();
    } else if (type === 'changeMyMind') {
      // Table
      ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
      ctx.fillRect(250, 280, 300, 80);

      // Sign
      ctx.fillStyle = '#fff';
      ctx.fillRect(280, 180, 240, 100);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(280, 180, 240, 100);

      // Chair
      ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
      ctx.fillRect(100, 250, 100, 120);
    } else if (type === 'bernie') {
      // Bernie sitting
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(220, 80, 160, 250);

      // Mittens indicator
      ctx.font = '60px Arial';
      ctx.fillStyle = '#fff';
      ctx.fillText('🧤', 300, 280);
    }

    // Template watermark
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('TextForge.tools', template.width - 10, template.height - 10);
  };

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#000';

    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, x, startY + i * lineHeight);
    });
  };

  const handleTextChange = (fieldId, value) => {
    setTexts(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${slug}-meme.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    addToast('Meme downloaded!', 'success');
  };

  const handleReset = () => {
    setTexts({});
    addToast('Canvas cleared', 'info');
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Canvas Preview */}
        <div className="order-2 lg:order-1">
          <div className="bg-black/30 rounded-xl p-4 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-lg shadow-xl"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="order-1 lg:order-2 space-y-6">
          <h3 className="text-lg font-semibold text-white">Customize Your Meme</h3>

          {template.textFields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label}
              </label>
              <textarea
                value={texts[field.id] || ''}
                onChange={(e) => handleTextChange(field.id, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                rows={2}
              />
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleDownload}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PNG
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


