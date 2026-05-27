import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0b0c13] border-t border-[#181c33] py-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          Для генерации идеальных резюме используется Claude API в связке с NestJS и Zustand.
        </p>
        <div className="flex gap-4">
          <span className="text-emerald-500/80 font-mono">✦ Экосистема Resume Autofiller</span>
          <span>2026 Developer Edition</span>
        </div>
      </div>
    </footer>
  );
}
