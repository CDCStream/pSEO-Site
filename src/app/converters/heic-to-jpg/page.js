import HeicToJpgClient from './HeicToJpgClient';
import AdSlot from '@/components/AdSlot';
import FAQSection from '@/components/SEO/FAQSection';
import HowToUse from '@/components/SEO/HowToUse';
import LongContent from '@/components/SEO/LongContent';
import ToolSchema from '@/components/SEO/ToolSchema';
import { Upload, Sliders, Loader2, Download } from 'lucide-react';

export const metadata = {
  title: 'Free HEIC to JPG Converter Online - Batch & 100% Private | MakerSilo',
  description:
    'Convert HEIC and HEIF photos to JPG online for free. Batch conversion, quality slider, ZIP download. Runs entirely in your browser \u2014 no upload, no signup, no watermark.',
  keywords:
    'heic to jpg, heic to jpg converter, heic to jpeg, heif to jpg, convert heic to jpg, heic converter, iphone heic to jpg, free heic to jpg, batch heic to jpg, heic to jpg online, heic to jpg without upload, private heic converter',
  alternates: {
    canonical: 'https://makersilo.com/converters/heic-to-jpg/',
  },
  openGraph: {
    title: 'Free HEIC to JPG Converter Online - Batch & 100% Private',
    description:
      'Convert HEIC photos to JPG free in your browser. Batch supported, quality slider, ZIP download. No upload, no signup.',
    type: 'website',
    url: 'https://makersilo.com/converters/heic-to-jpg/',
    siteName: 'MakerSilo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free HEIC to JPG Converter Online',
    description:
      'Batch HEIC to JPG converter that runs 100% in your browser. Quality slider, ZIP download, no upload.',
  },
};

const steps = [
  {
    icon: Upload,
    title: 'Drop HEIC files',
    description:
      'Drag and drop HEIC or HEIF photos onto the upload area, or tap "Choose HEIC Files" to pick from your device. You can add as many as you want at once \u2014 a single iPhone burst, an entire camera roll, or just one photo.',
  },
  {
    icon: Sliders,
    title: 'Pick a quality',
    description:
      'Use the slider to balance file size against image quality. 92% (Recommended) is visually identical to the original for almost any use; 70% is great for messaging and email; 100% keeps every last pixel for printing.',
  },
  {
    icon: Loader2,
    title: 'Click Convert',
    description:
      'Press Convert to start. Each photo is decoded and re-encoded as JPG locally in your browser. Files never leave your device, so the conversion is private, instant, and works even on a slow or metered connection.',
  },
  {
    icon: Download,
    title: 'Download JPGs',
    description:
      'Save each JPG individually with the green Download button, or hit "Download ZIP" to grab everything in one archive. The output JPGs work in every photo app, every social network, every device, and every email client.',
  },
];

const faqs = [
  {
    q: 'What is a HEIC file and why does my iPhone save photos as HEIC?',
    a: 'HEIC (High Efficiency Image Container) is a file format Apple introduced in iOS 11 in 2017 as the default for iPhone and iPad photos. It is a container around HEIF / HEVC-encoded images and stores roughly the same image quality as JPG in about half the file size, which means more photos fit on your iPhone\u2019s storage and iCloud backups are smaller. The trade-off is that HEIC is not supported everywhere yet \u2014 most older Windows PCs, Android phones, web upload forms, and many social platforms still expect JPG, which is why you may need to convert.',
  },
  {
    q: 'Is the converter really free, with no signup or watermark?',
    a: 'Yes \u2014 100% free, no signup, no email, no credit card, no watermark, no daily limit, and no file count cap. The page is supported by the ads displayed alongside the converter, not by any kind of paywall or premium tier. You can drop in five photos or five hundred, convert them all, and download the JPGs without ever creating an account.',
  },
  {
    q: 'Are my photos uploaded to a server?',
    a: 'No. Conversion runs entirely in your browser using a JavaScript port of the libheif library that decodes HEIC into raw pixel data, then re-encodes those pixels as JPG using the browser\u2019s built-in canvas encoder. Your HEIC files never leave your device. We do not see them, we do not store them, and we cannot access them \u2014 there is literally no upload step. This makes the tool safe for personal photos, medical scans, sensitive screenshots, or any image you would not want to send to a stranger\u2019s server.',
  },
  {
    q: 'How do I convert HEIC to JPG on Windows 10 or Windows 11?',
    a: 'You do not need to install anything. Open this page in Chrome, Edge, or Firefox on your Windows PC, drop the HEIC files onto the upload area, click Convert, and download the JPGs \u2014 that is the entire process. The same flow works on macOS, Linux, ChromeOS, iOS, and Android. The Windows Photos app can also open HEIC files if you install the free HEIF Image Extension and the HEVC Video Extensions from the Microsoft Store, but converting to JPG is usually the simplest fix because JPG works in every Windows app without extensions.',
  },
  {
    q: 'How do I convert HEIC to JPG on iPhone or Android?',
    a: 'On iPhone, just open this page in Safari or Chrome, tap "Choose HEIC Files", select the photos from your Photos library, tap Convert, and tap each green Download button \u2014 the JPGs save to the Files app or are shareable to Photos. (As an alternative, you can change the iPhone default by going to Settings, Camera, Formats, and choosing "Most Compatible" so future photos save as JPG directly.) On Android, open the page in Chrome, pick the HEIC files from your file manager or Drive, convert, and download. Everything runs locally so it works the same on every modern phone.',
  },
  {
    q: 'Will the JPG quality be as good as the original HEIC?',
    a: 'At the recommended 92% quality setting, the JPG is visually indistinguishable from the original HEIC for almost any normal viewing situation \u2014 phone screens, social media, printing at standard sizes. JPG is a lossy format like HEIC, so there is technically a tiny amount of additional compression on top of HEIC\u2019s own compression, but you would have to zoom in on flat coloured areas pixel by pixel to spot it. If you need pixel-perfect output (for example, for archival or scientific work) set the slider to 100% and you will get a near-lossless JPG.',
  },
  {
    q: 'How big can the HEIC files be?',
    a: 'Up to 50 MB per file. That is enough for any iPhone or DSLR HEIC \u2014 a 48-megapixel iPhone 15 Pro Max ProRAW HEIC weighs about 25-35 MB, and a typical iPhone HEIC is 1-3 MB. There is no cap on the total size of your batch; you can convert dozens of 30 MB files in one go. If you have a single file larger than 50 MB (which is rare), drop us a message and we can lift the limit \u2014 it is mostly there to keep the browser tab responsive.',
  },
  {
    q: 'Does the converter handle Live Photos and HEIC sequences?',
    a: 'Live Photos are split by Apple into a HEIC still image plus a separate MOV video file. The converter handles the HEIC still and gives you the JPG of the keyframe \u2014 the same image you see when the Live Photo is paused. The motion (the MOV part) is not converted because it is a video file, not a HEIC. For multi-image HEIC files (HEIC sequences, like burst-mode shots stored in a single container) the converter outputs the first image. If you need every frame, we can add multi-frame export \u2014 let us know.',
  },
  {
    q: 'How is this different from iLoveIMG, FreeConvert, CloudConvert, or HEICtoJPG.com?',
    a: 'The biggest difference is that those services upload your HEIC photos to their servers for processing, then send the JPGs back. That makes them depend on your internet upload speed (slow on most home connections), bound by their server file-size and queue limits, and a privacy concern for personal photos. Our converter runs the entire decode+encode pipeline in your browser, so it is faster on slow connections, has no queue, has no per-file or per-day limits, and your photos never leave your device. The trade-off is that the first conversion takes a moment to load the HEIC decoder (~3 MB); after that everything is instant.',
  },
  {
    q: 'Which browsers does the converter work in?',
    a: 'Every modern browser: Chrome, Edge, Firefox, Safari, Brave, Opera, and Vivaldi, on desktop (Windows, macOS, Linux, ChromeOS) and mobile (iOS, Android). Internet Explorer is not supported because it lacks the modern JavaScript and Canvas APIs the converter needs. If you run into a browser-specific issue, switching to Chrome usually solves it.',
  },
];

const longContent = `The Free HEIC to JPG Converter is the fastest, most private way to turn iPhone and iPad photos into universally compatible JPG files. Drag in one HEIC, a hundred HEICs, or your entire camera roll, pick a quality preset, and download either each JPG individually or all of them in a single ZIP. Conversion happens entirely in your browser using a JavaScript port of the open-source libheif library, which means your photos never leave your device, the tool works the same on every operating system, and there is no upload step to slow you down or worry about.

HEIC, short for High Efficiency Image Container, has been the default photo format on iPhone and iPad since iOS 11 launched in 2017. It is a wrapper around an HEVC-encoded still image, and at the same visual quality it stores roughly half the bytes of a JPG, which is why Apple adopted it: more photos fit on your phone, iCloud backups are smaller, and AirDropping a photo is faster. The catch is that HEIC is still not supported everywhere. Many older Windows PCs cannot open .heic files without installing extensions, plenty of Android phones reject HEIC uploads, most printing services and photo kiosks expect JPG, web upload forms on banking, government, and job application sites usually only accept JPG or PNG, and almost every email client and chat app handles JPG more reliably than HEIC. Converting an iPhone HEIC photo to a JPG is the simplest universal fix.

The way the converter works under the hood is worth understanding because it is what makes it different from every server-based tool you have probably tried. When you drop a HEIC file onto the page, the file stays on your machine. The page lazy-loads a small WebAssembly build of libheif, which is the reference decoder maintained by the German Fraunhofer Institute and used in everything from Apple Photos to professional video pipelines. libheif decodes the HEIC into raw RGB pixel data right inside your browser tab. The browser\u2019s built-in canvas API then re-encodes those pixels as a JPG at the quality you chose. The resulting JPG Blob is offered to you as a download \u2014 again, never leaving your device. This is the same approach used by tools like the official photopea.com online editor and by privacy-focused open-source projects, and it has three big advantages over server-based converters: it is private (no photo upload), it has no queue or rate limit (no shared backend), and it is faster on slow connections (no upload time, no download time, just the actual decode and encode).

Quality control is straightforward. The slider goes from 50% to 100%. The 92% Recommended preset is the sweet spot for almost every use case \u2014 the resulting JPG is visually indistinguishable from the original HEIC at normal viewing sizes, and the file size is typically about the same as the source HEIC or a touch smaller. The 70% Compact preset cuts file sizes roughly in half again at the cost of very slight compression artefacts in flat colour areas, which is perfect for messaging, email, and uploading dozens of photos to a website with file size limits. The 100% Maximum preset preserves every detail of the source image and produces JPGs that are about 30-50% bigger than the recommended setting; pick this when you intend to print at large sizes, edit further in Photoshop, or archive the files long-term. The slider gives you full granular control between those presets if you want to fine-tune.

Batch conversion is a first-class feature, not a paid upgrade. Drop in twenty photos, click Convert, and the converter processes them one at a time \u2014 sequential rather than parallel because parallel HEIC decoding inside a single browser tab can exhaust available memory on lower-end phones and laptops. Each row in the file list shows the input size, the output size when conversion finishes, and a download button for that specific JPG. When more than one file has converted, a "Download ZIP" button appears at the top of the list, which packages all of the converted JPGs into a single ZIP archive using the JSZip library, again entirely in your browser. The ZIP uses no compression on top of the JPG (JPG is already compressed) so it is fast to build even with hundreds of photos.

The converter handles every variant of HEIC and HEIF you are likely to encounter. Standard iPhone HEIC stills convert one-to-one to JPGs at the same resolution. Live Photos \u2014 which Apple stores as a HEIC still plus a separate MOV video file \u2014 produce a JPG of the still frame, which is the keyframe you see when the Live Photo is paused. HDR HEIC photos taken on iPhone 12 and newer have their HDR metadata gracefully stripped on conversion, since standard JPG cannot carry HDR; the brightness range is mapped sensibly to standard dynamic range. Multi-image HEIC sequences (HEIC files containing multiple frames, like burst-mode shots stored in a single container) currently produce one JPG of the primary image; if you need all frames as separate JPGs let us know and we can add multi-frame export. HEIF files using the .heif extension instead of .heic are treated identically; both extensions wrap the same underlying format.

The privacy story is the single biggest reason to use a browser-based converter rather than a server-based one. Your photos can include your face, your kids\u2019 faces, your home, your location metadata, your medical scans, sensitive document scans, screenshots of private chats, identification documents, and a thousand other things you do not want to upload to a stranger\u2019s server. Every server-based HEIC converter \u2014 even the well-known ones like iLoveIMG, FreeConvert, CloudConvert, and heictojpg.com \u2014 receives a copy of your photo. They claim to delete files after a few hours and they probably do, but the trust is implicit and the upload happens regardless. With our converter the entire pipeline is local: drop, decode, re-encode, download. There is no upload, no temporary file on a remote disk, and no log of what you converted. We see only the page request itself \u2014 the same thing every web page sees \u2014 not the contents of your photos.

The technical performance on a modern device is also worth noting. A typical iPhone HEIC at about 2 MB converts to JPG in roughly 200-400 milliseconds on a 2020-or-newer phone or laptop. The first conversion takes a little longer because the libheif WebAssembly module needs to download (~3 MB once, then cached for the rest of the session) and warm up. A batch of fifty photos completes in under a minute on most hardware. On older phones or low-end laptops, large 48-megapixel ProRAW HEICs can take 1-2 seconds each, but they still finish without freezing the page because the conversion runs off the main thread.

Compared with the headline alternatives \u2014 iLoveIMG, FreeConvert.com, CloudConvert, and heictojpg.com \u2014 the most important practical differences are: zero upload time on slow connections, no per-file or per-day caps, no signup or account, no watermark, batch and ZIP support included for free rather than paywalled, full privacy because the file never leaves your device, and quality control via a smooth 50-100% slider rather than a fixed "recommended/high" toggle. The trade-off, as mentioned, is the one-time ~3 MB decoder download on the first conversion of a session.

Whichever device you are on \u2014 a Windows 10 or Windows 11 desktop, a Mac, a Linux box, an iPhone, an iPad, an Android phone, a Chromebook, or a Kindle Fire \u2014 the workflow is identical: open this page in any modern browser, drop in HEIC files, pick a quality, click Convert, download. No installs, no subscriptions, no privacy worries. If you are doing a one-off conversion of a single iPhone photo for an email, batch-converting a wedding shoot for upload, or migrating an entire iCloud archive into a portable JPG library, this is the converter you want bookmarked.`;

export default function HeicToJpgPage() {
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
              { '@type': 'ListItem', position: 3, name: 'HEIC to JPG Converter', item: 'https://makersilo.com/converters/heic-to-jpg/' },
            ],
          }),
        }}
      />

      <ToolSchema
        name="HEIC to JPG Converter"
        description="Free HEIC and HEIF to JPG converter. Batch conversion, quality slider, ZIP download \u2014 100% client-side, no upload."
        category="ImageConverter"
        url="https://makersilo.com/converters/heic-to-jpg/"
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/converters/" className="hover:text-white transition-colors">Converters</a>
            <span>/</span>
            <span className="text-gray-300">HEIC to JPG</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Free HEIC to JPG Converter
            </h1>
            <p className="text-lg text-gray-400">
              Convert iPhone and iPad HEIC / HEIF photos to JPG online \u2014 batch supported, quality slider, ZIP download. Runs entirely in your browser, so your photos never leave your device.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <AdSlot position="above-tool" />

            <HeicToJpgClient />

            <HowToUse keyword="HEIC to JPG Converter" steps={steps} />
            <FAQSection faqs={faqs} keyword="HEIC to JPG Converter" />
            <LongContent content={longContent} keyword="HEIC to JPG Converter" />

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
