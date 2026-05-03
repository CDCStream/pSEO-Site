import YouTubeToMp3Client from '../youtube-to-mp3/YouTubeToMp3Client';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Link2, Settings, Download, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Free YouTube to MP4 Converter - Download Video in HD/Full HD | MakerSilo',
  description: 'Free YouTube to MP4 converter. Download YouTube videos as MP4 in 360p, 480p, 720p HD, or 1080p Full HD. Works with regular videos, Shorts, and music videos. No sign-up, no software install.',
  keywords: 'youtube to mp4, youtube to mp4 converter, youtube mp4 download, youtube video downloader, free youtube downloader, yt to mp4, youtube hd download, youtube 1080p download, youtube shorts downloader, mp4 from youtube, online youtube video converter',
  openGraph: {
    title: 'Free YouTube to MP4 Converter - Download Video in HD/Full HD',
    description: 'Download any YouTube video as MP4 in HD or Full HD. Free, fast, no software install.',
    type: 'website',
  },
};

const steps = [
  { icon: Link2, title: 'Paste YouTube Video URL', description: 'Copy any YouTube video, Shorts, or youtu.be link and paste it into the input field. The video thumbnail appears instantly to confirm the right clip.' },
  { icon: Settings, title: 'Pick Video Quality', description: 'Choose your preferred resolution: 360p (mobile data friendly), 480p SD, 720p HD, or 1080p Full HD. The MP4 file includes both video and audio in one ready-to-play file.' },
  { icon: Download, title: 'Click Convert', description: 'Press Convert and wait 5-15 seconds while we fetch the video stream from YouTube. If a request gets blocked, hit "Try Again" to retry through a different route.' },
  { icon: CheckCircle2, title: 'Download MP4 to Your Device', description: 'Click the green Download button to save the MP4 to your phone, tablet, or computer. Plays in any video player without conversion.' },
];

const faqs = [
  { q: 'Is this YouTube to MP4 downloader free to use?', a: 'Yes, completely free. No signup, no credit card, no hidden trial. There are no daily download limits and no watermarks added to your videos. The tool stays free thanks to the ads displayed alongside the converter.' },
  { q: 'What MP4 video qualities can I download?', a: 'Four resolutions: 360p (small file, fine for mobile data and quick previews), 480p (standard definition, good for older devices), 720p HD (the sweet spot for most videos and laptops), and 1080p Full HD (best clarity for music videos, tutorials, and large screens). Higher quality means larger file size.' },
  { q: 'Can I download YouTube Shorts as MP4?', a: 'Yes. Just paste a YouTube Shorts URL (any link starting with youtube.com/shorts/) and the converter handles it like any regular video. Shorts download in their original vertical aspect ratio (9:16), perfect for re-sharing on TikTok, Instagram Reels, or saving to your camera roll.' },
  { q: 'Do downloaded MP4 files include audio?', a: 'Yes. Every MP4 file is muxed (video and audio combined into one file) so it plays out of the box in any media player without needing to merge anything. No silent video files.' },
  { q: 'Why does the download sometimes fail?', a: 'YouTube occasionally rate-limits automated download requests to protect their servers. Roughly 5% of requests fail on the first attempt. When that happens, just press the "Try Again" button — the request is automatically routed differently and almost always succeeds the second time. Some videos cannot be downloaded at all: private videos, age-restricted videos requiring login, members-only content, and videos blocked in your region.' },
  { q: 'Will it work on iPhone or Android?', a: 'Yes. The converter runs entirely in your mobile browser (Safari on iPhone, Chrome on Android, etc.). No app needed. On iPhone the MP4 saves to the Files app under Downloads (you can move it to Photos manually). On Android, it goes to the Downloads folder and is auto-detected by your gallery app.' },
  { q: 'Is downloading YouTube videos legal?', a: 'It depends on the content and where you live. Generally permitted: Creative Commons videos, royalty-free content, your own uploads, content explicitly marked as downloadable, and personal fair-use copies in many countries. Not permitted: redistributing copyrighted videos, monetizing downloaded content, or using clips without rights. By using this tool you confirm you have the rights to download the content for your intended use.' },
  { q: 'How long can the video be?', a: 'Most videos under 60 minutes convert smoothly. Videos between 1-3 hours work but may take longer to download (the file is larger). Videos over 3 hours occasionally time out — for very long content, try selecting a lower resolution like 480p to keep the file size manageable.' },
  { q: 'Is the video re-encoded or is it the original quality?', a: 'You get the original YouTube stream — no re-encoding, no quality loss beyond what YouTube already applied. The MP4 you download is essentially the same file YouTube serves to your browser when you watch in that resolution, just saved to disk instead of played in real time.' },
  { q: 'Do you store the videos I download or track my activity?', a: 'No. We do not save videos, do not log YouTube URLs, and do not track which clips you download. The conversion service generates a temporary signed URL valid for around 6 hours, and your browser downloads directly from a CDN. We never see or store your media.' },
  { q: 'Why download as MP4 instead of just watching online?', a: 'Common reasons: offline viewing on flights, commutes, or trips with no signal; archiving content you may need later (some videos get deleted or made private); editing clips for personal projects; converting to other formats; saving data on metered connections; and creating reliable backup copies of your own uploads.' },
];

const longContent = `The Free YouTube to MP4 Converter lets you download any YouTube video as a high-quality MP4 file in seconds, directly from your browser. There is nothing to install, no account to create, and no daily limit. Paste the link, choose your resolution, click Convert, and download. The whole process takes under a minute for most videos.

Why download YouTube videos as MP4? The use cases are practical and varied. Frequent travelers download tutorials, lectures, and entertainment for offline viewing on flights, trains, and trips through areas with poor connectivity. Students save lecture recordings and educational content from professors who upload to YouTube. Content creators archive their own uploads as backups in case something goes wrong with their channel. Editors grab royalty-free music videos and Creative Commons clips for use in their personal projects. Parents save kids' videos for screen time on long car rides without burning through mobile data. The MP4 format works in every video player on every device, so once downloaded it will always play.

This converter supports four standard resolutions, each optimized for a different use case. **360p** produces small files (typically 50-100 MB per hour of video) and is ideal for mobile data, slow connections, or when you only need to listen and the visual quality does not matter. **480p** is standard definition — good enough for older devices, in-car displays, and casual viewing on phones. **720p HD** is the most popular choice and represents the best balance between file size and quality for tutorials, vlogs, music videos, and most content people actually save. **1080p Full HD** delivers the sharpest quality and is recommended when you care about visual detail — music videos, sports highlights, gaming clips, art content, and tutorials where text or fine detail matters. Just remember 1080p files can be 5-10x larger than 360p, so check your storage before downloading long videos at maximum quality.

Behind the scenes, the converter uses a professional-grade YouTube extraction service that maintains rotating IP addresses and continuously updates its decoding routines to stay compatible with YouTube's frequent platform changes. About 95% of conversions succeed on the first try. The remaining 5% are typically rate-limit blocks that resolve immediately when you press "Try Again" — the request is routed through a different endpoint and almost always works on the second attempt. A small number of videos genuinely cannot be downloaded: private uploads, age-gated content (which requires user login), members-only content from channel memberships, copyright-blocked videos in certain regions, and active live streams. For live streams, wait until the broadcast ends and the video is archived as a regular YouTube clip.

YouTube Shorts are fully supported. Paste any youtube.com/shorts/ link and the converter handles the vertical 9:16 video format natively. Downloaded Shorts retain their original portrait orientation, making them ready for direct re-upload to TikTok, Instagram Reels, Snapchat, or any other vertical-video platform. This is one of the easiest ways to repurpose content across platforms when you have rights to the underlying video.

The downloaded MP4 file is **muxed** — meaning the video and audio tracks are already combined into a single file ready to play immediately. No need for separate ffmpeg merging steps or third-party muxers. The file plays in QuickTime, VLC, Windows Media Player, the iOS native player, the Android Photos app, Plex, Kodi, and every other modern video player without any conversion. You can also import it directly into video editors like iMovie, Final Cut Pro, DaVinci Resolve, Adobe Premiere, or CapCut.

The tool works on every modern browser: Chrome, Safari, Firefox, Edge, Brave, and Opera, on both desktop and mobile. On iPhone, MP4 downloads land in the Files app under the Downloads folder. To move them to Photos, open Files, long-press the video, and select "Save Video." On Android, MP4s go to the default Downloads folder where the gallery app picks them up automatically. On Windows, Mac, and Linux desktops, the MP4 saves to the browser's configured download location.

Privacy and security are core priorities. We do not store the videos you download, do not log the YouTube URLs you submit, and do not track which clips you grab. The conversion service generates a temporary signed download URL that is valid for approximately six hours and then expires automatically. Your browser downloads the MP4 directly from a content delivery network — the file never passes through our servers. We have no copy of your media at any point in the process.

A clear word on legality: downloading YouTube videos exists in a legal gray area that varies dramatically by content type and jurisdiction. Generally acceptable use cases include downloading Creative Commons licensed videos, royalty-free music videos, content explicitly marked as downloadable by the creator, your own uploaded videos, and personal fair-use copies in countries where this is permitted. Generally not acceptable: redistributing copyrighted videos publicly, selling downloaded content, using clips in monetized projects without rights, and removing watermarks or attribution from creator content. By using this tool you confirm that you have the appropriate rights to download and use the content for your specific purpose. We provide the technology; the responsibility for appropriate use rests with the user.

If you primarily need audio rather than video, check out our companion [YouTube to MP3 Converter](/converters/youtube-to-mp3/) instead — it produces smaller MP3 files perfect for music, podcasts, and audiobooks. If you need video plus audio in a single MP4, you are in the right place.

For most users the workflow is simple: copy the YouTube link, paste it here, pick 720p or 1080p, hit Convert, hit Download. Less than a minute from URL to MP4 on your device. No sign-up, no payment, no software install. That is the whole point of a good browser-based downloader.`;

export default function YouTubeToMp4Page() {
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
              { '@type': 'ListItem', position: 2, name: 'Converters', item: 'https://makersilo.com/converters/' },
              { '@type': 'ListItem', position: 3, name: 'YouTube to MP4 Converter', item: 'https://makersilo.com/converters/youtube-to-mp4/' },
            ],
          }),
        }}
      />

      <ToolSchema
        name="Free YouTube to MP4 Converter"
        description="Free YouTube to MP4 converter. Download YouTube videos as MP4 in 360p, 480p, 720p HD, or 1080p Full HD. Works with regular videos and Shorts. No software install required."
        url="https://makersilo.com/converters/youtube-to-mp4/"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Free YouTube to MP4 Converter
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
              Download any YouTube video as MP4 in HD or Full HD quality. Free, fast, works with regular videos and Shorts — no sign-up, no software install required.
            </p>

            <AdSlot position="above-tool" />

            <YouTubeToMp3Client defaultFormat="mp4" />

            <HowToUse keyword="YouTube to MP4 Converter" steps={steps} />
            <FAQSection faqs={faqs} keyword="YouTube to MP4 Converter" />
            <LongContent content={longContent} keyword="YouTube to MP4 Converter" />

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
