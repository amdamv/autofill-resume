import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type Props = {
  text: string;
  label?: string;
};

export default function CopyButton({ text, label }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-xs"
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
