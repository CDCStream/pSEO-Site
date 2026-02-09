import './globals.css';
import Script from 'next/script';
import { Outfit } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';

const GA_MEASUREMENT_ID = 'G-EYQHD3FFHG';

/* ===== GEO: Organization + Person JSON-LD (E-E-A-T) ===== */
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MakerSilo',
  url: 'https://makersilo.com',
  logo: 'https://makersilo.com/logo.png',
  description: 'Free online tools for creators — text generators, meme makers, wallpaper creators, and AI-powered name generators.',
  sameAs: ['https://blog.makersilo.com'],
  foundingDate: '2025',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: 'https://makersilo.com',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'MakerSilo Team',
  url: 'https://makersilo.com',
  jobTitle: 'Full-Stack Developer & Creator',
  worksFor: {
    '@type': 'Organization',
    name: 'MakerSilo',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MakerSilo',
  url: 'https://makersilo.com',
  description: 'Free online tools for creators. Transform text, create memes, copy symbols, and generate wallpapers.',
  publisher: { '@type': 'Organization', name: 'MakerSilo' },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://makersilo.com/tools?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

// Minimal font loading for better performance
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '700'],
  preload: false,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
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

        {/* GEO: Organization + Person + WebSite JSON-LD for E-E-A-T */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Preconnect to Google Analytics - lazy loaded */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />


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
