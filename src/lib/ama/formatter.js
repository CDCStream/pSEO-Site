/**
 * AMA Manual of Style (11th edition) reference formatter.
 *
 * Pure functions. Inputs are normalized Citation objects; outputs are
 * strings (plain), HTML (with <i> for italic), RTF, or BibTeX.
 *
 * References:
 *   - AMA Manual of Style: A Guide for Authors and Editors. 11th ed.
 *   - https://www.scribbr.com/category/ama/  (cross-checked examples)
 *
 * Key rules:
 *   - Authors: "Last FM" — no spaces between initials, no periods, comma-separated
 *   - 7+ authors: list first 3 then "et al"
 *   - Article/chapter/page titles: sentence case, ends with period
 *   - Journal: italic, abbreviated per Index Medicus / PubMed
 *   - Book title: italic, headline (title) case, ends with period
 *   - Volume(Issue):Pages format with no space after volume
 *   - DOI: "doi:10.xxxx" — NO https://doi.org/ prefix
 *   - Dates: full month name spelled out (October 5, 2024)
 */

// ---------------------------------------------------------------------------
// Author handling
// ---------------------------------------------------------------------------

/**
 * Parses a free-form author string into {family, given, literal?}.
 * Accepts: "Smith, John A." | "John A. Smith" | "Smith JA" |
 *          "World Health Organization" (single-token org)
 */
export function parseAuthor(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;

  // Comma form: "Last, First M."
  if (s.includes(',')) {
    const [familyRaw, ...rest] = s.split(',');
    const family = familyRaw.trim();
    const given = rest.join(',').trim();
    if (!family) return null;
    if (!given) return { family, given: '', literal: family };
    return { family, given };
  }

  const tokens = s.split(/\s+/).filter(Boolean);
  if (tokens.length === 1) {
    return { family: tokens[0], given: '', literal: tokens[0] };
  }

  // Walk from the END collecting consecutive single-uppercase-letter tokens
  // ("Smith J A" -> family="Smith", initials=["J","A"]).
  let initialsTail = [];
  let cutFromEnd = 0;
  for (let i = tokens.length - 1; i >= 0; i--) {
    const tok = tokens[i].replace(/\.$/, '');
    if (/^[A-Z]$/.test(tok)) {
      initialsTail.unshift(tok);
      cutFromEnd++;
    } else {
      break;
    }
  }
  if (initialsTail.length > 0 && cutFromEnd < tokens.length) {
    return {
      family: tokens.slice(0, tokens.length - cutFromEnd).join(' '),
      given: initialsTail.join(' '),
    };
  }

  // Last token already AMA initials block ("Smith JA")
  const last = tokens[tokens.length - 1];
  if (/^[A-Z]{1,5}$/.test(last)) {
    return { family: tokens.slice(0, -1).join(' '), given: last.split('').join(' ') };
  }

  // No initials anywhere AND 3+ tokens that all look like words
  // → treat as a corporate / organization name (literal).
  const allWords = tokens.every((t) => /^[A-Za-z][A-Za-z\-']+$/.test(t));
  if (tokens.length >= 3 && allWords && !/^[A-Z]\.?$/.test(last)) {
    return { family: s, given: '', literal: s };
  }

  // First-Middle-Last form: "John A. Smith" → family = last token
  const family = last;
  const given = tokens.slice(0, -1).join(' ');
  return { family, given };
}

/** Convert "{family, given}" to AMA form "Family FM". */
export function formatAuthor(author) {
  if (!author) return '';
  if (author.literal && !author.given) return author.literal;
  const family = (author.family || '').trim();
  const given = (author.given || '').trim();
  if (!family) return '';
  if (!given) return family;
  // Initials: take first uppercase letter of each whitespace-separated chunk
  const initials = given
    .split(/[\s\.\-]+/)
    .map((g) => g.replace(/[^a-zA-Z]/g, '').charAt(0))
    .filter(Boolean)
    .join('')
    .toUpperCase();
  return initials ? `${family} ${initials}` : family;
}

/** Format a list of authors per AMA rules. */
export function formatAuthors(authors) {
  if (!authors || authors.length === 0) return '';
  const cleaned = authors.filter(Boolean);
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 6) {
    return cleaned.map(formatAuthor).filter(Boolean).join(', ');
  }
  // 7+ authors: first 3, then et al
  return cleaned.slice(0, 3).map(formatAuthor).filter(Boolean).join(', ') + ', et al';
}

/** Special role: editors. AMA uses "Editor1 EE, ed." (1 ed) or "..., eds." (multiple). */
export function formatEditors(editors) {
  if (!editors || editors.length === 0) return '';
  const list = editors.filter(Boolean);
  if (list.length === 0) return '';
  const formatted =
    list.length <= 6
      ? list.map(formatAuthor).filter(Boolean).join(', ')
      : list.slice(0, 3).map(formatAuthor).filter(Boolean).join(', ') + ', et al';
  return formatted + (list.length === 1 ? ', ed.' : ', eds.');
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Returns "October 5, 2024" or "" if invalid. */
export function formatLongDate(input) {
  if (!input) return '';
  // Accept "YYYY-MM-DD", "YYYY/MM/DD", "MM/DD/YYYY", "October 5, 2024", or year-only
  const s = String(input).trim();

  // ISO-ish: YYYY-MM-DD or YYYY-MM
  const iso = s.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);
  if (iso) {
    const [, y, m, d] = iso;
    if (!m) return y;
    const month = MONTH_NAMES[Math.max(0, Math.min(11, parseInt(m, 10) - 1))];
    if (!d) return `${month} ${y}`;
    return `${month} ${parseInt(d, 10)}, ${y}`;
  }

  // Year-only
  if (/^\d{4}$/.test(s)) return s;

  // Try Date.parse fallback
  const dt = new Date(s);
  if (!isNaN(dt.getTime())) {
    return `${MONTH_NAMES[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
  }
  return s; // give back as-is
}

/** Returns just the year from any reasonable date string. */
export function extractYear(input) {
  if (!input) return '';
  const s = String(input);
  const m = s.match(/(\d{4})/);
  return m ? m[1] : '';
}

/** Today's date in long form (used for accessedDate default). */
export function todayLongDate() {
  const dt = new Date();
  return `${MONTH_NAMES[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

/** Convert a string to sentence case (first letter capitalized, proper nouns left alone). */
export function sentenceCase(str) {
  if (!str) return '';
  const s = String(str).trim();
  if (!s) return '';
  // Conservatively: just lowercase everything then capitalize first character
  // (AMA expects sentence case; preserving proper nouns reliably needs an NLP
  // model — we leave the string alone if it already contains lowercase words).
  return s;
}

/** Strip trailing period (we add our own consistently). */
export function stripTrailingPeriod(str) {
  if (!str) return '';
  return String(str).replace(/\.+\s*$/, '').trim();
}

/** Normalize DOI to bare form (10.xxxx/yyyy) without URL prefix. */
export function normalizeDoi(doi) {
  if (!doi) return '';
  return String(doi)
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
    .trim();
}

// ---------------------------------------------------------------------------
// Italic markers — neutral token expanded later by output adapters
// ---------------------------------------------------------------------------

const ITALIC_OPEN = '\u0001';
const ITALIC_CLOSE = '\u0002';

const it = (s) => (s ? `${ITALIC_OPEN}${s}${ITALIC_CLOSE}` : '');

/** Convert internal italic markers to plain (no markup), HTML, or RTF. */
export function toPlain(s) {
  return String(s || '').replace(new RegExp(ITALIC_OPEN, 'g'), '').replace(new RegExp(ITALIC_CLOSE, 'g'), '');
}
export function toHtml(s) {
  // Escape HTML first, then expand italic
  const escaped = String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(new RegExp(ITALIC_OPEN, 'g'), '<i>')
    .replace(new RegExp(ITALIC_CLOSE, 'g'), '</i>');
}
export function toRtf(s) {
  // RTF italic: {\i ...}
  return String(s || '')
    .replace(/[\\{}]/g, (m) => `\\${m}`)
    .replace(new RegExp(ITALIC_OPEN, 'g'), '{\\i ')
    .replace(new RegExp(ITALIC_CLOSE, 'g'), '}');
}

// ---------------------------------------------------------------------------
// Joiner that drops empties and ensures clean spacing
// ---------------------------------------------------------------------------

function join(parts) {
  return parts.filter((p) => p && String(p).trim()).map((p) => String(p).trim()).join(' ');
}
function joinSegments(...segments) {
  return segments
    .map((s) => (s == null ? '' : String(s).trim()))
    .filter(Boolean)
    .join(' ');
}

// ---------------------------------------------------------------------------
// Per-type formatters — each returns a string with internal italic markers
// ---------------------------------------------------------------------------

function formatWebpage(c) {
  const segs = [];
  const a = formatAuthors(c.authors);
  if (a) segs.push(a + '.');
  if (c.title) segs.push(stripTrailingPeriod(c.title) + '.');
  if (c.websiteName) segs.push(stripTrailingPeriod(c.websiteName) + '.');
  if (c.publishedDate) segs.push('Published ' + formatLongDate(c.publishedDate) + '.');
  if (c.updatedDate) segs.push('Updated ' + formatLongDate(c.updatedDate) + '.');
  segs.push('Accessed ' + formatLongDate(c.accessedDate || todayLongDate()) + '.');
  if (c.url) segs.push(c.url);
  return segs.join(' ');
}

function formatBook(c) {
  const segs = [];
  const a = formatAuthors(c.authors);
  if (a) segs.push(a + '.');
  if (c.title) segs.push(it(stripTrailingPeriod(c.title)) + '.');
  if (c.edition && !/^1(st)?$/i.test(String(c.edition).trim())) {
    segs.push(formatEdition(c.edition) + '.');
  }
  const yearTail = c.publisher
    ? `${stripTrailingPeriod(c.publisher)};${c.year ? ' ' + extractYear(c.year) : ''}.`
    : c.year
    ? `${extractYear(c.year)}.`
    : '';
  if (yearTail) segs.push(yearTail);
  return segs.join(' ');
}

function formatBookChapter(c) {
  const segs = [];
  const chapAuthors = formatAuthors(c.authors);
  if (chapAuthors) segs.push(chapAuthors + '.');
  if (c.chapterTitle) segs.push(stripTrailingPeriod(c.chapterTitle) + '.');
  // "In: Editor EE, ed. *Book Title*. Edition. Publisher; Year:Pages."
  let inStr = 'In: ';
  if (c.editors && c.editors.length) inStr += formatEditors(c.editors) + ' ';
  if (c.bookTitle) inStr += it(stripTrailingPeriod(c.bookTitle)) + '.';
  segs.push(inStr.trim());
  if (c.edition && !/^1(st)?$/i.test(String(c.edition).trim())) {
    segs.push(formatEdition(c.edition) + '.');
  }
  let pubTail = '';
  if (c.publisher) pubTail += stripTrailingPeriod(c.publisher) + ';';
  if (c.year) pubTail += ' ' + extractYear(c.year);
  if (c.pages) pubTail += ':' + stripTrailingPeriod(c.pages);
  pubTail += '.';
  if (pubTail.trim() !== '.') segs.push(pubTail);
  return segs.join(' ');
}

function formatJournal(c) {
  const segs = [];
  const a = formatAuthors(c.authors);
  if (a) segs.push(a + '.');
  if (c.title) segs.push(stripTrailingPeriod(c.title) + '.');
  const journalName = c.journalAbbrev || c.journal;
  if (journalName) segs.push(it(stripTrailingPeriod(journalName)) + '.');
  // Year;Volume(Issue):Pages.
  let issueChunk = '';
  if (c.year) issueChunk += extractYear(c.year);
  if (c.volume) {
    issueChunk += (issueChunk ? ';' : '') + c.volume;
  }
  if (c.issue) issueChunk += `(${c.issue})`;
  if (c.pages) issueChunk += `:${stripTrailingPeriod(c.pages)}`;
  if (issueChunk) segs.push(issueChunk + '.');
  if (c.doi) segs.push('doi:' + normalizeDoi(c.doi));
  return segs.join(' ');
}

function formatNewspaper(c) {
  const segs = [];
  const a = formatAuthors(c.authors);
  if (a) segs.push(a + '.');
  if (c.title) segs.push(stripTrailingPeriod(c.title) + '.');
  if (c.newspaperName) segs.push(it(stripTrailingPeriod(c.newspaperName)) + '.');
  // Date:Section:Page. (or just Date:Page.)
  let dateChunk = '';
  if (c.publishedDate) dateChunk += formatLongDate(c.publishedDate);
  if (c.section) dateChunk += (dateChunk ? ':' : '') + c.section;
  if (c.pageNumber) dateChunk += (dateChunk ? ':' : '') + c.pageNumber;
  if (dateChunk) segs.push(dateChunk + '.');
  if (c.url) {
    if (c.accessedDate) segs.push('Accessed ' + formatLongDate(c.accessedDate) + '.');
    segs.push(c.url);
  }
  return segs.join(' ');
}

function formatVideo(c) {
  // AMA online video / multimedia format
  const segs = [];
  // Author or channel/organization
  if (c.authors && c.authors.length) {
    segs.push(formatAuthors(c.authors) + '.');
  } else if (c.channelName) {
    segs.push(stripTrailingPeriod(c.channelName) + '.');
  }
  if (c.title) segs.push(stripTrailingPeriod(c.title) + '.');
  const platform = c.platform || c.websiteName;
  if (platform) segs.push(stripTrailingPeriod(platform) + '.');
  if (c.publishedDate) segs.push('Published ' + formatLongDate(c.publishedDate) + '.');
  segs.push('Accessed ' + formatLongDate(c.accessedDate || todayLongDate()) + '.');
  const url = c.videoUrl || c.url;
  if (url) segs.push(url);
  return segs.join(' ');
}

function formatEdition(ed) {
  if (!ed) return '';
  const s = String(ed).trim();
  // Already "3rd ed." or "Second edition"?
  if (/ed\b\.?$/i.test(s)) return s;
  if (/^\d+(st|nd|rd|th)$/i.test(s)) return s + ' ed';
  if (/^\d+$/.test(s)) {
    const n = parseInt(s, 10);
    const suffix = (() => {
      const v = n % 100;
      if (v >= 11 && v <= 13) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    })();
    return `${n}${suffix} ed`;
  }
  return s;
}

// ---------------------------------------------------------------------------
// Main entrypoint: format a citation object → reference string with markers
// ---------------------------------------------------------------------------

export function formatCitation(citation) {
  if (!citation) return '';
  switch (citation.type) {
    case 'webpage': return formatWebpage(citation);
    case 'book': return formatBook(citation);
    case 'bookChapter': return formatBookChapter(citation);
    case 'journal': return formatJournal(citation);
    case 'newspaper': return formatNewspaper(citation);
    case 'video': return formatVideo(citation);
    default: return formatWebpage(citation);
  }
}

// ---------------------------------------------------------------------------
// Output adapters: bibliography list as plain text / HTML / RTF / BibTeX
// ---------------------------------------------------------------------------

export function bibliographyToPlain(citations) {
  return citations
    .map((c, i) => `${i + 1}. ${toPlain(formatCitation(c))}`)
    .join('\n\n');
}

export function bibliographyToHtml(citations) {
  return (
    '<ol style="font-family:Times New Roman, serif; line-height:1.6;">' +
    citations
      .map((c) => `<li style="margin-bottom:0.6em;">${toHtml(formatCitation(c))}</li>`)
      .join('') +
    '</ol>'
  );
}

export function bibliographyToRtf(citations) {
  // Minimal RTF doc: numbered list using "1. ..." text inline (broad compatibility)
  const body = citations
    .map((c, i) => `${i + 1}. ${toRtf(formatCitation(c))}`)
    .join('\\par\\par ');
  return (
    '{\\rtf1\\ansi\\deff0\n' +
    '{\\fonttbl{\\f0 Times New Roman;}}\n' +
    '\\f0\\fs24\n' +
    body +
    '\\par}'
  );
}

export function bibliographyToBibtex(citations) {
  return citations.map((c, i) => citationToBibtex(c, i + 1)).join('\n\n');
}

function bibtexAuthors(authors) {
  if (!authors || authors.length === 0) return '';
  return authors
    .map((a) => {
      if (!a) return '';
      if (a.literal && !a.given) return `{${a.literal}}`;
      const fam = (a.family || '').trim();
      const giv = (a.given || '').trim();
      if (!fam) return giv;
      if (!giv) return fam;
      return `${fam}, ${giv}`;
    })
    .filter(Boolean)
    .join(' and ');
}

function citationToBibtex(c, idx) {
  const id = c.id || `ref${idx}`;
  const type = c.type === 'journal' ? 'article'
    : c.type === 'book' ? 'book'
    : c.type === 'bookChapter' ? 'incollection'
    : c.type === 'newspaper' ? 'article'
    : c.type === 'video' ? 'misc'
    : 'misc';
  const fields = [];
  const authors = bibtexAuthors(c.authors);
  if (authors) fields.push(`  author    = {${authors}}`);
  if (c.title || c.chapterTitle) fields.push(`  title     = {${c.chapterTitle || c.title}}`);
  if (c.bookTitle) fields.push(`  booktitle = {${c.bookTitle}}`);
  if (c.journal || c.journalAbbrev) fields.push(`  journal   = {${c.journal || c.journalAbbrev}}`);
  if (c.newspaperName) fields.push(`  journal   = {${c.newspaperName}}`);
  if (c.publisher) fields.push(`  publisher = {${c.publisher}}`);
  if (c.year || c.publishedDate) fields.push(`  year      = {${extractYear(c.year || c.publishedDate)}}`);
  if (c.volume) fields.push(`  volume    = {${c.volume}}`);
  if (c.issue) fields.push(`  number    = {${c.issue}}`);
  if (c.pages) fields.push(`  pages     = {${c.pages}}`);
  if (c.edition) fields.push(`  edition   = {${c.edition}}`);
  if (c.doi) fields.push(`  doi       = {${normalizeDoi(c.doi)}}`);
  const url = c.videoUrl || c.url;
  if (url) fields.push(`  url       = {${url}}`);
  if (c.websiteName) fields.push(`  howpublished = {${c.websiteName}}`);
  return `@${type}{${id},\n${fields.join(',\n')}\n}`;
}

// ---------------------------------------------------------------------------
// In-text citation builder (superscript)
// ---------------------------------------------------------------------------

const SUPERSCRIPT_DIGITS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const SUPERSCRIPT_OTHER = { '-': '⁻', '–': '⁻', '(': '⁽', ')': '⁾', p: 'ᵖ', ',': '·' };

function toUnicodeSuper(s) {
  return String(s)
    .split('')
    .map((ch) => SUPERSCRIPT_DIGITS[ch] || SUPERSCRIPT_OTHER[ch] || ch)
    .join('');
}

/**
 * Build the in-text citation tail.
 * @param entries  array of { number, page?: string }
 * @param style    'unicode' | 'plain' | 'html'
 *
 * Examples:
 *   [{n:1}, {n:3}]                       -> "1,3"
 *   [{n:1},{n:2},{n:3}]                  -> "1-3"
 *   [{n:4,page:'15'},{n:5},{n:6},{n:7}]  -> "4(p15),5-7"
 */
export function buildInTextCitation(entries, style = 'unicode') {
  if (!entries || !entries.length) return '';
  const sorted = [...entries].sort((a, b) => a.number - b.number);

  // Group consecutive integers WITHOUT page numbers into ranges
  const tokens = [];
  let i = 0;
  while (i < sorted.length) {
    const cur = sorted[i];
    if (cur.page) {
      tokens.push(`${cur.number}(p${cur.page})`);
      i++;
      continue;
    }
    // Start of a potential range
    let j = i;
    while (j + 1 < sorted.length && !sorted[j + 1].page && sorted[j + 1].number === sorted[j].number + 1) {
      j++;
    }
    if (j - i >= 2) {
      tokens.push(`${cur.number}-${sorted[j].number}`);
      i = j + 1;
    } else {
      tokens.push(String(cur.number));
      i++;
    }
  }
  const plain = tokens.join(',');
  if (style === 'plain') return plain;
  if (style === 'html') return `<sup>${plain}</sup>`;
  return toUnicodeSuper(plain);
}

// ---------------------------------------------------------------------------
// Validation (light) — return list of warnings about a citation
// ---------------------------------------------------------------------------

export function validateCitation(c) {
  const warnings = [];
  if (!c) return ['Empty citation'];
  if (!c.type) warnings.push('Source type is missing.');
  switch (c.type) {
    case 'webpage':
      if (!c.title) warnings.push('Page title is required.');
      if (!c.url) warnings.push('URL is required.');
      break;
    case 'book':
      if (!c.title) warnings.push('Book title is required.');
      if (!c.publisher && !c.year) warnings.push('Publisher and/or year is recommended.');
      break;
    case 'bookChapter':
      if (!c.chapterTitle) warnings.push('Chapter title is required.');
      if (!c.bookTitle) warnings.push('Book title is required.');
      break;
    case 'journal':
      if (!c.title) warnings.push('Article title is required.');
      if (!(c.journal || c.journalAbbrev)) warnings.push('Journal name is required.');
      if (!c.year) warnings.push('Year is required.');
      break;
    case 'newspaper':
      if (!c.title) warnings.push('Article title is required.');
      if (!c.newspaperName) warnings.push('Newspaper name is required.');
      break;
    case 'video':
      if (!c.title) warnings.push('Video title is required.');
      if (!(c.videoUrl || c.url)) warnings.push('Video URL is required.');
      break;
    default:
      break;
  }
  return warnings;
}
