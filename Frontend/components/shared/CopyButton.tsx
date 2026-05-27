import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';

type Props = {
  text: string;
  label?: string;
};

export default function CopyButton({ text, label }: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      setCopied(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={copy}
      className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {copied ? (
        <Check size={12} className="text-emerald-400" />
      ) : (
        <Copy size={12} />
      )}
      <span className="text-[10px]">{copied ? 'Copied' : label || 'Copy'}</span>
    </button>
  );
}
