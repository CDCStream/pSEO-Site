'use client';

// AdSlot component placeholder for Google AdSense integration
// Replace the placeholder content with actual AdSense code when ready

export default function AdSlot({ position = 'inline', className = '' }) {
  const positionStyles = {
    'above-tool': 'w-full h-24 mb-6',
    'sidebar': 'w-full h-[600px] sticky top-20',
    'below-content': 'w-full h-32 mt-8',
    'inline': 'w-full h-24 my-6',
  };

  return (
    <div
      className={`
        ${positionStyles[position]}
        ${className}
        bg-gradient-to-r from-gray-800/30 to-gray-700/30
        rounded-xl border border-white/5
        flex items-center justify-center
        overflow-hidden
      `}
      data-ad-slot={position}
      aria-label="Advertisement"
    >
      {/* Placeholder content - Replace with actual AdSense code */}
      <div className="text-center text-gray-500">
        <p className="text-xs uppercase tracking-wider mb-1">Advertisement</p>
        <p className="text-[10px]">Ad content will appear here</p>
      </div>

      {/*
        AdSense Integration Instructions:

        1. Sign up for Google AdSense at https://www.google.com/adsense/
        2. Get your AdSense client ID (format: ca-pub-XXXXXXXXXXXXXXXX)
        3. Add the AdSense script to your layout.js:
           <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
        4. Replace this placeholder with AdSense ad unit code:
           <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"
                data-ad-format="auto"
                data-full-width-responsive="true" />
           <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      */}
    </div>
  );
}

// Sticky sidebar ad component
export function SidebarAd() {
  return (
    <div className="hidden xl:block w-[300px] shrink-0">
      <AdSlot position="sidebar" />
    </div>
  );
}


