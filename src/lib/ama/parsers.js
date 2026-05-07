/**
 * Detect what the user pasted into the autocite search bar.
 *
 * Priority (most specific → least):
 *   1. DOI (any form: bare 10.xxxx/yyyy, doi: prefix, or doi.org URL)
 *   2. PMID (PubMed identifier — 1 to 8 digit numeric, optional "PMID:" prefix)
 *   3. ISBN-10 / ISBN-13 (with or without dashes/spaces)
 *   4. YouTube URL (auto-promotes to "video" type)
 *   5. PubMed URL (extract PMID)
 *   6. CrossRef URL containing DOI (extract DOI)
 *   7. Generic HTTP(S) URL → webpage scrape
 */

const DOI_RE = /\b10\.\d{4,9}\/[-._;()/:A-Z0-9a-z]+/i;
const PMID_RE = /\b(?:PMID:?\s*)?(\d{1,9})\b/;
const ISBN_RE = /\b(?:ISBN[\s:]*)?((?:97[89][- ]?)?(?:\d[- ]?){9}[\dXx])\b/;
const YOUTUBE_RE = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\//i;
const PUBMED_URL_RE = /pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i;
const DOI_URL_RE = /(?:https?:\/\/)?(?:dx\.)?doi\.org\/(.+)/i;
const URL_RE = /^https?:\/\//i;

function stripIsbn(raw) {
  return String(raw || '').replace(/[\s-]/g, '');
}

/**
 * Validate ISBN-10 with checksum.
 * Returns true if value computes correctly.
 */
function isValidIsbn10(s) {
  s = stripIsbn(s);
  if (!/^\d{9}[\dXx]$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (i + 1) * parseInt(s[i], 10);
  const check = s[9] === 'X' || s[9] === 'x' ? 10 : parseInt(s[9], 10);
  sum += 10 * check;
  return sum % 11 === 0;
}

function isValidIsbn13(s) {
  s = stripIsbn(s);
  if (!/^\d{13}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) sum += (i % 2 === 0 ? 1 : 3) * parseInt(s[i], 10);
  return sum % 10 === 0;
}

export function isValidIsbn(raw) {
  const s = stripIsbn(raw);
  if (s.length === 10) return isValidIsbn10(s);
  if (s.length === 13) return isValidIsbn13(s);
  return false;
}

/**
 * Decide the source kind of the input string.
 * Returns { kind, value, normalized }.
 *   kind: 'doi' | 'pmid' | 'isbn' | 'youtube' | 'pubmedUrl' | 'url' | 'unknown'
 *   value: original input
 *   normalized: cleaned identifier suitable to pass to upstream APIs
 */
export function detectInput(rawInput) {
  if (!rawInput) return { kind: 'unknown', value: '', normalized: '' };
  const value = String(rawInput).trim();

  // 1. DOI URL → extract bare DOI
  const doiUrlMatch = value.match(DOI_URL_RE);
  if (doiUrlMatch && DOI_RE.test(doiUrlMatch[1])) {
    return { kind: 'doi', value, normalized: doiUrlMatch[1].match(DOI_RE)[0] };
  }

  // 2. Bare DOI (priority over generic URL)
  const doiMatch = value.match(DOI_RE);
  if (doiMatch && !URL_RE.test(value)) {
    return { kind: 'doi', value, normalized: doiMatch[0] };
  }
  // also catch "doi:10..." prefix
  if (/^doi:/i.test(value) && doiMatch) {
    return { kind: 'doi', value, normalized: doiMatch[0] };
  }

  // 3. YouTube URL
  if (YOUTUBE_RE.test(value)) {
    return { kind: 'youtube', value, normalized: value };
  }

  // 4. PubMed URL → extract PMID
  const pmUrl = value.match(PUBMED_URL_RE);
  if (pmUrl) {
    return { kind: 'pmid', value, normalized: pmUrl[1] };
  }

  // 5. Generic HTTP(S) URL
  if (URL_RE.test(value)) {
    // Some other URL might still contain a DOI in the path
    const embeddedDoi = value.match(DOI_RE);
    if (embeddedDoi) {
      return { kind: 'doi', value, normalized: embeddedDoi[0] };
    }
    return { kind: 'url', value, normalized: value };
  }

  // 6. PMID (with explicit "PMID:" prefix or pure numeric, length 1–9)
  if (/^pmid[:\s]/i.test(value)) {
    const pmid = value.match(/(\d+)/);
    if (pmid) return { kind: 'pmid', value, normalized: pmid[1] };
  }

  // 7. ISBN — check before bare PMID since some ISBNs are mostly digits
  const isbnTry = stripIsbn(value);
  if (/^(\d{10}|\d{13}|\d{9}[Xx])$/.test(isbnTry) && isValidIsbn(isbnTry)) {
    return { kind: 'isbn', value, normalized: isbnTry };
  }

  // 8. Bare numeric → guess PMID (1–9 digits, since PubMed PMIDs are < 100M)
  if (/^\d{1,9}$/.test(value)) {
    return { kind: 'pmid', value, normalized: value };
  }

  return { kind: 'unknown', value, normalized: value };
}

/**
 * Pull video ID out of any youtube URL form.
 *   https://youtu.be/ID
 *   https://www.youtube.com/watch?v=ID
 *   https://www.youtube.com/embed/ID
 *   https://m.youtube.com/watch?v=ID
 */
export function extractYouTubeId(url) {
  if (!url) return '';
  const s = String(url);
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/i,
    /[?&]v=([a-zA-Z0-9_-]{6,})/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/i,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return '';
}
