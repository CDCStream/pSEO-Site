import './globals.css';
import Script from 'next/script';
import { Outfit, JetBrains_Mono, Press_Start_2P } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';

const GA_MEASUREMENT_ID = 'G-EYQHD3FFHG';

// Optimized font loading with next/font - reduced weights for performance
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'], // Reduced from 6 to 4 weights
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'], // Reduced from 3 to 2 weights
  preload: false, // Don't preload mono font - not critical
});

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-minecraft',
  weight: '400',
  preload: false,
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
      className={`${outfit.variable} ${jetbrainsMono.variable} ${pressStart2P.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Analytics 4 */}
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
