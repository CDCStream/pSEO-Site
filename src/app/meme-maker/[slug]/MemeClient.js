'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/Toast';

const memeTemplates = {
  drake: {
    width: 1200,
    height: 1200,
    image: '/memes/drake-template.jpg',
    textFields: [
      { id: 'top', label: 'Top Text (Reject)', x: 900, y: 300, maxWidth: 550 },
      { id: 'bottom', label: 'Bottom Text (Accept)', x: 900, y: 900, maxWidth: 550 },
    ],
  },
  speechBubble: {
    width: 800,
    height: 600,
    hasBubbleSettings: true,
    textFields: [
      { id: 'bubble', label: 'Speech Bubble Text', x: 400, y: 200, maxWidth: 350 },
    ],
  },
  bernie: {
    width: 672,
    height: 500,
    image: '/memes/bernie-template.jpg',
    textFields: [
      { id: 'caption', label: 'Caption', x: 336, y: 460, maxWidth: 620 },
    ],
  },
  changeMyMind: {
    width: 577,
    height: 432,
    image: '/memes/change-my-mind-template.png',
    textFields: [
      { id: 'sign', label: 'Sign Text', x: 360, y: 300, maxWidth: 220, rotation: -6 },
    ],
  },
};

// Bubble style configurations
const bubbleStyles = [
  { id: 'rounded', label: 'Rounded Bubble' },
  { id: 'rectangle', label: 'Rectangle Bubble' },
  { id: 'bruh', label: 'Bruh Bubble' },
];

const tailPositions = [
  { id: 'tail-left', label: 'Tail Left', big: false, position: 'left' },
  { id: 'tail-center', label: 'Tail Center', big: false, position: 'center' },
  { id: 'tail-right', label: 'Tail Right', big: false, position: 'right' },
  { id: 'big-tail-left', label: 'Big Tail Left', big: true, position: 'left' },
  { id: 'big-tail-center', label: 'Big Tail Center', big: true, position: 'center' },
  { id: 'big-tail-right', label: 'Big Tail Right', big: true, position: 'right' },
];

export default function MemeClient({ config, slug }) {
  const canvasRef = useRef(null);
  const [texts, setTexts] = useState({});
  const [templateImage, setTemplateImage] = useState(null);
  const { addToast } = useToast();

  // Speech Bubble settings
  const [bubbleStyle, setBubbleStyle] = useState('rounded');
  const [tailPosition, setTailPosition] = useState('tail-left');
  const [bottomBubble, setBottomBubble] = useState(false);
  const [topAndBottom, setTopAndBottom] = useState(false);

  const templateKey = config.templateType;
  const template = memeTemplates[templateKey] || memeTemplates.drake;
  const isSpeechBubble = templateKey === 'speechBubble';

  // Load template image
  useEffect(() => {
    if (template.image) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setTemplateImage(img);
      img.onerror = () => setTemplateImage(null);
      img.src = template.image;
    }
  }, [template.image]);

  // Draw speech bubble
  const drawBubble = useCallback((ctx, x, y, width, height, style, tail) => {
    const tailConfig = tailPositions.find(t => t.id === tail) || tailPositions[0];
    const tailHeight = tailConfig.big ? 60 : 30;
    const tailWidth = tailConfig.big ? 80 : 40;

    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;

    const radius = style === 'rounded' ? 30 : (style === 'bruh' ? 50 : 0);

    // Draw bubble body
    if (style === 'rounded' || style === 'bruh') {
      // Rounded rectangle
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    } else {
      // Rectangle
      ctx.rect(x, y, width, height);
    }
    ctx.fill();
    ctx.stroke();

    // Draw tail
    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF';

    let tailX;
    if (tailConfig.position === 'left') {
      tailX = x + width * 0.2;
    } else if (tailConfig.position === 'center') {
      tailX = x + width * 0.5;
    } else {
      tailX = x + width * 0.8;
    }

    const tailY = y + height;

    ctx.moveTo(tailX - tailWidth / 2, tailY - 2);
    ctx.lineTo(tailX, tailY + tailHeight);
    ctx.lineTo(tailX + tailWidth / 2, tailY - 2);
    ctx.fill();

    // Tail outline
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.moveTo(tailX - tailWidth / 2, tailY);
    ctx.lineTo(tailX, tailY + tailHeight);
    ctx.lineTo(tailX + tailWidth / 2, tailY);
    ctx.stroke();

  }, []);

  // Draw meme function
  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = template.width;
    canvas.height = template.height;

    // Draw background
    const isBernie = templateKey === 'bernie';

    if (templateImage) {
      ctx.drawImage(templateImage, 0, 0, template.width, template.height);
    } else if (isSpeechBubble) {
      // Light purple gradient for speech bubble
      const gradient = ctx.createLinearGradient(0, 0, 0, template.height);
      gradient.addColorStop(0, '#E8E0F0');
      gradient.addColorStop(1, '#D8D0E8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, template.width, template.height);

      // Draw speech bubble(s)
      const bubbleWidth = 450;
      const bubbleHeight = 180;
      const bubbleX = (template.width - bubbleWidth) / 2;

      if (topAndBottom) {
        // Top bubble
        drawBubble(ctx, bubbleX, 50, bubbleWidth, bubbleHeight, bubbleStyle, tailPosition);
        // Bottom bubble
        drawBubble(ctx, bubbleX, template.height - bubbleHeight - 120, bubbleWidth, bubbleHeight, bubbleStyle, tailPosition);
      } else if (bottomBubble) {
        // Bottom bubble only
        drawBubble(ctx, bubbleX, template.height - bubbleHeight - 120, bubbleWidth, bubbleHeight, bubbleStyle, tailPosition);
      } else {
        // Top bubble only (default)
        drawBubble(ctx, bubbleX, 80, bubbleWidth, bubbleHeight, bubbleStyle, tailPosition);
      }
    } else {
      // Fallback gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, template.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, template.width, template.height);

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Loading template...', template.width / 2, template.height / 2);
    }

    // Helper function to draw wrapped text
    const drawWrappedText = (text, x, y, maxWidth, fontSize, rotation = 0) => {
      const lineHeight = fontSize * 1.3;

      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = [];
      const words = text.split(' ');

      for (const word of words) {
        if (ctx.measureText(word).width > maxWidth) {
          let charLine = '';
          for (const char of word) {
            const testChar = charLine + char;
            if (ctx.measureText(testChar).width > maxWidth && charLine !== '') {
              lines.push(charLine);
              charLine = char;
            } else {
              charLine = testChar;
            }
          }
          if (charLine) {
            if (lines.length > 0 || words.indexOf(word) === 0) {
              lines.push(charLine);
            }
          }
        } else {
          const lastLine = lines.length > 0 ? lines[lines.length - 1] : '';
          const testLine = lastLine + (lastLine ? ' ' : '') + word;

          if (ctx.measureText(testLine).width > maxWidth && lastLine !== '') {
            lines.push(word);
          } else {
            if (lines.length > 0) {
              lines[lines.length - 1] = testLine;
            } else {
              lines.push(word);
            }
          }
        }
      }

      const displayLines = lines.slice(0, 5);
      const totalHeight = displayLines.length * lineHeight;
      const startY = -totalHeight / 2 + lineHeight / 2;

      // Apply rotation
      ctx.save();
      ctx.translate(x, y);
      if (rotation) {
        ctx.rotate((rotation * Math.PI) / 180);
      }

      displayLines.forEach((lineText, i) => {
        const lineY = startY + i * lineHeight;

        if (!isSpeechBubble) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.lineJoin = 'round';
          ctx.strokeText(lineText, 0, lineY);
        }

        ctx.fillStyle = '#000000';
        ctx.fillText(lineText, 0, lineY);
      });

      ctx.restore();
    };

    // Draw text for each field
    const fontSize = templateKey === 'drake' ? 48 : (isSpeechBubble ? 28 : 28);

    if (isSpeechBubble) {
      const bubbleText = texts['bubble'] || '';
      if (bubbleText) {
        if (topAndBottom) {
          drawWrappedText(bubbleText, template.width / 2, 160, 400, fontSize);
          drawWrappedText(texts['bubbleBottom'] || bubbleText, template.width / 2, template.height - 150, 400, fontSize);
        } else if (bottomBubble) {
          drawWrappedText(bubbleText, template.width / 2, template.height - 150, 400, fontSize);
        } else {
          drawWrappedText(bubbleText, template.width / 2, 170, 400, fontSize);
        }
      }
    } else {
      template.textFields.forEach(field => {
        const text = texts[field.id] || '';
        if (text) {
          drawWrappedText(text, field.x, field.y, field.maxWidth, fontSize, field.rotation || 0);
        }
      });
    }
  }, [texts, template, templateImage, templateKey, isSpeechBubble, bubbleStyle, tailPosition, bottomBubble, topAndBottom, drawBubble]);

  // Draw when dependencies change
  useEffect(() => {
    drawMeme();
  }, [drawMeme]);

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
      <div className="flex flex-col gap-8">
        {/* Canvas Preview - Full Width */}
        <div className="w-full">
          <div className="bg-black/30 rounded-xl p-6 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="rounded-lg shadow-xl border border-white/10"
              style={{ width: '100%', height: 'auto', maxWidth: '800px' }}
            />
          </div>
        </div>

        {/* Speech Bubble Advanced Settings */}
        {isSpeechBubble && (
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 text-gray-800">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Bubble Advanced Settings</h3>

            {/* Bubble Style Selection */}
            <div className="flex flex-wrap gap-3 mb-6">
              {bubbleStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setBubbleStyle(style.id)}
                  className={`px-5 py-2.5 rounded-full font-bold text-base transition-all ${
                    bubbleStyle === style.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white text-gray-900 border-2 border-purple-400 hover:border-purple-600'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            {/* Tail Position Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {tailPositions.map(tail => (
                <button
                  key={tail.id}
                  onClick={() => setTailPosition(tail.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    tailPosition === tail.id
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-700 mb-2">{tail.label}</div>
                  {/* Tail Preview SVG */}
                  <svg viewBox="0 0 100 60" className="w-full h-12">
                    {/* Bubble shape */}
                    {bubbleStyle === 'rounded' ? (
                      <rect x="5" y="5" width="90" height="35" rx="10" fill="white" stroke="black" strokeWidth="2" />
                    ) : bubbleStyle === 'bruh' ? (
                      <rect x="5" y="5" width="90" height="35" rx="15" fill="white" stroke="black" strokeWidth="2" />
                    ) : (
                      <rect x="5" y="5" width="90" height="35" fill="white" stroke="black" strokeWidth="2" />
                    )}
                    {/* Tail */}
                    <polygon
                      points={
                        tail.position === 'left'
                          ? `20,40 ${tail.big ? '10,55' : '15,50'} 30,40`
                          : tail.position === 'center'
                          ? `45,40 ${tail.big ? '50,55' : '50,50'} 55,40`
                          : `70,40 ${tail.big ? '90,55' : '85,50'} 80,40`
                      }
                      fill="white"
                      stroke="black"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              ))}
            </div>

            {/* Toggle Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => { setBottomBubble(!bottomBubble); setTopAndBottom(false); }}
                  className={`w-12 h-6 rounded-full transition-all ${bottomBubble ? 'bg-purple-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform mt-0.5 ${bottomBubble ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`} />
                </div>
                <span className="font-medium">Bottom Speech Bubble</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => { setTopAndBottom(!topAndBottom); setBottomBubble(false); }}
                  className={`w-12 h-6 rounded-full transition-all ${topAndBottom ? 'bg-purple-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform mt-0.5 ${topAndBottom ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`} />
                </div>
                <span className="font-medium">Top & Bottom Speech Bubble</span>
              </label>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Customize Your Meme</h3>

          {isSpeechBubble ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {topAndBottom ? 'Top Bubble Text' : 'Speech Bubble Text'}
                </label>
                <textarea
                  value={texts['bubble'] || ''}
                  onChange={(e) => handleTextChange('bubble', e.target.value)}
                  placeholder="Enter your text..."
                  className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                  rows={2}
                />
              </div>
              {topAndBottom && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bottom Bubble Text
                  </label>
                  <textarea
                    value={texts['bubbleBottom'] || ''}
                    onChange={(e) => handleTextChange('bubbleBottom', e.target.value)}
                    placeholder="Enter bottom bubble text..."
                    className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                    rows={2}
                  />
                </div>
              )}
            </>
          ) : (
            template.textFields.map(field => (
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
            ))
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleDownload}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Create Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
