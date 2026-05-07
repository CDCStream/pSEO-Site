import AmaCitationClient from './AmaCitationClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Search, FileText, ListOrdered, FileDown } from 'lucide-react';

export const metadata = {
  title: 'AMA Citation Generator – Free AMA 11 Reference Builder | MakerSilo',
  description:
    'Free AMA citation generator (11th edition). Auto-cite by URL, DOI, PubMed PMID, or ISBN — or fill in details manually. Build a complete reference list with in-text superscripts and export to Word, plain text, or BibTeX. No login required.',
  keywords:
    'ama citation generator, ama citation, ama 11 citation, american medical association citation, ama format, ama reference generator, ama bibliography, ama citation maker, free ama citation generator, ama citation tool, jama citation, pubmed citation generator, doi citation generator, ama in-text citation, ama style guide, automatic citation generator, ama 11th edition',
  alternates: {
    canonical: 'https://makersilo.com/tools/ama-citation-generator/',
  },
  openGraph: {
    title: 'AMA Citation Generator – Free AMA 11 Reference Builder',
    description:
      'Generate accurate AMA 11 citations from a URL, DOI, PMID, or ISBN. Build a full numbered bibliography with in-text superscripts. Export to Word, plain text, or BibTeX. Free.',
    type: 'website',
    url: 'https://makersilo.com/tools/ama-citation-generator/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMA Citation Generator – Free AMA 11 Reference Builder',
    description:
      'Auto-cite a webpage, journal article, book, newspaper, video, or chapter into AMA 11 format. Build, store, and export your full bibliography.',
  },
};

const steps = [
  {
    icon: Search,
    title: 'Paste a URL, DOI, PMID, or ISBN',
    description:
      'Drop any of the four into the autocite bar at the top. The tool detects what you pasted, then queries the right free database — CrossRef for DOIs (works for nearly every modern journal article and many books), PubMed E-utilities for PMIDs (the canonical source for biomedical papers), OpenLibrary for ISBNs (books), or fetches the page itself for plain webpage and newspaper URLs. YouTube URLs use the official oEmbed endpoint to grab the title and channel.',
  },
  {
    icon: FileText,
    title: 'Review and refine',
    description:
      'Auto-cited details are pre-filled into the matching source-type form (Webpage, Book, Journal Article, Newspaper, Online Video, or Book Chapter) and rendered as a live AMA 11 preview right beneath. Tweak the author list (try "Smith JA", "Smith, John A.", or "World Health Organization" — all work), correct journal abbreviations, add a missing accessed date, or fix a sentence-case title.',
  },
  {
    icon: ListOrdered,
    title: 'Build your reference list',
    description:
      'Click Add to bibliography. Each new source becomes the next numbered entry, exactly the way AMA — a numerical citation style — wants it. Re-edit any entry, reorder by removing and re-adding, or clear the list. Everything is saved locally in your browser between sessions, so closing the tab does not lose your work, and nothing is sent to a server you do not trust.',
  },
  {
    icon: FileDown,
    title: 'Insert in-text citations & export',
    description:
      'Use the in-text helper to pick which sources you are citing at a given point in your manuscript. Optionally add a page number; the tool combines consecutive numbers into ranges (1-3) and pages into the AMA-correct form (4(p15),5-7) automatically. Copy the Unicode superscript ready to paste, or copy the plain digits and apply Word\u2019s superscript shortcut. Then download the full bibliography as .rtf for Word, .txt for plain text, .html for the web, or .bib for LaTeX.',
  },
];

const faqs = [
  {
    q: 'What is AMA citation style?',
    a: 'AMA style is the citation system defined by the American Medical Association in the AMA Manual of Style: A Guide for Authors and Editors, currently in its 11th edition. It is a numerical citation style — every source is numbered in the order it first appears in the text, and the in-text marker is a superscript Arabic numeral rather than an author-and-year pair. The reference list at the end of the paper lists each source once, in order of first citation. AMA style is required by JAMA and the entire JAMA Network family (JAMA Cardiology, JAMA Pediatrics, JAMA Surgery, etc.) and is widely used across medicine, health sciences, biomedical research, nursing, public health, and pharmacy. It is closely related to Vancouver style, with some differences in punctuation and abbreviation.',
  },
  {
    q: 'How do I write an in-text citation in AMA style?',
    a: 'In-text citations are superscript Arabic numerals placed immediately after the relevant text, after any punctuation: "Recent guidelines support this approach.\u00b9" The same source keeps the same number every time it is cited again later. To cite multiple sources at once, separate the numbers with commas (no spaces): \u00b9\u00b3\u00b9\u2070. To cite three or more consecutive numbers, use an en dash to express the range: \u00b9\u207b\u00b3. To cite a specific page or page range from a source, include it in parentheses immediately after the superscript number with a "p" or "pp" prefix: \u2074(p15) for page 15, \u2074(pp15-21) for pages 15 to 21. Mixed forms are common: \u2074(p15),\u2075\u207b\u2077,\u00b9\u2070(pp8-11). The in-text helper in this generator builds all of these automatically once you pick the sources you are citing.',
  },
  {
    q: 'How are AMA reference list entries formatted?',
    a: 'Every entry is numbered, opens flush left, and ends with a period. The structure depends on the source type but always begins with the author block. AMA author rules are unique: write the surname followed by the initials of the given name(s) without periods or spaces between initials and without "and" or an ampersand between authors — "Smith JA, Jones CD" not "Smith, J. A. and Jones, C. D." If a source has seven or more authors, list the first three and append "et al." The article or chapter title is in sentence case (only the first word and proper nouns capitalized); the journal name or book title is in italic. Journal entries follow the pattern "Author. Article title. *Journal Abbrev*. Year;Volume(Issue):Pages. doi:10.xxxx" and the DOI is given as a bare "doi:" prefix without the https://doi.org/ URL. Books are formatted as "Author. *Book Title*. Edition. Publisher; Year." with the edition omitted for first editions.',
  },
  {
    q: 'Is this AMA generator accurate for AMA 11?',
    a: 'Yes. Every formatter in this tool was written directly against the AMA Manual of Style, 11th edition, and cross-checked against canonical examples published by Scribbr, the AMA Manual of Style itself, and editorial guides from Oxford University Press (the AMA Manual\u2019s publisher). The author parser handles all common author input patterns (surname-initials, full first name, comma-inverted, corporate authors). The journal formatter gives you the year, volume, issue (in parentheses, no space after volume), and page range exactly as AMA prescribes, with the DOI rendered as bare "doi:" without a URL prefix. The 7-or-more-authors rule (truncate to first three plus "et al") is applied automatically. Edition handling drops the edition entirely for first editions and writes it as "3rd ed." for higher editions. Sentence-case versus title-case rules are applied per source type.',
  },
  {
    q: 'Where does the autocite information come from?',
    a: 'The tool only queries free, official, key-less APIs. DOIs go to the CrossRef REST API (api.crossref.org) which holds metadata for nearly every modern peer-reviewed journal article and many books. PubMed identifiers go to the NCBI E-utilities ESummary endpoint, the official metadata source for the U.S. National Library of Medicine. ISBNs go to OpenLibrary\u2019s books API, which is part of the Internet Archive. YouTube URLs use Google\u2019s public oEmbed endpoint to retrieve the canonical title and channel name. Webpage and newspaper URLs are fetched server-side and the structured metadata in the page\u2019s &lt;head&gt; (Open Graph, Twitter Card, JSON-LD Schema.org Article objects, and standard meta tags such as article:published_time, author, and date) is parsed. Nothing is logged, no third-party tracker is placed in the path, and no API keys are required.',
  },
  {
    q: 'What is the difference between AMA and Vancouver style?',
    a: 'AMA and Vancouver are both numerical citation styles used heavily in medicine, and the reference list is functionally similar. The differences are a handful of formatting details. Vancouver uses square brackets around in-text numbers — [1] — while AMA uses superscripts (\u00b9). Vancouver typically caps reference list authors at six (then et al), AMA caps at six but writes "et al" only after seven or more. Vancouver typically gives DOIs as full URLs; AMA prefers a bare "doi:" prefix. Vancouver does not always italicize journal names; AMA always italicizes journal names and book titles. If your editor specifies "Vancouver" you cannot simply submit AMA-formatted references and vice versa — the in-text marker style alone gives it away — but AMA references are usually only a few minor edits away from Vancouver-compliant.',
  },
  {
    q: 'Can I use this tool without creating an account?',
    a: 'Yes — there is no signup, no login, no email, no payment, and no quota. Your bibliography is stored locally in your browser using localStorage, so it persists between visits on the same device but is never uploaded to a server. If you want to move your bibliography to another device, just download a .rtf, .txt, or .bib file and open it on the other device. If you want to clear your bibliography (e.g., on a shared computer), use the Clear all button or your browser\u2019s "Clear site data" function.',
  },
  {
    q: 'How do I import the bibliography into Microsoft Word?',
    a: 'The fastest way is the Download .rtf button, which gives you a Rich Text Format file Word opens directly with all the italics already in place. Alternatively, Download .html and copy-paste the rendered list into Word — italics survive the paste. If you prefer plain text, Download .txt for the cleanest possible output, then italicize the journal/book titles manually. For LaTeX users, Download .bib produces a BibTeX file you can drop into Overleaf or any LaTeX editor and reference with \\\\cite{}. The numbered list will be regenerated automatically by your bibliography style — just make sure your .bst file is set to AMA, Vancouver, or numeric.',
  },
];

const longContent = `## Why Build Your AMA Citations With This Tool

Every medical, biomedical, nursing, pharmacy, and public-health student or researcher hits the same wall: AMA style is fiddly. The author block uses no periods between initials and no commas before the comma. The journal name has to be the abbreviated form from Index Medicus or PubMed, in italics, immediately followed by a year–volume–issue–page block whose punctuation has no spaces. The DOI gets a bare "doi:" prefix instead of the URL form everyone copies from a journal\u2019s landing page. Sentence case applies to article and chapter titles but title (headline) case applies to book and journal names. Miss any one of these and you are sending an editor a copy-edit task instead of a manuscript. This tool exists because all of those rules can be written in code once and then never thought about again.

## What AMA Style Actually Is

AMA style is defined by the **AMA Manual of Style: A Guide for Authors and Editors**, published by the American Medical Association and Oxford University Press. The 11th edition (2020) is the current standard; many older theses, books and review articles still use the 10th edition (2007), with relatively minor differences. Both editions adopt a **numerical citation system**: sources are numbered consecutively in the order they first appear in the text, and the same number is reused every time the same source is cited again. The in-text marker is a superscript Arabic numeral immediately after the relevant text, placed *after* any punctuation: "Recent guidelines support this approach.¹"

The reference list at the end of the paper lists each source exactly once, in the order they were first cited (not alphabetically — that is APA). Each entry begins with the citation number, then the author block, then a source-type-specific formula. JAMA and the JAMA Network family (JAMA Cardiology, JAMA Dermatology, JAMA Health Forum, JAMA Internal Medicine, JAMA Neurology, JAMA Oncology, JAMA Ophthalmology, JAMA Pediatrics, JAMA Psychiatry, JAMA Surgery, and others) require AMA style. So do thousands of other medical and health journals worldwide and most American medical school assignments.

## The Six Source Types We Support

We support the six source types that account for around 95% of real-world AMA bibliographies in the medical sciences:

**Journal articles** are the workhorse. Format: \`Authors. Article title in sentence case. Abbreviated Journal Name. Year;Volume(Issue):Pages. doi:10.xxxx\` — for example, \`Smith JA, Jones CD. Cardiovascular outcomes in adolescent patients. *JAMA Cardiol*. 2024;9(2):123-130. doi:10.1001/jamacardio.2024.0001\`. The volume number is followed immediately by the issue in parentheses with no intervening space; the issue is followed immediately by a colon then the page range. The DOI never gets a URL prefix in AMA — it is always rendered as a bare "doi:" identifier.

**Books** follow \`Authors. *Book Title in Title Case*. Edition. Publisher; Year.\` — for instance, \`Greenberg DA, Aminoff MJ, Simon RP. *Clinical Neurology*. 11th ed. McGraw Hill; 2024.\` First editions omit the "1st ed." entirely; subsequent editions are written as ordinals ("2nd ed.", "3rd ed.", "11th ed."). Publisher names follow modern AMA practice — the publisher city is no longer required in AMA 11.

**Book chapters** are formatted as \`Chapter authors. Chapter title in sentence case. In: Editors, ed[s]. *Book Title*. Edition. Publisher; Year:Pages.\` The "ed." or "eds." abbreviation depends on whether there is one editor or several. Page numbers come at the very end after a colon.

**Webpages** use \`Authors. Page title in sentence case. Website Name. Published Month Day, Year. Updated Month Day, Year. Accessed Month Day, Year. URL\` with full month names always written out. The accessed date is mandatory for AMA — internet sources can change, and the accessed date tells the reader what version you saw. If no published date is available, you can omit it and rely on the accessed date alone.

**Newspapers** combine the article-style author and title with a different date and location block: \`Authors. Article title. *Newspaper Name*. Month Day, Year:Section:Page.\` Online newspaper articles add the URL and access date at the end.

**Online videos** (including YouTube, Vimeo, and conference recordings) use \`Channel/Producer. Video title. Platform. Published Month Day, Year. Accessed Month Day, Year. URL\`. AMA 11 explicitly added a multimedia category for this; treat the channel as the author when no individual is credited.

## How Autocite Works (And Why It\u2019s Free)

Behind the search bar are five independent free metadata sources, none of which require an API key:

**CrossRef** is the official DOI resolver and metadata registry for almost every academic publisher. Pasting a DOI like \`10.1001/jama.2024.0001\` returns the canonical author list, title, container (journal/book), volume, issue, pages, and publication year. CrossRef serves these queries from a fast public REST API (api.crossref.org) and gives "polite pool" priority to clients that include a contact email in their User-Agent header — which we do.

**PubMed E-utilities** is the U.S. National Library of Medicine\u2019s public API for the PubMed database. Pasting a PMID like \`35123456\`, the URL of any PubMed page (pubmed.ncbi.nlm.nih.gov/35123456), or any other identifier PubMed knows about returns a full medical-bibliographic record including the abbreviated journal name (the canonical Index Medicus/MEDLINE abbreviation) and any associated DOI.

**OpenLibrary** is part of the Internet Archive\u2019s open book database. Pasting an ISBN-10 or ISBN-13 — with or without dashes, with or without an "ISBN:" prefix — returns the author list, full title, subtitle, publisher, and publication year. Older or self-published books are sometimes incomplete; for these, fall back to the manual form.

**YouTube oEmbed** is Google\u2019s public oEmbed endpoint. We use it to grab the canonical video title and channel name without needing any YouTube Data API quota. The published date is scraped from the watch page itself.

**Webpage scraping** is performed server-side. We fetch the HTML, parse the &lt;head&gt; section for Open Graph tags (og:title, og:site_name, og:type, og:published_time), Twitter Card metadata, JSON-LD Schema.org Article objects (which carry author lists), and standard meta tags (author, article:published_time, article:modified_time). For news sites, JSON-LD usually carries the most accurate author and publication-date information — far more reliable than scraping the rendered page.

## Building a Bibliography That Survives Editor Review

The single biggest reason citation generators fail is that authors paste autocited entries blindly without checking them. Even the best metadata source has gaps. Older journal articles often miss page ranges. Newspapers often miss authors. YouTube videos rarely have a structured published date. Books occasionally come back from OpenLibrary with only the publisher name and no city or year. The live preview built into this tool is there for exactly this reason — every keystroke updates the preview, so you can spot a missing field, a wrong year, or a misformatted journal abbreviation immediately. The validator below the form lists any required fields you have not filled, so you do not save half-broken citations into your bibliography.

A few field-by-field tips. **Authors**: AMA wants \`Smith JA\`, not \`Smith, J. A.\`. The tool accepts either form — and even free-form like \`John A. Smith\` or \`John Smith\` — and converts to AMA on the fly. Corporate authors (\`World Health Organization\`, \`American Heart Association\`) are passed through verbatim. **Journal abbreviation**: PubMed returns the canonical NLM abbreviation in the "source" field, which is what AMA expects. If you do not have the abbreviation handy, paste the full journal name into both fields and the formatter will use the abbreviation field if present. **Year**: any year format works; we extract the four-digit year automatically. **Pages**: write the range with a hyphen, like \`123-130\`; we do not normalize this because some journals use elision (\`123-30\`) and some do not. **DOI**: paste any of the three forms — bare (\`10.1001/jama.2024.0001\`), prefixed (\`doi:10.1001/...\`), or URL (\`https://doi.org/10.1001/...\`); we strip the URL prefix and render only "doi:".

## In-Text Citations Done Right

The in-text helper builds the trickier part of AMA correctly. Picking citations 1, 2, and 3 yields \`1-3\` (en dash range, no spaces). Picking 1, 3, 5 yields \`1,3,5\` (commas, no spaces). Adding a page number to a citation produces \`4(p15)\`. Mixed cases combine cleanly: \`4(p15),5-7,10(pp8-11)\`. The output is offered in two forms — Unicode superscript characters that you can paste anywhere (academic emails, blog posts, comments) and a plain digit form that you superscript inside Word using \`Ctrl+Shift++\`. The Unicode form is also fine for most scholarly journals\u2019 web platforms, although final typeset versions always use real superscript markup.

## Privacy and What Happens to Your Bibliography

Your bibliography lives in your browser\u2019s localStorage. Closing the tab and reopening the page restores the list. Nothing about it is uploaded, logged, or attributed to your IP. The autocite endpoint hits the upstream metadata API on your behalf and returns the result; the request is not stored. We do not run third-party tracking scripts on the citation builder. If you want to wipe your bibliography, click Clear all (or use your browser\u2019s "Clear site data" feature for a hard reset). If you want to back it up, the Download .txt or Download .bib buttons give you a portable copy you can drop into Dropbox, Drive, or just an email to yourself.

## When AMA Is — and Is Not — the Right Choice

Use AMA when you are submitting to a JAMA-family journal, when an instructor or supervisor specifies AMA explicitly, or when an editor or style guide names the AMA Manual of Style. For nearly all other medical and health-science journals, AMA, Vancouver, or "ICMJE numerical" is acceptable — and AMA is the safest default. Do not mix styles within a single document: pick one before you start writing, configure your reference manager, and run the whole bibliography through this tool at the end as a final pass to catch formatting mistakes that crept in.

## What Else We Plan to Add

This page currently focuses on AMA 11 because that is the most-requested style in the medical sciences. APA 7, MLA 9, Chicago/Turabian, Harvard, IEEE, and Vancouver generators are on the roadmap and will share the same autocite pipeline (CrossRef + PubMed + OpenLibrary + URL scrape + YouTube oEmbed). The reference list will be exportable across styles in a future update so that switching from one style guide to another at submission time is a one-click operation. Until then, AMA 11 — done right, done free, done without an account.`;

export default function AmaCitationGeneratorPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://makersilo.com/' },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://makersilo.com/tools/' },
              { '@type': 'ListItem', position: 3, name: 'AMA Citation Generator', item: 'https://makersilo.com/tools/ama-citation-generator/' },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to use the AMA Citation Generator',
            description:
              'Step-by-step instructions for building an AMA 11 reference list with this generator: paste a URL/DOI/PMID/ISBN, review the auto-cited fields, add to your bibliography, and export.',
            step: steps.map((s, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: s.title,
              text: s.description,
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <ToolSchema
        name="AMA Citation Generator"
        description="Free AMA 11 citation generator with autocite for URL, DOI, PubMed PMID, and ISBN. Build a numbered reference list with in-text superscripts and export to RTF, plain text, HTML, or BibTeX."
        url="https://makersilo.com/tools/ama-citation-generator/"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              AMA Citation Generator
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
              Build accurate AMA 11th edition citations from a URL, DOI, PubMed PMID, or ISBN — or fill in the details by hand. Generate a full numbered reference list with in-text superscripts and export to Word, plain text, or BibTeX. Free, no signup.
            </p>

            <AdSlot position="above-tool" />

            <AmaCitationClient />

            <HowToUse keyword="AMA Citation Generator" steps={steps} />
            <FAQSection faqs={faqs} keyword="AMA Citation Generator" />
            <LongContent content={longContent} keyword="AMA Citation Generator" />

            <AdSlot position="below-content" />
          </div>

          <div className="hidden xl:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <AdSlot position="sidebar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
