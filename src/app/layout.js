import './globals.css';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';

// Optimized font loading with next/font
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  preload: true,
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MakerSilo - Free Online Tools for Creators',
    description: 'Transform your text, create memes, find symbols, and generate beautiful wallpapers.',
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
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
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
