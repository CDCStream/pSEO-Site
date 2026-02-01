'use client';

import { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { useToast } from './Toast';

export default function DownloadButton({
  canvasRef,
  filename = 'download.png',
  className = '',
  variant = 'primary',
  label = 'Download PNG',
  size = 'md'
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const { addToast } = useToast();

  const handleDownload = async () => {
    if (!canvasRef?.current) {
      addToast('Nothing to download', 'error');
      return;
    }

    setDownloading(true);

    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloaded(true);
      addToast('Download started!', 'success');

      setTimeout(() => {
        setDownloaded(false);
      }, 2000);
    } catch (err) {
      addToast('Failed to download', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-orange-500 to-amber-500
      hover:from-orange-400 hover:to-amber-400
      text-white font-semibold shadow-lg shadow-orange-500/25
      hover:shadow-orange-500/40 hover:-translate-y-0.5
    `,
    secondary: `
      bg-white/10 hover:bg-white/20
      text-white border border-white/20 hover:border-white/30
    `,
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${downloaded ? 'bg-green-500/20 text-green-400 border border-green-500/30' : variantClasses[variant]}
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {downloading ? (
        <>
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
          Processing...
        </>
      ) : downloaded ? (
        <>
          <Check className={iconSizes[size]} />
          Downloaded!
        </>
      ) : (
        <>
          <Download className={iconSizes[size]} />
          {label}
        </>
      )}
    </button>
  );
}

