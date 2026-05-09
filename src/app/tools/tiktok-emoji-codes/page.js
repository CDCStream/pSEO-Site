import TikTokEmojiCodesClient from './TikTokEmojiCodesClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Search, Copy, ClipboardPaste, Sparkles } from 'lucide-react';
import { tiktokEmojis, emojiUrl } from '@/data/tiktok-emojis';

const SITE = 'https://makersilo.com';
const PATH = '/tools/tiktok-emoji-codes/';

export const metadata = {
  title: 'TikTok Emoji Codes - All 46 Hidden Emojis (Copy & Paste) | MakerSilo',
  description:
    'The complete list of TikTok\u2019s 46 secret emoji codes. Copy [smile], [happy], [wronged] and more with one click, browse PNG previews by category, and download all 46 emojis as a free ZIP.',
  keywords:
    'tiktok emoji codes, tiktok hidden emojis, tiktok secret emojis, tiktok emoji list, tiktok shortcodes, [smile] tiktok, [happy] tiktok, [loveface] tiktok, [wronged] tiktok, tiktok emoji copy paste, tiktok comment emojis, all tiktok emojis, tiktok 46 emojis',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: {
    title: 'TikTok Emoji Codes - All 46 Hidden Emojis (Copy & Paste)',
    description:
      'The complete list of TikTok\u2019s 46 secret emoji codes with PNG previews and one-click copy.',
    type: 'website',
    url: `${SITE}${PATH}`,
    siteName: 'MakerSilo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TikTok Emoji Codes - All 46 Hidden Emojis',
    description:
      'Copy any of the 46 secret TikTok emoji codes and paste them in your comments, captions, or DMs.',
  },
};

const steps = [
  {
    icon: Search,
    title: 'Find your emoji',
    description:
      'Use the search bar to look up an emoji by name (e.g. "love") or scroll through the 46-emoji grid. Filter by category (Happy, Sad, Angry, Surprise, Reaction, Cool, Love, Other) to narrow the list.',
  },
  {
    icon: Copy,
    title: 'Copy the bracket code',
    description:
      'Click the Copy button on any emoji to put the code (e.g. [loveface]) on your clipboard. Use Copy All to grab every code in the current filter as a single text block.',
  },
  {
    icon: ClipboardPaste,
    title: 'Paste in TikTok',
    description:
      'Open the TikTok app, tap into a comment, video caption, DM, or live chat input, and paste. The bracket code will instantly transform into the matching TikTok emoji as soon as you hit Send.',
  },
  {
    icon: Sparkles,
    title: 'Save the PNGs (optional)',
    description:
      'Need the emoji image for a thumbnail, sticker, or video overlay? Click the download icon on any card for a single transparent PNG, or hit Download ZIP to grab all 46 PNGs in one archive.',
  },
];

const faqs = [
  {
    q: 'What are TikTok emoji codes (the secret bracket emojis)?',
    a: 'TikTok emoji codes are 46 special emojis that only render inside the TikTok app. Each one has a shortcode in square brackets such as [smile], [happy], or [wronged]. When you type the bracket code into a TikTok comment, video caption, DM, or live chat, the app silently replaces it with the matching custom emoji image as soon as you submit. They look identical on iPhone and Android, unlike regular system emojis that change appearance per platform, which is why creators love using them for a unified visual style.',
  },
  {
    q: 'When did TikTok add these secret emojis and how many are there?',
    a: 'TikTok rolled them out quietly in 2020 with no official blog post or in-app announcement, which is why the community started calling them "secret" or "hidden" emojis. The set has stayed stable at 46 emojis ever since, covering eight broad mood categories: happy, sad, angry, surprise, reaction, cool, love, and miscellaneous. New ones may appear in future TikTok updates, but the current canonical list (the one you see on this page) is the full set as of today.',
  },
  {
    q: 'Do TikTok emoji codes work outside the TikTok app?',
    a: 'No. The substitution happens inside the TikTok app itself, so the codes only render correctly in TikTok comments, captions, DMs, and live chat. If you paste [smile] into Instagram, Twitter, WhatsApp, Discord, Snapchat, or any other app, it just shows up as the literal text "[smile]" because those apps do not know about the substitution. If you want to use the look of the emojis outside TikTok, download the PNG image from this page and use it as a sticker, image, or video overlay.',
  },
  {
    q: 'Where exactly inside TikTok do the codes work?',
    a: 'The codes are converted in every place where you type text inside the modern TikTok app: comments under videos, the caption field when you upload, replies to comments, direct messages, live chat messages, and most input fields. They do NOT always work in the profile bio (TikTok sometimes strips the substitution there) and they generally do not render in search queries. If a code looks like plain text on a friend\u2019s screen, the most likely cause is that they are using a very old version of the app.',
  },
  {
    q: 'Why do my codes show up as plain text instead of the emoji?',
    a: 'Three common reasons: (1) you are typing the code outside the TikTok app, where the substitution does not happen; (2) you are on a very old version of TikTok that predates the emoji set, so updating the app fixes it; (3) you are using parentheses (smile) instead of the required square brackets [smile], or your phone autocorrect changed the brackets. Codes are not case sensitive, so [Smile] and [SMILE] both work, but the brackets must be exactly "[" and "]" not curly braces or smart quotes.',
  },
  {
    q: 'Can I copy and paste the codes from this page?',
    a: 'Yes, that is exactly what the Copy buttons are for. Click any emoji card to copy its code to your clipboard, then paste in TikTok. You can also use the Copy All button at the top of the grid to grab every visible code at once (handy when you want to paste a whole row of emojis), or open the lightbox preview by clicking the image and copy from there. On iPhone and Android, paste with the standard long-press in any TikTok input field.',
  },
  {
    q: 'How is this different from regular Unicode emojis on my keyboard?',
    a: 'Regular Unicode emojis (the ones on your phone\u2019s emoji keyboard) are universal, work in every app, and look slightly different on each device because Apple, Google, Samsung, Microsoft, and others each draw them differently. TikTok emoji codes are app-specific, only work in TikTok, and look exactly the same for every viewer regardless of their device, because the same flat-style PNG is rendered server-side. Think of TikTok emojis like Discord custom emojis or Slack custom emojis: a private style that creates a sense of community for users of that platform.',
  },
  {
    q: 'Are the TikTok emojis free to download and use?',
    a: 'The PNG images on this page are free to download for personal use, and we have included a Download ZIP button to grab all 46 in one click. Be aware that the emoji designs are TikTok / ByteDance intellectual property; using them in your own commercial products (paid stickers, branded merchandise, monetised content unrelated to TikTok itself) could infringe their trademarks. For ordinary creator use (TikTok video overlays, fan content, memes, Discord servers, education) people use them freely with no issue, but we are documenting them here for reference, not licensing them.',
  },
  {
    q: 'What are the most popular TikTok emoji codes right now?',
    a: 'Based on TikTok comment trends, the most-used codes are [wronged] (the famous shy 🥺👉👈 face), [loveface] (heart-eyes with blush, used for crushes and fan-girling), [happy] (the squinty-eyed grin used for comedic excitement), [laughwithtears] (the over-the-top laughing face that has overtaken plain old 😂), [cool] (sunglasses for any swag moment), [thinking] (used both genuinely and sarcastically), and [angry] (mostly playful frustration). [shock] and [astonish] are popular for reaction videos.',
  },
  {
    q: 'Does this page work on iPhone, Android, and desktop?',
    a: 'Yes. The page is mobile-first and runs in every modern browser: Chrome, Safari, Edge, Firefox, Brave, Opera, on Windows, macOS, Linux, ChromeOS, iOS, and Android. The Copy button uses your browser\u2019s clipboard API, which is supported on all of those. On iPhone, after copying you may briefly see the iOS clipboard banner; on Android you will get a quick toast confirmation. The PNG download and ZIP download work the same way everywhere.',
  },
];

const longContent = `The TikTok Emoji Codes page is the complete, up-to-date reference for TikTok\u2019s 46 hidden bracket emojis: the small custom faces that show up only inside the TikTok app when you type their shortcode. Type [smile] and the app replaces it with a soft pink smiling face. Type [wronged] and you get the now-iconic shy face with two fingers pointing at each other. Type [loveface] and you get the heart-eyes-with-blush emoji that has taken over comment sections under fan-cam edits. The substitution only happens inside TikTok, the codes only need to be entered between square brackets, and they are not case sensitive, but a lot of users still get them wrong because there is no in-app reference, no autocomplete, and TikTok has never officially listed them in any settings menu. This page is that missing reference, with one-click copy, instant search, category filters, single-PNG download, and a Download ZIP button for the whole set.

The emojis launched silently in 2020 alongside a routine app update, with no announcement, no blog post, and no notification, which is why the TikTok community calls them "secret" or "hidden". Within weeks creators had datamined the full list and posted it to forums and meme pages, and within months the bracket codes were as much a part of TikTok comment culture as any of the platform\u2019s own visual conventions. The set has stayed fixed at 46 emojis since then. TikTok has never added new ones publicly, and there is no current indication that they plan to expand the set, so what you see here is the canonical list. If TikTok does add more in a future update, we will re-run our scrape and add the new entries to this page, but for now 46 is the magic number.

The technical mechanism is straightforward. Whenever you type a comment, caption, DM, or live-chat message inside the TikTok app, the input field runs your text through a small replacement function that scans for the pattern [text] and, if "text" matches one of the 46 known shortcodes, swaps the bracket code for the matching emoji image. The replacement is applied at submit time, so you will see the literal text [smile] while you are typing and only see the actual emoji after you hit Send. The image itself is a small flat-style PNG hosted by TikTok, served identically to every viewer on every device. This is the source of one of the emoji set\u2019s biggest practical advantages over regular system emojis: every viewer sees exactly the same picture. Compare this with the system emoji 🥺 ("Pleading Face"), which looks completely different on Apple devices versus Google\u2019s Noto, Samsung One UI, Microsoft Segoe, and so on. Across-device consistency is huge for creators who want a recognisable visual signature in their comments.

Where the codes do and do not work is the second most-asked question after "what are these things?". They work in every TikTok input that supports rich emoji rendering: comments under videos, replies to comments, video captions when you upload, direct messages, the chat input on TikTok Lives, and most of the message inputs in TikTok\u2019s creator tools. They do not always work in profile bios (TikTok strips the substitution there about half the time, depending on app version and account region), they do not work in the TikTok search bar (you would just be searching for the literal phrase "[smile]"), and they obviously do not work outside the TikTok app at all. If you paste [happy] into Instagram, Snapchat, WhatsApp, iMessage, Twitter, Discord, or your iOS notes app, you will see the literal six-character string "[happy]" because none of those apps know about TikTok\u2019s substitution table. If you need the visual emoji outside TikTok, download the PNG from this page and use it as an image attachment, sticker, or video overlay.

Common mistakes are easy to fix. The single most common one is using the wrong brackets: TikTok requires literal square brackets, the same characters that appear above your number row on most keyboards, and not parentheses, curly braces, smart quotes, or angle brackets. Some autocorrect engines on iPhone, especially in third-party keyboards, occasionally rewrite [smile] to (smile) when they think you are talking to a baby; if your codes are not converting, check exactly what your keyboard sent. Another mistake is misspelling the shortcode: it has to be exactly the canonical text shown on this page, so [smile] works but [smily] does not. Capitalisation does not matter, so [SMILE] and [smile] are equivalent, but extra spaces inside the brackets do, so [ smile ] does not work. Finally, very old versions of the TikTok app (before mid-2020) do not know about the substitution at all, which means a friend on a really stale install might see the bracket codes as plain text even when you see the emojis.

The page is organised to be the fastest possible reference for finding a code and copying it. The search bar at the top filters by name, by code, and by descriptive keywords (so searching for "blush" surfaces [flushed], [cute], and [lovely], even though none of those literally contain the word "blush"). The category chips below the search bar let you narrow to a single mood: Happy for the joyful, smiling, laughing emojis; Sad for the crying and emotional ones; Angry for the red-faced and rage emojis; Surprise for shocked, stunned, and astonished faces; Reaction for the more nuanced "I have no words" reactions like awkward, speechless, and rolling eyes; Cool for sunglasses-and-swagger emojis; Love for heart-eyes, kissing, and blushing emojis; and Other for the niche ones like the napping zzz face and the dollar-sign-eyes greedy face. The grid itself is responsive, packing two columns on a phone and up to six on a desktop, and each card has a high-quality PNG preview, the canonical name, the bracket code in a copyable monospace chip, and a Copy button that prefers the modern Clipboard API but falls back to the older execCommand for older browsers.

We track the last eight emojis you have copied in your browser\u2019s localStorage and surface them in a "Recently copied" strip at the top, so when you are working on a long comment that uses several emojis you do not have to keep re-finding them. Nothing is sent to our server; the recently-copied list lives entirely on your device and you can clear it with one click. The lightbox preview, opened by clicking the emoji image, shows the same emoji at 240px with a fuller description and the same Copy/Download buttons, which is useful when you want to read the full meaning of a less-common emoji like [complacent] (the smug-sunglasses face) or [pride] (the blushing-confident face).

For creators who use the emojis as image overlays in their videos rather than as inline TikTok comment text, the Download ZIP button packages every emoji currently visible in the grid into a single ZIP archive of transparent-background PNGs. The whole set of 46 emojis weighs about 140 KB, so the download is fast and the resulting ZIP is small enough to drop into any video editor: CapCut, Final Cut Pro, Adobe Premiere, DaVinci Resolve, InShot, or any of the other tools creators use for vertical video. The PNGs are at native TikTok resolution with anti-aliased edges and full transparency, so they composite cleanly over both light and dark backgrounds. If you only want a single emoji, click the small download icon on its card to grab just that one PNG.

Compared with similar reference pages on the web, this page goes deeper on three things: searchability (multi-field fuzzy search rather than just a flat list), copy ergonomics (one-click copy with a Recently-copied strip and bulk Copy All for the entire current filter), and download utility (per-emoji and bulk ZIP). Pages like emojipedia.org/tiktok and hooked.so/tiktok-emojis cover the same 46 emojis, but they are general emoji references, so they are missing the focused TikTok creator workflow that this page is built around. We also include this longer reference content so you can land here from a search like "tiktok emoji code list", find the specific emoji you wanted, and leave with both the bracket code in your clipboard and the PNG on your phone, all in under fifteen seconds.

A note on rights: the emoji designs on this page are the intellectual property of TikTok / ByteDance. We host the PNG images here as a reference dictionary so you can find and copy the codes quickly, in the same way Emojipedia and similar emoji documentation sites operate. This is not affiliated with TikTok or ByteDance, and using the PNGs in commercial products that imply TikTok endorsement (paid stickers, merchandise, branded content unrelated to TikTok itself) could infringe their trademarks. For ordinary creator use such as TikTok video overlays, Discord servers, fan content, memes, education, and personal projects, people use them freely without trouble, which is exactly the audience this page is built for.`;

function jsonLd(obj) {
  return { __html: JSON.stringify(obj) };
}

export default function TikTokEmojiCodesPage() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TikTok Emoji Codes - All 46 Hidden Emojis',
    numberOfItems: tiktokEmojis.length,
    itemListElement: tiktokEmojis.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'ImageObject',
        name: `${e.name} (${e.code})`,
        description: e.description,
        contentUrl: `${SITE}${emojiUrl(e.slug)}`,
        thumbnailUrl: `${SITE}${emojiUrl(e.slug)}`,
        encodingFormat: 'image/png',
      },
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE}/tools/` },
      { '@type': 'ListItem', position: 3, name: 'TikTok Emoji Codes', item: `${SITE}${PATH}` },
    ],
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(itemList)} />

      <ToolSchema
        name="TikTok Emoji Codes"
        description="Copy any of the 46 secret TikTok emoji codes ([smile], [happy], [wronged], [loveface] and more) and paste them in TikTok comments, captions, or DMs. Free PNG downloads, search, and category filter."
        category="Reference"
        url={`${SITE}${PATH}`}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/tools/" className="hover:text-white transition-colors">Tools</a>
            <span>/</span>
            <span className="text-gray-300">TikTok Emoji Codes</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              All 46 hidden emojis
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              TikTok Emoji Codes
            </h1>
            <p className="text-lg text-gray-400">
              The complete list of TikTok&apos;s 46 secret bracket emojis. Search by name or mood,
              one-click copy <code className="text-pink-300 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded font-mono text-sm">[smile]</code>-style codes,
              preview the PNGs, or download all 46 as a free ZIP.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <TikTokEmojiCodesClient />

            <HowToUse keyword="TikTok Emoji Codes" steps={steps} />
            <FAQSection faqs={faqs} keyword="TikTok Emoji Codes" />
            <LongContent content={longContent} keyword="TikTok Emoji Codes" />

            <div className="mt-8 rounded-xl bg-amber-500/5 border border-amber-500/20 px-4 py-3 text-xs text-amber-200/80">
              <strong className="text-amber-200">Disclaimer.</strong> Not affiliated with TikTok or
              ByteDance. The emoji designs are property of TikTok and shown here as a reference
              dictionary. Bracket codes only render inside the TikTok app.
            </div>

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
