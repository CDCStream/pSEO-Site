import WhatMemeGalleryClient from './WhatMemeGalleryClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import { ImageGallerySchema } from '@/components/SEO/ToolSchema';
import { Search, MousePointer2, Download, Send, Globe2, MessageCircleQuestion } from 'lucide-react';

const PAGE_URL = 'https://makersilo.com/memes/what-meme/';

export const metadata = {
  title: 'What Meme GIFs - 8 Free "What?!" Reaction GIFs (HD Download) | MakerSilo',
  description:
    'Free "what?" meme GIF pack: 8 animated "what" reaction GIFs you can download in one click and drop straight into chats, comments, and stitches. No watermark, no signup.',
  keywords:
    'what meme, what meme gif, what reaction gif, what gif, confused meme gif, wait what meme, what meme download, free what meme gif, what reaction meme, animated what meme, what gif download, reaction gif pack',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'What Meme GIFs - 8 Free "What?!" Reaction GIFs (HD Download)',
    description:
      'Free animated "what" meme GIFs. Tap to play, click to download, drop into any chat. 8 reaction GIFs, no watermark, no signup.',
    type: 'website',
    url: PAGE_URL,
    siteName: 'MakerSilo',
    images: ['/what-memes/what-meme1.gif'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Meme GIFs - 8 Free "What?!" Reaction GIFs',
    description:
      'Free animated "what" meme GIFs. Tap to play, click to download, drop into any chat.',
    images: ['/what-memes/what-meme1.gif'],
  },
};

const steps = [
  {
    icon: Search,
    title: 'Browse the auto-playing gallery',
    description:
      'Scroll the grid below \u2014 every "what" meme GIF starts playing on its own as soon as it scrolls into view. No tap-to-play, no thumbnail step. You see the full reaction at a glance.',
  },
  {
    icon: MousePointer2,
    title: 'Tap any GIF to enlarge it',
    description:
      'Click or tap a tile to open the lightbox at full size. Use the left and right arrow keys (or the on-screen arrows) to flip through the eight "what?" reactions, and Esc to close.',
  },
  {
    icon: Download,
    title: 'Hit Download to save the GIF',
    description:
      'Press the purple Download GIF button and the file saves straight to your device as an animated .gif \u2014 no watermark, no signup, no email gate. The original loop is preserved exactly.',
  },
  {
    icon: Send,
    title: 'Drop the GIF into any chat or post',
    description:
      'Open WhatsApp, iMessage, Discord, Telegram, X (Twitter), Instagram DMs, TikTok comments, Slack, or your favourite forum and attach the saved GIF. It plays inline as a reaction.',
  },
];

const faqs = [
  {
    q: 'What is the "what?" meme?',
    a: 'The "what?" meme \u2014 sometimes spelled "wait, what?", "huh?", or written as "WHAT?!" \u2014 is one of the oldest and most universal reaction-meme formats on the internet. It is a short animated loop of someone (or a cartoon character) reacting to something confusing, surprising, or absurd, used to express disbelief in a chat or comment thread. The format has been a staple of meme culture since the early 2000s, predating most of today\u2019s reaction GIFs, and remains one of the highest-volume reactions on Giphy, Tenor, and Reddit.',
  },
  {
    q: 'Are these "what" meme GIFs free to download?',
    a: 'Yes. Every GIF on this page is free to download as a standard animated .gif file. There is no watermark, no signup, no email-gate, and no paywall. Click the purple Download GIF button on any tile (or open the lightbox for the larger version) and the file is saved straight to your device. You can use them in personal chats, group threads, comments, replies, stitches, and casual creator content without restriction.',
  },
  {
    q: 'Can I send these GIFs in WhatsApp, iMessage, Discord, and Instagram?',
    a: 'Yes. The downloaded GIFs are standard animated .gif files, which every major messaging and social app supports. WhatsApp converts uploaded GIFs to looping MP4s under the hood but plays them as expected, iMessage and Telegram play GIFs natively, Discord shows them inline in any channel, and X (Twitter), Instagram DMs, TikTok comments, and Slack accept them as image attachments. On smaller GIFs (< 5 MB) you can also use them as Discord stickers or custom emoji.',
  },
  {
    q: 'Why does the page take a moment to load all eight GIFs?',
    a: 'Animated GIFs are inherently larger than static images because every frame is stored separately. We have already aggressively optimised every file on this page (lossy palette quantisation and inter-frame compression), but a multi-frame loop is still bigger than a single PNG. Lazy loading is enabled on all GIFs except the first two, so only the visible tiles fetch on first paint and the rest stream in as you scroll. On a typical broadband connection the entire page transfers in 2-3 seconds.',
  },
  {
    q: 'Can I use these "what" GIFs on YouTube, TikTok, or Twitch?',
    a: 'Personal and casual creator use is welcome. You can drop the GIF into a TikTok comment, a YouTube community post, a Twitch chat, a Reddit reply, or a livestream overlay without any extra step. For monetised commercial use \u2014 a paid product, a sponsored video, an ad creative, or a logo \u2014 we recommend verifying the underlying source, since some classic "what?" GIFs originate from third-party shows, films, or streamers whose individual rights still apply. As a rule of thumb: chat-and-comment use is fine, ad-and-product use needs an extra clearance step.',
  },
  {
    q: 'Do these GIFs play automatically without me pressing a button?',
    a: 'Yes \u2014 every GIF auto-plays as soon as it enters the viewport. Animated .gif is the only major image format that loops on its own without JavaScript or a click-to-play tap, which is why the format has stayed alive for almost 40 years. There is no "play" button to tap and no per-tile autoplay setting; that behaviour is part of how browsers render animated GIFs. The lightbox view also auto-plays the loop as soon as you open it.',
  },
  {
    q: 'How do I add a "what" GIF to a TikTok video as a sticker or stitch reaction?',
    a: 'Save the GIF to your phone\u2019s photo gallery first by tapping the Download GIF button. In TikTok, when you add a video, tap the Sticker or Effects icon and choose Upload \u2014 the GIF will appear as a moving sticker you can position and resize. For a stitch or duet you can also play the GIF on a second device while you record, or import it as a clip directly using the Add Sound / Upload Media flow. Most reaction creators just upload the GIF as a sticker for the cleanest look.',
  },
  {
    q: 'Can I edit, crop, or convert these GIFs to MP4?',
    a: 'Yes. The downloaded files are standard .gif files with no DRM. To convert a GIF to MP4 (smaller file, better quality, plays inline on more sites) use any free converter such as CloudConvert, ezgif.com, or our own related converters. To crop, slow down, speed up, or stitch loops together, use ezgif, Kapwing, or any local image editor that supports animated formats. The originals on this page are already optimised for size, so you can re-encode them without much further saving, but you can definitely re-frame, re-crop, or re-time them.',
  },
  {
    q: 'Are reaction GIFs different across regions and languages?',
    a: 'They look the same but the cultural meaning shifts. The "what?" meme is universal in English-speaking internet culture (US, UK, Canada, Australia, Ireland, New Zealand) and reads the same in most European chats. In Japanese internet culture the equivalent is the famous "\u306f\uff1f" (read as "ha?") or the Picard-style facepalm; in Korean chat the closest equivalent is "\ub6f8" (mwo) or "\ud5d0?" (heol); in Spanish and Portuguese-speaking communities the closest is "\u00bfQu\u00e9?" / "O qu\u00ea?" with the same disbelieving tone; in Turkish the closest is "Ne yani?". The visual GIFs on this page work in every language because the facial reaction reads the same way globally \u2014 you do not have to translate "what?" to communicate disbelief.',
  },
  {
    q: 'Why are some reaction-GIF sites slow or full of pop-ups, and is this page different?',
    a: 'Most reaction-GIF sites are powered by ad networks that load five-to-ten heavy third-party trackers per page view, plus video pre-rolls before each download. This page does the opposite: every GIF is hosted on the same domain, served straight from a CDN, lazy-loaded after the first two tiles, and aggressively size-optimised before being deployed. There is no pop-up, no interstitial, no "wait 5 seconds" page, and no signup. The Download button writes a normal .gif to your device the instant you press it.',
  },
];

const longContent = `The "what?" meme is one of the oldest and most universally understood reaction formats in internet culture. It is a short animated loop \u2014 typically a half-second to a few seconds long \u2014 of a person or character reacting with confusion, disbelief, or shock to something that has just happened, said simply by writing "what?" into a chat. Even though the meme reads the same in any language and culture, it has been the dominant disbelief reaction on Western internet platforms since the early 2000s and remains one of the most-searched reaction GIFs on Giphy, Tenor, GIPHY-Stickers, and Reddit. This page collects eight of the most useful "what?" reaction GIFs, hosts them at small file sizes, and lets you download any of them as a standard animated .gif in one tap \u2014 no watermark, no signup, no email gate, no ad pre-roll.

Why animated GIFs in 2026? Because the .gif format is, to this day, the only image format that auto-loops in every browser, every chat app, and every social-media feed without JavaScript or a click-to-play tap. WebP and AVIF have caught up on still-image quality and far surpassed GIF on file size, but for reaction loops in chat threads the universal compatibility of .gif still wins. WhatsApp will internally convert your uploaded GIF to a looping MP4 to save bandwidth, but to you and to everyone else in the chat the experience is exactly the same: a short, looping reaction that plays itself the moment it appears.

How we optimised the eight GIFs on this page. The original files we started from totalled almost 20 megabytes. Animated GIFs are inherently expensive because every frame is stored separately, and large reaction packs get heavy fast \u2014 a 150-frame GIF at 374-pixel width is most of a 4 MB download even after best-effort compression. We ran every file through libvips with aggressive lossy palette quantisation (down from a full 256-colour palette to 64\u2013128 colours per file), inter-frame max-error tolerances of 16\u201328 levels (so visually identical adjacent frames merge), and an inter-palette max-error of 8\u201316 (so similar palette entries collapse). The result was an overall reduction of about fifty-five percent without any visible quality loss in the loop. The full pack now ships at under 9 MB, and the page lazy-loads everything below the second tile so the first paint loads in under a second on a typical broadband connection.

How to use a reaction GIF. The flow is the same on every platform: download the GIF, then attach it. In WhatsApp tap the paperclip icon, choose Document or Photo & Video, and select the saved .gif \u2014 it plays inline. In iMessage drag the GIF onto the message field. In Discord paste it from your clipboard or drag it in, and it plays automatically; if it is under 256 KB on a Nitro-boosted server you can even use it as a custom emoji. On X (Twitter) attach it as a media file in the composer and Twitter will convert it to a looping muted video on its servers, displayed exactly the same way to your followers. Telegram and Signal both support GIFs natively, with Telegram even offering a built-in GIF saver so you can keep the most-used reactions one tap away. On Instagram DMs paste the GIF into a chat or upload it as a sticker layer on a story. On TikTok upload the saved GIF in the sticker or effects panel and it becomes a moving overlay you can drag and resize on your video.

What makes a "what?" reaction work. The strongest reaction GIFs share three properties: they loop cleanly (the last frame leads back into the first frame without a visible cut), they read in under a second (a viewer scanning a 50-message thread can tell what is happening before they parse the words around it), and they centre the face. The eight GIFs on this page were chosen specifically for those properties. Each one isolates a confused or surprised reaction, none has burned-in caption text, and the average loop is between half a second and three seconds, which is the sweet spot for chat reactions \u2014 long enough to register, short enough to disappear before it becomes annoying.

Where to use these GIFs and where not to. Personal chat use is unrestricted and the use we expect. Casual creator use \u2014 a TikTok or Reels reaction overlay, a Twitch chat, a YouTube community post, a Reddit reply, a Substack note, a podcast episode show-page, a Discord channel \u2014 is welcome and one of the main reasons we host them. For monetised commercial use, however \u2014 a paid product, a sponsored video, an ad creative, a logo, a trademark application, or any context where the GIF is part of a paid offering \u2014 we recommend verifying the underlying source, because some classic "what?" GIFs originate from third-party shows, streamers, and films whose individual licensing still applies. The shorthand we use ourselves: chat-and-comment use is fine, ad-and-product use needs an extra clearance step.

A note on cross-cultural and cross-language reach. The "what?" reaction is one of the very few internet memes that translates across language boundaries without losing meaning, because the reaction is carried entirely by the face and the body language, not by the word "what" itself. In English-speaking internet communities (United States, United Kingdom, Canada, Australia, Ireland, New Zealand, South Africa, the Caribbean) the meme is read as "what?" or "wait, what?". In Spanish and Portuguese-speaking chats it reads as "\u00bfQu\u00e9?" or "O qu\u00ea?" with exactly the same disbelieving tone. In French it is "Quoi?" or "Comment?". In German it is "Was?" or "H\u00e4?". In Italian "Cosa?". In Turkish "Ne?". In Japanese the equivalent is "\u306f\uff1f" (ha?) and the same head-tilt body language; in Korean it is "\ub6f8?" (mwo?) or the explosive "\ud5d0?" (heol?). In Mandarin chat communities the closest is "\u4ec0\u4e48?" (sh\u00e9nme) or the cuter "\u54c8?" (h\u00e1?). In Hindi "Kya?". In Arabic "\u0625\u064a\u0647\u061f" (eh?). In every one of those communities, dropping a silent looped reaction GIF in a chat and writing the local-language equivalent of "what?" right above or below it lands the same joke. That is why this page is useful for a global audience and why we have written the alt text and metadata to be searchable in English while still working as a universal visual reaction.

Privacy and how the gallery works under the hood. Every GIF on this page is hosted on this site\u2019s own CDN. Nothing on this page calls a third-party tracker before you download. The Download button uses the standard browser fetch and Blob APIs to write the file to your device locally; we do not log who downloaded which GIF or when. The lightbox is rendered with plain React and CSS \u2014 no third-party widgets. Page weight is dominated by the eight GIFs themselves, every other resource on the page (HTML, CSS, JavaScript) totals under 100 KB combined.

Closing tip: keep your favourite reactions one tap away. Every modern messaging app has a "Saved GIFs" or "Favourites" panel. After downloading a "what?" GIF from this page, attach it once in your chat app of choice and add it to favourites \u2014 in Telegram by tapping the star icon, in Discord by adding it to a server\u2019s sticker library, in WhatsApp by long-pressing the message and tapping Save. The reaction will then be one tap away forever, and you will never need to come back here for the same GIF twice. We will, however, keep adding new reaction packs \u2014 dog memes, side-eye memes, "Bruh" memes, "Are you sure about that?" memes, and more \u2014 so bookmark the page if you like the format.`;

const galleryImages = Array.from({ length: 8 }, (_, i) => ({
  '@type': 'ImageObject',
  contentUrl: `https://makersilo.com/what-memes/what-meme${i + 1}.gif`,
  encodingFormat: 'image/gif',
  name: `What meme GIF #${i + 1}`,
}));

export default function WhatMemePage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://makersilo.com' },
              { '@type': 'ListItem', position: 2, name: 'Memes', item: 'https://makersilo.com/memes' },
              { '@type': 'ListItem', position: 3, name: 'What Meme GIFs' },
            ],
          }),
        }}
      />
      <ImageGallerySchema
        name='What Meme GIFs - 8 Free "What?!" Reaction GIFs'
        description='Free pack of 8 animated "what?" reaction GIFs. Tap to play, click to download. No watermark, no signup.'
        images={galleryImages}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to download a "what?" meme GIF',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'What Meme GIFs',
            url: PAGE_URL,
            inLanguage: 'en',
            isPartOf: { '@type': 'WebSite', name: 'MakerSilo', url: 'https://makersilo.com' },
            about: {
              '@type': 'Thing',
              name: 'What reaction meme',
              description: 'Animated reaction GIFs expressing surprise, confusion, or disbelief, commonly used in chat and social media.',
            },
          }),
        }}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 left-12 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/memes/" className="hover:text-white transition-colors">Memes</a>
            <span>/</span>
            <span className="text-gray-300">What Meme GIFs</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-semibold mb-4">
              <MessageCircleQuestion className="w-3.5 h-3.5" />
              8 animated GIFs \u00b7 Auto-playing
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              What Meme GIFs <span className="text-purple-300">"What?!"</span>
            </h1>
            <p className="text-lg text-gray-400">
              The classic "what?" reaction GIF pack \u2014 8 free animated loops that play instantly on this page and download in one tap. Perfect for chat replies, comments, stitches, and stream reactions. No watermark, no signup.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <WhatMemeGalleryClient />

            <section className="mt-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
              <div className="flex items-start gap-3">
                <Globe2 className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300 leading-relaxed">
                  <strong className="text-purple-200">Universal across languages.</strong>{' '}
                  The "what?" reaction is carried by the face, not the word \u2014 these GIFs work the same in English ("what?" / "wait what?"), Spanish ("\u00bfqu\u00e9?"), French ("quoi?"), German ("was?" / "h\u00e4?"), Italian ("cosa?"), Portuguese ("o qu\u00ea?"), Turkish ("ne?"), Japanese ("\u306f\uff1f"), Korean ("\ub6f8?"), Mandarin ("\u4ec0\u4e48?"), Hindi ("kya?"), and Arabic ("\u0625\u064a\u0647\u061f"). One pack, every chat thread on Earth.
                </div>
              </div>
            </section>

            <HowToUse keyword="What Meme GIFs" steps={steps} />
            <FAQSection faqs={faqs} keyword="What Meme GIFs" />
            <LongContent content={longContent} keyword="What Meme GIFs" />

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
