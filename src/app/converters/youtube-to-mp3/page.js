import YouTubeToMp3Client from './YouTubeToMp3Client';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Link2, Settings, Download, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Free YouTube to MP3 Converter - Download Audio & Video | MakerSilo',
  description: 'Free YouTube to MP3 and MP4 converter. Paste any YouTube link and download high-quality audio (128/192/320 kbps) or video (360p-1080p). Fast, no sign-up, no software install.',
  keywords: 'youtube to mp3, youtube to mp3 converter, youtube mp3 download, free youtube downloader, youtube to mp4, yt to mp3, youtube audio download, mp3 from youtube, youtube mp3 320kbps, online youtube converter',
  openGraph: {
    title: 'Free YouTube to MP3 Converter - Download Audio & Video',
    description: 'Convert YouTube videos to MP3 audio or MP4 video. Free, fast, no software install.',
    type: 'website',
  },
};

const steps = [
  { icon: Link2, title: 'Paste YouTube URL', description: 'Copy any YouTube video, Shorts, or youtu.be link and paste it into the input box. The thumbnail preview confirms the video instantly.' },
  { icon: Settings, title: 'Choose Format & Quality', description: 'Select MP3 (audio) or MP4 (video). Pick your preferred quality: 128/192/320 kbps for audio or up to 1080p Full HD for video.' },
  { icon: Download, title: 'Click Convert', description: 'Press the Convert button. Our service fetches the file from YouTube in 5-15 seconds. If YouTube briefly blocks the request, just hit "Try Again".' },
  { icon: CheckCircle2, title: 'Download Your File', description: 'Click the green Download button to save the file to your device. The download link works on mobile and desktop browsers without installing any app.' },
];

const faqs = [
  { q: 'Is this YouTube to MP3 converter really free?', a: 'Yes, completely free. No sign-up, no account, no credit card required. There are no daily download limits for users. The tool is supported by ads on the page so we can keep it free for everyone.' },
  { q: 'What audio quality can I download?', a: 'You can choose between three MP3 audio qualities: 128 kbps (standard, smallest file size), 192 kbps (high quality, good balance), and 320 kbps (best quality, larger file). 320 kbps is recommended for music if storage is not a concern. 128 kbps is fine for podcasts and spoken content.' },
  { q: 'Can I download YouTube videos as MP4?', a: 'Yes. Switch the format toggle to MP4 and choose your desired video quality: 360p, 480p, 720p HD, or 1080p Full HD. The MP4 file includes both video and audio in a single downloadable file.' },
  { q: 'Why does the conversion sometimes fail?', a: 'YouTube occasionally blocks automated download requests to protect their service. About 5% of requests may fail on the first try. When this happens, simply click the "Try Again" button — the request will be retried with a different route and usually succeeds. Some videos are also blocked for download by the uploader (private, age-restricted, region-locked, or premieres) and cannot be converted.' },
  { q: 'Does this work on mobile (iPhone, Android)?', a: 'Yes. The tool runs entirely in your browser, so it works on iPhone Safari, Android Chrome, iPads, and any modern mobile browser. No app install needed. On iOS, downloads save to the Files app; on Android, they save to your Downloads folder by default.' },
  { q: 'Is downloading YouTube videos legal?', a: 'It depends on the content and your jurisdiction. Downloading is generally permitted for: Creative Commons licensed videos, royalty-free content, your own uploads, content explicitly marked for download, and personal fair-use copies in many countries. It is NOT permitted to redistribute copyrighted music or videos without rights. By using this tool you confirm you have the right to download the content.' },
  { q: 'Are there any limits on video length?', a: 'Most videos under 60 minutes work without issues. Very long videos (2+ hours) may take longer to convert or occasionally time out. Live streams cannot be downloaded while live, but archived live streams work normally after they end.' },
  { q: 'Do you save the videos I download?', a: 'No. We do not store videos, audio files, or download history on our servers. Your YouTube URL is sent to a conversion service that returns a temporary download link (valid for ~6 hours), and your browser downloads the file directly from a CDN. We have zero copies of any media.' },
  { q: 'How is this different from desktop apps like 4K Video Downloader?', a: 'Desktop apps like 4K Video Downloader, JDownloader, or yt-dlp are more powerful for batch downloads, playlists, and offline reliability — but they require installation and updates. Our tool is best for quick, one-off conversions you can do from any browser without installing anything. For power users who download dozens of videos a day, a desktop app is more efficient.' },
  { q: 'Why do you offer MP3 quality up to 320 kbps when YouTube audio is often 128 kbps?', a: 'Honest answer: YouTube\'s source audio is often 128 kbps AAC. When we re-encode at 320 kbps MP3, the file is bigger but does not contain more actual audio detail than the source. Choose 192 kbps as the best balance for most use cases. 320 kbps is offered for users who specifically want the largest possible file or are archiving for re-encoding.' },
];

const longContent = `The Free YouTube to MP3 Converter is a fast, browser-based tool that lets you turn any YouTube video into a downloadable MP3 audio file or MP4 video file. There is no software to install, no account to create, and no daily limit. Just paste the YouTube URL, choose your format and quality, and download. The entire process runs in your browser and takes between 5 and 15 seconds for most videos.

People convert YouTube videos to MP3 for many reasons: building offline playlists for the gym or commute, extracting audio from interviews and podcasts to listen to in the car, archiving Creative Commons music for personal use, saving language-learning audio for offline practice, capturing voiceovers and narration for use in personal projects, and downloading lectures or audiobooks made available by their authors. The MP4 format is useful when you need both video and audio — for example, when you want to watch a tutorial offline on a flight, save a music video for personal viewing, or download a clip you have rights to use.

Our tool supports the three most common audio bitrates. 128 kbps MP3 produces the smallest files and is more than enough for spoken content like podcasts, audiobooks, lectures, and interviews. 192 kbps is the sweet spot for most music — it sounds essentially indistinguishable from higher bitrates to most listeners and keeps file sizes reasonable. 320 kbps is the highest standard MP3 bitrate and produces the largest files, which some audiophiles and archivists prefer. For video downloads, you can choose 360p (small file, low quality), 480p (standard definition), 720p (HD), or 1080p (Full HD). The 1080p option is recommended for music videos and tutorials where image clarity matters; 720p is plenty for most casual viewing.

Behind the scenes, the converter uses a professional YouTube extraction service that handles the technical complexity of fetching, decoding, and re-encoding video and audio streams. This service maintains rotating IP pools and updated extraction routines to keep up with YouTube\'s frequent platform changes. Most requests succeed on the first try; about 5% may fail temporarily due to YouTube\'s rate limiting or geographic restrictions. When this happens, the "Try Again" button retries the request through a different route and usually succeeds. Some videos cannot be downloaded at all — these include private videos, members-only content, age-restricted videos requiring login, and active live streams.

The tool works on every modern browser, including Chrome, Safari, Firefox, and Edge, on both desktop and mobile devices. On iPhone, downloaded files are saved to the Files app under the Downloads folder. On Android, they go to your default Downloads folder. On desktop, the file goes wherever your browser is configured to save downloads. Once downloaded, MP3 files play in any music app (Apple Music, Spotify\'s local files feature, VLC, Winamp, etc.) and MP4 files play in any video app or media player.

Privacy is a priority. We do not store the videos you convert, we do not log your YouTube URLs, and we do not track which downloads you make. The conversion service generates a temporary signed download URL valid for about six hours, after which the link expires automatically. Your browser downloads the file directly from a content delivery network, never passing through our servers. We have no copy of your media at any point.

A note on legality: downloading YouTube videos exists in a gray area that depends heavily on the content and your country\'s copyright laws. It is generally fine to download Creative Commons licensed videos, royalty-free music, your own uploads, content marked for offline use, and personal fair-use copies in many jurisdictions. It is not okay to redistribute copyrighted commercial music, sell downloaded content, or use it in ways the rights holders prohibit. By using this tool you confirm that you have the right to download and use the content for your intended purpose. We provide the technology; responsibility for appropriate use rests with the user.

Compared to installing desktop applications like yt-dlp, 4K Video Downloader, or JDownloader, the browser-based approach has trade-offs. Desktop apps are faster for batch downloads (entire playlists or channels), more reliable when YouTube changes its protocols, and capable of downloading 4K and 8K video that exceeds typical browser limits. The browser-based tool — this one — wins on convenience: no installation, no updates, works on phones and Chromebooks, and good enough for the casual user who occasionally needs to grab a single MP3 or video. Choose the right tool for your use case.

For most users, the workflow is simple: copy a YouTube link, paste it here, hit Convert, hit Download, done. Less than a minute from URL to file on your device. No sign-up, no payment, no software install. That is the whole point.`;

export default function YouTubeToMp3Page() {
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
              { '@type': 'ListItem', position: 3, name: 'YouTube to MP3 Converter', item: 'https://makersilo.com/converters/youtube-to-mp3/' },
            ],
          }),
        }}
      />

      <ToolSchema
        name="Free YouTube to MP3 Converter"
        description="Free YouTube to MP3 and MP4 converter. Download YouTube videos as high-quality audio (128/192/320 kbps) or video (up to 1080p) in seconds, without installing any software."
        url="https://makersilo.com/converters/youtube-to-mp3/"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Free YouTube to MP3 Converter
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
              Convert YouTube videos to MP3 audio or MP4 video in seconds. Free, fast, and works on every device — no sign-up, no software install required.
            </p>

            <AdSlot position="above-tool" />

            <YouTubeToMp3Client />

            <HowToUse keyword="YouTube to MP3 Converter" steps={steps} />
            <FAQSection faqs={faqs} keyword="YouTube to MP3 Converter" />
            <LongContent content={longContent} keyword="YouTube to MP3 Converter" />

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
