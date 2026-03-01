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
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      </head>
      <body
        className={`${outfit.className} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        {/* GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        {/* Ahrefs Web Analytics */}
        <Script id="ahrefs-analytics" strategy="afterInteractive">
          {`
            var s = document.createElement('script');
            s.src = 'https://analytics.ahrefs.com/analytics.js';
            s.setAttribute('data-key', 'uQBXFDRhKP8hiFHH08h4AQ');
            s.async = true;
            document.head.appendChild(s);
          `}
        </Script>

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
