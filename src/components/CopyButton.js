'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

export default function CopyButton({
  text,
  className = '',
  variant = 'primary',
  label = 'Copy',
  successLabel = 'Copied!',
  showLabel = true,
  size = 'md'
}) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      addToast('Copied to clipboard!', 'success');

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      addToast('Failed to copy', 'error');
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
    ghost: `
      hover:bg-white/10 text-gray-400 hover:text-white
    `,
    success: `
      bg-green-500/20 text-green-400 border border-green-500/30
    `,
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={handleCopy}
      disabled={copied}
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${copied ? variantClasses.success : variantClasses[variant]}
        rounded-lg font-medium transition-all duration-200
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {copied ? (
        <>
          <Check className={iconSizes[size]} />
          {showLabel && successLabel}
        </>
      ) : (
        <>
          <Copy className={iconSizes[size]} />
          {showLabel && label}
        </>
      )}
    </button>
  );
}

// Quick copy wrapper for symbols and small text items
export function QuickCopy({ children, text, className = '' }) {
  const { addToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(`Copied: ${text}`, 'success');
    } catch (err) {
      addToast('Failed to copy', 'error');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center justify-center
        px-3 py-2 rounded-lg
        bg-white/5 hover:bg-white/10
        border border-white/10 hover:border-orange-500/50
        transition-all duration-200
        hover:scale-105 active:scale-95
        cursor-pointer group
        ${className}
      `}
      title="Click to copy"
    >
      {children}
      <Copy className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
    </button>
  );
}

