/**
 * AMA citation autocite API.
 *
 * Accepts: POST { kind: 'doi'|'pmid'|'isbn'|'url'|'youtube'|'auto', value: string }
 *
 * Free upstream sources, no API keys required:
 *   - CrossRef        (DOI metadata)              https://api.crossref.org
 *   - NCBI E-utilities (PMID metadata)            https://eutils.ncbi.nlm.nih.gov
 *   - OpenLibrary      (ISBN metadata)            https://openlibrary.org
 *   - YouTube oembed   (video title + channel)    https://www.youtube.com/oembed
 *   - Direct fetch     (webpage <meta>/JSON-LD scrape)
 *
 * Returns a normalized Citation object the UI can drop straight into the form.
 */

import { detectInput, extractYouTubeId } from '@/lib/ama/parsers';
import { parseAuthor } from '@/lib/ama/formatter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UA = 'MakerSiloAMACitationGenerator/1.0 (+https://makersilo.com; mailto:hello@makersilo.com)';
const FETCH_TIMEOUT_MS = 12000;

async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// CrossRef (DOI)
// ---------------------------------------------------------------------------

async function fetchByDoi(doi) {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  const res = await fetchWithTimeout(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`CrossRef returned ${res.status}`);
  const json = await res.json();
  const m = json && json.message;
  if (!m) throw new Error('CrossRef returned no message');

  const authors = (m.author || []).map((a) =>
    a.family || a.given
      ? { family: a.family || '', given: a.given || '' }
      : a.name
      ? { family: a.name, given: '', literal: a.name }
      : null
  ).filter(Boolean);

  const title = Array.isArray(m.title) ? m.title[0] : m.title;
  const container = Array.isArray(m['container-title']) ? m['container-title'][0] : m['container-title'];
  const containerShort = Array.isArray(m['short-container-title']) ? m['short-container-title'][0] : m['short-container-title'];

  const dateParts =
    (m.issued && m.issued['date-parts'] && m.issued['date-parts'][0]) ||
    (m.published && m.published['date-parts'] && m.published['date-parts'][0]) ||
    (m['published-print'] && m['published-print']['date-parts'] && m['published-print']['date-parts'][0]) ||
    (m['published-online'] && m['published-online']['date-parts'] && m['published-online']['date-parts'][0]) ||
    [];

  const year = dateParts[0] ? String(dateParts[0]) : '';

  // Decide source type from CrossRef "type" field
  const type = m.type || 'journal-article';
  const isBook = type.includes('book') && !type.includes('chapter');
  const isChapter = type.includes('chapter');

  if (isChapter) {
    return {
      type: 'bookChapter',
      authors,
      chapterTitle: title || '',
      bookTitle: container || '',
      editors: (m.editor || []).map((e) => ({ family: e.family || '', given: e.given || '' })),
      publisher: m.publisher || '',
      year,
      pages: m.page || '',
      doi: m.DOI || doi,
    };
  }
  if (isBook) {
    return {
      type: 'book',
      authors,
      title: title || '',
      publisher: m.publisher || '',
      edition: m.edition || m['edition-number'] || '',
      year,
      doi: m.DOI || doi,
    };
  }
  return {
    type: 'journal',
    authors,
    title: title || '',
    journal: container || '',
    journalAbbrev: containerShort || '',
    year,
    volume: m.volume || '',
    issue: m.issue || '',
    pages: m.page || '',
    doi: m.DOI || doi,
  };
}

// ---------------------------------------------------------------------------
// NCBI E-utilities (PMID)
// ---------------------------------------------------------------------------

async function fetchByPmid(pmid) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&retmode=json`;
  const res = await fetchWithTimeout(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`NCBI returned ${res.status}`);
  const json = await res.json();
  const result = json && json.result;
  const doc = result && result[String(pmid)];
  if (!doc) throw new Error('PMID not found');

  const authors = (doc.authors || [])
    .filter((a) => a.authtype === 'Author')
    .map((a) => parseAuthor(a.name));

  // Try to fetch DOI from articleids
  let doi = '';
  if (Array.isArray(doc.articleids)) {
    const d = doc.articleids.find((x) => x.idtype === 'doi');
    if (d) doi = d.value;
  }

  // Year from epubdate or pubdate
  const year = (doc.pubdate || doc.epubdate || '').match(/(\d{4})/)?.[1] || '';

  return {
    type: 'journal',
    authors,
    title: doc.title || '',
    journal: doc.fulljournalname || '',
    journalAbbrev: doc.source || '',
    year,
    volume: doc.volume || '',
    issue: doc.issue || '',
    pages: doc.pages || '',
    doi,
    pmid: String(pmid),
  };
}

// ---------------------------------------------------------------------------
// OpenLibrary (ISBN)
// ---------------------------------------------------------------------------

async function fetchByIsbn(isbn) {
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${encodeURIComponent(isbn)}&format=json&jscmd=data`;
  const res = await fetchWithTimeout(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`OpenLibrary returned ${res.status}`);
  const json = await res.json();
  const book = json[`ISBN:${isbn}`];
  if (!book) throw new Error('ISBN not found in OpenLibrary');

  const authors = (book.authors || []).map((a) => parseAuthor(a.name));
  const year = (book.publish_date || '').match(/(\d{4})/)?.[1] || '';

  return {
    type: 'book',
    authors,
    title: book.title + (book.subtitle ? `: ${book.subtitle}` : ''),
    publisher: (book.publishers && book.publishers[0] && book.publishers[0].name) || '',
    edition: '',
    year,
    isbn,
  };
}

// ---------------------------------------------------------------------------
// YouTube (oembed)
// ---------------------------------------------------------------------------

async function fetchYouTube(url) {
  const id = extractYouTubeId(url);
  const canonical = id ? `https://www.youtube.com/watch?v=${id}` : url;
  const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonical)}&format=json`;
  const res = await fetchWithTimeout(oembed, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`YouTube oembed returned ${res.status}`);
  const json = await res.json();

  // oembed gives no published date — try the watch page <meta itemprop="datePublished">
  let published = '';
  try {
    const pageRes = await fetchWithTimeout(canonical, { headers: { 'User-Agent': UA } });
    if (pageRes.ok) {
      const html = await pageRes.text();
      const dp = html.match(/itemprop="datePublished"[^>]*content="([^"]+)"/i) ||
        html.match(/"datePublished"\s*:\s*"([^"]+)"/);
      if (dp) published = dp[1];
    }
  } catch {
    /* non-fatal — oembed alone is enough */
  }

  return {
    type: 'video',
    channelName: json.author_name || '',
    title: json.title || '',
    platform: 'YouTube',
    publishedDate: published,
    accessedDate: '',
    videoUrl: canonical,
  };
}

// ---------------------------------------------------------------------------
// Webpage scrape (Open Graph / Schema.org / <meta>)
// ---------------------------------------------------------------------------

function decodeEntities(s) {
  if (!s) return '';
  return String(s)
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function metaContent(html, attrs) {
  // attrs: array of [attrName, attrValue] pairs to try in order
  for (const [name, value] of attrs) {
    const re = new RegExp(
      `<meta[^>]*\\b${name}\\s*=\\s*['"]${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][^>]*>`,
      'i'
    );
    const tag = html.match(re);
    if (tag) {
      const c = tag[0].match(/content\s*=\s*['"]([^'"]+)['"]/i);
      if (c) return decodeEntities(c[1]);
    }
  }
  return '';
}

function extractJsonLdAuthors(html) {
  // Try to find JSON-LD blocks; keep it simple — best effort
  const blocks = [...html.matchAll(/<script[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const m of blocks) {
    try {
      const parsed = JSON.parse(m[1].trim());
      const objs = Array.isArray(parsed) ? parsed : [parsed];
      for (const obj of objs) {
        const candidates = [obj, ...(obj['@graph'] || [])];
        for (const c of candidates) {
          if (!c || typeof c !== 'object') continue;
          const a = c.author;
          if (!a) continue;
          const list = Array.isArray(a) ? a : [a];
          const out = list
            .map((x) => (typeof x === 'string' ? parseAuthor(x) : x.name ? parseAuthor(x.name) : null))
            .filter(Boolean);
          if (out.length) return out;
        }
      }
    } catch {
      /* ignore parse errors, move on */
    }
  }
  return [];
}

async function fetchWebpage(url) {
  const res = await fetchWithTimeout(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`Webpage fetch returned ${res.status}`);
  const html = await res.text();

  const ogTitle = metaContent(html, [['property', 'og:title']]);
  const twTitle = metaContent(html, [['name', 'twitter:title']]);
  const titleTag = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const title = decodeEntities(ogTitle || twTitle || (titleTag ? titleTag.trim() : ''));

  const siteName = decodeEntities(
    metaContent(html, [['property', 'og:site_name']]) ||
      metaContent(html, [['name', 'application-name']]) ||
      new URL(url).hostname.replace(/^www\./, '')
  );

  const description = metaContent(html, [['property', 'og:description'], ['name', 'description']]);

  const author = metaContent(html, [
    ['name', 'author'],
    ['property', 'article:author'],
    ['name', 'article:author'],
    ['property', 'og:article:author'],
  ]);

  const published =
    metaContent(html, [
      ['property', 'article:published_time'],
      ['name', 'article:published_time'],
      ['name', 'pubdate'],
      ['name', 'date'],
      ['property', 'og:published_time'],
      ['name', 'DC.date.issued'],
      ['itemprop', 'datePublished'],
    ]) || '';

  const updated = metaContent(html, [
    ['property', 'article:modified_time'],
    ['name', 'article:modified_time'],
    ['itemprop', 'dateModified'],
  ]);

  const ogType = metaContent(html, [['property', 'og:type']]).toLowerCase();
  let detected = 'webpage';
  if (ogType.includes('news') || /newspaper|news\./i.test(url)) detected = 'newspaper';

  // Authors: prefer JSON-LD list (handles multiple), fall back to meta tag
  let authors = extractJsonLdAuthors(html);
  if (authors.length === 0 && author) {
    authors = author
      .split(/[,;]| and /i)
      .map((s) => parseAuthor(s.trim()))
      .filter(Boolean);
  }

  if (detected === 'newspaper') {
    return {
      type: 'newspaper',
      authors,
      title,
      newspaperName: siteName,
      publishedDate: published,
      accessedDate: '',
      url,
    };
  }

  return {
    type: 'webpage',
    authors,
    title,
    websiteName: siteName,
    publishedDate: published,
    updatedDate: updated,
    accessedDate: '',
    url,
    description,
  };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { value } = body || {};
  let kind = body?.kind;
  if (!value || typeof value !== 'string') {
    return Response.json({ error: 'value is required' }, { status: 400 });
  }

  // If caller didn't specify kind, detect it
  let normalized = value.trim();
  if (!kind || kind === 'auto') {
    const det = detectInput(normalized);
    kind = det.kind;
    normalized = det.normalized;
  }

  try {
    let citation;
    switch (kind) {
      case 'doi':
        citation = await fetchByDoi(normalized);
        break;
      case 'pmid':
        citation = await fetchByPmid(normalized);
        break;
      case 'isbn':
        citation = await fetchByIsbn(normalized);
        break;
      case 'youtube':
        citation = await fetchYouTube(normalized);
        break;
      case 'pubmedUrl':
        citation = await fetchByPmid(normalized);
        break;
      case 'url':
        citation = await fetchWebpage(normalized);
        break;
      default:
        return Response.json(
          { error: 'Could not detect a DOI, PMID, ISBN, or URL in the input.' },
          { status: 400 }
        );
    }
    return Response.json({ citation, kind });
  } catch (err) {
    console.error('Citation API error', kind, err?.message);
    return Response.json(
      {
        error:
          err?.name === 'AbortError'
            ? 'Upstream request timed out.'
            : err?.message || 'Lookup failed.',
        kind,
      },
      { status: 502 }
    );
  }
}
