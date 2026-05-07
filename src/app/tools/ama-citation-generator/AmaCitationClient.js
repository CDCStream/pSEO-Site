'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, Plus, X, Edit3, Trash2, Copy, Download, FileDown,
  Globe, BookOpen, FileText, Newspaper, Video, Layers, AlertCircle, Check, Loader2, Hash, Clipboard,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  formatCitation, parseAuthor, formatAuthor,
  toPlain, toHtml, toRtf,
  bibliographyToPlain, bibliographyToHtml, bibliographyToRtf, bibliographyToBibtex,
  buildInTextCitation, validateCitation, todayLongDate,
} from '@/lib/ama/formatter';
import { detectInput } from '@/lib/ama/parsers';

const STORAGE_KEY = 'makersilo.ama.bibliography.v1';
const TYPE_LABEL = {
  webpage: 'Webpage',
  book: 'Book',
  bookChapter: 'Book Chapter',
  journal: 'Journal Article',
  newspaper: 'Newspaper',
  video: 'Online Video',
};
const TYPE_ICON = {
  webpage: Globe,
  book: BookOpen,
  bookChapter: Layers,
  journal: FileText,
  newspaper: Newspaper,
  video: Video,
};

const SOURCE_TYPES = [
  { id: 'webpage', label: 'Webpage', Icon: Globe },
  { id: 'book', label: 'Book', Icon: BookOpen },
  { id: 'journal', label: 'Journal', Icon: FileText },
  { id: 'newspaper', label: 'Newspaper', Icon: Newspaper },
  { id: 'video', label: 'Video', Icon: Video },
  { id: 'bookChapter', label: 'Book Chapter', Icon: Layers },
];

const FIELD_DEFS = {
  webpage: [
    { key: 'authors', label: 'Authors', type: 'authors' },
    { key: 'title', label: 'Page Title', required: true },
    { key: 'websiteName', label: 'Website Name', required: true },
    { key: 'publishedDate', label: 'Published Date', placeholder: 'YYYY-MM-DD or October 5, 2024' },
    { key: 'updatedDate', label: 'Updated Date', placeholder: 'YYYY-MM-DD (optional)' },
    { key: 'accessedDate', label: 'Accessed Date', placeholder: 'auto-fills today if blank' },
    { key: 'url', label: 'URL', required: true, placeholder: 'https://...' },
  ],
  book: [
    { key: 'authors', label: 'Authors', type: 'authors' },
    { key: 'title', label: 'Book Title', required: true },
    { key: 'edition', label: 'Edition', placeholder: '2 or "2nd ed" (leave blank for 1st)' },
    { key: 'publisher', label: 'Publisher', required: true },
    { key: 'year', label: 'Year', required: true, placeholder: '2024' },
  ],
  bookChapter: [
    { key: 'authors', label: 'Chapter Authors', type: 'authors' },
    { key: 'chapterTitle', label: 'Chapter Title', required: true },
    { key: 'editors', label: 'Book Editors', type: 'authors' },
    { key: 'bookTitle', label: 'Book Title', required: true },
    { key: 'edition', label: 'Edition' },
    { key: 'publisher', label: 'Publisher' },
    { key: 'year', label: 'Year', required: true },
    { key: 'pages', label: 'Pages', placeholder: '45-67' },
  ],
  journal: [
    { key: 'authors', label: 'Authors', type: 'authors' },
    { key: 'title', label: 'Article Title', required: true },
    { key: 'journal', label: 'Journal Name', required: true },
    { key: 'journalAbbrev', label: 'Journal Abbreviation', placeholder: 'e.g. JAMA, BMJ, N Engl J Med' },
    { key: 'year', label: 'Year', required: true },
    { key: 'volume', label: 'Volume' },
    { key: 'issue', label: 'Issue' },
    { key: 'pages', label: 'Pages', placeholder: '123-130' },
    { key: 'doi', label: 'DOI', placeholder: '10.1001/jama.2024.0001' },
    { key: 'pmid', label: 'PMID' },
  ],
  newspaper: [
    { key: 'authors', label: 'Authors', type: 'authors' },
    { key: 'title', label: 'Article Title', required: true },
    { key: 'newspaperName', label: 'Newspaper Name', required: true },
    { key: 'publishedDate', label: 'Published Date', required: true, placeholder: 'YYYY-MM-DD' },
    { key: 'section', label: 'Section', placeholder: 'A' },
    { key: 'pageNumber', label: 'Page Number', placeholder: '1' },
    { key: 'url', label: 'URL (if online)' },
    { key: 'accessedDate', label: 'Accessed Date' },
  ],
  video: [
    { key: 'authors', label: 'Authors (optional, channel below)', type: 'authors' },
    { key: 'channelName', label: 'Channel / Producer', required: true },
    { key: 'title', label: 'Video Title', required: true },
    { key: 'platform', label: 'Platform', placeholder: 'YouTube' },
    { key: 'publishedDate', label: 'Published Date' },
    { key: 'accessedDate', label: 'Accessed Date' },
    { key: 'videoUrl', label: 'Video URL', required: true },
  ],
};

function uid() {
  return 'c_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function emptyCitation(type) {
  return {
    id: uid(),
    type,
    authors: [],
    editors: [],
    accessedDate: type === 'webpage' || type === 'video' ? todayLongDate() : '',
  };
}

// ---------------------------------------------------------------------------
// Author input row (used both in form and editors block)
// ---------------------------------------------------------------------------
function AuthorList({ value, onChange, label }) {
  const [draft, setDraft] = useState('');
  const list = value || [];

  const addDraft = () => {
    const a = parseAuthor(draft);
    if (!a) return;
    onChange([...list, a]);
    setDraft('');
  };
  const removeAt = (i) => onChange(list.filter((_, idx) => idx !== i));
  const updateAt = (i, raw) => {
    const a = parseAuthor(raw);
    onChange(list.map((cur, idx) => (idx === i ? a || cur : cur)));
  };

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>
      <div className="space-y-1.5">
        {list.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              defaultValue={formatAuthor(a)}
              onBlur={(e) => updateAt(i, e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm bg-zinc-950/60 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-blue-500/60"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
              aria-label="Remove author"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addDraft();
              }
            }}
            placeholder='e.g. "Smith, John A."  or  "Smith JA"  or  "World Health Organization"'
            className="flex-1 px-3 py-1.5 text-sm bg-zinc-950/60 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60"
          />
          <button
            type="button"
            onClick={addDraft}
            className="px-3 py-1.5 text-sm bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/25 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Manual form
// ---------------------------------------------------------------------------
function CitationForm({ type, value, onChange }) {
  const fields = FIELD_DEFS[type] || [];
  const update = (key, v) => onChange({ ...value, [key]: v });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((f) => {
        if (f.type === 'authors') {
          return (
            <div key={f.key} className="md:col-span-2">
              <AuthorList
                label={f.label + (f.required ? ' *' : '')}
                value={value[f.key] || []}
                onChange={(v) => update(f.key, v)}
              />
            </div>
          );
        }
        const wide = f.key === 'title' || f.key === 'chapterTitle' || f.key === 'bookTitle' || f.key === 'url' || f.key === 'videoUrl';
        return (
          <div key={f.key} className={wide ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              {f.label}
              {f.required ? ' *' : ''}
            </label>
            <input
              type="text"
              value={value[f.key] || ''}
              onChange={(e) => update(f.key, e.target.value)}
              placeholder={f.placeholder || ''}
              className="w-full px-3 py-2 text-sm bg-zinc-950/60 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60"
            />
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live preview of one citation
// ---------------------------------------------------------------------------
function CitationPreview({ citation, number }) {
  const html = useMemo(() => toHtml(formatCitation(citation)), [citation]);
  const warnings = useMemo(() => validateCitation(citation), [citation]);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="text-xs font-medium text-zinc-500 mb-2">PREVIEW (AMA 11th edition)</div>
      <div
        className="text-sm leading-relaxed text-zinc-100"
        style={{ fontFamily: 'Times New Roman, serif' }}
      >
        <span className="text-zinc-500 mr-1">{number || 1}.</span>
        <span dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {warnings.length > 0 && (
        <div className="mt-3 flex items-start gap-2 text-xs text-amber-300/80">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <div>{warnings.join(' ')}</div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function AmaCitationClient() {
  const { addToast } = useToast();

  // Form state
  const [activeType, setActiveType] = useState('webpage');
  const [draft, setDraft] = useState(() => emptyCitation('webpage'));
  const [editingId, setEditingId] = useState(null);

  // Autocite
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchHint, setSearchHint] = useState('');

  // Bibliography
  const [bibliography, setBibliography] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // In-text helper
  const [intextSelection, setIntextSelection] = useState({}); // { citationId: { selected, page } }

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setBibliography(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bibliography));
    } catch {
      // quota exceeded — ignore
    }
  }, [bibliography, hydrated]);

  // Update hint as user types autocite input
  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchHint('');
      return;
    }
    const det = detectInput(searchValue.trim());
    const labels = {
      doi: '✓ Detected: DOI',
      pmid: '✓ Detected: PubMed ID',
      isbn: '✓ Detected: ISBN',
      youtube: '✓ Detected: YouTube video',
      pubmedUrl: '✓ Detected: PubMed URL',
      url: '✓ Detected: Webpage URL',
      unknown: 'Tip: paste a URL, DOI, PMID (e.g. 35123456), or ISBN',
    };
    setSearchHint(labels[det.kind] || '');
  }, [searchValue]);

  const handleTypeChange = (newType) => {
    setActiveType(newType);
    if (!editingId) {
      setDraft(emptyCitation(newType));
    } else {
      setDraft({ ...draft, type: newType });
    }
  };

  const handleAutocite = async () => {
    if (!searchValue.trim()) return;
    setSearchLoading(true);
    try {
      const res = await fetch('/api/citation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: searchValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Lookup failed.', 'error');
        return;
      }
      const fetched = data.citation;
      // Open the matching tab + populate the form, give it a fresh id
      setActiveType(fetched.type || 'webpage');
      setDraft({ ...emptyCitation(fetched.type || 'webpage'), ...fetched, id: uid() });
      setEditingId(null);
      setSearchValue('');
      addToast('Source details retrieved. Review below and add to bibliography.', 'success');
    } catch (e) {
      addToast('Network error while looking up source.', 'error');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddToBibliography = () => {
    const warnings = validateCitation(draft);
    if (warnings.length > 0) {
      addToast(warnings[0], 'error');
      return;
    }
    if (editingId) {
      setBibliography((bib) => bib.map((c) => (c.id === editingId ? { ...draft, id: editingId } : c)));
      setEditingId(null);
      addToast('Citation updated.', 'success');
    } else {
      setBibliography((bib) => [...bib, { ...draft, id: draft.id || uid() }]);
      addToast('Added to bibliography.', 'success');
    }
    setDraft(emptyCitation(activeType));
  };

  const handleEdit = (c) => {
    setActiveType(c.type);
    setDraft({ ...c });
    setEditingId(c.id);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemove = (id) => {
    if (!confirm('Remove this citation from your bibliography?')) return;
    setBibliography((bib) => bib.filter((c) => c.id !== id));
    setIntextSelection((sel) => {
      const next = { ...sel };
      delete next[id];
      return next;
    });
  };

  const handleClearAll = () => {
    if (bibliography.length === 0) return;
    if (!confirm(`Clear all ${bibliography.length} citation(s)? This cannot be undone.`)) return;
    setBibliography([]);
    setIntextSelection({});
  };

  const handleCopyOne = async (c, i) => {
    try {
      await navigator.clipboard.writeText(`${i + 1}. ${toPlain(formatCitation(c))}`);
      addToast('Citation copied.', 'success');
    } catch {
      addToast('Could not copy.', 'error');
    }
  };
  const handleCopyAll = async () => {
    if (bibliography.length === 0) return;
    try {
      await navigator.clipboard.writeText(bibliographyToPlain(bibliography));
      addToast('Bibliography copied.', 'success');
    } catch {
      addToast('Could not copy.', 'error');
    }
  };

  const handleDownload = (kind) => {
    if (bibliography.length === 0) return;
    let content, mime, ext;
    if (kind === 'rtf') {
      content = bibliographyToRtf(bibliography);
      mime = 'application/rtf';
      ext = 'rtf';
    } else if (kind === 'bib') {
      content = bibliographyToBibtex(bibliography);
      mime = 'application/x-bibtex';
      ext = 'bib';
    } else if (kind === 'html') {
      content =
        '<!doctype html><html><head><meta charset="utf-8"><title>AMA Bibliography</title></head><body>' +
        bibliographyToHtml(bibliography) +
        '</body></html>';
      mime = 'text/html';
      ext = 'html';
    } else {
      content = bibliographyToPlain(bibliography);
      mime = 'text/plain';
      ext = 'txt';
    }
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ama-bibliography.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Downloaded as .${ext}`, 'success');
  };

  // ---- In-text helper ----
  const intextEntries = useMemo(() => {
    return bibliography
      .map((c, i) => {
        const sel = intextSelection[c.id];
        if (!sel || !sel.selected) return null;
        return { number: i + 1, page: (sel.page || '').trim() };
      })
      .filter(Boolean);
  }, [bibliography, intextSelection]);

  const intextUnicode = useMemo(() => buildInTextCitation(intextEntries, 'unicode'), [intextEntries]);
  const intextPlain = useMemo(() => buildInTextCitation(intextEntries, 'plain'), [intextEntries]);

  const toggleIntext = (id) =>
    setIntextSelection((s) => ({ ...s, [id]: { ...(s[id] || {}), selected: !(s[id]?.selected) } }));
  const setIntextPage = (id, page) =>
    setIntextSelection((s) => ({ ...s, [id]: { ...(s[id] || {}), page } }));

  return (
    <div className="space-y-8">
      {/* ============ Autocite ============ */}
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Autocite — paste anything</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !searchLoading) {
                e.preventDefault();
                handleAutocite();
              }
            }}
            placeholder="Paste URL, DOI (10.1001/...), PMID (35123456), or ISBN (978-0-...)"
            className="flex-1 px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60"
          />
          <button
            type="button"
            onClick={handleAutocite}
            disabled={searchLoading || !searchValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
          >
            {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />}
            {searchLoading ? 'Looking up…' : 'Cite'}
          </button>
        </div>
        {searchHint && (
          <div className="mt-2 text-xs text-zinc-400">{searchHint}</div>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          <span className="text-zinc-500">Try:</span>
          {[
            { label: 'JAMA DOI', value: '10.1001/jama.2024.0001' },
            { label: 'PMID 35123456', value: '35123456' },
            { label: 'NYT URL', value: 'https://www.nytimes.com/' },
            { label: 'YouTube video', value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setSearchValue(s.value)}
              className="px-2 py-1 rounded-md bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* ============ Manual form ============ */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
              {editingId ? 'Edit citation' : 'Or fill in the details'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">Pick a source type, fill what you have, watch the preview update live.</p>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setDraft(emptyCitation(activeType));
              }}
              className="text-xs text-zinc-400 hover:text-zinc-200 underline"
            >
              Cancel edit
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-5 border-b border-zinc-800 pb-3">
          {SOURCE_TYPES.map((t) => {
            const Icon = t.Icon;
            const active = activeType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTypeChange(t.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  active
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <CitationForm type={activeType} value={draft} onChange={setDraft} />

        <div className="mt-5">
          <CitationPreview citation={draft} number={editingId ? bibliography.findIndex((c) => c.id === editingId) + 1 : bibliography.length + 1} />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleAddToBibliography}
            className="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'Save changes' : 'Add to bibliography'}
          </button>
        </div>
      </section>

      {/* ============ Bibliography ============ */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            My Bibliography
            <span className="ml-2 text-xs text-zinc-500 font-normal normal-case">
              {bibliography.length} {bibliography.length === 1 ? 'source' : 'sources'} · saved locally in your browser
            </span>
          </h2>
          {bibliography.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>

        {bibliography.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 p-8 text-center">
            <BookOpen className="w-10 h-10 mx-auto text-zinc-700 mb-2" />
            <p className="text-sm text-zinc-500">
              Your bibliography is empty. Add your first source above to start building a reference list.
            </p>
          </div>
        ) : (
          <ol className="space-y-3" style={{ fontFamily: 'Times New Roman, serif' }}>
            {bibliography.map((c, i) => {
              const Icon = TYPE_ICON[c.type] || Globe;
              return (
                <li key={c.id} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 text-zinc-500 font-mono text-sm">{i + 1}.</div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm leading-relaxed text-zinc-100 break-words"
                        dangerouslySetInnerHTML={{ __html: toHtml(formatCitation(c)) }}
                      />
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-500">
                        <span className="inline-flex items-center gap-1">
                          <Icon className="w-3 h-3" /> {TYPE_LABEL[c.type] || c.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1" style={{ fontFamily: 'inherit' }}>
                      <button
                        type="button"
                        onClick={() => handleCopyOne(c, i)}
                        className="p-1.5 text-zinc-500 hover:text-blue-400 transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(c)}
                        className="p-1.5 text-zinc-500 hover:text-emerald-400 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(c.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {bibliography.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleCopyAll}
              className="px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5" /> Copy all
            </button>
            <button
              type="button"
              onClick={() => handleDownload('rtf')}
              className="px-3 py-2 text-xs bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" /> Download .rtf (Word)
            </button>
            <button
              type="button"
              onClick={() => handleDownload('html')}
              className="px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" /> Download .html
            </button>
            <button
              type="button"
              onClick={() => handleDownload('bib')}
              className="px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" /> Download .bib (BibTeX)
            </button>
            <button
              type="button"
              onClick={() => handleDownload('txt')}
              className="px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download .txt
            </button>
          </div>
        )}
      </section>

      {/* ============ In-text helper ============ */}
      {bibliography.length > 0 && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">In-text citation helper</h2>
          </div>
          <p className="text-xs text-zinc-500 mb-4">
            Pick which sources you&apos;re citing at this moment, optionally add page numbers, and we&apos;ll build the
            superscript exactly the way AMA wants it.
          </p>

          <div className="space-y-2">
            {bibliography.map((c, i) => {
              const sel = intextSelection[c.id] || {};
              return (
                <div key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-950/40 border border-zinc-800">
                  <input
                    type="checkbox"
                    id={`intext-${c.id}`}
                    checked={!!sel.selected}
                    onChange={() => toggleIntext(c.id)}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <label htmlFor={`intext-${c.id}`} className="flex-1 text-xs text-zinc-300 truncate cursor-pointer">
                    <span className="text-zinc-500">{i + 1}.</span>{' '}
                    {(c.title || c.chapterTitle || c.url || 'Untitled').slice(0, 80)}
                  </label>
                  <input
                    type="text"
                    placeholder="page (opt)"
                    value={sel.page || ''}
                    onChange={(e) => setIntextPage(c.id, e.target.value)}
                    disabled={!sel.selected}
                    className="w-24 px-2 py-1 text-xs bg-zinc-950/60 border border-zinc-800 rounded-md text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/60 disabled:opacity-40"
                  />
                </div>
              );
            })}
          </div>

          {intextEntries.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3">
                <div className="text-[11px] uppercase tracking-wider text-cyan-300/70 mb-1">Inline (Unicode superscript)</div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-base text-zinc-100" style={{ fontFamily: 'Times New Roman, serif' }}>
                    The result was significant{intextUnicode}.
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(intextUnicode).then(() => addToast('Copied.', 'success'))}
                    className="p-1.5 text-cyan-300 hover:text-cyan-100 transition-colors"
                    aria-label="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-700/60 bg-zinc-950/40 p-3">
                <div className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1">Plain (for Word superscript)</div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-base text-zinc-100">{intextPlain}</code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(intextPlain).then(() => addToast('Copied.', 'success'))}
                    className="p-1.5 text-zinc-300 hover:text-zinc-100 transition-colors"
                    aria-label="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  In Word: select these characters and apply <kbd className="px-1 bg-zinc-800 rounded">Ctrl+Shift++</kbd>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
