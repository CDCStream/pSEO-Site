'use client';

import { useState, useRef, useCallback } from 'react';

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
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState('');
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

  // Edit item
  const startEditItem = (item, source) => {
    if (item.type !== 'text') return;
    setEditingItem({ item, source });
    setEditText(item.content);
  };

  const saveEditItem = () => {
    if (!editingItem || !editText.trim()) {
      setEditingItem(null);
      return;
    }

    const updateItem = (items) => items.map(i => 
      i.id === editingItem.item.id ? { ...i, content: editText.trim() } : i
    );

    if (editingItem.source === 'unranked') {
      setUnranked(updateItem);
    } else {
      setTiers(prev => prev.map(tier =>
        tier.id === editingItem.source
          ? { ...tier, items: updateItem(tier.items) }
          : tier
      ));
    }

    setEditingItem(null);
    setEditText('');
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
          ctx.fillStyle = '#3a3a4e';
          ctx.fillRect(x, y + padding, itemSize, itemSize);
          ctx.fillStyle = '#888';
          ctx.font = '10px Arial';
          ctx.fillText('IMG', x + itemSize/2, y + itemSize/2);
        } else {
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
      onDoubleClick={() => startEditItem(item, source)}
      className="relative w-16 h-16 bg-gray-700 rounded-lg cursor-move flex items-center justify-center overflow-hidden group border-2 border-transparent hover:border-orange-500 transition-all"
      title={item.type === 'text' ? 'Double-click to edit' : ''}
    >
      {item.type === 'image' ? (
        <img src={item.content} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs text-white text-center p-1 break-words">{item.content}</span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); deleteItem(item.id, source); }}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center text-white text-xs hidden group-hover:flex"
      >
        ×
      </button>
    </div>
  );

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Edit Item</h3>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveEditItem()}
              className="w-full px-4 py-3 bg-black/30 rounded-lg border border-white/10 text-white focus:outline-none focus:border-orange-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={saveEditItem}
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Items First */}
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Add Images
          </button>
        </div>
      </div>

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
            <p className="text-gray-500 text-sm">Add items below and drag them to tiers (double-click text items to edit)</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={downloadTierList}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download as Image
        </button>
        <button
          onClick={resetTierList}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Reset
        </button>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
