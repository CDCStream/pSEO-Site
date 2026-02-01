import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="text-8xl font-bold text-gradient mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/tools"
            className="btn-secondary px-6 py-3 rounded-xl inline-flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Browse Tools
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Link href="/tools" className="text-gray-400 hover:text-white transition-colors">Text Tools</Link>
          <Link href="/symbols" className="text-gray-400 hover:text-white transition-colors">Symbols</Link>
          <Link href="/meme-maker" className="text-gray-400 hover:text-white transition-colors">Meme Maker</Link>
          <Link href="/wallpapers" className="text-gray-400 hover:text-white transition-colors">Wallpapers</Link>
        </div>
      </div>
    </div>
  );
}

