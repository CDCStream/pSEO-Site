/* ===== GEO: Enhanced Structured Data Schemas ===== */

/**
 * SoftwareApplication schema — enriched for AI search engines.
 * Removed fake aggregateRating (Google penalty risk).
 * Added: url, author, datePublished, browserRequirements, softwareVersion.
 */
export default function ToolSchema({ name, description, category, url }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: url || 'https://makersilo.com',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Works on Chrome, Firefox, Safari, Edge.',
    softwareVersion: '1.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Organization',
      name: 'MakerSilo',
      url: 'https://makersilo.com',
    },
    datePublished: '2025-01-01',
    inLanguage: 'en',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * ImageGallery schema for wallpaper/meme pages.
 */
export function ImageGallerySchema({ name, description, images }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name,
    description,
    image: images || [],
    author: {
      '@type': 'Organization',
      name: 'MakerSilo',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebPage schema with breadcrumb-ready structure.
 */
export function WebPageSchema({ title, description, url }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'MakerSilo',
      url: 'https://makersilo.com',
    },
    author: {
      '@type': 'Organization',
      name: 'MakerSilo',
    },
    inLanguage: 'en',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
