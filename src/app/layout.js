import './globals.css';
import Script from 'next/script';
import { Outfit, JetBrains_Mono, Press_Start_2P } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';

const GA_MEASUREMENT_ID = 'G-EYQHD3FFHG';

// Optimized font loading - only essential weights
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '600', '700'], // Only 3 weights for better performance
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// Mono font - lazy loaded, not critical for initial render
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400'],
  preload: false,
  fallback: ['monospace'],
});

// Minecraft font - lazy loaded, only used on specific pages
const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-minecraft',
  weight: '400',
  preload: false,
  fallback: ['monospace'],
});

export const metadata = {
  title: 'MakerSilo - Free Online Tools for Creators',
  description: 'Transform your text, create memes, find symbols, and generate beautiful wallpapers. Free online tools with instant copy-paste functionality.',
  keywords: 'text generator, meme maker, symbols copy paste, wallpaper generator, online tools',
  authors: [{ name: 'MakerSilo' }],
  creator: 'MakerSilo',
  metadataBase: new URL('https://makersilo.com'),
  openGraph: {
    title: 'MakerSilo - Free Online Tools for Creators',
    description: 'Transform your text, create memes, find symbols, and generate beautiful wallpapers.',
    url: 'https://makersilo.com',
    siteName: 'MakerSilo',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/logo.png',
        alt: 'MakerSilo - Free Online Tools for Creators',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'MakerSilo - Free Online Tools for Creators',
    description: 'Transform your text, create memes, find symbols, and generate beautiful wallpapers.',
    images: ['/logo.png'],
    creator: '@makersilo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

// Viewport configuration for mobile optimization
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0b',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} ${pressStart2P.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />

{/* Preconnect to Google Analytics - lazy loaded */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Preload critical font for faster LCP */}
        <link
          rel="preload"
          href="/_next/static/media/1b99372b3eaef0c8.p.758e15a8.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Google Analytics 4 - Load after user interaction for better mobile performance */}
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            // Delay GA until user interacts or after 5 seconds
            function loadGA() {
              if (window.gaLoaded) return;
              window.gaLoaded = true;

              var script = document.createElement('script');
              script.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
              script.async = true;
              document.head.appendChild(script);

              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            }

            // Load on first interaction
            ['scroll', 'click', 'touchstart', 'keydown'].forEach(function(event) {
              window.addEventListener(event, loadGA, { once: true, passive: true });
            });

            // Fallback: load after 5 seconds
            setTimeout(loadGA, 5000);
          `}
        </Script>
      </head>
      <body
        className={`${outfit.className} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
