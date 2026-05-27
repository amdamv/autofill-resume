import React from 'react';
import { Sparkles } from 'lucide-react';

type Props = {
  savedResumesCount: number;
};

export default function Header({ savedResumesCount }: Props) {
  return (
    <header className="relative border-b border-[#1b1f38] bg-[#0c0d15]/80 backdrop-blur-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Sparkles className="text-white animate-pulse" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              CVlix
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/20">
                NestJS + Zustand
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Smart AI Resume Builder & Autofill Assistant
            </p>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-6 text-xs text-slate-400 border-l border-[#1e2344] pl-6 h-10 hidden md:flex">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">
              Генераций
            </span>
            <span className="text-white font-mono font-bold">
              {savedResumesCount} сгенерировано
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">
              Статус ИИ
            </span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Готов к автоподбору
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
