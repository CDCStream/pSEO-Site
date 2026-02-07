'use client';

import { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, Download, Image as ImageIcon } from 'lucide-react';

const DEFAULT_TIERS = [
  { id: 'S', label: 'S', color: '#ff7f7f', items: [] },
  { id: 'A', label: 'A', color: '#ffbf7f', items: [] },
  { id: 'B', label: 'B', color: '#ffdf7f', items: [] },
  { id: 'C', label: 'C', color: '#ffff7f', items: [] },
  { id: 'D', label: 'D', color: '#bfff7f', items: [] },
  { id: 'F', label: 'F', color: '#7fbfff', items: [] },
];

export default function TierListClient({ config, slug }) {
  const [tiers, setTiers] = useState(DEFAULT_TIERS);
  const [title, setTitle] = useState('My Tier List');
  const [unranked, setUnranked] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Add text item
  const addTextItem = () => {
    if (!newItemText.trim()) return;
    setUnranked([...unranked, { id: Date.now(), type: 'text', content: newItemText.trim() }]);
    setNewItemText('');
  };

  // Add image item
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUnranked(prev => [...prev, { 
          id: Date.now() + Math.random(), 
          type: 'image', 
          content: event.target.result 
        }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Drag handlers
  const handleDragStart = (item, source) => {
    setDraggedItem(item);
    setDragSource(source);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetTierId) => {
    if (!draggedItem) return;

    // Remove from source
    if (dragSource === 'unranked') {
      setUnranked(prev => prev.filter(i => i.id !== draggedItem.id));
    } else {
      setTiers(prev => prev.map(tier => ({
        ...tier,
        items: tier.items.filter(i => i.id !== draggedItem.id)
      })));
    }

    // Add to target
    if (targetTierId === 'unranked') {
      setUnranked(prev => [...prev, draggedItem]);
    } else {
      setTiers(prev => prev.map(tier => 
        tier.id === targetTierId 
          ? { ...tier, items: [...tier.items, draggedItem] }
          : tier
      ));
    }

    setDraggedItem(null);
    setDragSource(null);
  };

  // Delete item
  const deleteItem = (itemId, source) => {
    if (source === 'unranked') {
      setUnranked(prev => prev.filter(i => i.id !== itemId));
    } else {
      setTiers(prev => prev.map(tier => ({
        ...tier,
        items: tier.items.filter(i => i.id !== itemId)
      })));
    }
  };

  // Download as image
  const downloadTierList = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const tierHeight = 80;
    const labelWidth = 80;
    const itemSize = 70;
    const padding = 5;
    
    // Calculate canvas size
    const maxItems = Math.max(...tiers.map(t => t.items.length), 1);
    const width = labelWidth + (maxItems * (itemSize + padding)) + padding + 100;
    const height = (tiers.length * (tierHeight + padding)) + 100;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 40);

    // Draw tiers
    tiers.forEach((tier, index) => {
      const y = 60 + index * (tierHeight + padding);

      // Tier label
      ctx.fillStyle = tier.color;
      ctx.fillRect(padding, y, labelWidth - padding, tierHeight);
      
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tier.label, labelWidth / 2, y + tierHeight / 2);

      // Tier row background
      ctx.fillStyle = '#2a2a3e';
      ctx.fillRect(labelWidth, y, width - labelWidth - padding, tierHeight);

      // Items
      tier.items.forEach((item, itemIndex) => {
        const x = labelWidth + padding + itemIndex * (itemSize + padding);
        
        if (item.type === 'image') {
          // Draw image placeholder
          ctx.fillStyle = '#3a3a4e';
          ctx.fillRect(x, y + padding, itemSize, itemSize);
          ctx.fillStyle = '#888';
          ctx.font = '10px Arial';
          ctx.fillText('IMG', x + itemSize/2, y + itemSize/2);
        } else {
          // Draw text item
          ctx.fillStyle = '#4a4a5e';
          ctx.fillRect(x, y + padding, itemSize, itemSize);
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          const text = item.content.length > 8 ? item.content.slice(0, 8) + '...' : item.content;
          ctx.fillText(text, x + itemSize/2, y + padding + itemSize/2);
        }
      });
    });

    // Download
    const link = document.createElement('a');
    link.download = 'tier-list.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [tiers, title]);

  // Reset
  const resetTierList = () => {
    setTiers(DEFAULT_TIERS);
    setUnranked([]);
    setTitle('My Tier List');
  };

  const ItemCard = ({ item, source }) => (
    <div
      draggable
      onDragStart={() => handleDragStart(item, source)}
      className="relative w-16 h-16 bg-gray-700 rounded-lg cursor-move flex items-center justify-center overflow-hidden group border-2 border-transparent hover:border-orange-500 transition-all"
    >
      {item.type === 'image' ? (
        <img src={item.content} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs text-white text-center p-1 break-words">{item.content}</span>
      )}
      <button
        onClick={() => deleteItem(item.id, source)}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center text-white text-xs hidden group-hover:flex"
      >
        ×
      </button>
    </div>
  );

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      {/* Title Input */}
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold bg-transparent text-white text-center border-b-2 border-white/20 pb-2 focus:outline-none focus:border-orange-500"
          placeholder="Tier List Title"
        />
      </div>

      {/* Tier List */}
      <div className="space-y-2 mb-6">
        {tiers.map(tier => (
          <div key={tier.id} className="flex">
            {/* Tier Label */}
            <div 
              className="w-16 h-16 flex items-center justify-center text-2xl font-bold text-black shrink-0 rounded-l-lg"
              style={{ backgroundColor: tier.color }}
            >
              {tier.label}
            </div>
            
            {/* Tier Items */}
            <div
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(tier.id)}
              className="flex-1 min-h-[64px] bg-gray-800/50 rounded-r-lg p-2 flex flex-wrap gap-2 items-start"
            >
              {tier.items.map(item => (
                <ItemCard key={item.id} item={item} source={tier.id} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Unranked Pool */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Unranked Items (drag to tier)</h3>
        <div
          onDragOver={handleDragOver}
          onDrop={() => handleDrop('unranked')}
          className="min-h-[80px] bg-gray-800/30 rounded-lg p-3 flex flex-wrap gap-2"
        >
          {unranked.map(item => (
            <ItemCard key={item.id} item={item} source="unranked" />
          ))}
          {unranked.length === 0 && (
            <p className="text-gray-500 text-sm">Add items below and drag them to tiers</p>
          )}
        </div>
      </div>

      {/* Add Items */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTextItem()}
            placeholder="Add text item..."
            className="flex-1 px-4 py-2 bg-black/30 rounded-lg border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500/50"
          />
          <button
            onClick={addTextItem}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <ImageIcon className="w-5 h-5" />
            Add Images
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={downloadTierList}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
        >
          <Download className="w-5 h-5" />
          Download as Image
        </button>
        <button
          onClick={resetTierList}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

