'use client';

import { useState, useMemo } from 'react';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

function extractFromHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const h1 = div.querySelector('h1');
  const img = div.querySelector('img');
  const p = div.querySelector('p');
  return {
    title: h1?.textContent?.trim() || '',
    image: img?.getAttribute('src') || '',
    description: p?.textContent?.trim().slice(0, 300) || '',
  };
}

export default function AdminBlogNew() {
  const [tab, setTab] = useState('editor');
  const [html, setHtml] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [image, setImage] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [status, setStatus] = useState('published');
  const [secret, setSecret] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleHTMLChange = (val) => {
    setHtml(val);
    if (val.length > 50) {
      const ext = extractFromHTML(val);
      if (ext.title && !title) { setTitle(ext.title); setSlug(slugify(ext.title)); }
      if (ext.image && !image) setImage(ext.image);
      if (ext.description && !description) setDescription(ext.description);
    }
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!slug || slug === slugify(title)) setSlug(slugify(val));
  };

  const preview = useMemo(() => html, [html]);

  const save = async () => {
    if (!secret) { setMsg({ type: 'error', text: 'Admin secret is required.' }); return; }
    if (!title || !html) { setMsg({ type: 'error', text: 'Title and content are required.' }); return; }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/blog/save/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({
          slug: slug || slugify(title),
          title,
          description,
          content: html,
          author,
          image,
          tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setMsg({ type: 'success', text: `Post saved! Slug: ${data.slug}` });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50';
  const labelCls = 'text-xs text-gray-400 font-medium mb-1 block';

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">New Blog Post</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {['editor', 'preview'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
            {t === 'editor' ? 'Editor' : 'Preview'}
          </button>
        ))}
      </div>

      {tab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* HTML textarea */}
          <div className="lg:col-span-2">
            <label className={labelCls}>HTML Content</label>
            <textarea
              value={html}
              onChange={e => handleHTMLChange(e.target.value)}
              placeholder="Paste your HTML content here..."
              className={`${inputCls} h-[500px] font-mono text-xs`}
            />
          </div>

          {/* Meta fields */}
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Admin Secret</label>
              <input type="password" value={secret} onChange={e => setSecret(e.target.value)} className={inputCls} placeholder="Your admin secret" />
            </div>
            <div>
              <label className={labelCls}>Title</label>
              <input value={title} onChange={e => handleTitleChange(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputCls} h-20`} />
            </div>
            <div>
              <label className={labelCls}>Author</label>
              <select value={author} onChange={e => setAuthor(e.target.value)} className={inputCls}>
                <option value="Admin">Admin</option>
                <option value="MakerSilo">MakerSilo</option>
                <option value="Guest">Guest</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Featured Image URL</label>
              <input value={image} onChange={e => setImage(e.target.value)} className={inputCls} placeholder="https://..." />
              {image && <img src={image} alt="preview" className="mt-2 rounded-lg max-h-32 object-cover" />}
            </div>
            <div>
              <label className={labelCls}>Tags (comma separated)</label>
              <input value={tagsStr} onChange={e => setTagsStr(e.target.value)} className={inputCls} placeholder="seo, tools, tutorial" />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <button
              onClick={save}
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
            >
              {saving ? 'Saving...' : 'Save Post'}
            </button>

            {msg && (
              <div className={`p-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {msg.text}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-10">
          {image && <img src={image} alt={title} className="w-full aspect-video object-cover rounded-xl mb-6" />}
          <h1 className="text-3xl font-bold text-white mb-2">{title || 'Untitled'}</h1>
          {description && <p className="text-gray-400 mb-6">{description}</p>}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: preview }} />
        </div>
      )}
    </div>
  );
}
