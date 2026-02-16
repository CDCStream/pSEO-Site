import './globals.css';
import Script from 'next/script';
import { Outfit } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';

const GA_MEASUREMENT_ID = 'G-EYQHD3FFHG';
const AHREFS_KEY = 'uQBXFDRhKP8hiFHH08h4AQ';

// Only load the primary font - others loaded on demand
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
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
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MakerSilo - Free Online Tools for Creators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MakerSilo - Free Online Tools for Creators',
    description: 'Transform your text, create memes, find symbols, and generate beautiful wallpapers.',
    images: ['/og-image.png'],
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
      className={outfit.variable}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />

{/* Preconnect to analytics - lazy loaded */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//analytics.ahrefs.com" />


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

        {/* Ahrefs Web Analytics - Lazy loaded like GA */}
        <Script id="ahrefs-analytics" strategy="lazyOnload">
          {`
            function loadAhrefs() {
              if (window.ahrefsLoaded) return;
              window.ahrefsLoaded = true;

              var script = document.createElement('script');
              script.src = 'https://analytics.ahrefs.com/analytics.js';
              script.setAttribute('data-key', '${AHREFS_KEY}');
              script.async = true;
              document.head.appendChild(script);
            }

            // Load on first interaction
            ['scroll', 'click', 'touchstart', 'keydown'].forEach(function(event) {
              window.addEventListener(event, loadAhrefs, { once: true, passive: true });
            });

            // Fallback: load after 6 seconds (slightly after GA)
            setTimeout(loadAhrefs, 6000);
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
