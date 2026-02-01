# TextForge - Programmatic SEO Utility Website

A high-performance Programmatic SEO (pSEO) utility website built with Next.js 14 (App Router), Tailwind CSS, and Lucide React. Optimized for GitHub-to-Vercel deployment and 100% Google AdSense compliance.

## 🚀 Features

### 4 Tool Categories

1. **Text Tools** (`/tools/[slug]`)
   - Small Text Generator
   - Glitch Text Generator
   - Tiny Text Generator
   - Strikethrough Text
   - Morse Code Generator
   - Text to Binary
   - Gothic Font
   - Bubble Font
   - Minecraft Font

2. **Symbols** (`/symbols/[slug]`)
   - Music Symbols
   - Religious Symbols
   - Inequality Symbols
   - Japanese Symbols
   - Heart Symbols
   - Kaomoji List

3. **Meme Maker** (`/meme-maker/[slug]`)
   - Drake Meme
   - Speech Bubble Meme
   - Bernie Sanders Meme
   - Change My Mind Meme

4. **Wallpapers** (`/wallpapers/[slug]`)
   - Christmas Wallpaper
   - Preppy Wallpaper
   - Hello Kitty Wallpaper
   - Aesthetic Wallpaper
   - Solid Color Backgrounds
   - Gradient Wallpaper Generator

### Technical Features

- ✅ **Zero Backend** - All logic runs client-side (Unicode mapping, Canvas API)
- ✅ **One-Click Copy** - Robust clipboard functionality with toast notifications
- ✅ **Download as PNG** - Export memes and wallpapers instantly
- ✅ **Static Generation (SSG)** - Pre-rendered pages for instant loading
- ✅ **AdSense Ready** - Reserved ad slots (above tool, sidebar, below content)
- ✅ **SEO Optimized** - Dynamic meta tags, JSON-LD schemas, FAQ sections

### SEO Features (Per Page)

- Dynamic meta titles and descriptions
- 4-step "How to Use" guide with HowTo schema
- FAQ section with FAQPage JSON-LD schema
- 300+ word SEO-optimized content
- SoftwareApplication schema for tools
- ImageGallery schema for wallpapers

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.js          # Root layout with nav/footer
│   ├── page.js             # Homepage
│   ├── sitemap.js          # Dynamic sitemap
│   ├── robots.js           # Robots.txt config
│   ├── tools/
│   │   ├── page.js         # Tools category page
│   │   └── [slug]/         # Dynamic tool pages
│   ├── symbols/
│   │   ├── page.js
│   │   └── [slug]/
│   ├── meme-maker/
│   │   ├── page.js
│   │   └── [slug]/
│   └── wallpapers/
│       ├── page.js
│       └── [slug]/
├── components/
│   ├── Navigation.js
│   ├── Footer.js
│   ├── Toast.js
│   ├── AdSlot.js
│   ├── CopyButton.js
│   ├── DownloadButton.js
│   └── SEO/
│       ├── FAQSection.js
│       ├── HowToUse.js
│       ├── LongContent.js
│       └── ToolSchema.js
└── config/
    └── pSEO-data.js        # All tool/page configurations
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

No environment variables required for basic functionality.

For AdSense integration, update `src/components/AdSlot.js` with your AdSense client ID.

## 🚢 Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

The project is configured for static export with `output: 'export'` in `next.config.js`.

## 💰 AdSense Integration

The project includes placeholder AdSlot components. To enable ads:

1. Sign up for Google AdSense
2. Get your AdSense client ID (`ca-pub-XXXXXXXXXXXXXXXX`)
3. Add the AdSense script to `src/app/layout.js`
4. Update `src/components/AdSlot.js` with your ad unit codes

## 📊 SEO Checklist

- [x] Dynamic meta tags per page
- [x] Structured data (JSON-LD schemas)
- [x] XML Sitemap generation
- [x] Robots.txt configuration
- [x] FAQ sections with FAQ schema
- [x] HowTo schema for instructions
- [x] SoftwareApplication schema for tools
- [x] ImageGallery schema for wallpapers
- [x] Long-form content (300+ words per page)
- [x] Internal linking structure

## 🎨 Customization

### Adding New Tools

1. Add configuration to `src/config/pSEO-data.js`:
   - Add to appropriate config object (toolsConfig, symbolsConfig, etc.)
   - Include: name, keyword, title, description, FAQ, longContent

2. Add transformation logic (if needed) to the client component

3. The page will automatically be generated via the dynamic route

### Styling

- Tailwind CSS configuration in `tailwind.config.js`
- Global styles in `src/app/globals.css`
- Custom color palette and animations included

## 📝 License

MIT License - feel free to use this project for your own pSEO sites!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ using Next.js, Tailwind CSS, and Lucide React


