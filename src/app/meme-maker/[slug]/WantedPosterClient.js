'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/components/Toast';

const TEXT_FIELDS = [
  { id: 'name', label: 'Name', placeholder: 'e.g. John Doe', required: true },
  { id: 'crime', label: 'Crime / Reason', placeholder: 'e.g. Stealing all the pizza' },
  { id: 'alias', label: 'A.K.A. (Nickname)', placeholder: 'e.g. The Snack Bandit' },
  { id: 'reward', label: 'Reward', placeholder: 'e.g. $10,000 Dead or Alive' },
  { id: 'lastSeen', label: 'Last Seen', placeholder: 'e.g. Raiding the fridge at 3AM' },
];

export default function WantedPosterClient() {
  const [fields, setFields] = useState({ name: '', crime: '', alias: '', reward: '', lastSeen: '' });
  const [photo, setPhoto] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!fields.name.trim()) {
      addToast('Please enter a name first', 'error');
      return;
    }
    setLoading(true);
    setGeneratedImage(null);
    try {
      const res = await fetch('/api/wanted-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, photo }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Generation failed');
      }
      setGeneratedImage(data.image);
      addToast('Wanted poster generated!', 'success');
    } catch (err) {
      addToast(err.message || 'Generation failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.download = `wanted-poster-${fields.name || 'custom'}.png`;
    link.href = generatedImage;
    link.click();
    addToast('Wanted poster downloaded!', 'success');
  };

  const handleClear = () => {
    setFields({ name: '', crime: '', alias: '', reward: '', lastSeen: '' });
    setPhoto(null);
    setGeneratedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Customize Your Poster</h3>

          {TEXT_FIELDS.map(f => (
            <div key={f.id}>
              <label className="text-xs text-gray-400 font-medium mb-1 block">
                {f.label} {f.required && <span className="text-red-400">*</span>}
              </label>
              <input
                type="text"
                value={fields[f.id]}
                onChange={e => setFields(prev => ({ ...prev, [f.id]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 placeholder-gray-600"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">Photo (Optional)</label>
            <label className="flex items-center justify-center w-full py-3 rounded-lg bg-white/5 border border-dashed border-white/20 text-gray-400 text-sm cursor-pointer hover:border-amber-500/50 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              {photo ? 'Change Photo' : 'Upload Photo'}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {photo && (
              <div className="mt-2 flex items-center gap-2">
                <img src={photo} alt="Uploaded" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                <span className="text-xs text-green-400">Photo ready</span>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75"/></svg>
                Generating Poster...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Generate Wanted Poster
              </>
            )}
          </button>

          {generatedImage && (
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download PNG
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
            {generatedImage ? 'Generated Poster' : 'Template Preview'}
          </h3>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
            {loading ? (
              <div className="aspect-[3/4] flex flex-col items-center justify-center gap-4 text-gray-400">
                <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75"/></svg>
                <p className="text-sm">AI is creating your poster...</p>
                <p className="text-xs text-gray-600">This may take 10-20 seconds</p>
              </div>
            ) : generatedImage ? (
              <img src={generatedImage} alt="Generated Wanted Poster" className="w-full h-auto" />
            ) : (
              <img src="/memes/wanted-poster-templete.png" alt="Wanted Poster Template" className="w-full h-auto opacity-70" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
